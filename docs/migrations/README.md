<!-- OPERATOR-ONLY. Mirrors of, and citations to, this folder ship nowhere except the mothership repo. -->

# `docs/migrations/` — One-shot migration runbooks

This folder holds **one-shot migration runbooks** — single, copy-pasteable documents the operator runs end-to-end to move the practice (or a given client engagement) from one architectural state to another. Each runbook is phased, has explicit dry-run / rollback procedures per phase, and ends with executable acceptance criteria. Runbooks are *not* code; they are operator-facing prose with embedded shell, `gh`, and `vercel` commands.

> **Pattern C surface:** every runbook in this folder cites [`docs/mothership/pattern-c-enforcement-checklist.md`](../mothership/pattern-c-enforcement-checklist.md) as its pre-migration gate (§4 of the checklist) and post-migration acceptance set (§5). A runbook that does not cite both sections is incomplete.

## What goes here vs. elsewhere

| Question | Folder |
|---|---|
| Is this a one-shot transition (e.g. spin Lumivara People Advisory out into its own client repo)? | `docs/migrations/` |
| Is this a *per-engagement* runbook the operator runs every time a new client is onboarded? | `docs/mothership/06-operator-rebuild-prompt-v3.md` (the engagement playbook) |
| Is this a *recurring* operations procedure (audits, rotations, cost reports)? | `docs/operator/` (mothership-only; not a client-facing folder) |
| Is this client-shareable copy or rendered handover? | Per-client `docs/CLIENT_HANDOVER.md`, rendered from `docs/mothership/07-client-handover-pack.md` |

The distinction matters because **migration runbooks are throwaway after they run**: a runbook for "spin Client #1 out" is run once, the result is verified, and the file becomes a historical artefact. The engagement playbook (`06-…-v3.md`) is the recurring template.

## Folder contents

| File | Purpose | Status |
|---|---|---|
| `README.md` (this file) | Orientation. | — |
| `_artifact-allow-deny.md` | Re-usable allow / deny / required-new tables that every spinout runbook embeds (Tables A, B, C). Marker comment `<!-- artifact-allow-deny:v1 -->` for future bulk-edits. | Canonical. |
| `lumivara-people-advisory-spinout.md` | Spin out *Lumivara People Advisory* (Beas's HR consulting practice) from the current `palimkarakshay/lumivara-site` into a clean per-client repo `palimkarakshay/lumivara-people-advisory-site`. | One-shot, run by the operator. |

## Authoring conventions

When adding a new migration runbook:

1. **Phased**: number phases `§0` (pre-flight) → `§1`…`§N` → `§<N+1>` rollback → `§<N+2>` acceptance.
2. **Per phase**: every phase ends with three subsections — *Dry-run check*, *Rollback*, *Acceptance*. Acceptance is a `grep`, `gh api`, `curl`, or `vercel` command, never a sentiment.
3. **Embed, do not duplicate**: Tables A/B/C live in `_artifact-allow-deny.md`. Embed by reference (link) and add only client-specific deltas inline.
4. **Cross-link Pattern C**: `§0` cites `pattern-c-enforcement-checklist.md §4`; the final acceptance section cites §5.
5. **Scope hard-exclusions** of the executor (`AGENTS.md` + `scripts/execute-prompt.md` step 4): no edits to `.github/workflows/*`, `scripts/`, `.env*`, `package.json`, `src/app/api/contact/*`, and no deletions of existing pages or components. The runbook narrates these as **operator-manual** steps where they apply.

## Audience

Operator only. The runbooks reference operator-side tooling (`forge` CLI, n8n, Twilio) and operator-internal vault paths. Nothing in this folder is ever copied to a client repo's `main` — see `pattern-c-enforcement-checklist.md §3` C-MUST-NOT-2.

*Last updated: 2026-04-28.*
