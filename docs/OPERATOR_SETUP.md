---
title: Admin Portal — Operator Setup Runbook
related-issues: 90, 91, 92, 93, 94, 95
status: active
---

# Admin Portal — Operator Setup Runbook

The absolute minimum the operator (you) has to configure for the admin
portal flow built across issues #90–#95 to work end-to-end. Anything
outside this list is optional polish.

> **Time budget**: 90 minutes from a clean account. Fields marked
> **`[ONCE]`** are shared across every client. Fields marked
> **`[PER-CLIENT]`** are per Vercel project / per client repo and have
> to be redone for each new customer.

There are two passes. Pass 1 wires up the **mothership** (this repo).
Pass 2 wires up a **new client**.

---

## Pass 1 — Mothership (this repo, one time)

### 1.1 Generate the shared secrets `[ONCE]`

```bash
# JWT signing key for Auth.js v5
openssl rand -base64 32   # → AUTH_SECRET

# Shared HMAC for every Next.js ↔ n8n call
openssl rand -hex 32      # → N8N_HMAC_SECRET
```

Store both in a password manager. They go into Vercel **and** n8n.

### 1.2 Create the Auth.js providers `[ONCE]`

| Provider | Where | What you create | Env vars |
|----------|-------|-----------------|----------|
| Resend   | https://resend.com → API keys | A key scoped to the `lumivara.ca` domain. Verify the domain (DKIM + SPF). | `AUTH_RESEND_KEY` |
| Google   | https://console.cloud.google.com → APIs & Services → Credentials → Create OAuth 2.0 client | Authorised redirect: `https://lumivara.ca/api/auth/callback/google` | `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` |
| Microsoft Entra | https://entra.microsoft.com → App registrations → New registration | Redirect: `https://lumivara.ca/api/auth/callback/microsoft-entra-id` | `AUTH_MICROSOFT_ENTRA_ID_ID`, `_SECRET`, `_ISSUER` |

### 1.2b Provision the verification-token store `[ONCE]`

Auth.js v5's Resend (magic-link) provider needs somewhere to store the
verification token between when it's sent and when the user clicks the
link in the email. **Without this, magic-link sign-in fails silently:
the email arrives, but clicking the link redirects back to
`/api/auth/signin/resend` instead of `/admin`.**

The cheapest path is **Vercel KV** (Upstash-backed, free tier):

1. Vercel dashboard → your project → **Storage** → **Create Database**
   → KV → name it `lumivara-auth` (or anything) → **Create**.
