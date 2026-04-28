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

Before any prompt runs, the operator does these by hand:

```
□ Engagement contract signed (template: docs/operator/CONTRACT_TEMPLATE.md, see 08-future-work).
□ Intake form received (filled by client; rendered into mothership/docs/clients/<slug>/intake.md).
□ Tier locked (T0 / T1 / T2 / T3) — set in mothership/docs/clients/<slug>/cadence.json.
□ Client domain owned (or operator buys it on client's behalf with credit-card + reimbursement clause).
□ Operator's Anthropic Pro/Max active; ccusage shows green.
□ Operator's GitHub org has free secret-scope slots (check at most ~25 selected repos per secret).
□ Operator's n8n on Railway healthy; last execution < 24 h.
□ Operator's Resend domain verified; DKIM green.
□ Operator's Vercel team has a free project slot.
```

If anything's red, fix before running Prompt A.

---

## 2. Prompt A — Client site scaffold

**Where to run:** in a fresh checkout of the (just-created) client repo on the operator's machine, on `main`. Use Claude Opus.

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

---

## 3. Prompt B1 — Pipeline repo provisioning

**Where to run:** the freshly-created pipeline repo (`{{BRAND_SLUG}}/{{CLIENT_SLUG}}-pipeline`), on `main`. This is a different GitHub repository from the site repo. The agent must not edit the site repo from this run except to confirm the cross-repo smoke test passes.

**Pre-step (operator manual):** confirm the GitHub App `{{BRAND_SLUG}}-pipeline-bot` is installed on `{{BRAND_SLUG}}/{{CLIENT_SLUG}}-site` before this prompt fires. Without the install, the workflows cannot mint installation tokens and the cron silently no-ops.

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

---

## 4. Prompt B2 — n8n + Vercel + Twilio integration

**Where to run:** operator's machine, in the **mothership** repo's `cli/` directory. (Pre-`forge provision`-CLI flow: do this manually following the steps below.)

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

---

## 5. Prompt C — Smoke-test sweep

**Where to run:** any clean shell with `gh`, `curl`, and an active client-side login.

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

---

## 6. The handover

| Item | Source | Where to send |
|---|---|---|
| Handover guide | `07-client-handover-pack.md` rendered with `{{CLIENT_NAME}}` substitutions | Email + 1 printed copy at handover call |
| 5-min walkthrough video | Loom or Cleanshot, recorded once per engagement | Embed link in the handover email |
| Admin portal URL | `https://{{DOMAIN}}/admin` | In the email |
| Their GitHub login | The email they used at intake | (They sign in to GitHub themselves; you don't share credentials) |
| Their Vercel login | They create their own account at handover; until then, the operator's team owns the project | Walkthrough call only |

**Never sent to client:** anything from `docs/mothership/`, `docs/freelance/`, the dashboard URL, the n8n URL, the Twilio admin, or the operator's vault.

---

## 7. The first 30 days post-handover

Light-touch. The autopilot does the work; the operator monitors.

| Day | Activity |
|---|---|
| Day 1 | Confirm client signed in to /admin from their phone successfully. |
| Day 3 | Check that at least one phone-edit cycle (web or SMS) happened. If zero edits, send a "feeling stuck? happy to walk through it" email. |
| Day 7 | Run a manual `deep-research.yml` to seed 3-5 improvement issues; explain in /admin that "I queued 5 improvements for the next month." |
| Day 14 | First monthly check-in email with traffic + improvements made. |
| Day 30 | Auto-charge first monthly retainer via Stripe / Lemon Squeezy. If declined → label every open issue `paused/non-payment`, follow `08-future-work §3`. |

---

## 8. Per-engagement file checklist (for your own records)

In the mothership repo, `docs/clients/{{CLIENT_SLUG}}/` should contain:

- [ ] `intake.md` — completed intake form
- [ ] `contract.md.age` — encrypted signed contract PDF + clauses summary
- [ ] `cadence.json` — tier + cron + concurrency cap
- [ ] `env.json.age` — encrypted env-var bundle for Vercel
- [ ] `secrets.md.age` — list of which org secrets / n8n creds / OAuth apps are scoped to this client
- [ ] `runbook.md` — anything client-specific (preferred contact, weekly call cadence, do-not-do list)
- [ ] `engagement-log.md` — start/end dates, tier changes, incidents, milestones

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
