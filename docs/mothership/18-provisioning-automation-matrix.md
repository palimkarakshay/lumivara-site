<!-- OPERATOR-ONLY. Per-engagement matrix. Pair with 06 (runbook) and 19 (evidence log template). -->

# 18 — Provisioning Automation Matrix

The deterministic, per-engagement provisioning matrix. Every step the operator runs (or supervises) to take a signed-proposal client from "intake landed" to "engagement live" appears here exactly once, with the system that owns it, today's automation status, the blocking dependencies that must be green first, the single command/check that proves the step succeeded, and the evidence artefact the operator captures into `docs/clients/<slug>/evidence/`.

Read this file alongside `06-operator-rebuild-prompt-v3.md` (the prompt-by-prompt runbook) and `19-engagement-evidence-log-template.md` (the per-client evidence log this matrix references).

> **Pattern C is canonical** (`02b-pattern-c-architecture.md`, locked 2026-04-28). Where a row's behaviour will change once Pattern C has fully propagated through the per-engagement workflow, the row links to `§N+1 — Pattern C deltas` at the foot of this document. Until then, the row in the main matrix describes today's behaviour.

---

## §0 — How to read this matrix

### Columns

| Column | Meaning |
|---|---|
| **Step ID** | Stable identifier of the form `<STAGE>-NN`. `STAGE` is one of `PRE`, `A`, `B1`, `B2`, `C`, `H`, `D30`. NN counts from `01` within each stage. Step IDs are append-only — never renumber, never reuse, never delete. If a step is retired, mark it `(retired)` in the description and keep the row. |
| **Description** | Single-sentence imperative summary. The runbook (`06`) carries the full prose. |
| **System owner** | The system or surface where the work happens. Allowed values: `site repo`, `pipeline repo`, `mothership`, `n8n`, `Vercel`, `Twilio`, `Resend`, `OAuth provider`, `operator-laptop`. Exactly one owner per row. If a step crosses two surfaces, split it into two rows. |
| **Automation status** | One of `full` / `semi` / `manual` / `future-CLI`. See "Status legend" below. |
| **Blocking dependencies** | The Step IDs that must be ✅ in the engagement evidence log before this step may run. Empty cell means no in-matrix dependency (the step runs as soon as its stage opens). |
| **Validation command/check** | The single command, API call, or visible check the operator runs to prove the step succeeded. Prefer commands that return zero/non-zero or print a definitive value over screenshot-only checks. Where only a UI exists (OAuth consoles), name the screen + the field to capture. |
| **Evidence artefact** | The artefact path under `docs/clients/<slug>/evidence/` and the artefact type. Types: `cli-stdout` (captured shell output), `screenshot` (PNG of UI state), `api-response` (raw JSON), `pr-url` (GitHub PR), `run-url` (GitHub Actions run), `n8n-execution-url`, `screen-recording` (MP4/MOV for OAuth flows). Every step in the matrix produces exactly one evidence artefact; if a step truly produces nothing, mark it `n/a (procedural)` and pair it with a `cli-stdout` showing the procedural confirmation. |

### Status legend

| Status | Meaning | Rule for the operator |
|---|---|---|
| `full` | A workflow, script, or `forge` CLI subcommand drives the step end-to-end. Operator runs one command and reads the validation. | Trust the automation; capture the cli-stdout as evidence. |
| `semi` | Automation drives the step but the operator must review/approve a UI prompt, paste a token, or accept a redirect. | Capture both the cli-stdout and the screenshot of the approved prompt. |
| `manual` | No automation today; operator clicks through the owning system's UI. | Capture a screen-recording or numbered screenshots. The validation column names the visible field that proves success. |
| `future-CLI` | Step is `manual` today and will become `full` once `forge provision` (P5.4 in `05-mothership-repo-buildout-plan.md`) lands. The matrix authors today's reality; do not pre-claim automation. | Treat as `manual` today. The PR that closes P5.4 flips the status here. |

A step's automation status is **load-bearing**: rollback paths in `06 §6/§7`, gate-checks before each prompt, and the `forge validate-evidence` follow-up (deferred — see "Risks" in the issue plan) all read this column.

### Stage map

