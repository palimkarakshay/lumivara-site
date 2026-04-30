# Security ⚪

> **Lane:** ⚪ Both — split into §A 🛠 Operator and §B 🌐 Client below. See [[_partials/lane-key]] for the badge legend.
>
> The canonical security policy is in `.github/SECURITY.md` at the root of `<client-repo>`. This page provides supplementary context for both lanes.
>
> _Client example — see `docs/mothership/15-terminology-and-brand.md §7`._ For Client #1 today the file is at [`.github/SECURITY.md` on `palimkarakshay/lumivara-site`](https://github.com/palimkarakshay/lumivara-site/blob/main/.github/SECURITY.md).

## Reporting a vulnerability ⚪

**Do not open a public Issue for security bugs.** Email **hello@lumivara.ca** instead.

Include:
- Description and potential impact
- Steps to reproduce / PoC
- Affected URL(s) or component(s)

Response SLA: acknowledgement within 48 h, status update within 7 days.

---

## §A Operator-side security 🛠

> <!-- do-not-copy:v1 -->
> **🛠 Do not copy to client repos.** This section describes operator-side machinery that
> lives in the mothership repo or in a per-client pipeline repo (`<brand-slug>/<client-slug>-pipeline`).
> Under [Dual-Lane Repo (locked 2026-04-28)](../mothership/02b-dual-lane-architecture.md), a client cloning
> their `<client-slug>-site` repo cannot reach the pipeline repo at all — the client is not added
> as a collaborator on it. If you are the operator scaffolding a new client repo, **omit this
> section from the per-client wiki**.

The autopilot has more attack surface than a client repo because it stores credentials, runs cron, and talks to external AI providers and n8n. The full posture lives in `docs/mothership/03-secure-architecture.md`; this page is the working summary.

### Org secrets

- **Production secrets** for any client repo live in **Vercel → Settings → Environment Variables** *of that client's project*. They are mirrored manually by the operator (see "Vercel mirror" in `CLAUDE.md`/`AGENTS.md`).
- **Operator secrets** (`CLAUDE_CODE_OAUTH_TOKEN`, vendor PATs, n8n HMAC keys) live as **org-level GitHub secrets** on the operator's GitHub org and are scoped per repo.
- The mothership repo is the only repo that holds the OAuth token referenced by the autopilot workflows. Per-client repos pull it from the org scope at workflow runtime — never as a repo-level secret.

### Variable registry (canonical inventory)

Every named key — GitHub Actions secrets and variables, Vercel env vars, n8n credentials, dashboard vars, operator-vault entries — is enumerated in [`docs/ops/variable-registry.md`](../ops/variable-registry.md) with scope, owner, rotation cadence, and source references. **The registry is the audit surface**; the rest of this page links into it rather than duplicating names. When a new key is introduced anywhere in the system, add a row to the registry in the same PR.

### Periodic GitHub + Vercel audit

Quarterly (and on every secret rotation, branch-protection change, or new client repo onboarded), walk [`docs/ops/audit-runbook.md`](../ops/audit-runbook.md) end-to-end. The runbook diffs the live `gh api` / Vercel API exports against [`docs/ops/platform-baseline.md`](../ops/platform-baseline.md) (the *expected* topology — secrets, vars, branch protection, Pages, webhooks, env-var scopes) and files one issue per delta via the [`audit-mismatch`](../../.github/ISSUE_TEMPLATE/audit-mismatch.md) template. The runbook ends by bumping the `_Last verified_` stamps in the baseline + registry. Audits are operator-attested (`human-only`), not auto-merged.

### Vendor identity (GitHub App, replaces VENDOR_GITHUB_PAT)

