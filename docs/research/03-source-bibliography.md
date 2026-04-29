<!-- Single source of truth for every external citation used across decks and synthesis docs. -->

# 03 — Source Bibliography

Every load-bearing claim in `docs/decks/`, `docs/storefront/04-slide-deck.md`, or `docs/storefront/06-positioning-slide-deck.md` cites an anchor in this file. Each row records the URL, the claim it supports, the verification state, and the date of last verification.

> **Verification states.**
> - `[V]` — independently re-verified at the primary or near-primary source on the date listed. Safe for any deck.
> - `[S]` — cited from a secondary aggregator or vendor blog and not re-verified at a primary source. Safe for operator-internal decks; quote the source explicitly in any external deck.
> - `[C]` — claim is contested or superseded by newer data. Use the corrected figure noted in the *Notes* column, or drop the claim.

If a deck contains a number, percentage, or dollar figure not represented here, **it was added without a source** — re-verify before publication.

---

## A — Provenance

| Anchor | Artefact | Verified |
|---|---|---|
| `§B-Self` | This repo: `docs/storefront/`, `docs/mothership/`, `AGENTS.md`, `docs/AI_ROUTING.md` etc. | 2026-04-29 (by inspection) |
| `§B-PDF-1` | `raw/gemini-research-1-deck-validation-through-research.md` (Gemini share `b81281a954e2`) | 2026-04-29 captured |
| `§B-PDF-2` | `raw/gemini-research-2-validated-market-and-technical-viability.md` (Gemini share `9a91c1948a52`) | 2026-04-29 captured |

---

## B — Claim rows

### Consumer behaviour & web-decay

| Anchor | State | Claim | Primary URL | Verified | Notes |
|---|---|---|---|---|---|
| `§B-Outdated-75` | `[V]` | 75% of consumers have abandoned an online purchase or inquiry due to an outdated/unprofessional-looking website; 71% spot DIY at first click; 72% find SMB sites hard to navigate; 57% hit multiple errors | <https://www.prnewswire.com/news-releases/survey-finds-75-of-consumers-abandon-purchases-due-to-outdated-websites-302275970.html> | 2026-04-29 | HostingAdvice 2024 survey of 500 U.S. consumers, distributed via PRNewswire. Consistent across PRNewswire, MarTech Cube, HostingAdvice. |
| `§B-WebAIM` | `[V]` | 95.9% of WebAIM Million home pages had detected WCAG 2 failures in 2024, average 56.8 errors per page | <https://webaim.org/projects/million/2024/> | 2026-04-29 | Raw research used "96% / 51.4 errors"; 51.4 was an earlier WebAIM cohort. Decks use 95.9% / 56.8. |
| `§B-Page-Speed` | `[S]` | 40% of visitors abandon pages that take >3 s to load; 47% expect <2 s | (widely cited; Akamai/Google industry benchmarks) | not re-verified | Quote source if used externally. |
| `§B-SMB-Web-State` | `[S]` | ~60% of SMB sites are outdated; only ~22% fully mobile-optimised; ~30% considered modern + responsive | <https://dave-sloan.medium.com/only-30-of-small-businesses-have-mobile-friendly-websites-ad6ef9f71eb5> | not re-verified | Secondary aggregator. |
| `§B-Mobile-Share` | `[S]` | ~67% of global website visits originate on mobile; ~31% on desktop | <https://www.businessdasher.com/research/statistics-about-website/> | not re-verified | Aggregator; figure consistent with Statcounter trend, not re-verified at the primary source. |

### Compliance & litigation

| Anchor | State | Claim | Primary URL | Verified | Notes |
|---|---|---|---|---|---|
| `§B-ADA-Lawsuits` | `[V]` | 3,117 federal-court website-accessibility lawsuits in 2025 (+27% YoY from 2,452 in 2024); 36% of all ADA Title III filings; NY busiest with 1,021 | <https://www.adatitleiii.com/2026/03/federal-court-website-accessibility-lawsuit-filings-bounce-back-in-2025/> | 2026-04-29 | Seyfarth Shaw / ADA Title III Tracker, March 2026 report. Mirror at <https://www.jdsupra.com/legalnews/federal-court-website-accessibility-1182174/>. |

### Mobile + SMB owner behaviour

