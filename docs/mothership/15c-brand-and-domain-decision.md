<!-- OPERATOR-ONLY. ADR following 15 §4-§5 — re-opens the brand decision and locks the domain strategy. -->

> _Lane: 🛠 Pipeline._

# 15c — Brand & Domain Decision (2026-04-30)

This is a decision record (ADR) following [`15-terminology-and-brand.md`](./15-terminology-and-brand.md). It does **two** things, on the same date, because they came up together:

1. **Locks the domain strategy** — the operator umbrella domain is **separate** from `lumivara.ca`; no co-hosting with Client #1.
2. **Re-opens the brand-name decision** — the locked `Lumivara Forge` / `lumivara-forge` from `15 §4` is under reconsideration; operator wants cleaner, leaner, non-hyphenated.

D1 is committed; D2 is open. Everything downstream of the brand name (domain purchase, trademark search, GitHub org slug, Resend domain, n8n hostname, S1 mechanical rename) is blocked on D2.

---

## §1 — Context

The operator owns `lumivara.ca`. It is currently the production domain of **Client #1** (Beas Banerjee's HR consulting practice, branded "Lumivara People Advisory"). Per Dual-Lane Repo ([`02b-dual-lane-architecture.md §1, §8`](./02b-dual-lane-architecture.md)) and the spinout runbook ([`../migrations/lumivara-people-advisory-spinout.md`](../migrations/lumivara-people-advisory-spinout.md)), `lumivara.ca` follows Client #1 to her own repo at the P5.6 spinout (Phase 4 of [`../migrations/00-automation-readiness-plan.md §6 row 12`](../migrations/00-automation-readiness-plan.md)).

Two questions surfaced 2026-04-30:

- **Q1 — Domain strategy:** Since the operator already owns `lumivara.ca`, can the operator framework (the Pipeline-lane product currently named "Lumivara Forge") be hosted on the same domain as Client #1's site? E.g., `forge.lumivara.ca` subdomain, or `lumivara.ca/forge` path, or a single shared landing page?
- **Q2 — Brand name:** The locked operator brand `Lumivara Forge` requires the hyphenated domain `lumivara-forge.com / .ca` (per `15 §3` "no hyphens in URLs" guidance, this is a known compromise). Operator now wants to revisit and pick something cleaner.

---

## §2 — D1: Domain strategy — separate domains (committed)

### Decision

**The operator umbrella domain is a separate registered domain, not a subdomain or path on `lumivara.ca`.** The exact domain name is blocked on D2.

### Rationale

| Lens | Why co-hosting fails |
|---|---|
| **Dual-Lane Repo ownership** | `lumivara.ca` follows Client #1 at Phase 4 spinout. After handover, Beas owns the DNS zone. Squatting `forge.lumivara.ca` long-term means operator infrastructure depends on a client's registrar account — exactly the dependency Dual-Lane Repo is designed to eliminate. |
| **SEO topical authority** | HR-consulting backlinks (advisor directories, HR forums) and B2B-automation backlinks signal contradictory topical authority on the same apex. `Organization` schema becomes ambiguous. Branded search for "Lumivara" returns a confused SERP. |
| **Brand / trust optics** | A small-business prospect lands on `forge.lumivara.ca`, walks the URL up one hop, finds an HR consultancy. Reduces conversion. Beas's brand also loses crispness. |
| **Sub-product composition** | `15 §3` plans Forge Voice / Brand / Pulse / Atlas / Studio at `pulse.lumivara-forge.com`. Under co-hosting that becomes `pulse.forge.lumivara.ca` — three labels, structurally signaling "tenant of a tenant." |
| **Cost** | Domain registration (~$30/yr) is trivial vs. the structural risk. No real saving. |
| **Brand-separation policy** | `15 §6` forbids Client #1 identifiers in operator-scope docs. Co-hosting at the DNS level is the most public possible violation of the spirit of that rule. |
| **Operations** | Sharing a domain forces either (a) Next.js rewrites/proxies (coupling), (b) one Vercel project hosting two sites (violates Dual-Lane two-repo separation), or (c) DNS-level subdomain split (only viable but inherits all the problems above). |

