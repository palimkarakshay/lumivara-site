# AI consistency — how Claude, Codex, and Gemini stay aligned

This document is the contract that keeps three AI bots — **Claude Opus**
(planner + executor), **Codex / OpenAI gpt-5.5** (consistency reviewer),
and **Gemini 2.5 Pro** (large-context reader / fallback planner) — from
diverging in style, naming, file layout, or routing decisions over time.

It complements [`AI_ROUTING.md`](./AI_ROUTING.md) (which decides *which*
bot does *what*) and [`BACKLOG.md`](./BACKLOG.md) (which decides what
work exists). This file decides *how all three stay consistent* with the
codebase as they work.

> **Active phase: quality-first.** Cost optimisation is explicitly NOT
> a priority. When in doubt, prefer the slower, more thorough loop.

## The three places consistency is enforced

| Stage | Where | Who reviews | What's enforced |
|-------|-------|-------------|-----------------|
| **1. Plan review** | `plan-issues.yml` (post-triage) | Claude drafts → **Codex** spot-checks | Hard-exclusion list, file layout, label/routing rubric, plan format, DoD shape. |
| **2. PR review** | `codex-review.yml` (`pull_request` trigger) | **Codex** reviews every diff | Same conventions as (1) plus correctness, a11y, perf. Posts a structured review with severity-tagged findings. |
| **3. Pre-merge fix** | `codex-pr-fix.yml` (`issue_comment` on Codex review) | Classifier → **Claude** applies | Mechanical fixes only — the classifier filters speculative / unverifiable / hard-excluded suggestions out before Claude sees them. `auto-merge.yml` is gated by the `codex-blockers` label until a fresh re-review is clean. |

The full lifecycle:

```
issue → triage (Claude/Gemini/Codex ladder)
      → plan (Claude drafts → Codex consistency review → final plan)
      → execute (Claude/Codex/Gemini per routing rubric)
      → PR opens
      → codex-review.yml posts review on PR (auto)
      → if blockers: codex-pr-fix.yml applies safe fixes
                    → push → codex-review.yml re-runs (synchronize) → label clears
      → auto-merge.yml merges (gated by codex-blockers + design + complexity)
      → backlog seeder (codex-review-backlog.yml) catches merged PRs that pre-date this loop
```

## Hallucination guards

AI bots invent things. Every script that consumes Codex output applies
at least one of these guards:

1. **Path verification.** `codex-fix-classify.py` and
   `codex-plan-review.py` reject any finding whose cited file path
   doesn't exist on disk. The Codex prompt itself forbids invented
   paths and reserves a literal `plan-structure` token for the
   exception cases.
2. **Hard-exclusion list.** Findings citing `.github/workflows/*`,
   `.env*`, `scripts/*`, `src/app/api/contact/*`, or `package.json` deps
   are never auto-applied. They pass through as deferred items for the
   operator.
3. **Speculation tags.** Findings with severity `nit` and the
   `(speculative)` prefix, OR instructions containing words like
   "consider"/"refactor"/"investigate", are never auto-applied — they
   surface in the review for humans.
4. **Length cap.** A "suggested fix" longer than 200 chars is treated
   as architectural and deferred — the auto-fix path is for
   one-liner mechanical edits only.
5. **No silent skips.** When Claude (the executor) chooses NOT to apply
   a Codex finding, it must explain why in a `### Codex review notes`
   subsection of the plan or in the follow-up PR comment. The
   operator can audit Codex's recommendations even when they were
   declined.
6. **Verdict gating.** A `request-changes` verdict OR any
   `[blocker]`/`[major]` finding adds the `codex-blockers` PR label.
   `auto-merge.yml` and the inline auto-merge in `execute.yml` both
   refuse to enable auto-merge while that label is set. The label
   clears only when codex-review.yml's NEXT synchronize-trigger
   re-review comes back clean — Codex itself, not the auto-fixer,
   decides when blockers are resolved.

## Why Codex (not Claude) reviews plans

Two reasons:

- **Independent eyes.** Claude wrote the plan. Asking the same model to
  spot-check its own work is a poor signal. A separate provider catches
  failure modes (hallucinated file paths, drifted naming, ignored
  exclusion list) that a same-provider review misses.
- **Cost shape.** OpenAI is the operator's ChatGPT Plus tier; we're not
  burning the Claude Max 20x quota on review-of-Claude. In the future
  cost-optimisation phase this stays the same — Codex review is one of
  the few places where a cheaper model is also the *right* model for
  the job.

