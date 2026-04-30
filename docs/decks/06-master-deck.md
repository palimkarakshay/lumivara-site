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
| AI-site generators | Framer AI, Durable, Bookmark | One-prompt sites. Templated under the hood; hosted in vendor stack. |
| **Lumivara Forge** | — | Real codebase the client owns + AI autopilot operator-managed + edits from a phone shortcut + flat subscription. |

The market is full of Next.js developers. It is **not** full of operators who can hand a non-technical owner a site that maintains itself.

Source: `docs/storefront/01-gig-profile.md` Closing note.

---

## Five things only we ship today

1. **Phone-as-CMS** over a real codebase. A shortcut on the client's phone routes through n8n + Claude into a GitHub PR with a Vercel preview. No CMS to log into. (`docs/ADMIN_PORTAL_PLAN.md`.)
2. **Multi-AI fallback ladder.** Claude Opus → Gemini → OpenAI Codex. Triage, plan, execute, review — each stage has a fallback so a single-vendor outage never blocks the queue. (`docs/AI_ROUTING.md`.)
3. **Plan-then-Execute pipeline.** Every routine issue gets a structured AI plan as a PR comment *before* code is written. The client reads the plan first.
4. **Tier-based cadence.** T0 manual, T1 daily, T2 every 2h, T3 hourly. The bot's "energy" is a sold dial. (`docs/mothership/04-tier-based-agent-cadence.md`.)
5. **Pattern C two-repo isolation.** Client gets a clean `<slug>-site` repo (private → transferable). The pipeline, prompts, and operator IP live in a separate `<slug>-pipeline` repo the client never sees. (`docs/mothership/02b-pattern-c-architecture.md`.)

---

## Why each of those is hard to copy

| Feature | What protects it |
|---|---|
| Phone-as-CMS | Requires Auth.js v5 + n8n workflows + HMAC + Octokit + Vercel deploy hooks wired together. ~5 phases of build (`docs/ADMIN_PORTAL_PLAN.md`). |
| Multi-AI fallback | Requires three live API contracts, a deterministic router, and prompt-pack parity across providers. Most freelancers hold one key. |
| Plan-then-Execute | Every routine issue gets an AI-authored plan comment before code lands. Few competitors run this gate at all. |
| Tier cadence | The pipeline reads tier from a per-client variable; cron schedule, model selection, and auto-merge gates all branch on it. Not a feature flag — a whole product surface. |
| Pattern C isolation | A GitHub App + two-repo split + per-engagement install ID. Operator IP stays operator-side; the client repo is genuinely "vanilla" if they ever leave. |

The site is a commodity. The **system around the site** is the moat.

---

## What we deliberately do NOT sell

- **Not a SaaS.** No self-serve onboarding, no shared multi-tenant DB, no public sign-up. (`docs/mothership/01-business-plan.md §6`.)
- **Not an agency.** No PMs, no design team, no employees. The operator runs everything until ~30 clients.
- **Not a hosting company.** The client's hosting account is the client's, in their name, on their card by month 1.
- **Not a white-label reseller.** Tier 4 exists for agencies but is not promoted; quoted custom at 2× T3 minimum.
- **Not Shopify / e-commerce.** Wrong stack — referred elsewhere.

The boundaries *are* the strategy. They keep the operator under 175 hours a month at saturation and keep the moat intact.

---

## Section recap — Differentiators

