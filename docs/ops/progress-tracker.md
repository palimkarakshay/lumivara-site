<!-- SHAREABLE. Safe to send to advisors / partners / Beas / future-employees. Operator-only secrets do NOT live here. -->

# Lumivara Forge — Progress Tracker

> **Purpose.** A single page that anyone (operator, advisor, partner, spouse, future hire) can scan in 60 seconds to know:
> 1. Are we on track for the first demo? (yes / amber / no)
> 2. What's blocking us this week?
> 3. What's the next concrete unblock?
>
> **Refresh cadence:** every Monday morning (the operator updates this same sitting they update [`operator-playbook.md`](./operator-playbook.md) §3). Gate-flip refreshes are immediate.
>
> **Last refreshed:** 2026-04-29 (D-0 of POC plan)
> **Demo target window:** early July 2026 (~ 9 weeks out)
> **Streak counter:** 0 / 10 (gate not yet started — D-1 task pending)

---

## §1 — The three gates (the only summary that matters)

| Gate | What it unlocks | Status | Last moved |
|---|---|---|---|
| **§1 — Migration-ready** | Phase 2 (Run S1 mechanical rename) and every later phase | 🟥 RED — streak counter at 0/10, tracking issue not yet filed | n/a |
| **§6 — Demo-ready** | First external prospect demo | 🟥 RED — none of the 4 sub-rows started | n/a |
| **§7 — Operator drop-deads** | The "you didn't get blocked by your own delay" gate | 🟧 AMBER — O4a (trademark knock-out search) due Fri 2026-05-01, not yet started | 2026-04-29 (today) |

**Reading rule:** all three gates are **independent**. The migration gate (§1) and the demo gate (§6) can flip in either order. The operator gate (§7) is a deadline sheet, not a blocker — but slipping past an L date pushes both other gates by exactly that many days.

