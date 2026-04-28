<!-- OPERATOR-ONLY. Copy-paste prompts for Claude Code in the browser (Opus 4.7 Max). -->

# 16 — Automation Prompt Pack (Claude Code in the browser, Opus 4.7 Max)

Three closes-the-critique prompts (Run A, B, C) plus a fourth optional cleanup (Run D) and three supplementary one-shot prompts (S1, S2, S3) to hand to Claude Code in the browser. Each prompt is self-contained — paste it, hit run, walk away.

> **Mode:** Opus 4.7 Max (1M context). The prompts assume you have the mothership pack (`docs/mothership/`) and the supporting docs (`docs/AI_ROUTING.md`, `docs/ADMIN_PORTAL_PLAN.md`, `docs/N8N_SETUP.md`, `freelance/*`) checked into the working tree.
>
> **Per-run discipline:** every prompt below opens its own branch + PR; never run two in parallel against the same files. Order: A → B → C (D and S1–S3 can interleave).

---

## §1 — Run A: Adopt the two-repo (Pattern C) architecture

**Goal:** close the items in `11 §1` and `11 §2`. The operator chose **Pattern C** (separate `<slug>-pipeline` repo) as the architectural model. This Run rewrites every dependent doc and ships one PR.

**Estimated:** Opus 4.7 Max, ~120–160 turns, ~2.5–3.5 h wall time. (Pattern C is more invasive than the original Pattern A draft would have been; budget accordingly.)

**Branch:** `claude/pattern-c-two-repo-architecture`.

**Copy-paste prompt:**

