<!-- OPERATOR-ONLY. Run this with Claude. -->

# 05 — Mothership Repo Buildout Plan (P5)

A phased, Claude-runnable plan to stand up the new private mothership repo `palimkarakshay/{{BRAND_SLUG}}-mothership` from scratch. Each phase is sized to fit comfortably within a single CI run respecting the 50%/80% budget gates of `AGENTS.md`.

> **Pre-requisite (operator manual):** create the empty private repo on GitHub first. The agent does the rest.
>
> ```bash
> gh repo create palimkarakshay/{{BRAND_SLUG}}-mothership --private \
>     --description "Mothership: operator-side runbooks, workflows, scripts, n8n, dashboard, CLI."
> ```

Status legend below: 🟢 ready to run · 🟡 in-progress · ✅ done · ⏸ blocked on operator manual step.

---

## P5.1 — Migrate operator-side docs from `lumivara-site` to mothership 🟢

**Estimated turns:** 60–80.

**Inputs:**
- `palimkarakshay/lumivara-site` checked out at the operator's machine (this repo).
- New empty `palimkarakshay/{{BRAND_SLUG}}-mothership` repo.

**Steps for the agent:**
1. `git clone` the empty mothership repo locally.
2. Copy these paths from `lumivara-site` into the new repo (verbatim):
   - `docs/mothership/`
   - `docs/storefront/`
   - `docs/AI_ROUTING.md`
   - `docs/ADMIN_PORTAL_PLAN.md`
   - `docs/N8N_SETUP.md`
   - `docs/MONITORING.md`
   - `docs/BACKLOG.md`
   - `docs/GEMINI_TASKS.md`
   - `docs/wiki/`
   - `AGENTS.md`
   - `CLAUDE.md`
3. Adjust internal links to drop the `lumivara-site/` prefix where present.
4. Add a top-level `README.md` for the mothership (operator-only; describes "what this repo is, who shouldn't have access, how to use the CLI").
5. Add `.gitignore`, `.claudeignore`, `.editorconfig`.
6. Commit on `main`. Push.

**DOD (definition of done):**
- New repo's `main` has the docs above, plus a one-page README.
- `git log` shows a single squash-or-rebase commit per logical doc group (mothership/, freelance/, etc.).
- Internal links resolve when previewed on github.com.

**Exit budget gate:** if 50% used after step 4, commit-push-stop. Resume at step 5.

---

## P5.2 — Lift workflow templates and scripts 🟢

**Estimated turns:** 40–60.

**Steps:**
1. Create `workflows-template/` in the mothership.
2. Copy each of these files from `lumivara-site/.github/workflows/` into `workflows-template/`:
   - `triage.yml`, `plan-issues.yml`, `execute.yml`, `execute-complex.yml`, `execute-single.yml`, `execute-fallback.yml`, `codex-review.yml`, `deep-research.yml`, `auto-merge.yml`, `project-sync.yml`, `setup-cli.yml`, `ai-smoke-test.yml`.
3. Replace any literal references to `palimkarakshay/lumivara-site` with the Mustache placeholder `{{CLIENT_OWNER}}/{{CLIENT_SLUG}}-site`.
4. Replace any hard-coded label values like `client/lumivara` with `client/{{CLIENT_SLUG}}`.
5. Replace any hard-coded branch names with `{{DEFAULT_BRANCH}}` (default `main`).
6. Verify each `${{ secrets.* }}` reference matches the org-secret names in `03-secure-architecture.md §3`.
7. Create `scripts/` and copy:
   - `triage-prompt.md`, `execute-prompt.md`, `gemini-triage.py`, `codex-triage.py`, `plan-issue.py`, `test-routing.py`, `bootstrap-kanban.sh`.
   - `lib/routing.py`.
8. Commit each logical group as its own commit (`workflows-template`, `scripts`, `scripts/lib`).

