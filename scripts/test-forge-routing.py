#!/usr/bin/env python3
"""
Smoke test for the Forge lane (forge-triage.yml + forge-execute.yml).

This does NOT call any AI provider. It verifies, statically:

  1. The forge-triage and forge-execute workflow files exist, parse as YAML,
     and have the expected cadence + concurrency groups.
  2. The forge-triage and forge-execute prompts exist.
  3. The Forge eligibility filter behaves correctly on a hand-rolled set of
     synthetic issues (the same shape the live picker uses).
  4. The auto-merge sanity guardrail correctly classifies which file paths
     are in-scope vs. out-of-scope for the Forge lane.

Exits non-zero on any failure so the smoke-test workflow surfaces it.
"""

from __future__ import annotations

import re
import sys
import yaml
from pathlib import Path

REPO_ROOT = Path(__file__).resolve().parent.parent

# ── 1. Workflow files exist + shape ──────────────────────────────────────────
FAILS: list[str] = []


def check(label: str, ok: bool, detail: str = "") -> None:
    mark = "✅" if ok else "❌"
    print(f"  {mark} {label}{(' — ' + detail) if detail else ''}")
    if not ok:
        FAILS.append(label)


print("\n[1/4] Workflow file shape")
ft = REPO_ROOT / ".github/workflows/forge-triage.yml"
fe = REPO_ROOT / ".github/workflows/forge-execute.yml"
check("forge-triage.yml exists", ft.is_file())
check("forge-execute.yml exists", fe.is_file())

if ft.is_file():
    ft_yaml = yaml.safe_load(ft.read_text())
    # PyYAML interprets the unquoted YAML key `on:` as the boolean True. The
    # workflow file is correct (GitHub parses it as the string "on"); the test
    # just needs to look up under whichever key the parser produced.
    on_key = "on" if "on" in ft_yaml else (True if True in ft_yaml else None)
    on_block = ft_yaml.get(on_key, {}) if on_key is not None else {}
    schedule_block = on_block.get("schedule", []) if isinstance(on_block, dict) else []
    crons = [s.get("cron") for s in schedule_block if isinstance(s, dict)]
    check("forge-triage.yml has 10-min cron", "*/10 * * * *" in crons,
          f"crons={crons}")
    check("forge-triage.yml uses opus model",
          "claude-opus-4-7" in ft.read_text())
    check("forge-triage.yml concurrency group is forge-specific",
          ft_yaml.get("concurrency", {}).get("group") == "forge-triage-runtime")

if fe.is_file():
    fe_yaml = yaml.safe_load(fe.read_text())
    on_key_e = "on" if "on" in fe_yaml else (True if True in fe_yaml else None)
    on_block_e = fe_yaml.get(on_key_e, {}) if on_key_e is not None else {}
    schedule_block_e = on_block_e.get("schedule", []) if isinstance(on_block_e, dict) else []
    crons = [s.get("cron") for s in schedule_block_e if isinstance(s, dict)]
    check("forge-execute.yml has 30-min cron", "*/30 * * * *" in crons,
          f"crons={crons}")
    check("forge-execute.yml uses opus model",
          "claude-opus-4-7" in fe.read_text())
    check("forge-execute.yml concurrency group is forge-specific",
          fe_yaml.get("concurrency", {}).get("group") == "forge-execute-runtime")
    check("forge-execute.yml has the auto-merge guardrail",
          "outside the Forge allow-list" in fe.read_text())

# ── 2. Prompt files exist ────────────────────────────────────────────────────
print("\n[2/4] Prompt files")
ft_prompt = REPO_ROOT / "scripts/forge-triage-prompt.md"
fe_prompt = REPO_ROOT / "scripts/forge-execute-prompt.md"
check("scripts/forge-triage-prompt.md exists", ft_prompt.is_file())
check("scripts/forge-execute-prompt.md exists", fe_prompt.is_file())

if ft_prompt.is_file():
    txt = ft_prompt.read_text()
    check("forge-triage prompt always adds area/forge",
          "Always add `area/forge`" in txt)
    check("forge-triage prompt caps at 15 issues per run",
          "15 issues per run" in txt)

if fe_prompt.is_file():
    txt = fe_prompt.read_text()
    check("forge-execute prompt requires area/forge",
          "must carry `area/forge`" in txt)
    check("forge-execute prompt forbids src/", "`src/**`" in txt)
    check("forge-execute prompt requires small-batch commits",
          "small commits" in txt or "small batches" in txt)

