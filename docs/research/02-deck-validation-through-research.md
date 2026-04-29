<!-- Synthesis layer for deck-specific positioning claims. -->

# 02 — Deck Validation Through Research (Synthesis)

This file is the operator's **deck-by-deck audit trail**. It maps every load-bearing claim in each stakeholder deck back to a sourced row in `03-source-bibliography.md`. If a deck contains a claim not listed here, it was added without a source — flag it before publication.

> Sister doc to `01-validated-market-and-technical-viability.md`. Where `01` reconciles the raw research, `02` answers "what specifically is this deck arguing, and what backs each argument?"

---

## §A — Existing positioning deck (`docs/freelance/06-positioning-slide-deck.md`)

This is the operator-internal "nine questions" deck. The 2026-04-29 polish keeps the structure but inserts validated stats at six anchor points.

| Slide | Claim | Source |
|---|---|---|
| Section 1 — Benefits | 75% of consumers abandon outdated sites; 71% spot DIY at first click | `[V] §B-Outdated-75` |
| Section 1 — Benefits | 95.9% of WebAIM Million pages fail WCAG; 56.8 errors/page avg (2024) | `[V] §B-WebAIM` |
| Section 2 — Differentiators | Only 36% of WP sites pass mobile Core Web Vitals (2025) | `[S] §B-WP-CWV` |
| Section 4 — Competitor claims | DesignJoy $4,995–$7,995/mo + $999/mo Webflow add-on | `[V] §B-DesignJoy` |
| Section 4 — Competitor claims | WP Buffs $79–$447/mo across five tiers (2026 pricing) | `[V] §B-WP-Buffs` |
| Section 5 — End goal | 30 clients × CAD $500 blended → CAD $180k ARR; 95%+ pre-comp margin | derived from `docs/freelance/03-cost-analysis.md` Part D |

---

## §B — Existing client-facing deck (`docs/freelance/04-slide-deck.md`)

Outward-facing prospect deck. The 2026-04-29 polish adds a single "Why now" anchor slide with three validated stats and refreshes the cost-comparison table to include the verified WP Buffs and DesignJoy numbers.

| Slide | Claim | Source |
|---|---|---|
| New "Why now" slide | 75% of consumers abandon outdated/unprofessional sites | `[V] §B-Outdated-75` |
| New "Why now" slide | 3,117 federal ADA lawsuits in 2025 (+27% YoY) | `[V] §B-ADA-Lawsuits` |
| New "Why now" slide | Mobile-first reality: ~67% of global website visits are mobile | `[S] §B-Mobile-Share` |
| Existing cost-comparison slide | Refresh: WP Buffs $79–$447/mo; agency $6k–$12k upfront + $75–$150/hr edits; DesignJoy $4,995–$7,995/mo + $999 add-on | `[V] §B-WP-Buffs`, `§B-Boutique-Agency`, `§B-DesignJoy` |

---

## §C — Investor deck (`docs/decks/01-investor-deck.md`)

External-facing. Every claim is `[V]` or carries a footnote.

| Slide | Claim | Source |
|---|---|---|
| TAM | 1.29M Canadian small businesses ≈ 99.8% of all enterprises (2024) | `[V] §B-Canada-SMB` |
| TAM (footnoted) | Global management-consulting market $161.2B in 2024 (low-end estimate; range $161B–$466B across firms) | `[C] §B-MC-Market` |
| ICP — legal | Average law firm spends ~$120k–$150k/year on SEO; 96% of legal consumers start at a search engine | `[V] §B-Law-Firm-Spend` |
| ICP — dental | Dental practices spend 5–10% of gross on marketing; ~30–40% goes to website + SEO | `[S] §B-Dental-Spend` |
| Unit economics | 30 × CAD $500 ARPU = CAD $180k ARR; pre-comp gross margin ~95% | derived from `docs/freelance/03-cost-analysis.md` Part D |
| Comparable multiples | Private productized SaaS / AI-enabled services: 4–10× revenue | `[V] §B-SaaS-Multiples` |
| Risk | AI hallucination — SWE-bench Bash Only ~33% failure | `[S] §B-SWE-bench` |
| Risk | ADA litigation: 3,117 federal-court filings in 2025 | `[V] §B-ADA-Lawsuits` |

