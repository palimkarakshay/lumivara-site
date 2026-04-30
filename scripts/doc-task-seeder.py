#!/usr/bin/env python3
"""
Doc-task seeder — periodically scans curated planning docs for
automatable tasks the operator (or an agent) has flagged with a
`<!-- bot-task: ... -->` HTML-comment marker, and files a tracked
GitHub issue for each new one.

Why this exists
---------------
The rest of the pipeline (triage → plan → execute → review → merge)
is reactive. Issues only enter the system when something captures
them — `gh issue create` from the desk, the `/admin` portal, or the
n8n webhook from SMS/email. There is no doc-driven capture path,
so backlog rows that live only as `[ ]` lines in planning docs
(`docs/migrations/`, `docs/mothership/08-future-work.md`, etc.) rot
until manually surfaced.

This script is the missing capture path.

Tier 1 — deterministic detector (this commit)
---------------------------------------------
* Reads a fixed `MANIFEST` of planning docs from disk.
* Matches `<!-- bot-task: title="…" labels="a,b" body_anchor="#x" -->`
  via regex.
* Skips markers that fall inside fenced code blocks (Tier-1
  hallucination guard against picking up examples).
* Computes a stable `source_id = sha1(path + title + body_anchor)`
  per candidate.
* Queries open issues; skips any source_id already filed.
* Caps new issues per run.

Cross-LLM verification (Tier 2/3) and the operator-attested approval
gate (Tier 4 — OWASP LLM08) land in follow-up commits.

Usage
-----
    GH_TOKEN=… python3 scripts/doc-task-seeder.py            # dry run
    GH_TOKEN=… python3 scripts/doc-task-seeder.py --apply    # file
    GH_TOKEN=… python3 scripts/doc-task-seeder.py --max-new 1 --apply

Exit codes
----------
* 0  — clean run (filed 0..N issues, or dry run printed candidates).
* 2  — manifest entry missing on disk (configuration drift).
* 3  — `--apply` requested but `GH_TOKEN` is missing.
"""
from __future__ import annotations

import argparse
import hashlib
import json
import os
import re
import subprocess
import sys
from dataclasses import dataclass, field
from pathlib import Path

REPO = os.environ.get("GITHUB_REPOSITORY", "palimkarakshay/lumivara-site")
DEFAULT_LABELS = ["status/needs-triage", "area/content", "area/forge"]
FORBIDDEN_LABELS = {"infra-allowed"}  # never auto-applied
SEEDER_VERSION = "doc-task-bot/v1"

# Curated manifest of source docs. Each path is scanned for `bot-task:`
# markers. Adding to this list is intentional; the seeder does not glob
# the world. Extend the list in a follow-up PR with operator review.
MANIFEST: list[str] = [
    "docs/migrations/00-automation-readiness-plan.md",
    "docs/migrations/01-poc-perfection-plan.md",
    "docs/mothership/08-future-work.md",
    "docs/mothership/templates/00-templates-index.md",
    "docs/ops/progress-tracker.md",
    "docs/BACKLOG.md",
]

MARKER_RE = re.compile(
    r"<!--\s*bot-task:\s*(?P<attrs>[^>]*?)\s*-->",
    re.DOTALL,
)
ATTR_RE = re.compile(r'(\w+)="([^"]*)"')


@dataclass
class Candidate:
    source_path: str
    title: str
    labels: list[str]
    body_anchor: str
    raw_marker: str
    line: int

    @property
    def source_id(self) -> str:
        # Stable across runs: depends on path + title + anchor only,
        # so editing the labels later does not refile the issue. To
        # genuinely refile, the operator must change the title or
        # body_anchor on the source marker.
        h = hashlib.sha1()
        h.update(self.source_path.encode())
        h.update(b"\0")
        h.update(self.title.encode())
        h.update(b"\0")
        h.update(self.body_anchor.encode())
        return h.hexdigest()[:16]

    def render_body(self) -> str:
        anchor = (
            f"{self.source_path}{self.body_anchor}"
            if self.body_anchor
            else self.source_path
        )
        return (
            "## Source\n"
            f"Filed by `scripts/doc-task-seeder.py` from a `<!-- bot-task -->` "
            f"marker in [`{anchor}`](../blob/main/{self.source_path}). The "
            "seeder is deterministic — it does not invent tasks; the marker "
            "exists verbatim in the doc.\n\n"
            "## What to do\n"
            "Open the source above and follow the section the marker is "
            "attached to. If the section is ambiguous, label this issue "
            "`status/needs-clarification` and stop — do not guess.\n\n"
            "## Pattern C lane\n"
            "🛠 Pipeline by default (operator IP / docs). Override via marker "
            "`labels=`. The seeder never auto-applies `infra-allowed`.\n\n"
            f"<!-- {SEEDER_VERSION}:source_id={self.source_id} -->\n"
        )


