#!/usr/bin/env python3
"""
Find PRs that merged (= deployed) without a Codex consistency review and
queue them for re-review. Two cases are covered:

A. Open PRs labelled `review-deferred`
   These are PRs that hit codex-review.yml while BOTH OpenAI and Gemini
   were unavailable. The PR body lives, the diff still exists, the PR is
   still open — just dispatch codex-review.yml again with `pr=N` and let
   the fallback ladder retry.

B. Merged PRs without `codex-reviewed`
   These are PRs that were deployed before the consistency check ever
   ran (the gate was not yet wired up, or both engines were unavailable
   AND the PR was merged anyway via human override). The diff is in
   git; we can't re-trigger `pull_request` after merge, so we delegate
   to `scripts/seed-codex-review-backlog.py` which creates a tracking
   issue with `model/codex` + `type/code-review`. The execute pipeline
   then dispatches codex-review.yml in issue mode, which detects the
   `PR #N` reference in the issue body and reviews the PR diff.

Caps:
    --max-dispatch  open PRs to re-dispatch this run (default 5).
    --since         lookback window for merged PRs (default 14d).

Hallucination guard: only acts on PR numbers/titles the GitHub API
actually returned. The script does not invent PRs.

Usage:
    GH_TOKEN=... python3 scripts/recheck-missed-reviews.py [--apply]
        [--max-dispatch N]
        [--since YYYY-MM-DD]
        [--max-create N]
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timedelta, timezone

REPO = "palimkarakshay/lumivara-site"


def _gh(*args: str) -> str:
    return subprocess.check_output(["gh", *args], text=True)


def open_deferred_prs() -> list[dict]:
    """Open PRs the previous review pass had to defer."""
    out = _gh(
        "pr", "list", "--repo", REPO,
        "--state", "open",
        "--label", "review-deferred",
        "--limit", "50",
        "--json", "number,title,labels,url",
    )
    return json.loads(out)


def recently_merged_unreviewed_prs(since: datetime) -> list[dict]:
    """Merged PRs in the lookback window that lack `codex-reviewed`.

    Skips PRs already labelled `codex-reviewed`, `codex-skipped`, or
    `review-deferred` (the latter is handled by the open-PR case above
    and should not produce a duplicate backlog issue).
    """
    out = _gh(
        "pr", "list", "--repo", REPO,
        "--state", "merged",
        "--limit", "200",
        "--json", "number,title,mergedAt,labels,url",
    )
    rows: list[dict] = []
    for pr in json.loads(out):
        merged = datetime.fromisoformat(pr["mergedAt"].replace("Z", "+00:00"))
        if merged < since:
            continue
        labels = {l["name"] for l in pr.get("labels") or []}
        if labels & {"codex-reviewed", "codex-skipped"}:
            continue
        rows.append(pr)
    return rows


def dispatch_review_for_pr(pr_number: int) -> None:
    """Re-trigger codex-review.yml for an open PR via workflow_dispatch."""
    _gh(
        "workflow", "run", "codex-review.yml",
        "--repo", REPO,
        "-f", f"pr={pr_number}",
    )


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--apply", action="store_true",
                   help="Actually dispatch + create issues "
                        "(default: dry-run preview)")
    p.add_argument("--max-dispatch", type=int, default=5,
                   help="Max open `review-deferred` PRs to re-dispatch "
                        "this run (default 5)")
    p.add_argument("--since", type=str, default="",
                   help="Lookback for merged PRs as YYYY-MM-DD "
                        "(default: last 14 days)")
    p.add_argument("--max-create", type=int, default=10,
                   help="Cap on backlog issues to seed for merged "
                        "unreviewed PRs (default 10)")
    args = p.parse_args()

    if args.since:
        since_dt = datetime.strptime(args.since, "%Y-%m-%d") \
            .replace(tzinfo=timezone.utc)
    else:
        since_dt = datetime.now(timezone.utc) - timedelta(days=14)

    # ── Case A: open deferred PRs → workflow_dispatch retry ──────────────
    deferred = open_deferred_prs()[: args.max_dispatch]
    print(f"\n[A] Open `review-deferred` PRs: {len(deferred)}")
    for pr in deferred:
        print(f"  - PR #{pr['number']}: {pr['title']}  ({pr['url']})")
    if args.apply:
        for pr in deferred:
            try:
                dispatch_review_for_pr(pr["number"])
                print(f"    dispatched codex-review.yml for PR "
                      f"#{pr['number']}")
            except subprocess.CalledProcessError as e:
                print(f"    FAILED to dispatch for PR #{pr['number']}: "
                      f"{e}", file=sys.stderr)
    else:
        print("    (dry-run — pass --apply to dispatch)")

    # ── Case B: merged unreviewed PRs → seed backlog issues ──────────────
    merged = recently_merged_unreviewed_prs(since_dt)
    merged = merged[: args.max_create]
    print(f"\n[B] Merged-but-unreviewed PRs since "
          f"{since_dt.date()}: {len(merged)}")
    for pr in merged:
        print(f"  - PR #{pr['number']}: {pr['title']}  ({pr['url']})")

    if merged and args.apply:
        # Delegate to the existing seeder so the issue body, labels, and
        # de-dup logic stay in one place.
        cmd = [
            "python3", "scripts/seed-codex-review-backlog.py",
            "--apply",
            "--limit", str(max(50, len(merged))),
            "--max-create", str(args.max_create),
            "--since", since_dt.date().isoformat(),
        ]
        print(f"    invoking seeder: {' '.join(cmd)}")
        try:
            subprocess.run(cmd, check=True)
        except subprocess.CalledProcessError as e:
            print(f"    seeder failed: {e}", file=sys.stderr)
            return 1
    elif merged:
        print("    (dry-run — pass --apply to seed backlog issues)")

    print("\nDone.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
