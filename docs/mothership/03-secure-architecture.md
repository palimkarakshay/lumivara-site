<!-- OPERATOR-ONLY. Pair with 02-architecture.md. -->

# 03 — Secure Architecture: Zone Isolation & Cost Firewall

The single most important property of this practice: **a curious client cannot see the operator's secrets, costs, or tools, even by inspecting their own repo.** This document is the rule-set that makes that true.

> **Canonical enforcement surface:** [`pattern-c-enforcement-checklist.md`](pattern-c-enforcement-checklist.md). The four rules below mirror C-MUST-NOT-1 through C-MUST-NOT-4 in that file byte-for-byte; any drift between the two locations is a bug. Edit both in the same PR.

## 1. The four "never" rules (memorise these)

<!-- mirrors pattern-c-enforcement-checklist.md §3 C-MUST-NOT-1..4 -->

1. **Never** put an operator API key, OAuth token, or vendor PAT into a client repo file — not in `.env.local.example`, not in a comment, not in a workflow `env:` block. Org-level secrets only.
2. **Never** copy `docs/mothership/`, `docs/freelance/`, `docs/operator/`, `n8n/*.json`, `scripts/triage-*`, `scripts/execute-*`, `scripts/gemini-*`, `scripts/codex-*`, `scripts/lib/routing.py`, or `dashboard/` into a client repo's `main`. They live on `operator/main` (overlay) or in the mothership repo only.
3. **Never** invoice a client for a line item that names a third-party service (Anthropic, Google, OpenAI, Twilio, Resend, Vercel, n8n, Railway). Bill at tier price; the cost stack is yours.
4. **Never** show a client the dashboard URL (`https://palimkarakshay.github.io/{{BRAND_SLUG}}-mothership/`) or any operator runbook. They get the admin portal at `https://<their-domain>/admin` and nothing else.

If a future bot or sub-agent asks Claude "should I commit this to the client repo's main?" — the answer is "only if it would be in the `client-template/` folder of the mothership." Anything else: no.

