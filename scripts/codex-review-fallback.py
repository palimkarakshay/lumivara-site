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
    3. defer (label PR `review-deferred`)     — last resort

Why these two providers and not three? The triage / plan / execute ladders
already use Claude, so using Claude here too would defeat the point of an
"independent second opinion". OpenAI and Gemini are the only non-Claude
options in the project; if both are down the run defers cleanly.

Inputs (env):
    PROMPT_FILE             path to a file containing the full review prompt
    OPENAI_API_KEY          optional; tried first when set
    OPENAI_API_KEY_BACKUP   optional; tried after OPENAI_API_KEY on
                            429/error so a quota-exhausted primary key
                            doesn't silently skip the OpenAI leg
    GEMINI_API_KEY          optional; Gemini attempted only when set
    OPENAI_MODEL            default: gpt-5.5
    GEMINI_MODEL            default: gemini-2.5-flash (matches the
                            `Code review on PR diff` row in
                            docs/AI_ROUTING.md — free-tier 500 RPD
                            keeps the fallback unconstrained; the
                            previous `gemini-2.5-pro` default 429'd
                            in lockstep with OpenAI)

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
    review, status = try_gemini(prompt)
    if review:
        with open(out_path, "w") as f:
            # Tag the review so downstream parsers know it came from Gemini.
            # codex-pr-fix.yml looks for '## Suggested fixes' headers — those
            # come from the prompt's required structure, not the engine, so
            # the auto-fixer keeps working unchanged.
            f.write(
                "_Engine: Gemini 2.5 Pro fallback "
                "(OpenAI unavailable: " + openai_status + ")._\n\n"
                + review
            )
        print("ENGINE=gemini")
        return 0
    gemini_status = status

    # 3. Defer — both providers unavailable.
    gemini_model = os.environ.get("GEMINI_MODEL", "gemini-2.5-flash")
    with open(out_path, "w") as f:
        f.write(
            "## Code review unavailable\n\n"
            f"Both OpenAI (gpt-5.5) and {gemini_model} were unavailable "
            "for this review pass.\n\n"
            f"- OpenAI status: `{openai_status}`\n"
            f"- Gemini status: `{gemini_status}`\n\n"
            "This PR has been labelled `review-deferred`. A scheduled "
            "re-review run (`codex-review-recheck.yml`) will retry once "
            "either provider's quota window resets.\n\n"
            "## Verdict\n\nrequest-changes\n"
        )
    print("ENGINE=deferred")
    return 0


if __name__ == "__main__":
    sys.exit(main())
