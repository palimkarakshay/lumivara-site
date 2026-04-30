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
### Advisor pressure-test briefing

For a senior advisor / mentor we are asking to push hard on the unfinished parts of the plan — not to applaud the done ones.

<br/>

*Confidential. Single-recipient deck. Refreshed 2026-04-30 (end-of-day refresh: added Contested claim 6 + How-we-ensure-it-sells section in response to advisor pushback that the operator-side stack is "over-engineered crap that won't ever sell"; six per-vertical sales playbooks now live under [`docs/mothership/sales-verticals/`](../mothership/sales-verticals/) — each carrying per-vertical 24-month ROI math, regulator-of-record, and vendor-displacement detail).*

<span class="small">This deck is structured around what's contested, not what's settled. The settled parts live in `docs/decks/01-investor-deck.md` and `docs/storefront/06-positioning-slide-deck.md`. **Brand-name reconsideration (D2) is now formally open** per [`docs/mothership/15c-brand-and-domain-decision.md`](../mothership/15c-brand-and-domain-decision.md) — your read on the brand question (Open Strategic Question 1, below) is now actually load-bearing, not hypothetical.</span>

---

## What we're asking you for

Fifteen minutes per slide, on four things:

1. **The contested claims.** Push on `[C]` rows in `docs/research/03-source-bibliography.md` — especially the management-consulting market sizing and the AI-premium valuation framing.
2. **The plan-margin assumptions.** Stress-test our 95% pre-comp gross margin and the year-1 take-home of CAD ~$118 – $128k.
3. **The 30-client cap as the actual ceiling.** Is the cap protective, or is it a way to dodge the sales work that would prove this is a real business?
4. **The "over-engineered crap won't sell" pushback** (Contested claim 6, below). Read the new per-vertical sales playbooks in [`docs/mothership/sales-verticals/`](../mothership/sales-verticals/) and tell us which vertical's math you'd press on first. The pack is the structured response to this critique; if it's still "won't sell" after a 30-minute read of one of the six templates, that's a critical signal we'd act on before Phase 2.

If you want to push on something else, push there. We'll re-route the slides on the fly.

---

## The plan in one paragraph (so you can disagree faster)

> A solo operator (with a possible second hand on the wheel) builds and maintains marketing websites for high-LTV professional-services SMBs. Sites run on a real Next.js codebase the client owns; an AI autopilot orchestrated by n8n + Claude + Gemini + OpenAI ships preview PRs that the client approves with a tap. Cap at 30 clients in Stage 1; year-1 destination CAD ~$170.5k net before personal tax, ~CAD $118 – $128k take-home after Ontario sole-prop tax, ≤175 operator hours/month at saturation.

The mechanism is not novel; the *combination* — phone-edit + Dual-Lane Repo + multi-AI fallback + flat fee — is. The thesis is "deliberate smallness with high margin per client beats scale-at-all-costs."

---

## What's settled

You don't need to push on these:

- **The wedge exists.** The "missing middle" between $17/mo DIY and $4,995/mo DesignJoy is empirically real (verified competitor pricing in `docs/research/03 §B`).
- **The buyer pain is documented.** 75% / 3,117 / 95.9% — all `[V]`. (`docs/research/03 §B-Outdated-75`, `§B-ADA-Lawsuits`, `§B-WebAIM`.)
- **The technology is production-grade.** lumivara-forge.com runs the full pipeline. Multi-AI fallback is wired, Dual-Lane Repo is locked, evidence logs are templated.
- **The risk register is named and partially mitigated.** `docs/research/06-drawbacks-and-honest-risks.md`.

If you find a hole in any of the above, please push — but the load-bearing question is below.

---

## What's contested — please push hard

### Contested claim 1 — Market sizing

| Question | Our position |
|---|---|
| What's the global management-consulting market? | We use **$161.2B in 2024**, the low-end of a published range that runs $161B – $466B across firms ([`[C] §B-MC-Market`](../research/03-source-bibliography.md)). The investor deck footnotes the range. |
| Is the low end honest, or are we sandbagging? | We think it's honest — the high-end estimates use "consulting" definitions that include adjacent services we'd never sell to. But push: is there a methodology we'd use that lands at a defensible mid-band? |

---

### Contested claim 2 — Margin

| Question | Our position |
|---|---|
| Can a solo operator hold 95% pre-comp gross margin at 30 clients? | Derived in `docs/storefront/03-cost-analysis.md` Part D and `docs/mothership/18-capacity-and-unit-economics.md`. Cash overhead at 30 clients is CAD $900 – $1,100/mo on revenue ≈ CAD $23,200/mo. |
| Is that sustainable through cliff transitions? | Cliffs at clients 6 / 16 / 26 (`docs/mothership/18 §6`). Each step adds ~CAD $100 – $200/mo to AI subscription cost; nothing else moves materially. Margin stays > 90% across cliffs. |
| Where does it break? | If model deprecation forces the 2nd Anthropic seat earlier than client #26, margin compresses by ~3 percentage points until the seat amortises across more clients. Worth gaming. |

---

