<!-- OPERATOR-ONLY. Pair with 04-tier-based-agent-cadence.md and freelance/03-cost-analysis.md. -->

# 13 — Critique: AI Capability, Quota Maths & Scaling Cliffs

The pack assumes the AI lane scales linearly with clients. It doesn't — there are three step-changes (Claude quota, GitHub Actions minutes, n8n on Railway) that require explicit upgrades. The maths in the existing docs don't reconcile. This doc fixes the numbers and names the cliffs.

---

## §1 — 🟠 GitHub Actions minutes maths is wrong

> **Status (2026-04-29): closed.** Reconciliation now lives in [`18 §2`](18-capacity-and-unit-economics.md#2--per-tier-action-minute-envelopes) (per-tier envelopes + practice-level totals) with the `gh_free_action_minutes` constant in [`18 §1`](18-capacity-and-unit-economics.md#1--assumptions-table). The critique below is preserved as the audit trail.

### What the docs claim

| Source | Claim |
|---|---|
| `storefront/03 §A` | "GitHub free tier gives 2,000 Action minutes/month — well over what a small site needs (~200 minutes/month with hourly triage and 6×daily execute crons)" |
| `09 §1` | "2,000 Actions minutes/month per org (free Linux runners)" — and "you only need to upgrade if/when you cross ~2,000 Actions minutes/month (≈ 25 active T2 clients with current cron)" |
| `04 §1` | "Action minutes budget / month: T1 = 100, T2 = 250, T3 = 600" |

### Reality

`04`'s budgets are the operator-allocated ceilings, not the typical run cost. But on those ceilings:

- 25 active T2 clients × 250 = **6,250 minutes/month** — 3.1× the free-tier budget.
- A more realistic mix (5 T0 + 10 T1 + 10 T2) = (0 + 1,000 + 2,500) = **3,500 minutes/month** — 1.75×.
- Even a minimal mix (3 T1 + 3 T2) = (300 + 750) = **1,050 minutes/month** — half.

### Fix

Three things to update:

1. **Reconcile the maths.** Update `09 §1` to say "Free tier covers ~5 active T2 clients or ~10 T1 clients; you'll outgrow it by client #6 on T2 mix. Plan for Team plan ($4/seat × 1 seat ≈ $4/mo) by month 4."
2. **Update `storefront/03 §A`'s 200-min claim** — that's roughly accurate for a *single* T2 client at low triage cadence, not for the practice. Footnote it as "per client" and add the practice-level total.
3. **Add a workflow-runtime budget enforcer.** `mothership-smoke.yml` should query the org's billing API every Friday and post a comment on the mothership if usage projects to exceed 80% of the plan budget.

The cost-firewall principle still holds — Action minutes are operator-paid — but the planning needs honest numbers.

---

## §2 — 🟠 AI cost numbers don't reconcile

> **Status (2026-04-29): closed.** The cost formula and three-scenario envelope live in [`18 §3`](18-capacity-and-unit-economics.md#3--ai-usage--cost-envelopes); the table below is the source the new envelope was derived from. `storefront/03 §D` 12-month projection has been recomputed against `18 §3`'s base column (year-1 net moves ~$1,500 CAD; documented in [`18 §7`](18-capacity-and-unit-economics.md#7--assumption-change-log)).

### What the docs claim

| Source | Claim |
|---|---|
| `storefront/03 §A` | "Every 5 clients adds about $40 USD/month of AI cost when you're on Max" |
| `storefront/03 §D` (table) | Month 4: 10 clients, AI cost $140 USD. Month 8: 22 clients, AI cost $280. Month 12: 32 clients, AI cost $280. |
| `storefront/03 §A` (plans) | Pro $20, Max 5x $100, Max 20x $200 |

### Reality

- $140 at 10 clients = Max 5x ($100) + something. The "something" is unspecified — Gemini paid? OpenAI? But §A says these are free / negligible.
- $280 at 22 clients ≠ Max 20x at $200. Off by $80. Where does it come from?
- $280 also at 32 clients (a 50% increase in clients with no cost change) — implausible.

### Fix

The right model is:

```
AI_cost(month, clients) = base_subscription(quota_tier(clients))
                        + gemini_paid_overage(if any)
                        + openai_codex_review_hours × $0.40
                        + claude_console_top_up_credits (operator-only)
```

Concretely:

| Active clients | Quota tier | Base $/mo | Top-up $/mo | Codex review $/mo | Total $/mo |
|---|---|---|---|---|---|
| 1–5 | Pro | 20 | 0 | 0–5 | 20–25 |
| 6–15 | Max 5x | 100 | 0–20 | 5–10 | 105–130 |
| 16–25 | Max 20x | 200 | 0–40 | 10–20 | 210–260 |
| 26+ | Max 20x + 2nd seat | 400 | 0–80 | 15–30 | 415–510 |

Codex is the only USD-per-call line item; it scales with PR volume not client count. Gemini paid is rare; document the trigger.

Update `storefront/03 §D` with these numbers; the year-1 net changes by ~$1,500 CAD. Not a viability change, but the published number must match the model.

---

## §3 — 🔴 Three scaling cliffs the pack does not name

> **Status (2026-04-29): closed.** The cliffs are now formalised in [`18 §6`](18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points) as an operational triggers/actions table — five rows (Cliffs 1–5: Pro→Max5x, GH Free→Team, Railway free→Hobby, Max5x→Max20x, single seat → 2nd seat). The narrative below remains the rationale.

The pack treats scaling as continuous. It is not — three step-changes are non-trivial transitions:

### Cliff 1: Claude Pro → Max 5x (around client #6)

- Trigger: triage queue starts hitting 429s, or `ccusage` shows >80% utilisation in the 5-hour windows.
- Friction: the OAuth token from `claude setup-token` doesn't auto-upgrade — you re-run it after upgrading the plan, and it must propagate to every org-level secret (one update, propagates everywhere — the org-secret design pays off here).
- Surprise: the upgrade cycle (downgrade-then-upgrade trick if mid-cycle) can cause 24–48 h of degraded quota.
- **Fix:** plan the upgrade between client #5 signing and #6 onboarding — never *during* client #6's first run.

### Cliff 2: GitHub Actions Free → Team (around client #4 on the realistic mix)

- Trigger: org's billing page shows >80% of 2,000 minutes used by mid-month.
- Friction: switching to Team is a credit-card prompt; the Free tier's "Selected repositories" secret-scoping carries over.
- Surprise: Team plan resets the per-account discount (you go from "I'm on Free, the org is on Free" to "the org is on Team at $4/mo"). Tax-deductible business expense.
- **Fix:** book the upgrade as a calendar event the moment the org passes 1,500 minutes for the first time.

### Cliff 3: n8n on Railway free → paid (around client #3 with SMS)

- Trigger: Railway $5 credit/mo is exhausted by the n8n + Postgres pair around the time SMS traffic crosses ~10 inbound/day.
- Friction: Railway free tier may sleep idle services after 30 days (per `N8N_SETUP.md`); the inbound SMS Twilio webhook then 502s and the message is **dropped**, not queued.
- Surprise: there's no monitoring on the n8n instance itself; you find out by the client noticing.
- **Fix:** move n8n to Railway Hobby at $5/mo by client #2. Add an external health-check (Better Uptime free tier; 50 monitors; alerts via SMS to operator). Set the alert threshold at 2 consecutive failed pings.

### Recommendation

Add a new section `02 §8` or `04 §9` titled **"Scaling cliffs and pre-emptive upgrades"** with the three transitions and the calendar triggers above. The current pack's optimism about free tiers is not malicious — it's just untested at >2 active engagements. Document the cliffs before you hit them.

---

## §4 — 🟠 n8n is single-point-of-failure for every intake channel

`02 §1` shows one n8n instance receiving every client's web/email/SMS. If n8n is down:

- Web form: Server Action errors → client sees "couldn't send right now" → admin-portal UX is suddenly broken.
- Email: IMAP poll node fails silently → emails sit in the operator's inbox unprocessed.
- SMS: Twilio webhook 502s → Twilio retries 3× then drops. **Message lost, no record.**

The mitigation in `ADMIN_PORTAL_PLAN.md §6` ("queue locally in localStorage") only covers the web channel.

### Fix

1. **Twilio retry persistence** — configure Twilio's webhook to use Twilio Functions as a queue: if n8n returns non-2xx, store the inbound message in Twilio's serverless KV with a 24-h TTL. n8n's recovery workflow drains the queue on next health-check.
2. **Email durability** — IMAP polling is fine because the email stays in the inbox until processed. But add a `processed/` IMAP folder so the operator can spot stuck mail.
3. **n8n redundancy at scale** — at >10 active clients, run a second n8n instance on a different region (Railway in `us-east` + a tiny one on Fly.io free tier) with shared Postgres. Cost: ~$10/mo extra. Trigger: when daily intake volume exceeds 50 messages.
4. **Pre-emptive: external health-check.** Better Uptime monitors `https://n8n.{{BRAND_SLUG}}.com/healthz` every 60s. Alerts to operator's SMS via the existing Twilio number.

The first three fixes are gradual; the fourth is one-time, free, do it before client #2.

---

## §5 — 🟡 The model-routing rubric has stale assumptions

`AI_ROUTING.md` and the tier matrix in `04 §4` make several assumptions worth re-checking:

1. **"Haiku for typo / link / copy edits"** — Haiku 4.5 is good but its tool-use is weaker than Sonnet's. For multi-file edits even of trivial content, Sonnet is more reliable. Recommend: Haiku for triage and classification only; Sonnet for any edit that touches >1 file.
2. **"Opus for architecture only"** — Opus 4.7 is ~5× the cost of Sonnet 4.6 per token. Reserve for genuine planning work. The pack already does this correctly (`04 §4` table).
3. **"Gemini Pro 1M ctx for full-codebase audits"** — Gemini's free tier is 100 RPD for Pro, 500 for Flash. A monthly improvement run on a single T2 client can burn 5-10 RPD on Pro. At 25 clients × 1 monthly run = 250+ RPD = exceeds free tier. Plan for paid Gemini at $0.10-$0.15 per call, ~$5-10/mo. Reflect in `13 §2` table.
4. **OpenAI Codex (`gpt-4o-mini`) for code review** — `gpt-5-mini` or `o4-mini` may be a better second-opinion model by review time. Keep the routing layer's `model: gpt-4o-mini` as a string variable (already does), and revisit every 60 days per the doc.

None of these are wrong, but the pack should explicitly call out the 60-day model-rubric review (already mentioned in `AI_ROUTING.md` "Review cadence" — propagate to `04`).

---

## §6 — 🟡 The "5-hour rolling quota" framing is approximately wrong

`AGENTS.md` says: "Day-to-day work on this repo is automated via Claude in GitHub Actions, billed against a single Pro subscription's shared 5-hour rolling quota."

Anthropic's actual model on Pro/Max is **5-hour usage windows** that reset on a schedule tied to first-use within each window, not a rolling quota. The practical difference: a burst at hour 0 of a window doesn't smooth back over the next 5 hours — it just exhausts the window.

### Fix

- Re-word `AGENTS.md` to: "billed against a single Pro/Max subscription's 5-hour usage windows; the 50%/80% gates protect against window-burns mid-budget."
- Update `04 §5` "Quota allocation across the practice" to budget per-window, not per-rolling-hour.
- The dashboard's "Quota usage" panel (deferred to P5.4) should chart usage per window, with the window boundary marked, not as a flat percentage.

This is precision, not correctness — the existing system *does* protect quota; the wording just doesn't match Anthropic's mental model.

---

## §7 — 🟡 Sustainability: the "until burnout" risk is real

`storefront/03 §F` lists burnout as risk #5 with mitigation "hard cap clients at 30 until you've hired help." That's a good cap but the mitigation is reactive.

Two pre-emptive measures the pack does not mention:

1. **One-week-off rehearsal.** Before crossing 15 clients, take a real one-week vacation with no laptop. The autopilot should run, the dashboard should be quiet, no client should notice. If something breaks, that's a one-week-recovery point — much cheaper than discovering it during a real holiday at client #25.
2. **Documented operator-replacement protocol.** If the operator is hit by a bus / hospitalised / family emergency, the contract & vault break-glass should let a successor (lawyer + trusted second party from `08 §4`) run a graceful exit on every client. Today this exists as bullet points in `08 §4`; productise it as `docs/operator/SUCCESSOR_PROTOCOL.md` with explicit "do this, then this" steps.

Both are sustainability moves disguised as risk-management. Skip them and the business has a single-human SPOF on top of everything else.

---

## §8 — Summary action list for Run C

> **Status (2026-04-29): closed for the maths-reconciliation items (§1, §2, §3).** Items (1)–(2) are closed via [`18`](18-capacity-and-unit-economics.md). The remaining items in the checklist (Twilio retry queue, AI_ROUTING.md updates, AGENTS.md wording, SUCCESSOR_PROTOCOL.md) are independent and remain open.

Single Claude Code session that closes the maths and quota inconsistencies:

```
[ ] Reconcile Action-minutes maths in 04 + 09 + freelance/03.
[ ] Reconcile AI cost maths in freelance/03 §D.
[ ] Add 02 §8 "Scaling cliffs and pre-emptive upgrades" with the
    three transitions from §3.
[ ] Add Twilio retry-queue + Better Uptime health-check (§4).
[ ] Update AI_ROUTING.md and 04 with the model rubric notes from §5.
[ ] Re-word AGENTS.md "rolling 5-hour quota" → "5-hour usage windows".
[ ] Draft docs/operator/SUCCESSOR_PROTOCOL.md (one page).
```

Estimated turns: 60–80 in one Sonnet 4.6 session (no architecture decisions; mostly maths + edits). Prompt body lives in `16 §3`.

*Last updated: 2026-04-28.*
