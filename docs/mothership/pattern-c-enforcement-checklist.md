<!-- OPERATOR-ONLY. Canonical enforcement surface for the trust model defined in 02-architecture.md and 03-secure-architecture.md. -->

# Pattern C — Enforcement Checklist

> **Status:** Source of truth for Pattern C compliance. Every architectural assertion in `02-architecture.md` and every "never" rule in `03-secure-architecture.md §1` is enforced by an explicit MUST / MUST-NOT row below. Cross-link, do not duplicate. Last updated: 2026-04-28.

## §1 — Definition of Pattern C

"Pattern C" is the operator's two-repo / two-branch trust model:

- **Mothership repo** — `palimkarakshay/{{BRAND_SLUG}}-mothership` (private, operator-only). Holds the autopilot, prompts, n8n workflows, dashboard, freelance pack, per-client mirrors, and these mothership docs. See `02-architecture.md §1` and `02-architecture.md §2`.
- **Client repo** — `palimkarakshay/<client-slug>-site`, two relevant branches:
  - `main` — client-readable. Clean Next.js + admin portal only.
  - `operator/main` — operator-only overlay. Holds workflows, scripts, and per-engagement notes; pushed by `{{BRAND_SLUG}}-bot`. See `03-secure-architecture.md §2.1`.

The defining trick: the autopilot lives on `operator/main`, never on `main`. End-of-engagement, `operator/main` is deleted and the client keeps a vanilla repo (`02-architecture.md §7`).

This checklist is the *enforcement* of that model. The architecture docs are the *what*; the rows below are the *must / must-not / how to verify*.

---

## §2 — MUST controls

Every row is shaped: **rule** → **why** → **verify** (a concrete `git`/`gh`/`grep` invocation or a single UI step).

### C-MUST-1 — Operator-side IP stays operator-side

Operator-only artefacts live only in the mothership repo or on `operator/main` of a client repo. The set:

- `docs/mothership/`, `docs/freelance/`, `docs/operator/`, `docs/migrations/`, `docs/ops/`
- `n8n/**`, `dashboard/**`
- `scripts/triage-*`, `scripts/execute-*`, `scripts/gemini-*`, `scripts/codex-*`, `scripts/plan-issue*`, `scripts/test-routing*`, `scripts/bootstrap-kanban.sh`, `scripts/lib/`

**Why:** if any of these land on a client `main`, a curious client can read the autopilot's prompts, model-routing rubric, vendor PAT shape, or operator-internal cost tables. That breaks the four "never" rules in `03-secure-architecture.md §1`.

**Verify:**

```bash
git -C <client-repo> ls-tree main -r --name-only \
  | grep -E '(^docs/(mothership|freelance|operator|migrations|ops)/|^n8n/|^dashboard/|^scripts/(triage|execute|gemini|codex|plan-issue|test-routing|bootstrap-kanban)|^scripts/lib/)'
```

Must return zero matches.

### C-MUST-2 — Workflow YAML lives on `operator/main`, not `main`

Autopilot workflows (`triage`, `execute*`, `plan-issues`, `deep-research`, `codex-review`, `auto-merge`, `project-sync`, `setup-cli`, `ai-smoke-test`, `deploy-dashboard`) ship on `operator/main` only. Client `main` may carry vanilla CI (lint/test) but no autopilot file.

**Why:** GitHub Actions reads `schedule:` triggers from any branch with `.github/workflows/*.yml`, so the cron still fires. Keeping these off `main` keeps them invisible to a client who clones their repo.

**Verify:**

```bash
git -C <client-repo> ls-tree main -- .github/workflows/
```

Must be empty or contain only client-side CI files (today: empty).

### C-MUST-3 — Secrets injected via Vercel env vars only

No secret value in any tracked file in any branch. AI provider tokens, vendor PATs, n8n HMAC, Auth.js secrets, OAuth client secrets — all injected at runtime by Vercel (per-client) or by GitHub Actions (org-level). See the secret topology in `03-secure-architecture.md §3`.

**Why:** committed secrets are forever. The cost firewall (`03-secure-architecture.md §4`) and the four "never" rules collapse the moment one leaks.

**Verify:**

