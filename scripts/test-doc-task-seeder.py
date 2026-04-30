#!/usr/bin/env python3
"""
Smoke test for `scripts/doc-task-seeder.py`.

This does NOT call any AI provider, GitHub API, or network. It pins
the seeder's *deterministic* contracts so a regression in regex
matching, fenced-block exclusion, source_id stability, label sanitation,
or approval-gate parsing surfaces in CI before the daily cron fires
and (potentially) files bad issues.

Mirrors the shape of `scripts/test-forge-routing.py`: hand-rolled
synthetic fixtures + tight pass/fail per condition, exits non-zero on
any failure.

Coverage
--------
1. Workflow file exists and parses; declares the daily cron + the
   operator-gated apply input.
2. Operator-contract doc exists and cites the four-tier defence.
3. Marker regex extracts every attribute (`title`, `labels`,
   `body_anchor`).
4. Markers inside fenced code blocks are skipped (Tier-1
   hallucination guard).
5. `source_id` is stable across runs and depends only on
   path + title + body_anchor (not labels — labels can be edited
   without forcing a refile).
6. `FORBIDDEN_LABELS` (e.g. `infra-allowed`) are silently dropped
   from any marker that tries to set them.
7. `parse_approved_source_ids` recognises both inline and bullet
   forms, ignores commentary after the block.
"""
from __future__ import annotations

import runpy
import sys
import types
import yaml
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent
SEEDER = REPO_ROOT / "scripts" / "doc-task-seeder.py"

FAILS: list[str] = []


def check(label: str, ok: bool, detail: str = "") -> None:
    mark = "✅" if ok else "❌"
    print(f"  {mark} {label}{(' — ' + detail) if detail else ''}")
    if not ok:
        FAILS.append(label)


def _load_seeder():
    """Load scripts/doc-task-seeder.py as an importable namespace.

    The script's filename uses a hyphen (`doc-task-seeder.py`) which is
    not a valid Python module identifier, so a direct `import` won't
    work. `importlib.util.spec_from_file_location` works for most
    scripts but trips a known interaction with `from __future__ import
    annotations` + dataclasses on Python 3.11. `runpy.run_path` is
    immune (it executes the file with `__name__` set to a sentinel that
    isn't `__main__`, so the script's body runs but `main()` does not)
    and returns the module's globals as a dict that we wrap in a
    SimpleNamespace for attribute access.
    """
    ns = runpy.run_path(str(SEEDER), run_name="doc_task_seeder")
    return types.SimpleNamespace(**ns)


# ── 1. Workflow file shape ───────────────────────────────────────────────────
print("\n[1/6] Workflow file shape")
wf = REPO_ROOT / ".github/workflows/doc-task-seeder.yml"
check("doc-task-seeder.yml exists", wf.is_file())
if wf.is_file():
    wf_yaml = yaml.safe_load(wf.read_text())
    on_key = "on" if "on" in wf_yaml else (True if True in wf_yaml else None)
    on_block = wf_yaml.get(on_key, {}) if on_key is not None else {}
    schedule_block = on_block.get("schedule", []) if isinstance(on_block, dict) else []
    crons = [s.get("cron") for s in schedule_block if isinstance(s, dict)]
    check(
        "doc-task-seeder.yml has daily cron",
        any("0 2 * * *" == c or "0 2 * * 0" == c for c in crons),
        f"crons={crons}",
    )
    dispatch = on_block.get("workflow_dispatch") if isinstance(on_block, dict) else None
    check(
        "doc-task-seeder.yml exposes apply input",
        bool(dispatch and isinstance(dispatch, dict) and "apply" in (dispatch.get("inputs") or {})),
    )
    check(
        "doc-task-seeder.yml has concurrency group",
        bool(wf_yaml.get("concurrency", {}).get("group")),
    )

# ── 2. Operator contract doc ─────────────────────────────────────────────────
print("\n[2/6] Operator contract")
doc = REPO_ROOT / "docs/ops/doc-task-seeder.md"
check("docs/ops/doc-task-seeder.md exists", doc.is_file())
if doc.is_file():
    text = doc.read_text()
    check("contract names OWASP LLM08", "LLM08" in text)
    check("contract names NIST AI RMF", "NIST AI RMF" in text)
    check("contract describes four tiers", text.count("Tier") >= 4 or "four-tier" in text.lower() or "four tiers" in text.lower())
    check("contract references seeder/approved label", "seeder/approved" in text)

# Load the seeder module for the behavioural checks below.
print("\n[3/6] Loading seeder module")
try:
    seeder = _load_seeder()
    check("scripts/doc-task-seeder.py imports cleanly", True)
except Exception as exc:  # noqa: BLE001
    check(f"scripts/doc-task-seeder.py imports cleanly", False, str(exc))
    print()
    if FAILS:
        print(f"❌ Seeder smoke test FAILED — {len(FAILS)} check(s):")
        for f in FAILS:
            print(f"   - {f}")
        sys.exit(1)
    sys.exit(0)

