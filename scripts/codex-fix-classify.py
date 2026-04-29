#!/usr/bin/env python3
"""
Classify Codex's `## Suggested fixes` entries on a PR review into
`apply` (safe to feed into Claude for an automated follow-up commit) vs
`defer` (leave for the human reviewer).

Why this exists
---------------
codex-review.yml posts a structured review on every PR. The review's
`## Suggested fixes` section lists one-liner edits, each shaped like:

    - path/to/file.ext: <what to change, in one sentence>

We DO NOT want the auto-fixer (`codex-pr-fix.yml`) to blindly hand every
suggestion to Claude. Codex hallucinates file paths, sometimes proposes
edits to hard-excluded paths (workflows / scripts / env / contact API /
package.json deps), and sometimes proposes architectural rewrites
disguised as one-liners. This classifier filters down to the suggestions
that are mechanical AND grounded in real on-disk paths AND outside the
exclusion list.

The output is JSON:

    {
      "apply": [{"path": "...", "instruction": "...", "raw": "..."}, ...],
      "defer": [{"path": "...", "instruction": "...", "raw": "...",
                 "reason": "<why deferred>"}, ...],
      "review_comment_id": <int or null>
    }

Hallucination guard:
- Findings whose path doesn't exist on disk are deferred with
  reason="path-not-found".
- Findings citing hard-excluded paths are deferred with
  reason="hard-excluded".
- Findings whose instruction looks "speculative" (long, multi-clause,
  contains "consider"/"perhaps"/"refactor") are deferred with
  reason="speculative".

Usage:
    GH_TOKEN=... python3 scripts/codex-fix-classify.py <pr_number>
"""
from __future__ import annotations

import json
import os
import pathlib
import re
import subprocess
import sys

REPO = "palimkarakshay/lumivara-site"
REPO_ROOT = pathlib.Path(__file__).resolve().parent.parent

# Hard exclusions: bot must never auto-edit these paths.
EXCLUDED_PREFIXES = (
    ".github/workflows/",
    ".env",
    "scripts/",
    "src/app/api/contact/",
)
EXCLUDED_FILES = (
    "package.json",
    "package-lock.json",
)

# Heuristic markers that an "instruction" is too vague / large for the
# auto-fix path. Anything matching → defer.
SPECULATIVE_MARKERS = (
    "consider ",
    "perhaps ",
    "may want to",
    "might want to",
    "refactor",
    "rewrite",
    "restructure",
    "rearchitect",
    "investigate",
    "audit",
    "review whether",
)


def _gh_json(*args: str) -> dict | list:
    out = subprocess.check_output(["gh", *args], text=True)
    return json.loads(out)


def fetch_latest_codex_review(pr: str) -> tuple[str | None, int | None]:
    """Return (body, comment_id) of the most recent Codex review on the PR.

    Codex reviews are PR-level comments whose body starts with
    `## Code review (Codex`. We pick the most recent one so re-reviews
    after a fix-and-push cycle override stale findings.
    """
    comments = _gh_json(
        "api",
        f"repos/{REPO}/issues/{pr}/comments",
        "--paginate",
        "--jq",
        "[.[] | {id, body, created_at}]",
    )
    candidates = [
        c for c in comments
        if isinstance(c.get("body"), str)
        and c["body"].lstrip().startswith("## Code review (Codex")
    ]
    if not candidates:
        return None, None
    candidates.sort(key=lambda c: c["created_at"], reverse=True)
    return candidates[0]["body"], candidates[0]["id"]


def extract_suggested_fixes(review: str) -> list[str]:
    """Return the raw bullet lines under `## Suggested fixes`."""
    lines = review.splitlines()
    out: list[str] = []
    in_section = False
    for line in lines:
        stripped = line.strip()
        if stripped.startswith("## "):
            in_section = stripped.lower().startswith("## suggested fixes")
            continue
        if in_section and stripped.startswith("- "):
            out.append(stripped[2:].strip())
    return out


_FIX_RE = re.compile(r"^\s*`?([^\s`:]+)`?\s*:\s*(.+)$")


def classify_one(raw: str) -> dict:
    """Classify a single bullet from the suggested-fixes section."""
    m = _FIX_RE.match(raw)
    if not m:
        return {"raw": raw, "path": None, "instruction": raw,
                "decision": "defer", "reason": "unparseable"}
    path = m.group(1).strip("`").strip()
    instruction = m.group(2).strip()

    # Strip a trailing ":LN" if Codex tacked on a line number.
    bare = path.split(":", 1)[0]

    if any(bare.startswith(p) for p in EXCLUDED_PREFIXES) or bare in EXCLUDED_FILES:
        return {"raw": raw, "path": bare, "instruction": instruction,
                "decision": "defer", "reason": "hard-excluded"}

    if not (REPO_ROOT / bare).exists():
        return {"raw": raw, "path": bare, "instruction": instruction,
                "decision": "defer", "reason": "path-not-found"}

    lower = instruction.lower()
    if any(m in lower for m in SPECULATIVE_MARKERS):
        return {"raw": raw, "path": bare, "instruction": instruction,
                "decision": "defer", "reason": "speculative"}

    # An instruction that's a full paragraph is almost certainly not a
    # mechanical edit. Cap at ~200 chars.
    if len(instruction) > 200:
        return {"raw": raw, "path": bare, "instruction": instruction,
                "decision": "defer", "reason": "too-long"}

    return {"raw": raw, "path": bare, "instruction": instruction,
            "decision": "apply", "reason": None}


def main() -> int:
    if len(sys.argv) != 2:
        print("usage: codex-fix-classify.py <pr_number>", file=sys.stderr)
        return 2
    pr = sys.argv[1]
    body, cid = fetch_latest_codex_review(pr)
    if not body:
        json.dump({"apply": [], "defer": [], "review_comment_id": None},
                  sys.stdout)
        sys.stdout.write("\n")
        return 0

    suggestions = extract_suggested_fixes(body)
    apply_list, defer_list = [], []
    for raw in suggestions:
        c = classify_one(raw)
        if c["decision"] == "apply":
            apply_list.append({"path": c["path"], "instruction": c["instruction"],
                               "raw": c["raw"]})
        else:
            defer_list.append({"path": c["path"], "instruction": c["instruction"],
                               "raw": c["raw"], "reason": c["reason"]})

    out = {"apply": apply_list, "defer": defer_list, "review_comment_id": cid}
    json.dump(out, sys.stdout, indent=2)
    sys.stdout.write("\n")
    return 0


if __name__ == "__main__":
    sys.exit(main())
