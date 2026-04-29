# Security Policy

> _Lane: ⚪ Both — security policy applies to every entity (Site / Pipeline / Both) co-housed in this repo._

## TL;DR

- **Vulnerabilities:** email `hello@lumivara.ca` (interim during pre-spinout; `security@lumivara-forge.com` once the operator-brand domain is registered per [`docs/mothership/15-terminology-and-brand.md §5`](../docs/mothership/15-terminology-and-brand.md)). Do **not** open a public Issue.
- **Acknowledgement:** within 48 hours.
- **Status update:** within 7 days.
- **Coordinated disclosure:** standard 90-day window from acknowledgement, extendable by mutual agreement.

## Pattern C trust model (read first)

This repo is the Phase 1 proof-of-concept for the [Pattern C two-repo trust model](../docs/mothership/02b-pattern-c-architecture.md). Until the P5.6 spinout, the Site (Client #1: Lumivara People Advisory marketing site) and Pipeline (Lumivara Forge operator framework) entities are co-housed; the security boundary between them is documented in [`docs/mothership/03-secure-architecture.md`](../docs/mothership/03-secure-architecture.md) and enforced by [`docs/mothership/pattern-c-enforcement-checklist.md`](../docs/mothership/pattern-c-enforcement-checklist.md).

Post-spinout, each engagement gets two private repos in the operator's GitHub org — `<slug>-site` (client-readable) and `<slug>-pipeline` (operator-only, never shared with the client) — with a single org-level GitHub App bridging them via short-lived installation tokens (≤1 h TTL).

## Supported entities + branches

| Entity | Branch | Supported | Notes |
|---|---|---|---|
| Site (this repo, until P5.6) | `main` | ✅ Yes | Production deploy = current `main`; previews per PR. |
| Pipeline (this repo, until P5.6) | `main` | ✅ Yes | Workflows + scripts that fire from cron. |
| `auto/issue-N` branches | per-issue | ⚠️ ephemeral | Bot working branches; lifetime ≤ one PR. |
| Other feature branches | varies | ❌ No | Treat as snapshots. |

## Reporting a vulnerability

**Do not open a public GitHub Issue for security vulnerabilities.**

Email **hello@lumivara.ca** (or `security@lumivara-forge.com` once registered) with:

1. A description of the vulnerability and its potential impact.
2. Steps to reproduce or a proof-of-concept.
3. Affected URL(s) / endpoint(s) / file path(s).
4. Whether the issue is in the Site lane (the marketing site at `lumivara-site.vercel.app` and the future `lumivara.ca` after DNS cutover), the Pipeline lane (workflows / scripts / dashboard), or the Both lane (toolchain, root configs).
5. Your suggested fix, if any.

You will receive an acknowledgement within **48 hours** and a status update within **7 days**. The fix lands on the matching branch (Site `main` or Pipeline `main`) under a [`security`](https://github.com/palimkarakshay/lumivara-site/labels/security) label, with the disclosure schedule recorded in the engagement evidence log.

## Scope

### In scope (Site lane)

- The live site at [lumivara-site.vercel.app](https://lumivara-site.vercel.app) and the future custom domain `lumivara.ca` after DNS cutover (item 12 of [`docs/migrations/00-automation-readiness-plan.md`](../docs/migrations/00-automation-readiness-plan.md)).
- The contact form (`/contact`) and its API endpoint at `src/app/api/contact/`.
- The `/admin` portal — Auth.js v5 magic-link / Google / Microsoft Entra sign-in, allowlist gating, three-channel intake (email / SMS / web). See [`docs/ADMIN_PORTAL_PLAN.md`](../docs/ADMIN_PORTAL_PLAN.md) for the threat model.
- Any externally-accessible route under `src/app/api/`.

### In scope (Pipeline lane)

- The GitHub App identity replacing the legacy `VENDOR_GITHUB_PAT` (per [`docs/mothership/02b §3`](../docs/mothership/02b-pattern-c-architecture.md) and [`12-critique-security-secrets.md §4`](../docs/mothership/12-critique-security-secrets.md)).
- HMAC signing of n8n ↔ Vercel webhooks (per-client `N8N_HMAC_SECRET`, ≤5-min skew window, two-phase rotation).
- Org-level secret topology in [`docs/mothership/03-secure-architecture.md §3`](../docs/mothership/03-secure-architecture.md).
- The codex-review workflow that gates auto-merge ([`scripts/codex-fix-classify.py`](../scripts/codex-fix-classify.py), the fixture catalogue at [`docs/ops/codex-fix-classify-fixtures.md`](../docs/ops/codex-fix-classify-fixtures.md)).
- Operator vault topology and break-glass envelope ([`docs/mothership/21-vault-strategy-adr.md`](../docs/mothership/21-vault-strategy-adr.md)).

### Out of scope

- GitHub Actions workflows themselves — report via [GitHub's vulnerability disclosure process](https://github.com/security/advisories).
- Third-party services (Cal.com, Vercel infrastructure, GitHub itself, Anthropic / OpenAI / Google AI APIs, Resend, Twilio, n8n, Railway).
- Denial-of-service attacks against the live site or any of the third-party services above.
- Social engineering against the operator or any client point of contact.
- Unauthorised access attempts that do **not** identify themselves as authorised security research per this policy.

## Security best practices (for contributors)

- **Secrets:** never commit secrets, API keys, or tokens. Vercel env vars for Site (per-client values); GitHub Actions org-level secrets for Pipeline (org-wide values, `Repository access: Selected`); operator vault for IP / business secrets per [`21-vault-strategy-adr.md`](../docs/mothership/21-vault-strategy-adr.md). The audit script [`scripts/pattern-c-audit.sh`](../scripts/pattern-c-audit.sh) §4 flags base64-shaped strings; verify any new hit by hand.
- **Trust boundaries:** treat the contact API (`src/app/api/contact/`), the `/admin` portal (`src/app/admin/`, `src/auth.ts`, `src/middleware.ts`, `src/lib/admin/`), and the n8n HMAC-signed webhook handlers as high-stakes. Changes there are excluded from automated bot execution per [`CONTRIBUTING.md`](../CONTRIBUTING.md) and require human review.
- **Dependencies:** pinned in `package-lock.json`. Run `npm audit` before adding or upgrading packages. Pipeline-side Python deps (in `scripts/`) are likewise pinned.
- **Validation:** all user-facing inputs validated with Zod at the API boundary. Form submissions rate-limited and checked for honeypot fields per the contact form's existing posture.
- **Pattern C lane discipline:** never edit operator-only paths from a Site-lane PR (see the rule table in [`AGENTS.md`](../AGENTS.md) and the §6 audit gate in [`scripts/pattern-c-audit.sh`](../scripts/pattern-c-audit.sh)).
- **Deprecated paths:** the v1 phone-PAT mechanism is deprecated; the deprecation notice lives at [`docs/_deprecated/PHONE_SETUP.md`](../docs/_deprecated/PHONE_SETUP.md). Do not follow its setup steps.

## Hall of fame

Security researchers who report valid vulnerabilities through this policy are credited (with consent) at the bottom of the relevant CHANGELOG entry once the fix ships.

## Cross-references

- [`docs/mothership/02b-pattern-c-architecture.md`](../docs/mothership/02b-pattern-c-architecture.md) — canonical Pattern C statement.
- [`docs/mothership/03-secure-architecture.md`](../docs/mothership/03-secure-architecture.md) — secret topology, trust zones, four "never" rules.
- [`docs/mothership/03b-security-operations-checklist.md`](../docs/mothership/03b-security-operations-checklist.md) — monthly + quarterly cadences, recovery drill template, secret rotation schedule matrix.
- [`docs/mothership/22-engagement-risk-protection.md`](../docs/mothership/22-engagement-risk-protection.md) — data-privacy / IP / non-payment posture for client engagements.
- [`docs/wiki/Security.md`](../docs/wiki/Security.md) — reader-friendly summary for the GitHub wiki.
