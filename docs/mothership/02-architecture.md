<!-- OPERATOR-ONLY. -->

# 02 — Architecture: Mothership Repo + Client Repos

## 1. The two-repo-shape, in one diagram

```
┌─────────────────────────────────────────┐    ┌─────────────────────────────────────────┐
│  MOTHERSHIP REPO (operator-only)         │    │  CLIENT REPO (one per engagement)       │
│  palimkarakshay/{{BRAND_SLUG}}-mothership│    │  palimkarakshay/<client-slug>-site      │
│  Visibility: PRIVATE forever             │    │  Visibility: PRIVATE during eng;        │
│                                          │    │              transferred to client at    │
│  Branches:                               │    │              end of engagement.          │
│    main                — operator runbook│    │                                          │
│    docs/* — operator only                │    │  Branches:                                │
│                                          │    │    main          — client-visible site   │
│  Holds:                                  │    │    operator/main — autopilot overlay      │
│    docs/mothership/**     ← this folder  │    │                    (operator-pushed only) │
│    docs/freelance/**       (storefront)  │    │    auto/issue-N  — bot working branches  │
│    docs/operator/**        (per-eng)     │    │                                          │
│    docs/clients/<slug>/**  (per-client   │    │  Holds (on `main`):                       │
│      mirror — operator's copy of intake, │    │    src/                Next.js 16 app    │
│      contract, invoices)                 │    │    src/app/admin/      admin portal      │
│    n8n/**                  workflow JSON │    │    src/lib/admin-*.ts  allowlist + map   │
│    scripts/**              triage/exec   │    │    src/lib/github.ts   read-only octokit │
│    workflows-template/**   the .github/  │    │    src/lib/webhooks.ts HMAC sender       │
│      workflows that get applied to       │    │    middleware.ts       /admin gate       │
│      operator/main on each client repo   │    │    auth.ts             Auth.js v5 config │
│    dashboard/**            mobile SPA    │    │    .env.local.example                   │
│    cli/**                  per-client    │    │    package.json, etc.                   │
│      provisioning CLI (Phase P5)         │    │    README.md, CHANGELOG.md              │
│                                          │    │                                          │
│  Secrets: GitHub org-level, scoped per   │    │  Holds (on `operator/main` only):        │
│  client repo. Never inside this repo.    │    │    .github/workflows/**  the autopilot  │
│                                          │    │    scripts/**             prompts + libs│
└─────────────────────────────────────────┘    │    docs/operator/**       per-eng notes │
        │                                       │                                          │
        │  Operator's local checkout uses both. │  Cron schedules in workflows on         │
        │  The mothership has the master copy   │  operator/main run against repo's       │
        │  of every workflow file; per-engage-  │  default branch by design.              │
        │  ment, those files are pushed to      └─────────────────────────────────────────┘
        │  operator/main of the client repo                              ▲
        │  via the provisioning CLI.                                     │
        │                                                                │
        ▼                                                                │
┌──────────────────────────────────────────────────────────────────────┐ │
│  SHARED OPERATOR INFRA (one of each, used by all clients)            │ │
│                                                                      │ │
│  • GitHub org `{{BRAND_SLUG}}` with org-level Action secrets:        │ │
│      CLAUDE_CODE_OAUTH_TOKEN, GEMINI_API_KEY, OPENAI_API_KEY,        │─┘
│      VENDOR_GITHUB_PAT.                                              │
│      Repo access: "Selected" — adds each client repo individually.   │
│  • Vendor bot account `{{BRAND_SLUG}}-bot` (write on each client repo)│
│  • n8n on Railway, one instance, workflows suffixed -<client-slug>   │
│  • Twilio account, per-client phone number                           │
│  • Resend domain mail.{{BRAND_SLUG}}.com (one DKIM/SPF/DMARC stack)  │
│  • Vercel team `{{brand-slug}}` until handover                       │
│  • Operator dashboard on GH Pages of mothership repo                 │
└──────────────────────────────────────────────────────────────────────┘
```

The defining trick: **the autopilot files live on `operator/main` of each client repo, never on `main`.** A curious client cloning their `main` sees a clean Next.js + admin-portal codebase. The cron schedules still fire because GitHub Actions reads workflows from any branch with `schedule:` triggers in them. End-of-engagement: delete `operator/main`, the autopilot stops, the client keeps a vanilla repo.

