#!/usr/bin/env python3
"""
Generate the weekly backlog digest — the operator's Monday-morning brief.

This is a *narrative* counterpart to `bot-usage-report.py`:

  * `bot-usage-report.py` answers "is the bot healthy / am I hitting
    quota?" — provider-centric observability, runs every 30 min.
  * `backlog-digest.py` answers "what shipped, what's stuck, what's
    queued?" — issue/PR-motion summary, runs Monday 08:00 UTC.

The two are complementary: bot-usage-report is the dashboard, this is
the executive summary. Both upsert a single pinned issue rather than
spamming new ones; both carry `do-not-triage` so the triage bot skips
them.

Hallucination guard: every figure is derived from `gh api` /
`gh issue list` / `gh pr list` output. Nothing is invented.

Inputs (env):
    GH_TOKEN          required (gh CLI auth)
    REPO              default: palimkarakshay/lumivara-site
    LOOKBACK_DAYS     default: 7   (one week)
    STUCK_PR_DAYS     default: 5   (PR open longer than this is "stuck")
    REPORT_OUT        optional path to also write the markdown to
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from collections import Counter
from datetime import datetime, timedelta, timezone

REPO = os.environ.get("REPO", "palimkarakshay/lumivara-site")
LOOKBACK_DAYS = int(os.environ.get("LOOKBACK_DAYS", "7"))
STUCK_PR_DAYS = int(os.environ.get("STUCK_PR_DAYS", "5"))


def _gh_json(*args: str) -> list[dict]:
    out = subprocess.check_output(["gh", *args], text=True)
    return json.loads(out) if out.strip() else []


def _parse_ts(s: str) -> datetime:
    return datetime.fromisoformat(s.replace("Z", "+00:00"))


def fetch_recent_prs(since: datetime) -> list[dict]:
    """Closed/merged PRs in the lookback window plus all currently open PRs."""
    merged = _gh_json(
        "pr", "list", "--repo", REPO,
        "--state", "merged",
        "--limit", "100",
        "--search", f"merged:>={since.date().isoformat()}",
        "--json", "number,title,author,labels,mergedAt,createdAt,url",
    )
    open_prs = _gh_json(
        "pr", "list", "--repo", REPO,
        "--state", "open",
        "--limit", "100",
        "--json", "number,title,author,labels,createdAt,url,isDraft",
    )
    return merged, open_prs


def fetch_recent_issues(since: datetime) -> tuple[list[dict], list[dict], list[dict]]:
    """Issues opened-this-week, closed-this-week, and all currently open."""
    opened = _gh_json(
        "issue", "list", "--repo", REPO,
        "--state", "all",
        "--limit", "200",
        "--search", f"created:>={since.date().isoformat()}",
        "--json", "number,title,labels,createdAt,closedAt,state,url",
    )
    closed = _gh_json(
        "issue", "list", "--repo", REPO,
        "--state", "closed",
        "--limit", "200",
        "--search", f"closed:>={since.date().isoformat()}",
        "--json", "number,title,labels,createdAt,closedAt,url",
    )
    open_now = _gh_json(
        "issue", "list", "--repo", REPO,
        "--state", "open",
        "--limit", "300",
        "--json", "number,title,labels,createdAt,url",
    )
    return opened, closed, open_now


def label_set(item: dict) -> set[str]:
    return {l["name"] for l in item.get("labels") or []}


def has_any(item: dict, prefixes: tuple[str, ...]) -> str | None:
    for name in label_set(item):
        for p in prefixes:
            if name.startswith(p):
                return name
    return None


def days_open(item: dict, now: datetime) -> float:
    return (now - _parse_ts(item["createdAt"])).total_seconds() / 86400.0


def author_kind(pr: dict) -> str:
    login = (pr.get("author") or {}).get("login") or ""
    if login.endswith("[bot]") or login in {"github-actions", "claude"}:
        return "bot"
    return "human"


def format_pr_line(pr: dict) -> str:
    n = pr["number"]
    title = pr["title"].replace("|", "\\|")
    return f"- [#{n}]({pr['url']}) — {title}"


def format_issue_line(issue: dict) -> str:
    n = issue["number"]
    title = issue["title"].replace("|", "\\|")
    pri = has_any(issue, ("priority/",)) or "—"
    return f"- [#{n}]({issue['url']}) `{pri}` — {title}"


def render(now: datetime,
           merged_prs: list[dict],
           open_prs: list[dict],
           opened_issues: list[dict],
           closed_issues: list[dict],
           open_issues: list[dict]) -> str:
    since = now - timedelta(days=LOOKBACK_DAYS)

    # Shipped — merged PRs, split by author kind for at-a-glance attribution.
    bot_merged = [p for p in merged_prs if author_kind(p) == "bot"]
    human_merged = [p for p in merged_prs if author_kind(p) == "human"]

    # Closed issues — split into "closed via merged PR" vs "closed manually".
    # GitHub doesn't expose the closer directly; we approximate: an issue
    # closed within 30 min of a PR-merge for the same number-mention is
    # likely auto-closed. The simpler approximation we use here: count, and
    # note that merged-PR-count gives an upper bound on auto-closes.
    closed_count = len(closed_issues)
    closed_p1 = [i for i in closed_issues if has_any(i, ("priority/P1",))]

    # Stuck — PRs open longer than STUCK_PR_DAYS, plus operator-attention labels.
    stuck_old_prs = [
        p for p in open_prs
        if not p.get("isDraft") and days_open(p, now) >= STUCK_PR_DAYS
    ]
    review_deferred = [p for p in open_prs if "review-deferred" in label_set(p)]
    codex_blockers = [p for p in open_prs if "codex-blockers" in label_set(p)]
    needs_continuation = [
        i for i in open_issues if "status/needs-continuation" in label_set(i)
    ]
    needs_clarification = [
        i for i in open_issues if "status/needs-clarification" in label_set(i)
    ]

    # Queue health — open issues by priority + ready-for-execute count.
    pri_counts = Counter()
    area_counts = Counter()
    auto_routine_ready = 0
    for issue in open_issues:
        pri = has_any(issue, ("priority/",))
        if pri:
            pri_counts[pri] += 1
        area = has_any(issue, ("area/",))
        if area:
            area_counts[area] += 1
        labels = label_set(issue)
        if (
            "auto-routine" in labels
            and "status/planned" in labels
            and "manual-only" not in labels
            and "status/on-hold" not in labels
        ):
            auto_routine_ready += 1

    # Notable — P1 movement this week.
    p1_opened = [
        i for i in opened_issues if has_any(i, ("priority/P1",)) and i["state"] == "open"
    ]
    p1_closed = closed_p1

    # Pattern C state — single tracking issue from pattern-c-watcher.yml.
    pattern_c_state = "_no tracking issue found (watcher last run was green)_"
    for i in open_issues:
        if i["title"] == "Pattern C watcher: drift detected":
            pattern_c_state = (
                f"⚠ open: [#{i['number']}]({i['url']}) "
                f"({days_open(i, now):.1f}d)"
            )
            break

    def section(title: str, lines: list[str], empty: str = "_(none)_") -> list[str]:
        body = lines if lines else [empty]
        return [f"## {title}", "", *body, ""]

    parts: list[str] = [
        "# Backlog digest — Monday brief",
        "",
        f"_Window: {since.date().isoformat()} → {now.date().isoformat()} "
        f"({LOOKBACK_DAYS} days). Generated {now.isoformat()}._",
        "",
        "_Companion to `bot-usage-monitor.yml` (provider/quota dashboard). "
        "This issue is rewritten each Monday — check the issue history for "
        "previous weeks._",
        "",
        "## At a glance",
        "",
        f"- **Shipped:** {len(merged_prs)} PRs merged "
        f"({len(bot_merged)} bot · {len(human_merged)} human)",
        f"- **Issues closed:** {closed_count} "
        f"({len(closed_p1)} P1)",
        f"- **Issues opened:** {len(opened_issues)} "
        f"({len(p1_opened)} new P1 still open)",
        f"- **Open PRs:** {len(open_prs)} "
        f"({len(stuck_old_prs)} ≥{STUCK_PR_DAYS}d old, "
        f"{len(review_deferred)} review-deferred, "
        f"{len(codex_blockers)} codex-blockers)",
        f"- **Open issues:** {len(open_issues)} "
        f"({auto_routine_ready} `auto-routine` ready for execute)",
        f"- **Pattern C watcher:** {pattern_c_state}",
        "",
    ]

    parts += section(
        f"Shipped this week ({len(merged_prs)})",
        [format_pr_line(p) for p in sorted(
            merged_prs, key=lambda p: p.get("mergedAt") or "", reverse=True)[:25]]
        + ([f"_…and {len(merged_prs) - 25} more_"] if len(merged_prs) > 25 else []),
    )

    parts += section(
        f"Notable — P1 motion ({len(p1_opened)} opened, {len(p1_closed)} closed)",
        [
            *(["**Opened (still open):**"] if p1_opened else []),
            *[format_issue_line(i) for i in p1_opened],
            *(["", "**Closed:**"] if p1_closed else []),
            *[format_issue_line(i) for i in p1_closed],
        ],
    )

    parts += section(
        f"Stuck — needs operator attention ({len(stuck_old_prs) + len(review_deferred) + len(needs_continuation) + len(needs_clarification)})",
        [
            *([f"**PRs open ≥ {STUCK_PR_DAYS}d ({len(stuck_old_prs)})**"] if stuck_old_prs else []),
            *[f"  {format_pr_line(p)} ({days_open(p, now):.0f}d)"
              for p in stuck_old_prs[:10]],
            *(["", f"**PRs review-deferred ({len(review_deferred)})**"] if review_deferred else []),
            *[f"  {format_pr_line(p)}" for p in review_deferred[:10]],
            *(["", f"**Issues `status/needs-continuation` ({len(needs_continuation)})**"]
              if needs_continuation else []),
            *[f"  {format_issue_line(i)}" for i in needs_continuation[:10]],
            *(["", f"**Issues `status/needs-clarification` ({len(needs_clarification)})**"]
              if needs_clarification else []),
            *[f"  {format_issue_line(i)}" for i in needs_clarification[:10]],
        ],
        empty="✓ no stuck items.",
    )

    pri_lines = [f"- `{k}` × **{v}**" for k, v in sorted(pri_counts.items())]
    area_lines = [f"- `{k}` × **{v}**" for k, v in area_counts.most_common(10)]
    parts += section(
        "Queue health",
        [
            f"- Auto-routine + planned + cron-eligible: **{auto_routine_ready}**",
            "",
            "**By priority**",
            *(pri_lines or ["_(no priority labels found)_"]),
            "",
            "**By area (top 10)**",
            *(area_lines or ["_(no area labels found)_"]),
        ],
    )

    parts += [
        "---",
        "",
        "_Generated by `scripts/backlog-digest.py` via "
        "`.github/workflows/backlog-digest.yml` (weekly, Mon 08:00 UTC). "
        "Cross-references: `bot-usage-monitor.yml` (provider dashboard), "
        "`pattern-c-watcher.yml` (charter drift), "
        "`docs/ops/automation-map.md` (cron catalog)._",
    ]
    return "\n".join(parts)


def main() -> int:
    now = datetime.now(timezone.utc)
    since = now - timedelta(days=LOOKBACK_DAYS)

    merged_prs, open_prs = fetch_recent_prs(since)
    opened_issues, closed_issues, open_issues = fetch_recent_issues(since)

    md = render(now, merged_prs, open_prs, opened_issues, closed_issues, open_issues)
    print(md)

    out_path = os.environ.get("REPORT_OUT")
    if out_path:
        with open(out_path, "w") as f:
            f.write(md)
    return 0


if __name__ == "__main__":
    sys.exit(main())
