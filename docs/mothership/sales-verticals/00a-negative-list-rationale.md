<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SOURCE OF TRUTH

  This file is the canonical reasoning behind the "negative list" — the things
  Lumivara Forge will not sell, even when competitors in every vertical
  routinely do. The client-safe distillations of this reasoning live in the
  per-vertical pitch decks under `../../decks/vertical-pitches/` and in the
  master decks (`../../decks/06-master-deck.md` + `06a-master-deck-shareable.md`).
  Do NOT forward this file to a prospect. The vertical decks are the public face.

  Hard rule: every claim here that touches a regulator (FTC, Google, CPSO, LSO,
  CPA Ontario, RCDSO, COO, College of Physiotherapists, etc.) must trace back
  to a published policy. Where a claim is operator estimate, mark `[OE]`.
================================================================================
-->

# Negative-list rationale — why we won't sell SEO, AI chatbots, lead-gen, or the rest

> _Lane: 🛠 Pipeline — operator-only sales positioning; never copied to a client repo._

This doc is the **source of truth** behind every "what this is *not*" slide in the deck pack. Each per-vertical pitch deck distils a client-safe subset of what's below. When a prospect asks *"why won't you do X — your competitor does"*, the answer should be the operator-internal version of one of the entries here, tightened to that vertical's regulator and competitor language.