| Stage | Step ID prefix | Owning section in `06` | Wall-clock target |
|---|---|---|---|
| Pre-flight | `PRE-` | `06 §1` | 0.5–1 day after intake lands |
| Site scaffold (Prompt A) | `A-` | `06 §2` | 1.5–3 h Opus run |
| Pipeline provisioning (Prompt B1) | `B1-` | `06 §3` | 30–45 min |
| Integrations (Prompt B2) | `B2-` | `06 §4` | 30–60 min today; 10 min once `forge provision` lands |
| Smoke test sweep (Prompt C) | `C-` | `06 §5` | 15–30 min |
| Handover | `H-` | `06 §6` | 30–60 min handover call + email |
| First 30 days | `D30-` | `06 §7` | Day 1 / 3 / 7 / 14 / 30 touchpoints |

### Evidence-log linkage

Every row's "Evidence artefact" path is relative to `docs/clients/<slug>/evidence/`. For each step, the operator appends one entry to `docs/clients/<slug>/evidence-log.md` (template: `19-engagement-evidence-log-template.md`) referencing the artefact. A step is "✅ in the evidence log" when its entry has both a non-empty `proof_link` (or `screenshot_path`) and a `validation_output` matching the validation column. Gate-checks in `06` read this rule literally — if the entry is incomplete, the gate fails.

---

## §1 — Pre-flight (`PRE-`)

Owns: every check that must be green before Prompt A fires. Source: `06 §1`. Wall-clock budget: half a day to a day after the signed proposal lands.

| Step ID | Description | System owner | Automation status | Blocking deps | Validation command/check | Evidence artefact |
|---|---|---|---|---|---|---|
| PRE-01 | Engagement contract countersigned and stored. | mothership | manual | — | `gh api repos/{{BRAND_SLUG}}/{{BRAND_SLUG}}-mothership/contents/docs/clients/{{CLIENT_SLUG}}/contract.md.age` returns 200. | `pre-01-contract.md` (cli-stdout: `gh api …` HTTP 200 line). |
| PRE-02 | Intake form rendered into mothership. | mothership | semi | PRE-01 | `test -f docs/clients/{{CLIENT_SLUG}}/intake.md && wc -l docs/clients/{{CLIENT_SLUG}}/intake.md` shows ≥ 30 lines (intake template min). | `pre-02-intake.md` (cli-stdout). |
| PRE-03 | Tier locked in `cadence.json`. | mothership | manual | PRE-02 | `jq -r '.tier' docs/clients/{{CLIENT_SLUG}}/cadence.json` prints one of `T0` / `T1` / `T2` / `T3`. | `pre-03-cadence.json` (cli-stdout). |
| PRE-04 | Client domain ownership confirmed. | operator-laptop | manual | PRE-02 | `dig +short NS {{DOMAIN}}` returns the registrar's nameservers; operator confirms the registrar account is theirs (or the client's, with documented access). | `pre-04-domain.txt` (cli-stdout) + `pre-04-registrar.png` (screenshot). |
| PRE-05 | Anthropic Pro/Max quota healthy (`ccusage` green). | operator-laptop | manual | — | `ccusage` exits 0 and shows ≥ 50% of the rolling 5-h window free. | `pre-05-ccusage.txt` (cli-stdout). |
| PRE-06 | Org-level secret-scope slot available. | operator-laptop | manual | — | `gh secret list --org {{BRAND_SLUG}}` shows secrets used by ≤ 25 selected repos each (count via `gh secret list --org {{BRAND_SLUG}} --json name,selectedRepositoriesURL`). | `pre-06-secrets.json` (cli-stdout). |
| PRE-07 | n8n on Railway healthy; last execution < 24 h. | n8n | manual | — | `curl -sf https://n8n.{{BRAND_SLUG}}.com/healthz` returns 200; n8n UI Executions tab shows a successful run within 24 h. | `pre-07-n8n.png` (screenshot of Executions tab). |
| PRE-08 | Resend domain verified; DKIM green. | Resend | manual | — | `curl -sf https://api.resend.com/domains/{{RESEND_DOMAIN_ID}} -H "Authorization: Bearer $RESEND_API_KEY"` returns `"status":"verified"`. | `pre-08-resend.json` (api-response). |
| PRE-09 | Vercel team has a free project slot. | Vercel | manual | — | `vercel teams ls --token=$VERCEL_TOKEN` followed by `vercel projects ls --token=$VERCEL_TOKEN --scope={{BRAND_SLUG}}` shows project count below team plan limit. | `pre-09-vercel.txt` (cli-stdout). |