@dataclass
class Plan:
    candidates: list[Candidate] = field(default_factory=list)
    skipped_existing: list[Candidate] = field(default_factory=list)
    skipped_capped: list[Candidate] = field(default_factory=list)
    filed: list[tuple[Candidate, int]] = field(default_factory=list)
    errors: list[str] = field(default_factory=list)


def parse_attrs(blob: str) -> dict[str, str]:
    return {m.group(1): m.group(2) for m in ATTR_RE.finditer(blob)}


def fenced_block_ranges(text: str) -> list[tuple[int, int]]:
    """Return [(start_offset, end_offset), ...] for every fenced block.

    Used to skip markers that appear inside ```code``` examples — those
    are documentation, not real markers, and counting them would
    hallucinate issues out of sample syntax. An unterminated fence is
    treated as fenced-to-end-of-file (fail-closed).
    """
    ranges: list[tuple[int, int]] = []
    in_fence = False
    fence_start = 0
    line_start = 0
    for line_end in range(len(text)):
        if text[line_end] != "\n" and line_end != len(text) - 1:
            continue
        line = text[line_start : line_end + 1]
        stripped = line.lstrip()
        if stripped.startswith("```"):
            if not in_fence:
                fence_start = line_start
                in_fence = True
            else:
                ranges.append((fence_start, line_end + 1))
                in_fence = False
        line_start = line_end + 1
    if in_fence:
        ranges.append((fence_start, len(text)))
    return ranges


def in_fenced_block(offset: int, ranges: list[tuple[int, int]]) -> bool:
    return any(start <= offset < end for start, end in ranges)


def scan_doc(path: Path) -> list[Candidate]:
    text = path.read_text(encoding="utf-8")
    fences = fenced_block_ranges(text)
    out: list[Candidate] = []
    for m in MARKER_RE.finditer(text):
        if in_fenced_block(m.start(), fences):
            continue
        attrs = parse_attrs(m.group("attrs"))
        title = attrs.get("title", "").strip()
        if not title:
            continue
        labels_raw = attrs.get("labels", "").strip()
        labels = (
            [l.strip() for l in labels_raw.split(",") if l.strip()]
            if labels_raw
            else list(DEFAULT_LABELS)
        )
        labels = [l for l in labels if l not in FORBIDDEN_LABELS]
        anchor = attrs.get("body_anchor", "").strip()
        line = text.count("\n", 0, m.start()) + 1
        out.append(
            Candidate(
                source_path=str(path),
                title=title,
                labels=labels,
                body_anchor=anchor,
                raw_marker=m.group(0),
                line=line,
            )
        )
    return out


def load_existing_source_ids(token: str | None) -> set[str]:
    if not token:
        return set()
    cmd = [
        "gh", "issue", "list",
        "--repo", REPO,
        "--state", "open",
        "--limit", "500",
        "--json", "number,body",
    ]
    try:
        out = subprocess.check_output(
            cmd, env={**os.environ, "GH_TOKEN": token}, text=True
        )
    except subprocess.CalledProcessError as exc:
        print(f"WARN: gh issue list failed: {exc}", file=sys.stderr)
        return set()
    data = json.loads(out)
    pat = re.compile(rf"{re.escape(SEEDER_VERSION)}:source_id=([0-9a-f]+)")
    seen: set[str] = set()
    for issue in data:
        body = issue.get("body") or ""
        for m in pat.finditer(body):
            seen.add(m.group(1))
    return seen


