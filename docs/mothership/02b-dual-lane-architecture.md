<!-- OPERATOR-ONLY. Canonical Dual-Lane Repo reference. Pair with 02-architecture.md and 03-secure-architecture.md. -->

# 02b — Dual-Lane Repo Architecture (canonical, locked 2026-04-28)

> **Status:** ✅ canonical. Locked by the operator on **2026-04-28** in `11 §1`.
>
> **Naming note (2026-04-30):** This model was previously called "Pattern C" (the third option weighed in `11 §1`). It was renamed to "Dual-Lane Repo" for clarity — the name now describes the structure (two lanes, audited boundary) instead of opaquely numbering it. Older cross-references that still say "Pattern C" mean exactly what is described here.
>
> **Supersedes:** every `operator/main` branch-overlay description in `02 §1/§3/§4/§6/§7`, `03 §2.1/§2.2`, `04 §1/§7`, `05 §P5.6`, `06 §3/§9`, and `09 §3`. Those docs have been rewritten to align with this one; the legacy text appears only in `11 §1` (the critique that recorded the decision) and `10 §2` (executive summary), where it is clearly marked as deprecated history.
>
> **Why a separate file:** the Dual-Lane Repo is the load-bearing architectural decision for the entire pipeline. Keeping it in one short file makes drift detectable — every other doc cross-links here for the canonical statement.

---

## 1. The two repos, in one diagram

```
┌────────────────────────────────────────┐        ┌────────────────────────────────────────┐
│  SITE REPO (client-readable)            │        │  PIPELINE REPO (operator-only)          │
│  {{BRAND_SLUG}}/<slug>-site             │        │  {{BRAND_SLUG}}/<slug>-pipeline         │
│  Visibility: PRIVATE during engagement; │        │  Visibility: PRIVATE forever;            │
│              transferred to client at    │        │              never shared with client.   │
│              handover.                   │        │                                          │
│                                          │        │  Branches:                                │
│  Branches:                                │        │    main           — workflows + scripts │
│    main           — Next.js site         │        │    auto/*         — bot working branches│
│    auto/*         — bot working branches │        │                    (rare; PRs in pipeline│
│                    (PRs into main, opened│        │                    repo are operator-only│
│                    by the GitHub App)    │        │                    edits, not auto-edits)│
│                                          │        │                                          │
│  Holds (on `main`):                       │        │  Holds (on `main`):                       │
│    src/                Next.js 16 app    │        │    .github/workflows/**  cron + on-event │
│    src/app/admin/      admin portal      │        │    scripts/**             prompts + libs│
│    src/lib/admin-*.ts  allowlist + map   │        │    docs/operator/**       per-eng notes │
│    middleware.ts       /admin gate       │        │                                          │
│    auth.ts             Auth.js v5 config │        │  No workflows live on the site repo.    │
│    package.json, etc.                   │        │  None. The site repo's `.github/`        │
│    .env.local.example                   │        │  directory is empty (or absent).         │
│                                          │        │                                          │
│  Holds NO workflow files. None.          │        │  Cron schedules fire here, on `main`,   │
│                                          │        │  the pipeline repo's default branch.    │
│                                          │        │  This is the canonical GitHub Actions   │
│                                          │        │  cron behaviour — no tricks needed.     │
└────────────────────────────────────────┘        └────────────────────────────────────────┘
                  ▲                                                  │
                  │  (3) PR opened against site `main`               │
                  │      — branch & PR authored by the App.          │
                  │  (4) Vercel deploys site `main` previews/prod.   │
                  │  (5) Vercel deploy-succeeded webhook → n8n.      │
                  │                                                  │
                  └──────────── GitHub App ──────────────────────────┘
                               (installation token, ≤1 h TTL,
                                generated per workflow run)
                       Permissions on the SITE repo:
                         Issues:RW, Pull requests:RW, Contents:RW,
                         Metadata:R, Workflows:R
                       Permissions on the PIPELINE repo:
                         the workflow's own GITHUB_TOKEN suffices —
                         it is already running there.
```

The pipeline repo's workflows authenticate as the App, mint a short-lived installation token, and use that token to push branches and open PRs against the matched site repo. The client never has Read access to the pipeline repo, so the workflows, prompts, and operator runbooks are invisible to them by **permission**, not by branch-listing politeness.

---

## 2. Repo provisioning order

The `forge provision` CLI (P5.4b) creates two repos per engagement, in this order:

1. **Site repo first** — `{{BRAND_SLUG}}/<slug>-site`. Push `client-template/` to its `main`. Vercel hooks up to this repo and deploys `main` to production.
2. **Pipeline repo second** — `{{BRAND_SLUG}}/<slug>-pipeline`. Push `workflows-template/` and `scripts/` to its `main`. The cron schedules in those workflows fire from this branch (the canonical default-branch path).
3. **Install the GitHub App on the site repo only** — using the App's per-installation API. The pipeline repo does not need the App installed on itself; its workflows already have a `GITHUB_TOKEN` for their own repo.
4. **Record the installation ID** in `docs/clients/<slug>/cadence.json` so workflow runs can mint installation tokens scoped to the right site repo without the operator-as-human picking the install each time.
5. **Smoke-test cross-repo write** — a single workflow_dispatch in the pipeline repo opens a no-op PR ("README ack") against the site repo. Green = wiring works.

