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

---

## §5 — Phase 3: Bootstrap the platform repo

**Audience:** bot drives most of it; operator does GitHub UI clicks
where the API can't reach (App installations, branch protection
rulesets, Vercel project linking).

**Estimated wall-clock:** ~1 week of staggered Claude Code sessions.

### §5.1 — Sub-phase map (mirrors `05-mothership-repo-buildout-plan.md`)

| Sub-phase | What lands | Owner | Prompt §  |
|---|---|---|---|
| P5.1 | Operator-side docs migrated to platform repo | Bot | §5.2 |
| P5.2 | Workflow templates lifted (`workflows-template/`) + `scripts/` copied + parameterised with `{{CLIENT_*}}` placeholders | Bot | §5.3 |
| P5.3 | Dashboard migrated, client-switcher added, GitHub Pages target re-pointed | Bot | §5.4 |
| P5.4a | `cli/` skeleton (`forge --help`) | Bot | §5.5 |
| P5.4b | `forge provision` steps 1–7 (repo create, GitHub App install, secret scope) | Bot | §5.5 |
| P5.4c | `forge provision` steps 8–10 (Vercel API, n8n REST, Twilio number purchase) | Bot | §5.5 |
| P5.4d | `forge provision` steps 11–13 (kanban bootstrap, smoke test, handover render) + `--resume` | Bot | §5.5 |
| P5.4e | `forge teardown` modes (handover/archive/pause/rebuild-vanilla) | Bot | §5.5 |
| P5.4f | `forge set-tier`, `forge audit-secrets`, `forge costs`, `forge rotate-hmac` | Bot | §5.5 |
| P5.5 | Mirror Lumivara People Advisory client metadata into platform's `docs/clients/lumivara-people-advisory/` | Bot | §5.6 |

Run sub-phases sequentially. Each opens its own issue in the platform
repo, goes through the platform repo's own triage→plan→execute loop
(once P5.2 lands, the platform self-hosts its workflows).

### §5.2 — Prompt: P5.1 doc migration

```
Phase 3 P5.1 of docs/migrations/00-automation-readiness-plan.md.

Source repo:  palimkarakshay/lumivara-site (this one), branch main,
              post-Run-S1.
Target repo:  lumivara-forge/lumivara-forge-platform, branch main,
              today: empty + one-line README.

You have local clones of both. Do this:

1. From the source repo, copy the following paths VERBATIM into the
   target repo:
     docs/platform/                 (was docs/mothership/, S1-renamed)
     docs/storefront/               (was docs/freelance/, S1-renamed)
     docs/migrations/               (entire folder including this file)
     docs/ops/
     docs/research/
     docs/decks/
     docs/wiki/                     (operator-lane pages only — leave
                                     🌐 client-lane pages on this repo;
                                     see 15 §6 + wiki/_partials/lane-key.md
                                     for which is which)
     docs/AI_ROUTING.md
     docs/ADMIN_PORTAL_PLAN.md
     docs/N8N_SETUP.md
     docs/MONITORING.md
     docs/BACKLOG.md
     docs/GEMINI_TASKS.md
     docs/AI_CONSISTENCY.md
     docs/OPERATOR_SETUP.md
     docs/TEMPLATE_REBUILD_PROMPT.md
     AGENTS.md
     CLAUDE.md
     CHANGELOG.md (operator slice — see 14 §6 schema)

2. In the target repo, drop the docs/ prefix where files were promoted
   to top-level (none today; keep the docs/ prefix).

3. Add the platform repo's own README.md, .gitignore, .claudeignore,
   .editorconfig per 05 §P5.1 step 5.

4. Commit each top-level group separately:
     - "feat(docs): seed platform docs from lumivara-site"
     - "feat(docs): seed storefront pack"
     - "feat(docs): seed migration runbooks"
     - "feat(docs): seed ops/research/decks/wiki"
     - "feat(docs): seed top-level operator docs (AI_ROUTING, etc.)"
     - "feat(meta): platform README + ignores"

5. Push to lumivara-forge/lumivara-forge-platform main.

Leave the source repo (this one) untouched in P5.1 — it stays the
de-facto Client #1 site repo until Phase 4. Do NOT delete the docs
from this repo yet.

Budget: at 70% of max-turns, commit + push + exit. Resume from the
last completed copy group.
```

