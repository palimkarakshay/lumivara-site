<!-- OPERATOR-ONLY. Single source of truth for capacity & unit economics. Closes #136 / 13 §1 + §2. -->

# 18 — Capacity & Unit Economics (single source of truth)

This doc owns every number that influences operator cost, capacity, or scaling-cliff timing. Every other operator-pack doc that quotes one of those numbers (`04`, `09`, `storefront/03`, `13`, `10`, `20`) **references an anchor here** instead of restating the value. If you find yourself about to write a minute count, dollar figure, or upgrade-threshold elsewhere — stop, anchor it here, and link.

> **Scope split with [`20-launch-and-operating-cost-model.md`](./20-launch-and-operating-cost-model.md).** This doc (`18`) owns *capacity-coupled* numbers — AI costs, Action minutes, per-tier margin allocations, scaling cliffs. Doc `20` owns *practice-wide* costs that aren't capacity-coupled — legal, payment processing, accounting, insurance, marketing, operator tools — plus the launch budget and breakeven math. They reference each other; neither restates the other's numbers.

The split with `13`: that doc is the *critique narrative* (why the old numbers were wrong); this doc is the *current model* (what the numbers actually are). `13` is preserved as the audit trail.

---

## §1 — Assumptions table

Every assumption that downstream sections compute from. Each row has a value, a source, and the date it was last verified. If a row changes, log it in §7 and search for downstream uses.

| ID | Assumption | Current value | Source / link | Last verified |
|---|---|---|---|---|
| `gh_free_action_minutes` | GitHub Free org Actions minutes / month (Linux) | 2,000 min/mo | docs.github.com — Billing for GitHub Actions, Free plan | 2026-04-29 |
| `gh_team_action_minutes` | GitHub Team org Actions minutes / month (Linux), per seat | 3,000 min/mo | docs.github.com — Billing, Team plan | 2026-04-29 |
| `gh_team_seat_cost` | GitHub Team plan cost per seat | $4 USD / seat / mo | github.com/pricing | 2026-04-29 |
| `claude_pro_cost` | Claude Pro subscription | $20 USD / mo | anthropic.com — Pro plan | 2026-04-29 |
| `claude_max5x_cost` | Claude Max 5x subscription | $100 USD / mo | anthropic.com — Max plans | 2026-04-29 |
| `claude_max20x_cost` | Claude Max 20x subscription | $200 USD / mo | anthropic.com — Max plans | 2026-04-29 |
| `resend_free_emails` | Resend free tier outbound email | 3,000 emails / mo | resend.com/pricing | 2026-04-29 |
| `vercel_free_bandwidth` | Vercel free tier bandwidth | 100 GB / mo | vercel.com/pricing | 2026-04-29 |
| `vercel_free_invocations` | Vercel free tier serverless function invocations | 1,000,000 / mo | vercel.com/pricing | 2026-04-29 |
| `twilio_number_cost` | Twilio per-number monthly fee (Canada/US local) | $1.15 USD / mo | twilio.com/sms/pricing | 2026-04-29 |
| `twilio_sms_outbound` | Twilio outbound SMS (Canada/US local) | $0.0083 USD / msg (typical) | twilio.com/sms/pricing | 2026-04-29 |
| `railway_free_credit` | Railway free tier credit | $5 USD / mo | railway.app/pricing | 2026-04-29 |
| `railway_hobby_cost` | Railway Hobby plan | $5 USD / mo + usage | railway.app/pricing | 2026-04-29 |
| `betteruptime_free_monitors` | Better Uptime free monitors | 50 monitors | betterstack.com/uptime/pricing | 2026-04-29 |
| `gemini_free_pro_rpd` | Gemini Pro free-tier requests/day | 100 RPD | ai.google.dev/pricing | 2026-04-29 |
| `gemini_free_flash_rpd` | Gemini Flash free-tier requests/day | 500 RPD | ai.google.dev/pricing | 2026-04-29 |
| `codex_per_review_usd` | OpenAI / Codex (gpt-5-mini class) per-PR review cost (estimate) | $0.40 USD / review | `13 §2` table | 2026-04-29 |
| `tax_band_ontario_soleprop` | Ontario sole-prop effective tax band on $100–200k revenue | 25–30% (range, **consult an accountant**) | sole-prop self-assessment, see `storefront/03 §C` | 2026-04-29 |
| `fx_cad_per_usd` | FX assumption used everywhere CAD ↔ USD conversion appears | 1 USD = 1.39 CAD (CAD 1.00 = USD 0.72) | bank-of-canada.ca FX, ±5% pad | 2026-04-29 |
| `operator_hard_cap_clients` | Hard cap of active retainer clients before staffing required | 30 clients | `storefront/03 §F` | 2026-04-29 |

