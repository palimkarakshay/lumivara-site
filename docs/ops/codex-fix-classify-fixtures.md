<!-- OPERATOR-ONLY. Do not copy to a client repo. -->

# `codex-fix-classify.py` — fixture catalogue for the negative tests

`scripts/codex-fix-classify.py` is the hallucination filter between
Codex's `## Suggested fixes` PR-review section and Claude's auto-apply
pass. A regression in the filter would silently let bad findings through
to commits — exactly the failure mode the classifier exists to prevent.

This document is the spec the test runner pins against. Every row in
the [fixture catalogue](#fixture-catalogue) maps to a specific constant
or function in `scripts/codex-fix-classify.py`; weakening the guard
flips the expected `(decision, reason)` and breaks the test.

It complements the broader consistency contract in
[`docs/AI_CONSISTENCY.md`](../AI_CONSISTENCY.md) §"Hallucination guards"
and replaces the inline smoke-test the classifier originally shipped
with.

## Where the test lives (when wired)

- **Path.** `scripts/test-codex-fix-classify.py` — mirror naming of
  `scripts/test-routing.py`.
- **Shape.** Plain Python script, no pytest dependency. Iterates a
  `CASES = [...]` table and exits non-zero on first failure.
- **CI.** Wired into `.github/workflows/ai-smoke-test.yml` alongside the
  existing `python3 scripts/test-routing.py` step. The smoke job fails
  on any non-zero exit.
- **Hermetic.** Fixtures are static strings; the test never calls
  `fetch_latest_codex_review` or hits the network. The classifier's
  pure functions (`classify_one`, `extract_suggested_fixes`) are the
  only public surface under test.
- **Importing the classifier.** The module name is hyphenated, so a
  plain `import codex_fix_classify` won't work. Use the
  `importlib.util.spec_from_file_location` recipe already present in
  `scripts/codex-triage.py` (where it imports `gemini-triage.py`).

> **Note.** Both the test script and the smoke-test wiring live under
> hard-excluded paths (`scripts/` and `.github/workflows/`). They land
> in a follow-up `infra-allowed` issue. This doc is the deterministic
> spec that issue executes against.

## What the classifier guards

`classify_one()` in `scripts/codex-fix-classify.py` returns one of two
decisions:

- `apply` — the bullet cites a real on-disk path with a short, mechanical,
  non-speculative instruction outside the hard-exclusion list.
- `defer` — anything else, with a `reason` enum:
  - `hard-excluded` — path matches `EXCLUDED_PREFIXES` or `EXCLUDED_FILES`.
  - `path-not-found` — path doesn't exist on disk.
  - `speculative` — instruction contains a `SPECULATIVE_MARKERS` substring.
  - `too-long` — instruction longer than 200 chars.
  - `unparseable` — bullet doesn't match the `path: instruction` shape.

`extract_suggested_fixes()` is a separate guard: it anchors on the
literal `## Suggested fixes` section header (case-insensitive, prefix
match). A drifted header (e.g. `## Suggested edits`, `## Fixes`) must
yield zero candidates — Codex output that misses the canonical anchor
is treated as malformed, not as a free-for-all.

## Fixture catalogue

Each fixture is one bullet line shaped as Codex would emit, plus the
expected classifier output. A fixture for the parser anchor (#7) is the
exception — it's a whole-review string instead of a single bullet.

| #   | Fixture (raw bullet, except #7)                                                          | Expected `decision` | Expected `reason` | Pins                                                  |
| --- | ---------------------------------------------------------------------------------------- | ------------------- | ----------------- | ----------------------------------------------------- |
| 1   | `nonexistent/file.ts: shorten variable name`                                             | `defer`             | `path-not-found`  | Path-verification guard (`(REPO_ROOT / bare).exists`).|
| 2a  | `.github/workflows/ci.yml: bump action version`                                          | `defer`             | `hard-excluded`   | `EXCLUDED_PREFIXES` includes `.github/workflows/`.    |
| 2b  | `.env: redact value`                                                                     | `defer`             | `hard-excluded`   | `EXCLUDED_PREFIXES` includes `.env`.                  |
| 2c  | `scripts/foo.py: fix typo`                                                               | `defer`             | `hard-excluded`   | `EXCLUDED_PREFIXES` includes `scripts/`.              |
| 2d  | `src/app/api/contact/route.ts: tighten validation`                                       | `defer`             | `hard-excluded`   | `EXCLUDED_PREFIXES` includes `src/app/api/contact/`.  |
| 2e  | `package.json: bump dep`                                                                 | `defer`             | `hard-excluded`   | `EXCLUDED_FILES` includes `package.json`.             |
| 3a  | `src/lib/site-config.ts: consider renaming the export`                                   | `defer`             | `speculative`     | `SPECULATIVE_MARKERS` matches `consider `.            |
| 3b  | `src/lib/site-config.ts: refactor to use a class`                                        | `defer`             | `speculative`     | matches `refactor`.                                   |
| 3c  | `src/lib/site-config.ts: investigate possible race`                                      | `defer`             | `speculative`     | matches `investigate`.                                |
| 3d  | `src/lib/site-config.ts: may want to rename this`                                        | `defer`             | `speculative`     | matches `may want to`.                                |
| 3e  | `src/lib/site-config.ts: rewrite using zod`                                              | `defer`             | `speculative`     | matches `rewrite`.                                    |
| 4   | `src/lib/site-config.ts: <201-char mechanical instruction>` (see [§ note](#fixture-4))   | `defer`             | `too-long`        | 200-char cap on `instruction`.                        |
| 5   | `bullet without colon`                                                                   | `defer`             | `unparseable`     | `_FIX_RE` does not match.                             |
| 6   | `src/lib/site-config.ts: rename SITE_NAME to SITE_TITLE`                                 | `apply`             | _(none)_          | Real path, short, mechanical, non-speculative.        |
| 7   | _Whole review with `## Suggested edits` instead of `## Suggested fixes`_                 | _zero candidates_   | _(parser anchor)_ | `extract_suggested_fixes` section-header anchor.      |

### Fixture 4

The instruction must be ≥201 characters AND otherwise pass every other
guard (real path, non-speculative, parseable). Build it from a long
mechanical-sounding sentence padded to length, e.g. repeat
`"and update the corresponding type in the same file"` until the
character count exceeds 200. The point is to show the length cap is the
*only* thing causing the defer, so removing the cap flips the decision
to `apply`.

### Fixture 7

The review fixture must include both:

1. A `## Suggested edits` (or `## Fixes`) header with the wrong wording, AND
2. At least two bullet items underneath shaped like normal suggested
   fixes (e.g. `- src/lib/site-config.ts: rename SITE_NAME to SITE_TITLE`).

Without bullets under the wrong header, `extract_suggested_fixes` would
correctly return zero candidates regardless of the anchor — so the test
wouldn't actually exercise the anchor. Two bullets under the *wrong*
header proves the anchor (not the bullet shape) is what gates inclusion.

## Real-path requirement for fixture #6

The "happy path" fixture must cite a path that exists on disk at test
time. `src/lib/site-config.ts` is the recommended choice because
`docs/AI_CONSISTENCY.md`, `scripts/codex-plan-review.py`, and the README
all already pin its existence. If the file is ever moved or renamed,
this spec doc is the place that flags the breakage and the test will
fail loudly with `path-not-found` against fixture #6 — exactly the
signal the operator wants.

If `src/lib/site-config.ts` is ever genuinely removed (not just renamed),
update fixture #6 to cite a different stable path (`src/lib/site-config.ts`'s
neighbours like `src/lib/utils.ts` are good candidates) and update this
doc in the same PR. Don't switch the fixture to a synthesised path —
the whole point is that fixture #6 differs from fixture #1 along
*exactly one* axis: existence.

## Negative-perturbation check

The Definition of Done for issue #178 calls out:

> Deliberately weakening the `EXCLUDED_PREFIXES` constant or the
> speculative-marker list makes the test fail.

The test author MUST verify, by hand or in CI, that:

- **Removing one entry from `EXCLUDED_PREFIXES`** causes fixtures 2a–2d
  to fail (the now-included path is reclassified as `apply` instead of
  `defer`/`hard-excluded`).
- **Removing one entry from `SPECULATIVE_MARKERS`** causes the
  corresponding 3a–3e fixture to fail.
- **Lowering the 200-char cap below 201** causes fixture 4 to flip to
  `apply`.
- **Renaming the section header anchor** in `extract_suggested_fixes`
  from `## suggested fixes` to anything else causes fixture 7 to start
  returning apply candidates.

Each perturbation maps to one or more rows in the catalogue, so the
guards are each individually tested. Don't collapse the speculative
marker fixtures into one — losing 3a–3e separately is what proves the
list (not just the *concept* of speculation) is intact.

## Adding a new fixture

Append a row to the [fixture catalogue](#fixture-catalogue) above with:

1. A representative **raw bullet** (or whole-review fixture for parser
   anchors). Use `nonexistent/...` paths — not plausible-looking real
   paths — when the fixture exercises the path-not-found guard, so the
   divergence from real code is obvious.
2. The expected **`decision`** (`apply` or `defer`).
3. The expected **`reason`** (one of `hard-excluded`, `path-not-found`,
   `speculative`, `too-long`, `unparseable`, or `_(none)_` for `apply`).
4. A one-line **"pins"** column tying the fixture to a specific constant
   or function in `scripts/codex-fix-classify.py` — `EXCLUDED_PREFIXES`,
   `EXCLUDED_FILES`, `SPECULATIVE_MARKERS`, the 200-char cap, the
   `_FIX_RE` regex, the section-header anchor in
   `extract_suggested_fixes`, or the `(REPO_ROOT / bare).exists` check.

If the new fixture covers a guard that already has a row, prefer adding
it as a sibling (3f, 2f) rather than collapsing two cases into one row.
The test runner is allowed to be verbose; the cost of an extra fixture
is one row of table.

When adding a fixture for a NEW guard (e.g. someone adds a
`SUSPICIOUS_DOMAINS` constant later), add a new top-level row with a
new number, document the new `reason` enum value in
[§ What the classifier guards](#what-the-classifier-guards), and update
the negative-perturbation check.