### §5.3 — Prompt: P5.2 workflow templates + scripts

```
Phase 3 P5.2 of docs/migrations/00-automation-readiness-plan.md.

In the platform repo:

1. Create workflows-template/.
2. Copy each YAML from this repo's .github/workflows/ into
   workflows-template/, renaming literal references to
   palimkarakshay/lumivara-site → ${{ vars.SITE_REPO_OWNER }}/${{ vars.SITE_REPO_NAME }}.
3. Replace literal label values like client/lumivara → client/${{ vars.CLIENT_SLUG }}.
4. Replace hard-coded branch names with ${{ vars.DEFAULT_BRANCH }}
   (default main).
5. For each ${{ secrets.* }} reference, confirm it matches the org
   secret names from 09 §2 step 7. If not, raise an issue tagged
   area/forge, priority/P1; do NOT silently rename.
6. Create scripts/ in the platform repo and copy:
     triage-prompt.md, execute-prompt.md, plan-issue.py,
     gemini-triage.py, codex-triage.py, codex-plan-review.py,
     codex-fix-classify.py, codex-review-fallback.py,
     test-routing.py, test-forge-routing.py, bootstrap-kanban.sh,
     create-mothership-seed-issues.sh (rename to
     create-platform-seed-issues.sh + grep its body),
     bot-usage-report.py, recheck-missed-reviews.py,
     seed-codex-review-backlog.py
   plus scripts/lib/ (verbatim).
7. Add a tests/ folder with a synthetic-issue fixture so each Python
   script can be unit-tested for an "exit 0 with this stub" smoke.
8. Commit per logical group: workflows-template, scripts root,
   scripts/lib, tests.
9. The smoke check from 05 §P5.2 DOD:
     git -C platform grep -n "palimkarakshay/lumivara-site" -- workflows-template/ scripts/
   must return zero matches.

Budget: at 70% of max-turns, exit cleanly.
```

### §5.4 — Prompt: P5.3 dashboard migration

```
Phase 3 P5.3 of docs/migrations/00-automation-readiness-plan.md.

In the platform repo:

1. Copy this repo's dashboard/ tree verbatim.
2. Update dashboard/src/lib/config.ts to read the active client repo
   from a localStorage selector "forge-active-client-slug" (default
   first repo from a /api/clients endpoint we'll mock for now).
3. Add a ClientSwitcher component above the existing WorkflowList.
4. Update the deploy workflow to target
   palimkarakshay.github.io/lumivara-forge-platform (not the old slug).
5. npm install + npm run build must succeed.
6. Commit + push.

Out-of-scope (for a follow-up issue): live data from the platform's
own API. Today the switcher just pivots which repo's Action runs the
dashboard polls; the API endpoint shape stays.
```

### §5.5 — Prompts: P5.4a–f forge CLI

The CLI is the largest deliverable. Each sub-phase is ONE bot session
that opens ONE issue in the platform repo and goes through the
platform's own triage→plan→execute loop. Use this prompt as a
template, swapping the sub-phase ID:

```
Phase 3 P5.4{X} of docs/migrations/00-automation-readiness-plan.md.

Open an issue in lumivara-forge/lumivara-forge-platform titled:
  "feat(cli): P5.4{X} — {sub-phase deliverable}"

Body must reference:
  - 05 §P5.4 sub-phase {X} for the deliverable list
  - 02b §2 for the provisioning order
  - 03 §3 for the secret topology
  - 18-provisioning-automation-matrix.md for the Step IDs the CLI
    must implement

Add labels: area/forge, complexity/{complex|complex+}, priority/P1,
status/needs-triage. Let the platform's own triage cron pick it up.

Once the bot opens its draft PR, review and merge per the standard
playbook.

Repeat for sub-phases a, b, c, d, e, f. Sequential, not parallel —
each builds on the last.
```

