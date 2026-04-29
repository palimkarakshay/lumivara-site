<!-- OPERATOR-ONLY. Dated POC perfection plan that gates Phase 2 of 00-automation-readiness-plan.md. -->

# POC Perfection Plan — finish before migration starts

> **Purpose.** Convert the abstract Phase 1 exit criterion in
> [`00-automation-readiness-plan.md §3.1`](./00-automation-readiness-plan.md#31--exit-criterion-the-only-thing-that-matters)
> into a **dated, day-by-day** plan with concrete tasks, owners, evidence
> rows, and a single hard gate that blocks every later phase.
>
> **Scope.** This file does not redefine Phase 1; it sequences the work
> to satisfy it. The canonical sources of truth remain:
>
> - `docs/migrations/00-automation-readiness-plan.md` — the phase map.
> - `docs/mothership/02b-pattern-c-architecture.md` — the end-state.
> - `docs/mothership/pattern-c-enforcement-checklist.md` — the pre-flight
>   gate this POC must clear before §4 of that file can be ticked.
> - `docs/deploy/production-integrity.md` — the integrity contract that
>   the production-deployment fix (PR #151, branch
>   `claude/fix-production-deployment-BuaWE`) introduced and that this
>   POC has to **prove green** end-to-end before migration.
> - `docs/freelance/07-client-migration-strategy.md` — the client-facing
>   migration playbook the POC has to be safe enough to drive.
>
> **Status:** drafted 2026-04-29 on branch
> `claude/poc-plan-migration-OFV54`. Operator-blocking rows are
> ☐ **OPERATOR**; bot-runnable rows are ▶ **BOT**.

## §0 — Reading order

1. This file (the dated plan).
2. `docs/migrations/00-automation-readiness-plan.md §1` (where this slots in).
3. `docs/deploy/production-integrity.md §3` (the integrity contract).
4. `docs/mothership/pattern-c-enforcement-checklist.md §4` (the
   pre-migration gate — every row must resolve green from this POC).

If you only have 5 minutes: read §1 (the migration-blocked gate) and §4
(the daily plan day-zero row), then come back.

## §1 — Migration-blocked gate (highest priority)

**Phase 2 (Run S1 mechanical rename) and every later phase
(`00-automation-readiness-plan.md §4`–§7) MUST NOT START** until every
row below is resolved on this repo.

This is a re-statement of `00-automation-readiness-plan.md §3.1` paired
with the residue from PR #151 (`claude/fix-production-deployment-BuaWE`).
Both lists must be green simultaneously.

### §1.1 — Streak gate (from `00 §3.1`)

| #   | Condition                                                                                                                                                | Pass? |
|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| 1.1 | 10 consecutive `auto-routine` issues land green: triage → plan → execute → review → auto-merge → Vercel preview → prod, with zero operator intervention. | ☐     |
| 1.2 | Each of the seven cron paths (triage, execute, execute-complex, execute-single, codex-review, deep-research, auto-merge) has fired at least once in the streak. | ☐ |
| 1.3 | No P1 issues opened during the streak by `codex-review`, `deep-research`, or smoke workflows.                                                            | ☐     |
| 1.4 | Kanban board (Inbox → Triaged → In Progress → Review → Done) mirrors GitHub state with no manual moves.                                                  | ☐     |
| 1.5 | Operator review of the 10 PRs returns "I would have approved every one of these without changes."                                                        | ☐     |

A failed row resets the streak counter to **0/10**, intentionally. The
gate is buying confidence, not throughput.

### §1.2 — Production-integrity gate (residue from PR #151)

The `claude/fix-production-deployment-BuaWE` work introduced
`assertSafePromotion()`, `/admin/deployments`, and the
`deploy-drift-watcher` cron (`docs/deploy/production-integrity.md §3`,
§5). The contract is **only as strong as the live wiring**, so the POC
has to prove every layer fires before migration starts.

| #   | Condition                                                                                                                                                                              | Pass? |
|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| 2.1 | Vercel mirror checklist in `docs/deploy/production-integrity.md §9` is fully ticked (env vars present in all three Vercel environments; `deployment.succeeded`/`error` webhooks added; GitHub repo secrets for the watcher set). | ☐ |
| 2.2 | First-time backfill promote done — `/admin/deployments` reports **drift = 0** for `lumivara` (`production-integrity.md §6` §22-row inventory cleared).                                  | ☐     |
| 2.3 | `deploy-drift-watcher` has run at least once with `drift > 0`, opened/updated the rolling drift issue, and once with `drift = 0`, auto-closed it. Both behaviours captured in the audit log. | ☐ |
| 2.4 | A stale-SHA promote attempt is refused with `would_overwrite_newer` — captured as a screenshot or log line attached to the streak tracking issue.                                       | ☐     |
| 2.5 | An `auto-routine` PR opened during the streak is **auto-promoted** by the drift→triage→execute loop without operator intervention. (One occurrence is enough; this is the loop end-to-end.) | ☐ |

### §1.3 — Pattern C readiness gate

Phase 2 begins the platform/site separation. Run S1 only renames; the
Phase 3+ work splits the artefact tree. To avoid wasted churn, the POC
phase also confirms that `pattern-c-enforcement-checklist.md §4` rows
**that can be checked against this repo today** are green.

| #   | Condition (cross-references `pattern-c-enforcement-checklist §4`)                                                                                                                                                                              | Pass? |
|-----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| 3.1 | Row 1: every operator-only path in C-MUST-1 either lives only in the platform repo (post-Phase 3) or is **explicitly catalogued** in `docs/migrations/_artifact-allow-deny.md` so the spinout can route it.                                    | ☐     |
| 3.2 | Row 3: `git grep -E '[A-Za-z0-9+/=]{32,}' main` is clean (no high-entropy strings on `main`).                                                                                                                                                  | ☐     |
| 3.3 | Row 5: `.claudeignore` exists at repo root and matches `03-secure-architecture.md §2.3` byte-for-byte.                                                                                                                                         | ☐     |
| 3.4 | Row 9: invoice and handover-pack templates contain no third-party brand names (`grep -iE '(anthropic\|google\|openai\|twilio\|resend\|vercel\|n8n\|railway)' docs/clients/<slug>/invoices/*.md` returns nothing once §P5.5 mirrors land — this row is **flagged**, not **gating**, until P5.5). | ☐ |

Rows 2/4/6/7/8/10/11 of `§4` are intentionally **not** in this gate —
they depend on the pipeline repo (Phase 3) and the spinout (Phase 4)
existing and so will be tested in their own runbooks.

### §1.4 — One-line summary

> **Migration cannot start** until §1.1 + §1.2 + §1.3 are all green
> simultaneously. The streak counter resets to 0/10 if any row in §1.2
> or §1.3 regresses during the streak.

## §2 — Gap inventory (what's between today and the gate)

(filled in subsequent commit)

## §3 — Dated 14-day plan

(filled in subsequent commit)

## §4 — Hard exit checks

(filled in subsequent commit)

## §5 — Risks and resume protocol

(filled in subsequent commit)

*Last updated: 2026-04-29.*