---

## §2 — Prompt A: Client site scaffold (`A-`)

Owns: every step inside Prompt A in `06 §2`. Runs in a fresh checkout of `{{CLIENT_SLUG}}-site` on `main`. Source: `06 §2` plus the post-prompt operator review block.

| Step ID | Description | System owner | Automation status | Blocking deps | Validation command/check | Evidence artefact |
|---|---|---|---|---|---|---|
| A-01 | Site repo created in operator org. | site repo | future-CLI | PRE-09 | `gh repo view {{BRAND_SLUG}}/{{CLIENT_SLUG}}-site --json visibility,defaultBranchRef` returns `"visibility":"PRIVATE"` and `"defaultBranchRef":"main"`. | `a-01-repo.json` (api-response). |
| A-02 | Prompt A executed; Next.js scaffold + content rendered into site repo. | site repo | semi | A-01, PRE-03 | `gh api repos/{{BRAND_SLUG}}/{{CLIENT_SLUG}}-site/commits/main --jq '.commit.message'` shows the scaffold commit. | `a-02-scaffold.txt` (cli-stdout). |
| A-03 | `npm run build` clean on site repo `main`. | site repo | full | A-02 | Site repo's CI run for the scaffold commit shows `build` job green: `gh run list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-site --workflow build.yml --limit 1 --json conclusion --jq '.[0].conclusion'` returns `success`. | `a-03-build.txt` (run-url). |
| A-04 | `npx tsc --noEmit` clean. | site repo | full | A-02 | Same CI run, `tsc` job conclusion `success`. | `a-04-tsc.txt` (run-url). |
| A-05 | `npm run lint` clean. | site repo | full | A-02 | Same CI run, `lint` job conclusion `success`. | `a-05-lint.txt` (run-url). |
| A-06 | `npx playwright test` passes. | site repo | full | A-02 | Same CI run, `e2e` job conclusion `success`. | `a-06-e2e.txt` (run-url). |
| A-07 | Vercel preview deploys cleanly from `main`. | Vercel | semi | A-03 | `vercel inspect <preview-url> --token=$VERCEL_TOKEN` returns `state: READY`. | `a-07-vercel-preview.txt` (cli-stdout) + `a-07-home.png` (screenshot of home). |
| A-08 | Lighthouse 90+ on home, services, contact. | operator-laptop | manual | A-07 | Chrome DevTools → Lighthouse → mobile → all four categories ≥ 90 on each of `/`, `/services`, `/contact`. | `a-08-lighthouse-home.png`, `a-08-lighthouse-services.png`, `a-08-lighthouse-contact.png` (screenshots). |
| A-09 | Resend test email delivers from preview's contact form. | Resend | semi | A-07, PRE-08 | Submit the form on the preview URL; `curl -sf https://api.resend.com/emails -H "Authorization: Bearer $RESEND_API_KEY"` shows the test message with `"last_event":"delivered"`. | `a-09-resend-delivery.json` (api-response). |
| A-10 | `/admin` redirects unauthenticated visitors to `/admin/sign-in`. | site repo | full | A-07 | `curl -sI {{PREVIEW_URL}}/admin` returns `302` with `location: /admin/sign-in`. | `a-10-admin-redirect.txt` (cli-stdout). |
| A-11 | `/privacy` reachable from the footer. | site repo | manual | A-07 | Click footer link on `/`; lands on `/privacy` HTTP 200. | `a-11-privacy.png` (screenshot). |
| A-12 | Operator reads the full diff on `main` and signs off. | operator-laptop | manual | A-02 | `gh pr diff <pr-url>` (or `git log -p main` for first-commit case) reviewed end-to-end; operator initials the evidence-log entry. | `a-12-review.md` (cli-stdout: a one-line confirmation `reviewed-by: <initials>; date: <YYYY-MM-DD>`). |

---

## §3 — Prompt B1: Pipeline repo provisioning (`B1-`)

