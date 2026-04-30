<!-- OPERATOR-ONLY. The single-page map of every cron, workflow, script. -->

> _Lane: 🛠 Pipeline._

# Automation map

One page that lists every workflow, its cron, its concurrency group, the scripts it calls, and the labels it reads/writes. The first place to look when wondering "what runs and when?" The 24+ workflow files are the source of truth; this is the index.

## Lane summary

| Lane | What it owns | Workflows |
|---|---|---|
| **Triage** | Apply `priority/`×`complexity/`×`area/`×`type/`×`model/`×`auto-routine`/`human-only` triple to fresh issues | `triage.yml` (general — skips `area/forge`) + `forge-triage.yml` (forge-only, exclusive) |
| **Plan** | Maker-checker: Claude drafts plan → Codex reviews | `plan-issues.yml` |
| **Execute (general)** | Claude implements `auto-routine` issues; opens PR | `execute.yml`, `execute-single.yml`, `execute-multi.yml`, `execute-complex.yml`, `execute-fallback.yml` |
| **Execute (forge)** | Claude implements `area/forge` issues; opens PR | `forge-execute.yml` |
| **Review** | Codex reviews every PR; classifier filters → Claude applies safe fixes; auto-merge gates on review verdict | `codex-review.yml`, `codex-pr-fix.yml`, `codex-review-recheck.yml`, `codex-review-backlog.yml`, `auto-merge.yml` |
| **Capture** | Doc-driven backlog seeding via `<!-- bot-task -->` markers; operator-gated apply | `doc-task-seeder.yml` |
| **Watcher** | Detect drift (Vercel ↔ main, Pattern C, bot usage) | `deploy-drift-watcher.yml`, `pattern-c-watcher.yml`, `bot-usage-monitor.yml` |
| **Smoke** | Weekly provider + lane health checks | `ai-smoke-test.yml`, `forge-smoke-test.yml` |
| **Deploy / Sync** | Build the AI Ops dashboard; sync issues to Project board | `deploy-dashboard.yml`, `project-sync.yml` |
| **Helper** | Manual operator dispatches | `setup-cli.yml`, `deep-research.yml` |

## Cadence (aggressive deploy-push phase, 2026 Q2)

| Workflow | Cron | Concurrency group | Notes |
|---|---|---|---|
| `triage.yml` | `*/10 * * * *` | `triage-runtime` | Skips `area/forge` (lane exclusivity, codified in `scripts/triage-prompt.md`). |
| `forge-triage.yml` | `5,15,25,35,45,55 * * * *` | `forge-triage-runtime` | Owns `area/forge` exclusively. Offset 5 from `triage.yml`'s `*/10` so the two lanes interleave instead of firing simultaneously. |
| `plan-issues.yml` | `15,45 * * * *` | `plan-runtime` | Claude maker → Codex checker. |
| `execute.yml` | `*/30 * * * *` | `claude-runtime` | On Claude path + `area/forge`, walks the queue and skips forge items (defers to `forge-execute.yml`); does not exit early. Non-Claude routes (gemini-research, codex-review) fall through. |
| `execute-{single,multi,complex}.yml` | dispatch | `claude-runtime` | Same group → never races `execute.yml`. |
| `execute-fallback.yml` | dispatch | `fallback-execute-runtime` | Different group; only used when Claude is down. |
| `forge-execute.yml` | `*/15 * * * *` | `forge-execute-runtime` | Parallel to `execute.yml` (different group); `area/forge` only. |
| `codex-review.yml` | on PR | `codex-review-runtime` | Reviews every PR opened. |
| `codex-review-recheck.yml` | `17 */2 * * *` | `codex-review-recheck-runtime` | Backstop for PRs that escaped review. |
| `codex-pr-fix.yml` | `issue_comment` | per-PR | Apply safe Codex fixes. |
| `auto-merge.yml` | on PR | `auto-merge-${pr.number}` (per-PR) | Merges when review is clean. |
| `doc-task-seeder.yml` | `0 2 * * *` (daily 02:00 UTC) | `doc-task-seeder` | Dry-run; `--apply` gated by operator label + source_id allow-list. |
| `deploy-drift-watcher.yml` | `*/30 * * * *` | `deploy-drift-watcher` | Vercel ↔ main drift. |
| `pattern-c-watcher.yml` | `0 14 * * *` (daily 14:00 UTC) | `pattern-c-watcher` | Runs `scripts/pattern-c-audit.sh`. |
| `bot-usage-monitor.yml` | `23,53 * * * *` | `bot-usage-monitor-runtime` | Cost telemetry. |
| `ai-smoke-test.yml` | Mon 12:00 UTC | _none_ | One-shot Monday smoke. |
| `forge-smoke-test.yml` | Mon 12:30 UTC | _none_ | Forge-lane smoke (offset 30 min). |
| `deploy-dashboard.yml` | push to `main` | `pages-deploy` | Builds dashboard SPA. |
| `project-sync.yml` | on PR / on issue | _none_ | Issue → Project Kanban. |
| `deep-research.yml` | dispatch | `deep-research-runtime` | Dispatched by `execute.yml` for `model/gemini-pro` issues. |
| `codex-review-backlog.yml` | dispatch | `codex-review-backlog-runtime` | One-shot historical backfill. |
| `setup-cli.yml` | dispatch | _none_ | Operator helper. |

