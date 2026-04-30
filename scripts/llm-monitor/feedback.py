#!/usr/bin/env python3
"""
Feedback step — turns analyzer output into bot-readable artifacts.

Two outputs:

  1. **KNOWN_ISSUES.md rewrite** — the AUTO-START..AUTO-END section of
     `docs/mothership/llm-monitor/KNOWN_ISSUES.md` is replaced with the
     last-14-days roll-up of severity ≥ 4 records, deduped by
     `dedupe_group`. Triage / plan / execute prompts ingest this file
     so every bot run starts from current field reports.

  2. **Auto-discovered GitHub issues** — for severity ≥ 4 records that
     are `kind: bug` AND have an `action_hint`, file an issue with
     labels `auto-discovered` + `infra-allowed`. The existing
     triage/plan/execute pipeline picks them up like any backlog item.
     Dedupes against existing open issues by checking the dedupe_group
     slug in the title.

Both outputs are idempotent — re-running with the same analyzer file
should be a no-op for KNOWN_ISSUES.md (byte-identical) and skip-create
for issues (matched by title slug).
"""
from __future__ import annotations

import argparse
import json
import os
import re
import subprocess
from datetime import datetime, timedelta, timezone
from pathlib import Path

REPO = os.environ.get("REPO", "palimkarakshay/lumivara-site")
ROOT = Path(__file__).resolve().parents[2]
KNOWN_ISSUES = ROOT / "docs" / "mothership" / "llm-monitor" / "KNOWN_ISSUES.md"
AUTO_START = "<!-- AUTO-START — everything below is rewritten by feedback.py -->"
AUTO_END = "<!-- AUTO-END -->"
ROLLUP_DAYS = 14
TITLE_PREFIX = "[llm-monitor]"


def _parse_iso(s: str) -> datetime:
    if not s:
        return datetime.now(timezone.utc)
    try:
        return datetime.fromisoformat(s.replace("Z", "+00:00"))
    except ValueError:
        return datetime.now(timezone.utc)


def _slug(s: str) -> str:
    s = re.sub(r"[^a-z0-9]+", "-", (s or "").lower()).strip("-")
    return s[:60] or "unknown"


def _dedupe_groups(records: list[dict], originals: dict) -> list[dict]:
    """Keep one canonical record per dedupe_group — the highest severity,
    breaking ties on novelty. Returns a list sorted by severity desc."""
    by_group: dict[str, dict] = {}
    for r in records:
        if r.get("severity", 0) < 4:
            continue
        if r.get("kind") == "noise":
            continue
        g = r.get("dedupe_group") or r.get("id")
        cur = by_group.get(g)
        if cur is None:
            by_group[g] = r
            continue
        if (r.get("severity", 0), r.get("novelty", 0)) > (
            cur.get("severity", 0), cur.get("novelty", 0)
        ):
            by_group[g] = r
    return sorted(
        by_group.values(),
        key=lambda r: (r.get("severity", 0), r.get("novelty", 0)),
        reverse=True,
    )


def render_known_issues(records: list[dict], originals: dict, today: datetime | None = None) -> str:
    today = today or datetime.now(timezone.utc)
    cutoff = today - timedelta(days=ROLLUP_DAYS)
    fresh = []
    for r in _dedupe_groups(records, originals):
        orig = originals.get(r["id"], {})
        ts = _parse_iso(orig.get("ts", ""))
        if ts < cutoff:
            continue
        fresh.append((r, orig, ts))

    lines: list[str] = ["", "## Auto-discovered (last 14 days)", ""]
    if not fresh:
        lines.append("_No high-signal items in the rolling window._")
        lines.append("")
        return "\n".join(lines)

    by_subject: dict[str, list] = {}
    for r, orig, ts in fresh:
        by_subject.setdefault(r.get("subject", "general"), []).append((r, orig, ts))

    for subj, items in by_subject.items():
        lines.append(f"### {subj}")
        lines.append("")
        for r, orig, ts in items:
            sev = r.get("severity", 0)
            kind = r.get("kind", "?")
            summary = (r.get("summary") or orig.get("title") or "").strip()
            url = orig.get("url", "")
            line = f"- **[sev {sev} · {kind}]** {summary}"
            if url:
                line += f" ([source]({url}))"
            lines.append(line)
            if r.get("action_hint"):
                lines.append(f"  - Action: {r['action_hint']}")
        lines.append("")
    return "\n".join(lines)