The CLI's `forge --help` is the exit criterion for P5.4 as a whole;
each sub-phase's exit criterion is in `05 §P5.4` rows.

### §5.6 — Prompt: P5.5 mirror Client #1 metadata

```
Phase 3 P5.5 of docs/migrations/00-automation-readiness-plan.md.

In the platform repo:

1. Create docs/clients/lumivara-people-advisory/.
2. Add intake.md, cadence.json, secrets.md.age, runbook.md,
   engagement-log.md, evidence-log.md per 05 §P5.5 + 19-engagement-
   evidence-log-template.md.
3. Validate cadence.json against schema/cadence.schema.json (create
   the schema first if it doesn't exist; reference 04-tier-based-
   agent-cadence.md for the field set).
4. Commit + push.

This phase mirrors Client #1's existence into the platform — it does
NOT yet move Client #1's site code anywhere. That's Phase 4.
```

### §5.7 — Hard exit criterion

- `npx forge --help` runs in the platform repo and lists every
  subcommand from `05 §P5.4`.
- `npx forge provision --client-slug demo --tier 2 --domain demo.test --dry-run`
  prints the full plan with no real API calls.
- `pattern-c-enforcement-checklist.md §4` pre-flight rows can all
  resolve "ready" against the platform repo's state.
- The platform repo's own kanban shows P5.1 → P5.5 issues all in
  Done.

---

## §6 — Phase 4: Spin Client #1 out (Lumivara People Advisory)

**Audience:** bot drives the doc edits and pipeline-repo population;
operator does the GitHub UI clicks (rename, App install, branch
protection, Vercel project move) — and signs off the cutover.

**Estimated wall-clock:** ~3 days, of which ~3 hours is operator
clicking and ~1 day is wall-clock waiting on Vercel + DNS propagation.

### §6.1 — The runbook this phase calls

[`docs/migrations/lumivara-people-advisory-spinout.md`](lumivara-people-advisory-spinout.md)
is the canonical, step-by-step procedure. This phase is essentially
"run that runbook, with the operator's hand on the rename button."

> **Drift fix needed before running.** That runbook still describes
> the deprecated `operator/main` overlay branch (line 5). It must be
> rewritten to the two-repo model from `02b-pattern-c-architecture.md`
> before this phase starts. File this as the first issue of Phase 4:
> "fix(docs): align spinout runbook with 02b two-repo Pattern C".
> Same applies to `pattern-c-enforcement-checklist.md §1` — see §10
> of this file.

### §6.2 — Operator action set (manual, ~3 hours total)

Each row is a single click sequence. The runbook's prose owns the
detail; this list exists so the operator can budget the day.

