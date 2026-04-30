#!/usr/bin/env python3
"""
Run a code-review pass with provider fallback.

The Codex consistency review is the project's single sanity-check before a
PR auto-merges. When OpenAI is unavailable (no key, 429 quota, transient
HTTP failure) we still want *some* second-opinion review rather than
silently shipping unreviewed code, so this helper walks a small ladder:

    1.  OpenAI gpt-5.5 / OPENAI_API_KEY         — free tier (preferred)
    1b. OpenAI gpt-5.5 / OPENAI_API_KEY_BACKUP  — paid account, used when
        the free primary 429s; falling back keeps the maker-checker
        boundary on OpenAI
    2.  Gemini 2.5 Pro                          — try first within the
        Gemini leg: stronger model, ~50 RPD free tier covers our PR
        cadence with headroom
    2b. Gemini 2.5 Flash                        — same key, higher
        quota (500 RPD); used when Pro 429s
    3.  GitHub Models (Llama-3.3-70b)           — uses existing
        GITHUB_TOKEN; independent rate-limit pool from OpenAI / Gemini
        so this leg covers the simultaneous-outage case the prior
        ladder defered on. Falls through to gpt-4.1-mini within the
        leg on 429.
    4.  OpenRouter free models                  — DeepSeek R1 (reasoning)
        first, Qwen3 Coder second on the same key. Yet another
        independent rate-limit pool.
    5.  defer (label PR `review-deferred`)      — last resort

Why these two providers and not three? The triage / plan / execute ladders
already use Claude, so using Claude here too would defeat the point of an
"independent second opinion" (maker-checker). OpenAI and Gemini are the
only non-Claude options in the project; if both are down the run defers
cleanly.

Inputs (env):
    PROMPT_FILE             path to a file containing the full review prompt
    OPENAI_API_KEY          optional; tried first when set. On this repo
                            this is the free-tier ChatGPT account (low
                            quota), so 429s are common.
    OPENAI_API_KEY_BACKUP   optional; tried after OPENAI_API_KEY on
                            429/error. On this repo this is the paid
                            account — kept as the backup so the bill
                            only grows when the free tier is exhausted.
    GEMINI_API_KEY          optional; Gemini attempted only when set.
                            Same key drives both Pro and Flash models.
    OPENAI_MODEL            default: gpt-5.5
    GEMINI_PRO_MODEL        default: gemini-2.5-pro (tried first within
                            the Gemini leg — better reasoning, smaller
                            free quota)
    GEMINI_FLASH_MODEL      default: gemini-2.5-flash (tried after Pro
                            429s within the Gemini leg — bigger free
                            quota, kept as the unconstrained fallback)
    GEMINI_MODEL            DEPRECATED: still honoured for back-compat,
                            but if set it is treated as the Pro slot.
                            New code should use the two split variables.
    GITHUB_TOKEN            optional; when set, GitHub Models leg fires.
                            The repo's standard GITHUB_TOKEN already
                            works — no new secret needed.
    GITHUB_MODELS_PRIMARY   default: meta/Llama-3.3-70B-Instruct
    GITHUB_MODELS_FALLBACK  default: openai/gpt-4.1-mini (intentionally
                            a different model family from the OpenAI leg
                            so a model-specific outage doesn't kill both
                            slots in the GitHub Models leg)
    OPENROUTER_API_KEY      optional; when set, OpenRouter leg fires.
                            Free-tier models share daily caps but pools
                            are independent from OpenAI / Gemini /
                            GitHub Models.
    OPENROUTER_PRIMARY      default: deepseek/deepseek-r1:free
                            (reasoning model; strongest free option for
                            code review)
    OPENROUTER_FALLBACK     default: qwen/qwen3-coder:free
                            (code-tuned, fires when R1 daily cap hits)

Outputs:
    Writes the review markdown to /tmp/review.md (or $REVIEW_OUT).
    Prints two lines to stdout (one for the deferred path):
        ENGINE=<openai|gemini|github|openrouter|deferred>
        MODEL_USED=<concrete model id, omitted when ENGINE=deferred>
    Exits 0 always (the workflow handles the "deferred" case via labelling).

Hallucination guard: the prompt itself instructs the model to never invent
file paths. This helper does not invent anything; it only relays.
"""
from __future__ import annotations

import json
import os
import sys
import urllib.error
import urllib.request

OPENAI_URL = "https://api.openai.com/v1/chat/completions"
GEMINI_URL = (
    "https://generativelanguage.googleapis.com/v1beta/models/"
    "{model}:generateContent?key={key}"
)
GITHUB_MODELS_URL = "https://models.github.ai/inference/chat/completions"
OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions"


