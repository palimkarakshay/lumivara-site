<!-- OPERATOR-ONLY. Copy-paste prompts for Claude Code in the browser (Opus 4.7 Max). -->

# 16 — Automation Prompt Pack (Claude Code in the browser, Opus 4.7 Max)

Three closes-the-critique prompts (Run A, B, C) plus a fourth optional cleanup (Run D) and three supplementary one-shot prompts (S1, S2, S3) to hand to Claude Code in the browser. Each prompt is self-contained — paste it, hit run, walk away.

> **Mode:** Opus 4.7 Max (1M context). The prompts assume you have the mothership pack (`docs/mothership/`) and the supporting docs (`docs/AI_ROUTING.md`, `docs/ADMIN_PORTAL_PLAN.md`, `docs/N8N_SETUP.md`, `freelance/*`) checked into the working tree.
>
> **Per-run discipline:** every prompt below opens its own branch + PR; never run two in parallel against the same files. Order: A → B → C (D and S1–S3 can interleave).

---

## §1 — Run A: Fix the architectural cron flaw + propagate

**Goal:** close the items in `11 §1` and `11 §2`. Pick a pattern, refactor every doc and template that depends on the old "two-branch trick," and ship one PR.

**Estimated:** Opus 4.7 Max, ~80–120 turns, ~1.5–2.5 h wall time.

**Branch:** `claude/architecture-cron-fix`.

**Copy-paste prompt:**

```
You are a senior infrastructure architect helping me close a correctness
bug in this repo's mothership pack. Read these files first, in order:

  docs/mothership/00-INDEX.md
  docs/mothership/02-architecture.md
  docs/mothership/03-secure-architecture.md
  docs/mothership/05-mothership-repo-buildout-plan.md
  docs/mothership/06-operator-rebuild-prompt-v3.md
  docs/mothership/11-critique-architectural-issues.md   ← read carefully, this is your spec
  docs/mothership/15-terminology-and-brand.md           ← rename guidance

The bug: 02 §1 / §6 and 03 §2.1 claim that scheduled GitHub Actions
workflows on a non-default branch ('operator/main') will fire on cron.
They will not. Cron only triggers from workflow files on the default
branch. The pack as written produces zero scheduled runs.

Your task: pick **Pattern A** from 11 §1 (default branch becomes
'operator/main', client-visible content lives on 'client/main') for
the existing engagement, and document **Pattern C** (separate
pipeline repo) as the migration target by client #3.

Concretely, in this PR:

1. Decision: write a new file 'docs/mothership/02b-branch-and-fleet-pattern.md'
   that explains Pattern A as the current convention, including:
     - default branch rename procedure (gh api PATCH .../repos/.../{owner}/{repo})
     - branch protection rule deltas vs 03 §2.2
     - Vercel project source-branch flip ('client/main')
     - the 'why this works' callout: scheduled workflows fire from default
     - a 'when to migrate to Pattern C' section listing the trigger
       (>= 3 paying clients OR a client requests Read access to their
       repo before handover) and a one-page migration sketch.

2. Update existing docs to match the chosen pattern:
     - 02 §1 diagram: replace 'main / operator/main' with
       'client/main / operator/main (default)'.
     - 02 §4 trust-zones table: update branch references.
     - 02 §6 'autopilot's view of the world': fix the cron paragraph
       to read 'cron fires from operator/main, the repo's default
       branch; the pipeline opens PRs targeting client/main, which
       Vercel deploys.'
     - 03 §2.1 / §2.2: branch-protection rules now apply to
       client/main (the 'client-readable' branch) and operator/main
       (the 'pipeline' branch); update the YAML examples.
     - 05 §P5.6 step 3: replace 'Move .github/workflows/ files into
       a temp branch operator/main' with the corrected sequence:
       'Set repo default branch to operator/main; rename existing
       main → client/main; push workflow files to operator/main;
       reconfigure Vercel to deploy from client/main.'
     - 06 §3 Prompt B1: substitute the new branch names throughout.

3. Sanitize the audit-trail comments per 12 §6 (the reasoning why
   now applies as soon as the autopilot is functional). For every
   workflow file under .github/workflows/ in this repo that posts
   PR comments or step summaries with model-routing details, gate
   the post step on:

       if: github.actor == vars.OPERATOR_HANDLE ||
           github.actor == vars.BOT_HANDLE

   This is a small but real defensive measure once a client gets
   Read access.

4. Open a tracking issue in this repo titled 'migrate to Pattern C
   (separate pipeline repo) by client #3' with the body extracted
   from 02b §"when to migrate to Pattern C". Label it
   `area/architecture`, `priority/P2`, `human-only`.

5. Update docs/mothership/00-INDEX.md:
     - Add 02b to the read-order table.
     - Mark 11 (the critique that drove this work) with a 'closed
       by PR #N' note in §1 once the PR is opened.

Constraints:
  - One PR. Branch name: claude/architecture-cron-fix.
  - Commit per logical unit (one for 02b, one for 02, one for 03,
    one for 05, one for 06, one for the audit-trail sanitization,
    one for the tracking issue).
  - Do not touch any client-template/ or workflows-template/
    contents — those migrations happen in P5, not this PR.
  - Do not make naming/brand decisions; that is Run S1.
  - Respect AGENTS.md budget gates: at 50% turns, finish current
    commit and stop with a status comment on the PR.

DOD:
  - PR is open against main.
  - 02b exists and is internally linked from 02 §1 and from 00-INDEX.
  - All section anchors in cross-references resolve.
  - 'git -C . grep -n "operator/main is invisible"' returns 0 matches
    (the old claim is gone).
  - 'grep -nE "schedule:.*operator/main" docs/' returns 0 matches.
  - The tracking issue exists.
```

