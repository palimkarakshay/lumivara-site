<!-- OPERATOR-ONLY. Per-engagement playbook. -->

# 06 — Operator Rebuild Prompt v3 (Per-Engagement Playbook)

The dense, copy-pasteable operator's playbook for spinning up a new client engagement. Successor to `docs/TEMPLATE_REBUILD_PROMPT.md` (v2). Uses the new mothership-repo separation from `02-architecture.md`.

> Pair this with `07-client-handover-pack.md` — that doc is what the **client** receives at the end of the engagement. This doc is what the **operator** does.

---

## 0. The four-prompt structure

v2 had two prompts. v3 has four — splitting "operator pipeline overlay" into three smaller prompts so each fits inside one cron-budget run.

| Prompt | Run on | Approx. budget | Output |
|---|---|---|---|
| **Prompt A** — Client site scaffold | Site repo (`<slug>-site`), `main` | 1.5–3 h Opus | `client-template/` rendered + populated content + green Vercel preview |
| **Prompt B1** — Pipeline repo provisioning | Pipeline repo (`<slug>-pipeline`), `main` | 30–45 min | All workflow files + scripts on the pipeline repo's `main`, branch protected, GitHub App installed on the site repo |
| **Prompt B2** — n8n + Vercel + Twilio integration | Operator's machine (mothership) | 30–60 min | n8n workflows imported & activated, Vercel envs set, Twilio number wired |
| **Prompt C** — Smoke test sweep | Site + pipeline repos (anywhere with `gh`) | 15–30 min | All six smoke tests in `docs/operator/SMOKE_TESTS.md` green |

> **Pattern C is canonical.** The site repo and pipeline repo are separate; workflows live in the pipeline repo only. See `02b-pattern-c-architecture.md` for the canonical architecture and §11 below for the one-paragraph "why two repos."

---

## 1. Pre-flight (the operator's manual checklist)

Before any prompt runs, the operator does each row in `18-provisioning-automation-matrix.md §1` and appends a corresponding entry to `docs/clients/{{CLIENT_SLUG}}/evidence-log.md` (template: `19-engagement-evidence-log-template.md`). The matrix is the source of truth — this section is the call-list.

