---
title: Admin Portal — n8n workflow templates
related-issues: 92, 94, 95
---

# Admin Portal — n8n workflow templates

These six JSON files are the operator's import bundle. Each maps to one
phase of the admin portal flow described in
[`docs/ADMIN_PORTAL_PLAN.md`](../../ADMIN_PORTAL_PLAN.md).

| File                         | Purpose                                               | Issue |
|------------------------------|-------------------------------------------------------|-------|
| `intake-web.json`            | Web → HMAC verify → Anthropic structurer → GitHub create → Resend ack | #92  |
| `intake-email.json`          | IMAP → Anthropic → GitHub create → SMTP ack           | #92  |
| `intake-sms.json`            | Twilio webhook → Anthropic → GitHub create → Twilio ack | #92 |
| `client-input-notify.json`   | GitHub `needs-client-input` label-added → Twilio/Resend nudge to client | #94 |
| `client-input-record.json`   | HMAC-verified decision webhook → GitHub comment + label remove | #94 |
| `deploy-confirmed.json`      | Vercel `deployment.succeeded`/`error` → GitHub close + celebratory note | #95 |

## How to import

1. n8n → top-right **Import from File** → select the JSON.
2. Open the new workflow → **Credentials** panel on each red node:
   - `github`: fine-grained PAT scoped to `palimkarakshay/lumivara-site`
     with `Issues: Read and Write` + `Pull requests: Read` +
     `Metadata: Read`.
   - `twilio`: account SID + auth token + the inbound number.
   - `imap`: `requests@<client>.tld` mailbox; we recommend a Gmail app
     password rather than the main account password.
   - `smtp`: outbound transactional sender (Resend recommended; reuses
     the same domain as the magic-link emails).
   - `anthropic` (or `gemini`/`openai`): API key for the structuring step.
3. **Variables panel** (left sidebar → ⚙ → Variables) — set:
   - `N8N_HMAC_SECRET` — same value as in Vercel.
   - `GITHUB_REPO` — e.g. `palimkarakshay/lumivara-site`.
   - `LUMIVARA_DOMAIN` — apex used in the magic-link reply, e.g.
     `lumivara.ca`.
4. Activate each workflow. The webhook URLs that pop up under each
   webhook node go into Vercel env (`N8N_INTAKE_WEBHOOK_URL`,
   `N8N_DECISION_WEBHOOK_URL`, `N8N_DEPLOY_WEBHOOK_URL`).

## Replication for new clients

The whole bundle is per-client because each carries its own GitHub
credential, Twilio number, and IMAP mailbox. The fastest path:

```bash
cp -r docs/n8n-workflows/admin-portal docs/n8n-workflows/admin-portal-<slug>
sed -i "s/palimkarakshay\\/lumivara-site/<owner>\\/<repo>/g" \
  docs/n8n-workflows/admin-portal-<slug>/*.json
```

Then import that copy into n8n under a new folder (`/admin-portal/<slug>`),
swap credentials, and activate.

## Threat model

- **HMAC** on every Next.js → n8n call (`X-Lumivara-Signature: t=,v1=hex`).
  The verify nodes reject anything older than 5 minutes, so a captured
  request is unreplayable after the window.
- **No outbound writes from Next.js** — all GitHub/Twilio/Resend
  credentials live inside n8n. The Next app only signs and dispatches.
- **Source-channel + reply-to** are stored as a hidden HTML comment on
  the issue body: `<!-- source=email reply=client@x -->`. The dashboard
  strips this before showing the body to a client.