**What to verify after Run A finishes (operator review, ~10 min):**

```
[ ] Read 02b in full. Does Pattern A description match your intent?
[ ] Open the PR's Files tab. Does each commit do exactly one logical
    thing?
[ ] Confirm 11 is marked 'closed by PR #N' or similar.
[ ] Manually merge once happy. Run B may begin.
```

---

## §2 — Run B: Close the security gaps

**Goal:** close the items in `12 §1`–`§6`. Land the break-glass topology, per-client Resend keys, two-phase HMAC rotation, GitHub-App swap (or PAT alarm), gitleaks, and audit-trail sanitisation that wasn't done in Run A.

**Estimated:** Opus 4.7 Max, ~80–120 turns, ~1.5–2.5 h wall time.

**Branch:** `claude/security-cost-firewall`.

**Copy-paste prompt:**

```
You are a senior security engineer + SRE helping me close every
production-blocking security gap in this repo's mothership pack.
Read these files in order:

  docs/mothership/03-secure-architecture.md
  docs/mothership/09-github-account-topology.md
  docs/mothership/12-critique-security-secrets.md   ← your spec
  docs/mothership/02-architecture.md  (for the secret topology)
  docs/mothership/04-tier-based-agent-cadence.md   (for cadence.json schema)
  docs/AI_ROUTING.md                  (for audit-trail print sites)

Your task: ship one PR that lands every fix in 12 §8 except items
that require operator-side actions outside the repo (e.g. inviting a
human to be a second Owner, printing recovery codes). For those,
produce an explicit operator-checklist with copy-paste commands.

Concretely, in this PR:

1. Update docs/mothership/03-secure-architecture.md:
     - §3 secret topology table: AUTH_RESEND_KEY moves from
       'shared across clients' to 'per-client; one Resend API key
       per client; rotation is 6 months.'
     - Add a §3.3 'Two-phase HMAC rotation' subsection with the
       three-phase recipe from 12 §3 (prepare / commit / cleanup).
       Include exact n8n-credential and 'vercel env' commands.
     - Add a §3.4 'Vendor identity is a GitHub App, not a PAT'
       subsection. Include: app manifest YAML, install instructions,
       scope list (Issues:RW, Pull requests:RW, Contents:RW, Metadata:R,
       Workflows:RW), how the app's installation token gets injected
       into workflows (replace VENDOR_GITHUB_PAT references with
       APP_INSTALLATION_TOKEN, generated per-run via the 'create-github-app-token'
       action). If keeping the PAT short-term, document the 14-day
       expiry-warning workflow in 09 §X.
     - Update §6 'Claude exfiltration thought experiment' to reference
       the new audit-trail sanitisation (Run A sanitised PR comments;
       confirm step-summary sanitisation here).

2. Update docs/mothership/09-github-account-topology.md:
     - Add §1.1 'Break-glass topology' explaining: a second Owner
       (human or recovery machine identity), printed recovery codes
       in the trusted-second-party envelope, quarterly recovery drill.
     - Add §3.1 'GitHub App vs PAT' explaining the recommended swap.
     - Add a §6 'Operator checklist (manual)' that lists the GitHub
       UI clicks the operator must do: invite second Owner, store
       recovery codes, print, seal envelope, schedule first drill.

3. Update mothership/cli design:
     - In 02 §3 step 6 (Vercel provisioning), inject 'create per-client
       Resend API key' as new step 6a. Reference the Resend API call
       sequence that creates one key per client_slug, scoped to
       sending_access on the operator's domain.
     - In 02 §3 add new step 12 'rotate-hmac' subcommand spec with
       the two-phase pattern. Document --phase=prepare / --phase=commit
       / --phase=cleanup CLI args.

4. Add a new file docs/mothership/03b-github-app-spec.md with the full
   GitHub App manifest, scopes, installation steps, and the
   recommended replacement for every '${{ secrets.VENDOR_GITHUB_PAT }}'
   reference in workflows-template/ once it exists in the mothership.
   Include the YAML for 'tibdex/github-app-token@v2' or the
   'actions/create-github-app-token' action.

5. Add gitleaks to this repo:
     - Create .github/workflows/gitleaks.yml that runs on every
       pull_request, fails if any secret-looking string is committed.
     - Add a small gitleaks.toml allowlist for known-safe values
       (e.g. lib/admin-allowlist.ts emails are not secrets).
     - Document in CONTRIBUTING.md.

6. Add docs/operator/RECOVERY_DRILL_LOG.md (empty template) so the
   first drill has somewhere to write.

7. Update docs/mothership/00-INDEX.md to add 03b to the read order
   and mark 12 as 'closed by PR #N'.

Constraints:
  - One PR. Branch: claude/security-cost-firewall.
  - Do NOT actually rotate any real secrets in this PR. Only document
    the procedure. Real rotation is an operator-side ceremony.
  - Do NOT add the second human Owner via gh api — that needs the
    operator's manual GitHub UI step.
  - Respect AGENTS.md budget gates.

DOD:
  - PR open against main.
  - 03 §3 reflects per-client AUTH_RESEND_KEY.
  - 03 §3.3 has the two-phase HMAC recipe with concrete commands.
  - 03b-github-app-spec.md is internally linked from 03 and 09.
  - .github/workflows/gitleaks.yml runs green on this branch.
  - Operator-checklist in 09 §6 has copy-paste commands.
  - 'grep -nE "AUTH_RESEND_KEY.*shared|same key for every client"
       docs/' returns 0 matches.
```