Owns: every step inside Prompt B1 in `06 §3` plus the post-prompt operator manual block. Runs in `{{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline` on `main`.

| Step ID | Description | System owner | Automation status | Blocking deps | Validation command/check | Evidence artefact |
|---|---|---|---|---|---|---|
| B1-01 | Pipeline repo created in operator org. | pipeline repo | future-CLI | A-01 | `gh repo view {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline --json visibility` returns `"visibility":"PRIVATE"`. | `b1-01-repo.json` (api-response). |
| B1-02 | GitHub App `{{BRAND_SLUG}}-pipeline-bot` installed on the **site** repo only. | OAuth provider | manual | B1-01 | `gh api /repos/{{BRAND_SLUG}}/{{CLIENT_SLUG}}-site/installation` returns the installation object; same call on the pipeline repo returns 404 (App is **not** installed there). | `b1-02-app-install.json` (api-response) + `b1-02-confirm-pipeline-404.txt` (cli-stdout). |
| B1-03 | Workflow templates copied from mothership into pipeline repo's `.github/workflows/`. | pipeline repo | semi | B1-01 | `gh api /repos/{{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline/contents/.github/workflows --jq 'length'` returns ≥ 12 (the workflow set in `06 §3`). | `b1-03-workflows.json` (api-response). |
| B1-04 | Pipeline repo `vars` populated. | pipeline repo | semi | B1-03 | `gh variable list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline` lists `SITE_REPO_OWNER`, `SITE_REPO_NAME`, `CLIENT_SLUG`, `CLIENT_TIER`, `DEFAULT_AI_MODEL`, `CONCURRENCY_CAP`, plus the cron expression vars from `04 §1`. | `b1-04-vars.txt` (cli-stdout). |
| B1-05 | Scripts copied into pipeline repo's `scripts/`. | pipeline repo | semi | B1-03 | `gh api /repos/{{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline/contents/scripts --jq '[.[].name] | sort'` includes `triage-prompt.md`, `execute-prompt.md`, `gemini-triage.py`, `codex-triage.py`, `plan-issue.py`, `test-routing.py`, plus `lib/`. | `b1-05-scripts.json` (api-response). |
| B1-06 | App-token mint pattern present in every workflow that touches the site repo. | pipeline repo | full | B1-03 | `gh api /search/code -X GET -f q='actions/create-github-app-token+repo:{{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline' --jq '.total_count'` returns ≥ 8 (every site-touching workflow has at least one occurrence). | `b1-06-token-pattern.json` (api-response). |
| B1-07 | Pipeline repo `main` branch protection applied. | pipeline repo | manual | B1-03 | `gh api /repos/{{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline/branches/main/protection --jq '.required_pull_request_reviews.required_approving_review_count'` returns `1`; `restrictions` lists only the bot account. | `b1-07-protection.json` (api-response). |
| B1-08 | Org-level secrets visible to pipeline repo. | operator-laptop | manual | B1-01 | `gh secret list --org {{BRAND_SLUG}}` lists `APP_ID`, `APP_PRIVATE_KEY`, `CLAUDE_CODE_OAUTH_TOKEN`, `GEMINI_API_KEY`, `OPENAI_API_KEY` with the pipeline repo in `selectedRepositoriesURL`. | `b1-08-secrets.json` (cli-stdout). |
| B1-09 | `gh workflow list` shows every workflow on pipeline repo. | pipeline repo | full | B1-03 | `gh workflow list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline` lists all 12 workflows from `06 §3`. | `b1-09-workflow-list.txt` (cli-stdout). |
| B1-10 | Site repo has no `.github/workflows/` directory. | site repo | full | B1-03 | `gh api /repos/{{BRAND_SLUG}}/{{CLIENT_SLUG}}-site/contents/.github/workflows` returns 404. | `b1-10-no-site-workflows.txt` (cli-stdout). |
| B1-11 | `bootstrap-kanban` triggered once via `workflow_dispatch` against site repo. | pipeline repo | semi | B1-02, B1-09 | `gh run list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline --workflow setup-cli.yml --limit 1 --json conclusion --jq '.[0].conclusion'` returns `success`. | `b1-11-kanban.txt` (run-url). |

