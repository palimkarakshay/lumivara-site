---
marp: true
theme: default
paginate: true
size: 16:9
backgroundColor: '#fafaf7'
color: '#1f1f1f'
style: |
  section { font-family: 'Inter', system-ui, sans-serif; padding: 60px 80px; }
  h1 { color: #1f1f1f; font-family: 'Fraunces', Georgia, serif; font-size: 2.4em; }
  h2 { color: #1f1f1f; font-family: 'Fraunces', Georgia, serif; }
  h3 { color: #b48a3c; }
  strong { color: #b48a3c; }
  blockquote { border-left: 4px solid #b48a3c; color: #555; font-style: italic; }
  table { font-size: 0.78em; }
  code { background: #f0ece2; padding: 2px 6px; border-radius: 3px; }
  .small { font-size: 0.8em; color: #666; }
  .center { text-align: center; }
  .two-col { column-count: 2; column-gap: 40px; }
---

<!-- _class: lead -->

# Lumivara Forge
### Product positioning — the nine questions

A working answer to: *what are we selling, to whom, against whom, with what plan, and at what cost?*

<br/>

*Source material: `docs/mothership/` (operator pack) and `docs/freelance/` (go-to-market pack), reconciled 2026-04-29.*

<span class="small">Operator deck — confidential. Not for client distribution.</span>

---

## The nine questions this deck answers

1. **Benefits** — what the customer gets out of it
2. **Differentiators** — what we provide that others don't
3. **Customer voice** — what prospects actually ask for
4. **Competitor claims** — what the alternatives say they offer
5. **End goal** — what this business is, fully grown
6. **Steps to get there** — the milestones in order
7. **Project plan** — the phased buildout, today through year 1
8. **Challenges** — the risks that can knock us off course
9. **Resources required** — money, time, tooling, and people

Each section is a short stack of slides, then a one-slide recap.

---

<!-- _class: lead -->

# 1 · Benefits for the customer

*What does the small-business owner actually get?*

---

## The one-line promise

> A clean, fast, mobile-first marketing site for your business — that you edit from your phone, and that quietly improves itself every month, for a flat subscription fee.

Three things, bundled:

- **Service A — the website itself.** Custom design, 3–7 pages, mobile + desktop, fast loading, accessibility built in.
- **Service B — the phone-edit system.** Submit a change from a phone shortcut → preview link arrives → tap to publish.
- **Service C — the always-improving subscription.** Monthly improvements, monitoring, a quarterly call about where the site goes next.

Source: `docs/freelance/01-gig-profile.md` Part 2.

---

## Six concrete benefits

| # | Benefit | What the client experiences |
|---|---|---|
| 1 | **No decay.** | The site stays current because making it current is a 30-second job, not a $200 invoice. |
| 2 | **No developer phone calls.** | Edits go in by phone, email, or SMS. The laptop stays closed. |
| 3 | **Predictable monthly cost.** | One flat fee covers AI, monitoring, edits, improvements. Zero surprise invoices. |
| 4 | **Full ownership.** | Code, domain, hosting account — all in the client's name on day one. |
| 5 | **Quality on autopilot.** | 90+ Lighthouse on every page. Accessibility regressions caught before they ship. |
| 6 | **Nothing publishes without consent.** | Every change waits for a tap on the client's phone. |

Source: `docs/freelance/04-slide-deck.md` slides 4–9, `01-gig-profile.md` Part 6.

---

## The 24-month cost story (the benefit in dollars)

|   | Traditional agency | Lumivara Forge |
|---|---|---|
| Initial build | CAD $5,000 – $15,000 | CAD $1,200 – $7,500 |
| Each edit after launch | $150 – $300 / change | included in subscription |
| Time per edit | 1 – 3 weeks | 1 – 4 hours |
| Site-quality maintenance | "phase 2" upsell | included monthly |
| **Total over 24 months (active SMB)** | **$15,000 – $30,000+** | **$7,500 – $14,000** |

The retainer model isn't more expensive. It's cheaper, predictable, and the site is *better* every month instead of degrading.

Source: `docs/freelance/04-slide-deck.md` "What it costs at lumivara.com vs. an agency".

---

## Section recap — Benefits

- The client gets a **real codebase** they own outright, not a templated rental.
- The client gets a **30-second edit loop** from their phone, not a 2-week dev queue.
- The client gets **monthly compounding improvements** for one flat fee, not à-la-carte invoices.
- The client gets **zero lock-in** — code, domain, hosting all in their name from day one.

> Pitch line: *"Your website stops decaying — and you never call a developer for a typo again."*

---

<!-- _class: lead -->

# 2 · What we provide that others don't

*The moat, in plain English.*

---

## The category we sit in

| Category | Example providers | Their model |
|---|---|---|
| Templated DIY builders | Squarespace, Wix, Webflow | Drag-and-drop. Client maintains. Vendor owns the data. |
| Freelance "site builds" | Solo Upwork / Fiverr devs | Build, hand off, disappear. Each future change is a custom invoice. |
| Boutique web agencies | Local 5-person shops | Big setup fee, monthly retainer for *availability*, $150–$300 / edit. |
| Headless CMS + dev | Sanity / Contentful + freelancer | Real codebase, but client must learn a CMS *and* still call a dev. |
| **Lumivara Forge** | — | Real codebase the client owns + AI autopilot operator-managed + edits from a phone shortcut + flat subscription. |

The market is full of Next.js developers. It is **not** full of people who can hand a non-technical owner a site that maintains itself.

Source: `docs/freelance/01-gig-profile.md` Closing note.

---

## Five things only we ship today

1. **Phone-as-the-CMS.** A shortcut on the client's phone routes through n8n + Claude into a GitHub PR with a Vercel preview. No CMS to log in to. (`docs/ADMIN_PORTAL_PLAN.md`.)
2. **Multi-AI autopilot with deterministic fallback.** Claude Opus → Gemini → OpenAI Codex. Triage, plan, execute, review — each stage has a fallback so a single-vendor outage never blocks the queue. (`docs/AI_ROUTING.md`.)
3. **Plan-then-execute pipeline.** Every routine issue gets a structured AI plan as a comment *before* code is written. The client can read what's about to happen.
4. **Tier-based cadence.** T0 manual; T1 daily; T2 every 2 h; T3 every hour. The bot's "energy" is a sold feature. (`docs/mothership/04-tier-based-agent-cadence.md`.)
5. **Pattern C two-repo isolation.** Client gets a clean `<slug>-site` repo (private → transferable). The pipeline, prompts, and operator IP live in a separate `<slug>-pipeline` repo the client never sees. (`docs/mothership/02b-pattern-c-architecture.md`.)

---

## Why each of those is hard to copy

| Feature | What protects it |
|---|---|
| Phone-as-CMS | Requires Auth.js v5 + n8n workflows + HMAC + Octokit + Vercel deploy hooks wired together. ~5 phases of build (`ADMIN_PORTAL_PLAN.md`). |
| Multi-AI fallback | Requires three live API contracts, a deterministic router, and prompt-pack parity across providers. Most freelancers hold one key. |
| Plan-then-execute | Every routine issue gets an AI-authored plan comment before code lands. Few competitors run this gate. |
| Tier cadence | The pipeline reads tier from a per-client variable; cron, model, and auto-merge gates all branch on it. Not a feature flag — a whole product surface. |
| Pattern C isolation | A GitHub App + two-repo split + per-engagement install ID. Operator IP stays operator-side; the client repo is genuinely "vanilla" if they ever leave. |

The site is a commodity. The **system around the site** is the moat.

---

## What we deliberately do NOT sell

- **Not a SaaS.** No self-serve onboarding, no shared multi-tenant DB, no public sign-up. (`docs/mothership/01-business-plan.md §6`.)
- **Not an agency.** No PMs, no design team, no employees. The operator runs everything until ~30 clients.
- **Not a hosting company.** The client's hosting account is the client's, in their name, on their card by month 1.
- **Not a white-label reseller.** Tier 4 exists for agencies but is not promoted; quoted custom at 2× T3 minimum.
- **Not Shopify / e-commerce.** Wrong stack — referred elsewhere.

The boundaries are the strategy. They keep the operator under 60 hours a month and keep the moat intact.

---

## Section recap — Differentiators

- **Phone-as-CMS** is the headline feature. Nobody in our price band offers it.
- **Multi-AI fallback** turns a single-vendor risk into a product feature ("we don't pause when one provider hiccups").
- **Pattern C** lets us license the system per engagement while the *site* is genuinely the client's.
- **Tier cadence** turns "how aggressive is the bot" into a sold dial.

> Pitch line: *"Other people sell you a website. We sell you a website that updates itself."*

---

<!-- _class: lead -->

# 3 · What customers say they want

*The actual asks, in their own words.*

---

## The four asks we hear repeatedly

From discovery calls, Fiverr inquiries, and the freelance gig-profile work:

1. **"I want to update my own site without calling someone."**
   The Squarespace promise — but they want it on a real codebase they own.
2. **"I don't want to pay $200 every time I fix a typo."**
   Predictable monthly cost beats lumpy invoices, even if the monthly is bigger.
3. **"I want it to look custom, not like every other Wix site."**
   Custom palette, type, layout. Moodboard sign-off before any code.
4. **"I want to own my site outright — no lock-in."**
   Their domain, their hosting, their code. Cancellable any time.

Source: `docs/freelance/01-gig-profile.md` Parts 1, 6, and 8; `00-quick-start.md` "Is this marketable?"

---

## Direct quotes we plan answers around

> *"Can't I just use Squarespace?"*
> Yes — and a quarter of small businesses do. The difference is real ownership of the code + free unlimited edits + monthly improvements baked in.

> *"Why pay monthly?"*
> Because every other dev charges per-edit and disappears between projects. Compare against $200 × 24 months of edits.

> *"What if you go out of business?"*
> They keep the site. They keep the domain. They keep the hosting. They lose the autopilot. Already in the FAQ and the contract.

> *"I'm worried about being locked in."*
> They can't be. Code is theirs, domain is theirs, hosting is in their name.

Source: `docs/freelance/00-quick-start.md` "Is this marketable?", `04-slide-deck.md` honest-objections slide.

---

## Who says yes (the ICP)

| Prospect type | Looks like | Tier |
|---|---|---|
| Solo consultant (HR, coach, therapist, accountant, lawyer) | "Relaunching my practice; the Squarespace site looks cheap." | T1 / T2 |
| Boutique services firm (5–25 staff) | "Site was built in 2019; the intern can't update it." | T2 / T3 |
| Indie SaaS founder | "Marketing site for my product; modern stack so I can hack on it later." | T2 + retainer |
| Local trades / clinics / studios | "Want to look professional + an online booking link." | T1 + Cal.com |

And who we say no to: agencies-wanting-half-price, equity-only, e-commerce, enterprise procurement.

Source: `docs/freelance/01-gig-profile.md` Part 8.

---

## Section recap — Customer voice

- Customers ask for **autonomy** ("I want to fix it myself") and **predictability** ("no surprise invoices").
- They ask for **ownership** ("no lock-in") and **looks** ("not another Wix site").
- The **objections** clump into four shapes (Squarespace, monthly cost, vendor risk, lock-in) — all four have prepared answers.
- The ICP is solo consultants and boutique firms, not e-commerce or enterprise.

> Pitch line: *"Customers don't ask for AI. They ask to stop waiting on a developer."*

---
