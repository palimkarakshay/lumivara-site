<!-- OPERATOR-ONLY. Dated POC perfection plan that gates Phase 2 of 00-automation-readiness-plan.md. -->

# POC Perfection Plan — finish before migration starts

> **Purpose.** Convert the abstract Phase 1 exit criterion in
> [`00-automation-readiness-plan.md §3.1`](./00-automation-readiness-plan.md#31--exit-criterion-the-only-thing-that-matters)
> into a **dated, day-by-day** plan with concrete tasks, owners, evidence
> rows, and a single hard gate that blocks every later phase.
>
> **Scope.** This file does not redefine Phase 1; it sequences the work
> to satisfy it. The canonical sources of truth remain:
>
> - `docs/migrations/00-automation-readiness-plan.md` — the phase map.
> - `docs/mothership/02b-dual-lane-architecture.md` — the end-state.
> - `docs/mothership/dual-lane-enforcement-checklist.md` — the pre-flight
>   gate this POC must clear before §4 of that file can be ticked.
> - `docs/deploy/production-integrity.md` — the integrity contract that
>   the production-deployment fix (PR #151, branch
>   `claude/fix-production-deployment-BuaWE`) introduced and that this
>   POC has to **prove green** end-to-end before migration.
> - `docs/storefront/07-client-migration-strategy.md` — the client-facing
>   migration playbook the POC has to be safe enough to drive.
>
> **Status:** drafted 2026-04-29 on branch
> `claude/poc-plan-migration-OFV54`. Operator-blocking rows are
> ☐ **OPERATOR**; bot-runnable rows are ▶ **BOT**.

## §0 — Reading order

1. This file (the dated plan).
2. `docs/migrations/00-automation-readiness-plan.md §1` (where this slots in).
3. `docs/deploy/production-integrity.md §3` (the integrity contract).
4. `docs/mothership/dual-lane-enforcement-checklist.md §4` (the
   pre-migration gate — every row must resolve green from this POC).
5. `docs/storefront/01-gig-profile.md` Parts 2 & 4, `docs/storefront/02-pricing-tiers.md`,
   `docs/decks/04-prospective-client-deck.md`,
   `docs/storefront/06-product-strategy-deck.md` (the product
   catalog the §6 demo-readiness gate is auditing).

If you only have 5 minutes: read §1 (the migration-blocked gate), §6
(the demo-readiness gate above migration), §7.3 (the single calendar
entry the operator needs this week), §8.1 (advisory sequencing
recommendation), and §9.6 (first-demo audience). Come back for the
dated plan in §3 and the hard exit checks in §4.

### §0.1 — What this file gates, end-to-end

Three gates, three audiences, three independent flips:

| Gate                                                  | Section | Audience that benefits         | Goes green when…                                                                                                                                                                                |
|-------------------------------------------------------|---------|--------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Migration-ready** (Phase 2 unblocked)               | §1      | The future Run S1 bot session  | 10/10 streak, production-integrity wired, Dual-Lane Repo readiness rows all tick. The technical-trust gate.                                                                                          |
| **Demo-ready** (first prospect demo unblocked)        | §6      | The first demo audience (§9)   | Phone-edit pipeline proven end-to-end, catalog consistency proven, dummy-vertical demo site live, optional public-demo legal/risk rows cleared. The product-trust gate.                         |
| **Operator-ready** (operator hasn't missed a window)  | §7      | Future-operator (you, in July) | Trademark filed, slug-locking done, Phase 0 tasks sequenced inside their L dates. The "you didn't get blocked by your own delay" gate.                                                          |

§1 and §6 can flip independently. §7 isn't really a "gate" — it's a
**deadline sheet**. Reading order assumes the operator will optimise
for §1 + §6 simultaneously and use §7 to keep §6 reachable in the
demo window.

## §1 — Migration-blocked gate (highest priority)

**Phase 2 (Run S1 mechanical rename) and every later phase
(`00-automation-readiness-plan.md §4`–§7) MUST NOT START** until every
row below is resolved on this repo.

This is a re-statement of `00-automation-readiness-plan.md §3.1` paired
with the residue from PR #151 (`claude/fix-production-deployment-BuaWE`).
Both lists must be green simultaneously.

### §1.1 — Streak gate (from `00 §3.1`)

| #   | Condition                                                                                                                                                | Pass? |
|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| 1.1 | 10 consecutive `auto-routine` issues land green: triage → plan → execute → review → auto-merge → Vercel preview → prod, with zero operator intervention. | ☐     |
| 1.2 | Each of the seven cron paths (triage, execute, execute-complex, execute-single, codex-review, deep-research, auto-merge) has fired at least once in the streak. | ☐ |
| 1.3 | No P1 issues opened during the streak by `codex-review`, `deep-research`, or smoke workflows.                                                            | ☐     |
| 1.4 | Kanban board (Inbox → Triaged → In Progress → Review → Done) mirrors GitHub state with no manual moves.                                                  | ☐     |
| 1.5 | Operator review of the 10 PRs returns "I would have approved every one of these without changes."                                                        | ☐     |

A failed row resets the streak counter to **0/10**, intentionally. The
gate is buying confidence, not throughput.

### §1.2 — Production-integrity gate (residue from PR #151)

The `claude/fix-production-deployment-BuaWE` work introduced
`assertSafePromotion()`, `/admin/deployments`, and the
`deploy-drift-watcher` cron (`docs/deploy/production-integrity.md §3`,
§5). The contract is **only as strong as the live wiring**, so the POC
has to prove every layer fires before migration starts.

| #   | Condition                                                                                                                                                                              | Pass? |
|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| 2.1 | Vercel mirror checklist in `docs/deploy/production-integrity.md §9` is fully ticked (env vars present in all three Vercel environments; `deployment.succeeded`/`error` webhooks added; GitHub repo secrets for the watcher set). | ☐ |
| 2.2 | First-time backfill promote done — `/admin/deployments` reports **drift = 0** for `lumivara` (`production-integrity.md §6` §22-row inventory cleared).                                  | ☐     |
| 2.3 | `deploy-drift-watcher` has run at least once with `drift > 0`, opened/updated the rolling drift issue, and once with `drift = 0`, auto-closed it. Both behaviours captured in the audit log. | ☐ |
| 2.4 | A stale-SHA promote attempt is refused with `would_overwrite_newer` — captured as a screenshot or log line attached to the streak tracking issue.                                       | ☐     |
| 2.5 | An `auto-routine` PR opened during the streak is **auto-promoted** by the drift→triage→execute loop without operator intervention. (One occurrence is enough; this is the loop end-to-end.) | ☐ |

### §1.3 — Dual-Lane Repo readiness gate

Phase 2 begins the platform/site separation. Run S1 only renames; the
Phase 3+ work splits the artefact tree. To avoid wasted churn, the POC
phase also confirms that `dual-lane-enforcement-checklist.md §4` rows
**that can be checked against this repo today** are green.

| #   | Condition (cross-references `dual-lane-enforcement-checklist §4`)                                                                                                                                                                              | Pass? |
|-----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| 3.1 | Row 1: every operator-only path in C-MUST-1 either lives only in the platform repo (post-Phase 3) or is **explicitly catalogued** in `docs/migrations/_artifact-allow-deny.md` so the spinout can route it.                                    | ☐     |
| 3.2 | Row 3: `git grep -E '[A-Za-z0-9+/=]{32,}' main` is clean (no high-entropy strings on `main`).                                                                                                                                                  | ☐     |
| 3.3 | Row 5: `.claudeignore` exists at repo root and matches `03-secure-architecture.md §2.3` byte-for-byte.                                                                                                                                         | ☐     |
| 3.4 | Row 9: invoice and handover-pack templates contain no third-party brand names (`grep -iE '(anthropic\|google\|openai\|twilio\|resend\|vercel\|n8n\|railway)' docs/clients/<slug>/invoices/*.md` returns nothing once §P5.5 mirrors land — this row is **flagged**, not **gating**, until P5.5). | ☐ |

Rows 2/4/6/7/8/10/11 of `§4` are intentionally **not** in this gate —
they depend on the pipeline repo (Phase 3) and the spinout (Phase 4)
existing and so will be tested in their own runbooks.

### §1.4 — One-line summary

> **Migration cannot start** until §1.1 + §1.2 + §1.3 are all green
> simultaneously. The streak counter resets to 0/10 if any row in §1.2
> or §1.3 regresses during the streak.
>
> §1 is the migration gate only; the **demo gate** is §6. The two are
> independent — see §0.1 for the gate map and §9 for the audience the
> demo gate serves.

## §2 — Gap inventory (what's between today and the gate)

Each row names a concrete deliverable, the file/workflow that owns it,
the gate row in §1 it unblocks, and the owner. **Bot** = an
auto-routine issue executed via the existing pipeline; **operator** =
a manual UI click or vault edit.

### §2.1 — Tracking + kanban hygiene

| #   | Gap                                                                                                                                                                                                | Owner    | Unblocks | Cite                                                                       |
|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|----------|----------------------------------------------------------------------------|
| G1  | The "Phase 1 green streak — counter at 0/10" tracking issue does not yet exist (pinned, label `meta/automation-readiness`, body holds the live tally).                                             | Operator | 1.1, 1.4 | `00 §3.2`                                                                  |
| G2  | The seven seed issues from `00 §3.3` are not yet filed; without them the streak cannot exercise every cron path.                                                                                   | Operator | 1.2      | `00 §3.3`                                                                  |
| G3  | A small handful of pre-Dual-Lane issues are still open without `priority/` × `complexity/` × `area/` triples (see the open-issue scan in §2.4 below); they need to be normalised or `status/post-migration`-closed before counting starts. | Operator+bot | 1.4 | `00 §3.2` |

### §2.2 — Production-integrity wiring

| #   | Gap                                                                                                                                                                                                                                | Owner    | Unblocks | Cite                                            |
|-----|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|----------|-------------------------------------------------|
| G4  | Vercel env vars (`VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`, `KV_REST_API_URL`, `KV_REST_API_TOKEN`, `N8N_DEPLOY_WEBHOOK_URL`, `N8N_HMAC_SECRET`) present in **all three** environments (Production, Preview, Development).                                 | Operator | 2.1      | `production-integrity.md §9` row 1              |
| G5  | Vercel webhook for `deployment.succeeded` and `deployment.error` pointing at `${N8N_BASE_URL}/webhook/vercel-deploy-status`.                                                                                                       | Operator | 2.1      | `production-integrity.md §9` row 2              |
| G6  | GitHub Actions repo secrets (`VERCEL_API_TOKEN`, `VERCEL_PROJECT_ID`, `VERCEL_TEAM_ID`) so `deploy-drift-watcher.yml` can call the Vercel API.                                                                                      | Operator | 2.1, 2.3 | `production-integrity.md §9` row 3              |
| G7  | First-time backfill promote — click **Promote tip of main** on `/admin/deployments`. Until this fires, drift starts in the double digits and the watcher will keep opening P1 issues.                                              | Operator | 2.2      | `production-integrity.md §6` 22-row inventory   |
| G8  | Capture evidence of `would_overwrite_newer` rejection — fire the deploy hook against an old SHA via the per-issue `confirmDeploy` flow and screenshot/log the refusal. Attach to the streak tracking issue.                        | Bot      | 2.4      | `production-integrity.md §3` condition 2        |
| G9  | Capture evidence of an end-to-end drift→triage→execute auto-promote during the streak. Drift watcher opens issue → triage classifies → execute promotes → drift returns to zero. One occurrence is enough.                          | Bot      | 2.5      | `production-integrity.md §5`                    |

### §2.3 — Dual-Lane Repo readiness

| #    | Gap                                                                                                                                                                                                                                                | Owner    | Unblocks | Cite                                                  |
|------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------|----------|-------------------------------------------------------|
| G10  | `docs/migrations/_artifact-allow-deny.md` exists; confirm it is current vs. the actual `docs/`/`scripts/`/`n8n-workflows/`/`dashboard/` shape on `main` so the spinout's selective-copy table is unambiguous.                                      | Bot      | 3.1      | `dual-lane-enforcement-checklist §4` row 1            |
| G11  | Run the high-entropy grep weekly and on every secret rotation (`git grep -E '[A-Za-z0-9+/=]{32,}' main`). Today this is implicit; the streak counter explicitly checks it after each merge.                                                        | Bot      | 3.2      | `dual-lane-enforcement-checklist §2` C-MUST-3         |
| G12  | `.claudeignore` byte-for-byte parity with `03-secure-architecture.md §2.3`. Verify in CI as part of the streak (single grep is enough; promote to a script in Phase 3).                                                                            | Bot      | 3.3      | `dual-lane-enforcement-checklist §2` C-MUST-5         |
| G13  | Invoice / handover-pack templates: confirm no third-party vendor names. This is **non-gating** today (no client invoices yet) but flagged so it isn't skipped during Client #1 spinout pre-flight.                                                  | Bot      | 3.4      | `dual-lane-enforcement-checklist §3` C-MUST-NOT-3     |

### §2.4 — Existing-automation surface inventory

For grounding only — the items below already exist in `main` and must
not regress during the streak. Listing them so a regression in any one
**resets the streak counter**.

| Surface                    | Path                                                                                       | Last confirmed live |
|----------------------------|--------------------------------------------------------------------------------------------|----------------------|
| Triage cron                | `.github/workflows/triage.yml` + `scripts/triage-prompt.md`                                | (operator to fill)   |
| Execute (routine)          | `.github/workflows/execute.yml` + `scripts/execute-prompt.md`                              | (operator to fill)   |
| Execute (complex / single) | `execute-complex.yml`, `execute-single.yml`, `execute-multi.yml`, `execute-fallback.yml`   | (operator to fill)   |
| Forge lane                 | `forge-execute.yml`, `forge-triage.yml`, `forge-smoke-test.yml` + `scripts/forge-*.md`     | (operator to fill)   |
| Codex review               | `codex-review.yml`, `codex-pr-fix.yml`, `codex-review-recheck.yml`, `codex-review-backlog.yml` + `scripts/codex-*.py` | (operator to fill) |
| Deep research              | `deep-research.yml` + `scripts/gemini-triage.py`                                           | (operator to fill)   |
| Auto-merge                 | `auto-merge.yml`                                                                           | (operator to fill)   |
| Plan issues                | `plan-issues.yml` + `scripts/plan-issue.py`                                                | (operator to fill)   |
| Bot-usage monitor          | `bot-usage-monitor.yml` + `scripts/bot-usage-report.py`                                    | (operator to fill)   |
| Project sync               | `project-sync.yml`                                                                         | (operator to fill)   |
| Dashboard deploy           | `deploy-dashboard.yml`                                                                     | (operator to fill)   |
| AI smoke test              | `ai-smoke-test.yml`                                                                        | (operator to fill)   |
| Setup CLI                  | `setup-cli.yml`                                                                            | (operator to fill)   |
| Drift watcher              | `deploy-drift-watcher.yml` + `scripts/lib/inventory_backfill.py`                           | (operator to fill)   |

§3 below converts the gaps into a dated worklist.

## §3 — Dated 14-day plan

The plan runs **D-0 (Wed 2026-04-29) → D-14 (Wed 2026-05-13)**, two
calendar weeks. Day labels are "operator wall-clock days," not bot
turn-budgets. The bot's per-run `--max-turns` self-pacing rules from
`AGENTS.md` apply unchanged inside each day.

| Day        | Date         | Owner        | Deliverables                                                                                                                                                                                                                                                                                  | Gate rows it touches |
|------------|--------------|--------------|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------|
| **D-0**    | Wed 04-29    | ☐ Operator   | (a) Read §1 + §4. (b) Land this plan on `claude/poc-plan-migration-OFV54`, request review, merge. (c) Confirm decision: streak counts only `auto-routine` issues, not the synthetic seed issues filed for cron-path coverage in §3.3 of the readiness plan (per `00 §3.3` they double up).    | meta                 |
| **D-1**    | Thu 04-30    | ☐ Operator   | (a) File the **"Phase 1 green streak — counter at 0/10"** tracking issue (label `meta/automation-readiness`, pinned). Body = the §1.1 + §1.2 + §1.3 checklist verbatim. (b) Walk every open issue and apply `priority/` × `complexity/` × `area/` triples or close as `status/post-migration`. (c) **Same sitting:** fill the `Repo-Destination-Post-Migration` custom field on every open project item per [`docs/ops/github-project-layout.md §6.2`](../ops/github-project-layout.md#62--the-single-most-important-bulk-classification-pass) — same eyeball pass, lossless Phase 4 transfer playbook downstream. | G1, G3               |
| **D-2**    | Fri 05-01    | ☐ Operator   | Vercel-mirror sitting: rows 1–3 of `production-integrity.md §9`. Add the env vars in all three environments, add the `deployment.succeeded`/`error` webhook, add the GitHub repo secrets for the watcher. Capture the screenshots into the streak tracking issue.                              | G4, G5, G6 → 2.1     |
| **D-3 AM** | Mon 05-04    | ☐ Operator   | Click **Promote tip of main** on `/admin/deployments`. Confirm drift goes to zero. Wait 30 min for the watcher's first scheduled run; confirm it does **not** open a P1 issue (drift = 0 path).                                                                                              | G7 → 2.2, 2.3-half   |
| **D-3 PM** | Mon 05-04    | ▶ Bot        | File the seven seed issues from `00 §3.3`: triage rerun, doc typo fix (routine), homepage Forge badge (complex), execute-single rerun, codex-review (auto on every PR), Gemini deep-research summary, auto-merge (auto on green PRs).                                                          | G2 → 1.2             |
| **D-4**    | Tue 05-05    | ▶ Bot        | First two streak rows: routine doc-typo seed (#3.3 row "execute (routine)"), and the codex-review path firing automatically against its PR. Land both green; the bot updates the streak tracking issue counter to 2/10.                                                                       | 1.1 (rows 1–2)       |
| **D-5**    | Wed 05-05/06 | ▶ Bot        | Streak rows 3–4: the homepage Forge badge (`execute-complex`), and an `execute-single` workflow_dispatch rerun targeting an existing low-stakes issue with `model/opus`. Codex-review fires on each.                                                                                            | 1.1 (rows 3–4)       |
| **D-6**    | Thu 05-07    | ▶ Bot        | Streak rows 5–6: deep-research seed issue closes with a doc PR; auto-merge demonstrably fires on a green Vercel + low-complexity PR. Bot ticks the cron-path coverage table in the tracking issue.                                                                                            | 1.1 (rows 5–6), 1.2  |
| **D-7**    | Fri 05-08    | ▶ Bot        | Streak rows 7–8: two more `auto-routine` issues from the natural backlog (anything labelled `auto-routine` + `complexity/easy` or simpler). One must include a `src/` change so Vercel preview deploys.                                                                                       | 1.1 (rows 7–8)       |
| **D-8**    | Mon 05-11 AM | ▶ Bot        | Streak rows 9–10: two final `auto-routine` issues. After row 10 the bot comments **"READY FOR PHASE 2 — pending §1.2 + §1.3 evidence"** on the tracking issue.                                                                                                                                | 1.1 (rows 9–10)      |
| **D-8 PM** | Mon 05-11    | ▶ Bot        | Capture **G8** evidence: fire `confirmDeploy` against an old preview SHA via `/admin/client/[slug]/request/[number]`, screenshot the `would_overwrite_newer` rejection, attach to the tracking issue.                                                                                          | G8 → 2.4             |
| **D-9**    | Tue 05-12    | ▶ Bot        | Capture **G9** evidence: deliberately delay one promote until the drift-watcher opens a P1 issue, then let triage + execute auto-promote it. Drift returns to zero. Watcher closes its own issue. Attach the issue + audit-log links to the tracking issue.                                    | G9 → 2.3, 2.5        |
| **D-10**   | Tue 05-12 PM | ▶ Bot        | **Dual-Lane Repo readiness pass.** Run `git grep -E '[A-Za-z0-9+/=]{32,}' main`, byte-diff `.claudeignore` vs `03-secure-architecture.md §2.3`, audit `_artifact-allow-deny.md` against the live tree, run the invoice grep against any rendered handover-pack drafts. Tick §1.3 rows.            | G10–G13 → 3.1–3.4    |
| **D-11**   | Wed 05-13 AM | ☐ Operator   | Operator review of the 10 streak PRs (§1.1 row 1.5). Sign off on each, in writing, in the tracking issue. If any one needs a "would have asked for changes" comment, the streak resets to 0/10 and the plan re-runs from D-4.                                                                  | 1.5                  |
| **D-11 PM**| Wed 05-13    | ☐ Operator + bot | Confirm every row of §1 (1.1 through 3.4) is ticked. Bot drafts the §4 hard-exit-check command output as a comment on the tracking issue. Operator countersigns. Tracking issue moves to **MIGRATION READY** with a single `/lgtm` comment.                                              | gate exit            |
| **D-12**   | Thu 05-14    | ☐ Operator   | Buffer day. Reserved for any §1 row that flipped during D-11. If the gate is green, this day is used to print the recovery envelope (`00 §2.2` row 11) and book the first quarterly recovery drill.                                                                                            | buffer               |
| **D-13**   | Fri 05-15    | ☐ Operator   | **Phase 0 (account + identity bootstrap) starts** in parallel with the green gate — Phase 0 is operator-only and has no dependency on Phase 1's exit, but `00 §2` recommends sequencing it so the org and the GitHub App exist before Run S1 lands.                                            | unblocks Phase 2     |
| **D-14**   | Mon 05-18    | ▶ Bot        | **Phase 2 (Run S1 — mechanical rename)** starts. Single Claude Code session against this repo per `00 §4.3`. The migration is unblocked **only because §1 is green** — if any row flipped during D-12/D-13, halt and re-run §3 from D-4.                                                       | enters Phase 2       |

### §3.1 — Self-pacing inside any day

`AGENTS.md` already governs `--max-turns` self-pacing. Two extra rules
specific to this plan:

- **No new streak row after 80% used.** The bot finishes the current
  row, ticks the tracking issue, and exits. The next bot run picks the
  next row.
- **No `git push` of the tracking-issue counter increment if the row
  isn't actually green.** A row counts only when its PR is merged,
  Vercel preview is green, and Codex-review opened no P1 issues. The
  bot must not pre-increment "in anticipation."

### §3.2 — Acceptable holiday / off-day reslotting

Any single day can slip by **48 h** without resetting the streak (the
streak is about quality, not throughput). A row that takes longer than
48 h to land green for non-streak reasons (CI flake, third-party API
outage) is reset to 0/10 — that is intentional and matches `00 §3.5`.

## §4 — Hard exit checks

The bot drafts these as a single comment on the streak tracking issue
during D-11 PM (`§3` row D-11 PM). Operator countersigns the comment
before the gate flips to **MIGRATION READY**. Each command runs from
the operator's local clone of `palimkarakshay/lumivara-site`; no row is
acceptable as "presumed green."

### §4.1 — Streak counter

```bash
gh issue list --repo palimkarakshay/lumivara-site \
  --label meta/automation-readiness --state open \
  --json number,title,body --jq '.[].body' \
  | grep -E '^\| *(10/10) *\|' || echo "STREAK NOT AT 10/10 — DO NOT PROCEED"
```

Expected: a row matching `10/10` exists in the tracking issue body.

### §4.2 — Cron-path coverage

```bash
gh run list --repo palimkarakshay/lumivara-site \
  --limit 200 \
  --json conclusion,name,createdAt \
  --jq '[.[] | select(.conclusion=="success")] | group_by(.name) | map({name: .[0].name, runs: length})'
```

Expected: each of `triage`, `execute`, `execute-complex`, `execute-single`,
`codex-review`, `deep-research`, `auto-merge` appears with `runs >= 1`
in the streak window (≥ D-4 timestamp).

### §4.3 — No stray P1 issues

```bash
gh issue list --repo palimkarakshay/lumivara-site \
  --state open --label priority/P1 --label auto-routine \
  --search "created:>=2026-05-04" \
  --json number,title --jq 'length'
```

Expected: `0` (no P1 issues opened during the streak window — `00 §3.1`
condition 3).

### §4.4 — Drift integrity

```bash
# Live production SHA must equal tip of main on the operator's clone.
PROD_SHA=$(curl -s -H "Authorization: Bearer $VERCEL_API_TOKEN" \
  "https://api.vercel.com/v6/deployments?projectId=$VERCEL_PROJECT_ID&teamId=$VERCEL_TEAM_ID&state=READY&target=production&limit=1" \
  | jq -r '.deployments[0].meta.githubCommitSha')
git fetch origin main >/dev/null
[[ "$(git rev-parse origin/main)" == "$PROD_SHA" ]] && echo "DRIFT = 0" || echo "DRIFT > 0 — DO NOT PROCEED"
```

Expected: `DRIFT = 0`.

### §4.5 — Stale-promote refusal evidence

```bash
gh issue view <streak-tracking-issue> --repo palimkarakshay/lumivara-site \
  --comments --json comments --jq '.comments[] | .body' \
  | grep -c 'would_overwrite_newer'
```

Expected: at least `1` (the screenshot/log line attached during D-8 PM
contains the literal `would_overwrite_newer` token).

### §4.6 — End-to-end auto-promote loop evidence

```bash
gh issue list --repo palimkarakshay/lumivara-site \
  --state closed --label deploy-drift --search "closed:2026-05-12" \
  --json number,closedAt --jq 'length'
```

Expected: at least `1` drift issue **opened and closed** by the watcher
on D-12 (the rolling drift issue from `production-integrity.md §5`).

### §4.7 — Dual-Lane Repo readiness

```bash
# C-MUST-3 — no high-entropy strings
git -C . grep -E '[A-Za-z0-9+/=]{32,}' main \
  -- ':!package-lock.json' ':!*.svg' ':!*.png' ':!*.jpg' ':!*.webp' \
  | grep -v '^\.next/' | wc -l        # expect: 0

# C-MUST-5 — .claudeignore parity
diff <(git show main:.claudeignore) <(awk '/^```$/{flag=!flag; next} flag' \
  docs/mothership/03-secure-architecture.md) | head -5   # expect: empty diff

# G10 — _artifact-allow-deny.md mirrors live tree
ls docs/migrations/_artifact-allow-deny.md && \
  echo "OK"          # expect: file present and reviewed (manual diff)
```

Expected: each command reports the success line above.

### §4.8 — Operator sign-off

The streak tracking issue carries a **/lgtm** comment from the operator
with the literal text:

```
LGTM — POC perfection plan §1 fully green. Phase 2 (Run S1) unblocked.
Ten PRs reviewed in detail; would have approved every one without changes.
```

This is the only path that satisfies §1.1 row 1.5. The bot **must not**
post this comment under any circumstance.

## §5 — Risks and resume protocol

### §5.1 — Top risks specific to this POC

These extend `00 §9`'s risk register; rank-1 there ("S1 rename misses a
hit") doesn't apply yet because Phase 2 hasn't started.

| #   | Risk                                                                                                                                                                                                                                                                | Likelihood | Impact   | Mitigation                                                                                                                                                                                                                                            |
|-----|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------|----------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| R1  | Operator misses a Vercel mirror row on D-2 → drift watcher is silent → §1.2 row 2.3 cannot be ticked → false-green gate.                                                                                                                                            | Medium     | High     | §4.4 + §4.6 are run **on the operator's machine**, not from CI; an unwired watcher can't fake a closed drift issue. Operator countersign on D-11 PM is the second layer.                                                                              |
| R2  | A streak row breaks at 9/10 because Codex-review opens a P1 the operator believes is a false positive.                                                                                                                                                              | Medium     | Medium   | The streak resets, intentionally. The remediation is to fix the prompt/rubric (file an issue against `scripts/codex-review-fallback.py`, not against this plan). `00 §9` row 4.                                                                       |
| R3  | A natural-backlog issue picked for streak rows 5–10 turns out to need design discussion mid-flight, so the bot opens a `needs-clarification` PR. That counts as operator intervention → row resets.                                                                  | Medium     | Low      | Operator's D-1 walk excludes anything `area/design`/`type/design-cosmetic` from the eligible pool. If the bot still trips on one, the row is replaced with another `auto-routine` row from the queue, not skipped.                                    |
| R4  | The drift-watcher cron's first scheduled run after D-2 mirror happens **before** the D-3 AM backfill promote → it opens a P1 drift issue that *was* expected and therefore looks ambiguous to triage.                                                                | High       | Low      | Operator fires the backfill **immediately** after the mirror sitting on D-2 PM; the next watcher run after the mirror should see drift = 0. If the watcher beats the operator to it, close the issue with a "expected — pre-backfill" comment.       |
| R5  | Quota: 14 days of bot work on Opus across all paths exceeds the Max 20x rolling 5-h quota at peak hours.                                                                                                                                                            | Low        | Medium   | The plan deliberately spreads streak rows over 8 wall-clock days, never more than two rows per day. `AGENTS.md` 80%/95% self-pacing rules apply unchanged.                                                                                            |
| R6  | A late-arriving production critical bug forces an emergency P0 PR mid-streak. The PR is good, but it didn't come through `auto-routine`.                                                                                                                            | Low        | Medium   | P0/P1 emergency PRs **do not count** towards or against the streak (they're outside `auto-routine`). Document the merge in the tracking issue but leave the counter unchanged.                                                                       |
| R7  | Operator reviews the 10 PRs on D-11 and finds one minor nit — wants to count the streak with the disclaimer "I would have approved with this small comment."                                                                                                        | High       | Medium   | The §1.1 row 1.5 wording is **deliberately strict**: "would have approved every one without changes." A nit is a change. Reset to 0/10 and rerun from D-4 with the rubric tightened. This is the only way the gate stays meaningful.                  |

### §5.2 — Resume protocol (cold restart)

If a session is interrupted mid-plan:

1. `git fetch origin claude/poc-plan-migration-OFV54` and read the last
   commit's subject — it names the most recent §-row touched.
2. Open the streak tracking issue (search:
   `is:issue label:meta/automation-readiness`). The body holds the live
   counter and the per-row evidence; the next row to work on is the
   first `pending` row.
3. Run §4 commands locally to confirm what's actually green vs. what
   the tracking issue claims. The issue body trusts the bot; §4 trusts
   the world.
4. If the two disagree, the world wins — reset the relevant counter
   and document the divergence in a comment.
5. If §4.4 says `DRIFT > 0` at any point, **pause the streak**, open
   `/admin/deployments`, and resolve drift before counting any further
   rows (the gate is built on drift = 0; counting rows on top of drift
   is meaningless).

### §5.3 — When the gate refuses to go green

If two consecutive 14-day windows fail to clear §1, that is a signal to
**reduce streak size** before reducing rigour. Cut from 10/10 to 7/7
only by *amending this document* and getting operator countersign in a
PR, never by quietly counting fewer rows. The gate's value is its
public, dated, hard-edged definition; loosening it informally collapses
the value to zero.

If the gate is still red at D-14, the schedule slips by exactly two
weeks (next rev: D-0 = Wed 2026-05-13, D-14 = Wed 2026-05-27). Don't
"compress" the schedule by skipping evidence rows.

## §6 — Catalog & demo-readiness gate (above the migration gate)

§1's gate proves the autopilot is **technically** trustworthy. It does
not prove the practice is **commercially** demo-able. The product
catalog (`docs/storefront/01-gig-profile.md` Parts 2 & 4,
`docs/storefront/02-pricing-tiers.md`, `docs/decks/04-prospective-client-deck.md`,
`docs/storefront/06-product-strategy-deck.md`) sells three bundled
things — a custom site, a phone-edit pipeline, and a monthly
improvement subscription. The POC streak only exercises one of those
(GitHub-issue → bot-PR → auto-merge), and only on this repo's natural
backlog. The other two and the catalog itself need their own gate
before any prospect demo happens.

This gate is **not** required for migration (Phase 2). It **is**
required before any external demo. Treat it as a parallel gate that
opens "demo-ready" while §1 opens "migration-ready."

### §6.1 — Phone-edit pipeline end-to-end

The single most-load-bearing claim in the catalog is *"text from a
phone, tap publish."* The streak does not prove it; this row does.

| #   | Condition                                                                                                                                                                                              | Pass? |
|-----|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| 6.1 | One full SMS-to-published cycle: operator's phone → Twilio → n8n `intake-sms` → GitHub issue created with right labels → triage → execute → PR opened → Vercel preview green → operator taps publish in `/admin` → production updated. Captured screenshots/log lines attached to the streak tracking issue. | ☐ |
| 6.2 | Same cycle via the admin-portal magic-link path (Resend) — operator signs in, submits a change via `/admin/client/[slug]/request/new`, the rest of the chain fires identically. | ☐     |
| 6.3 | Same cycle via inbound email (`requests@lumivara.ca` IMAP credential per `docs/N8N_SETUP.md` and `OPERATOR_SETUP.md §1.4`). One channel can be marked **deferred** if the demo script doesn't use it; deferral is documented in the tracking issue, not silent. | ☐ |
| 6.4 | A deliberate "bot got it wrong" rehearsal: operator rejects the preview from the admin portal, the issue reopens with the rejection note, the bot proposes a v2, operator approves v2. The "every change waits for your tap" claim from `prospective-client-deck.md` slide 7 is provably true. | ☐ |

### §6.2 — Catalog consistency

Five decks + the gig profile + the pricing tiers must agree on every
material number and the brand. Drift here is the exact failure mode
that turns a demo into "wait, your slide says $4,500 but the gig says
$3,250 — which is it?"

| #   | Condition                                                                                                                                                                                                                                                                       | Pass? |
|-----|-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| 6.5 | Brand-lock audit: every doc in `docs/storefront/`, `docs/decks/`, and `docs/mothership/01-business-plan.md` reads `Lumivara Forge` consistently — or every one still reads `{{BRAND}}` consistently. **No mixed state.** Run S1 (Phase 2) is the moment the switch flips; this row gates that the docs are coherent on whichever side they're on. | ☐ |
| 6.6 | Pricing parity: T0 / T1 / T2 / T3 setup + monthly numbers in `02-pricing-tiers.md` match the same-named rows in `04-prospective-client-deck.md`, `06-product-strategy-deck.md`, and `04-slide-deck.md` (CAD figures, USD conversion footnote where present). One executable grep proving zero mismatches, attached to the tracking issue. | ☐ |
| 6.7 | Source-bibliography health: every `[V]`-flagged claim in `04-prospective-client-deck.md` (e.g., "75%", "3,117", "95.9%", "27% YoY") has a corresponding live row in `docs/research/03-source-bibliography.md`. Any `[S]` row without a current source URL is downgraded to a footnote or removed. | ☐ |
| 6.8 | Service catalog (`01-business-plan.md §4`) ↔ feature delivery: every "Built" row in §4's feature table is provably live in this repo (workflow file present, prompt file present, smoke evidence in the streak). Anything marked Built but not actually firing is removed from the catalog before the demo. | ☐ |

### §6.3 — Demo site readiness

The first demo cannot be Beas's site (too tied to the operator's
family — see §9). It needs a **dummy-vertical demo site** the operator
can actually click through with a stranger.

| #   | Condition                                                                                                                                                                                                                                                                                                | Pass? |
|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| 6.9 | Pick **one** dummy vertical with full template support today (per `docs/mothership/templates/00-templates-index.md`, the restaurant pack is the only ✅ row — pick that unless another vertical has been promoted to ✅ by demo time). | ☐     |
| 6.10 | Render the picked vertical's intake (e.g., `Rose Restaurant` from `07-client-handover-pack.md §6`) into a real, deployed `*.vercel.app` preview, fronted by a non-production demo subdomain (`demo.lumivara-forge.com` once Phase 0 buys the domain; until then, the bare Vercel URL is acceptable for a private demo). | ☐ |
| 6.11 | Lighthouse 90+ on every page of the demo site for Performance, Accessibility, Best Practices, SEO. Captured as a JSON export attached to the tracking issue. The catalog's "90+ Lighthouse" claim (`prospective-client-deck.md` slide 9) is the property under audit here. | ☐ |
| 6.12 | `axe-core` CI gate green on the demo site PR. The "WCAG failures cannot be shipped" claim (`prospective-client-deck.md` slide 7) is the property under audit here. | ☐ |
| 6.13 | The demo site is wired into the **same** autopilot loop as §6.1 — i.e., the demo SMS path lands an issue on the demo site's repo (or the demo client slug, post-Phase 4), not on `palimkarakshay/lumivara-site`. Pre-Phase-4 this means a temporary `client/demo` label on this repo with a `demo` slug suffix; post-Phase-4 it means a real per-client repo. | ☐ |

### §6.4 — Public-demo legal & risk

Cheap to skip, expensive to skip incorrectly. These rows are **not**
gating for a private demo to a friendly advisor (§9.2 audience #1) but
**are** gating before any demo to a stranger or a public posting.

| #   | Condition                                                                                                                                                                                                                                          | Pass? |
|-----|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------|
| 6.14 | Both **O4a knock-out search returned `clear`** (CIPO Class 35 + 42 + USPTO TESS, captured in `docs/mothership/15-terminology-and-brand.md §2`) **and O4b registration filing submitted** (filing receipt / application number captured in the same doc). Submission, not registration, is enough — registration takes 6–12 weeks and would block public demos for that whole window. A blocking conflict at either stage means the brand pivots **before** the demo — re-running Run S1 is cheaper than a takedown letter. Private demos to a single named advisor (§9.2 #1) may proceed on **O4a-clear alone** with this row marked `deferred, captured` per §6.5. | ☐     |
| 6.15 | One pass of `git grep -E '[A-Za-z0-9+/=]{32,}' main` (already in §1.3 row 3.2) re-run with the demo site repo included; zero matches. A demo that leaks a token into a public preview is worse than no demo. | ☐     |
| 6.16 | The "honest objections" slide (`04-prospective-client-deck.md` slide 11) has a current, written answer for each row — including "what if you go out of business" — that the operator can deliver verbally without reading. Rehearsed once on a recording. | ☐ |

### §6.5 — One-line summary

> **No external demo** until §6.1 + §6.2 + §6.3 are all green. §6.4 is
> required only before strangers/public; private demos to one named
> advisor or one named partner-candidate (§9) may proceed with §6.4 as
> "deferred, captured."
>
> §6 is **independent** of §1: a demo can happen on a green §6 even
> while §1 is still amber, and migration can happen on a green §1 even
> while §6 is still amber. They serve different audiences (the demo
> audience and the future-engineer audience). Don't let either gate
> "shortcut" the other.

## §7 — Operator drop-dead dates

The operator is, by their own statement, going to delay every operator
task they can. That posture is fine for cost (Claude Max 20x is paid
either way) but it has hard limits — some operator-only tasks have
**lead times** that, if missed, push the first prospect demo by months
not weeks.

This section is the "be the sensible adult" map. Each row names: the
task, the earliest date it could happen (E), the latest date it can
happen without slipping the demo (L), and the consequence of slipping
past L. Assume the operator's preferred demo window is **early July
2026** (≈ 9 weeks from D-0). If the demo window moves, every L date
shifts with it.

> **Reading rule.** "Don't act before E" is just as important as "must
> act by L." Acting before E (e.g., creating the GitHub org during
> Phase 1 streak) creates exactly the operator-action signal that
> resets the streak counter.

### §7.1 — The map

| #   | Operator task                                                            | Earliest sensible date (E) | Latest acceptable date (L) | Lead time / why L matters | If slipped past L |
|-----|--------------------------------------------------------------------------|----------------------------|----------------------------|---------------------------|-------------------|
| O1  | **File the streak tracking issue + walk open issues** (POC §3 D-1)       | Thu 2026-04-30             | Mon 2026-05-04             | The streak cannot start counting until the issue exists. Each day past L is a day the streak doesn't accrue. | Streak start slips by exactly that many days; demo slips with it. |
| O2  | **Vercel mirror sitting** (POC §3 D-2; G4–G6)                            | Fri 2026-05-01             | Mon 2026-05-04             | The drift watcher cannot run cleanly without it; §1.2 row 2.3 cannot tick. | Streak resets on the first false-green watcher run. |
| O3  | **First-time backfill promote** (POC §3 D-3 AM; G7)                      | Mon 2026-05-04 AM          | Mon 2026-05-04 PM          | Drift starts double-digit; every watcher run opens a P1 issue until promoted. | False P1 issues poison the streak's "no P1 issues opened" condition (§1.1 row 1.3). |
| O4a | **Trademark knock-out availability search** (CIPO Trademarks Database, USPTO TESS, Class 35 + 42; `01-business-plan §1`, `15-terminology-and-brand §2`) — same-day, free, **does not** require a filing. The deliverable is a written one-page memo with screenshots of every search result for `lumivara-forge`, `lumivara forge`, and the closest 3 phonetic neighbours, plus a verdict: **clear** / **likely-conflict** / **needs-counsel**. | Today (2026-04-29)         | Fri 2026-05-01             | Same-day work; the L date exists only because every later row (O5 domains, O6 GitHub org slug, the entire Run S1 brand lock) depends on the verdict. A `likely-conflict` or `needs-counsel` verdict triggers a brand re-pick **before** any of those happen. | Operator burns a week of Phase 0 work and a Run S1 session on a brand they then have to abandon. |
| O4b | **Full trademark filing** (CIPO Class 35 + 42 + USPTO, post-O4a-clean) — engages registration agent or `Trademarkia`/equivalent.        | After O4a returns **clear** | Fri 2026-08-15             | CIPO turnaround is 6–12 weeks on a clean filing, longer on conflicts. The L date is demo + ~16 weeks; the §6.4 row 6.14 (public-demo legal & risk) cannot tick green until the filing is at least *submitted* (not necessarily registered). Private demos to a single named advisor (§9.2 #1) may proceed on O4a-clean alone. | If a registration-stage conflict surfaces, Run S1 has to be re-run to a new brand. Re-run is bot-cheap (~1 session) but every doc/deck/asset citing the old brand has to be re-rendered, including any decks already shared with advisors. **O4a is the today-or-this-week task; O4b is the file-it-before-public-demo task.** |
| O5  | **Buy `lumivara-forge.com` + `.ca` domains** (Phase 0 row 1)             | After O4a returns **clear** (≥ Mon 2026-05-04) | Mon 2026-06-08             | Cheap ($30 / yr each); registrar of record matters more than timing. **Gated by O4a, not O4b** — the same-day knock-out search is enough to commit a $60 domain spend; waiting for the full O4b registration would push every Phase 0 task out by 6–12 weeks. | If a domain is squatted between O4a and O5, brand pivots and Run S1 re-runs. Compounds with the O4b cost if O4b has already been filed. |
| O6  | **Phase 0 GitHub org + App + secrets bootstrap** (`00 §2.2`)             | Wed 2026-05-13 (POC §3 D-13) | Fri 2026-05-22             | Phase 2 (Run S1) cannot be merged into the platform org until the org exists. Phase 0 itself is one focused day; the L date is two weeks later because Phase 2 tolerates that slack. | Phase 2 doesn't start; Phase 3 doesn't start; demo slips. |
| O7  | **Empty target client repos created** (`palimkarakshay/lumivara-people-advisory-site`, `*-pipeline`, plus a demo dummy repo for §6.3) | Wed 2026-05-13 | Fri 2026-05-29             | Slug-locking only. Push a one-line README, do nothing else. Reserves the slugs against squatting and lets the bot validate URLs in dry-runs. | If a slug is taken (unlikely on a personal account), §6.13 cannot point the demo at the right URL pre-Phase-4. |
| O8  | **Vercel team account on `Forge` business email** (Phase 0 row 9)        | Wed 2026-05-13             | Fri 2026-06-05             | Today's Vercel project is on the operator's personal email. The new client + demo Vercel projects must live on the business email or the eventual transfer back to the client (catalog promise: "you own the hosting account") is theatrical. | Hosting-transfer story breaks; the catalog claim becomes false. **Soft slip:** the demo can run on the personal Vercel account; the L date is what matters for the eventual client #1 transfer. |
| O9  | **Twilio sub-account + per-client number for the demo** (Phase 0 row 10) | Wed 2026-05-13             | Fri 2026-06-12             | $1.15/mo per number; the SMS arm of §6.1 needs at least one real number to demo on. The L date is the demo window minus 3 weeks (Twilio number provisioning + carrier verification can take 5–10 business days for SMS-A2P registration in Canada). | §6.1 row 6.1 cannot tick; demo loses its single most-load-bearing claim. |
| O10 | **n8n on Railway, Forge instance** (Phase 0 row 10b)                     | Wed 2026-05-13             | Fri 2026-06-19             | One n8n instance, many workflows. The L date is demo minus 2 weeks for credential provisioning, workflow imports, smoke tests. | §6.1 / §6.2 / §6.3 rows that depend on n8n cannot tick; demo loses the entire phone-edit narrative. |
| O11 | **1Password Business + recovery envelope** (`21-vault-strategy-adr.md`)  | Wed 2026-05-13             | Fri 2026-06-26             | One sitting, ~2 hours. The recovery envelope cannot be skipped — `09 §1.5` makes it a quarterly drill subject. | The single-Owner break-glass risk (`09 §9` row 5) goes from "documented mitigation" to "silent until it triggers." Catastrophic if the operator's laptop is lost between L and the first drill. |
| O12 | **DNS cutover for advisory** (Phase 4 row 12)                            | Mon 2026-06-22             | Fri 2026-07-10             | Hard-to-reverse. The earliest sensible date is the day Phase 4 acceptance ticks green. The L date is the demo window's end. **Do not** schedule this in the same week as the demo — propagation lag + a bad cutover is the worst-possible demo-day surprise. | Demo audience hits the old site or a half-cut-over site. Recoverable but unprofessional. |
| O13 | **Insurance: E&O + cyber liability** (`21-ip-protection-strategy.md §4`) | Mon 2026-06-15             | Fri 2026-08-01             | First paying client should be covered. Brokers take 2–4 weeks to quote + bind. The L date is demo + 4 weeks (a discovery-call demo doesn't yet need cover; a signed contract does). | Operator is personally liable for any IP / data-breach claim from Client #1 onward. |
| O14 | **Lawyer-reviewed MSA + SOW** (`22-engagement-risk-protection.md §3, §4`) | Mon 2026-06-15             | Fri 2026-07-31             | Lawyer review is 2–4 weeks; revisions are another 1–2. Demo doesn't need this; **first contract** does. The L date is demo + 3 weeks, on the assumption that the demo converts and a contract is in front of someone within a month. | First client signs the operator's draft contract, which is not enforceable on the items that matter (IP assignment, non-payment, data privacy). |

### §7.2 — Reading the map

The dates **rank** the operator's procrastination cost. Reading down
the L column:

1. **O4a (trademark knock-out search)** is today-or-this-week. Same-day
   work; gates the entire downstream brand-locked schedule. **Do this
   first.**
2. **O1 / O2 / O3** are this-week. They're inside the POC plan
   already; this section just makes them harder to forget.
3. **O4b (full trademark filing)** is start-after-O4a-clears,
   submit-before-public-demo. Single longest *external* lead time
   (6–12 weeks at CIPO), but does **not** gate Phase 0 — only public
   demos and first contract.
4. **O5–O11** are mid-May to late-June. Phase 0 day clusters them;
   the operator does them in one focused sitting per
   `00 §2.2`. **Don't do them earlier** — operator action during the
   streak resets the streak counter (§5.1 R3). O5 specifically is
   gated on **O4a clear**, not on O4b registration.
5. **O12 (DNS cutover)** is the only late-June item that the operator
   should *deliberately* delay until Phase 4 acceptance is green.
6. **O13 + O14 (insurance + lawyer)** are post-demo. They're listed
   here because the operator's "delay until necessary" instinct will
   try to defer them past first contract — and signing without them
   is the single biggest non-technical risk in the whole plan
   (`22-engagement-risk-protection.md §5` row 1).

### §7.3 — The single calendar entry the operator actually needs

If the operator only schedules one thing this week, it is **the
trademark knock-out search (O4a)**. Same-day, free, and the gate on
every downstream brand-locked decision (domains, GitHub org slug,
Run S1). The full registration filing (O4b) is the longest external
lead in the whole plan, but it does *not* gate Phase 0 — it gates the
public demo and the first contract.

Sequenced together: O4a this week → O5 + O6 once O4a returns clear →
O4b filed in the same sitting as O5/O6 if the operator wants to
parallelise → O4b registration completes invisibly during the next
6–12 weeks while every other line item progresses normally.

Everything else can be sequenced inside the POC plan and Phase 0 day
without external coordination.

## §8 — Advisory spinout sequencing decision

The operator asked, explicitly: *spin Lumivara People Advisory out
before or after the POC and migration?*

### §8.1 — Recommendation: **after.**

`00-automation-readiness-plan.md §1` already orders this correctly:
POC (Phase 1) → Run S1 rename (Phase 2) → platform repo (Phase 3) →
Client #1 spinout (Phase 4) → green-field Client #2 (Phase 5). This
plan affirms that ordering rather than re-deriving it. The rest of
this section explains why the tempting alternative — spinning the
advisory out earlier to "get it done" — is the wrong instinct.

### §8.2 — Why "after" is right

1. **The advisory site is the laboratory.** The whole POC streak
   counts auto-routine PRs landing on `palimkarakshay/lumivara-site`,
   which today *is* the advisory site. Spinning the site out
   mid-streak moves the laboratory and invalidates the green-streak
   audit trail. The operator paid 2 wall-clock weeks for that audit
   trail; throwing it away to re-run on the new repo is the most
   expensive form of "let's get this done early."
2. **Dual-Lane Repo is about git history hygiene.** The two-repo split
   (`<slug>-site` clean, `<slug>-pipeline` operator-only) is durable
   only if `<slug>-site/main` history starts clean. Spinning out
   before Run S1 means every operator-internal commit message and
   every `auto/issue-*` branch from the POC streak is preserved in the
   site repo's history forever. `lumivara-people-advisory-spinout.md
   §0` open question already settled this in favour of "fresh repo +
   selective copy" precisely to avoid that bleed; spinning out
   *before* the POC defeats the same protection from a different
   angle.
3. **DNS is the only hard-to-reverse step.** Phase 4 row 12 is the
   only operator action in the entire plan whose rollback is bounded
   by DNS propagation, not by `git reset`. Doing it before the
   autopilot is proven means accepting the risk of doing it twice.
   Risk-adjusted, "after" is strictly cheaper.
4. **Beas-the-client and Beas-the-spouse are the same person.** The
   "rollback if anything goes wrong" cost is socially asymmetric on
   this engagement in a way it won't be on Client #2. Putting the
   most-coupled-to-the-operator's-personal-life client through the
   first-ever spinout is high-stress; putting them through it after
   the green-field path (Phase 5) has been validated would be
   strictly safer — but the runbook can't fully anticipate green-field
   bugs without one real spinout first. So the advisory spinout
   stays at Phase 4, but the demo (§9) explicitly does **not** depend
   on the advisory; the demo runs on the dummy-vertical site (§6.3)
   so the advisory cutover can be calmly scheduled for a low-traffic
   weekend without demo-day pressure.

### §8.3 — The one safe pre-commitment

Operator task **O7 (§7.1)** — create the empty target repos — happens
on Phase 0 day, not Phase 4 day. It's not "spinning out early"; it's
slug-locking. One-line README, no code, no DNS, no Vercel project.
This protects the only thing that's actually irreversible-by-default
on a rename path: a slug taken by someone else between when the
operator picks it and when they need it.

### §8.4 — The "but I want to do it now" rebuttals

Pre-empting the operator's own future arguments:

- *"If I spin out now, the POC streak runs on the cleaner client repo
  and the audit trail is even better."* — No. The streak's whole
  point is that it counts on the **same** repo where the autopilot
  has been vibe-coded. Switching repos mid-stream means re-proving
  the autopilot on a never-tested repo + the original drift. Two
  problems instead of one.
- *"I can do the advisory rename in parallel with the POC streak."*
  — No. The streak resets on operator action mid-stream
  (§5.1 R3). A repo rename is the largest operator-action signal
  available.
- *"What if Beas wants the rename done sooner?"* — Reframe: the
  rename's *visible* effect (DNS pointing at a new project, repo
  showing new name) is invisible to her. The only thing she sees is
  the URL bar. The site she's editing today on phone-edit will keep
  working on `palimkarakshay/lumivara-site` until Phase 4 cutover; if
  asked, the honest answer is "the rename is bookkeeping, not a
  feature, and we're sequencing it where it can't break your site."
- *"Phase 4 is more than a month away."* — Yes, intentionally. A
  month is the calendar buffer that makes the rest of the plan robust.

### §8.5 — Single-line summary

> Spin out **after**: Phase 1 (POC) → Phase 2 (S1) → Phase 3
> (platform) → Phase 4 (advisory). Pre-commit only the slug
> reservation (O7) on Phase 0 day. Demo runs on the dummy vertical
> (§6.3), not on the advisory, so the advisory cutover happens on its
> own schedule without demo-day pressure.

## §9 — First-demo target audience and playbook

The operator wants the first-ever demo to be "almost finished, highly
polished, production-grade." That standard is reachable — but the
audience the demo is shown to determines whether the polish delivers
a useful signal or an empty compliment.

### §9.1 — The wrong audience for the first demo

Three temptations to disarm explicitly:

1. **Actual paying clients.** Too high stakes. A real client who
   churns or refers negatively over a "first demo" wobble is
   permanent reputational damage. Save them for after the second
   demo cycle.
2. **Beas (Lumivara People Advisory).** She is the operator's
   spouse-aligned guinea pig — closer to a co-builder than an
   audience. Her feedback is fused with the build and lacks the
   stranger's eye that surfaces blind spots.
3. **Cold prospects on Fiverr / Upwork.** They optimise for "is the
   price right" and "can I get it cheaper", not "is the product
   right." Cold-prospect feedback is useful at month 3, not at
   first-demo.

### §9.2 — The right audience, ranked

| Rank | Persona                                                                | Why they're the right first audience                                                                                                                                | What you ask them                                                                                                                                                          | Decks/cite                          |
|------|------------------------------------------------------------------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------------|-------------------------------------|
| #1   | **One named senior advisor / mentor** (founder, agency principal, or senior engineer with a small-business client portfolio) | Lowest churn cost, highest signal. They are *paid* — by reputation and reciprocity — to be brutal. They have no upside in flattering you. They have seen many failed pivots and will name yours quickly. | "Pretend I'm pitching this to the prospect on slide 11 of the deck. Where do you stop me?" Then shut up and listen. | `docs/decks/05-advisor-deck.md` (the deck written *for* this audience) |
| #2   | **One named potential partner / co-operator** — someone who could join the practice as a hands-on partner | Aligned-incentive honesty. They will tell you the truth because they are evaluating whether to bet their own time on it. They will probe the operations model harder than any advisor — because they would inherit it. | "Walk me through what you'd want to change before you'd say yes to running this with me." | `docs/decks/02-partner-deck.md` |
| #3   | **One friendly small-business owner outside the operator's family** — drawn from the target persona (solo professional, health practice, or boutique firm). Ideally someone the operator has met once but who has no social obligation to be polite. | The first stranger's-eye reaction. They reveal whether the catalog's positioning lands without an operator-lawyered explanation. | "Show me where you got confused. Show me what you'd ask if I weren't in the room." | `docs/decks/04-prospective-client-deck.md` (persona-tailored — pick the variant matching their business type) |
| #4   | **One peer freelancer / agency owner** in the same market segment | Architectural sanity check. They will spot the things a client wouldn't — `package.json` weirdness, deploy story holes, the bus-factor question. | "If you were taking over this practice tomorrow, what would terrify you?" | `docs/decks/03-employee-deck.md` (or partner deck — closest fit) |

The plan is **all four** in sequence, not all four at once. Spread
them over the two weeks following the demo-readiness gate (§6) going
green. Each one influences the next.

### §9.3 — The demo itself (10-minute script)

Three acts. Time-boxed. The 10-minute target is deliberate: longer
demos invite politeness instead of feedback.

#### Act 1 — Show the site (3 minutes)

Open the dummy-vertical demo site (the §6.3 site —
`demo.lumivara-forge.com` or the bare Vercel URL). Walk the prospect
through one page. Ask: *"Does this look like the site of the
business named at the top of the homepage, or like a generic
template?"* Listen. Their answer is the first piece of feedback
worth more than its weight in gold.

#### Act 2 — Tap-edit live (4 minutes)

Hand them the operator's phone with the shortcut already loaded.
Ask them to type a change — anything. *"Update the menu special on
Fridays to 'Halibut at $32.'"* Or *"Add a closing time on Sundays."*
Together, watch:

1. The shortcut sends.
2. The bot opens an issue (~30s).
3. (Cheat allowed for demo: pre-warm the cron so the next triage
   tick is within 60s, not 30 minutes.) Triage labels appear.
4. Execute opens a draft PR (~3–5 min).
5. Vercel preview goes green.
6. The operator (or, if comfortable, the prospect themself) taps
   publish in the admin portal.
7. The change is live.

> **The whole point of the practice** is the chain above. If any
> link breaks during the demo, the demo itself has surfaced the bug
> §6.1 was supposed to catch — and that's still useful, but it
> means §6 wasn't actually green. Take the criticism, don't pretend.

#### Act 3 — The catalog conversation (3 minutes)

Show the pricing-tier slide
(`04-prospective-client-deck.md` slide "What it costs vs. the
alternatives"). Ask: *"Where would you push back on these numbers?"*

The prospect's answer is the only price-elasticity data the operator
has access to before signing a contract. Treat it as gold.

### §9.4 — What feedback to capture and what to ignore

Every advisor / partner / prospect / peer will offer 10–30 pieces of
feedback in a one-hour conversation. The operator's job is to
classify them into three buckets, not to action all of them.

| Bucket               | Definition                                                                                                                                                                   | Disposition                                                                                                                                          |
|----------------------|------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|------------------------------------------------------------------------------------------------------------------------------------------------------|
| **Truth-teller**     | They can name a specific moment where they got confused, lost trust, or stopped paying attention. Includes "I don't believe that statistic" and "this part felt slow."       | File as a P1 issue against the relevant doc/feature. Action before the next demo.                                                                    |
| **Preference**       | They have a different aesthetic, tagline preference, or feature priority — but can't tie it to a specific business outcome.                                                  | File as a P3 issue. Revisit if the same preference shows up in 2+ demos.                                                                             |
| **Out-of-scope**     | They want a different product. ("Why don't you also offer logo design?", "What about Shopify integration?")                                                                  | File nowhere. Already covered in `01-gig-profile.md` Part 8 ("who to say no to"). Don't let demo politeness drift the catalog. |

After each demo, write the bucket disposition into the streak
tracking issue under a new "Demo log" section. Rerun the catalog
consistency check (§6.2) once any P1 doc changes have landed.

### §9.5 — The "when do I stop demo'ing and start selling" rule

Two demo cycles. Then start charging.

- **Cycle 1**: §9.2 audiences #1–#4, in order, over ~2 weeks. Outcome:
  the truth-teller bucket from each is filed and addressed.
- **Cycle 2**: re-run with #1 and #3 (advisor + small-business owner)
  to confirm the P1 fixes from cycle 1 actually landed. If both
  return "I'd buy this / I'd refer you", **stop**. Move to paid
  prospects.

The temptation to do a third cycle "just to polish more" is the same
instinct as deferring O4 — it feels productive and is actually
delay. Time spent on a third feedback cycle is time not spent
shipping to the first paying client (the one who triggers O13 + O14).

### §9.6 — One-line summary

> First demo audience: **one named advisor**, on a fully-green §6
> dummy-vertical site, with a 10-minute three-act script. Then three
> more audiences, then a second cycle, then start selling. Don't
> demo to family, paying clients, or cold prospects in cycle 1.

*Last updated: 2026-04-29.*