Source: [`docs/migrations/01-poc-perfection-plan.md §0.1`](../migrations/01-poc-perfection-plan.md#01--what-this-file-gates-end-to-end).

---

## §2 — Phase progress (Phase 0 → Phase 6)

The high-level migration sequence from [`docs/migrations/00-automation-readiness-plan.md §1`](../migrations/00-automation-readiness-plan.md#1--sequence-at-a-glance). Each phase has a hard exit criterion — the next phase **does not start** until the previous one is green.

| Phase | What | Owner | Status | ETA |
|---|---|---|---|---|
| **Phase 0** | Operator account + identity bootstrap (org, GitHub App, vault, domains) | Operator | ⬜ Not started — gated on O4a trademark knock-out | D-13 → D-14 (2026-05-13 → 14) |
| **Phase 1** | Prove the autopilot in this repo (10/10 green streak) | Bot drives, operator reviews | 🟧 In flight — D-0 today, gate flips ~D-11 (2026-05-13) | 2026-05-13 |
| **Phase 2** | Run S1 — mechanical rename ({{BRAND}} → Lumivara Forge, mothership/ → platform/) | Bot (1 session) | ⬜ Blocked on Phase 1 exit | D-14 (2026-05-18) |
| **Phase 3** | Bootstrap the platform repo (P5.1 docs migrate, P5.2 workflows, P5.3 dashboard, P5.4 forge CLI) | Bot + operator (~1 week) | ⬜ Blocked on Phase 2 | ~2026-05-25 |
| **Phase 4** | Spin Client #1 out (Lumivara People Advisory) | Bot + operator (~3 days) | ⬜ Blocked on Phase 3 | ~2026-06-01 |
| **Phase 5** | Onboard Client #2 from a clean slate (`forge provision`) | Bot (~1 day) | ⬜ Blocked on Phase 4 | ~2026-06-08 |
| **Phase 6** | Hardening + handover (insurance, MSA, vault drills) | Bot + operator (ongoing) | ⬜ Blocked on Phase 5 | ~2026-07-01 |

**Read this as a Gantt:** today is the Phase 1 start. The first demo (early July) sits **just after Phase 5**. Every week of slip in Phase 1 is a week of slip in the demo.

---

## §3 — This week / last week / next week

### This week (D-0 → D-7, Wed 2026-04-29 → Tue 2026-05-05)

**Operator carries (4 sittings, ~6 hours total):**

- ☐ **D-0 Wed 04-29 — O4a trademark knock-out search.** PDF saved to `docs/legal/`. Verdict logged on issue. (~60 min)
- ☐ **D-1 Thu 04-30 — file streak tracking issue + walk every open issue + bulk-classify project items.** (~90 min)
- ☐ **D-2 Fri 05-01 — Vercel mirror sitting (env vars + webhook + repo secrets).** (~90 min)
- ☐ **D-3 AM Mon 05-04 — first-time backfill promote on `/admin/deployments`.** (~30 min + 30 min wait)

**Bot carries (autonomous; operator does nothing):**

- ☐ D-3 PM through D-8: file seven seed issues, work the streak rows 1–10 sequentially.

**Why this order:** O4a gates O5/O6/O7. The streak tracker (D-1) gates the counter. The Vercel mirror (D-2) gates the drift watcher. The backfill promote (D-3 AM) gates the streak's "no P1 issues" condition.

### Last week (D-7 → D-0)

n/a — this is the first week of the dated POC plan.

### Next week (D-7 → D-14, Wed 2026-05-06 → Tue 2026-05-12)

**Operator carries (1 sitting, ~30 min):**

- ☐ **D-11 Wed 05-13 — review the 10 streak PRs.** Sign off on each in the tracking issue, or reset the counter. (~30 min)

**Bot carries:**

- ☐ Streak rows 5–10 (auto-routine PRs landing through the cron paths).
- ☐ Capture G8 (`would_overwrite_newer` rejection) and G9 (drift→triage→execute auto-promote) evidence.
- ☐ Pattern C readiness pass (high-entropy grep, `.claudeignore` parity, `_artifact-allow-deny.md` audit).

**Gate flip target:** Phase 1 (§1) green by **Wed 2026-05-13**. Buffer day Thu 2026-05-14. Phase 2 (Run S1) starts **Mon 2026-05-18**.

---

## §4 — Demo readiness scorecard (the first prospect demo target)

The §6 demo-readiness gate from [`POC §6`](../migrations/01-poc-perfection-plan.md#6--catalog--demo-readiness-gate-above-the-migration-gate). Independent of the migration gate. Required before any external demo.

### §4.1 — Phone-edit pipeline end-to-end (4 rows)

| # | Condition | Status |
|---|---|---|
| 6.1 | Full SMS-to-published cycle (operator's phone → Twilio → n8n → GitHub issue → triage → execute → PR → preview → publish → prod) | ☐ |
| 6.2 | Same cycle via admin-portal magic-link (Resend) | ☐ |
| 6.3 | Same cycle via inbound email (`requests@lumivara.ca` IMAP) — one channel may be deferred | ☐ |
| 6.4 | "Bot got it wrong" rehearsal — operator rejects preview, bot proposes v2, operator approves v2 | ☐ |

### §4.2 — Catalog consistency (4 rows)

| # | Condition | Status |
|---|---|---|
| 6.5 | Brand-lock audit: every doc reads `Lumivara Forge` consistently (or `{{BRAND}}` consistently — no mixed state) | ☐ — Known offenders: issues #107, #110, #111, #112 still say "Infotech" |
| 6.6 | Pricing parity across `02-pricing-tiers.md`, `04-prospective-client-deck.md`, `06-product-strategy-deck.md`, `04-slide-deck.md` | ☐ |
| 6.7 | Source-bibliography health: every `[V]`-flagged claim has a live row in `03-source-bibliography.md` | ☐ |
| 6.8 | Service catalog ↔ feature delivery: every "Built" row in `01-business-plan.md §4` is provably live | ☐ |

### §4.3 — Demo site readiness (5 rows)

| # | Condition | Status |
|---|---|---|
| 6.9 | One dummy vertical picked (restaurant pack is the only ✅ template today) | ☐ |
| 6.10 | Picked vertical rendered into a deployed `*.vercel.app` preview, fronted by `demo.lumivara-forge.com` (or bare Vercel URL pre-Phase-0) | ☐ |
| 6.11 | Lighthouse 90+ on every page of the demo site (Performance, Accessibility, Best Practices, SEO) | ☐ |
| 6.12 | `axe-core` CI gate green on the demo site PR | ☐ |
| 6.13 | Demo site wired into the same autopilot loop (its own client slug or a temporary `client/demo` label) | ☐ |

### §4.4 — Public-demo legal & risk (3 rows; not gating for private advisor demos)

| # | Condition | Status |
|---|---|---|
| 6.14 | O4a knock-out clear **and** O4b filing submitted | ☐ |
| 6.15 | High-entropy grep clean on demo site repo | ☐ |
| 6.16 | "Honest objections" slide rehearsed once on a recording | ☐ |

**Demo gate flips:** when §4.1 + §4.2 + §4.3 are all green. §4.4 only required before strangers / public posting.

---

## §5 — First-demo audience plan (when the demo gate flips)

From [`POC §9.2`](../migrations/01-poc-perfection-plan.md#92--the-right-audience-ranked). All four in **sequence**, not at once. Spread over the two weeks following the demo-readiness gate going green.

| Rank | Persona | Deck | Time | Status |
|---|---|---|---|---|
| #1 | One named senior advisor / mentor | [`docs/decks/05-advisor-deck.md`](../decks/05-advisor-deck.md) | 30 min | ☐ Audience to be named |
| #2 | One named potential partner / co-operator | [`docs/decks/02-partner-deck.md`](../decks/02-partner-deck.md) | 45 min | ☐ Audience to be named |
| #3 | One friendly small-business owner outside the operator's family | [`docs/decks/04-prospective-client-deck.md`](../decks/04-prospective-client-deck.md) | 30 min | ☐ Audience to be named |
| #4 | One peer freelancer / agency owner | [`docs/decks/03-employee-deck.md`](../decks/03-employee-deck.md) | 45 min | ☐ Audience to be named |

**Operator preparatory work between now and demo gate flip:** name a real person for each row. A persona without a name is not a plan; it is a wish.

---

## §6 — Risks (top 5 — full register in `01-poc-perfection-plan.md §5.1`)

| # | Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|---|
| **R1** | Operator misses Vercel mirror row on D-2 → drift watcher silent → false-green gate | Medium | High | §4.4 of POC plan run on operator's machine, not from CI. Operator countersign on D-11. |
| **R2** | Streak row breaks at 9/10 because Codex-review opens a P1 the operator believes is a false positive | Medium | Medium | Streak resets, intentionally. Fix the prompt/rubric, not the plan. |
| **R3** | Natural-backlog issue picked for streak rows 5–10 needs design discussion mid-flight → bot opens `needs-clarification` PR → counts as operator intervention → row resets | Medium | Low | D-1 walk excludes `area/design`/`type/design-cosmetic` from eligible pool. |
| **R7** | Operator reviews 10 PRs on D-11 and finds one minor nit — wants to count the streak with disclaimer | High | Medium | §1.1 row 1.5 wording is deliberately strict. A nit is a change. Reset to 0/10 and rerun. |
| **NEW R8** | Operator skips O4a (today's hero task) because it doesn't feel urgent → discovers a brand conflict in July → demo and Phase 2 both re-do | Medium | High | Hero task framed in the playbook. Past-L escalation rule in §7.1 of playbook. |

---

## §7 — Cost of delay (the chart you don't want to look at)

If today's tasks slip:

| What slips | Demo target slips by | First contract slips by |
|---|---|---|
| O4a slips by 1 week | 1 week | 1 week |
| O4a slips by 4 weeks | 4 weeks | ~6 weeks (O4b registration is on critical path for §6.4) |
| Streak gate fails twice (28 days) | 4 weeks (then re-runs cleanly) | 4 weeks |
| Operator action mid-streak resets the counter | up to 14 days per reset | up to 14 days per reset |
| Beas requests a non-content advisory edit during the streak | 1+ resets | 1+ resets |

**Translation:** every operator action on the wrong day is **calendar weeks**, not hours. The playbook's §7 anti-procrastination rules are not aesthetic — they are arithmetic.

---

## §8 — How partners and advisors should use this page

If you're an **advisor** reading this:
- Open §1 and §4. If both are red, the operator is over-committed on plan and under-committed on execution. Push them on §1's hero task today.
- Open §5. If your name should be in row #1 and isn't, ask why.

If you're a **partner candidate** reading this:
- Open §2 (phase progress). The "Owner" column tells you which phases need a human; that's the practice's actual surface area.
- Open §6 (risks). The risks register tells you what would actually go wrong; the absence of a risk you'd expect to see is the most interesting signal.

If you're **Beas** reading this:
- Open §7 (cost of delay). The "Beas requests a non-content advisory edit during the streak" row is real and not personal. The advisory site is frozen for non-content edits until Phase 4 cutover; everything else flows through the existing autopilot exactly like today.
- The advisory cutover (Phase 4) is targeted for ~2026-06-01. Your URL bar will show no change.

---

## §9 — Where to drill in

| You want… | Open this |
|---|---|
| The day-by-day plan for the next 14 days | [`docs/migrations/01-poc-perfection-plan.md`](../migrations/01-poc-perfection-plan.md) |
| The phase map for the next 6 months | [`docs/migrations/00-automation-readiness-plan.md`](../migrations/00-automation-readiness-plan.md) |
| The operator's personal front-door | [`docs/ops/operator-playbook.md`](./operator-playbook.md) |
| The live kanban (mobile-friendly) | [Lumivara Backlog → Demo-Day Critical view](https://github.com/users/palimkarakshay/projects/1/views/6) |
| The pinned streak tracking issue | [GitHub: meta/automation-readiness label](https://github.com/palimkarakshay/lumivara-site/issues?q=is%3Aissue+label%3Ameta%2Fautomation-readiness) |
| The product catalog (what's being sold) | [`docs/freelance/01-gig-profile.md`](../freelance/01-gig-profile.md), [`docs/freelance/02-pricing-tiers.md`](../freelance/02-pricing-tiers.md) |
| The decks (per audience) | [`docs/decks/`](../decks/) |
| The brand and naming policy | [`docs/mothership/15-terminology-and-brand.md`](../mothership/15-terminology-and-brand.md) |