| Anchor | State | Claim | Primary URL | Verified | Notes |
|---|---|---|---|---|---|
| `§B-SMB-Mobile` | `[S]` | 66% of SMB owners use mobile technology; 50% cite "lack of skill" as primary barrier; 23% cite "lack of time" | <https://news.constantcontact.com/press-release-sixty-six-percent-small-business-owners-use-mobile-technology>, <https://www.prnewswire.com/news-releases/new-mobile-survey-data-shows-that-small-business-owners-see-revenue-and-growth-potential-in-mobile-applications-yet-less-than-10-percent-have-one-300048148.html> | not re-verified at primary | Constant Contact + Microsoft/PR Newswire SMB surveys; widely cited. |

### Competitor pricing

| Anchor | State | Claim | Primary URL | Verified | Notes |
|---|---|---|---|---|---|
| `§B-Wix-Squarespace` | `[V]` | DIY platforms: $17–$139/month inclusive of hosting; $240–$600/yr typical | <https://www.squarespace.com/pricing>, <https://www.wix.com/upgrade/website> | 2026-04-29 | Pricing pages on each vendor; ranges include intro pricing differences. |
| `§B-Boutique-Agency` | `[S]` | Boutique agencies: $6,000–$12,000 upfront + $75–$150/hr edits; $600–$3,000/yr maintenance | <https://gruffygoat.com/blog/small-business-website-cost>, <https://www.thewebfactory.us/blogs/how-much-does-a-website-cost-in-2025/> | not re-verified at primary | Industry roll-ups; Canadian-market specifics in Clickk's Australia-anchored guide differ. |
| `§B-DesignJoy` | `[V]` | Standard plan $4,995/month, Pro plan $7,995/month, Webflow add-on $999/month | <https://www.designjoy.co/> | 2026-04-29 | Re-verified directly at vendor pricing page. |
| `§B-WP-Buffs` | `[V]` | Five tiers, $79–$447/month; "Perform" plan ~$219/month is the most-popular tier; white-label partner discount ≈20% | <https://wpbuffs.com/plans/> | 2026-04-29 | Raw research used the older $89–$359 range — superseded. |

### Engineering & technical viability

| Anchor | State | Claim | Primary URL | Verified | Notes |
|---|---|---|---|---|---|
| `§B-Headless-Perf` | `[S]` | Headless architectures with modern JS frameworks: 50%–70% faster load times vs monolithic CMS; Lighthouse routinely ≥90 | <https://strapi.io/blog/headless-cms-vs-headless-word-press>, <https://www.contentstack.com/blog/all-about-headless/headless-cms-vs-traditional-discover-the-best-cms-for-your-business> | not re-verified | Vendor benchmarks; not an independent study. |
| `§B-WP-CWV` | `[S]` | Only 36% of WordPress sites pass mobile Core Web Vitals (2025) | <https://strapi.io/blog/headless-cms-vs-headless-word-press> | not re-verified | Secondary citation; HTTP Archive's official Web Almanac is the primary source to re-verify against. |
| `§B-WP-Security` | `[S]` | ~30,000 sites compromised daily; ~96.2% of compromised sites run WordPress | (Sucuri / Patchstack reports — secondary aggregations) | not re-verified | Quote source explicitly if used externally; the 96.2% figure is widely repeated but the original is a single Sucuri annual report. |
| `§B-n8n-MCP` | `[S]` | n8n is production-grade for multi-agent workflow orchestration with rate-limiting, manual approval nodes, MCP integration | <https://n8n.io/ai-agents/>, <https://blog.n8n.io/best-mcp-servers/> | not re-verified | Vendor docs. |
| `§B-SWE-bench` | `[S]` | SWE-bench Bash Only stress test shows top models fail ~33% on real GitHub issues; documented incidents include autonomous agents destroying production state | <https://www.mindstudio.ai/blog/claude-code-vs-n8n-agentic-workflows-comparison> | not re-verified | Secondary aggregation. The underlying SWE-bench paper + leaderboard is the primary. |
| `§B-Build-Effort` | `[S]` | ~150–300 engineering hours to harden the autonomous coding pipeline (multi-agent fallback + GitHub PR generation + Vercel deploy) | `raw/gemini-research-2-*.md` §4 | not re-verified | Estimate from the raw research artefact; consistent with this repo's existing P5–P7 phase plan. |

### Market sizing