Dual-Lane Repo identifies the autopilot through a **GitHub App** (`{{BRAND_SLUG}}-pipeline-bot`) installed at the org level, with one installation per engagement on the matched site repo. Workflows mint a short-lived (≤1 h TTL) installation token per run; nothing long-lived is stored. The legacy `VENDOR_GITHUB_PAT` is retired (see [`docs/mothership/02b-dual-lane-architecture.md §3`](../mothership/02b-dual-lane-architecture.md) and [`12-critique-security-secrets.md §4`](../mothership/12-critique-security-secrets.md)). Permissions on each installed site repo: `Issues:RW`, `Pull requests:RW`, `Contents:RW`, `Metadata:R`, `Workflows:R`. Org secrets that hold the App credentials: `APP_ID` + `APP_PRIVATE_KEY` (rotation: annual via App settings; the rotation matrix lives in [`docs/mothership/03b-security-operations-checklist.md §4`](../mothership/03b-security-operations-checklist.md)).

### n8n HMAC

Every webhook from a client's contact API or admin portal back into n8n is signed with a per-client HMAC key. Two-phase rotation procedure (issue new key → both accepted → retire old key) is documented in `docs/mothership/03-secure-architecture.md §4`. Never log raw HMAC keys; never check them into a repo.

### Dashboard URL secrecy

The operator dashboard (built from `dashboard/` in the mothership repo) is **not** publicly indexed. Its hostname is treated as a secret: the operator never posts the URL in a client-shared chat, an issue body, a commit message, or a PR description. If the URL leaks, treat it as an incident — rotate the auth path immediately.

### Dual-Lane Repo zone isolation (two-repo trust model)

The two-repo split (`<slug>-site` ↔ `<slug>-pipeline`) is a **structural** security boundary, not a convention. The client's site repo `main` deploys to Vercel; the pipeline repo never touches Vercel and never carries client production secrets. The client has no Read access to the pipeline repo at all — the boundary is enforced by **GitHub permissions**, not by branch-listing politeness. See [`docs/mothership/02b-dual-lane-architecture.md`](../mothership/02b-dual-lane-architecture.md) for the canonical model, [`03-secure-architecture.md §2`](../mothership/03-secure-architecture.md) for the cost-firewall implications, and the [`dual-lane-enforcement-checklist.md`](../mothership/dual-lane-enforcement-checklist.md) for the MUST / MUST-NOT control rows.

### GitHub-specific settings (operator side)

- **Branch protection on site repo `main`**: PR review (1) required, Vercel preview status check required, force-push off, deletion off, push restricted to the GitHub App + operator. Per [`02b §7`](../mothership/02b-dual-lane-architecture.md).
- **Branch protection on pipeline repo `main`**: PR review (1, operator-only) required, auto-merge disabled, force-push off, deletion off, push restricted to operator. Code Owners required for `.github/workflows/`. Per [`02b §7`](../mothership/02b-dual-lane-architecture.md).
- **Workflow permissions**: read-only by default; write access only where explicitly granted in the workflow's `permissions:` block.
- **Org secrets** (scoped per pipeline repo via `Repository access: Selected`): `CLAUDE_CODE_OAUTH_TOKEN`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `APP_ID`, `APP_PRIVATE_KEY`. The full inventory is in [`docs/ops/variable-registry.md`](../ops/variable-registry.md).

### Single-Owner break-glass

The org-Owner principal is the *only* principal that can recover the autopilot if the bot account or the OAuth token are revoked. Document the recovery sequence in the operator's offline runbook (out-of-repo, in the operator's password manager). The break-glass procedure itself is the gap closed by Run B — see `docs/mothership/12-critique-security-secrets.md`.

### Operator IP / business-secrets vault

