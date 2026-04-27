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

## 2.5 Operator developer-environment setup (the multi-AI toolkit)

This section covers the operator's *own machine and accounts* — not the
client repo. It's what gets you authoring code with leverage. Ordered by
priority: do tier-A first; tier-B is comfort; tier-C is opportunistic.

> **Why multi-AI matters here.** The autopilot pipeline routes auto-coding
> requests through Claude → Gemini → OpenAI fallbacks. If Claude is
> quota-throttled at 2 a.m. on a client cron, Gemini's free tier picks up
> triage and a deferred Sonnet run picks up the next morning. The same
> redundancy applies to your own interactive work: when your Pro quota
> hits the 5-hour wall, you switch to Codex or Gemini until it resets.
> The cost of *not* having all three configured is a stalled day.

### 2.5.A — Tier A: must have before client #1

#### A.1 Claude account + Claude Code CLI

1. Sign up for **Claude Pro** ($20 USD / mo) at https://claude.ai/upgrade.
   Move to **Max 5x** ($100 / mo) when active client count crosses 5.
   Move to **Max 20x** ($200 / mo) at 15 clients. (Per
   `docs/freelance/03-cost-analysis.md` § Part E.)
2. Install Claude Code CLI: `curl -fsSL https://claude.ai/install.sh | sh`
   (or via Homebrew on macOS). Verify: `claude --version`.
3. Mint the OAuth token that bills against your Pro quota:
   ```bash
   claude setup-token   # opens browser; pastes token to clipboard
   ```
   Save this string in a password manager labelled
   `CLAUDE_CODE_OAUTH_TOKEN — operator (palimkarakshay)`. **It is the same
   token across every client repo.** Never give it out, never paste it in
   a chat, never commit it.
4. Add it as a **GitHub organisation secret** (per § A1 above) — *not* as a
   per-repo secret. Lower drift, single rotation point.
5. Optional but recommended: `claude` IDE extension for VS Code or
   JetBrains (Settings → Extensions → "Claude Code"). Lets you review and
   accept agent edits from inside the editor instead of a terminal pane.
6. Configure model defaults in `~/.claude/settings.json`:
   ```json
   {
     "defaultModel": "claude-opus-4-7",
     "fastModel": "claude-haiku-4-5-20251001",
     "allowedTools": ["Bash", "Read", "Write", "Edit", "Glob", "Grep"]
   }
   ```
   Opus for planning + this prompt itself; Haiku for triage and trivial
   edits; Sonnet (the default in CI workflows) for implementation.

#### A.2 GitHub — operator personal account + bot account

You need *two* GitHub identities. Don't skip this — it's the single
biggest hardening lever.

| Account | Purpose | Identity |
|---|---|---|
| **Operator personal** (e.g. `palimkarakshay`) | Owns every client repo (until end-of-engagement transfer). Owns the operator org. Owns the operator's master / admin repo. Authors PR reviews, manual merges, contract-related commits. | Your real name / email. SSH key + signed commits enabled. |
| **Operator bot** (e.g. `vibe-coded-bot`) | Author of every auto-PR. Holder of the vendor PAT used by n8n + GitHub Actions. Has *Write* access (not Admin) to each client repo. | Branded name + a bot-only email (e.g. `bot@vibe-coded.com` via Resend). HTTPS-only; no SSH key needed. |

**Personal account setup (one-time):**

```bash
# Generate Ed25519 SSH key for the personal identity
ssh-keygen -t ed25519 -C "palimkarakshay@operator" -f ~/.ssh/id_ed25519_operator
# Add to ssh-agent and to github.com → Settings → SSH keys.

# Sign commits with GPG (or with SSH signing on git ≥2.34):
git config --global user.signingkey ~/.ssh/id_ed25519_operator.pub
git config --global gpg.format ssh
git config --global commit.gpgsign true
```

Enable **2FA with hardware key** on github.com → Settings → Password and
authentication. The operator's GitHub identity is the master key to the
whole practice; a stolen TOTP is too cheap an attack.

**Bot account setup (one-time):**

```bash
# 1. Sign up new GitHub user — use a separate email (Resend alias works).
# 2. Enable 2FA with TOTP (no hardware key needed for the bot).
# 3. Settings → Developer settings → Personal access tokens → Fine-grained.
#    Create a token with:
#      Resource owner: palimkarakshay (your personal account, since
#                                       client repos live there)
#      Repository access: All repositories (or "Selected" and add as you go)
#      Permissions: Issues RW, Pull requests RW, Contents RW, Metadata R,
#                   Actions R (write only if needed for manual dispatch)
#      Expiration: 90 days, calendar a rotation reminder.
# 4. Save as VENDOR_GITHUB_PAT in:
#      a. GitHub org secrets (for use in workflows)
#      b. n8n credentials (for issue/comment/label writes)
#      c. password manager
# 5. Configure git locally for the bot identity (used only on operator
#    machine when scripting commits as the bot):
git config --global user.email "bot@vibe-coded.com"  # only in bot-scoped shells
```

**GitHub CLI**: install `gh` (`brew install gh` or per-platform). Auth as
both:

