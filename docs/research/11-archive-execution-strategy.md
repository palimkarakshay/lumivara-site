<!-- OPERATOR-ONLY. Detailed archive execution strategy: mechanism,
     sequence, commands, and impact for each archive bucket from 09 §5. -->

# 11 — Archive Execution Strategy

> _Lane: 🛠 Pipeline — operator-scope tactical archive plan. Companion
> to [`09-pivot-plan-and-archive-list.md`](./09-pivot-plan-and-archive-list.md)
> (which catalogues **what** to archive) and
> [`10-pivot-execution-playbooks.md`](./10-pivot-execution-playbooks.md)
> (which sequences **what** to execute). This file is **how** to
> archive: mechanism, order of operations, exact commands, verification
> gates, rollback path, and impact analysis per bucket._
>
> _Audience: the operator on archive day. Read once before any rm or
> git mv runs. Do not paraphrase outside this repo._

---

## How to read this document

`09 §5` enumerates ~70,000 lines across eight archive buckets. This
file goes one level deeper: for each bucket, the **mechanism**
(git mv vs delete vs disable-then-archive), **order of operations**
(what must be disabled before what is moved), exact **commands**, a
**verification gate**, a **rollback path**, and a **4-row impact
summary** (lines removed / cron load removed / vendor cost saved /
risk introduced).

Structure:

1. **Pre-archive flight check** — six items every bucket assumes are
   complete before the first `git mv` runs.
2. **Common mechanism patterns** — three patterns that recur across
   buckets (move + README, disable-then-move, hard delete).
3. **Bucket-by-bucket plans** — one section per bucket A-DECKS,
   A-PLATFORM-OVER, A-DASHBOARD, A-OPS, A-RESEARCH-PRO, A-WORKFLOWS,
   A-N8N, A-MIGRATIONS, plus the contamination resolution
   (`src/app/lumivara-infotech/`) and the dual-lane infrastructure
   teardown.
4. **Cross-bucket impact summary** — single-glance table.
5. **Verification gate** — the exact 5-command audit that confirms
   the archive landed cleanly.
6. **Rollback paths** — how to recover each bucket if the operator
   changes their mind, by archive day.
7. **Common pitfalls** — six failure patterns operators trip on.
8. **Bibliography** — internal references.

Each bucket plan ends with a **Day-of action** — the first 30-minute
action the operator should take when they pick that bucket as the
first to archive.

---

## §1 — Pre-archive flight check

Six items every archive bucket assumes are complete before the first
`git mv` runs. Identical in spirit to `10 §1` (the pivot pre-flight)
but tactically different — these are about the archive mechanism, not
the pivot offer.

### §1.1 Branch and backup

- **Branch:** all archive work runs on a fresh feature branch
  `archive/2026-05-XX-pivot`. Do not run archive operations on `main`
  or on any active pivot branch.
- **Backup:** create a tag at the current `main` HEAD before any move:
  `git tag pre-archive-2026-05-XX-snapshot`. Push the tag.
- **Verify:** `git log pre-archive-2026-05-XX-snapshot -1 --oneline`
  resolves to the expected commit.

### §1.2 The `_archive/` directory layout

