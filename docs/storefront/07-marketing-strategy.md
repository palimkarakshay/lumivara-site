# 07 — Marketing Strategy, Tagline, Channel Plan, 90-Day Calendar

> **DRAFT — pending operator (Akshay) approval.** Sign off in the PR for issue #115
> or in this doc's "Approval checklist" section before treating any value here as
> locked. Until that happens, every tagline, ICP slice, and channel decision below
> is a *recommendation*, not a commitment.
>
> **Brand-name caveat.** Brand locked 2026-04-28 to **Lumivara Forge** (see
> `docs/mothership/15-terminology-and-brand.md §4`). The retired working
> name from earlier drafts (the "-Infotech" variant) must not appear in
> any public asset. Trademark availability check (CIPO Class 42 + USPTO)
> is still pending in `15 §5` and is the only remaining gate before
> registering `lumivara-forge.com` and `lumivara-forge.ca`.

This doc is the **canonical source** for how we sell Lumivara Forge: the locked
pitch + tagline, the ICP, the positioning matrix vs. competitors, the ranked
channel plan, and the first-90-day launch calendar. It synthesises material
already drafted across `docs/storefront/` rather than duplicating it; cross-refs
point you to the original copy when you need verbatim language.

---

## 1 · Tagline and one-line product pitch (locked candidates)

### Recommended canonical pair

- **Short tagline (≤70 characters, every platform bio):**
  > *Modern websites that update from your phone, not your inbox.*
  >
  > _57 characters. Source: `01-gig-profile.md` Part 3._

- **Long product pitch (one-line, every conversation opener):**
  > *I build websites for small businesses that don't fall apart between updates.
  > You can edit yours from your phone, and a small monthly fee keeps it
  > improving in the background.*
  >
  > _Source: `01-gig-profile.md` Part 1._