```
You are a senior infrastructure architect implementing the Pattern C
two-repo architecture chosen by the operator on 2026-04-28. Read in
order:

  docs/mothership/00-INDEX.md
  docs/mothership/02-architecture.md
  docs/mothership/03-secure-architecture.md
  docs/mothership/05-mothership-repo-buildout-plan.md
  docs/mothership/06-operator-rebuild-prompt-v3.md
  docs/mothership/09-github-account-topology.md
  docs/mothership/11-critique-architectural-issues.md   ← your spec
  docs/mothership/12-critique-security-secrets.md §4    ← GitHub App rationale

The bug: 02 §1 / §6 and 03 §2.1 claim scheduled GitHub Actions
workflows on a non-default branch ('operator/main') will fire on cron.
They will not — cron only fires from workflow files on the default
branch. The pack as written produces zero scheduled runs.

The chosen fix: Pattern C from 11 §1. Per client engagement, the
operator provisions TWO private repos:
  • {{BRAND_SLUG}}/<slug>-site      — client-readable; Next.js site
                                       only; transferred to client at
                                       handover.
  • {{BRAND_SLUG}}/<slug>-pipeline  — operator-only; ALL workflows,
                                       scripts, and cron schedules;
                                       NEVER shared with the client;
                                       deleted/archived at handover.

The pipeline repo's bot uses a GitHub App (not a PAT) with installation
scope on the matched site repo. The App's permissions: Issues:RW,
Pull requests:RW, Contents:RW, Metadata:R, Workflows:R on the site
repo only.

Concretely, in this PR:

1. Create a NEW file 'docs/mothership/02b-pattern-c-architecture.md'
   that documents Pattern C as canonical:
     - Diagram showing both repos + the GitHub App flow.
     - Repo provisioning order (site first, pipeline second).
     - GitHub App installation procedure (one-time per org; per-repo
       install on each new client provision).
     - Workflow communication: pipeline-repo workflows authenticate
       as the App, generate an installation token via
       actions/create-github-app-token@v1, then push branches to the
       site repo and open PRs.
     - Cross-repo deploy flow: site-repo Vercel deploys from main;
       pipeline-repo workflows trigger via repository_dispatch when
       site-repo pushes happen (using the App's token).
     - Teardown: at handover, uninstall App from site repo, delete
       pipeline repo (or archive), transfer site repo ownership.
     - Why this is worth the extra repo: Section "the system =
       operator-licensed" claim becomes architecturally enforceable,
       not just contractually.

2. Rewrite docs/mothership/02-architecture.md:
     - §1 diagram: replace dual-branch box with two-repo box. Show
       the App as a third ASCII element bridging the repos.
     - §2 file layout: add 'pipeline-template/' alongside
       'client-template/' and 'workflows-template/'. Split:
       'workflows-template/' is what gets pushed to the pipeline
       repo's main; 'client-template/' is what gets pushed to the
       site repo's main. There are NO workflow files on the site
       repo.
     - §3 provisioning flow: now 12 steps (was 11). Add new step 2b
       'Create the pipeline repo' immediately after step 2 'Create
       the site repo'. Steps that referenced operator/main (step 5)
       now push to '<slug>-pipeline:main' instead.
     - §4 trust zones: replace 'Operator overlay on client repo'
       with new zone 'Pipeline Repo' — operator-only, never client-
       readable, scoped to App installation.
     - §5 HMAC handshake: stays unchanged (admin portal ↔ n8n).
     - §6 'autopilot view of the world': rewrite. Cron fires in the
       pipeline repo on its main branch; the bot generates a
       short-lived installation token via the App; uses the token
       to push 'auto/issue-N' to the site repo and open PRs.
     - §7 teardown: add the App-uninstall + pipeline-repo-delete
       sequence to each mode (handover/archive/pause/rebuild-vanilla).

3. Rewrite docs/mothership/03-secure-architecture.md:
     - §2.1: replace 'two-branch trick' subsection title with
       'two-repo separation'. The site repo has only main; the
       pipeline repo has only main; there is no operator/main.
     - §2.2: branch protection now applies to two separate repos.
       Site-repo main: standard protection (PR review, Vercel
       check). Pipeline-repo main: stricter (admin-only push,
       require Code Owners review for any .github/workflows/
       change, no force-push, no deletions).
     - §3 secret topology: VENDOR_GITHUB_PAT row is replaced by
       APP_ID + APP_PRIVATE_KEY (org secrets) + INSTALLATION_TOKEN
       (generated per-run, never stored). Document the App as the
       canonical vendor identity.
     - §6 thought experiment 'what if Anthropic exfiltrates': add
       that pipeline-repo issue contents are still visible to the
       LLM, but operator prompts are scoped per-pipeline-repo and
       never readable to the client even via leaked logs.
     - §7 client-zone file checklist: drop the 'no .github/workflows/
       triage|execute|...' rules — those workflows simply do not
       exist on the site repo at all.

4. Rewrite docs/mothership/05-mothership-repo-buildout-plan.md
   §P5.6:
     - The migration is now 'create lumivara-people-advisory-pipeline
       repo, push workflows + scripts there, install GitHub App
       scoped to lumivara-people-advisory-site, then strip workflows
       from lumivara-people-advisory-site/main'.
     - Update steps 3-6 with explicit gh CLI commands.

5. Rewrite docs/mothership/06-operator-rebuild-prompt-v3.md:
     - Prompt B1 'Operator workflows overlay' renames to 'Pipeline
       repo provisioning' and runs against the new
       <slug>-pipeline repo on its main branch.
     - Prompt A and Prompt B2 stay as-is structurally, but add a
       pre-step to Prompt B1: 'Confirm GitHub App is installed on
       the site repo before workflows fire.'
     - Add a new section §11 'Why two repos' citing 02b.

6. Update docs/mothership/09-github-account-topology.md:
     - §3 'where client repos live': now 'each engagement gets two
       repos in the {{BRAND_SLUG}} org during the engagement; site
       repo transfers at handover, pipeline repo deletes/archives.'
     - Add §3.1 'GitHub App spec' (or link to 03b once Run B
       creates it).
     - §6 setup checklist: bump from one repo to two per client.

7. Sanitize audit-trail comments per 12 §6: even though the client
   no longer sees the pipeline repo, gate any cross-repo PR-comment
   posters on github.actor == bot/operator. Belt-and-braces.

8. Open one tracking issue in this repo titled 'P5.4: forge
   provision must create both site repo and pipeline repo + install
   GitHub App' linking to 02b and 02 §3. Label area/architecture,
   priority/P0.

9. Update docs/mothership/00-INDEX.md:
     - Add 02b to the read-order table.
     - Mark 11 as 'closed by PR #N' once this PR opens.
     - Update P4.6 row to mark Run A as in-progress (with PR link).

Constraints:
  - One PR. Branch: claude/pattern-c-two-repo-architecture.
  - Commit per logical unit:
      1. 02b new file
      2. 02 rewrite
      3. 03 rewrite
      4. 05 §P5.6 rewrite
      5. 06 rewrite
      6. 09 update
      7. audit-trail sanitisation
      8. 00-INDEX update + tracking issue
  - Do NOT touch client-template/ or workflows-template/ contents;
    that's a downstream PR (P5.2).
  - Do NOT lock or change brand naming — operator already chose
    Lumivara Forge; that's Run S1's mechanical rename, not this PR.
  - Respect AGENTS.md budget gates. At 50%, finish current commit
    and stop with PR comment summarising progress.

DOD:
  - PR open against main.
  - 02b exists and is internally linked from 02, 03, 05, 06, 09,
    and 00-INDEX.
  - All section anchors in cross-references resolve.
  - 'git grep -nE "operator/main"' returns matches ONLY in
    historical CHANGELOG.md / docs marked 'pre-Pattern-C' /
    docs that explicitly explain the deprecated pattern.
  - 'git grep -nE "VENDOR_GITHUB_PAT"' returns ZERO matches
    in 02/03/05/06/09 (replaced by APP_INSTALLATION_TOKEN /
    APP_ID + APP_PRIVATE_KEY references).
  - The P5.4 tracking issue exists with the right labels.
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

**Goal:** apply the brand decision the operator made on 2026-04-28: **Lumivara Forge**. Mechanical global rename in one pass. Sequence **after** A/B/C are merged so no rename collides with in-flight critique fixes.

**Estimated:** Sonnet 4.6, ~40–60 turns, ~30 min.

**Branch:** `claude/brand-lock-lumivara-forge`.

**Copy-paste prompt:**

```
The operator chose the brand on 2026-04-28:
  BRAND      = "Lumivara Forge"
  BRAND_SLUG = "lumivara-forge"

