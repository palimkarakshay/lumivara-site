#!/usr/bin/env python3
"""
Generate a bot-usage report for the rolling 5-hour window and the last
7 days. Designed to surface, at a glance:

  * Which provider is doing the work (Claude / OpenAI-Codex / Gemini).
  * Whether the fallback ladder kicked in (Claude → Codex/Gemini for
    execute, OpenAI → Gemini for review).
  * Whether there's a backlog of work that the bot has to come back to
    later (status/needs-continuation, review-deferred, codex-blockers).
  * How close the operator is to the per-provider 5h rolling cap.

The report is intentionally engine-agnostic on quota numbers — neither
Anthropic, OpenAI, nor Google publishes a programmatic quota-remaining
endpoint at the tier the operator is on, so we infer pressure from
behaviour:

  * High execute-fallback.yml count in last 5h    → Claude under stress
  * Any review-deferred PRs in last 24h           → Codex+Gemini both
                                                    quota-exhausted at
                                                    least once
  * codex-reviewed-by-gemini count > openai count  → Codex preferred
                                                    path is degraded

Outputs:
    Markdown report to stdout (and to $REPORT_OUT if set).

Inputs (env):
    GH_TOKEN          required (gh CLI auth)
    REPO              default: palimkarakshay/lumivara-site
    WINDOW_HOURS      default: 5  (rolling window)
    LOOKBACK_DAYS     default: 7  (weekly window)
    REPORT_OUT        optional path to also write the markdown to

Hallucination guard: every metric is derived from actual `gh api` /
`gh run list` output. The script does not invent counts.
"""
from __future__ import annotations

import json
import os
import subprocess
import sys
from collections import Counter
from datetime import datetime, timedelta, timezone

REPO = os.environ.get("REPO", "palimkarakshay/lumivara-site")

# Workflow → provider mapping. Used to attribute a run to a provider
# *family* even when the workflow internally walks a fallback ladder.
# For ladders we tag the *primary* provider; the fallback signals are
# captured separately via `execute-fallback.yml` and the
# `codex-reviewed-by-gemini` label.
WORKFLOW_PROVIDER = {
    "Triage backlog":                    "claude",
    "Execute backlog item":              "claude",
    "Execute fallback (Codex / Gemini)": "claude-fallback",
    "Plan issues":                       "claude",
    "Codex review (OpenAI gpt-5.5)":     "codex",
    "Codex review recheck (catch missed reviews)": "codex",
    "Apply Codex fixes":                 "codex",
    "Seed Codex review backlog":         "codex",
    "Deep research":                     "gemini",
    "AI smoke test":                     "smoke",
    "Bot usage monitor":                 "monitor",
}

WINDOW_HOURS = int(os.environ.get("WINDOW_HOURS", "5"))
LOOKBACK_DAYS = int(os.environ.get("LOOKBACK_DAYS", "7"))


def _gh_json(*args: str) -> object:
    out = subprocess.check_output(["gh", *args], text=True)
    return json.loads(out) if out.strip() else []


def fetch_runs(since: datetime) -> list[dict]:
    """List all action runs across the repo since `since`."""
    runs: list[dict] = []
    page = 1
    per_page = 100
    while True:
        out = subprocess.check_output(
            ["gh", "api",
             f"repos/{REPO}/actions/runs",
             "--paginate=false",
             "-X", "GET",
             "-f", f"per_page={per_page}",
             "-f", f"page={page}",
             "-f", f"created=>={since.date().isoformat()}"],
            text=True,
        )
        page_data = json.loads(out).get("workflow_runs", [])
        runs.extend(page_data)
        if len(page_data) < per_page or page >= 5:
            break  # Cap pagination to keep this script's runtime bounded.
        page += 1
    # Filter precisely on the timestamp now that we have hour-level data.
    out_runs = []
    for r in runs:
        created = datetime.fromisoformat(r["created_at"].replace("Z", "+00:00"))
        if created >= since:
            out_runs.append(r)
    return out_runs


def fetch_open_pr_labels() -> list[set[str]]:
    rows = _gh_json(
        "pr", "list", "--repo", REPO,
        "--state", "open",
        "--limit", "100",
        "--json", "labels",
    )
    return [{l["name"] for l in pr.get("labels") or []} for pr in rows]


def fetch_open_issue_labels() -> list[set[str]]:
    rows = _gh_json(
        "issue", "list", "--repo", REPO,
        "--state", "open",
        "--limit", "200",
        "--json", "labels",
    )
    return [{l["name"] for l in r.get("labels") or []} for r in rows]


def summarise_runs(runs: list[dict]) -> dict:
    """Aggregate counts by workflow + provider + conclusion."""
    by_workflow = Counter()
    by_provider = Counter()
    failures = Counter()
    fallback_dispatches = 0
    total_minutes = 0.0
    for r in runs:
        wf = r.get("name") or "(unknown)"
        by_workflow[wf] += 1
        provider = WORKFLOW_PROVIDER.get(wf, "other")
        by_provider[provider] += 1
        if wf == "Execute fallback (Codex / Gemini)":
            fallback_dispatches += 1
        if r.get("conclusion") == "failure":
            failures[wf] += 1
        # Duration estimate (run_started_at -> updated_at; not perfect but
        # closest we can get without per-job times).
        try:
            started = datetime.fromisoformat(
                r["run_started_at"].replace("Z", "+00:00"))
            ended = datetime.fromisoformat(
                r["updated_at"].replace("Z", "+00:00"))
            total_minutes += (ended - started).total_seconds() / 60.0
        except Exception:
            pass
    return {
        "by_workflow": by_workflow,
        "by_provider": by_provider,
        "failures": failures,
        "fallback_dispatches": fallback_dispatches,
        "total_minutes": total_minutes,
        "total_runs": len(runs),
    }


