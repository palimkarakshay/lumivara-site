# 17 — GitHub Issue Seeding Pack (Lumivara Forge Mothership → Client #1 Spinout)

> **Historical / migration spec.** This file is a seeding pack for issue bodies. The `operator/main` strings appearing inside example acceptance-criteria blocks are quoting the deprecated term so the seeded issues' grep-DoD lines work as written. The canonical architecture is `02b-pattern-c-architecture.md`.

This file contains copy-ready **issue titles and bodies** for creating planning and execution issues in this repository. The sequence is optimized to spin out **Lumivara People Advisory** as Client #1 from **Lumivara Forge** with strict separation-of-trust, minimal manual steps, and high-confidence automation.

## Issue 1 — Canonical target architecture & trust boundaries

**Title:** `P0: Lock canonical target architecture for Lumivara Forge + Client #1 separation`

**Body:**
```md
## Objective
Define and freeze the canonical architecture for:
- Mothership platform: Lumivara Forge (operator IP)
- First client: Lumivara People Advisory
- Future clients: repeatable tenant pattern

## Required reading
- docs/mothership/00-INDEX.md
- docs/mothership/02-architecture.md
- docs/mothership/03-secure-architecture.md
- docs/mothership/09-github-account-topology.md
- docs/mothership/11-critique-architectural-issues.md
- docs/mothership/12-critique-security-secrets.md
- docs/mothership/14-critique-operations-sequencing.md

## Deliverables
1. Architecture Decision Record in `docs/mothership/adr/ADR-001-canonical-topology.md` that resolves:
   - repo topology (site-only repo vs split site/pipeline repos)
   - automation ownership model (GitHub App preferred over PAT)
   - cron source-of-truth branch/repo
   - exact trust zones and data flow boundaries
2. Mermaid or ASCII diagrams for:
   - org / accounts / repos
   - runtime flow (issue intake → triage → plan → execute → PR → merge → deploy)
3. Threat model summary (what client can/cannot access by design).
4. Explicit "non-goals" list to prevent scope creep.

## Acceptance criteria
- No contradictions across 02/03/09/11/12/14.
- `git grep -n "operator/main" docs/mothership` only matches deprecated-context notes.
- ADR references concrete migration steps for existing `lumivara-site`.

## Execution constraints for Claude Opus
- Use incremental commits every 1 logical section.
- If context >70% budget, stop after current commit and leave continuation note.
- Keep PR small enough for deterministic review.
```

## Issue 2 — Organization/account model bootstrap with least manual work

**Title:** `P0: Bootstrap GitHub org/account/repo automation with minimal operator clicks`

**Body:**
```md
## Objective
Implement an idempotent bootstrap process that creates/verifies:
- GitHub org
- bot identity wiring
- required repos
- secrets scaffold checks
- branch protection/rulesets

## Deliverables
1. New CLI command: `forge bootstrap org`.
2. Dry-run mode + apply mode with clear diff preview.
3. Machine-readable checklist output (JSON) for CI and dashboard.
4. Operator docs section: one-time manual prerequisites only.

## Required implementation details
- Prefer GitHub App auth; PAT only as temporary fallback.
- Every manual step must be explicitly justified and minimized.
- Add retry-safe operations (re-runnable with no side effects).

## Acceptance criteria
- A single command should bring a fresh environment to "ready" state except unavoidable external verifications.
- Emits actionable errors with exact fix command.
- Adds smoke test workflow validating org/repo/app wiring.

## Claude Opus pacing instructions
- Commit in small chunks:
  1) command scaffolding
  2) GitHub API layer
  3) ruleset/secret validations
  4) docs + smoke test
- Stop/resume safely if budget warning threshold is reached.
```

## Issue 3 — First-client spinout playbook (Lumivara People Advisory)

**Title:** `P0: Execute Client #1 spinout plan (lumivara-site -> lumivara-people-advisory-site)`

**Body:**
```md
## Objective
Operationalize Lumivara People Advisory as independent Client #1 while preserving Lumivara Forge as the platform/mothership.

## Deliverables
1. Migration playbook:
   - current-state audit
   - new repo creation
   - history/content migration
   - secrets/env migration
   - webhook/app integration
2. Cutover strategy:
   - pre-cutover checks
   - freeze window
   - rollback plan
3. Post-cutover validation matrix:
   - admin portal auth
   - intake channels
   - PR automation
   - deploy health

## Constraints
- Client repo must not expose operator-only automation internals.
- Handover-ready separation from day one.
- No production downtime during DNS/deploy transition.

## Acceptance criteria
- Documented and tested dry-run migration script exists.
- Final runbook supports repeat use for client #2+.

## Claude Opus commit strategy
- One commit per migration phase (audit, scaffolding, cutover, validation docs).
- Keep each commit reviewable (<~400 lines changed where practical).
```