The single archive root is `docs/_archive/2026-05-XX-pivot/` (date is
the operator's archive day). Per-bucket subfolders match the bucket
names from `09 §5`:

```
docs/_archive/2026-05-XX-pivot/
├── 00-INDEX.md           # what's in here, why, one paragraph per bucket
├── decks/                # A-DECKS — full docs/decks/ tree preserved
├── platform-over/        # A-PLATFORM-OVER — scripts/, src/lib/admin/ minus what kept, etc.
├── dashboard/            # A-DASHBOARD — the entire dashboard/ subdir
├── ops/                  # A-OPS — docs/ops/ except what kept
├── research-pro/         # A-RESEARCH-PRO — docs/research/01-07 + raw/
├── workflows/            # A-WORKFLOWS — disabled .github/workflows/*.yml + supporting prompts
├── n8n/                  # A-N8N — docs/n8n-workflows/ JSONs
├── migrations/           # A-MIGRATIONS — phase plans + spinout runbook
├── storefront/           # docs/storefront/ — the autopilot-era go-to-market
└── mothership-most/      # docs/mothership/ except 15, 15c (those move to docs/brand-reference/)
```

The flat structure (one subfolder per bucket) makes `git log
-- docs/_archive/...` produce a clean audit trail and lets `find
docs/_archive -type f` produce a complete inventory in one command.

### §1.3 The per-bucket archive `README.md`

Every bucket subfolder gets a `README.md` of the form:

```markdown
# Archive: <bucket-name>

Archived: 2026-05-XX (commit <sha>).
Reason: see `docs/research/09 §5.<n>` and `docs/research/11 §<n>`.

Original locations (pre-archive):
- `<original-path-1>` (~<lines> lines)
- `<original-path-2>` (~<lines> lines)
- ...

Un-archive trigger (per `09 §8`):
> <the specific condition under which this bucket re-opens>

Decisions taken at archive time:
- <named decision 1, e.g., "renamed dual-lane-watcher.yml to .yml.disabled before move">
- <named decision 2>
```

This template is non-negotiable. A future operator (or the same
operator in 6 months) reading `docs/_archive/.../decks/README.md`
must be able to reconstruct **why** without reading the surrounding
98,000-line repo.

### §1.4 Disable cron-driven workflows BEFORE moving

The single biggest archive mistake the operator can make is to `git mv
.github/workflows/triage.yml docs/_archive/...` while the cron is
still active. GitHub Actions reads the file from the default branch
on the schedule; if the branch hasn't merged the move yet, the cron
keeps firing. **Process:**

1. **First commit:** comment out `schedule:` block in every
   workflow being archived. PR + merge to main. Wait one full
   scheduled cycle (typically 1 hour, but 4 hours for a daily cron).
2. **Verify zero scheduled runs fire** for 4–24 hours depending on
   the slowest cron in the bucket.
3. **Second commit:** `git mv` the disabled workflows to
   `docs/_archive/.../workflows/`. The destination is outside
   `.github/workflows/` so the workflows are no longer registered at
   all.

The two-commit pattern is **inefficient on purpose** — it makes the
"workflow no longer fires" state observable as a discrete checkpoint.

### §1.5 The contamination must be resolved first

`src/app/lumivara-infotech/` (`09 §5.9`) blocks every dual-lane audit
until handled. Resolve as the very first archive-day action — see §11
below.

### §1.6 Operator commitment to the archive being a one-way move

Per `09 §8`, the un-archive criteria are deliberately strict. The
operator should agree, in writing in the branch's first commit
message, to the §8 criteria *before* executing any move. The commit
message template:

> *"I commit to the un-archive criteria in `docs/research/09 §8`. I
> will not re-open any archived bucket without the named trigger
> firing. Archive day: 2026-05-XX."*

Without that commitment, the archive becomes a half-archive: the
files move but the operator's reflex to refactor remains. The half-
archive is worse than no archive — it loses the platform's legibility
without producing the focus benefit.

---

## §2 — Three common mechanism patterns

Every bucket plan in §3 onwards uses one of three mechanisms.

### §2.1 Pattern P1: Move + README

For docs and content that should remain in the repo as historical
record:

```bash
mkdir -p docs/_archive/2026-05-XX-pivot/<bucket>
git mv <source-path> docs/_archive/2026-05-XX-pivot/<bucket>/<source-path>
# Write the per-bucket README per §1.3
git add docs/_archive/2026-05-XX-pivot/<bucket>/README.md
git commit -m "archive(<bucket>): move <source-path> to _archive/"
```

Used for: A-DECKS, A-OPS, A-RESEARCH-PRO, A-N8N, A-MIGRATIONS, the
storefront, most of mothership.

### §2.2 Pattern P2: Disable-then-move

For active code paths that fire on schedule:

```bash
# Step 1 (commit + merge + wait):
# In each <workflow>.yml, comment out the `schedule:` block.
# Verify zero scheduled runs fire for 4–24 hours.

# Step 2 (move):
mkdir -p docs/_archive/2026-05-XX-pivot/workflows
git mv .github/workflows/<workflow>.yml \
       docs/_archive/2026-05-XX-pivot/workflows/<workflow>.yml.disabled
git commit -m "archive(workflows): move <workflow> to _archive/ (disabled in earlier commit)"
```

Used for: A-WORKFLOWS, A-PLATFORM-OVER (cron-driven scripts),
A-DASHBOARD (when its deploy workflow is disabled).

### §2.3 Pattern P3: Hard delete

For files that have no historical value and would only confuse a
future reader:

```bash
git rm <path>
git commit -m "archive(delete): remove <path> — no historical value (per 11 §<n>)"
```

Used sparingly. Specifically for: `dual-lane-watcher.yml` (the
architecture is being abandoned), `forge-spinout-dry-run.sh` (the
spinout is being cancelled or deferred), `dual-lane-audit.sh`
(post-spinout enforcement script with no purpose post-pivot),
`scripts/forge-*.md` and `scripts/forge-*.py` (forge-only artefacts
that don't survive the brand transition).

The two-commit-per-delete pattern is intentional: never delete in the
same commit as a move. **Deletes are reversible only via `git revert`;
moves are reversible via `git mv` back.** Keeping them separate makes
the rollback trivial.

---

## §3 — Bucket A-DECKS — archive plan

**Volume:** 30 files, ~5,600 lines (`docs/decks/` and
`docs/decks/vertical-pitches/`).

**Mechanism:** P1 (move + README).

### §3.1 Order of operations

1. Move all rendered HTML files (`docs/decks/*.html`,
   `docs/decks/vertical-pitches/*.html`) — they are build artefacts.
2. Move the source markdown files (`docs/decks/*.md`,
   `docs/decks/vertical-pitches/*.md`).
3. Move `docs/decks/CRITICAL-REVIEW.md` and
   `docs/decks/CRITICAL-REVIEW-MITIGATIONS.md` **last**, with a
   `README.md` note that these are the meta-critical layer worth
   preserving for future read.
4. Replace the now-empty `docs/decks/00-INDEX.md` with a 1-line
   redirect:
   ```markdown
   # docs/decks — archived
   The deck pack was archived 2026-05-XX as part of the pivot away
   from the autopilot product thesis. See
   `docs/_archive/2026-05-XX-pivot/decks/README.md` and
   `docs/research/08 §10`.
   ```
5. Update `.dual-lane.yml` if any deck path is explicitly listed
   (most are covered by the `docs/decks/` prefix).

### §3.2 Commands

```bash
mkdir -p docs/_archive/2026-05-XX-pivot/decks
git mv docs/decks/vertical-pitches docs/_archive/2026-05-XX-pivot/decks/
git mv docs/decks/01-investor-deck.md docs/decks/01-investor-deck.html \
       docs/decks/02-partner-deck.md docs/decks/02-partner-deck.html \
       docs/decks/03-employee-deck.md docs/decks/03-employee-deck.html \
       docs/decks/04-prospective-client-deck.md docs/decks/04-prospective-client-deck.html \
       docs/decks/05-advisor-deck.md docs/decks/05-advisor-deck.html \
       docs/decks/06-master-deck.md docs/decks/06-master-deck.html \
       docs/decks/06a-master-deck-shareable.md docs/decks/06a-master-deck-shareable.html \
       docs/decks/CRITICAL-REVIEW.md docs/decks/CRITICAL-REVIEW-MITIGATIONS.md \
       docs/_archive/2026-05-XX-pivot/decks/
# Write README per §1.3
echo "<README content>" > docs/_archive/2026-05-XX-pivot/decks/README.md
# Replace 00-INDEX.md with redirect
echo "<redirect content>" > docs/decks/00-INDEX.md
git add -A
git commit -m "archive(decks): move 30 deck artefacts to _archive/; leave redirect at decks/00-INDEX.md"
```

### §3.3 Verification

- `git status` clean after the commit.
- `find docs/decks -type f -name "*.md" | wc -l` returns 1 (the
  redirect-only `00-INDEX.md`).
- `find docs/_archive/2026-05-XX-pivot/decks -type f | wc -l` returns
  ≥ 30.

### §3.4 Rollback path

```bash
git revert HEAD       # full move undone in 1 commit
```

Per `09 §8`, decks are explicitly marked **never un-archive**. Rollback
is for archive-day mistakes only.

### §3.5 Impact

| Axis | Value |
|---|---|
| **Lines removed from active tree** | ~5,600 |
| **Cron load removed** | None (decks were not cron-driven, but `render-decks.yml` becomes orphaned — handle in §8 below) |
| **Vendor cost saved** | None directly (Marp render was a cron line item; covered by §8 workflow archive) |
| **Risk introduced** | Low — decks were not load-bearing; the only consumer of deck files was `render-decks.yml`, which archives in §8 |

### §3.6 Day-of action

Open `docs/decks/CRITICAL-REVIEW.md` and re-read the executive verdict
(it is the closest thing to a "this is why we're pivoting" artefact in
the archive). Then run the §3.2 commands. ~20 minutes total.

---

## §4 — Bucket A-PLATFORM-OVER — archive plan

**Volume:** ~60 files, ~9,000 lines (multi-AI fallback ladder, plan-
then-execute, llm-monitor, recording pipeline, scripts/lib/, scripts/
admin extras, src/lib/admin/* minus the §6.1 keep list).

**Mechanism:** P2 (disable-then-move) for cron-driven scripts; P1 for
non-cron content.

### §4.1 Order of operations

This bucket has **the most surface area** of any archive bucket and
the **most cross-references** to other code. Order matters.

1. **Disable schedules first** (per §1.4). Specifically the workflows
   that *invoke* these scripts: `triage.yml`, `execute*.yml`,
   `plan-issues.yml`, `codex-review*.yml`, `deep-research.yml`,
   `ai-smoke-test.yml`, `llm-monitor.yml`, `llm-monitor-watch.yml`,
   `record-ingest-smoke.yml`, `doc-task-seeder.yml`,
   `backlog-{harvest,digest}.yml`, `bot-usage-monitor.yml`. These
   live in §8 (A-WORKFLOWS) but **disable them in this commit**, then
   move them in §8.
2. **Move scripts/llm-monitor/** (full subdir, ~2,600 lines) — most
   self-contained.
3. **Move scripts/record-ingest/** (full subdir, ~1,100 lines) —
   self-contained.
4. **Move scripts/codex-*.py + scripts/gemini-triage.py + scripts/
   plan-issue.py + scripts/recheck-missed-reviews.py +
   scripts/seed-codex-review-backlog.py +
   scripts/test-{routing,forge-routing}.py + scripts/test-
   doc-task-seeder.py + scripts/doc-task-seeder.py + scripts/backlog-
   digest.py + scripts/bot-usage-report.py** (~3,000 lines).
5. **Move scripts/lib/** (~400 lines) — multi-AI routing library.
6. **Move scripts/{triage,execute,forge-triage,forge-execute}-prompt.md**
   (~1,400 lines).
7. **Move scripts/issues/** (operator issue templates).
8. **Move scripts/bootstrap-*.sh, scripts/create-mothership-seed-issues.sh**
   (~250 lines).
9. **Move src/lib/admin/** (~300 lines) **except `vercel.ts`** (which
   stays per `09 §6.2`). Specifically: keep `src/lib/admin/vercel.ts`,
   archive everything else under `src/lib/admin/`.
10. **Move src/lib/dashboard/** (~150 lines).
11. **Move src/components/admin/** (~400 lines) — the admin-portal
    React components.
12. **Update imports**: search for any remaining import of an archived
    file in `src/`. If found, the keep list is wrong; fix the keep
    list, not the move.

### §4.2 Verification gates after each step

After each numbered step above:
- `npm run lint` — passes.
- `npm run type-check` — passes.
- `npm test` — passes.
- `npm run build` — passes.

If any gate fails, the move was premature; the file is still imported
somewhere in the keep list. Run `git grep -F "<archived-path>" src/`
to find the offender.

### §4.3 Rollback path

Each step above lands as its own commit. Rollback:

```bash
git revert <step-N-sha>   # selectively revert one move
```

Or full rollback (most cases):

```bash
git revert HEAD~12..HEAD   # revert all 12 archive commits
```

### §4.4 Impact

| Axis | Value |
|---|---|
| **Lines removed from active tree** | ~9,000 |
| **Cron load removed** | All cron-driven Python (~600 minutes/month at hourly cadence) |
| **Vendor cost saved** | ~CAD $1,500–$4,000/month (the §17.10 Anthropic-API-on-commercial billing the platform would have required) |
| **Risk introduced** | Medium — `src/lib/admin/` partial removal needs careful keep-list discipline; failed type-check is the most likely failure mode |

### §4.5 Day-of action

Run `git grep -F "from \"@/lib/admin/" src/` to enumerate every
import that touches the partially-archived `src/lib/admin/` subtree.
The list determines whether `09 §6.2`'s keep boundary is accurate.
~15 minutes; output drives the rest of the bucket plan.

---

## §5 — Bucket A-DASHBOARD — archive plan

**Volume:** 1 directory, ~1,482 lines (the entire `dashboard/` Next.js
SPA).

**Mechanism:** Two options. Operator picks one before archive day:
either **P1 (move-with-README) into the archive folder**, or **`git mv`
to a separate operator repo** (`dashboard-archive` or similar).

### §5.1 Option A — move into _archive/

```bash
mkdir -p docs/_archive/2026-05-XX-pivot/dashboard
git mv dashboard/ docs/_archive/2026-05-XX-pivot/dashboard/
echo "<README per §1.3>" > docs/_archive/2026-05-XX-pivot/dashboard/README.md
git commit -m "archive(dashboard): move full SPA to _archive/ (separate Next.js app, not deployed)"
```

### §5.2 Option B — extract to a separate repo

```bash
# 1. Create a fresh repo somewhere: github.com/<operator>/lumivara-dashboard-archive
# 2. From the lumivara-site repo, use git filter-repo to extract just dashboard/ history:
git clone --no-local /home/user/lumivara-site /tmp/dashboard-extract
cd /tmp/dashboard-extract
git filter-repo --subdirectory-filter dashboard
git remote add origin <new-repo-url>
git push -u origin main
# 3. Back in lumivara-site, delete dashboard/:
git rm -rf dashboard/
git commit -m "archive(dashboard): extract to lumivara-dashboard-archive repo; remove from active tree"
```

### §5.3 Decision criterion

- Option A is faster (5 minutes), keeps history in one place.
- Option B is cleaner long-term — the dashboard app has its own
  `package.json`, `tsconfig.json`, and `vercel.json`, which create a
  monorepo-shape that confuses tooling. Recommended **only** if the
  operator believes they may revisit the dashboard within 12 months.

**Default recommendation: Option A.** Per `09 §8`, the dashboard's
un-archive trigger is "second operator joined OR client count > 5,"
both of which are 12+ months out under any pivot in §10.

### §5.4 Verification (both options)

- Root `package.json` does not reference `dashboard/` (it currently
  doesn't, but verify).
- `vercel.json` does not reference `dashboard/` (it currently doesn't).
- `tsconfig.json` does not include `dashboard/` (it currently
  excludes it; verify).
- `npm run build` passes.

### §5.5 Workflow disabling

`.github/workflows/deploy-dashboard.yml` references `dashboard/`. Per
§8 (A-WORKFLOWS), it disables and archives in the workflow bucket.

### §5.6 Impact

| Axis | Value |
|---|---|
| **Lines removed from active tree** | ~1,482 |
| **Cron load removed** | The `deploy-dashboard.yml` workflow load (covered in §8) |
| **Vendor cost saved** | The dashboard's Vercel deploy slot (currently free; saves $0 directly) |
| **Risk introduced** | Low — the SPA is not in active production use |

### §5.7 Day-of action

Confirm `dashboard/` has not been deployed to production
(`vercel.json` has no `dashboard/` route). Then pick Option A or B.

---

## §6 — Bucket A-OPS — archive plan

**Volume:** 12 files, ~2,750 lines (`docs/ops/*`).

**Mechanism:** P1 (move + README), with one critical exception:
**`docs/ops/operator-playbook.md` must be REWRITTEN before being
archived**, not just moved. The pivot has its own daily flow (`10 §1`,
`10 §16`); leaving the team without a playbook is worse than leaving
the autopilot playbook in place.

### §6.1 Order of operations

1. **Write a new `docs/ops/stage-1-playbook.md`** (~100 lines max). Single
   page. Covers: morning sweep (LinkedIn replies + Wave invoice
   status), midday (one outbound action), evening (close any open
   discovery thread). The pivot's daily flow.
2. **Move every other `docs/ops/*.md`** to `docs/_archive/.../ops/`.
   Specifically: `audit-runbook.md`, `automation-future-work.md`,
   `automation-map.md`, `codex-fix-classify-fixtures.md`,
   `doc-task-seeder.md`, `gemini-deep-audit.md`,
   `github-project-layout.md`, `platform-baseline.md`,
   `progress-tracker.md`, `variable-registry.md`, `README.md`.
3. **Move `operator-playbook.md`** to `docs/_archive/.../ops/` **after**
   `stage-1-playbook.md` is in place. Otherwise the team loses both at
   once.

### §6.2 Commands

```bash
# Step 1: write new playbook (manually).
$EDITOR docs/ops/stage-1-playbook.md

# Step 2: move the autopilot-era ops docs.
mkdir -p docs/_archive/2026-05-XX-pivot/ops
git mv docs/ops/audit-runbook.md \
       docs/ops/automation-future-work.md \
       docs/ops/automation-map.md \
       docs/ops/codex-fix-classify-fixtures.md \
       docs/ops/doc-task-seeder.md \
       docs/ops/gemini-deep-audit.md \
       docs/ops/github-project-layout.md \
       docs/ops/platform-baseline.md \
       docs/ops/progress-tracker.md \
       docs/ops/variable-registry.md \
       docs/ops/README.md \
       docs/ops/operator-playbook.md \
       docs/_archive/2026-05-XX-pivot/ops/
# Replace docs/ops/README.md with a 1-line pointer to stage-1-playbook.md
echo "# Operator ops" > docs/ops/README.md
echo "Active playbook: \`stage-1-playbook.md\`. Archive: \`docs/_archive/2026-05-XX-pivot/ops/\`." >> docs/ops/README.md
git add -A
git commit -m "archive(ops): move autopilot-era ops docs; new stage-1 playbook lands"
```

### §6.3 Verification

- `docs/ops/stage-1-playbook.md` exists and is ≤ 150 lines.
- `find docs/ops -type f -name "*.md" | wc -l` returns 2 (the new
  playbook + the README pointer).

### §6.4 Impact

| Axis | Value |
|---|---|
| **Lines removed from active tree** | ~2,750 |
| **Cron load removed** | None (ops docs are not cron-driven) |
| **Vendor cost saved** | None |
| **Risk introduced** | High if step 1 is skipped (the team without a playbook); zero if step 1 lands first |

### §6.5 Day-of action

Open `docs/ops/operator-playbook.md` and **read it in full one last
time**. Its strongest patterns are reusable in the new playbook;
weakest patterns (the autopilot triage cadence, the multi-AI fallback
escalation) are not. Take notes for 20 minutes. Then write the new
playbook in the next 60.

---

## §7 — Bucket A-RESEARCH-PRO — archive plan

**Volume:** 7 files + `raw/` subdirectory, ~2,100 lines
(`docs/research/01-07` plus `docs/research/raw/`).

**Mechanism:** P1 (move + README) for most; **§7-PIPEDA gets relocated,
not archived** — the regulatory reference is still useful regardless of
pivot.

### §7.1 Order of operations

1. **Move `docs/research/01-validated-market-and-technical-viability.md`**
   to `_archive/.../research-pro/`.
2. **Move `02-deck-validation-through-research.md`,
   `03-source-bibliography.md`, `04-client-personas.md`,
   `05-reasons-to-switch-to-lumivara-forge.md`,
   `06-drawbacks-and-honest-risks.md`** to `_archive/.../research-pro/`.
3. **Relocate `07-pipeda-breach-notification.md`** to a new
   `docs/legal-reference/` folder. Per `09 §5.6`, this is regulatory
   reference still relevant under any pivot.
4. **Move `docs/research/raw/`** (the two Gemini deep-research raw
   outputs) to `_archive/.../research-pro/raw/`.
5. **Update `docs/research/00-INDEX.md`** to remove rows 01-07 and add
   a single archive pointer; preserve rows 08, 09, 10, 11.

### §7.2 Commands

```bash
mkdir -p docs/_archive/2026-05-XX-pivot/research-pro
mkdir -p docs/legal-reference

git mv docs/research/01-validated-market-and-technical-viability.md \
       docs/research/02-deck-validation-through-research.md \
       docs/research/03-source-bibliography.md \
       docs/research/04-client-personas.md \
       docs/research/05-reasons-to-switch-to-lumivara-forge.md \
       docs/research/06-drawbacks-and-honest-risks.md \
       docs/research/raw \
       docs/_archive/2026-05-XX-pivot/research-pro/

git mv docs/research/07-pipeda-breach-notification.md \
       docs/legal-reference/pipeda-breach-notification.md

# Update docs/research/00-INDEX.md (manually) to point at the archive
$EDITOR docs/research/00-INDEX.md

git add -A
git commit -m "archive(research-pro): move 01-06 + raw/ to _archive/; relocate 07-pipeda to docs/legal-reference/"
```

### §7.3 Verification

- `find docs/research -type f -name "*.md" | wc -l` returns 5 (00-INDEX
  + 08 + 09 + 10 + 11).
- `docs/legal-reference/pipeda-breach-notification.md` exists.
- `docs/research/00-INDEX.md` references the archive folder.

### §7.4 Impact

| Axis | Value |
|---|---|
| **Lines removed from active tree** | ~2,100 |
| **Cron load removed** | None |
| **Vendor cost saved** | None |
| **Risk introduced** | Low — research docs are non-load-bearing reference |

### §7.5 Day-of action

Read the bibliography in `03-source-bibliography.md` one last time —
some of those URLs are reusable for §10 of the pivot's own research
docs. Note any reusable rows for Pivot E (AODA audits) before moving.

---

## §8 — Bucket A-WORKFLOWS — archive plan

**Volume:** 31 workflow files + supporting prompt files, ~5,900 lines
(`.github/workflows/*.yml` plus `scripts/{triage,execute,forge-*}-prompt.md`).

**Mechanism:** P2 (disable-then-move) for cron-driven; P3 (hard delete)
for the dual-lane enforcement triad; P1 (move + README) for the rest.

### §8.1 Order of operations (most surgical bucket)

This is the most surgical archive bucket because workflows interact:
disabling one without disabling its consumers leaves orphaned PRs.

#### Step 1: comment out `schedule:` blocks

In one commit on the archive branch, comment out the `schedule:` block
in each cron-driven workflow:

- `triage.yml`, `forge-triage.yml`
- `execute.yml`, `execute-{single,multi,complex,fallback}.yml`,
  `forge-execute.yml`
- `plan-issues.yml`
- `codex-review.yml`, `codex-review-{backlog,recheck}.yml`,
  `codex-pr-fix.yml`
- `deep-research.yml`
- `ai-smoke-test.yml`, `forge-smoke-test.yml`, `seeder-smoke-test.yml`,
  `record-ingest-smoke.yml`
- `llm-monitor.yml`, `llm-monitor-watch.yml`
- `backlog-{harvest,digest}.yml`, `bot-usage-monitor.yml`
- `doc-task-seeder.yml`, `project-sync.yml`, `setup-cli.yml`,
  `deploy-drift-watcher.yml`
- `render-decks.yml`
- `deploy-dashboard.yml`
- `dual-lane-watcher.yml` (will be deleted in Step 4)

Commit message: `archive(workflows): disable schedule blocks pre-archive`.
**Merge to main. Wait 24 hours.** Verify zero scheduled runs fired in
that window.

#### Step 2: hard-delete the dual-lane enforcement triad

Per `09 §5.8` and §11 below — the dual-lane architecture is being
abandoned along with the platform. Files:

- `.github/workflows/dual-lane-watcher.yml`
- `scripts/dual-lane-audit.sh`
- `scripts/forge-spinout-dry-run.sh`
- `.dual-lane.yml`

Commit:

```bash
git rm .github/workflows/dual-lane-watcher.yml \
       scripts/dual-lane-audit.sh \
       scripts/forge-spinout-dry-run.sh \
       .dual-lane.yml
git commit -m "archive(workflows): delete dual-lane enforcement triad — architecture abandoned per 09 §3"
```

#### Step 3: hard-delete forge-only workflows

- `.github/workflows/forge-triage.yml`
- `.github/workflows/forge-execute.yml`
- `.github/workflows/forge-smoke-test.yml`
- `scripts/forge-triage-prompt.md`
- `scripts/forge-execute-prompt.md`
- `scripts/test-forge-routing.py`

These are forge-brand-specific artefacts that have no path forward
under any of the eleven §2 pivots. Commit per §2.3.

#### Step 4: P1 move the remaining workflows

```bash
mkdir -p docs/_archive/2026-05-XX-pivot/workflows

# Rename .yml → .yml.disabled in the destination so they cannot be
# accidentally re-registered if the move-back-to-.github happens.
for f in .github/workflows/{triage,execute,execute-{single,multi,complex,fallback},plan-issues,codex-{review,review-backlog,review-recheck,pr-fix},deep-research,ai-smoke-test,seeder-smoke-test,record-ingest-smoke,llm-monitor,llm-monitor-watch,backlog-{harvest,digest},bot-usage-monitor,doc-task-seeder,project-sync,setup-cli,deploy-drift-watcher,render-decks,deploy-dashboard,auto-merge}.yml; do
  if [ -f "$f" ]; then
    base=$(basename "$f" .yml)
    git mv "$f" "docs/_archive/2026-05-XX-pivot/workflows/${base}.yml.disabled"
  fi
done

git mv scripts/triage-prompt.md \
       scripts/execute-prompt.md \
       docs/_archive/2026-05-XX-pivot/workflows/

git mv scripts/codex-{triage,plan-review,review-fallback,fix-classify}.py \
       scripts/gemini-triage.py \
       scripts/plan-issue.py \
       scripts/recheck-missed-reviews.py \
       scripts/seed-codex-review-backlog.py \
       scripts/test-{routing,doc-task-seeder}.py \
       scripts/doc-task-seeder.py \
       scripts/backlog-digest.py \
       scripts/bot-usage-report.py \
       scripts/lib \
       scripts/issues \
       scripts/bootstrap-{forge-project,kanban}.sh \
       scripts/create-mothership-seed-issues.sh \
       scripts/render-decks.sh \
       docs/_archive/2026-05-XX-pivot/workflows/
```

#### Step 5: deep-link audit

Search for any remaining references to archived workflows:

```bash
git grep -F ".github/workflows/triage" -- "*.md"
git grep -F "scripts/triage-prompt" -- "*.md"
# etc.
```

Update or archive any matches found (most will be in already-archived
docs; cross-archive references are fine).

### §8.2 Verification

- `find .github/workflows -type f -name "*.yml" | wc -l` returns the
  count of **kept** workflows. Per `09 §6.2` the only keep candidate
  is `auto-merge.yml` (and only if the operator audits its rules
  first). Realistic: **0–1 workflows remain in `.github/workflows/`
  after archive day.**
- `find scripts -type f | wc -l` returns ~5 (the small set of kept
  scripts; in practice under any pivot in §10, **all of `scripts/`
  archives**).

### §8.3 Impact

| Axis | Value |
|---|---|
| **Lines removed from active tree** | ~5,900 + ~7,000 (scripts/) = ~12,900 |
| **Cron load removed** | All — scheduled runs go to zero |
| **Vendor cost saved** | ~CAD $149/mo (GitHub Actions overage at hourly cadence per §17.12) + ~CAD $1,500–$4,000/mo (Anthropic API per §17.10) = ~CAD $1,650–$4,150/mo |
| **Risk introduced** | Medium — `auto-merge.yml` decision has security implications; `dual-lane-watcher.yml` deletion is irreversible (per `09 §8`, never un-archive) |

### §8.4 Day-of action

Run `gh workflow list --all` to enumerate the 31 currently-active
workflows. Save the output as the verification baseline; after archive
day, the same command should return ≤ 1 workflow.

---

## §9 — Bucket A-N8N — archive plan

**Volume:** 7 JSON files in `docs/n8n-workflows/admin-portal/`, ~643
lines total.

**Mechanism:** P1 (move + README).

### §9.1 Steps

```bash
mkdir -p docs/_archive/2026-05-XX-pivot/n8n
git mv docs/n8n-workflows docs/_archive/2026-05-XX-pivot/n8n/
echo "<README per §1.3>" > docs/_archive/2026-05-XX-pivot/n8n/README.md
git commit -m "archive(n8n): move admin-portal workflow JSONs to _archive/"
```

### §9.2 Vendor decommissioning

The n8n instance running on Railway is **the operator's own platform
investment**, not in this repo. Separate from the archive:

1. **Export final state** of every n8n workflow as JSON and save to
   the archive folder above (the JSONs in this repo may be stale).
2. **Cancel the Railway plan** — Railway charges per usage; pause or
   destroy the instance after the JSONs are exported.
3. **Rotate any HMAC secrets** that the n8n workflows used to sign
   requests to client repos. The secrets stay valid only for the
   active legs of the pivot in §10 (likely none).
4. **Update Vercel env vars** to remove `N8N_*` entries from each
   client project.

### §9.3 Impact

| Axis | Value |
|---|---|
| **Lines removed from active tree** | ~643 |
| **Cron load removed** | All n8n hub triggers (separate from GitHub Actions cron — n8n had its own scheduler) |
| **Vendor cost saved** | ~USD $5–$20/mo Railway hosting |
| **Risk introduced** | Low — n8n was not customer-facing |

### §9.4 Day-of action

Open the Railway dashboard, export each workflow's final-state JSON.
~10 minutes. Then run §9.1 commands.

---

## §10 — Bucket A-MIGRATIONS — archive plan

**Volume:** 5 files, ~2,315 lines (`docs/migrations/*`).

**Mechanism:** P1 (move + README).

### §10.1 Order of operations

1. **Move `00-automation-readiness-plan.md`,
   `01-poc-perfection-plan.md`, `_artifact-allow-deny.md`,
   `README.md`** to `_archive/.../migrations/`.
2. **Special handling — `lumivara-people-advisory-spinout.md`**: this
   spinout runbook is **a useful template for any future client
   handover** under any pivot. Per `09 §5.6`, keep this file as a
   template — but rename it to remove the Client #1 brand reference
   (`lumivara-people-advisory` is forbidden in operator-scope post-
   pivot).
   - Move to `docs/templates/client-handover-runbook.md` and strip
     the brand-specific naming. Keep the structural skeleton.

### §10.2 Commands

```bash
mkdir -p docs/_archive/2026-05-XX-pivot/migrations
mkdir -p docs/templates

git mv docs/migrations/00-automation-readiness-plan.md \
       docs/migrations/01-poc-perfection-plan.md \
       docs/migrations/_artifact-allow-deny.md \
       docs/migrations/README.md \
       docs/_archive/2026-05-XX-pivot/migrations/

# Manual step: open lumivara-people-advisory-spinout.md, strip
# Client-#1-specific names, rewrite as a generic client-handover
# template, save as docs/templates/client-handover-runbook.md.
$EDITOR docs/migrations/lumivara-people-advisory-spinout.md
mv docs/migrations/lumivara-people-advisory-spinout.md \
   docs/templates/client-handover-runbook.md

# Optionally: rmdir docs/migrations/ if empty
rmdir docs/migrations 2>/dev/null || true

git add -A
git commit -m "archive(migrations): move 4 phase plans; relocate spinout runbook as generic template"
```

### §10.3 Impact

| Axis | Value |
|---|---|
| **Lines removed from active tree** | ~1,900 (4 files) |
| **Lines transformed** | ~412 → ~250 (spinout runbook trimmed to template) |
| **Cron load removed** | None |
| **Vendor cost saved** | None |
| **Risk introduced** | Very low — phase plans are not load-bearing |

### §10.4 Day-of action

Open `lumivara-people-advisory-spinout.md` and identify which sections
are **structural** (engagement-shape, repo-split mechanic, handover
checklist) versus **brand-specific** (Client #1 names, Lumivara People
Advisory references). The structural sections are the template;
brand-specific sections delete during the rename.

---

## §11 — Resolve the §5.9 contamination

**Why this is its own section:** the contamination row is independent
of pivot choice and **must resolve on archive day before any other
move**. Per `AGENTS.md` § Dual-Lane, every dual-lane audit fails until
this clears.

### §11.1 The decision

`09 §5.9` lays out three options:

- **Default — delete** the route + content. The operator's Fiverr-
  style pitch belongs on a separate domain.
- **Alternative — relocate** to a separate Vercel project at a new
  domain.
- **Rename + relocate** to `/forge` path with a `infra-allowed` carve-
  out (not recommended).

**Recommendation: delete.** The personal-domain landing page (`10 §1.5`)
replaces the storefront mechanic at much lower complexity.

### §11.2 Commands (default — delete)

```bash
git rm -r src/app/lumivara-infotech
git rm src/content/lumivara-infotech.ts
# Search for any remaining references:
git grep -F "lumivara-infotech" -- "*.ts" "*.tsx" "*.json" "*.md"
# Edit out any matches found.
git add -A
git commit -m "archive(contamination): delete src/app/lumivara-infotech (per 09 §5.9 default)"
```

### §11.3 Verification

- `npm run build` passes.
- `npm run lint` passes.
- `npm run type-check` passes.
- The dual-lane audit (if not yet deleted per §8) passes §1
  contamination check.

### §11.4 Impact

| Axis | Value |
|---|---|
| **Lines removed from active tree** | ~372 |
| **Cron load removed** | None |
| **Vendor cost saved** | None |
| **Risk introduced** | Low — the route was not in the operator's actual sales path |

### §11.5 Day-of action

Run `git grep -F "lumivara-infotech"` to enumerate every reference in
the repo. The list determines whether the deletion is fully scoped.
Likely matches: the route page, the content file, and 1–2 references
in operator docs (those archive separately).

---

## §12 — Cross-bucket impact summary

Single-glance table comparing every archive bucket on the same axes.

| Bucket | Lines removed | Cron load removed | Vendor $/mo saved | Mechanism | Risk |
|---|---:|---|---|---|---|
| A-DECKS | 5,600 | none | $0 (render workflow archives in §8) | P1 | Low |
| A-PLATFORM-OVER | 9,000 | partial — see §8 for cron | $0 directly (saving lands when §8 archives) | P1 + P2 mix | Medium |
| A-DASHBOARD | 1,482 | (deploy-dashboard.yml in §8) | $0 (Vercel free) | P1 or P2 (extract) | Low |
| A-OPS | 2,750 | none | $0 | P1 (after rewrite) | Medium-low |
| A-RESEARCH-PRO | 2,100 | none | $0 | P1 + relocate | Low |
| A-WORKFLOWS | 12,900 (incl. scripts) | **all** | **$1,650–$4,150/mo** | P2 + P3 | Medium |
| A-N8N | 643 | n8n triggers | USD $5–$20/mo Railway | P1 + decommission | Low |
| A-MIGRATIONS | 1,900 (+ template extract) | none | $0 | P1 + transform | Very low |
| **§11 Contamination** | 372 | none | $0 | P3 | Low |
| **§13 Dual-lane teardown** | (in §8) | none | $0 | P3 | Low |
| **Totals** | **~36,700** | — | **~CAD $1,650–$4,170/mo** | — | — |

**Note:** the headline "70,000 lines archived" in `09 §5.1` includes
everything moved-or-touched, not the line count of the actual git mv
operations. ~36,700 is the cleaner number for "lines that leave the
active tree."

---

## §13 — The dual-lane teardown (covered above; restated for clarity)

The dual-lane architecture (`02b-dual-lane-architecture.md` + the
manifest + the watcher + the audit script + the spinout dry-run +
forge-prompt files) is being abandoned. Per §8.1 Step 2:

1. Delete `.github/workflows/dual-lane-watcher.yml` (P3).
2. Delete `scripts/dual-lane-audit.sh` (P3).
3. Delete `scripts/forge-spinout-dry-run.sh` (P3).
4. Delete `.dual-lane.yml` (P3).
5. Move `docs/mothership/02b-dual-lane-architecture.md` and
   `docs/mothership/dual-lane-enforcement-checklist.md` into
   `_archive/.../mothership-most/` (P1, covered by the mothership
   archive in a separate commit not detailed in this doc — left as a
   straightforward extension of §6's pattern).

**Why deletes, not moves:** these files are *enforcement* artefacts.
Their value comes from running, not from being read. A future operator
who reads them in `_archive/` will think they are guidance and act on
them — exactly the opposite of the intent. Hard delete is the right
mechanism.

**Rollback:** `git revert <sha>` restores them. The deletion is on
the archive branch, behind the `pre-archive-2026-05-XX-snapshot` tag.

---

## §14 — Verification gate (the 5-command audit)

After every archive commit lands, run this 5-command check:

```bash
# 1. The active tree shrunk to expected size
find . -type f -not -path './node_modules/*' -not -path './.git/*' -not -path './docs/_archive/*' | wc -l

# 2. No archived path is imported from the keep list
git grep -F -f <(echo -e "_archive/\nscripts/llm-monitor/\nscripts/codex-\nscripts/record-ingest/") -- "src/" "*.json"
# (should return zero results)

# 3. Site builds clean
npm run build

# 4. Tests pass
npm test
npm run test:e2e

# 5. No broken markdown links in the kept docs
git grep -F "(./" -- "docs/00-INDEX.md" "docs/research/" "README.md" | \
  while IFS=: read -r f line; do
    target=$(echo "$line" | grep -oP '\(\./[^)]+\)' | head -1 | tr -d '()')
    if [ -n "$target" ] && [ ! -e "$(dirname "$f")/$target" ]; then
      echo "Broken link in $f → $target"
    fi
  done
```

The third and fourth gates are non-negotiable. Gates 1 and 5 are
informational. Gate 2 catches the most common archive failure
(orphaned import).

---

## §15 — Rollback paths

Every commit on the archive branch is reversible. The fastest
recovery paths:

| Failure | Rollback |
|---|---|
| **Single bucket archive turned out wrong** | `git revert <bucket-archive-sha>` |
| **Workflow disable-then-archive breakage** | `git revert <workflow-disable-sha> <workflow-archive-sha>` (in that order) |
| **Build broke after `git mv`** | `git revert HEAD` and re-investigate the keep list |
| **Operator changed mind about pivot direction** | `git reset --hard pre-archive-2026-05-XX-snapshot` (the pre-archive tag); force-push branch back to that state |
| **Months later, decision reversed under §8 un-archive criteria** | `git checkout <archive-day-sha> -- docs/_archive/<bucket>/...`, then `git mv` back into the active tree |

The pre-archive tag (`§1.1`) is the single most important rollback
asset. It is **the only state** that is genuinely "before any
archive happened," and it should be pushed to origin and never
deleted.

---

## §16 — Common pitfalls

Six failure patterns operators trip on during archive operations.

### §16.1 Moving cron-driven workflows in the same commit as their disable

GitHub Actions reads workflows from the default branch on the
schedule. If the move and the disable land in the same commit, there
is no observable "disabled but still in `.github/workflows/`" state
to verify against. **Always two-commit, with a 24-hour gap.**

### §16.2 Forgetting to update `.dual-lane.yml` (or rather, to delete it)

If `.dual-lane.yml` is left in place after the dual-lane teardown,
the watcher might still pass on its references — *but* every dual-lane
audit run by a future operator who happens to clone the repo before
reading 09–11 will read the manifest as authoritative. **Delete it,
do not just stop using it.**

### §16.3 Half-archiving `src/lib/admin/`

Per `09 §6.2`, `src/lib/admin/vercel.ts` stays; everything else under
`src/lib/admin/` archives. The half-archive only works if the keep-
list discipline is exact. Run `git grep -F "from \"@/lib/admin/"`
**before and after** the move; the diff is the import surface that
might break.

### §16.4 Archiving without a fresh tag

Without `pre-archive-2026-05-XX-snapshot`, the rollback path is "hope
the archive branch's reflog still has the right SHA." Tag first,
push the tag, then start archiving.

### §16.5 The "while-I'm-here" archive mistake

The operator opens `docs/_archive/.../decks/06-master-deck.md` to
"just clean up one paragraph" before archiving. Within 30 minutes the
operator has rewritten three slides. **The archive is a one-way move
on archive day**: no edits to the moved content, ever. Edit the
keep-side copies if needed (they're either rewritten or already
trimmed in the §10 playbooks).

### §16.6 Skipping the type-check + build gates between moves

The §4.2 verification gate (`npm run lint`, `npm run type-check`,
`npm test`, `npm run build`) is **per step**, not per bucket. The
half-archived `src/lib/admin/` produces a type-check failure that
the operator cannot easily diagnose if 12 commits stack up before
running the gate. **Run after every step.**

---

## §17 — Bibliography

Internal references (this document does not draw on external research):

- [`08-self-maintaining-website-negative-study.md`](./08-self-maintaining-website-negative-study.md) — the diagnostic.
- [`09-pivot-plan-and-archive-list.md`](./09-pivot-plan-and-archive-list.md) — the strategic archive list this doc operationalises.
- [`10-pivot-execution-playbooks.md`](./10-pivot-execution-playbooks.md) — the pivot tactical layer; the new `stage-1-playbook.md` in §6 above draws from `10 §1` and `10 §16`.

---

## §18 — Day-of master sequence

For the operator who reads only one section: the entire archive day,
in execution order.

| # | Action | Refs |
|---|---|---|
| 1 | Branch + tag (§1.1) | `pre-archive-2026-05-XX-snapshot` |
| 2 | Resolve contamination (§11) | `git rm -r src/app/lumivara-infotech` |
| 3 | Disable cron blocks (§8.1 Step 1) | comment out `schedule:` in 28 workflows |
| 4 | Wait 24 hours, verify zero cron runs | GitHub Actions tab |
| 5 | Delete dual-lane triad (§8.1 Step 2) | `git rm` 4 files |
| 6 | Delete forge-only artefacts (§8.1 Step 3) | `git rm` 6 files |
| 7 | Archive A-DECKS (§3) | 1 commit |
| 8 | Archive A-RESEARCH-PRO + relocate PIPEDA (§7) | 1 commit |
| 9 | Archive A-MIGRATIONS + extract spinout template (§10) | 1 commit |
| 10 | Archive A-N8N + decommission Railway instance (§9) | 1 commit |
| 11 | Archive A-OPS — **after** writing stage-1 playbook (§6) | 2 commits |
| 12 | Archive A-DASHBOARD (Option A) (§5) | 1 commit |
| 13 | Archive A-PLATFORM-OVER (§4) — 12 ordered steps | 12 commits |
| 14 | Archive A-WORKFLOWS (§8.1 Step 4) | 1 commit |
| 15 | Run §14 verification gate | 5 commands |
| 16 | Push branch + open PR | `gh pr create` |
| 17 | Operator's reflective pause (re-read `09 §11`) | mandatory |
| 18 | Merge PR | fast-forward to main |

**Estimated total time:** 6–10 hours of focused work. The 24-hour
wait at step 4 is **calendar time, not work time** — the operator
can start step 4 at end-of-day Friday and resume at Monday morning.

---

*Last updated: 2026-05-01. Companion to
`09-pivot-plan-and-archive-list.md` and `10-pivot-execution-playbooks.md`.
The strategic decision lives in `09`; the tactical pivot execution
lives in `10`; the tactical archive execution lives here. Read all
three.*