The full list (including C-MUST-NOT-5 "no-PAT-on-the-phone" and C-MUST-NOT-6 "no operator-account pushes to client `main`") and the *verify* commands for each row live in [`pattern-c-enforcement-checklist.md §3`](pattern-c-enforcement-checklist.md#3--must-not-controls).

---

## 2. Zone isolation tactics

### 2.1 The two-branch trick (recap)

- `main` of client repo → client-readable. Holds the site + admin portal + nothing else.
- `operator/main` of client repo → operator-only. Holds workflows + scripts + operator-side notes. Pushed by `{{BRAND_SLUG}}-bot`. Branch-protected to require Code Owners review (just `{{BRAND_SLUG}}-bot` itself).

### 2.2 Branch protection rules to set on every client repo

```
main:
  require_pull_request_reviews: 1
  required_review_thread_resolution: true
  required_status_checks: ["Vercel"]
  enforce_admins: false        # operator can bypass for emergency push
  allow_force_pushes: false
  allow_deletions: false
operator/main:
  restrict_pushes_to: ["{{BRAND_SLUG}}-bot"]
  required_status_checks: ["mothership-smoke"]
  allow_force_pushes: false
```

Apply these via the `provision` CLI; they are not optional.

### 2.3 The `.claudeignore` rule

Every client repo's `main` ships with a `.claudeignore` listing:

```
docs/operator/
docs/clients/
docs/mothership/
docs/freelance/
n8n/
workflows-template/
scripts/
.github/workflows/triage.yml
.github/workflows/execute*.yml
.github/workflows/plan-issues.yml
.github/workflows/deep-research.yml
.github/workflows/codex-review.yml
.github/workflows/auto-merge.yml
.github/workflows/project-sync.yml
.github/workflows/setup-cli.yml
.github/workflows/ai-smoke-test.yml
.github/workflows/deploy-dashboard.yml
```

This is paranoia-belt-and-braces: even if a future operator accidentally `cherry-picks` from `operator/main` into `main`, the agent running on the client repo's `main` won't read those files into context.

### 2.4 The "no-PAT-on-the-phone" rule

The v1 of the template told the client to put a GitHub PAT into iOS Shortcuts on their phone. That's gone. Today's flow:

- Phone → web/email/SMS → operator's n8n (signed with HMAC) → operator's vendor PAT → GitHub API.
- The client never holds a GitHub credential. They authenticate to `/admin` with magic-link email or Google or Microsoft Entra; the session is a JWT cookie scoped to the client's domain.

If a client device is lost, the client clicks "Sign out everywhere" in `/admin/settings`. The operator does not have to rotate any GitHub credential.

---

## 3. Secret topology

| Secret | Lives in | Used by | Rotation |
|---|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | `{{BRAND_SLUG}}` org secrets | Every client repo's workflows on `operator/main` | When `claude setup-token` is re-run (no expiry) |
| `GEMINI_API_KEY` | `{{BRAND_SLUG}}` org secrets | Same | 12 months |
| `OPENAI_API_KEY` | `{{BRAND_SLUG}}` org secrets | Same (codex-review fallback only) | 6 months |
| `VENDOR_GITHUB_PAT` | `{{BRAND_SLUG}}` org secrets + n8n credentials | n8n issue/comment/label writes | 90 days; calendar reminder |
| `N8N_HMAC_SECRET` (per-client) | client Vercel env + n8n credential for that client | `/admin` Server Actions ↔ n8n webhooks | 12 months |
| `AUTH_SECRET` (per-client) | client Vercel env | Auth.js JWT signing | 12 months |
| `AUTH_RESEND_KEY` | client Vercel env (same key for every client) | Magic-link emails | 6 months (one rotation = update every client's Vercel env) |
| `AUTH_GOOGLE_*`, `AUTH_MICROSOFT_*` | client Vercel env (per-client OAuth app) | OAuth sign-in | Until OAuth app is deleted |
| Twilio account SID / auth token | n8n credentials (operator-only) | Per-client SMS lane | 12 months |
| IMAP password / app password | n8n credentials | Email lane | 6 months |
| Vercel API token | operator's vault → CLI calls | `provision` CLI | 6 months |
| Stripe / Lemon Squeezy keys | operator's vault → invoicing scripts | Subscription billing | 12 months |

### 3.1 The operator vault

Today: a `pass` (passwordstore.org) tree on the operator's laptop, encrypted with a YubiKey-backed PGP subkey. Future (`08-future-work §4`): migrate to 1Password Business Teams + a Bitwarden self-hosted backup. **Never** Notion, Obsidian, or any plain-text note-taking app.

Every secret has:
- The value.
- The issuer (URL).
- The rotation date.
- The "blast radius if leaked" sentence.

### 3.2 Audit cadence

Quarterly: `pass audit` style run by hand:
1. List every org secret. Confirm rotation date < 6 months.
2. List every n8n credential. Confirm same.
3. List every Vercel env. Spot-check three clients for stale `AUTH_RESEND_KEY` values.
4. List every collaborator on every client repo. Remove anyone not actively engaged.
5. Run `npx forge audit-secrets` (P5 deliverable) — prints a single pass/fail.

---

## 4. The cost firewall

The client must never see what the operator pays third-parties. Three layers:

### 4.1 Billing layer

- Every external invoice is paid on the operator's payment method (Vercel team plan, Anthropic Pro/Max, Twilio, Resend, GitHub Pro, Railway, Cloudflare, OpenAI, Gemini paid tier when needed).
- The operator invoices the client for the **tier price**, full stop. No pass-through line items.
- If a client's project genuinely outgrows free tiers (e.g. Vercel Pro at $20/mo because of traffic), that becomes a tier upgrade discussion, not a "Vercel charged me $20" line item.
- The Vercel team is the operator's until handover. After handover, the client is invoiced by Vercel directly.

### 4.2 Per-client cost reporting (operator-internal)

`npx forge costs --month 2026-04` produces:

```
month  client                  ai_cost_usd  vercel_cost_usd  twilio_cost_usd  total_cost_cad  tier_price_cad  margin_cad
04-26  lumivara-people-advisory  3.40           0.00              1.15              6.20         249.00          242.80
04-26  johns-plumbing            1.10           0.00              1.15              3.10           99.00           95.90
...
```

Aggregated from `ccusage`, Vercel's billing API, Twilio's usage API, and the `n8n.{{BRAND_SLUG}}.com/usage` endpoint (operator-only).

This dashboard lives in the mothership repo's dashboard, on the **operator-only** view. It's the data behind P&L decisions, never shared.

### 4.3 The "what does it cost you" answer for clients

If a prospect asks (and they will): *"What's the actual AI cost behind this?"*

> "Honestly, it varies by what your site needs each month — but it's bundled inside the retainer at no extra charge. The reason it's bundled is that I run a single subscription that powers every client's autopilot, and I don't want to charge you for someone else's busy month. You pay one tier price; I handle the back-end."

Don't quote a per-month number. Don't show a per-client breakdown. The cost firewall is part of the product.

---

## 5. The "what if a client subpoenas everything?" thought experiment

If a client (or their lawyer) demands *"hand over everything you have on this engagement"*:

- The client gets: their site repo (`main`), their content, their domain, their Vercel project, their Stripe customer ID, their invoices, their intake form, their contract, the per-client section of `docs/clients/<slug>/`.
- The client does **not** get: the mothership repo, the autopilot workflows, the operator's prompts, the cost data, other clients' data, the n8n workflow JSONs, the dashboard, the operator's vault.

The contract (drafted in `08-future-work §1`) makes this distinction explicit and the boundaries enforceable. Without that clause, every engagement is a "work for hire" risk.

---

## 6. The "what if Claude or Anthropic exfiltrates" thought experiment

The autopilot is a third-party LLM. Some defensive design:

- The triage and execute prompts (`scripts/triage-prompt.md`, `scripts/execute-prompt.md`) live in the mothership and are read-only at runtime. They never feed the client repo's `main` content into a context that asks the model to "summarise the client's strategy" or similar — the prompts are issue-scoped only.
- Issue contents are user-provided already; that's not the leak. The leak risk is *operator's* prompts, which is why they're not exposed in the client repo.
- The fallback chain (Claude → Gemini → OpenAI) means three providers can see issues. If a client's industry has data-residency rules (Canadian PHIPA, EU GDPR), tier their cadence to Claude-only and disable the fallback for their repo (workflow `if:` conditional on a `client-tier/data-residency-strict` label).

---

## 7. The "client zone" file checklist

Before any push to a client repo's `main`, the operator (or the `provision` CLI) confirms:

- [ ] No file outside `client-template/` paths.
- [ ] No string matching the regex `(claude|gemini|openai|anthropic|twilio|resend|n8n)` outside docs that legitimately reference these as "your phone shortcut" copy.
- [ ] No file path matching `docs/(operator|mothership|freelance|clients)/`.
- [ ] No env var names starting with `VENDOR_`, `OPERATOR_`, `MOTHERSHIP_`, or `CLAUDE_`.
- [ ] No org-secret names referenced in any workflow that's about to land on `main`.
- [ ] `.claudeignore` from §2.3 is present.
- [ ] Footer credit `Built on the {{BRAND}} framework` is present (Tier 0/1/2; removable on Tier 3+).

The CLI's `validate-client-zone` step does this automatically; the operator does it by eye on any manual push.

---

## 8. Incident response (one page)

If a leak is suspected:

1. **Stop**: disable the relevant secret at its issuer (e.g. revoke `VENDOR_GITHUB_PAT` in GitHub Settings → Tokens). The autopilot will fail loudly; that's fine.
2. **Quarantine**: `npx forge pause --all` — disables all client workflows by setting an org secret to a dummy value.
3. **Rotate**: regenerate every secret in the affected category (use the table in §3).
4. **Audit**: search every client repo for the leaked value with `gh search code --owner palimkarakshay <leaked-prefix>`. If anything matches, force-push the cleaned history.
5. **Notify**: only if a client's data was exposed (PIPEDA + per-province rules). Draft a notification template now (`08-future-work §1`) so panic-day doesn't compound.
6. **Document**: append to `docs/operator/INCIDENT_LOG.md` (mothership repo) — date, scope, action, lesson.

The dashboard's "Recent runs" panel + the operator's "Friday cost check" + this list = the operator's whole security posture. It's small because the surface area is small. Keep it that way.

*Last updated: 2026-04-28.*