> All AI / SaaS costs are **USD**; all client revenue is **CAD**. The FX row is the only currency conversion authority; do not introduce a second exchange rate downstream.

---

## §2 — Per-tier Action-minute envelopes

`04 §1` defines per-tier *budgets* (operator-allocated ceilings). This section turns those into actual practice-level totals so the GitHub Actions minute math reconciles to `gh_free_action_minutes`.

### Per-client formula

```
typical_min_per_client_per_month =
    triage_runs_per_month  × triage_min_per_run
  + plan_runs_per_month    × plan_min_per_run
  + execute_runs_per_month × execute_min_per_run
```

Where `*_runs_per_month` come from the cron expressions in `04 §1` and `*_min_per_run` come from observed runtimes (triage ≈ 1 min, plan ≈ 2 min, execute ≈ 5–8 min).

### Per-tier envelope table

| Tier | Triage runs/mo | Plan runs/mo | Execute runs/mo | Typical min/mo/client | Worst-case min/mo/client (`04 §1` ceiling) |
|---|---|---|---|---|---|
| **T0 Launch** | 0 | 0 | 0 | 0 | 0 |
| **T1 Lite** | ~360 (every 2h) × 1 min = 360 | ~180 × 2 min = 360 | ~30 × 6 min = 180 | ~75 (after exit-early skip rate) | 100 |
| **T2 Pro** | ~1,440 (every 30 min) × 1 = 1,440 | ~360 × 2 = 720 | ~360 × 6 = 2,160 | ~180 (exit-early dominates) | 250 |
| **T3 Business** | ~2,880 (every 15 min) × 1 = 2,880 | ~720 × 2 = 1,440 | ~720 × 6 = 4,320 | ~420 | 600 |

> "Typical" assumes the cron's exit-early path (no eligible issues / no triage queue / per-client cap hit) fires on ~85–90% of runs. The "worst-case" column matches `04 §1`'s ceilings — the operator-allocated budget, not what any healthy client actually consumes.

### Practice-level totals (typical mix)

| Mix | Composition | Typical min/mo | % of `gh_free_action_minutes` |
|---|---|---|---|
| **Realistic month-1–6** | 1 T0 + 2 T1 + 0 T2 + 0 T3 | 0 + 150 + 0 + 0 = **150** | 7.5% |
| **Cliff 2 trigger** | 1 T0 + 2 T1 + 2 T2 | 0 + 150 + 360 = **510** | 25.5% |
| **Approaching saturation** | 5 T0 + 5 T1 + 5 T2 + 1 T3 | 0 + 375 + 900 + 420 = **1,695** | 84.7% — Free tier full |
| **`04 §1` worst-case sanity check** | 25 T2 (the historical claim in `09 §1`) | 25 × 250 = **6,250** | 312% — confirms the old `09` claim was 3× over |

### Anchor IDs (consumed by §8 / other docs)

- `#t0-action-min`, `#t1-action-min`, `#t2-action-min`, `#t3-action-min` — per-row pointers into the per-tier envelope table.
- `#practice-min-realistic`, `#practice-min-saturation` — the two practice-level scenarios that gate the Cliff 2 upgrade trigger.

---

## §3 — AI usage / cost envelopes

Reconciles `storefront/03 §A` rule-of-thumb ("every 5 clients adds about $40 USD") with `13 §2`'s breakdown. The §A rule was directionally correct but conflated three separate line items; this section names them.