Operator-side artefacts that are not consumed by Vercel/n8n at runtime — recovery codes, draft contracts, vendor portal credentials, per-client correspondence, the second-Owner break-glass material — live in a dedicated vault, **not** in this repo and **not** in the per-client Vercel/n8n topology. The vault choice, structure (`Operator` / `Lumivara-Forge-IP` / `Vendors` / `Per-client/<slug>` / `Break-glass`), access roles, rotation cadence, onboarding SOP, and the decision tree for "vaultable vs. ordinary repo content" are all in [`docs/mothership/21-vault-strategy-adr.md`](../mothership/21-vault-strategy-adr.md). The recurring monthly audit is row 8 of [`docs/mothership/03b-security-operations-checklist.md §1`](../mothership/03b-security-operations-checklist.md#1--monthly-checklist-first-monday-of-the-month).

---

## §B Client-repo security 🌐

> **🌐 Safe to copy to a client repo.** This section is intentionally written so a client (or a future operator scaffolding a new client repo) can paste it into the per-client wiki unchanged. It only references things the client *can* see.

A client repo is a clean Next.js site — no autopilot machinery, no operator credentials, no cron jobs. Its security posture is therefore narrow but important.

### Branch protection on `main`

- Force-push disabled
- Require PR review before merge (the operator is the reviewer-of-record)
- Status checks required: Vercel deploy preview must pass

### Secret hygiene

- Never commit `.env.local` or any file containing API keys, tokens, or credentials.
- Production env vars live in **Vercel → Settings → Environment Variables** for the client's project; never in the repo.
- `.env.local.example` lists *names* and *purpose* only — never values.
- The full canonical inventory of every named key (with scope, owner, rotation, and references) is at [`docs/ops/variable-registry.md`](../ops/variable-registry.md). Keep that file in sync with `.env.local.example` whenever a new env var is introduced.

### Contact form trust boundary (`/api/contact`)

The contact form endpoint is the highest-risk surface in a client repo. It:
- Receives user-submitted data
- Is excluded from automated bot execution (human review only)
- Uses Zod for input validation at the API boundary
- Forwards (when configured) to an operator-controlled n8n webhook signed with the per-client HMAC key — the client's `main` only sees the *outbound* HTTP call, not the secret material

Treat any change to `src/app/api/contact/*` as a security-sensitive change: open an issue, label `human-only`, and email **hello@lumivara.ca** to flag.

### Dependencies

- Packages are pinned in `package-lock.json`.
- Run `npm audit` before adding or upgrading dependencies.
- Dependency upgrades are human-only (excluded from the bot).

### Bot-touch boundary (visible from a client repo)

The autopilot opens PRs against `auto/issue-*` branches and never pushes to `main`. From the client's vantage point this means:
- A new PR on `<client-repo>` has been authored by the bot account; the operator is the reviewer.
- The PR cannot touch workflows, env files, or `src/app/api/contact/*` — those paths are forbidden by the bot playbooks. Under Dual-Lane Repo, workflow files don't exist on the site repo at all (they live in the pipeline repo per [`02b §1`](../mothership/02b-dual-lane-architecture.md)); env files and the contact API are excluded by [`scripts/execute-prompt.md`](../../scripts/execute-prompt.md) hard exclusions.
- The client's `main` is therefore safe to deploy via Vercel without further hardening.

- **Branch protection on `main`**: enforced via GitHub repository settings
- **Workflow permissions**: read-only by default; write access only where explicitly granted
- **Secrets**: `CLAUDE_CODE_OAUTH_TOKEN` is the only repository secret; it is scoped to the Pro subscription OAuth token and never logs to workflow output

## Dual-Lane Repo compliance (operator-side)

The two-repo trust model that keeps operator IP and per-client costs invisible to clients is enforced by an explicit checklist in the mothership pack: [`docs/mothership/dual-lane-enforcement-checklist.md`](../mothership/dual-lane-enforcement-checklist.md). Walk that file before any spinout (its §4 pre-migration gate) and immediately after (its §5 post-migration verification). The checklist is the single MUST / MUST-NOT control surface; the canonical architecture statement lives in [`docs/mothership/02b-dual-lane-architecture.md`](../mothership/02b-dual-lane-architecture.md), with the secret topology in [`03-secure-architecture.md`](../mothership/03-secure-architecture.md). The recurring sweep job at [`scripts/dual-lane-audit.sh`](../../scripts/dual-lane-audit.sh) keeps drift from accumulating between audits, and [`/.dual-lane.yml`](../../.dual-lane.yml) is the machine-readable lane manifest the spinout reads.

See `.github/SECURITY.md` at the root of `<client-repo>` for the canonical disclosure policy.

> _Client example — see `docs/mothership/15-terminology-and-brand.md §7`._ For Client #1: [`.github/SECURITY.md` on `palimkarakshay/lumivara-site`](https://github.com/palimkarakshay/lumivara-site/blob/main/.github/SECURITY.md).
