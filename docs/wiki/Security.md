# Security ⚪

> **Lane:** ⚪ Both — split into §A 🛠 Operator and §B 🌐 Client below. See [[_partials/lane-key]] for the badge legend.
>
> The canonical security policy is in [`.github/SECURITY.md`](https://github.com/palimkarakshay/lumivara-site/blob/main/.github/SECURITY.md). This page provides supplementary context for both lanes.

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
> lives on the mothership repo or on the `operator/main` overlay branch of a client
> repo. A client cloning their `main` will never see this content. If you are the
> operator scaffolding a new client repo, **omit this section from the per-client wiki**.

The autopilot has more attack surface than a client repo because it stores credentials, runs cron, and talks to external AI providers and n8n. The full posture lives in `docs/mothership/03-secure-architecture.md`; this page is the working summary.

### Org secrets

- **Production secrets** for any client repo live in **Vercel → Settings → Environment Variables** *of that client's project*. They are mirrored manually by the operator (see "Vercel mirror" in `CLAUDE.md`/`AGENTS.md`).
- **Operator secrets** (`CLAUDE_CODE_OAUTH_TOKEN`, vendor PATs, n8n HMAC keys) live as **org-level GitHub secrets** on the operator's GitHub org and are scoped per repo.
- The mothership repo is the only repo that holds the OAuth token referenced by the autopilot workflows. Per-client repos pull it from the org scope at workflow runtime — never as a repo-level secret.

### Vendor PAT

The bot account's classic PAT (used to open PRs and apply labels) is a fine-grained token scoped to: `contents:write`, `issues:write`, `pull_requests:write` on the operator's org only. Rotate every 90 days; the rotation runbook is in `docs/mothership/03-secure-architecture.md §6`.

### n8n HMAC

Every webhook from a client's contact API or admin portal back into n8n is signed with a per-client HMAC key. Two-phase rotation procedure (issue new key → both accepted → retire old key) is documented in `docs/mothership/03-secure-architecture.md §4`. Never log raw HMAC keys; never check them into a repo.

### Dashboard URL secrecy

The operator dashboard (built from `dashboard/` in the mothership repo) is **not** publicly indexed. Its hostname is treated as a secret: the operator never posts the URL in a client-shared chat, an issue body, a commit message, or a PR description. If the URL leaks, treat it as an incident — rotate the auth path immediately.

### Pattern C zone isolation

The two-branch overlay (`main` vs `operator/main`) is a **structural** security boundary, not a convention. The client's `main` deploys to Vercel; the operator's overlay never touches Vercel and never carries client production secrets. See `docs/mothership/02-architecture.md §1` for the model and `docs/mothership/03-secure-architecture.md §2` for the cost-firewall implications.

### GitHub-specific settings (operator side)

- **Branch protection on `main`**: enforced via GitHub repository settings on every repo (mothership and client).
- **Branch protection on `operator/main`**: enforced on every client repo so the bot account is the only push principal; the operator merges via PR.
- **Workflow permissions**: read-only by default; write access only where explicitly granted in the workflow's `permissions:` block.
- **Secrets**: `CLAUDE_CODE_OAUTH_TOKEN` is the only repository-scoped secret on the mothership; org-scoped tokens cover everything else.

### Single-Owner break-glass

The org-Owner principal is the *only* principal that can recover the autopilot if the bot account or the OAuth token are revoked. Document the recovery sequence in the operator's offline runbook (out-of-repo, in the operator's password manager). The break-glass procedure itself is the gap closed by Run B — see `docs/mothership/12-critique-security-secrets.md`.

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
- The PR cannot touch workflows, env files, or `src/app/api/contact/*` — those paths are forbidden by the bot playbooks (see `docs/mothership/02-architecture.md §1` for the structural reason: those paths live on `operator/main`).
- The client's `main` is therefore safe to deploy via Vercel without further hardening.

- **Branch protection on `main`**: enforced via GitHub repository settings
- **Workflow permissions**: read-only by default; write access only where explicitly granted
- **Secrets**: `CLAUDE_CODE_OAUTH_TOKEN` is the only repository secret; it is scoped to the Pro subscription OAuth token and never logs to workflow output

## Pattern C compliance (operator-side)

The two-repo / two-branch trust model that keeps operator IP and per-client costs invisible to clients is enforced by an explicit checklist in the mothership pack: [`docs/mothership/pattern-c-enforcement-checklist.md`](../mothership/pattern-c-enforcement-checklist.md). Walk that file before any spinout (its §4 pre-migration gate) and immediately after (its §5 post-migration verification). The checklist is the single MUST / MUST-NOT control surface; the architecture rationale lives in `docs/mothership/02-architecture.md` and `docs/mothership/03-secure-architecture.md`.
See [`.github/SECURITY.md`](https://github.com/palimkarakshay/lumivara-site/blob/main/.github/SECURITY.md) for the canonical policy.
