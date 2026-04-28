"""Print the same drift inventory the /admin/deployments page would show.

Operator-side CLI. Useful when the admin Next app isn't running locally
(e.g. you're at a terminal and just want to know "what's pending").

Usage:

    GITHUB_TOKEN=... GITHUB_REPO=palimkarakshay/lumivara-site \\
    VERCEL_API_TOKEN=... VERCEL_PROJECT_ID=... VERCEL_TEAM_ID=... \\
    python3 scripts/lib/inventory_backfill.py

Reads no local repo state; talks only to the GitHub and Vercel APIs.
Output is a single-table report — pipe into `column -t -s'|'` for
prettier formatting.
"""
from __future__ import annotations

import json
import os
import re
import sys
import urllib.parse
import urllib.request
from typing import Iterable

DEPLOYABLE_RE = re.compile(
    r"^(src/|public/|package\.json|next\.config|tailwind\.config|postcss\.config)"
)
PR_SUBJECT_RE = re.compile(r"\(#(\d+)\)\s*$")


def _get_json(url: str, headers: dict[str, str]) -> dict | list:
    req = urllib.request.Request(url, headers=headers)
    with urllib.request.urlopen(req, timeout=20) as resp:
        return json.loads(resp.read())


def _gh_headers() -> dict[str, str]:
    token = os.environ.get("GITHUB_TOKEN", "").strip()
    if not token:
        raise SystemExit("GITHUB_TOKEN is required.")
    return {
        "Authorization": f"Bearer {token}",
        "Accept": "application/vnd.github+json",
        "X-GitHub-Api-Version": "2022-11-28",
    }


def _repo() -> str:
    repo = os.environ.get("GITHUB_REPO", "").strip()
    if not repo or "/" not in repo:
        raise SystemExit("GITHUB_REPO must be 'owner/name'.")
    return repo


def latest_prod_sha() -> str | None:
    token = os.environ.get("VERCEL_API_TOKEN", "").strip()
    if not token:
        print("VERCEL_API_TOKEN not set — cannot detect drift.", file=sys.stderr)
        return None
    params = {"limit": "10", "target": "production"}
    for env_key, api_key in (
        ("VERCEL_PROJECT_ID", "projectId"),
        ("VERCEL_TEAM_ID", "teamId"),
    ):
        v = os.environ.get(env_key, "").strip()
        if v:
            params[api_key] = v
    url = "https://api.vercel.com/v6/deployments?" + urllib.parse.urlencode(params)
    body = _get_json(
        url,
        {"Authorization": f"Bearer {token}", "Accept": "application/json"},
    )
    deploys = body.get("deployments", []) if isinstance(body, dict) else []
    ready = next(
        (
            d
            for d in deploys
            if (d.get("readyState") or d.get("state")) == "READY"
        ),
        None,
    )
    if not ready:
        return None
    return ((ready.get("meta") or {}).get("githubCommitSha") or "").lower() or None


def walk_main(prod_sha: str) -> Iterable[dict]:
    repo = _repo()
    h = _gh_headers()
    url = f"https://api.github.com/repos/{repo}/compare/{prod_sha}...main?per_page=50"
    body = _get_json(url, h)
    for raw in body.get("commits", []):
        sha = raw["sha"]
        subject = (raw["commit"]["message"] or "").split("\n", 1)[0]
        m = PR_SUBJECT_RE.search(subject)
        pr_number = int(m.group(1)) if m else None
        files_url = f"https://api.github.com/repos/{repo}/commits/{sha}"
        files_body = _get_json(files_url, h)
        files = [f["filename"] for f in files_body.get("files", [])]
        deployable = any(DEPLOYABLE_RE.match(p) for p in files)
        yield {
            "sha": sha,
            "short": sha[:7],
            "subject": subject,
            "pr": pr_number,
            "deployable": deployable,
            "n_files": len(files),
        }


def main() -> int:
    prod_sha = latest_prod_sha()
    if not prod_sha:
        print("No READY production deploy detected.")
        print("Treating drift = 'all of main'. This is the first-deploy state.")
        return 0
    print(f"Production currently serves: {prod_sha[:12]}")
    print()
    rows = list(walk_main(prod_sha))
    deployable = [r for r in rows if r["deployable"]]
    docs_only = [r for r in rows if not r["deployable"]]
    if not rows:
        print("No drift — production is at tip of main.")
        return 0
    print(
        f"Drift: {len(rows)} commit(s) ahead "
        f"({len(deployable)} deployable, {len(docs_only)} docs/scripts)."
    )
    print()
    print("DEPLOYABLE | order | sha     | pr   | subject")
    print("-----------+-------+---------+------+----------------------------------")
    for idx, r in enumerate(reversed(deployable), start=1):
        pr = f"#{r['pr']}" if r["pr"] else "-"
        print(f"           |  {idx:>3}  | {r['short']} | {pr:>4} | {r['subject'][:60]}")
    if docs_only:
        print()
        print("Skipped (docs/scripts only):")
        for r in docs_only:
            pr = f"#{r['pr']}" if r["pr"] else "-"
            print(f"  {r['short']} {pr:>4}  {r['subject'][:60]}")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
