<!-- OPERATOR-ONLY. Sequenced plan for proving the automation in this repo BEFORE migrating to Pattern C. -->

# Automation Readiness & Bot-Driven Migration Plan

> **Goal.** Use this repo (`palimkarakshay/lumivara-site`) as the
> **proof-of-concept** for the autopilot, then have the bot drive the
> Pattern C migration into the new platform repo + per-client repos.
>
> **Status:** Drafted 2026-04-29 (this PR). Pre-Run S1, pre-P5 bootstrap.
> Operator-blocking rows are flagged ☐ **OPERATOR**; bot-runnable rows
> are flagged ▶ **BOT** with the exact Claude Code prompt to paste.
>
> **Why this file exists.** `05-mothership-repo-buildout-plan.md` lays
> out the *what* (P5.1 → P5.9). `06-operator-rebuild-prompt-v3.md` is
> the per-engagement playbook. Neither file sequences the **proof-first
> → migrate-second** approach you actually want. This file does.

---

## §0 — Reading order

1. This file (sequencing).
2. `docs/mothership/15b-naming-conventions.md` (terminology + folder
   shapes the steps below assume).
3. `docs/mothership/02b-pattern-c-architecture.md` (the canonical
   end-state).
4. `docs/mothership/05-mothership-repo-buildout-plan.md` (the phase
   detail this file calls into).