def _post_json(url: str, payload: dict, headers: dict, timeout: int = 90) -> dict:
    req = urllib.request.Request(
        url,
        data=json.dumps(payload).encode(),
        headers=headers,
        method="POST",
    )
    with urllib.request.urlopen(req, timeout=timeout) as r:
        return json.loads(r.read())


def _try_openai_with_key(prompt: str, key: str, label: str
                         ) -> tuple[str | None, str]:
    """Single-key attempt. status ∈ {ok, no_key, quota, error}."""
    if not key:
        return None, "no_key"
    model = os.environ.get("OPENAI_MODEL", "gpt-5.5")
    try:
        resp = _post_json(
            OPENAI_URL,
            {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2,
            },
            {
                "Authorization": f"Bearer {key}",
                "Content-Type": "application/json",
            },
        )
        return resp["choices"][0]["message"]["content"], "ok"
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:500]
        if e.code == 429:
            print(f"::warning::OpenAI ({label}) 429 — quota exhausted. "
                  f"{body}", file=sys.stderr)
            return None, "quota"
        print(f"::warning::OpenAI ({label}) HTTP {e.code}: {body}",
              file=sys.stderr)
        return None, "error"
    except Exception as exc:  # network, json, anything else
        print(f"::warning::OpenAI ({label}) call failed: {exc}",
              file=sys.stderr)
        return None, "error"


def try_openai(prompt: str) -> tuple[str | None, str]:
    """Try OPENAI_API_KEY first, then OPENAI_API_KEY_BACKUP on 429/error.

    The operator runs two OpenAI accounts (one paid, one free); the
    quota windows on the two are independent, so a 429 on the primary
    is no reason to skip the secondary. Returns the first success;
    returns the *last* observed status when neither key works (so the
    deferred-review comment surfaces the real reason — typically
    `quota` rather than `no_key`).
    """
    primary = (os.environ.get("OPENAI_API_KEY") or "").strip()
    backup = (os.environ.get("OPENAI_API_KEY_BACKUP") or "").strip()
    if not primary and not backup:
        return None, "no_key"

    last_status = "no_key"
    for key, label in (
        (primary, "OPENAI_API_KEY"),
        (backup, "OPENAI_API_KEY_BACKUP"),
    ):
        if not key:
            continue
        review, status = _try_openai_with_key(prompt, key, label)
        if review:
            return review, status
        last_status = status
    return None, last_status


def _try_gemini_with_model(prompt: str, key: str, model: str
                           ) -> tuple[str | None, str]:
    """Single-model attempt. status ∈ {ok, quota, error}."""
    url = GEMINI_URL.format(model=model, key=key)
    try:
        resp = _post_json(
            url,
            {
                "contents": [{"parts": [{"text": prompt}]}],
                "generationConfig": {"temperature": 0.2},
            },
            {"Content-Type": "application/json"},
        )
        # Defensive: Gemini returns nested structure; missing text means a
        # safety block or empty completion — treat as error so we defer.
        candidates = resp.get("candidates") or []
        if not candidates:
            return None, "error"
        parts = (candidates[0].get("content") or {}).get("parts") or []
        text = "".join(p.get("text", "") for p in parts).strip()
        if not text:
            return None, "error"
        return text, "ok"
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:500]
        if e.code == 429:
            print(f"::warning::Gemini ({model}) 429 — quota exhausted. {body}",
                  file=sys.stderr)
            return None, "quota"
        print(f"::warning::Gemini ({model}) HTTP {e.code}: {body}",
              file=sys.stderr)
        return None, "error"
    except Exception as exc:
        print(f"::warning::Gemini ({model}) call failed: {exc}", file=sys.stderr)
        return None, "error"


def try_gemini(prompt: str) -> tuple[str | None, str, str]:
    """Walk Gemini Pro then Flash on the same key.

    Returns (review_markdown, status, model_used). status follows the
    same convention as try_openai: 'ok' on success, 'no_key' when no
    GEMINI_API_KEY is set, 'quota' / 'error' from the *last* model
    tried so the deferred-review comment surfaces the real reason.
    """
    key = (os.environ.get("GEMINI_API_KEY") or "").strip()
    if not key:
        return None, "no_key", ""

    # GEMINI_MODEL is a back-compat alias for the Pro slot — if the
    # operator has the old single-model env override set, route it
    # to the first attempt.
    legacy = (os.environ.get("GEMINI_MODEL") or "").strip()
    pro_model = legacy or os.environ.get("GEMINI_PRO_MODEL", "gemini-2.5-pro")
    flash_model = os.environ.get("GEMINI_FLASH_MODEL", "gemini-2.5-flash")

    last_status = "no_key"
    for model in (pro_model, flash_model):
        if not model:
            continue
        review, status = _try_gemini_with_model(prompt, key, model)
        if review:
            return review, status, model
        last_status = status
        # If the only model we have is set on both slots (operator
        # override), don't double-fire the same model.
        if pro_model == flash_model:
            break
    return None, last_status, flash_model or pro_model