| Step ID | What to verify | Evidence captured |
|---|---|---|
| PRE-01 | Engagement contract countersigned and stored as `docs/clients/{{CLIENT_SLUG}}/contract.md.age` (template: `docs/operator/CONTRACT_TEMPLATE.md`, see `08-future-work`). | `evidence/pre-01-contract.md` |
| PRE-02 | Intake form rendered into `docs/clients/{{CLIENT_SLUG}}/intake.md` (filled by client; ≥ 30 lines per template). | `evidence/pre-02-intake.md` |
| PRE-03 | Tier locked (T0 / T1 / T2 / T3) in `docs/clients/{{CLIENT_SLUG}}/cadence.json`. | `evidence/pre-03-cadence.json` |
| PRE-04 | Client domain owned (or operator buys it on client's behalf with credit-card + reimbursement clause). | `evidence/pre-04-domain.txt` + `evidence/pre-04-registrar.png` |
| PRE-05 | Anthropic Pro/Max active; `ccusage` shows ≥ 50% rolling-window free. | `evidence/pre-05-ccusage.txt` |
| PRE-06 | GitHub org has free secret-scope slots (each org secret used by ≤ 25 selected repos). | `evidence/pre-06-secrets.json` |
| PRE-07 | n8n on Railway healthy; last execution < 24 h. | `evidence/pre-07-n8n.png` |
| PRE-08 | Resend domain verified; DKIM green. | `evidence/pre-08-resend.json` |
| PRE-09 | Vercel team has a free project slot. | `evidence/pre-09-vercel.txt` |

If any row is red, fix before running Prompt A. The operator pauses/resumes provisioning by re-reading the evidence log: the first row without a complete entry (matching `validation_output` per `18 §0`) is where work resumes.

> **Pre-flight discovery sequence (`14 §7`):** Step 0 — Discovery call (free, 30 min) → Step 1 — Operator writes one-page proposal (template: `docs/operator/PROPOSAL_TEMPLATE.md`) naming tier + scope → Step 2 — Client signs proposal (DocuSign / PandaDoc free tier) → Step 3 — Client returns intake form (Google Form → Apps Script writes `docs/clients/<slug>/intake.md` to the mothership repo via PR) → Step 4 — Operator countersigns proposal → Step 5 — Operator runs `forge provision` (or follows Prompts A → B1 → B2 → C manually) → Step 6 — Smoke test → handover pack → walkthrough call. PRE-01..PRE-03 above are the artefacts produced by Steps 1–4.

---

## 2. Prompt A — Client site scaffold

**Where to run:** in a fresh checkout of the (just-created) client repo on the operator's machine, on `main`. Use Claude Opus.

### Gate check (before run)

Refuse to run Prompt A unless every Step ID below is ✅ in `docs/clients/{{CLIENT_SLUG}}/evidence-log.md` (the `19` schema defines ✅ as a non-empty `proof_link` or `screenshot_path` plus a `validation_output` matching the `18` validation column):

- PRE-01 .. PRE-09 (every Pre-flight row).

If a gate row is missing, finish Pre-flight first; do not press on.

**Copy-paste the body below verbatim, replacing `{{...}}` placeholders.** The placeholders are the same set the `provision` CLI uses; if you've already run `forge provision`, the CLI will have rendered all of these and you can skip Prompt A entirely (it's only here for the bootstrap case where the CLI doesn't exist yet, i.e. before P5.4 lands).

```
You are building a fresh Next.js 16 marketing website for {{CLIENT_NAME}},
a {{CLIENT_DESCRIPTOR}} based in {{CLIENT_LOCATION}}. The site is private
to {{CLIENT_NAME}} — they own everything you generate.

Constraints:
1. Next.js 16 App Router, TypeScript strict, Tailwind v4, shadcn/ui.
2. MDX for any long-form content.
3. Mobile-first; Lighthouse 90+ on every metric.
4. PIPEDA-compliant contact form: explicit opt-in checkbox, link to /privacy.
5. {{TIER}} pages: {{PAGE_LIST}}.
6. Brand voice: {{VOICE_ADJECTIVES}}.
7. Visual mood: {{MOOD_ADJECTIVES}}.
8. Primary CTA: {{PRIMARY_CTA}} (e.g., "Book a discovery call").
9. Cal.com link: {{CAL_LINK}} (or skip if absent).
10. Resend for contact-form delivery; route to {{CONTACT_EMAIL}}.

Add an /admin route group with the Auth.js v5 + magic-link + Google +
Entra setup from docs/ADMIN_PORTAL_PLAN.md (phases 1-3). Do NOT add the
n8n integration yet — that lands in Prompt B2. The Server Actions stub
out their webhook calls so the unit tests pass.

Add a /privacy page that complies with PIPEDA and (if applicable to
{{CLIENT_LOCATION}}) provincial privacy acts. Pull boilerplate from
mothership/client-template/legal/privacy.template.mdx.

Add /sitemap.xml, /robots.txt, OG image generation, structured data per
schema.org (LocalBusiness or Organization, depending on {{CLIENT_TYPE}}).

Tests: Playwright e2e for the contact form happy path; Vitest unit for
the admin allowlist + status map; tsc --noEmit clean; eslint clean.

Footer: include "Built on the {{BRAND}} framework" with a link to
https://{{BRAND_SLUG}}.com. (For Tier 3+ clients only, this is omitted —
check {{TIER}}.)

Commit in logical units. Push to main. Open a PR if you're not on a
fresh repo's first commit; otherwise just push.

Definition of done:
- npm run build succeeds.
- npx tsc --noEmit clean.
- npm run lint clean.
- npx playwright test passes.
- Vercel preview URL renders the home page within 2 seconds (test on
  vercel.com after pushing).
- /admin redirects unauthenticated visitors to /admin/sign-in.
- /privacy is reachable from the footer.
```

**Operator review after Prompt A finishes:**
- [ ] Read the full diff on `main`.
- [ ] Click through every page on the Vercel preview.
- [ ] Confirm Lighthouse 90+ in Chrome DevTools.
- [ ] Confirm Resend test email delivers (use the contact form on the preview URL).

### Evidence capture (after run)

For every Step ID below, append an entry to `evidence-log.md` per `19`'s schema. The artefact path under `docs/clients/{{CLIENT_SLUG}}/evidence/` is named in `18 §2`.

- A-01 (site repo created), A-02 (scaffold commit on `main`), A-03 (build green), A-04 (tsc clean), A-05 (lint clean), A-06 (Playwright pass), A-07 (Vercel preview READY), A-08 (Lighthouse ≥ 90 on home/services/contact), A-09 (Resend delivery), A-10 (`/admin` redirect), A-11 (`/privacy` reachable), A-12 (operator diff sign-off).

### Rollback path

If any step fails after committing scaffold work to `main`:

1. **Build / type / lint / e2e regression on the scaffold commit:** revert the scaffold commit (`git revert <sha>` on the site repo's `main` and force-push only if the repo has zero history outside that commit; otherwise open a revert PR). Re-run Prompt A from a clean checkout once the cause is understood.
2. **Vercel preview never goes READY:** delete the Vercel project (`vercel project rm {{CLIENT_SLUG}} --token=$VERCEL_TOKEN`) before re-running Prompt A; otherwise the rerun re-binds to the broken project and Prompt B2 inherits the failure.
3. **Resend delivery fails:** verify PRE-08 still green; if so, capture the failing Resend webhook ID, file an incident in mothership tagged `area/email`, and resume from A-09 once Resend confirms delivery.
4. **Lighthouse < 90:** open a P1 site-repo issue tagged `area/perf` with the failing audit; do **not** advance to Prompt B1 until A-08 is green (the smoke tests in `06 §5` assume a healthy site baseline).

---

## 3. Prompt B1 — Pipeline repo provisioning

**Where to run:** the freshly-created pipeline repo (`{{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline`), on `main`. This is a different GitHub repository from the site repo. The agent must not edit the site repo from this run except to confirm the cross-repo smoke test passes.

**Pre-step (operator manual):** confirm the GitHub App `{{BRAND_SLUG}}-pipeline-bot` is installed on `{{BRAND_SLUG}}/{{CLIENT_SLUG}}-site` before this prompt fires. Without the install, the workflows cannot mint installation tokens and the cron silently no-ops.

### Gate check (before run)

Refuse to run Prompt B1 unless these Step IDs are ✅ in `evidence-log.md`:

- A-01, A-02, A-03, A-04, A-05, A-06, A-07, A-12 (site repo exists, scaffold green, operator signed off).
- B1-01 (pipeline repo created), B1-02 (GitHub App installed on the site repo only).

If B1-02 is missing, install the App first; without the App, every B1 step that mints an installation token will silently no-op and you'll discover it at smoke time instead of pre-flight.

```
You are bootstrapping the operator-only pipeline repo for {{CLIENT_NAME}}.
You are running in {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline on branch main.
You never PR or push to {{BRAND_SLUG}}/{{CLIENT_SLUG}}-site from this repo's
working tree — the workflows you commit here will reach the site repo at
runtime via a GitHub App installation token, not via this filesystem.

Copy these files from mothership/workflows-template/ into .github/workflows/:
  triage.yml, plan-issues.yml, execute.yml, execute-complex.yml,
  execute-single.yml, execute-fallback.yml, codex-review.yml,
  deep-research.yml, auto-merge.yml, project-sync.yml, setup-cli.yml,
  ai-smoke-test.yml.

Substitute every {{...}} placeholder using
mothership/docs/clients/{{CLIENT_SLUG}}/cadence.json
and mothership/docs/clients/{{CLIENT_SLUG}}/intake.md. Set the pipeline
repo's vars: SITE_REPO_OWNER, SITE_REPO_NAME, CLIENT_SLUG, CLIENT_TIER,
DEFAULT_AI_MODEL, CONCURRENCY_CAP, plus per-tier cron expressions
from 04-tier-based-agent-cadence.md §1.

Copy these files from mothership/scripts/ into scripts/:
  triage-prompt.md, execute-prompt.md, gemini-triage.py, codex-triage.py,
  plan-issue.py, test-routing.py, lib/routing.py.

Every workflow that talks to the site repo must mint an installation
token via actions/create-github-app-token@v1, scoped to
${{ vars.SITE_REPO_OWNER }}/${{ vars.SITE_REPO_NAME }}. The pattern is
in 02b §3.

Add scripts/bootstrap-kanban.sh — but DO NOT execute it (the operator
will run it once locally against the SITE repo with their own gh-cli
credentials, or the pipeline triggers it once via workflow_dispatch
using an App token).

Commit each logical group. Push to main of the pipeline repo. Verify:
  gh api repos/{{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline/branches/main

DOD:
- All workflow files present on the pipeline repo's main.
- `gh workflow list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline`
  shows every workflow.
- `gh run list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline --limit 1`
  shows the bootstrap commit but no scheduled run yet (the cron will
  fire on its next interval).
- The site repo's `.github/workflows/` directory does not exist
  (or is empty) — verify with `gh api repos/{{BRAND_SLUG}}/{{CLIENT_SLUG}}-site/contents/.github/workflows`
  returning 404.
```

**Operator manual after Prompt B1:**
1. In GitHub UI: Settings → Branches on the **pipeline** repo → Add protection per `03-secure-architecture.md §2.5` (pipeline repo column).
2. Settings → Secrets → confirm the org-level secrets (`APP_ID`, `APP_PRIVATE_KEY`, `CLAUDE_CODE_OAUTH_TOKEN`, `GEMINI_API_KEY`, `OPENAI_API_KEY`) are visible to the pipeline repo (run `gh secret list --org {{BRAND_SLUG}}`).
3. Trigger `bootstrap-kanban` via workflow_dispatch on the pipeline repo (or run locally with the operator's `gh` against the site repo).

### Evidence capture (after run)

Append entries for: B1-01 .. B1-11 (every row in `18 §3`). Pay particular attention to:

- B1-06 (App-token mint pattern) — confirms every site-touching workflow mints a short-lived installation token.
- B1-10 (no `.github/workflows/` on site repo) — proves Pattern C separation; if this row's validation returns 200, treat as a P0 leak and run the rollback below.

### Rollback path

1. **`.github/workflows/` accidentally pushed to the site repo:** `git rm -r .github/workflows` on a branch off site repo's `main`, open a PR, merge with admin override; rotate `APP_ID` / `APP_PRIVATE_KEY` if the workflows ever ran from the site repo.
2. **Cron not firing on the pipeline repo:** verify the pipeline repo's `main` is its default branch (`gh repo view {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline --json defaultBranchRef`) — `schedule:` only fires from the default branch (`11 §1`). If wrong, set the default via `gh api -X PATCH /repos/{{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline -f default_branch=main`.
3. **App installation token mint fails (`B1-06` pattern present but `B1-11` fails):** the App is missing site-repo scope or the org-level secrets aren't visible. Re-run the App install URL scoped to the site repo; re-run `gh secret list --org {{BRAND_SLUG}}` to confirm secret visibility; then retrigger `bootstrap-kanban`.
4. **Pipeline-repo branch protection blocks the bot's first push:** confirm the `restrictions` block in `B1-07` lists the bot account; without it, the protection refuses the bot's commits. Patch via `gh api -X PUT /repos/.../branches/main/protection` with the bot included.
5. **Full rollback (start over):** archive the pipeline repo (`gh repo archive {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline`); uninstall the GitHub App from the site repo; create a fresh pipeline repo and rerun Prompt B1 from a clean checkout. Do **not** transfer the original repo's contents — provenance is easier to audit if the rebuild has its own history.

---

## 4. Prompt B2 — n8n + Vercel + Twilio integration

**Where to run:** operator's machine, in the **mothership** repo's `cli/` directory. (Pre-`forge provision`-CLI flow: do this manually following the steps below.)

### Gate check (before run)

Refuse to run Prompt B2 unless these Step IDs are ✅ in `evidence-log.md`:

- A-01, A-07 (site repo exists; Vercel preview is READY — Vercel project provisioning in B2-01 binds to this repo).
- B1-09, B1-10 (pipeline workflows present; site repo has no workflows).
- PRE-04 (domain ownership), PRE-07 (n8n healthy), PRE-08 (Resend verified).

> **Honest scope (`14 §3`):** B2-09 (Google OAuth) and B2-10 (Microsoft Entra) cannot be automated end-to-end. The Google Cloud Console requires UI clicks to create a Web-application OAuth client; the Entra portal requires tenant consent. Treat both as `manual` rows with a screen-recording artefact, not a `forge provision` step. Skip B2-10 entirely if the client doesn't use Microsoft 365 (set `auth_providers` in `cadence.json` accordingly per `14 §3`).

```
You are wiring {{CLIENT_NAME}}'s site into the operator's automation
infrastructure. You operate on the operator's local machine and call out
to Vercel API, n8n REST API, and Twilio API. All credentials come from
the operator's encrypted vault at ~/.{{BRAND_SLUG}}/vault/.

Steps:

1. Vercel project provisioning:
   - Create a new project named "{{CLIENT_SLUG}}" linked to
     palimkarakshay/{{CLIENT_SLUG}}-site, production branch main.
   - Set env vars from mothership/docs/clients/{{CLIENT_SLUG}}/env.json
     (decrypted from env.json.age) for both Production and Preview.
   - Create a Deploy Hook named "{{CLIENT_SLUG}}-confirm-deploy"; capture
     the URL into env.json under VERCEL_DEPLOY_HOOK.
   - Set domain: {{DOMAIN}}; verify ownership.

2. Resend per-client setup:
   - Create a Sub-domain "mail.{{DOMAIN}}" if {{TIER}} >= 2; otherwise reuse
     the operator's mail.{{BRAND_SLUG}}.com domain.

3. Google OAuth client provisioning:
   - In Google Cloud Console: create a new OAuth 2.0 client for
     "https://{{DOMAIN}}/api/auth/callback/google".
   - Capture client ID + secret into env.json (AUTH_GOOGLE_*).

4. Microsoft Entra App Registration:
   - Same as Google but for Entra. Capture into env.json (AUTH_MICROSOFT_ENTRA_ID_*).

5. Twilio number purchase:
   - Buy a {{CLIENT_LOCATION_AREA_CODE}} number with SMS enabled.
   - Set its inbound webhook to https://n8n.{{BRAND_SLUG}}.com/webhook/intake-sms-{{CLIENT_SLUG}}
   - Capture number into env.json under TWILIO_INBOUND_NUMBER.

6. n8n workflow import:
   - For each of intake-web, intake-email, intake-sms,
     client-input-notify, client-input-record, deploy-confirmed:
     - Import mothership/n8n/<workflow>.json via REST.
     - Rename to <workflow>-{{CLIENT_SLUG}}.
     - Patch credentials: GitHub → vendor PAT, Twilio → operator + this
       client's number, IMAP → operator mailbox + filter
       requests+{{CLIENT_SLUG}}@{{BRAND_SLUG}}.com, Resend → operator
       API key, Anthropic → operator API key.
     - Patch hard-coded values: GitHub repo → palimkarakshay/{{CLIENT_SLUG}}-site,
       client label → client/{{CLIENT_SLUG}}.
     - Activate.
   - Capture the three webhook URLs into env.json
     (N8N_INTAKE_WEBHOOK_URL, N8N_DECISION_WEBHOOK_URL,
     N8N_DEPLOY_WEBHOOK_URL).

7. Push env.json values into Vercel:
   - For each key in env.json, run `vercel env add` for both Production
     and Preview environments.
   - Trigger a redeploy of main so the new envs take effect.

DOD:
- `vercel env ls --token=$VERCEL_TOKEN` lists every env from §B3 of
  TEMPLATE_REBUILD_PROMPT.md (legacy doc; same env list).
- `curl https://n8n.{{BRAND_SLUG}}.com/webhooks` lists the six
  -{{CLIENT_SLUG}} workflows.
- A Twilio test SMS to TWILIO_INBOUND_NUMBER creates a GitHub issue
  on palimkarakshay/{{CLIENT_SLUG}}-site within 60 seconds.
- env.json is re-encrypted to env.json.age before exiting.
```

The `provision` CLI (P5.4c) automates this whole prompt; until it lands, do these manually following the v2 template's §B2-B5 (the legacy steps still apply).

### Evidence capture (after run)

Append entries for: B2-01 .. B2-12 (every row in `18 §4`). The OAuth rows (B2-09, B2-10) require both a screen-recording (`*.mp4`) and a screenshot of the credential page; do not skip the recording — it is the only evidence that the redirect URI was set correctly.

### Rollback path

1. **Vercel env-var push fails before redeploy verification (B2-02 fails):** `vercel env rm <key> production --token=$VERCEL_TOKEN` for every key in `env.json`; if the project is empty after the rm, `vercel project rm {{CLIENT_SLUG}} --token=$VERCEL_TOKEN`. Re-run from B2-01 once the cause is understood.
2. **Twilio number purchase fails or wrong area code:** `twilio api:core:incoming-phone-numbers:remove --sid <PN-sid>` to release the number back to Twilio's pool; re-purchase with the correct `{{CLIENT_LOCATION_AREA_CODE}}`.
3. **n8n workflow import fails (B2-07 fails) or imported but inactive:** `curl -X DELETE https://n8n.{{BRAND_SLUG}}.com/rest/workflows/<id> -H "X-N8N-API-KEY: $N8N_API_KEY"` for every imported `*-{{CLIENT_SLUG}}` workflow before retrying. Otherwise the rerun creates duplicates and the channel smoke tests in `06 §5` will pass for the wrong workflow.
4. **OAuth credential leaked or wrong redirect URI:** in Google Cloud Console / Entra, delete the OAuth client and create a fresh one; rotate the leaked secret in `env.json`; re-run B2-11 to re-encrypt.
5. **`env.json` left as plaintext on disk after exit (B2-11 fails):** treat as a P0 secret leak — `gpg --yes --delete-files docs/clients/{{CLIENT_SLUG}}/env.json`; rotate every secret in the file (Resend API key, Twilio auth token, Google + Entra OAuth secrets, GitHub App private key); re-encrypt the rotated values to `env.json.age` before any subsequent step runs.

---

## 5. Prompt C — Smoke-test sweep

**Where to run:** any clean shell with `gh`, `curl`, and an active client-side login.

### Gate check (before run)

Refuse to run Prompt C unless these Step IDs are ✅ in `evidence-log.md`:

- Every A-* row (site healthy).
- Every B1-* row (pipeline ready, App installed, no workflows on site repo).
- Every B2-* row except — if the client opted out of Entra in `cadence.json` — B2-10. B2-11 (encrypted env) is non-negotiable: refuse to run smokes if `env.json` is still plaintext.

```
Run all six smoke tests from mothership/docs/operator/SMOKE_TESTS.md
against {{CLIENT_NAME}}'s live site. Report PASS/FAIL per test with
evidence (URL, screenshot path, command output).

The six tests:
  1. Web channel: submit a test idea via /admin/new — verify GitHub
     issue created with `source/web` label within 30 seconds.
  2. Email channel: send a test email to requests+{{CLIENT_SLUG}}@{{BRAND_SLUG}}.com
     — verify GitHub issue created with `source/email` label within 90s.
  3. SMS channel: text TWILIO_INBOUND_NUMBER — verify GitHub issue with
     `source/sms` within 60s.
  4. Triage: wait for the next triage run; verify the issue gets a
     priority/, complexity/, area/, model/ label set within 30 min.
  5. Execute: confirm the next execute run picks up an auto-routine
     issue and opens a PR with a Vercel preview within 2 h (4 h on T1).
  6. Deploy: merge the auto-PR; verify the deploy-confirmed n8n workflow
     fires and the operator receives an SMS within 5 min of Vercel
     reporting "deployment.succeeded".

For any FAIL: capture the failing log line, the workflow run URL, and
the n8n execution URL. Open an issue
"Smoke {{N}} failed for {{CLIENT_SLUG}}" labeled `priority/P0`,
`area/automation`, `human-only`. Do not auto-resolve — operator triages.
```

If all six pass, the engagement is **live**. Send the client `07-client-handover-pack.md` (rendered) and the 5-minute walkthrough video.

### Evidence capture (after run)

Append entries for: C-01 .. C-06 (every row in `18 §5`). PASS rows attach the API response or n8n execution URL; FAIL rows attach the failing log line, the workflow run URL, and the n8n execution URL — and open the `priority/P0`, `area/automation`, `human-only` issue named in the prompt body above.

### Rollback path

1. **C-01 / C-02 / C-03 channel fails:** open the matching `area/automation` P0 issue in the **mothership** (not the client repo); do **not** auto-resolve. Identify which surface failed (Vercel + admin portal for web; Resend + n8n for email; Twilio + n8n for SMS); rerun the matching B2 step's rollback before retrying the smoke.
2. **C-04 triage labels missing:** confirm `gh workflow list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline` shows `triage.yml` enabled; confirm the org-level `CLAUDE_CODE_OAUTH_TOKEN` secret is visible to the pipeline repo. If both green, manually dispatch `triage.yml` once and capture the run URL as the C-04 evidence.
3. **C-05 execute does not open a PR within window:** check `gh run list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline --workflow execute.yml --limit 5` for failures; if the run errored with `installation token mint failed`, return to the B1-02 / B1-06 rollback. If runs are succeeding but no `auto-routine` issue exists, the smoke depends on a precondition issue — open one labelled `auto-routine` and retry.
4. **C-06 deploy-confirmed SMS not received:** confirm the Vercel Deploy Hook (B2-03) URL is wired to the n8n `deploy-confirmed-{{CLIENT_SLUG}}` workflow; check the n8n Executions tab for the trigger; if the workflow ran but the SMS didn't arrive, fall back to Twilio API logs (`twilio api:core:messages:list --to=$OPERATOR_PHONE`).
5. **Engagement is NOT live until every smoke passes.** Do not advance to handover (`§6`) on partial green.

---

## 6. The handover

### Gate check (before run)

Refuse to send the handover email unless every smoke (C-01..C-06) is ✅ in `evidence-log.md`. A red smoke means the engagement is not live; a partial-green handover sets up a Day-1 client complaint.

| Item | Source | Where to send |
|---|---|---|
| Handover guide | `07-client-handover-pack.md` rendered with `{{CLIENT_NAME}}` substitutions | Email + 1 printed copy at handover call |
| 5-min walkthrough video | Loom or Cleanshot, recorded once per engagement | Embed link in the handover email |
| Admin portal URL | `https://{{DOMAIN}}/admin` | In the email |
| Their GitHub login | The email they used at intake | (They sign in to GitHub themselves; you don't share credentials) |
| Their Vercel login | They create their own account at handover; until then, the operator's team owns the project | Walkthrough call only |

**Never sent to client:** anything from `docs/mothership/`, `docs/freelance/`, the dashboard URL, the n8n URL, the Twilio admin, or the operator's vault.

### Evidence capture (after run)

Append entries for: H-01 (handover rendered), H-02 (walkthrough video URL), H-03 (handover email delivered), H-04 (admin portal link sent), H-05 (client signed in from phone), H-06 (no-leak inventory check). H-06 is the operator's signed acknowledgement that nothing operator-only left their machine.

### Rollback path

1. **H-01 fails (rendered handover still has `{{...}}` placeholders):** abort send; re-render from `07-client-handover-pack.md` against the per-client values in `intake.md` and `cadence.json`; only then advance to H-02.
2. **H-03 email bounces:** verify the client's intake email is correct; resend from operator's `noreply@{{BRAND_SLUG}}.com` address. If the bounce is a spam-filter false positive, send the link via the existing comms channel from PRE-02 (the form-submission email) and append a note.
3. **H-05 client cannot sign in to `/admin`:** see `D30-01` rollback below — same protocol applies during handover-call window.
4. **H-06 leak discovered:** treat as P0. Recall the email if possible (Gmail "Undo Send" if within 30 s); rotate any secret named in the leaked content; document in `engagement-log.md` and `incident/<date>-{{CLIENT_SLUG}}` issue in the mothership.

---

## 7. The first 30 days post-handover

Light-touch. The autopilot does the work; the operator monitors.

### Gate check (before run)

Day-1 monitoring opens only when every H-* row is ✅ in `evidence-log.md`. The day-table below is the call-list; the `D30-` rows in `18 §7` carry the validation commands.

| Day | Step ID | Activity | Rollback if step fails |
|---|---|---|---|
| Day 1 | D30-01 | Confirm client signed in to `/admin` from their phone successfully. | Check magic-link delivery in Resend dashboard; check `admin-allowlist.ts` has client's email; if both green, Auth.js issue → escalate to Run-A backlog issue (`14 §4`). |
| Day 3 | D30-02 | Check that at least one phone-edit cycle (web or SMS) happened. If zero edits, send a "feeling stuck? happy to walk through it" email. | Send the "feeling stuck?" template; do **not** silently flag. If the client replies that they tried and the form errored, treat as a Smoke-1 / Smoke-3 regression and rerun those smokes. |
| Day 7 | D30-03 | Run a manual `deep-research.yml` to seed 3-5 improvement issues; explain in `/admin` that "I queued 5 improvements for the next month." | If deep-research produces bad issues: close all auto-generated `auto-research` issues with `wontfix`; rerun deep-research with operator-edited prompt dispatched manually; log in `engagement-log.md` (`14 §4`). |
| Day 14 | D30-04 | First monthly check-in email with traffic + improvements made. | If an improvement run has shipped a regression: `gh pr revert <PR>`; redeploy via Vercel UI; open `incident/<date>-{{CLIENT_SLUG}}` issue in the mothership; 14-day cool-off before next improvement run on this client (`14 §4`). |
| Day 30 | D30-05 | Auto-charge first monthly retainer via Stripe / Lemon Squeezy. If declined → label every open issue `paused/non-payment`, follow `08-future-work §3`. | Already covered in `08 §3`; no separate protocol needed beyond the `paused/non-payment` labelling. |

### Evidence capture

Append entries for D30-01 .. D30-05 as each day passes. Day 30's entry closes the engagement's onboarding phase; subsequent monthly check-ins log to `engagement-log.md` directly (per `14 §6` schema), not to `evidence-log.md` — the evidence log is reserved for the gated provisioning + first-30-days steps.

---

## 8. Per-engagement file checklist (for your own records)

In the mothership repo, `docs/clients/{{CLIENT_SLUG}}/` should contain:

- [ ] `intake.md` — completed intake form
- [ ] `contract.md.age` — encrypted signed contract PDF + clauses summary
- [ ] `cadence.json` — tier + cron + concurrency cap
- [ ] `env.json.age` — encrypted env-var bundle for Vercel
- [ ] `secrets.md.age` — list of which org secrets / n8n creds / OAuth apps are scoped to this client
- [ ] `runbook.md` — anything client-specific (preferred contact, weekly call cadence, do-not-do list)
- [ ] `engagement-log.md` — start/end dates, tier changes, incidents, milestones (schema: `14 §6`)
- [ ] `evidence-log.md` — per-step provisioning evidence (template: `19-engagement-evidence-log-template.md`); the gated artefact set named in `18-provisioning-automation-matrix.md`
- [ ] `evidence/` — directory containing the artefacts referenced from `evidence-log.md` (per-Step-ID files: `pre-01-contract.md`, `a-08-lighthouse-home.png`, `b2-09-google.mp4`, etc.)

Without these, an engagement is half-documented and a future operator (or future-you after a long break) will struggle to re-enter it.

---

## 9. Ending an engagement

Pick a mode from `02-architecture.md §7` and run:

```bash
npx forge teardown --client-slug {{CLIENT_SLUG}} --mode handover
```

Or (pre-CLI) follow the steps manually:

1. Disable cron on the pipeline repo by setting `vars.AUTOPILOT_DISABLED=true`. Every workflow's first step exits early when this is `true`.
2. Notify client by email (template: `mothership/templates/handover-email.md`).
3. After the 14-day grace period, uninstall the GitHub App from the site repo (Settings → Integrations → GitHub Apps → Uninstall on the site repo only).
4. Archive the pipeline repo (Settings → Archive this repository) or delete it after exporting Actions logs to the operator's vault.
5. Drop branch protections on the site repo's `main`.
6. Transfer the site repo to the client's GitHub account via Settings → Transfer ownership.
7. Cancel the Vercel project ownership; reassign to client's Vercel team.
8. Delete per-client n8n workflows (or rename to `archived-{{CLIENT_SLUG}}-*` if the client may return).
9. Release the Twilio number (return to pool) or hand it to the client (they pay $1.15/mo direct).
10. Append to `engagement-log.md`: end date, mode, residual notes.
11. Move `docs/clients/{{CLIENT_SLUG}}/` to `docs/clients/_archived/{{CLIENT_SLUG}}/`.

Done in 30 minutes if everything is documented; an unpleasant afternoon if it isn't. That's why §8's checklist matters.

---

## 11. Why two repos (Pattern C in one paragraph)

The site repo is what the client clones, owns at handover, and shows the world. The pipeline repo is where the cron fires from, where the bot's workflows live, and where the operator's prompts and scripts sit. They are separate GitHub repositories — the client has Read access only on the site repo and never sees the pipeline repo. The GitHub App bridges the two: per workflow run, the pipeline mints a short-lived installation token scoped to the matched site repo, uses it to push branches and open PRs, and discards it. The "client cannot see the autopilot" claim is now an architectural fact, not a marketing line. Full canonical reference: `02b-pattern-c-architecture.md`.

*Last updated: 2026-04-28.*
