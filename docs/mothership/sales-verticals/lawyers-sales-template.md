<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SALES PLAYBOOK

  Per-vertical sales positioning for **law** — solo practitioners and
  small firms (2-10 lawyers). Persona P1; default tier T2.

  Hard rules (inherited from `00-INDEX.md`):
    1. Never ships in a client repo.
    2. Never forwarded verbatim to a prospect.
    3. Numbers driving a pitch trace back to `../../research/03-source-bibliography.md`
       or are flagged inline `[OE]` / `[S]`.
================================================================================
-->

# Lawyers — solo + small-firm sales template

> _Lane: 🛠 Pipeline — operator-only sales positioning. Persona alignment: P1 ("premium solo / small-boutique professional", `../../research/04-client-personas.md §P1`). Default tier: T2._

---

## §1 — Snapshot

**Vertical.** Solo law practitioners and small firms (2–10 lawyers). Practice areas in scope: family law, real estate, wills & estates, immigration, business / corporate-commercial, employment law, civil litigation, personal injury, criminal defence, intellectual property. Out of scope: large multi-jurisdictional firms (procurement runs through marketing departments), in-house counsel, government counsel, public-defender / legal-aid clinics (different funding model).

**Persona alignment.** P1 — "the premium solo / small-boutique professional." The lawyer-as-buyer has the highest *understanding-of-the-stakes* of any vertical: they personally know what an ADA Title III claim costs to defend, they know what a regulatory complaint against them looks like, they know what their adversary's website looks like.

**Default tier.** Tier 2 (CAD $4,500 setup + $249/mo). Tier 3 if the firm has a careers / articling page, multi-language requirement (Ontario / Quebec / Florida / California), or a separate insights / news micro-site that publishes on a real cadence.

**Headline pain in one sentence.** "Updates take two weeks because the developer who built our site in 2020 has stopped returning calls; the firm we lose pitches to has a site that looks like 2026 and ours looks like 2018."

---

## §2 — Who they are

