<!-- OPERATOR-ONLY. Do not copy to a client repo. -->

# Gemini deep-audit — weekly cross-tree drift detection

A weekly cron job that asks Gemini 2.5 Pro to read the curated tree as
a single prompt and surface **clusters of inconsistency** — groups of
2+ files where one or more files deviate from a pattern the others
establish. The per-PR Codex review only sees the diff; this audit
sees the whole tree, which is where naming and style drift hides.

This runbook is the operator-facing contract. The workflow
(`.github/workflows/gemini-deep-audit.yml`) and driver
(`scripts/gemini-deep-audit.py` + `scripts/test-gemini-deep-audit.py`)
land in a follow-up `infra-allowed` issue — both paths are hard-excluded
from the auto-routine playbook. Everything below is the spec that
follow-up issue executes against.

It complements [`docs/AI_CONSISTENCY.md`](../AI_CONSISTENCY.md)
("Hallucination guards", "Other ways to keep AI bots consistent") and
the cadence row in [`docs/AI_ROUTING.md`](../AI_ROUTING.md) §Cadence.

## Purpose

Periodic full-tree drift detection. Cross-tree naming and style drift
— a new component in `src/components/site/` using `kebab-case.tsx`
when the rest use `PascalCase.tsx`, an MDX file with a frontmatter key
the rest of `src/content/insights/` doesn't have, two helpers in
`src/lib/` solving the same problem differently — is invisible to the
diff-only Codex loop. Gemini 2.5 Pro's 1M-token context window is the
right tool for the read; the free tier (100 RPD) covers a weekly run
with headroom.

## Cadence

**Mondays 08:00 UTC** (cron `0 8 * * 1`) plus `workflow_dispatch` for
operator-driven re-runs. The 08:00 slot is intentionally **4 hours
before** `ai-smoke-test.yml`'s Mondays 12:00 UTC slot — when the
Gemini key is dead or quota is exhausted, the deep-audit failure shows
up first in the run history, then the smoke test confirms the broader
provider outage. Don't shuffle the order without updating this
runbook.