The structure: a **headline rejection** (what we won't sell), a **why** (regulator + platform-policy + economic reasoning), and a **what we do instead** (the structural alternative we charge for). The "what we do instead" line is the load-bearing part — without it, the negative list reads as scope-shrinkage rather than what it actually is, which is honesty about which dollars compound and which dollars don't.

Read this once before any first call. Re-read the matching subsection before any objection-handling reply that touches it.

---

## 1 · Why we won't promise Google rankings (the "why not SEO" entry)

**The pitch we refuse to make.** "Guaranteed first-page ranking on Google for [your vertical] in [your city]." Some variant of this line is the single most-pitched promise in the SMB-website vertical. It is also, in every professional-services context we sell into, either a regulator-cite-able compliance failure, a platform-TOS-cite-able policy failure, or both at once.

**Three reasons we won't make it:**

1. **The vertical regulator forbids it.** Every professional-services regulator we sell under treats ranking guarantees as either an unsupported comparative claim or an unsupported outcome claim:

   | Vertical | Regulator | Cited rule |
   |---|---|---|
   | Family medicine / GP | CPSO (ON) / state medical board | CPSO Policy *Advertising* §2 — no comparative or unsupported outcome claims |
   | Dentistry | RCDSO (ON) / ADA Code of Professional Conduct | RCDSO Standard of Practice *Advertising* §6 — no superlatives or unverifiable claims |
   | Law | LSO (ON) §4.2 / state-bar Model Rule 7.1 | "No marketing that is false, misleading, confusing or that includes guarantees of results" |
   | Accounting | CPA Ontario Rule 402 / IRS Treasury Circular 230 §10.30 | No advertising containing false, fraudulent, or misleading statements |
   | Physiotherapy / chiropractic | College of Physiotherapists of Ontario *Advertising and Marketing* | No outcome claims, no comparative claims |
   | Optometry | College of Optometrists / state board | No outcome claims; FTC Contact Lens Rule for CL pages specifically |

   A vendor pitching "guaranteed first-page" is implicitly making the licensee co-signer of that claim. The licensee, not the vendor, gets cited.

2. **Google itself rejects it.** Google's *Search Essentials* (the canonical policy doc, formerly *Webmaster Guidelines*) state plainly: *no SEO firm can guarantee a ranking on Google.* Vendors who do are typically (a) buying paid-search placements and calling them SEO, (b) ranking for vanity long-tail terms with no buyer intent, or (c) using black-hat tactics that get the site penalised six months in. We've seen all three.

3. **The SERP itself is becoming irrelevant.** Google AI Overviews / AI Mode answer ~30–40% [OE — directional from public LLM-search-share studies; verify before quoting] of informational queries before a click. ChatGPT, Perplexity, and Claude are routing intent away from the SERP entirely. "Rank #1" thinking is already obsolete; what surfaces in the new answer engines is structurally good content with clean schema, not high-keyword-density landing pages.

**What we *do* instead — the work that compounds in both the old SERP and the new answer engines:**

- **Core Web Vitals ≥ 90 mobile.** Google has confirmed CWV is a ranking signal. Lighthouse is the gate; every preview build runs it.
- **JSON-LD structured data** for every entity that vertical's SERP cares about — `LocalBusiness`, `Physician` / `Dentist` / `Optometrist` / `LegalService` / `AccountingService`, `Service`, `OpeningHoursSpecification`, `MedicalProcedure`, `Review`. The schema is what AI Overviews quote.
- **Accessibility (WCAG 2.1 AA).** Google has been increasingly explicit that inaccessible pages are demoted; the EU Accessibility Act now requires it for any business serving EU customers, and `axe-core` runs on every preview build.
- **301-redirect map at migration + sitemap submission + 30-day post-launch ranking-monitor.** Where rank slips, we patch within 7 days.
- **Content freshness.** The monthly improvement run ships 3–5 small content updates from licensee dictation. Google's freshness signal favours sites that update; most SMBs in our verticals haven't shipped a content update in 2 years.
- **Local-pack hygiene.** Name / address / phone consistency across Google Business Profile, Apple Maps, Bing Places, Yelp, Healthgrades / Avvo / FindLaw / etc. as appropriate to the vertical.

**The pricing posture.** There is no "SEO retainer" line on the licensee's invoice. The work above is in the standard monthly improvement run. We charge for the structural work; we refuse to charge for the magic words.

**The lines we will not cross even if asked:**

- Buying backlinks (Google spam policy, manual penalty risk).
- Paid guest-post networks / PBN tactics (same).
- Hidden-text or cloaking (same).
- Keyword-stuffed doorway pages (same).
- Review-gating, review-buying, fake-review patterns (covered separately in §5).
- Promising a rank position, a lead volume, a conversion rate, or a revenue number we don't control.

When a prospect tells us a previous vendor offered any of the above, that prospect is almost always already half-penalised and doesn't yet know it. The migration plan includes a Google Search Console audit for residual-penalty signals.

---

## 2 · Why we won't ship a public-facing AI chatbot

**The pitch we refuse to make.** "An AI receptionist on your homepage that answers patient / client / customer questions 24/7."

**Why we won't:**

- **Scope-of-practice liability.** A chatbot that doesn't know your licensure scope will generate clinical, legal, or financial advice. The licensee carries the liability; the vendor carries none.
- **Regulator advertising-rule capture.** A chatbot is, in regulator language, "marketing communication." The same rules that govern your homepage copy apply to every utterance the bot ever makes. There is no vendor that lints every chatbot turn against CPSO / RCDSO / LSO / CPA / COO / college rules.
- **Privilege and PHI / PII capture.** A bot that remembers conversation context becomes a discoverable record. In legal, that's a privilege-exposure problem; in healthcare, that's a covered-entity problem (HIPAA / PHIPA).
- **Hallucination cost.** The most-publicised failure mode of LLM-on-the-homepage in 2024–25 was a Canadian airline being held legally liable for a chatbot's fabricated bereavement-fare policy (*Moffatt v. Air Canada*, 2024 BCCRT 149). The court made clear the licensee, not the vendor, owns the bot's output.

**What we *do* instead.** AI lives operator-side, in the editorial pipeline that prepares your changes. Your patients / clients / customers see a normal website with real Book Now / Contact buttons. The AI never speaks to them; it speaks only to us, when we are preparing your edits. The lint, the policy review, and the human-in-the-loop publish gate all run before any AI output ever reaches the public.

---

## 3 · Why we won't ghost-write your professional content

**The pitch we refuse to make.** "Set-and-forget content marketing — we'll write 4 articles a month for your blog under your name."

**Why we won't:**

- **Google E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness).** Google's *Quality Rater Guidelines* now explicitly demote content where the named author lacks demonstrable first-hand expertise. Ghost-written professional content scores low, and Google is increasingly able to tell. The 2023 *Helpful Content Update* (now folded into core ranking) is the exact mechanism that punishes this.
- **Vertical regulator capture.** CPSO, RCDSO, LSO, CPA Ontario, COO et al. all treat unsupported claims in professional content as advertising failures. A ghost-writer who doesn't know the case law / clinical guideline / GAAP standard / professional-board policy *will* generate an unsupported claim eventually.
- **Misinformation liability.** A medical / legal / financial article published under a licensee's name carries the licensee's professional liability. Vendors who pitch "we'll write it for you" are pitching the licensee to take that liability for vendor-generated text.

**What we *do* instead.** The licensee dictates (15-second voice memo or a paragraph in the inbox). The pipeline structures, formats, schema-tags, and publishes. The licensee is the genuine author; the pipeline is the typist. The 3–5 content shipments per month inside the monthly improvement run are all licensee-dictated; we do not invent professional authority.

---

## 4 · Why we won't guarantee lead volumes

**The pitch we refuse to make.** "We'll deliver X qualified leads / new patients / new clients per month, guaranteed."

**Why we won't:**