---

## §4 — Prompt B2: n8n + Vercel + Twilio integration (`B2-`)

Owns: every step inside Prompt B2 in `06 §4`. Runs on the operator's machine in the mothership `cli/` directory. Today these steps are `manual` or `semi`; once `forge provision` (P5.4c in `05`) lands, every row except the OAuth provisioning flips to `full`. The OAuth flows (`B2-09`, `B2-10`) stay `manual` indefinitely per `14 §3`.

| Step ID | Description | System owner | Automation status | Blocking deps | Validation command/check | Evidence artefact |
|---|---|---|---|---|---|---|
| B2-01 | Vercel project created and linked to site repo. | Vercel | future-CLI | A-01, PRE-09 | `vercel projects ls --token=$VERCEL_TOKEN --scope={{BRAND_SLUG}}` lists `{{CLIENT_SLUG}}` with link to `{{BRAND_SLUG}}/{{CLIENT_SLUG}}-site`. | `b2-01-vercel-project.txt` (cli-stdout). |
| B2-02 | Vercel env vars (Production + Preview) populated from `env.json`. | Vercel | future-CLI | B2-01 | `vercel env ls production --token=$VERCEL_TOKEN` and `… ls preview …` together include every key in `docs/clients/{{CLIENT_SLUG}}/env.json`. | `b2-02-vercel-env.txt` (cli-stdout). |
| B2-03 | Vercel Deploy Hook `{{CLIENT_SLUG}}-confirm-deploy` created. | Vercel | future-CLI | B2-01 | `vercel deploy-hooks ls --project {{CLIENT_SLUG}} --token=$VERCEL_TOKEN` lists the hook; the URL is captured into `env.json` under `VERCEL_DEPLOY_HOOK`. | `b2-03-deploy-hook.txt` (cli-stdout). |
| B2-04 | Production domain bound to Vercel project; ownership verified. | Vercel | manual | B2-01, PRE-04 | `vercel domains inspect {{DOMAIN}} --token=$VERCEL_TOKEN` returns `verified: true`. | `b2-04-domain.txt` (cli-stdout). |
| B2-05 | Resend per-client setup (sub-domain or shared domain decision). | Resend | future-CLI | PRE-08, PRE-03 | For T2+: `curl -sf https://api.resend.com/domains -H "Authorization: Bearer $RESEND_API_KEY"` lists `mail.{{DOMAIN}}` with `status:verified`. For T0/T1: cli-stdout note `reused mail.{{BRAND_SLUG}}.com (tier {{TIER}})`. | `b2-05-resend.json` (api-response). |
| B2-06 | Twilio number purchased; SMS inbound webhook wired to n8n. | Twilio | future-CLI | PRE-03, PRE-07 | `twilio api:core:incoming-phone-numbers:list --properties=phoneNumber,smsUrl` shows the new number with `smsUrl=https://n8n.{{BRAND_SLUG}}.com/webhook/intake-sms-{{CLIENT_SLUG}}`. | `b2-06-twilio.json` (api-response). |
| B2-07 | n8n workflows imported, renamed, credentialled, and activated for this client. | n8n | future-CLI | PRE-07, B2-01 | `curl -sf https://n8n.{{BRAND_SLUG}}.com/rest/workflows -H "X-N8N-API-KEY: $N8N_API_KEY" \| jq '[.data[] \| select(.name \| endswith("-{{CLIENT_SLUG}}")) \| {name, active}]'` returns 6 entries, all `active: true`. | `b2-07-n8n.json` (api-response). |
| B2-08 | n8n webhook URLs captured into `env.json`. | mothership | future-CLI | B2-07 | `jq -r '.N8N_INTAKE_WEBHOOK_URL, .N8N_DECISION_WEBHOOK_URL, .N8N_DEPLOY_WEBHOOK_URL' docs/clients/{{CLIENT_SLUG}}/env.json` returns three non-empty URLs ending in `-{{CLIENT_SLUG}}`. | `b2-08-env.txt` (cli-stdout). |
| B2-09 | Google OAuth client provisioned (manual; Console UI). | OAuth provider | manual | B2-04 | Google Cloud Console → APIs & Services → Credentials shows OAuth 2.0 client of type **Web application** with redirect `https://{{DOMAIN}}/api/auth/callback/google`; client ID + secret stored under `AUTH_GOOGLE_*` in `env.json`. | `b2-09-google.mp4` (screen-recording) + `b2-09-google-credential.png` (screenshot). |
| B2-10 | Microsoft Entra app registration created (manual; Entra UI + tenant consent). | OAuth provider | manual | B2-04 | Entra portal → App registrations → app shows `Web` redirect `https://{{DOMAIN}}/api/auth/callback/microsoft-entra-id`; tenant admin consent granted; client ID + secret stored under `AUTH_MICROSOFT_ENTRA_ID_*` in `env.json`. | `b2-10-entra.mp4` (screen-recording) + `b2-10-entra-credential.png` (screenshot). |
| B2-11 | `env.json` re-encrypted to `env.json.age` before exiting. | mothership | full | B2-08, B2-09, B2-10 | `test ! -f docs/clients/{{CLIENT_SLUG}}/env.json && test -f docs/clients/{{CLIENT_SLUG}}/env.json.age` — plain file gone, `.age` file present. | `b2-11-encrypt.txt` (cli-stdout). |
| B2-12 | Vercel redeploy of `main` so the new envs take effect. | Vercel | future-CLI | B2-02, B2-11 | `vercel inspect <new-deployment-url> --token=$VERCEL_TOKEN` returns `state: READY`; the deployment ID is later than the B2-02 push. | `b2-12-redeploy.txt` (cli-stdout). |