### Cost formula

```
AI_cost_per_month(active_clients, pr_volume) =
    base_subscription( quota_tier(active_clients) )      # flat per month
  + claude_console_top_up( quota_tier, ai_usage )         # rare; 0 when in-window
  + gemini_paid_overage( client_count × monthly_runs )    # 0 below the free RPD floor
  + pr_volume × `codex_per_review_usd`                    # scales with PR count, not clients
```

`base_subscription` is the only line item that scales with active client count; `pr_volume` scales with how busy the practice's bot week is, not headcount. Console top-up is a stop-gap when a client signs mid-window and burns the operator's quota in one day.

### Three-scenario envelope per active-client band

Each row gives **low / base / high** monthly totals in USD. "Base" is what to put in the spreadsheet; "low" and "high" bracket the realistic noise.

| Active clients | Quota tier | Base subscription | Top-up (low / base / high) | Codex review (low / base / high) | **Total USD/mo (low / base / high)** |
|---|---|---|---|---|---|
| **1–5** | Pro (`claude_pro_cost`) | $20 | $0 / $0 / $5 | $0 / $0 / $5 | **$20 / $20 / $30** |
| **6–15** | Max 5x (`claude_max5x_cost`) | $100 | $0 / $5 / $20 | $5 / $10 / $15 | **$105 / $115 / $135** |
| **16–25** | Max 20x (`claude_max20x_cost`) | $200 | $0 / $10 / $40 | $10 / $15 / $25 | **$210 / $225 / $265** |
| **26+** | Max 20x + 2nd seat (`claude_max20x_cost` × 2) | $400 | $0 / $15 / $80 | $15 / $20 / $35 | **$415 / $435 / $515** |

**Use the "base" column** for projections (`storefront/03 §D` and the cost-of-goods table in §5). The "low" column is for best-case audits; the "high" column is the budget tripwire — if the actual month exceeds "high," investigate before next month closes.

### Anchor IDs

- `#ai-cost-band-pro`, `#ai-cost-band-max5x`, `#ai-cost-band-max20x`, `#ai-cost-band-2seat`
- `#ai-cost-formula` — the formula at the top of this section, for any doc that explains the model.

---

## §4 — Operator time envelope per tier

Hours per client per month, from `storefront/03 §A`'s honest estimates, with min / typical / max ranges added so capacity planning has something to do arithmetic with.

| Tier | Hours/mo/client (min / typical / max) | Includes |
|---|---|---|
| **T0 Launch** | 0.5 / 1.0 / 2.0 | Per-request hand-built changes only; no autopilot review. |
| **T1 Lite** | 1.0 / 1.5 / 2.5 | PR review + token / quota check. |
| **T2 Pro** | 2.0 / 2.5 / 3.5 | PR review + monthly improvement run + client comms. |
| **T3 Business** | 3.0 / 4.0 / 5.5 | T2 contents + twice-daily review + quarterly strategy call. |

### Operator capacity computation

At a representative 30-active-client mix `5 T0 + 10 T1 + 12 T2 + 3 T3`:

```
typical_hours_per_month =
    5 × 1.0  +  10 × 1.5  +  12 × 2.5  +  3 × 4.0
  = 5 + 15 + 30 + 12
  = 62 hours/month  (~14–16 hours/week)
```

That's the envelope behind the `operator_hard_cap_clients = 30` row in §1. Above 30 the capacity math forces a staffing decision (see §6 Cliff 5).

### Anchor IDs

- `#t0-operator-hours`, `#t1-operator-hours`, `#t2-operator-hours`, `#t3-operator-hours`
- `#operator-capacity-30`

---

## §5 — Margin model per tier

Reconciles `storefront/03 §A` summary cost-of-goods with §3 (AI cost) and §4 (operator time) so every cell in the table has a derivation, not a vibe. Setup-fee margins live in `storefront/03 §B` and don't change here.

