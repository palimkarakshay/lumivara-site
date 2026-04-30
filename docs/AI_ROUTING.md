# AI model routing — policy

Single source of truth for which AI does what in this repo. Updated as free/cheap models improve.

> **Active phase: quality-first.** The operator runs on Claude Max 20x and the
> project is in critical planning. Every Claude task — triage, plan, implement —
> defaults to **Opus 4.7**. OpenAI/Codex paths run on **gpt-5.5** (ChatGPT Plus
> tier). Gemini's free tier covers deep research and the fallback ladder. The
> per-tier mapping in the table below is what we'll restore in the future
> cost-optimisation phase; it is *not* what runs today.

## Policy (quality-first overrides in italics)

| Task | Primary | Fallback | Why |
|------|---------|----------|-----|
| **Triage / classification** | Claude Opus *(Haiku in cost-opt phase)* | Gemini 2.5 Flash | Best label decisions; Gemini free tier (500 RPD) keeps the fallback loop unconstrained. |
| **Implementation (code edits)** | Claude Opus *(Sonnet in cost-opt phase)* | execute-fallback.yml ladder | Quality first; Opus + extended thinking handles every tier. |
| **Planning (architecture, strategy, overview)** | Claude Opus | Gemini 2.5 Pro → gpt-5.5 | Plans are read by every executor downstream — quality compounds. |
| **Trivial edits (typos, single-line)** | Claude Opus *(Haiku in cost-opt phase)* | Gemini 2.5 Flash-Lite / OpenAI gpt-5.5 | Quality first — no tier downgrade in this phase. |
| **Large-context reads (full codebase audit, bulk MDX generation)** | Gemini 2.5 Pro (1M ctx) | Claude Opus chunked | Gemini's context is ~5× larger; free tier covers our volume. |
| **Content generation (articles, copy drafts)** | Gemini 2.5 Pro | Claude Opus | Free tier, good writing, large context for style consistency. |
| **Image / video / music** | Gemini (native multimodal) | — | Claude doesn't generate media. |
| **Deep research (multi-source synthesis)** | Gemini 2.5 Pro (with Google Search grounding) | OpenAI gpt-5.5 with web | Google Search integration is the differentiator; free tier. |
| **Code review on PR diff** | OpenAI gpt-5.5 (Codex / ChatGPT Plus) | Gemini 2.5 Flash | Strongest second opinion on the ChatGPT Plus tier the operator already pays for. |
| **Cline-style agentic refactor** | (substituted → Claude Opus) | — | Cline ships only as a VS Code extension; no headless CLI. |

## Architecture

```
                ┌──────────────┐
issue labels →  │  routing.py  │  ← single source of truth (scripts/lib/routing.py)
                │  decide()    │
                └──────┬───────┘
                       │ Decision { provider, model, workflow, audit }
        ┌──────────────┼─────────────────────┐
        ▼              ▼                     ▼
   workflow=      workflow=            workflow=
   "claude"       "gemini-research"    "codex-review"
   execute.yml    deep-research.yml    codex-review.yml
   (Opus 4.7)     (Gemini 2.5 Pro)     (gpt-5.5)
```

`execute.yml` always runs first on the cron. It picks the top eligible
auto-routine issue, calls `decide()` to pick a provider, **prints the audit
trail to both stdout and the run summary**, and either:

- runs the Claude code-implementation step inline (default), OR
- dispatches `deep-research.yml` for `model/gemini-pro` issues, OR
- dispatches `codex-review.yml` for `model/codex` issues.

The non-Claude paths produce **research / review comments**, not code commits.

## Resilience: triage + execute survive Claude outages

The pipeline has three resilience layers so neither triage nor execute
ever fails outright when Claude is unavailable. A fourth periodic
layer (cross-tree drift detection) sits alongside them — not a
Claude-outage fallback, but a quality safeguard that catches the
inconsistency the per-PR Codex review can't see.

### 1. Triage ladder (every 15 min)

`triage.yml` runs three engines back-to-back, each best-effort:

```
Claude Opus   →  Gemini 2.5 Flash  →  OpenAI gpt-5.5
 (preferred)        (free fallback)       (final fallback)
```

Each stage early-exits if the queue is empty, so the cost is one cheap
"is the queue empty?" check per provider per run when Claude succeeded.
Operators can force a single engine via `workflow_dispatch.engine` =
`claude` | `gemini` | `codex`. Default `auto` runs the full ladder.

### 2. Post-triage planning stage (every hour, +on triage workflow_run)

