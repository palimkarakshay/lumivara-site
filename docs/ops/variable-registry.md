<!-- OPERATOR-ONLY. Do not copy to a client repo. -->

# Variable registry

Single source of truth for every named key the system depends on, across
GitHub Actions, Vercel, n8n, the operator dashboard, and the operator's
vault. The audit cadence in
[`docs/mothership/03-secure-architecture.md §3.2`](../mothership/03-secure-architecture.md#32-audit-cadence)
walks this file once a quarter and on every secret rotation.

> **Names only.** Never put secret *values* in this file. Values live in
> the operator vault (`docs/mothership/03-secure-architecture.md §3.1`).
> A reviewer should grep the diff for high-entropy strings before merge:
> `git diff main -- docs/ops/variable-registry.md | grep -E '[A-Za-z0-9+/=]{32,}'`
> must return nothing.

---

## §0 Conventions

Each row in §1–§5 has these columns:

| Column | Meaning |
|---|---|
| **Name** | The literal key — what `secrets.X`, `vars.X`, `process.env.X`, or the n8n credential UI shows. |
| **Scope** | One of `github-secret-repo`, `github-secret-org`, `github-var-repo`, `vercel-env`, `n8n-credential`, `dashboard-var`, `operator-vault`. |
| **Owner** | `operator` (rotated by operator, not exposed to client), `client` (per-client value, lives in the client's Vercel project), `shared` (operator rotates one value, mirrored across every client's Vercel env). |
| **Rotation** | Cadence or trigger. `n/a` is reserved for non-secret configuration. |
| **Where referenced** | Repo paths (e.g. `.github/workflows/triage.yml`, `src/lib/github.ts`) or `operator dashboard UI only` for keys held only in n8n / dashboard config. |

**Per-client overrides.** Once Pattern C (`docs/mothership/02b-pattern-c-architecture.md`)
spinouts begin, per-client variations live in
`docs/clients/<slug>/variable-registry.md` (mothership-only, never
mirrored into the client repo). This file documents the *current
single-tenant* repo; per-client divergence belongs in the per-client
registry.

**Synonyms / aliases.** When the same secret value is exposed under two
names (e.g. Vercel KV's `KV_REST_API_*` automatically populated alongside
the linked store's `UPSTASH_REDIS_REST_*`), both names get a row, and the
**Where referenced** column notes the alias.

---

## §1 GitHub Actions — repository / organisation secrets

Source: `git grep -hoE 'secrets\.[A-Z_][A-Z0-9_]*' .github/workflows/`.

| Name | Scope | Owner | Rotation | Where referenced |
|---|---|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | `github-secret-repo` (today) → `github-secret-org` (post-Pattern C) | operator | When `claude setup-token` is re-run; no expiry | `.github/workflows/triage.yml`, `execute*.yml`, `plan-issues.yml`, `deep-research.yml`, `auto-merge.yml`, `ai-smoke-test.yml`, `setup-cli.yml` |
| `GEMINI_API_KEY` | `github-secret-repo` → `github-secret-org` | operator | 12 months | `.github/workflows/deep-research.yml`, `triage.yml` (fallback path) |
| `OPENAI_API_KEY` | `github-secret-repo` → `github-secret-org` | operator | 6 months | `.github/workflows/codex-review.yml` (and the codex fallback in `triage.yml`) |
| `OPENAI_API_KEY_BACKUP` | `github-secret-repo` → `github-secret-org` | operator | 6 months (offset 3 months from primary) | Codex review fallback when `OPENAI_API_KEY` rate-limits |
| `VERCEL_API_TOKEN` | `github-secret-repo` | operator | 6 months | Deploy / preview-lookup workflows; mirrored as a Vercel env (§3) |
| `VERCEL_PROJECT_ID` | `github-secret-repo` | operator | n/a (configuration; rotates only on project recreate) | Deploy workflows; mirrored as a Vercel env (§3) |
| `VERCEL_TEAM_ID` | `github-secret-repo` | operator | n/a (configuration) | Deploy workflows; mirrored as a Vercel env (§3) |
| `GITHUB_TOKEN` | built-in (auto-issued by GitHub Actions per run) | shared | n/a (GitHub-issued, ephemeral) | Every workflow that calls `gh` / Octokit |

> **Vendor PAT (`VENDOR_GITHUB_PAT`)** — *not currently a workflow secret on this repo*; held only in n8n credentials (§4). Listed here as a forward-looking name so post-Pattern C migration finds the row already drafted.

> Secrets `GEMINI_API_KEY` and `OPENAI_API_KEY*` may also appear with workflow-local aliases (e.g. an `env: ANTHROPIC_API_KEY: ${{ secrets.CLAUDE_CODE_OAUTH_TOKEN }}` line). The alias is internal to the workflow; the canonical name is the one in the table.

---

## §2 GitHub Actions — repository variables

Source: `git grep -hoE 'vars\.[A-Z_][A-Z0-9_]*' .github/workflows/`.

| Name | Scope | Owner | Rotation | Where referenced |
|---|---|---|---|---|
| `DASHBOARD_BASE_PATH` | `github-var-repo` | operator | n/a (configuration) | `.github/workflows/deploy-dashboard.yml` |
| `DEFAULT_AI_MODEL` | `github-var-repo` | operator | n/a (set per the model-selection table in `AGENTS.md`) | Triage / execute workflows that pick a model |
| `NEXT_RUN_MODEL_OVERRIDE` | `github-var-repo` | operator | n/a (single-run override; cleared after use) | Triage / execute workflows |
| `PROJECT_NUMBER` | `github-var-repo` | operator | n/a (set once per project board) | `.github/workflows/project-sync.yml` |

> Variables (not secrets) are readable in workflow logs. Don't promote a secret to a variable to "make it easier to see" — if it's secret, it stays in §1.

---

## §3 Vercel environment variables

Sources:

- `git grep -hoE 'process\.env\.[A-Z_][A-Z0-9_]*' src/`
- `.env.local.example`

| Name | Scope | Owner | Rotation | Where referenced |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | `vercel-env` (Production + Preview) | client | n/a (configuration) | `src/lib/site-config.ts`, OG image / sitemap routes |
| `NEXT_PUBLIC_CAL_LINK` | `vercel-env` | client | n/a | Hero / CTA components |
| `NEXT_PUBLIC_LUMIVARA_TIER` | `vercel-env` | client | n/a (per-build tier flag: `starter` / `growth` / `scale`) | Tier-gated feature flags |
| `NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID` | `vercel-env` | client | n/a | Newsletter embed |
| `NEXT_PUBLIC_CRISP_WEBSITE_ID` | `vercel-env` | client | n/a | Crisp chat embed |
| `BEEHIIV_API_KEY` | `vercel-env` | shared (operator owns the publication) | 12 months | Newsletter subscribe Server Action |
| `RESEND_API_KEY` | `vercel-env` | shared | 6 months | Marketing-email send path |
| `CONTACT_EMAIL` | `vercel-env` | client | n/a | Destination for contact-form submissions |
| `AUTH_SECRET` | `vercel-env` | client (per-client) | 12 months | Auth.js v5 JWT signing |
| `AUTH_RESEND_KEY` | `vercel-env` | shared (one operator Resend key per practice) | 6 months (rotation = update every client's Vercel env) | Auth.js Resend (magic-link) provider |
| `AUTH_GOOGLE_ID` | `vercel-env` | client (per-client OAuth app) | Until OAuth app is deleted | Auth.js Google provider |
| `AUTH_GOOGLE_SECRET` | `vercel-env` | client | Until OAuth app is deleted | Auth.js Google provider |
| `AUTH_MICROSOFT_ENTRA_ID_ID` | `vercel-env` | client | Until App Registration is deleted | Auth.js Entra provider |
| `AUTH_MICROSOFT_ENTRA_ID_SECRET` | `vercel-env` | client | Until App Registration is deleted | Auth.js Entra provider |
| `AUTH_MICROSOFT_ENTRA_ID_ISSUER` | `vercel-env` | client | n/a (configuration) | Auth.js Entra provider |
| `ADMIN_ALLOWLIST_EMAILS` | `vercel-env` | client | n/a (CSV of decision-makers; updated on engagement change) | `src/lib/admin-allowlist.ts` fallback |
| `UPSTASH_REDIS_REST_URL` | `vercel-env` (auto-injected by linked Vercel KV store) | shared | n/a (rotates with the KV store) | Auth.js verification-token adapter |
| `UPSTASH_REDIS_REST_TOKEN` | `vercel-env` (auto-injected) | shared | Rotated by recreating the KV store | Auth.js verification-token adapter |
| `KV_REST_API_URL` | `vercel-env` (auto-injected) | shared | n/a | Alias of `UPSTASH_REDIS_REST_URL`; emitted by the Vercel KV integration |
| `KV_REST_API_TOKEN` | `vercel-env` (auto-injected) | shared | Rotated with the store | Alias of `UPSTASH_REDIS_REST_TOKEN` |
| `GITHUB_REPO` | `vercel-env` | client | n/a (`owner/name` slug) | `src/lib/github.ts`, dashboard reads |
| `GITHUB_TOKEN` | `vercel-env` (vendor PAT, distinct from the workflow built-in) | operator | 90 days | `src/lib/github.ts` admin-portal Octokit calls |
| `N8N_HMAC_SECRET` | `vercel-env` (per-client) | shared (operator generates; mirrored into n8n credential) | 12 months (two-phase rotation, see `docs/mothership/03-secure-architecture.md §4`) | `src/app/api/admin/**` Server Actions; n8n verifies the signature |
| `N8N_INTAKE_WEBHOOK_URL` | `vercel-env` | operator | n/a (rotates only if the n8n workflow URL changes) | Phase-2 admin-portal intake Server Action |
| `N8N_DECISION_WEBHOOK_URL` | `vercel-env` | operator | n/a | Phase-4 client-input-record Server Action |
| `N8N_DEPLOY_WEBHOOK_URL` | `vercel-env` | operator | n/a | Phase-5 deploy-confirmed Server Action |
| `VERCEL_API_TOKEN` | `vercel-env` | operator | 6 months | `/admin/client/.../preview` and request-detail page lookups |
| `VERCEL_PROJECT_ID` | `vercel-env` | client | n/a | Same lookups |
| `VERCEL_TEAM_ID` | `vercel-env` | operator | n/a | Same lookups (only set when project lives under a team) |
| `VERCEL_DEPLOY_HOOK_LUMIVARA` | `vercel-env` | client (per-client suffix; canonical name is `VERCEL_DEPLOY_HOOK_<UPPERSLUG>`) | n/a (rotates only if the deploy hook is recreated) | n8n's deploy-confirmed workflow |
| `NODE_ENV` | runtime (set by Vercel / Next.js) | n/a | n/a | Standard Node convention; not configured by the operator |

> **Per-client `VERCEL_DEPLOY_HOOK_<UPPERSLUG>`.** Today only `VERCEL_DEPLOY_HOOK_LUMIVARA` exists. Each new client engagement (`docs/TEMPLATE_REBUILD_PROMPT.md §B2 #5`) creates a new uppercase-slug suffixed key. They all share Owner = client, Rotation = on hook recreation.

> **`.env.local.example` parity.** When a row is added to §3 it must also be added (with empty value + comment) to `.env.local.example` so local dev parity holds. The example file is excluded from the auto-routine playbook (`.env*` is a hard exclusion) — the operator updates it manually after this registry changes.

---

## §4 n8n credentials

Source: [`docs/N8N_SETUP.md`](../N8N_SETUP.md) and
[`docs/mothership/03-secure-architecture.md §3`](../mothership/03-secure-architecture.md#3-secret-topology).
n8n is a single operator-controlled Railway instance; separation across
clients is per-workflow, not per-instance.

| Name | Scope | Owner | Rotation | Where referenced |
|---|---|---|---|---|
| `GitHub API` (vendor PAT — `VENDOR_GITHUB_PAT`) | `n8n-credential` | operator | 90 days; calendar reminder | All `intake-*` and `client-input-record-*` workflows; HTTP Request → GitHub API nodes |
| `Cal.com webhook secret` | `n8n-credential` (HTTP Header Auth) | operator | 12 months | Cal.com → GitHub Issue workflow |
| `Crisp API` | `n8n-credential` (HTTP Header Auth or Basic Auth) | operator | 12 months | Crisp → GitHub Issue workflow |
| `Twilio Account SID` + `Auth Token` | `n8n-credential` | operator | 12 months | Per-client SMS lane (`intake-sms-{{CLIENT_SLUG}}`) |
| `IMAP / email` | `n8n-credential` | operator | 6 months (or whenever the IMAP app password is regenerated) | `intake-email-{{CLIENT_SLUG}}` |
| `Resend API` (`AUTH_RESEND_KEY` source) | `n8n-credential` | operator | 6 months (mirrors §3 `AUTH_RESEND_KEY` rotation) | Magic-link sender for `client-input-notify-{{CLIENT_SLUG}}` |
| `Anthropic API` (n8n AI structuring) | `n8n-credential` | operator | 6 months | AI structuring node inside intake workflows; **distinct** from `CLAUDE_CODE_OAUTH_TOKEN` |
| `Gemini API` (fallback) | `n8n-credential` | operator | 12 months | AI structuring fallback path |
| `OpenAI API` (fallback) | `n8n-credential` | operator | 6 months | AI structuring fallback path |
| n8n basic-auth (`N8N_BASIC_AUTH_USER` / `_PASSWORD`) | n8n environment (Railway) | operator | 12 months | Login to the n8n editor itself; configured in Railway, not here |
| `N8N_HMAC_SECRET` (per-client mirror) | `n8n-credential` | shared | 12 months (two-phase rotation) | Webhook signature verification on every inbound n8n route |

> n8n's HMAC mirror is the same value as §3 `N8N_HMAC_SECRET`. Both rows deliberately use the same Owner / Rotation cadence — when the operator rotates one, the other rotates in the same procedure.

---

## §5 Dashboard variables

Source: `dashboard/`. The operator dashboard is a Vite app deployed via
GitHub Pages and reads its config at build time.

| Name | Scope | Owner | Rotation | Where referenced |
|---|---|---|---|---|
| `VITE_BASE` | `dashboard-var` | operator | n/a (configuration; matches the GitHub Pages base path) | `dashboard/vite.config.ts`; emitted by `.github/workflows/deploy-dashboard.yml` |

> The dashboard itself is **operator-only** (`docs/mothership/03-secure-architecture.md §1` rule 4) — its hostname is treated as a secret and never linked from the public marketing site.

---

## §6 Operator vault entries (names only)

The operator vault holds long-lived credentials that the autopilot itself
never reads. They are listed here for completeness so the audit cadence
catches them, but their *values* live only in the vault
(`docs/mothership/03-secure-architecture.md §3.1`).

| Name | Scope | Owner | Rotation | Where referenced |
|---|---|---|---|---|
| `Vercel API token` (operator-CLI) | `operator-vault` | operator | 6 months | `provision` CLI, manual `vercel` invocations |
| `Stripe / Lemon Squeezy keys` | `operator-vault` | operator | 12 months | Invoicing scripts (out of repo) |
| `Resend account password / 2FA recovery` | `operator-vault` | operator | n/a (recovery material) | Resend dashboard recovery only |
| `GitHub Owner break-glass` (1FA recovery codes for the operator's GitHub Owner identity) | `operator-vault` | operator | n/a (regenerated on use) | `docs/mothership/12-critique-security-secrets.md` Single-Owner break-glass |
| `Anthropic / Gemini / OpenAI account credentials` | `operator-vault` | operator | n/a | Provider dashboards for key issuance |
| `Cloudflare DNS API token` | `operator-vault` | operator | 12 months | Domain DNS edits during onboarding |
| `Twilio account credentials` | `operator-vault` | operator | n/a | Twilio dashboard recovery only |

> Per-client `pass` entries (`engagements/<slug>/...`) follow the same shape but live under per-client paths in the vault tree; they are out of scope for this registry.

---

## §7 Last-verified stamp

_Last verified: 2026-04-29 by operator. Audit cadence: quarterly + on every secret rotation. Audit runbook: `docs/ops/audit-runbook.md` (deferred — issue #145)._

When you re-verify:

1. Re-run the source greps in §1, §2, §3 below.
2. Diff the output against the rows in this file. New names must be added; removed names must be deleted.
3. Confirm no high-entropy strings have leaked into the diff.
4. Update the date above.

```
git grep -hoE 'secrets\.[A-Z_][A-Z0-9_]*' .github/workflows/ | sort -u
git grep -hoE 'vars\.[A-Z_][A-Z0-9_]*'    .github/workflows/ | sort -u
git grep -hoE 'process\.env\.[A-Z_][A-Z0-9_]*' src/ dashboard/ | sort -u
```

---

## §8 Deferred CI check — `check-undocumented-vars`

The execute-agent playbook excludes `scripts/` and `.github/workflows/`
from auto-routine work, so the lint script and its CI job are filed as a
follow-up issue rather than authored here. This section captures the
*requirements* so the follow-up can be implemented without further
interpretation.

**Goal:** fail CI on any new `secrets.X`, `vars.X`, or `process.env.X`
reference that does not appear as a row in this registry.

**Inputs (greps):**

```
git grep -hoE 'secrets\.[A-Z_][A-Z0-9_]*'      .github/workflows/
git grep -hoE 'vars\.[A-Z_][A-Z0-9_]*'         .github/workflows/
git grep -hoE 'process\.env\.[A-Z_][A-Z0-9_]*' src/ dashboard/
git grep -hoE 'import\.meta\.env\.[A-Z_][A-Z0-9_]*' dashboard/
```

**Comparison rule:** every extracted name must appear as a `Name` cell
in §1, §2, §3, or §5. Names listed in §6 (operator-vault) and §4
(n8n-credential) are *not* eligible — they are not referenced in repo
source.

**Failure mode:** print the list of undocumented names with their first
file/line of reference, exit 1.

**Allow-list:** the following names may be referenced in code without a
registry row, because they are language / runtime built-ins:

- `process.env.NODE_ENV`
- `secrets.GITHUB_TOKEN` (auto-issued by GitHub Actions per run)

**Workflow integration:** a new `.github/workflows/check-vars.yml`
(deferred follow-up) gates PRs that touch `.github/workflows/`, `src/`,
`dashboard/`, or `docs/ops/variable-registry.md`.

**Suggested implementation language:** Python (matches `scripts/lib/`
existing tooling) or POSIX shell. Tool name:
`scripts/check-undocumented-vars.{py,sh}`.

**Follow-up issue:** to be filed alongside the PR that closes #142;
linked from the PR description and from `docs/BACKLOG.md`.