| Tier | Monthly retainer (CAD) | Per-client AI cost (CAD, derived) | Per-client operator time | Marginal cost (cash, CAD) | **Cash margin (CAD)** | Time cost |
|---|---|---|---|---|---|---|
| **T1 Lite** | $99 | ~$2 (§3 base ÷ active-client count, allocated; see note) | 1.5 hrs | ~$2 | **$97** | "buys back 1.5 hrs of life" |
| **T2 Pro** | $249 | ~$5 | 2.5 hrs | ~$5 | **$244** | "buys back 2.5 hrs" |
| **T3 Business** | $599 | ~$10 | 4.0 hrs | ~$10 | **$589** | "buys back 4 hrs" |

> **AI-cost allocation note.** The §3 envelope is a *practice-level* total that depends on quota tier, not on tier-of-service. To allocate it onto a per-client retainer table the formula is `per_client_ai_cost = §3_base_total ÷ active_clients`. At 22 clients on Max 20x the base is $225 / 22 ≈ $10/client/mo — distributed roughly: T1 gets a smaller slice (less PR volume), T3 a larger one. The per-tier numbers above are the long-run allocation, not the month-1 spike when `Pro $20 / 2 clients = $10 each` overstates the steady-state.

### T0 Launch as an explicit loss-leader

`14 §1` flagged this. T0 prices a one-shot change at $90 CAD and the operator spends ~30 min of senior-engineer time per change. At a notional $200/hour internal rate, the cost is $100 — meaning T0 loses $10 cash per change. T0's job is portfolio + funnel for T1+, not direct profit. Documented here so the loss is *intentional* rather than discovered.

### Anchor IDs

- `#margin-t1`, `#margin-t2`, `#margin-t3`, `#margin-t0-loss-leader`

---

## §6 — Scale thresholds and trigger points

Five cliffs the operator hits as the practice grows. Each row: trigger metric, exact upgrade path, monthly cost delta, calendar action. Promotes `13 §3` from a critique into operational policy.

| # | Cliff | Trigger metric | Upgrade path | Monthly cost delta (USD) | Calendar action |
|---|---|---|---|---|---|
| **1** | Claude Pro → Max 5x | `ccusage` shows >80% utilisation in 5-hour windows OR triage queue hits 429s | Run `claude setup-token` after upgrading plan; rotate `CLAUDE_CODE_OAUTH_TOKEN` org secret. | +$80 (`claude_pro_cost` → `claude_max5x_cost`) | Plan upgrade between client #5 signing and #6 onboarding, never *during* client #6's first run. |
| **2** | GitHub Actions Free → Team (per seat) | Org's billing page shows >80% of `gh_free_action_minutes` used by mid-month (≈ 1,500 min) | Org → Settings → Billing → upgrade to Team. Free-tier "Selected repositories" secret-scoping carries over. | +$4/seat (`gh_team_seat_cost`) | Calendar event the moment org passes 1,500 min for the first time; book one seat first. |
| **3** | n8n on Railway free → Hobby | Railway $5 credit (`railway_free_credit`) exhausts mid-month OR SMS traffic crosses ~10 inbound/day | Move n8n + Postgres to Railway Hobby (`railway_hobby_cost`). Add Better Uptime check on `https://n8n.{{BRAND_SLUG}}.com/healthz` (free, `betteruptime_free_monitors`). | +$5 (Hobby) + ~$0 (Better Uptime free) | Move by client #2 with SMS enabled; do NOT wait for the credit to drain. |
| **4** | Claude Max 5x → Max 20x | Cross ~16 active clients OR `ccusage` again at >80% on Max 5x | Re-run `claude setup-token`; rotate org secret; same propagation as Cliff 1. | +$100 (`claude_max5x_cost` → `claude_max20x_cost`) | Trigger sits between client #15 and #16; the same "never mid-run" rule applies. |
| **5** | Single seat → 2nd Anthropic seat (staffing cliff) | Cross ~26 active clients OR operator monthly time exceeds `#operator-capacity-30` | Add a second human operator with their own Anthropic Max 20x seat; provision a second `CLAUDE_CODE_OAUTH_TOKEN_<NAME>` org secret. | +$200 (a second `claude_max20x_cost`) plus salary. | This is a hiring decision, not a billing one — start the search at client #20, not #26. |

