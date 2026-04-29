# 03 — Cost Analysis & Quit-the-Day-Job Plan

Two questions this doc answers:

1. What does it actually cost you (operator) to run a client site for a month?
2. How many clients do you need to safely leave the day job?

All figures in CAD. USD where the underlying service is billed in USD (Claude, Gemini, OpenAI, Vercel, etc.).

> **All numeric assumptions in this doc — Action minutes, AI subscription costs, upgrade triggers — are owned by [`docs/mothership/18-capacity-and-unit-economics.md`](../mothership/18-capacity-and-unit-economics.md)** (single source of truth for capacity / cost / cliffs). The tables here cite anchors in `18`; updates flow `18 §1` → `18 §7` (change log) → out to here. If a number in this doc disagrees with `18`, `18` wins.

---

## Part A — Cost of running ONE client per month

Three categories: **AI services**, **infrastructure**, **your time**.

### AI services (the expensive bit, but flat-fee)

The brain of the autopilot system is Claude, with Gemini as fallback and OpenAI for code review. The key trick: **Claude bills by the OAuth token, not per call**, when you use a Pro/Max subscription as the bot's auth. So the cost doesn't scale linearly with clients — it scales with quota usage.

Plan-cost numbers (Pro / Max 5x / Max 20x), Gemini and OpenAI usage envelopes, and the cliffs that move you between plans all live in [`mothership/18 §1` (assumption rows `claude_pro_cost`, `claude_max5x_cost`, `claude_max20x_cost`)](../mothership/18-capacity-and-unit-economics.md#1--assumptions-table) and [`18 §3` (low/base/high cost envelopes per active-client band)](../mothership/18-capacity-and-unit-economics.md#3--ai-usage--cost-envelopes).

The previous draft of this section carried a "every 5 clients adds about $40 USD/month" rule-of-thumb. That rule conflated three separate line items (base subscription, Claude console top-up, Codex review) and under-counted the seat-doubling at client #26. The replacement is the explicit formula in [`18 §3` `#ai-cost-formula`](../mothership/18-capacity-and-unit-economics.md#3--ai-usage--cost-envelopes); use it for projections instead of the old rule.

### Infrastructure (per client, mostly free)

Each client site lives under **the client's own** GitHub + Vercel account. They pay $0 because:

- **Vercel free tier** handles small-business traffic comfortably. Limits in [`mothership/18 §1`](../mothership/18-capacity-and-unit-economics.md#1--assumptions-table) rows `vercel_free_bandwidth` / `vercel_free_invocations`.
- **GitHub free tier** gives the org-level Action-minute budget in [`18 §1` `gh_free_action_minutes`](../mothership/18-capacity-and-unit-economics.md#1--assumptions-table). The per-client typical run cost (~T2 typical) is in [`18 §2 #t2-action-min`](../mothership/18-capacity-and-unit-economics.md#2--per-tier-action-minute-envelopes); the practice-level total (where Cliff 2 trips) is in [`18 §2 #practice-min-realistic` / `#practice-min-saturation`](../mothership/18-capacity-and-unit-economics.md#2--per-tier-action-minute-envelopes).
- **Domain registrar:** the client pays directly, ~CAD $20/year.
- **Email (Resend free tier):** [`18 §1 resend_free_emails`](../mothership/18-capacity-and-unit-economics.md#1--assumptions-table) covers a contact form by an order of magnitude.
- **Cloudflare DNS / proxy:** free tier.

**What you pay per client/month for infra: $0.** That's the leverage.

If a client outgrows the free tier (high-traffic blog or growing SaaS), Vercel Pro at $20 USD/month is on them, not you.

### Your time per client per month

Honest estimates:

| Activity | Time/month/client |
|---|---|
| Reviewing the bot's PRs before merge | 30–60 min |
| Monitoring quota / rotating tokens | 10–15 min |
| The "monthly improvement run" (Tier 2/3) | 60–90 min |
| Client communication / questions | 15–30 min |
| Quarterly strategy call (Tier 3) | 60 min ÷ 3 = 20 min/mo |
| **Total per client per month** | **~2–3 hours** |

So 20 clients ≈ 40–60 hours/month of operator time = a comfortable part-time-to-full-time load.

### Summary: cost-of-goods per client/month

The full margin model — per-tier AI-cost allocation, operator hours, marginal cost, cash margin, and the T0-loss-leader note — lives in [`mothership/18 §5`](../mothership/18-capacity-and-unit-economics.md#5--margin-model-per-tier). Headline numbers:

| Tier | Per-client AI cost (CAD, derived from `18 §3`) | Per-client operator time (`18 §4`) | **Cash margin (CAD/mo)** |
|---|---|---|---|
| Tier 1 (Lite) | see [`18 §5 #margin-t1`](../mothership/18-capacity-and-unit-economics.md#5--margin-model-per-tier) | see [`18 §4 #t1-operator-hours`](../mothership/18-capacity-and-unit-economics.md#4--operator-time-envelope-per-tier) | $97 + buys back 1.5 hrs of life |
| Tier 2 (Pro) | see [`18 §5 #margin-t2`](../mothership/18-capacity-and-unit-economics.md#5--margin-model-per-tier) | see [`18 §4 #t2-operator-hours`](../mothership/18-capacity-and-unit-economics.md#4--operator-time-envelope-per-tier) | $244 + buys back 2.5 hrs |
| Tier 3 (Business) | see [`18 §5 #margin-t3`](../mothership/18-capacity-and-unit-economics.md#5--margin-model-per-tier) | see [`18 §4 #t3-operator-hours`](../mothership/18-capacity-and-unit-economics.md#4--operator-time-envelope-per-tier) | $589 + buys back 4 hrs |

The marginal cost of each new client is dominated by your time, not infrastructure. That's exactly the shape you want a service business to have. Tier 0 is an explicit loss-leader (~$10 cash loss per change at notional $200/h internal rate); see [`18 §5 #margin-t0-loss-leader`](../mothership/18-capacity-and-unit-economics.md#5--margin-model-per-tier).

---

## Part B — Setup-fee maths (the lumpy revenue)

Setup fees are upfront, one-time, and offset the cost of building the site (which the bot can't do entirely on its own — design, intake, QA, launch all need you).

| Tier | Setup fee | Time to build | Effective hourly |
|---|---|---|---|
| Tier 0 (Launch) | CAD $1,200 | 8–12 hrs | $100–$150/hr |
| Tier 1 (Lite) | CAD $2,400 | 14–18 hrs | $135–$170/hr |
| Tier 2 (Pro) | CAD $4,500 | 22–28 hrs | $160–$200/hr |
| Tier 3 (Business) | CAD $7,500 | 35–45 hrs | $165–$215/hr |

These hourly rates are senior-engineer rates without being agency rates — defensible, profitable, and not so high that prospects feel gouged.

---

## Part C — Quit-the-day-job ramp plan

Your day-job replacement number depends on your tax situation. Pick yours from this table:

| Day job net (after-tax) | Equivalent gross sole-prop revenue (Ontario, ~30% effective tax + business expenses) |
|---|---|
| CAD $5,000/mo | CAD $7,500/mo |
| CAD $7,000/mo | CAD $10,500/mo |
| CAD $10,000/mo | CAD $15,000/mo |

(These are rough — talk to an accountant before you actually quit.)

### Three milestones

**Milestone 1 — Side hustle viable (Months 1–3)**
- 2 Tier-0 builds: $2,400 setup
- 3 Tier-1 retainer signups: $7,200 setup + $297 MRR
- 1 Tier-2 retainer signup: $4,500 setup + $249 MRR
- Total months 1–3: ~$14,100 setup (lumpy) + $546 MRR
- Average ~$5,200/mo gross
- **Status: side hustle pays for AI tools, eats into evenings**

**Milestone 2 — Day-job-replaceable (Months 4–9)**
- 3–4 new clients per month, mostly Tier 2 — typical mix:
  - 1 Tier-0 ($1,200), 1 Tier-1 ($2,400), 2 Tier-2 ($9,000) = $12,600 setup/mo
  - MRR climbs by $99 + $498 per month = $597/mo new MRR
- By Month 9, MRR ≈ $5,000–$7,000 + lumpy setups of $10–14k/mo
- Total monthly gross: **$15,000–$21,000**
- **Status: comfortably above day-job replacement number; start derisking**

**Milestone 3 — Quitting milestone (Month 10–12)**
- MRR alone covers fixed personal expenses (mortgage / rent + groceries + utilities + insurance)
- 6 months of personal expenses saved as runway
- Two enterprise referrals lined up (LinkedIn network) for a buffer
- **Then quit.**

### Honest caveats

- **Churn is real.** Plan for ~10% annual churn on retainers. That means a steady-state of 30 clients requires you to win ~3 new retainer clients per year just to stay flat.
- **Not every prospect closes.** Plan for a 20–30% close rate on Fiverr / Upwork inquiries. So 4 closes/month = ~15 inquiries to manage. Time on prospect calls is not free.
- **Your Pro / Max quota is shared.** Cliff timing (when to upgrade Pro → Max 5x → Max 20x → 2nd seat) lives in [`mothership/18 §6`](../mothership/18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points). Upgrade when triggered, not pre-emptively, but never *during* a new-client onboarding.
- **One bad client costs more than ten good ones earn.** Be ruthless with the "say no to" list in `01-gig-profile.md`. Energy spent on a problem client is energy stolen from acquiring four more good ones.

---

## Part D — Operating cost projection (12-month spreadsheet)

Assume Month 0 = today, day-job not yet quit, side hustle operational. AI-cost cells are derived from the §3 envelope in `18` (base column), with the cliff transitions named in [`18 §6`](../mothership/18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points). Cliff 1 (Pro → Max 5x) trips at client #6; Cliff 4 (Max 5x → Max 20x) at client #16; Cliff 5 (2nd seat) at client #26.

| Month | Active clients | Quota tier (`18 §3`) | MRR (CAD) | Setup-fees-this-month (CAD) | Gross revenue | AI cost (USD base / CAD) | Other infra | **Net before tax & your time** |
|---|---|---|---|---|---|---|---|---|
| 1 | 2 | Pro ([`#ai-cost-band-pro`](../mothership/18-capacity-and-unit-economics.md#3--ai-usage--cost-envelopes)) | $200 | $3,000 | $3,200 | $20 / $28 | $20 | $3,152 |
| 2 | 4 | Pro | $500 | $5,000 | $5,500 | $20 / $28 | $20 | $5,452 |
| 3 | 7 | Max 5x ([`#ai-cost-band-max5x`](../mothership/18-capacity-and-unit-economics.md#3--ai-usage--cost-envelopes)) | $1,200 | $7,500 | $8,700 | $115 / $160 | $20 | $8,520 |
| 4 | 10 | Max 5x | $2,000 | $9,000 | $11,000 | $115 / $160 | $30 | $10,810 |
| 5 | 13 | Max 5x | $2,800 | $10,000 | $12,800 | $115 / $160 | $30 | $12,610 |
| 6 | 16 | Max 20x ([`#ai-cost-band-max20x`](../mothership/18-capacity-and-unit-economics.md#3--ai-usage--cost-envelopes)) | $3,800 | $11,000 | $14,800 | $225 / $313 | $30 | $14,457 |
| 7 | 19 | Max 20x | $4,800 | $12,000 | $16,800 | $225 / $313 | $30 | $16,457 |
| 8 | 22 | Max 20x | $5,800 | $12,000 | $17,800 | $225 / $313 | $40 | $17,447 |
| 9 | 25 | Max 20x | $6,800 | $13,000 | $19,800 | $225 / $313 | $40 | $19,447 |
| 10 | 28 | 2nd seat ([`#ai-cost-band-2seat`](../mothership/18-capacity-and-unit-economics.md#3--ai-usage--cost-envelopes)) | $7,800 | $13,000 | $20,800 | $435 / $605 | $40 | $20,155 |
| 11 | 30 | 2nd seat | $8,500 | $14,000 | $22,500 | $435 / $605 | $40 | $21,855 |
| 12 | 32 | 2nd seat | $9,200 | $14,000 | $23,200 | $435 / $605 | $40 | $22,555 |

**Year-1 gross: ~$177k CAD. Year-1 net (before personal income tax): ~$170.5k.** This is ~$1,500 CAD lower than the previous draft of this table — the difference is captured in [`18 §7`](../mothership/18-capacity-and-unit-economics.md#7--assumption-change-log) (assumption change log).

After personal income tax in Ontario at sole-prop rates (see [`18 §1 tax_band_ontario_soleprop`](../mothership/18-capacity-and-unit-economics.md#1--assumptions-table) — a *range*, not a single number; consult an accountant), take-home is roughly **$118k–$128k CAD net** — comfortably above most software-engineer day-job nets.

### Realistic adjustments to make this honest

- **Subtract 15% for slow months / cancellations / scope drama.** True net more like $100k–$110k.
- **Add ~$1,000–$2,000/year for accountant + bookkeeping software.**
- **Add $50–$100/month for a dedicated Codex / Cursor seat once you scale.**
- **GST/HST registration is mandatory above $30k revenue/year.** Plan for it; the accountant handles it.

---

## Part E — When to upgrade your tooling

The five capacity cliffs (Claude plan, GitHub Actions, Railway, second seat) live in [`mothership/18 §6 #cliffs-table`](../mothership/18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points) — that's the operational source of truth. Add-ons specific to *staffing* (not capacity) live here:

| Trigger | Action |
|---|---|
| Cross ~25 active clients | Hire a part-time VA (5 hrs/week, ~$300/mo CAD) for client comms triage |
| Cross ~35 active clients | Hire a part-time second engineer for monthly improvement runs (the 2nd Anthropic seat from `18 §6` Cliff 5 unlocks this) |
| Cross ~50 active clients | You've built an agency. Decide if that's what you wanted. |

---

## Part F — Risks (the boring but important section)

1. **Anthropic / Google / OpenAI rate-limit policy changes.** Mitigation: the multi-AI fallback is already wired up. Keep all three keys live.
2. **A model deprecation breaks the bot.** Mitigation: pin model IDs in `docs/AI_ROUTING.md`; review every 2 months.
3. **A client's site has a security incident.** Mitigation: hard-exclusions in the bot prevent it from touching workflows / env vars / dependencies. Vercel handles the production stack. Carry professional liability insurance once you cross $50k revenue (~$400/year for a sole prop in Ontario).
4. **A client demands the source files and walks.** Mitigation: they already own everything. If they leave, they take the site, but the autopilot pipeline doesn't migrate cleanly without your operator account. That's the lock-in — not on the code, but on the *system around* the code.
5. **You burn out.** Mitigation: hard cap clients at 30 until you've hired help. Take 2 weeks off in the calendar before you hit 25.

---

## Part G — The "is this even worth it?" sanity check

If you're reading this and the answer is "this looks great but I'm not sure 30 clients exist for me" — that's the right instinct. Run a 4-week test:

1. Post the Lumivara case study on LinkedIn with the line *"I built this. If you'd want one for your business, reply 'tell me more'."*
2. DM 20 people in your network with the same one-paragraph pitch.
3. Run a single Fiverr gig (Tier 2 only) for 4 weeks.

By week 4 you should have:
- ≥ 3 inbound replies from LinkedIn
- ≥ 5 DM responses from your network
- ≥ 2 Fiverr inquiries

If you have those, the market exists. If you don't, the market is fine — your reach is the bottleneck, and the fix is more posting and more outreach, not more product.
