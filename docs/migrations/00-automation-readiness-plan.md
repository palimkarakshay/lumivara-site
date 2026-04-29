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

---

## §3 — Phase 1: Prove the autopilot in this repo

**Audience:** bot drives, operator reviews. The point of this phase is
to pile up a **green-streak audit trail** that proves the autopilot is
trustworthy enough to go drive the migration in Phases 2–5.

**Estimated wall-clock:** ~2 weeks of bot cron runs + ~3 hours of
operator review per week.

### §3.1 — Exit criterion (the only thing that matters)

```
[ ] 10 consecutive auto-routine issues land green:
    triage → plan → execute → review → auto-merge → Vercel preview → prod,
    with zero operator intervention beyond merge approval.

[ ] Each of the seven cron paths (triage, execute, execute-complex,
    execute-single, codex-review, deep-research, auto-merge) has fired
    at least once in the streak.

[ ] No P1 issues opened during the streak by the codex-review,
    deep-research, or smoke-test workflows.

[ ] The kanban board (Inbox → Triaged → In Progress → Review → Done)
    correctly mirrors GitHub state with no manual moves.
```

If any condition slips, the streak resets to zero. This is intentional
— we are buying confidence, not throughput.

### §3.2 — Kanban hygiene before counting starts

Before the green streak begins, the operator (or the bot, via the
prompt in §3.4) walks the open issue list and:

1. Confirms every issue has `priority/`, `complexity/`, `area/` labels.
2. Closes obsolete issues (anything blocked on Pattern C migration —
   tag `status/post-migration` and close).
3. Files a fresh tracking issue: **"Phase 1 green streak — counter at
   0/10"**, label `meta/automation-readiness`, pinned. Body holds the
   live tally; one comment per landed issue.

### §3.3 — Per-cron-path smoke seeds

To exercise every workflow at least once during the streak, file these
synthetic but real-work issues (each becomes a green streak row):

| Cron path | Seed issue title (file these as real issues) |
|---|---|
| triage | "chore: rerun triage on issues #X..#Y after label rename" |
| execute (routine) | "docs: fix three typos in `docs/freelance/00-quick-start.md`" |
| execute-complex | "feat: add a 'Forge' badge to the homepage hero" |
| execute-single | "fix: rerun execute on #N with model override `claude-opus-4-7`" (uses `workflow_dispatch`) |
| codex-review | (auto — fires on every PR opened by the streak above) |
| deep-research | "research: summarise PIPEDA breach-notification windows for our risk register" |
| auto-merge | (auto — fires on green Vercel + low-complexity PRs in the streak) |

The deep-research seed is deliberately a **document-only** task — it
exercises the path without spending compute on code that will be thrown
away in Phase 4.

### §3.4 — Bot prompt for Phase 1

Paste this into Claude Code (Opus, extended thinking on, in this repo)
when you're ready to begin the streak:

```
Phase 1 of docs/migrations/00-automation-readiness-plan.md.

You are the operator-side reviewer for the next 10 days. Your job is
to walk the open issue list, normalise labels, file the seven seed
issues from §3.3, and append progress to the meta/automation-readiness
tracking issue. You do NOT modify .github/workflows/, scripts/, .env*,
package.json, or src/app/api/contact/* — those remain operator-manual.

At each step:
1. Read the tracking issue body for the current counter value.
2. List open auto-routine issues that have landed since the last entry.
3. For each one that landed cleanly (PR merged, Vercel green,
   no follow-up issues opened), increment the counter and append a row.
4. If the counter reaches 10, comment "READY FOR PHASE 2" on the
   tracking issue and stop.
5. If a row breaks the streak (Vercel red, follow-up P1 opened,
   manual intervention needed), reset the counter to 0 and document
   the reason in a comment.

Do not start Phase 2 work even if asked — Phase 2 is a separate
session.
```

### §3.5 — Hard exit gate

The exit gate is `READY FOR PHASE 2` on the tracking issue **plus** a
manual operator review of the streak's PRs. If the operator can't say
"I would have approved every one of these without changes," the streak
doesn't count — start over with stricter triage.

---

## §4 — Phase 2: Run S1 — mechanical rename

**Audience:** bot drives a single Claude Code session; operator
reviews the resulting PR.

**Estimated wall-clock:** one focused 60–90 turn session. Single PR.

### §4.1 — What S1 does

Single global find-replace pass against this repo. Every change is
mechanical — placeholders to brand-locked values, plus the folder
renames from `15b §2`.

