> _Lane: 🛠 Pipeline (deprecated history)._
>
> ## ⚠️ Deprecated — replaced by n8n webhook + admin portal pipeline
>
> **Relocated 2026-04-29** from `/PHONE_SETUP.md` to `docs/_deprecated/PHONE_SETUP.md` — kept as a historical reference; do not follow its setup steps.
>
> This document described the **v1 phone-PAT** capture mechanism: a
> fine-grained GitHub Personal Access Token stored on the operator's phone,
> driving HTTP Shortcuts (Android) or Apple Shortcuts (iOS) that POSTed
> directly to the GitHub Issues API.
>
> **Do not follow the steps that used to live here.** The phone-PAT path is
> superseded by the **n8n + Auth.js v5 admin portal** pipeline, which
> removes the GitHub PAT from every client device.
>
> **Canonical replacements — read these instead:**
>
> | Topic | Canonical doc |
> |---|---|
> | n8n on Railway — install, credentials, webhook workflows | [`docs/N8N_SETUP.md`](../N8N_SETUP.md) |
> | `/admin` portal architecture, trust zones, Auth.js v5 setup, env vars | [`docs/ADMIN_PORTAL_PLAN.md`](../ADMIN_PORTAL_PLAN.md) |
> | Operator-side rebuild prompt, trust-zone rules, security migration matrix | [`docs/TEMPLATE_REBUILD_PROMPT.md`](../TEMPLATE_REBUILD_PROMPT.md) |
> | Day-to-day bot pipeline (capture → triage → execute → review → deploy) | [`docs/wiki/Bot-Workflow.md`](../wiki/Bot-Workflow.md) |
>
> The migration is tracked under [issue #135](https://github.com/palimkarakshay/lumivara-site/issues/135)
> (App-auth + per-client-keys topology) and the deprecation under
> [issue #139](https://github.com/palimkarakshay/lumivara-site/issues/139).

# Phone → GitHub Issue (deprecated v1 mechanism)

This file is kept as a **historical reference only**. It documents the
mechanism this repo originally used to capture backlog items from the
operator's phone, and the security reasoning behind moving away from it.

If you are setting up a new operator workstation or onboarding a client,
**stop reading here** and follow the canonical replacements listed in the
banner above.

---

## Why this was deprecated

The v1 mechanism asked the operator to mint a fine-grained GitHub PAT and
keep it on their phone (in HTTP Shortcuts variables on Android, or pasted
into the Shortcuts app on iOS). It worked, but carried three problems
that became blockers as the project moved toward multi-client deployment:

1. **Credential exposure on a mobile device.** A lost or stolen phone
   meant a token with `Issues:write` (and optionally `Actions:write`) on
   the repo. Revocation was the only mitigation, and the operator had to
   notice the loss first.
2. **No path to multi-tenant.** Every client engagement would have
   required a separate phone-side PAT under a separate device-side
   variable, with no central revocation. The `docs/TEMPLATE_REBUILD_PROMPT.md`
   trust-zone rules call this out as the single biggest hardening change
   between v1 and v2.
3. **No support for non-operator submitters.** The whole point of the
   admin-portal work tracked under issues #90 – #95 is that the *client*
   submits ideas (web form, email, SMS) without ever holding a GitHub
   credential. A phone-PAT scheme can't extend to a non-technical client.

## What replaced it (high level)

| Old mechanism (deprecated) | New mechanism (canonical) | Where to read |
|---|---|---|
| Operator's phone holds a fine-grained GitHub PAT | Operator-only **vendor PAT** held in n8n credentials on Railway; clients hold no GitHub credentials at all | [`docs/N8N_SETUP.md`](docs/N8N_SETUP.md), [`docs/TEMPLATE_REBUILD_PROMPT.md`](docs/TEMPLATE_REBUILD_PROMPT.md) §1 |
| HTTP Shortcuts / Apple Shortcuts → `POST /repos/.../issues` | `/admin` portal Server Action → HMAC-signed webhook → n8n → Octokit `issues.create` | [`docs/ADMIN_PORTAL_PLAN.md`](docs/ADMIN_PORTAL_PLAN.md) §1, §3 (Phase 2) |
| Phone shortcut to fire `triage.yml` / `execute.yml` | Cron + GitHub Actions; no phone-side workflow trigger needed | [`docs/wiki/Bot-Workflow.md`](docs/wiki/Bot-Workflow.md) |
| Email / SMS capture: not supported | n8n IMAP node + Twilio inbound webhook → same Claude structuring step → GitHub issue | [`docs/ADMIN_PORTAL_PLAN.md`](docs/ADMIN_PORTAL_PLAN.md) Phase 2, [`docs/N8N_SETUP.md`](docs/N8N_SETUP.md) |
| Vercel deploy trigger via Vercel API token on phone | "Confirm Deploy" Server Action → Vercel deploy hook (per-client) | [`docs/ADMIN_PORTAL_PLAN.md`](docs/ADMIN_PORTAL_PLAN.md) Phase 5 |

For the security impact and the operator-side migration steps, see the
**migration matrix** in [`docs/TEMPLATE_REBUILD_PROMPT.md`](docs/TEMPLATE_REBUILD_PROMPT.md)
§1.4.

## If you previously followed this doc

Operator action items, in order:

1. **Revoke the phone PAT.** GitHub → Settings → Developer settings →
   Personal access tokens → Fine-grained tokens → revoke any token whose
   only purpose was the v1 capture flow.
2. **Delete the phone-side shortcuts.** HTTP Shortcuts (Android) or
   Shortcuts (iOS) → remove the `Feedback → Lumivara`, `Trigger triage`,
   `Trigger execute`, `Trigger execute-complex`, and any list/view
   shortcuts that referenced this repo. They are dead URLs once the PAT
   is revoked, but removing them prevents accidental retries.
3. **Rotate any token that was reused elsewhere.** If you used the same
   PAT for a side-task or a second device, rotate it now.
4. **Move capture to `/admin`.** Once the admin-portal phases (issues #91 – #95)
   land, `https://lumivara-site.vercel.app/admin/new` becomes the primary
   web capture surface. Email-to-issue and SMS-to-issue lanes route
   through n8n per [`docs/N8N_SETUP.md`](docs/N8N_SETUP.md).
5. **No further phone setup is required.** The replacement flow needs no
   device-side configuration beyond signing in to `/admin` with magic
   link, Google, or Microsoft Entra.

## Historical content

The original setup steps (Android HTTP Shortcuts, iOS Apple Shortcuts,
the phone-side reference of every issue/PR/Vercel HTTP shortcut, and the
9-button home-screen layout) have been removed from this file because
they describe a deprecated path and are no longer safe to follow as-is.

The full original text is preserved in git history. To read it:

```bash
# Replace <sha> with the last commit before the deprecation rewrite —
# `git log PHONE_SETUP.md` will show it as the commit immediately
# preceding `feedback(#139): convert PHONE_SETUP.md to deprecation notice`.
git show <sha>:PHONE_SETUP.md
```

The historical security notes — particularly the rationale for the
two-token (Issues-only / Actions-only) split and the threat model for a
lost device — are folded into the migration matrix at
[`docs/TEMPLATE_REBUILD_PROMPT.md`](docs/TEMPLATE_REBUILD_PROMPT.md) §1.4
and the trust-zone rules at §1.1.