2. Connect it to this project (Vercel does this automatically when you
   create from inside the project's Storage tab). Vercel injects:
   - `UPSTASH_REDIS_REST_URL`
   - `UPSTASH_REDIS_REST_TOKEN`
   - plus `KV_*` aliases (we use the Upstash names).
3. **Redeploy** — env vars only apply on a fresh build.
4. Verify on `/admin/sign-in`: the Resend form is visible (when
   missing, the page shows a "Magic-link sign-in is offline" notice
   and falls back to OAuth).

> **Skip-this-step alternative**: leave these vars unset and use only
> Google + Microsoft OAuth for now. The page handles this gracefully —
> add Vercel KV when you're ready to enable magic links.

### 1.3 Create the GitHub PAT `[ONCE]`

GitHub → Settings → Developer settings → **Fine-grained personal access
tokens** → Generate new token.

- **Resource owner**: your account.
- **Repository access**: only `palimkarakshay/lumivara-site`.
- **Permissions** (Repository):
  - **Issues**: Read and write
  - **Pull requests**: Read
  - **Actions**: Read
  - **Variables**: Read and write
  - **Metadata**: Read

Copy it once → set as `GITHUB_TOKEN` in Vercel and n8n.

### 1.4 Stand up n8n `[ONCE]`

The cheapest path is **Railway** (`https://railway.app`) running the
official `n8n/n8n` Docker image with persistent volume + custom domain.
30 min, ~$5/month.

In n8n:

1. Top-right ⚙ → **Variables** → add:
   - `N8N_HMAC_SECRET` (from 1.1)
   - `GITHUB_REPO` = `palimkarakshay/lumivara-site`
   - `LUMIVARA_DOMAIN` = `lumivara.ca`
   - `INTAKE_DEFAULT_CLIENT` = `lumivara`
   - `INTAKE_ALLOW_DOMAINS` = `lumivara.ca,palimkar.ca` (your safe senders)
   - `INTAKE_ALLOW_PHONES` = `+1XXXXXXXXXX` (your safe testers)
   - `TWILIO_FROM_NUMBER` = your purchased Twilio number
2. **Credentials** → add four:
   - GitHub (PAT from 1.3)
   - Twilio (Account SID + Auth Token)
   - IMAP (`requests@lumivara.ca` mailbox; Gmail app password recommended)
   - Anthropic (API key)
3. **Import** each of the six workflows from
   `docs/n8n-workflows/admin-portal/*.json`. Pin the credential on the
   red GitHub / Twilio / IMAP / Resend / Anthropic nodes.
4. **Activate** all six. Note the webhook URLs for these three workflows
   — they go into Vercel:
   - `intake-web` → `N8N_INTAKE_WEBHOOK_URL`
   - `client-input-record` → `N8N_DECISION_WEBHOOK_URL`
   - `deploy-confirmed` (the **first** webhook node) → `N8N_DEPLOY_WEBHOOK_URL`

### 1.5 Wire Twilio inbound `[ONCE]`

Twilio Console → Phone Numbers → your number → **A message comes in**
→ Webhook → POST → paste the n8n webhook URL of `intake-sms`.

### 1.6 Wire GitHub label-added webhook `[ONCE]`

GitHub repo → Settings → Webhooks → Add webhook.

- Payload URL: the n8n webhook URL of `client-input-notify`.
- Content type: `application/json`.
- Events: only the **Issues** event (we filter to `labeled` inside n8n).

### 1.7 Wire Vercel deployment events `[PER-CLIENT, but mothership too]`

Vercel project → Settings → Webhooks → Create.

- URL: the **second** webhook node URL of `deploy-confirmed` (`/vercel-deploy-events`).
- Events: `deployment.succeeded` + `deployment.error`.

### 1.8 Set every Vercel env `[ONCE]`

Vercel → Lumivara project → Settings → Environment Variables. Add each
of the rows in the table below to **Production** and **Preview**:

| Var | Value | Source |
|-----|-------|--------|
| `AUTH_SECRET` | …32-byte random | 1.1 |
| `AUTH_RESEND_KEY` | …Resend API key | 1.2 |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | …Google OAuth client | 1.2 |
| `AUTH_MICROSOFT_ENTRA_ID_ID` / `_SECRET` / `_ISSUER` | …Microsoft app | 1.2 |
| `ADMIN_ALLOWLIST_EMAILS` | `hello@lumivara.ca` (comma-separated for more) | code default already includes this |
| `UPSTASH_REDIS_REST_URL` | …Upstash REST URL | 1.2b (Vercel KV auto-injects) |
| `UPSTASH_REDIS_REST_TOKEN` | …Upstash REST token | 1.2b (Vercel KV auto-injects) |
| `GITHUB_REPO` | `palimkarakshay/lumivara-site` | 1.3 |
| `GITHUB_TOKEN` | …PAT | 1.3 |
| `N8N_HMAC_SECRET` | …32-byte hex | 1.1 |
| `N8N_INTAKE_WEBHOOK_URL` | …n8n url | 1.4 |
| `N8N_DECISION_WEBHOOK_URL` | …n8n url | 1.4 |
| `N8N_DEPLOY_WEBHOOK_URL` | …n8n url | 1.4 |
| `VERCEL_API_TOKEN` | …read-only token scoped to project | Vercel → Account → Tokens |
| `VERCEL_PROJECT_ID` | …`prj_…` | Vercel project → Settings |
| `VERCEL_DEPLOY_HOOK_LUMIVARA` | …deploy hook URL | Vercel project → Settings → Deploy Hooks |
| `NEXT_PUBLIC_LUMIVARA_TIER` | `scale` | code; sets the per-build tier |

Redeploy.

### 1.9 Smoke tests (under 5 min total)

- [ ] Phase 1 — sign in with `hello@lumivara.ca` via magic link → land on `/admin`.
- [ ] Phase 2 — open `/admin/client/lumivara/new`, submit “Test idea” → GitHub issue appears with `client/lumivara` + `status/triage` + `source/web`. Email arrives with magic link back to the request.
- [ ] Phase 3 — change a label on that issue to `status/in-progress` → wait 30 s → dashboard pill flips to “Building this”.
- [ ] Phase 4 — add `needs-client-input` label + comment `[ASK] Test? Options: A) yes B) no`. Within 60 s an SMS or email arrives. Tap link → tap A → comment "Client chose: A) yes" appears, label is removed.
- [ ] Phase 5 — open a PR for a test issue with `Closes #N`, wait for Vercel preview, set status to `status/awaiting-review`. Tap “Confirm Deploy” on phone → status flips to “Deploying now…” within 5 s. After Vercel succeeds → green “Live” badge + GitHub issue closed.

---

## Pass 2 — Onboard a new client `[PER-CLIENT, ~30 min]`

1. Add the client to `src/lib/admin/clients.ts`:

   ```ts
   {
     slug: "<slug>",
     name: "<display name>",
     domain: "<their.tld>",
     tier: "starter" | "growth" | "scale",
     contactEmails: ["client@theirs.tld"],
   }
   ```

2. Append the same email to `ADMIN_ALLOWLIST_EMAILS` in Vercel (and to
   `src/lib/admin-allowlist.ts` if you want it persisted in code).
3. Create a Vercel **Deploy Hook** in their project →
   `VERCEL_DEPLOY_HOOK_<UPPER_SLUG>` env var (the deploy webhook in n8n
   reads `VERCEL_DEPLOY_HOOK_<UPPERCASE>` per `clientSlug`).
4. Twilio: buy a number for them (Growth+) → point its inbound webhook
   at the `intake-sms` workflow URL → set their phone in
   `INTAKE_ALLOW_PHONES`.
5. IMAP: alias `requests@<their.tld>` to a Gmail mailbox accessible by
   the existing IMAP credential, or set up a per-client credential.
6. Smoke-test the same five phases against `<their.tld>/admin`.

---

## Tier matrix (enforced in `src/lib/admin/tiers.ts`)

| Feature                                   | Starter $49 | Growth $149 | Scale $449 |
|-------------------------------------------|:-----------:|:-----------:|:----------:|
| Web intake                                | ✅          | ✅          | ✅         |
| Email intake                              | —           | ✅          | ✅         |
| SMS intake                                | —           | ✅          | ✅         |
| Preview links                             | ✅          | ✅          | ✅         |
| **Client-side Confirm Deploy**            | —           | ✅          | ✅         |
| Plain-English thinking summary on cards   | —           | —           | ✅         |
| Idea quota / month                        | 5           | 25          | unlimited  |

**Lumivara People Solutions** runs on **Scale** — the registry default
in `src/lib/admin/clients.ts`.

---

## Copy-pasteable Opus prompts

These are the prompts the operator can drop into Claude Opus 4.7 (the
quality-first default) when they need to tweak or extend the system
without spelunking the codebase. Each prompt assumes the user has
checked out this branch in their working repo.

### A. Add a new tier or change tier features

> ```
> You are the lead architect of the Lumivara admin portal. The codebase
> is a Next.js 16 App Router app with the admin under `src/app/admin/`
> and shared lib under `src/lib/admin/`. Tiers are defined in
> `src/lib/admin/tiers.ts` as a record keyed by TierId, each carrying a
> features object that gates UI and server actions.
>
> Goal: <DESCRIBE THE NEW FEATURE OR TIER, e.g. "add an enterprise tier
> at $999/mo with SSO + audit-log export, and let it bypass the
> monthly idea quota">.
>
> Constraints:
> - Keep the existing tier ladder monotonic on price.
> - Wire any new feature flag through the existing render-time guards
>   (`tier.features.<flag>`). Do not introduce a runtime "if env" path.
> - Update `OPERATOR_SETUP.md`'s tier matrix.
> - Add a vitest case in `src/__tests__/admin-tiers.test.ts` that
>   asserts the new feature flag exists on the right tiers.
> - All new copy strings live in upsellCopy or the upgrade hint
>   prop on the gated component — do not add free-floating strings.
>
> Return: a small commit per logical change (lib edit + UI edit +
> doc edit + test edit, in that order). Confirm `npm run type-check`
> and `npm run test:unit` are green.
> ```

### B. Add a new n8n workflow

> ```
> You are extending the Lumivara admin portal n8n bundle under
> `docs/n8n-workflows/admin-portal/`. Each workflow is a JSON file
> with `nodes`, `connections`, `settings.executionOrder`, `active`,
> and `tags`.
>
> Goal: <DESCRIBE THE NEW WORKFLOW, e.g. "weekly digest: every Monday
> 09:00 ET, gather the past week's status/done issues per client and
> email a summary">.
>
> Constraints:
> - Trigger node first; respond-to-webhook last when the workflow is
>   webhook-driven.
> - Use the shared variables: `N8N_HMAC_SECRET` for webhooks,
>   `GITHUB_REPO`, `LUMIVARA_DOMAIN`, `TWILIO_FROM_NUMBER`. Do not
>   hardcode secrets.
> - HMAC verification must mirror the existing intake-web template
>   (require both `t=` and `v1=`, ±5 min skew, constant-time compare).
> - Update `docs/n8n-workflows/admin-portal/README.md` with the
>   purpose row and the var the webhook URL maps to.
> - Update `docs/OPERATOR_SETUP.md` with the new env var (if any)
>   and a smoke-test bullet.
>
> Return: the new JSON file + the README + OPERATOR_SETUP edits, in
> small commits. Validate with `node -e "JSON.parse(require('fs').
> readFileSync('<path>','utf8'))"` before committing.
> ```

### C. Add a new label translation

> ```
> The status map at `src/lib/admin/status-map.ts` maps GitHub labels
> to a typed StatusDescriptor `{label, copy, tone, internal?}`.
> ENTRIES order is significant — earliest match wins, which the
> existing tests in `src/__tests__/admin-status-map.test.ts` enforce.
>
> Goal: add label <LABEL_NAME> mapping to <PLAIN-ENGLISH LABEL> with
> tone <TONE>. internal=<true|false>.
>
> Constraints:
> - tone must be one of: info, progress, review, live, blocked, neutral.
> - If internal is true, the client subset view will hide it (per the
>   filter in `src/app/admin/client/[slug]/page.tsx`).
> - Add a vitest case asserting the new mapping resolves correctly.
> - Do not alter the order of existing entries.
>
> Return: a single commit touching status-map + the test file.
> ```

### D. Onboard a new client end-to-end

> ```
> Walk me through onboarding <CLIENT NAME> at <DOMAIN> on the
> <starter|growth|scale> tier. Use `docs/OPERATOR_SETUP.md` Pass 2 as
> the spine. Edit `src/lib/admin/clients.ts` to register the client
> with their contact email, then list every external action I have to
> perform (Vercel, Twilio, IMAP), in execution order, with one
> sentence each. End with a 5-bullet smoke-test plan I can run on my
> phone.
>
> Constraints:
> - Don't suggest changes to the operator allow-list unless I'm
>   specifically adding a new operator (not a client).
> - For Growth+ clients, ensure the SMS + email intake credentials
>   are scoped to their channel — do not reuse the Lumivara channels.
> - Confirm `npm run type-check` and `npm run test:unit` after the
>   registry edit; commit and push.
> ```

### E. Replace the AI structurer in the intake workflow

> ```
> The intake-web/email/sms n8n workflows currently route the raw
> client text to a Claude Opus 4.7 node that emits structured
> `{title, body, suggestedLabels[]}`. The system prompt lives in
> `intake-web.json` and the email/sms variants.
>
> Goal: switch the structurer to <NEW MODEL e.g. Gemini 2.5 Pro> and
> tighten the system prompt to <NEW REQUIREMENT, e.g. "always
> suggest exactly one priority label and at most three area labels">.
>
> Constraints:
> - Do not change the input/output shape — downstream nodes assume
>   the same JSON keys.
> - Update all three intake JSONs symmetrically.
> - Add a smoke-test bullet to `OPERATOR_SETUP.md` step 1.9 that
>   verifies the new prompt enforces the constraint on a sample input.
>
> Return: the three JSON edits in a single commit, README untouched.
> ```

---

## When something breaks

| Symptom                                          | First place to check                                         |
|--------------------------------------------------|--------------------------------------------------------------|
| Magic-link email never arrives                   | Resend dashboard → check the API key + DKIM is verified.     |
| Magic link arrives but clicking it returns to `/api/auth/signin/resend` | Vercel KV not connected — the verification token has nowhere to live. See step 1.2b. |
| `/admin` redirects in a loop                     | Vercel env: `AUTH_SECRET` set on **both** Production and Preview. |
| Submit form errors “Intake is offline”           | `N8N_INTAKE_WEBHOOK_URL` + `N8N_HMAC_SECRET` not set, or n8n workflow inactive. |
| Decision banner submits but label doesn't drop   | `client-input-record` workflow inactive, or PAT missing **Issues: write**. |
| Confirm Deploy returns "Already deploying"       | Expected if you tap twice within 60 s. Otherwise check `reserveDeploy` TTL — it's per-server-instance. |
| Live badge never appears                         | Vercel webhook not pointing at the second URL of `deploy-confirmed`, or events filter excluding `deployment.succeeded`. |
| Tests panel shows “no run” for everything        | `GITHUB_TOKEN` lacks **Actions: read** scope.                |
| Operator can see clients but not edit Brain      | PAT lacks **Variables: read+write** scope.                   |
