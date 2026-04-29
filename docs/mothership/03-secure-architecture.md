<!-- OPERATOR-ONLY. Pair with 02-architecture.md. -->

# 03 — Secure Architecture: Zone Isolation & Cost Firewall

> **⚠️ Mixed canonical / historical as of 2026-04-29.** §3 (secret topology, App identity model `§3.X`, two-phase HMAC rotation `§3.Y`), §7 (client-zone checklist), and §8 (incident response) are **canonical** — Pattern C aligned, App-first, per-client Resend. The branch-overlay text in §2.1, §2.2, and §2.4 (`operator/main` overlay as a branch within a single client repo) is **deprecated**; the two-repo Pattern C statement is canonical in [`02b-pattern-c-architecture.md`](02b-pattern-c-architecture.md), and the §2.x rewrite is owned by the Pattern C propagation issue, not this file. Until that propagation lands, treat §2.1–§2.4 as historical context describing the deprecated pattern; apply §1 / §3 / §4 / §5 / §6 / §7 / §8 as written, and cross-reference `02b` whenever the §2.x mechanics conflict with Pattern C. The recurring operator cadence lives in [`03b-security-operations-checklist.md`](03b-security-operations-checklist.md).

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

> **Canonical inventory: [`docs/ops/variable-registry.md`](../ops/variable-registry.md).** That file is the audited list with every name, scope, owner, rotation cadence, and source reference. The excerpt below keeps the *contextual prose* for the three secrets whose blast radius warrants a paragraph; for any secret not listed in the excerpt, treat the registry as authoritative.