`plan-issues.yml` walks `status/planned + auto-routine` issues that lack
a `plan/detailed` label and asks an AI to write a structured
implementation plan as a comment. Plan ladder:

```
Claude Opus  →  Gemini 2.5 Pro  →  OpenAI gpt-5.5
```

The plan format is contractual (files to modify + step-by-step + DOD), so
**any executor — Claude, Codex, or Gemini — can implement it without
re-interpreting the issue**. This is what makes Claude-down execution safe.

### 3. Execute ladder (every hour)

`execute.yml` runs Claude with `continue-on-error: true`. If the Claude
step fails for any reason (rate limit, OAuth dead, action error) AND the
issue carries `plan/detailed`, execute dispatches `execute-fallback.yml`
with engine=auto:

```
OpenAI Codex CLI  →  Gemini CLI
   (preferred)         (free tier)
```

The fallback executor refuses to run on issues without a detailed plan
(lower hallucination risk: it implements *the plan*, not *the issue*). It
runs `tsc` + `lint`, opens a draft PR if either fails, otherwise opens a
ready PR.

### 4. Drift detection (weekly)

`gemini-deep-audit.yml` runs Mondays 08:00 UTC and reads a curated
subset of the tree (`src/`, `docs/`, top-level configs) as a single
prompt to **Gemini 2.5 Pro** (1M context). It surfaces clusters of
inconsistency — groups of 2+ files where one or more deviate from a
pattern the others establish — and files at most **5 issues per run**
labelled `Drift: …` + `status/needs-triage` + `type/cleanup`. The
hallucination guard drops any cluster citing a non-existent path or
containing fewer than 2 files.

This is the cross-tree counterpart to the per-PR Codex review: the
Codex loop sees one diff at a time, so cross-tree naming and style
drift is invisible to it. Full operator contract — output shape,
hallucination guard, token-budget guard, rate-limit handling, and
the first-week smoke test — lives in
[`docs/ops/gemini-deep-audit.md`](./ops/gemini-deep-audit.md). The
workflow + driver script + unit test land in a separate
`infra-allowed` issue (the paths are hard-excluded from the
auto-routine playbook).

### Cadence summary

| Workflow | Cadence |
|----------|---------|
| `triage.yml` | every 15 min |
| `plan-issues.yml` | every hour (offset 30 min) + after every triage |
| `execute.yml` | every hour |
| `deep-research.yml` | dispatched by execute.yml |
| `codex-review.yml` | on every `pull_request` (open/reopen/synchronize/ready_for_review) + dispatched by execute.yml for issue reviews + dispatched by `codex-review-recheck.yml` for deferred PRs |
| `codex-pr-fix.yml` | on `issue_comment` when Codex posts a review on a PR |
| `codex-review-backlog.yml` | manual (operator-triggered) |
| `codex-review-recheck.yml` | every 4 hours — retries `review-deferred` PRs and seeds backlog issues for merged PRs that lack `codex-reviewed` |
| `execute-fallback.yml` | dispatched by execute.yml on Claude failure |
| `bot-usage-monitor.yml` | every 1 hour — rolling-5h + weekly behavioural quota report |
| `ai-smoke-test.yml` | weekly (Mondays 12:00 UTC) |
| `gemini-deep-audit.yml` | weekly (Mondays 08:00 UTC) — Gemini 2.5 Pro full-tree drift audit; ≤5 issues/run; runbook: [`docs/ops/gemini-deep-audit.md`](./ops/gemini-deep-audit.md) |

### Consistency gate (every PR)

Every newly-opened PR triggers `codex-review.yml`, which posts a
structured review and labels the PR `codex-reviewed`. If Codex flags
blocker/major findings or returns a `request-changes` verdict, it
additionally adds `codex-blockers` — both `auto-merge.yml` and the
inline auto-merge in `execute.yml` refuse to enable auto-merge while
that label is set. `codex-pr-fix.yml` then attempts to apply the
mechanical, low-risk findings as a follow-up commit; the label clears
only when codex-review.yml's next synchronize-trigger re-review comes
back clean. Full design + hallucination guards: see
[`AI_CONSISTENCY.md`](./AI_CONSISTENCY.md).

#### When OpenAI is unavailable

`codex-review.yml` walks a small ladder via
`scripts/codex-review-fallback.py`:

```
OPENAI_API_KEY → OPENAI_API_KEY_BACKUP → Gemini 2.5 Flash → defer
```

