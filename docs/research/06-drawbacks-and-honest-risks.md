<!-- The honest "what could go wrong" pack used in operator/partner/investor decks. -->

# 06 — Drawbacks and Honest Risks

Eight risks to the Lumivara Forge model, ranked by severity × likelihood. Each one names the failure mode, the existing mitigation in this repo, and the residual risk we accept. This file is the source for every "risk" slide in stakeholder decks.

> **Why publish drawbacks.** Operator, partner, investor, and senior advisor decks are stronger when the risks are named on the deck author's own terms. Anyone serious will surface them anyway; pre-empting saves trust.

---

## D1 — AI hallucination → broken code shipped to a client

**The failure mode.** LLMs generate plausible-but-wrong code. SWE-bench Bash Only stress tests show top 2025/2026 models fail ~33% on real GitHub issues (`[S] §B-SWE-bench`). High-profile incidents have included an autonomous agent destroying production state when staging boundaries were unclear.

**Mitigation in this repo.**
- Plan-then-Execute pipeline (`docs/AI_ROUTING.md`): the AI emits a structured plain-text plan as a PR comment before any code is written, and the client reads that plan first.
- Vercel preview gate: every change ships to a preview URL, never directly to production.
- Tap-to-publish: the change waits for the client's explicit approval — typically a tap on a phone notification.
- CI gates: Lighthouse + axe-core run on every preview build; if scores regress, the build fails before it can be merged.
- Auto-merge is opt-in per label, and design / critical-path PRs are excluded from the auto-merge rule entirely (`docs/mothership/01-business-plan §4`).

**Residual risk.** A subtle bug that passes the lint, type, and Lighthouse gates but breaks a real-world flow — the contact form silently dropping submissions, a navigation regression that only shows on a specific device. Mitigation: weekly synthetic checks via the `ai-smoke-test.yml` workflow + a per-client evidence log of every published change.

**Severity.** High. **Likelihood.** Medium. **Net.** This is the single biggest engineering risk and the reason the budget charter, HITL gates, and Dual-Lane Repo all exist.

---

## D2 — Client doesn't adapt to Phone-as-CMS

**The failure mode.** The client signs up, but never actually uses the phone shortcut — they fall back to "email me about a change" and wait. The headline value (autonomy + 30-second edits) doesn't materialise; they re-rate the relationship as "expensive maintenance retainer," and churn at month 6.

**Mitigation in this repo.**
- The intake / onboarding pack (`docs/mothership/07-client-handover-pack.md`) walks the client through the phone-shortcut setup *during* the launch call, in real time, with the operator.
- Multiple channels: phone shortcut, web admin portal, email, SMS. Whichever the client uses, the pipeline accepts it (`docs/ADMIN_PORTAL_PLAN.md`).
- Monthly health-check email (T1+) prompts the owner with "here are 3 things I'd recommend this month — reply 'yes 1, 2' to ship them," which removes the cognitive load.

**Residual risk.** Personality-driven; some owners just won't text a bot. The "say-no-to" filter (`docs/storefront/01-gig-profile.md` Part 8) tries to spot this in discovery; it doesn't always succeed.

**Severity.** Medium. **Likelihood.** Medium. **Net.** Real but bounded; resolved by clean churn (they keep their site, we keep our roster slot).

---

## D3 — Operator burnout

**The failure mode.** The operator is the single point of failure. Industry data shows 73% of tech founders / startup execs hide burnout, and ~65% of startup failures are attributed to founder burnout (`[S] §B-Founder-Burnout`).

**Mitigation in this repo.**
- 30-client cap until a hire is made (`docs/storefront/03-cost-analysis.md` Part E).
- Session-budget charter (50%/80%/95% gates) keeps any one client from starving the queue (`AGENTS.md`).
- Weekly cadence (`docs/mothership/01-business-plan §7`) — fixed inbox-sweep + improvement-run + cost-check rhythm.
- Mandatory 2-week break on the calendar before crossing client #25.
- VA hire planned at 25 clients; second engineer at 35 clients (`docs/storefront/03-cost-analysis.md` Part E).

**Residual risk.** Burnout still happens; the cap and cadence reduce probability, they do not eliminate it.

**Severity.** Critical (existential). **Likelihood.** Medium. **Net.** The single biggest existential risk; managed by deliberate smallness.

---

## D4 — Provider outage (Anthropic / Google / OpenAI)

**The failure mode.** A single AI vendor has a 4-hour outage during the busiest part of an onboarding. The pipeline stalls.

**Mitigation in this repo.**
- Multi-AI fallback ladder (`docs/AI_ROUTING.md`): Claude → Gemini → OpenAI Codex on triage and execute paths.
- Each stage has a fallback executor (`execute-fallback.yml`) so a single-vendor outage never blocks the queue.
- Pinned model IDs reviewed every 2 months in `docs/AI_ROUTING.md` to catch deprecations early.

**Residual risk.** A simultaneous outage across Anthropic + Google + OpenAI. Plausibly catastrophic but historically rare.

**Severity.** High. **Likelihood.** Low (per single vendor); very low (joint).