- **We don't control demand.** Lead volume is a function of local market size, your reputation, your insurance / panel acceptance, your vertical's macro tide, the weather, your competitors' move at any given moment, and twenty other variables the website can influence but does not determine.
- **The math doesn't survive scrutiny.** Vendors who guarantee lead volumes typically do so on a "you don't pay until N leads" model where the bar for "qualified" is so loose that almost any form fill counts. By the time the licensee realises the leads are noise, they've paid 6 months of retainer.
- **The ones who hit the number, do so by buying paid ads on the licensee's dime.** Which means the licensee is paying twice: a "guaranteed-leads" retainer and the ad spend feeding it.

**What we *do* instead.** We control structural conversion. We can tell you what your conversion was last month, where the drop-off is, and what the next experiment should be. We are not in the demand-generation business; we are in the demand-conversion business. If your demand is genuinely below your capacity, the right answer is paid ads run by an ads specialist (we refer), not us pretending we can manufacture demand.

---

## 5 · Why we won't run review-gating or "reputation management"

**The pitch we refuse to make.** "We'll filter unhappy customers before they post a review, and only push happy customers to Google."

**Why we won't:**

- **Review-gating violates platform terms.** Google's *Review Policies* (2024) explicitly prohibit "review gating" — the practice of selectively soliciting positive reviews while suppressing negative ones. Yelp's *Don't Ask for Reviews* policy is even stricter; a violation can lead to a "Consumer Alert" badge on the listing that materially depresses traffic.
- **It violates the FTC.** The FTC *Endorsement Guides* (final rule 2024) and the related rule on *Reviews and Testimonials* prohibit paying for, gating, or suppressing consumer reviews; first violations are now monetary penalties. The Canadian Competition Bureau has taken parallel action under the *Competition Act* §52 and §74.01.
- **It violates the vertical regulator.** Most professional-services boards (CPSO / RCDSO / LSO / etc.) treat selectively-curated testimonials as misleading advertising.

**What we *do* instead.** Honest review collection. Every patient / client / customer gets a single, neutral post-visit invitation; nobody is filtered. The aggregated star rating is what it is. Sites that ship honest review collection typically see 3–6× monthly review volume in the first quarter — without any of the legal / platform-policy risk.

---

## 6 · Why we won't run paid ads (Google Ads, Meta, LinkedIn, programmatic)

**The pitch we refuse to make.** "We'll handle your paid ads as part of the monthly retainer."

**Why we won't:**

- **Different skill, different vendor incentives.** Paid-search managers optimise CAC and LTV against ad-platform tooling; site-builders optimise structural conversion. The skills overlap at the page-level (landing-page optimisation) but the day-to-day is genuinely different work.
- **Conflict with a clean retainer.** Ad spend ratchets up; retainers don't. A retainer that bundles ads creates an incentive to over-spend on ads (to justify the retainer) or to under-spend (to keep margin). Both serve the vendor, not the licensee.
- **The licensee's ad account is the licensee's.** We do not want to be the entity holding the ad account password; that's a vendor-lock-in pattern we deliberately avoid for hosting and refuse to introduce for ads.

**What we *do* instead.** We refer to a partner ads agency on a non-revenue-share basis. We share landing-page conversion data with that agency; the agency runs the ad account; the licensee pays the agency directly.

---

## 7 · Why we won't manage your social media

**The pitch we refuse to make.** "We'll post 3 times a week on Instagram / LinkedIn / TikTok / Facebook for you."

**Why we won't:**

- **Channel risk.** Social platforms can suspend accounts unilaterally, change algorithms unilaterally, or shut down entirely (Vine, Google+, Periscope, etc.). Channels are not owned property; the website is.
- **Voice-matching is operator-intensive and doesn't compound.** A social post that goes viral this week has zero residual SEO value next week. Site content compounds; social posts don't.
- **It's not our lane.** Social-content shops exist; they're better at it than we are.

**What we *do* instead.** We make sure every social post links cleanly to a canonical page on the licensee's site (Open Graph, Twitter Card, Schema.org `Article`). The licensee owns the social account; we own the page being linked to.

---

## 8 · Why we won't replace your EMR / case-management / PMS / practice-management platform

**The pitch we refuse to make.** "All-in-one — your website, your scheduling, your EMR, your CRM, all in one platform."

**Why we won't:**