| # | Action | Where | Owner | Reversible? |
|---|---|---|---|---|
| 1 | Pre-flight: walk every row of pattern-c-enforcement-checklist §4 against this repo's state | Local terminal | Operator | n/a |
| 2 | Capture issue tracker + project-board snapshot | `gh issue list … > /tmp/lps-issues.json` | Operator | n/a (capture only) |
| 3 | Create new repo `palimkarakshay/lumivara-people-advisory-site` (private) | github.com/new | Operator | Easy (delete repo) |
| 4 | Create new repo `palimkarakshay/lumivara-people-advisory-pipeline` (private) | github.com/new | Operator | Easy (delete repo) |
| 5 | Bot pushes site-only files to `*-site/main` (per Table A in `_artifact-allow-deny.md`) | Local + bot prompt §6.4 | Bot | Yes (delete branch) |
| 6 | Bot pushes workflows + scripts to `*-pipeline/main` | Same | Bot | Yes |
| 7 | Install GitHub App on `*-site` only | App settings → Install on selected repo | Operator | Yes (uninstall) |
| 8 | Capture installation_id into `docs/clients/lumivara-people-advisory/cadence.json` (in platform repo) | Bot prompt §6.4 | Bot | Yes |
| 9 | Apply branch protection on `*-site/main` per `03 §2.2` and `pattern-c-enforcement-checklist §C-MUST-4` (post-fix) | Repo Settings → Branches | Operator | Yes |
| 10 | Apply branch protection on `*-pipeline/main` per `02b §7` | Same | Operator | Yes |
| 11 | Create new Vercel project linked to `*-site/main`; copy env vars (`RESEND_API_KEY`, `CONTACT_EMAIL`, `NEXT_PUBLIC_*`) from the old project | Vercel UI | Operator | Yes (delete project) |
| 12 | DNS cutover: point `lumivara.ca` to the new Vercel project | DNS provider | Operator | **Hard** — propagation lag |
| 13 | Add Beas as a Read collaborator on `*-site` only | Repo settings → Collaborators | Operator | Yes |
| 14 | Run post-migration acceptance set (`pattern-c-enforcement-checklist §5`) | Local terminal | Operator + bot | n/a (audit) |
| 15 | Archive (don't delete) `palimkarakshay/lumivara-site` once production is verified green for 24h | Repo Settings → Archive | Operator | Yes (unarchive) |

The DNS cutover (row 12) is the only **hard-to-reverse** action. Plan
it for a low-traffic window. Budget 1 h for propagation.

### §6.3 — Bot prompt for the doc + pipeline-repo population

```
Phase 4 of docs/migrations/00-automation-readiness-plan.md.

You are running docs/migrations/lumivara-people-advisory-spinout.md
end-to-end against the post-S1, post-Phase-3 state.

Pre-flight (HARD STOP if any fails):
  1. The spinout runbook itself has been updated to the two-repo
     Pattern C model (no operator/main overlay) — verify by:
       grep -n "operator/main" docs/migrations/lumivara-people-advisory-spinout.md
     must return zero matches outside an explicit "deprecated" callout.
  2. pattern-c-enforcement-checklist.md §1 + §C-MUST-2 + §C-MUST-4 +
     §C-MUST-8 reference the pipeline repo, not the overlay branch.
  3. Phase 3 P5.4b–d is done (forge provision exists and dry-run
     prints the plan).
  4. The operator has confirmed in writing on the spinout runbook's
     §0 "fresh repo + selective copy chosen" checkbox.

Then run:
  - §1 of the runbook (mirror Client #1 into platform repo) — bot.
  - §2–§3 of the runbook (selective copy from this repo into the new
    site-repo per Table A; pipeline-repo population per Table C) —
    bot, with the operator manually creating the empty repos first
    (Phase 4 row 3+4 above).
  - §4 (secrets and Vercel) — operator-manual; bot drafts the env
    var inventory diff for the operator to apply.
  - §5 (branch protection) — operator-manual; bot drafts the JSON
    payload.
  - §6 (smoke tests) — bot runs them and reports.
  - §7 (operator sign-off + DNS cutover) — operator-manual.
  - §8 (post-migration verification = pattern-c §5) — bot runs every
    verify command and posts results to the spinout issue.
  - §9 (acceptance) — bot opens the "spinout complete" issue with
    the captured evidence trail.

Budget: at 70% of max-turns, commit + push + exit cleanly. The
runbook is structured so that any phase boundary is a safe stop.
```

### §6.4 — Hard exit criterion

```bash
# Site repo: zero operator artefacts on main
git -C lumivara-people-advisory-site ls-tree main -r --name-only \
  | grep -E '(^docs/(platform|storefront|operator|migrations|ops)/|^n8n/|^dashboard/|^scripts/(triage|execute|gemini|codex|plan-issue|test-routing|bootstrap-kanban)|^scripts/lib/)' \
  | wc -l
# expect: 0

# Pipeline repo: cron fires from main and the App-token PR-opener works
gh workflow run smoke.yml --repo palimkarakshay/lumivara-people-advisory-pipeline
# expect: green within 5 minutes; opens a no-op PR on the site repo

# Production: visitor traffic unchanged
curl -sI https://lumivara.ca | head -1
# expect: HTTP/2 200
```

All three rows green, plus every row of `pattern-c-enforcement-checklist §5`
ticked.