---

## §5 — Prompt C: Smoke-test sweep (`C-`)

Owns: the six smoke tests in `06 §5` (sourced from `mothership/docs/operator/SMOKE_TESTS.md`). Each smoke produces both a PASS/FAIL line in `evidence-log.md` and an attached artefact.

| Step ID | Description | System owner | Automation status | Blocking deps | Validation command/check | Evidence artefact |
|---|---|---|---|---|---|---|
| C-01 | Web channel: `/admin/new` submission creates a labelled GitHub issue within 30 s. | site repo | semi | A-10, B1-09, B2-12 | `gh issue list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-site --label source/web --limit 1 --json createdAt --jq '.[0].createdAt'` returns a timestamp within 30 s of the test submission. | `c-01-web.json` (api-response) + `c-01-web.png` (screenshot of issue). |
| C-02 | Email channel: email to `requests+{{CLIENT_SLUG}}@{{BRAND_SLUG}}.com` creates a labelled issue within 90 s. | n8n | semi | B2-07 | `gh issue list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-site --label source/email --limit 1 --json createdAt`. | `c-02-email.json` (api-response) + n8n-execution-url. |
| C-03 | SMS channel: text to Twilio number creates a labelled issue within 60 s. | Twilio | semi | B2-06, B2-07 | `gh issue list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-site --label source/sms --limit 1 --json createdAt`. | `c-03-sms.json` (api-response) + n8n-execution-url. |
| C-04 | Triage labels the new issue with priority/, complexity/, area/, model/ within 30 min. | pipeline repo | full | B1-09 | `gh issue view <test-issue-number> --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-site --json labels --jq '[.labels[].name] \| map(test("^(priority|complexity|area|model)/"))' \| jq 'all'` returns `true`. | `c-04-triage.json` (api-response). |
| C-05 | Execute picks up an `auto-routine` issue and opens a PR with a Vercel preview within 2 h (T0/T2/T3) or 4 h (T1). | pipeline repo | full | B1-09, B1-11 | `gh pr list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-site --label auto-routine --state open --limit 1 --json url,createdAt`; preview URL on the PR returns 200. | `c-05-execute.json` (api-response) + `c-05-pr.url` (pr-url). |
| C-06 | Deploy: merging the auto-PR fires `deploy-confirmed` n8n workflow; operator receives SMS within 5 min of `deployment.succeeded`. | n8n | full | C-05, B2-06, B2-07 | n8n Executions tab shows `deploy-confirmed-{{CLIENT_SLUG}}` execution `success`; operator's phone shows the SMS; timestamps within 5 min of Vercel `deployment.succeeded`. | `c-06-deploy.json` (n8n-execution-url) + `c-06-sms.png` (screenshot). |