### Alternative considered: rebrand Beas

Option 2a in the analysis: operator reclaims `lumivara.ca` as the umbrella; Beas rebrands to e.g. "Beas Banerjee Advisory" on her own domain. Rejected because:
- All locked plans assume Beas keeps "Lumivara People Advisory" on `lumivara.ca` and transfers both at Phase 4.
- A rebrand forces Beas to lose existing SEO equity, redo marketing materials, and accept a coordination cost on the operator's timeline.
- The cost delta of buying a separate operator domain is trivial (~$30/yr).

This option is preserved as a fallback if D2's brand reconsideration concludes "Lumivara" should remain the operator's umbrella and Beas's brand should split. That conversation is with Beas, not a doc edit.

### What this confirms (no change)

- `lumivara.ca` stays Client #1's, transfers to Beas's new repo at Phase 4 (`00-automation-readiness-plan.md §6 row 12` unchanged).
- Dual-Lane two-repo separation unchanged.
- Sub-product naming convention (`Lumivara X Sites / Voice / Brand / Pulse / Atlas / Studio`) unchanged in shape — only the `X` is under reconsideration.
- Brand-separation policy (`15 §6`) unchanged.

---

## §3 — D2: Operator brand name reconsideration (open)

### Status

The brand `Lumivara Forge` (locked 2026-04-28 in `15 §4`) is **under reconsideration as of 2026-04-30**. Operator's stated criteria for the reconsidered name:

