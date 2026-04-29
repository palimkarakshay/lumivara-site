---
name: Audit mismatch
about: One mismatch found while running docs/ops/audit-runbook.md
title: 'audit YYYY-QN: <Surface>.<Control> drift — <one-line>'
labels: 'type/github, status/needs-triage, area/infra'
assignees: ''
---

<!--
Use one issue per delta (Surface × Control). Filed by the operator
during a quarterly or rotation-triggered audit; see
docs/ops/audit-runbook.md §5.

Every field below is required. Triage uses Severity to set
priority/PN; do not pre-set priority labels — let triage do it.
-->

## Control

<!-- Section + row in docs/ops/platform-baseline.md or
docs/ops/variable-registry.md. Example:
"platform-baseline §1.4 / branch protection on main / allow_force_pushes" -->

## Expected (per baseline)

<!-- Quote the exact cell from the baseline / registry table. -->

## Actual (observed)

<!-- Paste the live export verbatim — `gh api` JSON snippet,
Vercel API response, or a screenshot reference like
`scratch/vercel-ui-domains.png`. Names only — never values. -->

## Severity

<!-- Pick exactly one. The rubric is in docs/ops/audit-runbook.md §5.

- P0 — secret leak; less-safe protection toggled silently; webhook
  appearing where none should exist; credential present without a
  matching baseline row.
- P1 — drift in a routing variable; missing needs-vercel-mirror;
  baseline name absent from live; protection-rule numeric drift;
  Pages disabled when expected on.
- P2 — doc-only drift, cosmetic mismatch with no runtime impact.
-->

- [ ] P0
- [ ] P1
- [ ] P2

## Owner

<!-- `operator` for credentials and repo settings; `client` only when
the baseline row's Owner column says `client` (per-engagement Vercel
env vars). -->

## Pointer to baseline doc

<!-- Direct link to the section anchor, e.g.
docs/ops/platform-baseline.md#14-branch-protection--main -->

## Audit run

<!-- The audit cycle that surfaced this. Format: YYYY-QN (e.g.
2026-Q2) or "rotation/<reason>" (e.g. rotation/openai-key). -->
