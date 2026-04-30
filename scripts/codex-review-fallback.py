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
    3.  defer (label PR `review-deferred`)      — last resort

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

Outputs:
    Writes the review markdown to /tmp/review.md (or $REVIEW_OUT).
    Prints a single line to stdout: ENGINE=<openai|gemini|deferred>
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
        print("ENGINE=openai")
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
        return 0
    gemini_status = status

    # 3. Defer — both providers unavailable. Report the model that
    # caused the last Gemini status (the second of Pro/Flash, unless
    # only one was attempted) so the deferred-review comment is honest
    # about which model actually 429'd.
    gemini_label = gemini_model_used or os.environ.get(
        "GEMINI_FLASH_MODEL", "gemini-2.5-flash"
    )
    with open(out_path, "w") as f:
        f.write(
            "## Code review unavailable\n\n"
            f"Both OpenAI ({openai_model}) and Gemini ({gemini_label}) "
            "were unavailable for this review pass.\n\n"
            f"- OpenAI status: `{openai_status}`\n"
            f"- Gemini status: `{gemini_status}` (last model tried: "
            f"`{gemini_label}`)\n\n"
            "This PR has been labelled `review-deferred`. A scheduled "
            "re-review run (`codex-review-recheck.yml`) will retry once "
            "either provider's quota window resets.\n\n"
            "## Verdict\n\nrequest-changes\n"
        )
    print("ENGINE=deferred")
    return 0


if __name__ == "__main__":
    sys.exit(main())