- **Non-hyphenated** in domain (no `lumivara-forge.com`-style URL tax — `15 §2` already flagged this as a known cost).
- **Cleaner, leaner** than the two-word + slug-with-hyphen pattern.
- Continues to satisfy the original `15 §2` selection criteria (extensible to sub-products, brand-family halo with Beas's brand without hard coupling, pronounceable globally, available in `.com` and `.ca`, no trademark collision).

### Pre-vetted shortlist (already in `15 §2`)

The reconsideration does not start from zero. `15 §2` carries an operator-vetted shortlist that satisfies the non-hyphenated criterion:

| # | Candidate (in `15 §2`) | Single-word slug | Notes |
|---|---|---|---|
| 2 | Lumivara Cadence | `cadence` or `lumivara-cadence` | Already flagged in `15 §2` as the closest runner-up. Mechanic-mirrors-naming property (cadence matrix in `04`). |
| 3 | Lumivara Continuum | `continuum` | Speaks to "doesn't decay between updates." |
| 5 | Lumivara Loom | `loom` | Distinct, premium. Single-word slug. |
| 7 | Lumivara Helm | `helm` | **Caveat:** collides with Helm (the Kubernetes package manager) — needs trademark + namespace check. |
| 8 | Lumivara Lighthouse | `lighthouse` | **Caveat:** collides with Google Lighthouse (the perf-audit tool) — needs trademark + namespace check. |
| 9 | Lumivara Compass | `compass` | Advisory frame. |
| 10 | Plumbline Studio | `plumbline` | **Independent of Lumivara umbrella** — drops the brand-family halo. Cleanest separation if the operator ever decides Lumivara should stay with Beas. |

If the operator picks one of the seven above, no new naming exercise is needed — only the pre-launch verification block in `15 §2` ("What the operator needs to verify before committing").

If the operator wants to coin a new word outside the shortlist, that is a separate exercise; this ADR does not attempt it.

### What is blocked on D2

| Blocked item | Source | Notes |
|---|---|---|
| Phase 0 row 1 — buy domain | `00-automation-readiness-plan.md §2.2 row 1` | Domain to buy depends on chosen name. |
| Phase 0 row 0.6 — trademark search (CIPO + USPTO Class 35 + 42) | `00-automation-readiness-plan.md §2.1 row 0.6`; `15 §5` | Search target depends on chosen name. |
| Phase 0 row 2 — create GitHub Org | `00-automation-readiness-plan.md §2.2 row 2` | Org slug is permanent without paid migration; cannot precede the name decision. |
| Resend sender domain `mail.<brand>.com` | `15 §4` | Mail domain follows the chosen apex. |
| n8n hostname `n8n.<brand>.com` | `15 §4` | Same. |
| Phase 2 — Run S1 mechanical rename | `00-automation-readiness-plan.md §4` | The find-replace targets (`{{BRAND}}` → ?, `{{BRAND_SLUG}}` → ?) depend on the chosen name. |
| `src/lib/site-config.ts` builder URL swap | `15 §4` footer credit block | Comment currently anticipates `lumivara-forge.com`; awaits final domain. |

### What the brand drift sweep already shipped (PR #200) — and how it's affected

PR #200 mechanically rewrote `lumivara.com` → `lumivara-forge.com` and `Lumivara Infotech` → `Lumivara Forge` across the docs. If D2 picks a name other than "Lumivara Forge," a second drift sweep is needed (mechanically identical to the first; existing tooling at [`scripts/dual-lane-audit.sh`](../../scripts/dual-lane-audit.sh) covers detection). This is cheap and is not a reason to defer D2.

---

## §4 — Action items

### Operator-side (gating)

- [ ] **D2.1 — Pick the brand name.** From the `15 §2` shortlist or by coining a new word. Single decision; everything below unblocks once made.
- [ ] **D2.2 — Verify the chosen name** against `15 §2`'s "What the operator needs to verify before committing" checklist (`.com` + `.ca` available, social handles, CIPO + USPTO trademark, pronounces cleanly, reads cleanly in email signature).
- [ ] **D2.3 — Lock the decision** by updating `15 §4` and `15 §5` (mark "Brand: Lumivara Forge" reconsideration resolved with the new name) and amending this ADR's §3 with a "Resolved" stanza.

### Bot-side (after D2 lands)

- [ ] **A1** — Run a second brand-drift sweep (mirror PR #200): `Lumivara Forge` → new brand, `lumivara-forge` → new slug, `lumivara-forge.com` → new domain. Use `scripts/dual-lane-audit.sh` to detect; one find-replace PR.
- [ ] **A2** — Update `src/lib/site-config.ts` builder URL + footer credit (`§4` of `15-terminology-and-brand.md`).
- [ ] **A3** — Resume Phase 0 of `00-automation-readiness-plan.md` from row 1.

### What stays unchanged regardless of D2

- Phase 4 DNS cutover scope (`lumivara.ca` → Beas's new Vercel project) — `00-automation-readiness-plan.md §6 row 12` confirmed.
- Dual-Lane Repo architecture — `02b-dual-lane-architecture.md` unchanged.
- `15 §6` forbidden-strings policy against Client #1 identifiers — unchanged; the brand-name change does not affect the separation rule.
- `15 §3` sub-product naming **shape** (`Lumivara X Sites / Voice / Brand / Pulse / Atlas / Studio`) — only the `X` changes.

---

## §5 — Cross-references

- [`15-terminology-and-brand.md §2`](./15-terminology-and-brand.md) — pre-vetted shortlist + selection criteria.
- [`15-terminology-and-brand.md §4`](./15-terminology-and-brand.md) — locked rename table (carries a reconsideration banner pointing here, post-2026-04-30).
- [`15-terminology-and-brand.md §5`](./15-terminology-and-brand.md) — pending-action list (rows now reframed as blocked on D2, post-2026-04-30).
- [`02b-dual-lane-architecture.md §1, §8`](./02b-dual-lane-architecture.md) — unchanged; D1 derives from §1's two-repo trust model.
- [`../migrations/00-automation-readiness-plan.md §2.1, §2.2`](../migrations/00-automation-readiness-plan.md) — Phase 0 rows 0.1, 0.6, 1, 2 carry forward-pointers to this ADR.

*Created: 2026-04-30.*
