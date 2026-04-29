#!/usr/bin/env python3
"""
Seed the backlog with one "Codex consistency review" issue per
already-merged PR that hasn't been reviewed by Codex yet.

The user's intent: every merged PR — past and future — should pass
through Codex's consistency lens at least once. New PRs get reviewed
inline by `codex-review.yml` on the `pull_request` trigger. This script
fills the backlog gap for PRs that were merged BEFORE that trigger
existed.

Behaviour
---------
- Lists merged PRs in the repo, oldest-newest, optionally limited.
- For each PR:
  * Skips PRs already labelled `codex-reviewed` (review happened inline).
  * Skips PRs that already have a backlog issue tracking the review
    (detected by exact title match: `Codex review: PR #<N> — <title>`).
  * Otherwise creates a new issue with labels:
      `status/needs-triage`, `model/codex`, `type/code-review`.
    Triage will assign priority/area/etc on its next run; the bot's
    execute path then dispatches `codex-review.yml` with the right PR
    context because the issue body contains "PR #<N>".
- Default: dry-run. Pass `--apply` to actually create issues.
- Hallucination guard: this script ONLY reads PRs that the GitHub API
  returns. It does not invent numbers or titles.

Usage
-----
  GH_TOKEN=... python3 scripts/seed-codex-review-backlog.py [--apply] \
                                                            [--limit N] \
                                                            [--since YYYY-MM-DD]

Examples:
  # Preview what would be created (no changes):
  GH_TOKEN=$(gh auth token) python3 scripts/seed-codex-review-backlog.py
  # Actually seed up to 25 issues, only for PRs merged in the last 90 days:
  GH_TOKEN=$(gh auth token) python3 scripts/seed-codex-review-backlog.py \
      --apply --limit 25 --since 2026-01-29
"""
from __future__ import annotations

import argparse
import json
import subprocess
import sys
from datetime import datetime, timezone

REPO = "palimkarakshay/lumivara-site"


def _gh(*args: str) -> str:
    return subprocess.check_output(["gh", *args], text=True)


def list_merged_prs(limit: int) -> list[dict]:
    out = _gh(
        "pr", "list", "--repo", REPO,
        "--state", "merged",
        "--limit", str(limit),
        "--json", "number,title,mergedAt,labels,url",
    )
    return json.loads(out)


def existing_review_issue_titles() -> set[str]:
    """Return the set of titles for any open OR closed backlog issue
    that already tracks a Codex review (so we don't re-seed)."""
    out = _gh(
        "issue", "list", "--repo", REPO,
        "--state", "all",
        "--search", "in:title \"Codex review: PR #\"",
        "--limit", "500",
        "--json", "title",
    )
    return {row["title"] for row in json.loads(out)}


def make_issue_body(pr: dict) -> str:
    return (
        f"PR #{pr['number']} — {pr['title']}\n\n"
        f"Link: {pr['url']}\n"
        f"Merged at: {pr['mergedAt']}\n\n"
        "## Goal\n"
        "Run a Codex consistency review on this already-merged PR. The "
        "PR pre-dates the inline `codex-review.yml` `pull_request` "
        "trigger, so it never went through the consistency check. Triage "
        "should assign `priority/P3` (no time pressure) unless the PR "
        "touched a high-stakes area, in which case bump to P2.\n\n"
        "## How the bot will execute this\n"
        "Triage will route this issue via `model/codex` →"
        " `codex-review.yml`, which detects the `PR #N` reference in the "
        "issue body, fetches the PR diff, and posts the review on BOTH "
        "this issue and the PR.\n\n"
        "## Definition of done\n"
        "- [ ] Codex review comment posted on PR "
        f"#{pr['number']}\n"
        "- [ ] Any blocker/major consistency findings filed as their own "
        "follow-up issues (one each, with `status/needs-triage`).\n"
        "- [ ] This issue closed once the above are filed.\n\n"
        "_Seeded by `scripts/seed-codex-review-backlog.py`. The script "
        "verifies the PR exists via the GitHub API before creating this "
        "issue — no hallucinated PR numbers._\n"
    )


def main() -> int:
    p = argparse.ArgumentParser()
    p.add_argument("--apply", action="store_true",
                   help="Actually create issues (default: dry-run)")
    p.add_argument("--limit", type=int, default=50,
                   help="Max merged PRs to scan (default: 50)")
    p.add_argument("--since", type=str, default="",
                   help="Only PRs merged on or after YYYY-MM-DD")
    p.add_argument("--max-create", type=int, default=25,
                   help="Cap how many new issues to create in one run "
                        "(default: 25, matches triage-prompt.md cap)")
    args = p.parse_args()

    since_dt: datetime | None = None
    if args.since:
        since_dt = datetime.strptime(args.since, "%Y-%m-%d") \
            .replace(tzinfo=timezone.utc)

    prs = list_merged_prs(args.limit)
    seen = existing_review_issue_titles()

    to_seed: list[dict] = []
    for pr in prs:
        labels = {l["name"] for l in pr.get("labels") or []}
        if "codex-reviewed" in labels:
            continue
        if since_dt:
            merged = datetime.fromisoformat(
                pr["mergedAt"].replace("Z", "+00:00")
            )
            if merged < since_dt:
                continue
        title = f"Codex review: PR #{pr['number']} — {pr['title']}"
        if title in seen:
            continue
        to_seed.append({"pr": pr, "title": title})
        if len(to_seed) >= args.max_create:
            break

    print(f"Found {len(to_seed)} PR(s) needing a backlog issue.")
    for item in to_seed:
        print(f"  - PR #{item['pr']['number']}: {item['pr']['title']}")

    if not args.apply:
        print("\nDry-run. Pass --apply to create the issues.")
        return 0

    created = 0
    for item in to_seed:
        body = make_issue_body(item["pr"])
        try:
            _gh(
                "issue", "create", "--repo", REPO,
                "--title", item["title"],
                "--body", body,
                "--label", "status/needs-triage",
                "--label", "model/codex",
                "--label", "type/code-review",
            )
            created += 1
            print(f"  created: {item['title']}")
        except subprocess.CalledProcessError as e:
            print(f"  FAILED to create issue for PR "
                  f"#{item['pr']['number']}: {e}", file=sys.stderr)

    print(f"\nCreated {created}/{len(to_seed)} backlog issues.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
