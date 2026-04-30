#!/usr/bin/env python3
"""
test-validator.py — drift-guard unit tests for analyze.py:_validate().

The drift-guard is the load-bearing piece of the "max AI without AI drift"
contract: it strips quotes that aren't verbatim in the transcript and
action items without a `[hh:mm:ss]` anchor matching the transcript, then
re-derives `self_automation_trigger` from the survivors. If anything
silently changes that behaviour, every downstream artefact in the
recordings/ archive becomes untrustworthy.

These tests pin the contract with three fixtures:

    Fixture A — all-clean
        Verbatim quote + anchored action item, owner=operator, urgency=high.
        Expectation: nothing dropped; self_automation_trigger=True.

    Fixture B — mixed
        One verbatim+anchored quote (kept), one paraphrased quote (dropped),
        one quote with a non-existent timestamp (dropped). One anchored
        operator/high action (kept), one un-anchored action (dropped).
        Expectation: 1 quote, 1 action item survive; trigger=True; warnings
        record the drops.

    Fixture C — all-bad
        Every quote is paraphrased; every action item is un-anchored.
        Expectation: 0 survivors; trigger=False (re-derived).

Exit non-zero on any assertion failure.
"""
from __future__ import annotations

import importlib.util
import pathlib
import sys
import tempfile

HERE = pathlib.Path(__file__).resolve().parent
spec = importlib.util.spec_from_file_location("analyze", HERE / "analyze.py")
analyze = importlib.util.module_from_spec(spec)
assert spec.loader is not None
spec.loader.exec_module(analyze)

TRANSCRIPT = """# transcript

[00:00:05] Hello, I'm Anika. Thanks for taking my call.
[00:00:12] We should ship by Friday.
[00:01:30] Let's circle back next week.
"""


def _run_validate(d: dict) -> dict:
    with tempfile.NamedTemporaryFile("w", suffix=".md", delete=False) as f:
        f.write(TRANSCRIPT)
        path = pathlib.Path(f.name)
    try:
        return analyze._validate(d, path)
    finally:
        path.unlink(missing_ok=True)


def fixture_a_all_clean() -> None:
    out = _run_validate({
        "id": "fixture-a",
        "section": "client-meetings",
        "section_confidence": 0.95,
        "summary": "Anika confirms ship-by-Friday.",
        "people": [{"name": "Anika", "role": "client"}],
        "companies": [],
        "topics": ["delivery"],
        "quotes": [
            {"speaker": "Anika", "ts": "00:00:05",
             "text": "Hello, I'm Anika. Thanks for taking my call."},
        ],
        "action_items": [
            {"text": "Ship by Friday", "owner": "operator",
             "ts": "00:00:12", "requires_action": True, "urgency": "high"},
        ],
        "self_automation_trigger": True,
    })
    assert len(out["quotes"]) == 1, f"expected 1 quote, got {len(out['quotes'])}"
    assert len(out["action_items"]) == 1, f"expected 1 action item, got {len(out['action_items'])}"
    assert out["self_automation_trigger"] is True, "trigger should remain True"
    assert "warnings" not in out, f"unexpected warnings: {out.get('warnings')}"
    print("  ✓ fixture A (all-clean): nothing dropped, trigger preserved")


def fixture_b_mixed() -> None:
    out = _run_validate({
        "id": "fixture-b",
        "section": "musings",
        "summary": "mix of valid and invalid items",
        "people": [],
        "companies": [],
        "topics": [],
        "quotes": [
            # kept: verbatim + anchored
            {"speaker": "Anika", "ts": "00:00:05",
             "text": "Hello, I'm Anika. Thanks for taking my call."},
            # dropped: paraphrased (not verbatim in transcript)
            {"speaker": "Anika", "ts": "00:00:05",
             "text": "Hi there, this is Anika, thanks for the call."},
            # dropped: timestamp doesn't appear in transcript
            {"speaker": "Anika", "ts": "99:99:99",
             "text": "We should ship by Friday."},
        ],
        "action_items": [
            # kept: anchored, operator, high
            {"text": "Ship by Friday", "owner": "operator",
             "ts": "00:00:12", "requires_action": True, "urgency": "high"},
            # dropped: timestamp doesn't appear in transcript
            {"text": "Mystery action", "owner": "operator",
             "ts": "99:99:99", "requires_action": True, "urgency": "high"},
        ],
        "self_automation_trigger": True,
    })
    assert len(out["quotes"]) == 1, f"expected 1 quote survivor, got {len(out['quotes'])}"
    assert len(out["action_items"]) == 1, f"expected 1 action survivor, got {len(out['action_items'])}"
    assert out["self_automation_trigger"] is True, "trigger should be True from surviving operator/high item"
    warnings = out.get("warnings", [])
    assert any("drift-guard dropped" in w for w in warnings), \
        f"expected drift-guard warning, got {warnings}"
    print("  ✓ fixture B (mixed): 2 quotes + 1 action dropped, 1 of each survived, trigger preserved, warning emitted")


def fixture_c_all_bad() -> None:
    out = _run_validate({
        "id": "fixture-c",
        "section": "musings",
        "summary": "all items invalid",
        "people": [],
        "companies": [],
        "topics": [],
        "quotes": [
            {"speaker": "X", "ts": "00:00:05", "text": "Paraphrased greeting."},
            {"speaker": "Y", "ts": "99:99:99", "text": "We should ship by Friday."},
        ],
        "action_items": [
            {"text": "Mystery", "owner": "operator", "ts": "99:99:99",
             "requires_action": True, "urgency": "high"},
            {"text": "Other", "owner": "operator", "ts": None,
             "requires_action": True, "urgency": "high"},
        ],
        "self_automation_trigger": True,  # claimed by Claude — must be re-derived to False
    })
    assert len(out["quotes"]) == 0, f"expected 0 quote survivors, got {len(out['quotes'])}"
    assert len(out["action_items"]) == 0, f"expected 0 action survivors, got {len(out['action_items'])}"
    assert out["self_automation_trigger"] is False, \
        "trigger MUST be re-derived to False — a hallucinated trigger cannot survive"
    print("  ✓ fixture C (all-bad): 0 survivors, hallucinated trigger reset to False")


def fixture_d_unknown_section() -> None:
    out = _run_validate({
        "id": "fixture-d",
        "section": "miscellaneous",   # not in VALID_SECTIONS
        "quotes": [],
        "action_items": [],
    })
    assert out["section"] == "musings", f"expected fallback to musings, got {out['section']}"
    warnings = out.get("warnings", [])
    assert any("not in valid set" in w for w in warnings), \
        f"expected section-fallback warning, got {warnings}"
    print("  ✓ fixture D (unknown section): falls back to musings with warning")


if __name__ == "__main__":
    print("validator unit tests")
    try:
        fixture_a_all_clean()
        fixture_b_mixed()
        fixture_c_all_bad()
        fixture_d_unknown_section()
    except AssertionError as e:
        print(f"  ✗ FAIL: {e}", file=sys.stderr)
        sys.exit(1)
    print("all 4 fixtures passed")
