# 00 — Quick Start (read this first, then skim the rest)

You vibe-coded a system. The other docs in this folder explain it. **This one tells you what to do first.**

If you have 5 minutes, read only this file. The rest is reference.

---

## The pitch in one sentence

> *I build small-business websites that you edit from your phone, and that improve themselves every month for a flat subscription fee.*

That's the whole offer. You're not selling Next.js or AI; you're selling "your site stays current without you calling a developer." Don't lead with the tech in any conversation, ever. Receipts: the live, public lumivara-forge.com proves it works.

---

## Is this marketable? — short answer: yes, but only with positioning discipline

| Question you'll get | Honest answer |
|---|---|
| "Can't I just use Squarespace?" | Yes — and a quarter of small businesses do. The difference is real ownership of the code + free unlimited edits + monthly improvements baked in. Frame it as "you own a real website that maintains itself." |
| "Why pay monthly?" | Because every other developer charges per-edit and disappears between projects. Show them the cost-comparison table in `04-slide-deck.md` slide "What it costs at lumivara-forge.com vs. an agency." |
| "Why are you cheaper than an agency?" | Because the autopilot does the boring work. You're not undercutting on quality — you're displacing the agency's $200/edit billing model. |
| "What if you go out of business?" | They keep their site. They keep their domain. They keep their hosting. They lose the autopilot, that's it. Already in the FAQ and contract — see `01-gig-profile.md` Part 6. |

If you can answer those four questions in your sleep, you can sell this. If you stumble on any of them, re-read the relevant doc until you can't.

---

## Where to find each thing in this pack

| Need | File |
|---|---|
| Profile copy for Fiverr / Upwork / Contra / LinkedIn | `01-gig-profile.md` |
| What to charge (4 tiers, CAD + USD) | `02-pricing-tiers.md` |
| What it costs you to run + when to upgrade Claude / Gemini | `03-cost-analysis.md` |
| The "imagine your site here" deck for prospects | `04-slide-deck.md` (rendered: `04-slide-deck.html` + `.pdf`) |
| What to lock down before you have ten paying clients | `05-template-hardening-notes.md` |
| The operator-side runbook (private — not shown to clients) | `../mothership/00-INDEX.md` |
| How to spin up a new client repo | `../TEMPLATE_REBUILD_PROMPT.md` (operator-only) |

---

## Your first 30 days (the only timeline you need)

The detailed week-by-week is in `01-gig-profile.md` Part 10. This is the compressed version — six concrete actions in priority order.

1. **Day 1.** Copy `01-gig-profile.md` Part 4 into your Fiverr "About" section verbatim. Don't write your own — yours will be wordier and worse than this one.
2. **Day 2.** Publish **Gig 1 only** on Fiverr — title and copy from `01-gig-profile.md` Part 5. Set the three Tier prices from `02-pricing-tiers.md` (Tier 1 / Tier 2 / Tier 3 → Basic / Standard / Premium). Set the order requirements from Part 7.
3. **Day 3.** Apply to Toptal, Arc.dev, and Lemon.io. Screening takes 2–4 weeks; start the clock now.
4. **Day 4.** Post a single LinkedIn case study about lumivara-forge.com. Last paragraph: *"I built this. If you'd want one for your business, reply 'tell me more'."* DM 10 people from your network the same day.
5. **Days 5–14.** Apply to 5 Upwork jobs/day. Use the Upwork proposal template (still TODO — see "What's still missing" below). First paragraph mentions the phone-edit system; second paragraph mentions the lumivara-forge.com live link.
6. **Day 30 review.** Did you get ≥3 LinkedIn replies, ≥5 DM responses, and ≥2 Fiverr inquiries? If yes, the market is real and you keep going. If no, the bottleneck is reach (post more) — not product.

If at the 30-day mark you've sold zero, **don't lower prices.** Re-read `01-gig-profile.md` Part 11 ("What NOT to do"). The cheap-price spiral kills more freelance practices than the silence does.

---

## The honest "what's still missing" list

This pack is comprehensive on positioning, pricing, costs, and the deck. It does **not** include:

- **Upwork proposal templates.** Three or four reusable cover-letter shapes, by prospect type. Add when you've sent 20+ proposals and notice patterns in what gets replies.
- **Discovery-call script.** A 30-minute call agenda — what to ask, what to demo, when to send pricing. Add after you've done 5 calls.
- **Contract / proposal templates.** `05-template-hardening-notes.md` lists the contractual clauses you'll want; the actual SOW / MSA template lives in your private vault, not in this repo.
- **Post-launch playbook.** When a client says "I want a fifth page" three months in, what's the upsell flow? Sketch in `02-pricing-tiers.md` (a la carte add-ons) but no full script yet.

None of these are blockers for landing client #1. They become useful around client #5–#10, when you start spotting your own repeated patterns. Don't pre-build them.

---

## What you (the operator) actually need to know about the tech

You vibe-coded the system, so here's the *one* paragraph of vocabulary you need so you don't sound lost on a sales call. Memorise it. Don't go further than this.

> "It's a Next.js website hosted on Vercel. Edits come in by phone, email, or SMS, get filtered through an automation hub (n8n) and Claude AI, and turn into preview builds the client approves with a tap. Nothing publishes without their approval. The whole pipeline is operator-managed — clients never touch GitHub or AI keys, ever."

If a prospect asks anything more technical than that, the right answer is: *"That's the engineering side — the upshot for you is [X]. Want me to show you a 2-minute demo on lumivara-forge.com instead?"* You're not lying about anything; you're just not letting the conversation drift into your weak spot.

For the operator setup itself (token rotation, n8n workflow imports, Vercel env vars), the playbook is `../mothership/06-operator-rebuild-prompt-v3.md`. Read it once before client #1; refer back during onboarding.

---

## How issue #86 maps to this pack

For traceability — every ask in [issue #86](https://github.com/palimkarakshay/lumivara-site/issues/86) is addressed somewhere in `docs/freelance/`. Cross-reference if you're auditing or re-quoting:

| Issue ask | Lives in |
|---|---|
| Detailed profile for Upwork / Fiverr / Contra | `01-gig-profile.md` Parts 1–9 |
| Understand potential customers | `01-gig-profile.md` Part 8 ("Who to say yes to, who to say no to") |
| Rates, timelines, scope of work | `02-pricing-tiers.md` (full ladder + add-ons) |
| Outcome-focused, not tech-focused | All four core docs are deliberately written this way |
| Setup-fee + auto-managed subscription model | `02-pricing-tiers.md` Tier ladder |
| Plan to make it sustainable / quit day job | `03-cost-analysis.md` Parts B–D |
| Cost analysis for clients (their payments) | `02-pricing-tiers.md` |
| Cost analysis for you (Claude / Gemini / Codex / time) | `03-cost-analysis.md` Part A |
| Slide deck — Lumivara case + "imagine your site here" | `04-slide-deck.md` (rendered HTML + PDF) |
| Saved in project files | This whole folder |

---

*Last updated: 2026-04-29.*
