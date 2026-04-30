<!-- OPERATOR-ONLY. Do not copy to a client repo. -->

# Platform baseline — GitHub + Vercel expected configuration

The **expected** side of the GitHub + Vercel audit. Walked quarterly and
on every secret rotation by [`audit-runbook.md`](audit-runbook.md). The
runbook exports the **actual** configuration via `gh` / Vercel API and
diffs it against this snapshot.

> **Names only.** This file enumerates names, scopes, and policies — never
> values. Values live in the operator vault
> (`docs/mothership/03-secure-architecture.md §3.1`).
>
> **Pair this file with [`variable-registry.md`](variable-registry.md).** The
> registry is the canonical inventory across *all* surfaces (GitHub,
> Vercel, n8n, dashboard, vault). The baseline below is the GitHub +
> Vercel **deployment topology** the audit verifies — branch protection
> rules, Actions permissions, Pages config, webhooks, env-var scopes —
> the things `gh` and the Vercel API can read out of the live
> configuration.

---

## §0 Conventions

- **Source of names**: every secret / variable / env-var below is
  cross-referenced to its row in `variable-registry.md`. When a name
  changes, it changes there first; this file follows.
- **Source of policies** (branch protection, Actions permissions,
  webhook posture): the canonical statement is in
  `docs/mothership/03-secure-architecture.md` and
  `docs/mothership/dual-lane-enforcement-checklist.md`. This file is the
  enumerated, auditable form of those policies for the *current
  single-tenant* repo `palimkarakshay/lumivara-site`.
- **Per-client overrides**: once Dual-Lane Repo
  (`docs/mothership/02b-dual-lane-architecture.md`) spinouts begin, each
  client repo gets its own baseline at
  `docs/clients/<slug>/platform-baseline.md` (mothership-only, never
  mirrored). This file documents the current single-tenant repo only.
- **UI-only items** (Vercel "Ignored Build Step", Production Branch,
  Domains, GitHub Actions allowed-actions detail) are flagged
  `[UI-only]` — the audit runbook records these by screenshot, not by
  CLI.

---

## §1 GitHub repository — `palimkarakshay/lumivara-site`

### §1.1 Actions secrets (repository scope)

Mechanical source: `git grep -hoE 'secrets\.[A-Z_][A-Z0-9_]*' .github/workflows/`.

