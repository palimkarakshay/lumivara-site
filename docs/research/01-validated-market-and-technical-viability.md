<!-- Synthesis layer between the raw Gemini outputs and the stakeholder decks. -->

# 01 — Validated Market & Technical Viability (Synthesis)

This is the operator-facing reconciliation of the two raw Gemini Deep Research outputs (`raw/gemini-research-1-*.md` and `raw/gemini-research-2-*.md`). It picks the load-bearing claims, verifies or downgrades each one against `03-source-bibliography.md`, and tells the deck author **which number to use in which deck**.

> **Reading rule.** Every numbered claim ends with one of:
> - `[V] §B-Anchor` — independently re-verified at the source on 2026-04-29; safe for any deck.
> - `[S] §B-Anchor` — cited but not re-verified; safe for operator-internal decks; quote the source in any external deck.
> - `[C] §B-Anchor` — claim is contested or superseded by newer data; use the corrected figure noted, or drop the claim.

`§B-Anchor` is the row anchor in [`03-source-bibliography.md`](./03-source-bibliography.md).

---

## §1 — Validated client benefits (used in client-facing deck and partner deck)

1. **75% of consumers have abandoned an online purchase or inquiry due to an outdated or unprofessional-looking website.** `[V] §B-Outdated-75` — HostingAdvice 2024 survey of 500 U.S. consumers, distributed via PRNewswire.
2. **71% of consumers can spot a DIY website immediately upon clicking.** `[V] §B-Outdated-75` (same survey, companion stat).
3. **72% of consumers find SMB websites difficult to navigate; 57% have hit multiple errors on them.** `[V] §B-Outdated-75` (same survey).
4. **3,117 federal-court website-accessibility lawsuits in 2025, +27% YoY from 2,452 in 2024; 36% of all ADA Title III filings.** `[V] §B-ADA-Lawsuits` — Seyfarth Shaw / ADA Title III Tracker (Feb 2026 report).
5. **95.9% of the WebAIM Million top-1M home pages had detected WCAG 2 failures in 2024, with an average of 56.8 errors per page.** `[V] §B-WebAIM` — *the deck-validation report's "96% / 51.4 errors" figure is partially stale; 56.8 is the correct average for 2024. Use 95.9% / 56.8.*
6. **40% of visitors abandon a site that takes >3 seconds to load; 47% expect <2-second loads.** `[S] §B-Page-Speed` — widely cited Google/Akamai industry stats; treat as illustrative until re-verified.
7. **Headless architectures with modern JS frameworks: 50%–70% faster load times than monolithic CMS, with Lighthouse scores routinely ≥90.** `[S] §B-Headless-Perf` — vendor benchmarks (Strapi, Contentstack, Optiweb), not an independent study.
8. **Only 36% of WordPress sites pass Google's Core Web Vitals on mobile (2025).** `[S] §B-WP-CWV` — secondary-source citation; not re-verified at a primary source.
9. **WordPress hosts ~96.2% of compromised sites; ~30,000 sites compromised daily.** `[S] §B-WP-Security` — widely cited Sucuri / Patchstack figures; secondary source.
10. **66% of small business owners use mobile technology; 50% cite "lack of skill" as the primary digital-adoption barrier; 23% cite "lack of time."** `[S] §B-SMB-Mobile` — Constant Contact / PRNewswire SMB surveys.

**Deck mapping.** Items 1, 4, 5 anchor the prospective-client deck (`docs/decks/04-prospective-client-deck.md` §"Why now"). Items 6–9 are quoted only with `[S]` source attribution. Item 10 supports the "Phone-as-CMS satisfies a measured demand" line in the partner and investor decks.

---

## §2 — Validated competitor pricing (used in every external deck)

| Alternative | What we publish in decks (verified 2026-04-29) | Verification |
|---|---|---|
| **DIY platforms (Wix, Squarespace, Hostinger)** | $17 – $139 / month including hosting; $240 – $600 / year typical; 71% of consumers spot a DIY immediately | `[V] §B-Wix-Squarespace` |
| **Traditional boutique agencies** | $6,000 – $12,000 upfront build + $75 – $150/hr for edits; $600 – $3,000/yr maintenance retainers | `[S] §B-Boutique-Agency` (industry roll-up; ranges vary by region) |
| **DesignJoy** | $4,995/mo (Standard) and $7,995/mo (Pro), with a $999/mo Webflow development add-on | `[V] §B-DesignJoy` — re-verified at designjoy.co on 2026-04-29 |
| **WP Buffs** | $79 – $447 / month across five tiers; "Perform" plan at $219/mo is the most-popular | `[V] §B-WP-Buffs` — re-verified at wpbuffs.com/plans on 2026-04-29; *the "$89–$359" figure in raw research is stale* |
| **Annual all-in cost — DIY** | $240 – $1,700 + the operator's own time | derived |
| **Annual all-in cost — boutique agency, year 2+** | $1,500 – $5,000 maintenance plus per-edit invoices | derived |
| **Annual all-in cost — Lumivara Forge T2** | CAD $4,500 setup + 12 × CAD $249 = CAD $7,488; CAD $2,988/yr in steady state | from `docs/freelance/02-pricing-tiers.md` |

The "missing middle" claim — that Lumivara Forge offers DesignJoy-class agility at a maintenance-tier price — is empirically supported by the same numbers above; it is not a marketing flourish.

---

## §3 — Validated market sizing (used in investor deck only)

The TAM/SAM framing the investor deck uses is **deliberately conservative**. Headline numbers:

1. **Canada: 1.29 million small businesses, ≈ 99.8% of all enterprises (2024).** `[V] §B-Canada-SMB` — ISED Key Small Business Statistics 2024 + StatCan; reconcile that 1.10M of these are *employer* businesses while 1.29M includes self-employed.
2. **Globally: 2.8M+ management-consulting businesses; 2024 sector value $161.2B with consensus 5–11% CAGR through 2034.** `[C] §B-MC-Market` — the $161.2B figure is on the **low end**; Fortune Business Insights, Zion, Market.us publish $300–$466B for 2024 using broader definitions. Investor deck cites the lower bound and footnotes the range.
3. **SMBs with websites grow revenue ~40% faster than those without; 81% of shoppers research a business online before purchase.** `[S] §B-SMB-Web-Revenue` — widely cited; secondary source.
4. **Law firms spend ~$120,000 – $150,000/year on SEO; 96% of legal-services consumers begin with a search engine.** `[V] §B-Law-Firm-Spend` — First Page Sage 2024 + ON-The-Map; verified.
5. **Dental practice marketing: 5–10% of gross revenue; for a $1M-rev practice, $50–$100k/yr; ~30–40% goes to website + SEO ($15–$40k/yr).** `[S] §B-Dental-Spend` — secondary-source aggregations; persona deck quotes the range, not a single number.

**Deck mapping.** §3 powers `docs/decks/01-investor-deck.md` (TAM/SAM slides) and the persona slide in `docs/decks/04-prospective-client-deck.md`.

---

## §4 — Validated technical viability (used in investor + partner + employee decks)

1. **The "Phone-as-CMS" architecture is real today.** n8n + Claude + GitHub Actions + Vercel previews are all production-grade primitives, not bleeding-edge research. Lumivara's own `lumivara-forge.com` runs the full pipeline. `[S] §B-n8n-MCP` — vendor docs.
2. **Multi-AI fallback (Claude → Gemini → OpenAI) is documented and live in this repo.** See `docs/AI_ROUTING.md`. `[V] §B-Self` — operator-internal, verified by inspection.
3. **Pattern C two-repo isolation (Pattern C Architecture) is locked.** See `docs/mothership/02b-pattern-c-architecture.md`. `[V] §B-Self`.
4. **AI hallucination is the single biggest engineering risk.** SWE-bench Bash Only stress test shows even strongest 2025/2026 models fail ~33% on real GitHub issues, and high-profile incidents have included an autonomous agent deleting a production database in seconds when staging boundaries were unclear. `[S] §B-SWE-bench` — secondary-source aggregation. The mitigation — Plan-then-Execute + tap-to-publish + Lighthouse/axe gates — is built in this repo.
5. **Required engineering effort to get from today's repo to production-hardened pipeline: ~150–300 hours.** `[S] §B-Build-Effort` — Gemini's estimate; consistent with this repo's existing P5–P7 phase plan in `docs/mothership/00-INDEX.md`.

---

## §5 — Validated solopreneur economics (used in investor + partner decks)

1. **Traditional agency margins compress to 40–50% under headcount load; AI-leveraged solo operators can hold 65–75% gross margins.** `[S] §B-Solopreneur-Margin` — secondary-source industry write-ups (Almcorp, PrometAI). Use as range, not a precise figure.
2. **At 30 clients × CAD $500/mo blended ARPU ≈ CAD $15,000 MRR ≈ CAD $180,000 ARR**, with operating overhead under CAD $700/mo at saturation — yielding ~95% gross margin pre-tax and pre-operator-comp. `[V] §B-Self` — derived directly from `docs/freelance/03-cost-analysis.md` Part D and `docs/mothership/18-capacity-and-unit-economics.md`.
3. **Private productized-service / AI-enabled-SaaS valuation multiples typically run 4–10× revenue.** `[V] §B-SaaS-Multiples` — SaaS Capital, Aventis Advisors, Multiples.vc 2025-2026 benchmarks. *The raw research's "22.4× EBITDA / 22.3% AI premium" figure is at the very top of the public-market band and must not be quoted in private-investor materials without explicit context.*

**Deck mapping.** §5 anchors the investor deck's ARR and unit-economics slides and the partner deck's profit-share discussion.

---

## §6 — Validated risk register (used in every internal deck)

1. **AI hallucination → broken code in production** — `[S] §B-SWE-bench`. Mitigation: Plan-then-Execute, Vercel preview gate, tap-to-publish, axe-core + Lighthouse CI gates (all in this repo).
2. **ADA / WCAG legal liability** — `[V] §B-ADA-Lawsuits`. Mitigation: programmatic accessibility testing in CI; carry E&O + cyber-liability insurance once over $50k revenue.
3. **Anthropic / Google / OpenAI provider outage** — `[V] §B-Self`. Mitigation: deterministic multi-AI fallback ladder.
4. **Operator burnout** — `[S] §B-Founder-Burnout` (2025 startup-founder burnout survey: 73% of tech founders hide burnout; 65% of startup failures attributed to it). Mitigation: 30-client cap, session-budget charter, weekly cadence, planned 2-week break before client #25.
5. **Vendor lock-in for the client** — structurally impossible by Pattern C: domain, code, hosting all in client's name. `[V] §B-Self`.
6. **Single bad client poisoning the queue** — `[V] §B-Self`. Mitigation: per-client rate limits, tier cadence, "say-no-to" filter.

**Deck mapping.** §6 directly powers `06-drawbacks-and-honest-risks.md` and the risk slides of every stakeholder deck.

---

*Last updated: 2026-04-29 — synthesis from raw outputs + 7-stat independent verification pass.*