# ── 3. Eligibility filter behaviour ──────────────────────────────────────────
print("\n[3/4] Forge eligibility filter (synthetic issues)")

EXCLUDE = {"human-only", "manual-only", "status/blocked",
           "status/in-progress", "status/needs-clarification",
           "status/awaiting-review", "status/on-hold"}
PRIO_RANK = {"priority/P1": 0, "priority/P2": 1, "priority/P3": 2}
COMP_RANK = {"complexity/trivial": 0, "complexity/easy": 1,
             "complexity/medium": 2, "complexity/complex": 3}


def is_forge_eligible(labels: set[str]) -> bool:
    """Mirror of the picker logic in forge-execute.yml."""
    if "area/forge" not in labels:
        return False
    if "auto-routine" not in labels:
        return False
    if labels & EXCLUDE:
        return False
    has_prio = any(l in PRIO_RANK for l in labels)
    return has_prio


# (label-set, expected eligibility, why)
CASES = [
    ({"area/forge", "auto-routine", "priority/P2", "complexity/complex",
      "model/opus", "status/planned"},
     True, "happy path: forge + auto-routine + prio + planned"),
    ({"area/forge", "auto-routine", "priority/P2", "complexity/medium",
      "status/in-progress"},
     False, "in-progress is excluded so we don't double-pick"),
    ({"area/forge", "auto-routine", "priority/P2", "complexity/medium",
      "status/awaiting-review"},
     False, "awaiting-review is excluded so we don't redo merged work"),
    ({"area/forge", "auto-routine", "priority/P2", "complexity/medium",
      "manual-only"},
     False, "manual-only on a forge issue means console-only work"),
    ({"area/forge", "auto-routine", "priority/P2", "complexity/medium",
      "status/on-hold"},
     False, "on-hold means operator deliberately parked it"),
    ({"area/forge", "auto-routine", "priority/P2", "complexity/medium",
      "human-only"},
     False, "human-only blocks all bots"),
    ({"area/forge", "priority/P2", "complexity/medium", "model/opus"},
     False, "missing auto-routine — bot won't pick it up"),
    ({"auto-routine", "priority/P2", "complexity/medium", "model/opus"},
     False, "missing area/forge — wrong lane"),
    ({"area/forge", "auto-routine", "complexity/medium"},
     False, "missing priority/* — triage hasn't finished"),
    ({"area/forge", "auto-routine", "priority/P1", "complexity/easy"},
     True, "small P1 forge fix is eligible too"),
]
for labels, expected, why in CASES:
    got = is_forge_eligible(labels)
    check(f"eligibility — {why}", got == expected,
          f"got={got}, expected={expected}")

# ── 4. Auto-merge guardrail path classification ──────────────────────────────
print("\n[4/4] Auto-merge guardrail (path classification)")

# Mirror of the regex in forge-execute.yml's "Enable auto-merge" step.
ALLOW_RX = re.compile(r"^(docs/.+|AGENTS\.md|CLAUDE\.md|CHANGELOG\.md|README\.md|scripts/lib/routing\.py)$")

PATH_CASES = [
    ("docs/mothership/02-architecture.md", True, "mothership doc"),
    ("docs/mothership/02b-pattern-c-architecture.md", True, "new mothership doc"),
    ("docs/wiki/Home.md", True, "wiki doc"),
    ("docs/freelance/05-template-hardening-notes.md", True, "freelance hardening note"),
    ("AGENTS.md", True, "agent ideology root file"),
    ("scripts/lib/routing.py", True, "routing lib (Run C carve-out)"),
    ("src/app/page.tsx", False, "site code is forbidden"),
    (".github/workflows/triage.yml", False, "workflow file is forbidden"),
    ("scripts/triage-prompt.md", False, "general triage prompt is forbidden"),
    ("package.json", False, "deps are forbidden"),
    ("public/og-image.png", False, "site asset is forbidden"),
]
for path, expected, why in PATH_CASES:
    got = bool(ALLOW_RX.match(path))
    check(f"path — {why} ({path})", got == expected,
          f"got={got}, expected={expected}")

# ── Final ────────────────────────────────────────────────────────────────────
print()
if FAILS:
    print(f"❌ Forge smoke test FAILED — {len(FAILS)} check(s):")
    for f in FAILS:
        print(f"   - {f}")
    sys.exit(1)
print("✅ Forge smoke test passed — all checks green.")
