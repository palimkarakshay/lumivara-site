#!/usr/bin/env python3
"""
Run a code-review pass with provider fallback.

The Codex consistency review is the project's single sanity-check before a
PR auto-merges. When OpenAI is unavailable (no key, 429 quota, transient
HTTP failure) we still want *some* second-opinion review rather than
silently shipping unreviewed code, so this helper walks a small ladder:

    1. OpenAI gpt-5.5 / OPENAI_API_KEY        — preferred
    1b. OpenAI gpt-5.5 / OPENAI_API_KEY_BACKUP — second key (independent
        quota window; the operator runs two accounts)
    2. Gemini 2.5 Flash (Google AI Studio free tier, 500 RPD)
    3. Anthropic Claude (model from ANTHROPIC_REVIEW_MODEL,
       default claude-opus-4-7) — relaxed-independence fallback
    4. defer (label PR `review-deferred`)     — last resort

On reviewer independence (policy revision 2026-04-30):

    The original design excluded Claude from this ladder so reviews stayed
    independent from the triage / plan / execute path. In practice the
    OpenAI + Gemini ladder defers ~1 PR in 5 (both quotas often exhaust
    in lockstep) and the operator was getting noisy "request-changes"
    deferrals on every PR, defeating the goal. The trade-off was
    re-evaluated and review coverage now wins: Claude is added as the
    last engine before defer, with the engine clearly marked in the
    review header so the operator can spot when the independence
    guarantee was relaxed for that PR. OpenAI / Gemini still come first
    so the preference for an independent reviewer stays intact whenever
    either is reachable.

Inputs (env):
    PROMPT_FILE             path to a file containing the full review prompt
    OPENAI_API_KEY          optional; tried first when set
    OPENAI_API_KEY_BACKUP   optional; tried after OPENAI_API_KEY on
                            429/error so a quota-exhausted primary key
                            doesn't silently skip the OpenAI leg
    GEMINI_API_KEY          optional; Gemini attempted only when set
    ANTHROPIC_API_KEY       optional; Claude attempted only when set,
                            and only after OpenAI + Gemini have both
                            failed (independence-preserving order)
    OPENAI_MODEL            default: gpt-5.5
    GEMINI_MODEL            default: gemini-2.5-flash (matches the
                            `Code review on PR diff` row in
                            docs/AI_ROUTING.md — free-tier 500 RPD
                            keeps the fallback unconstrained; the
                            previous `gemini-2.5-pro` default 429'd
                            in lockstep with OpenAI)
    ANTHROPIC_REVIEW_MODEL  default: claude-opus-4-7 (per AGENTS.md
                            quality-first phase; lower-cost models
                            are explicitly deferred until cost
                            optimisation phase)

Outputs:
    Writes the review markdown to /tmp/review.md (or $REVIEW_OUT).
    Prints a single line to stdout: ENGINE=<openai|gemini|anthropic|deferred>
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
ANTHROPIC_URL = "https://api.anthropic.com/v1/messages"
ANTHROPIC_VERSION = "2023-06-01"
ANTHROPIC_MAX_TOKENS = 4096


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


def try_gemini(prompt: str) -> tuple[str | None, str]:
    """Return (review_markdown, status). status ∈ {ok, no_key, quota, error}."""
    key = (os.environ.get("GEMINI_API_KEY") or "").strip()
    if not key:
        return None, "no_key"
    model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
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
            print(f"::warning::Gemini 429 — daily quota exhausted. {body}",
                  file=sys.stderr)
            return None, "quota"
        print(f"::warning::Gemini HTTP {e.code}: {body}", file=sys.stderr)
        return None, "error"
    except Exception as exc:
        print(f"::warning::Gemini call failed: {exc}", file=sys.stderr)
        return None, "error"


def try_anthropic(prompt: str) -> tuple[str | None, str]:
    """Return (review_markdown, status). status ∈ {ok, no_key, quota, error}.

    Last engine before defer. Walks ANTHROPIC_API_KEY first; this repo
    does not yet store an ANTHROPIC_API_KEY_BACKUP so a single 429 ends
    the leg. If the operator later adds a backup key, mirror the
    OpenAI two-key pattern in `try_openai` above."""
    key = (os.environ.get("ANTHROPIC_API_KEY") or "").strip()
    if not key:
        return None, "no_key"
    model = os.environ.get("ANTHROPIC_REVIEW_MODEL", "claude-opus-4-7")
    try:
        resp = _post_json(
            ANTHROPIC_URL,
            {
                "model": model,
                "max_tokens": ANTHROPIC_MAX_TOKENS,
                "messages": [{"role": "user", "content": prompt}],
            },
            {
                "x-api-key": key,
                "anthropic-version": ANTHROPIC_VERSION,
                "content-type": "application/json",
            },
            timeout=120,
        )
        # Anthropic returns content as a list of blocks; we want the
        # first text block. Empty / non-text → treat as error.
        blocks = resp.get("content") or []
        text = ""
        for b in blocks:
            if b.get("type") == "text":
                text = (b.get("text") or "").strip()
                break
        if not text:
            return None, "error"
        return text, "ok"
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:500]
        if e.code in (429, 529):  # rate-limit / overloaded
            print(f"::warning::Anthropic {e.code} — quota / overloaded. {body}",
                  file=sys.stderr)
            return None, "quota"
        print(f"::warning::Anthropic HTTP {e.code}: {body}", file=sys.stderr)
        return None, "error"
    except Exception as exc:
        print(f"::warning::Anthropic call failed: {exc}", file=sys.stderr)
        return None, "error"


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

    # 2. Gemini fallback
    gemini_model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    openai_model = os.environ.get("OPENAI_MODEL", "gpt-5.5")
    anthropic_model = os.environ.get("ANTHROPIC_REVIEW_MODEL", "claude-opus-4-7")
    review, status = try_gemini(prompt)
    if review:
        with open(out_path, "w") as f:
            # Tag the review so downstream parsers know it came from Gemini.
            # codex-pr-fix.yml looks for '## Suggested fixes' headers — those
            # come from the prompt's required structure, not the engine, so
            # the auto-fixer keeps working unchanged.
            f.write(
                f"_Engine: {gemini_model} fallback "
                "(OpenAI unavailable: " + openai_status + ")._\n\n"
                + review
            )
        print("ENGINE=gemini")
        return 0
    gemini_status = status

    # 3. Anthropic Claude fallback (added 2026-04-30 — see module
    # docstring). Independence trade-off is explicitly relaxed and the
    # engine is marked in the review header so the operator can spot
    # which PRs got the relaxed review path.
    review, status = try_anthropic(prompt)
    if review:
        with open(out_path, "w") as f:
            f.write(
                f"_Engine: {anthropic_model} fallback "
                f"(OpenAI: {openai_status}; Gemini: {gemini_status}). "
                "Reviewer-independence guarantee relaxed for this PR — "
                "see `scripts/codex-review-fallback.py` docstring._\n\n"
                + review
            )
        print("ENGINE=anthropic")
        return 0
    anthropic_status = status

    # 4. Defer — every provider unavailable.
    with open(out_path, "w") as f:
        f.write(
            "## Code review unavailable\n\n"
            f"All three providers — OpenAI ({openai_model}), "
            f"{gemini_model}, and {anthropic_model} — were unavailable "
            "for this review pass.\n\n"
            f"- OpenAI status: `{openai_status}`\n"
            f"- Gemini status: `{gemini_status}`\n"
            f"- Anthropic status: `{anthropic_status}`\n\n"
            "This PR has been labelled `review-deferred`. A scheduled "
            "re-review run (`codex-review-recheck.yml`) will retry once "
            "any provider's quota window resets.\n\n"
            "## Verdict\n\nrequest-changes\n"
        )
    print("ENGINE=deferred")
    return 0


if __name__ == "__main__":
    sys.exit(main())