> **Enforcement:** every assertion in this section is enforced by an explicit MUST / MUST-NOT row in [`pattern-c-enforcement-checklist.md`](pattern-c-enforcement-checklist.md). When a future change to the architecture would break a row there, update both files in the same PR.

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
│       ├── mothership-smoke.yml    # weekly health check across all client repos
│       ├── deploy-dashboard.yml    # publishes the dashboard to GitHub Pages
│       └── secret-rotation-warn.yml# warns on PATs nearing expiry
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
├── workflows-template/             # what gets pushed to client repo's operator/main
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
├── client-template/                # what gets pushed to client repo's main
│   ├── src/                        # full Next.js scaffold from current lumivara-site main
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
2. **Create the client repo** — `gh repo create palimkarakshay/<slug>-site --private`.
3. **Add to org + secret scope** — `gh api` calls to add the repo to `{{BRAND_SLUG}}` org and grant access to each org-level secret.
4. **Push `client-template/` to `main`** — using a temp working dir, render Mustache placeholders (`{{CLIENT_NAME}}`, `{{CLIENT_SLUG}}`, `{{DOMAIN}}`, etc.), commit, push.
5. **Push `workflows-template/` and `scripts/` to `operator/main`** — same temp dir, separate branch, separate push.
6. **Provision Vercel project** — Vercel API: create project, link to repo, set env vars from a per-client `.env.client.json` (operator-vault-encrypted), set deploy hook.
7. **Provision n8n workflows** — n8n REST API: import each JSON, rename suffix, set credentials (operator vault), activate.
8. **Provision Twilio number** — buy number, attach SMS webhook to the right n8n endpoint.
9. **Bootstrap GitHub labels + Project board** — runs `scripts/bootstrap-kanban.sh` against the new repo.
10. **Smoke-test** — runs the 6 smoke tests from `docs/operator/SMOKE_TESTS.md` and prints results.
11. **Render handover pack** — emits `docs/clients/<slug>/handover.md` from `07-client-handover-pack.md` with placeholders filled.

If any step fails, the CLI prints what's done and what's left, the operator finishes manually, and re-runs `--resume`. Every step is idempotent.

The teardown command does the inverse — see `06-operator-rebuild-prompt-v3.md §11`.

---

## 4. Trust zones — the canonical version

This refines `docs/TEMPLATE_REBUILD_PROMPT.md §1.1` with the two-repo split:

| Zone | Location | Owns | Sees |
|---|---|---|---|
| **Mothership** | mothership repo + `{{BRAND_SLUG}}` org + Railway n8n + operator's vault | Pipeline, prompts, secrets, dashboards, freelance pack, this folder | Everything |
| **Operator overlay on client repo** | client repo, `operator/main` branch only | Workflow files, prompts, scripts | Workflow logs, issue/PR contents — but **not** the secrets they consume (those come from org level) |
| **Client trust zone** | client repo, `main` branch | Site code, content, design tokens, admin portal client-side | Their `main` only, plus the admin portal in their browser. Cannot read `operator/main` (it's still in the same repo, but invisible to anyone without org Read access — and the org enforces "Members can read repos only when added") |
| **Shared third-party** | Vercel, Resend, Twilio, GitHub, OAuth providers | Operator pays the bills | Each side sees only its own dashboard |

The "operator/main is invisible to client even though it's in the same repo" claim deserves clarity:

- The client owns the **content** and is the **named owner** at end of engagement, but during the engagement the repo is owned by `palimkarakshay` (operator) and the client is added as a Read-only collaborator who only branches/PRs into `main`.
- Branch protection rules on `main` prevent the client from force-pushing or rewriting history.
- `operator/main` is set to "restricted to write by `{{BRAND_SLUG}}-bot`" via branch protection, so even the operator's personal account doesn't push there in normal flow.
- At graceful exit (`teardown` CLI), `operator/main` is deleted, branch protections are relaxed, the repo is transferred to the client's account, and `{{BRAND_SLUG}}-bot` is removed as a collaborator.

> **Enforcement:** trust-zone separation is enforced by C-MUST-1, C-MUST-2, C-MUST-4, and C-MUST-NOT-2 in [`pattern-c-enforcement-checklist.md`](pattern-c-enforcement-checklist.md). The pre-migration gate (§4) and post-migration verification (§5) of that file are what gate every client spinout.

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

---

## 6. The autopilot's view of the world

When a workflow on `operator/main` runs (cron-triggered), it:

1. Authenticates with `CLAUDE_CODE_OAUTH_TOKEN` (org secret, scoped to this repo).
2. Reads issues/PRs via the GitHub API (workflow's own `GITHUB_TOKEN`).
3. Runs the multi-AI router (`scripts/lib/routing.py`) to decide provider + model.
4. Writes to `auto/issue-<n>` branches (never to `main` directly).
5. Opens PRs targeting `main`. Vercel posts a preview.
6. Auto-merge gate kicks in for trivial/easy non-design PRs once the Vercel check is green.
7. n8n receives a Vercel deployment-succeeded webhook → notifies the client via their preferred channel.

The cron in workflows on `operator/main` operates against the repo's default branch (`main`). That is the documented GitHub Actions behaviour — it's why this two-branch trick works.

---

## 7. What changes when the engagement ends

Run `npx forge teardown --client-slug <slug>` and pick a mode:

| Mode | What happens |
|---|---|
| `--mode handover` | Delete `operator/main`. Drop branch protections. Remove `{{BRAND_SLUG}}-bot`. Remove repo from `{{BRAND_SLUG}}` org. Transfer repo to client GitHub account. Email client a vanilla README. |
| `--mode archive` | Same as handover, but the client takes a tarball, not a transferred repo. |
| `--mode pause` | (Non-payment.) Disable workflows on `operator/main`, label every open issue `paused/non-payment`, leave the rest intact. Re-enable on `--mode resume` once paid. |
| `--mode rebuild-vanilla` | Per the contract clause "we'll happily rebuild your site automation-free" — push a fresh, autopilot-free copy of `main` over `operator/main`, then handover. |

This is the operator's safety valve. Document it in the contract and the client never feels locked in.

*Last updated: 2026-04-28.*
