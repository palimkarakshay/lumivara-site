---
marp: true
theme: default
paginate: true
size: 16:9
backgroundColor: '#fafaf7'
color: '#1f1f1f'
style: |
  section { font-family: 'Inter', system-ui, sans-serif; padding: 56px 72px; }
  h1 { color: #1f1f1f; font-family: 'Fraunces', Georgia, serif; font-size: 2.4em; margin-bottom: 0.2em; }
  h2 { color: #1f1f1f; font-family: 'Fraunces', Georgia, serif; }
  h3 { color: #b48a3c; }
  strong { color: #b48a3c; }
  blockquote { border-left: 4px solid #b48a3c; color: #555; font-style: italic; }
  table { font-size: 0.78em; }
  th { background: #f0ece2; }
  code { background: #f0ece2; padding: 2px 6px; border-radius: 3px; }
  .small { font-size: 0.78em; color: #666; }
  .center { text-align: center; }
  .twocol { columns: 2; column-gap: 32px; }
---

<!-- _class: lead -->

# Product strategy
## Lumivara Forge — small-business sites that maintain themselves

<br/>

A working answer to nine questions:
**benefits · differentiation · customer voice · competitor claims · end goal · steps · plan · risks · resources.**

<span class="small">Operator-only working deck · 2026-04-29 · sourced from `docs/mothership/` + `docs/freelance/`</span>

---

## How to read this deck

<br/>

This is the **internal strategy deck** — not the prospect deck.
The prospect-facing deck is `docs/freelance/04-slide-deck.md` ("imagine your site here").

This one is the operator's own answer to: *what are we actually building, why does it win, and what does it take to ship?*

Cited sources are in the footer of every slide so claims are auditable against the underlying docs.

> If a number here disagrees with `docs/mothership/18-capacity-and-unit-economics.md`, that doc wins.

---

## The product, in one sentence

> **Lumivara Forge** designs and ships a modern marketing website for a small business, then keeps it improving on an automated subscription. The owner edits the site from a phone shortcut; an AI autopilot implements the change, opens a preview, and the owner taps publish. Beautiful build. **No decay.** Owned by the client; managed by us.

<br/>

Three things in one offer:

1. **The site itself** — custom, fast, accessible, owned by the client.
2. **The phone-edit system** — change requests in 30 seconds, no developer call.
3. **The "always-improving" subscription** — the site gets quietly better every month.

<span class="small">Source: `docs/mothership/01-business-plan.md §2`, `docs/freelance/01-gig-profile.md` Part 2.</span>

---

<!-- _class: lead -->

# 1 · Benefits for the customer
## What does the client actually get?

---

## Outcomes the client feels

<br/>

| Outcome | What that looks like in their week |
|---|---|
| **No more decay between updates** | Typos, prices, new pages — fixed the same day, not "next quarter." |
| **Edits in 30 seconds, from a phone** | Change request sent from the airport; preview link arrives before they land. |
| **A flat monthly fee, not per-edit invoices** | No surprise $200 invoice for a one-line copy fix. |
| **Always 90+ Lighthouse** | Speed, accessibility, SEO are the baseline — not an upsell. |
| **Full ownership, no lock-in** | Code, domain, hosting are in the client's name from day one. |
| **Every change waits for their tap** | The bot proposes, the owner publishes. Nothing surprises them live. |
| **Multi-channel intake** | Phone shortcut, email, or SMS — whichever is in front of them. |

<span class="small">Source: `docs/freelance/01-gig-profile.md` Parts 2 & 6, `docs/freelance/04-slide-deck.md` slides 4–7.</span>

---

## Why the *retainer* is the real benefit

<br/>

A traditional agency build is "delivered and forgotten." Within 12 months the site decays:

- Stale prices, old team list, broken booking link, slipping Lighthouse score.
- Every fix is a $150–$300 invoice and a 1–3 week wait.

Lumivara Forge **inverts** that:

- The site **gets better** month over month — the operator ships 3–5 unprompted improvements per month on Tier 2 (loading speed, accessibility, SEO polish).
- The client's *own* requested edits are unlimited within fair-use on Tier 2.
- Total cost over 24 months is **$7.5–$14k vs. $15–$30k+ for an agency.**

<span class="small">Source: `docs/freelance/02-pricing-tiers.md` Tier 2, `docs/freelance/04-slide-deck.md` "What it costs … vs. an agency."</span>

---

## Quantified value (24-month view)

<br/>

| Line item | Traditional agency | Lumivara Forge (Tier 2) |
|---|---|---|
| Initial build | CAD $5,000 – $15,000 | CAD $4,500 |
| Each edit after launch | $150 – $300 / change | included |
| Time to ship a typo fix | 1 – 3 weeks | 1 – 4 hours |
| Monthly improvement run | "phase 2" upsell | included |
| 24-month total (active small biz) | $15,000 – $30,000+ | ≈ $10,500 |
| Site quality after 24 months | degrading | improving |

> The retainer model isn't more expensive. It's cheaper, predictable, and the site is *better* every month instead of degrading.

<span class="small">Source: `docs/freelance/04-slide-deck.md` cost-comparison slide; `docs/freelance/02-pricing-tiers.md`.</span>

---

<!-- _class: lead -->

# 2 · What we provide that others don't
## The moat, in plain English

---

## The differentiation stack

<br/>

Five layers, from "table stakes" to "uniquely ours":

1. **Modern Next.js 16 site** — most freelancers can do this. Table stakes.
2. **Phone-edit shortcut** — submit a change from a phone in 30 seconds.
3. **AI autopilot that implements + previews changes** — multi-AI router (Claude → Gemini → OpenAI), plan-then-execute pipeline.
4. **Tier-based cadence** — T1 ships next morning, T2 within 2 hours, T3 within 1 hour.
5. **Pattern C two-repo architecture** — autopilot lives in an operator-only pipeline repo; the client's site repo is a clean Next.js codebase they own outright.

> Layers 2–5 are what nobody else is shipping in this market segment.

<span class="small">Source: `docs/AI_ROUTING.md`, `docs/mothership/02b-pattern-c-architecture.md`, `docs/mothership/04-tier-based-agent-cadence.md`.</span>

---

## What each layer means concretely

<br/>

| Layer | Concrete capability |
|---|---|
| **Phone-edit** | iOS/Android Shortcut → admin portal → n8n webhook → GitHub issue → bot. Auth.js v5 + magic-link, Google, or Entra ID. |
| **Multi-AI router** | Claude Opus primary; Gemini 2.5 Pro for 1M-context audits; gpt-5.5 for code review. **Outage in one provider doesn't pause the client's site.** |
| **Plan-then-execute** | Every routine issue gets a structured implementation plan first, *then* code. Plans are explainable to the operator before any code is written. |
| **Auto-merge gate** | Trivial/easy non-design PRs auto-merge once the Vercel preview check is green. Design and critical-path changes always wait for a human tap. |
| **Pattern C** | Two private repos per client: `<slug>-site` (clean, client-readable, transferable) + `<slug>-pipeline` (operator-only, holds workflows + prompts + cron). The client cannot see the autopilot — at end of engagement they get a vanilla repo. |
| **Codex second-opinion** | T3 PRs are reviewed by gpt-5.5 before merge. Two opinions before anything ships. |

<span class="small">Source: `docs/AI_ROUTING.md`, `docs/ADMIN_PORTAL_PLAN.md`, `docs/mothership/02b-pattern-c-architecture.md §1`, `docs/mothership/04-tier-based-agent-cadence.md §1`.</span>

---

## The competitive frame, side by side

<br/>

| Feature | Squarespace / Wix | Local agency | Typical Upwork freelancer | **Lumivara Forge** |
|---|---|---|---|---|
| Custom design | ❌ template | ✅ | ✅ | ✅ |
| Real code, owned by client | ❌ | partial | sometimes | ✅ |
| Edits from a phone | partial (CMS) | ❌ | ❌ | ✅ |
| AI autopilot ships changes | ❌ | ❌ | ❌ | ✅ |
| 90+ Lighthouse out of the box | ❌ | sometimes | rarely | ✅ |
| Monthly improvement run | ❌ | upsell | ❌ | ✅ |
| Outage-resilient AI fallback | n/a | n/a | n/a | ✅ |
| Two-repo "autopilot is hidden" architecture | n/a | n/a | n/a | ✅ |
| Total 24-mo cost (active small biz) | $400 + your time | $15–30k+ | $5–15k + per-edit | $7.5–14k all-in |

<span class="small">Source: `docs/freelance/01-gig-profile.md` Part 8 (audience matrix), `docs/freelance/04-slide-deck.md`.</span>

---

## Why competitors can't trivially copy

<br/>

- **n8n + multi-AI router + GitHub-App pattern is engineered, not configured.** A solo freelancer would need 3–6 months of vibe-coding to replicate, by which time they're competing on the same terms — fine.
- **Most agencies make money on per-edit billing.** Killing that revenue stream is structurally hard for them; it's not a feature they'll add.
- **Squarespace / Wix can't open-source-clone this.** They're CMS platforms; the value here is "you own the code AND it self-improves." Different shape entirely.
- **The system itself is licensed per engagement** — not work-for-hire. The client owns the *site*; we license the *system around it*. (See `docs/freelance/05-template-hardening-notes.md`.)

> The moat is the **operating system around the codebase**, not the codebase. Nobody in this segment is selling that today.

<span class="small">Source: `docs/freelance/05-template-hardening-notes.md`, `docs/mothership/01-business-plan.md §6`.</span>

---

<!-- _class: lead -->

# 3 · What customers say they want
## Voice of the customer (target segments)

---

## Five segments, in their own words

<br/>

| Segment | The line we hear from them |
|---|---|
| **Solo consultant** (HR, coach, therapist, accountant) | "I'm relaunching my practice; the Squarespace site looks cheap and I can't update it without help." |
| **Boutique services firm** (5–25 staff) | "Our site was built in 2019, our intern can't update it, and the agency invoiced $800 for a paragraph change." |
| **Indie SaaS founder** | "Marketing site for my product; modern stack so I can hack on it. I don't want to babysit a CMS." |
| **Local trades / clinics / studios** | "I want to look professional and have an online booking link. My current site looks like 2014." |
| **Solo legal practice** | "I need a clean site that updates fees once a year without a developer call." |

<span class="small">Source: `docs/freelance/01-gig-profile.md` Part 8 ("who to say yes to").</span>

---

## What they ask for, decoded

<br/>

| What they say | What they actually want |
|---|---|
| *"I need a website."* | A site that won't embarrass them in 18 months. |
| *"I just need a typo fix."* | A relationship where typo fixes don't trigger a $200 invoice. |
| *"Can I edit it myself?"* | They want **agency** without **complexity**. They don't want to learn WordPress. |
| *"Make it pop."* | They want their visitors to convert — they don't have the vocabulary for it. |
| *"I want it to rank on Google."* | They want SEO maintenance, not a one-time SEO setup. |
| *"What if I want to leave?"* | They've been burned by lock-in before. |

> The phone-edit shortcut speaks directly to "I want to edit it myself, but not learn anything new."
> The retainer speaks directly to "no surprise invoices."
> Pattern C handover speaks directly to "I won't be locked in."

<span class="small">Source: `docs/freelance/01-gig-profile.md` Parts 4 & 6, `docs/freelance/04-slide-deck.md` "Honest objections."</span>

---

## The four objections we hear most

<br/>

> **"Can't I just use Squarespace?"**
> *Yes — and a quarter of small businesses do. The difference is real ownership of the code + free unlimited edits + monthly improvements baked in.*

> **"Why pay monthly?"**
> *Because every other developer charges per-edit and disappears between projects. Over 24 months the retainer is cheaper, and the site is improving instead of decaying.*

> **"What if you go out of business?"**
> *Site keeps running. Domain, code, hosting are already in your name. The phone-edit pipeline stops; everything published stays published.*

> **"I'm worried about being locked in."**
> *You can't be. Pattern C means the autopilot is in our repo, not yours. Cancel any time; you keep a clean Next.js site.*

<span class="small">Source: `docs/freelance/00-quick-start.md` "Is this marketable?", `docs/freelance/04-slide-deck.md` objections slide.</span>

---

<!-- _class: lead -->

# 4 · What competitors say they provide
## Reading the field honestly

---

## The competitive landscape

<br/>

| Competitor type | What they pitch | What they actually deliver |
|---|---|---|
| **Squarespace / Wix / Webflow** | "Beautiful sites you can edit yourself." | Templated builders. Owners learn a CMS, sites slow down, real ownership is shallow. |
| **Local agencies (5–20 person)** | "Custom site, full service, dedicated PM." | High-quality build, but every post-launch edit is a billable hour. Site decays unless the client keeps paying for retainer-time. |
| **Upwork / Fiverr generalists** | "Custom Next.js / WordPress site, fast turnaround." | Variable quality, no post-launch system, "I'll fix it for $50" relationship. |
| **Webflow Experts / Framer Pros** | "Designer-built, no-code-friendly, modern." | Beautiful designs locked into a hosted platform. Owners pay platform fees + still need a designer for changes. |
| **AI website builders (Durable, Wix ADI, Framer AI)** | "AI builds your site in 60 seconds." | One-shot generators. No edit-loop, no improvement subscription, no real ownership. |
| **DIY WordPress + plugins** | "You own everything, edit anything." | True, and a maintenance nightmare. Plugin conflicts, security patches, expert needed monthly. |

<span class="small">Source: `docs/freelance/01-gig-profile.md` Part 8, `docs/freelance/00-quick-start.md` market questions.</span>

---

## What they don't claim (and why)

<br/>

No competitor in this segment is currently claiming **all four** of:

1. *Custom-coded* (not a template) — agencies claim it; builders can't.
2. *Edit from a phone in 30 seconds* — nobody claims this credibly today.
3. *Monthly improvement run baked into a flat fee* — agencies upsell it; nobody includes it.
4. *Outage-resilient AI fallback ladder* — purely an engineering investment we've already made.

<br/>

> The composite offer — *all four together* — is the empty quadrant. That's where Lumivara Forge sits.

<span class="small">Source: `docs/AI_ROUTING.md` resilience section, `docs/mothership/01-business-plan.md §4` (feature matrix).</span>

---

## The "why hasn't a bigger player done this?" question

<br/>

Honest answer: because the economics only work for **one operator running 25–30 retainers** before it tips into hiring.

- A bigger player needs to load operator costs (PMs, account managers, designers) — that pushes price above $1,000/mo, killing the segment.
- A solo developer without the autopilot can serve maybe 5 retainers before drowning in edit requests — too small to invest in the system.
- The autopilot is the **only** thing that lets one person deliver agency-grade service to 25+ clients at sub-$300/mo.

> The category is structurally hostile to anyone who isn't a senior engineer + one Claude Max subscription. That window is exactly the operator's profile.

<span class="small">Source: `docs/freelance/03-cost-analysis.md` Part E, `docs/mothership/18-capacity-and-unit-economics.md` cliffs.</span>

---

<!-- _class: lead -->

# 5 · The end goal
## What "success" looks like at 12, 24, and 36 months

---

## The three-stage business

<br/>

| Stage | Window | Shape | Ceiling |
|---|---|---|---|
| **Stage 1 — Services + retainer** | Now → month 24 | One operator, 25–30 retainers, ~CAD $20k MRR | Operator hours |
| **Stage 2 — Managed-services agency** | Months 24–48 | Operator + 1–2 hired engineers, ~80 retainers | Hiring + ops complexity |
| **Stage 3 — Productised SaaS** | Month 48+ | Self-serve onboarding, customer-managed billing, founder-mode | Real PMF risk; uncapped |

<br/>

> **The decision rule for the next 12 months:**
> If a feature, doc, or tool helps the operator serve **paid retainer clients** better — build it.
> If it helps **prospects, hypothetical SaaS users, or other agencies** — defer it.

<span class="small">Source: `docs/freelance/05-template-hardening-notes.md` "Long-term", `docs/mothership/01-business-plan.md §9`.</span>

---

## Stage-1 success metric

<br/>

By **month 12** of paid operations:

- **25–32 active retainer clients**, mostly Tier 2.
- **MRR ≈ CAD $8,500 – $10,000** + lumpy setup-fee revenue.
- **Year-1 net (before personal income tax) ≈ CAD $170k.**
- **Take-home ≈ CAD $100–110k** after Ontario sole-prop tax + the realistic 15% slow-month adjustment.
- Day job replaced; runway > 6 months personal expenses.

By **month 24**:

- 40+ retainers, second engineer hired, operator drops to ~30 hrs/week on the practice.
- Still no SaaS, no self-serve. The system stays operator-mediated until the numbers force the change.

<span class="small">Source: `docs/freelance/03-cost-analysis.md` Part D (12-month spreadsheet), Part C (milestones).</span>

---

## What we are deliberately *not* building

<br/>

- **Not a SaaS.** No public sign-up, no shared multi-tenant database, no marketing site funnel beyond `lumivara-forge.com`.
- **Not an agency in the project-shop sense.** No PMs, no design team, no in-house copywriters.
- **Not a white-label reseller** to other agencies (Tier 4 exists; we don't promote it).
- **Not a hosting company.** The client owns the Vercel account, the domain, the Resend (or equivalent) billing — by month 1.
- **Not an enterprise vendor.** No RFPs, no MSAs with procurement, no NDAs that take 6 weeks to negotiate.

> Saying "no" to four of these every quarter is what keeps the operator's hours under 60 and the margins above 60%.

<span class="small">Source: `docs/mothership/01-business-plan.md §6`, `docs/freelance/01-gig-profile.md` Part 8.</span>

---

<!-- _class: lead -->

# 6 · Steps to achieve the end goal
## The path from today to 30 retainers

---

## Phase ladder (operator-side)

<br/>

| Phase | Deliverable | Status (Apr 2026) |
|---|---|---|
| **P0–P4** | Survey, foundation docs, ops, engagement playbooks, future-work stubs | ✅ Done |
| **P4.5–P4.6** | External critique + critique-closure runs (architecture, security, scaling, ops) | 🟡 In-flight |
| **P5** | Bootstrap private mothership repo (`lumivara-forge-mothership`) end-to-end | ⏳ Next |
| **P6** | Migrate Lumivara People Advisory into a clean per-client repo as Client #1 | ⏳ After P5 |
| **P7** | Walk template-hardening items into issues against the new mothership | ⏳ After P6 |
| **P8** | Legal + vault (PIPEDA, MSA + SOW, payment automation, 1Password) | ⏳ Months 2–6 |

<span class="small">Source: `docs/mothership/00-INDEX.md` phased build plan.</span>

---

## Phase ladder (go-to-market)

<br/>

| Stretch | What lands in this stretch |
|---|---|
| **Days 1–7** | Fiverr Gig 1 live; Toptal / Arc / Lemon.io applications submitted; LinkedIn case study posted; 10 network DMs sent. |
| **Days 8–30** | 5 Upwork applications/day; first 5 Tier-0 / Tier-1 setups delivered at 15% launch discount; reviews accumulate. |
| **Months 2–3** | Cross 5 paying retainers. Trigger: legal pack (MSA + SOW), payment automation (Stripe Subscriptions), privacy pack (PIPEDA). |
| **Months 4–9** | 3–4 new clients/month, mostly Tier 2. Cross Cliff 1 (Pro→Max 5x at client #6) and Cliff 4 (Max 5x → Max 20x at client #16). |
| **Months 10–12** | MRR alone covers fixed personal expenses; 6-month runway saved; **quit the day job**. |
| **Months 13–24** | Hire part-time VA at ~25 clients; second engineer at ~35; cap at 30 retainers until VA in place. |

<span class="small">Source: `docs/freelance/01-gig-profile.md` Part 10 (30-day plan), `docs/freelance/03-cost-analysis.md` Part C (milestones), Part E (tooling triggers).</span>

---

## Per-engagement step list (the CLI)

<br/>

`npx forge provision --client-slug <slug> --tier <n>` runs **13 idempotent steps**:

1. Validate slug + intake form completeness.
2. Create `<slug>-site` private repo.
3. Create `<slug>-pipeline` private repo.
4. Add both to org-secret scope.
5. Push `client-template/` (Next.js scaffold) to site repo's `main`.
6. Push `workflows-template/` + `scripts/` to pipeline repo's `main`.
7. Install GitHub App on the site repo; capture installation ID.
8. Provision Vercel project + env vars + deploy hook.
9. Provision n8n workflows (intake-web / email / sms, notify, record, deploy-confirmed).
10. Provision Twilio per-client number.
11. Bootstrap GitHub labels + Project board on site repo.
12. Smoke-test cross-repo write (App opens + closes a no-op PR).
13. Render handover pack from `07-client-handover-pack.md`.

> Every step is individually testable. If one fails, the CLI prints what's done + what's left and the operator runs `--resume`.

<span class="small">Source: `docs/mothership/02-architecture.md §3`, `docs/mothership/18-provisioning-automation-matrix.md`.</span>

---

<!-- _class: lead -->

# 7 · The project plan
## 12-month plan with revenue + headcount checkpoints

---

## Month-by-month projection (year 1)

<br/>

| Month | Active clients | Quota tier | MRR (CAD) | Setup-fees (CAD) | Gross | Net before tax + time |
|---|---|---|---|---|---|---|
| 1 | 2 | Pro | $200 | $3,000 | $3,200 | $3,152 |
| 3 | 7 | Max 5x | $1,200 | $7,500 | $8,700 | $8,520 |
| 6 | 16 | Max 20x | $3,800 | $11,000 | $14,800 | $14,457 |
| 9 | 25 | Max 20x | $6,800 | $13,000 | $19,800 | $19,447 |
| 12 | 32 | 2nd seat | $9,200 | $14,000 | $23,200 | $22,555 |

**Year-1 gross ≈ CAD $177k. Year-1 net (pre-tax) ≈ CAD $170.5k. Take-home ≈ $100–110k after Ontario sole-prop tax + 15% slow-month adjustment.**

<span class="small">Source: `docs/freelance/03-cost-analysis.md` Part D (12-month spreadsheet), `docs/mothership/18-capacity-and-unit-economics.md` cost envelopes.</span>

---

## Operator's weekly cadence

<br/>

| Day | Time | Activity |
|---|---|---|
| Mon 08:30 | 30 min | Inbox sweep on the dashboard; re-rank Inbox issues across all clients |
| Mon 12:00 | 30 min | Weekly AI smoke-test results review |
| Daily | 30–60 min | PR review on mobile dashboard — merge greens, kick reds back to issues |
| Wed | 60 min | Monthly improvement run for one T2/T3 client (rotate through roster) |
| Fri | 30 min | Cost check — ccusage, Action minutes, Twilio, Resend, n8n health |
| Last Fri / month | 60 min | Per-client "where is this going?" — draft 1–2 issues each |

> **Total: ~10–12 hours/week of operator-managed work**, plus build time for new engagements (8–45 hrs each, lumpy).

<span class="small">Source: `docs/mothership/01-business-plan.md §7`.</span>

---

## Capacity cliffs (when to upgrade what)

<br/>

| Cliff | Trigger | Action |
|---|---|---|
| **Cliff 1** | Client #6 | Claude Pro → Max 5x |
| **Cliff 2** | GitHub Actions free-tier minutes saturate | Move pipeline repos to a paid org plan |
| **Cliff 3** | n8n free-tier executions saturate | Self-host n8n on Railway (already planned, ~$5/mo) |
| **Cliff 4** | Client #16 | Max 5x → Max 20x |
| **Cliff 5** | Client #26 | Add a second Anthropic seat (= second operator) |
| — | Client #25 | Hire part-time VA (5 hrs/wk, ~$300/mo CAD) for client comms triage |
| — | Client #35 | Hire part-time second engineer for monthly improvement runs |
| — | Client #50 | Decide whether to become an agency (Stage 2). |

<span class="small">Source: `docs/mothership/18-capacity-and-unit-economics.md §6`, `docs/freelance/03-cost-analysis.md` Part E.</span>

---

## Tier mix targets (year 1 vs. year 2)

<br/>

| Tier | Year-1 target mix | Year-2 target mix | Reason |
|---|---|---|---|
| Tier 0 — Launch | 20% (portfolio + tire-kicker filter) | 10% | Loss-leader; deliberately scarce. |
| Tier 1 — Lite | 30% | 20% | Solo consultants; ~30% upgrade to T2 within 6 months. |
| **Tier 2 — Pro (headline)** | **40%** | **55%** | The economic engine. ~70% of MRR. |
| Tier 3 — Business | 10% | 15% | Boutique firms; higher SLA. |
| Tier 4 — Agency | 0% | 0% | Custom-quote only; not promoted. |

<span class="small">Source: `docs/freelance/02-pricing-tiers.md` (each tier's "role"), `docs/freelance/03-cost-analysis.md` Part C.</span>
