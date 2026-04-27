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