- **Dual OpenAI keys** — the operator runs two OpenAI accounts (one
  paid, one free) with independent quota windows. The script tries
  the primary first; on 429 (quota) or transient HTTP error it tries
  the backup before falling through to Gemini. A 429 on the paid
  account no longer skips the free one.
- **Gemini fallback** — when both OpenAI keys are missing or returning
  429, Gemini 2.5 Flash produces the review instead. Flash, not Pro:
  the 500-RPD free-tier quota is what keeps this fallback genuinely
  unconstrained (Pro 429'd in lockstep with OpenAI in production).
  The PR is labelled both `codex-reviewed` (so auto-merge can proceed
  if there are no blocker/major findings) and
  `codex-reviewed-by-gemini` (so the monitoring dashboard can spot a
  degraded Codex path).
- **Defer** — when both providers are unavailable, the PR is labelled
  `review-deferred`. `auto-merge.yml` refuses to enable auto-merge
  while that label is set. `codex-review-recheck.yml` retries every
  4h until at least one provider's quota window has reset.

#### Catching missed deploys (`codex-review-recheck.yml`)

A merged PR == a Vercel deploy. Two ways a deploy can land without
the consistency check:

1. The PR opened during a brief outage of both review engines and got
   merged before the recheck cron retried.
2. The PR pre-dates the consistency gate entirely.

The recheck workflow handles both:

- **Open PRs labelled `review-deferred`** → `workflow_dispatch`
  `codex-review.yml` again with `pr=N`. The fallback ladder retries
  now that quota may have reset.
- **Merged PRs in the last 14 days that lack `codex-reviewed`** →
  delegate to `scripts/seed-codex-review-backlog.py`, which creates
  one tracking issue per gap with `model/codex` + `type/code-review`.
  The bot's normal execute pipeline then dispatches
  `codex-review.yml` in issue mode and the review attaches to both
  the issue and the merged PR.

For older PRs (pre-gate), the operator can also run
`codex-review-backlog.yml` (manual, dry-run by default).

### Plan consistency review (every plan)

`plan-issues.yml` now runs a two-pass loop: Claude Opus drafts the
plan to a temp file, `scripts/codex-plan-review.py` asks gpt-5.5 to
spot-check it for consistency, and Claude either applies the findings
or justifies skipping them in a `### Codex review notes` subsection of
the final comment. The Codex review is appended as a collapsible block
in the issue comment for audit. Codex outage / missing key is
non-fatal — the script returns a "skipped" marker and planning
proceeds.

### Auto-merge → Vercel prod immediately follows execution

Both `execute.yml` (Claude path) and `execute-fallback.yml` (Codex/Gemini
path) run an auto-merge gate immediately after a successful PR open. The
gate enables `gh pr merge --auto --squash` for any PR that is

- labeled `auto-routine`, AND
- linked to an issue with `complexity/trivial` or `complexity/easy`, AND
- not labeled `type/design-cosmetic` or `area/design`, AND
- not labeled `codex-blockers` (consistency gate).

GitHub then waits for Vercel's deploy-preview check, squash-merges to
`main`, and Vercel auto-deploys to prod. No human round-trip.

`auto-merge.yml` is still wired to `pull_request` events as a safety net
for human-opened PRs and any race the inline gate misses.

### Provider labels

Triage attaches one of these to each issue (in addition to the complexity-tier
`model/haiku|sonnet|opus`):

| Label | Workflow | When to use |
|-------|----------|-------------|
| (none) | execute.yml → Claude Opus | Default in the quality-first phase. Code edits. |
| `model/gemini-pro` | deep-research.yml | Full-codebase audits, bulk MDX, deep research with citations. Free tier. |
| `model/codex` | codex-review.yml | Diff/PR review, second-opinion code analysis on `gpt-5.5` (ChatGPT Plus). |
| `model/cline` | execute.yml → Opus (substituted) | Operator hint that the task is "agentic-large-refactor" flavored. Logged as a substitution. |

Triage rules and rationale live in `scripts/triage-prompt.md` (Claude Opus
path in this phase) and the rubric inside `scripts/gemini-triage.py` (Gemini
Flash fallback). Both feed the same `decide()` function, so a single change
to the rubric propagates everywhere.

## "Claude unavailable" fallback logic

Every workflow that uses Claude should have `continue-on-error: true` on the
Claude step, followed by a Gemini/OpenAI fallback step that detects unfinished
work and completes it.

Live examples:
- **triage.yml** — Claude Opus → Gemini Flash → Codex gpt-5.5 ladder; engine selectable via `workflow_dispatch.engine`.
- **plan-issues.yml** — Claude Opus → Gemini Pro → OpenAI gpt-5.5 ladder for the post-triage planning stage.
- **execute.yml** — Claude Opus primary (quality-first); on failure, dispatches `execute-fallback.yml` for any issue with `plan/detailed`. Issues without a plan get re-queued for the planner.
- **execute-fallback.yml** — Codex CLI → Gemini CLI ladder. Refuses to run without a `plan/detailed` comment (so the executor implements the plan, not the issue).
- **deep-research.yml** — Gemini Pro only. If `GEMINI_API_KEY` is missing the workflow errors loudly so the operator notices.
- **codex-review.yml** — OpenAI Codex only. If `OPENAI_API_KEY` is missing OR returns 429, the workflow removes `model/codex` from the issue and routes it back to the Claude path on the next execute run.

## CLI setup

Run `.github/workflows/setup-cli.yml` from the Actions tab to install/verify
both external CLIs in one go. It also runs the routing smoke test, so a
green run means: CLIs installed + secrets present + rubric correct.

```
gh workflow run setup-cli.yml --repo palimkarakshay/lumivara-site
```

The runtime workflows each install the CLI they need on every run, so
setup-cli.yml is purely a verification convenience — there's no persistent
state it depends on.

## Secrets required (repo → Settings → Secrets → Actions)

| Secret | Used by | How to get | Required? |
|--------|---------|------------|-----------|
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude CI | `claude setup-token` locally, paste output | yes |
| `GEMINI_API_KEY` | Gemini REST + CLI | https://aistudio.google.com/apikey — free tier | yes |
| `OPENAI_API_KEY` | OpenAI/Codex | https://platform.openai.com/api-keys — pay-as-you-go | optional (codex-review.yml gracefully degrades) |

## Smoke test

`.github/workflows/ai-smoke-test.yml` — runs weekly (Mondays 12:00 UTC) and on
demand. It:

1. Pings each provider with "reply pong"
2. Verifies the Codex + Gemini CLIs install cleanly
3. Runs `scripts/test-routing.py` against 10 sample issue label-sets and
   asserts every one routes to the expected provider

A failure on (1) Gemini, (3) Claude OAuth, or (3) the routing rubric fails
the job. CLI install + OpenAI quota are warnings only.

Manually run:
```
gh workflow run ai-smoke-test.yml --repo palimkarakshay/lumivara-site
```

## Audit trail

Every `execute.yml` run prints the routing decision to both stdout and the
GitHub Actions step summary, in the form:

```
── Routing decision ──
  provider : gemini
  model    : gemini-2.5-pro
  workflow : gemini-research
  label    : model/gemini-pro
  • `model/gemini-pro` label present — routing to Gemini for large-context / research / bulk-content task.
```

Look at any execute run in the Actions tab to see why a particular issue went
to a particular model.

## Model IDs (as of 2026-04)

```
claude-opus-4-7              # default for triage / plan / implement (quality-first phase)
claude-sonnet-4-6            # reserved for the cost-optimisation phase (medium tier)
claude-haiku-4-5-20251001    # reserved for the cost-optimisation phase (trivial / easy)
gemini-2.5-pro               # 1M ctx, deep reasoning (free tier: 100 RPD)
gemini-2.5-flash             # fast, good enough for classification (free tier: 500 RPD)
gemini-2.5-flash-lite        # cheapest (free tier: 1000 RPD)
gpt-5.5                      # ChatGPT Plus tier — Codex review, plan fallback, triage fallback
gpt-4o-mini                  # legacy reference; superseded by gpt-5.5 on this repo
```

## Note on Cline

Cline (formerly Claude Dev) is a VS Code extension for agentic coding. It does
not ship a headless CLI suitable for GitHub Actions, so any task tagged
`model/cline` is substituted to Claude Opus by `scripts/lib/routing.py` (the
quality-first default). The substitution is visible in the audit trail. If/when
an upstream `cline` CLI lands, swap the substitution for a real dispatch path
in `routing.py` and add a corresponding `cline-execute.yml`.

## Review cadence

Check this table every ~2 months. New free/cheap models emerge regularly. Questions to ask:
- Is there a new Gemini/OpenAI tier with better free limits?
- Has a local/open model (Llama, Qwen) become good enough for triage?
- Is there a stronger / cheaper OpenAI model than gpt-5.5 for code review?
- Has Cline shipped a headless CLI yet?

Suggest candidates in a GitHub issue tagged `type/claude-config`.