If any smoke fails, follow the FAIL protocol in `06 §5` (open a `priority/P0`, `area/automation`, `human-only` issue) and capture the failing artefacts under the same Step ID with a `-fail` suffix.

---

## §6 — Handover (`H-`)

Owns: the artefacts produced at engagement go-live. Source: `06 §6`.

| Step ID | Description | System owner | Automation status | Blocking deps | Validation command/check | Evidence artefact |
|---|---|---|---|---|---|---|
| H-01 | Handover guide rendered from `07-client-handover-pack.md` with `{{CLIENT_NAME}}` substitutions. | mothership | semi | C-06 | `test -f docs/clients/{{CLIENT_SLUG}}/handover.md && grep -L '{{' docs/clients/{{CLIENT_SLUG}}/handover.md` returns the file (no unresolved placeholders). | `h-01-handover.md` (cli-stdout). |
| H-02 | 5-minute walkthrough video recorded (Loom or Cleanshot). | operator-laptop | manual | H-01 | Loom dashboard shows the unlisted video URL; URL pasted into `evidence-log.md`. | `h-02-walkthrough.url` (pr-url-style link). |
| H-03 | Handover email sent to client (template + walkthrough link). | Resend | manual | H-02 | `curl -sf https://api.resend.com/emails -H "Authorization: Bearer $RESEND_API_KEY"` shows the handover email with `last_event:delivered`. | `h-03-email.json` (api-response). |
| H-04 | Admin portal URL handed to client (`https://{{DOMAIN}}/admin`). | site repo | manual | H-03 | Email body inspection — link points to `https://{{DOMAIN}}/admin`; client confirms receipt. | `h-04-portal-link.png` (screenshot of email). |
| H-05 | Client signs in to `/admin` from their phone successfully. | site repo | manual | H-04 | `/admin/sign-in` log in Auth.js (Vercel Logs) shows the client's email and `event:signin.success` within the handover-call window. | `h-05-signin.png` (screenshot of Vercel Logs). |
| H-06 | Operator confirms "never share" inventory: nothing from `docs/mothership/`, `docs/storefront/`, dashboard URL, n8n URL, Twilio admin, or vault was sent to client. | mothership | manual | H-03 | Visual inspection of the sent email; operator initials evidence-log entry. | `h-06-no-leak.md` (cli-stdout: confirmation initials + date). |

---

## §7 — First 30 days post-handover (`D30-`)

Owns: the Day 1 / 3 / 7 / 14 / 30 touchpoints in `06 §7`. Each row pairs a happy-path check with the rollback commands lifted from `14 §4`. The runbook (`06 §7`) carries the rollback prose; this matrix names the validation + evidence + the rollback row to follow if validation fails.

| Step ID | Description | System owner | Automation status | Blocking deps | Validation command/check | Evidence artefact |
|---|---|---|---|---|---|---|
| D30-01 | Day 1: confirm client signed in to `/admin` from phone. | site repo | manual | H-05 | Vercel Logs grep for `event:signin.success` from client email within 24 h of handover. **On fail:** check Resend dashboard for magic-link delivery; check `admin-allowlist.ts`; if both green, escalate to Run-A backlog issue (`14 §4`). | `d30-01-signin.png` (screenshot). |
| D30-02 | Day 3: at least one phone-edit cycle (web or SMS) recorded. | site repo | manual | D30-01 | `gh issue list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-site --label 'source/web,source/sms' --search 'created:>={{HANDOVER_DATE}}' --limit 5` returns ≥ 1. **On fail:** send the "feeling stuck?" email template; do **not** silently flag (`06 §7`). | `d30-02-edits.json` (api-response). |
| D30-03 | Day 7: deep-research seeded 3–5 improvement issues. | pipeline repo | semi | D30-02 | `gh issue list --repo {{BRAND_SLUG}}/{{CLIENT_SLUG}}-site --label 'auto-research' --search 'created:>={{HANDOVER_DATE}}' --limit 10` returns 3–5. **On fail:** close all auto-generated `auto-research` issues with `wontfix`; rerun deep-research with operator-edited prompt via `workflow_dispatch`; log in `engagement-log.md` (`14 §4`). | `d30-03-research.json` (api-response). |
| D30-04 | Day 14: first monthly check-in email sent with traffic + improvements summary. | Resend | manual | D30-03 | Resend API shows the monthly email `last_event:delivered`. **On fail (improvement run regression):** `gh pr revert <PR>` on the offending PR; redeploy via Vercel UI; open `incident/<date>-{{CLIENT_SLUG}}` issue in mothership; 14-day cool-off before next improvement run (`14 §4`). | `d30-04-monthly-email.json` (api-response). |
| D30-05 | Day 30: first monthly retainer charge succeeds (Stripe / Lemon Squeezy). | mothership | manual | D30-04 | Stripe dashboard shows `succeeded` charge for `{{CLIENT_SLUG}}` retainer SKU. **On fail (decline):** label every open issue `paused/non-payment`; follow `08-future-work §3`. | `d30-05-charge.png` (screenshot of Stripe charge). |