**What to verify after Run B finishes:**

```
[ ] Read 03 §3.3 and 03b. Does the two-phase rotation make sense to
    you when you're tired? (If not, simplify it.)
[ ] Run the gitleaks workflow against the PR. It should pass.
[ ] Schedule the operator-side ceremonies (invite second Owner,
    print recovery codes, install GitHub App). Block 90 minutes.
```

---

## §3 — Run C: Reconcile the maths and name the scaling cliffs

**Goal:** close `13 §1`–`§7`. This is mostly numbers + edits — no architecture decisions — so use **Sonnet 4.6** (cheaper, faster).

**Estimated:** Sonnet 4.6, ~60–80 turns, ~45–60 min.

**Branch:** `claude/maths-and-scaling-cliffs`.

**Copy-paste prompt:**

```
You are a meticulous senior accountant + SRE doing a numbers-and-text
reconciliation pass. Read in order:

  docs/mothership/04-tier-based-agent-cadence.md
  docs/mothership/09-github-account-topology.md
  docs/freelance/03-cost-analysis.md
  docs/AI_ROUTING.md
  AGENTS.md
  docs/mothership/13-critique-ai-and-scaling.md  ← your spec

Your task: every published number in the pack must reconcile across
docs. Today, three sets are inconsistent:

  - GitHub Actions minutes (04 §1, 09 §1, freelance/03 §A).
  - AI cost vs subscription tier (freelance/03 §A vs §D table).
  - The "5-hour rolling quota" framing (AGENTS.md) vs Anthropic's
    actual "5-hour usage windows" model.

Concretely, in this PR:

1. Reconcile Action-minutes maths:
     - In freelance/03 §A, replace the '~200 minutes/month with
       hourly triage and 6×daily execute crons' line with a per-client
       breakdown (T0=0, T1=~100, T2=~250, T3=~600 min/mo) and a
       practice-level total formula.
     - In 09 §1, replace the '≈ 25 active T2 clients' claim with
       '≈ 5 active T2 clients (the realistic mix is 5 active T1 +
       3 active T2 = ~1,750 min/mo, fits in the 2,000-min Free tier;
       crossing 6 active clients on any T2-heavy mix triggers the
       Team upgrade).'
     - Add a new section 09 §5.1 'Action-minutes alarms' specifying
       a workflow that pings the org's billing API weekly and posts
       to a #practice-alerts channel (or opens an issue) at 80% of
       budget.

2. Reconcile AI cost maths:
     - In freelance/03 §D, replace the table with the corrected
       version from docs/mothership/13 §2 (the table mapping clients
       → quota tier → base/topup/codex/total). Year-1 net adjusts
       by ~$1,500 CAD.
     - Update the §A 'Every 5 clients adds about $40' rule of thumb
       to match: 'Pro covers 1–5 clients; Max 5x covers 6–15;
       Max 20x covers 16–25; beyond that, second seat.'
     - Add a footnote on §D explaining the formula (subscription +
       paid Gemini overage + Codex review hours).

3. Add docs/mothership/02c-scaling-cliffs.md (new file):
     - Three named cliffs from 13 §3 (Claude Pro→Max, Actions
       Free→Team, n8n Hobby→paid).
     - For each: trigger metric, calendar-event-to-schedule, friction
       during transition, surprise to plan for, recommended
       pre-emptive timing.
     - One-page format; this is something the operator reads once
       and pins to the wall.

4. Add the n8n-on-Railway resilience layer:
     - Update docs/N8N_SETUP.md to add a §"Production checklist"
       enumerating:
         (a) Railway Hobby plan ($5/mo) — required by client #2.
         (b) Better Uptime free monitor on /healthz — set up by
             client #2.
         (c) Twilio retry queue using Twilio Functions for SMS
             durability — set up by client #2.
         (d) IMAP processed/ folder convention for email durability.
     - Add an operator-checklist in 02c §"n8n cliff" pointing to
       N8N_SETUP §"Production checklist".

5. Re-word AGENTS.md 'shared 5-hour rolling quota' references to
   '5-hour usage window'. Update the exact wording in:
     - 'Session-budget charter' opening paragraph.
     - 04 §5 'Quota allocation across the practice'.

6. Update docs/AI_ROUTING.md '## Review cadence' to add an explicit
   60-day cadence for re-evaluating the model rubric (currently said
   '~2 months', tighten to 'first Friday of every other month').

7. Update docs/mothership/00-INDEX.md to add 02c.

Constraints:
  - One PR. Branch: claude/maths-and-scaling-cliffs.
  - Use Sonnet 4.6 default. No architecture changes; no rebrand.
  - Verify every replaced number with a source comment in the
    commit body (no silent rewrites).

DOD:
  - PR open against main.
  - 02c exists and reconciles cleanly with 04 + 09 + freelance/03.
  - 'grep -n "rolling quota" AGENTS.md' returns 0 matches.
  - 'grep -n "≈ 25 active T2" docs/mothership/09' returns 0 matches.
  - 13 is marked 'closed by PR #N' in 00-INDEX.
```