Order matters: install the App **after** both repos exist, because the install API needs the site-repo node ID. If you install before creating the site repo, the App falls back to all-repos scope, which is too broad.

---

## 3. The GitHub App — one app, many installations

One GitHub App lives at the org level: `{{BRAND_SLUG}}-pipeline-bot`. Each engagement gets a fresh **installation** of this app on its site repo. The App is the canonical vendor identity, replacing the legacy fine-grained PAT (`VENDOR_GITHUB_PAT`).

**Permissions (on each installed site repo):**

| Resource | Access | Why |
|---|---|---|
| Issues | Read & write | Triage labels; comment on issues; close on auto-merge. |
| Pull requests | Read & write | Open `auto/*` branches; comment with execution summaries; mark ready-for-review. |
| Contents | Read & write | Push branches; commit edits authored by the bot. |
| Metadata | Read | Required by the API; default. |
| Workflows | Read | Inspect site-repo workflow files (there shouldn't be any in the Dual-Lane Repo, but the read-only scope catches drift). |

**Permissions (organisation-level, optional):**

| Resource | Access | Why |
|---|---|---|
| Members | Read | The triage prompt occasionally needs to resolve `@mentions` to real users for assignment. |

The App's manifest, the YAML for `actions/create-github-app-token`, and the install instructions live in `03b-github-app-spec.md` (created by Run B in `16 §2`).

**Token lifecycle inside a workflow run:**

```yaml
# workflows-template/triage.yml — Dual-Lane version
jobs:
  triage:
    runs-on: ubuntu-latest
    steps:
      - name: Mint App installation token for the matched site repo
        id: app-token
        uses: actions/create-github-app-token@v1
        with:
          app-id: ${{ secrets.APP_ID }}
          private-key: ${{ secrets.APP_PRIVATE_KEY }}
          owner: ${{ vars.SITE_REPO_OWNER }}
          repositories: ${{ vars.SITE_REPO_NAME }}
      - name: Triage with site-repo scope
        env:
          GH_TOKEN: ${{ steps.app-token.outputs.token }}
        run: |
          gh issue list --repo "${{ vars.SITE_REPO_OWNER }}/${{ vars.SITE_REPO_NAME }}" \
            --label status/needs-triage --json number,title,body
          # ...rest of the triage script...
```

The token is generated per run, never stored, expires within an hour, and is scoped to one site repo. There is no long-lived PAT anywhere in the secret topology.

**Org secrets the App replaces:**

| Old (deprecated) | New (canonical) |
|---|---|
| `VENDOR_GITHUB_PAT` | `APP_ID` + `APP_PRIVATE_KEY` (org secrets) → installation token (per-run, never stored) |

The migration sequence is recorded in `12 §4` (security critique) and operationalised by Run B in `16 §2`.

---

## 4. Workflow communication — pipeline → site

Every cron'd workflow in the pipeline repo follows the same shape:

1. **Trigger** — cron (`schedule:`), or `workflow_dispatch`, or `repository_dispatch` from a webhook (e.g. n8n posting an intake).
2. **Mint** the installation token via `actions/create-github-app-token@v1`.
3. **Read** state from the site repo (`gh issue list`, `gh pr list`, `gh api`).
4. **Decide** what to do (triage labels, plan, execute, codex review, auto-merge).
5. **Write** to the site repo: push `auto/issue-N`, open a PR targeting `main`, comment, label.
6. **Log** the run in the pipeline repo's own Actions logs (which the client cannot see).

The site repo never runs an Action. Its `.github/` directory is empty by design; there is no `workflows/` folder to inspect, hide, or `.gitignore`. A client cloning `<slug>-site` gets a vanilla Next.js app — no workflow files, no scripts, no prompts.

---

## 5. Cross-repo deploy flow

Vercel hooks up to the **site** repo, not the pipeline. Deploys are triggered by pushes to site `main` (whether human-authored or App-authored).

```
[bot pushes auto/issue-N to site repo via App token]
    │
    ▼
[Vercel deploys preview for the PR]
    │
    ▼
[auto-merge.yml in PIPELINE repo] ──── Vercel preview ✅?
    │                                      │
    │   yes                                 │ no
    ▼                                      ▼
[App token: squash-merge PR via gh]   [comment on PR; await operator]
    │
    ▼
[Vercel deploys site `main` to production]
    │
    ▼
[Vercel "deployment.succeeded" webhook → n8n]
    │
    ▼
[n8n: deploy-confirmed-<slug> workflow → SMS the client]
```

The **auto-merge gate runs in the pipeline repo** (cron-driven, polling the site repo's PR list), not as a workflow on the site repo. Same for codex-review, deep-research, and ai-smoke-test — they all live and run in the pipeline repo, and reach into the site repo through the App.

---

## 6. Trust zones — the Dual-Lane Repo version

Replaces the table in `02 §4`:

| Zone | Location | Owns | Sees |
|---|---|---|---|
| **Mothership** | platform repo + `{{BRAND_SLUG}}` org + Railway n8n + operator's vault | Workflow templates, scripts, prompts, dashboards, freelance pack | Everything |
| **Pipeline repo** (per client) | `{{BRAND_SLUG}}/<slug>-pipeline`, `main` | Workflow files, prompts, scripts, per-engagement runbooks | Pipeline-repo Actions logs, issue/PR contents on the site repo (via App token) — but **not** the operator's vault |
| **Site repo** (per client) | `{{BRAND_SLUG}}/<slug>-site`, `main` | Site code, content, design tokens, admin portal client-side | Their `main` only (and any `auto/*` branches the App has opened against `main`). Cannot read the pipeline repo at all — they are not added to it as a collaborator. |
| **Shared third-party** | Vercel, Resend, Twilio, GitHub, OAuth providers | Operator pays the bills | Each side sees only its own dashboard |

The "client cannot see the autopilot" claim is now an architectural fact: the workflows, prompts, scripts, and operator runbooks are in a different repo the client has no Read access to. The branch-listing leak documented in `11 §2` is dissolved by construction.

---

## 7. Pipeline-repo branch protection

Stricter than site-repo `main`, because pipeline `main` is where the cron fires from and any compromised commit fans out across every engagement that uses the same workflow templates.

| Rule | Site repo `main` | Pipeline repo `main` |
|---|---|---|
| PR review required | 1 (operator or auto-merge with green Vercel) | 1 (operator-only; auto-merge disabled) |
| Required status check | Vercel preview ✅ | None today; planned: workflow-lint + cron-syntax check |
| Force-push | Off | Off |
| Branch deletion | Off | Off |
| Push restrictions | App + operator | Operator only (the App does **not** push to its own pipeline repo's `main`; only operator-as-human edits land here) |
| Code Owners required for `.github/workflows/` | n/a (no workflows on site repo) | Yes — operator only |

Detailed branch-protection JSON lives in `03 §2.5` (added by Run B).

---

## 8. Teardown — what changes per mode

Updates `02 §7`. Every mode now has both a **site-repo** action and a **pipeline-repo** action.

| Mode | Site repo action | Pipeline repo action | App action |
|---|---|---|---|
| `--mode handover` | Drop branch protections; remove bot collaborator (the App is the only bot, and it's not a collaborator); transfer to client. | Archive (read-only) or delete after 30-day grace; export Actions logs to operator's vault first. | Uninstall App from the site repo. |
| `--mode archive` | Same as handover, but the client takes a tarball, not the live repo. | Same as handover. | Uninstall App. |
| `--mode pause` | No change to branch protections; label every open issue `paused/non-payment`. | Set `vars.AUTOPILOT_DISABLED=true` on the pipeline repo; cron exits early. | Leave installed. |
| `--mode rebuild-vanilla` | Push a fresh autopilot-free `main` (already autopilot-free in the Dual-Lane Repo — this becomes a no-op for the site repo). | Archive the pipeline repo. | Uninstall App. |

The rebuild-vanilla mode is now mostly trivial: in the Dual-Lane Repo, the site repo is *already* autopilot-free during the engagement, so there is nothing to strip.

---

## 9. Why the Dual-Lane Repo wins (the one-paragraph rationale)

Three patterns were on the table in `11 §1`:

- **A — flip the convention** (default branch = `operator/main`, content on `client/main`). Cron works; the workflows are still co-located with the site, so a client with Read access can see them. Marketing-grade separation, not architectural separation.
- **B — single repo, single `main`, gated workflows.** Cron works; workflows are fully visible. The "client cannot see the autopilot" claim becomes a marketing line, not a property of the system.
- **C — two repos (the Dual-Lane Repo).** Cron works; the workflows live in a repo the client has no Read access to. The "system = operator-licensed" contractual claim becomes architecturally enforceable.

The operator picked the Dual-Lane Repo because the cost-firewall and IP-protection promises in the contract should be enforced by **permissions**, not by promises. The two-repo overhead is absorbed by `forge provision` (P5.4b); the App is a one-time install per engagement; and the cron-from-default-branch path is the boring, well-trodden GitHub Actions behaviour — no tricks, no silent breakage on the next platform change.

---

## 10. What this doc does NOT cover

- The full GitHub App manifest YAML and installation walkthrough — that's `03b-github-app-spec.md` (Run B).
- The provisioning CLI's two-repo creation logic — that's `02 §3` (updated to 12 steps) and the P5.4b implementation issue.
- The pipeline-repo branch-protection JSON — that's `03 §2.5` (Run B).
- The audit-trail sanitisation rules for cross-repo PR comments — that's `12 §6` and Run A's commit on `audit-trail sanitisation`.

When in doubt, the canonical statement of *what* the Dual-Lane Repo is lives here. The *how* lives in the docs above.

*Last updated: 2026-04-28.*
