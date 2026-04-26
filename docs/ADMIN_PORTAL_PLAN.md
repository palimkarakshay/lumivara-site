---
title: Admin Portal — Architecture & Phased Execution Plan
status: draft
related-issue: 90
---

# Admin Portal — Architecture & Phased Execution Plan

A jargon-free, mobile-first admin portal that lets a non-technical client submit ideas, watch progress in plain English, answer the team's questions, and approve production deploys — without ever seeing GitHub. The flow is glued together by **n8n** (already in our stack — see `docs/N8N_SETUP.md`).

This document is the planning artefact for [issue #90](https://github.com/palimkarakshay/lumivara-site/issues/90). The work is broken into 5 follow-up issues, one per phase. **No application code is changed by this PR**; each phase ships under its own ticket so we can land them independently and roll back cleanly.

---

## 1. Architecture summary

```
                                                    ┌──────────────────────────────┐
   Client (phone)                                   │  GitHub repo (this repo)     │
   ───────────────                                  │  • Issues = client requests  │
        │                                           │  • Labels = lifecycle state  │
        │ ① submit (web / email / SMS)              │  • PRs    = the actual work  │
        ▼                                           └──────────────▲───────────────┘
   ┌──────────────────────────┐                                    │
   │ Lumivara Next.js site    │   ② signed webhook                 │ ⑥ Issues / Labels API
   │ /admin (Auth.js v5,      │ ─────────────────► n8n ◄───────────┤    + Vercel deploy hooks
   │ allow-listed magic link) │                  (Railway)         │
   │                          │   ④ poll status     │              │
   │ Server Components fetch  │ ◄────── GitHub API  │              │
   │ via Octokit ◄─────────── │                     │ ③ AI structuring (Claude)
   │                          │                     │ ④ Twilio SMS / IMAP / SMTP
   │ ⑤ "Confirm Deploy" SA ───┼───── webhook ─────► │ ⑤ Vercel Deploy Hook
   └──────────────────────────┘                     └────► auto-replies to client
```

Five surfaces, three trust zones:

| Surface                             | Trust zone | Owner       |
|-------------------------------------|------------|-------------|
| `/admin` UI + Server Actions        | Site       | this repo   |
| `/api/admin/*` (Octokit, deploy hk) | Site       | this repo   |
| n8n workflows (capture, reply, dispatch) | n8n   | Railway     |
| GitHub Issues + labels              | GitHub     | this repo   |
| Vercel preview/prod deploys         | Vercel     | operator    |

Key boundaries:
- **The Next.js app never holds a long-lived GitHub PAT in the browser.** Only Server Components / Server Actions / route handlers touch Octokit, and they read the token from `process.env`.
- **n8n is the only system with write-access credentials to Twilio, IMAP, and the AI provider.** The Next.js app only signs and dispatches webhooks at it.
- **All n8n ↔ Next.js calls carry a shared HMAC signature** (`X-Lumivara-Signature`, timestamped, ≤5 min skew) — same shape we already use for the contact form.

---

## 2. Tech choices (confirm before Phase 1)

| Concern             | Choice                                  | Why                                                                 |
|---------------------|-----------------------------------------|---------------------------------------------------------------------|
| Auth                | **Auth.js v5** (NextAuth's current name) | First-class Next.js 16 App Router support; magic-link email + Google + Microsoft Entra all built-in. |
| Email magic link    | **Resend** provider                     | Free tier is enough; we already have transactional needs.           |
| Session storage     | **JWT, encrypted, 12-h rolling**        | No DB needed; offline-friendly for the SMS/email magic-link flow.   |
| Allow-list source   | `src/lib/admin-allowlist.ts` (in code)  | Tiny, version-controlled, code-reviewable. No "forgot to revoke" tickets. |
| GitHub access       | **Octokit** + fine-grained PAT (Issues:RW, PR:R, Deployments:R) | Same scope shape as n8n's PAT; no new GitHub App needed for v1. |
| Mobile UI           | Tailwind v4 + Base UI (existing)        | We already ship this design system.                                 |
| Realtime            | **Polling every 30 s + manual refresh** for v1 | Cheap, no websockets, fine for ≤20 active issues per client.        |
| Webhook auth        | HMAC-SHA256 over `${ts}.${rawBody}`     | Same primitive as `src/app/api/contact/`; no new crypto to review.  |

> **Dependency budget:** v1 adds three runtime deps — `next-auth@5`, `@octokit/rest`, `@auth/core` (peer of `next-auth`). No bumps to existing packages. Each phase issue calls out the exact `npm i` line.

---

## 3. Phased execution plan

Each phase is a separate issue — link below — and ships as one PR. Phases are sequenced; a later phase assumes the earlier ones merged.

### Phase 1 — Secure access & mobile-first foundation — issue [#91](https://github.com/palimkarakshay/lumivara-site/issues/91)
- Add `/admin` route group with mobile-first layout (single column, 16 px gutter, sticky bottom nav).
- Wire **Auth.js v5** with three providers: Resend magic link, Google, Microsoft Entra.
- Block all `/admin/**` paths with `middleware.ts` that checks the JWT email against `admin-allowlist.ts`.
- Rejection page (`/admin/no-access`) that doesn't leak whether the email exists.
- **Smoke test:** unlisted email + valid magic link still hits `/admin/no-access`. Listed email + magic link reaches `/admin` dashboard skeleton.

### Phase 2 — Omnichannel issue capture & n8n handoff — issue [#92](https://github.com/palimkarakshay/lumivara-site/issues/92)
- New Server Action `submitIdea()` posts to `process.env.N8N_INTAKE_WEBHOOK_URL` with HMAC.
- n8n workflow #1: web webhook → Claude structuring node → GitHub `issues.create` → reply to caller with magic link.
- n8n workflow #2: IMAP node on `requests@<client>.com` → same Claude node → GitHub create → SMTP auto-reply.
- n8n workflow #3: Twilio SMS webhook → same Claude node → GitHub create → Twilio SMS reply.
- **Smoke test:** submit one idea per channel; verify exactly one GitHub issue created with label `source/web|email|sms`, exactly one auto-reply received, magic link works end-to-end.

### Phase 3 — Status dashboard & label-to-English translation layer — issue [#93](https://github.com/palimkarakshay/lumivara-site/issues/93)
- Server Component fetches issues via Octokit, filters to ones tagged `client/<allowlist-id>`.
- `src/lib/admin-status-map.ts` translates labels to a `{ label, tone, copy }` triple. Examples:
  - `status/triage` → `{ label: "Reviewing your request", tone: "info" }`
  - `status/in-progress` → `{ label: "Building this", tone: "warning" }`
  - `status/awaiting-review` → `{ label: "Ready for your test", tone: "success-pending" }`
  - `status/done` → `{ label: "Live", tone: "success" }`
- Mobile dashboard renders one card per issue, sorted by recent activity.
- **Smoke test:** label an issue `status/in-progress` in GitHub → dashboard shows "Building this" with yellow indicator within 30 s.

### Phase 4 — `needs-client-input` action loop — issue [#94](https://github.com/palimkarakshay/lumivara-site/issues/94)
- n8n workflow #4: GitHub label-added webhook for `needs-client-input` → notify client via the channel they used (we stored it in Phase 2 as a comment / custom field).
- Dashboard highlights the affected card with an "Action needed" CTA.
- New Server Action `submitClientDecision(issueNumber, choice)` → n8n webhook → comments back on GitHub → removes the label.
- **Smoke test:** add `needs-client-input` to a test issue; client receives SMS/email; client taps link, picks A; GitHub issue gets a comment "client chose A" and label is gone.

### Phase 5 — Vercel previews & confirm-deploy — issue [#95](https://github.com/palimkarakshay/lumivara-site/issues/95)
- For each issue with an open PR, fetch the latest Vercel preview deployment via the Vercel REST API and render a **"View test build"** button.
- "Confirm Deploy" Server Action hits the per-client Vercel **Deploy Hook URL** stored in `process.env.VERCEL_DEPLOY_HOOK_<CLIENT>`.
- On Vercel `deployment.succeeded` webhook → n8n closes the issue, drops `status/done`, sends celebratory note.
- **Smoke test:** open a PR; preview button works on phone; tap Confirm Deploy → Vercel build starts within 10 s → on success the dashboard card flips to green "Live" and client gets confirmation.

---

## 4. Environment variables

Grouped by where they're set. **Vercel mirror required** for everything in column "Vercel".

| Var                                  | Vercel | n8n | Purpose                                            |
|--------------------------------------|:------:|:---:|----------------------------------------------------|
| `AUTH_SECRET`                        | ✅     |     | Auth.js v5 JWT signing key (32-byte random).       |
| `AUTH_RESEND_KEY`                    | ✅     |     | Resend API key for magic-link email.               |
| `AUTH_GOOGLE_ID` / `AUTH_GOOGLE_SECRET` | ✅  |     | Google OAuth client.                               |
| `AUTH_MICROSOFT_ENTRA_ID_ID` / `_SECRET` / `_ISSUER` | ✅ | | Microsoft Entra OAuth client.            |
| `ADMIN_ALLOWLIST_EMAILS`             | ✅     |     | CSV fallback, primary list lives in code.          |
| `GITHUB_PAT`                         | ✅     |     | Fine-grained PAT, Issues:RW + PR:R + Deployments:R.|
| `GITHUB_REPO`                        | ✅     |     | `palimkarakshay/lumivara-site`.                    |
| `N8N_INTAKE_WEBHOOK_URL`             | ✅     |     | Phase 2 dispatch.                                  |
| `N8N_DECISION_WEBHOOK_URL`           | ✅     |     | Phase 4 dispatch.                                  |
| `N8N_DEPLOY_WEBHOOK_URL`             | ✅     |     | Phase 5 dispatch (or skip and call Vercel direct). |
| `N8N_HMAC_SECRET`                    | ✅     | ✅  | Shared HMAC for all Next.js↔n8n webhooks.          |
| `VERCEL_DEPLOY_HOOK_LUMIVARA`        | ✅     |     | Per-client deploy hook (one per Vercel project).   |
| `VERCEL_API_TOKEN`                   | ✅     |     | Read-only, scoped to the project, for preview URL lookup. |
| `TWILIO_ACCOUNT_SID` / `TWILIO_AUTH_TOKEN` / `TWILIO_FROM_NUMBER` | | ✅ | n8n only. |
| `IMAP_HOST` / `IMAP_USER` / `IMAP_PASS` |    | ✅  | n8n only.                                          |
| `ANTHROPIC_API_KEY` (or `OPENAI_API_KEY`) |  | ✅  | n8n AI structuring node.                           |

> **All Vercel-side vars must be added in Vercel dashboard before the corresponding phase's PR is merged.** Each phase issue lists exactly the subset it needs and is labelled `needs-vercel-mirror`.

---

## 5. Multi-client replication notes

This portal ships in **this** repo for Lumivara, but the design assumes we replicate it for other clients. To keep the cost of the second install low:

1. **Allow-list is per-deployment.** Every client repo carries its own `admin-allowlist.ts`.
2. **n8n workflows are templated.** Export the four workflows as JSON and store under `docs/n8n-workflows/admin-portal/`. New client = import + swap webhook URLs + repoint the GitHub credential.
3. **Twilio number is per-client.** A second client gets its own number; n8n routes by the inbound number.
4. **Status map is shared.** Keep it in `src/lib/admin-status-map.ts` so a label rename happens once.
5. **Vercel deploy hook is per-project.** No shared infra.

A condensed "replication checklist" lives at the bottom of each phase's issue and gets folded into `docs/wiki/Best-Practices.md` after Phase 5 ships.

---

## 6. Risks & mitigations

| Risk                                                | Mitigation                                                           |
|-----------------------------------------------------|----------------------------------------------------------------------|
| GitHub PAT exfiltrated from the Next.js runtime     | Fine-grained PAT, single repo, Issues+PR+Deployments only; rotate quarterly; never sent to client. |
| Magic-link email ends up in spam                    | Resend with custom domain + DKIM; fall back to Google/Microsoft providers. |
| n8n on Railway is down when client submits          | Web form: queue locally in `localStorage`, retry on reconnect. SMS/email fall through Twilio/IMAP retries. |
| Client clicks "Confirm Deploy" twice                | Server Action idempotency key derived from PR head SHA; second click is a no-op with a friendly toast. |
| Allow-list edited by a non-reviewer                 | `admin-allowlist.ts` is in CODEOWNERS for the operator only.         |
| AI mis-structures the issue                         | Always include the raw client text verbatim as the first comment on the GitHub issue, so a human can re-read source. |

---

## 7. What this PR changes

- **Adds:** this file (`docs/ADMIN_PORTAL_PLAN.md`).
- **Does not change:** any application code. All implementation lands in the per-phase follow-up issues linked from #90.
