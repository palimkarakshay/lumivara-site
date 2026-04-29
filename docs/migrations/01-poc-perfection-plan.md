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

(filled in subsequent commit)

## §2 — Gap inventory (what's between today and the gate)

(filled in subsequent commit)

## §3 — Dated 14-day plan

(filled in subsequent commit)

## §4 — Hard exit checks

(filled in subsequent commit)

## §5 — Risks and resume protocol

(filled in subsequent commit)

*Last updated: 2026-04-29.*
