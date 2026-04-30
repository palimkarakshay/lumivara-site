<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SOURCE OF TRUTH
  Closes #117. ADR for the operator's IP / business-secrets vault. Sits
  *above* the per-client runtime topology in `03-secure-architecture.md §3`
  — that table covers per-client runtime secrets; this ADR covers operator-
  side IP and business secrets that never enter Vercel/n8n.
  Dual-Lane Repo rule: this file never ships in a client repo (`00-INDEX.md`
  rule 2; `03 §1` rule 2).
================================================================================
-->

# 21 — Vault Strategy ADR (operator IP & business secrets)

> **ADR scope.** This file decides *which* vault Lumivara Forge uses for the operator's own business and IP secrets, *what goes in it*, *who can see what*, *how rotation works*, and *what does NOT belong in the vault*. It is the formalisation of the stub at [`08-future-work.md §4`](08-future-work.md#4-ip--business-secrets-vault).
>
> **Out of scope.** Per-client runtime secrets (Vercel env, n8n credentials, the `AUTH_*` family). Those are governed by [`03-secure-architecture.md §3`](03-secure-architecture.md#3-secret-topology) and the rotation matrix at [`03b-security-operations-checklist.md §4`](03b-security-operations-checklist.md#4--secret-rotation-schedule-matrix). The boundary is enforced by the decision tree in [§7](#7--what-counts-as-vaultable-vs-ordinary-repo-content) below.

---

## §1 — Context

Lumivara Forge today runs a single-operator security posture: `pass` (passwordstore.org) on the operator's laptop, encrypted with a YubiKey-backed PGP subkey. That works for one operator, but three forces are pulling against it:

1. **Successor / contractor onboarding.** [`12 §1`](12-critique-security-secrets.md#1----critical-single-owner-github-topology-has-no-break-glass) and the second-Owner topology at [`09 §1.5`](09-github-account-topology.md#15-break-glass-topology-single-owner-is-not-survivable) both require shareable credential paths the operator does not have today. `pass` is fundamentally a one-laptop tool; sharing one entry means re-encrypting the entire tree under another GPG key.
2. **Topology gap.** The `03 §3` per-client topology covers *runtime* secrets — anything a Vercel project or n8n workflow consumes at request time. It does not cover product-strategy decks not yet in the repo, pricing-model variants, partnership term sheets, draft contracts, vendor account credentials that are not Vercel/n8n env (payroll, accounting software, domain registrar, financial accounts), or operator-side per-client correspondence that lives outside the engagement evidence log.
3. **Break-glass envelope coherence.** [`12 §1`](12-critique-security-secrets.md#1----critical-single-owner-github-topology-has-no-break-glass) points at the trusted-second-party envelope from [`08 §4`](08-future-work.md#4-ip--business-secrets-vault). For that envelope to actually unlock the practice in an emergency, the items inside it must reference a vault the second party can be guided to — not a `pass` tree the second party cannot decrypt.

The vault decision is therefore not "should we have one" — it's "which one, with what structure, on what migration path."

---

## §2 — Decision: hosted vs. custom

### §2.1 Recommendation

**Adopt 1Password Business** as the operator vault. Provision it before the second client engagement (`08 §4` trigger: before client #5 OR MRR > $3k, whichever first; the trigger pulls in once the contractor question lands). Keep `pass` running in parallel for the first 14 days post-migration as the dual-run safety net described in [§8](#8--migration-plan-from-pass).

The recommendation is provisional pending operator sign-off — see [§10](#10--open-questions). If the operator already holds a Bitwarden Teams subscription or has institutional ties to a different vendor, swap §3.X strings before populating any vault; the structure in [§3](#3--vault-structure) and the SOP in [§6](#6--onboardinguse-sop) are vendor-agnostic.

### §2.2 Comparison

| Vendor | Cost (per seat/mo) | MFA model | Secret-sharing primitive | Audit log retention | Recovery path | Integration cost |
|---|---|---|---|---|---|---|
| **1Password Business** | $19.95 USD | Passkey + WebAuthn (YubiKey native) + Secret Key + master password | Vaults, granular per-vault grants, SCIM | 12 months default | Recovery Kit (printable) + account recovery via SCIM admin or designated emergency contact | CLI (`op`) + GitHub Action; ~1 hour to wire one vault |
| **HashiCorp Vault Cloud** | From $0.03/hour/active-user → ~$22/mo for one operator + standby capacity; $1k+/mo at meaningful contractor scale | OIDC / userpass / TOTP / WebAuthn (YubiKey via WebAuthn) | Policies + paths; programmatic-first | Configurable (audit device required) | Unseal keys (Shamir) — 5-of-3 default; loses access if 3 keys lost | Heavy: Terraform module, audit device, secret engines wiring; ~1–2 days for parity with 1Password |
| **AWS Secrets Manager** | $0.40/secret/mo + $0.05 per 10k API calls | IAM (root MFA + per-IAM-user MFA) | IAM policies on `secretsmanager:*` actions; resource policies on individual secrets | CloudTrail (90-day default; longer with S3 export) | IAM root account recovery — phone + email | Native to AWS workloads; for non-AWS use it is just an encrypted KV with IAM friction |
| **Bitwarden Teams** | $4 USD | TOTP, WebAuthn (YubiKey via WebAuthn), Duo on Premium | Collections + per-collection groups | 30 days standard, longer on Enterprise | Emergency Access (designate contact) + recovery code | CLI (`bw`) + native field schema; ~1 hour to wire |
| **No vault — status quo** (`pass` + YubiKey) | $0 | YubiKey-backed PGP | None — copy/paste between operators | None | Loss of operator's laptop or lost YubiKey = loss of vault | $0 |

### §2.3 Why 1Password over the alternatives

- **HashiCorp Vault Cloud** is the right tool for *runtime* secret retrieval at scale (think: 200 services pulling DB credentials at boot). For an operator-side vault that holds contracts, recovery codes, and term sheets, it is over-engineered: the unseal-key recovery model trades convenience for a threat model that matters at enterprise scale, not solo-operator scale. The cost model also penalises low-traffic-but-high-secret-count usage, which is exactly this vault's shape.
- **AWS Secrets Manager** is priced per secret. A vault that holds ~50 entries (operator credentials, draft contracts, vendor accounts, per-client recovery contacts × 30 future clients) reaches $20/mo on storage alone, before any retrieval. The IAM model is also wrong-shaped for the use case: humans authenticating via IAM is friction, not security, when the alternative is Passkey + Secret Key.
- **Bitwarden Teams** is the strongest cost competitor at $4/seat/mo. It is a defensible pick if budget is the binding constraint or if the operator already has a Bitwarden subscription. The reasons the recommendation lands on 1Password instead: (a) 1Password's Recovery Kit is a single artefact the operator can include in the [`08 §4`](08-future-work.md#4-ip--business-secrets-vault) break-glass envelope without operational friction; (b) SCIM is included on Business (not Premium), which matters once contractors land; (c) the 1Password CLI's structured-field schema is easier to script for the per-engagement provisioning that ships in `forge provision …` (`05 §P5.4`).
- **Status quo (`pass`)** fails the successor / contractor test (§1 force #1) and the second-party-envelope test (§1 force #3). It is correct *today* and incorrect *as soon as the second person enters the picture* — which is the trigger this ADR is designed to anticipate.

The cost delta between Bitwarden ($4) and 1Password ($19.95) is ~$192/year for a single operator seat. Re-evaluate when Cliff 5 lands ([`18 §6`](18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points)) and the second seat doubles the recurring line item; if vault cost becomes load-bearing in the cost model, [`20 §3`](20-launch-and-operating-cost-model.md#3--recurring-monthly-costs) is where the swap is reasoned about, not here.

---

## §3 — Vault structure

The vault is a flat list of *vaults* (1Password's term for sharable scopes). Each vault is named, scoped, and access-controlled. The hierarchy is intentional: the names are an access-control surface, not a folder taxonomy.

| Vault | Scope | Membership | Holds |
|---|---|---|---|
| `Operator` | Operator-only | `operator` only | GitHub recovery codes, Apple ID recovery, domain registrar (today: the registrar that owns `lumivara.ca`), financial accounts (operating bank account, business credit card), `palimkarakshay` GitHub account password, master vault recovery sheet (sealed; cross-referenced from the [`08 §4`](08-future-work.md#4-ip--business-secrets-vault) envelope). |
| `Lumivara-Forge-IP` | Operator-only | `operator` only | Product-strategy decks not in repo, pricing-model variants, partnership term sheets, draft contracts pre-execution, internal cost-model sheets that contain margin assumptions, the operator's own market-research raw notes (the published synthesis lives in `docs/research/`). |
| `Vendors` | Operator-only | `operator` only | Vendor account credentials **not** in Vercel/n8n env: payroll provider, accounting software (QuickBooks / Wave), insurance broker portal, professional liability insurance portal, the operator's accountant's portal, GST/HST filing portal. |
| `Per-client/<slug>` | Per-engagement | `operator` + the named contractors on that engagement (time-boxed) | Operator-side records for one client: client correspondence threads not captured in [`19-engagement-evidence-log-template.md`](19-engagement-evidence-log-template.md), recovery contact details, client-provided assets that fall outside the client repo (e.g. brand-guideline PDFs the client emailed), the client's primary contact's mobile (for the SMS escalation lane in [`12 §2`](12-critique-security-secrets.md#2----high-auth_resend_key-shared-across-every-client-breaks-the-cost-firewall)). **Does not** hold Vercel env, n8n credentials, or the per-client `AUTH_*` family — those are governed by [`03 §3`](03-secure-architecture.md#3-secret-topology) and never duplicated here. |
| `Break-glass` | Sealed (operator-only at vault level; physical envelope at recovery-time level) | `operator` only | Printed recovery envelope contents (cross-reference, not duplicate, of [`08 §4`](08-future-work.md#4-ip--business-secrets-vault) and [`09 §2.5`](09-github-account-topology.md#25-adding-the-second-owner-break-glass-setup)), second-Owner credentials per [`12 §1`](12-critique-security-secrets.md#1----critical-single-owner-github-topology-has-no-break-glass), vault master-password recovery sheet, YubiKey reset codes. |

The `Operator`, `Lumivara-Forge-IP`, `Vendors`, and `Break-glass` vaults are durable. The `Per-client/<slug>` vaults are created when a client is added to `src/lib/admin/clients.ts` (see [§6](#6--onboardinguse-sop) for the day-zero ceremony) and archived (not deleted) when the engagement terminates.

---

## §4 — Access roles

Roles are defined per-vault, not globally. The matrix below is the canonical role list; any new role lands here first.

| Role | `Operator` | `Lumivara-Forge-IP` | `Vendors` | `Per-client/<slug>` | `Break-glass` |
|---|---|---|---|---|---|
| `operator` | RW | RW | RW | RW | RW |
| `contractor` | — | — | — | RW (named engagement only, time-boxed; default 90 days) | — |
| `legal` | — | RO (contracts subset only) | — | — | — |
| `accountant` | — | — | RO (financial subset only) | — | — |

Tier-based engagement scope (per [`04-tier-based-agent-cadence.md`](04-tier-based-agent-cadence.md)):

- **T0 / T1 engagements** never invite a contractor; the operator is the only `Per-client/<slug>` member.
- **T2 / T3 engagements** may invite a contractor for content / design tasks. The contractor's `Per-client/<slug>` membership is created at engagement start and ends when the engagement terminates or 90 days elapse, whichever first. Time-boxing is enforced via 1Password's "Set time limit" on the invite, not by manual diary review.

`legal` and `accountant` roles are **observer** roles — read-only, scoped to a single subset of one vault each, intended for the lawyer and accountant who already exist in the [`20 §2`](20-launch-and-operating-cost-model.md#2--one-time-launch-costs) launch costs. They do not hold operator-vault credentials.

---

## §5 — Rotation policy

Rotation cadences are categorised, not per-secret. The categories below mirror the shape of [`03b §4`](03b-security-operations-checklist.md#4--secret-rotation-schedule-matrix) so the operator's mental model carries across both files.

| Category | Cadence | Pattern | Validation |
|---|---|---|---|
| Vendor credentials (operator portal logins for QuickBooks, Wave, payroll, insurance broker, Stripe operator portal) | 90 days if vendor allows; 12 months if vendor caps shorter | Instant (sign in, change password, update vault entry) | Sign in to the portal post-rotation; confirm 2FA still enrolled |
| Recovery codes (GitHub, Apple ID, domain registrar, primary email, vault master) | When used or every 12 months, whichever first | Instant (regenerate, reseal envelope, update break-glass entry) | Confirm new codes redeem on the issuing surface; reseal the [`08 §4`](08-future-work.md#4-ip--business-secrets-vault) envelope |
| Draft contracts, term sheets, decks | Versioned, never rotated | n/a (versioning, not rotation) | Append-only history within the `Lumivara-Forge-IP` vault |
| Financial credentials (operating bank, business credit card portal) | Every 6 months OR after every contractor offboard, whichever first | Instant (rotate at issuing bank's portal, update vault) | Confirm a low-value transaction succeeds with the rotated credential |
| `Per-client/<slug>` contents | At engagement termination (archive, do not delete); on contractor offboard within 24 h | Instant (archive vault → contractor revoked from membership) | Vault archival event in 1Password audit log; contractor confirms no active access |
| Break-glass envelope contents | Once per quarter alongside the [`03b §3`](03b-security-operations-checklist.md#3--recovery-drill-template) recovery drill | Instant (regen, reseal) | The drill itself is the validation |

Rotation events log to `docs/operator/SECURITY_OPS_LOG.md` (operator-only file; never copied to client repos), in line with the destination column in [`03b §4`](03b-security-operations-checklist.md#4--secret-rotation-schedule-matrix). This file does **not** introduce a separate vault-events log — one log, two sources.

---

## §6 — Onboarding / use SOP

### §6.1 Day-zero (operator)

1. Create the 1Password Business account; pick the `lumivara-forge` slug (matches the locked brand-slug from `15 §4`). Set the operator's email to a non-`palimkarakshay` address (e.g. `operator+vault@lumivara-forge.com` once the domain is registered, or a Gmail+alias until then) so the vault account survives if the personal email is compromised.
2. Generate the Secret Key. Print the 1Password Recovery Kit. Place a copy of the Recovery Kit, sealed, in the [`08 §4`](08-future-work.md#4-ip--business-secrets-vault) break-glass envelope alongside the printed GitHub recovery codes.
3. Enrol the operator's primary YubiKey (passkey/WebAuthn) and a secondary YubiKey (kept offline in the [`08 §4`](08-future-work.md#4-ip--business-secrets-vault) envelope) on the 1Password account.
4. Create the four durable vaults from [§3](#3--vault-structure): `Operator`, `Lumivara-Forge-IP`, `Vendors`, `Break-glass`.
5. Import existing `pass` entries into the matching vault. Use `pass` → CSV → `op item create` (the `op` CLI accepts `op item create --vault <vault> --template <template>`); do not paste secrets through the clipboard for any value that can be piped.
6. Run a smoke read: from a fresh shell, `op item get "GitHub recovery code"` against the `Operator` vault, confirm decryption.
7. Append a `SECURITY_OPS_LOG.md` entry: `YYYY-MM-DD — Vault provisioned (1Password Business); Recovery Kit sealed in [§4 envelope]; primary + secondary YubiKey enrolled.`

### §6.2 Per-engagement

Triggered when a new client is added to `src/lib/admin/clients.ts` (the canonical roster surface; see [`dual-lane-enforcement-checklist.md`](dual-lane-enforcement-checklist.md) for what "added" means structurally):

1. Create the `Per-client/<slug>` vault (operator membership only).
2. Migrate any in-flight client correspondence that is not in [`19-engagement-evidence-log-template.md`](19-engagement-evidence-log-template.md) (typically: phone numbers, emergency contacts, any client-provided assets emailed before the repo existed).
3. If the engagement is T2/T3 and a contractor will join, invite the named contractor with a 90-day time-box from `1Password admin → Vault → Manage access`.
4. Append to `docs/operator/SECURITY_OPS_LOG.md`: `YYYY-MM-DD — Per-client/<slug> vault created; T<n>; contractor: <name|none>; time-box: <date|n/a>.`

### §6.3 Per-contractor

1. Invite the contractor via SCIM (1Password Business → Provisioning → SCIM bridge). The SCIM identity provider is the operator's choice; for solo-operator scale, 1Password's built-in directory is sufficient.
2. Scope the contractor to exactly the `Per-client/<slug>` vault for the engagement. Never grant access to `Operator`, `Lumivara-Forge-IP`, `Vendors`, or `Break-glass`.
3. Set the membership time-box. Default: 90 days; shorter if the engagement is shorter; longer requires an explicit `SECURITY_OPS_LOG.md` entry justifying the deviation.
4. On engagement termination, archive the `Per-client/<slug>` vault (do not delete — the audit trail and the client's own records may need retrieval). 1Password's archive preserves contents read-only; the contractor's membership lapses automatically.

### §6.4 Per-vendor account creation

When the operator opens a new vendor account (a new accounting tool, a new payroll provider, a new bank), the credential lands in the `Vendors` vault on creation, not later. The "later" path is how `pass`-shaped vaults accumulate orphan credentials no one rotates.

---

## §7 — What counts as "vaultable" vs. ordinary repo content

The vault's value is inversely proportional to its overlap with other secret surfaces. This decision tree is the boundary; apply it before creating any vault entry.

```
Is the artefact a runtime secret consumed by a Vercel project or n8n workflow?
├── Yes → Already covered by `03 §3`. Do NOT duplicate to the vault.
└── No
    │
    Would a competitor learn anything strategically by reading it?
    ├── Yes → Vault (Lumivara-Forge-IP).
    └── No
        │
        Would a client suffer reputational, legal, or financial harm
        from public exposure?
        ├── Yes → Vault (Per-client/<slug>).
        └── No
            │
            Is it derivable from public marketing, the live site,
            git history, or `docs/research/`?
            ├── Yes → Repo (ordinary content). Not vault material.
            └── No
                │
                Is it a credential / recovery code / password?
                ├── Yes → Vault (Operator or Vendors as appropriate).
                └── No → Probably wrong question; ask whether it
                         needs to exist at all.
```

Concrete examples:

| Artefact | Decision | Reason |
|---|---|---|
| `AUTH_RESEND_KEY` for client X | Repo (`03 §3` row) — vault NO | Runtime secret; per-client Vercel env. Vault would duplicate. |
| Operator's GitHub recovery codes | Vault (`Operator`) | Not runtime; not in repo; recovery code. |
| Pricing-model spreadsheet with margin assumptions for T1/T2/T3 | Vault (`Lumivara-Forge-IP`) | Strategic; competitor would learn. |
| Published cost analysis at `docs/storefront/03-cost-analysis.md` | Repo | Already public-ish; mothership audience. |
| Draft MSA before signing | Vault (`Lumivara-Forge-IP`) | Strategic + legal-pre-execution. |
| Signed MSA with Client #1 | Vault (`Per-client/lumivara-people-advisory`) | Per-client legal record. |
| Client primary contact's mobile (used for SMS escalation per `12 §2`) | Vault (`Per-client/<slug>`) | Per-client contact data; not in repo. |
| Client design files emailed pre-engagement | Vault (`Per-client/<slug>`) | Per-client asset; not in repo. |
| Operator's QuickBooks portal password | Vault (`Vendors`) | Vendor credential; not Vercel/n8n. |
| Stripe API key (live mode) | Repo (`03 §3` row "Stripe / Lemon Squeezy keys") | Already in operator-vault → invoicing scripts row of `03 §3`. The vault entry IS that row's "operator-vault" target. |

The "vault entry IS the `03 §3` row's target" line resolves the apparent contradiction: when `03 §3` says a secret "lives in operator's vault," that vault is *this* vault, after this ADR ships. The current `pass` tree is the placeholder.

---

## §8 — Migration plan from `pass`

Two-phase migration, dual-run for 14 days. The migration is operator-time, ~one weekend per [`08 §4`](08-future-work.md#4-ip--business-secrets-vault) (the cost estimate of CAD $100/mo proves out at 1Password's $19.95 USD × 1.39 FX × 12 ÷ 12 ≈ $27 CAD/mo for one seat — well below the §4 estimate, with headroom for the second seat at Cliff 5).

### §8.1 Phase 1 — Provision and import (Day 0)

1. Run §6.1 day-zero ceremony.
2. Export `pass` entries to a temporary CSV with `pass git log -p > /tmp/pass-export-YYYY-MM-DD.txt` (do not commit to the repo).
3. Categorise each entry against the §3 vault list.
4. Import in priority order: `Break-glass` first (recovery codes), `Operator` second (GitHub credentials), `Vendors` third, `Lumivara-Forge-IP` last (often manual; many of these are not in `pass` today).
5. Securely delete the temporary export: `shred -u /tmp/pass-export-YYYY-MM-DD.txt` (or platform equivalent).

### §8.2 Phase 2 — Dual-run (Days 1–14)

Both `pass` and 1Password remain authoritative. Every credential read happens from 1Password; every credential write happens in both stores. The 14-day window catches:

- Entries the import missed (often: rarely-used vendor portals).
- Operational friction the day-zero ceremony did not anticipate (CLI integration, browser extension behaviour, YubiKey UX in real workflows).
- The first monthly checklist pass ([`03b §1`](03b-security-operations-checklist.md#1--monthly-checklist-first-monday-of-the-month)) running against the new vault.

### §8.3 Phase 3 — Decommission `pass` (Day 15+)

Decommission only **after**:

- The first [`03b §1`](03b-security-operations-checklist.md#1--monthly-checklist-first-monday-of-the-month) monthly pass has succeeded against the new vault (i.e. the operator has executed every Pass criterion using 1Password as the source of truth).
- The first [`03b §2`](03b-security-operations-checklist.md#2--quarterly-checklist-first-friday-of-the-quarter) quarterly recovery drill has succeeded with the new vault's Recovery Kit playing its envelope role.

Until both are green: keep `pass`. The cost of running both is one extra password manager; the cost of decommissioning prematurely is irrecoverable secret loss.

Decommissioning ceremony:

1. Confirm 1Password vaults have full coverage; no `pass insert` has happened in the last 14 days.
2. `pass git log` → archive the final commit hash to `docs/operator/SECURITY_OPS_LOG.md`.
3. Delete the `pass` git repository and the `~/.password-store/` directory; remove the `pass` GPG subkey from the YubiKey if it was dedicated.
4. Append `SECURITY_OPS_LOG.md`: `YYYY-MM-DD — pass decommissioned; final commit <hash>; YubiKey re-provisioned for 1Password-only.`

---

## §9 — Failure modes & mitigations

| Failure mode | Mitigation | Cross-link |
|---|---|---|
| Operator forgets master password | Recovery Kit (sealed in [§4 envelope](08-future-work.md#4-ip--business-secrets-vault)) regenerates account access. | [`12 §1`](12-critique-security-secrets.md#1----critical-single-owner-github-topology-has-no-break-glass) |
| Operator loses primary YubiKey | Secondary YubiKey (in §4 envelope) takes over. After incident: re-enrol new primary, retire compromised primary in 1Password admin, log in `SECURITY_OPS_LOG.md`. | [`09 §2.5`](09-github-account-topology.md#25-adding-the-second-owner-break-glass-setup) |
| Contractor offboards with poor hygiene (laptop unwiped, browser extension still signed in) | 1Password admin → Revoke contractor → Force sign-out from all devices → archive `Per-client/<slug>` vault. The "force sign-out" is a single click; audit log records the revocation timestamp for the SOC2 paper trail when [`13 §`](13-critique-ai-and-scaling.md) deferred-compliance work catches up. | §6.3 |
| 1Password provider outage during a critical credential read | Break-glass envelope holds the printed recovery codes for the top 5 outage-blocking credentials (GitHub recovery, domain registrar, primary email, banking, vault master). In an outage > 4 h, the envelope is the operating credential surface. | [`08 §4`](08-future-work.md#4-ip--business-secrets-vault) |
| Operator hospitalised, second Owner activates break-glass | Second Owner uses the [`09 §2.5`](09-github-account-topology.md#25-adding-the-second-owner-break-glass-setup) procedure. The vault Recovery Kit unlocks the operator-vault account; the [`09 §2.5`](09-github-account-topology.md#25-adding-the-second-owner-break-glass-setup) GitHub recovery codes unlock the org. Both live in the same envelope intentionally — one envelope, both keys, per [`12 §1`](12-critique-security-secrets.md#1----critical-single-owner-github-topology-has-no-break-glass) point 3. | [`09 §1.5`](09-github-account-topology.md#15-break-glass-topology-single-owner-is-not-survivable) |
| Vault entry orphaned (client churned but `Per-client/<slug>` not archived) | Caught by the [§5](#5--rotation-policy) `Per-client/<slug>` row + the recommended monthly-checklist row in [`03b §1`](03b-security-operations-checklist.md#1--monthly-checklist-first-monday-of-the-month) — see this ADR's §1 entry in `03b §1` (added in the same PR as this file). | [`03b §1`](03b-security-operations-checklist.md#1--monthly-checklist-first-monday-of-the-month) |

---

## §10 — Open questions

1. **Cyber-liability insurance stance.** [`20 §3`](20-launch-and-operating-cost-model.md#3--recurring-monthly-costs) line F (Insurance & risk) lists professional-liability insurance but does not yet pin a cyber-liability rider. Vault provisioning may interact with a cyber-liability premium (some carriers discount for documented vault-with-MFA postures). Open issue when the operator engages an insurance broker; defer decision until then.
2. **Retention windows for archived `Per-client/<slug>` vaults.** Default policy: keep archived (read-only) for 7 years (mirrors Ontario's general statute-of-limitations clock). Confirm with legal during the [`08 §1`](08-future-work.md#1-privacy--pipeda) PIPEDA / Law 25 work; if Quebec residency lands first, Law 25 has shorter mandatory deletion windows for some categories of personal data — surface that here when it lands.
3. **Future GitHub App private-key storage.** The GitHub App's `APP_PRIVATE_KEY` is currently scoped as an org secret (`03 §3.X`). 1Password Business has a "Developer Tools" / "Documents" item type that would let the operator store the PEM with versioning. Whether to move it from "GitHub org secret" to "vault → secret-injected at workflow time via 1Password's GitHub Action" is a *separate* decision that touches `.github/workflows/`; explicitly out of scope here. Track in the issue tracker as a follow-up if the operator wants to reduce org-secret count.
4. **Vendor lock-in escape path.** If 1Password is later swapped for Bitwarden or HashiCorp Vault, what is the migration cost? Exporting from 1Password is supported (`.1pif` format), and the §3 vault structure is vendor-agnostic. Re-evaluate at Cliff 5 ([`18 §6`](18-capacity-and-unit-economics.md#6--scale-thresholds-and-trigger-points)) when the second seat changes the cost calculus.
5. **Vault choice itself.** The §2 recommendation is provisional. The operator should confirm before any vault is provisioned and populated. The [DoD checkbox](https://github.com/palimkarakshay/lumivara-site/issues/117) "Initial vault populated with current secrets" is a **post-merge human step**.

---

## §11 — Cross-references

- Operator-side cadence (monthly + quarterly): [`03b-security-operations-checklist.md`](03b-security-operations-checklist.md). The vault-audit row in `§1` is the recurring touch-point for this ADR.
- Per-client runtime secret topology: [`03-secure-architecture.md §3`](03-secure-architecture.md#3-secret-topology). The vault never duplicates rows from that table.
- Break-glass envelope and second-Owner protocol: [`09-github-account-topology.md §1.5`](09-github-account-topology.md#15-break-glass-topology-single-owner-is-not-survivable) + [`§2.5`](09-github-account-topology.md#25-adding-the-second-owner-break-glass-setup).
- Original critique that motivated the vault: [`12-critique-security-secrets.md §1`](12-critique-security-secrets.md#1----critical-single-owner-github-topology-has-no-break-glass).
- Vault as a future-work stub (this ADR supersedes it): [`08-future-work.md §4`](08-future-work.md#4-ip--business-secrets-vault).
- Practice-wide cost model (where vault recurring cost is reasoned about): [`20-launch-and-operating-cost-model.md §3`](20-launch-and-operating-cost-model.md#3--recurring-monthly-costs).

*Last updated: 2026-04-29.*