**Practice shape.**
- **Solo** — one lawyer, often working from a home office or a shared-services arrangement (e.g. Toronto's PSB Boisjoli legal-shared-space or US "law-bizdev" cooperatives). 1 paralegal or part-time admin support.
- **Small firm** — 2–10 lawyers, frequently 1–2 partners + associates + paralegals + 1–2 admin / receptionist. One physical office. Practice age 5–25 years.
- **Boutique** — 5–10 lawyers, single practice-area focus (employment-law boutique, IP boutique, family-law boutique). Often the highest-revenue-per-lawyer in the vertical.

**Geography (Lumivara Forge prospecting priority).**
1. **Southern Ontario primary** — Toronto, Mississauga, Oakville, Hamilton, Burlington, Markham, Vaughan, Ottawa. Dense LSO licensee population; ADA + AODA compliance leverage; warm-network sourcing.
2. **Canadian metro secondary** — Vancouver, Calgary, Montreal-anglo, Halifax, Winnipeg.
3. **US tertiary** — NY, NJ, MA, PA, DC, FL, TX, CA. The 1,021 NY ADA filings + 27% YoY federal trend (`[V] §B-ADA-Lawsuits`) lands harder here than any other vertical: lawyers personally understand the cost of the lawsuit they are exposed to.

**Practice age.** 8–25 years. Site built 2017–2021; the partner now ~45–60 years old. The "next-quarter refresh" backlog is the underlying mechanic.

**Owner archetype.** Detail-driven, evidence-driven, scepticism-default. Reads ABA Journal / The Lawyer's Daily / Slaw / Above the Law. Has been pitched a "law-firm SEO" service every quarter for a decade and has tuned out the entire genre. Will not respond to "double your inbound consultations" copy. Will respond to: *"the most-recent advertising-policy violation that LSO disciplined a firm for was a website testimonial. Your site has six. Let me show you where the line is."*

**Decision-maker(s).**
- Senior partner / sole practitioner is the budget holder.
- The **office manager / paralegal** is the operational lead. Same gate as doctors/dentists.
- In a multi-partner firm, partner equity-meeting cycle controls the "yes" pace; the deal can slip 30–60 days if the discovery call is held in the wrong week of the quarter.

---

## §3 — Core issues / pain points

In approximately the order they surface:

1. **"Our site looks dated and it's costing us pitches."** Lawyers describe this in revenue terms: a partner pitching against a competitor with newer-looking branding is materially behind on the impression-management game. This is the most consistent opener.

2. **"Every change takes two weeks and an invoice."** From `../../research/04-client-personas.md §P1`. The developer who built the site in 2020 takes 5–10 business days to make a one-line update and bills $200–$400. Small typo-fixes pile up indefinitely.

3. **"We can't update our practice-areas page from a phone."** A new associate joins, the partner needs to add their bio + a new practice area; the build/update cycle is the gating step.

4. **"Our blog / insights page hasn't been updated in 18 months."** Long-form content is a known SEO + thought-leadership multiplier in legal services; the firm has been unable to publish on a cadence because every article requires a developer round-trip.

5. **"ADA / AODA — we know exactly what that costs."** Distinct from doctors/dentists: lawyers have *personal* knowledge of the litigation cost. 3,117 federal ADA-website filings in 2025 (`[V] §B-ADA-Lawsuits`), typical settlement $25k-$75k USD, trial costs higher. Lawyers under-react to the 75%-abandoned-inquiries stat but over-react (correctly) to the lawsuit stat.

6. **"Testimonials and reviews — we have a compliance problem."** LSO Rules of Professional Conduct §4.2 (and equivalents in BC, AB, etc.) restrict marketing claims sharply. Many older sites carry testimonials that today's interpretation of the rule prohibits. The firm doesn't have a clean way to audit and update.

7. **"Our search rank slipped — we don't know why."** Sites with 36% mobile Core Web Vitals pass rate (`[S] §B-WP-CWV`) are penalised by Google's mobile-first indexing. Most older legal sites are on WordPress; many fail this gate.

8. **"Our 'meet the lawyers' page hurts more than it helps."** Photos from 2017, missing associate, no LSO / state-bar registration number visible (a regulator-policy issue), no clear practice-area tags, no consultation-booking CTA.

9. **"Bilingual / French content is half-translated."** Ontario firms targeting French-speaking clients in Ottawa or Toronto-North often have bilingual aspirations and English-only execution. Quebec firms have *legal* requirements (Bill 96) for French-equal-prominence.

10. **"Insights / case studies behind a 'Contact us' wall."** Older site architecture buried thought-leadership content behind a PDF download or a contact-form gate; modern legal-marketing best practice is to surface it openly. The firm knows this; the migration cost has been the blocker.

11. **"New-client intake form is a Word document we email."** The firm sends a 6-page Word document for new-client conflict checks, payment authorisations, retainer signatures. PIPEDA / state-privacy exposure is real.

---

## §4 — Basic requirements (table-stakes)

| # | Basic requirement | What "good" looks like |
|---|---|---|
| B1 | Mobile-first / accessible / fast | Lighthouse ≥ 90; axe 0 critical; AODA + ADA AA. |
| B2 | Practice-area pages — one per area | Real-estate, family, wills, etc. each as their own MDX page with `LegalService` JSON-LD. |
| B3 | Lawyer bios with credentials + LSO / state-bar # | Mandatory by regulator policy in some jurisdictions; trust-signal even where not. |
| B4 | Contact form / consultation-request flow | PIPEDA / state-privacy aware; conflict-of-interest preliminary check inline. |
| B5 | Insights / blog with at least an archive | Google rewards depth in this vertical; without an archive, ranking ceiling is low. |
| B6 | Phone, address, hours, parking notes | Boring but load-bearing — "is this firm reachable?" question. |
| B7 | LSO / state-bar specialist designations visible (where applicable) | LSO Specialist, Certified-Specialist, board-certified — these are *real* designations the rules permit you to claim. |
| B8 | Working contact form with a real auto-responder | "Thank you, we'll respond within 1 business day; meanwhile, please do not include confidential or privileged information until we've confirmed conflict-clearance." |
| B9 | Editable by office manager / paralegal from a phone | Phone-edit pipeline — the differentiator. |
| B10 | Search-engine basics — sitemap, structured data, redirects | Foundational; without these, SEO improvements are throwing money at a leaky bucket. |

---

## §5 — Aspirational requirements

| # | Aspirational | Why it lands | Tier-fit |
|---|---|---|---|
| A1 | Insights / commentary publishing on a cadence (1–4 articles/month) | Thought leadership is the strongest moat in legal. Phone-edit lets the partner dictate a 600-word commentary on a new case in the parking lot. | T2 |
| A2 | Multi-language site (English + French in ON/QC; English + Spanish in US-South/SW; English + Mandarin in GTA) | Quebec Bill 96; LSO bilingual-service requirements; market-driven in dense diaspora cities. | T3 |
| A3 | Articling / hiring page that actually recruits | Small-firm hiring crunch in 2026; articling-position competition is fierce. | T2 |
| A4 | Online intake with conflict-clearance pre-screen | Replaces the Word doc; structured + privacy-aware. | T3 add-on |
| A5 | Consultation booking integration (Calendly / Cal.com / Clio Grow) | Reduces "first contact" friction; lawyers know the cost of friction at the top of the funnel. | T2 add-on (CAD $200–$400) |
| A6 | "Recent matters / case results" page (where regulator allows) | LSO / state-bar restrictions on outcome claims must be respected; this is a *content lint* problem, not a feature. | T2 |
| A7 | Compliance dashboard (advertising-policy + a11y log) | T3 differentiator. The lawyer can show their LSO file or insurer a dated record of the policy lint + a11y scans. | T3 |
| A8 | Multiple-office / multi-practice-area tree | T3; relevant for firms that practice 4+ areas or have multi-city presence. | T3 |
| A9 | Client portal (limited — secure document share, billing) | Out of scope at T2; possible at T3 with explicit Clio / MyCase / PracticePanther wiring. | T3 |
| A10 | Newsletter sign-up + automated send (Resend / ConvertKit) | Low friction add-on; insights pages drive sign-ups. | T2 add-on |

---

## §6 — How Lumivara Forge covers basic + aspirational

| Requirement | Lumivara Forge mechanism |
|---|---|
| B1 a11y/perf | axe + Lighthouse CI on every preview; build fails if regressed. |
| B2 practice-area pages | MDX + `LegalService` JSON-LD; phone-edit-able. |
| B3 lawyer bios | MDX template; LSO / state-bar number is a required intake field. |
| B4 contact form | Resend; conflict-of-interest disclaimer built in; auto-redirect for privileged information. |
| B5 insights archive | MDX-based blog architecture; tag-faceting for practice-area; RSS feed for syndication. |
| B6 NAP | Structured data; phone-edit-able. |
| B7 specialist designations | Intake field; rendered with disclaimer text where regulator requires. |
| B8 contact-form auto-responder | Resend transactional template; copy reviewed against LSO / state-bar advertising rules. |
| B9 phone-edit | Core mechanic. |
| B10 SEO basics | Sitemap, schema markup, redirects-from-old-site as part of migration scope. |
| A1 publishing cadence | Monthly improvement run includes ghost-writing slot from partner dictation. |
| A2 multi-language | T3 default. |
| A3 articling page | MDX template + Resend application form. |
| A4 online intake | T3 add-on; structured + PIPEDA / state-privacy aware. |
| A5 consultation booking | Cal.com / Calendly / Clio Grow deep-link; we wrap, not replace. |
| A6 case-results page | Content-lint pass: outcome claims policy-compliant; we flag and you decide. |
| A7 compliance dashboard | T3 admin-only `/compliance` page. |
| A8 multi-office | T3 multi-site / location-tree. |
| A9 client portal | T3 explicit add-on; integrates with practice's existing case-mgmt platform. |
| A10 newsletter | Resend integration; T2 add-on. |

---

## §7 — Current problems and risks

| # | Failure mode | Concrete example |
|---|---|---|
| P1 | Stale practice-area / lawyer-bio content | Site lists Associate X who left 2 years ago; or claims a practice area the firm has stopped serving. Trust signal broken. |
| P2 | LSO / state-bar advertising-policy violation | Site says "best family lawyer in [city]" or carries a testimonial about a case. LSO §4.2 (or state-bar equivalent) prohibits both. Public regulator complaint risk. |
| P3 | AODA / ADA non-compliance | Same as doctors/dentists, with the added wrinkle that *lawyers* are visible defendants in ADA Title III suits more often than most professional services. |
| P4 | PIPEDA / state-privacy exposure on intake form | New-client form captures ID + retainer authorisation in plain text. Real privacy exposure. |
| P5 | Missing required disclosures | Some jurisdictions require firm name + address + LSO / state-bar registration + jurisdictional limitations on the website. Missing or buried = regulator-of-record audit. |
| P6 | Search-rank decay | Mobile CWV failure + missing structured data = ranking penalised by Google's mobile-first indexing. Inbound consultation traffic compresses 10–25% per year as competitors with newer sites overtake. |
| P7 | Outcome claims that violate the rules | "We've recovered $10M for our clients" or "98% success rate" — both prohibited or highly conditioned by LSO §4.2 and US state-bar equivalents. Disciplinary risk. |
| P8 | Bilingual non-compliance (Quebec / Ontario gov / federal contracts) | Quebec Bill 96 + LSO French-language services obligation. English-only firm targeting bilingual clients = reputational + regulator risk. |
| P9 | Vendor lock-in on domain / hosting | Firm signed a "we'll build your site and host it" deal in 2018. Domain is in vendor's name; release-fee opaque. |
| P10 | Confidentiality / cyber concerns from old plug-ins | WordPress plugins compromised in the wild; legal-vertical-specific supply chain attacks on plugins like "WP Lawyer Practice Management." `[S] §B-WP-Security`. |
| P11 | Insights backlog visible to clients | Last article 18 months ago is a *negative* trust signal — "is this firm still active?" |

---

## §8 — How Lumivara Forge mitigates each risk

| # | Mitigation |
|---|---|
| P1 → M1 | Phone-edit + monthly improvement run. Bio updates within 24 hours of the partner deciding. |
| P2 → M2 | LSO / state-bar advertising-policy lint as a structural content-review step. We flag superlatives, comparative claims, testimonial-of-case patterns. The partner decides; we don't unilaterally edit. |
| P3 → M3 | axe + Lighthouse CI; T3 compliance dashboard. |
| P4 → M4 | Form architecture rejects sensitive-info capture by default; conflict-of-interest disclaimer auto-inserted. Online intake with conflict-clearance pre-screen is a T3 add-on (BAA / DPA-aware vendor). |
| P5 → M5 | Required-disclosure block as a site-wide footer (LSO licensee number, address, jurisdictional limitations). Phone-edit-able. |
| P6 → M6 | Next.js + structured data + Vercel edge — Core Web Vitals targets baked into the architecture. |
| P7 → M7 | Outcome-claim lint; we flag and partner decides. We have a default rewrite library for compliant alternatives ("focus on" instead of "expert in"; "experience handling" instead of "specialised in" without designation). |
| P8 → M8 | T3 multi-language with shared content tree; both languages stay synchronised. |
| P9 → M9 | Dual-Lane Repo. Domain transferred to firm at engagement start. |
| P10 → M10 | Next.js architecture has no plugin layer. Dependencies pinned + dependabot-monitored + reviewed weekly. |
| P11 → M11 | Insights cadence is a retention move on T2; ghost-write 1–2 articles/month from partner dictation. |

---

## §9 — Regulator-of-record

**Ontario (primary territory).**
- **Law Society of Ontario (LSO).** *Rules of Professional Conduct* — particularly §4.2 (Marketing of Legal Services) and §4.3 (Marketing of Specialty). Forbids: comparative claims of superiority that cannot be factually verified, claims of being a "specialist" or "expert" without LSO Specialist designation, testimonials about specific cases / outcomes, claims of guaranteed outcomes, undignified or sensational marketing. *By-Law 7.1* covers business names — firm names with phrases like "Best" or "Leading" are scrutinised. **The 2017 amendments to §4.2 are the load-bearing recent rule** — prior practice tolerated case-testimonials; current practice does not. Verify current text against the LSO website at the time of pitch.
- **AODA + IASR (O. Reg. 191/11)** — WCAG 2.0 AA mandate at organisations of 50+ employees. Boutique firms cross 50 staff including support; partnerships at 10+ lawyers typically do.
- **PIPEDA + provincial privacy-law cross-walk** — see [`../../research/07-pipeda-breach-notification.md`](../../research/07-pipeda-breach-notification.md). Lawyers handle PII at a higher density than most professional services; intake / retainer information is sensitive.

**Other Canadian jurisdictions.**
- **Provincial law societies** (LSBC, LSA, LSS, LSM, LSNB, LSPEI, LSNL, LSNS, LSY, LSNT, LSNu) — each has a Code of Conduct with marketing rules; LSBC and LSA are particularly strict on testimonials.
- **Quebec — Barreau du Québec + Chambre des notaires.** Quebec Bill 96 (2022) extends French-language requirements; legal-services advertising must serve French content with equal prominence.

**United States.**
- **State bars** — every state has Rules of Professional Conduct adapted from the ABA Model Rules (notably Rule 7.1–7.5 on marketing). **Florida Bar Rule 4-7** is the strictest in the US; California (Rules 7.1–7.5), New York (Rule 7), Texas (Rule 7.04) follow with material variation.
- **ABA Model Rule 7.1** ("Communications Concerning a Lawyer's Services") + 7.2 (Advertising) + 7.3 (Solicitation) — base layer; state bars add jurisdictional variation.
- **ADA Title III** — same `[V] §B-ADA-Lawsuits` 3,117 / +27% / NY 1,021 stats. Lawyers as defendants in ADA suits is statistically *higher per capita* than most service sectors.
- **State accessibility statutes** — Unruh (CA), NY Human Rights Law (NY), New Jersey LAD — augment federal exposure.

The pitch sentence: *"You know what an LSO §4.2 / state-bar Rule 7.1 advertising-policy investigation costs your time and your reputation. You know what an ADA Title III defence costs in dollars. Right now, your compliance is your office manager's memory + your last-developer's defaults. After we ship, it's a property of the build pipeline — every published change runs through the policy lint and the a11y CI gate, and the audit trail is dated for your insurer or your LSO file."*

---

## §10 — Why now

| # | Number | Source | Pitch use |
|---|---|---|---|
| W1 | **3,117 federal-court ADA-website lawsuits in 2025; NY busiest at 1,021; +27% YoY** | `[V] §B-ADA-Lawsuits` | Highest-leverage angle. Lawyers know what each filing costs to defend. |
| W2 | **96% of legal-services consumers begin at a search engine** | `[V] §B-Law-Firm-Spend` | "If your search rank drops or your site fails mobile, you are invisible to 96% of the funnel." |
| W3 | **Average law firm spends ~$120k–$150k/yr on SEO marketing** | `[V] §B-Law-Firm-Spend` | "T2 ($249/mo + $4,500 setup) is 5–7% of what your peers already spend on SEO. We don't replace SEO; we fix the foundation that makes SEO work." |

---

## §11 — Why they should switch

**Lead with R4, R2, R1.** Footnote R5.

- **R4 — Cap the legal-liability surface.** Highest-leverage angle for the lawyer-as-buyer. ADA + LSO / state-bar advertising-policy + privacy = three interlocking exposures, all of which become properties of the pipeline.
- **R2 — Stop paying $200 per typo.** Lawyers track time in 6-minute increments and intuitively understand variable-cost lock-in. 24-month math is the straightforward closer.
- **R1 — Stop the silent decay.** 75% / `[V] §B-Outdated-75` lands. Lawyers personally have lost pitches to the firm with the better-looking site.
- **R5 (footnote) — Own everything you paid for.** Domain-lock fear is high in this vertical because the typical 2018-vendor relationship has often gone bad.

**Do NOT lead with R6** in this vertical. DesignJoy's $4,995/mo is not on a partner's radar. R7 is occasionally usable (engineering credibility) for IP / tech-counsel firms; not a default.

---

## §12 — Benefits

1. **Compliance becomes the system, not the memory.** LSO / state-bar advertising-policy lint, AODA / ADA CI gate, PIPEDA / state-privacy-aware form architecture, dated audit log. The partner can show this to their insurer, their LSO file, their ethics counsel.
2. **Insights cadence becomes possible.** Phone-edit + monthly improvement run = 1–2 articles a month from partner dictation. Thought-leadership compounds; over 12 months, the firm is materially more discoverable + more credible than the comparable firm that didn't ship.
3. **The pitch impression-management catches up.** Site reads 2026, not 2018. Boutique partners win pitches against bigger competitors because the site doesn't immediately disqualify them.

Subordinate benefits:
- Articling / hiring page does its job.
- Multi-language for Quebec / GTA / US-Hispanic markets.
- Domain and code in the firm's name; vendor lock-in retired.

---

## §13 — Financial analysis & cost-benefit

### Current spend (typical Canadian small law firm, 2–5 lawyers)

| Line item | Annual spend (CAD) | Source |
|---|---|---|
| "Law-firm marketing" agency / vendor (Findlaw / Justia / Scorpion / RankMyAttorney / local) | $6,000 – $24,000 | [S] legal-marketing vendor pricing; verify on prospect's contract |
| Per-edit invoicing on top ($150–$400 × 6–12/yr) | $1,800 – $4,800 | `[S] §B-Boutique-Agency` |
| Hosting / domain / WordPress maintenance | $400 – $1,200 | `[V] §B-Wix-Squarespace` + WP-host benchmarks |
| Reputation / review platform | $1,200 – $3,600 | [S] vendor pricing |
| AODA / ADA audit (one-off; recurring once flagged) | $2,000 – $6,000 | [OE] |
| Bar-association directory listings (Avvo / LawInfo / FindLaw / Justia) | $1,200 – $4,800 | [S] aggregations |
| Targeted Google Ads on practice areas | $12,000 – $60,000 | [S] vertical-specific benchmarks; varies by practice area |
| Content/SEO writing service (separate from agency) | $2,400 – $6,000 | [S] freelance-writer aggregations |
| **Total annual (status quo, excluding paid ads)** | **CAD $14,000 – $50,400/yr** | |

The *non-paid-ad* digital spend on a typical small law firm is already $14k–$50k. A reminder: `[V] §B-Law-Firm-Spend` shows the average law firm spends $120k–$150k *on SEO alone* — most of that is the agency line above plus paid search.

### Lumivara Forge T2 spend

- $4,500 setup + $2,988/yr retainer = **$10,476 over 24 months.**
- T2 + insights-cadence ghost-writing built into retainer + bilingual upgrade if needed (T3) = $13,500–$15,000 over 24 months.

### Headline arbitrage

| Metric | Status quo | Lumivara Forge T2 | Delta |
|---|---|---|---|
| Year-1 spend | $14,000 – $50,400 | $7,488 | **-$6,512 to -$42,912** |
| Year-2 spend | $14,000 – $50,400 | $2,988 | **-$11,012 to -$47,412** |
| 24-month cumulative | $28,000 – $100,800 | $10,476 | **-$17,524 to -$90,324** |

The arbitrage is large because the legal-marketing-vendor industry has historically priced on a "lawyers will pay anything for SEO" assumption. We don't sell SEO; we sell the foundation that makes SEO work, at a flat retainer.

### Single-client-acquired payback (the slide that closes lawyers)

The §P1 persona note already makes this argument crisp: *one client = tens of thousands in fees; the math is trivial.* Concrete numbers for a discovery call:

| Practice area | Per-client revenue | Per-client profit (approx, [S]; verify per-firm) |
|---|---|---|
| Real-estate transaction | $1,500 – $3,500 | $700 – $1,800 |
| Wills + estates package | $1,500 – $5,000 | $700 – $2,500 |
| Uncontested family / divorce | $3,000 – $8,000 | $1,500 – $4,000 |
| Contested family litigation | $20,000 – $80,000 | $8,000 – $40,000 |
| Civil litigation (mid-complexity) | $25,000 – $150,000 | $10,000 – $80,000 |
| Personal-injury contingency | $10,000 – $200,000+ | $5,000 – $100,000+ |
| Business / corporate-commercial transaction | $5,000 – $50,000 | $2,500 – $25,000 |
| Employment-law representation | $15,000 – $80,000 | $7,000 – $40,000 |

**The pitch sentence:** *"You need approximately **two real-estate clients** OR **one mid-complexity family litigation matter** OR **one corporate-commercial transaction** across 24 months to fully pay for the engagement. The avoided-ADA-defence cost ($25k–$75k typical settlement, more at trial) is potentially a multi-engagement payback in itself, in a single year."*

For US firms, swap CAD for USD; numbers move in the firm's favour because US per-matter fees are ~20–40% higher in equivalent practice areas.

---

## §14 — Risks of switching + how we de-risk

| Switching risk | How we de-risk |
|---|---|
| "Our SEO is foundational — what if rankings drop?" | 301-redirect map; sitemap submission; 30-day post-launch ranking-monitor on practice-area pages; if ranks slip, we patch within 7 days. The structural shift to Next.js + correct schema usually *improves* rankings within 60 days; we monitor + report. |
| "What if the AI writes something that violates LSO §4.2?" | We run advertising-policy lint on every published change. The AI never publishes directly — preview link → partner taps publish. If the lint flags a phrasing, the partner sees it before publish. The *human* (the partner) is always the policy-compliant author. |
| "What about confidential / privileged information?" | The site never captures privileged content by default. Contact form auto-disclaimer instructs the prospect not to include privileged information until conflict-cleared. The AI sees public marketing content; never client matters. |
| "Our practice-management is in Clio / MyCase — will this play nice?" | We integrate (deep-link consultation booking from Clio Grow / wrap a contact form to drop a Clio Grow lead). We don't replace the case-management; we wrap it. Practice-management stays your vendor relationship. |
| "We're a small firm; we don't need monthly improvements." | Two answers: (1) Insights cadence is the most under-appreciated revenue lever in legal — peers who publish 1–2 articles/month outpace those who don't. (2) If you genuinely don't need cadence, T1 ($99/mo for 5 phone-edits/month) is the right fit; we'll downsell you intentionally. |
| "What if we change our brand / firm name in 2 years?" | Phone-edit covers brand changes the same as any content change — 30 minutes for a global update. Legal name changes require updating disclosures + LSO licensee data; we handle it as part of monthly cadence at no extra cost. |
| "Our office manager is sceptical of new tools." | Adoption-drag mitigation: live onboarding install + multi-channel ingest (phone / web / email / SMS). If she prefers email, the pipeline accepts email. If she prefers a call to the operator, T2 priority response is 4 business hours. |

---

## §15 — Sales conversation flow

### Call 1 — Discovery (45 min, partner / sole practitioner + office manager)

1. **(10 min) "Walk me through how someone finds you and books a consultation today."** Map the funnel.
2. **(10 min) "What does your existing law-firm marketing vendor charge, and what's in the bundle?"** Surface the $14k–$50k status-quo cost.
3. **(10 min) "When was the last time you reviewed your testimonials / case-results / advertising-policy compliance?"** Surface §3 P6 / §7 P2 / P7. Lawyers typically discover their own non-compliance during this question.
4. **(10 min) ROI math sketch from §13 with their numbers.**
5. **(5 min) Close: tier confirmation; document checklist (registrar login, hosting login, current vendor contract); Call 2 schedule.**

### Call 2 — Proposal (30 min, partner; office manager last 10 min)

1. (5 min) Recap pain points.
2. (10 min) §13 ROI table with their numbers.
3. (10 min) §14 risk-of-switching walkthrough — every objection pre-empted.
4. (5 min) Office manager joins; workflow walkthrough.
5. **Close:** SOW + deposit. T2 + insights cadence default. No discount. Downsell to T1 only if budget objection genuine.

### Call 3 — Close + kickoff (20 min)

Same as doctors / dentists: SOW signature + deposit confirmation + intake call scheduling + phone-shortcut install live during the call.

---

## §16 — Objection handlers

**O1. "Our existing law-firm marketing vendor is on a 12-month contract."**
> "Two paths: (1) ride out the contract while we build in parallel; switch DNS at renewal — clean termination. (2) Most legal-marketing contracts have a 60-day-notice termination clause buried in the addendum; we review the contract on Call 1. If a clean exit costs more than 2 months of T2 retainer, we recommend (1)."

**O2. "We tried law-firm SEO before and it didn't work."**
> "We don't sell SEO. We sell the foundation that *makes SEO work* — Core Web Vitals targets, structured data, redirects, accessible markup, mobile-first architecture. Past law-firm-SEO vendors typically tried to bolt SEO services onto a broken foundation; we fix the foundation. SEO services on top of our work — yours or another vendor's — get a much higher conversion-of-effort."

**O3. "What about LSO Rule 4.2 — your AI doesn't know our marketing rules."**
> "Two answers: (1) Yes, the policy lint is configured per-jurisdiction with the actual rule text — we've encoded LSO §4.2, ABA Model Rule 7.1, FL Rule 4-7, NY Rule 7, CA Rules 7.1–7.5. (2) The lint *flags*; it doesn't unilaterally publish. The partner reviews the flagged phrasing before publish. The compliance decision is always the partner's. You can think of it as an over-cautious junior lawyer running an advertising-policy proofread on every change."

**O4. "Will our existing Clio Grow / Lawmatics / Lexicata intake stay?"**
> "Yes. We integrate with Clio Grow (deep-link consultation booking, lead-form-to-Clio webhook), Lawmatics, Lexicata. The intake / case-management vendor stays your vendor relationship. We are the website + the maintenance pipeline — we are not a CRM."

**O5. "What about the testimonials we have? They're real."**
> "Migrated, with a §4.2 compliance review. Where the testimonial discusses a specific case or outcome, we flag — current LSO interpretation since the 2017 amendments restricts this. Where the testimonial is a general practice-praise statement (e.g. 'Responsive, knowledgeable, professional'), it survives the policy review. The partner decides each one; we don't unilaterally drop content."

**O6. "Can you guarantee a 1st-page ranking for 'family lawyer in [city]'?"**
> "No vendor can — and any vendor that does is misrepresenting Google's policies and exposing you to LSO §4.2 'guaranteed outcome' implications by association. What we *can* do is structurally fix the things that suppress rankings: Core Web Vitals, schema markup, mobile usability, broken links, AODA failures (Google does penalise these). The structural fix is the work; ranking improvement is the consequence."

**O7. "We need a custom intake-form workflow that integrates with our specific case-management."**
> "T3 add-on. We scope it on Call 2 with your case-management vendor's API documentation in hand. Common scopes: Clio Grow webhook ($300–$600 setup), Lawmatics integration ($400–$800), Lexicata / Filevine API ($600–$1,200). The form architecture stays PIPEDA / state-privacy aware regardless of the case-management vendor."

**O8. "We have associates who write articles on substack already."**
> "Then we wire it. Substack RSS → your insights page; the partner's LinkedIn posts → an opt-in social feed; your articling-program announcements → the careers page. We don't fight with what works."

---

## §17 — Sources & citations

| Claim | Anchor | State |
|---|---|---|
| 75% / 71% / 72% / 57% web-decay | `§B-Outdated-75` | `[V]` |
| 3,117 ADA filings; +27% YoY; NY 1,021 | `§B-ADA-Lawsuits` | `[V]` |
| 95.9% / 56.8 errors WebAIM | `§B-WebAIM` | `[V]` |
| Boutique agency $75–$150/hr | `§B-Boutique-Agency` | `[S]` |
| WP 36% mobile CWV pass | `§B-WP-CWV` | `[S]` |
| Headless 50–70% load advantage | `§B-Headless-Perf` | `[S]` |
| Average law firm $120k–$150k/yr SEO; 96% search-start | `§B-Law-Firm-Spend` | `[V]` |
| LSO Rules of Professional Conduct §4.2 (2017 amendments) | LSO website — verify current revision before quoting | `[V]` (regulator publication) |
| ABA Model Rule 7.1; FL 4-7; CA 7.1–7.5; NY 7 | state bar publications — verify current revision | `[V]` (regulator publication) |
| Quebec Bill 96 — French equal-prominence | Loi modifiant la Charte de la langue française — primary statute | `[V]` |
| Per-matter legal fees by practice area | not in `03`; backfill with industry roll-ups (Clio Legal Trends Report, ABA Profile of the Profession) | `[S]` |
| 1,021 NY ADA filings (subset of 3,117 / `§B-ADA-Lawsuits`) | within `§B-ADA-Lawsuits` Notes | `[V]` |

**Operator follow-up:** file `area/research` issue to backfill per-matter fee aggregation row in `03-source-bibliography.md` (Clio Legal Trends Report and equivalents).

---

## §18 — Operator notes

**Never say.**
- "We can guarantee a #1 ranking." LSO §4.2 / state-bar 7.1 territory if the ranking is being implied as a quality claim.
- "Our AI writes your articles." Re-frame: AI assists the partner's own dictation; the partner is the author. The audit trail is preserved.
- "We do legal SEO." See O2 — we don't, and saying so creates expectations we can't meet.
- "Your testimonials are fine — we can keep them all." Even where a testimonial is current-rules-compliant, *the partner's signoff is mandatory*. Never imply we'll make compliance decisions for the lawyer.

**Watch for.**
- The firm with **>10 lawyers and a marketing director.** Agency-shaped; T3 minimum, and the marketing director frequently has a different vendor preference. Offer T3 once; if friction is high, refer.
- The firm in **active merger / acquisition discussion.** The buyer dictates vendor decisions; we are not a fit during a transition. Pause the engagement.
- The firm with a **public-facing controversy** (defending a high-profile client, ongoing professional-conduct complaint). Site work is not the priority during a controversy; the partner needs reputational counsel, not us.
- The firm where **the senior partner is 65+ and within 12 months of retirement.** Site rebuild is an unlikely use of partner attention; offer T1 (lower commitment); be willing to disqualify gracefully.

**After month 6 — what to upsell.**
1. **Insights cadence increase (no fee, retention).** First 6 months establish the rhythm; month 6+ the partner is dictating 2–4 articles/month and the SEO compounds.
2. **Multi-language (T3).** If the firm has been turning down French-speaking / Spanish-speaking / Mandarin-speaking inquiries.
3. **Articling / careers automation (T2 add-on, ~CAD $300).** Articling cycle is annual; the upgrade aligns with recruiting.
4. **Online intake with conflict-clearance (T3 add-on).** Replaces the Word document at month 9–12; a clean upsell.

**Where the deal dies.**
- The senior partner signs but the office manager wasn't on Call 1. Mitigation: refuse Call 2 without office-manager confirmed for Call 3.
- The firm wants per-edit billing. Drop them per `04-client-personas.md §A1`.
- The firm expects us to also do paid Google Ads on practice areas. Decline; refer.
- The firm is in active partner / equity restructure. Pause until structurally settled.

**Upsell cadence after month 12.**
- Month 12: T3 if multi-language or multi-office candidate.
- Month 18: refer-a-firm program — bar-association referral networks are dense and warm.
- Month 24: index-adjusted retainer renew (`docs/storefront/02-pricing-tiers.md`).

---

## §19 — Specific-target search heuristics (operator prospecting)

> _Operator-only research scaffolding. Specific firm names live in the operator's CRM._

### Where to look (Southern Ontario priority)

1. **LSO Public Lawyer & Paralegal Directory** filtered by city / practice area. Cross-walk against the evaluation rubric below.
2. **Google Business Profile local-3-pack** for "[practice area] lawyer in [city]" — positions 4–10 highest yield.
3. **CanLII** profile pages for lawyers — many older firms list a website link that proves it's been static for years.
4. **Avvo / Justia / Lawyers.com Canada listings** — firms at low star count with `<vendor>.com/lawyer/<slug>` template patterns.
5. **Local bar-association "find a lawyer" tools** (TLABC, OBA "Find a Lawyer," Hamilton Law Association) — directory entries with linked sites.

### Where to look (US-Northeast / Mid-Atlantic / California secondary)

1. **State bar public licensee lookup** — sort by metro area.
2. **Avvo / Justia / FindLaw / Lawyers.com profiles** — under-marketed solos / small firms; sort by review count ascending.
3. **NPI is medical-only** — not relevant here. **PACER** for lawyers with active federal cases — they are visible-but-busy; weak websites stand out.
4. **Google "intext: [practice-area] attorney [city]"** searches.

### Evaluation signals

```
[ ] Built before 2022 (footer copyright; Wayback first-snapshot)
[ ] Mobile Lighthouse < 70
[ ] axe DevTools shows ≥ 5 critical / serious a11y issues
[ ] Contact form is mailto: link or has no auto-responder copy
[ ] No LegalService / Attorney / LegalProfessional JSON-LD
[ ] Hours / address / phone disagrees with Google Business Profile
[ ] LSO / state-bar registration number missing or buried
[ ] No new content (insights / blog) in > 12 months
[ ] Testimonials about specific cases / outcomes (LSO §4.2 / state-bar 7.1
    flag)
[ ] Outcome claims like "98% success rate" or "millions recovered"
[ ] Vendor name visible in footer ("Powered by <vendor>")
[ ] No careers / articling page (or page is a 4-year-old PDF)
[ ] Bilingual aspiration with English-only execution (Quebec / Ontario)
[ ] No structured data for practice-area pages
```

**12+/14 = priority outreach. 8+/14 = strong prospect.**

### Vendor patterns historically dominant in this vertical

| Vendor pattern | Pitch they made (typical) | What they delivered | Why we differentiate |
|---|---|---|---|
| Legal-marketing specialist (FindLaw / Thomson Reuters / Justia / Scorpion / Mockingbird-class) | "Specialised legal SEO," "guaranteed first-page ranking," "your peers use us" | Templated site indistinguishable from peer firms; opaque SEO reporting; bundled directory listings the firm could buy direct for less; per-edit invoicing on top | Phone-edit unlimited; client owns code + domain; LSO §4.2 / state-bar 7.1 lint built in; we do *site hygiene that supports SEO*, not "SEO services" |
| Local agency that "also does law" | Custom design, "we'll be here for you" | One-shot custom build; agency not staffed for ongoing legal-policy compliance; per-edit billing | Retainer by design; structural compliance lint |
| WordPress + a "law-firm SEO bolt-on" (RankMyAttorney / JurisDigital / Nifty-class) | "Boost rankings + automate review collection" | Bolt-on subscription compounds on a decaying WP site | Maintained foundation; automation as add-on, not band-aid |
| DIY (Squarespace / Wix) | "Build it yourself, $17/mo" | Owner / paralegal / spouse spends weekends fighting the editor; 71% spotted as DIY | Phone-edit removes the labour; site doesn't read DIY |
| Bar-association template provider | "Free site as part of bar-membership benefits" | Cookie-cutter templated site; bar-association branding visible; design constrained to template | Real Next.js codebase, no template constraint, professional voice |

### Past-vendor pitch differentiation

> *"The legal-marketing-specialist vendors built their pricing on the assumption that lawyers will pay anything for SEO. They ARE expensive — $1k–$2k/mo bundles are standard. The work they do that's actually load-bearing — directory listings, content cadence, basic site hygiene — is a small fraction of what they bill. We don't do SEO services; we do the foundation that makes any SEO investment compound. Your existing SEO vendor (or your future one) sees better results on top of our work. The $14k–$50k/yr you're spending on the bundled vendor is the disagreement; let me show you the 24-month math."*

---

## §20 — Cross-references

- **Persona pack:** [`../../research/04-client-personas.md §P1`](../../research/04-client-personas.md)
- **Why-switch reasons:** [`../../research/05-reasons-to-switch-to-lumivara-forge.md §R4 §R2 §R1 §R5`](../../research/05-reasons-to-switch-to-lumivara-forge.md)
- **Honest drawbacks:** [`../../research/06-drawbacks-and-honest-risks.md §D1 §D5 §D8`](../../research/06-drawbacks-and-honest-risks.md)
- **PIPEDA breach-notification cross-walk:** [`../../research/07-pipeda-breach-notification.md`](../../research/07-pipeda-breach-notification.md)
- **Pricing tiers:** [`../../storefront/02-pricing-tiers.md`](../../storefront/02-pricing-tiers.md)
- **Cost analysis:** [`../../storefront/03-cost-analysis.md`](../../storefront/03-cost-analysis.md)
- **Source bibliography:** [`../../research/03-source-bibliography.md`](../../research/03-source-bibliography.md)
- **Engagement evidence log:** [`../19-engagement-evidence-log-template.md`](../19-engagement-evidence-log-template.md)
- **Prospective-client deck (P1 variant):** [`../../decks/04-prospective-client-deck.md`](../../decks/04-prospective-client-deck.md)
- **Sister verticals (doctors / dentists):** [`./doctors-sales-template.md`](./doctors-sales-template.md), [`./dentists-sales-template.md`](./dentists-sales-template.md)
- **Sales-vertical index:** [`./00-INDEX.md`](./00-INDEX.md)

---

*Last updated: 2026-04-30 — initial Full publication. Operator follow-up: backfill per-matter legal-fee aggregation row in `03-source-bibliography.md` from Clio Legal Trends Report (and equivalents) before externally quoting.*
