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
### Investor briefing — refreshed 2026-04-30

A 30-client AI-leveraged services practice with ~95% pre-comp gross margin, deliberately small, optimised for take-home.

<br/>

*Confidential. NDA-gated. For investor / family-office circulation only.*

<span class="small">Every number on every slide cites a verified row in `docs/research/03-source-bibliography.md`. Conservative band wherever a range exists. **Brand-name reconsideration (D2) is open** per [`docs/mothership/15c-brand-and-domain-decision.md`](../mothership/15c-brand-and-domain-decision.md); this deck continues to use `Lumivara Forge` as a placeholder until D2 lands.</span>

---

## What we are not

This is *not*:

- a venture-scale SaaS asking for a $2M seed,
- an agency raising for headcount,
- a marketplace, a multi-tenant database, or an e-commerce platform.

It *is* a productized service practice with sub-$5k/yr cash overhead, no payroll, and a hard 30-client cap. We are explaining the mechanics in case you want to participate as a strategic supporter — not pitching a fund-raise.

---

## The wedge in one sentence

> A real Next.js website the small business **owns outright**, that they **edit from a phone shortcut**, that an **AI autopilot improves monthly**, for a **flat subscription** — sitting in the gap between $17/mo DIY builders and $4,995/mo design subscriptions.

The category we sit in is "managed productized service for high-LTV professional-services SMBs." Closest competitors and their published prices, all re-verified 2026-04-29:

| Competitor | Verified pricing | Source |
|---|---|---|
| Squarespace / Wix / Hostinger | $17 – $139 / mo | `[V] §B-Wix-Squarespace` |
| Boutique agency | $6k – $12k upfront + $75 – $150 / hr edits | `[S] §B-Boutique-Agency` |
| WP Buffs (maintenance) | $79 – $447 / mo | `[V] §B-WP-Buffs` |
| DesignJoy / Midday | $4,995 – $7,995 / mo + $999 / mo Webflow | `[V] §B-DesignJoy` |
| **Lumivara Forge** T2 | CAD $4,500 setup + CAD $249 / mo | this repo |

---

## Why now (3 numbers, independently verified)

| Stat | Source | Implication |
|---|---|---|
| **75%** of consumers have abandoned a purchase or inquiry due to an outdated/unprofessional website | HostingAdvice 2024 / PRNewswire (`[V] §B-Outdated-75`) | Decay is a measurable revenue tax on every SMB |
| **3,117** federal-court ADA-website lawsuits filed in 2025; **+27%** YoY | Seyfarth Shaw / ADA Title III Tracker (`[V] §B-ADA-Lawsuits`) | Compliance is now a legal-liability surface, not a brand topic |
| **95.9%** of WebAIM Million home pages had detected WCAG failures in 2024; **56.8** errors / page average | WebAIM Million 2024 (`[V] §B-WebAIM`) | The DIY / unmaintained baseline is failing |

The pitch isn't "we use AI." It's "we close the $200/edit, 2-week-wait gap that makes every other SMB site decay between launch and obsolescence."

---

## ICP — who pays

Three persona tiers (full pack: `docs/research/04-client-personas.md`). All three operate on annual marketing budgets that **dwarf** our T2 retainer.

| Persona | Tier | Their existing budget | Lumivara's slot |
|---|---|---|---|
| **P1 — Premium solo professional** (lawyer / coach / HR consultant) | T2 | Law firms ~$120k – $150k / yr on SEO alone (`[V] §B-Law-Firm-Spend`) | < 5% of their existing web/SEO line |
| **P2 — Local health practice** (dental / physio / clinic) | T2 / T3 | 5 – 10% of revenue on marketing; ~30 – 40% on web + SEO (`[S] §B-Dental-Spend`) | Replaces an existing maintenance vendor |
| **P3 — Boutique services firm** (5–25 staff) | T3 | CAD $20k – $60k / yr on web + tooling typical | Bottom of their existing range |

Anti-persona: trades / restaurants / micro-budget local businesses (`docs/research/04-client-personas.md` §A1) — explicitly excluded.

---

## TAM / SAM — conservative band

We bound the market on the low end intentionally.

- **Canada — SAM proxy.** 1.29 million small businesses ≈ 99.8% of all enterprises (2024). 1.10M of those are *employer* businesses. (`[V] §B-Canada-SMB`, ISED Key Small Business Statistics 2024.)
- **Global professional-services TAM.** 2024 management-consulting services market valued at **USD $161.2B** (low-end estimate); other firms publish $183B – $466B for the same year using broader definitions. Use the low end and footnote the range. (`[C] §B-MC-Market`.)
- **Practice-level reach.** At 30 active clients, we serve ~0.0023% of Canadian small businesses. The market is decisively not the bottleneck; the operator's reach is.

<span class="footnote">Footnote on TAM: the consulting-market figure has wide methodological variance ($161B – $466B for 2024). The conservative low end is used here. We do not claim a "market size of $X billion that we will capture Y% of."</span>