```bash
git -C <client-repo> grep -E '[A-Za-z0-9+/=]{32,}' main \
  -- ':!package-lock.json' ':!*.svg' ':!*.png' ':!*.jpg' ':!*.webp'
```

Must return nothing high-entropy. Pair with the variable-registry CI check (deferred — see issue #142) once it lands.

### C-MUST-4 — Branch protection on `main` and `operator/main`

Match the rules in `03-secure-architecture.md §2.2` exactly:

- `main`: PR review required (1), thread resolution required, Vercel status check required, `allow_force_pushes: false`, `allow_deletions: false`, `enforce_admins: false` (operator break-glass).
- `operator/main`: pushes restricted to `{{BRAND_SLUG}}-bot`, `mothership-smoke` status check required, `allow_force_pushes: false`.

**Why:** without these the client (a Read-only collaborator on `main`) can force-push or delete; the operator's personal account can accidentally push the autopilot to `operator/main` outside the bot flow.

**Verify:**

```bash
gh api repos/palimkarakshay/<client-slug>-site/branches/main/protection
gh api repos/palimkarakshay/<client-slug>-site/branches/operator/main/protection
```

JSON shape must match the canonical block. Apply via the `provision` CLI (`02-architecture.md §3 step 5`); they are not optional.

### C-MUST-5 — `.claudeignore` present on client `main`

The client `main` ships `.claudeignore` listing the operator-only paths from `03-secure-architecture.md §2.3`. Belt-and-braces: even if a future operator cherry-picks from `operator/main` into `main`, the agent running on `main` won't read those files into context.

**Why:** defence in depth against future-operator footgun. The branch boundary is the wall; `.claudeignore` is the moat.

**Verify:**

```bash
git -C <client-repo> cat-file -p main:.claudeignore
```

Must match the canonical block in `03-secure-architecture.md §2.3` byte-for-byte.

### C-MUST-6 — Org-level secrets, scoped per repo

All AI-provider tokens (`CLAUDE_CODE_OAUTH_TOKEN`, `GEMINI_API_KEY`, `OPENAI_API_KEY`) and the vendor PAT (`VENDOR_GITHUB_PAT`) live as **organisation** secrets in `palimkarakshay/{{BRAND_SLUG}}` with `repo access = Selected` enumerating each client repo. See `02-architecture.md §1` SHARED OPERATOR INFRA box and `03-secure-architecture.md §3` table.

**Why:** keeps a single rotation surface for each secret, lets the operator add/remove a repo without re-issuing tokens, and prevents copy-pasted repo-level secrets going stale.

**Verify:**

```bash
gh api orgs/{{BRAND_SLUG}}/actions/secrets
```

Each named secret must appear; UI check (`Settings → Secrets and variables → Actions`) confirms `Repository access: Selected` enumerates only the active client repos.

### C-MUST-7 — Per-engagement HMAC secret

`N8N_HMAC_SECRET` is unique per client (`openssl rand -hex 32`), stored in **two and only two** places: the client's Vercel env var and the operator's n8n credential for that client. See `02-architecture.md §5` and `03-secure-architecture.md §3` row 5.

**Why:** a per-client key contains the blast radius of a leak to a single engagement, and rotation cost is one client at a time.

**Verify:** registry §3 row marks `owner = client` and `rotation = 12 months`. Cross-check by listing n8n credentials and confirming exactly one credential per client carrying the suffix `-<client-slug>`. If the registry CI check from #142 has landed, run that — otherwise this row is a manual quarterly procedure.

### C-MUST-8 — Mothership smoke check on `operator/main`

Branch protection on `operator/main` requires the `mothership-smoke` status check (defined in the mothership repo's `.github/workflows/mothership-smoke.yml`).

**Why:** every push to `operator/main` flows through a smoke pass that verifies the autopilot wiring (token reachable, n8n reachable, Vercel reachable) before the cron picks the branch up.

**Verify:**

```bash
gh api repos/palimkarakshay/<client-slug>-site/branches/operator/main/protection \
  --jq '.required_status_checks.contexts'
```

Output must include `mothership-smoke`.

---

## §3 — MUST-NOT controls

Mirrors the four "never" rules in `03-secure-architecture.md §1`, plus extensions for the broader trust surface. The first four rows are intentionally byte-aligned with `03-secure-architecture.md §1` — drift is a bug; if either side changes, the other follows.

<!-- mirrors 03-secure-architecture.md §1 — do not let these drift -->

### C-MUST-NOT-1

**Never** put an operator API key, OAuth token, or vendor PAT into a client repo file — not in `.env.local.example`, not in a comment, not in a workflow `env:` block. Org-level secrets only.

**Why:** committed secrets bypass every other control. **Verify:** see C-MUST-3 above.

### C-MUST-NOT-2

**Never** copy `docs/mothership/`, `docs/freelance/`, `docs/operator/`, `docs/migrations/`, `docs/ops/`, `n8n/*.json`, `scripts/triage-*`, `scripts/execute-*`, `scripts/gemini-*`, `scripts/codex-*`, `scripts/plan-issue*`, `scripts/test-routing*`, `scripts/bootstrap-kanban.sh`, `scripts/lib/`, or `dashboard/` into a client repo's `main`. They live on `operator/main` (overlay) or in the mothership repo only.

**Why:** these are operator IP and reveal the autopilot's inner workings. **Verify:** see C-MUST-1 above.

### C-MUST-NOT-3

**Never** invoice a client for a line item that names a third-party service (Anthropic, Google, OpenAI, Twilio, Resend, Vercel, n8n, Railway). Bill at tier price; the cost stack is the operator's.

**Why:** the cost firewall (`03-secure-architecture.md §4`) is part of the product. **Verify:** spot-check the most recent client invoice — `grep -iE '(anthropic|google|openai|twilio|resend|vercel|n8n|railway)' docs/clients/<slug>/invoices/*.md` returns nothing.

### C-MUST-NOT-4

**Never** show a client the dashboard URL (`https://palimkarakshay.github.io/{{BRAND_SLUG}}-mothership/`) or any operator runbook. They get the admin portal at `https://<their-domain>/admin` and nothing else.

**Why:** the dashboard exposes per-client costs, model routing, and other clients' metadata. **Verify:** `grep -rE 'palimkarakshay\.github\.io/.*-mothership' docs/clients/<slug>/` returns nothing; client-shared chats/emails are operator-discipline.

### C-MUST-NOT-5

**Never** give a client a GitHub PAT or operator-side credential on their phone, in iOS Shortcuts, in a chat message, or in any other channel. Magic-link or OAuth at `/admin` only.

**Why:** the v1 template made this mistake. The fix is `03-secure-architecture.md §2.4` — phone → web/email/SMS → operator's n8n (HMAC-signed) → operator's vendor PAT → GitHub. The client never holds a GitHub credential.

**Verify:** the per-client handover pack (`07-client-handover-pack.md` rendered for the engagement) contains no `ghp_`, `github_pat_`, or `Personal Access Token` strings.

### C-MUST-NOT-6

**Never** push to a client repo's `main` from the operator's personal account; only the bot account `{{BRAND_SLUG}}-bot` (gated by branch-protection that requires PRs from the bot).

**Why:** keeps the audit trail clean and prevents "the operator was authenticated and squashed history" incidents.

**Verify:**

```bash
gh api repos/palimkarakshay/<client-slug>-site/commits/main \
  --jq '.[].author.login' | sort -u
```

Must list only `{{BRAND_SLUG}}-bot` (and the client's own GitHub username, if any merged PRs from them).

---

## §4 — Pre-migration gate (per client spinout)

Before running `docs/migrations/<client>-spinout.md` (the spinout runbook tracked by issue #141), confirm the source artefact set is Pattern-C-ready. Each row maps to a §2 or §3 control.

| # | Pre-flight check | Source control | Ready? |
|---|---|---|---|
| 1 | All operator-only paths (C-MUST-1 set) are absent or marked for removal in the source repo's `main` after spinout | C-MUST-1 / C-MUST-NOT-2 | ☐ |
| 2 | All autopilot workflow YAML is moved to `operator/main` (or staged for the move) | C-MUST-2 | ☐ |
| 3 | No high-entropy strings in `main` history (check with `git grep` on every ref the spinout will preserve) | C-MUST-3 / C-MUST-NOT-1 | ☐ |
| 4 | Branch-protection rules drafted for both `main` and `operator/main` and ready to apply via the `provision` CLI | C-MUST-4 | ☐ |
| 5 | `.claudeignore` content from `03-secure-architecture.md §2.3` staged for the new `main` | C-MUST-5 | ☐ |
| 6 | Each org-level secret (`CLAUDE_CODE_OAUTH_TOKEN`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `VENDOR_GITHUB_PAT`) has the new client repo added to `Repository access: Selected` | C-MUST-6 | ☐ |
| 7 | A per-client `N8N_HMAC_SECRET` has been generated, stored in the operator vault, and is ready for Vercel + n8n injection (no commit) | C-MUST-7 | ☐ |
| 8 | The mothership smoke workflow is ready to land on `operator/main` of the new repo | C-MUST-8 | ☐ |
| 9 | Invoice templates and handover pack drafts contain no third-party brand names or operator URLs | C-MUST-NOT-3 / C-MUST-NOT-4 | ☐ |
| 10 | The client onboarding flow uses magic-link / OAuth at `/admin` only — no PAT or credential is communicated to the client | C-MUST-NOT-5 | ☐ |
| 11 | The bot account `{{BRAND_SLUG}}-bot` exists and is the intended sole writer to `main` post-spinout | C-MUST-NOT-6 | ☐ |

The spinout runbook (#141) cites this section in its §0 pre-flight. Any unchecked row blocks the spinout.

---

## §5 — Post-migration verification

Right after the spinout completes, run every C-MUST verification command and tick the corresponding row. Non-greenable rows block declaring the spinout done. The runbook in #141 cites this section in its §9 acceptance criteria.

| Control | Command / step | Pass? |
|---|---|---|
| C-MUST-1 | `git ls-tree main -r --name-only \| grep -E '(^docs/(mothership\|freelance\|operator\|migrations\|ops)/\|^n8n/\|^dashboard/\|^scripts/(triage\|execute\|gemini\|codex\|plan-issue\|test-routing\|bootstrap-kanban)\|^scripts/lib/)'` returns empty | ☐ |
| C-MUST-2 | `git ls-tree main -- .github/workflows/` is empty (or client-CI only) | ☐ |
| C-MUST-3 | `git grep -E '[A-Za-z0-9+/=]{32,}' main` returns nothing high-entropy | ☐ |
| C-MUST-4 | `gh api …/branches/main/protection` and `…/branches/operator/main/protection` match the canonical block | ☐ |
| C-MUST-5 | `git cat-file -p main:.claudeignore` matches `03-secure-architecture.md §2.3` | ☐ |
| C-MUST-6 | `gh api orgs/{{BRAND_SLUG}}/actions/secrets` lists each token with `Repository access: Selected` covering the new repo | ☐ |
| C-MUST-7 | n8n credential `…-<client-slug>` exists; Vercel env var present in client project; registry §3 row updated | ☐ |
| C-MUST-8 | `mothership-smoke` is listed in `operator/main` required status checks | ☐ |
| C-MUST-NOT-1..6 | Spot-check each per its §3 verify line; record N/A only with a one-line rationale | ☐ |

If a row cannot be ticked, file an issue tagged `area/forge`, `priority/P1`, `status/needs-clarification`, citing this section.

---

## §6 — Audit cadence

Default: **quarterly**. Mandatory triggers (audit on the same day, not at next quarterly):

- Every secret rotation (any row in `03-secure-architecture.md §3` changing).
- Every branch-protection change on a client repo.
- Every new client repo onboarded (run §5 before declaring spinout done — that *is* the first audit).
- Every change to this checklist (re-read across all engagements).

Audit procedure: walk every C-MUST and C-MUST-NOT row, run its verify line for every active client, log result in `docs/operator/INCIDENT_LOG.md` (mothership repo) under a `Pattern C audit YYYY-QN` heading. Cross-link `docs/ops/audit-runbook.md` once issue #145 lands.

---

## See also

- `02-architecture.md` — the architecture this checklist enforces.
- `03-secure-architecture.md` — the four "never" rules and the secret topology this checklist mirrors.
- `09-github-account-topology.md` — org / bot account / repo layout.
- `docs/migrations/` — spinout runbooks that cite §4 and §5 as gate / acceptance.
- `docs/BACKLOG.md` — Pattern C audit cadence backlog row pointing here.

*Last updated: 2026-04-28.*
