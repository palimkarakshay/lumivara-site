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

## §3 — Field & view spec

The project has **one shared schema** (§1.3). Every issue gets a row
in this schema even if a few fields are blank for that workstream.

### §3.1 — Custom fields

| # | Field | Type | Options / format | Why it exists |
|---|---|---|---|---|
| 1 | `Workstream` | Single-select | `POC`, `GTM`, `Comms`, `Operator-Manual`, `Technical`, `Functional`, `Research`, `Advisory`, `DummyClient`, `ProspectClient`, `Legal+Vault` | The cross-cutting axis the existing `type/*` labels don't fully capture. One issue can only have one workstream — pick the *primary*. |
| 2 | `Phase` | Single-select | `0-rename`, `1-poc`, `2-runs1`, `3-platform`, `4-spinout`, `5-greenfield`, `6-clientops`, `none` | Maps to the six phases in [`00-automation-readiness-plan.md`](../migrations/00-automation-readiness-plan.md). `none` for evergreen ops work. |
| 3 | `Gate` | Single-select | `§1-migration`, `§6-demo`, `§7-operator`, `none` | The three gates in [`01-poc-perfection-plan.md §0.1`](../migrations/01-poc-perfection-plan.md). Used to find every blocker for a single gate at once. |
| 4 | `Owner-Type` | Single-select | `Operator`, `Bot`, `External` | Who can actually move this forward. `External` = a third party (lawyer, advisor, vendor). |
| 5 | `Demo-Day Critical` | Single-select | `yes`, `no` | The first-demo blocker filter. Kept as single-select (not boolean) so it shows in mobile views as a coloured chip. |
| 6 | `Drop-Dead Date` | Date | YYYY-MM-DD | The L (latest-acceptable) date from `01-poc-perfection-plan.md §7.1` for operator tasks; for everything else, the date past which the issue is moot. Blank = no hard deadline. |
| 7 | `Earliest-Sensible Date` | Date | YYYY-MM-DD | The E (earliest-sensible) date from §7.1. Optional — only useful for operator-manual rows. |
| 8 | `Repo-Destination-Post-Migration` | Single-select | `platform`, `advisory-site`, `advisory-pipeline`, `demo-site`, `stays-here`, `archive`, `obsolete` | The single most important field: bulk-classifying every open issue here turns Phase 4 (issue transfer) from a research task into a script. See §6. |
| 9 | `Effort` | Single-select | `xs`, `s`, `m`, `l`, `xl` | T-shirt sizing for roadmap views. Not a substitute for the existing `complexity/*` labels — `complexity/*` is bot-readable, `Effort` is operator-readable. |
| 10 | `Confidence` | Single-select | `high`, `medium`, `low`, `unknown` | How sure the operator is the issue is well-scoped. Drives the "what to clarify next" view. |
| 11 | `Status` | Single-select (built-in) | `Inbox`, `Triaged`, `In Progress`, `Review`, `Done`, `Blocked` | Already exists from `bootstrap-kanban.sh`. Mirrored from labels by the cron — do **not** edit by hand. |

### §3.2 — Saved views

Twelve views, each one click on the phone. Order matters: the
view-strip on mobile scrolls left-to-right and the operator's most-used
ones go first.

| # | View | Type | Filter | Group-by | Sort | Use |
|---|---|---|---|---|---|---|
| 1 | **Demo-Day Critical** | Board | `Demo-Day Critical: yes` AND `Status ≠ Done` | `Workstream` | `Drop-Dead Date asc` | The single board the operator opens before every working session until the first demo ships. |
| 2 | **POC daily** | Board | `Phase: 1-poc` AND `Status ≠ Done` | `Status` | `priority/* desc` | Mirrors `01-poc-perfection-plan.md §3` day-by-day plan. |
| 3 | **Operator drop-dead** | Roadmap | `Owner-Type: Operator` AND `Drop-Dead Date is not empty` | none | `Drop-Dead Date asc` | The §7 deadline sheet, visualised on a calendar strip. |
| 4 | **By Workstream** | Table | `Status ≠ Done` | `Workstream` | `priority/* desc` | The "what's on every track at once" master table. |
| 5 | **Demo-readiness** | Board | `Gate: §6-demo` AND `Status ≠ Done` | `Status` | `Drop-Dead Date asc` | Mirrors `01-poc-perfection-plan.md §6`. |
| 6 | **Migration gate** | Board | `Gate: §1-migration` AND `Status ≠ Done` | `Status` | `priority/* desc` | The Phase-2-blocker view. |
| 7 | **Phase 0–6 roadmap** | Roadmap | `Phase ≠ none` | `Phase` | `Drop-Dead Date asc` | Strategic-pacing view across all phases. |
| 8 | **External / human-only** | Table | `Owner-Type: External` OR `Owner-Type: Operator` | `Owner-Type` | `Drop-Dead Date asc` | The "things bots cannot do" list. |
| 9 | **Triage inbox** | Board | `Status: Inbox` | `Workstream` | `created asc` | First stop for new issues — operator assigns Workstream + Phase + Gate before bot triage. |
| 10 | **Prospect CRM-lite** | Board | `Workstream: ProspectClient` | `Status` | `Drop-Dead Date asc` | Discovery → Proposal → Signed → Lost (re-using the kanban statuses; rename to those columns visually if it helps). |
| 11 | **Advisory spinout** | Board | `Workstream: Advisory` OR `Repo-Destination-Post-Migration: advisory-site` OR `… advisory-pipeline` | `Phase` | `Drop-Dead Date asc` | Everything the Phase 4 advisory cutover will need to move. |
| 12 | **Repo destinations (Phase 4 prep)** | Table | (no filter) | `Repo-Destination-Post-Migration` | `Workstream asc` | The bulk-classification audit view from §6. Empty rows in this view are the punch list for the §3 D-1 task in `01-poc-perfection-plan.md`. |

### §3.3 — Milestones

Milestones live on the **repo**, not on the project. Use them only as
**outcome checkpoints** (not as workstream containers — that's what
`Workstream` is for):

- `§1 green` — migration gate has flipped (all `01-poc-perfection-plan §1.*` rows ticked).
- `§6 green` — demo-readiness gate has flipped.
- `first demo done` — at least one §9 audience #1 demo completed.
- `first contract signed` — first paid client.
- `Client #2 onboarded` — second paid client; proves the cookie-cutter.

Per-client repos (Phase 4+) get their own milestones inside their own
project space.