# ── 3. Marker regex extracts attributes ──────────────────────────────────────
print("\n[3b/6] Marker regex")
sample = (
    'Some prose.\n'
    '<!-- bot-task: title="Hello world" labels="status/needs-triage,area/content" body_anchor="#one" -->\n'
    'More prose.\n'
)
m = seeder.MARKER_RE.search(sample)
check("marker regex matches a real marker", m is not None)
if m:
    attrs = seeder.parse_attrs(m.group("attrs"))
    check("attrs[title] parses", attrs.get("title") == "Hello world")
    check("attrs[labels] parses", attrs.get("labels") == "status/needs-triage,area/content")
    check("attrs[body_anchor] parses", attrs.get("body_anchor") == "#one")

# ── 4. Fenced-code-block exclusion ───────────────────────────────────────────
print("\n[4/6] Fenced-code-block exclusion")
fenced_sample = (
    "Real prose section.\n\n"
    "```markdown\n"
    '<!-- bot-task: title="Inside fence" labels="" body_anchor="" -->\n'
    "```\n\n"
    '<!-- bot-task: title="Outside fence" labels="" body_anchor="" -->\n'
)
ranges = seeder.fenced_block_ranges(fenced_sample)
matches = list(seeder.MARKER_RE.finditer(fenced_sample))
check("two markers found in fixture", len(matches) == 2)
inside = [m for m in matches if seeder.in_fenced_block(m.start(), ranges)]
outside = [m for m in matches if not seeder.in_fenced_block(m.start(), ranges)]
check("one marker excluded as fenced", len(inside) == 1)
check("one marker survives as real", len(outside) == 1)
if outside:
    title = seeder.parse_attrs(outside[0].group("attrs")).get("title")
    check("surviving marker is the unfenced one", title == "Outside fence")

# ── 5. source_id stability + scope ──────────────────────────────────────────
print("\n[5/6] source_id stability and scope")
c1 = seeder.Candidate(
    source_path="docs/foo.md", title="X", labels=["a"], body_anchor="#one",
    raw_marker="", line=1,
)
c2 = seeder.Candidate(
    source_path="docs/foo.md", title="X", labels=["a"], body_anchor="#one",
    raw_marker="", line=999,  # different line — should not change id
)
c3 = seeder.Candidate(
    source_path="docs/foo.md", title="X", labels=["b", "c", "d"], body_anchor="#one",
    raw_marker="", line=1,  # different labels — should not change id
)
c4 = seeder.Candidate(
    source_path="docs/foo.md", title="X", labels=["a"], body_anchor="#two",
    raw_marker="", line=1,  # different anchor — SHOULD change id
)
c5 = seeder.Candidate(
    source_path="docs/bar.md", title="X", labels=["a"], body_anchor="#one",
    raw_marker="", line=1,  # different path — SHOULD change id
)
c6 = seeder.Candidate(
    source_path="docs/foo.md", title="Y", labels=["a"], body_anchor="#one",
    raw_marker="", line=1,  # different title — SHOULD change id
)
check("source_id stable when only line changes", c1.source_id == c2.source_id)
check("source_id stable when only labels change", c1.source_id == c3.source_id)
check("source_id changes when body_anchor changes", c1.source_id != c4.source_id)
check("source_id changes when path changes", c1.source_id != c5.source_id)
check("source_id changes when title changes", c1.source_id != c6.source_id)
check("source_id is 16 hex chars", len(c1.source_id) == 16 and all(ch in "0123456789abcdef" for ch in c1.source_id))

# ── 5b. FORBIDDEN_LABELS sanitation ─────────────────────────────────────────
print("\n[5b/6] FORBIDDEN_LABELS sanitation")
hostile = (
    '<!-- bot-task: title="Test" labels="status/needs-triage,infra-allowed,area/forge" body_anchor="" -->\n'
)
m = seeder.MARKER_RE.search(hostile)
attrs = seeder.parse_attrs(m.group("attrs"))
labels_raw = attrs.get("labels", "")
labels = [l.strip() for l in labels_raw.split(",") if l.strip()]
labels = [l for l in labels if l not in seeder.FORBIDDEN_LABELS]
check("infra-allowed silently dropped from marker labels", "infra-allowed" not in labels)
check("non-forbidden labels survive", "status/needs-triage" in labels and "area/forge" in labels)

# ── 6. approved_source_ids parser ────────────────────────────────────────────
print("\n[6/6] Operator approval-gate parser")
body_inline = (
    "Some preamble.\n"
    "approved_source_ids: abc12345 def67890, 1111ffff\n"
    "Trailing prose.\n"
)
ids = seeder.parse_approved_source_ids(body_inline)
check("inline form parses three ids", ids == {"abc12345", "def67890", "1111ffff"})

body_bullets = (
    "approved_source_ids:\n"
    "- abc12345\n"
    "- def67890\n"
    "\n"
    "Other commentary that should NOT be parsed.\n"
)
ids = seeder.parse_approved_source_ids(body_bullets)
check("bullet form parses two ids", ids == {"abc12345", "def67890"})
check(
    "bullet form stops at non-bullet line",
    "Other" not in ids and "commentary" not in ids,
)

empty_block = "approved_source_ids:\n\nNo bullets.\n"
ids = seeder.parse_approved_source_ids(empty_block)
check("empty block returns empty set", ids == set())

# ── Final ────────────────────────────────────────────────────────────────────
print()
if FAILS:
    print(f"❌ Seeder smoke test FAILED — {len(FAILS)} check(s):")
    for f in FAILS:
        print(f"   - {f}")
    sys.exit(1)
print("✅ Seeder smoke test passed — all checks green.")
