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

*Buckets A-RESEARCH-PRO, A-WORKFLOWS, A-N8N, A-MIGRATIONS, the
contamination resolution, the dual-lane teardown, the cross-bucket
impact summary, the verification gate, and the rollback paths fill in
over the next commits.*