**What to verify after Run C finishes:**

```
[ ] Spot-check three numbers in the freelance/03 §D table by hand —
    do they reconcile to the corrected formula?
[ ] Read 02c in full. Are the three cliff triggers ones you'd
    actually catch in real time?
[ ] Confirm AGENTS.md no longer references a 'rolling' quota.
```

---

## §4 — Run D (optional): Operations sweep + Tier-0 honesty + backups

**Goal:** close `14 §1`–`§9`. None are blockers; all are quality-of-life. Sequence after A/B/C are merged.

**Estimated:** Sonnet 4.6, ~80–100 turns, ~1 h.

**Branch:** `claude/operations-sweep`.

**Copy-paste prompt:**

```
You are a senior solutions architect helping me ship the cross-cutting
cleanup items. Read in order:

  docs/mothership/14-critique-operations-sequencing.md  ← your spec
  docs/mothership/06-operator-rebuild-prompt-v3.md
  docs/freelance/02-pricing-tiers.md
  docs/mothership/07-client-handover-pack.md
  docs/mothership/08-future-work.md

In one PR, ship all of:

1. Tier 0 honesty (14 §1):
     - In freelance/02 Tier 0 'Strategic role', replace the existing
       paragraph with: portfolio-builder + referral net, NOT a profit
       center; cap at 5 active engagements; beyond that, decline or
       upsell to T1; explicit margin disclosure.

2. Authoritative templates (14 §2):
     - Add a §"Template canonicality" subsection to 02 §2 declaring
       'mothership/client-template/ is canonical from P5.1 onward;
       lumivara-site is frozen for scaffold changes; all changes
       go through forge upgrade-templates.'

3. OAuth honesty (14 §3):
     - Update 06 §4 step 3 (Google OAuth) and step 4 (Entra) to
       acknowledge they remain manual, with screenshot-captioned
       guides linked from docs/operator/OAUTH_PROVIDER_RUNBOOK.md
       (create that file with detailed step-by-step for both
       providers).
     - Add an `auth_providers` array to docs/operator/cadence.schema.json
       (create the schema file if absent) so per-client cadence.json
       declares which providers are needed.

4. Day-1/7/14 rollback protocols (14 §4):
     - Append the failure-protocol blocks from 14 §4 to 06 §7.

5. docs-link-check workflow (14 §5):
     - Add .github/workflows/docs-link-check.yml using lychee
       (https://github.com/lycheeverse/lychee-action). Run on
       pull_request paths: ['docs/**']. Fail on broken internal
       links and broken https://github.com/palimkarakshay/* refs.

6. Engagement-log schema (14 §6):
     - Create docs/operator/ENGAGEMENT_LOG_SCHEMA.md with the YAML
       schema and example entries.
     - Add a stub 'forge log append' subcommand spec to 02 §3.

7. Discovery → proposal → intake → provision sequence (14 §7):
     - Replace 06 §1 'Pre-flight' with the six-step canonical
       sequence (discovery call → proposal → signed proposal →
       intake form → operator countersigns → forge provision).
     - Add a docs/operator/PROPOSAL_TEMPLATE.md (one-page Markdown
       template; the operator can copy-paste into PandaDoc or
       DocuSign).

8. Backup runbook (14 §8):
     - Create docs/operator/BACKUP_RUNBOOK.md with the daily / weekly
       / monthly schedule, the encryption recipe (age + passphrase),
       and the restore-drill protocol.
     - Add `forge backup --target ./backups/$(date +%Y-%m-%d)/`
       subcommand spec to 02 §3.

9. Dummy-intake hygiene (14 §9):
     - In docs/mothership/07-client-handover-pack.md, swap every
       real-looking TLD in the dummy intakes to '.test' (lumivara.test,
       johnsplumbing.test, viktorlaw.test, headhuntertalent.test,
       roseto.test, jimmybarber.test). Add a banner at the top of
       'Operator-side dummy intake forms' section: 'Every value below
       is fictional. Do not paste into a third-party UI.'

10. Update docs/mothership/00-INDEX.md to register the new docs
    (OAUTH_PROVIDER_RUNBOOK, PROPOSAL_TEMPLATE, BACKUP_RUNBOOK,
    ENGAGEMENT_LOG_SCHEMA) in the freelance / operator-only sections.
    Mark 14 as 'closed by PR #N'.

Constraints:
  - One PR. Branch: claude/operations-sweep.
  - Sonnet default; only escalate to Opus if a specific commit
    actually requires architecture-grade reasoning.
  - Each new doc is < 200 lines; no walls of text.

DOD:
  - PR open.
  - .github/workflows/docs-link-check.yml runs green.
  - 14 marked closed in 00-INDEX.
  - 'grep -n "lumivara.ca\|johnsplumbing.ca\|viktorlaw.ca"
       docs/mothership/07*' returns 0 matches.
```