- **Covered-entity scope.** EMR / case-management / PMS systems hold PHI, privileged client matter, or financial-services-regulated data. Replacing them means becoming a HIPAA / PHIPA / PIPEDA / SOX / FINTRAC covered entity. We are deliberately not that.
- **Switching cost is the licensee's leverage, not ours.** A licensee who can't switch their EMR is captive. We don't want to manufacture that captivity for our own benefit; the right vendors for those tools are domain specialists.
- **Vendor lock-in pattern.** All-in-one platforms are the textbook walled-garden play. The promise is convenience; the cost is a 5-year exit. Squarespace / Wix / Webflow are the website-side version of this; Solv / Mindbody / Practice Fusion / Clio Grow / TaxDome / etc. are the vertical-tool versions.

**What we *do* instead.** We integrate. Deep-link buttons into the licensee's existing EMR / case-mgmt / PMS scheduler. Webhook from contact form to the licensee's CRM. The licensee keeps their tool relationship; we keep ours.

---

## 9 · Why we won't sell a "white-label reseller" or "agency partner" tier

**The pitch we refuse to make.** "License the platform, slap your brand on it, resell it to your clients."

**Why we won't:**

- **Capacity math.** The whole platform is sized for ~30 direct engagements at saturation. White-labelling multiplies that load through a partner with no incentive to ship cleanly.
- **Quality drift.** A white-label partner cannot enforce the lint stack, the publish gate, or the dual-lane separation. The brand on the front of the work is the partner's; the failure mode is on us.
- **It is not a moat.** White-label models commoditise the underlying tech in 18 months and eat the originator's margin.

**What we *do* instead.** Tier 4 (custom enterprise) exists at 2× T3 minimum and is quoted custom; it is not promoted, it is not white-labelled, and it is not on the public pricing page.

---

## 10 · Why we won't take equity-only or revenue-share deals

**The pitch we refuse to make.** "Free site, you give us X% of the business."

**Why we won't:**

- **Operator economics.** A 30-engagement book that pays cash compounds; an equity-only book ties working capital to client outcomes the operator does not control.
- **It distorts the work.** An equity-stake vendor will make decisions that favour their equity, not the licensee's interest. Cash-on-retainer aligns the incentives cleanly.
- **It fails the "if we go away" test.** A licensee who has paid us cash for delivered work owns that work. A licensee with an equity-tangled vendor relationship owns a lawsuit.

**What we *do* instead.** Cash retainer; clean exit on 30 days' notice; the licensee's domain, code, hosting, and content stay with the licensee.

---

## 11 · How to deploy this in a sales call

The negative list reads like a list of *what we won't do*. It is not. It is a list of *what every competitor in your vertical will lie to you about, and what we are giving you a structural alternative to.*

The structure of the live deployment in a sales call:

1. The prospect mentions a competitor's promise (rankings, leads, AI receptionist, content marketing, all-in-one).
2. The operator picks the matching section above and gives the **30-second** version: regulator + platform + economic reason + "what we do instead."
3. If the prospect pushes back, the operator gives the **2-minute** version: cite the specific regulator policy section and the specific platform TOS clause.
4. If the prospect *still* pushes back, the prospect is not in the buyer profile and the call ends graciously.

The negative list is a qualifier. Prospects who hear it and feel relief are buyers; prospects who hear it and feel withholding are not, and we don't want them.

---

## 12 · Where this content surfaces externally

| Surface | Distillation level | Owner |
|---|---|---|
| Per-vertical pitch deck (`../../decks/vertical-pitches/<vertical>.md`) | Two slides: "Why we won't sell you SEO" + "Other things vendors sell that we deliberately don't" | This file is the source of truth |
| Master deck (`../../decks/06-master-deck.md`) | One dedicated slide: "Why our negative list is detailed" | Inherits from §1–§10 above |
| Master deck — shareable companion (`../../decks/06a-master-deck-shareable.md`) | Same dedicated slide, generalised | Inherits from §1–§10 above |
| Advisor deck (`../../decks/05-advisor-deck.md`) | Reference inside Contested claim 6 ("over-engineered crap") rebuttal | Existing |
| Site copy (`../../../src/content/insights/`) | Future blog post: *"Why we won't promise you a #1 Google ranking"* | Pending — Phase 4 content seed |

The externally-visible content all reads from this file. When this file is updated, the affected slides need a re-render (`npx -y @marp-team/marp-cli --html <source.md> -o <output.html>`) and a `dual-lane-audit.sh` pass. See [`../../AI_CLAUDE_DESIGN_PLAYBOOK.md §1`](../../AI_CLAUDE_DESIGN_PLAYBOOK.md) for the rendering pipeline.

---

*Last updated: 2026-04-30 — initial draft. Captures the operator-side reasoning behind the per-vertical pitch decks' "What this is *not*" + "Why we won't sell you SEO" slides. Numbers in §1 footnoted as `[OE]` are directional and must be verified before quoting in any external surface.*