---

## Unit economics — derived, not aspirational

These figures are taken directly from `docs/storefront/03-cost-analysis.md` Part D and `docs/mothership/18-capacity-and-unit-economics.md`. They are the operator's actual planning numbers, not investor-facing inflations.

| Line | Year-1 actual plan |
|---|---|
| Active clients (year-end) | 30 – 32 |
| MRR (year-end) | CAD $9,200 |
| Year-1 gross | ~CAD $177,000 |
| Year-1 net (before personal income tax) | ~CAD $170,500 |
| Operator hours / month at saturation | ~115 – 175 |
| Cash overhead / month at 30 clients | CAD $900 – $1,100 (< 5% of revenue) |

Year-1 take-home (after Ontario sole-prop tax): **~CAD $118k – $128k.** This is the destination, not the ceiling.

---

## Margin profile

Two reasons the margin holds.

1. **No payroll until client #35.** The operator runs everything to ~30 clients (`docs/storefront/03-cost-analysis.md` Part E). VA hire at 25, second engineer at 35.
2. **Infrastructure is flat.** AI subscriptions, GitHub Free, Vercel Hobby, Resend Free, Twilio per-client (~$1.15/mo USD) all scale sub-linearly. Cost-per-client falls as the roster grows.

| Stage | Active | Cash overhead / mo | Gross margin (pre-comp) |
|---|---|---|---|
| Months 1 – 3 | 2 – 7 | CAD $90 – $200 | > 95% |
| Month 12 | 30 – 32 | CAD $900 – $1,100 | > 95% |

Industry comparison: AI-enabled solo operators commonly report **65 – 75%** gross margins (`[S] §B-Solopreneur-Margin`); traditional agencies compress to **40 – 50%** under headcount load. Our 95% is achievable because we run no payroll.

---

## Competitive moat

Six operational features only Lumivara Forge ships in this combination today (full detail: `docs/storefront/06-positioning-slide-deck.md` §2):

1. **Phone-as-CMS** over a real codebase — no major SMB builder offers this loop.
2. **Multi-vendor fallback ladder, five legs deep** — Claude Opus → Gemini Pro → Gemini Flash → GitHub Models → OpenRouter on the deepest stage; every stage has a primary plus at least two fallbacks. Single-vendor outage never blocks the queue, and four of the five legs are free-tier-accessible (`docs/AI_ROUTING.md`; `scripts/codex-review-fallback.py`).
3. **Plan-then-Execute pipeline** — every routine issue gets a structured AI plan as a PR comment *before* code is written; client reads the plan first.
4. **Tier-based cadence with 24/7 watch tier** — T0 manual, T1 daily, T2 every 2h, T3 hourly *plus* `triage` and `llm-monitor-watch` every 15 min on the operator side. The bot's "energy" is a sold feature; the watch tier keeps the queue moving overnight.
5. **Two-repo isolation (Dual-Lane Repo)** — clean `<slug>-site` for the client, separate `<slug>-pipeline` repo for the operator. Operator IP and AI prompts never touch the client's tree (`docs/mothership/02b-dual-lane-architecture.md`).
6. **Bot self-awareness pipeline** — `llm-monitor` watches provider status, four LLM-bot RSS feeds, and a Stack Overflow collector, then auto-rewrites `KNOWN_ISSUES.md` and `RECOMMENDATIONS.md`. The triage / plan / execute prompts ingest those files at runtime, so when an upstream-provider quirk lands, the fleet steers around it without a human in the loop (`docs/mothership/llm-monitor/runbook.md`).

The site is a commodity. The system *around* the site is the moat.

---

## Why the boundaries are the moat

Operator-internal source: [`docs/mothership/sales-verticals/00b-why-this-sells.md §2`](../mothership/sales-verticals/00b-why-this-sells.md). The case in one paragraph:

The negative list (no SEO ranking guarantees, no public AI chatbot, no ghost-written content, no lead-volume promises, no review-gating, no all-in-one EMR replacement, no white-label, no equity-only deals, no paid ads, no social media management) is **a cash-flow-positive filter, not a scope cut**. A standard agency retainer carries a hidden subsidy: the licensee pays for things the agency cannot legally deliver inside a flat monthly fee, on the working assumption that the regulator, the platform TOS, or the FTC will not notice. Three things compound that liability — discovery skews to the licensee (every regulator + platform + *Moffatt v. Air Canada* (2024 BCCRT 149) attaches failure to the licensee, not the vendor); selection skews against the agency (sophisticated licensees churn); pricing skews under disclosure (once a prospect has heard the negative-list reasoning, every competitor's bundle reads as a liability transfer).

| Axis | Standard agency book | Lumivara Forge book under the negative list |
|---|---|---|
| Churn | Concentrated at the moment a regulator letter arrives | Distributed and predictable; no regulator surprises |
| NPS / referral intensity | Dampened by silent dread of "they cut a corner" | Amplified by *"this vendor finally told me what was actually going on with my last vendor"* |
| Price elasticity | Compresses each renewal | Stays inelastic — boundaries the prospect can't unbundle |

And every drawback in `docs/research/06-drawbacks-and-honest-risks.md` is **bounded *because* the negative list is enforced** — D1 (no public AI surface, hallucination lives behind the publish gate), D3 (the cap holds because the refusals keep load below it), D5 (we can afford accessibility CI because we don't run the SEO retainer that would compete for that budget), D7 (the negative list is itself the qualifier), D8 (the moat is the structural refusal to take the liability transfer that funds every competitor's growth — durable across model generations).

The investor question is not "does the negative list reduce TAM?" — it does, by design — but **"does the negative list make the closed buyers more valuable?"** It does on three measurable axes (churn, NPS, price elasticity), and that is what makes the 4×–10× private-comp band sustainable for this practice.

> Pitch sentence: *Show us another retainer-services business in this price band where every refusal maps to a regulator citation, a platform-TOS clause, an FTC rule, or an operator-economics constraint — and where the same negative list produces a lower-churn, higher-NPS, more inelastic 30-client book than a standard agency's 200-client book.*

---

## Comparable valuation — for sizing only

We are not raising. If we were, the relevant private comparables (`[V] §B-SaaS-Multiples`, SaaS Capital + Aventis Advisors + Multiples.vc 2025-2026):

- Private SaaS / productized-service: **4× – 10× revenue** (vertical AI top performers 9× – 12× ARR).
- Public SaaS index: **~26× EBITDA** in aggregate (top quartile higher).

At year-1 ARR of CAD ~$110k (steady-state MRR × 12), conservative band is CAD ~$440k – $1.1M enterprise value. We do not quote the public-market top-quartile multiples on this slide and do not use the "22.4× EBITDA / 22.3% AI-premium" framing that one of our research artefacts surfaced — that figure is at the very top of the public band and inappropriate for a private services practice.

<span class="footnote">If a strategic investor wishes to participate via revenue-based financing or partnership-shaped equity, see deck 02 (partner). This deck does not propose a security.</span>

---

## Risk register (named, mitigated, residual)

Full pack: `docs/research/06-drawbacks-and-honest-risks.md`. The five that matter to an investor:

| Risk | Severity | Mitigation in repo today | Residual |
|---|---|---|---|
| AI hallucination (`§D1`) | High | Plan-then-Execute + tap-to-publish + Lighthouse / axe CI gates | Subtle bugs that pass all gates — addressed by per-client evidence log |
| Operator burnout (`§D3`) | Critical | 30-client cap, session-budget charter, weekly cadence, planned 2-week break | Personality-bound; cap reduces probability |
| ADA legal liability (`§D5`) | High | axe-core in CI; E&O / cyber liability insurance above $50k revenue | Automated tools catch ~30 – 50% of WCAG; manual review for the rest |
| Provider outage (`§D4`) | High | Five-leg multi-vendor fallback ladder (Anthropic + Google + OpenAI + GitHub Models + OpenRouter) | Simultaneous outage across three primary providers *and* two free public model gateways (extremely rare) |
| Competitive substitution (`§D8`) | Medium-High over 24 mo | Watch list reassessed every 2 months; deliberate-smallness strategy | Real but slow |

The single biggest existential risk is operator burnout, not the market or the technology.

---

## What we are *asking* an investor for

Not capital. Three concrete things, in priority order:

1. **Warm intros.** Two ICP-fit prospects (P1 / P2 / P3) per quarter is a meaningful tailwind for the first 12 months.
2. **Pressure-testing.** Stress-test the plan on the contested claims (`§B-MC-Market` market sizing, `§B-Solopreneur-Margin` margin band). The advisor deck (`docs/decks/05-advisor-deck.md`) is the structured version of this conversation.
3. **Optionality on a future round.** If Stage 2 (small-team agency) or Stage 3 (productisation into a SaaS) opens in 24+ months, first-look access to participate.

---

## What success looks like (year 1)

- 30 active retainer clients (mix: ~70% T2, ~20% T1, ~10% T3).
- CAD ~$170.5k net before tax / ~CAD $118 – 128k take-home after Ontario sole-prop tax.
- Operator hours per month at saturation ≤ 175.
- Day job replaced (months 9 – 12 trigger).
- Zero published incidents that would have cost a regulated client a compliance finding.

Year 2+ optionality is unforced: hold (Stage 1), expand (Stage 2 hire), or productise (Stage 3 SaaS).

---

<!-- _class: lead -->

# Thank you.

<br/>

*Source files: `docs/research/01`, `03`, `06` · `docs/storefront/03-cost-analysis.md` Parts B–D · `docs/mothership/18-capacity-and-unit-economics.md`*

<span class="small">© 2026 — confidential. The system shown in this deck is proprietary and licensed per engagement.</span>