---

## §5 — Run S1 (one-shot): Brand lock + global rename

**Goal:** once the operator picks a brand from `15 §2`, do the global rename in one mechanical pass. Sequence **after** A/B/C are merged so no rename collides with in-flight critique fixes.

**Estimated:** Sonnet 4.6, ~40–60 turns, ~30 min.

**Branch:** `claude/brand-lock-{{BRAND_SLUG}}`.

**Copy-paste prompt (fill in the BRAND choice on lines 1–2):**

```
The operator has chosen the brand: BRAND = "Lumivara Cadence"
                                  BRAND_SLUG = "lumivara-cadence"

You are doing a mechanical global rename pass. Read first:

  docs/mothership/15-terminology-and-brand.md  ← rename rules

Apply, in order:

1. Find-replace every '{{BRAND}}' → 'Lumivara Cadence' across:
     - docs/mothership/**
     - docs/freelance/**
     - AGENTS.md, CLAUDE.md
   except: 15-terminology-and-brand.md (it documents the
   placeholder convention; leave the placeholders intact there
   so the doc remains useful for future renames).

2. Find-replace every '{{BRAND_SLUG}}' → 'lumivara-cadence'
   in the same scope, with the same exception.

3. Apply the §1 internal-terminology renames from 15:
     - 'mothership repo' → 'platform repo' (case-insensitive,
       except in code identifiers like 'mothership-smoke.yml'
       which stay; rename the file itself in a follow-up PR)
     - 'the mothership' → 'the platform' (where it refers to
       the repo/system); leave 'mothership business pack' intact
       on the index file as a one-time historical reference.
     - 'agent' (when meaning the AI runtime) → 'pipeline run' or
       'pipeline' depending on context; check each occurrence,
       keep 'agent' where it refers to a specific Claude/Codex
       agent technology.
     - 'autopilot' → leave unchanged (customer-facing term).

4. Update the 00-INDEX.md glossary section with the new
   terminology table from 15 §1.

5. Verify nothing breaks:
     - 'grep -n "{{BRAND" docs/' returns only matches inside
       15-terminology-and-brand.md.
     - 'grep -n "mothership repo" docs/' returns 0 matches outside
       historical/footnote contexts.

6. Open one PR. Branch: claude/brand-lock-lumivara-cadence.

Constraints:
  - Pure mechanical. No reasoning.
  - One commit per scope (mothership-pack, freelance-pack,
    root-level files).
  - If a rename feels semantically wrong (e.g., a sentence reads
    awkwardly), STOP and add a TODO comment with the original
    line for the operator to review; never paraphrase.
```