| Secret | Why it gets prose here |
|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | The single OAuth token that bills every autopilot run against the operator's Claude Pro/Max subscription. Org-scoped; never a per-repo secret in the canonical Pattern C model. Rotation = re-run `claude setup-token`; no expiry. The blast radius is "every client repo's autopilot stops" — visible failure, not silent compromise, which is why no expiry is acceptable. |
| `VENDOR_GITHUB_PAT` | The bot account's fine-grained PAT used by n8n for issue / comment / label writes. 90-day rotation; the calendar reminder lives in the operator's pass tree. Blast radius if leaked = anyone can open / close issues across every client repo (no code write); recovery = revoke in GitHub → Tokens, regenerate, update every n8n credential row. |
| `N8N_HMAC_SECRET` | Per-client. Signs every Vercel ↔ n8n webhook over `${unixTimestamp}.${rawBody}`. Two-phase rotation (issue new → both accepted → retire old) — see §4. The HMAC + the vendor PAT together are what gates the autopilot from accepting a forged webhook; either one alone is useless. |
| Secret | Lives in | Used by | Rotation |
|---|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | `{{BRAND_SLUG}}` org secrets | Every client repo's workflows on `operator/main` | When `claude setup-token` is re-run (no expiry) |
| `GEMINI_API_KEY` | `{{BRAND_SLUG}}` org secrets | Same | 12 months |
| `OPENAI_API_KEY` | `{{BRAND_SLUG}}` org secrets | Same (codex-review fallback only) | 6 months |
| `APP_ID` | `{{BRAND_SLUG}}` org secrets (public ID; safe to log) | `actions/create-github-app-token@v1` in pipeline-repo workflows | Stable; only changes if the App is rebuilt |
| `APP_PRIVATE_KEY` | `{{BRAND_SLUG}}` org secrets (PEM) | Same | 12 months (regenerate the App's private key; the App itself is durable) |
| `INSTALLATION_TOKEN` | **Generated per workflow run; never stored** | Pipeline-repo workflows pushing branches / opening PRs / commenting on the matched site repo | ≤ 1 h TTL by GitHub; auto-expires |
| `VENDOR_GITHUB_PAT` | _DEPRECATED — superseded by §3.X GitHub App identity._ Retained only as the n8n credential that writes issues/comments until n8n picks up App-based auth in `05 §P5.4f`. | n8n issue/comment/label writes (final remaining caller) | 90 days; calendar reminder. Track this row's removal under issue "Operator: install GitHub App in place of VENDOR_GITHUB_PAT" (see `16 §7`). |
| `N8N_HMAC_SECRET` (per-client) | client Vercel env + n8n credential for that client | `/admin` Server Actions ↔ n8n webhooks | 12 months — rotate via the §3.Y two-phase pattern |
| `AUTH_SECRET` (per-client) | client Vercel env | Auth.js JWT signing | 12 months |
| `AUTH_RESEND_KEY` (per-client) | client Vercel env (per-client; one Resend API key per client, scoped to `sending_access` on the operator's verified domain) | Magic-link emails | 6 months (rotation is per-client; no fan-out across other clients) |
| `AUTH_GOOGLE_*`, `AUTH_MICROSOFT_*` | client Vercel env (per-client OAuth app) | OAuth sign-in | Until OAuth app is deleted |
| Twilio account SID / auth token (per-client sub-account) | n8n credentials (operator-only) | Per-client SMS lane — verify the n8n credential maps **1:1** with the per-client Twilio number, never many:1 (`12 §2`). | 12 months |
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

Quarterly: `pass audit` style run by hand. Walk
[`docs/ops/variable-registry.md`](../ops/variable-registry.md) row by
row and re-confirm the **Last verified** stamp at the bottom of that
file. The walk-through:

1. List every org secret (registry §1). Confirm rotation date < 6 months.
2. List every n8n credential (registry §4). Confirm same.
3. List every Vercel env (registry §3). Spot-check three clients for stale `AUTH_RESEND_KEY` values.
4. List every collaborator on every client repo. Remove anyone not actively engaged.
5. Run `npx forge audit-secrets` (P5 deliverable) — prints a single pass/fail; data source is the registry.
6. Update the **Last verified** date in `docs/ops/variable-registry.md §7`.

### 3.X GitHub App identity model (canonical vendor auth)

The vendor identity is a **GitHub App**, not a personal-access token. The App lives at the `{{BRAND_SLUG}}` org level; each engagement gets a fresh **installation** of that App scoped to its `<slug>-site` repo. Pipeline-repo workflows mint a short-lived installation token at run time and discard it on exit.

**Why an App, not a PAT.** PATs expire silently every 90 days, are scoped only as narrowly as a human can be bothered to configure, and stamp every action with a personal user identity. An App has:

- No user-facing expiry — the App is durable; only its private key has a rotation policy.
- A narrow, declared permission set (see below) that cannot be widened by accident.
- A clean audit trail in `Org settings → Audit log → app/...` events distinct from human pushes.
- Cross-repo authority — the App is the **only** identity that can simultaneously read pipeline-repo state and write to a site repo without putting a vendor PAT into either side. This is what makes Pattern C's two-repo split architecturally enforceable.

**Permissions the App requests** (per `02b §3` and `09 §2 step 5`; granted at install time per repo):

| Permission | Level | Why |
|---|---|---|
| Issues | Read & write | Triage labels, plan comments, status comments |
| Pull requests | Read & write | Open PRs, post review comments, request reviews |
| Contents | Read & write | Push `auto/issue-N` branches; never to the site-repo `main` directly |
| Metadata | Read | Required by every App (mandatory) |
| Workflows | Read | Read pipeline-repo workflow files for the smoke-test gate |

The App **does not** request `Administration`, `Secrets`, `Members`, or any org-level mutating scope. A leaked installation token can write to the matched site repo for ≤ 1 h; it cannot exfiltrate other clients' data and cannot escalate to the org.

**Installation procedure.** One-time per org (`09 §2 step 5–7`); per-repo at provision time:

1. `forge provision …` → step 7 calls the App's installation API to install the App on the new `<slug>-site` repo only.
2. Capture the `installation_id` into the per-client `cadence.json` so workflows can resolve "which installation matches this engagement" without listing all installations.
3. The App is **not** installed on the pipeline repo — pipeline-repo workflows are the *callers*, not the *targets*.

**Workflow auth pattern.** Every pipeline-repo workflow that touches the site repo opens with:

```yaml
- name: Mint installation token
  id: app-token
  uses: actions/create-github-app-token@v1
  with:
    app-id: ${{ secrets.APP_ID }}
    private-key: ${{ secrets.APP_PRIVATE_KEY }}
    owner: ${{ vars.SITE_REPO_OWNER }}
    repositories: ${{ vars.SITE_REPO_NAME }}

- name: Use the token
  env:
    GH_TOKEN: ${{ steps.app-token.outputs.token }}
  run: gh issue list --repo ${{ vars.SITE_REPO_OWNER }}/${{ vars.SITE_REPO_NAME }}
```

The token is scoped to a single repo, lives ≤ 1 h, and is auto-redacted in workflow logs. Workflows must never write the token to a file, an artefact, or a comment body.

**Migration from `VENDOR_GITHUB_PAT`.** Two-phase, no autopilot downtime:

- **Phase 1 — install the App** alongside the existing PAT. Add `APP_ID` + `APP_PRIVATE_KEY` to org secrets. Pick one low-stakes workflow (e.g. `mothership-smoke.yml`) and switch it to the App-token pattern. Verify a green run.
- **Phase 2 — switch one workflow at a time.** Replace `${{ secrets.VENDOR_GITHUB_PAT }}` with the `app-token` pattern in each workflow. Watch for green for 48 h before moving on.
- **Phase 3 — retire the PAT.** When the only remaining caller is the n8n credential (see the §3 table), revoke the PAT in GitHub Settings → Tokens. The n8n credential exception persists until `forge` ships an App-based n8n token-refresh helper (`05 §P5.4f`); that exception is the single named row in the §3 table, not an oversight.

**Audit-log location.** All App actions appear at `https://github.com/organizations/{{BRAND_SLUG}}/settings/audit-log?q=action:integration_installation+OR+action:installation`. Diff this monthly against the active-client roster (`03b §1`) — any installation on a repo you don't recognise is an incident.

**Pattern C dependency.** Pattern C (`11 §1`) is locked but the cross-repo write requirement that the App's `Contents:RW` enables only matters once Pattern C ships per client. Until then, the App's installation scope is the mothership repo + Client #1's site repo; the App-first model is still the strict upgrade vs. PAT regardless. See `02b §3` for the canonical Pattern C statement and `09 §2.5` for the second-Owner requirement that protects the App's private key.

**GitHub plan tier.** GitHub Apps are free at every plan tier. The App does **not** trigger any of the Team/Enterprise upgrade paths in `09 §5`.

### 3.Y Two-phase rotation pattern for HMAC-style secrets

Every HMAC-signed handshake (`N8N_HMAC_SECRET`, the Vercel deploy hook, any future Twilio webhook signing) rotates with a **prepare → commit → cleanup** sequence so there is no window in which the two sides of the handshake disagree about the active key. This is the doc-side of `forge rotate-hmac` (`05 §P5.4f` future work); until that CLI ships, the operator runs the procedure by hand.

**Applies to.** `N8N_HMAC_SECRET` (per-client), the Vercel deploy hook signing secret, and any HMAC-signed webhook the operator adds later. Does **not** apply to bearer credentials like `AUTH_RESEND_KEY` or `APP_PRIVATE_KEY` — those have their own rotation flows.

**Phase 1 — prepare** (no client-visible change):

1. Generate `NEW_HMAC` (`openssl rand -hex 32`).
2. In n8n, add a **second** credential entry that accepts both `OLD || NEW` for a 24 h grace.
3. Probe the verifier with a request signed by `NEW_HMAC`; expect HTTP 200.

**Phase 2 — commit** (the cutover):

1. `vercel env update <SECRET_NAME>` with the new value, on the affected client's Vercel project.
2. `vercel deploy --prod` (env vars require redeploy).
3. Verify a real Server Action submission signed by `NEW_HMAC` reaches n8n and round-trips correctly. For magic-link rotation, send one to the operator's address and confirm receipt.

**Phase 3 — cleanup, ≥ 24 h later** (close the grace window):

1. Remove the `OLD_HMAC` credential from n8n.
2. Append the rotation event to `docs/clients/<slug>/secrets-log.md` (rotation date, who rotated, why, validation evidence).
3. Update the row's "rotation due" date in the operator's vault.

If anything goes wrong in Phase 2, **revert by deleting the new credential** in n8n; the OLD credential stays valid until Phase 3 cleanup, so the handshake never breaks. This is the property the two-phase pattern buys: the operator can dread rotation and still execute it cleanly.

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
- [ ] No reference to `VENDOR_GITHUB_PAT` outside the Deprecated callout in §3 — the canonical vendor identity is the GitHub App (`§3.X`). A re-introduced PAT reference is the policy hit a future doc-lint pass flags.

The CLI's `validate-client-zone` step does this automatically; the operator does it by eye on any manual push.

---

## 8. Incident response (one page)

If a leak is suspected:

0. **Identify the secret class** before you touch anything. The class picks the rotation procedure:
   - **HMAC-style** (`N8N_HMAC_SECRET`, Vercel deploy hook, Twilio webhook signing): follow the §3.Y two-phase rotation. Skipping the prepare phase guarantees a broken handshake.
   - **GitHub App** (`APP_ID`, `APP_PRIVATE_KEY`, or a leaked installation token): rotate per §3.X (regenerate the App's private key in `Org settings → Developer settings → GitHub Apps`; existing installation tokens auto-expire within 1 h).
   - **Bearer key** (`AUTH_RESEND_KEY`, `AUTH_SECRET`, `OPENAI_API_KEY`, `GEMINI_API_KEY`, `CLAUDE_CODE_OAUTH_TOKEN`, `VENDOR_GITHUB_PAT` while it survives): straight revoke + reissue at the provider, then update the consuming env. No grace window; the handshake is single-sided.
1. **Stop**: disable the relevant secret at its issuer (e.g. regenerate the App's private key, revoke the Resend API key, revoke `VENDOR_GITHUB_PAT` in GitHub Settings → Tokens for the deprecated row). The autopilot will fail loudly; that's fine.
2. **Quarantine**: `npx forge pause --all` — disables all client workflows by setting an org secret to a dummy value.
3. **Rotate**: regenerate every secret in the affected category (use the table in §3).
4. **Audit**: search every client repo for the leaked value with `gh search code --owner palimkarakshay <leaked-prefix>`. If anything matches, force-push the cleaned history.
5. **Notify**: only if a client's data was exposed (PIPEDA + per-province rules). Draft a notification template now (`08-future-work §1`) so panic-day doesn't compound.
6. **Document**: append to `docs/operator/INCIDENT_LOG.md` (mothership repo) — date, scope, action, lesson.

The dashboard's "Recent runs" panel + the operator's "Friday cost check" + this list = the operator's whole security posture. It's small because the surface area is small. Keep it that way.

The recurring operator cadences (monthly checklist, quarterly recovery drill, secret-rotation schedule matrix) live in [`03b-security-operations-checklist.md`](03b-security-operations-checklist.md). This file owns the *principles*; `03b` owns the *cadence*.

*Last updated: 2026-04-29.*
