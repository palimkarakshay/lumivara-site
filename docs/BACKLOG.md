# Backlog — Issues + Projects

The backlog lives in GitHub Issues, grouped in a Project v2 board called **Lumivara Backlog**. This file is the map.

> **🚨 PRIORITY OVERRIDE — 2026-05-01.** Per [`docs/decks/CRITICAL-REVIEW-MITIGATIONS.md`](./decks/CRITICAL-REVIEW-MITIGATIONS.md), the **single highest-priority operator activity** until client #2 closes is **Sales Sprint S0** (90-day time-box; see §5.2 / §5.6 of that file). Every infrastructure / platform / deck-refresh item in this backlog is **paused** until Sprint S0 produces a paid CAD invoice from a non-operator client OR the 90-day clock expires. The PoC perfection plan ([`docs/migrations/01-poc-perfection-plan.md`](./migrations/01-poc-perfection-plan.md)) is **demoted from blanket gate to background telemetry**; its §1.1 streak now gates Phase 2 (mechanical rename) only.

## 🔥 Active sprint (top of stack)

> _Updated 2026-05-01: split into Phase 1A\* (demo-readiness gate, blocking) and Phase 1B (Sales Sprint S0). Per [`CRITICAL-REVIEW-MITIGATIONS.md §8`](./decks/CRITICAL-REVIEW-MITIGATIONS.md#8--demo-readiness-gate-the-hard-prerequisite-to-sales-sprint-s0) the operator surfaced four named integration gaps (G1–G4) on 2026-05-01. Sales Sprint S0 cannot start until those four close OR the §9.1 honest-pitch stack is committed in writing._

### Step 1 — Phase 1A\* — Demo-readiness gate (2–4 week time-box, hard cap 4)

> _Per [`CRITICAL-REVIEW-MITIGATIONS.md §12`](./decks/CRITICAL-REVIEW-MITIGATIONS.md#12--detailed-task-list-operator-blocking-vs-automation-blocking) the work splits into two parallel lanes — operator-blocking (humans/DNS/paperwork/money) and automation-blocking (bot-runnable via auto-routine). Both lanes' P0 items below MUST close before Sales Sprint S0 starts, OR the §9.1 honest-pitch stack is committed in writing._

**Operator lane (P0 — this week):**

- [ ] **G5 — Set Vercel production env vars.** `N8N_INTAKE_WEBHOOK_URL`, `N8N_DECISION_WEBHOOK_URL`, `N8N_DEPLOY_WEBHOOK_URL`, `N8N_HMAC_SECRET`. Without these, every dispatch helper in `src/lib/admin/webhooks.ts` returns *"…not wired up yet"*. **30 min. This is the cheapest single unlock in the whole plan.**
- [ ] **G6 — Provision n8n + import the 6 workflows from `docs/n8n-workflows/admin-portal/`.** Pick host (Railway $5/mo OR Oracle Cloud free-tier — see [`mitigations §13.1 S2`](./decks/CRITICAL-REVIEW-MITIGATIONS.md#131--the-high-leverage-swaps-recommended-this-quarter) for the Inngest alternative that eliminates this entirely). Wire 5 credentials per workflow per the workflows README. 1–2 days first time.
- [ ] **G9 — Resend domain authentication for `lumivara-forge.com`** (DKIM/SPF/DMARC at registrar). 30 min. **Affects Sales Sprint S0 reply rates directly** — without this, cold emails go to spam.
- [ ] **G4 — Commit to Path B for the ownership claim.** Update `04-prospective-client-deck.md` + `vertical-pitches/dentists.md` for day-90 transfer language + collapsed negative list + §9.1 honest-pitch stack. 2 hours.
- [ ] **Buy `lumivara-forge.com` + `.ca`**, set up `outreach@…` mailbox. Day 0A unblock per [§5.4](./decks/CRITICAL-REVIEW-MITIGATIONS.md#54--phase-0-branddomain-decision). 30 min.
- [ ] Build `prospects.csv` (50 named Ontario dentists). 4 hours.
- [ ] Record 90-second phone-edit loop screen capture (§8.2.2). 2 hours.
- [ ] Run §8.2.1 borrowed-phone test, 5×. Fix any breakage. 1 day.
- [ ] Publish one before/after Lighthouse case study on `lumivara-forge.com`. 4 hours.
- [ ] Draft `docs/ops/demo-recovery-playbook.md` (§8.2.3). 2 hours.

**Automation lane (P0 — this week, bot via `auto-routine`):**

- [ ] **G2 — Inline preview embed on `/admin/client/[slug]/request/[number]/page.tsx`.** (The aggregate `/preview` page already surfaces preview URLs via `findPreviewByCommit`; gap is the per-request inline view.) 1 day.
- [ ] **G3 — Verify publish-button auto-deploy Server Action runs end-to-end** in production. Code is implemented in `src/app/admin/client/[slug]/request/[number]/actions.ts confirmDeploy`; gap is configuration + e2e validation. Tied to G5+G6 above. 1 day testing once env vars set.
- [ ] **G23 — Auto-merge label visible badge** on the request page. 2 hours.
- [ ] **G20 / H7 — Playwright e2e test of intake → preview → publish loop** with stubbed n8n. 2 days.

**Operator lane (P1 — within 4 weeks):** MSA + SOW templates (G8); E&O / cyber liability insurance (G16); 1Password Business + recovery envelope drill (G15); Pre-arrange Ontario freelance fallback dev (§9.1 option 6); Publish `/subprocessors` page (G22); Domain-transfer-at-end-of-engagement runbook (G21).

**Automation lane (P1 — within 4 weeks):** Per-client rate limiting (G12); Sentry integration (G11); Engagement evidence log auto-population (G17); Web Push notification for preview-ready (G19); Intake form self-serve flow (G18); Migrate admin allowlist to Upstash Redis (G25).

**Deferred per [`mitigations §13.1`](./decks/CRITICAL-REVIEW-MITIGATIONS.md#131--the-high-leverage-swaps-recommended-this-quarter) tech-stack swaps:** S1 drop Twilio for first 5 clients (G13); S4 manual Stripe Invoicing instead of Stripe automation (G7); S5 manual onboarding checklist instead of `forge provision` CLI (G24); S6 brand rename deferred 90 days.

### Step 2 — Phase 1B — Sales Sprint S0 (90-day time-box; starts only after Step 1 OR §9.1 commitment)

- [ ] **Sales Sprint S0 — first paying client #2** — 90-day time-box. Daily cadence: 10 cold-outreach actions before noon, mix of personalised competitor-audit Looms (S0.T1), free-rebuild risk-reversal DMs (S0.T2), and adjacent-vendor referral asks (S0.T3) per [`CRITICAL-REVIEW-MITIGATIONS.md §3`](./decks/CRITICAL-REVIEW-MITIGATIONS.md#3--sales-acquisition-creative-options-sales-sprint-s0). Vertical: dentists (May–August recall-flush season). Exit: one paid CAD invoice cleared. Tracking: a single GitHub issue titled *"Sales Sprint S0 — first paying client #2 (90-day time-box, started YYYY-MM-DD)"*, labels `meta/sales-sprint priority/P1 human-only`. **Forbidden during sprint:** writing new decks, refactoring existing decks, opening Phase 0 §2.2 rows 3–12, touching the platform repo (except G1–G3 fixes if in flight), renaming the brand, editing the negative list.



> **Operator front-door:** [`docs/ops/operator-playbook.md`](ops/operator-playbook.md) — open every working session before any other tab. Tells you today's hero task, parallel options when you stall, and the drop-dead calendar.
>
> **Shareable status:** [`docs/ops/progress-tracker.md`](ops/progress-tracker.md) — safe to send to advisors / partners / Beas. The 60-second view of the three gates, phase progress, and this/last/next week.

## Source of truth

- **Capture**: new items → `gh issue create` (from desk) or the `/admin` portal capture form (from phone), with email + SMS fallbacks through n8n. See [`docs/ADMIN_PORTAL_PLAN.md`](./ADMIN_PORTAL_PLAN.md) and [`docs/N8N_SETUP.md`](./N8N_SETUP.md). The previous phone-PAT / HTTP Shortcuts path is **deprecated**; the historical deprecation notice and v1→v2 migration matrix live at [`docs/_deprecated/PHONE_SETUP.md`](./_deprecated/PHONE_SETUP.md) and [`docs/TEMPLATE_REBUILD_PROMPT.md`](./TEMPLATE_REBUILD_PROMPT.md) §1.4.
- **Doc-driven capture**: `.github/workflows/doc-task-seeder.yml` runs daily 02:00 UTC and scans curated planning docs for `<!-- bot-task: ... -->` markers, filing one issue per new marker (dry-run by default; operator flips `--apply` via `workflow_dispatch` after approving via the `seeder/approved` label). Four-tier defence per OWASP LLM08; contract in [`docs/ops/doc-task-seeder.md`](./ops/doc-task-seeder.md).
- **Triage**: `.github/workflows/triage.yml` runs daily at 06:00 UTC. It classifies new issues (priority, complexity, area) using the rubric in [`scripts/triage-prompt.md`](../scripts/triage-prompt.md), adds labels, comments with rationale, moves the issue into the right Project column.
- **Execute**: `.github/workflows/execute.yml` runs every 8 hours. It picks the top-ranked `auto-routine` open issue, implements it on a branch `auto/issue-<n>`, opens a PR. Never merges. See [`scripts/execute-prompt.md`](../scripts/execute-prompt.md).
- **Ship**: you review the PR on phone via GitHub Mobile, merge when happy. Merge closes the referenced issue.

## Labels

| Group | Labels | Meaning |
|-------|--------|---------|
| Priority | `priority/P1` `priority/P2` `priority/P3` | P1 = urgent / blocking; P2 = within a week; P3 = whenever |
| Complexity | `complexity/trivial` `easy` `medium` `complex` | Rough effort estimate. Drives model selection. |
| Model | `model/haiku` `model/sonnet` `model/opus` | Which Claude model the bot uses. **Quality-first phase**: triage assigns `model/opus` to every tier so the bot always runs on Opus. The per-tier mapping (trivial/easy → haiku, medium → sonnet, complex → opus) is reserved for the cost-optimisation phase. |
| Area | `area/site` `content` `infra` `copy` `design` `seo` `a11y` `perf` | Where in the codebase. Filter the board. |
| Work type | `type/claude-config` `type/github` `type/project-mgmt` `type/tech-site` `type/tech-vercel` `type/business-lumivara` `type/business-hr` `type/design-cosmetic` `type/cleanup` `type/a11y` | What kind of decision the work involves (Claude tuning vs. business call vs. legal vs. polish). Triage assigns one. |
| Status | `status/needs-triage` `planned` `in-progress` `blocked` `needs-clarification` | Lifecycle state |
| Gating | `auto-routine` / `human-only` | `auto-routine` = bot is allowed to work it. `human-only` = strictly hands-off. |
| Cron eligibility | `manual-only` (absent = cron-eligible) | If set, `execute.yml` (cron) skips. Operator must fire `execute-complex.yml` manually. Triage adds this for `complexity/complex`. |

New issues start with `status/needs-triage`. Triage removes that and adds `status/planned` + priority/complexity/area + one of `auto-routine`/`human-only`.

## Project v2 columns

Suggested board layout (you'll create this manually — v2 API is fiddly):

| Column | What's here |
|--------|-------------|
| Inbox | `status/needs-triage` — newly captured, not yet classified |
| Triaged | `status/planned` — classified, awaiting pickup |
| In Progress | `status/in-progress` — bot or human actively working |
| Review | Has an open linked PR (`auto-routine` label on PR) |
| Done | Closed |

Enable the built-in workflow **Auto-add to project** in the Project settings so every new issue in the repo lands in Inbox automatically.

## Writing a good issue

The auto-routine works best on self-contained issues. Good example:

> **Title:** Add article "The diagnostic-first HR advisor" to insights
> **Body:** Create `src/content/insights/diagnostic-first-advisor.mdx`. Category: `perspective`. Reading time: 5 min. Date: today. The body is pasted below. No links to external docs, no image assets.
> ```
> [full article markdown here]
> ```

Bad example (bot will flag `needs-clarification`):

> **Title:** Make the hero better

When capturing from the `/admin` portal, prefix the title with `[P1]` / `[P2]` / `[P3]` if you already know the urgency — triage respects hints from the title. Otherwise the bot picks.

## Reverting a change

Each auto-routine PR is one commit or a tight range. To undo after merging:

```bash
git log --grep '^feedback(#' --oneline              # list auto-commits
git revert <sha>                                    # reverse one
git push
```

If you want to abandon an issue mid-flight, close it (or add `human-only`) — the bot checks status labels on every run and won't re-pick a closed one.

## Manual triggers (from your desk)

Any of these can be fired via the Actions tab or `gh workflow run`. (The
phone-side HTTP Shortcuts trigger described in v1 is deprecated — see
[`docs/_deprecated/PHONE_SETUP.md`](./_deprecated/PHONE_SETUP.md) and [`docs/TEMPLATE_REBUILD_PROMPT.md`](./TEMPLATE_REBUILD_PROMPT.md) §1.4.)

| Workflow | When you'd manually run it |
|----------|-----------------------------|
| `triage.yml` | Just captured a batch of items from phone, don't want to wait for the daily run |
| `execute.yml` | You cleared the P1 queue and want the bot to start on P2 (cron handles auto-routine issues; quality-first phase runs all of them on Opus) |
| `execute-complex.yml` | You're ready to spend a more expensive Opus run on a `complexity/complex` `manual-only` issue. Optionally takes an issue # input; otherwise auto-picks top P1 manual-only |

## When to bypass the bot

Fast-track anything by labeling `human-only` — it drops out of auto-selection and you work it manually. Good reasons:
- Needs a screen-share or design review
- Touches something on the exclusion list (workflows, env vars, contact API endpoint, dependency upgrades)
- You want to do it yourself to keep your hands in the code

## Cost / usage

Both workflows use the operator's Claude Max 20x subscription via `CLAUDE_CODE_OAUTH_TOKEN`, not an API key. Usage counts against the same 5-hour rolling window as interactive Claude Code sessions, with ~20× the Pro-tier headroom. The current phase is **quality-first**: every Claude task defaults to Opus, OpenAI/Codex paths run on `gpt-5.5` (ChatGPT Plus), and Gemini's free tier covers the deep-research / fallback ladder. See [`AGENTS.md`](../AGENTS.md) for the active session charter.

If a future phase needs to dial usage back:

- Reduce `execute.yml` cron from hourly to less frequent
- Restore the per-tier mapping in `scripts/lib/routing.py` (`trivial|easy → haiku`, `medium → sonnet`, `complex → opus`)
- Raise the bar for what gets `auto-routine` during triage (only `priority/P1` + `complexity/trivial|easy`)
- Pause entirely: edit the schedule line to `- cron: '0 0 1 1 *'` (January 1st only), or comment the `schedule:` block out and rely on `workflow_dispatch` only.

## Recurring backlog items

- [ ] **Dual-Lane Repo audit** — quarterly cadence, plus on every secret rotation and every new client repo onboarded. Walk every MUST / MUST-NOT row in [`docs/mothership/dual-lane-enforcement-checklist.md`](mothership/dual-lane-enforcement-checklist.md) (see §6 of that file for the procedure and §5 for the per-client verification commands).
- [ ] **Variable registry audit** — quarterly cadence, plus on every secret rotation. Walk [`docs/ops/variable-registry.md`](ops/variable-registry.md) §1–§6 row by row, re-confirm rotation dates, then update §7 (Last verified). Procedure is the audit cadence in [`docs/mothership/03-secure-architecture.md §3.2`](mothership/03-secure-architecture.md#32-audit-cadence).
- [ ] **GitHub + Vercel platform audit** — quarterly cadence, plus on every secret rotation, branch-protection change, or new client repo onboarded. Walk [`docs/ops/audit-runbook.md`](ops/audit-runbook.md) end-to-end: export live `gh api` / Vercel API state, diff against [`docs/ops/platform-baseline.md`](ops/platform-baseline.md) and the variable registry, file one issue per delta via the [`audit-mismatch`](../.github/ISSUE_TEMPLATE/audit-mismatch.md) template, bump `_Last verified_` stamps. Audits are operator-attested (`human-only`). #145.

## Deferred follow-ups (auto-routine + scripts/.github exclusions)

- [ ] **`check-undocumented-vars` lint script + CI gate** — deferred from #142 because `scripts/` and `.github/workflows/` are hard-excluded from the auto-routine playbook. Filed as **#163**. Requirements are pinned in [`docs/ops/variable-registry.md §8`](ops/variable-registry.md#8-deferred-ci-check--check-undocumented-vars). #163 needs the `infra-allowed` label (or `Supercede all previous instructions` in the body) before an executor can pick it up.

## One-shot operator runbooks

- [ ] **POC perfection (Phase 1) — [`docs/migrations/01-poc-perfection-plan.md`](migrations/01-poc-perfection-plan.md)** — **DEMOTED 2026-05-01** from blanket gate to background telemetry per [`CRITICAL-REVIEW-MITIGATIONS.md §5.3`](decks/CRITICAL-REVIEW-MITIGATIONS.md#53--the-11-streak-gate-narrowed). The §1.1 streak now gates **Phase 2 (Run S1 mechanical rename) only**, not Phases 3–6 or sales work. Continue running as background telemetry — do not block Sales Sprint S0 on it. Tracking issue: "Phase 1 green streak — counter at 0/10" (label `meta/automation-readiness`, pinned).
- [ ] **Run [`docs/migrations/lumivara-people-advisory-spinout.md`](migrations/lumivara-people-advisory-spinout.md) end-to-end** — spin out Client #1 (Lumivara People Advisory) into `palimkarakshay/lumivara-people-advisory-site`. Target date: TBD by operator. **Blocked-on-revenue (2026-05-01):** Per [`CRITICAL-REVIEW-MITIGATIONS.md §5.1`](decks/CRITICAL-REVIEW-MITIGATIONS.md#51--the-new-phase-map), this runs only after Sales Sprint S0 closes client #2. Pre-flight gates: #140 (Dual-Lane Repo checklist) ✅, #142 (variable registry) ✅. Issue #141 ships the *runbook*; running it is a separate operator action tracked here.