```bash
gh auth login --hostname github.com   # personal identity, browser flow
gh auth login --with-token <<< "$VENDOR_GITHUB_PAT"  # bot, in a separate shell
gh auth status                         # verify both
```

Use `gh auth switch` between the two as needed. In day-to-day operator
work, stay logged in as the personal identity; switch to bot only when
testing webhook flows.

#### A.3 Vercel

1. Sign up at https://vercel.com/signup with the **operator personal
   GitHub identity**. Vercel projects will live under your personal
   Vercel account; one Vercel project per client.
2. Verify **billing**: free Hobby plan covers small-business sites
   (≤100 GB bandwidth, 1M function invocations / mo). Move to Pro
   ($20 / mo / member) only if a client outgrows it — and that cost is
   theirs, not yours.
3. Install Vercel CLI: `npm i -g vercel`. Log in: `vercel login`.
4. Create a **read-only Vercel API token** (Vercel → Account → Tokens) for
   each client project; this becomes `VERCEL_API_TOKEN` in their env.
5. Per-client: enable **Comment on Pull Requests** (Settings → Git) so
   preview URLs surface on every auto-PR.

#### A.4 Codex / OpenAI Codex CLI

You said you already have this. The hardening notes:

1. The **Codex CLI** is operator-side only — it's not used in client cron
   workflows (Claude is the implementer there). Use Codex when:
   - You hit your Claude quota in the middle of interactive work.
   - You want a second opinion on a tricky refactor.
   - You're doing a heavy local migration where Sonnet's 200k context
     would need chunking.
2. Auth: `codex login` (browser flow → ChatGPT Plus/Pro/Team account). The
   subscription bills the operator's OpenAI account, not API credits.
3. Stash the API key (different from Codex CLI auth) in your password
   manager as `OPENAI_API_KEY — operator`. This is the value that becomes
   the `OPENAI_API_KEY` org-level secret used by `ai-smoke-test.yml` and
   the optional code-review fallback.
4. Configure `~/.codex/config.toml`:
   ```toml
   model = "gpt-5"
   reasoning_effort = "medium"
   approval_policy = "on-request"
   ```
   `on-request` means Codex asks before edits — safer for operator-side
   work where you don't want it touching the wrong file.

#### A.5 Gemini API key + Gemini CLI

1. Get the API key at https://aistudio.google.com/apikey. Free tier is
   generous: 1500 requests / day on Flash, 50 / day on Pro. Save as
   `GEMINI_API_KEY — operator` in your password manager.
2. Add as a GitHub org secret. Used by `scripts/gemini-triage.py`
   fallback and `ai-smoke-test.yml`. **This is what keeps client
   triage running when Claude is throttled** — don't skip it.
