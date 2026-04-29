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
  table { font-size: 0.82em; }
  code { background: #f0ece2; padding: 2px 6px; border-radius: 3px; }
  .small { font-size: 0.78em; color: #666; }
  .footnote { font-size: 0.72em; color: #888; }
---

<!-- _class: lead -->

# Lumivara Forge
### Partnership briefing

For someone joining hands-on in operations and maintenance — sharing the work, sharing the upside.

<br/>

*Confidential. Single-recipient deck.*

<span class="small">Numbers cite verified rows in `docs/research/03-source-bibliography.md`. Internal numbers (capacity / cost / cliffs) cite `docs/storefront/03-cost-analysis.md` and `docs/mothership/18-capacity-and-unit-economics.md`.</span>

---

## Why this conversation, with you

You've watched this thing get built. You've used it. You understand both the mechanics and the boundaries — the two-repo isolation, the budget charter, the "say-no-to" filter — in a way that is rare to find ready-made.

The next 12 months can be done solo (`docs/storefront/03-cost-analysis.md` Part C) but they don't *have to be*. A partner who shares the operational load and shares the upside is the most leveraged hire we could make — and "hire" is the wrong word for the relationship I'm describing.

This deck is the one-page version of that conversation.

---

## The model in one breath

> We sell flat-fee, AI-managed marketing websites to high-LTV professional-services SMBs (lawyers, dentists, boutique consultants, small firms). Sites the client owns outright, edits from a phone, and that improve themselves every month. We cap at 30 clients in Stage 1.

Headline numbers — same source as the operator-internal cost model in `docs/storefront/03-cost-analysis.md` Part D:

- Year-1 gross: ~CAD $177k
- Year-1 net before personal income tax: ~CAD $170.5k
- Cash overhead at saturation: < 5% of revenue
- Operator hours / month at 30 clients: 115 – 175
- Day job replaced months 9 – 12

---

## Why this market, why now

Three independently verified facts (full source detail: `docs/research/01-validated-market-and-technical-viability.md` §1):

| Stat | Source | Why it matters |
|---|---|---|
| 75% of consumers abandon outdated/unprofessional websites | HostingAdvice 2024 / PRNewswire (`[V] §B-Outdated-75`) | Decay = revenue tax. Every SMB with a 2019 site is bleeding inquiries. |
| 3,117 federal-court ADA-website lawsuits in 2025 (+27% YoY) | Seyfarth Shaw / ADA Title III (`[V] §B-ADA-Lawsuits`) | Compliance is now legal, not aesthetic — and it lands on the small business owner |
| 95.9% of WebAIM Million pages fail WCAG; 56.8 errors/page average | WebAIM 2024 (`[V] §B-WebAIM`) | The DIY / unmaintained baseline is failing publicly |

This is the buyer's pain. Our wedge is closing the $200/edit + 2-week-wait gap.

---

## ICP — who we sell to (and who we don't)

Three personas (full pack: `docs/research/04-client-personas.md`).

| Persona | Tier | Their existing budget | Why they switch |
|---|---|---|---|
| P1 — solo lawyer / coach / HR consultant | T2 | $120k – $150k/yr SEO (`[V] §B-Law-Firm-Spend`) | Their site is dated, "next quarter" item, competitors look better |
| P2 — local health practice (dental / physio / clinic) | T2 / T3 | 5 – 10% of revenue on marketing; 30 – 40% on web + SEO (`[S] §B-Dental-Spend`) | Compliance + owner can't update + mobile-first |
| P3 — boutique services firm (5 – 25 staff) | T3 | CAD $20k – $60k/yr on web + tooling | One named accountable person, not a 3-person agency |

**Anti-persona:** trades / restaurants / salons. Margins too thin, update cadence too high. Discipline matters; one bad client costs more than ten good ones earn (`docs/storefront/03-cost-analysis.md` Part C, "honest caveats").

---

## How the work actually splits

Two-person operations are *not* "one of us does sales, the other does delivery." That model is fragile. Better:

- **Both** do PR review and tap-to-publish gates — keeps quality calibrated.
- **Both** can on-call the operator dashboard for any client.
- **Lead operator** (existing) owns intake, pricing, contract, and the freelance pipeline.
- **Partner** owns the monthly improvement runs, the per-client evidence logs, and the AI-routing reliability work (`docs/AI_ROUTING.md`, `docs/mothership/18 §6` cliffs).
- **Quarterly handover.** Every 90 days we swap one client between us so neither gets too narrow.

Result: one of us can take a real two-week break without the queue starving. That alone changes the burnout math.

---

## Cadence and tooling — what you'd actually use

The week (`docs/mothership/01-business-plan §7`):

| Day | Activity |
|---|---|
| Mon AM | Inbox sweep on the dashboard; re-rank Inbox issues across all clients |
| Mon PM | Weekly AI smoke-test review (`ai-smoke-test.yml`) |
| Daily | PR review on the mobile dashboard — merge greens, kick reds back to issues |
| Wed | Monthly improvement run for one T2/T3 client (rotate roster) |
| Fri | Cost check — ccusage, Action minutes, Twilio balance, Resend deliverability, n8n health |
| Last Fri / month | Per-client "where is this site going next?" thinking; draft 1 – 2 issues each |

You'd live in: GitHub Actions, the operator GitHub-Pages dashboard (mobile-first), the n8n instance on Railway, and a 1Password vault. No CRM, no Jira, no Slack-as-process.

---

## Capacity cliffs — what we already know breaks

From `docs/mothership/18-capacity-and-unit-economics.md §6`. Cliffs are not surprises; they are scheduled.

| Cliff | Trigger | Action |
|---|---|---|
| 1 | Client #6 | Claude Pro → Max 5x |
| 2 | GitHub Free Action minutes saturate | Pay-go on Actions or move CI to a paid runner |
| 3 | n8n free tier saturates | Railway Pro |
| 4 | Client #16 | Max 5x → Max 20x |
| 5 | Client #26 | 2nd Anthropic seat — *this is what unlocks a second engineer* |

Cliff 5 is the relevant one for partnership economics. We hit it on the existing forecast at month 10 – 11.

---

## Profit-share — illustrative, not a contract

Two structures we should jointly choose between (the *real* contract is owed to a Canadian small-business lawyer, scheduled in `docs/mothership/08-future-work §6` "MSA + SOW templates").

**Structure A — Revenue split.** Partner takes a fixed percentage of net revenue (post-overhead, pre-tax) starting from the date they engage. Simpler; no upfront price tag.

**Structure B — Hybrid retainer + share.** Partner gets a smaller fixed monthly retainer plus a smaller share of net revenue. Lower variance for the partner; higher operator carry on upside.

Indicative: 30 clients × CAD $500 blended ARPU = CAD $180k ARR; net pre-tax pre-comp ~CAD $170.5k (`docs/storefront/03-cost-analysis.md` Part D). A 30/70 partner-share at saturation = CAD ~$51k/yr to the partner, retainer-style. Either structure shifts as we move into Stage 2 (hires) or Stage 3 (productisation).

---

## What you'd be choosing into

A 30-client roster, capped on purpose. ~$170k/yr net at saturation, split between two operators by whatever structure we agree on. Hours: ~60 – 90 per month per operator at saturation, less in months 1 – 6. Stress profile: low (the cap is the main reason).

You would *not* be choosing into:

- A venture-scale grind. Not the goal.
- A "we'll figure out the contract later" arrangement. We won't engage you operationally until the MSA + profit-share is signed.
- Hosting any client's primary infrastructure on personal accounts. Pattern C two-repo isolation is mandatory; secrets stay org-side.

---

## What's already de-risked

A blunt list. Things that sometimes worry partners about new ventures, that aren't issues here:

- **Product-market fit on the existing client.** lumivara-forge.com runs the full pipeline daily.
- **Pricing has a defensible floor and ceiling.** `docs/storefront/02-pricing-tiers.md` four-tier ladder, validated against verified competitor pricing in `docs/research/03 §B`.
- **Provider risk is mitigated.** Multi-AI fallback ladder in `docs/AI_ROUTING.md`. We don't pause when Anthropic hiccups.
- **Operator IP is protected.** Pattern C (`docs/mothership/02b-pattern-c-architecture.md`) is locked. The client's repo is genuinely vanilla; the pipeline never crosses over.
- **The legal sequence is documented.** `docs/mothership/08-future-work.md` schedules MSA, PIPEDA, vault, insurance — none of it is "TBD."

---

## What's not de-risked (read this twice)

The honest pack: `docs/research/06-drawbacks-and-honest-risks.md`. The four that matter most to a partner:

| Risk | What it would mean for you |
|---|---|
| **D3 — Operator burnout** (severity: critical) | The literal point of having a partner. We share the load *and* the recovery time. |
| **D7 — Single bad client poisons the queue** (severity: medium) | We jointly enforce the say-no-to filter. One bad call is forgivable; a pattern of bad calls is the partnership's job to fix. |
| **D2 — Phone-as-CMS adoption drag** (severity: medium) | If a client signs up but never uses the shortcut, our LTV is shorter than planned. Bounded by clean churn. |
| **D8 — Competitive substitution by Framer / Vercel v0 / Anthropic** (severity: medium-high over 24 mo) | We jointly maintain the watch list and reassess every 2 months. |

If any of these breaks the deal for you, say it now — not at month 6.

---

## What I'm asking for

In order:

1. **A 30-day no-commitment trial.** You shadow the existing operator for 30 days — review PRs, sit in on a discovery call, audit one client's evidence log. We both decide at day 30.
2. **A written profit-share + scope-of-work** drafted by a Canadian small-business lawyer (line item already scheduled in `docs/mothership/08-future-work §6`).
3. **A 2-year initial term** with a clean exit clause at the 12-month mark for either side. Long enough to feel the cap; short enough to not feel trapped.

---

## What you'd own as your own answer

Three concrete things, in your name, that survive the partnership:

1. **A documented operating record** — your name on per-client evidence logs, your handle on PRs, your GitHub commits. Real receipts of having operated a 30-client AI-leveraged services practice.
2. **An equity-shaped income stream** — partnership profit share on a roster you helped build.
3. **Optionality on Stage 2 / Stage 3.** If we hire, you're the one drafting the SOW. If we productise, you're the founding-team co-operator on the SaaS spinout.

---

<!-- _class: lead -->

# Thank you.

<br/>

*Confidential — single recipient.*

*Source files for this deck: `docs/research/04-client-personas.md`, `06-drawbacks-and-honest-risks.md` · `docs/storefront/03-cost-analysis.md` Parts B–E · `docs/mothership/01-business-plan.md` §7, `18-capacity-and-unit-economics.md` §6.*

<span class="small">© 2026 — confidential. Operator IP is licensed per-engagement.</span>