---

## §6 — Run S2 (one-shot): Add the auto-link-check workflow + run it

**Goal:** ship the docs-link-check workflow named in `14 §5` independently if Run D isn't sequenced soon.

**Estimated:** Haiku 4.5, ~15–20 turns, ~10 min.

**Branch:** `claude/docs-link-check`.

**Copy-paste prompt:**

```
Add a docs-link-check workflow to this repo:

1. Create .github/workflows/docs-link-check.yml using
   lycheeverse/lychee-action@v2.

2. Configure it to:
     - Run on pull_request when files in docs/** change.
     - Run on push to main weekly (workflow_dispatch + schedule
       '0 12 * * 1' for Monday noon UTC).
     - Check all .md files under docs/.
     - Allowlist localhost, claude.ai, github.com/orgs/* (rate-limited).
     - Fail on any 4xx response from a publicly-resolvable URL.

3. Add a .lycheeignore at repo root with sensible defaults
   (mailto:, javascript:, data:, anchors-without-targets).

4. Run the workflow once via workflow_dispatch on the branch
   to confirm green; if any current docs links are broken, open
   a separate issue per file with the broken-link list (do not
   fix them in this PR — that is a docs hygiene PR).

Constraints:
  - Tiny PR. Branch: claude/docs-link-check.
  - Haiku is fine.

DOD:
  - PR open with two files (.github/workflows/docs-link-check.yml
    and .lycheeignore).
  - First run on the branch is green OR has documented broken-link
    issues in the PR description.
```

---

## §7 — Run S3 (one-shot): Open the second-Owner break-glass items