- **Phone-as-CMS** is the headline feature. Nobody in our price band offers it.
- **Multi-AI fallback** turns a single-vendor risk into a sold feature ("we don't pause when one provider hiccups").
- **Pattern C** lets us license the system per engagement while the *site* is genuinely the client's.
- **Tier cadence** turns "how aggressive is the bot" into a sold dial, not an internal toggle.
- **The negative list** (what we don't sell) is itself a differentiator — boundaries clients can read and trust.

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

Source: `docs/storefront/01-gig-profile.md` Parts 1, 6, and 8; `00-quick-start.md` "Is this marketable?"

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

Source: `docs/storefront/00-quick-start.md` "Is this marketable?"; `04-slide-deck.md` honest-objections slide.

---

## Who says yes (the ICP) and who says no

| Says yes | Looks like | Tier |
|---|---|---|
| Solo consultant (HR, coach, therapist, accountant, lawyer) | "Relaunching my practice; the Squarespace site looks cheap." | T1 / T2 |
| Boutique services firm (5–25 staff) | "Site was built in 2019; the intern can't update it." | T2 / T3 |
| Indie SaaS founder | "Marketing site for my product; modern stack so I can hack on it later." | T2 + retainer |
| Local trades / clinics / studios | "Want to look professional + an online booking link." | T1 + Cal.com |

**Says no** (anti-personas): agencies wanting half-price white-label, equity-only deals, e-commerce / Shopify, enterprise procurement, sub-$50/mo budgets.

Anti-persona detail: `docs/research/04-client-personas.md` §A1.

---

## The hidden ask underneath

What clients literally say is "I want to update my own site." What they *mean*, almost always, is:

> *"I want to stop feeling stupid every time I open a CMS, and stop feeling guilty every time I delay a change because I don't want to email a developer about it."*

The product wins the moment that feeling goes away. Phone-shortcut + plain-English instruction + tap-to-publish is the shape of the answer because it solves the *feeling*, not just the technical task.

Source: synthesis from `docs/research/04-client-personas.md` and gig-profile pain-point map.

---

## Section recap — Customer voice

- Customers ask for **autonomy** ("I want to fix it myself") and **predictability** ("no surprise invoices").
- They ask for **ownership** ("no lock-in") and **looks** ("not another Wix site").
- The **objections** clump into four shapes (Squarespace, monthly cost, vendor risk, lock-in) — all four have prepared answers.
- The ICP is solo consultants and boutique firms, not e-commerce or enterprise.
- The hidden ask is emotional: stop feeling stupid, stop feeling guilty about delaying changes.

> Pitch line: *"Customers don't ask for AI. They ask to stop waiting on a developer."*

---

<!-- _class: lead -->

# 4 · What competitors say they're providing

*The pitch from the other side of the table — verbatim, then dissected.*

---

## Competitor pitch matrix

| Competitor | Verified pricing (2026-04-29) | What they tell SMBs | What they don't tell them |
|---|---|---|---|
| **Squarespace / Wix / Webflow** | $17 – $139 / mo (`[V] §B-Wix-Squarespace`) | "Build a beautiful site in an afternoon, edit it yourself, no code." | The site lives in their walled garden. Export is painful. Performance and SEO ceilings. Plugin sprawl over time. 71% of consumers spot a DIY at first click (`[V] §B-Outdated-75`). |
| **Solo Upwork / Fiverr devs** | $1k – $5k upfront, then per-edit | "Custom build, your code, your ownership, $1k–$5k." | After hand-off, every change is a custom invoice or a Slack message at 11pm. No ongoing improvement. |
| **Boutique agencies** | $6k – $12k upfront + $75 – $150/hr edits + $600 – $3,000/yr retainer (`[S] §B-Boutique-Agency`) | "End-to-end design + build + monthly retainer for support." | Retainer pays for *availability*, not for actual edits. Each substantial change still bills $75–$150/hr. |
| **DesignJoy / Midday / Superside** | $4,995 / mo Standard, $7,995 / mo Pro, + $999 / mo Webflow add-on (`[V] §B-DesignJoy`) | "Unlimited design requests, async Trello, 48h turnarounds." | Webflow-hosted. Designed for funded SaaS / enterprise marketing teams. ~10× our blended ARPU. |
| **WP Buffs maintenance** | $79 – $447 / mo across 5 tiers; "Perform" $219 / mo most popular (`[V] §B-WP-Buffs`) | "24/7 monitoring, weekly core updates, basic edits, speed optimisation." | Locks the client onto the underlying decaying WordPress. Doesn't include the initial build. |
| **Headless CMS (Sanity / Contentful / Strapi) + dev** | $0 – $1,000 / mo CMS + dev hourly | "Modern stack, structured content, scalable." | Client must learn a CMS. Still needs a developer for layout / component changes. |
| **AI-site generators (Framer AI, Durable, Bookmark)** | $20 – $100 / mo | "Type a prompt, get a site." | Templated under the hood. Hosted in their stack. Phone-edit *publishing* is not the loop. |

We sit deliberately in the gap none of them serve: real-codebase ownership + AI-managed maintenance + flat fee.

---

## How they handle the four customer asks

| Customer ask | Squarespace | Freelance dev | Agency | AI generator | **Lumivara Forge** |
|---|---|---|---|---|---|
| "Update without calling someone" | ✅ via their editor | ❌ | ❌ retainer = "ask us" | ✅ via their editor | ✅ phone shortcut |
| "No surprise invoices" | ✅ flat sub | ❌ per-edit | ⚠️ retainer + overage | ✅ flat sub | ✅ flat sub |
| "Custom-looking, not templated" | ❌ template-driven | ✅ | ✅ | ❌ template-driven | ✅ |
| "Own the site outright" | ❌ vendor lock-in | ✅ | ✅ | ❌ vendor lock-in | ✅ |

We're the only column with **four green ticks**. Squarespace and AI generators are the closest by edit-loop; agencies and freelancers the closest by craft. Nobody currently bundles all four.

---

## What competitors are NOT advertising (yet)

These are gaps in the market that, if a well-funded competitor closed, would compress our moat:

- **Phone-as-CMS over a real codebase.** Not promoted by any major builder. Closest: Framer's mobile editor, but it's still inside Framer's stack.
- **Multi-AI fallback as a sold feature.** Most AI-site tools commit to one model; outage → queue stops.
- **Plan-then-Execute with a human approval tap.** Some Cursor / Devin-style products do "AI proposes a PR" but no flat-rate SMB packaging.
- **Two-repo Pattern C operator/client split.** Genuinely uncommon — most operators commingle automation and site code, which makes hand-over messy.

Watch list reassessed every 2 months: **Framer** (closest substitution risk if they add code-export + n8n), **Vercel v0** (if they package retainer), and any **Anthropic-built "ship a marketing site" agent**.

---

## Section recap — Competitor claims

- Squarespace owns the **edit-yourself** narrative but loses on **ownership + custom**.
- Freelancers and agencies own **craft** but lose on **predictability + autonomy**.
- AI-site generators own the **demo wow** but lose on **real ownership + flat-fee maintenance**.
- WordPress maintenance shops own **monitoring** but lock clients onto a decaying stack.
- Nobody currently bundles ownership + autonomy + flat fee + custom craft. That's the wedge.

> Pitch line: *"Squarespace's edit loop, an agency's craft, and a freelancer's ownership — for one flat fee."*

---

<!-- _class: lead -->

# 5 · End goal as a business

*What is Lumivara Forge, fully grown?*

---

## The 12-month decision rule

> If a feature, doc, or tool helps the operator serve **paid retainer clients** better — build it.
> If it helps serve **prospects, hypothetical SaaS users, or other agencies** better — defer it.

Source: `docs/mothership/01-business-plan.md §9`.

This rule is the antidote to over-engineering. Everything in this deck collapses to it.

---

## What "fully grown" looks like — Stage 1

- **~25–30 active retainer clients.** Mix: ~70% T2, ~20% T1, ~10% T3. (`docs/storefront/02-pricing-tiers.md`.)
- **MRR ≈ CAD $6,000 – $9,200** before setup-fee lumps. (`docs/storefront/03-cost-analysis.md` Part D.)
- **Year-1 gross ~CAD $177k**, take-home ~$118k–$128k after Ontario sole-prop tax.
- **Operator hours: ≤175 / month** of total work at saturation, of which ≤60 is client-facing.
- **Day job replaced** between months 9 and 12.
- **Zero published incidents** that would have cost a regulated client a compliance finding.

This is the explicit target the cost analysis is built around. It's not "first step toward a unicorn." It's the destination of Stage 1.

Source: `docs/storefront/03-cost-analysis.md` Parts B–D + `docs/mothership/18-capacity-and-unit-economics.md`.

---

## Beyond Stage 1 — optional stages, not committed

| Stage | Horizon | What it looks like | Decision posture |
|---|---|---|---|
| **Stage 1 — Services + retainer** | now → 12 mo | Operator-run. ~30 clients max. The plan in this deck. | **Committed.** |
| **Stage 2 — Managed-services agency** | 12–24 mo | Hire 1–2 operators. Scale to ~80 clients. Margins compress slightly. | Optional. Decide at client #30. |
| **Stage 3 — Productise the operator side** | 24+ mo | Self-serve onboarding, customer-managed billing. Becomes a SaaS. | Optional. Different business; different risks. Defer. |

Stage 3 is a different business with different risks (real product-market fit, real on-call, real fundraise). **Don't pre-build for it.** Stay in Stage 1 until genuinely outgrown.

Source: `docs/storefront/05-template-hardening-notes.md` "Long-term: should this become a SaaS?"

---

## What this business is *NOT* trying to become

- **Not a venture-scale SaaS.** No fundraising path. No "10× growth" hockey-stick.
- **Not an agency.** Hiring is deferred to Stage 2, not built into year-1 ops.
- **Not a hosting company.** Hosting is the client's, on their card.
- **Not a labour arbitrage shop.** No offshore team, no per-hour billing.
- **Not a product company yet.** No standalone software product is sold; the product is the **service experience**.

The strategy is *deliberate smallness with high margin per client*, not scale at any cost.

---

## Why deliberate smallness is the strategy

Three forcing functions make 30 clients the right ceiling, not the consolation prize:

1. **Margin holds because payroll doesn't.** AI-enabled solo operators commonly report 65–75% gross margins (`[S] §B-Solopreneur-Margin`); traditional agencies compress to 40–50% under headcount load. We hold >95% pre-comp because there is no payroll to client #35 (`docs/storefront/03-cost-analysis.md` Part E).
2. **Quality holds because attention does.** Every client gets the same operator's eyes on every PR. Above 30, attention has to be split or delegated — which downgrades the product.
3. **Burnout is the ceiling, not the market.** The operator's reach (~30 clients ≈ 0.0023% of Canadian SMBs) is decisively not bound by demand (`[V] §B-Canada-SMB`). The cap is a personal-sustainability gate, not a market gate.

---

## Section recap — End goal

- **Stage 1 destination: 30 retainer clients, ~$120k take-home, ≤175 op-hrs/mo.**
- **Stage 2 destination:** ~80 clients, 1–2 hires, ~24-month horizon — optional.
- **Stage 3 destination:** SaaS productisation — deferred until 30+ clients prove the model.
- **The decision rule: paid retainers > everything else.**
- Smallness is a **strategy**, not a constraint.

> Pitch line: *"A 30-client retainer practice that prints predictable margin and gives the operator their evenings back."*

---

<!-- _class: lead -->

# 6 · Steps to achieve the end goal

*Top-of-funnel through retained client #30, in plain order.*

---

## Steps in plain order

1. **Lock the brand and own the slugs.** `Lumivara Forge` is locked (`01-business-plan.md §1`); buy domain, GitHub org, Resend domain, Twilio sub-account. *(Done / in progress.)*
2. **Close the architecture critiques.** Pattern C lock, security topology, capacity reconciliation, ops sequencing. *(P4.6 in `docs/mothership/00-INDEX.md`; underway.)*
3. **Bootstrap the mothership repo.** `palimkarakshay/lumivara-forge-pipeline`, with workflow templates, scripts, n8n exports. (`docs/mothership/05-mothership-repo-buildout-plan.md`, P5.)
4. **Spin out Client #1 into clean Pattern C repos.** Use it as the showcase. (`docs/migrations/00-automation-readiness-plan.md` + the lumivara-people-advisory spinout runbook, P5.6 / P6.)
5. **Publish the storefront.** Fiverr Gig 1, Upwork profile, Toptal/Arc/Lemon screening, LinkedIn case-study post. (`docs/storefront/01-gig-profile.md` Part 10.)
6. **Sell Client #2 + #3.** Real arms-length retainers. Trigger MSA + payment automation + privacy work. (`docs/mothership/08-future-work.md §1–§3`.)
7. **Cross client #5.** Trigger 1Password vault + break-glass envelope. (`docs/mothership/08-future-work.md §4`.)
8. **Cross client #16.** Upgrade Claude Pro → Max 5x → Max 20x at the cliffs. (`docs/mothership/18-capacity-and-unit-economics.md §6`.)
9. **Cross client #25.** Hire a part-time VA for client comms triage. (`docs/storefront/03-cost-analysis.md` Part E.)
10. **Cross client #30.** Decide: hold (Stage 1), expand (Stage 2 hire), or productise (Stage 3 SaaS).

---

## Steps grouped by theme

| Theme | Steps |
|---|---|
| **Identity + IP** | Brand lock; mothership repo; vault; MSA + SOW. |
| **Product hardening** | Critique closure (Pattern C, security, capacity, ops); admin portal Phases 1–5; multi-AI fallback proven on a live client. |
| **Go-to-market** | Storefronts (Fiverr, Upwork, Toptal); LinkedIn; first 5 reviews; price step-ups. |
| **Operations** | Per-engagement provisioning matrix; evidence log per client; monthly + quarterly cadences (`docs/mothership/03b-security-operations-checklist.md`). |
| **Finance + legal** | Stripe Subscriptions; auto-pause schedule; PIPEDA + provincial overlays; insurance once over $50k revenue. |
| **Scaling decisions** | Plan upgrades at clients 6 / 16 / 26; VA at 25; second engineer at 35. |

---

## The two non-negotiable invariants

1. **The two-repo separation (Pattern C) holds on every client.** No workflows on the site repo. No operator-side IP commingled into the client's tree. (`docs/mothership/02b-pattern-c-architecture.md`, `pattern-c-enforcement-checklist.md`.)
2. **The session-budget charter (80% / 95% gates) holds on every Claude run.** No client floods the queue. No run exits incomplete on `main`. (`AGENTS.md` "Session charter".)

Everything else can flex. These two cannot.

---

## What "step complete" looks like, audit-style

For each numbered step above, the operator's audit question is: *"If a future me looked at the repo today, could they verify this step shipped?"*

| Step | Verifiable artefact |
|---|---|
| 1 — Brand lock | `docs/mothership/15-terminology-and-brand.md` updated; domain WHOIS recorded. |
| 2 — Critiques closed | P4.6 runs A–D referenced in `docs/mothership/00-INDEX.md` marked ✅. |
| 3 — Pipeline bootstrapped | Pipeline repo exists; cron + Actions green on a no-op issue. |
| 4 — Client #1 spun out | Two repos visible in the Pattern C audit; brand-leak audit clean. |
| 5 — Storefront live | Fiverr URL + Upwork URL + LinkedIn pinned post recorded. |
| 6 — Client #2/#3 signed | Signed MSAs filed; Stripe subscription active. |
| 7–10 — Cliff triggers | The capacity table in `18 §6` records the date each cliff hit. |

If a step doesn't have a verifiable artefact, it isn't done.

---

## Section recap — Steps

- **Identity** (brand, repos, vault) → **Product** (close critiques, harden) → **Sales** (storefronts, first 5 clients) → **Scale** (cliffs at 6 / 16 / 26 / 30).
- The order matters: identity before product, product before sales, sales before scaling decisions.
- Pattern C and the budget charter are the **invariants** through every step.
- Every step has an artefact a future-self can verify.

> Pitch line: *"Lock the brand, harden the product, then sell — in that order."*

---

<!-- _class: lead -->

# 7 · Project plan

*Phased, with status as of 2026-04-30.*

---

## The phased build plan (mothership pack)

| Phase | Deliverable | Status |
|---|---|---|
| **P0 — Survey** | Read existing repo, freelance pack, template prompt, AI routing, admin-portal plan | ✅ Done |
| **P1 — Foundation docs** | `00-INDEX`, `01-business-plan`, `02-architecture`, `03-secure-architecture` | ✅ Done |
| **P2 — Operations docs** | `04-tier-based-agent-cadence`, `05-mothership-repo-buildout-plan` | ✅ Done |
| **P3 — Engagement playbooks** | `06-operator-rebuild-prompt-v3`, `07-client-handover-pack` | ✅ Done |
| **P4 — Future-work stubs** | `08-future-work.md` (legal, vault, contracts, payments, market research) | ✅ Done |
| **P4.5 — External critique** | Docs `10`–`15` + `16` prompt-pack | ✅ Done |
| **P4.6 — Critique closure** | Runs A–D: cron flaw, security gaps, maths, ops sweep | ⏳ **In progress** |
| **P5 — Pipeline repo bootstrap** | Build empty `palimkarakshay/lumivara-forge-pipeline` end-to-end | ⏳ After P4.6 |
| **P5.6 — Pattern C spinout** | Split this combined repo into Site + Pipeline pair | ⏳ After P5 |
| **P6 — Migrate Client #1** | Re-scaffold Client #1 site into a clean per-client Pattern C pair | ⏳ After P5.6 |
| **P7 — Hardening tasks** | Walk `05-template-hardening-notes.md` items into pipeline issues | ⏳ After P6 |
| **P8 — Legal & vault** | PIPEDA, contracts, secrets vault, market study | ⏳ Months 2–6 |

Source: `docs/mothership/00-INDEX.md` "Phased build plan" + `docs/migrations/00-automation-readiness-plan.md`.

---

## Months 1–3 — Side-hustle viable

- 2 × Tier-0 builds (CAD $2,400 setup)
- 3 × Tier-1 retainer signups ($7,200 setup + $297 MRR)
- 1 × Tier-2 retainer signup ($4,500 setup + $249 MRR)
- Total months 1–3: **~$14,100 setup + $546 MRR**, average **~$5,200/mo gross**.
- Day-job still on. Side hustle pays for AI tools and eats evenings.

Trigger work in this window: MSA + SOW (before client #2), payment automation, PIPEDA before client #3.

Source: `docs/storefront/03-cost-analysis.md` Part C, milestone 1.

---

## Months 4–9 — Day-job-replaceable

- 3–4 new clients/month, mostly Tier 2.
- Typical mix: 1 × T0 + 1 × T1 + 2 × T2 = $12,600 setup/month.
- MRR climbs by ~$597/month new.
- By month 9, MRR ≈ **$5,000–$7,000** on top of $10–14k/month setup lumps.
- Total monthly gross: **$15,000–$21,000**.
- Status: comfortably above day-job replacement number; start de-risking.

Trigger work: 1Password vault by client #5; Claude Pro → Max 5x at client #6; Max 5x → Max 20x at client #16.

Source: `docs/storefront/03-cost-analysis.md` Part C, milestone 2.

---

## Months 10–12 — Quitting milestone

- MRR alone covers fixed personal expenses (rent + groceries + utilities + insurance).
- 6 months of personal expenses saved as runway.
- Two enterprise referrals lined up via LinkedIn for buffer.
- **Then quit.**

By month 12: ~32 active clients, ~$22k/month gross, year-1 take-home **~CAD $118k–$128k** after Ontario sole-prop tax.

Source: `docs/storefront/03-cost-analysis.md` Part C, milestone 3 + Part D.

---

## The 12-month operating cost projection (headline rows)

| Month | Active clients | Quota tier | MRR (CAD) | Gross | Net before personal tax |
|---|---|---|---|---|---|
| 1 | 2 | Pro | $200 | $3,200 | $3,152 |
| 3 | 7 | Max 5x | $1,200 | $8,700 | $8,520 |
| 6 | 16 | Max 20x | $3,800 | $14,800 | $14,457 |
| 9 | 25 | Max 20x | $6,800 | $19,800 | $19,447 |
| 12 | 32 | 2nd seat | $9,200 | $23,200 | $22,555 |

**Year-1 gross: ~$177k. Year-1 net before personal tax: ~$170.5k.**

Source: `docs/storefront/03-cost-analysis.md` Part D + `docs/mothership/18-capacity-and-unit-economics.md §3 / §6`.

---

## Section recap — Project plan

- **Phases P0–P4.5 are done.** P4.6 critique-closure is the immediate work.
- **P5 → P5.6 → P6 → P7** is the pipeline-repo bootstrap, the Pattern C spinout, the Client #1 migration, then hardening — months 1–3.
- **P8** legal + vault is staged across months 2–6, gated on client count.
- **Revenue ramp:** $5k/mo (months 1–3) → $15–21k/mo (months 4–9) → $22k/mo (month 12).
- **Day job replaced** between months 9 and 12.

> Pitch line: *"Twelve months from today: 30 retainer clients, the day job gone, and ~$120k take-home."*

---

<!-- _class: lead -->

# 8 · Possible challenges

*The risks that can knock the plan off course — named, mitigated, residual.*

---

## Top-tier risks (already mitigated in the system)

| Risk | Likelihood | Impact | Mitigation already built |
|---|---|---|---|
| Anthropic outage / throttle | Med | High | Multi-AI fallback ladder (`docs/AI_ROUTING.md`) — Claude → Gemini → OpenAI Codex on triage and execute. |
| One client floods the queue | Low | Med | Per-client rate limit + tier cadence (`docs/mothership/04-tier-based-agent-cadence.md`). |
| Operator burnout | Med | High | 30-client cap until hire; budget charter; weekly cadence; planned 2-week break before client #25. |
| Secret leak (token in client repo) | Low | Critical | Org-level secrets, vendor PAT, `.claudeignore`, audit checklist (`docs/mothership/03 §3`). |
| Bot ships breaking change to prod | Low | High | Auto-merge gate is opt-in per label; design/critical paths excluded; Vercel preview required. |
| Client refuses to pay | Med | Med | Stripe auto-charge; pause autopilot at +14 days; full lockout at +30 days (`docs/mothership/08-future-work.md §3`). |
| Client demands the autopilot when leaving | Low | Med | Contract: "site = client; system = operator-licensed". |
| ADA legal liability | High | High | axe-core in CI; E&O / cyber liability insurance above $50k revenue. |

Source: `docs/mothership/01-business-plan.md §8` + `docs/research/06-drawbacks-and-honest-risks.md`.

---

## Strategic risks (less mitigated, watch carefully)

- **Demand-side:** the market may exist but our reach doesn't. Fix is more posting and outreach, not lower prices. (`docs/storefront/03-cost-analysis.md` Part G.)
- **Competitive substitution:** Framer, Vercel v0, or an Anthropic-built site agent could close the phone-as-CMS gap. Watch list maintained; reassess every 2 months.
- **Regulatory:** Quebec Law 25 is materially stricter than PIPEDA; needs a French-language privacy page if we sell in QC. Defer until first QC client.
- **Model deprecation:** a Claude / Gemini model retirement breaks pinned IDs. Mitigation: review pinned IDs every 2 months in `docs/AI_ROUTING.md`.
- **Single bad client.** "One bad client costs more than ten good ones earn." Be ruthless with the say-no list.

---

## Capacity cliffs (when the system has to evolve)

| Cliff | Trigger | Action |
|---|---|---|
| **Cliff 1** | Client #6 | Claude Pro → Max 5x |
| **Cliff 2** | GitHub Free Action minutes saturate | Pay-as-you-go on Actions or move CI to a paid runner |
| **Cliff 3** | n8n free tier saturated | Railway Pro |
| **Cliff 4** | Client #16 | Max 5x → Max 20x |
| **Cliff 5** | Client #26 | 2nd Anthropic seat (unlocks 2nd engineer hire) |

If a cliff hits *during* an onboarding, finish the onboarding first, upgrade after. Never upgrade pre-emptively. Source: `docs/mothership/18-capacity-and-unit-economics.md §6`.

---

## Failure modes specific to the autopilot

1. **The bot makes a "confident wrong" change.** Mitigation: every change waits for client tap; auto-merge limited to trivial labels; design / critical paths human-only.
2. **The plan-then-execute gate adds latency clients don't want.** Mitigation: Tier 3 cadence runs hourly; Tier 0 explicitly opts out of automation entirely.
3. **The phone-edit shortcut breaks on iOS / Android update.** Mitigation: web-based admin portal is the canonical surface; SMS + email are fallback channels.
4. **HMAC rotation goes wrong.** Mitigation: two-phase HMAC rotation in `docs/mothership/03-secure-architecture §3.Y`; recovery drill in `03b-security-operations-checklist`.
5. **Cron drift between site and pipeline repos.** Mitigation: Pattern C puts cron only on the pipeline repo's `main` (canonical GitHub Actions path); enforced by `pattern-c-enforcement-checklist.md`.

---

## The single biggest existential risk

> **Operator burnout** — not the market, not the technology, not a competitor.

The cap (30 clients), the charter (80% / 95% session gates), the cadence (T0–T3), the negative list (no e-commerce, no white-label, no equity-only), and the planned hire ladder (VA at 25, engineer at 35) all exist for one purpose: keep the operator in the chair, healthy, with their evenings back, for the entire ramp.

If any *other* risk lands, the system absorbs it. If burnout lands, the system stops. Treat it accordingly.

---

## Section recap — Challenges

- **Operationally** mitigated: outages, queue starvation, secret leaks, payment defaults, ADA — all have prepared playbooks.
- **Strategically** unsettled: demand reach, competitive moves, model deprecation, regulatory expansion.
- **Capacity cliffs** are scheduled, not surprises.
- **Burnout is the single biggest existential risk.** The cap, charter, and cadence exist to prevent it.

> Pitch line: *"We've named the risks, mitigated the operational ones, watch-listed the strategic ones, and put the operator's wellbeing at the top of the list."*

---