def file_issue(token: str, candidate: Candidate) -> int:
    cmd = [
        "gh", "issue", "create",
        "--repo", REPO,
        "--title", candidate.title,
        "--body", candidate.render_body(),
    ]
    for lbl in candidate.labels:
        cmd += ["--label", lbl]
    out = subprocess.check_output(
        cmd, env={**os.environ, "GH_TOKEN": token}, text=True
    )
    last = out.strip().splitlines()[-1]
    m = re.search(r"/issues/(\d+)", last)
    if not m:
        raise RuntimeError(
            f"Could not parse issue number from gh output: {out!r}"
        )
    return int(m.group(1))


def build_plan(repo_root: Path, max_new: int, existing: set[str]) -> Plan:
    plan = Plan()
    for rel in MANIFEST:
        p = repo_root / rel
        if not p.is_file():
            plan.errors.append(f"MANIFEST entry missing on disk: {rel}")
            continue
        for cand in scan_doc(p):
            if cand.source_id in existing:
                plan.skipped_existing.append(cand)
                continue
            plan.candidates.append(cand)
    plan.candidates.sort(
        key=lambda c: (
            MANIFEST.index(c.source_path) if c.source_path in MANIFEST else 999,
            c.line,
        )
    )
    if max_new is not None and len(plan.candidates) > max_new:
        plan.skipped_capped = plan.candidates[max_new:]
        plan.candidates = plan.candidates[:max_new]
    return plan


def emit_summary(plan: Plan) -> dict:
    return {
        "filed": [
            {
                "number": n,
                "title": c.title,
                "source": c.source_path,
                "source_id": c.source_id,
            }
            for c, n in plan.filed
        ],
        "candidates_dry_run": [
            {
                "title": c.title,
                "source": c.source_path,
                "labels": c.labels,
                "source_id": c.source_id,
            }
            for c in plan.candidates
        ],
        "skipped_existing": len(plan.skipped_existing),
        "skipped_capped": len(plan.skipped_capped),
        "errors": plan.errors,
    }


def main() -> int:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument(
        "--apply", action="store_true",
        help="Actually file issues. Default is dry run.",
    )
    parser.add_argument(
        "--max-new", type=int, default=3,
        help="Cap on issues filed in a single run (default: 3).",
    )
    parser.add_argument(
        "--repo-root", default=".",
        help="Repo root path (default: cwd).",
    )
    args = parser.parse_args()

    token = os.environ.get("GH_TOKEN") or os.environ.get("GITHUB_TOKEN")
    if args.apply and not token:
        print("ERROR: --apply requires GH_TOKEN (or GITHUB_TOKEN).", file=sys.stderr)
        return 3

    repo_root = Path(args.repo_root).resolve()
    existing = load_existing_source_ids(token) if token else set()

    plan = build_plan(repo_root, args.max_new, existing)
    if plan.errors:
        for e in plan.errors:
            print(f"ERROR: {e}", file=sys.stderr)
        return 2

    if args.apply:
        for cand in plan.candidates:
            try:
                num = file_issue(token, cand)  # type: ignore[arg-type]
                plan.filed.append((cand, num))
                print(f"FILED #{num}: {cand.title}  (source={cand.source_path}:{cand.line})")
            except Exception as exc:  # noqa: BLE001
                plan.errors.append(f"file_issue failed for {cand.title!r}: {exc}")
                print(f"FAIL  {cand.title}: {exc}", file=sys.stderr)
    else:
        for cand in plan.candidates:
            print(f"DRY   {cand.title}  (source={cand.source_path}:{cand.line}, source_id={cand.source_id})")
        for cand in plan.skipped_existing:
            print(f"SKIP  already filed: {cand.title}  (source_id={cand.source_id})")
        for cand in plan.skipped_capped:
            print(f"WAIT  over cap: {cand.title}  (source_id={cand.source_id})")

    summary = emit_summary(plan)
    print("---SUMMARY---")
    print(json.dumps(summary, indent=2))
    return 0 if not plan.errors else 1


if __name__ == "__main__":
    sys.exit(main())