### Contested claim 3 — The 30-client cap

| Question | Our position |
|---|---|
| Is the cap protective or evasive? | Protective in our framing: it preserves quality and prevents burnout. We named operator burnout as the single biggest existential risk (`docs/research/06 §D3`). |
| Could we, instead, build to 60 with a partner and 1 engineer? | Yes — that's Stage 2 in `docs/mothership/01-business-plan §6`. We're explicit that Stage 2 is *available* but not pre-built into year-1. |
| Are we using the cap to avoid sales work? | Push hard. We'll defend it on the math (175 op-hours / mo at 30 clients is the actual ceiling), but the question is fair. |

---

### Contested claim 4 — Comparable valuations

| Question | Our position |
|---|---|
| What do private productized services trade at? | **4× – 10× revenue** band, vertical AI top performers 9× – 12× ARR (`[V] §B-SaaS-Multiples`). At ~CAD $110k year-1 ARR, the conservative band is CAD ~$440k – $1.1M EV. |
| Why didn't we use the 22.4× EBITDA / 22.3% AI premium framing in raw research #2? | That figure is at the very top of the public-market band and inappropriate for a private services practice. We flag it in `docs/research/01 §5` and explicitly do not quote it in the investor deck. |
| Is our band too conservative? | Possible. If we're underselling, push us toward a defensible mid-band — something like 6×–8× revenue with explicit comparables. |

---

### Contested claim 5 — Hallucination risk vs. sold quality

| Question | Our position |
|---|---|
| Is HITL enough? | Plan-then-Execute + Vercel preview + tap-to-publish + Lighthouse / axe CI gates. SWE-bench Bash Only ~33% failure (`[S] §B-SWE-bench`) is the load-bearing concern; HITL converts it from "broken in production" to "rejected at preview." |
| What's the residual? | Subtle bugs that pass all gates — silent contact-form drops, navigation regressions on edge devices. Mitigation: weekly synthetic checks (`ai-smoke-test.yml`) + per-client evidence log. |
| Is that residual honestly priced? | This is where we want your reading. We think it's bounded by the cap and the manual review per client, but we'd take a critique. |

---

### Contested claim 6 — "This is over-engineered crap and won't ever sell"

> _Verbatim feedback from a senior advisor, 2026-04-30. Treated here as the load-bearing pushback to address before Phase 2._

