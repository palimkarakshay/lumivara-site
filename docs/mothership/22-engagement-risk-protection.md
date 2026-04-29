<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SOURCE OF TRUTH
  Closes #121. Defines Lumivara Infotech's documented posture against three
  client-engagement risks: (1) data privacy, (2) IP leakage, (3) clients
  failing to pay after a contract is signed.

  This file is **not legal advice and is not a contract**. The drafted clauses
  in §3, §4, and the supporting language in §6 are operator-side starting
  points that MUST be reviewed by licensed counsel in the engagement's
  jurisdiction before any client signature. The DoD on #121 explicitly carves
  legal counsel as a human-only step; this file does not pretend to substitute
  for it (see §7).

  Pattern C rule: this file never ships in a client repo (`00-INDEX.md`
  rule 2; `03 §1` rule 2). Quote sections into the MSA / SOW only via the
  carve-outs called out per-section.
================================================================================
-->

# 22 — Engagement Risk Protection (data, IP, payment)

> **Doc scope.** A single referenceable plan the operator opens during onboarding and contract signing so the three engagement risks below are explicitly disclosed, mitigated where the operator controls the lever, and accepted in writing where the operator does not.
>
> **Out of scope.** (a) Operator-side IP and business secrets storage — covered by [`21-vault-strategy-adr.md`](21-vault-strategy-adr.md). (b) Per-client runtime secret topology — covered by [`03-secure-architecture.md §3`](03-secure-architecture.md#3-secret-topology). (c) The launch / recurring cost model that funds the legal review on which §3 and §4 depend — covered by [`20-launch-and-operating-cost-model.md`](20-launch-and-operating-cost-model.md).

---

## §1 — Scope and audience

This doc has two readers:

1. **The operator**, before every client onboarding, every contract signing, and quarterly thereafter. Read top-to-bottom on the first engagement; jump straight to §6 (onboarding flow) on later engagements with §2/§3/§4 as reference when a clause is questioned.
2. **A licensed lawyer**, once, when the operator hands them §3 (IP clauses) and §4 (non-payment safeguards) as the *starting point* for the MSA / SOW package called for by [`08 §2`](08-future-work.md#2-client-contract-terms-legal). The lawyer is the authority on enforceable wording; this file is the operator's structured brief.

| Section | Lives where in the client-facing world |
|---|---|
| §2 — Data privacy posture | Quoted into the MSA's "data" section + summarised in a `/privacy` page on the client domain (the long form lives in the per-client repo's privacy page; the source-of-truth language is here). |
| §3 — IP protection clauses | Drafted here; the lawyer adapts and ships them into the MSA / SOW. Never quote verbatim to a client without that pass. |
| §4 — Non-payment safeguards | The schedule (deposits, milestones, suspension ladder) goes into the SOW per engagement; the contractual hooks (late-payment interest, NSF, suspension-of-services clause) go into the MSA. |
| §5 — Risk register | Operator-internal. Surfaces in the [`19-engagement-evidence-log-template.md`](19-engagement-evidence-log-template.md) header as the rationale for the disclosure step in §6. |
| §6 — Onboarding / signing flow | Operator-internal runbook. Cross-referenced from [`19 §1`](19-engagement-evidence-log-template.md#1--header-frozen-at-engagement-start) and [`06-operator-rebuild-prompt-v3.md`](06-operator-rebuild-prompt-v3.md). |
| §7 — Out of scope / human-only | Operator-internal. Names the work that is *deliberately* not done here. |
| §8 — Open questions | Operator-internal. Things the doc cannot resolve without a lawyer, an insurance broker, or a tax accountant. |

The default disposition for every section is **operator-only**. A section is client-facing only when this table says it is.

---

## §2 — Data privacy posture (PIPEDA / Quebec Law 25 where applicable)

This section is the structured input for the PIPEDA work deferred at [`08 §1`](08-future-work.md#1-data-protection--privacy-legalcompliance) and the Law 25 architectural items at [`12 §7`](12-critique-security-secrets.md#7----lesser-pipeda--law-25-compliance-is-partly-architectural). Closing #121 does not close those — it gives them a stable starting frame.

### §2.1 What client-side PII Lumivara Infotech actually touches

Three surfaces, all narrow:

| Surface | Data | Origin | Storage | Retention default |
|---|---|---|---|---|
| Admin portal magic-link auth | Email address of the client's named operator portal user(s) | Set at engagement start in `src/lib/admin/clients.ts` | Vercel env (per-client `AUTH_*`); never in repo | For the life of the engagement; deleted on teardown per [`02 §7`](02-architecture.md#7-teardown-modes) |
| Public contact form (per client domain) | Name + email + free-text message + (optional) phone | Form submission on the client's marketing site | Issue in the per-client repo (`palimkarakshay/<slug>-site`) labelled `contact-form`; mirrored to the operator's email via Resend | 12 months in the issue tracker; archived at month 13 |
| Engagement evidence log | Operator-side notes about the engagement | Operator hand entry per [`19-engagement-evidence-log-template.md`](19-engagement-evidence-log-template.md) | Mothership repo, per-client subdirectory `docs/clients/<slug>/` | Append-only for the life of the engagement; archived (read-only) for 7 years post-teardown — see §8 question 2 for confirmation |

Out of scope for this doc, but flagged for completeness:

- **End-customer PII collected through the client's own business workflows** (e.g., a recruiter's candidate database, a therapist's intake forms). That is the *client's* PII, processed under the client's own privacy posture; Lumivara is not the controller. The MSA's data section names the operator as a service provider with no independent right to use that data.
- **Anthropic, Google, or OpenAI prompt content** during automation runs. Any client data that flows through a model API is in scope for the subprocessor list at §2.4.

### §2.2 Lawful basis, retention, deletion

For every row in §2.1:

| Question | Answer |
|---|---|
| Lawful basis | Contract performance (PIPEDA principle 4.3 / GDPR Art. 6(1)(b) equivalent). The client's portal user consents at first sign-in; the contact-form submitter consents via the form's privacy notice (drafted into the per-client privacy page). |
| Retention window | As stated in §2.1's "Retention default" column. |
| Deletion-on-request flow | Client-domain contact form: operator deletes the corresponding GitHub issue and removes the email thread within 30 days of a verified request, logged via `evidence-log.md` `redo_of: deletion-request-<date>` entry. Admin portal user: removed from `src/lib/admin/clients.ts` and the Vercel env entry purged within 7 days. |
| Subject access flow | The operator runs `gh issue list --repo palimkarakshay/<slug>-site --label contact-form --search "<email>"` and exports matching issues to PDF for the requester. The 30-day clock starts at the verified request date. |

Both flows are operator-manual today. They become candidates for `forge` CLI automation once a third client lands; tracked as a follow-up against [`08 §1`](08-future-work.md#1-data-protection--privacy-legalcompliance).

### §2.3 Quebec Law 25 specifics (when the client domain serves QC residents)

Trigger: the client either (a) has a registered office in Quebec, (b) markets explicitly to Quebec residents, or (c) collects French-language form submissions at a meaningful rate. Any one trips the Law 25 surface.

When tripped:

1. **Privacy officer.** The operator is named as the privacy officer for the engagement in the per-client privacy page. Contact email: `privacy+<slug>@lumivara.ca`. Mirrored to the [`19`](19-engagement-evidence-log-template.md) header at engagement start.
2. **Breach notification SLA.** A confidentiality incident posing a risk of serious injury triggers (a) notification to the *Commission d'accès à l'information du Québec* and (b) notification to affected individuals "with diligence." Lumivara's internal SLA target is *within 72 hours of confirmed breach*, mirroring GDPR's clock — Law 25's phrasing is looser but 72h is defensible. The pre-drafted notification template is the deferred deliverable at [`08 §1`](08-future-work.md#1-data-protection--privacy-legalcompliance) point 6.
3. **Data residency.** Architectural follow-up tracked at [`12 §7`](12-critique-security-secrets.md#7----lesser-pipeda--law-25-compliance-is-partly-architectural) point 2. For the doc's purposes: when a Quebec client signs, the operator sets `data_residency: ca` in the per-client `cadence.json`, which (per [`12 §7`](12-critique-security-secrets.md#7----lesser-pipeda--law-25-compliance-is-partly-architectural)) disables non-Canadian model fallbacks. Vercel's Canadian region (Toronto) is preferred when available; if a region is unavailable for a given product, the limitation is disclosed in writing per §6 step 2.
4. **French-language privacy page.** Required if the client serves QC residents. The per-client repo carries both `/privacy` (English) and `/privacy-fr` (French); both are sourced from the same canonical content with the French translation reviewed by a Quebec-licensed lawyer once and reused. Translation cost lives in [`20 §3`](20-launch-and-operating-cost-model.md#3--recurring-operating-costs-practice-wide) line F (legal/compliance) on the first QC engagement.

The doc deliberately does not assert "Lumivara is Law 25 compliant." It states *which controls are in place* and *which are pending counsel review*. Compliance is a status counsel confers; the operator earns it by closing §7 and §8.

### §2.4 Subprocessors

The list shipped at the `/subprocessors` page on `{{BRAND_SLUG}}.com` per [`12 §7`](12-critique-security-secrets.md#7----lesser-pipeda--law-25-compliance-is-partly-architectural) point 1, mirrored here as the source of truth:

| Subprocessor | Role | Data touched | Region default |
|---|---|---|---|
| Vercel | Hosting + edge runtime | All page requests; admin portal magic-link emails routed via Resend | US (configurable per project; Toronto when Law 25 applies) |
| Resend | Transactional email (auth + contact-form mirror) | Recipient address + email body | US |
| Twilio | SMS intake (T2/T3 only — see [`04-tier-based-agent-cadence.md`](04-tier-based-agent-cadence.md)) | Recipient number + SMS body | US |
| Anthropic | Model inference (default) | Prompt content + the model's response | US (Bedrock Canada path is the Law 25 fallback per §2.3 point 3) |
| OpenAI | Model fallback | Prompt content + response | US — disabled when `data_residency: ca` |
| Google (Gemini) | Model fallback / deep research | Prompt content + response | US — disabled when `data_residency: ca` |
| GitHub | Source code + issues + Actions runtime | Per-client repo contents; contact-form issues | US |
| Railway | n8n hosting | n8n workflow payloads (per-client SMS / email orchestration) | US (Singapore/EU optional) |

Adding a subprocessor requires (a) a `SECURITY_OPS_LOG.md` entry, (b) a one-line update to the `/subprocessors` page, (c) per-client notification when the new subprocessor will touch data already in their workflows. Removing a subprocessor requires the same plus a 30-day notice to clients whose data flowed through it.

### §2.5 Technical controls (cross-link, not duplicate)

The operational controls that back this section live elsewhere; do not duplicate them here.

- Per-client secret topology: [`03 §3`](03-secure-architecture.md#3-secret-topology).
- Monthly + quarterly cadence (incl. recovery drill): [`03b §1`](03b-security-operations-checklist.md#1--monthly-checklist-first-monday-of-the-month) + [`§2`](03b-security-operations-checklist.md#2--quarterly-checklist-first-friday-of-the-quarter).
- Operator-side credential vault (where contracts and per-client correspondence live): [`21-vault-strategy-adr.md §3`](21-vault-strategy-adr.md#3--vault-structure).
- Pattern C trust boundary (why the client repo and the pipeline repo are separate): [`02b-pattern-c-architecture.md`](02b-pattern-c-architecture.md).

---

## §3 — IP protection — clauses suitable for the MSA / SOW

**Status: draft language for counsel review. Do not paste into a signed MSA without the legal pass at §7.**

The four "never" rules from [`03 §1`](03-secure-architecture.md#1-the-four-nevers) are internal policy today. This section's purpose is to surface them as *contractual obligations* on the operator AND drafted clauses that sit on the *client's* side of the table to protect Lumivara's tooling, prompts, and operational know-how.

### §3.1 Pre-existing IP (whose was already there)

Each party retains all right, title, and interest in IP it owned, controlled, or licensed before the engagement begins. Drafted starter language:

> "Pre-existing Intellectual Property" means any Intellectual Property owned, developed, or licensed by a party prior to the Effective Date or independently of this Agreement. Each party retains all right, title, and interest in its Pre-existing Intellectual Property. To the extent a party's Pre-existing Intellectual Property is incorporated into a Deliverable, that party grants the other a non-exclusive, royalty-free, worldwide, perpetual licence to use such Pre-existing Intellectual Property solely as necessary to use, operate, maintain, and modify the Deliverable for its intended purpose.

The asymmetric purpose: the operator's pre-existing IP includes the entire mothership repo, the autopilot prompts, the n8n workflow library, and the `forge` CLI. The client's pre-existing IP is typically their brand assets, copy, and any prior site code. This clause keeps both sides honest about who brought what.

### §3.2 Work-product (whose is what we built)

Default position, drafted for counsel:

> "Deliverables" means the per-client marketing site (the `<slug>-site` repository contents), the per-client privacy page, the per-client copy and content authored under this Agreement, the per-client design assets, and any other artefact explicitly listed in the SOW. Title to all Deliverables vests in Client upon full payment of the SOW invoice for the milestone in which the Deliverable was produced.
>
> "Operator Tooling" means the Lumivara Infotech autopilot, including without limitation the mothership repository, the per-client pipeline repository (the `<slug>-pipeline` repository), the model-routing logic, the agent prompts, the n8n workflow templates, the `forge` CLI, the AI Ops dashboard, and any operational documentation under `docs/mothership/` or `docs/operator/`. Operator Tooling is and remains the exclusive property of Operator. Client receives no right, title, or licence to Operator Tooling other than the right to access the Deliverables it produces during the term of this Agreement.

Three corollaries the lawyer should write explicitly into the same section:

1. **No reverse engineering of Operator Tooling.** Client agrees not to (and not to permit any third party to) reverse engineer, decompile, derive prompts from, or otherwise attempt to reconstruct the Operator Tooling from the Deliverables it observes.
2. **No training of third-party models on Lumivara prompts or workflow structure.** Client may not use Operator Tooling, the prompts it observes via the AI Ops dashboard, or the structure of automated Pull Requests as training data for any machine-learning model owned by Client or licensed to a third party.
3. **No redistribution of Operator Tooling outputs as templates.** Client may not bundle, white-label, or resell the Deliverables or any subset of Operator Tooling artefacts as a template, course, or service offering. (Client *may*, of course, hire someone else to maintain or extend their own Deliverables — that is the ownership clause working as intended.)

### §3.3 Confidentiality

Mutual NDA, with a carve-out for the operator's right to publish anonymised case studies. Drafted starter:

> Each party shall hold in confidence all non-public information of the other party disclosed under this Agreement ("Confidential Information"), including but not limited to business plans, customer lists, technical specifications, source code, and any information designated in writing as confidential. Confidential Information may be used solely for the performance of this Agreement and may not be disclosed to any third party without prior written consent, except (a) to a party's employees, contractors, or advisors with a need to know who are bound by confidentiality obligations no less protective than those in this Agreement, or (b) as required by law.
>
> Notwithstanding the foregoing, Operator may reference Client's name, logo, and a one-paragraph anonymised description of the engagement in case studies, marketing materials, and proposals to other prospective clients, provided that no Confidential Information of Client is disclosed and Client has not opted out in writing within thirty (30) days of the Effective Date.

The carve-out is load-bearing: the operator's strongest social proof is naming clients, and the marketing site already names *Lumivara People Advisory* as Client #1 (see [`15 §7`](15-terminology-and-brand.md)). This clause makes that pattern contractual rather than informal.

### §3.4 Residual knowledge

> Nothing in this Agreement restricts a party's ability to use general knowledge, skills, and experience retained in unaided memory by individuals who had access to the other party's Confidential Information, provided that such use does not involve the disclosure or use of any specific Confidential Information.

Without this clause, clauses §3.1–§3.3 are over-broad: the operator's lead engineer cannot un-know how to build a sites-with-autopilot business after each engagement ends. The lawyer will know this clause; surface it explicitly to make sure it survives the draft pass.

### §3.5 Restrictions on training third-party models on Client data

The mirror obligation on the operator's side, to balance §3.2 corollary 2:

> Operator shall not use Client's Confidential Information, end-customer personal information processed under this Agreement, or any data submitted via Client's marketing site or admin portal as training data for any machine-learning model, whether owned by Operator, a subprocessor, or a third party. Operator shall ensure that all subprocessors listed in §[Subprocessors] under this Agreement have committed to the same restriction in their service terms or processing agreements applicable to Operator's account.

This is the contractual surface for the §2.4 subprocessor list. As of writing, Anthropic, OpenAI, and Google (Vertex / Gemini Enterprise) all offer "no training on your data" terms on their paid API tiers; the operator must be on those tiers (not the consumer tiers) to make this representation truthful. Confirm before signing the first MSA.

### §3.6 Operator's "four nevers" become contractual

The four rules from [`03 §1`](03-secure-architecture.md#1-the-four-nevers) — never copy mothership docs into a client repo; never give the client repo write access to mothership infra; never share secrets across clients; never share an OAuth client across clients — are operator-side internal policy today. The MSA can elevate them to a contractual representation:

> Operator represents and warrants, for the term of this Agreement, that: (i) no documentation under `docs/mothership/` or `docs/operator/` of Operator's mothership repository will be copied into Client's repository; (ii) Client's repository will not be granted write access to Operator's mothership repository or any other Client's repository; (iii) no secret credential issued for Client's services will be reused for any other client; and (iv) no OAuth application registered for Client will be used to authenticate any other client.

Why elevate them: a breach of (i)–(iv) is an *enforcement event*, not just an embarrassment. Putting them in the MSA gives the client a remedy if the operator slips, and gives the operator a published bright-line that future contractors must respect.

---

## §4 — Non-payment safeguards

**Status: draft schedule + clauses for counsel review.** The dollar figures cite [`src/lib/admin/tiers.ts`](../../src/lib/admin/tiers.ts) so they update automatically as that file moves; do not hard-code numbers in this section.

The schedule below is the operator-side runbook; the contractual hooks are the clauses §4.4–§4.7 that the lawyer adapts into the MSA.

### §4.1 Deposit

30% of the SOW total, payable on signing of the SOW. Default justification given to the client during §6: it covers the kickoff cost the operator incurs before any deliverable lands (intake review, design moodboard, repo provisioning per [`18-provisioning-automation-matrix.md`](18-provisioning-automation-matrix.md) PRE-01 through PRE-08).

The deposit is non-refundable once provisioning has started. It is refundable in full if the operator cannot start within the timeline agreed in the SOW. The clause that backs this:

> Client shall pay a deposit equal to thirty percent (30%) of the total Statement of Work value within seven (7) days of countersignature. The deposit is non-refundable once Operator has commenced provisioning of any per-client repository or third-party account on Client's behalf, except where Operator fails to commence work within the timeline specified in the Statement of Work, in which case the deposit shall be refunded in full within thirty (30) days of Client's written request.

### §4.2 Milestone billing

Milestones are tied to deliverables visible in the admin portal, not to time elapsed. The default schedule for a Tier 1 / 2 site (adapt per SOW):

| Milestone | Trigger | % of SOW remaining after deposit | Visible in admin portal as |
|---|---|---|---|
| M1 | Design moodboard accepted | 20% | Intake closed; moodboard PDF linked in the engagement-log entry |
| M2 | Site live on staging URL | 30% | Staging deployment link surfaced in the admin portal |
| M3 | Site live on Client's production domain | 30% | Production deployment link in the admin portal; first preview-link issued |
| M4 | First post-launch monthly check-in landed | 20% | First `engagement-log.md` monthly entry appended |

Milestones M1–M4 sum to 100% of the post-deposit balance. The clause:

> Operator shall invoice Client for each milestone listed in the Statement of Work upon Operator's reasonable determination that the milestone has been achieved, evidenced by the artefact specified in the milestone's "visible in admin portal" column. Client shall pay each milestone invoice within fifteen (15) days of receipt.

### §4.3 Recurring subscription

T0/T1/T2/T3 monthly subscription per [`src/lib/admin/tiers.ts`](../../src/lib/admin/tiers.ts). Billed via Stripe Subscriptions per the [`08 §3`](08-future-work.md#3-payment-terms--non-payment-safeguardslegal-business) automation. The MSA addendum that supports this:

> Client subscribes to the service tier specified in the Statement of Work. Subscription fees are billed monthly in advance via the payment method on file. Tier upgrades take effect at the next billing cycle; tier downgrades take effect at the next billing cycle following thirty (30) days' written notice.

### §4.4 Late-payment interest

> Any amount not paid when due shall accrue interest at the rate of one and one-half percent (1.5%) per month (compounded monthly), or the maximum rate permitted by applicable law, whichever is lower, from the date the amount became due until paid in full.

1.5%/mo is the Ontario small-business standard. Counsel will confirm enforceability in QC, where the *Code civil* caps prejudgment interest separately.

### §4.5 NSF / failed-charge fee

> If a payment is returned for insufficient funds or a credit-card charge is declined, Client shall pay a fee of CAD $35 per occurrence, in addition to any amounts owing. Operator may attempt re-charge up to two (2) times in the seven (7) days following the initial decline before invoking the suspension procedure in §[Suspension of Services].

### §4.6 Suspension-of-services ladder

Mirrors and ratifies the ladder drafted at [`08 §3`](08-future-work.md#3-payment-terms--non-payment-safeguardslegal-business). The day numbers are the contract; the operator's automation is the implementation.

| Day | Action | Operator implementation | Client experience |
|---|---|---|---|
| D+0 | Failed charge / unpaid invoice past 15-day grace | n8n workflow `payment-failed` notifies operator + emails client | "We couldn't charge your card" email |
| D+7 | Second auto-email + autopilot daily-improvement runs paused on T2/T3 (label `paused/pre-warn` on the per-client repo) | `gh issue list --label paused/pre-warn` becomes the operator's review surface | Email; admin portal banner soft-warns about pause |
| D+14 | Autopilot fully paused via `npx forge teardown --mode pause`; admin portal becomes read-only | Vercel deploy hooks unwired; n8n workflows disabled at the credential level (not deleted) | Admin portal banner: *"subscription paused — please update payment to resume"* |
| D+30 | Admin portal redirects to a billing-only page; site remains live (it's the client's domain) | Per-client `cadence.json` set to `paused` so no automation runs | Admin portal redirects to *"your subscription is paused; reach out to billing@lumivara.ca"* |
| D+60 | Graceful exit per [`02 §7`](02-architecture.md#7-teardown-modes) `mode: graceful` | DNS handover offered; `<slug>-pipeline` repo archived; the four-nevers from §3.6 enforced via `gh repo archive` | Site stays live on Client's domain; autopilot is gone; Client's last deployed build is the final artefact |

Drafted clause:

> If Client fails to pay any undisputed invoice within fifteen (15) days of its due date, Operator may, after notice to Client, suspend access to the AI-driven website-improvement service ("Autopilot") according to the schedule set out in Schedule [Suspension Ladder]. During suspension, Client's marketing site shall remain live and Client retains all access to its repository, domain, and hosting account. Operator shall restore Autopilot access within five (5) business days of receipt of all overdue amounts plus the late-payment interest in §[Late-Payment Interest] and the NSF fees in §[NSF Fee], if any.

### §4.7 Kill-switch ladder (per Pattern C)

The technical kill-switch is the operator's ability to revoke automation without affecting the client's site. Mapping onto Pattern C ([`02b-pattern-c-architecture.md`](02b-pattern-c-architecture.md)):

| Lever | Effect | Reversible? |
|---|---|---|
| Revoke the GitHub App installation on `<slug>-site` | The mothership can no longer push code or open PRs against the client repo. The repo + the deployed site continue to exist. | Yes (operator re-installs the App on payment) |
| Disable the per-client pipeline repo's secrets in `<slug>-pipeline` | n8n workflows lose their per-client credentials; SMS/email intake stops. The site continues to serve. | Yes (re-enable secrets) |
| Pause Vercel auto-deploys on `<slug>-site` | The current build stays live; new merges to `main` do not redeploy. | Yes (re-enable in Vercel) |
| Flip the Vercel project to a holding page | Replaces the site with a "subscription paused" placeholder. **Reserved for D+30 only**, never D+0–D+14. | Yes |
| DNS handover / final teardown | `<slug>-site` archived; DNS pointed to the client's chosen alternate (or to the holding page). | One-way after final invoice clears; reversible only by re-engagement |

The contractual disclosure that backs this: §6 step 2 (engagement-confirmation memo) lists every lever above so the client signs with eyes open. The operator never invokes a lever earlier than the disclosed schedule allows.

### §4.8 Termination for non-payment

> Operator may terminate this Agreement upon thirty (30) days' written notice if Client fails to cure any payment breach within the suspension schedule of §[Suspension of Services]. Upon termination for non-payment, (a) Client retains ownership of all Deliverables already accepted and paid for in full; (b) Operator transfers Client's domain registration and Vercel project to Client's designated account within fifteen (15) days of receipt of all amounts owing under accepted milestones; (c) Operator is under no obligation to deliver work for unpaid milestones; and (d) the suspension state in §[Suspension Ladder] D+60 becomes the terminal state.

The client always keeps what they paid for. The operator never holds a paid-for Deliverable hostage. The asymmetry is by design: the kill-switch is the leverage; non-delivery of paid work is not.

---

## §5 — Risk register

| Risk | Likelihood | Impact | Mitigation | Residual owner |
|---|---|---|---|---|
| Client end-customer PII leaks via misconfigured contact-form issue | Low (private repos; 2FA enforced) | Medium (PIPEDA reportable if QC and >sensitivity threshold) | §2.1 retention + §2.5 cross-links to `03 §3` and `03b §1`; quarterly drill in `03b §2` | Operator |
| Quebec resident's data routes through US-only model fallback | Low if §2.3 point 3 is enforced; medium otherwise | High (Law 25 reportable; reputation) | §2.3 point 3 (`data_residency: ca` in `cadence.json`); architectural fix tracked at `12 §7` | Operator + counsel |
| Client copies operator prompts from the AI Ops dashboard and resells them | Low (small market; signal would surface) | High (entire moat) | §3.2 corollary 1–3; §3.6 elevates to contractual representation | Operator + counsel (enforcement) |
| Subprocessor (Anthropic/OpenAI/Google) trains on client data despite contractual no-train terms | Low if on paid API tiers | High (client reportable + operator misrepresentation) | §3.5 + paid-tier verification before first MSA signature; §2.4 audit on every subprocessor add | Operator |
| Client fails to pay deposit; operator has provisioned PRE-01 through PRE-08 | Medium on first-time clients | Low–Medium (≤7 hours operator time) | §4.1 deposit non-refundable once provisioning starts; §4.6 D+14 pauses provisioning workflows | Operator |
| Client pays milestones M1–M3 then defaults on M4 | Medium (M4 is post-launch; the leverage drops) | Medium (the recurring subscription is small relative to the unpaid M4) | M4 trigger = first monthly check-in delivered; chargeable only after the deliverable lands; suspension ladder applies to the recurring subscription independently | Operator |
| Client disputes a milestone trigger (M3 "live on production" semantics) | Medium | Low–Medium (delays one milestone payment) | Each milestone's "visible in admin portal" column is the bright line; engagement-log entry is the proof | Operator |
| Client's lawyer rejects §3.6 (operator's "four nevers" as contractual reps) | Medium on enterprise-flavoured clients (>50 staff) | Low (operator falls back to internal-policy representation) | §6 step 4 (legal review): if rejected, remove §3.6 and document the deviation in the engagement-log | Operator + counsel |
| Operator hospitalised mid-engagement; client cannot reach billing surface | Low | High (client perceives non-payment penalties as one-sided) | Break-glass envelope per [`09 §1.5`](09-github-account-topology.md#15-break-glass-topology-single-owner-is-not-survivable); the second-Owner topology activates the suspension override | Operator + named second Owner |
| Client refuses MSA on §3.5 (no model-training restriction on operator) | Low | Medium (engagement does not start) | Default position: operator declines the engagement rather than weaken §3.5; document the lost engagement | Operator |

The "residual owner" column is who owns the *remaining* risk after the mitigation lands. Where it lists "Operator + counsel," the operator cannot resolve it alone.

---

## §6 — Onboarding / signing flow with explicit confirmations

The order matters: each step disclosures something the next step asks the client to accept. Skipping a step makes a later signature uninformed.

| Step | Operator action | Client action | Artefact filed | Logged where |
|-------|-----------------|---------------|----------------|--------------|
| 1 | Send the mutual NDA (drafted from §3.3) before any prospect detail is shared | Sign | `docs/clients/<slug>/nda.pdf` (encrypted at rest; see [`21 §3`](21-vault-strategy-adr.md#3--vault-structure)) | `engagement-log.md` `type: nda-signed` |
| 2 | Send the **Engagement Confirmation Memo**: a one-page client-facing summary of (a) the four nevers from §3.6 in plain English, (b) the subprocessor list from §2.4, (c) the suspension ladder from §4.6 and the kill-switch ladder from §4.7, (d) data residency posture from §2.3 if QC | Read; ask questions | `docs/clients/<slug>/engagement-confirmation.pdf` | `engagement-log.md` `type: confirmation-sent` |
| 3 | Send the MSA (containing §3 clauses adapted by counsel) | Counter-sign | `docs/clients/<slug>/msa.pdf.age` (encrypted) | `evidence-log.md` PRE-01 |
| 4 | Send the SOW (containing §4 schedule + tier-specific milestones) | Counter-sign | `docs/clients/<slug>/sow.pdf.age` (encrypted) | `evidence-log.md` PRE-02 |
| 5 | Issue deposit invoice (§4.1) | Pay deposit within 7 days | Stripe invoice + receipt | `evidence-log.md` PRE-03 |
| 6 | Provision the engagement: PRE-04 through PRE-08 from [`18-provisioning-automation-matrix.md`](18-provisioning-automation-matrix.md) | n/a | Per-client repo + admin portal access | `evidence-log.md` PRE-04..PRE-08 |
| 7 | Grant admin portal access; send walkthrough video | Sign in; confirm receipt | `docs/clients/<slug>/portal-handover.md` | `engagement-log.md` `type: portal-access-granted` |
| 8 | First-90-day check-in: review the disclosure memo from step 2 with the client; capture any change in posture (new subprocessor? data residency change?) | Acknowledge | Updated `engagement-confirmation.pdf` if anything changed | `engagement-log.md` `type: 90-day-check-in` |

Step 2's Engagement Confirmation Memo is the sharpest disclosure surface in the flow: every operator-side capability that could surprise the client *later* is disclosed *now* in plain English. The MSA's bind comes from signature; the memo's bind comes from "you saw this on day one." Both matter on a dispute.

The flow ties into [`19-engagement-evidence-log-template.md`](19-engagement-evidence-log-template.md) as follows:

- Step 3, 4, 5, 6 produce evidence-log entries (PRE-01..PRE-08).
- Step 1, 2, 7, 8 produce `engagement-log.md` entries (the long-running journal per [`14 §6`](14-critique-operations-sequencing.md)).
- The disclosure events of step 2 and step 8 are the audit surface a regulator or client lawyer would request first; they live in the engagement-log so the evidence-log stays purely about provisioning.

---

## §7 — Out of scope / human-only steps

This document **does not constitute legal advice**. Every drafted clause in §3 and §4 is a structured starting point for licensed counsel; none of it is enforceable as drafted here.

The decisions the operator must take to a lawyer (in priority order) before the first MSA is signed:

1. **Jurisdiction selection.** Default position: Ontario (operator's province). If a client requires QC governing law, accept it case-by-case and flag the §4.4 late-payment clause for re-checking under the *Code civil*. If a client requires US governing law, escalate — the §4.7 kill-switch may be unenforceable in some US states (consumer-protection statutes vary).
2. **§3.2 work-product carve-outs.** Counsel should confirm the "Operator Tooling" definition is broad enough to cover artefacts not yet built (future workflows, future CLIs) without being so broad it triggers an unconscionability challenge.
3. **§3.6 enforceability.** The "four nevers as contractual representations" clause is unusual. Counsel should advise on whether to keep it as a representation, demote it to a covenant, or move it to an exhibit. The operator's preference is to keep it; counsel decides.
4. **§4.6 + §4.7 enforceability under QC and ON.** Suspension clauses are enforceable in both provinces but the form differs. Confirm the ladder language survives a *Code civil* challenge in QC (see also [`08 §3`](08-future-work.md#3-payment-terms--non-payment-safeguardslegal-business)).
5. **§3.5 representation about subprocessor terms.** The operator must verify (not just assert) that Anthropic, OpenAI, and Google paid-tier API terms preclude training on client data. Counsel reviews the verification chain.
6. **Cyber-liability / professional-liability insurance.** [`20 §3`](20-launch-and-operating-cost-model.md#3--recurring-operating-costs-practice-wide) line F lists insurance; this doc raises the question of whether the cyber-liability rider's coverage triggers align with §4.6's suspension semantics. Insurance broker conversation, not lawyer.

The DoD checkboxes on #121 split deliberately:

- [x] **Risk-protection plan documented (linked from Lumivara Infotech docs)** — closed by this PR.
- [ ] **Operator review and sign-off before client outreach** — post-merge human step. Operator opens this file, walks §1–§8, signs off in `SECURITY_OPS_LOG.md`.
- [ ] **Legal counsel consulted (human-only step)** — post-merge human step. Operator hands counsel §3 and §4 and walks them through §7 priorities 1–5.

The two unchecked boxes do not block this PR. They block the *first MSA signature*, which is a separately tracked milestone in [`08 §2`](08-future-work.md#2-client-contract-terms-legal).

---

## §8 — Open questions

1. **Cyber-liability insurance rider coverage triggers.** Does a typical cyber-liability policy (CFC, Coalition, Beazley) treat a `data_residency: ca` failure as a covered breach? If it caps payouts on Quebec-resident data, the §4.6 suspension ladder may be the wrong remedy for a Quebec breach. Resolve with insurance broker before the first QC engagement.
2. **Archived `evidence-log.md` retention window.** §2.1 default is 7 years (mirrors Ontario's general statute-of-limitations clock). PIPEDA itself has shorter mandatory deletion windows for some categories; Law 25 has stricter limits than PIPEDA for sensitive personal information. Confirm with counsel before the first engagement that touches sensitive data; cross-reference [`21 §10`](21-vault-strategy-adr.md#10--open-questions) point 2 which raises the same question for archived per-client vaults.
3. **`docs/freelance/01-gig-profile.md` cross-link.** This doc is operator-only; the gig profile is the outward-facing pitch. There is no natural anchor in the gig profile that does not bleed operator-internal language into a client-facing surface. **Decision: do not cross-link.** The client-facing summary of §3, §4, and §6 lives in the Engagement Confirmation Memo (§6 step 2), not in the gig profile. Re-evaluate when the gig profile gains a "what we contractually commit to" section.
4. **Stripe vs. Lemon Squeezy for §4.3 subscription billing.** [`08 §3`](08-future-work.md#3-payment-terms--non-payment-safeguardslegal-business) notes both as candidates. The §4.6 suspension ladder requires the billing platform to surface a webhook for failed-charge events; both support this. Decision deferred to [`08 §3`](08-future-work.md#3-payment-terms--non-payment-safeguardslegal-business) implementation.
5. **Incorporation jurisdiction.** The MSA is signed by Lumivara Infotech as the operator. The legal entity behind that name is not yet incorporated (operator note). Until incorporation lands, the MSA is signed by the operator personally, which exposes personal assets. Open issue against [`08 §2`](08-future-work.md#2-client-contract-terms-legal); this doc cannot resolve incorporation choice.
6. **Lawyer selection.** [`20 §2`](20-launch-and-operating-cost-model.md#2--one-time-launch-costs) budgets for one Canadian small-business lawyer (~CAD $1,500–2,500 flat fee for the MSA template). Selection is operator-side; this doc cannot recommend a specific firm.

---

## §9 — Cross-references

- Per-engagement evidence log (where §6 step 3–6 file their entries): [`19-engagement-evidence-log-template.md`](19-engagement-evidence-log-template.md).
- Operator-side vault for the artefacts §6 produces: [`21-vault-strategy-adr.md §3`](21-vault-strategy-adr.md#3--vault-structure).
- Per-client runtime secret topology: [`03-secure-architecture.md §3`](03-secure-architecture.md#3-secret-topology).
- Pattern C (the architectural assumption behind §4.7 kill-switch levers): [`02b-pattern-c-architecture.md`](02b-pattern-c-architecture.md) + [`pattern-c-enforcement-checklist.md`](pattern-c-enforcement-checklist.md).
- Tier-based AI cadence (the surface §4.6 D+7/D+14 pauses): [`04-tier-based-agent-cadence.md`](04-tier-based-agent-cadence.md).
- Per-client tier prices used in §4 examples: [`src/lib/admin/tiers.ts`](../../src/lib/admin/tiers.ts).
- Engagement provisioning matrix that §6 step 6 walks: [`18-provisioning-automation-matrix.md`](18-provisioning-automation-matrix.md).
- Future-work stubs this doc structures but does not close: [`08-future-work.md §1`](08-future-work.md#1-data-protection--privacy-legalcompliance), [`§2`](08-future-work.md#2-client-contract-terms-legal), [`§3`](08-future-work.md#3-payment-terms--non-payment-safeguardslegal-business).
- Original critique that motivated the data-residency architectural piece: [`12-critique-security-secrets.md §7`](12-critique-security-secrets.md#7----lesser-pipeda--law-25-compliance-is-partly-architectural).
- Practice-wide cost model (where lawyer + insurance lines live): [`20-launch-and-operating-cost-model.md §3`](20-launch-and-operating-cost-model.md#3--recurring-operating-costs-practice-wide).

*Last updated: 2026-04-29.*