---

## D5 — ADA / WCAG legal liability

**The failure mode.** A new component ships with an accessibility regression, the client gets sued for ADA non-compliance, and Lumivara Forge is named because we built the site. 3,117 federal lawsuits in 2025, +27% YoY (`[V] §B-ADA-Lawsuits`).

**Mitigation in this repo.**
- Programmatic axe-core + Lighthouse a11y checks in CI on every preview build.
- Manual review of design / critical paths excluded from auto-merge.
- Operator liability: E&O / professional-liability + cyber-liability insurance scheduled to engage above $50k revenue (`docs/storefront/03-cost-analysis.md` Part F).

**Residual risk.** Automated tools catch ~30–50% of WCAG issues; the rest (cognitive, screen-reader-flow, contrast in image overlays) still require human review. Not zero, but materially lower than the WordPress baseline (95.9% failure rate at WebAIM Million 2024 / `[V] §B-WebAIM`).

**Severity.** High. **Likelihood.** Low. **Net.** Mitigated; insurance + CI + manual gate handle the realistic threat surface.

---

## D6 — Adoption drag of a "two-repo" model on the operator side

**The failure mode.** Dual-Lane Repo (two-repo isolation, `docs/mothership/02b-dual-lane-architecture.md`) is non-trivial to operate. Mistakes — pushing operator IP into the client repo, mis-configuring the GitHub App installation — leak the moat.

**Mitigation in this repo.**
- `docs/mothership/dual-lane-enforcement-checklist.md` runs on every spinout + quarterly.
- `docs/mothership/03b-security-operations-checklist.md` schedules monthly + quarterly secret-rotation cadences.
- Per-engagement evidence log (`docs/mothership/19-engagement-evidence-log-template.md`) records every provisioning step with a validation command.

**Residual risk.** Operator process error. The checklist exists *because* the model is unforgiving.

**Severity.** Medium-High. **Likelihood.** Low (with checklists) → Medium (without). **Net.** This is why we don't ship to client #1 without the spinout runbook (`docs/migrations/lumivara-people-advisory-spinout.md`).

---

## D7 — Single bad client poisons the queue

**The failure mode.** One client requests dozens of changes a week, complains constantly, and consumes 4× the operator-hours of the average. The roster slot becomes a net cost.

**Mitigation in this repo.**
- Per-client rate-limits in `scripts/triage-prompt.md`.
- Tier cadence (`docs/mothership/04-tier-based-agent-cadence.md`) — T0 manual, T1 daily, T2 every 2h, T3 hourly.
- "Say-no-to" filter on intake (`docs/storefront/01-gig-profile.md` Part 8 + this folder's `04-client-personas.md` A1 anti-persona).
- Stripe auto-charge with pause-at-+14, lockout-at-+30 days for non-payment (`docs/mothership/08-future-work §3`).

**Residual risk.** A client who pays on time and is technically polite, but psychologically draining. The cap exists in part to absorb this.

**Severity.** Medium. **Likelihood.** Medium. **Net.** Bounded by the 30-client cap and ruthless intake.

---

## D8 — Competitive substitution by a well-funded incumbent

**The failure mode.** Framer ships a code-export + n8n integration. Vercel v0 packages a retainer. An Anthropic-built "ship a marketing site" agent ships out of the box. Any of these compresses our differentiation moat.

**Mitigation in this repo.**
- Watch list maintained in `docs/storefront/06-positioning-slide-deck.md` Section 4 ("What competitors are NOT advertising").
- Stage-1 strategy is *deliberate smallness with high margin per client*, not scale-at-all-costs (`docs/mothership/01-business-plan §6`). Even partial substitution still leaves a defensible per-client retainer business.
- Dual-Lane Repo operator-side IP isn't visible to the client; even if a competitor copies the front-end experience, the operational leverage is harder to replicate.

**Residual risk.** Real but slow. Substitutes typically take 12–24 months to ship; that's enough runway to either reposition or graduate to Stage 2 / 3.

**Severity.** Medium-High. **Likelihood.** Medium (over a 24-month horizon). **Net.** Watched, not mitigated; reassess every 2 months.

---

## Severity × likelihood matrix

| Risk | Severity | Likelihood | Net |
|---|---|---|---|
| D1 — AI hallucination | High | Medium | Mitigated by Plan-then-Execute + tap-to-publish + CI gates |
| D2 — Phone-as-CMS adoption drag | Medium | Medium | Bounded by clean churn + multi-channel ingest |
| D3 — Operator burnout | Critical | Medium | Capped at 30 clients; weekly cadence; planned hire ladder |
| D4 — Provider outage | High | Low (single) | Multi-AI fallback ladder |
| D5 — ADA legal liability | High | Low | CI gates + insurance |
| D6 — Dual-Lane Repo operator error | Medium-High | Low (with checklist) | Enforcement checklist + evidence log |
| D7 — Bad client | Medium | Medium | Intake filter + cap + payment gate |
| D8 — Competitive substitution | Medium-High | Medium (24mo) | Watched; reassess every 2 months |

---

*Last updated: 2026-04-29.*