| Question | Our position |
|---|---|
| Is the operator-side stack over-engineered? | **Partly yes, deliberately.** The complexity is not the product — it's the *leverage* that lets one operator hold 95% pre-comp gross margin at 30 clients (`docs/storefront/03-cost-analysis.md` Part D). What the client buys is a website + a phone-edit shortcut + a flat retainer. What's "over-engineered" is the multi-AI fallback + Dual-Lane Repo + CI gates *behind* that simple front. The advisor's instinct that the operator-side build has out-paced the sales work is not wrong. |
| Is it "crap"? | The stack ships preview-PRs to a real client site every week (Client #1 / `lumivara-forge.com` build). Pipeline is operational, not theoretical. The dispute is whether the *pace* of sales work matches the *pace* of platform work — historically, no. Phase 2 changes that ratio. |
| Will it sell? | **Testable claim**, addressed below. The new [`docs/mothership/sales-verticals/`](../mothership/sales-verticals/) pack (added 2026-04-30) makes the math concrete per vertical: status-quo digital spend in our six target verticals already runs CAD $7k-$60k/yr per practice; T2 is $10,476 over 24 months; per-engagement payback is 1-5 acquired clients per vertical. If the math is right, the unit economics work; if the math is wrong, the advisor's pushback wins. |

---

## How we're working to ensure it sells

The over-engineering critique is partly about *priority*: too much platform, too little go-to-market preparation. The 2026-04-30 sprint changed the priority.

| Action | Status | Evidence |
|---|---|---|
| **Per-vertical sales playbooks for the six high-LTV verticals.** Each runs the same 18-section spine: persona, pain map, basic + aspirational requirements, Lumivara Forge mapping, regulator-of-record, why-now stats, R-reasons, ROI math, switching-risks, three-call sales flow, 6-8 objection handlers, source citations, prospecting heuristics, vendor-pattern displacement table. | ✅ Live (six rows Full as of this commit) | [`docs/mothership/sales-verticals/00-INDEX.md`](../mothership/sales-verticals/00-INDEX.md), `doctors-sales-template.md`, `dentists-sales-template.md`, `lawyers-sales-template.md`, `accountants-sales-template.md`, `physiotherapy-sales-template.md`, `optometry-sales-template.md`. Each ~450-510 lines, dense, citation-traced, operator-only. |
| **24-month ROI math is now per-vertical, not generic.** Status-quo digital spend ranges have been pulled per vertical against published competitor pricing + practice-management benchmarks. Per-engagement payback is sized to the practice's own LTV math (rostered patient, dental procedure, legal matter, accounting engagement, allied-health treatment plan, optometry retail bundle). | ✅ Live | §13 of every vertical template. |
| **Regulator-of-record cross-walk.** Each vertical names the actual statute / college / state board that makes a non-compliant site a real liability — not a generalised "ADA bad" frame. CPSO, RCDSO, LSO §4.2, CPA Ontario §401-§403, COO §6 + §14, FTC Contact Lens Rule, Quebec Bill 96. | ✅ Live | §9 of every vertical template. |
| **Vendor-displacement maps.** Each vertical names the *category* of incumbent vendor we displace (template builders, PMS-bundled sites, reputation-management bundles, vertical-marketing agencies). The pitch differentiation is structural, not promotional. | ✅ Live | §19 of every vertical template. |
| **Prospecting heuristics.** 10-14 signal evaluation rubrics per vertical for spotting prospects with bad sites in the displacement window — without naming individual practices in operator-scope docs (defamation discipline). The operator's CRM holds the names; this folder holds the test. | ✅ Live | §19 of every vertical template. |
| **Sales-cycle calendar.** Tax season is a no-pitch window for accountants; equity-meeting cycles slow law-firm decisions; multi-discipline wellness centres need all discipline leads on Call 1. The patterns are documented per vertical, not improvised on a live call. | ✅ Live | §15 / §18 of every vertical template. |
| **Honest backfill list.** Every `[S]`-flagged number in every vertical template ledgers an open `area/research` issue to backfill `docs/research/03-source-bibliography.md` with the primary source before externally quoting. We do not externally quote `[S]` numbers; the audit log enforces this. | ⏳ Pending — issues to be filed | §17 of every vertical template; gating via `03-source-bibliography.md §C`. |
| **First-paid-client closure.** Lumivara Forge runs in production today on Client #1's site. The next milestone is **paying Client #2**, not feature work on the platform. Phase 2 (`docs/migrations/01-poc-perfection-plan.md`) explicitly de-prioritises non-revenue work until the second close lands. | ⏳ Phase 2 entry condition | `docs/migrations/01-poc-perfection-plan.md`. |
| **Public lumivara-forge.com case-study site.** Strategic Question 3 below — staying quiet vs. publishing. The advisor pushback on "won't sell" tilts the answer toward publishing this quarter. | ⏳ Decision pending | Strategic Question 3, this deck. |

The pitch sentence we'd want the advisor to push on after reading the new pack:

> *"Each of the six vertical templates carries 24-month math against the prospect's own published-cost line items, plus a per-engagement payback ratio rooted in the prospect's own per-client LTV. If the math is wrong on any one of those six rows, the over-engineering critique compounds and the unit economics fail. If the math is right on at least three of six, the practice survives the cap with margin to spare. We'd rather hear which vertical you'd press on first than defend in the abstract."*

---

## Three open strategic questions

These don't have answers in the deck pack yet. Your read on each would directly shape the next 90 days.

1. **Brand-name reconsideration (D2 in ADR `15c`, formally open as of 2026-04-30).** The locked `Lumivara Forge` from `15 §4` is back on the table; operator wants cleaner, leaner, non-hyphenated. Pre-vetted shortlist (already in `15 §2`): **Cadence** (mechanic-mirrors-naming), **Continuum** ("doesn't decay between updates"), **Loom** (distinct, premium, single-word slug), **Helm** / **Lighthouse** (both have collision caveats — Helm is a Kubernetes package manager; Lighthouse is a Google perf-audit tool), **Compass** (advisory frame), or **Plumbline** (drops the Lumivara umbrella entirely). Phase 0 of the migration plan, the GitHub org slug, the trademark search, and a second mechanical drift sweep are all blocked on this.
2. **Do we open Stage 2 (small-team) at client #25 or wait until #35?** The hire-ladder in `docs/storefront/03-cost-analysis.md` Part E says VA at 25, engineer at 35. A faster engineer hire compresses operator hours but also compresses partner-share economics.
3. **Do we publish a public lumivara-forge.com case-study site this quarter, or stay quiet until Client #2 closes?** A public site accelerates inbound; a quiet posture protects Dual-Lane Repo IP positioning.

---

## What we'd take from this conversation

Not approval. Specifically:

1. **A list of "things you'd push on if you were the investor in deck 01."** We'd rather hear them now than at a real diligence call.
2. **A read on the contested-claim slides** (3 – 5 above). One sentence each: defensible / soften / drop.
3. **One thing this deck pack is missing** that the operator would not have caught. Open ask.

---

<!-- _class: lead -->

# Thank you.

<br/>

*Confidential — single recipient.*

*Source files for this deck: `docs/research/03-source-bibliography.md` (the [V]/[S]/[C] flags) · `docs/research/04-client-personas.md` · `docs/research/05-reasons-to-switch-to-lumivara-forge.md` · `docs/research/06-drawbacks-and-honest-risks.md` · `docs/mothership/01-business-plan.md`, `18-capacity-and-unit-economics.md` · `docs/mothership/sales-verticals/00-INDEX.md` (six per-vertical sales playbooks; the structured response to the "over-engineered crap won't sell" pushback in Contested claim 6) · `docs/storefront/03-cost-analysis.md`*

<span class="small">© 2026 — confidential.</span>