def update_known_issues(content: str) -> bool:
    """Splice `content` between AUTO-START and AUTO-END markers. Returns
    True if the file changed."""
    if not KNOWN_ISSUES.exists():
        return False
    current = KNOWN_ISSUES.read_text()
    if AUTO_START not in current or AUTO_END not in current:
        # Markers missing — refuse to rewrite blindly.
        return False
    pre, _, rest = current.partition(AUTO_START)
    _, _, post = rest.partition(AUTO_END)
    new = pre + AUTO_START + "\n" + content.rstrip() + "\n\n" + AUTO_END + post
    if new == current:
        return False
    KNOWN_ISSUES.write_text(new)
    return True


def _list_open_auto_issues() -> set[str]:
    """Return set of dedupe-slugs already represented by an open issue.
    Slug is encoded in the title as TITLE_PREFIX <slug> ...."""
    try:
        out = subprocess.check_output(
            ["gh", "issue", "list", "--repo", REPO,
             "--state", "open", "--label", "auto-discovered",
             "--limit", "200", "--json", "title"],
            text=True, stderr=subprocess.PIPE,
        )
        items = json.loads(out)
    except (subprocess.CalledProcessError, json.JSONDecodeError):
        return set()
    slugs = set()
    for it in items:
        m = re.match(rf"{re.escape(TITLE_PREFIX)}\s+([a-z0-9-]+)", it.get("title", ""))
        if m:
            slugs.add(m.group(1))
    return slugs


def open_issues_for_high_signal(records: list[dict], originals: dict, dry_run: bool = False) -> list[str]:
    """File one GitHub issue per dedupe_group for severity ≥ 4 bugs with
    an action_hint. Skips groups already represented by an open issue.
    Returns the list of slugs filed."""
    existing = _list_open_auto_issues() if not dry_run else set()
    filed: list[str] = []
    for r in _dedupe_groups(records, originals):
        if r.get("kind") != "bug":
            continue
        if not r.get("action_hint"):
            continue
        slug = _slug(r.get("dedupe_group") or r.get("id"))
        if slug in existing or slug in filed:
            continue
        orig = originals.get(r["id"], {})
        title = f"{TITLE_PREFIX} {slug} — {(r.get('summary') or orig.get('title') or '')[:120]}"
        body_lines = [
            f"_Auto-filed by `scripts/llm-monitor/feedback.py` from a "
            f"severity-{r.get('severity', 0)} signal._",
            "",
            f"**Subject**: `{r.get('subject', 'general')}`  ",
            f"**Kind**: `{r.get('kind')}`  ",
            f"**Source**: [{orig.get('source', '?')}]({orig.get('url', '')})  ",
            f"**Dedupe group**: `{r.get('dedupe_group', slug)}`",
            "",
            f"### Summary",
            "",
            r.get("summary", "(no summary)"),
            "",
            f"### Suggested action",
            "",
            r.get("action_hint", "(none)"),
            "",
            f"### Why this fired",
            "",
            "Multiple field reports flagged this in the last 36 hours. "
            "If reproducible against this codebase, triage normally; "
            "otherwise close as `wontfix` and note why so the dedupe "
            "group is suppressed on future runs.",
            "",
            "---",
            "_Labels are pre-set: `auto-discovered`, `infra-allowed` "
            "(operator-pipeline scope, exempt from Pattern C site-only rule)._",
        ]
        body = "\n".join(body_lines)

        if dry_run:
            filed.append(slug)
            continue

        try:
            subprocess.check_call(
                ["gh", "issue", "create", "--repo", REPO,
                 "--title", title, "--body", body,
                 "--label", "auto-discovered",
                 "--label", "infra-allowed",
                 "--label", "status/needs-triage"],
                stdout=subprocess.DEVNULL,
            )
            filed.append(slug)
        except subprocess.CalledProcessError as e:
            print(f"[feedback] failed to file issue {slug}: {e}", flush=True)
    return filed


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--analyzer-output", required=True)
    ap.add_argument("--dry-run", action="store_true",
                    help="Don't call gh; just compute outputs")
    ap.add_argument("--no-issues", action="store_true",
                    help="Update KNOWN_ISSUES.md but don't file GitHub issues")
    args = ap.parse_args()

    with open(args.analyzer_output) as fh:
        data = json.load(fh)

    records = data.get("records", [])
    originals = data.get("originals_by_id", {})

    body = render_known_issues(records, originals)
    changed = update_known_issues(body)
    print(f"[feedback] KNOWN_ISSUES.md changed: {changed}")

    if not args.no_issues:
        filed = open_issues_for_high_signal(records, originals, dry_run=args.dry_run)
        print(f"[feedback] issues filed: {len(filed)} {filed}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