Cross-reference: [`variable-registry.md §1`](variable-registry.md#1-github-actions--repository--organisation-secrets).

| Name | Owner | Rotation | Notes |
|---|---|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | operator | When `claude setup-token` is re-run; no expiry | Only repo-scoped secret today; migrates to org-scope post-Dual-Lane Repo. |
| `GEMINI_API_KEY` | operator | 12 months | Deep-research + triage fallback. |
| `OPENAI_API_KEY` | operator | 6 months | Codex review primary. |
| `OPENAI_API_KEY_BACKUP` | operator | 6 months (offset 3 months from primary) | Codex review fallback. |
| `VERCEL_API_TOKEN` | operator | 6 months | Deploy / preview-lookup workflows. Mirrored as a Vercel env (§2.1). |
| `VERCEL_PROJECT_ID` | operator | n/a | Configuration. Mirrored as a Vercel env (§2.1). |
| `VERCEL_TEAM_ID` | operator | n/a | Configuration. Mirrored as a Vercel env (§2.1). |
| `GITHUB_TOKEN` | shared | n/a | GitHub-issued, ephemeral, per-run. |

Forbidden: any `*_TOKEN` / `*_KEY` / `*_SECRET` not enumerated above.
The audit runbook §5 files a P0 mismatch for any extra secret found.

### §1.2 Actions repository variables

Mechanical source: `git grep -hoE 'vars\.[A-Z_][A-Z0-9_]*' .github/workflows/`.

Cross-reference: [`variable-registry.md §2`](variable-registry.md#2-github-actions--repository-variables).

| Name | Owner | Rotation | Notes |
|---|---|---|---|
| `DASHBOARD_BASE_PATH` | operator | n/a | Used by `deploy-dashboard.yml`. |
| `DEFAULT_AI_MODEL` | operator | n/a | Set per the model-selection table in `AGENTS.md`. |
| `NEXT_RUN_MODEL_OVERRIDE` | operator | n/a | Single-run override; cleared after use. |
| `PROJECT_NUMBER` | operator | n/a | Set once per project board. |

> Variables (not secrets) are readable in workflow logs. If an audit
> finds a secret-shaped value in a variable, file a P0 mismatch and
> rotate.

### §1.3 Actions permissions

| Surface | Expected | Verify (export) |
|---|---|---|
| Default workflow permissions | `contents: read` (least-privilege baseline) | `gh api repos/palimkarakshay/lumivara-site/actions/permissions/workflow` |
| Allowed actions | "Allow all actions and reusable workflows" today; tighten to "selected" before any per-client repo onboards `[UI-only]` | UI screenshot |
| Workflow run can approve PRs | disabled | `gh api …/actions/permissions/workflow --jq .can_approve_pull_request_reviews` |
| Per-workflow `permissions:` blocks | each workflow file declares the minimum scopes it needs (`issues: write`, `pull-requests: write`, `contents: write`) | `git grep -nE '^\s*permissions:' .github/workflows/` returns one block per workflow |

### §1.4 Branch protection — `main`

Cross-reference: `dual-lane-enforcement-checklist.md` C-MUST-4 and
`docs/mothership/03-secure-architecture.md §2.2`.

| Setting | Expected | Verify |
|---|---|---|
| Required PR reviews | ≥1 | `gh api repos/palimkarakshay/lumivara-site/branches/main/protection --jq '.required_pull_request_reviews.required_approving_review_count'` |
| Conversation resolution required | true | `… --jq '.required_conversation_resolution.enabled'` |
| Required status checks | Vercel deploy preview | `… --jq '.required_status_checks.contexts'` |
| Allow force pushes | false | `… --jq '.allow_force_pushes.enabled'` |
| Allow deletions | false | `… --jq '.allow_deletions.enabled'` |
| Enforce admins | false (operator break-glass) | `… --jq '.enforce_admins.enabled'` |

> Dual-Lane Repo also calls for branch protection on `operator/main` once the
> two-branch overlay is live. This single-tenant repo has no
> `operator/main` yet — the rule is captured here as a **future** row
> for when the spinout (issue #141) lands; the audit runbook §2 already
> exports it so it is monitored.

### §1.5 Rulesets

| Ruleset | Expected scope | Verify |
|---|---|---|
| Repo-level rulesets | none today; `branches/main/protection` is the source of truth | `gh api repos/palimkarakshay/lumivara-site/rulesets --jq '.[]?.name'` returns `[]` |

If a ruleset appears here without a corresponding row added to this
table, file a P1 mismatch and review whether it duplicates or conflicts
with §1.4.

### §1.6 Pages

| Setting | Expected | Verify |
|---|---|---|
| Pages source | branch `gh-pages`, path `/` (operator dashboard publish) | `gh api repos/palimkarakshay/lumivara-site/pages --jq '.source'` |
| Public visibility | public (the build, not the contents — dashboard URL is treated as a secret per §1 rule 4 of `03-secure-architecture.md`) | `… --jq '.public'` |
| Custom domain | none | `… --jq '.cname'` returns `null` |

If `gh api …/pages` returns 404, Pages is disabled — file a P1 mismatch
because `vars.DASHBOARD_BASE_PATH` and `deploy-dashboard.yml` both
expect it enabled.

### §1.7 Webhooks

| Receiver | Expected | Verify |
|---|---|---|
| Repo webhooks | none today (no third-party receivers; n8n receives via Server Action HMAC, not GitHub webhook) | `gh api repos/palimkarakshay/lumivara-site/hooks --jq '.[].config.url'` returns `[]` |

If a webhook appears here, file a P0 mismatch — the trust model assumes
all repo→external traffic flows via Vercel runtime + HMAC, not via
GitHub webhooks.

### §1.8 Issue templates

| Template | Path | Status |
|---|---|---|
| Bug report | `.github/ISSUE_TEMPLATE/bug-report.md` | active |
| Site change | `.github/ISSUE_TEMPLATE/site-change.md` | active |
| Audit mismatch | `.github/ISSUE_TEMPLATE/audit-mismatch.md` | active — used by [`audit-runbook.md §5`](audit-runbook.md#5--file-mismatches) to file one issue per delta |

---

## §2 Vercel project — `lumivara-site` (production)

### §2.1 Environment variables

Mechanical source:

```
git grep -hoE 'process\.env\.[A-Z_][A-Z0-9_]*' src/ | sort -u
```

Plus `.env.local.example` for the `AUTH_*` set (Auth.js reads these via
its own config helper, not `process.env.X` directly in our code, but
they are required at runtime).

Cross-reference: [`variable-registry.md §3`](variable-registry.md#3-vercel-environment-variables).

| Name | Scope | Owner | Rotation | Notes |
|---|---|---|---|---|
| `NEXT_PUBLIC_SITE_URL` | Production + Preview | client | n/a | OG images / sitemap. |
| `NEXT_PUBLIC_CAL_LINK` | Production + Preview | client | n/a | Hero / CTA components. |
| `NEXT_PUBLIC_LUMIVARA_TIER` | Production + Preview | client | n/a | `starter` / `growth` / `scale`. |
| `NEXT_PUBLIC_BEEHIIV_PUBLICATION_ID` | Production + Preview | client | n/a | Newsletter embed. |
| `NEXT_PUBLIC_CRISP_WEBSITE_ID` | Production + Preview | client | n/a | Crisp chat embed. |
| `BEEHIIV_API_KEY` | Production + Preview | shared | 12 months | Newsletter Server Action. |
| `RESEND_API_KEY` | Production + Preview | shared | 6 months | Marketing-email send path. |
| `CONTACT_EMAIL` | Production + Preview | client | n/a | Contact-form destination. |
| `AUTH_SECRET` | Production + Preview | client (per-client) | 12 months | Auth.js JWT signing. |
| `AUTH_RESEND_KEY` | Production + Preview | shared | 6 months | Auth.js Resend (magic-link). |
| `AUTH_GOOGLE_ID` | Production + Preview | client | until OAuth app deleted | Auth.js Google. |
| `AUTH_GOOGLE_SECRET` | Production + Preview | client | until OAuth app deleted | Auth.js Google. |
| `AUTH_MICROSOFT_ENTRA_ID_ID` | Production + Preview | client | until App Registration deleted | Auth.js Entra. |
| `AUTH_MICROSOFT_ENTRA_ID_SECRET` | Production + Preview | client | until App Registration deleted | Auth.js Entra. |
| `AUTH_MICROSOFT_ENTRA_ID_ISSUER` | Production + Preview | client | n/a | Auth.js Entra. |
| `ADMIN_ALLOWLIST_EMAILS` | Production + Preview | client | n/a | CSV; updated on engagement change. |
| `UPSTASH_REDIS_REST_URL` | Production + Preview | shared | rotates with the linked KV store | Auth.js verification adapter. |
| `UPSTASH_REDIS_REST_TOKEN` | Production + Preview | shared | rotates with the linked KV store | Auth.js verification adapter. |
| `KV_REST_API_URL` | Production + Preview | shared | n/a | Alias of `UPSTASH_REDIS_REST_URL`. |
| `KV_REST_API_TOKEN` | Production + Preview | shared | rotates with the store | Alias of `UPSTASH_REDIS_REST_TOKEN`. |
| `GITHUB_REPO` | Production + Preview | client | n/a | `owner/name` slug. |
| `GITHUB_TOKEN` | Production + Preview | operator | 90 days | Vendor PAT — distinct from the workflow built-in. |
| `N8N_HMAC_SECRET` | Production + Preview | shared (per-client) | 12 months (two-phase) | Server Action signing. |
| `N8N_INTAKE_WEBHOOK_URL` | Production + Preview | operator | n/a | Phase-2 admin intake. |
| `N8N_DECISION_WEBHOOK_URL` | Production + Preview | operator | n/a | Phase-4 client-input. |
| `N8N_DEPLOY_WEBHOOK_URL` | Production + Preview | operator | n/a | Phase-5 deploy-confirmed. |
| `VERCEL_API_TOKEN` | Production + Preview | operator | 6 months | Preview lookups. |
| `VERCEL_PROJECT_ID` | Production + Preview | client | n/a | Same lookups. |
| `VERCEL_TEAM_ID` | Production + Preview | operator | n/a | Same lookups (team only). |
| `VERCEL_DEPLOY_HOOK_LUMIVARA` | Production + Preview | client | rotates on hook recreate | n8n deploy-confirmed. |

Per-client `VERCEL_DEPLOY_HOOK_<UPPERSLUG>` names follow the same
shape; today only `VERCEL_DEPLOY_HOOK_LUMIVARA` exists. Each spinout
adds one row keyed by client slug.

> **Parity check.** The audit runbook §4 diffs this list against the
> live `curl https://api.vercel.com/v10/projects/<id>/env` output. Any
> name in the live output that is not in this table is a P0/P1
> mismatch (P0 if it looks secret-shaped; P1 otherwise). Any name in
> this table that is missing live is a P1 mismatch — the build will
> fail at runtime.

### §2.2 Production branch and deploy posture

| Setting | Expected | Verify |
|---|---|---|
| Production branch | `main` | `[UI-only]` Vercel → Settings → Git |
| Ignored build step | none | `[UI-only]` Vercel → Settings → Git |
| Auto-assign canonical domain | enabled | `[UI-only]` Vercel → Settings → Domains |
| Deploy hooks | one per client (today: `VERCEL_DEPLOY_HOOK_LUMIVARA`) | `[UI-only]` Vercel → Settings → Git → Deploy Hooks |
| GitHub integration | repo `palimkarakshay/lumivara-site`, branch `main` deploys to Production, all other branches deploy to Preview | `[UI-only]` Vercel → Settings → Git |

### §2.3 Domains

| Domain | Expected | Verify |
|---|---|---|
| Production custom domain | `lumivara.ca` (canonical) | `[UI-only]` Vercel → Settings → Domains |
| Apex / `www` | redirect to canonical | `[UI-only]` |
| TLS / certificate provisioning | Vercel-managed | `[UI-only]` |

> If DNS is operator-managed via Cloudflare (per
> `variable-registry.md §6` row `Cloudflare DNS API token`), confirm
> the Cloudflare zone matches the Vercel-expected records during the
> audit.

### §2.4 Webhooks (Vercel → external)

| Receiver | Expected | Verify |
|---|---|---|
| Vercel → n8n deploy hook | one per client; today only `VERCEL_DEPLOY_HOOK_LUMIVARA` (mirrored as a deploy-hook URL Vercel posts to on every successful production deploy) | `[UI-only]` Vercel → Settings → Webhooks |

---

## §3 Drift signals

These are the "smells" the audit runbook §4 watches for. Any single
signal blocks the audit closing clean.

- A `secrets.X` reference appears in `.github/workflows/*` that does
  not exist as a row in §1.1.
- A `process.env.X` reference appears in `src/` that does not exist as
  a row in §2.1.
- The live `gh api repos/.../actions/secrets` response contains a name
  that is not in §1.1 — file P0 (could be an unexpired sneak-in).
- Any name in §1.1 / §2.1 has been silently **removed** from the live
  config without a corresponding deletion in this baseline plus a
  removal of the ref from `.github/workflows/` or `src/` — P1, runtime
  will break on next deploy or workflow run.
- Branch protection on `main` differs from §1.4 in any field — P0 for
  force-push / deletion / status-check changes; P1 otherwise.
- A repo webhook appears at all (§1.7 expects zero) — P0.

---

## §4 Last-verified stamp

_Last verified: 2026-04-29 by operator (initial baseline). Audit cadence: quarterly + on every secret rotation. Audit runbook: `audit-runbook.md`._

When you re-verify:

1. Re-run all mechanical sources (`git grep` recipes in §1.1, §1.2, §2.1).
2. Run the export commands enumerated under each "Verify" cell.
3. Diff the actual output against the rows in §1 / §2.
4. File one issue per mismatch via
   [`.github/ISSUE_TEMPLATE/audit-mismatch.md`](../../.github/ISSUE_TEMPLATE/audit-mismatch.md).
5. Update the date above and bump the `_Last verified_` line in
   `variable-registry.md §7`.