You are doing a mechanical global rename pass. Read first:

  docs/mothership/15-terminology-and-brand.md  ← rename rules
  docs/mothership/01-business-plan.md §1       ← brand rationale

The operator confirmed: ALL renames per 15 §1 are in scope, not
just the brand swap. Apply in order:

1. Find-replace every '{{BRAND}}' → 'Lumivara Forge' across:
     - docs/mothership/**
     - docs/freelance/**
     - AGENTS.md, CLAUDE.md
     - .env.local.example, README.md
   except: 15-terminology-and-brand.md (it documents the
   placeholder convention; leave the placeholders intact so the
   doc remains useful for future renames).

2. Find-replace every '{{BRAND_SLUG}}' → 'lumivara-forge'
   in the same scope, with the same exception.

3. Apply the full §1 internal-terminology rename table from doc 15:
     - 'mothership repo' / 'mothership' → 'platform repo' /
       'the platform' where it refers to the repo or system.
       (Exception: keep 'mothership business pack' as the literal
       phrase ONCE in 00-INDEX as a one-time historical reference,
       with a footnote pointing to the new term.)
     - 'agent' as AI runtime → 'pipeline run' (one execution) or
       'pipeline' (the system); inspect each occurrence; keep
       'agent' where it refers to a specific Claude/Codex agent
       technology (e.g., 'Claude agent SDK').
     - 'operator overlay' / 'operator/main branch' → 'pipeline
       repo' / 'pipeline-repo main' (Pattern C is now canonical
       per Run A).
     - 'autopilot' → LEAVE UNCHANGED (customer-facing term).
     - 'tier' / 'cadence' / 'zone' / 'engagement' / 'client' →
       LEAVE UNCHANGED (already correct).
     - 'vendor bot account' → 'bot account'.

4. Update the 00-INDEX.md glossary section by inserting the
   one-page glossary from doc 15 §1 (under a new heading 'Glossary').

5. Verify nothing breaks:
     - 'grep -nE "\\{\\{BRAND" docs/' returns matches only in
       15-terminology-and-brand.md.
     - 'grep -n "mothership repo" docs/' returns 0 matches outside
       historical/footnote contexts in 00-INDEX.
     - 'grep -nE "operator/main|operator overlay" docs/' returns
       only matches inside changelogs or the 'deprecated pattern'
       footnote in 02b.

6. Rename file 'docs/mothership/' folder → 'docs/platform/' is
   OUT OF SCOPE for this PR (filesystem rename has too many
   downstream link impacts; defer to a separate PR labelled
   'docs-folder-rename'). Just leave the folder name as-is and
   update the prose references.

7. Open one PR. Branch: claude/brand-lock-lumivara-forge.

Constraints:
  - Pure mechanical. No reasoning.
  - One commit per scope (mothership-pack, freelance-pack,
    root-level files, 00-INDEX glossary insertion).
  - If a rename feels semantically wrong (e.g., a sentence reads
    awkwardly after substitution), STOP and add a TODO comment
    with the original line for the operator to review; never
    paraphrase.
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

**Goal:** open the four tracked issues for the operator-side ceremonies that Run B's prompt cannot do automatically (inviting a second human Owner, printing recovery codes, sealing the envelope, scheduling the first quarterly drill).

**Status: pre-approved by the operator on 2026-04-28.** Run this as soon as the next Claude Code session starts; no further approval needed.

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