def render_markdown(now: datetime, rolling: dict, weekly: dict,
                    pr_labels: list[set[str]],
                    issue_labels: list[set[str]]) -> str:
    review_deferred = sum(1 for l in pr_labels if "review-deferred" in l)
    gemini_reviews = sum(1 for l in pr_labels if "codex-reviewed-by-gemini" in l)
    codex_blockers = sum(1 for l in pr_labels if "codex-blockers" in l)
    needs_continuation = sum(
        1 for l in issue_labels if "status/needs-continuation" in l)
    needs_triage = sum(
        1 for l in issue_labels if "status/needs-triage" in l)

    pressure_signals = []
    if rolling["fallback_dispatches"] >= 3:
        pressure_signals.append(
            f"**Claude under stress** — {rolling['fallback_dispatches']} "
            f"execute-fallback.yml dispatches in the last {WINDOW_HOURS}h "
            f"(threshold ≥ 3). Likely hitting the 5h rolling cap on the "
            f"Max 20x subscription.")
    if review_deferred >= 1:
        pressure_signals.append(
            f"**Both review engines unavailable at least once** — "
            f"{review_deferred} open PR(s) carry `review-deferred`. "
            f"`codex-review-recheck.yml` will retry every 4h.")
    if gemini_reviews > 0 and gemini_reviews >= rolling["by_provider"].get(
            "codex", 0) // 2:
        pressure_signals.append(
            f"**Codex degraded** — {gemini_reviews} PRs reviewed by the "
            f"Gemini fallback. Check the OpenAI billing/quota page.")
    if needs_continuation >= 5:
        pressure_signals.append(
            f"**Backlog growing** — {needs_continuation} issues labelled "
            f"`status/needs-continuation` (work that timed out and needs "
            f"the bot to come back to it).")
    if not pressure_signals:
        pressure_signals.append(
            "**No quota pressure detected.** All providers operating in "
            "their normal range.")

    def fmt_counter(c: Counter) -> str:
        if not c:
            return "_(none)_"
        rows = [f"  - `{k}` × **{v}**" for k, v in c.most_common()]
        return "\n".join(rows)

    parts = [
        "# Bot usage report",
        "",
        f"_Generated {now.isoformat()}_",
        "",
        "## Pressure signals",
        "",
        *(f"- {s}" for s in pressure_signals),
        "",
        f"## Rolling {WINDOW_HOURS}h window — last {WINDOW_HOURS} hours",
        "",
        f"- Total runs: **{rolling['total_runs']}**",
        f"- Total runtime: **{rolling['total_minutes']:.0f} min**",
        f"- Fallback dispatches (Claude→Codex/Gemini): "
        f"**{rolling['fallback_dispatches']}**",
        "",
        "**By provider**",
        "",
        fmt_counter(rolling["by_provider"]),
        "",
        "**By workflow**",
        "",
        fmt_counter(rolling["by_workflow"]),
        "",
        "**Failures**",
        "",
        fmt_counter(rolling["failures"]),
        "",
        f"## Weekly window — last {LOOKBACK_DAYS} days",
        "",
        f"- Total runs: **{weekly['total_runs']}**",
        f"- Total runtime: **{weekly['total_minutes']:.0f} min**",
        f"- Fallback dispatches: **{weekly['fallback_dispatches']}**",
        "",
        "**By provider**",
        "",
        fmt_counter(weekly["by_provider"]),
        "",
        "**By workflow**",
        "",
        fmt_counter(weekly["by_workflow"]),
        "",
        "## Review pipeline health",
        "",
        f"- Open PRs labelled `review-deferred`: **{review_deferred}**",
        f"- Open PRs labelled `codex-reviewed-by-gemini` "
        f"(OpenAI was down at review time): **{gemini_reviews}**",
        f"- Open PRs labelled `codex-blockers` "
        f"(consistency findings gating auto-merge): **{codex_blockers}**",
        "",
        "## Backlog health",
        "",
        f"- Issues `status/needs-continuation`: **{needs_continuation}**",
        f"- Issues `status/needs-triage`: **{needs_triage}**",
        "",
        "---",
        "",
        "_Generated by `scripts/bot-usage-report.py`. The next run "
        f"({WINDOW_HOURS}h cadence) will overwrite this comment in "
        "place — check the issue history for older snapshots._",
    ]
    return "\n".join(parts)


def main() -> int:
    now = datetime.now(timezone.utc)
    rolling_since = now - timedelta(hours=WINDOW_HOURS)
    weekly_since = now - timedelta(days=LOOKBACK_DAYS)

    weekly_runs = fetch_runs(weekly_since)
    rolling_runs = [
        r for r in weekly_runs
        if datetime.fromisoformat(r["created_at"].replace("Z", "+00:00"))
        >= rolling_since
    ]

    rolling = summarise_runs(rolling_runs)
    weekly = summarise_runs(weekly_runs)

    pr_labels = fetch_open_pr_labels()
    issue_labels = fetch_open_issue_labels()

    md = render_markdown(now, rolling, weekly, pr_labels, issue_labels)
    print(md)
    out_path = os.environ.get("REPORT_OUT")
    if out_path:
        with open(out_path, "w") as f:
            f.write(md)
    return 0


if __name__ == "__main__":
    sys.exit(main())
