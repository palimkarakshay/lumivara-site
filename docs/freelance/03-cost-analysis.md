# 03 — Cost Analysis & Quit-the-Day-Job Plan

Two questions this doc answers:

1. What does it actually cost you (operator) to run a client site for a month?
2. How many clients do you need to safely leave the day job?

All figures in CAD. USD where the underlying service is billed in USD (Claude, Gemini, OpenAI, Vercel, etc.).

---

## Part A — Cost of running ONE client per month

Three categories: **AI services**, **infrastructure**, **your time**.

### AI services (the expensive bit, but flat-fee)

The brain of the autopilot system is Claude, with Gemini as fallback and OpenAI for code review. The key trick: **Claude bills by the OAuth token, not per call**, when you use a Pro/Max subscription as the bot's auth. So the cost doesn't scale linearly with clients — it scales with quota usage.

| Service | Plan | Monthly cost (USD) | What it covers |
|---|---|---|---|
| **Claude Pro** | $20/mo | $20 | One operator's bot quota — fine for ~3–5 active clients with light edits |
| **Claude Max 5x** | $100/mo | $100 | Comfortable for ~10–15 active clients |
| **Claude Max 20x** | $200/mo | $200 | Comfortable for ~20–30 active clients |
| **Gemini API (free tier)** | free | $0 | Triage fallback when Claude is throttled; free tier is generous |
| **OpenAI API** | pay-as-you-go | $5–$15 | Code-review fallback only; very low usage |
| **Codex CLI / Cursor / Cline** (your own dev tools) | varies | $20–$40 | Your local dev productivity, NOT the client-facing bot |

**Rule of thumb:** every 5 clients adds about $40 USD/month of AI cost when you're on Max. Below 5 clients, Pro at $20 is plenty.

### Infrastructure (per client, mostly free)

Each client site lives under **the client's own** GitHub + Vercel account. They pay $0 because:

- **Vercel free tier** handles small-business traffic comfortably (100 GB bandwidth, 1M function invocations).
- **GitHub free tier** gives 2,000 Action minutes/month — well over what a small site needs (~200 minutes/month with hourly triage and 6×daily execute crons).
- **Domain registrar:** the client pays directly, ~CAD $20/year.
- **Email (Resend free tier):** 3,000 emails/month free, plenty for a contact form.
- **Cloudflare DNS / proxy:** free tier.

**What you pay per client/month for infra: $0.** That's the leverage.

If a client outgrows the free tier (high-traffic blog or growing SaaS), Vercel Pro at $20/USD/month is on them, not you.

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

| Tier | Your AI cost share | Infra cost | Your time | **Total cost** | **Tier price** | **Margin** |
|---|---|---|---|---|---|---|
| Tier 1 (Lite) | ~$3 USD (≈ $4 CAD) | $0 | ~1.5 hrs | $4 CAD + 1.5 hrs | $99 CAD/mo | $95 + buy back 1.5 hrs of life |
| Tier 2 (Pro) | ~$5 USD (≈ $7 CAD) | $0 | ~2.5 hrs | $7 CAD + 2.5 hrs | $249 CAD/mo | $242 + buy back 2.5 hrs |
| Tier 3 (Business) | ~$10 USD (≈ $14 CAD) | $0 | ~4 hrs | $14 CAD + 4 hrs | $599 CAD/mo | $585 + buy back 4 hrs |

The marginal cost of each new client is dominated by your time, not infrastructure. That's exactly the shape you want a service business to have.

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
- **Your Pro / Max quota is shared.** When you cross ~10 active clients on autopilot, you'll feel quota pressure. The fix is to upgrade to Max ($100 → $200 USD/mo) — but only when you're sure the new revenue covers it.
- **One bad client costs more than ten good ones earn.** Be ruthless with the "say no to" list in `01-gig-profile.md`. Energy spent on a problem client is energy stolen from acquiring four more good ones.

---

## Part D — Operating cost projection (12-month spreadsheet)

Assume Month 0 = today, day-job not yet quit, side hustle operational.

| Month | Active clients | MRR (CAD) | Setup-fees-this-month (CAD) | Gross revenue | AI cost (USD→CAD) | Other infra | **Net before tax & your time** |
|---|---|---|---|---|---|---|---|
| 1 | 2 | $200 | $3,000 | $3,200 | $28 | $20 | $3,152 |
| 2 | 4 | $500 | $5,000 | $5,500 | $28 | $20 | $5,452 |
| 3 | 7 | $1,200 | $7,500 | $8,700 | $28 | $20 | $8,652 |
| 4 | 10 | $2,000 | $9,000 | $11,000 | $140 | $30 | $10,830 |
| 5 | 13 | $2,800 | $10,000 | $12,800 | $140 | $30 | $12,630 |
| 6 | 16 | $3,800 | $11,000 | $14,800 | $140 | $30 | $14,630 |
| 7 | 19 | $4,800 | $12,000 | $16,800 | $140 | $30 | $16,630 |
| 8 | 22 | $5,800 | $12,000 | $17,800 | $280 | $40 | $17,480 |
| 9 | 25 | $6,800 | $13,000 | $19,800 | $280 | $40 | $19,480 |
| 10 | 28 | $7,800 | $13,000 | $20,800 | $280 | $40 | $20,480 |
| 11 | 30 | $8,500 | $14,000 | $22,500 | $280 | $40 | $22,180 |
| 12 | 32 | $9,200 | $14,000 | $23,200 | $280 | $40 | $22,880 |

**Year-1 gross: ~$177k CAD. Year-1 net (before personal income tax): ~$172k.**

After personal income tax in Ontario at sole-prop rates (~25–30% effective on this band), take-home is roughly **$120k–$130k CAD net** — comfortably above most software-engineer day-job nets.

### Realistic adjustments to make this honest

- **Subtract 15% for slow months / cancellations / scope drama.** True net more like $100k–$110k.
- **Add ~$1,000–$2,000/year for accountant + bookkeeping software.**
- **Add $50–$100/month for a dedicated Codex / Cursor seat once you scale.**
- **GST/HST registration is mandatory above $30k revenue/year.** Plan for it; the accountant handles it.

---

## Part E — When to upgrade your tooling

| Trigger | Action |
|---|---|
| Cross 5 active clients | Upgrade Claude Pro → Max 5x ($100/mo) |
| Cross 15 active clients | Upgrade Max 5x → Max 20x ($200/mo) |
| Cross 25 active clients | Hire a part-time VA (5 hrs/week, ~$300/mo CAD) for client comms triage |
| Cross 35 active clients | Hire a part-time second engineer for monthly improvement runs |
| Cross 50 active clients | You've built an agency. Decide if that's what you wanted. |

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