## Issue 4 — Pipeline repo automation and cross-repo trust

**Title:** `P0: Implement pipeline-to-site automation contract using GitHub App tokens`

**Body:**
```md
## Objective
Ensure automation executes from operator-controlled context and writes to client site repos via least-privilege short-lived tokens.

## Deliverables
1. Standardized pipeline workflow templates.
2. Shared action/helper for generating installation token.
3. Contract docs: allowed operations, forbidden operations, audit event shape.
4. Security guardrails:
   - actor allowlist gates
   - no plaintext secret emission
   - policy checks on workflow changes

## Acceptance criteria
- No long-lived write PAT required for normal operations.
- All PR/issue write actions trace to app installation identity.
- CI check fails when unsafe workflow patterns are introduced.

## Claude Opus pacing
- Commit per workflow category (triage, plan, execute, merge/deploy).
- Add continuation issue automatically if >80% budget consumed.
```

## Issue 5 — Zero-touch merge/deploy orchestration with safety gates

**Title:** `P1: Enable autonomous merge-to-main and Vercel production deploy with policy safeguards`

**Body:**
```md
## Objective
Move toward autonomous merge/deploy while preserving strict policy checks, staged rollout, and rapid rollback.

## Deliverables
1. Policy engine for auto-merge eligibility:
   - required checks
   - risk scoring
   - changed-file path guardrails
2. Deployment orchestration:
   - trigger production deploy only on qualified merges
   - capture deployment metadata and health results
3. Automatic rollback trigger for failed post-deploy health probes.
4. Audit log record + dashboard visibility.

## Important note
Current repo docs indicate Vercel dashboard steps may still require operator action in some cases. Resolve this gap by documenting what can be fully automated vs what remains explicitly manual.

## Acceptance criteria
- A low-risk content/code change can complete issue->PR->merge->deploy without operator intervention.
- High-risk changes are held for review with explicit rationale.
```

## Issue 6 — Gap checker: detect and file architecture/doc inconsistencies

**Title:** `P0: Build consistency checker that auto-detects architecture contradictions and files fix issues`

**Body:**
```md
## Objective
Create a static/doc validation tool that scans mothership docs + workflow templates for contradictions and opens remediation issues.

## Deliverables
1. Checker script (e.g., `scripts/check-architecture-consistency.py`).
2. Rule set examples:
   - cron semantics contradictions
   - deprecated topology references
   - secret model inconsistencies (PAT vs App)
   - trust-zone leakage language
3. GitHub Action that runs nightly and files/updates one issue per unique gap.

## Acceptance criteria
- Checker emits deterministic findings with file/section references.
- Duplicate issue spam is prevented via fingerprinting.
- Runbook explains how to add new rules.
```

## Issue 7 — Claude execution reliability pattern (anti-timeout)

**Title:** `P0: Standardize Claude Opus anti-timeout execution pattern for long-running architecture tasks`

**Body:**
```md
## Objective
Codify execution tactics so Claude can finish complex tasks without context/time budget collapse.

## Deliverables
1. `docs/mothership/CLAUDE_EXECUTION_PATTERN.md` with:
   - chunk sizing rules
   - commit cadence
   - pause/resume protocol
   - handoff note template
2. Workflow integration:
   - detect budget thresholds
   - auto-post continuation summary
   - auto-label `status/needs-continuation` where appropriate
3. Prompt templates for "phase N of M" execution.

## Acceptance criteria
- Large architecture tasks can span multiple runs with zero ambiguity.
- Every interruption leaves repository state and issue state recoverable.
```

## Issue 8 — Sequencing integrity: enforce dependency ordering across issues

**Title:** `P0: Introduce issue dependency graph and execution guardrails for architecture program`

**Body:**
```md
## Objective
Prevent invalid execution order by making dependencies explicit and enforceable.

## Deliverables
1. Dependency map (machine-readable YAML/JSON).
2. Bot check that blocks execution if prerequisite issue states are unmet.
3. Dashboard view: "ready", "blocked", "in-progress", "waiting-verification".
4. Auto-generated "gap issues" when dependency cycles or missing prerequisites are detected.

## Acceptance criteria
- Execution workflows skip blocked issues automatically.
- Blocking reason is commented with exact unmet dependency.
- Operators can override with explicit audit trail.
```

## Operational note for issue creation
Use these issues in the exact sequence 1->8 to minimize rework and maximize safe automation.