**DOD:**
- Every file in `workflows-template/` has at least one `{{...}}` placeholder per per-client value.
- Every file in `scripts/` runs as a unit test against a synthetic issue body without errors.
- A single grep `git -C mothership grep -n "palimkarakshay/lumivara-site"` returns zero matches in `workflows-template/` and `scripts/`.

---

## P5.3 — Migrate dashboard 🟢

**Estimated turns:** 30–50.

**Steps:**
1. Copy `lumivara-site/dashboard/` verbatim to `mothership/dashboard/`.
2. Update `dashboard/src/lib/config.ts` to read the active client repo from a localStorage selector (so one dashboard manages many clients).
3. Add a "Client switcher" component above the existing `WorkflowList`.
4. Update the deploy workflow target to `palimkarakshay/{{BRAND_SLUG}}-mothership` Pages.
5. Commit + push.

**DOD:**
- `npm run build` succeeds.
- Dashboard shows a client switcher; selecting a client switches the API target.
- The Pages deployment URL is `https://palimkarakshay.github.io/{{BRAND_SLUG}}-mothership/`.

---

## P5.4 — Build the per-client provisioning CLI 🟡 (largest phase; split into sub-runs)

**Estimated turns:** 200–400 across 4–6 runs.

This is the biggest phase. Split it the same way the admin portal was split (5 phases, one issue each):

| Sub-phase | Deliverable |
|---|---|
| P5.4a | `cli/` package skeleton (`package.json`, `tsconfig`, `commander.js` setup, single `forge --help` command) |
| P5.4b | `forge provision` — steps 1–7 of the flow in `02-architecture.md §3` (validate, create site repo, create pipeline repo, scope org secrets, push `client-template/` to site `main`, push `workflows-template/` + `scripts/` to pipeline `main`, install the GitHub App on the site repo) — Pattern C; see `02b §2` |
| P5.4c | `forge provision` — steps 8–10 (Vercel API linked to site repo, n8n REST API, Twilio number purchase) |
| P5.4d | `forge provision` — steps 11–13 (kanban bootstrap on site repo via App token, cross-repo smoke test, handover render) and `--resume` |
| P5.4e | `forge teardown` — all four modes (handover, archive, pause, rebuild-vanilla) |
| P5.4f | `forge set-tier`, `forge audit-secrets`, `forge costs`, `forge rotate-hmac` |

Each sub-phase opens an issue in the mothership repo and goes through the standard triage→plan→execute flow. The first run of each sub-phase produces a draft PR; subsequent runs iterate to green.

**DOD:**
- `npx forge --help` lists every subcommand.
- `npx forge provision --client-slug demo-co --tier 2 --domain demo.test --dry-run` prints the full plan without doing anything.
- `npx forge provision --client-slug demo-co --tier 2 --domain demo.test` against a real GitHub repo + Vercel + n8n produces a working client repo with a green Vercel preview within 30 minutes.
- All commands are idempotent (re-running yields no changes if state is already correct).

---

## P5.5 — Mirror existing client (Lumivara People Advisory) into mothership 🟢

**Estimated turns:** 40–60.

> **Canonical runbook:** [`docs/migrations/lumivara-people-advisory-spinout.md §1`](../migrations/lumivara-people-advisory-spinout.md) operationalises this phase. The DOD list below remains the success criteria; the runbook owns the per-step procedure, dry-run/rollback, and acceptance greps.

The existing `lumivara-site` repo is *de facto* Client #1's repo today. Make it official:

