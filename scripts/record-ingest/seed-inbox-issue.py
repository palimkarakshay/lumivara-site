#!/usr/bin/env python3
"""
seed-inbox-issue.py — conservative self-automation hand-off.

Reads a record-ingest analysis JSON and ONLY when `self_automation_trigger`
is `true` (and the section is not intel-only) opens a `status/needs-triage`
GitHub issue with the operator-owned, urgent action items. From there the
existing Forge triage / plan / execute pipeline decides what (if anything)
ships — the recording pipeline never edits code or sends external messages
directly.

Why this exists separately from `analyze.py`:
  * Keeps the analyser pure (transcript -> JSON, no side effects).
  * Lets the operator dry-run the whole pipeline without touching GitHub.
  * Makes the conservative gate visible and auditable in one file.

Conservatism rules:
  * NEVER seed when `self_automation_trigger` is false.
  * NEVER seed for sections {competitors, research} — those are intel,
    operator decides if any action follows.
  * NEVER seed when the analysis carries an `error` field.
  * NEVER seed when there are zero operator-owned, urgent action items
    (paranoid double-check; analyser should already have set the flag false).
  * Always link the source recording id + transcript path so the triage bot
    can audit-trail back to the immutable transcript.

Env / flags:
  --analysis <path>    required — recordings/analysis/<id>.json
  --section  <name>    required — final section after orchestrator validation
  REPO=palimkarakshay/lumivara-site   (default)
  DRY_RUN=1            print the would-be issue body to stdout, do not call gh
"""
from __future__ import annotations

import argparse
import json
import os
import subprocess
import sys
from pathlib import Path

NO_ACTION_SECTIONS = {"competitors", "research"}


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--analysis", required=True)
    ap.add_argument("--section", required=True)
    args = ap.parse_args()

    analysis = json.loads(Path(args.analysis).read_text())

    if not analysis.get("self_automation_trigger"):
        print("seed-inbox-issue: trigger=false; skipping")
        return 0
    if analysis.get("error"):
        print(f"seed-inbox-issue: analysis carries error '{analysis['error']}'; skipping")
        return 0
    if args.section in NO_ACTION_SECTIONS:
        print(f"seed-inbox-issue: section={args.section} is intel-only; skipping")
        return 0

    operator_items = [
        ai
        for ai in analysis.get("action_items", [])
        if ai.get("owner") == "operator"
        and ai.get("requires_action") is True
        and ai.get("urgency") in {"medium", "high"}
    ]
    if not operator_items:
        print("seed-inbox-issue: no operator-owned urgent items; skipping")
        return 0

    summary = (analysis.get("summary") or "").strip().splitlines()
    title_seed = summary[0] if summary else analysis.get("id", "recording")
    title = f"[recording] {title_seed[:60]}".rstrip()

    body_lines = [
        f"_Auto-seeded by `scripts/record-ingest/` from `{analysis['id']}` "
        f"({args.section})._",
        "",
        f"**Summary:** {analysis.get('summary', '')}",
        "",
        "## Operator-owned action items",
        "",
    ]
    for ai in operator_items:
        body_lines.append(
            f"- [ ] **[{ai.get('urgency', '?')}]** {ai.get('text', '')}"
            f"  _(transcript [{ai.get('ts', '?')}])_"
        )
    body_lines += [
        "",
        "## Source",
        "",
        f"- transcript: `recordings/transcripts/{analysis['id']}.md`",
        f"- analysis:   `recordings/analysis/{analysis['id']}.json`",
        "",
        "_The recording pipeline does not edit code or send external messages_",
        "_directly. This issue lets the existing triage → plan → execute_",
        "_pipeline decide what (if anything) ships. Close with `wontfix` if_",
        "_this is intel only._",
    ]
    body = "\n".join(body_lines)

    if os.environ.get("DRY_RUN") == "1":
        print(f"--- DRY RUN ---\nTITLE: {title}\n\n{body}")
        return 0

    repo = os.environ.get("REPO", "palimkarakshay/lumivara-site")
    cmd = [
        "gh", "issue", "create",
        "--repo", repo,
        "--title", title,
        "--body", body,
        "--label", "status/needs-triage",
        "--label", "source/recording",
    ]
    try:
        subprocess.check_call(cmd)
    except (subprocess.CalledProcessError, FileNotFoundError) as e:
        sys.stderr.write(
            f"!! seed-inbox-issue: gh call failed ({e}); leaving analysis "
            "in place — operator can re-run with `gh issue create` manually.\n"
        )
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