5. `docs/migrations/lumivara-people-advisory-spinout.md` (the Client #1
   one-shot, run after this file's Phase 4).

If you only have 5 minutes: read §1 (the bird's-eye sequence) and §8
(the prompt index), then come back.

---

## §1 — Sequence at a glance

```
PHASE 0 — Operator account + identity bootstrap     (operator only, ~1 day)
   └─ Create the Lumivara Forge org, the GitHub App, the vault, domains.

PHASE 1 — Prove the automation in THIS repo         (bot, ~2 weeks)
   └─ Close every open critique, finish the kanban, exercise every
      cron path on real issues, until 10 consecutive auto-routine
      issues land green without operator intervention.

PHASE 2 — Land Run S1 (mechanical rename)           (bot, 1 session)
   └─ {{BRAND}}/{{BRAND_SLUG}} → Lumivara Forge / lumivara-forge,
      mothership/ → platform/, freelance/ → storefront/,
      n8n-workflows/ → n8n/.

PHASE 3 — Bootstrap the platform repo               (bot + operator, ~1 week)
   └─ Run P5.1 (docs migrate) → P5.2 (workflow templates) →
      P5.3 (dashboard) → P5.4a-f (forge CLI).

PHASE 4 — Spin Client #1 out                         (bot + operator, ~3 days)
   └─ Run docs/migrations/lumivara-people-advisory-spinout.md, then
      validate via pattern-c-enforcement-checklist §5.

PHASE 5 — Onboard Client #2 from a clean slate      (bot, ~1 day)
   └─ Run `forge provision` end-to-end against a smoke-test client.
      First fully bot-driven onboarding.

PHASE 6 — Hardening + handover                      (bot + operator, ongoing)
   └─ Walk freelance/05 + 21-vault-strategy + 22-engagement-risk
      protection items into issues; tag legal review.
```

Each phase has a hard exit criterion — the next phase **does not start**
until the previous one's exit criterion is green. The operator's role
shrinks every phase.

---

## §2 — Phase 0: Operator account + identity bootstrap

**Audience:** operator only. The bot cannot do any of these — they all
require a human at github.com / vault / domain registrar / payment
methods.

**Estimated wall-clock:** one focused day. Each row 5–30 min.

### §2.1 — Pre-flight (settle decisions before clicking)

| # | Decision | Source of truth | Confirm? |
|---|---|---|---|
| 0.1 | Brand name = `Lumivara Forge`; slug = `lumivara-forge` | `15 §4` | ☐ |
| 0.2 | Org strategy: one new org `lumivara-forge`, free tier | `09 §1` | ☐ |
| 0.3 | Bot identity: GitHub App `lumivara-forge-pipeline-bot` (App-first; legacy machine-user PAT only as named exception) | `02b §3`, `09 §2 step 5` | ☐ |
| 0.4 | Break-glass second-Owner path: trusted human OR machine identity (pick **one** before clicking) | `09 §1.5` | ☐ |
| 0.5 | Vault: 1Password Business (per `21-vault-strategy-adr.md`) — account opened, MFA on, recovery kit printed | `21 §3` | ☐ |
| 0.6 | Trademark search filed (CIPO + USPTO Class 35 + 42) **before** registering the org slug — slug is permanent without paid migration | `15 §2` | ☐ |
| 0.7 | Payment methods ready: a Forge-only credit card (so personal vs business spend never mingles), and the GitHub Enterprise upgrade path documented | `20 §3` | ☐ |

If any row is unchecked, do not start §2.2.

### §2.2 — Operator action sequence (single sitting)

Execute top-to-bottom. Each row is one operator action; the verify
column is what to capture into 1Password before moving on.

| # | Action | Where | Verify (capture into 1Password as a note) |
|---|---|---|---|
| 1 | Buy `lumivara-forge.com` and `lumivara-forge.ca` | Cloudflare or Namecheap | Registrar order #, expiry, DNS provider |
| 2 | Create GitHub Org `lumivara-forge`, Free plan | <https://github.com/organizations/new> | Org URL, Owner = `palimkarakshay`, base permissions = "No permission" |
| 3 | Add second Owner per chosen path in 0.4 | Org → People → Invite | Second-Owner login, recovery codes envelope sealed, drill date booked |
| 4 | Create the GitHub App `lumivara-forge-pipeline-bot` | Org Settings → Developer settings → GitHub Apps → New | `APP_ID` (public), PEM downloaded once and stored in 1Password vault `forge / app / private-key` |
| 5 | Install the App on the (yet-empty) platform repo only | App settings → Install | `installation_id` for platform repo |
| 6 | Set org-level Action secrets (per `09 §2 step 7`): `CLAUDE_CODE_OAUTH_TOKEN`, `GEMINI_API_KEY`, `OPENAI_API_KEY`, `APP_ID`, `APP_PRIVATE_KEY` | Org Settings → Secrets and variables → Actions | Each secret listed; "Repository access: Selected" left empty for now |
| 7 | Create the empty platform repo `lumivara-forge/lumivara-forge-platform` (private) | `gh repo create lumivara-forge/lumivara-forge-platform --private --description "Lumivara Forge platform: operator runbooks, workflows, scripts, n8n, dashboard, CLI."` | Repo URL |
| 8 | Add the platform repo to "Selected repositories" for every secret in step 6 | Org Settings → secrets | UI checkbox set on each |
| 9 | Provision Resend, Twilio, Vercel team accounts under the **Forge** business email — not your personal email | Each provider's signup | Email addresses + login IDs in 1Password vault `forge / providers/<name>` |
| 10 | Spin up Railway project for n8n, dedicated to Forge | <https://railway.app/new> | Project URL, Postgres + n8n service URLs, n8n admin password |
| 11 | Print + seal recovery envelope (org Owner codes, 1Password recovery kit, App PEM fingerprint, Railway/Vercel/Resend recovery codes) | Operator desk | Envelope tracking #, deposit location, drill date booked |
| 12 | Calendar the quarterly recovery drill (`09 §1.5`) | Calendar | Recurring event Q1/Q2/Q3/Q4 first Friday |

**Hard exit criterion for Phase 0:**

```bash
# Run from the operator's machine. Every line must succeed.
gh api orgs/lumivara-forge >/dev/null
gh api repos/lumivara-forge/lumivara-forge-platform >/dev/null
gh api orgs/lumivara-forge/actions/secrets --jq '.secrets[].name' \
  | sort -u | diff - <(printf 'APP_ID\nAPP_PRIVATE_KEY\nCLAUDE_CODE_OAUTH_TOKEN\nGEMINI_API_KEY\nOPENAI_API_KEY\n')
```

(Substitute `OPENAI_API_KEY` if you skipped that one — `09 §2` lists it
as optional.)

### §2.3 — What you do NOT do in Phase 0

- ❌ Do **not** create per-client repos yet. The CLI will, in Phase 5.
- ❌ Do **not** push code to the platform repo manually beyond a
  one-line README. Phase 3 lands the docs via the bot.
- ❌ Do **not** transfer this repo (`palimkarakshay/lumivara-site`)
  to the new org. The transfer happens in Phase 4 as part of the
  Client #1 spinout.
- ❌ Do **not** disable the existing autopilot in this repo. It runs
  through Phase 1.


