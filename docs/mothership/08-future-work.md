<!-- OPERATOR-ONLY. Deferred items. -->

# 08 — Future Work (Deferred Items)

Five workstreams the user explicitly listed as "for later." None are blockers for P5 (mothership repo bootstrap) or P6 (first paid client). All are blockers before scaling past 5 paid clients.

---

## 1. Data protection & privacy (legal/compliance)

**Why later:** the autopilot doesn't store client end-user PII; intake forms are stored in private GitHub issues that the operator + bot can read. Today's posture is *adequate*; not *defensible*.

**What to draft (in this order):**
1. **Privacy Impact Assessment (PIA)** — one page per client tier; templates in `docs/operator/legal/PIA-template.md`.
2. **PIPEDA compliance checklist** for every client site footer (10 items).
3. **Provincial overlays:** Ontario (CASL for email), Quebec (Law 25 — *much* stricter; needs a French-language privacy page), BC (PIPA-BC).
4. **Data retention schedule** — GitHub issues, n8n executions, Vercel logs. Default: 12 months, then archive.
5. **Subprocessor list** — Anthropic, Google, OpenAI, Vercel, Resend, Twilio, GitHub, Railway. Publish as a `/subprocessors` page on `{{BRAND_SLUG}}.com`.
6. **Breach notification template** — `docs/operator/legal/INCIDENT_NOTIFY.md` — pre-drafted so panic-day doesn't compound.

Trigger: before client #3.

---

## 2. Client contract terms (legal)

**Why later:** the user has so far worked off informal proposals. That's fine for Lumivara People Advisory (Beas is a known counterpart). It is not fine for arms-length clients.

**What to draft:**
1. **Master Services Agreement (MSA)** — signed once per client, valid until terminated. Covers: scope, ownership ("site = client; system = operator-licensed"), term, payment, IP, warranty disclaimers, liability cap, data, dispute resolution.
2. **Statement of Work (SOW)** — signed per engagement on top of the MSA. Tier, deliverables, timeline, special integrations.
3. **Acceptable Use Policy** — what the client can and can't ask the autopilot to do (no unsolicited mail, no scraping, no malware).
4. **Termination clause** — 30-day notice; teardown modes from `02-architecture.md §7` referenced explicitly.
5. **Non-redistribution clause** — client may not share the operator's prompts, workflows, or operator-side docs with any third party.

Use a Canadian small-business lawyer once (~CAD $1,500–2,500 flat fee for the MSA template). Reuse forever.

Trigger: before client #2 (so Beas's engagement and client #2 can both sit on the same MSA).

---

## 3. Payment terms & non-payment safeguards (legal/business)

**Today:** ad-hoc invoicing via email. **Target:** automated subscription with built-in non-payment safeguards.

**What to build (technical):**
1. **Stripe Subscriptions** (or Lemon Squeezy) — one product per tier, monthly billing.
2. **`forge bill` CLI command** — generates invoices for setup fees + first month, sends via Stripe Invoicing.
3. **Auto-pause on non-payment:**
   - Day 0 (failed charge): n8n workflow `payment-failed` notifies operator + sends client a "we couldn't charge your card" email.
   - Day +7: second auto-email; auto-disable T2/T3 daily improvement runs (label `paused/pre-warn`).
   - Day +14: pause autopilot via `npx forge teardown --mode pause`. Admin portal banner: "subscription paused — please update payment to resume".
   - Day +30: full lockout. Admin portal redirects to "your subscription is paused; reach out to billing@{{BRAND_SLUG}}.com".
   - Day +60: graceful exit. Site stays live (it's their domain, their content); the autopilot is gone.

**What to draft (legal):**
1. Late-payment clause in MSA (1.5%/mo, compounded — Ontario standard).
2. NSF charge clause ($35 per failed charge).
3. "Suspension of services" clause spelling out the day-0/+7/+14/+30/+60 schedule.

Trigger: before client #2.

---

## 4. IP / business-secrets vault

> **Companion doc:** the *legal* layer of IP protection (inventory, copyright / trademark / trade-secret posture, contractor IP assignment, insurance, jurisdictional triggers, lawyer-review checklist) is owned by [`21-ip-protection-strategy.md`](./21-ip-protection-strategy.md). This section is the *operational* layer. Both must land — vault discipline reinforces the trade-secret "reasonable steps" requirement (`21 §2.3`).

**Why later:** today's `pass` + YubiKey works. **Target:** survive operator's laptop being stolen + survive operator being hospitalised.

**What to set up:**
1. **1Password Business Teams** account (~$8/user/month). Create vaults:
   - `{{BRAND}} — Operator Secrets` (PATs, API keys, Stripe keys)
   - `{{BRAND}} — Client Vaults — <slug>` (one per client; client-specific creds)
   - `{{BRAND}} — Legal & Finance` (contracts, banking, tax)
2. **Bitwarden self-hosted on Railway** as a backup (~$5/mo). Cross-import from 1Password monthly.
3. **Break-glass envelope:**
   - Print one master recovery code on paper.
   - Seal in a tamper-evident envelope.
   - Give to a trusted second party (lawyer? sibling? safe-deposit box?).
4. **Successor protocol** — written instructions that explain to a successor (or executor) how to access vaults if operator becomes unavailable. Stored in vault + envelope + trusted second party.

Trigger: before client #5 OR when MRR exceeds CAD $3,000 (whichever first).

---

## 5. Market research & expansion plans

**Why later:** the freelance pack already does light market research (target customer types, channels). Deeper research only matters once Tier 0–3 are validated by paying clients.

**Phase-1 questions to answer (months 6–12):**
1. **Where does the autopilot break down?** — Is it for non-English content? Multi-region SEO? E-commerce? Build a "where we say no" list with empirical reasons, not guesses.
2. **What's the LTV by tier?** — Track monthly retention by tier in Stripe. Confirm or refute the "T2 is the headline tier" assumption.
3. **What channels actually convert?** — Track inbound source for every paying client. Probably not Fiverr; probably LinkedIn + referrals.

**Phase-2 expansion candidates (months 12–24), in priority order:**
1. **Adjacent verticals** — same product, new audience: trades (plumbers/electricians), professional services (accountants/lawyers), wellness (therapists/coaches).
2. **Geo expansion** — Ontario → BC → Quebec (with French support); needs Law 25 compliance from §1.
3. **White-label-for-agencies** — already designed (Tier 4); promote only after the operator hits 20 active clients and has spare capacity.
4. **Productise the operator side** — managed-service-as-SaaS; Stage-3 from `docs/freelance/05-template-hardening-notes.md`. Defer until 30+ clients.

Trigger: monthly review starting month 6 of paid operations.

---

## 6. Sequencing summary

| Item | Trigger | Effort | Cost |
|---|---|---|---|
| §1 Privacy & PIPEDA | Before client #3 | 1 weekend | CAD $0 (DIY) or $500 (lawyer review) |
| §2 MSA + SOW | Before client #2 | 2 days drafting + lawyer review | CAD $1,500–2,500 |
| §3 Payment automation | Before client #2 | 1 weekend technical + 1 day legal | CAD $500 (legal) + $0 (Stripe) |
| §4 Vault | Before client #5 OR MRR > $3k | 1 weekend | CAD $100/mo (1Password + Bitwarden) |
| §5 Market research | Month 6 | Ongoing | $0 |

The whole "for later" stack runs ~CAD $2,500 one-time + $100/mo recurring. Bake into the cost analysis (`docs/freelance/03-cost-analysis.md`) once the brand is locked.

*Last updated: 2026-04-28.*
