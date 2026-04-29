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
> `claude/github-project-setup`. The ten custom fields in §3.1 were
> created on the existing `Lumivara Backlog` project (user-level, ID
> `PVT_kwHOARsRls4BVg_H`) on the same day via
> `scripts/bootstrap-forge-project.sh`. No issue migration was
> required — the 46 currently-open issues stay on the same project,
> they just need bulk-classification.

## §0 — Reading order

1. §1 — the recommendation and why one project (not many).
2. §2 — does the operator (or the bot) need new GitHub access?
3. §3 — the field & view spec (what was created and what's still manual).
4. §4 — web-UI runbook (Android browser, ~15 minutes) — used for the
   12 saved views (the GraphQL API does not yet support view creation).
5. §5 — scripted runbook (Termux on phone, or Git Bash on Windows).
6. §6 — migration safety: how the existing 46 issues survive the
   field rollout with no data loss and no manual re-add.
7. §7 — Phase 4 transfer playbook: how the project survives the
   org birth and per-client repo births in
   [`00-automation-readiness-plan.md`](../migrations/00-automation-readiness-plan.md).

If you only have 5 minutes: read §1, §3.1 (the 10 fields), and §4.3
(the views to add in the web UI).

## §1 — Recommendation

**One** user-level GitHub Project named `Lumivara Backlog` (the
existing one, created via `scripts/bootstrap-kanban.sh` step 2).
Optional cosmetic rename to `Lumivara Forge — operator hub`. Free
tier covers it: private user-level projects allow unlimited custom
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
| Operator (gh CLI from Termux/laptop) | One-time `gh auth refresh -s project,read:project`. The operator's existing token already had `project` scope as of 2026-04-29. | Only if running the §5 scripted bootstrap. |
| Bot (Claude Code Action runs) | Optional fine-grained PAT secret with `Projects: Read & write` and `Contents: Read`. Stored as `PROJECT_PAT` in repo secrets. | Only when the bot is asked to set custom-field values during triage. The current `triage.yml` does not need this. |
| Bot (interactive Claude session) | The MCP GitHub toolset has **no Project v2 create/edit tools**, but the bot can still run `gh api graphql` calls through the PowerShell/Bash tools when it's running in a session that has the operator's local `gh` auth (laptop). It can NOT do this from a CI run without the `PROJECT_PAT` secret above. | n/a |

No OAuth app changes are required.

## §3 — Field & view spec

The project has **one shared schema** (§1.3). Every issue gets a row
in this schema even if a few fields are blank for that workstream.

### §3.1 — Custom fields (already created)

All ten fields below were created on `Lumivara Backlog` on 2026-04-29
by `scripts/bootstrap-forge-project.sh`. They are non-destructive
to existing items — every row of the 46 currently-open issues kept
its existing values; the new fields land empty until classified.

| # | Field | Type | Options | Why it exists |
|---|---|---|---|---|
| 1 | `Workstream` | Single-select | `POC`, `GTM`, `Comms`, `Operator-Manual`, `Technical`, `Functional`, `Research`, `Advisory`, `DummyClient`, `ProspectClient`, `Legal+Vault` | The cross-cutting axis the existing `type/*` labels don't fully capture. One issue can only have one workstream — pick the *primary*. |
| 2 | `Phase` | Single-select | `0-rename`, `1-poc`, `2-runs1`, `3-platform`, `4-spinout`, `5-greenfield`, `6-clientops`, `none` | Maps to the six phases in [`00-automation-readiness-plan.md`](../migrations/00-automation-readiness-plan.md). `none` for evergreen ops work. |
| 3 | `Gate` | Single-select | `section1-migration`, `section6-demo`, `section7-operator`, `none` | The three gates in [`01-poc-perfection-plan.md §0.1`](../migrations/01-poc-perfection-plan.md). The `section` prefix avoids `§` Unicode-through-shell escaping issues. |
| 4 | `Owner-Type` | Single-select | `Operator`, `Bot`, `External` | Who can actually move this forward. `External` = a third party (lawyer, advisor, vendor). |
| 5 | `Demo-Day Critical` | Single-select | `yes`, `no` | The first-demo blocker filter. Kept as single-select (not boolean) so it shows in mobile views as a coloured chip. |
| 6 | `Drop-Dead Date` | Date | YYYY-MM-DD | The L (latest-acceptable) date from `01-poc-perfection-plan.md §7.1` for operator tasks; for everything else, the date past which the issue is moot. Blank = no hard deadline. |
| 7 | `Earliest-Sensible Date` | Date | YYYY-MM-DD | The E (earliest-sensible) date from §7.1. Optional — only useful for operator-manual rows. |
| 8 | `Repo-Destination-Post-Migration` | Single-select | `platform`, `advisory-site`, `advisory-pipeline`, `demo-site`, `stays-here`, `archive`, `obsolete` | The single most important field: bulk-classifying every open issue here turns Phase 4 (issue transfer) from a research task into a script. See §6. |
| 9 | `Effort` | Single-select | `xs`, `s`, `m`, `l`, `xl` | T-shirt sizing for roadmap views. Not a substitute for the existing `complexity/*` labels — `complexity/*` is bot-readable, `Effort` is operator-readable. |
| 10 | `Confidence` | Single-select | `high`, `medium`, `low`, `unknown` | How sure the operator is the issue is well-scoped. Drives the "what to clarify next" view. |

`Status` is the **built-in** field — already exists, do not re-create.
The five values `Inbox`, `Triaged`, `In Progress`, `Review`, `Done`
come from `bootstrap-kanban.sh` and are read by the `triage`/`execute`
cron paths.

### §3.2 — Saved views (live)

All twelve views below were created on `Lumivara Backlog` on
2026-04-29 in the web UI. GitHub's GraphQL API does not currently
expose `ProjectV2View` creation — that is why they are not part of
`scripts/bootstrap-forge-project.sh`.

The view-strip on mobile scrolls left-to-right; tab order in the UI
matches the operator's chosen order, not the row order in this table.
The view URLs below resolve to a specific view by its ProjectV2View
node, not by name — bots and future-self should look up views by
**name**, not by view-number, since reordering tabs in the UI does
not change the underlying view IDs.

Layout-specific fields:

- **Board** layout splits the legacy "group-by" axis into **Column
  by** (the kanban columns) and **Swimlanes** (horizontal slices,
  optional).
- **Roadmap** layout takes a **Group by** axis plus a **Dates**
  field that becomes the bar on the timeline (single field for a
  point, a pair like `Earliest-Sensible Date` + `Drop-Dead Date`
  for a duration bar).
- **Table** layout takes **Group by** and a **Fields** picker.

| # | View name | URL | Layout | Filter | Column / Group by | Swimlanes | Dates | Sort | Use |
|---|---|---|---|---|---|---|---|---|---|
| 1 | `Demo-Day Critical` | [/views/6](https://github.com/users/palimkarakshay/projects/1/views/6) | Board | `"Demo-Day Critical":yes -status:Done` | Status | Workstream | — | `Drop-Dead Date` asc | The single board the operator opens before every working session until the first demo ships. |
| 2 | `POC daily` | [/views/7](https://github.com/users/palimkarakshay/projects/1/views/7) | Board | `Phase:1-poc -status:Done` | Status | (none) | — | manual | Mirrors the day-by-day plan in `01-poc-perfection-plan.md §3`. |
| 3 | `Operator drop-dead` | [/views/10](https://github.com/users/palimkarakshay/projects/1/views/10) | Roadmap | `"Owner-Type":Operator` | Workstream | — | `Drop-Dead Date` (single) | `Drop-Dead Date` asc | The §7.1 deadline sheet, visualised on a calendar strip. |
| 4 | `By Workstream` | [/views/14](https://github.com/users/palimkarakshay/projects/1/views/14) | Table | `-status:Done` | Workstream | — | — | manual | The "what's on every track at once" master table. |
| 5 | `Demo-readiness` | [/views/8](https://github.com/users/palimkarakshay/projects/1/views/8) | Board | `Gate:section6-demo -status:Done` | Status | (none) | — | `Drop-Dead Date` asc | Mirrors the §6 demo-readiness gate in `01-poc-perfection-plan.md`. |
| 6 | `Migration gate` | [/views/9](https://github.com/users/palimkarakshay/projects/1/views/9) | Board | `Gate:section1-migration -status:Done` | Status | (none) | — | manual | The Phase-2-blocker view. |
| 7 | `Phase 0-6 roadmap` | [/views/11](https://github.com/users/palimkarakshay/projects/1/views/11) | Roadmap | `-Phase:none` | Phase | — | `Earliest-Sensible Date` and `Drop-Dead Date` (span) | `Drop-Dead Date` asc | Strategic-pacing view across all six migration phases. |
| 8 | `External / human-only` | [/views/13](https://github.com/users/palimkarakshay/projects/1/views/13) | Table | `"Owner-Type":External,Operator` | Owner-Type | — | — | `Drop-Dead Date` asc | The "things bots cannot do" list. |
| 9 | `Triage inbox` | [/views/16](https://github.com/users/palimkarakshay/projects/1/views/16) | Board | `status:Inbox` | Workstream | (none) | — | manual | First stop for new issues — operator assigns Workstream + Phase + Gate before bot triage. |
| 10 | `Prospect CRM-lite` | [/views/18](https://github.com/users/palimkarakshay/projects/1/views/18) | Board | `Workstream:ProspectClient` | Status | (none) | — | `Drop-Dead Date` asc | Discovery → Proposal → Signed → Lost (re-using the kanban statuses). |
| 11 | `Advisory spinout` | [/views/19](https://github.com/users/palimkarakshay/projects/1/views/19) | Board | `Workstream:Advisory` | Phase | (none) | — | `Drop-Dead Date` asc | Everything the Phase 4 advisory cutover will need to move. |
| 12 | `Repo destinations` | [/views/20](https://github.com/users/palimkarakshay/projects/1/views/20) | Table | (no filter) | Repo-Destination-Post-Migration | — | — | `Workstream` asc | The bulk-classification audit view from §6.2. Empty rows are the punch list for the corresponding §3 row in `01-poc-perfection-plan.md`. |

#### §3.2.1 — Why no `priority/* desc` sort

An earlier draft of this table specified `priority/* desc` as the
default sort for the demo / migration / by-workstream views.
ProjectV2 cannot sort by **labels** — only by fields. Three options
considered, and the one taken:

- **Drop-Dead Date asc** for the demo and migration boards. Closest
  proxy to operator intent: items with the nearest deadline rise to
  the top.
- **manual** for boards that don't have meaningful deadlines yet
  (POC daily, Migration gate without dates, Triage inbox, By
  Workstream). Drag-to-reorder lets the operator pin top-of-mind
  items without growing the field schema.
- **Adding a `Priority` single-select field** (`P1`/`P2`/`P3`) was
  rejected — the existing `priority/*` labels already drive triage
  and execute filters, and duplicating into a project field would
  drift unless wired into automation. Defer until the operator
  actually wants the project to filter by priority numerically.

### §3.3 — Milestones

Milestones live on the **repo**, not on the project. Use them only as
**outcome checkpoints** (not as workstream containers — that's what
`Workstream` is for):

- `section1 green` — migration gate has flipped (all `01-poc-perfection-plan §1.*` rows ticked).
- `section6 green` — demo-readiness gate has flipped.
- `first demo done` — at least one §9 audience #1 demo completed.
- `first contract signed` — first paid client.
- `Client #2 onboarded` — second paid client; proves the cookie-cutter.

Per-client repos (Phase 4+) get their own milestones inside their own
project space.

## §4 — Web-UI runbook

Used for the twelve saved views in §3.2. The ten custom fields are
already created — re-running §5 is idempotent and safe.

### §4.1 — Open the existing project

1. Visit https://github.com/palimkarakshay?tab=projects.
2. Tap **`Lumivara Backlog`**.
3. (Optional) Top-right `…` → **Settings → Rename** →
   `Lumivara Forge — operator hub`. The rename is cosmetic; URLs and
   item membership are preserved.

### §4.2 — Verify the ten custom fields

Project → top-right `…` → **Settings → Custom fields**. Every row
in §3.1 must be present. If any are missing, re-run §5 (idempotent —
safe to re-run any time).

### §4.3 — Add the twelve saved views

In the project, top-left **+ New view** for each row in §3.2. For
each view:

1. Pick the **Type** column from §3.2 (Board / Table / Roadmap).
2. Tap **Filter** → paste the filter expression.
3. Tap **Group by** → pick the field.
4. Tap **Sort** → pick the field + direction.
5. Top-left view tab → long-press → **Rename** to the view name in §3.2.
6. Drag the tab into position — order matters for the mobile strip.

Tip: views #1 (`Demo-Day Critical`) and #2 (`POC daily`) are the two
the operator opens daily; put them first so they're the default tab
when the project loads.

### §4.4 — Verify the existing 46 issues are on the project

Already-open issues are added to `Lumivara Backlog` automatically by
the **Auto-add** workflow enabled in `bootstrap-kanban.sh` step 2. To
confirm:

1. Project → **By Workstream** view (view #4 from §3.2).
2. Scroll the table — every open issue from
   https://github.com/palimkarakshay/lumivara-site/issues should be a
   row. Workstream / Phase / Gate / Repo-Destination cells will be
   blank — that's expected; they get filled in §4.5.

If any issues are missing, top-right `…` → **Workflows → Auto-add to
project** → confirm `palimkarakshay/lumivara-site` is in the repo
filter and `Status: Open` is the trigger. Re-saving forces a backfill.

### §4.5 — Bulk-classify in the web UI

This is the slow step on mobile:

1. Open the **By Workstream** view.
2. For each row, tap the row → fill `Workstream`, `Phase`, `Gate`,
   `Owner-Type`, `Demo-Day Critical`, `Repo-Destination-Post-Migration`.
   Skip `Drop-Dead Date` unless the row is on the §7.1 deadline sheet.
3. With 46 open issues, allow ~20 minutes. The keyboard remembers
   recent picks per field, so it's not 46 × 6 = 276 typed values —
   it's 46 × 6 taps after the first round.

### §4.6 — Smoke test

Open the **Demo-Day Critical** view. It should show only issues
the operator marked yes in §4.5. If it shows zero rows but you
marked some, the filter is wrong — tap **Filter** and confirm it's
`Demo-Day Critical: yes`.

## §5 — Scripted bootstrap

Only relevant if §3.1 fields need to be re-created (e.g. on a fresh
project or after a misconfigured run). Idempotent — safe to re-run.

### §5.1 — On Windows (VSCode + PowerShell)

Pre-reqs already on the operator's laptop: GitHub CLI, Git for
Windows (which provides Git Bash), token has `project` scope.

```powershell
$env:PROJECT_TITLE = "Lumivara Backlog"
& "C:\Program Files\Git\bin\bash.exe" scripts/bootstrap-forge-project.sh
```

The Windows `bash` on PATH is **WSL bash**, not Git Bash. WSL would
try to run `gh` in a separate Linux subsystem where it's not
authenticated. Always invoke Git Bash explicitly via its full path.

### §5.2 — On Android (Termux)

```
pkg update -y && pkg install -y git gh
gh auth login
gh auth refresh -s project,read:project
gh repo clone palimkarakshay/lumivara-site
cd lumivara-site
git checkout claude/github-project-setup
PROJECT_TITLE="Lumivara Backlog" bash scripts/bootstrap-forge-project.sh
```

Termux is from F-Droid only — the Play Store build cannot install
packages.

### §5.3 — Bulk classification (deferred)

Once §3.1 stabilises and the operator has settled on default values
per existing label combo (e.g. `type/business-lumivara` →
`Workstream: Advisory` 80% of the time, `area/forge` →
`Workstream: Technical` AND `Phase: 3-platform` 90% of the time),
a `bulk-classify-forge-items.sh` script can apply those defaults
across all 46 open issues in one pass. **That script is intentionally
not yet committed**: bulk-misclassification is hard to undo, and the
mapping rules deserve a quiet day of operator review before they ship.

For now, bulk classification is the §4.5 tap-through. The
single-highest-leverage column to fill on this pass is
`Repo-Destination-Post-Migration` — see §6.

## §6 — Migration safety

This section answers two distinct "is it safe?" questions:

1. Is rolling out the new fields safe for the **existing 46 open
   issues** that are already on the `Lumivara Backlog` project? (§6.1)
2. Is the project itself safe across the Phase 0–6 migration that
   births the org and the per-client repos? (§7)

### §6.1 — Field rollout is non-destructive

Adding a custom field to an existing Project v2 is purely additive,
and this was confirmed live on 2026-04-29:

- Existing items kept their existing field values (Status, Title,
  Assignees, Labels mirror).
- New fields landed on every item with the value **empty** — no row
  was dropped, no row was duplicated.
- The auto-add workflow (`bootstrap-kanban.sh` step 2) keeps adding
  new issues as before.
- Removing a field later deletes its values across all items but
  does not touch the items themselves.

Therefore: classify at your pace. If you misclassify, edit; there is
no rollback to do.

### §6.2 — The single most important bulk-classification pass

Of the ten fields, the one that **earns its keep most** is
`Repo-Destination-Post-Migration`. Filling it on every open issue
once turns the Phase 4 issue-transfer step from "audit every open
issue and decide where it goes" into "filter the project by
destination and run `gh issue transfer` per group."

The §3 D-1 row of `01-poc-perfection-plan.md` ("walk every open
issue") is the natural moment to do this in one sitting.

### §6.3 — Label cloning, when new repos appear

When Phase 4 spawns the per-client repos, each new repo needs the
existing label set (priority/* / complexity/* / area/* / status/* /
gating). `scripts/bootstrap-kanban.sh` already handles label creation
for *this* repo; the per-client equivalent is a one-line wrapper
that runs the same `create_label` block against the new repo slug.
Track that as a separate issue when Phase 4 begins — out of scope
for this doc.

## §7 — Phase 4 transfer playbook

The project is **user-level** (§1.2). When Phase 0 of
[`00-automation-readiness-plan.md`](../migrations/00-automation-readiness-plan.md)
births the `lumivara-forge` org and Phase 4 transfers issues into
per-client repos, the project survives because:

- User-level projects are not tied to repo ownership; adding a repo
  to the project's "linked repositories" list is a one-click action.
- `gh issue transfer` **within the same owner** preserves project
  membership and custom-field values losslessly.
- `gh issue transfer` **across owners** (user → org, or user → org →
  per-client repo) drops the project membership on the transferred
  issue. This is the failure mode to design around.

### §7.1 — Recommended Phase 4 sequence

1. **Before transfer:** add every new repo (in the new org) to the
   user-level project's linked-repos list. The auto-add workflow
   keeps catching new issues opened in any of those repos.
2. **Before transfer:** filter the project by
   `Repo-Destination-Post-Migration` to confirm every issue has a
   destination. Empty cells = not yet decided = blockers.
3. **Transfer in groups, not all-at-once.** For each value of
   `Repo-Destination-Post-Migration`:
   - Export the list of issue numbers from the project view.
   - For each issue, run `gh issue transfer <num> <new-owner>/<new-repo>`.
   - Custom-field values **will be lost** at the cross-owner
     boundary. Mitigation: before each batch, also export the
     custom-field values to a local CSV; after the transfer, re-apply
     them via a one-off GraphQL script. This is annoying but bounded.
4. **After transfer, per repo:** confirm the auto-add workflow has
   re-added the now-transferred issue to the user-level project (it
   will, because the new repo was added in step 1).
5. **Eventually:** transfer the project itself from the user owner
   to the new org. GitHub supports this without losing items; the
   project's URL changes, the items don't move.

### §7.2 — Why not transfer the project to the org first

Two reasons:

- The org doesn't exist until Phase 0 finishes. The project needs to
  exist *before* Phase 0 to triage Phase 0 itself.
- A user-level project that survives multiple repo births is easier
  than an org-level project that needs the org to exist before it
  can be born.

### §7.3 — The single failure mode worth scripting

Cross-owner `gh issue transfer` losing custom-field values is the
one place where a small script pays for itself: ~5 minutes of
GraphQL to (a) read fields per issue, (b) write fields per
post-transfer issue. **Defer until Phase 4 is the next thing on the
calendar** — premature scripting against an unstable schema creates
more rework than it saves.
