#!/usr/bin/env python3
"""
Smoke test for the multi-model router.

Runs `scripts/lib/routing.decide()` against a fixed set of sample issue label
sets and prints the decision + audit trail for each. Exits non-zero if any
case routes to an unexpected provider — gives CI a cheap way to detect
regressions in the rubric without spending real model turns.

Run locally:
  python3 scripts/test-routing.py

Run in CI: invoked from .github/workflows/ai-smoke-test.yml.
"""
from __future__ import annotations

import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).parent))
from lib.routing import decide  # noqa: E402


CASES = [
    # (description, label set, expected provider, expected workflow)
    (
        "Trivial typo fix (Haiku tier)",
        {"priority/P3", "complexity/trivial", "model/haiku",
         "area/copy", "type/cleanup", "auto-routine"},
        "claude", "claude",
    ),
    (
        "Standard medium feature (Sonnet)",
        {"priority/P2", "complexity/medium", "model/sonnet",
         "area/site", "type/tech-site", "auto-routine"},
        "claude", "claude",
    ),
    (
        "Complex architectural task (Opus plan + Sonnet impl)",
        {"priority/P1", "complexity/complex", "model/opus",
         "area/site", "type/tech-site", "manual-only", "auto-routine"},
        "claude", "claude",
    ),
    (
        "Deep research / SEO audit (Gemini Pro for 1M ctx)",
        {"priority/P2", "complexity/medium", "model/gemini-pro",
         "area/seo", "type/research", "auto-routine"},
        "gemini", "gemini-research",
    ),
    (
        "Bulk MDX article generation (Gemini Pro)",
        {"priority/P2", "complexity/medium", "model/gemini-pro",
         "area/content", "type/content-bulk", "auto-routine"},
        "gemini", "gemini-research",
    ),
    (
        "Code review on a PR diff (Codex / gpt-5.5)",
        {"priority/P3", "complexity/easy", "model/codex",
         "area/site", "type/code-review", "auto-routine"},
        "codex", "codex-review",
    ),
    (
        "Cline-flagged agentic refactor — substituted to Opus (quality-first)",
        {"priority/P2", "complexity/complex", "model/cline",
         "area/site", "type/tech-site", "manual-only"},
        "cline-downgraded", "claude",
    ),
    (
        "Heuristic fallback: type/research without model label -> Gemini",
        {"priority/P2", "complexity/medium",
         "area/seo", "type/research"},
        "gemini", "gemini-research",
    ),
    (
        "Complexity-only fallback: complex with no model label -> Opus",
        {"priority/P1", "complexity/complex",
         "area/site", "type/tech-site"},
        "claude", "claude",
    ),
    (
        "Bare issue with nothing useful — defaults to Claude Opus (quality-first)",
        {"priority/P3"},
        "claude", "claude",
    ),
]


def main() -> int:
    failures = 0
    print(f"Routing smoke test — {len(CASES)} sample issues\n")
    for i, (desc, labels, want_provider, want_workflow) in enumerate(CASES, 1):
        d = decide(labels)
        ok = d.provider == want_provider and d.workflow == want_workflow
        status = "PASS" if ok else "FAIL"
        print(f"[{status}] case {i}: {desc}")
        print(d.audit())
        if not ok:
            failures += 1
            print(f"  expected provider={want_provider}, workflow={want_workflow}")
        print()

    if failures:
        print(f"\n{failures}/{len(CASES)} cases failed.", file=sys.stderr)
        return 1
    print(f"All {len(CASES)} routing cases routed as expected.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
