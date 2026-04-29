<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SOURCE OF TRUTH
  Closes #114. Operator-side IP inventory + protection plan for Lumivara
  Infotech (provisional brand: Lumivara Forge — see `01-business-plan.md §1`).

  THIS IS A RESEARCH DRAFT, NOT LEGAL ADVICE.
  Sections marked with the 🜩 marker require review and sign-off by a
  licensed Ontario / Canadian small-business lawyer (and a US attorney for
  any US-touching item) before the operator relies on them. The marker is
  used so the operator can grep for unresolved legal items:
      grep -n '🜩' docs/mothership/21-ip-protection-strategy.md
================================================================================
-->

# 21 — IP Protection Strategy (Lumivara Forge)

Operator-side inventory of every intellectual-property asset the practice owns or touches, the protection mechanism that applies to each, the contracts that move ownership cleanly, and the insurance posture that backstops the legal layer when something goes wrong anyway. Companion to:

- [`08-future-work.md §2`](./08-future-work.md#2-client-contract-terms-legal) — MSA / SOW / AUP drafting trigger.
- [`08-future-work.md §4`](./08-future-work.md#4-ip--business-secrets-vault) — vault + break-glass envelope (operational protection).
- [`20-launch-and-operating-cost-model.md §2`](./20-launch-and-operating-cost-model.md) — line items for trademark filing, MSA drafting, insurance premium.
- [`02b-pattern-c-architecture.md`](./02b-pattern-c-architecture.md) — the two-repo trust model that keeps the operator's secrets out of every client repo (the *technical* protection of the autopilot trade secret).

> **Why this doc exists.** The autopilot — pipeline repos, n8n workflows, multi-AI router prompts, dashboard UI, freelance content prompt pack — is the moat. If a competitor (or an unhappy client) can copy it wholesale, the practice is reduced to a thin Next.js services agency. Pattern C protects it *technically*; this doc protects it *legally*. Both layers are necessary; neither is sufficient.
>
> **Scope.** This is the operator's working plan, not a published policy. Anything client-facing (privacy page, AUP, termination clause) is owned by [`08`](./08-future-work.md). Anything about *how secrets are stored* (1Password, break-glass) is owned by [`08 §4`](./08-future-work.md#4-ip--business-secrets-vault). This doc owns the *legal posture* only.

---

## §1 — IP inventory

Every category of asset the practice creates, touches, or relies on. The "Owner" column is who legally owns it under the proposed contracts (see §3); the "Sensitivity" column drives the protection mechanism in §2.

| # | Category | Examples | Owner (post-contracts) | Sensitivity |
|---|---|---|---|---|
| A | **Platform / pipeline source code** | The control-plane repo (`palimkarakshay/{{BRAND_SLUG}}-platform`), every per-client `<slug>-pipeline` repo, the multi-AI router, n8n workflows, GitHub App glue, dashboard SPA, CLI (`forge`) | Operator (Lumivara Forge sole-prop) | **Very high** — competitive moat; never leaves operator org |
| B | **Per-client site source code** | Each `<slug>-site` repo: Next.js app, copy under `src/content/`, design tokens, MDX insights, admin portal scaffolding | **Client** (assigned on engagement completion; see §3.3) | Medium — common-sense template work; operator-side templates remain operator-owned |
| C | **Brand assets — Lumivara Forge / {{BRAND}}** | Word mark "Lumivara Forge", logo, colour system, voice/tone, marketing copy on `{{BRAND_SLUG}}.com`, Fiverr/LinkedIn collateral | Operator | **High** — brand confusion with Lumivara People Advisory is a real risk |
| D | **Brand assets — client** | Each client's word mark, logo, photos, copy | Client (operator licenses for site-build use only) | Medium — handled by SOW per engagement |
| E | **Operational processes & runbooks** | This `docs/mothership/` folder, the freelance pack (`docs/freelance/`), per-engagement playbook (`06-operator-rebuild-prompt-v3.md`), security ops checklist (`03b`), provisioning matrix (`18`) | Operator | **Very high** — the entire know-how moat |
| F | **AI prompts & prompt pack** | `scripts/triage-prompt.md`, `scripts/execute-prompt.md`, the vertical content prompts in `docs/mothership/templates/`, the multi-AI router policy in `docs/AI_ROUTING.md` | Operator | **Very high** — directly reproducible if leaked |
| G | **Designs & component library** | Tailwind v4 + shadcn-on-Base UI design tokens, MDX renderers, component compositions, custom illustrations (if any) | Operator (template); client (any per-client custom design) | Medium |
| H | **Training data / fine-tunes** *(speculative — not in use today)* | If the operator ever fine-tunes a model on aggregated client data, the resulting weights and the data corpus | Operator (with explicit client consent in MSA) | Very high if it ever exists; today: **N/A** |
| I | **Issue history & engagement evidence logs** | Per-client `docs/clients/<slug>/evidence-log.md`, GitHub issue corpus, n8n execution logs | Operator (with client read access) | High — contains client confidential context |
| J | **Third-party dependencies** | Next.js, Tailwind, shadcn, Base UI React, n8n, Anthropic SDK, Gemini SDK, OpenAI SDK, Resend, Twilio, Stripe, Vercel, Railway | License-holders (each their own; see §2.5) | N/A — license compliance, not ownership |

> **Auditing the inventory.** Re-walk this table whenever a new asset class is created (e.g., the first fine-tuned model, the first piece of client-paid custom illustration, the first operator-published open-source package). Add a row before merging the new asset.

---

## §2 — Protection mechanism by category

Each IP type has a *primary* protection (the legal mechanism that does the heavy lifting) and one or more *secondary* protections (operational or contractual reinforcements). Don't conflate primary with sufficient — copyright protects expression but not ideas; a trademark protects a mark but not the underlying product.

### 2.1 — Copyright (automatic, no filing required)

Applies automatically under the [Canadian Copyright Act](https://laws-lois.justice.ca/eng/acts/c-42/) the moment an original work is fixed in a tangible medium. Covers: source code, written runbooks, marketing copy, logos (as artistic works), prompts (as literary works), database schemas, dashboard designs.

| Asset (from §1) | Copyright owner | Operator action |
|---|---|---|
| A — Mothership / pipeline code | Operator | None (automatic). Add `LICENSE` file = `UNLICENSED` or proprietary; never MIT/Apache by default. |
| B — Per-client site code | Operator initially; client on assignment per SOW (§3.3) | Add `LICENSE` file = client-specific (`Proprietary — {{CLIENT_NAME}}`) once assigned. |
| E — Runbooks | Operator | None. The `docs/mothership/` folder header banner already asserts confidentiality. |
| F — Prompts | Operator | None. Confidentiality banner + access control (private repo) is the practical protection; copyright is the legal backstop. |
| G — Designs (template) | Operator | None. |

**Term:** life of author + 70 years (Canada, post-CUSMA harmonisation as of 2022). Effectively permanent for practice purposes.

🜩 **Lawyer-review item:** confirm the recommended `LICENSE` text for (a) the platform repo, (b) per-client site repos post-assignment, and (c) any operator-published open-source utility (e.g., a future `forge` CLI). The operator's intent is to *never* publish under a permissive licence without explicit decision.

### 2.2 — Trademark (registered + common-law)

Applies to brand identifiers (word marks, logos, slogans). Common-law trademark exists from first commercial use in a region; registered trademark via [CIPO](https://www.ic.gc.ca/eic/site/cipointernet-internetopic.nsf/eng/Home) gives statutory presumption of validity nationally and a 10-year renewable term. US registration is via the [USPTO](https://www.uspto.gov/trademarks); EU via [EUIPO](https://euipo.europa.eu/).

| Mark | Action | Class(es) | Trigger | Cost |
|---|---|---|---|---|
| **"Lumivara Forge"** word mark | DIY clearance search (CIPO + USPTO TESS) → file CIPO Nice Class 42 (software / SaaS) + Class 35 (advertising / business services) | 35, 42 | Pre-launch DIY search; formal CIPO filing after MRR > CAD $3k or before client #5 (whichever first) | $336 base + $100/class fee at CIPO; ~$1,000 with lawyer review of clearance |
| **Lumivara Forge logo** | File alongside word mark or after first commercial logo lockup is finalised | Same | Same trigger as word mark | Bundled in same filing |
| **Tagline (TBD)** | Optional; defer until a tagline is locked in marketing collateral | 35, 42 | Year 2+ | $336 base each |
| **Lumivara People Advisory marks** | **Out of scope here** — owned by the *client* (Beas), not the operator. Note the brand-family overlap to avoid filing conflicts. | — | — | — |

**Operator pre-filing checklist** (DIY, 1 hour):

1. Search [CIPO Trademarks Database](https://www.ic.gc.ca/app/opic-cipo/trdmrks/srch/home) for `lumivara forge` and any phonetic variants.
2. Search [USPTO TESS](https://tmsearch.uspto.gov/) for the same.
3. Search Google + LinkedIn for unregistered common-law uses.
4. Confirm `lumivara-forge.com` and `.ca` are operator-controlled (already noted in `20 §2`).
5. Document findings in `docs/mothership/legal/trademark-clearance-2026.md` (create on first walk).

🜩 **Lawyer-review item:** before filing, have a Canadian IP lawyer review the clearance and choose Nice classes. Self-filing the CIPO form after the lawyer signs off on classes is fine; class selection is the high-leverage decision.

### 2.3 — Trade secret (the moat)

The autopilot's competitive value is *not* the code per se (a competent engineer could rewrite it) — it's the operational know-how: which prompts work, which n8n flow shapes, which models for which steps, which thresholds, which evidence-log structure. That value is best protected as a **trade secret** under common law (Canada) and the [US Defend Trade Secrets Act](https://www.law.cornell.edu/uscode/text/18/1836) (if/when US clients onboard).

A trade secret is only protected if the holder takes **reasonable steps** to keep it secret. The operator's reasonable-steps posture:

| Step | Status | Owned by |
|---|---|---|
| Private repos only; org-level membership tightly controlled | ✅ Today | [`02b-pattern-c-architecture.md`](./02b-pattern-c-architecture.md) |
| Confidentiality banner on every operator-only doc (`<!-- CONFIDENTIAL — OPERATOR-ONLY -->`) | ✅ Today | This folder |
| `.claudeignore` + `.cursorignore` exclude operator-only paths from agent uploads | ⚠️ Partial — verify before each engagement | [`03-secure-architecture.md`](./03-secure-architecture.md) |
| Non-redistribution clause in the MSA (client may not share operator-side prompts/workflows) | ⏳ Drafted in [`08 §2`](./08-future-work.md#2-client-contract-terms-legal); pending lawyer | §3 below |
| Contractor / sub-contractor NDA before any access | ⏳ Pending — see §3.4 | §3 below |
| Operator-controlled vault for credentials (1Password Business + break-glass envelope) | ⏳ Trigger: before client #5 | [`08 §4`](./08-future-work.md#4-ip--business-secrets-vault) |
| Pattern C zone isolation (no client repo can read pipeline repo) | ✅ Today | [`pattern-c-enforcement-checklist.md`](./pattern-c-enforcement-checklist.md) |
| Audit log + variable registry inventory | ✅ Today | [`docs/ops/variable-registry.md`](../ops/variable-registry.md) |

> **Trade-secret fragility.** Once a trade secret is leaked publicly, it cannot be re-secured. The patent route (§2.4) is the only fallback for genuinely novel mechanisms — and patents require disclosure, which is the opposite of secrecy. Pick one stance per asset; don't try to be both.

🜩 **Lawyer-review item:** confirm that the "reasonable steps" inventory above is sufficient under both Ontario common law and the US DTSA. In particular, confirm whether the MSA's non-redistribution clause needs to be a separate NDA executed *before* the client sees any operator-side material (e.g., during sales discovery), or whether the MSA suffices.

### 2.4 — Patent (likely deferred)

Patents protect novel, non-obvious, useful inventions for 20 years from filing — but require public disclosure and cost CAD $5,000–15,000 per filing per jurisdiction. The autopilot is **probably not patentable** for two reasons:

1. The component pieces (multi-AI routing, AI-on-CI loops, MDX content pipelines, GitHub Apps for cross-repo write) are individually well-known prior art.
2. Software patents in Canada are narrow and frequently invalidated; the [Amazon One-Click Canadian decision](https://www.canlii.org/en/ca/fca/doc/2011/2011fca328/2011fca328.html) and subsequent CIPO practice tightened the bar significantly.

**Operator stance:** **defer indefinitely.** Treat the autopilot as a trade secret (§2.3) and rely on the network-effect / operator-time moat, not patent monopoly. Revisit only if:
- A genuinely novel mechanism emerges (e.g., a new way to do AI-driven CI that isn't already prior art), AND
- The product roadmap includes selling to enterprises that demand patent indemnification, AND
- MRR > CAD $20k/month so the filing cost is not material.

🜩 **Lawyer-review item:** none required at this stage. If the operator changes posture and wants to file, that triggers a separate lawyer engagement.

### 2.5 — License compliance (third-party IP we use)

We don't *own* third-party dependencies; we use them under their licences. Compliance failures here are an IP risk inbound (someone sues us) rather than outbound.

| Dependency category | Typical licence | Compliance posture |
|---|---|---|
| Next.js, Tailwind, shadcn | MIT / Apache 2.0 | Permissive; bundle the licence text in `LICENSES/` per dependency. ✅ Today via `node_modules`. |
| Base UI React | MIT | Same. |
| n8n | Sustainable Use Licence (source-available, not OSI-approved) | ⚠️ Re-read terms before any commercial offering that exposes n8n directly to clients. Today's posture (operator-only, behind webhooks) is fine. |
| Anthropic / OpenAI / Gemini SDKs | MIT (SDKs) + provider AUPs (API) | SDKs are fine; the AUPs forbid certain content categories — already handled by the AUP draft in [`08 §2`](./08-future-work.md#2-client-contract-terms-legal). |
| MDX content / fonts / icons | Per-asset (varies) | Audit before shipping any new font / icon set. Default to SIL OFL or MIT. |
| Stock images | Per-source (Unsplash, etc.) | Track attribution requirements per image in `public/` README. Defer until first stock image is used. |

🜩 **Lawyer-review item:** confirm the n8n Sustainable Use Licence permits the practice's use shape (operator-hosted, never resold, used to deliver services to paid clients). If not, switch to the n8n Cloud paid tier or Activepieces / Make.com.

---

## §3 — Contractor & employee IP assignment policy

This is the section that, if drafted poorly, breaks every other section in this doc. Canadian default rules **do not** transfer IP from a contractor to a hiring party automatically — only employees-during-employment have a default work-for-hire presumption, and even that is narrower than the US default. **Every contractor relationship needs an explicit written assignment.**

### 3.1 — Founder-operator (today)

The operator is a sole-prop. All IP they create in the course of operating the business is owned by them in their individual capacity (which, for a sole-prop, is the same as the business). No assignment needed — but **at incorporation** (deferred — see [`08 §2`](./08-future-work.md#2-client-contract-terms-legal) and [`20 §2`](./20-launch-and-operating-cost-model.md#§2--one-time-launch-costs)), the operator must execute a **personal-to-corporate IP assignment** to move all pre-incorporation IP into the new entity. This is a 1-page document that costs ~$200 from a lawyer.

🜩 **Lawyer-review item:** at incorporation time, draft and sign a personal-to-corporate IP assignment covering: this repo's full history, the mothership repo, all docs in `docs/mothership/`, all freelance pack content, every prompt and workflow created before the incorporation date.

### 3.2 — Future employees (none today)

When the operator hires the first employee (Cliff 5 in [`18 §6`](./18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points), ~26 active clients), the offer letter must include:

1. **IP assignment clause** — all work product created in the scope of employment is assigned to the company.
2. **Pre-existing IP carve-out schedule** — the employee lists any prior inventions/code they bring in; everything *not* listed becomes assigned by default.
3. **Non-disclosure clause** — confidential info (customer lists, prompts, workflows) cannot be shared post-employment.
4. **Non-solicitation clause** (12 months post-termination) — cannot solicit clients or other employees.
5. **Non-compete** — *do not include in Ontario.* Ontario's [Working for Workers Act, 2021](https://www.ontario.ca/laws/statute/00e41) banned non-compete clauses for most employees in October 2021. Including one risks invalidating the rest of the agreement.

### 3.3 — Client engagements (the per-engagement assignment)

The MSA + SOW combo (drafted in [`08 §2`](./08-future-work.md#2-client-contract-terms-legal)) must split ownership cleanly. The recommended split, to be confirmed by lawyer:

| Asset class | Owner during engagement | Owner after engagement | Mechanism |
|---|---|---|---|
| Per-client site code (the Next.js repo) | Operator (operator org holds the repo) | **Client** | SOW assignment clause: "all custom site code created for the Client is assigned to the Client upon Engagement Completion, contingent on full payment of all fees." |
| Per-client content (copy, photos, brand) | Client (operator licensed only for build use) | Client | Stays with client throughout; operator never claims ownership. |
| Operator-side template / scaffolding code | Operator | Operator (perpetually) | MSA: "Client receives a perpetual, royalty-free, non-exclusive licence to use the Operator's template scaffolding *as embedded in the Client site*. Client may not extract, sublicense, or redistribute." |
| Pipeline / autopilot / mothership code | Operator | Operator | MSA: "Pipeline IP is operator-owned and licensed only for the Client's own use during the engagement term. No redistribution, no reverse engineering, no extraction." |
| Engagement evidence log | Operator | Operator (with client read access in perpetuity) | SOW: "Operator retains the engagement evidence log; Client retains a perpetual read-only copy." |
| Improvements / fixes the autopilot ships on Client repo | Operator (template-side) + Client (site-side) | Same | MSA carve-out: "Improvements that are template-applicable revert to the Operator's template; improvements that are Client-specific are owned by the Client." |

> **Why "contingent on full payment."** This is the standard small-business protection. Until payment is complete, the operator retains a security interest in the IP. If payment defaults, the operator can revoke the assignment and (after a notice period — see [`08 §3`](./08-future-work.md#3-payment-terms--non-payment-safeguards-legalbusiness)) take down the site.

🜩 **Lawyer-review item:** the entire 3.3 table. Especially: (a) is the "perpetual, royalty-free, non-exclusive" template licence enforceable in Ontario, (b) does the contingent assignment hold up under the [Sale of Goods Act](https://www.ontario.ca/laws/statute/90s01) or its services equivalent, and (c) is the "no reverse engineering" clause enforceable given Canadian Copyright Act §30.6 software interoperability exceptions.

### 3.4 — Sub-contractors (when the operator can't take a job alone)

If the operator subcontracts work (e.g., an illustrator for a custom client logo, or a French translator for Quebec Law 25 compliance), the subcontract must include:

1. **Pre-engagement NDA** — signed before the subcontractor sees any operator-side material.
2. **IP assignment** — all work product is assigned to the operator (who then re-assigns to the client per §3.3 if it's client-side).
3. **Moral rights waiver** — Canadian moral rights are non-assignable but **can be waived**. The waiver is necessary for the operator to modify or sublicense the work without re-consent.
4. **Independent contractor declaration** — clarifies tax + employment law (the contractor is not an employee).
5. **Scope-limited confidentiality** — the contractor sees only what they need; never the platform repo, never operator-side prompts.

🜩 **Lawyer-review item:** draft a one-page subcontractor NDA + IP assignment template. Reuse for every subcontractor; refresh annually.

---

## §4 — Insurance posture

Insurance is the layer that pays out when the legal layer fails. Three policies matter for a software services practice; one is optional.

### 4.1 — Professional liability (E&O — Errors & Omissions)

**Covers:** claims by clients alleging the operator's work was negligent, defective, or didn't meet the contract spec (e.g., autopilot ships a bad change that takes down the client's checkout page during Black Friday).

**Provider options (Canada):**

| Provider | Typical coverage | Annual premium estimate (sole-prop, 1–10 clients) |
|---|---|---|
| [Westland Insurance](https://www.westlandinsurance.ca/) | $1M / $2M aggregate | CAD $600–1,000 |
| [Zensurance](https://www.zensurance.com/) | $1M / $2M aggregate, online quoting | CAD $500–900 |
| [APOLLO Insurance](https://apollocover.com/) | $1M / $2M aggregate, online | CAD $500–1,000 |

**Trigger:** before client #2 (paying client). Skip for Lumivara People Advisory specifically (Beas is a known counterpart and the relationship is informal).

### 4.2 — Cyber liability

**Covers:** breach response costs (notification, credit monitoring), regulatory fines (PIPEDA, Quebec Law 25), and third-party damages from a breach of operator-held data.

**Provider options:** same as 4.1; cyber is usually a rider on the E&O policy. Add CAD $300–500/year for a $1M cyber rider.

**Trigger:** same as E&O (before client #2). Cyber risk is real even at one client because the operator already holds API keys and intake data.

### 4.3 — IP infringement insurance

**Covers:** the cost of defending an inbound IP infringement claim (someone alleges the operator's site templates copied their copyright, or that the brand "Lumivara Forge" infringes their mark). May also cover **outbound** infringement (the cost of pursuing someone who copied the operator's IP), but outbound coverage is rarer and pricier.

**Provider options:** specialist line; not all generalist insurers offer it. [TechAssure](https://www.techassure.ca/) and [Liberty Mutual Canada](https://www.libertymutual.ca/) are the usual referrals.

**Trigger:** *defer until MRR > CAD $10k/month.* The premium (CAD $2,000–5,000/year for $1M coverage) is high relative to the practical risk at sole-prop scale. The trade-secret + trademark filings (§2.2, §2.3) give the operator standing to sue or defend on their own dime in the early years; insurance just smooths cash flow during litigation.

🜩 **Lawyer-review item:** none for §4 directly, but the **insurance broker's contract** should be reviewed once before signing. Brokers occasionally include broad subrogation clauses that interact awkwardly with the MSA's liability cap.

### 4.4 — Business operations / general liability

**Covers:** generic small-business liability (someone trips at a client meeting, etc.). Bundled with Westland / Zensurance / APOLLO as a Commercial General Liability (CGL) rider for ~CAD $300/year.

**Trigger:** bundle with E&O at client #2 — minimal cost, broad coverage.

### 4.5 — Total annual insurance budget

| Year | Coverage | Estimated premium |
|---|---|---|
| Year 1 (1–5 clients) | E&O + cyber rider + CGL | CAD $1,200–1,800 |
| Year 2 (5–15 clients) | Increase E&O to $2M + cyber to $1M + CGL | CAD $1,800–2,500 |
| Year 3 (15–30 clients) | Add IP infringement $1M + increase cyber to $2M | CAD $4,500–6,500 |

These numbers are rough estimates from public broker quote pages; refresh by getting actual quotes from two providers before binding. Update [`20-launch-and-operating-cost-model.md`](./20-launch-and-operating-cost-model.md) when the actual premium is known.

---

## §5 — Jurisdictional considerations

The operator is Ontario-based; the practice serves primarily Canadian small businesses initially but the autopilot is jurisdiction-agnostic and the operator wants the option to onboard US and EU clients. Each jurisdiction adds a layer of IP exposure.

### 5.1 — Canada (primary)

- **Federal IP regime** — Copyright Act, Trade-marks Act, Patent Act (CIPO).
- **Provincial overlays** — Ontario (Sale of Goods, Working for Workers Act 2021 banning non-competes), Quebec (Charter of the French Language requires French-language commercial use; Law 25 affects privacy not IP directly), BC (no significant IP-specific overlay).
- **Practice posture:** file the trademark federally (CIPO), draft contracts in Ontario, default to Ontario superior court jurisdiction in MSA dispute-resolution clause.

🜩 **Lawyer-review item:** confirm that the MSA's "Ontario law and Ontario superior court jurisdiction" clause is enforceable against out-of-province (BC, AB, QC) clients. In particular, confirm Quebec consumer-contract rules don't override the choice-of-law if the client is a Quebec consumer (very unlikely for a B2B services contract, but worth confirming).

### 5.2 — United States (likely Year 2+)

- **Trademark.** USPTO filing is separate from CIPO. ~USD $350/class. Trigger: first US-based paying client OR public marketing targeted at US.
- **Copyright.** Automatic under US law (Berne Convention), but registration with the [US Copyright Office](https://www.copyright.gov/) (~USD $65 per work) is required to sue for infringement and to claim statutory damages. Defer until a US client engagement crosses USD $10k or there's a specific copy-cat threat.
- **Trade secret.** Defend Trade Secrets Act (federal) gives a private right of action against misappropriators. The "reasonable steps" inventory in §2.3 is the same standard.
- **Patent.** US software patents are slightly broader than Canadian but still narrow post-*Alice*. Same defer-indefinitely posture as §2.4.
- **Contract.** Add a US-jurisdiction addendum to the MSA when first US client onboards. Most practical option: keep Ontario law as the default but add a "US clients: New York law and federal court in SDNY" addendum. Exact choice depends on lawyer advice.

🜩 **Lawyer-review item:** before the first US client, consult a US attorney (most Canadian small-business lawyers can refer one) on (a) USPTO filing strategy, (b) jurisdictional choice for the contract, and (c) whether the operator needs a US-resident agent for service of process.

### 5.3 — European Union (Year 3+ if at all)

- **Trademark.** EUIPO unified filing (~EUR $1,300 for one class, all 27 member states). Defer until EU-based client onboards.
- **Copyright.** Berne Convention coverage already; EU Copyright Directive 2019 adds some specifics but doesn't change the operator's posture materially.
- **Trade secret.** EU Trade Secrets Directive (2016/943) is broadly aligned with the Canadian common-law standard.
- **GDPR (data protection, not IP).** Out of scope for this doc — owned by [`08 §1`](./08-future-work.md#1-data-protection--privacy-legalcompliance). But note: GDPR's "right of erasure" can interact with the operator's evidence log retention; flag for the privacy doc.

🜩 **Lawyer-review item:** **defer entirely until first EU client.** If a UK / EU prospect appears, treat as a project-specific legal engagement (estimated CAD $2,000–4,000 for initial advice).

### 5.4 — UK (post-Brexit)

UK is now separate from EU IP regimes. Trademark filing is via [UK IPO](https://www.gov.uk/government/organisations/intellectual-property-office) (~GBP $200 per class). Same trigger as EU: defer until first UK client.

### 5.5 — Jurisdiction summary table

| Jurisdiction | Trademark filing trigger | Contract jurisdiction default | Notes |
|---|---|---|---|
| Canada (Ontario) | Pre-launch DIY clearance; formal CIPO filing pre-client #5 | **Default** — Ontario law + Ontario superior court | Federal regime; provincial overlays for employment & consumer contracts. |
| United States | First US client | NY law + SDNY federal court (addendum) | USPTO filing + copyright registration adds value; trade secret strong. |
| European Union | First EU client | Project-specific (jurisdiction of client member state) | EUIPO unified filing; GDPR overlap with privacy doc. |
| United Kingdom | First UK client | Project-specific (English law + High Court) | Separate from EU post-Brexit. |
| All other (AU, NZ, IN, etc.) | Per-engagement decision | Project-specific | Don't proactively file; respond to actual client geography. |

---

## §6 — Sequencing & triggers

Bundling the triggers from §1–§5 into a single ordered checklist the operator can drive against. Numbers reference the launch budget table in [`20 §2`](./20-launch-and-operating-cost-model.md#§2--one-time-launch-costs) where applicable.

| Order | Action | Trigger | Cost (CAD) | Notes |
|---|---|---|---|---|
| 1 | DIY trademark clearance search (CIPO + USPTO TESS + Google) | Pre-launch | $0 | 1 hour. Document in `docs/mothership/legal/trademark-clearance-2026.md`. |
| 2 | Personal-to-corporate IP assignment (sole-prop → incorporation) | Incorporation date | ~$200 lawyer | Bundles with incorporation; defer until incorporation triggers. |
| 3 | Lawyer-drafted MSA + SOW + AUP + non-redistribution clause + IP carve-outs (§3.3) | Before client #2 | $1,500–2,500 | [`08 §2`](./08-future-work.md#2-client-contract-terms-legal) trigger. Single largest legal spend; do not skip. |
| 4 | Subcontractor NDA + IP assignment template (§3.4) | Before first subcontractor | $300 lawyer | Reusable. |
| 5 | E&O + cyber + CGL insurance (§4.1, §4.2, §4.4) | Before client #2 | $1,200–1,800/yr | Bundle through Zensurance or APOLLO. |
| 6 | Formal CIPO trademark filing (word mark + logo) | MRR > $3k OR pre-client #5 | $1,000 (with lawyer review) | Class 35 + 42; lawyer reviews clearance. |
| 7 | Operator-side break-glass + 1Password Business + successor protocol | Pre-client #5 OR MRR > $3k | $100/mo | [`08 §4`](./08-future-work.md#4-ip--business-secrets-vault) — operational, not legal, but reinforces trade-secret posture. |
| 8 | USPTO trademark filing | First US client OR pre-client #10 if US-targeted | USD $1,000 (with US attorney) | Same classes as CIPO. |
| 9 | IP infringement insurance | MRR > $10k/month | $2,000–5,000/yr | Optional but recommended once revenue is material. |
| 10 | EUIPO + UK IPO trademark filings | First EU/UK client | EUR $1,300 + GBP $200 | Project-specific. |
| 11 | Patent posture review | Year 3 OR genuinely novel mechanism emerges | $0 (decision; filing is separate) | Default: defer indefinitely. |
| 12 | Quarterly legal-review cadence | Year 2+ | $500–1,000/yr | One annual touch with the small-business lawyer to sweep §1 inventory + §3 contracts for drift. |

> **Line items #3, #5, and #7 are the practical floor.** Below that posture, the operator is functionally unprotected against a hostile client or contractor. Items #1 and #2 are essentially free and should happen immediately.

---

## §7 — Lawyer-review checklist (consolidated)

Every 🜩 item from §1–§6 in one list, in priority order, so the operator can hand this section to a small-business lawyer as a single engagement scope:

1. **§3.1 — Personal-to-corporate IP assignment** at incorporation. (1-page document; ~$200 flat fee.)
2. **§3.3 — Per-engagement IP assignment language in the SOW**, including the contingent-on-payment carve-out, the perpetual non-exclusive template licence, and the no-reverse-engineering clause. (Bundled with the MSA — line item #3 above.)
3. **§3.4 — Subcontractor NDA + IP assignment + moral rights waiver + independent contractor declaration template.** (1-page document; bundled or ~$300 flat fee.)
4. **§2.2 — Trademark clearance review and Nice class selection** before CIPO filing. (~$500–800 flat fee for a clearance opinion.)
5. **§2.1 — `LICENSE` text** for the platform repo, per-client site repos, and any operator-published OSS utility. (1-hour engagement; ~$300.)
6. **§2.3 — "Reasonable steps" trade-secret posture review.** Confirm the inventory in §2.3 is sufficient under Ontario common law and the US DTSA, and whether a separate sales-discovery NDA is required. (1-hour engagement; ~$300.)
7. **§2.5 — n8n Sustainable Use Licence compliance** for the practice's use shape. (30 min; can be operator-DIY by reading the licence text and writing a 1-paragraph memo for the file. Lawyer review only if ambiguous.)
8. **§5.1 — Ontario choice-of-law clause enforceability** against out-of-province clients (especially Quebec). (Bundled with the MSA — line item #3 above.)
9. **§5.2 — Pre-first-US-client consultation** with a US attorney on USPTO filing, jurisdictional choice, and resident-agent-for-service. (Project-specific; defer.)
10. **§4 — Insurance broker contract review** before signing. (15-min; usually free as part of broker's onboarding.)

> **Single-engagement bundling.** Items 1, 2, 3, 5, 6, and 8 can be bundled into a single 4–6 hour lawyer engagement at flat fee CAD $1,800–2,500 — the same engagement that drafts the MSA per [`08 §2`](./08-future-work.md#2-client-contract-terms-legal) and [`20 §2`](./20-launch-and-operating-cost-model.md#§2--one-time-launch-costs) line item #3. **Don't do these as separate engagements** — the lawyer's setup cost dominates each individual session.

---

## §8 — What this doc deliberately does NOT cover

- **Privacy / PIPEDA / Law 25 / GDPR** — owned by [`08 §1`](./08-future-work.md#1-data-protection--privacy-legalcompliance). Privacy is data protection, not IP protection; keep the two doctrines separate.
- **Payment terms & non-payment safeguards** — owned by [`08 §3`](./08-future-work.md#3-payment-terms--non-payment-safeguards-legalbusiness). The contingent-on-payment IP assignment in §3.3 is the **IP** half of that doctrine; the **revenue** half (Stripe automation, suspension schedule) is in `08`.
- **Operator-side credential storage** — owned by [`08 §4`](./08-future-work.md#4-ip--business-secrets-vault). Vault discipline reinforces trade-secret protection but is operational, not legal.
- **Specific contract drafting** — out of scope. Lawyer's deliverable.
- **Tax treatment of IP** — out of scope. Owned by the accountant, not this doc.

---

## §9 — Definition of done (issue [#114](https://github.com/palimkarakshay/lumivara-site/issues/114))

| DoD item | Status | Where it lands |
|---|---|---|
| IP inventory and protection plan documented | ✅ This doc, §1–§2 | — |
| Legal counsel consulted (human-only step) and recommendations captured | ⏳ Pending operator | §7 is the consolidated checklist for that engagement |
| Operator approves | ⏳ Pending operator review of this PR | — |

> The DoD item "Legal counsel consulted" is by definition a human-only step — the bot cannot retain a lawyer. This doc's role is to make the lawyer engagement maximally productive: §7 is the checklist; §3.3 and §6 are the highest-stakes items; §2.2 is the lowest-cost early action. Hand all three to the lawyer in a single sitting.

---

*Last updated: 2026-04-29.*
