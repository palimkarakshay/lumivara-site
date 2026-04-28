<!-- OPERATOR-ONLY. Pair with 03-secure-architecture.md. -->

# 12 — Critique: Security, Secrets & Cost-Firewall Gaps

The security posture in `03-secure-architecture` gets the *concept* right (org-level secrets, HMAC handshake, cost firewall) but has three concrete gaps that compromise the cost firewall in practice. This doc lists them and the precise fix per gap.

---

## §1 — 🔴 Critical: single-Owner GitHub topology has no break-glass

`09 §1` makes `palimkarakshay` the only Owner of the org. If that account is compromised (phishing, lost MFA recovery codes, hospitalisation), every client repo, every org-level secret, and every workflow is gone. There is no second Owner, no "successor protocol" wired into GitHub itself, and the operator vault (today: `pass` + YubiKey) does not include a GitHub recovery path.

### Fix

1. **Add a second Owner** of the org. Two viable choices:
   - A trusted human (a co-founder, a sibling who's tech-comfortable, a CPA you already trust with finances). They carry an MFA token + an offline recovery code in a sealed envelope, agree only to act on a documented break-glass trigger.
   - A second machine identity (`{{BRAND_SLUG}}-recovery`) whose recovery codes live in the vault on the operator's laptop **and** in the trusted-second-party envelope from `08 §4`.

2. **Require 2-of-2 on org settings changes.** GitHub Org → Settings → Repository roles + Member privileges → enable "Require two-factor authentication for everyone in this organization" + branch protection on org-rule changes (Enterprise feature; on Free, document the manual rule).

3. **Off-platform recovery contact.** Configure GitHub account → Security → Recovery codes → print, seal, store with the same trusted second party as `08 §4`'s break-glass envelope. One envelope, both keys.

4. **Quarterly recovery drill.** First Friday of every quarter: log in as the recovery owner, verify access, log out. Documented in `docs/operator/RECOVERY_DRILL_LOG.md`.

The cost is one extra free GitHub identity and one envelope. The blast radius without it is "the entire business."

---

## §2 — 🟠 High: `AUTH_RESEND_KEY` shared across every client breaks the cost firewall

`03 §3` says:

> `AUTH_RESEND_KEY` | client Vercel env (same key for every client) | Magic-link emails | 6 months

That single key in 25 different clients' Vercel env vars means:

1. A compromise of *any one* client's Vercel project (insider threat, OAuth-app phishing, supply-chain compromise of a Vercel build) leaks the key that signs **every other client's** transactional email.
2. Resend's per-API-key rate limits become a noisy-neighbour problem — one client's DDoS-by-form-spam exhausts the quota for every other client.
3. Per-client cost reporting (`03 §4.2`) becomes impossible — you can't tell from Resend's dashboard which client sent which message.
4. PIPEDA / Law 25 audit trail: a regulator asking "who sent this email" gets one shared identity, not a per-client trail.

### Fix

Resend supports unlimited API keys per account. **One key per client.** Costs nothing.

```
mothership/cli/provision.ts step 6 (Resend):
  - resend.apiKeys.create({ name: `client-${slug}-magic-link`,
                           permission: 'sending_access',
                           domain_id: resolved-domain-id })
  - capture into env.json under AUTH_RESEND_KEY
  - tag with metadata { client_slug, created_at, rotation_due }
```

Update the secret topology table in `03 §3`:

| Secret | Lives in | Used by | Rotation |
|---|---|---|---|
| `AUTH_RESEND_KEY` | client Vercel env (per-client; one key per client at Resend) | Magic-link emails | 6 months |

The same logic applies to:
- **Twilio sub-account credentials** — already per-client via the per-client number, but verify the n8n credential maps 1:1 not many:1.
- **OpenAI API key** — defensible to share (it's only invoked from the operator's actions, not from any client surface), but flag in the rotation table as "shared, scope-by-IP-allow-list if OpenAI offers it."

---

## §3 — 🟠 High: HMAC secret rotation is documented but not automated

`02 §5` defines the per-client `N8N_HMAC_SECRET` and says:

> Rotation: every 12 months, re-run `cli/rotate-hmac.ts`.

Two problems:

1. The rotate command is listed under future P5.4f but isn't sequenced anywhere. If the operator forgets, secrets stay forever — and a 12-month rotation is already lax for a webhook-signing secret.
2. Rotation is **not transactional**. A naive rotate updates Vercel env *or* the n8n credential first, breaking the handshake until both sides update. With 25 clients on a 12-month rolling rotation, ~one client every 2 weeks is in this dangerous window.

### Fix

Implement `forge rotate-hmac --client <slug>` as a two-phase commit:

```
Phase 1 (prepare):
  - Generate NEW_HMAC.
  - Add a SECOND credential set in n8n: HMAC accepts (OLD || NEW) for a 24h grace.
  - Verify n8n returns 200 to a probe signed with NEW_HMAC.

Phase 2 (commit):
  - vercel env update AUTH_RESEND_KEY (new value)
  - vercel deploy --prod   (env vars need redeploy; verify magic-link works
                           by sending one to the operator's address).
  - Verify a real Server Action submission signed with NEW_HMAC reaches n8n.

Phase 3 (cleanup, 24h later):
  - Remove OLD_HMAC from n8n.
  - Delete the old credential.
  - Append to docs/clients/<slug>/secrets-log.md.
```

This is the standard zero-downtime secret rotation pattern. Without it, the operator will dread rotation, defer it, and accumulate stale secrets — exactly the problem the rotation policy is meant to prevent.

---

## §4 — 🟡 Medium: VENDOR_GITHUB_PAT 90-day expiry is a silent fail

`03 §3`: PAT rotation = "90 days; calendar reminder."

What happens on day 91 if the operator missed the reminder? Every workflow on every client repo that uses `VENDOR_GITHUB_PAT` returns 401 from the GitHub API. The autopilot stops. No alert fires unless `mothership-smoke.yml` happens to be the first thing to run after expiry.

### Fix

1. **Switch the vendor identity from a PAT to a GitHub App.** Apps have no expiry, narrower scopes, and a clean audit trail. Cost: ~30 minutes of one-time setup. Document in `09` and update the provision CLI.
2. **If staying on PATs:** add `secret-expiry-warn.yml` (already named in `02 §2` as `secret-rotation-warn.yml` but undocumented). Runs daily. Calls `GET /user` with the PAT, parses the `X-OAuth-Scopes` and the rate-limit reset header to infer expiry, opens an issue at <14 days, escalates to SMS at <3 days.
3. **Rotation procedure:** publish an explicit "swap PAT" runbook in `docs/operator/RUNBOOK.md`. Two phases (insert new, verify, retire old) so there's no autopilot downtime.

GitHub App is the strict upgrade — recommend it.

---

## §5 — 🟡 Medium: secret discovery is by-eye

`03 §7`'s "client zone file checklist" is a manual checklist. Real secret-leak detection wants automated tooling:

1. **`gitleaks` in CI** — runs on every push to every client repo. The `gitleaks-action` is free, ~30 lines. Catches accidental secret commits before they hit `main`.
2. **GitHub's secret scanning** — included free for private repos; turn it on at org level. Already supports Anthropic OAuth tokens and most major providers.
3. **`forge audit-secrets` daily** — listed in P5.4f but not sequenced. Run it as a cron in the mothership repo (`mothership/.github/workflows/daily-secrets-audit.yml`); log to `docs/operator/audit/YYYY-MM.md`.

These are belt-and-braces — they catch the human errors the checklist relies on humans not making.

---

## §6 — 🟡 Medium: client repo Read access expands the leak surface

The pack treats client-as-Read-collaborator as the normal mode. But Read includes:

- All branches (see `11 §2`).
- All workflow run logs, including secret-redacted-but-context-revealing logs (e.g., the model decisions printed in `AI_ROUTING.md §"Audit trail"`).
- All issues and PR bodies — including the operator's prompts when they're pasted into PR descriptions.
- All Releases — including any artifacts the operator forgot to mark private.

The `auto-merge.yml` audit comments and the `routing.py` audit print can leak more than the operator intended. Specifically: the prompt-fingerprint, the model used, the cost-bucket label.

### Fix

Two-pronged:

1. **Don't grant client Read until handover.** During the engagement, the client's only window is the deployed `/admin` portal. They don't need GitHub access to operate the site (the whole point of the admin portal!). At handover, transfer ownership; at that point, the client gets Owner, the operator gets nothing.

2. **Sanitize the audit trail.** The audit comment in `auto-merge.yml` and the routing-decision step summary should be wrapped in:

```yaml
# emit only when actor is the bot or the operator
if: github.actor == vars.OPERATOR_HANDLE || github.actor == vars.BOT_HANDLE
```

Or: emit them to the workflow's step summary only (visible only to actors with `Actions: read`), never as PR comments.

Both fixes are small. Combined with the `operator/main` invisibility fix from `11 §2`, the leak surface goes from "leaky by default" to "leaky only by mistake."

---

## §7 — 🟢 Lesser: PIPEDA / Law 25 compliance is partly architectural

`08 §1` defers PIPEDA to "before client #3." Most of it is, correctly, paperwork. But two items are architectural and should land in P5:

1. **Subprocessor list** — needs a `/subprocessors` page on `{{BRAND_SLUG}}.com` (the storefront, not a client site). One-line markdown table. Trivial; do it now.
2. **Data residency for Quebec (Law 25)** — Anthropic, Resend, Twilio, and Vercel all have US-default. If a Quebec client signs, you need a tenant-side flag that disables non-Canadian providers. Concretely: a per-client `data_residency: ca` in `cadence.json`, read by `routing.py` to disable Gemini and OpenAI fallback (Anthropic has Canadian routing via AWS Bedrock; Vercel has `region: cdg1` not Canadian — flag this to client, document the limitation).

Both are 1-day tasks that prevent month-3 surprises.

---

## §8 — Summary action list for Run B

Single Claude Code session that closes the security gaps:

```
[ ] Add second Owner to {{BRAND_SLUG}} org (or document the recovery
    machine identity).
[ ] Provision quarterly recovery drill in calendar.
[ ] Update 03 §3 to make AUTH_RESEND_KEY per-client.
[ ] Implement forge rotate-hmac as two-phase commit (P5.4f).
[ ] Replace VENDOR_GITHUB_PAT with a GitHub App; update 09.
[ ] Add gitleaks to every client repo + mothership repo.
[ ] Turn on org-level secret scanning.
[ ] Sanitize audit-trail comments per §6.
[ ] Add /subprocessors page to {{BRAND_SLUG}}.com.
[ ] Add data_residency flag to cadence.schema.json.
```

Estimated turns: 80–120 in one Opus 4.7 session. Prompt body lives in `16 §2`.

*Last updated: 2026-04-28.*