## How each bot is told to stay consistent

| Bot | Where the consistency contract lives | Notes |
|-----|--------------------------------------|-------|
| **Claude (triage)** | `scripts/triage-prompt.md` | The rubric. Identical sections enforced for every issue. |
| **Claude (plan)** | Inline prompt in `plan-issues.yml` + the four required plan sections | The Codex review pass enforces the format programmatically. |
| **Claude (execute)** | `scripts/execute-prompt.md` | Project conventions, hard exclusions, branch + commit-message format. |
| **Codex (review)** | Inline prompt in `codex-review.yml` | Structured headings — the downstream auto-fixer parses them. |
| **Codex (plan review)** | `scripts/codex-plan-review.py` | Same exclusion list + plan-format requirements as Claude's plan prompt. |
| **Gemini (triage fallback)** | Rubric inside `scripts/gemini-triage.py` | Mirrors `triage-prompt.md`. Update both when you change the rubric. |
| **Gemini (plan fallback)** | `scripts/plan-issue.py` | Reuses the same `PLAN_PROMPT` constant the workflow uses. |
| **All — central logic** | `scripts/lib/routing.py` | Single source of truth for which model handles which label combination. Triage / execute / smoke-test all import this. |

When you change a convention, update **all** rows above where it
applies. The smoke test (`.github/workflows/ai-smoke-test.yml`) will
catch a routing-rubric drift, but it can't catch a plan-format drift
between the Claude prompt and the Codex review prompt — that's a human
checklist item on every change to either prompt.

## Other ways to keep AI bots consistent

Things we do today, with pointers:

- **Single source of truth for routing.** `scripts/lib/routing.py`'s
  `decide()` is imported by triage, execute, and smoke-test alike.
  Don't fork the rubric.
- **Smoke test that asserts routing.** `.github/workflows/ai-smoke-test.yml`
  runs `scripts/test-routing.py` weekly with fixed label-set inputs and
  asserts every one routes to the expected provider.
- **Audit trails on every run.** `execute.yml` and `triage.yml` print
  the routing decision to both stdout and the GitHub Actions step
  summary; Claude is told to emit `>>> THINKING` blocks at every
  decision point.
- **Pinned model IDs.** `AI_ROUTING.md` ends with a "Model IDs" block
  that's updated when models bump. Workflows reference IDs via
  `claude_args: --model claude-opus-4-7` rather than hard-coding in
  multiple places — when the ID bumps, grep finds every occurrence.
- **Quality-first overrides documented in one place.** `AGENTS.md`
  Session charter tells every bot the same thing: prefer Opus + extended
  thinking; cost is not a constraint right now.

Things worth adding next (rough priority order):

1. **Style guide doc** for code (file naming, component layout,
   Tailwind class ordering, MDX frontmatter shape) that all three bots
   are pointed to. Today this is implicit in the codebase; making it
   explicit lets the Codex reviewer cite it instead of inferring.
2. **A Gemini "deep audit" cron** that does a periodic full-tree read
   for naming/style drift and files an issue when it finds inconsistency
   clusters. Gemini's 1M-context window is the right tool for this and
   the free tier covers it.
3. **PR template** that asks the contributor (human or bot) to confirm
   the plan was followed and lists the four DoD checks. Claude already
   includes them; humans don't. A template normalises both.
4. **Negative tests for the Codex format.** Add fixtures to
   `scripts/test-routing.py` (or a sibling) that feed broken Codex
   outputs to `codex-fix-classify.py` and assert they're deferred,
   not applied. Today the classifier is hand-tested.
5. **Per-provider feedback loop.** When Claude declines a Codex
   finding, log the (finding, reason) pair to a CSV in
   `docs/ops/codex-disagreements.md` so we can spot recurring
   false-positives in Codex's review style and tune the prompt.
6. **Diff-the-prompts CI check.** A tiny script that asserts the
   exclusion-list text is byte-identical across `triage-prompt.md`,
   `execute-prompt.md`, the Claude plan prompt in `plan-issues.yml`,
   the Codex plan prompt in `scripts/codex-plan-review.py`, and the
   Codex review prompt in `codex-review.yml`. Drift here is the most
   common consistency bug.

## Reviewing this doc

Same cadence as `AI_ROUTING.md` — every ~2 months, or whenever a new
review-style provider lands (e.g., a Codex tier that does inline
suggested edits via API). Keep this doc and `AI_ROUTING.md` in sync.