3. Install Gemini CLI: `npm i -g @google/generative-ai-cli` (or use the
   newer `gemini` CLI from Google's docs). Configure:
   ```bash
   export GEMINI_API_KEY=...   # add to ~/.zshrc or ~/.bashrc
   ```
4. **Use Gemini 2.5 Pro for deep research / high context** — its 1M-token
   context window is unmatched among the three providers. Operator
   workflows where Gemini Pro shines:
   - Auditing an entire client codebase before a major refactor (paste
     `find . -type f -name '*.tsx' | xargs cat` or use the CLI's
     `--directory` flag).
   - Reading a 200-page Next.js / Tailwind / Auth.js docs PDF + the
     client's repo in one prompt to spot version-mismatch bugs.
   - Summarising 6 months of GitHub Actions logs.
   - First-pass content drafting for blog posts (then Claude polishes).
5. **Should you go paid?** The Gemini API paid tier (~$1.25 / 1M input
   tokens for Pro) only matters once your free-tier daily cap actually
   bites. For an operator running 3–5 clients on autopilot, free tier
   suffices. Re-evaluate at 10+ clients.

### 2.5.B — Tier B: nice to have, install before client #5

#### B.1 Cline (the VS Code agent)

1. Install from VS Code Marketplace: search "Cline".
2. Configure with a **Gemini API key** (default) — keeps it free, and
   Gemini's long context is a comfort fit for in-editor work where you
   want it to read multiple files at once.
3. Or wire it up to your **Anthropic API key** for Claude-in-Cline. This
   bills against API credits (separate from the Pro/Max quota), so use
   sparingly — ~$5–15 / mo at moderate use.
4. Cline's role in your workflow: a "second pair of eyes" on tricky
   client features, especially when you want a model to read a lot of
   files and propose surgical edits *without* committing. Set its
   approval mode to "Approve every edit" in client repos.

#### B.2 Cursor (alternative IDE)

Optional. If you prefer Cursor over VS Code with Cline, the trade-offs:

- **Pro:** $20/mo bundles GPT-4o + Claude Sonnet + Gemini 2.5 Pro on a
  single subscription. Tab-completion is best in class.
- **Con:** doesn't natively integrate with `claude` CLI — you'd run two
  agents side-by-side rather than one IDE.

If you go Cursor: subscribe at https://cursor.com, sign in with your
operator GitHub identity, and configure `~/.cursor/config.json` to set
default model = `claude-sonnet-4-6`. Don't put a client repo into Cursor
without first confirming `.cursorignore` excludes `docs/operator/`,
`scripts/`, and `.github/workflows/`.

#### B.3 ccusage (Claude usage monitor)

```bash
npm i -g ccusage
ccusage    # one-shot report
ccusage --watch   # live dashboard
```

Run weekly. Surfaces: monthly spend by repo, percentage of Pro/Max quota
used, drift between clients. Used by `docs/MONITORING.md`.

### 2.5.C — Tier C: opportunistic / specialty

| Tool | When | Notes |
|---|---|---|
| **Aider** (`pip install aider-chat`) | Heavy refactors that span 50+ files. Aider's git-first model is unbeatable for "rename this symbol everywhere and commit each file separately". | Auth via OpenAI key or Anthropic key. Free CLI. |
| **Continue** (VS Code / JetBrains plugin) | If you're already in JetBrains and want an in-IDE agent. Free, BYO-key. | Slower than Cline; use only if Cursor isn't an option. |
| **Open Interpreter** (`pip install open-interpreter`) | Local-only tasks: log scraping, file reorg, ad-hoc SQL on a client export. | Don't point at a client repo without `--auto_run False`. |
| **Phind** (https://phind.com) | Quick lookups of obscure error messages. Browser-only; not part of the auto-pipeline. | Free tier is fine. |

### 2.5.D — Multi-AI fallback policy (what plugs into the autopilot)

This is the *required* mapping for client cron workflows. The operator's
job in the setup checklist (B5) is to confirm each lane has a working
key:

| Lane (cron / event) | Primary | Fallback | Final fallback |
|---|---|---|---|
| Triage classification | Claude Haiku (`CLAUDE_CODE_OAUTH_TOKEN`) | Gemini 2.5 Flash (`GEMINI_API_KEY`) | Defer to next cron |
| Implementation (auto code edits) | Claude Sonnet (`CLAUDE_CODE_OAUTH_TOKEN`) | Defer to next cron | Operator runs `execute-single.yml` manually |
| Planning (Opus pass for complex issues) | Claude Opus (`CLAUDE_CODE_OAUTH_TOKEN`) | Wait for availability | Operator plans manually |
| Trivial edits (typo, single-line) | Claude Haiku | Gemini 2.5 Flash-Lite | Defer |
| Large-context reads (audit, bulk) | Gemini 2.5 Pro (1M ctx) | Sonnet chunked | Operator chunks manually |
| Content drafting (blog, marketing) | Gemini 2.5 Pro | Claude Sonnet | Operator drafts |
| Code review on PR diff (optional) | OpenAI gpt-4o-mini (`OPENAI_API_KEY`) | Gemini 2.5 Flash | Skip review |
| AI smoke test (weekly) | Pings each provider | n/a — this *is* the canary | Page operator |

> **Minimum viable to run a client:** `CLAUDE_CODE_OAUTH_TOKEN` +
> `GEMINI_API_KEY`. OpenAI is optional (code-review only).

### 2.5.E — Account separation matrix (operator vs client)

| Resource | Operator account | Client account |
|---|---|---|
| GitHub repo ownership | ✅ until end-of-engagement transfer | (transferred at termination) |
| GitHub org membership | ✅ Owner of operator org | n/a — client never joins the operator org |
| Vercel project | ✅ in operator's Vercel account | (transferred at termination) |
| Production domain (DNS / registrar) | ❌ never | ✅ client owns from day 1 |
| Resend domain | ✅ operator's `mail.<brand>.com` | n/a — magic-link emails come from operator domain |
| Twilio phone number | ✅ in operator Twilio account | (transferable on request, ~$20 fee) |
| n8n workflows | ✅ on operator Railway | n/a — workflows are not transferred |
| Claude / Gemini / OpenAI API keys | ✅ all operator | n/a — never given to client |
| Auth.js OAuth clients (Google / Entra) | ✅ in operator Cloud / Entra tenants | n/a — magic-link goes through operator infra |
| `admin-allowlist.ts` content | n/a | ✅ client provides emails to allow |
| `siteUrl` / production domain | n/a | ✅ client owns |
| Site code (Next.js source) | (working copy) | ✅ client owns; transferred at termination |

The **golden rule**: nothing in the "operator account" column is ever
shared with the client. If they ask, the answer is *"those are the
infrastructure components I license to you per engagement; you can buy
them out at termination for [transfer fee]."*

### 2.5.F — Daily / weekly / monthly operator hygiene

- **Daily (5 min):** check `gh run list --workflow execute.yml --limit 5`
  across each active client repo. Resolve any red runs.
- **Weekly (15 min):** `ccusage` — track Pro/Max quota burn rate. Skim
  the Monday `ai-smoke-test.yml` results.
- **Monthly (45 min):** rotate any 30-day-expiring credentials (set
  calendar reminders). Do the Tier 2/3 monthly improvement run for each
  retainer client.
- **Quarterly (2 h):** rotate the vendor PAT (90-day expiry). Audit who
  still belongs in `admin-allowlist.ts` for each client. Re-run Phase 8
  of Prompt A locally to spot template drift.

---


