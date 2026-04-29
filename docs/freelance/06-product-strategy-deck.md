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
