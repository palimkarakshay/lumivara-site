<!-- OPERATOR-ONLY. Pattern C canonical as of 2026-04-28. Pair with 02b-pattern-c-architecture.md. -->

# 02 — Architecture: Mothership Repo + Two Per-Client Repos (Pattern C)

> **Pattern C is canonical (2026-04-28).** The branch-overlay description that previously appeared here — "the autopilot files live on `operator/main` of each client repo" — has been superseded. See `02b-pattern-c-architecture.md` for the canonical statement and `11 §1` for the decision history.

## 1. The three-repo shape, in one diagram

```
┌─────────────────────────────────────────┐
│  MOTHERSHIP REPO (operator-only)         │
│  palimkarakshay/{{BRAND_SLUG}}-mothership│
│  Visibility: PRIVATE forever             │
│                                          │
│  Holds:                                  │
│    docs/mothership/**     ← this folder  │
│    docs/freelance/**       (storefront)  │
│    docs/operator/**        (per-eng)     │
│    docs/clients/<slug>/**  (per-client   │
│      mirror — operator's copy of intake, │
│      contract, invoices, cadence.json)   │
│    n8n/**                  workflow JSON │
│    scripts/**              triage/exec   │
│    workflows-template/**   workflows that│
│      get pushed to each `<slug>-pipeline`│
│      repo's `main` at provision time     │
│    client-template/**      what gets     │
│      pushed to `<slug>-site` `main`      │
│    dashboard/**            mobile SPA    │
│    cli/**                  per-client    │
│      provisioning CLI (Phase P5)         │
│                                          │
│  Secrets: GitHub org-level, scoped per   │
│  pipeline repo. Never inside any client- │
│  facing repo.                            │
└─────────────────────────────────────────┘
        │
        │  `forge provision` creates two
        │  repos per engagement and installs
        │  the GitHub App on the site repo.
        ▼
┌─────────────────────────────────────────┐    ┌─────────────────────────────────────────┐
│  SITE REPO (per client, client-readable) │    │  PIPELINE REPO (per client, operator-   │
│  {{BRAND_SLUG}}/<slug>-site              │    │   only)                                  │
│  Visibility: PRIVATE during engagement;  │    │  {{BRAND_SLUG}}/<slug>-pipeline         │
│              transferred to client at    │    │  Visibility: PRIVATE forever; never      │
│              handover.                   │    │              shared with the client.     │
│                                          │    │                                          │
│  Branches:                                │    │  Branches:                                │
│    main          — client-visible site   │    │    main          — workflows + scripts  │
│    auto/issue-N  — bot working branches, │    │                    (cron fires from here)│
│                    opened via the App,   │    │    auto/*        — rare; operator-edits │
│                    PR'd into main        │    │                                          │
│                                          │    │                                          │
│  Holds (on `main`):                       │    │  Holds (on `main`):                       │
│    src/                Next.js 16 app    │    │    .github/workflows/**  the autopilot  │
│    src/app/admin/      admin portal      │    │    scripts/**             prompts + libs│
│    src/lib/admin-*.ts  allowlist + map   │    │    docs/operator/**       per-eng notes │
│    middleware.ts       /admin gate       │    │                                          │
│    auth.ts             Auth.js v5 config │    │  No `.github/workflows/` directory       │
│    .env.local.example                   │    │  exists on the site repo. None.          │
│    package.json, etc.                   │    │                                          │
│    README.md, CHANGELOG.md              │    │  Cron schedules fire from this repo's   │
│                                          │    │  default branch (`main`) — the canonical│
│  No workflow files. None.                │    │  GitHub Actions cron path; no tricks.   │
└─────────────────────────────────────────┘    └─────────────────────────────────────────┘
                  ▲                                                  │
                  │  PRs opened against site `main`                  │
                  │  by the GitHub App (installation token).         │
                  └────────────── GitHub App ────────────────────────┘
                                  (one App at the org level;
                                   one installation per site repo;
                                   token minted per workflow run,
                                   <1 h TTL, never stored)

┌──────────────────────────────────────────────────────────────────────┐
│  SHARED OPERATOR INFRA (one of each, used by all clients)            │
│                                                                      │
│  • GitHub org `{{BRAND_SLUG}}` with org-level Action secrets:        │
│      CLAUDE_CODE_OAUTH_TOKEN, GEMINI_API_KEY, OPENAI_API_KEY,        │
│      APP_ID, APP_PRIVATE_KEY (the GitHub App credentials).           │
│      Repo access: "Selected" — adds each pipeline repo individually. │
│  • GitHub App `{{BRAND_SLUG}}-pipeline-bot` (org-owned; installed    │
│      per engagement on each `<slug>-site` repo)                      │
│  • n8n on Railway, one instance, workflows suffixed -<client-slug>   │
│  • Twilio account, per-client phone number                           │
│  • Resend domain mail.{{BRAND_SLUG}}.com (one DKIM/SPF/DMARC stack)  │
│  • Vercel team `{{brand-slug}}` until handover                       │
│  • Operator dashboard on GH Pages of mothership repo                 │
└──────────────────────────────────────────────────────────────────────┘
```