The two are designed to nest: the tagline is the bio version, the long pitch is
the elevator version. Both lead with the **outcome** (the site updates from a
phone, doesn't decay) and refuse to name the stack — see `01-gig-profile.md`
Part 11 ("Don't lead with the tech stack") for the rule.

### Rejected tagline variants (with reasoning)

| Variant | Source | Why it loses |
|---|---|---|
| *Senior software engineer · self-maintaining sites for small businesses* | `01-gig-profile.md` Part 3 | Leads with the operator's seniority. Prospect doesn't care; they care about their site. Useful as a LinkedIn headline, **not** as a tagline. |
| *I build small-business sites that improve themselves every month* | `01-gig-profile.md` Part 3 | Strong, but the recommended tagline is sharper because "phone, not your inbox" is a concrete, sensory contrast. "Improve themselves" is more abstract. |
| *Your website stops decaying — and you never call a developer for a typo again.* | `06-positioning-slide-deck.md` § Benefits recap | Excellent **subhead** under the recommended tagline; over 70 chars and contains a dash-pause that breaks the rhythm in a one-line slot. Demote to body copy. |
| *Other people sell you a website. We sell you a website that updates itself.* | `06-positioning-slide-deck.md` § Differentiators recap | Best for slide decks and outbound emails (positions against competitors); too long for a profile bio and uses "we" — every other doc uses "I". |

### Rejected long-pitch variants (with reasoning)

| Variant | Source | Why it loses |
|---|---|---|
| *I build small-business websites that you edit from your phone, and that improve themselves every month for a flat subscription fee.* | `00-quick-start.md` § "The pitch in one sentence" | Tighter than the recommended pitch but loses the **"don't fall apart between updates"** phrase, which is the single line that names the prospect's lived pain. Keep this version as a **fallback for character-limited slots** (Twitter bio, Fiverr gig sub-line). |
| *A clean, fast, mobile-first marketing site for your business — that you edit from your phone, and that quietly improves itself every month, for a flat subscription fee.* | `06-positioning-slide-deck.md` § "The one-line promise" | Beautiful but too long for spoken delivery. Keep for the deck-cover slide and the landing-page hero subhead, not for spoken openers. |
| Audience-specific variants (solo consultant / 5–25 staff firm / indie SaaS) | `01-gig-profile.md` Part 1 (variants) | Not rejected — kept as **second-line follow-ups** the operator picks based on the prospect in front of them. Use the canonical pitch first, then narrow to the audience variant if the prospect's segment is clear. |

**Approval ask:** sign off on the recommended pair above, or replace one or
both with a named variant. Either way, **lock once** — the rule from
`00-quick-start.md` is: *consistency is the brand.* Don't invent new tagline
copy per channel.

---

## 2 · Ideal Customer Profile (ICP)

### Primary ICP — solo professional services (the bullseye)

| Attribute | Detail |
|---|---|
| **Headcount** | 1 — the founder is the practice |
| **Industry** | HR consulting, executive coaching, therapy / counselling, accounting, bookkeeping, law (solo or 2-partner), independent financial advice |
| **Geography** | Canada (Ontario / GTA primary; Quebec deferred until French-language page is built — see `06-positioning-slide-deck.md` § Strategic risks), then US east coast |
| **Stage** | Either *relaunching* a practice (Squarespace / Wix site looks cheap) or *just-launched* and embarrassed to send the URL |
| **Trigger event** | Lost a deal because the site looked dated · changed their service line and can't update the page · agency invoice for a one-line fix arrived · finished a rebrand and the site doesn't match it yet |
| **Lived pain** | "I can't update my own site without calling someone." "Every fix is $200." "My intern said they'd do it and it's been three months." |
| **Tier mapping** | T1 (Autopilot Lite) → ~70%; T2 (Autopilot Pro) → ~30% as their practice grows |
| **Why they say yes** | Phone-edit autonomy + flat fee + the operator already runs the same system on their own site (`lumivara-forge.com` proof) |

Source: `01-gig-profile.md` Part 1 (variant for solo consultants) + Part 8.

### Secondary ICP — boutique services firms (5–25 staff)

| Attribute | Detail |
|---|---|
| **Headcount** | 5–25 |
| **Industry** | Local professional services (boutique law / accounting), small clinics / studios, design + creative shops with a marketing site that isn't their core product |
| **Trigger event** | "Site was built in 2019, our intern can't update it, our last invoice from the agency was eight hundred dollars for a paragraph change" |
| **Tier mapping** | T2 (Autopilot Pro) → ~70%; T3 (Business) → ~30% (multi-site, integrations) |
| **Why they say yes** | The firm has nobody to maintain the site internally; an agency retainer costs more than ours and still bills per-edit |

Source: `01-gig-profile.md` Part 1 (variant for 5–25 staff firms) + Part 8.

### Tertiary ICP — indie SaaS founders

| Attribute | Detail |
|---|---|
| **Headcount** | 1–3 (founder + maybe a designer or marketer) |
| **Industry** | Solo / pre-Series-A SaaS — marketing site, not the product itself |
| **Trigger event** | About to launch; need a marketing site in two weeks; want a real codebase they can hack on later, not a Webflow lock-in |
| **Tier mapping** | T2 setup; ~50% take the retainer once they've felt one round of changes |
| **Why they say yes** | Modern stack they can fork or extend; flat-fee retainer beats hiring a contractor for three hours per change |

Source: `01-gig-profile.md` Part 1 (variant for indie founders) + Part 8.

### Hard "not our customer" list

Pulled from `01-gig-profile.md` Part 8 — say no early, in writing, politely:

- **Agencies wanting white-label at half price** — only at full T4 rate, with a written credit clause.
- **E-commerce shops** ("I want a Shopify alternative") — wrong stack; refer.
- **Equity-only founders** — polite decline.
- **Enterprise** (>500 staff, RFPs, MSAs, vendor onboarding) — wrong channel for this practice.

A bad client costs more than ten good ones earn. The say-no list is the
strategy, not a limit.

---

## 3 · Positioning matrix

The four real competitors a prospect is comparing us against — what they
pitch, what they hide, and what we say in the conversation. Pulls competitor
claims from `06-positioning-slide-deck.md` § "Competitor pitch matrix" and
`04-slide-deck.md`.

| Competitor | Their pitch | Hidden cost / weakness | Our differentiator | What we say (verbatim conversation line) |
|---|---|---|---|---|
| **Squarespace / Wix / Webflow** | "Build a beautiful site in an afternoon, edit it yourself, no code." | Walled garden — site lives in their stack. Custom design ceiling. SEO and performance limits. Painful export if you ever leave. | Real codebase the **client owns outright** + custom design + same edit-yourself loop *plus* monthly improvements. | *"Yes, you can do it on Squarespace — and a quarter of small businesses do. The difference is you'd own real code, your site would look custom (not templated), and a fixed monthly fee bakes in the improvements you'd otherwise forget to ask for."* |
| **WordPress (DIY or via a freelancer)** | "Most popular CMS in the world. Endless plugins. Cheap to start." | Plugin sprawl, security patching, theme updates, hosting failures. Editing requires logging into WP admin. Ages badly. Freelancer disappears between fixes. | Modern stack (Next.js + Vercel) with no plugin upkeep + phone-as-CMS instead of WP admin + monthly improvement run that's already paid for. | *"WordPress works — until the plugin update breaks the contact form on a Sunday. Our system has no plugins, and editing happens from a phone shortcut, not a desktop CMS login. You also never call us 'because something broke' — that's covered by the monthly."* |
| **Boutique web agency** | "End-to-end design + build + monthly retainer for support." | Setup CAD $5–15k. Retainer pays for **availability**, not for actual edits — each substantial change still bills $150–$300. PMs and account-managers add overhead. | Setup at half-to-third the price. Retainer covers actual edits + monthly improvements + phone shortcut. One accountable operator, no PM layer. | *"An agency retainer pays them to be available. Ours pays for the work to actually get done — phone edits and monthly improvements both included. Compare 24 months of $200-per-edit invoices against our flat fee in the deck."* |
| **Freelance hourly dev (Upwork / Fiverr / network referral)** | "Custom build, your code, your ownership, $1–5k. I'm available if you need me." | After hand-off, every change is a Slack at 11pm or a custom invoice. No system to keep the site improving. The freelancer disappears or gets busy with another client. | Same custom build + ownership *plus* a phone-edit pipeline they don't have to remember to use *plus* monthly improvements that ship without being asked. | *"A freelancer builds you a site and disappears. We build the site **and** a system that keeps shipping small wins every month — without you needing to remember to email us. The retainer is the difference between a site that decays and one that compounds."* |

The wedge: nobody in the SMB price band offers **all four** of (a) real
codebase ownership, (b) edit-from-phone autonomy, (c) flat-fee predictability,
and (d) monthly improvement compounding. Source: `06-positioning-slide-deck.md`
§ "How they say they handle the four customer asks".

---

## 4 · Channel plan

Channels are ranked by **likelihood of yielding the first paying client**, not
by total reach. Reach is cheap; conversion-fit is rare.

| # | Channel | Weekly time budget | Primary asset needed | Success metric (first 90 days) | Why this channel for this ICP |
|---|---|---|---|---|---|
| 1 | **LinkedIn organic posts + warm DMs** | 3–5 hrs | One case study post per week + one "system win" demo per week. Direct DMs to 10 warm-network contacts in week 1. | ≥3 inbound replies; ≥1 discovery call booked | The primary ICP (solo consultants, boutique firms) lives on LinkedIn. The operator has a real network there. Highest signal-to-noise for the first 5 clients. |
| 2 | **Fiverr — Gig 1 (the headline gig)** | 2 hrs setup wk1, then 30 min/wk maintenance | Gig listing copy from `01-gig-profile.md` Part 5 + 30-second portrait video | ≥2 Fiverr inquiries by day 30; first paid order by day 60 | Volume of small-business buyers + built-in escrow + reviews accumulate fast. Low risk, decent conversion for tier-0/tier-1. |
| 3 | **Upwork proposals** | 3–4 hrs (5 proposals/day × 30 min) | Three reusable cover-letter shapes (TODO — `00-quick-start.md` "what's still missing") | ≥1 reply per 10 proposals; ≥1 paid contract by day 60 | Higher price ceiling than Fiverr; bid-based so each proposal is custom. Filter for Next.js / modern-stack jobs only. |
| 4 | **Toptal / Arc.dev / Lemon.io applications** | 2 hrs application wk1, then waiting | Portfolio link + lumivara-forge.com case study + enterprise systems experience claim (operator has it) | Accepted into ≥1 of the three by day 60 | 0% commission, vetted talent platforms, high rates. Once accepted, no cold prospecting. Long screening (2–4 weeks) — start the clock immediately. |
| 5 | **Direct partner referrals** | 1 hr | One-pager describing what we sell + the referral fee structure (TBD) | First referral conversation by day 45 | Brand designers, copywriters, accountants — the people whose clients also need a website. The referrer keeps a relationship; we get a warm intro. |
| 6 | **Cold email (audience-specific, low volume)** | 1–2 hrs | Three intro-email templates (see `assets/intro-email.md`) | Reply rate ≥3% (very low bar; cold is cold) | Last-resort channel for week 8+ if warm channels haven't hit. Audience: Ontario solo practitioners with visibly stale sites (built before 2022). |
| 7 | **Indie Hackers / X (Twitter) build-in-public** | 1 hr | The Lumivara case-study post (already drafted in `04-slide-deck.md`) | Use as awareness, not direct lead-gen — measure followers, not orders | Direct-to-founder reach for the indie SaaS subset. Slow burn; expect 6+ months before it converts. |

### What we deliberately **don't** do in the first 90 days

- **No paid ads** (Google, Meta, LinkedIn). Not until we have organic conversion data + 5 paying clients to model CAC against. Source: `06-positioning-slide-deck.md` § Strategic risks.
- **No SEO content marketing.** It compounds over years, not quarters. Defer to month 6+ once retainer cash flow can fund a writer.
- **No directories** (Clutch, GoodFirms). Pay-to-list and the buyer profile is enterprise-leaning. Wrong channel for our price band.
- **No conferences / meetups.** The operator's calendar is the constraint, not awareness. Defer to year 2.

### Channel hygiene rules

From `01-gig-profile.md` Part 11 ("What NOT to do"):

- **Don't price the autopilot tier under USD $1,000.** Low prices attract low-paying buyers and signal low quality.
- **Don't accept off-platform payment in the first 90 days** on Fiverr — ToS violation, account-banning risk.
- **Don't promise turnaround times you can't keep.** On-time delivery is the single biggest Fiverr ranking factor.
- **Don't lead with the tech stack** in any channel. Ever.

---

## 5 · First-90-day launch calendar

Weeks 1–4 extend the 30-day plan from `01-gig-profile.md` Part 10 +
`00-quick-start.md` "Your first 30 days." Weeks 5–13 are net new — they
operationalise the channel plan above into a content cadence and a sales pipe.

> **Read this calendar as a recommendation, not a contract.** It assumes the
> operator is splitting time with a day job; collapse the cadence by ~40% if
> the operator goes full-time on Forge sooner.

| Week | Theme | Concrete actions | Sales target by end of week |
|---|---|---|---|
| **W1** | Storefront live | Day 1 — paste `01-gig-profile.md` Part 4 into Fiverr "About" verbatim. Day 2 — publish Gig 1 only with prices from `02-pricing-tiers.md`. Day 3 — apply to Toptal / Arc.dev / Lemon.io (screening clock starts). Day 4 — publish first LinkedIn case-study post about lumivara-forge.com; DM 10 warm-network contacts. | Profile live; 10 DMs sent; 1+ Toptal-tier application in screening |
| **W2** | First proposals + soft launch | Soft-launch Gig 1 basic tier at –15% for the first 5 orders only (review-base play). Apply to 5 Upwork jobs/day with custom proposals (mention phone-edit in paragraph 1, lumivara-forge.com link in paragraph 2). Record 30-second portrait video for Fiverr gig page. | ≥1 Upwork reply; ≥1 Fiverr inquiry |
| **W3** | Expand storefront | Publish Gigs 2 and 3 from `01-gig-profile.md` Part 5. Post a second LinkedIn case study (a "system win" — show the phone-edit shortcut in action via a 60-second screen recording). DM 10 more warm-network contacts. Begin compiling outreach list of 30 stale-site solo practitioners (Ontario). | Gigs 2 + 3 live; 2 case studies posted; 20 warm-network touches done |
| **W4** | First reviews + first close | Decline scope-creep buyers fast. Goal: close one Tier-0 or Tier-1 setup by week's end (the soft-launch cohort). Post first LinkedIn long-form: "30 days of trying to sell a website-as-a-service — what worked." Request reviews from any closed buyers immediately. | First paying client closed; 1+ five-star review; ≥3 LinkedIn replies cumulative |
| **W5** | Post-launch motion | Deliver the first build inside its quoted SLA — on-time delivery is THE Fiverr ranking factor. Send a 5-minute personalised hand-over video. Ask the closed client for a one-paragraph testimonial within 7 days. Run the first Upwork follow-up cycle on any silent proposals. | First delivery shipped on time; testimonial requested |
| **W6** | Toptal screening close-out | If Toptal/Arc/Lemon screening response has come in, complete it this week. Run the live test or take-home; cite lumivara-forge.com as the showcase. Continue 5 Upwork proposals/day cadence. Post a third LinkedIn case study (could be the W5 client if they consent — otherwise a behind-the-scenes "what I learned shipping client #1"). | ≥1 vetted-platform decision; second Fiverr inquiry; ≥5 LinkedIn replies cumulative |
| **W7** | Referrals motion live | Send the partner-referral one-pager to ~5 brand designers / copywriters / accountants in the operator's network. Frame: "I send you logo work; you send me website work." Continue Upwork + LinkedIn cadence. | First referral conversation booked |
| **W8** | First retainer hits the books | If W4 client was Tier 1 or 2, the first monthly improvement run lands here. Document it publicly (LinkedIn post: "what got shipped on a Forge retainer in month 1") with the client's permission. This becomes the canonical "what does the monthly actually buy?" proof. | First retainer invoice paid; first improvement-run post published |
| **W9** | Scale the warm channel | Re-DM the warm-network contacts who didn't respond in W1/W3 (acknowledge the gap; share a tangible win). Add 10 new warm contacts to the list. Apply for a fourth vetted platform if appetite (Contra, Comet). | 30+ warm-network touches cumulative |
| **W10** | First cold-email cycle | Send the first cold-email batch (~30 stale-site solo practitioners on the W3 list) using the cold template in `assets/intro-email.md`. Keep volume tight; quality > quantity. Continue Upwork + LinkedIn cadence. | ≥1 cold-email reply; second paying client closed |
| **W11** | Mid-quarter pricing review | If you have 5 five-star reviews on Gig 1, raise its prices 15% per the rule in `02-pricing-tiers.md`. Refresh Fiverr gig copy / images if any inquiry pattern reveals confusion. Begin drafting first MDX insight for the public site (long-form authority play; defer publish until W13+). | Pricing raised if review threshold hit; insight draft started |
| **W12** | Second client delivery | Deliver client #2 on time. Same hand-over + testimonial routine as W5. Post a "two-clients-in" LinkedIn round-up. | Client #2 delivered on time |
| **W13** | 90-day review + decision | Audit: did we hit ≥3 LinkedIn replies, ≥5 DM responses, ≥2 Fiverr inquiries, ≥1 paying client (per the `00-quick-start.md` 30-day-review bar, scaled to 90)? If yes — keep this exact channel mix and add volume in Q2. If no — bottleneck is **reach**, not product (per `00-quick-start.md`). Add a fourth channel; do not lower prices. | 90-day audit complete; Q2 plan drafted |

### Content cadence overlay (operates in parallel each week)

| Surface | Frequency | Source |
|---|---|---|
| LinkedIn long-form post | 1 / week (case study OR system win OR build-in-public) | Pulled from `04-slide-deck.md` slides + W4-onward client wins |
| LinkedIn short-form (comment-driver) | 2 / week | Operator authors fresh; no template |
| X / Indie Hackers | 1 / week (cross-post the LinkedIn long-form, audience-adjusted) | Same source as LinkedIn long-form |
| Fiverr gig refresh | Monthly review of conversion rate; tweak first-image / first-line copy if inquiries are flat for 2+ weeks | `01-gig-profile.md` Part 5 |
| Public-site insights page (MDX) | First post by W14, then 1 / month | New — drafts to live in `src/content/insights/`, wired in a separate issue |

---

## 6 · Open questions and approval checklist (operator action required)

This issue's Definition of Done says "approved by Akshay." An automated PR can
draft; only the operator can approve. Tick each item in the PR review for #115
before treating any of these as locked.

- [ ] **Tagline lock.** Confirm the recommended tagline (*"Modern websites that update from your phone, not your inbox."*) — or pick a named alternative from § 1 — and use that one **everywhere**. No per-channel variants.
- [ ] **Long pitch lock.** Confirm the recommended pitch (Part-1 from `01-gig-profile.md`) or replace with the `00-quick-start.md` short version.
- [x] **Brand-name lock.** Locked 2026-04-28 to **Lumivara Forge** in `docs/mothership/15-terminology-and-brand.md §4`. Trademark availability check (CIPO Class 42 + USPTO) per `15 §5` is the only remaining pre-launch gate.
- [ ] **Geo-priority lock.** Confirm Ontario / GTA primary, US east coast secondary, Quebec deferred until French-language pages exist. (Per `06-positioning-slide-deck.md` § Strategic risks.)
- [ ] **Channel #1 lock.** Confirm LinkedIn organic + warm DMs is the primary channel. The alternative is to lead with Fiverr; the recommendation is LinkedIn because the warm-network signal is stronger for the first 5 closes.
- [ ] **Pricing posture in cold outreach.** Confirm we **do not** mention price in cold outreach (intro emails, Upwork first-touch). Price is a discovery-call topic. (See `02-pricing-tiers.md` § "How to handle the price objection".)
- [ ] **Referral-fee policy.** Decide the partner-referral fee structure (e.g. 10% of setup fee for first 6 months, none on retainer) before the W7 referral motion goes live. Currently `TODO(operator)`.
- [ ] **Cold-email volume cap.** Confirm cap of ~30 sends per week. Anything higher and we should adopt a deliverability tool (e.g. Instantly, Smartlead) and a warm-up domain — separate issue.
- [ ] **First marketing assets approved.** Sign off on `assets/landing-copy.md` and `assets/intro-email.md` — or comment with edits — before either is used live with a prospect.

### Items deliberately **not** in this doc

- **Detailed Upwork cover-letter library.** Build after 20+ proposals reveal patterns (`00-quick-start.md` "what's still missing"). Don't pre-build.
- **Discovery-call script.** Build after 5 calls. Don't pre-build.
- **Site-side wiring of the landing copy.** `assets/landing-copy.md` is a doc draft. Wiring it into a `/forge` route or a microsite is a downstream issue (do not edit `src/content/home.ts` to swap the People Advisory copy with Forge copy in this issue).
- **Paid-channel CAC modelling.** Defer until 5 organic-channel closes give us a baseline. Costs sourced from `03-cost-analysis.md` / `mothership/20-launch-and-operating-cost-model.md` when we get there.

---

## 7 · How this doc relates to the others in `docs/storefront/`

This is the **synthesis** doc. The pitch language, pricing math, costs, and
deck slides already exist in the rest of the folder; we don't restate them
here. Cross-reference whenever the operator (or a future executor) needs the
full source:

| For… | Read |
|---|---|
| Verbatim pitch + audience variants + paste-ready About copy | `01-gig-profile.md` Parts 1, 3, 4 |
| The four-tier price ladder + decision tree + price-objection script | `02-pricing-tiers.md` |
| Per-client and practice-wide cost-of-goods + ramp plan | `03-cost-analysis.md` (per-client) + `docs/mothership/20-launch-and-operating-cost-model.md` (practice-wide P&L) |
| Prospect-facing deck ("imagine your site here") | `04-slide-deck.md` + rendered HTML/PDF |
| Operator-only positioning deck (the 9 strategy questions) | `06-positioning-slide-deck.md` |
| Operator-only product-strategy deck | `06-product-strategy-deck.md` |
| First marketing assets — landing copy, intro emails | `assets/landing-copy.md` + `assets/intro-email.md` (siblings of this doc) |

---

*Last updated: 2026-04-29. Status: DRAFT — see § 6 Approval checklist.*