def _try_openai_compat(url: str, key: str, model: str, prompt: str,
                       label: str, extra_headers: dict | None = None
                       ) -> tuple[str | None, str]:
    """Single-shot call to any OpenAI-compatible chat-completion endpoint.

    GitHub Models, OpenRouter, Mistral, Groq, Cerebras and friends all
    speak the same `/chat/completions` shape, so this helper covers them
    all. Returns (text, status) with status ∈ {ok, no_key, quota, error}.
    """
    if not key:
        return None, "no_key"
    headers = {
        "Authorization": f"Bearer {key}",
        "Content-Type": "application/json",
    }
    if extra_headers:
        headers.update(extra_headers)
    try:
        resp = _post_json(
            url,
            {
                "model": model,
                "messages": [{"role": "user", "content": prompt}],
                "temperature": 0.2,
            },
            headers,
        )
        text = (resp.get("choices") or [{}])[0].get("message", {}).get("content")
        if not text:
            return None, "error"
        return text, "ok"
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:500]
        if e.code in (401, 403):
            print(f"::warning::{label} ({model}) auth error {e.code}: {body}",
                  file=sys.stderr)
            return None, "error"
        if e.code == 429:
            print(f"::warning::{label} ({model}) 429 — quota exhausted. {body}",
                  file=sys.stderr)
            return None, "quota"
        print(f"::warning::{label} ({model}) HTTP {e.code}: {body}",
              file=sys.stderr)
        return None, "error"
    except Exception as exc:
        print(f"::warning::{label} ({model}) call failed: {exc}",
              file=sys.stderr)
        return None, "error"


def try_github_models(prompt: str) -> tuple[str | None, str, str]:
    """Walk GITHUB_MODELS_PRIMARY then GITHUB_MODELS_FALLBACK on the
    standard GITHUB_TOKEN. Returns (review, status, model_used)."""
    key = (os.environ.get("GITHUB_TOKEN") or "").strip()
    if not key:
        return None, "no_key", ""
    primary = os.environ.get("GITHUB_MODELS_PRIMARY",
                             "meta/Llama-3.3-70B-Instruct")
    fallback = os.environ.get("GITHUB_MODELS_FALLBACK",
                              "openai/gpt-4.1-mini")
    last_status = "no_key"
    for model in (primary, fallback):
        if not model:
            continue
        review, status = _try_openai_compat(
            GITHUB_MODELS_URL, key, model, prompt, "GitHub Models",
        )
        if review:
            return review, status, model
        last_status = status
        if primary == fallback:
            break
    return None, last_status, fallback or primary


def try_openrouter(prompt: str) -> tuple[str | None, str, str]:
    """Walk OPENROUTER_PRIMARY then OPENROUTER_FALLBACK on the same key.
    Returns (review, status, model_used)."""
    key = (os.environ.get("OPENROUTER_API_KEY") or "").strip()
    if not key:
        return None, "no_key", ""
    primary = os.environ.get("OPENROUTER_PRIMARY",
                             "deepseek/deepseek-r1:free")
    fallback = os.environ.get("OPENROUTER_FALLBACK",
                              "qwen/qwen3-coder:free")
    # OpenRouter recommends an HTTP-Referer + X-Title header so usage
    # is attributable in their dashboard. Both are optional but kind to
    # the free-tier service.
    extra = {
        "HTTP-Referer": "https://github.com/palimkarakshay/lumivara-site",
        "X-Title": "lumivara-codex-review",
    }
    last_status = "no_key"
    for model in (primary, fallback):
        if not model:
            continue
        review, status = _try_openai_compat(
            OPENROUTER_URL, key, model, prompt, "OpenRouter", extra,
        )
        if review:
            return review, status, model
        last_status = status
        if primary == fallback:
            break
    return None, last_status, fallback or primary