The defining property: **the autopilot lives in a separate operator-only `<slug>-pipeline` repo the client never has Read access to.** A curious client cloning their `<slug>-site` repo sees a clean Next.js + admin-portal codebase — no workflows, no scripts, no prompts. The cron schedules fire from the pipeline repo's default branch (`main`), the canonical GitHub Actions path. End-of-engagement: archive or delete the pipeline repo, uninstall the App from the site repo, transfer the site repo to the client, the autopilot stops, and the client keeps a vanilla repo.

The full canonical statement of Pattern C — including the GitHub App, token lifecycle, and trust zones — lives in `02b-pattern-c-architecture.md`.

---

## 2. Mothership repo file layout (target end state of P5)

```
{{BRAND_SLUG}}-mothership/
├── README.md                       # operator-facing only
├── AGENTS.md                       # ported from this repo (budget charter etc.)
├── CHANGELOG.md
├── .gitignore
├── .claudeignore                   # ignores docs/clients/* PII
├── .github/
│   └── workflows/
│       ├── mothership-smoke.yml    # weekly health check across all pipeline repos
│       ├── deploy-dashboard.yml    # publishes the dashboard to GitHub Pages
│       └── app-cred-rotation-warn.yml # warns on App key approaching rotation deadline
├── docs/
│   ├── mothership/                 # this folder, moved over
│   ├── freelance/                  # the public-facing pack
│   ├── operator/                   # per-engagement runbooks
│   │   ├── OPERATOR_RUNBOOK.md
│   │   ├── SMOKE_TESTS.md
│   │   ├── RISK_REGISTER.md
│   │   ├── MOBILE_CAPTURE_ARCHITECTURE.md
│   │   ├── INTAKE_FORM_TEMPLATE.md
│   │   └── HANDOVER_GUIDE_TEMPLATE.md
│   └── clients/                    # operator's mirror of each engagement
│       ├── lumivara-people-advisory/
│       │   ├── intake.md
│       │   ├── contract.md      (encrypted via age, see 03 §4)
│       │   ├── invoices/
│       │   ├── runbook.md
│       │   ├── cadence.json     (records SITE_REPO_OWNER/NAME + APP install ID)
│       │   └── secrets.md.age   (encrypted)
│       ├── johns-plumbing/
│       └── viktor-law/
├── n8n/
│   ├── intake-web.json
│   ├── intake-email.json
│   ├── intake-sms.json
│   ├── client-input-notify.json
│   ├── client-input-record.json
│   ├── deploy-confirmed.json
│   └── README.md                   # how to import & per-client renames
├── scripts/
│   ├── triage-prompt.md
│   ├── execute-prompt.md
│   ├── plan-issue.py
│   ├── codex-triage.py
│   ├── gemini-triage.py
│   ├── test-routing.py
│   ├── bootstrap-kanban.sh
│   └── lib/
│       └── routing.py
├── workflows-template/             # what gets pushed to each <slug>-pipeline `main`
│   ├── triage.yml
│   ├── plan-issues.yml
│   ├── execute.yml
│   ├── execute-complex.yml
│   ├── execute-single.yml
│   ├── execute-fallback.yml
│   ├── codex-review.yml
│   ├── deep-research.yml
│   ├── auto-merge.yml
│   ├── project-sync.yml
│   ├── setup-cli.yml
│   └── ai-smoke-test.yml
├── client-template/                # what gets pushed to each <slug>-site `main`
│   ├── src/                        # full Next.js scaffold
│   ├── tailwind, tsconfig, eslint, etc.
│   ├── package.json
│   ├── README.template.md          # uses Mustache-ish {{...}} placeholders
│   ├── PHONE_SETUP.template.md     # template version of the existing one
│   └── .env.local.example
├── dashboard/                      # mobile SPA — moved from this repo
└── cli/
    ├── provision.ts                # `npx forge provision <slug>` — see §3
    ├── teardown.ts                 # `npx forge teardown <slug>` (graceful exit)
    └── package.json
```

