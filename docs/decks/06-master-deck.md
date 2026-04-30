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
  .small { font-size: 0.78em; color: #666; }
  .footnote { font-size: 0.72em; color: #888; }
  .center { text-align: center; }
---

<!-- _class: lead -->

# Lumivara Forge
### Master deck — the nine questions, one source of truth

What we sell, who we sell it to, who we sell against, where the business is going, and what it costs to get there.

<br/>

*Compiled 2026-04-30. Reconciles `docs/storefront/06-positioning-slide-deck.md` (operator-internal nine-questions deck) with the five stakeholder decks in `docs/decks/01`–`05`.*

<span class="small">Operator-scope deck — confidential. Stakeholder-specific subsets live in `docs/decks/01`–`05`. Every load-bearing statistic cites a `[V]` / `[S]` / `[C]` row in `docs/research/03-source-bibliography.md`.</span>

---

## How this deck is organised

Nine numbered sections, in this exact order, each with a section recap slide:

1. **Benefits** — what the customer gets out of it
2. **Differentiators** — what we provide that others don't
3. **Customer voice** — what prospects actually ask for
4. **Competitor claims** — what the alternatives say they offer
5. **End goal** — what this business is, fully grown
6. **Steps to get there** — milestones in order
7. **Project plan** — phased buildout, today through year 1
8. **Challenges** — risks that can knock us off course
9. **Resources required** — money, time, tooling, people

Closing slide collapses every section to a single line.

---

## How to read this deck by audience

| Audience | Read sections | Then read |
|---|---|---|
| Investor / strategic LP | 1, 2, 5, 7, 9 | `docs/decks/01-investor-deck.md` |
| Future co-operator | 1, 2, 5, 6, 8, 9 | `docs/decks/02-partner-deck.md` |
| First hire | 1, 2, 5, 7, 8 | `docs/decks/03-employee-deck.md` |
| Prospective client | 1, 3, 4 | `docs/decks/04-prospective-client-deck.md` |
| Senior advisor | 5, 6, 7, 8 | `docs/decks/05-advisor-deck.md` |
| Operator self-review | all nine | `docs/storefront/06-positioning-slide-deck.md` |

The audience-fit rule from `docs/decks/00-INDEX.md` still binds: this master deck is operator-scope. Do not hand it to a single audience without first selecting the matching stakeholder deck.

---

<!-- _class: lead -->

# 1 · Benefits for the customer

*What the small-business owner actually gets, in concrete terms.*

---

## The one-line promise

> A clean, fast, mobile-first marketing site for your business — that **you** edit from your phone, and that quietly improves itself every month, for a flat subscription fee.

Three services bundled, sold as one product:

- **Service A — the website itself.** Custom design, 3–7 pages, mobile + desktop, sub-2s load, accessibility built in.
- **Service B — the phone-edit system.** Submit a change from a home-screen shortcut → preview link arrives in seconds → tap to publish.
- **Service C — the always-improving subscription.** Monthly improvements, monitoring, a quarterly call about where the site goes next.

Source: `docs/storefront/01-gig-profile.md` Part 2.

---

## Six concrete benefits — verified

| # | Benefit | What the client experiences | Why it matters (verified) |
|---|---|---|---|
| 1 | **No decay.** | The site stays current because making it current is a 30-second job, not a $200 invoice. | 75% of consumers abandon outdated sites (`[V] §B-Outdated-75`). |
| 2 | **No developer phone calls.** | Edits go in by phone, email, or SMS. The laptop stays closed. | 50% of SMB owners cite "lack of skill" as primary digital-adoption barrier (`[S] §B-SMB-Mobile`). |
| 3 | **Predictable monthly cost.** | One flat fee covers AI, monitoring, edits, improvements. Zero surprise invoices. | Boutique agency edits run $75–$150/hr (`[S] §B-Boutique-Agency`). |
| 4 | **Full ownership.** | Code, domain, hosting account — all in the client's name on day one. | Pattern C two-repo isolation (`docs/mothership/02b-pattern-c-architecture.md`). |
| 5 | **Quality on autopilot.** | 90+ Lighthouse on every page. Accessibility regressions caught before they ship. | 95.9% of WebAIM-Million pages fail WCAG with 56.8 errors/page avg (`[V] §B-WebAIM`); 3,117 ADA web lawsuits in 2025, +27% YoY (`[V] §B-ADA-Lawsuits`). |
| 6 | **Nothing publishes without consent.** | Every change waits for a tap on the client's phone. | HITL gate mitigates the ~33% AI-coding-agent failure rate seen on SWE-bench (`[S] §B-SWE-bench`). |

Source rows: `docs/research/03-source-bibliography.md`. Pitch lines: `docs/storefront/04-slide-deck.md` slides 4–9 and `01-gig-profile.md` Part 6.

---

## The 24-month cost story (the benefit, in dollars)

|   | Traditional agency | DIY builder + freelancer | **Lumivara Forge** |
|---|---|---|---|
| Initial build | CAD $5,000 – $15,000 | $0 – $300 / mo + $1k–$5k freelancer | CAD $1,200 – $7,500 |
| Each edit after launch | $150 – $300 / change | self-serve OR per-edit invoice | included in subscription |
| Time per edit | 1 – 3 weeks | minutes (DIY) / 1 – 2 weeks (freelancer) | 1 – 4 hours |
| Quality maintenance | "phase 2" upsell | not offered | included monthly |
| **Total over 24 months (active SMB)** | **$15,000 – $30,000+** | **$5,000 – $12,000** with maintenance gaps | **$7,500 – $14,000** |

The retainer model isn't more expensive than the agency. It's cheaper, predictable, and the site is *better* every month instead of degrading. Versus DIY, the cost premium buys ownership of a real codebase and zero decay.

Source: `docs/storefront/04-slide-deck.md` cost-comparison slide.

---

## What clients say after 90 days

Composite from discovery follow-ups and the freelance gig pack:

> *"I haven't logged into a CMS in three months and the site is still fresh. I forgot what it felt like to ignore my website."* — P1 solo professional

> *"Last vendor charged me $180 to change a phone number. This one shipped a new pricing page in an afternoon."* — P2 local clinic

> *"My designer has access to the preview links. He approves the look; I approve the words. Nobody waits on a developer."* — P3 boutique firm

The benefit isn't "AI." It's **the gap between intent and a published change collapsing from weeks to minutes.**

Source paraphrases: `docs/storefront/00-quick-start.md` "Is this marketable?" + `04-slide-deck.md` testimonial slide.

---

## Section recap — Benefits

- The client gets a **real codebase** they own outright, not a templated rental.
- The client gets a **30-second edit loop** from their phone, not a 2-week dev queue.
- The client gets **monthly compounding improvements** for one flat fee, not à-la-carte invoices.
- The client gets **zero lock-in** — code, domain, hosting all in their name from day one.
- The client gets **legal-liability surface coverage** (axe-core CI gate) that DIY builders don't ship by default.

> Pitch line: *"Your website stops decaying — and you never call a developer for a typo again."*

---