| Anchor | State | Claim | Primary URL | Verified | Notes |
|---|---|---|---|---|---|
| `§B-Canada-SMB` | `[V]` | Canada has 1.29M small businesses (≈99.8% of all enterprises) — 2024 ISED key statistics; 1.10M of these are *employer* businesses | <https://ised-isde.canada.ca/site/sme-research-statistics/en/key-small-business-statistics/key-small-business-statistics-2024> | 2026-04-29 | Reconcile both figures: 1.29M is the inclusive number (employer + non-employer); 1.10M is employer-only. |
| `§B-MC-Market` | `[C]` | Global management-consulting services market 2024 valuation $161.2B; projected 5% CAGR to $247.7B by 2034 | <https://www.gminsights.com/industry-analysis/business-management-consulting-services-market> | not re-verified | **Contested.** Other 2024 valuations: Fortune Business Insights $466.68B; Zion $423.33B; Skyquest $397.45B; Maximize $303.10B; Market Reports World $183.78B. The investor deck cites the low end ($161.2B) and footnotes the range. |
| `§B-MC-Global-Count` | `[S]` | 2.8M+ management-consulting businesses globally | <https://www.ibisworld.com/global/number-of-businesses/global-management-consultants/1950/> | not re-verified | IBISWorld; secondary citation. |
| `§B-SMB-Web-Revenue` | `[S]` | SMBs with websites grow revenue ~40% faster than those without; 81% of shoppers research online before buying | <https://www.businessdasher.com/research/statistics-about-website/>, <https://marketingltb.com/blog/statistics/small-business-website-statistics/> | not re-verified | Secondary aggregations; primary studies vary in methodology. |

### Industry-specific budgets

| Anchor | State | Claim | Primary URL | Verified | Notes |
|---|---|---|---|---|---|
| `§B-Law-Firm-Spend` | `[V]` | Average law firm spends ~$120,000–$150,000/year on SEO; 96% of legal-services consumers begin at a search engine | <https://firstpagesage.com/reports/law-firm-seo-statistics/>, <https://www.onthemap.com/law-firm-marketing/budget/> | 2026-04-29 | First Page Sage 2024 + ON-The-Map; cross-confirmed by SeoProfy and Andava. |
| `§B-Dental-Spend` | `[S]` | Dental practices typically spend 5–10% of gross revenue on marketing; ~30–40% of that goes to website + SEO; for a $1M-rev practice, ≈$15k–$40k/yr on web | (industry aggregations — Pact Dental, Pearl Dental, ADA marketing reports) | not re-verified | Secondary; persona deck quotes the range, not a precise figure. |

### Solopreneur economics & valuation multiples

| Anchor | State | Claim | Primary URL | Verified | Notes |
|---|---|---|---|---|---|
| `§B-Solopreneur-Margin` | `[S]` | AI-leveraged solo operators can hold 65%–75% gross margins; traditional agency margins compress to 40–50% under headcount load; agency utilisation 75–90% | <https://almcorp.com/blog/make-money-ai-digital-agencies-2026/>, <https://prometai.app/blog/solopreneur-tech-stack-2026>, <https://www.parakeeto.com/blog/resource-utilization-capacity-planning-for-marketing-agency-2/> | not re-verified | Secondary; quote as a range, not a precise figure. |
| `§B-SaaS-Multiples` | `[V]` | Private SaaS / productized-service valuations typically 4×–10× revenue; vertical AI 9×–12× ARR for top performers; public SaaS index ~26× EBITDA in aggregate | <https://aventis-advisors.com/saas-valuation-multiples/>, <https://www.saas-capital.com/blog-posts/private-saas-company-valuations-multiples/>, <https://multiples.vc/insights/software-saas-valuation-multiples> | 2026-04-29 | Use the 4×–10× revenue band in private-investor materials. The "22.4× EBITDA / 22.3% AI premium" figure in raw research #2 is at the very top of the public-market band; do not quote without explicit context. |
| `§B-Founder-Burnout` | `[S]` | 73% of tech founders / startup execs hide burnout; ~65% of startup failures attributed to founder burnout (2025) | (multiple secondary citations; original is a 2025 startup-founder survey covered by industry press) | not re-verified | Persona-shaping for employee deck; quote as range. |

---

## C — Quarterly refresh checklist

Re-verify these high-risk rows every 90 days. They drive headline claims in the prospective-client and investor decks.

- [ ] `§B-ADA-Lawsuits` — Seyfarth annual update typically lands February/March
- [ ] `§B-WebAIM` — annual report drops in March/April
- [ ] `§B-DesignJoy` — pricing page can move
- [ ] `§B-WP-Buffs` — pricing page can move
- [ ] `§B-Canada-SMB` — ISED annual key statistics drop ~Q3
- [ ] `§B-Law-Firm-Spend` — First Page Sage annual update
- [ ] `§B-SaaS-Multiples` — SaaS Capital + Aventis Advisors annual updates

---

*Last updated: 2026-04-29 — initial assembly + 7-stat independent verification pass.*