`workflows-template/` lands on each pipeline repo's `main`. `client-template/` lands on each site repo's `main`. There is no overlap, and no workflow files ever reach a site repo.

---

## 3. Per-client provisioning flow (the CLI)

A single command spins a new client up:

```bash
# Run from the operator's checkout of the mothership repo:
npx forge provision \
    --client-slug johns-plumbing \
    --client-name "John's Plumbing" \
    --tier 1 \
    --domain johnsplumbing.ca
```

What it does, in order (each step is a separate function in `cli/provision.ts`, individually testable):

1. **Validate** — slug uniqueness against `docs/clients/`, intake form completeness.
2. **Create the site repo** — `gh repo create {{BRAND_SLUG}}/<slug>-site --private`.
3. **Create the pipeline repo** — `gh repo create {{BRAND_SLUG}}/<slug>-pipeline --private`.
4. **Add both repos to org-secret scope** — `gh api` calls to add each repo to the "Selected repositories" list of every org-level secret in `09 §2 step 8` (the pipeline repo gets the full secret bundle; the site repo needs none, since no workflows live there).
5. **Push `client-template/` to the site repo's `main`** — using a temp working dir, render Mustache placeholders (`{{CLIENT_NAME}}`, `{{CLIENT_SLUG}}`, `{{DOMAIN}}`, etc.), commit, push.
6. **Push `workflows-template/` and `scripts/` to the pipeline repo's `main`** — separate temp dir, separate push. The pipeline repo's `vars` get set: `SITE_REPO_OWNER`, `SITE_REPO_NAME`, `CLIENT_SLUG`, `CLIENT_TIER`, `DEFAULT_AI_MODEL`, `CONCURRENCY_CAP`, cron expressions per tier.
7. **Install the GitHub App on the site repo** — call the App's installation API, scope to the just-created `<slug>-site`, capture the installation ID into the per-client `cadence.json`.
8. **Provision Vercel project** — Vercel API: create project, link to the **site** repo (not the pipeline), set env vars from a per-client `.env.client.json` (operator-vault-encrypted), set deploy hook.
9. **Provision n8n workflows** — n8n REST API: import each JSON, rename suffix, set credentials (operator vault), activate.
10. **Provision Twilio number** — buy number, attach SMS webhook to the right n8n endpoint.
11. **Bootstrap GitHub labels + Project board on the site repo** — runs `scripts/bootstrap-kanban.sh` against the site repo using an installation token from the App.
12. **Smoke-test cross-repo write** — workflow_dispatch in the pipeline repo opens a no-op PR ("README ack") on the site repo, then closes it. Green = wiring works.
13. **Render handover pack** — emits `docs/clients/<slug>/handover.md` from `07-client-handover-pack.md` with placeholders filled.

If any step fails, the CLI prints what's done and what's left, the operator finishes manually, and re-runs `--resume`. Every step is idempotent.

The teardown command does the inverse — see `06-operator-rebuild-prompt-v3.md §11`.

---

## 4. Trust zones — the canonical version (Pattern C)

This refines `docs/TEMPLATE_REBUILD_PROMPT.md §1.1` with the two-repo split. The canonical statement lives in `02b §6`; the table here is the operator's quick-reference copy.

| Zone | Location | Owns | Sees |
|---|---|---|---|
| **Mothership** | mothership repo + `{{BRAND_SLUG}}` org + Railway n8n + operator's vault | Pipeline templates, prompts, secrets, dashboards, freelance pack, this folder | Everything |
| **Pipeline repo** (per client) | `{{BRAND_SLUG}}/<slug>-pipeline`, `main` | Workflow files, prompts, scripts, per-engagement runbooks | Pipeline-repo Actions logs, issue/PR contents on the matched site repo (via App token) — but **not** the operator's vault, and **not** any other client's pipeline repo |
| **Site repo** (per client) | `{{BRAND_SLUG}}/<slug>-site`, `main` | Site code, content, design tokens, admin portal client-side | Their `main` only (and any `auto/*` branches the App has opened against `main`). Cannot read the pipeline repo at all — they are not added to it as a collaborator. |
| **Shared third-party** | Vercel, Resend, Twilio, GitHub, OAuth providers | Operator pays the bills | Each side sees only its own dashboard |

The "client cannot see the autopilot" claim is now an architectural fact: the workflows, prompts, scripts, and operator runbooks are in a different repo the client has no Read access to.