---

## §D — Partner deck (`docs/decks/02-partner-deck.md`)

For someone joining as a co-operator (operations + maintenance + benefit-sharing). All claims are operator-known except the market-context slides, which match the investor deck.

| Slide | Claim | Source |
|---|---|---|
| Why this exists | 60% of small business sites are outdated; only 22% fully mobile-optimised | `[S] §B-SMB-Web-State` |
| Why now | 75% of consumers abandon outdated sites; ADA filings +27% YoY | `[V] §B-Outdated-75`, `§B-ADA-Lawsuits` |
| Operating cadence | Tier cadence + session-budget charter | `[V] §B-Self` (`docs/mothership/04-tier-based-agent-cadence.md`, `AGENTS.md`) |
| Capacity cliffs | Cliff 1 / 4 / 5 (Anthropic plan steps) at clients 6 / 16 / 26 | `[V] §B-Self` (`docs/mothership/18-capacity-and-unit-economics.md §6`) |
| Profit share — illustrative | 30 × CAD $500 = CAD $180k ARR; ~95% gross margin pre-comp | derived |

---

## §E — Employee deck (`docs/decks/03-employee-deck.md`)

For a future first hire (likely contract engineer or VA). Claims are mostly operator-internal.

| Slide | Claim | Source |
|---|---|---|
| Culture pitch | 73% of tech founders hide burnout; 65% of startup failures attributed to founder burnout | `[S] §B-Founder-Burnout` |
| What you'll work on | Pattern C, multi-AI router, n8n, admin portal | `[V] §B-Self` |
| Compensation framing | Tier-cadence and capacity cliffs determine when 2nd-engineer slot opens (Cliff 5, client #26) | `[V] §B-Self` |

---

## §F — Prospective-client deck (`docs/decks/04-prospective-client-deck.md`)

External-facing. Persona-specific (lawyer / dentist / boutique consultant). Every claim must be `[V]` or carry a footnote.

| Slide | Claim | Source |
|---|---|---|
| Why now | 75% abandon outdated sites; 71% spot DIY immediately | `[V] §B-Outdated-75` |
| Why now | 95.9% of pages fail WCAG (2024 WebAIM Million); 3,117 ADA lawsuits in 2025 (+27%) | `[V] §B-WebAIM`, `§B-ADA-Lawsuits` |
| Cost comparison | WP Buffs $79–$447/mo; agency $6k–$12k + $75–$150/hr; DesignJoy $4,995/mo+ | `[V] §B-WP-Buffs`, `[V] §B-DesignJoy`, `[S] §B-Boutique-Agency` |
| ROI math (legal persona) | $120k–$150k/yr on SEO; one new client = tens of $k revenue | `[V] §B-Law-Firm-Spend` |
| ROI math (dental persona) | 5–10% gross on marketing; 30–40% of that on website + SEO | `[S] §B-Dental-Spend` |

---

## §G — Advisor / mentor deck (`docs/decks/05-advisor-deck.md`)

Confidential. For someone the operator is asking to pressure-test the model. The deck explicitly calls out the contested claims (`[C]`) and the unverified claims (`[S]`) so the advisor knows what to push on.

| Slide | What we're asking | What's *not* settled |
|---|---|---|
| Market sizing | Does our $161.2B TAM low-end framing hold up? | Range $161B–$466B across firms; methodology dispute |
| Margin claim | Is 95% pre-comp gross margin defensible at 30 clients? | Sensitivity to AI cost spike (`docs/mothership/18 §3`) |
| Hallucination posture | Are our HITL gates sufficient? | SWE-bench 33% failure rate is the load-bearing risk |
| Pricing | Are we under-priced vs. agency / over-priced vs. DIY? | Persona-specific; legal persona may bear 2× of T2 |

---

*Last updated: 2026-04-29.*
