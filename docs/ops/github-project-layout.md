<!-- OPERATOR-ONLY. Do not copy to a client repo. -->

# GitHub Project layout — operator hub

> **Purpose.** Define a single user-level GitHub Project (free tier) that
> visualises every workstream the operator runs in parallel — POC,
> GTM, comms, operator-only manual work, technical, functional,
> research, advisory, dummy-client, prospect-client, legal/vault — without
> spawning 8+ separate projects whose cross-cutting filters would never
> work.
>
> **Audience.** Operator. Bots read this only when they need to know
> which custom-field values to set on a new issue.
>
> **Status.** Drafted 2026-04-29 on branch
> `claude/github-project-setup-rJorr`. Existing project today:
> `Lumivara Backlog` (user-level, created via
> `scripts/bootstrap-kanban.sh` step 2). This doc *extends* that
> project rather than replacing it — no issue migration is required
> for the 46 currently-open issues.

## §0 — Reading order

1. §1 — the recommendation and why one project (not many).
2. §2 — does the operator (or the bot) need new GitHub access?
3. §3 — the field & view spec (what to actually create).
4. §4 — web-UI runbook (Android browser, ~15 minutes).
5. §5 — scripted runbook (Termux on phone, fallback for bulk
   classification once 50+ issues exist).
6. §6 — migration safety: how the existing 46 issues survive the
   field rollout with no data loss and no manual re-add.
7. §7 — Phase 4 transfer playbook: how the project survives the
   org birth and per-client repo births in
   [`00-automation-readiness-plan.md §4`](../migrations/00-automation-readiness-plan.md).

If you only have 5 minutes: read §1, §3.1 (the 11 fields), and §4
(the click-path).

## §1 — Recommendation

**One** user-level GitHub Project named `Lumivara Forge — operator hub`
(or keep the current `Lumivara Backlog` name; the rename is cosmetic).
Free tier covers it: private user-level projects allow unlimited custom
fields and up to ~1,200 items, which is decades of throughput at
current cadence.

### §1.1 — Why one project, not 8+

The planning move you will actually use is **cross-stream
filtering** — "what blocks the first demo?" pulls from POC + GTM +
technical + research at once; "what's on the operator's drop-dead
calendar this month?" pulls from advisory + legal + GTM. Separate
projects break that filter — each project has its own field schema,
and GitHub does not let a single view span multiple projects.

A single project with rich custom fields and many **saved views**
gives every workstream its own kanban or roadmap (looks like a
separate project to the eye) while preserving the cross-stream
filter for the planning meetings that need it.

### §1.2 — Why user-level, not org-level

The `lumivara-forge` org doesn't exist until Phase 0 of the migration
(`docs/migrations/00-automation-readiness-plan.md §3`). A user-level
project survives:

- the org's birth (Phase 0),
- the per-client repo births (Phase 4–6),
- and Phase 4 issue transfers between owners.

Projects can be transferred to an org later without losing items or
field values. Starting at user-level avoids one cycle of creation +
re-add.

### §1.3 — Tradeoff

One project means **one shared field schema**. If a workstream later
wants idiosyncratic fields (e.g. the prospect-CRM workstream wanting
`Last-touched`, `Channel`, `MRR-estimate`), you either bloat the
global schema or live without those fields. Recommendation: live
without them until the prospect-CRM workstream has >5 active rows.
Today it has zero.

## §2 — Access required

| Actor | What's needed | When |
|---|---|---|
| Operator (web UI) | Existing GitHub login. Nothing new. | Day 1 setup; ongoing visualisation. |
| Operator (gh CLI from Termux/laptop) | One-time `gh auth refresh -s project,read:project`. | Only if running the §5 scripted bulk-classifier. |
| Bot (Claude Code Action runs) | Optional fine-grained PAT secret with `Projects: Read & write` and `Contents: Read`, scoped to this user's projects. Stored as `PROJECT_PAT` in repo secrets. | Only when the bot is asked to set custom-field values during triage. The current `triage.yml` does not need this. |
| Bot (this session, MCP) | The MCP GitHub toolset available in interactive sessions has **no Project v2 create/edit tools**. The operator must run §4 or §5 — Claude cannot click the project together for you from chat. | n/a |

No OAuth app changes are required. No new repo secrets are required
unless and until you ask the bot to write field values from CI.