**Goal:** even before Run B lands, open tracked issues for the operator-side ceremonies that Run B's prompt cannot do automatically (inviting a second human Owner, printing recovery codes, sealing the envelope, scheduling the first quarterly drill).

**Estimated:** Haiku 4.5, ~10 turns, ~5 min.

**Branch:** N/A (issue-only).

**Copy-paste prompt:**

```
Open four tracked issues in this repo, no PR. Use the gh CLI.

Issue 1: 'Operator: invite second GitHub Owner for break-glass'
  Body: per docs/mothership/12-critique-security-secrets §1, invite
  a second human or recovery machine identity as Owner of the
  {{BRAND_SLUG}} org. Generate fresh MFA recovery codes. Document
  decision (human vs machine) in docs/operator/RECOVERY_DRILL_LOG.md.
  Labels: priority/P0, area/security, human-only.

Issue 2: 'Operator: print + seal recovery codes envelope'
  Body: per docs/mothership/12 §1, print GitHub + 1Password recovery
  codes; seal in tamper-evident envelope; deposit with trusted
  second party (lawyer / sibling / safe-deposit box). Deadline:
  before client #2.
  Labels: priority/P0, area/security, human-only.

Issue 3: 'Operator: schedule quarterly recovery drill'
  Body: first Friday of next quarter. Calendar block, 30 min.
  Verify recovery owner can sign in, then sign out. Log result
  in docs/operator/RECOVERY_DRILL_LOG.md.
  Labels: priority/P1, area/security, human-only.

Issue 4: 'Operator: install GitHub App in place of VENDOR_GITHUB_PAT'
  Body: per docs/mothership/03b-github-app-spec.md (will be created
  by Run B). Install on {{BRAND_SLUG}} org, scope to selected repos,
  add APP_ID + PRIVATE_KEY as org secrets. Then remove
  VENDOR_GITHUB_PAT.
  Labels: priority/P0, area/security, human-only, blocked-by:'PR
  closing 12'.

DOD:
  - Four issues open; each has the labels above; each links to
    the right doc section.
```

---

## §8 — Sequencing & cost guardrails

| Run | Model | Wall time | Sequence | Blocking? |
|---|---|---|---|---|
| A | Opus 4.7 Max | 1.5–2.5 h | First | Blocks any new client engagement |
| B | Opus 4.7 Max | 1.5–2.5 h | After A | Blocks client #2 |
| C | Sonnet 4.6 | 45–60 min | After A; can parallelise with B | Non-blocking |
| D | Sonnet 4.6 | ~1 h | After A/B/C | Non-blocking |
| S1 | Sonnet 4.6 | ~30 min | After A/B/C | Blocks the marketing storefront |
| S2 | Haiku 4.5 | ~10 min | Anytime | Non-blocking |
| S3 | Haiku 4.5 | ~5 min | Anytime | Non-blocking, but Issue 4 blocks Run B's full close |

**Quota budget for the operator's next 5-hour window:**

```
[ ] Run A    (Opus  ~120 turns)
[ ] Run S2   (Haiku ~20 turns) — interleave during A's downtime
[ ] Run S3   (Haiku ~10 turns) — interleave
       (commit boundary)
[ ] Run C    (Sonnet ~80 turns)
[ ] Run B    (Opus  ~120 turns) — second window
       (commit boundary)
[ ] Run D    (Sonnet ~100 turns) — third window
[ ] Run S1   (Sonnet ~60 turns) — third window
```

This keeps each window under 50% of Max 20x, leaves headroom for any
reactive work, and lands the entire critique-closure inside three
operator sessions over a single weekend.

---

## §9 — What this prompt-pack does NOT cover

- **Code authoring inside `lumivara-site/src/`** — those changes happen via the existing autopilot triage→plan→execute, not these prompts.
- **The `forge` CLI implementation** (P5.4a–f) — that's a separate multi-issue effort against the new platform repo; out of scope here.
- **Real OAuth / Vercel / Resend provisioning** — these prompts only document the procedure. The operator runs the actual provisioning ceremonies manually for client #1; the CLI automates them for #2+.
- **Marketing copy and customer-facing assets** — these prompts touch operator-internal docs only.

The four runs (A–D) close every 🔴/🟠 finding from `10 §2`. After all four merge, the pack is **production-ready for client #2**.

*Last updated: 2026-04-28.*