The weekly run is the contract. Don't promote to daily without
revisiting the issue-creation cap and the operator's triage capacity
(see [§Issue creation cap](#issue-creation-cap) below).

## Inputs

A curated subset of the tree, concatenated into one prompt:

- **Allowlist (by extension):** `.ts`, `.tsx`, `.md`, `.mdx`, `.json`,
  `.yml`, `.yaml`, plus top-level `*.ts` / `*.mjs` config files
  (`next.config.ts`, `tailwind.config.ts`, `eslint.config.mjs`, etc.).
- **Roots walked:** `src/`, `docs/`, top-level configs. **Not** walked:
  `node_modules/`, `.next/`, `.git/`, `public/`, anything in
  `.gitignore`, lockfiles (`package-lock.json`, `pnpm-lock.yaml`).
- **Cap:** ≤ ~800k tokens to leave headroom under Gemini's 1M context.
  See [§Token-budget guard](#token-budget-guard) for the overflow
  behaviour.

`scripts/` is intentionally walked — drift in driver scripts (e.g.
divergent argument parsing across `codex-triage.py` and
`gemini-triage.py`) is exactly the cross-tree pattern this audit is
designed to catch. The audit reads `scripts/`; it does not write to
it.

## Output contract

Gemini emits clusters in this **exact** shape (the parser anchors on
the literal strings — drift here breaks the parse):

```
## Cluster: <one-line description>
Files: a/b.ts, c/d.ts, e/f.ts
Pattern: <what the majority does>
Outliers: a/b.ts (<how it deviates>)
Suggested fix: <one sentence>
```

Rules:

- **`## Cluster:`** is the section anchor. Multi-cluster responses
  repeat this header per cluster.
- **`Files:`** is a comma-separated list of repo-relative POSIX paths.
  No quoting, no glob patterns, no leading `./`. The parser splits on
  `,` and strips whitespace.
- **`Outliers:`** lists the deviating subset of `Files:` with a
  parenthetical describing the deviation. An outlier path that doesn't
  appear in `Files:` is a parse error (drop the cluster, log the
  malformed response for the operator).
- **`Suggested fix:`** is one sentence. Multi-sentence or multi-line
  suggestions truncate at the first line break — Gemini occasionally
  emits a paragraph; clip it.

The prompt MUST tell Gemini to emit only this shape and to skip any
prose before the first cluster header. The driver script's `parse()`
function uses `## Cluster:` as the start anchor and discards
everything before the first match.

## Hallucination guard

Two filters, applied in order:

1. **Path-existence check.** For every cluster, verify each path in
   `Files:` exists on disk at audit time. If **any** path is missing,
   drop the **entire cluster** and log
   `dropped: <cluster> — path-not-found: <path>`. Dropping a single
   bad path while keeping the rest is too lenient — Gemini can
   fabricate one path among five legitimate ones, and the operator
   loses the ability to trust the cluster as a whole. Deliberate
   over-correction; revisit if it kills useful clusters in practice.
2. **Cluster-of-one rejection.** Drop any cluster whose `Files:` list
   has fewer than 2 entries. A cluster of one is a single-file finding,
   not drift — by definition there's no "majority pattern" if there's
   no majority. Log
   `dropped: <cluster> — cluster-of-one`.

Both filters fail closed: the dropped cluster never reaches the
issue-creation step. The audit log lists every drop so the operator
can spot a pathological prompt regression (e.g. Gemini suddenly
fabricating paths in 80% of clusters → re-tune the prompt).

## Issue creation cap

**≤ 5 new issues per run.** After the hallucination guard, if more
than 5 clusters survive, take the first 5 in Gemini's output order and
log
`capped at 5 — <N> additional clusters skipped this run`.
The skipped clusters are NOT carried over — the next weekly run gets
a fresh read of the tree and may surface different clusters.

Each surviving cluster becomes one issue:

- **Title:** `Drift: <cluster description>` (verbatim from
  `## Cluster:` line, single-line).
- **Body:** the full cluster block (`Files:` / `Pattern:` /
  `Outliers:` / `Suggested fix:`) verbatim, plus a one-line footer
  citing the run URL and "_Filed by `gemini-deep-audit.yml`._"
- **Labels:** always `status/needs-triage` + `type/cleanup`. Plus an
  inferred area label per the rule below.

**Area inference rule** — use the majority-pattern files (the entries
in `Files:` minus the ones called out as outliers):

| All majority files under… | Label |
|---|---|
| `src/content/` | `area/content` |
| `src/components/` | `area/site` |
| `docs/` | `area/infra` |
| anything else, or mixed | _(omit; let triage assign it)_ |

Mixed-root majorities (e.g. one file under `src/lib/`, one under
`src/components/`) deliberately get no `area/*` label — the triage
pass is better-equipped to read the cluster and pick the right area
than a static rule.

Provider attribution: the issue body must include the same
`>>> THINKING` audit-trail block convention used by `codex-triage.py`
(see its `thinking()` helper) so the AI Ops dashboard's LogViewer
surfaces the audit reasoning. One block per issue, listing the cluster
shape, the hallucination-guard outcome, and the area-inference outcome.

## Token-budget guard

The 800k cap is a guess; real-world tree size will tell us whether
it's right.

- **First dispatch:** the script MUST print the actual concatenated
  input token count to the run log and the GitHub Actions step
  summary, so the operator has a real number for the next iteration.
- **Soft warning at 600k:** if the curated subset crosses 600k tokens,
  the run **warns but does not fail** — log
  `WARN: input is <N> tokens (>600k) — directory split planned for next run`.
  This gives the operator one cycle to file the directory-split
  follow-up before the cap actually bites.
- **Hard limit at 800k:** if input exceeds 800k tokens, the run
  **fails** with a non-zero exit. The operator must either tighten the
  allowlist or implement the directory-split strategy (see
  [§Follow-ups](#follow-ups) below) before the next Monday.

Do not silently truncate. A truncated audit produces clusters that
look real but are missing context — exactly the input the
hallucination guard is least equipped to catch.

## Rate-limit handling

Free-tier limits as of 2026-04: Gemini 2.5 Pro = 100 RPD. A weekly
cron run is 1 RPD; the realistic risk is `workflow_dispatch` re-runs
when the operator iterates on the prompt or debugs a bad cluster.

- **`429` response:** the script MUST surface the rate-limit headers
  verbatim in the run log and exit non-zero with
  `gemini-rate-limited: <X-RateLimit-* headers>`. Don't auto-retry —
  the next weekly cron will recover after the quota window resets.
- **Soft warning when remaining quota < 10:** if the response headers
  show `X-RateLimit-Remaining` (or equivalent) below 10, log
  `WARN: gemini quota near cap — <N> requests remaining today` so the
  operator notices before the next manual dispatch fails.
- **Operator guideline:** wait at least one hour between manual
  dispatches. If a debugging session needs more than ~10 dispatches in
  a day, switch to a local fixture file (the unit test takes the same
  parser path as production).

## First-week smoke test

Immediately after the workflow + driver land, the operator runs a
manual `workflow_dispatch` on `main` and verifies:

1. The run completes inside the runner timeout (default 6h; expected
   <10 min).
2. **≤5 issues are filed**, each titled `Drift: …`.
3. Every cited path in every issue's `Files:` line exists on disk
   right now (open each issue, click each path, expect a 200).
4. The run log shows the actual token count and the
   hallucination-guard drop log (even if zero drops).
5. No `429` from Gemini; remaining-quota warning absent.

Failure modes for the smoke test:

- **More than 5 issues filed** → cap is broken. Hard-revert the
  workflow, file an `infra-allowed` issue to fix the cap.
- **A cited path 404s** → hallucination guard is broken. Same revert
  + fix loop.
- **Run timeout / OOM** → input is over budget; tighten the allowlist
  or implement directory-split before re-enabling the cron.

If the smoke test passes, the cron run on the following Monday is the
acceptance criterion. The operator triages (or `wontfix`-closes) the
filed issues within a week so a backlog of stale `type/cleanup`
issues doesn't crowd higher-priority work.

## Follow-ups

Tracked in the same `infra-allowed` issue that lands the workflow +
driver, but called out separately so they're not lost:

- **Directory-split strategy.** If the soft warning fires at 600k, the
  next iteration of the script splits the audit by top-level directory
  (one Gemini call per `src/`, `docs/`, configs) and merges the
  cluster output. The 5-issue cap applies to the merged total, not per
  call.
- **Gemini rate-limit header probing.** The exact header names
  (`X-RateLimit-Remaining` vs Google's `X-RateLimit-*`) depend on the
  REST endpoint; the first run should `pprint` the response headers
  to the log so the operator can pick the right field for the soft
  warning.
- **Issue triage SLA.** Track in `bot-usage-monitor.yml` if useful —
  too many open `Drift:` issues older than 14 days is a signal the
  audit is over-firing or the operator is under-triaging.

## See also

- [`docs/AI_CONSISTENCY.md`](../AI_CONSISTENCY.md) §"Hallucination
  guards" — the broader filter contract this audit's two filters slot
  into.
- [`docs/AI_ROUTING.md`](../AI_ROUTING.md) §Cadence — the cron
  cadence row that lists this audit alongside `triage.yml`,
  `plan-issues.yml`, etc.
- [`docs/ops/codex-fix-classify-fixtures.md`](codex-fix-classify-fixtures.md)
  — the negative-test pattern this audit's `test-gemini-deep-audit.py`
  follows (fixture catalogue + `path-not-found` + `cluster-of-one`
  cases).
- [`scripts/codex-triage.py`](../../scripts/codex-triage.py) — the
  layout the new `scripts/gemini-deep-audit.py` mirrors (REST call +
  parser + `gh issue create` driver + `thinking()` audit trail).