| Find | Replace | Files |
|---|---|---|
| `{{BRAND}}` | `Lumivara Forge` | All `docs/`, `AGENTS.md`, `README.md` (where present) |
| `{{BRAND_SLUG}}` | `lumivara-forge` | All `docs/`, all `.github/workflows/*.yml`, `scripts/`, `dashboard/` |
| `docs/mothership/` | `docs/platform/` | `git mv` + every relative link |
| `docs/freelance/` | `docs/storefront/` | `git mv` + every relative link |
| `docs/n8n-workflows/` | `docs/n8n/` | `git mv` + every relative link |
| `mothership` (prose, case-insensitive) | `platform` | `docs/`, `AGENTS.md`, wiki — **except** `15 §1` glossary, `15b §1`, and migration-history docs (per `15 §6`) |
| `mothership-bot` (slug) | `pipeline-bot` | secret names, doc references |
| `client-template/` | `site-template/` | docs, future runtime |
| `mothership-smoke` (status check) | `platform-smoke` | `pattern-c-enforcement-checklist`, `03-secure-architecture` |

### §4.2 — What S1 does NOT do

- ❌ Does not rename `palimkarakshay/lumivara-site` → anything. The
  repo rename happens in Phase 4 with the spinout.
- ❌ Does not transfer the repo to the `lumivara-forge` org. Same.
- ❌ Does not touch `src/` — the client-side Next.js code stays put
  (it's Client #1's, not the platform's).
- ❌ Does not touch the four hard-excluded paths from
  `scripts/execute-prompt.md` step 4: `.github/workflows/`, `scripts/`,
  `.env*`, `package.json`, `src/app/api/contact/*` — except for the
  literal `{{BRAND_SLUG}}` substitutions in workflows, which the
  operator approves manually after the bot drafts the PR.

### §4.3 — Bot prompt for Run S1

Paste verbatim into Claude Code (Opus, extended thinking on, in this
repo). One session, one PR. **Do not run this until Phase 1 is green.**

```
Run S1 from docs/mothership/16-automation-prompt-pack.md §5 and
docs/mothership/15b-naming-conventions.md §2.

Single PR titled "chore(rename): Run S1 — Lumivara Forge brand lock".

Steps:
1. Read 15b §2 for the find/replace table.
2. For each placeholder substitution, run a project-wide grep first;
   confirm the count matches the row in 15 §4 ("renames touch ~150
   references") within ±20%.
3. Apply substitutions in this order, committing after each logical
   group:
     a. {{BRAND}} → Lumivara Forge
     b. {{BRAND_SLUG}} → lumivara-forge
     c. mothership → platform (case-insensitive prose; preserve the
        exception list from 15 §6 — do not modify 15 §1, 15b §1, or
        any migration-history doc; instead append a one-line
        "historical reference, intentional" comment if a hit there
        is ambiguous)
     d. freelance → storefront (folder + cross-links only; the
        outward-marketing prose word "freelance" stays where it
        describes a market, e.g. "freelance market on Upwork")
     e. n8n-workflows/ → n8n/
     f. mothership-bot → pipeline-bot, mothership-smoke → platform-smoke
4. Run the rename portion: git mv docs/mothership docs/platform,
   git mv docs/freelance docs/storefront, git mv docs/n8n-workflows
   docs/n8n. Commit each as its own commit.
5. Update relative links (../mothership/ → ../platform/, etc.) via
   sed across docs/ and *.md. Commit.
6. Run the audit greps from 15 §6 and 15b §6. Both must return zero
   matches outside the exception list.
7. Verify:
     - npm run lint → green (no source changes; should be unaffected).
     - npx tsc --noEmit → green.
     - Every link in docs/platform/00-INDEX.md resolves (use a
       link-checker like `lychee` or just grep + ls).
8. Open the PR with the standard Vercel-mirror callout (none needed
   for S1 — purely doc renames).

Hard exclusions: do not touch src/, package.json, .env*, the four
paths in scripts/execute-prompt.md step 4 except for the
{{BRAND_SLUG}} value substitutions.

Budget: at 70% of max-turns, finish the current commit, push, and
exit cleanly. The next session resumes from step 6.
```

### §4.4 — Hard exit criterion

```bash
git grep -niE 'mothership|\{\{BRAND(_SLUG)?\}\}' \
  -- docs/ README.md AGENTS.md CLAUDE.md \
  | grep -vE '15-terminology-and-brand\.md|15b-naming-conventions\.md|migrations/'
```

Returns zero lines. The link checker reports zero broken internal
links. `npm run build` succeeds.


