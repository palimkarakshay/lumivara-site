<!-- lane-key:v2 — Dual-Lane Repo aligned (2026-04-29) -->
# Lane key

Every wiki page (and every doc under `docs/**`) is stamped with one of three badges so a reader knows which entity of the Dual-Lane two-repo trust model (Dual-Lane Repo) the content belongs to.

| Badge | Lane | Meaning |
|:---:|---|---|
| 🛠 | **Pipeline** | Operator-only machinery: GitHub Actions workflows + cron, n8n, Claude OAuth, multi-AI router, dashboard, secrets posture, engagement playbooks, runbooks, decks, storefront, research, vault. Lives in the **pipeline repo** (`<brand-slug>/<client-slug>-pipeline`) after the P5.6 spinout. **Never visible to a client.** |
| 🌐 | **Site** | The per-client Next.js site (the "Site repo" entity in [`docs/mothership/02b-dual-lane-architecture.md §1`](../../mothership/02b-dual-lane-architecture.md)). Site copy, MDX articles, design tokens, contact-form trust boundary, admin-portal client surface. Safe to copy verbatim into a client repo. The client owns this repo after handover. |
| ⚪ | **Both** | General development hygiene that applies on either repo: TypeScript strict mode, lint, tests, branch naming, the issue → PR loop. Updated in both repos by the spinout runbook. |

> 🛠 **Do not copy Pipeline-lane pages to client repos.** When scaffolding a per-client site repo (see [`docs/mothership/06-operator-rebuild-prompt-v3.md`](../../mothership/06-operator-rebuild-prompt-v3.md) and the spinout runbook at [`docs/migrations/lumivara-people-advisory-spinout.md`](../../migrations/lumivara-people-advisory-spinout.md)), include only the 🌐 and ⚪ pages in the client's wiki. The 🛠 pages stay in the operator-private pipeline repo by **permission**, not by branch-listing politeness.

For the canonical architectural model — the two-repo Dual-Lane Repo design that motivates this split — see [`docs/mothership/02b-dual-lane-architecture.md`](../../mothership/02b-dual-lane-architecture.md). The migration manifest that tells the spinout script exactly which path goes where is at [`/.dual-lane.yml`](../../../.dual-lane.yml); the dry-run that proves it covers every tracked file is [`scripts/forge-spinout-dry-run.sh`](../../../scripts/forge-spinout-dry-run.sh).

## Pre-2026-04-28 history (deprecated)

Earlier drafts of this lane key referenced an `operator/main` overlay branch on the client repo as the trust boundary. That model was retired on 2026-04-28 (decision recorded in [`11 §1`](../../mothership/11-critique-architectural-issues.md)) in favour of the two-repo Dual-Lane Repo design. If you find a doc that still describes the overlay-branch trust boundary, it is drift; fix it in the same PR per [`docs/mothership/02b-dual-lane-architecture.md`](../../mothership/02b-dual-lane-architecture.md).