---

## §8 — Pattern C deltas

Pattern C (`02b-pattern-c-architecture.md`, locked 2026-04-28) is canonical, but a few of the matrix rows describe behaviour that exists today and changes once the in-flight P5.4 propagation lands. This annex names the deltas; when the propagation issue ships, the rows in §1–§7 absorb the new behaviour and this annex collapses.

| Step ID | Today's behaviour (in §1–§7) | Post-Pattern-C behaviour (when P5.4 ships) |
|---|---|---|
| A-01 | Site repo created manually via `gh repo create`. | `forge provision` step 2 creates the site repo as part of the same command that creates the pipeline repo (`02b §2 step 2`). |
| B1-01 | Pipeline repo created manually via `gh repo create`. | `forge provision` step 2b creates the pipeline repo immediately after the site repo (`02b §2 step 2b`). Status flips to `full`. |
| B1-02 | GitHub App installed on the site repo via the App's installation URL (manual click-through). | Operator runs `forge install-app --client-slug {{CLIENT_SLUG}}` once; the CLI opens the install URL pre-scoped to the site repo. Status remains `semi` (App installs require a UI click for org consent — see `14 §3` for why this can't go fully automated). |
| B1-03/B1-05 | Workflow files and scripts copied via `cp -R` from the mothership working tree. | `forge provision` step 6 pushes `workflows-template/` and `scripts/` to the pipeline repo's `main` (`02b §2 step 6`). Status flips to `full`. |
| B1-04 | `gh variable set` invoked per-var by hand. | `forge provision` step 5 sets every var in one call from `cadence.json` (`02b §2 step 5`). Status flips to `full`. |
| B2-01 to B2-03, B2-05 to B2-08, B2-12 | Each step run by hand against Vercel / Resend / Twilio / n8n APIs. | `forge provision` steps 8–10 (`05 §P5.4c`) absorb every row except `B2-04`, `B2-09`, `B2-10` (which stay `manual` per `14 §3`). Status flips from `future-CLI` to `full`. |
| H-01 | `07-client-handover-pack.md` rendered manually with `sed`-style substitution. | `forge provision` step 13 (`05 §P5.4d`) renders the handover pack as the final phase of provision. Status flips to `full`. |

When the propagation issue ships, this annex moves into the matrix proper and is deleted from here. Until then, **trust the main matrix's "today" status, not the post-Pattern-C column**.

---

## §9 — How this matrix is used

- `06 §1` Pre-flight is a literal table of `PRE-` rows; the operator cannot start Prompt A until every `PRE-` row has an entry in `evidence-log.md` whose `validation_output` matches the validation column.
- Each prompt block in `06` (A / B1 / B2 / C) carries a **Gate check (before run)**, **Evidence capture (after run)**, **Rollback path** triad that reads Step IDs from this matrix.
- `06 §6` Handover and `06 §7` First 30 days carry the same triad. The Day-by-Day rollback paths in `D30-` rows are the source of truth for `06 §7`'s "Rollback if step fails" column.
- The deferred `forge validate-evidence --client <slug>` CLI (see issue follow-up) reads this matrix row-set + the engagement evidence log and refuses to flip `cadence.json` `status` to `live` until every Step ID has a complete entry. Until that CLI lands, the operator does the check by eye against this matrix.

---

*Last updated: 2026-04-29.*