## Maker-checker pairs (independent verification)

These are intentional; never collapse them into a single-model loop:

| Maker | Checker | Where |
|---|---|---|
| Claude (planner) | Codex / `codex-plan-review.py` | `plan-issues.yml` (sequential job) |
| Claude (executor) | Codex / `codex-review.yml` | PR-trigger after `execute.yml` opens PR |
| Codex (review request-changes) → classifier → Claude (fixer) | Codex (re-review on synchronize) | `codex-pr-fix.yml` + `codex-review.yml` |
| Live deployment state | `deploy-drift-watcher.yml` | Opens P1 issue when Vercel SHA ≠ tip of main |
| Doc-task seeder (proposer) | Gemini + Codex steelman/pre-mortem + operator label | `doc-task-seeder.yml` (4 tiers) |
| Codex review coverage | `codex-review-recheck.yml` | Catches PRs merged without review |

## Lane exclusivity rules

* `forge-triage.yml` owns every `area/forge` issue. `triage.yml` skips them by rule (codified in `scripts/triage-prompt.md` and the eligible-issue filter).
* `forge-execute.yml` is the sole Claude implementer for `area/forge`. `execute.yml` walks its sorted candidate list and skips forge-Claude items individually (does NOT exit early — that would starve non-forge work below them in the queue). Gemini-research / codex-fallback dispatches still fall through because forge-execute does not handle them.
* `claude-runtime` is the single-flight group for every Claude implementation in the general lane.
* `forge-execute-runtime` is the forge lane's single-flight group. It runs in parallel with `claude-runtime` — intentional, because Max 20x has the headroom and the operator wants the deploy push to finish quickly.

## Known limitations (audit transparency)

This map names what's built; these are gaps the operator should be aware of:

1. **No PR-gating CI workflow.** `package.json` defines `lint`, `test`, `build`, and `e2e` (Playwright) scripts; none run automatically on `pull_request`. Vercel's preview build runs `next build` (which includes typecheck) implicitly, so type errors are caught — but ESLint, Vitest, and the existing `e2e/a11y.spec.ts` axe-core spec are NOT enforced. See `automation-future-work.md §1` for the proposed fix.
2. **Two parallel Claude sessions at peak.** `claude-runtime` and `forge-execute-runtime` are separate groups; both can run a Claude Code action simultaneously. Max 20x has the headroom but the operator should know.
3. **Triage race window is small but non-zero.** `triage.yml` and `forge-triage.yml` both fire on `issues.opened`. The general triage now skips `area/forge` issues, but a freshly-opened issue arrives without that label. The first triage pass to run wins; the second's filter then takes effect.
4. **Codex review can defer.** When both OpenAI and Gemini quotas are exhausted, the review marks PRs `review-deferred`. Auto-merge respects the label and waits; `codex-review-recheck.yml` retries every 2h.

## Adding a new workflow — checklist

1. Lane: which row in the table above? If it doesn't fit, propose a new lane in a separate PR before adding the workflow.
2. Cron: pick an offset that does not collide with `:00` (the existing on-the-hour crons cluster there). Document the rollback cadence for the cost-optimisation phase.
3. Concurrency group: every workflow gets one. Use `<lane>-runtime` for cron-driven, `<event>-${id}` (per-PR / per-issue) for event-triggered.
4. Permissions: `contents: read` minimum; add `issues: write` / `pull-requests: write` only if needed. Never grant `id-token: write` unless OIDC is in scope.
5. Token: prefer `${{ github.token }}`; fall back to a PAT or `CLAUDE_CODE_OAUTH_TOKEN` only when the workflow needs cross-repo or claude-code-action scope.
6. Maker-checker: if the workflow modifies code, what's the independent checker? `codex-review.yml` covers PRs; for label/data writes, declare an audit/dry-run mode like `doc-task-seeder.yml`.
7. Manifest update: add the row to this file (`docs/ops/automation-map.md`) **in the same PR**.

## When something is not running

* `gh workflow list --repo palimkarakshay/lumivara-site` — confirm the workflow is enabled.
* `gh run list --repo palimkarakshay/lumivara-site --workflow <file> --limit 5` — last five runs.
* `gh run view <id> --log` — full log.
* For Claude Code action runs: also check the `bot-usage-monitor.yml` step summary for the previous hour — Max 20x quota exhaustion shows up there before it shows up as a workflow failure.

*Last updated: 2026-04-30. Cadence reflects the aggressive deploy-push phase; rollback target named per row.*