- The client owns the **content** and is the **named owner** of the site repo at end of engagement, but during the engagement the site repo is owned by `{{BRAND_SLUG}}` (operator's org) and the client is added as a Read-only collaborator who only branches/PRs into `main`.
- Branch protection rules on the site repo's `main` prevent the client from force-pushing or rewriting history.
- The pipeline repo never has the client as a collaborator; the App is the only non-operator identity with access, and the App is operator-owned.
- At graceful exit (`teardown` CLI), the App is uninstalled from the site repo, the pipeline repo is archived/deleted, branch protections on the site repo are relaxed, the site repo is transferred to the client's account.

---

## 5. The HMAC handshake (admin portal ↔ n8n)

Every cross-zone call is signed:

```
POST https://n8n.{{BRAND_SLUG}}.com/webhook/intake-web-<client-slug>
Headers:
  X-{{BRAND}}-Timestamp: 1745875200
  X-{{BRAND}}-Signature: hex(hmac_sha256(N8N_HMAC_SECRET, "1745875200." + raw_body))
Body: { ...intake payload... }
```

The shared secret `N8N_HMAC_SECRET`:

- Generated per-client (`openssl rand -hex 32`).
- Stored in **two and only two** places: the client's Vercel env var, and the operator's n8n credential for that client's intake workflow.
- Never appears in any commit, any chat, any client-readable file.
- 5-minute skew window prevents replay.
- Rotation: every 12 months, re-run `cli/rotate-hmac.ts`.

This handshake is unchanged from the deprecated branch-overlay design — Pattern C touched the GitHub side, not the admin-portal-to-n8n side.

---

## 6. The autopilot's view of the world (Pattern C)

When a workflow in the **pipeline repo** runs (cron-triggered on its own `main`), it:

1. **Mints** a short-lived installation token for the App via `actions/create-github-app-token@v1`, scoped to the matched site repo.
2. **Reads** issues/PRs from the site repo using that token.
3. **Runs** the multi-AI router (`scripts/lib/routing.py`) to decide provider + model.
4. **Authenticates** to Anthropic/Gemini/OpenAI using `CLAUDE_CODE_OAUTH_TOKEN` / `GEMINI_API_KEY` / `OPENAI_API_KEY` (org secrets, scoped to this pipeline repo).
5. **Writes** to the site repo using the App token: pushes `auto/issue-<n>` branches (never to `main` directly), opens PRs targeting `main`. Vercel posts a preview.
6. **Auto-merge** runs in the pipeline repo on its own cron, polling the site repo's PR list. Trivial/easy non-design PRs get squash-merged once the Vercel check is green.
7. **n8n** receives a Vercel deployment-succeeded webhook → notifies the client via their preferred channel.

The cron schedules fire from the pipeline repo's `main` — the canonical GitHub Actions default-branch path. The site repo has no workflows, no cron, no `.github/workflows/` directory.

---

## 7. What changes when the engagement ends

Run `npx forge teardown --client-slug <slug>` and pick a mode:

| Mode | What happens |
|---|---|
| `--mode handover` | Uninstall the App from the site repo. Drop branch protections on the site repo's `main`. Transfer the site repo to the client's GitHub account. Archive the pipeline repo (read-only) or delete it after a 30-day grace period; export Actions logs to the operator's vault first. Email the client a vanilla README. |
| `--mode archive` | Same as handover, but the client takes a tarball of the site repo, not a transferred repo. Pipeline repo handled the same way. |
| `--mode pause` | (Non-payment.) Set `vars.AUTOPILOT_DISABLED=true` on the pipeline repo so cron exits early; label every open issue on the site repo `paused/non-payment`; leave both repos and the App install otherwise intact. Re-enable on `--mode resume` once paid. |
| `--mode rebuild-vanilla` | Per the contract clause "we'll happily rebuild your site automation-free" — no-op for the site repo (it is already autopilot-free under Pattern C); archive the pipeline repo; uninstall the App; transfer the site repo as in handover. |

This is the operator's safety valve. Document it in the contract and the client never feels locked in.

---

## 8. Migration note — Pattern C canonical as of 2026-04-28

The legacy "two-branch overlay" architecture (workflows on `operator/main` of each client repo, with `VENDOR_GITHUB_PAT` as the vendor identity) is **deprecated**. It survives only in:

- `11 §1` — the critique that recorded the cron-on-default-branch bug and chose Pattern C as the fix. The deprecated branch-overlay description is preserved there as decision history.
- `10 §2` and `12 §4` — the executive-summary and security-critique entries that name the failure modes Pattern C closes.

When you read the deprecated text in those critiques, treat it as historical context. The canonical architecture is Pattern C, defined in `02b-pattern-c-architecture.md` and operationalised in this file's §1–§7.

*Last updated: 2026-04-28.*
