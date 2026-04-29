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
  .small { font-size: 0.8em; color: #666; }
  .center { text-align: center; }
  .two-col { column-count: 2; column-gap: 40px; }
---

<!-- _class: lead -->

# Lumivara Forge
### Product positioning — the nine questions

A working answer to: *what are we selling, to whom, against whom, with what plan, and at what cost?*

<br/>

*Source material: `docs/mothership/` (operator pack) and `docs/freelance/` (go-to-market pack), reconciled 2026-04-29.*

<span class="small">Operator deck — confidential. Not for client distribution.</span>

---

## The nine questions this deck answers

1. **Benefits** — what the customer gets out of it
2. **Differentiators** — what we provide that others don't
3. **Customer voice** — what prospects actually ask for
4. **Competitor claims** — what the alternatives say they offer
5. **End goal** — what this business is, fully grown
6. **Steps to get there** — the milestones in order
7. **Project plan** — the phased buildout, today through year 1
8. **Challenges** — the risks that can knock us off course
9. **Resources required** — money, time, tooling, and people

Each section is a short stack of slides, then a one-slide recap.

---

<!-- _class: lead -->

# 1 · Benefits for the customer

*What does the small-business owner actually get?*

---

## The one-line promise

> A clean, fast, mobile-first marketing site for your business — that you edit from your phone, and that quietly improves itself every month, for a flat subscription fee.

Three things, bundled:

- **Service A — the website itself.** Custom design, 3–7 pages, mobile + desktop, fast loading, accessibility built in.
- **Service B — the phone-edit system.** Submit a change from a phone shortcut → preview link arrives → tap to publish.
- **Service C — the always-improving subscription.** Monthly improvements, monitoring, a quarterly call about where the site goes next.

Source: `docs/freelance/01-gig-profile.md` Part 2.

---

## Six concrete benefits

| # | Benefit | What the client experiences |
|---|---|---|
| 1 | **No decay.** | The site stays current because making it current is a 30-second job, not a $200 invoice. |
| 2 | **No developer phone calls.** | Edits go in by phone, email, or SMS. The laptop stays closed. |
| 3 | **Predictable monthly cost.** | One flat fee covers AI, monitoring, edits, improvements. Zero surprise invoices. |
| 4 | **Full ownership.** | Code, domain, hosting account — all in the client's name on day one. |
| 5 | **Quality on autopilot.** | 90+ Lighthouse on every page. Accessibility regressions caught before they ship. |
| 6 | **Nothing publishes without consent.** | Every change waits for a tap on the client's phone. |

Source: `docs/freelance/04-slide-deck.md` slides 4–9, `01-gig-profile.md` Part 6.

---

## The 24-month cost story (the benefit in dollars)

|   | Traditional agency | Lumivara Forge |
|---|---|---|
| Initial build | CAD $5,000 – $15,000 | CAD $1,200 – $7,500 |
| Each edit after launch | $150 – $300 / change | included in subscription |
| Time per edit | 1 – 3 weeks | 1 – 4 hours |
| Site-quality maintenance | "phase 2" upsell | included monthly |
| **Total over 24 months (active SMB)** | **$15,000 – $30,000+** | **$7,500 – $14,000** |

The retainer model isn't more expensive. It's cheaper, predictable, and the site is *better* every month instead of degrading.

Source: `docs/freelance/04-slide-deck.md` "What it costs at lumivara.com vs. an agency".

---

## Section recap — Benefits

- The client gets a **real codebase** they own outright, not a templated rental.
- The client gets a **30-second edit loop** from their phone, not a 2-week dev queue.
- The client gets **monthly compounding improvements** for one flat fee, not à-la-carte invoices.
- The client gets **zero lock-in** — code, domain, hosting all in their name from day one.

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
| **Lumivara Forge** | — | Real codebase the client owns + AI autopilot operator-managed + edits from a phone shortcut + flat subscription. |

The market is full of Next.js developers. It is **not** full of people who can hand a non-technical owner a site that maintains itself.

Source: `docs/freelance/01-gig-profile.md` Closing note.

---

## Five things only we ship today

1. **Phone-as-the-CMS.** A shortcut on the client's phone routes through n8n + Claude into a GitHub PR with a Vercel preview. No CMS to log in to. (`docs/ADMIN_PORTAL_PLAN.md`.)
2. **Multi-AI autopilot with deterministic fallback.** Claude Opus → Gemini → OpenAI Codex. Triage, plan, execute, review — each stage has a fallback so a single-vendor outage never blocks the queue. (`docs/AI_ROUTING.md`.)
3. **Plan-then-execute pipeline.** Every routine issue gets a structured AI plan as a comment *before* code is written. The client can read what's about to happen.
4. **Tier-based cadence.** T0 manual; T1 daily; T2 every 2 h; T3 every hour. The bot's "energy" is a sold feature. (`docs/mothership/04-tier-based-agent-cadence.md`.)
5. **Pattern C two-repo isolation.** Client gets a clean `<slug>-site` repo (private → transferable). The pipeline, prompts, and operator IP live in a separate `<slug>-pipeline` repo the client never sees. (`docs/mothership/02b-pattern-c-architecture.md`.)

---

## Why each of those is hard to copy

| Feature | What protects it |
|---|---|
| Phone-as-CMS | Requires Auth.js v5 + n8n workflows + HMAC + Octokit + Vercel deploy hooks wired together. ~5 phases of build (`ADMIN_PORTAL_PLAN.md`). |
| Multi-AI fallback | Requires three live API contracts, a deterministic router, and prompt-pack parity across providers. Most freelancers hold one key. |
| Plan-then-execute | Every routine issue gets an AI-authored plan comment before code lands. Few competitors run this gate. |
| Tier cadence | The pipeline reads tier from a per-client variable; cron, model, and auto-merge gates all branch on it. Not a feature flag — a whole product surface. |
| Pattern C isolation | A GitHub App + two-repo split + per-engagement install ID. Operator IP stays operator-side; the client repo is genuinely "vanilla" if they ever leave. |

The site is a commodity. The **system around the site** is the moat.

---

## What we deliberately do NOT sell

- **Not a SaaS.** No self-serve onboarding, no shared multi-tenant DB, no public sign-up. (`docs/mothership/01-business-plan.md §6`.)
- **Not an agency.** No PMs, no design team, no employees. The operator runs everything until ~30 clients.
- **Not a hosting company.** The client's hosting account is the client's, in their name, on their card by month 1.
- **Not a white-label reseller.** Tier 4 exists for agencies but is not promoted; quoted custom at 2× T3 minimum.
- **Not Shopify / e-commerce.** Wrong stack — referred elsewhere.

The boundaries are the strategy. They keep the operator under 60 hours a month and keep the moat intact.

---

## Section recap — Differentiators

- **Phone-as-CMS** is the headline feature. Nobody in our price band offers it.
- **Multi-AI fallback** turns a single-vendor risk into a product feature ("we don't pause when one provider hiccups").
- **Pattern C** lets us license the system per engagement while the *site* is genuinely the client's.
- **Tier cadence** turns "how aggressive is the bot" into a sold dial.

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

Source: `docs/freelance/01-gig-profile.md` Parts 1, 6, and 8; `00-quick-start.md` "Is this marketable?"

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

Source: `docs/freelance/00-quick-start.md` "Is this marketable?", `04-slide-deck.md` honest-objections slide.

---

## Who says yes (the ICP)

| Prospect type | Looks like | Tier |
|---|---|---|
| Solo consultant (HR, coach, therapist, accountant, lawyer) | "Relaunching my practice; the Squarespace site looks cheap." | T1 / T2 |
| Boutique services firm (5–25 staff) | "Site was built in 2019; the intern can't update it." | T2 / T3 |
| Indie SaaS founder | "Marketing site for my product; modern stack so I can hack on it later." | T2 + retainer |
| Local trades / clinics / studios | "Want to look professional + an online booking link." | T1 + Cal.com |

And who we say no to: agencies-wanting-half-price, equity-only, e-commerce, enterprise procurement.

Source: `docs/freelance/01-gig-profile.md` Part 8.

---

## Section recap — Customer voice

- Customers ask for **autonomy** ("I want to fix it myself") and **predictability** ("no surprise invoices").
- They ask for **ownership** ("no lock-in") and **looks** ("not another Wix site").
- The **objections** clump into four shapes (Squarespace, monthly cost, vendor risk, lock-in) — all four have prepared answers.
- The ICP is solo consultants and boutique firms, not e-commerce or enterprise.

> Pitch line: *"Customers don't ask for AI. They ask to stop waiting on a developer."*

---

<!-- _class: lead -->

# 4 · What competitors say they're providing

*The pitch from the other side of the table.*

---

## Competitor pitch matrix

| Competitor | What they tell SMBs | What they don't tell them |
|---|---|---|
| **Squarespace / Wix / Webflow** | "Build a beautiful site in an afternoon, edit it yourself, no code." | The site lives in their walled garden. Export is painful. Performance and SEO ceiling. Plugin sprawl over time. |
| **Solo Upwork / Fiverr devs** | "Custom build, your code, your ownership, $1k–$5k." | After hand-off, every change is a custom invoice or a Slack message at 11pm. No ongoing improvement. |
| **Boutique agencies** | "End-to-end design + build + monthly retainer for support." | Retainer pays for *availability*, not for actual edits. Each substantial change still bills $150–$300. |
| **Headless CMS (Sanity / Contentful / Strapi) + dev** | "Modern stack, structured content, scalable." | Client must learn a CMS. Still needs a developer for layout / component changes. |
| **AI-site generators (Framer AI, Durable, Bookmark)** | "Type a prompt, get a site." | Templated under the hood. Hosted in their stack. Phone-edit *publishing* is not the loop. |

We sit deliberately in the gap none of them serve: real-codebase ownership + AI-managed maintenance + flat fee.

---

## How they say they handle the four customer asks

| Customer ask | Squarespace | Freelance dev | Agency | **Lumivara Forge** |
|---|---|---|---|---|
| "Update without calling someone" | ✅ via their editor | ❌ | ❌ retainer = "ask us" | ✅ phone shortcut |
| "No surprise invoices" | ✅ flat sub | ❌ per-edit | ⚠️ retainer + overage | ✅ flat sub |
| "Custom-looking, not templated" | ❌ template-driven | ✅ | ✅ | ✅ |
| "Own the site outright" | ❌ vendor lock-in | ✅ | ✅ | ✅ |

We're the only column with **four green ticks**. Squarespace is the closest competitor by feature (edit-yourself + flat fee), but they fail on ownership and custom design. Agencies and freelancers are the closest by craft, but they fail on autonomy and predictability.

---

## What competitors are NOT advertising (yet)

These are gaps in the market that, if a well-funded competitor closed, would compress our moat:

- **Phone-as-CMS over a real codebase.** Not promoted by any major builder. Closest: Framer's mobile editor, but it's still inside Framer's stack.
- **Multi-AI fallback as a sold feature.** Most AI-site tools commit to one model.
- **Plan-then-execute with a human approval tap.** Some Cursor/Devin-style products do "AI proposes a PR" but no flat-rate SMB packaging.
- **Two-repo Pattern C operator/client split.** Genuinely uncommon — most operators commingle automation and site code, which makes hand-over messy.

Watch list: Framer (closest substitution risk if they add code-export + n8n), Vercel v0 (if they package retainer), and any Anthropic-built "ship a marketing site" agent.

---

## Section recap — Competitor claims

- Squarespace owns the **edit-yourself** narrative but loses on **ownership + custom**.
- Freelancers and agencies own **craft** but lose on **predictability + autonomy**.
- AI-site generators own the **demo wow** but lose on **real ownership + flat-fee maintenance**.
- Nobody currently bundles all four. That's the wedge.

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

## What "fully grown" looks like (Stage 1)

- **~25–30 active retainer clients.** Mix: ~70% T2, ~20% T1, ~10% T3. (`02-pricing-tiers.md`.)
- **MRR ≈ CAD $6,000–$9,000** before setup-fee lumps. (`03-cost-analysis.md` Part D.)
- **Year-1 gross ~CAD $177k**, take-home ~$118k–$128k after Ontario sole-prop tax.
- **Operator hours: ≤60 / month** of client-facing work, plus 10–15 hours of monthly improvement runs.
- **Day job replaced** between months 9 and 12.

This is the explicit target the cost analysis is built around. It's not a "first step toward a unicorn." It's the destination of Stage 1.

Source: `docs/freelance/03-cost-analysis.md` Parts B–D.

---

## What "fully grown" looks like beyond Stage 1

| Stage | Horizon | What it looks like |
|---|---|---|
| **Stage 1 — Services + retainer** | now → 12 mo | Operator-run. ~30 clients max. The plan in this deck. |
| **Stage 2 — Managed-services agency** | 12–24 mo | Hire 1–2 operators. Scale to ~80 clients. Margins compress slightly. |
| **Stage 3 — Productise the operator side** | 24+ mo | Self-serve onboarding, customer-managed billing. Becomes a SaaS. |

Stage 3 is a different business with different risks (real product-market fit, real on-call). **Don't pre-build for it.** Stay in Stage 1 until genuinely outgrown.

Source: `docs/freelance/05-template-hardening-notes.md` "Long-term: should this become a SaaS?"

---

## What this business is *NOT* trying to become

- **Not a venture-scale SaaS.** No fundraising path. No "10× growth" hockey-stick.
- **Not an agency.** Hiring is deferred to Stage 2, not built into year-1 ops.
- **Not a hosting company.** Hosting is the client's, on their card.
- **Not a labour arbitrage shop.** No offshore team, no per-hour billing.
- **Not a product company yet.** No standalone software product is sold; the product is the **service experience**.

The strategy is *deliberate smallness with high margin per client*, not scale at any cost.

---

## Section recap — End goal

- Stage 1 destination: **30 retainer clients, ~$120k take-home, ≤60 op-hours/month**.
- Stage 2 destination: **~80 clients, 1–2 hires, ~24-month horizon**.
- Stage 3 destination: **SaaS productisation, deferred until 30+ clients prove the model**.
- The decision rule is: **paid retainers > everything else.**

> Pitch line: *"A 30-client retainer practice that prints predictable margin and gives the operator their evenings back."*

---

<!-- _class: lead -->

# 6 · Steps to achieve the end goal

*Top-of-funnel through retained client #30.*

---

## Steps in plain order

1. **Lock the brand and own the slugs.** `Lumivara Forge` is locked (`01-business-plan.md §1`); buy domain, GitHub org, Resend domain, Twilio sub-account. *(Done / in progress.)*
2. **Close the architecture critiques** — Pattern C lock, security topology, capacity reconciliation, ops sequencing. *(P4.6 in `00-INDEX.md`; underway.)*
3. **Bootstrap the mothership repo.** `palimkarakshay/lumivara-forge-mothership`, with workflow templates, scripts, n8n exports. (`05-mothership-repo-buildout-plan.md`, P5.)
4. **Spin out Client #1 (Lumivara People Advisory)** into its own clean Pattern C pair of repos. Use it as the showcase. (`docs/migrations/lumivara-people-advisory-spinout.md`, P6.)
5. **Publish the storefront.** Fiverr Gig 1, Upwork profile, Toptal/Arc/Lemon screening, LinkedIn case-study post. (`01-gig-profile.md` Part 10.)
6. **Sell Client #2 + #3.** Real arms-length retainers. Trigger MSA + payment automation + privacy work. (`08-future-work.md §1–§3`.)
7. **Cross client #5.** Trigger 1Password vault + break-glass envelope. (`08-future-work.md §4`.)
8. **Cross client #16.** Upgrade Claude Pro → Max 5x → Max 20x at the cliffs. (`18-capacity-and-unit-economics.md §6`.)
9. **Cross client #25.** Hire a part-time VA for client comms triage. (`03-cost-analysis.md` Part E.)
10. **Cross client #30.** Decide: hold (Stage 1), expand (Stage 2 hire), or productise (Stage 3 SaaS).

---

## Steps grouped by theme

| Theme | Steps |
|---|---|
| **Identity + IP** | Brand lock; mothership repo; vault; MSA + SOW. |
| **Product hardening** | Critique closure (Pattern C, security, capacity, ops); admin portal Phases 1–5; multi-AI fallback proven on a live client. |
| **Go-to-market** | Storefronts (Fiverr, Upwork, Toptal); LinkedIn; first 5 reviews; price step-ups. |
| **Operations** | Per-engagement provisioning matrix (`18-provisioning-automation-matrix.md`); evidence log per client; monthly + quarterly cadences (`03b-security-operations-checklist.md`). |
| **Finance + legal** | Stripe Subscriptions; auto-pause schedule; PIPEDA + provincial overlays; insurance once over $50k revenue. |
| **Scaling decisions** | Plan upgrades at clients 6 / 16 / 26; VA at 25; second engineer at 35. |

---

## The two non-negotiable invariants

1. **The two-repo separation (Pattern C) holds on every client.** No workflows on the site repo. No operator-side IP commingled into the client's tree. (`02b-pattern-c-architecture.md`, `pattern-c-enforcement-checklist.md`.)
2. **The session-budget charter (50% / 80% / 95% gates) holds on every Claude run.** No client floods the queue. No run exits incomplete on `main`. (`AGENTS.md` "Session charter".)

Everything else can flex. These two cannot.

---

## Section recap — Steps

- **Identity** (brand, repos, vault) → **Product** (close critiques, harden) → **Sales** (storefronts, first 5 clients) → **Scale** (cliffs at 6 / 16 / 26 / 30).
- The order matters: identity before product, product before sales, sales before scaling decisions.
- Pattern C and the budget charter are the **invariants** through every step.

> Pitch line: *"Lock the brand, harden the product, then sell — in that order."*

---
