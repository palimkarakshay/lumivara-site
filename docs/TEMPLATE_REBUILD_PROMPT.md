<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SOURCE OF TRUTH

  This document is the master rebuild prompt for the Lumivara-style
  auto-piloted small-business website + admin portal. It is licensed for use
  by the operator named in `docs/operator/OPERATOR_RUNBOOK.md` and is **not
  for redistribution or display to clients**.

  Each operator-led deployment of this system to a client engagement
  counts as one license. The *site* the operator builds for a client is
  owned by that client. The *system* (this prompt, the workflows, the
  scripts, the budget charter, the multi-AI routing, the n8n templates,
  and the operator runbook) remains the operator's licensed property and
  must never be handed to a client verbatim.

  Drafting / updating this file: do it on a branch like
  `claude/harden-template-prompt-*` and PR into main with the
  `needs-vercel-mirror=false` (docs only). NEVER paste any portion of this
  file into a public chat, gist, or client-shared workspace.
================================================================================
-->

# Template-Rebuild Prompt — Hardened v2 (April 2026)

This document spins up a brand-new client project from scratch using two
phased prompts and an operator-side manual checklist. The end state is a
production small-business website that the client edits from their phone
through a secure admin portal — and an automation pipeline behind it that
only the operator controls.

> **What changed from v1?** v1 leaked the entire automation pipeline into
> the client tree and exposed a GitHub PAT on the client's phone. v2
> separates trust zones, gates the operator-only pieces, replaces the
> phone-PAT capture with the n8n + admin-portal capture mechanism
> specified in `docs/ADMIN_PORTAL_PLAN.md` (issues #90 – #95), and adds an
> operator runbook covering everything Claude can't do from inside a repo.

---

## 0. How to read this file

This document has **four** sections. Read them in order, and run the
prompts in the order Section 1 lays out.

| Section | Audience | Purpose |
|---|---|---|
| **1. Architecture & trust zones** | Operator | What we're building, what stays operator-side, what ships to the client. |
| **2. Operator setup checklist** | Operator | The manual steps Claude can't do — token minting, n8n workflows, Vercel projects, Twilio number, Resend domain, Auth.js providers. Do these around the prompt run. |
| **3. Prompt A — Client site scaffold** | Paste into Claude Opus | The portion of the system the client receives: marketing site, design system, content, SEO, tests, and the **admin-portal client-side surface** (`/admin` UI + Server Actions + middleware). |
| **4. Prompt B — Operator pipeline overlay** | Paste into Claude Opus, *separately*, on operator's own branch | The operator-only autopilot: GitHub Actions, triage/execute prompts, multi-AI fallback, budget charter, n8n workflow templates, graceful-exit script. **Never committed to main on the client's repo.** |

Cross-references:

- `docs/operator/OPERATOR_RUNBOOK.md` — operator's master playbook.
- `docs/operator/MOBILE_CAPTURE_ARCHITECTURE.md` — full architecture of
  the n8n + Auth.js v5 + admin portal capture pipeline.
- `docs/operator/SMOKE_TESTS.md` — end-to-end smoke tests after deploy.
- `docs/operator/RISK_REGISTER.md` — what can go wrong + mitigations.
- `docs/client/INTAKE_FORM.md` — the only doc the client fills in.
- `docs/client/HANDOVER_GUIDE.md` — the only doc the client receives.
- `docs/freelance/05-template-hardening-notes.md` — running list of
  hardening items, with the v2 work marked done.

---

## 1. Architecture & trust zones

### 1.1 The three trust zones

```
   ┌──────────────────────────┐  ┌──────────────────────────┐  ┌──────────────────────────┐
   │  CLIENT TRUST ZONE       │  │  OPERATOR TRUST ZONE     │  │  SHARED INFRA            │
   │  (lives in client repo)  │  │  (operator's own repo /  │  │  (third-party services)  │
   │                          │  │   GitHub org / n8n)      │  │                          │
   │  • Next.js marketing site│  │  • triage.yml            │  │  • Vercel project        │
   │  • /admin UI shell       │  │  • execute.yml           │  │  • Resend domain         │
   │  • /admin Server Actions │  │  • execute-complex.yml   │  │  • Twilio number(s)      │
   │  • middleware.ts         │  │  • execute-single.yml    │  │  • n8n on Railway        │
   │  • admin-allowlist.ts    │  │  • auto-merge.yml        │  │  • Google / Entra OAuth  │
   │  • admin-status-map.ts   │  │  • project-sync.yml      │  │  • GitHub repo           │
   │  • lib/github.ts (read)  │  │  • ai-smoke-test.yml     │  │                          │
   │  • lib/webhooks.ts       │  │  • scripts/triage-*.md   │  │  Operator owns billing   │
   │  • Auth.js v5 config     │  │  • scripts/execute-*.md  │  │  on every line.          │
   │                          │  │  • scripts/gemini-*.py   │  │                          │
   │  Client sees + owns      │  │  • bootstrap-kanban.sh   │  └──────────────────────────┘
   │  this code on day 1.     │  │  • this prompt           │
   │                          │  │  • OPERATOR_RUNBOOK.md   │
   │  Watermarked footer      │  │  • RISK_REGISTER.md      │
   │  on Tier 1 / 2.          │  │  • n8n workflow JSONs    │
   └──────────────────────────┘  └──────────────────────────┘
            │                              │
            └────────  HMAC webhook ───────┘
              (X-{{BRAND}}-Signature header,
               5-min skew window,
               shared N8N_HMAC_SECRET in
               operator-managed Vercel env)
```

**Trust-zone rules — non-negotiable:**

| Rule | Why |
|---|---|
| The client's `main` branch never contains `.github/workflows/`, `scripts/triage-*`, `scripts/execute-*`, `scripts/gemini-*`, `scripts/bootstrap-kanban.sh`, or any file inside `docs/operator/` or `docs/freelance/`. | These are the moat. If a curious client clones their repo, they should see a clean Next.js site with an `/admin` portal — not the autopilot. |
| The autopilot workflows live on a separate **operator-managed branch** of the client repo (e.g. `operator/main`), pushed by the operator's vendor account, never merged into the client's `main`. The cron schedules run from `operator/main` via `workflow_dispatch.ref`. | Removes a trivial "diff main → see all the workflows" attack. |
| The `CLAUDE_CODE_OAUTH_TOKEN` and all AI provider keys live as **organisation-level secrets** under the operator's GitHub org. The client repo is added as a member of the org. The token is never created by, owned by, or visible to the client. | If the engagement ends, the operator removes the repo from the org and the autopilot stops. The client keeps the site. |
| A separate **vendor PAT** (operator-owned) is used by n8n to write GitHub issues / comments / labels. The client never holds a GitHub PAT on any device. | Eliminates the v1 phone-PAT exposure. The client's only credentials are their email magic link and OAuth identity. |
| Twilio, IMAP/Gmail, Anthropic/Gemini/OpenAI keys live **only in n8n credentials** on the operator-controlled Railway instance. They never appear in any Vercel env or any client-readable file. | Same reason — the AI pipeline is operator infrastructure, not client infrastructure. |
| Every n8n ↔ Next.js webhook is signed with `HMAC-SHA256` over `${unixTimestamp}.${rawBody}` using `N8N_HMAC_SECRET`, with a ≤5-minute skew check. The client's repo holds the *secret* (because Vercel env), but **not** the n8n credentials it pairs with. | Prevents replay; the secret alone is useless without the n8n side. |
| The **mobile capture mechanism** is the `/admin` portal (Auth.js v5 magic-link / Google / Entra) plus the email + SMS fallbacks routed through n8n. **No client device ever talks to the GitHub API directly.** | This is the single biggest hardening change vs. v1 (`PHONE_SETUP.md`). |
| The footer contains an opt-in attribution `Built on the {{BRAND}} framework` link to the operator's services page. Removable on Tier 3+ only. | Per `docs/freelance/05-template-hardening-notes.md` § "per-client repo" #3. Passive marketing surface on every site. |

### 1.2 What the *client* sees, end-to-end

1. They receive the **client intake form** (`docs/client/INTAKE_FORM.md`),
   fill in 10 questions, and approve a moodboard.
2. They get an email when the site is live, plus a 5-minute walkthrough
   video (operator records it once per engagement).
3. They sign in to `https://<their-domain>/admin` with one of:
   magic-link email (Resend), Google, or Microsoft Entra.
4. They submit ideas through one of three channels — the `/admin/new` web
   form, an email to `requests@<their-domain>`, or a text to a per-client
   Twilio number — and get a magic-link reply pointing back to `/admin`.
5. They watch each request move through plain-English statuses
   (*Reviewing your request → Building this → Ready for your test → Live*).
6. When asked a question (label `needs-client-input`), they tap a magic
   link, see A/B buttons or a textarea on the issue, and answer.
7. When a preview build is ready, they tap **View test build** and then
   **Confirm Deploy** to push to production. Final confirmation arrives
   by SMS or email.
8. They can cancel at any time. They keep the site, the domain, the
   hosting account, and the static codebase. The autopilot stops.

That is the *entire* surface area the client touches. They never see
GitHub, never run a script, never edit a workflow file, and never hold a
GitHub or AI provider token.

### 1.3 What the *operator* does, end-to-end

Summarised here; the full procedure is in `docs/operator/OPERATOR_RUNBOOK.md`.

1. Sign the engagement contract (template in operator's private vault — not in this repo).
2. Receive the client intake form by email.
3. Run **Prompt A** locally against an empty repo to scaffold the client site (Phases 0–5 of the working approach).
4. Manually do the **operator setup checklist** in Section 2: GitHub repo, GitHub org membership, Vercel project, Resend domain, Twilio number, n8n workflow imports, Auth.js OAuth clients, secret upload.
5. Run **Prompt B** on the operator's own branch to overlay the autopilot pipeline (workflows + scripts + budget charter).
6. Bootstrap labels via `scripts/bootstrap-kanban.sh` (operator's machine; the script does **not** ship in the client tree).
7. Smoke-test all six smoke tests in `docs/operator/SMOKE_TESTS.md`.
8. Hand the client `docs/client/HANDOVER_GUIDE.md` and the walkthrough video. Nothing else.
9. Monitor monthly: ccusage, Action minutes, Twilio balance, Resend deliverability, n8n workflow health.
10. On termination: run the graceful-exit playbook in the runbook (remove org membership, revoke vendor PAT, archive n8n workflows, rotate secrets, deliver vanilla repo).

---

## 2. Operator setup checklist (the parts Claude can't do)

Do these in roughly this order. Steps 1–6 are **per-engagement**; steps
A1–A4 are **once-only** for the operator's whole practice and reused
across every client.

> The runbook in `docs/operator/OPERATOR_RUNBOOK.md` carries the same
> steps with screenshots, troubleshooting, and the security rationale.
> This section is the dense checklist; the runbook is the manual.

### A. One-time operator practice setup (do this once, before client #1)

#### A1. Operator GitHub organisation

```bash
# Pick a brand handle for the practice — this is the operator-only org.
# Example: vibe-coded-co
#
# 1. Create the org on github.com (Free plan is fine until 30 clients).
# 2. Add yourself as Owner.
# 3. Settings → Member privileges → "Base permissions" = No permission.
#    (We want explicit grants per repo only.)
# 4. Settings → Actions → "Allow all actions and reusable workflows" = on.
# 5. Settings → Secrets and variables → Actions → New organization secret
#    for each of:
#      CLAUDE_CODE_OAUTH_TOKEN   (from `claude setup-token`)
#      GEMINI_API_KEY            (https://aistudio.google.com/apikey)
#      OPENAI_API_KEY            (optional — code-review fallback only)
#      VENDOR_GITHUB_PAT         (operator's bot account PAT, see A2)
#    For each: Repository access = "Selected repositories", and add each
#    new client repo here as you onboard them.
```

The OAuth token bills against the operator's single Claude Pro/Max
subscription regardless of how many client repos use it — this is the
shared-quota model the budget charter is built around.

#### A2. Operator vendor GitHub bot account

Create a separate GitHub user named `<brand>-bot` (e.g. `vibe-coded-bot`).
This account:

- Is added to every client repo with **Write** access only.
- Holds the **vendor PAT** that n8n uses for issue / comment / label writes.
- Is **never** added to the client's GitHub organisation, even if the
  client has one — only to the client's repo, individually.
- PAT scope: fine-grained, all client repos, `Issues: RW`, `Pull requests: R`,
  `Contents: R`, `Metadata: R`, 90-day expiry, calendar a rotation.

The bot's commit identity is the one that appears on every auto-generated
PR. Use a recognisable name (e.g. `Vibe-Coded Bot <bot@vibe-coded.com>`)
so the operator can spot bot PRs at a glance in any client repo.

#### A3. Operator n8n on Railway

Follow `docs/N8N_SETUP.md` once for the whole practice. One n8n
instance hosts the workflows for *all* clients — separation is per-workflow
inside n8n, not per-instance.

```
Per-client suffixing convention for n8n:
  intake-web-{{CLIENT_SLUG}}        ← unique webhook URL per client
  intake-email-{{CLIENT_SLUG}}      ← per-client IMAP folder filter
  intake-sms-{{CLIENT_SLUG}}        ← per-client Twilio inbound number
  client-input-notify-{{CLIENT_SLUG}}
  client-input-record-{{CLIENT_SLUG}}
  deploy-confirmed-{{CLIENT_SLUG}}
```

The webhook URLs become the values of `N8N_INTAKE_WEBHOOK_URL`,
`N8N_DECISION_WEBHOOK_URL`, and `N8N_DEPLOY_WEBHOOK_URL` for that
client's Vercel project.

#### A4. Operator OAuth + email sender setup

Once-only for the whole practice:

| Service | What you create | Why |
|---|---|---|
| **Resend** | One sending domain — `mail.<your-brand>.com` — DKIM + SPF + DMARC verified. **One Resend API key** stored in operator vault. Reused as `AUTH_RESEND_KEY` for every client. | Magic-link emails on `/admin` sign-in for every client come from the operator's domain. Clients never set up Resend themselves. |
| **Google Cloud Console** | One OAuth client per client (because the redirect URI is per-domain). Or: one OAuth app with multiple authorised redirect URIs. Either works; the per-client app is cleaner for revocation. | `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` for that client. |
| **Microsoft Entra ID** | One App Registration per client (same reason). | `AUTH_MICROSOFT_ENTRA_ID_*`. |
| **Twilio** | Operator account (single). Buy a per-client number ($1.15 / mo) with SMS enabled. Wire its inbound webhook at the n8n `intake-sms-{{CLIENT_SLUG}}` URL. | Per-client SMS lane; routing by inbound number inside n8n. |
| **IMAP forwarder** | Set up `requests@<client-domain>` as a forwarder or alias (or use Gmail "+" addressing into a single operator inbox; n8n IMAP filters by recipient). | The email channel of the three intake mechanisms. |
| **Anthropic API console** | (Optional, only if n8n's AI structuring node is Anthropic.) One operator-account Anthropic key. Stored in n8n credentials. | Used by n8n to structure raw client text into title + acceptance criteria. Not the same key as `CLAUDE_CODE_OAUTH_TOKEN`. |

### B. Per-engagement setup (do this for every new client)

#### B1. Create the empty client repo

```bash
# Pick the repo slug. Example: acme-site
gh repo create palimkarakshay/{{GH_REPO}} --private \
  --description "{{ONE_LINE_DESCRIPTION}}"
git clone https://github.com/palimkarakshay/{{GH_REPO}}.git
cd {{GH_REPO}}
```

> **Important:** the repo lives under the **operator's** personal account
> (`palimkarakshay`), not the client's. The client gets a *transfer
> receipt* in the contract: at end of engagement, the operator either
> transfers the repo to the client's account or hands them a clean
> archive. Until then, the operator is the sole owner. This is how the
> autopilot org-secrets stay attached.

Add the repo to the operator's GitHub org as a member with the right
secret scope:

```bash
# Visit operator org Settings → Secrets → CLAUDE_CODE_OAUTH_TOKEN →
# Repository access → "Selected repositories" → add palimkarakshay/{{GH_REPO}}.
# Repeat for GEMINI_API_KEY, OPENAI_API_KEY, VENDOR_GITHUB_PAT.
```

#### B2. Wire Vercel

1. https://vercel.com/new → Import the GitHub repo.
2. Framework preset: **Next.js**.
3. Production branch: `main`. Preview branches: all PRs.
4. Settings → Git → enable **Comment on Pull Requests** so the preview URL
   shows up on every auto-PR.
5. Settings → Deploy Hooks → create one named `{{CLIENT_SLUG}}-confirm-deploy`
   → copy the URL. This becomes `VERCEL_DEPLOY_HOOK_{{CLIENT_SLUG_UPPER}}`.
6. Settings → Webhooks → add a webhook for events
   `deployment.succeeded`, `deployment.error` pointing at the n8n
   `deploy-confirmed-{{CLIENT_SLUG}}` workflow URL.
7. Copy the production URL into `src/lib/site-config.ts` (`siteUrl`) and
   into `NEXT_PUBLIC_SITE_URL` in Vercel's env-var UI for **Production +
   Preview** environments.

#### B3. Vercel environment variables (the full list)

Set every one of these in Vercel → Settings → Environment Variables for
both **Production** and **Preview**.

| Variable | Source | Notes |
|---|---|---|
| `AUTH_SECRET` | `openssl rand -base64 32` | Per-client. Auth.js JWT signing key. |
| `AUTH_RESEND_KEY` | Operator's single Resend API key (A4) | Reused across clients. |
| `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` | Google Cloud Console OAuth client (A4) | Per-client OAuth app. |
| `AUTH_MICROSOFT_ENTRA_ID_ID`, `_SECRET`, `_ISSUER` | Entra App Registration (A4) | Per-client app. |
| `ADMIN_ALLOWLIST_EMAILS` | CSV of client decision-makers | Fallback if `admin-allowlist.ts` is empty. |
| `GITHUB_PAT` | Vendor PAT (A2) | Read-only Octokit calls from `/admin`. |
| `GITHUB_REPO` | `palimkarakshay/{{GH_REPO}}` | For `lib/github.ts`. |
| `GITHUB_CLIENT_LABEL` | `client/{{CLIENT_SLUG}}` | Filter for this client's issues. |
| `N8N_INTAKE_WEBHOOK_URL` | n8n workflow A URL (A3) | |
| `N8N_DECISION_WEBHOOK_URL` | n8n workflow E URL (A3) | |
| `N8N_DEPLOY_WEBHOOK_URL` | n8n workflow F URL (A3) | |
| `N8N_HMAC_SECRET` | `openssl rand -hex 32` | Set the *same* value in n8n credentials. |
| `VERCEL_DEPLOY_HOOK_{{CLIENT_SLUG_UPPER}}` | From step B2 #5 | |
| `VERCEL_API_TOKEN` | Vercel → Account → Tokens, scoped to this project, read-only | For preview-URL lookup. |
| `NEXT_PUBLIC_SITE_URL` | The production URL | For OG images, sitemaps, structured data. |
| `CONTACT_EMAIL` | Where contact form replies go | |

Twilio, IMAP, Anthropic / Gemini / OpenAI keys live **only in n8n
credentials** — never in Vercel.

#### B4. Bootstrap labels and Project board

```bash
# One-shot from the operator's machine. The script is NEVER committed
# to the client's main; run it from your local operator-side checkout.
bash scripts/bootstrap-kanban.sh   # creates labels + prints next steps
```

In the GitHub UI:
1. Projects → New project → Board layout. Name: `{{BUSINESS_NAME}} Backlog`.
2. Columns: Inbox / Triaged / In Progress / Review / Done.
3. Project Settings → Workflows → enable **Auto-add to project** for the new repo.
4. Add the `client/{{CLIENT_SLUG}}` label to the repo (this is the per-client
   filter the admin portal reads in `src/lib/github.ts`).

#### B5. Import the n8n workflows for this client

```
In n8n:
1. Settings → Import → upload each of the six JSON files from
   docs/n8n-workflows/admin-portal/ (operator-side copy):
     intake-web.json
     intake-email.json
     intake-sms.json
     client-input-notify.json
     client-input-record.json
     deploy-confirmed.json
2. For each imported workflow:
     • Rename to `<workflow-name>-{{CLIENT_SLUG}}`.
     • Update credentials: GitHub → operator vendor PAT,
       Twilio → operator account + this client's number,
       IMAP → operator mailbox + filter by `requests+{{CLIENT_SLUG}}@<your-domain>`,
       Resend → operator API key,
       Anthropic → operator API key.
     • Update the GitHub `owner/repo` field to `palimkarakshay/{{GH_REPO}}`.
     • Update the `client/` label hard-coded in the issue body to
       `client/{{CLIENT_SLUG}}`.
     • Activate.
3. Copy the three webhook URLs into the corresponding Vercel env vars.
```

The n8n workflow JSONs are **operator artefacts**. They're versioned in
the operator's master repo (this repo, `docs/n8n-workflows/`) but **never
copied into client repos**. The client's repo holds the *Server Actions
that call them* and the HMAC secret that signs the calls — and that's it.

#### B6. Run Prompt A (client site scaffold)

Section 3 below. Approx. 1.5–3 hours of agent time on Opus.

#### B7. Run Prompt B (operator pipeline overlay)

Section 4 below. Approx. 30–60 minutes. **Run on a separate branch
named `operator/main`.** Push that branch, but never PR it into `main`.
The cron schedules in the workflows on `operator/main` will still
execute against the repo's default branch — that's the GitHub Actions
behaviour we want.

#### B8. Smoke-test everything

`docs/operator/SMOKE_TESTS.md` — run all six tests before sending the
client the handover guide.

#### B9. Hand over

Send the client *only* `docs/client/HANDOVER_GUIDE.md` and a 5-minute
walkthrough video. Nothing from `docs/operator/`, nothing from
`docs/freelance/`, and nothing from this file.

---