1. In the mothership, create `docs/clients/lumivara-people-advisory/`.
2. Add `intake.md` (filled retroactively from current site content).
3. Add `cadence.json` ({"tier": 2, "triage_cron": "*/30 * * * *", ...}).
4. Add `secrets.md.age` (encrypted; lists which org secrets, n8n creds, Vercel envs are scoped to this client).
5. Add `runbook.md` (anything specific to Beas's preferences, contact details, monthly call cadence).
6. Add an `engagement-log.md` — start it from CHANGELOG.md of `lumivara-site`. Schema lives at `14 §6` / `docs/operator/ENGAGEMENT_LOG_SCHEMA.md`.
7. Add an `evidence-log.md` from the template in `19-engagement-evidence-log-template.md`. Backfill the `PRE-*`, `A-*`, `B1-*`, `B2-*`, `C-*`, `H-*` rows from `lumivara-site`'s known-good provisioning state at the time of mirror — even retro entries are useful as the audit trail and the reference shape for the next client. Add the `evidence/` subdirectory containing the artefact files referenced from the log.

**DOD:**
- `docs/clients/lumivara-people-advisory/` has the seven files plus the `evidence/` directory.
- `cadence.json` validates against `schema/cadence.schema.json`.
- `secrets.md.age` decrypts cleanly with the operator's PGP key.
- `evidence-log.md` has at minimum the engagement-metadata header (per `19 §1`) and one entry per `PRE-*` Step ID from `18 §1`.

---

## P5.6 — Migrate `lumivara-site` to Pattern C two-repo shape 🟢 (partly manual)

**Estimated turns:** 80–100 + manual GitHub UI clicks.

Under Pattern C the existing repo splits into two: a clean site repo for the client, and a separate operator-only pipeline repo that holds every workflow and script. The agent does the bulk; the operator does the GitHub UI clicks (rename, App install, branch protection).

1. **Operator (manual):** rename `palimkarakshay/lumivara-site` to `palimkarakshay/lumivara-people-advisory-site` in the GitHub UI. (This becomes the **site** repo.)
2. **Operator (manual):** push the new mothership repo's main first; verify it works.
3. **Operator (manual):** create the matching **pipeline** repo:
   ```bash
   gh repo create palimkarakshay/lumivara-people-advisory-pipeline --private \
     --description "Operator-only pipeline for lumivara-people-advisory-site. Pattern C."
   ```
4. **Agent:** populate the pipeline repo from the (still-pre-migration) site repo:
   ```bash
   git clone https://github.com/palimkarakshay/lumivara-people-advisory-pipeline.git
   cd lumivara-people-advisory-pipeline
   # copy workflows + scripts from the site repo's working tree:
   cp -R ../lumivara-people-advisory-site/.github/workflows .github/
   cp -R ../lumivara-people-advisory-site/scripts ./
   git add .github scripts
   git commit -m "feat: pipeline-repo bootstrap for lumivara-people-advisory"
   git push origin main
   ```
   Set the pipeline repo's `vars`: `SITE_REPO_OWNER=palimkarakshay`, `SITE_REPO_NAME=lumivara-people-advisory-site`, plus the cadence vars from `04 §2`.
5. **Operator (manual):** install the GitHub App on the site repo only:
   ```bash
   # via the App's installation URL, scoped to lumivara-people-advisory-site.
   ```
   Capture the installation ID into `docs/clients/lumivara-people-advisory/cadence.json`.
6. **Agent:** strip the autopilot from the **site** repo's `main`:
   ```bash
   cd ../lumivara-people-advisory-site
   git rm -r .github/workflows
   git rm -r scripts/triage-* scripts/execute-* scripts/gemini-* scripts/codex-*
   git rm scripts/plan-issue.py scripts/test-routing.py scripts/bootstrap-kanban.sh
   git rm -r scripts/lib
   git rm -r docs/mothership docs/freelance docs/operator
   git commit -m "chore: remove autopilot artefacts; Pattern C migration"
   git push origin main
   ```
   Add `.claudeignore` per `03-secure-architecture.md §2.3` for belt-and-braces.
7. **Operator (manual):** apply branch protection rules to:
   - the site repo's `main` (per `03 §2.2` site-repo column)
   - the pipeline repo's `main` (per `03 §2.5` pipeline-repo column)
8. **Operator (manual):** add Beas as a Read collaborator on the site repo only. She is never a collaborator on the pipeline repo.
9. **Agent:** confirm Vercel preview + admin portal still work after the migration. Run the cross-repo smoke test from `02b §2 step 5`.

**DOD:**
- Site repo: `git ls-tree main -r --name-only | grep -E '(\.github/workflows|scripts/(triage|execute|gemini|codex|plan-issue|test-routing|bootstrap-kanban|lib)|docs/(mothership|operator|freelance))'` returns **no** matches.
- Pipeline repo: cron from its `main` fires on schedule; the App token-based PR opener writes to the site repo cleanly.
- `lumivara-people-advisory.com` (production) is unchanged from a visitor's perspective.

---

## P5.7 — Hardening pass 🟢

**Estimated turns:** 80–120.

Walk every item in `docs/storefront/05-template-hardening-notes.md` and convert each into a tracked issue against the mothership. Most are doc edits; a few need code:

- License header on `06-operator-rebuild-prompt-v3.md` (already present).
- Strip `bootstrap-kanban.sh` from any client-handed-over repo (P5.6 already did this).
- Watermark footer on Tier 0/1/2 sites (`client-template/src/components/Footer.tsx`).
- Graceful-exit procedure (CLI `teardown --mode handover` — P5.4e).
- Org-level secret scoping (P5.1 + provision CLI).

**DOD:**
- Every checkbox in `05-template-hardening-notes.md` is either checked or has a tracking issue in the mothership repo.

---

## P5.8 — Smoke-test the whole rig 🟢

**Estimated turns:** 30–40.

Run `cli/forge provision --client-slug smoke-test-co --tier 2 --dry-run` and confirm:

1. Output shows every step of `02-architecture.md §3`.
2. No real API calls are made.
3. The "fake-output" repo, fake Vercel project, fake n8n workflow names match conventions.

Then run for real against `palimkarakshay/forge-smoke-test-site` (a throwaway repo). Confirm end-to-end:

- GitHub repo exists, is in `{{BRAND_SLUG}}` org, has both branches.
- Vercel project is deployed; preview URL works.
- Admin portal at `https://forge-smoke-test.vercel.app/admin` accepts a magic link.
- n8n workflows for `smoke-test-co` are listed and active.
- An SMS to the per-client Twilio number creates a GitHub issue with the right labels.
- The triage cron picks up the new issue within 30 minutes.
- The execute cron opens a PR within 2 hours.
- The auto-merge gate squash-merges once Vercel is green.
- The Vercel deployment-succeeded webhook fires the `deploy-confirmed` n8n workflow which sends an SMS to the operator.

After confirmation, run `cli/forge teardown --client-slug smoke-test-co --mode archive` to clean up.

**DOD:**
- The end-to-end smoke produced an SMS-to-published cycle in under 4 hours of wall time.
- The teardown left no stranded resources (verified via `gh repo list`, Vercel UI, n8n UI, Twilio UI).

---

## P5.9 — Documentation final pass 🟢

**Estimated turns:** 20–30.

- Update mothership `README.md` with a "what's where" map.
- Add `CONTRIBUTING.md` (operator-only conventions for editing the prompts and routing rubric).
- Update `CHANGELOG.md` with P5 entries.
- Tag `v1.0.0`.

**DOD:**
- README explains: "this is the operator's repo; here's what each top-level folder is; here's how to provision a client."
- `git tag -l` lists `v1.0.0`.

---

## Resumption protocol

If a session starts mid-P5:

1. Read `00-INDEX.md` to find the active phase.
2. Inside this file, find the first 🟢 or 🟡 phase.
3. Inside that phase, find the first incomplete step.
4. Continue from there.
5. At 50% turns: finish current step, commit, push, exit.
6. At 80% turns: hard-stop, label work-in-progress issue `status/needs-continuation`.

The mothership's own `triage.yml` and `execute.yml` (once P5.2 is done) take over from this manual cadence — at that point, the operator can throw issues at the mothership and let it build itself.

*Last updated: 2026-04-28.*
