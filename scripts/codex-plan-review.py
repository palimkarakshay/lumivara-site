#!/usr/bin/env python3
"""
Codex consistency review of a freshly-drafted implementation plan.

The post-triage planning stage (`plan-issues.yml`) drafts an implementation
plan via Claude Opus and writes it to `/tmp/plan-<N>.md`. Before the plan
gets committed to the issue thread (and read by every downstream executor),
this script asks OpenAI gpt-5.5 to spot-check the draft for
**consistency** with the rest of the project — file layout, naming, the
label/routing rubric, the conventions in `AGENTS.md`/`docs/AI_ROUTING.md`,
the hard-exclusion list, and the Definition-of-done shape.

The script is intentionally narrow:
- It does NOT rewrite the plan — Claude (or the operator) decides whether
  to accept, partially accept, or ignore each finding.
- It does NOT invent file paths. The prompt instructs Codex to skip any
  finding it cannot ground in a real path; the calling workflow further
  rejects findings whose cited paths don't exist on disk.
- If `OPENAI_API_KEY` is missing / quota-exhausted, it prints a graceful
  fallback marker and exits 0 — planning must not fail on Codex outage.

Usage:
  OPENAI_API_KEY=... GH_TOKEN=... \
    python3 scripts/codex-plan-review.py <issue_number> <plan_file>

Output:
  Writes the consistency review to stdout in the structured form below.
  Always exits 0 — never blocks the planning pipeline.

  ## Consistency review (Codex gpt-5.5)

  ### Findings
  - [severity] path/to/file.ext — description
  ...

  ### Verdict
  one of: `consistent`, `consistent-with-nits`, `revise-before-posting`
"""
from __future__ import annotations

import json
import os
import pathlib
import re
import sys
import urllib.error
import urllib.request

REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent

PROMPT = """You are the Codex consistency reviewer for the Lumivara site repo.

A planning agent (Claude Opus) just drafted the implementation plan below.
Your job is to spot-check the plan for **consistency** — NOT correctness of
the underlying idea — against the project's existing conventions before the
plan is committed to the issue thread (where downstream executors will
follow it verbatim).

Specifically, flag anything in the plan that conflicts with:

1. The hard-exclusion list (no edits to `.github/workflows/*`, `.env*`,
   `scripts/*`, `src/app/api/contact/*`, or `package.json` deps unless the
   issue is explicitly `infra-allowed`).
2. The file layout: copy in `src/content/`, MDX insights in
   `src/content/insights/` with the standard frontmatter, design tokens
   per the README, site-wide settings in `src/lib/site-config.ts`.
3. The label/routing rubric in `scripts/lib/routing.py`,
   `scripts/triage-prompt.md`, and `docs/AI_ROUTING.md` (provider/model
   selection, complexity tiers, area/type taxonomy).
4. The plan format itself: the four required sections
   (`### Files to create or modify`, `### Step-by-step`,
   `### Risks / open questions`, `### Definition of done`), and the DoD
   must include `npx tsc --noEmit` and `npm run lint`.
5. Cross-plan consistency: naming, branch naming (`auto/issue-<N>`),
   commit-message format (`feedback(#<N>): ...`).

Format requirements (the calling workflow parses this):
- Use these exact section headers, in this order:
  `## Consistency review (Codex gpt-5.5)`,
  `### Findings`,
  `### Verdict`.
- Under `### Findings`, list items as:
  `- [severity] path/to/file.ext — description`
  where severity ∈ {blocker, major, minor, nit}. If the finding is about
  the plan's own structure (not a file), use the literal token
  `plan-structure` in place of the path.
- `### Verdict` is exactly one of `consistent`,
  `consistent-with-nits`, `revise-before-posting`.
- DO NOT invent file paths. If you cannot ground a finding in a real path
  or in the literal `plan-structure` token, OMIT the finding.
- Speculative findings get severity `nit` and prefix `(speculative)`.
- Be concise — no preamble, no postscript, no rephrasing of the plan.
"""

OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "").strip()
MODEL = os.environ.get("CODEX_MODEL", "gpt-5.5")


def _fallback_marker(reason: str) -> str:
    return (
        "## Consistency review (Codex gpt-5.5)\n\n"
        "### Findings\n"
        f"_Skipped: {reason}._\n\n"
        "### Verdict\n"
        "consistent\n"
    )


def _filter_hallucinations(review: str) -> str:
    """Drop findings whose cited path doesn't exist in the repo.

    Codex is instructed not to invent paths, but we double-check here as a
    cheap hallucination guard. Anything that cites `plan-structure` or a
    real on-disk path passes through; anything else is silently dropped
    and a `_dropped <N> unverifiable findings_` note is appended.
    """
    lines = review.splitlines()
    out: list[str] = []
    dropped = 0
    finding_re = re.compile(
        r"^- \[(blocker|major|minor|nit)\]\s+(\S+?)\s+—"
    )
    for line in lines:
        m = finding_re.match(line)
        if not m:
            out.append(line)
            continue
        path = m.group(2)
        if path == "plan-structure":
            out.append(line)
            continue
        # Strip a trailing ":LN" if present.
        bare = path.split(":", 1)[0]
        if (REPO_ROOT / bare).exists():
            out.append(line)
        else:
            dropped += 1
    if dropped:
        out.append("")
        out.append(
            f"_Dropped {dropped} finding(s) whose cited path could not be "
            "verified on disk (hallucination guard)._"
        )
    return "\n".join(out)


def review(issue_number: str, plan_text: str) -> str:
    if not OPENAI_API_KEY:
        return _fallback_marker("OPENAI_API_KEY not configured")

    prompt = (
        f"{PROMPT}\n\n"
        f"## Issue #{issue_number}\n\n"
        "## Drafted plan to review\n\n"
        f"{plan_text}\n"
    )
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps({
            "model": MODEL,
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
        }).encode(),
        headers={
            "Authorization": f"Bearer {OPENAI_API_KEY}",
            "Content-Type": "application/json",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=90) as r:
            resp = json.loads(r.read())
        text = resp["choices"][0]["message"]["content"].strip()
    except urllib.error.HTTPError as e:
        body = e.read().decode()[:300]
        if e.code == 429:
            return _fallback_marker(f"OpenAI quota exhausted (HTTP 429): {body}")
        return _fallback_marker(f"OpenAI HTTP {e.code}: {body}")
    except (urllib.error.URLError, KeyError, TimeoutError) as e:
        return _fallback_marker(f"OpenAI call failed: {e}")

    if not text.lstrip().startswith("## Consistency review"):
        # Codex didn't follow the format. Wrap defensively so downstream
        # parsers still find the headers; tag verdict as nit-level.
        text = (
            "## Consistency review (Codex gpt-5.5)\n\n"
            "### Findings\n"
            f"- [nit] plan-structure — Codex returned an unstructured response; raw output preserved below.\n\n"
            "### Verdict\nconsistent-with-nits\n\n"
            "<details><summary>Raw Codex output</summary>\n\n"
            f"{text}\n\n</details>"
        )
    return _filter_hallucinations(text)


def main() -> int:
    if len(sys.argv) != 3:
        print("usage: codex-plan-review.py <issue_number> <plan_file>",
              file=sys.stderr)
        return 2
    issue_number = sys.argv[1]
    plan_path = pathlib.Path(sys.argv[2])
    if not plan_path.exists():
        print(f"plan file not found: {plan_path}", file=sys.stderr)
        return 2
    plan_text = plan_path.read_text(encoding="utf-8")
    print(review(issue_number, plan_text))
    return 0


if __name__ == "__main__":
    sys.exit(main())