### Anchor IDs

- `#cliff-1-claude-pro-to-max5x`, `#cliff-2-github-free-to-team`, `#cliff-3-railway-free-to-hobby`, `#cliff-4-claude-max5x-to-max20x`, `#cliff-5-second-seat`
- `#cliffs-table` — the whole table for docs that link to all five at once.

---

## §7 — Assumption Change Log

Append-only table. Add a row whenever any assumption in §1 changes, when a `04 §1` cron interval changes, when a new pricing tier is introduced, or when this section's downstream numbers shift by more than 5%. Format is locked: do not add new columns.

| Date | Changed variable | Old value | New value | Reason | Downstream impact |
|---|---|---|---|---|---|
| 2026-04-29 | (seeded) `storefront/03 §D` 12-month projection AI-cost column | $140 (M4–M7), $280 (M8–M12) | §3-formula derived: $115 (M4–M7), $225 (M8–M11), $225 (M12) | Reconciliation per #136. Old rule-of-thumb under-counted Codex review and over-counted top-up; corrected via §3. | Year-1 net moves by ~$1,500 CAD per `13 §2`. `storefront/03 §D` table updated; PR body documents the delta. |
| 2026-04-29 | (seeded) `09 §1` "≈ 25 active T2 clients fit in 2,000 Action minutes" claim | 25 T2 clients @ 250 min = 6,250 min (3× over Free) | `09 §1` references `#practice-min-saturation` (≈ 1.7k min for a realistic mix; Cliff 2 trips around client #4 on T2-heavy mix) | Reconciliation per #136. Old claim mis-applied the per-client ceiling as if it were the typical run cost. | `09 §1` and `09 §5` upgrade-trigger table replaced with anchor refs into §6 Cliff 2. |
| 2026-04-29 | (seeded) Dual-Lane Repo per-client repo count | 1 site repo (Pattern A) | 2 repos: `<slug>-site` + `<slug>-pipeline` (`02b §1`) | Dual-Lane Repo locked 2026-04-28 per `11 §1`. Pipeline repo runs the cron, not the site repo. | §2 envelopes are stated *per-engagement* (i.e. counting both repos as one client); not double-counted. Open assumption: if Dual-Lane Repo ever splits cron across both repos, §2 numbers must double. |

> **Open assumption (not a change yet).** Sole-prop tax-band figures are a *range* (`tax_band_ontario_soleprop = 25–30%`). Do not collapse to a single number anywhere downstream; `storefront/03 §C` already says "consult an accountant" and that wording is binding.

---

## §8 — How other docs reference this one

The "single source of truth" rule is mechanical: every numeric reference in `04`, `09`, `storefront/03`, `10`, and `13` points to a named anchor in this doc. The table below is the contract — if you add a new cross-reference, add a row here.

| Consumer doc | Section | Anchor in this doc |
|---|---|---|
| `04 §1` row "Action minutes budget / month" (per-tier) | T0 / T1 / T2 / T3 cells | [#t0-action-min](#2--per-tier-action-minute-envelopes) / [#t1-action-min](#2--per-tier-action-minute-envelopes) / [#t2-action-min](#2--per-tier-action-minute-envelopes) / [#t3-action-min](#2--per-tier-action-minute-envelopes) |
| `04 §1` row "Claude turn budget / day" | All cells | [#ai-cost-formula](#3--ai-usage--cost-envelopes) |
| `04 §5` plan-cost references (Pro / Max 5x / Max 20x) | All bullets | [§1 assumption rows `claude_*_cost`](#1--assumptions-table) |
| `09 §1` "2,000 Actions minutes/month" | Inline number | [§1 row `gh_free_action_minutes`](#1--assumptions-table) |
| `09 §1` "≈ 25 active T2 clients fit" claim | Inline statement | [#practice-min-saturation](#2--per-tier-action-minute-envelopes) (corrected: ~1.7k min, not 6.25k) |
| `09 §5` upgrade trigger table | Whole table | [#cliffs-table](#6--scale-thresholds-and-trigger-points) |
| `storefront/03 §A` "every 5 clients adds about $40" rule-of-thumb | Replaced by | [#ai-cost-formula](#3--ai-usage--cost-envelopes) |
| `storefront/03 §A` "200 min/mo per client" GitHub footnote | Replaced by | [#t2-action-min](#2--per-tier-action-minute-envelopes) (per-client) and [#practice-min-realistic](#2--per-tier-action-minute-envelopes) (practice-level) |
| `storefront/03 §A` summary cost-of-goods table | Whole table | [§5 margin model per tier](#5--margin-model-per-tier) |
| `storefront/03 §D` 12-month projection AI-cost column | All AI-cost cells | [#ai-cost-band-pro](#3--ai-usage--cost-envelopes) / [#ai-cost-band-max5x](#3--ai-usage--cost-envelopes) / [#ai-cost-band-max20x](#3--ai-usage--cost-envelopes) |
| `storefront/03 §E` upgrade trigger table | Whole table | [#cliffs-table](#6--scale-thresholds-and-trigger-points) |
| `10 §2` row 5 "Fix lives in" | Cell | [#practice-min-saturation](#2--per-tier-action-minute-envelopes) |
| `10 §2` row 6 "Fix lives in" | Cell | [#ai-cost-band-max5x](#3--ai-usage--cost-envelopes) and [#ai-cost-band-max20x](#3--ai-usage--cost-envelopes) |
| `13 §1`/`§2`/`§3`/`§8` | Status callouts | This whole doc; `13` remains the *critique narrative*, this doc is the *current model*. |

---

## §9 — How to update this doc

1. **Change the assumption first.** Edit the row in §1 with the new value, source, and `last verified` date.
2. **Add a §7 row** capturing old → new, the reason, and which downstream sections move.
3. **Recompute the affected sections** (§2 / §3 / §5 / §6).
4. **Search consumers.** `git grep -nE '<old number>' docs/` and update any place that hard-coded the old value to use an anchor reference instead.
5. **PR title format:** `docs(econ): update <variable> — <reason>`. Reviewer checks the §7 entry exists.

If you find yourself wanting to deviate from these numbers in another doc "just for this paragraph" — don't. Add a row in §7 explaining the situation and update §1, or add an explicit override section here. The whole point of `18` is that there is one number per concept, everywhere.

---

## §10 — Out of scope (deferred follow-ups)

Tracked here so the next operator session knows what `18` does *not* yet contain.

- **Verification script.** Issue #136 asks for "a small verification script (docs check) that compares key numbers referenced in 04/09/freelance/03 against doc 17 anchors and fails if inconsistent." `scripts/*` is in the [planning hard-exclusion list](../../scripts/execute-prompt.md). The doc-side reconciliation in this PR removes the duplications so the verification script's job becomes "no numeric token appears in `04`/`09`/`storefront/03` that is not also defined in §1 of this doc." That's a one-pass `git grep` enforcement; open it as a separate `infra-allowed` issue.
- **Dual-Lane Repo double-counting.** Dual-Lane Repo (`11 §1`, locked 2026-04-28) doubles the per-engagement repo count, which would arguably double the per-client Action-minute consumption *if* the cron ever runs on both repos simultaneously. Today the cron runs only on `<slug>-pipeline`, so §2 numbers stand. Re-audit when Dual-Lane Repo propagates to a second cron lane.
- **Currency drift.** All §3 figures are quoted in USD; CAD conversions only appear in §5 (margin) and `storefront/03 §D`. Do not let CAD rounding drift between docs — there's exactly one FX assumption row in §1.
- **Tax / accountancy.** §1's `tax_band_ontario_soleprop` is a *range*, deliberately. Do not compute net-after-tax to a single number anywhere — `storefront/03 §C` already binds this with "consult an accountant."

*Last updated: 2026-04-29.*
