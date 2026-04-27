#!/usr/bin/env python3
"""
Post-triage planning stage.

Walks open `status/planned` + `auto-routine` issues that don't yet have the
`plan/detailed` label and asks an AI model to write a structured
implementation plan as an issue comment, then labels the issue.

The plan is structured enough that a non-Claude executor (Codex CLI in
`execute-fallback.yml`) can implement it deterministically — files to
modify, exact changes, definition of done. This is what lets execution
keep running when Claude is unavailable.

Engine ladder (each step is best-effort; first to succeed wins):
  1. Claude Sonnet — preferred (best at structured planning + tool use)
     Skipped here when invoked from CI; planning via Claude requires the
     claude-code-action setup, which lives in the workflow. When this
     script is invoked standalone, it skips Claude and starts at step 2.
  2. Gemini 2.5 Pro — large context, free tier
  3. OpenAI gpt-4o — strong reasoning, paid

Usage:
  GEMINI_API_KEY=... OPENAI_API_KEY=... GH_TOKEN=... \
    python3 scripts/plan-issue.py [issue_number]

If `issue_number` is omitted, scans the queue and plans up to 5 issues.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
import urllib.error
import urllib.request

REPO = "palimkarakshay/lumivara-site"
MAX_ISSUES = 5

GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "").strip()
OPENAI_API_KEY = os.environ.get("OPENAI_API_KEY", "").strip()

PLAN_PROMPT = """You are the PLANNING stage for the Lumivara site backlog. Read the issue
below and produce a concrete implementation plan that ANY downstream executor
(Claude, Codex, or Gemini) can follow without further interpretation.

Strict rules:
- Cite exact file paths (relative to repo root). If a file doesn't exist yet,
  say "create new file".
- Each step is one self-contained change. Avoid hand-waving like "update
  related logic".
- Hard-exclude these paths: .github/workflows/*, .env*, scripts/*,
  src/app/api/contact/*, package.json deps. If the issue genuinely needs to
  touch one of these, say so in "Risks / open questions" instead of planning
  a change.
- The Definition of done MUST include `npx tsc --noEmit` and `npm run lint`
  passing for any code change.
- Output ONLY the plan, in the exact markdown format below — no preamble,
  no postscript.

## Implementation plan

### Files to create or modify
- `path/to/file.ext` — one-line summary of why and what

### Step-by-step
1. ...
2. ...

### Risks / open questions
- ...

### Definition of done
- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] ...
"""


def _gh(*args: str, **kwargs) -> subprocess.CompletedProcess:
    return subprocess.run(["gh", *args], check=True, capture_output=True,
                          text=True, **kwargs)


def fetch_planned_issues() -> list[dict]:
    out = _gh(
        "issue", "list", "--repo", REPO, "--state", "open",
        "--label", "status/planned", "--label", "auto-routine",
        "--json", "number,title,body,labels", "--limit", "50",
    ).stdout
    issues = json.loads(out)
    # Skip ones that already have a plan.
    return [i for i in issues
            if "plan/detailed" not in {l["name"] for l in i["labels"]}]


def fetch_one(num: int) -> dict:
    out = _gh(
        "issue", "view", str(num), "--repo", REPO,
        "--json", "number,title,body,labels",
    ).stdout
    return json.loads(out)


def plan_with_gemini(title: str, body: str) -> str | None:
    if not GEMINI_API_KEY:
        return None
    prompt = f"{PLAN_PROMPT}\n\n## Issue\n\n### Title\n{title}\n\n### Body\n{body}"
    url = (
        "https://generativelanguage.googleapis.com/v1beta/models/"
        f"gemini-2.5-pro:generateContent?key={GEMINI_API_KEY}"
    )
    req = urllib.request.Request(
        url,
        data=json.dumps({
            "contents": [{"parts": [{"text": prompt}]}],
            "generationConfig": {"temperature": 0.2},
        }).encode(),
        headers={"Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            resp = json.loads(r.read())
        return resp["candidates"][0]["content"]["parts"][0]["text"]
    except (urllib.error.HTTPError, urllib.error.URLError, KeyError) as e:
        print(f"  gemini plan failed: {e}", file=sys.stderr)
        return None


def plan_with_openai(title: str, body: str) -> str | None:
    if not OPENAI_API_KEY:
        return None
    prompt = f"{PLAN_PROMPT}\n\n## Issue\n\n### Title\n{title}\n\n### Body\n{body}"
    req = urllib.request.Request(
        "https://api.openai.com/v1/chat/completions",
        data=json.dumps({
            "model": "gpt-4o",
            "messages": [{"role": "user", "content": prompt}],
            "temperature": 0.2,
        }).encode(),
        headers={"Authorization": f"Bearer {OPENAI_API_KEY}",
                 "Content-Type": "application/json"},
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            resp = json.loads(r.read())
        return resp["choices"][0]["message"]["content"]
    except urllib.error.HTTPError as e:
        body_txt = e.read().decode()[:200]
        print(f"  openai plan failed ({e.code}): {body_txt}", file=sys.stderr)
        return None
    except (urllib.error.URLError, KeyError) as e:
        print(f"  openai plan failed: {e}", file=sys.stderr)
        return None


def plan_one(issue: dict) -> bool:
    """Returns True if a plan was successfully posted."""
    num = issue["number"]
    title = issue["title"]
    body = issue.get("body") or "(empty)"

    plan: str | None = None
    engine_used: str | None = None

    plan = plan_with_gemini(title, body)
    if plan:
        engine_used = "Gemini 2.5 Pro"

    if not plan:
        plan = plan_with_openai(title, body)
        if plan:
            engine_used = "OpenAI gpt-4o"

    if not plan:
        print(f"  #{num}: no plan engine succeeded; skipping.", file=sys.stderr)
        return False

    comment = (
        f"**Detailed plan ({engine_used})**\n\n"
        "_Posted by `plan-issues.yml`. Any executor (Claude, Codex, Gemini) "
        "may implement this plan without further interpretation._\n\n"
        f"{plan}"
    )
    subprocess.run(
        ["gh", "issue", "comment", str(num), "--repo", REPO, "--body", comment],
        check=True, capture_output=True,
    )
    subprocess.run(
        ["gh", "issue", "edit", str(num), "--repo", REPO,
         "--add-label", "plan/detailed"],
        check=True, capture_output=True,
    )
    print(f"  #{num}: planned via {engine_used}")
    return True


def main() -> int:
    if len(sys.argv) > 1:
        try:
            n = int(sys.argv[1])
        except ValueError:
            print(f"Invalid issue number: {sys.argv[1]}", file=sys.stderr)
            return 2
        ok = plan_one(fetch_one(n))
        return 0 if ok else 1

    issues = fetch_planned_issues()
    if not issues:
        print("plan-issue: no planned issues need a detailed plan.")
        return 0

    issues = issues[:MAX_ISSUES]
    print(f"plan-issue: {len(issues)} issue(s) to plan.")
    successes = 0
    for i in issues:
        if plan_one(i):
            successes += 1
    print(f"\nPlanned {successes}/{len(issues)}.")
    return 0 if successes > 0 else 1


if __name__ == "__main__":
    sys.exit(main())