def main() -> int:
    prompt_file = os.environ.get("PROMPT_FILE")
    if not prompt_file or not os.path.exists(prompt_file):
        print("::error::PROMPT_FILE not provided or missing", file=sys.stderr)
        return 1
    with open(prompt_file) as f:
        prompt = f.read()

    out_path = os.environ.get("REVIEW_OUT", "/tmp/review.md")

    # 1. OpenAI
    review, status = try_openai(prompt)
    if review:
        with open(out_path, "w") as f:
            f.write(review)
        # Emit MODEL_USED so the workflow's GitHub comment header
        # surfaces the exact model — the body has it too but the
        # outer header was stale (gemini-2.5-flash) when the script
        # actually ran gemini-2.5-pro. (Codex P2 round 3 on PR #244.)
        print("ENGINE=openai")
        print(f"MODEL_USED={os.environ.get('OPENAI_MODEL', 'gpt-5.5')}")
        return 0
    openai_status = status

    # 2. Gemini fallback (Pro then Flash on the same key)
    openai_model = os.environ.get("OPENAI_MODEL", "gpt-5.5")
    review, status, gemini_model_used = try_gemini(prompt)
    if review:
        with open(out_path, "w") as f:
            # Tag the review so downstream parsers know it came from Gemini.
            # codex-pr-fix.yml looks for '## Suggested fixes' headers — those
            # come from the prompt's required structure, not the engine, so
            # the auto-fixer keeps working unchanged.
            f.write(
                f"_Engine: {gemini_model_used} fallback "
                "(OpenAI unavailable: " + openai_status + ")._\n\n"
                + review
            )
        print("ENGINE=gemini")
        print(f"MODEL_USED={gemini_model_used}")
        return 0
    gemini_status = status

    gemini_label = gemini_model_used or os.environ.get(
        "GEMINI_FLASH_MODEL", "gemini-2.5-flash"
    )

    # 3. GitHub Models fallback (Llama-3.3-70b → gpt-4.1-mini on the
    # standard GITHUB_TOKEN). Independent rate-limit pool from
    # OpenAI / Gemini, so this leg covers the simultaneous-outage
    # case the prior ladder defered on.
    review, status, gh_model_used = try_github_models(prompt)
    if review:
        with open(out_path, "w") as f:
            f.write(
                f"_Engine: GitHub Models / {gh_model_used} fallback "
                f"(OpenAI: {openai_status}; Gemini: {gemini_status})._"
                "\n\n" + review
            )
        print("ENGINE=github")
        print(f"MODEL_USED={gh_model_used}")
        return 0
    gh_status = status

    # 4. OpenRouter fallback (DeepSeek R1 → Qwen3 Coder). Yet another
    # independent rate-limit pool. R1 is a reasoning model so this is
    # the strongest free option for code review when everything else
    # is rate-limited.
    review, status, or_model_used = try_openrouter(prompt)
    if review:
        with open(out_path, "w") as f:
            f.write(
                f"_Engine: OpenRouter / {or_model_used} fallback "
                f"(OpenAI: {openai_status}; Gemini: {gemini_status}; "
                f"GitHub Models: {gh_status})._\n\n" + review
            )
        print("ENGINE=openrouter")
        print(f"MODEL_USED={or_model_used}")
        return 0
    or_status = status

    # 5. Defer — every provider unavailable. Report each so the
    # deferred-review comment is honest about which legs were tried.
    gh_label = gh_model_used or os.environ.get(
        "GITHUB_MODELS_FALLBACK", "openai/gpt-4.1-mini"
    )
    or_label = or_model_used or os.environ.get(
        "OPENROUTER_FALLBACK", "qwen/qwen3-coder:free"
    )
    with open(out_path, "w") as f:
        f.write(
            "## Code review unavailable\n\n"
            f"All review legs were unavailable this pass:\n\n"
            f"- OpenAI ({openai_model}) status: `{openai_status}`\n"
            f"- Gemini status: `{gemini_status}` "
            f"(last model tried: `{gemini_label}`)\n"
            f"- GitHub Models status: `{gh_status}` "
            f"(last model tried: `{gh_label}`)\n"
            f"- OpenRouter status: `{or_status}` "
            f"(last model tried: `{or_label}`)\n\n"
            "This PR has been labelled `review-deferred`. A scheduled "
            "re-review run (`codex-review-recheck.yml`) will retry once "
            "any provider's quota window resets.\n\n"
            "## Verdict\n\nrequest-changes\n"
        )
    print("ENGINE=deferred")
    return 0


if __name__ == "__main__":
    sys.exit(main())
