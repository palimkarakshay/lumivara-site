<!-- OPERATOR-ONLY. Recommendations on naming and brand. -->

# 15 — Terminology & Brand: Recommendations

The pack uses placeholders (`mothership`, `operator`, `client`, `agent`) that work internally but don't map cleanly to industry-standard terms. This doc proposes a renaming scheme that is unambiguous to anyone with a standard PMP / SRE / agency background, plus brand-name alternatives that scale to the broader product family the operator hinted at ("automation/self-sustaining/branding/communication/marketing products that will be logically offered in the next few years").

---

## §1 — Internal terminology: what to keep, what to rename

The principle: every internal noun should be **immediately understood by a senior engineer or PM walking in cold**. The current placeholders are evocative but require translation.

| Current placeholder | Issue | Recommended rename | Why |
|---|---|---|---|
| **Mothership** | Sci-fi / metaphorical; not a standard role in any industry framework | **Control Plane** (preferred) or **Platform** | "Control plane" is the standard term in cloud / SRE / k8s for the system that manages a fleet. It's exactly what the mothership *is*. Anyone with a backend background understands it instantly. |
| **Mothership repo** | "ship" implies a thing, not a system | **Platform Repo** or **Control-Plane Repo** | Pairs with the above. |
| **Operator** | Slightly ambiguous (SRE / industrial / pyhsical-plant operator?) | **Operator** (keep) — but qualify in context as **Founder-Operator** until headcount > 1, then **Practice Operator** | "Operator" as a role is established in MSP/IT and SRE worlds; just qualify scope. |
| **Client** | Fine | **Client** (keep) | Industry-standard for service businesses. |
| **Client repo** | Fine but generic | **Site Repo** | Names the artefact (a marketing site), not the relationship. Reduces confusion when the same client later has a "careers site" — that's also a Site Repo, owned by the same Client. |
| **Agent** | Overloaded — "AI agent", "client agent" (legal), "service agent" — pick one | **Pipeline** for the overall automation; **Run** or **Job** for one execution; **Bot** for the GitHub identity | Keeps "agent" out of the pack entirely, avoiding the three competing meanings. |
| **Autopilot** (customer-facing) | Already a marketing word that maps cleanly | **Autopilot** (keep) — *only* in client-facing copy; never in operator docs | Customer-facing differentiator. Internally call it "the pipeline." |
| **Cadence** (T0–T3 cron schedules) | Fine | **Cadence** (keep) | Industry-standard term for "how frequently a thing runs." |
| **Tier** | Fine | **Tier** (keep) | Industry-standard. |
| **Trust zone** | Slightly heavy | **Zone** (keep, but drop "trust" prefix in casual references) | "Trust zone" is correct security terminology; just don't repeat the modifier 5 times per page. |
| **Vendor bot account** | Two words doing one job | **Bot Account** | "Vendor" is implicit; just call it the bot. |
| **Operator overlay** | Specific to the two-branch trick — and that trick is being reworked (`11 §1`) | TBD after `11` lands | Will become "Pipeline branch" if Pattern A wins, or "Pipeline repo" if Pattern C wins. |

### One-page glossary, post-rename

```
Control Plane / Platform   The mothership: one private repo + one GitHub
                          org + Railway n8n + operator vault. Manages the
                          fleet. Never client-visible.

Platform Repo             palimkarakshay/{{BRAND_SLUG}}-platform — the
                          control plane's source code, runbooks, CLI.

Site Repo                 One per client engagement. Holds the marketing
                          site + the admin portal.

Pipeline                  The set of GitHub Actions workflows + scripts +
                          n8n flows that triage, plan, execute, and
                          deploy site changes.

Pipeline Run              One scheduled execution of one workflow.

Bot Account               {{BRAND_SLUG}}-bot — the GitHub identity that
                          opens PRs and writes labels.

Operator                  The human running the practice. Today: one
                          person (Founder-Operator). Future: optionally
                          a second (Practice Operator).

Client                    The small-business customer.

Tier                      One of T0 / T1 / T2 / T3 / T4 — the price +
                          cadence + included-edits bundle.

Cadence                   How frequently the pipeline runs for a given
                          client (set per Tier).

Zone                      Trust boundary. Three zones: Platform,
                          Site (per-client), Shared third-party
                          (Vercel, Resend, etc.).

Engagement                One Client × one signed Statement of Work ×
                          one Site Repo. Has a start, an end, an
                          engagement-log.md.

Autopilot                 Customer-facing name for the Pipeline. Used
                          in marketing copy, never in code or runbooks.
```

Apply this glossary as a top-of-doc reference in `00-INDEX.md` once the rename lands.

---

## §2 — Brand alternatives: beyond Lumivara Forge

The operator likes "Lumivara Forge." It's a fine name. Listing alternatives because the brand will sit in domains, GitHub orgs, customer copy, sub-product names, and the operator's email signature for the next 5–10 years; the right name compounds.

### Selection criteria

A good brand for this practice scores well on:

1. **Captures the essence:** building, maintaining, and improving without supervision.
2. **Extensible:** the operator wants to ship adjacent products (automation, self-sustaining, branding, communication, marketing) over the next few years. The brand should accommodate sub-products without breaking.
3. **Brand-family halo with Lumivara People Advisory** (Beas's brand) — but not so coupled that her rebrand forces yours.
4. **Pronounceable globally** (the operator is in Toronto; clients may be ROW).
5. **Domain availability** in `.com` and `.ca`.
6. **Doesn't collide** with existing tech-stack names or trademarks.

### The shortlist (recommended for serious consideration)

| # | Name | Reads as | Why it fits | Future product names |
|---|---|---|---|---|
| 1 | **Lumivara Forge** ★ (current) | "the maker shop within Lumivara" | Maker / artisan; exactly the "build & maintain" frame | Forge Sites, Forge Comms, Forge Brand, Forge Pulse |
| 2 | **Lumivara Cadence** ★ recommended for the broader vision | "the rhythm-keeper" | The literal mechanism of the offering — the autopilot's *cadence* — becomes the brand. Self-sustaining is in the name. | Cadence Sites, Cadence Comms, Cadence Voice, Cadence Pulse, Cadence Studio |
| 3 | **Lumivara Continuum** | "the unbroken thread" | Speaks directly to "doesn't decay between updates"; very elegant for the always-improving promise | Continuum Sites, Continuum Voice, Continuum Atlas |
| 4 | **Lumivara Pulse** | "the heartbeat" | Living-system metaphor; pairs with monitoring/dashboard naturally | Pulse Sites, Pulse Comms, Pulse Beat |
| 5 | **Lumivara Loom** (already in `01`) | "the weaver" | Distinct, premium, brand-able | Loom Sites, Loom Lines, Loom Voice |
| 6 | **Lumivara Atelier** (already in `01`) | "the studio" | Premium positioning | Atelier Sites, Atelier Press |
| 7 | **Lumivara Helm** | "the captain" | Steering/guidance; works for advisory + tech under one umbrella | Helm Sites, Helm Voice, Helm Compass |
| 8 | **Lumivara Lighthouse** | "the beacon" | Plays on "Lumi" (light) etymology; signals reliability | Lighthouse Sites, Lighthouse Watch |
| 9 | **Lumivara Compass** | "the direction-giver" | Advisory / guidance frame; clean adjacent to Beas's HR practice | Compass Sites, Compass Voice |
| 10 | **Plumbline Studio** (independent of Lumivara, already in `01`) | "the straight-shooter" | Full separation; cleaner if brand-family ever decouples | Plumbline Sites, Plumbline Voice, Plumbline Comms |

### The locked choice

**Operator confirmed Lumivara Forge (2026-04-28).** Maker/artisan frame; "build & maintain" verbs; keeps brand-family halo with Beas's HR practice. The slightly crowded namespace ("Forge" appears in many tech-tool names) is a known trade-off; differentiation comes from the consistent sub-product naming below in §3.

**Lumivara Cadence** is preserved as the closest runner-up should the operator ever revisit the brand decision — its mechanic-mirrors-naming property (cadence matrix in `04`) is unique and cheap to revive (placeholders are mechanical to swap; see `15 §4`).

### Names I'd avoid

- *Lumivara Stack* — generic, every tech co called Stack-something.
- *Lumivara Tech Solutions* / *Info Tech Solutions* (the original placeholder) — reads like a 2012 SI-shop.
- *Lumivara AI* — dates immediately; AI-as-noun naming will look 2024-vintage by 2027.
- Any brand that needs a hyphen in the URL (`my-brand-name.com`) — readability tax forever.

### What the operator needs to verify before committing

```
[ ] {{BRAND_SLUG}}.com available (Namecheap / Cloudflare check).
[ ] {{BRAND_SLUG}}.ca available.
[ ] @{{BRAND_SLUG}} handle on Twitter/X, LinkedIn, Github (org slug).
[ ] No active CIPO trademark conflict in Class 42 (computer services)
    or Class 35 (advertising/business management) — quick search at
    https://ised-isde.canada.ca/cipo/trademarks-search/.
[ ] No US TM conflict (USPTO TESS) for the same classes.
[ ] Pronounces cleanly when said aloud at a coffee shop ("hi, I'm
    from Lumivara Cadence" should not require a spelling).
[ ] Reads cleanly in an email signature 4 lines from your name
    without crowding.
```

---

## §3 — Sub-product naming convention (for the next 24 months)

The operator hinted at future products in adjacent verticals. Establish a naming convention now so the second product doesn't break the system.

### Pattern: `Lumivara Forge {{Product Word}}` (locked)

```
Lumivara Forge Sites        — the offering covered by this pack
Lumivara Forge Voice        — communication / inbox / reply automation
Lumivara Forge Brand        — logo / colour / type / asset generation
Lumivara Forge Pulse        — monitoring + observability + alerts
Lumivara Forge Atlas        — multi-site / multi-region overview
Lumivara Forge Studio       — the mobile-first operator dashboard
```

- **One brand, many products.** Each "product word" is a single English noun.
- **Each product gets its own GitHub repo** under the same org (`lumivara-forge/<slug>-voice`, `lumivara-forge/<slug>-brand`, etc.).
- **Cross-product integration is a deliberate "Forge Suite" decision**, not an accident.
- **Sub-product retirement is graceful** — the suite name doesn't change when you sunset one product.

### What to do today

- Buy the parent domain (`{{BRAND_SLUG}}.com` and `.ca`).
- Park a one-page placeholder.
- Don't buy sub-product domains yet; subdomain or path until each product proves itself (`pulse.{{BRAND_SLUG}}.com`, `{{BRAND_SLUG}}.com/voice`).

---

## §4 — Renames to apply (locked: Lumivara Forge)

Operator confirmed Lumivara Forge on 2026-04-28. The mechanical mapping:

```
Repo-level    {{BRAND_SLUG}}              → lumivara-forge
              {{BRAND_SLUG}}-bot          → lumivara-forge-bot
              {{BRAND_SLUG}}-mothership   → lumivara-forge-platform
                          (also rename "mothership" → "platform" per §1)

Domain        {{BRAND_SLUG}}.com          → lumivara-forge.com
              mail.{{BRAND_SLUG}}.com     → mail.lumivara-forge.com

Org           GitHub org name             → lumivara-forge
              n8n hostname                → n8n.lumivara-forge.com

Display       {{BRAND}}                   → "Lumivara Forge"
              Sub-product                  → "Lumivara Forge Sites"

Workflow      n8n workflow prefixes       → forge-* (per-client suffix)
              Site footer credit           → "Forged by Lumivara"
                          (tagline updated 2026-04-29 — drops the
                          "Built on…" framing in favour of the
                          parent-brand verb form. Renders on the
                          Site as "Forged by Lumivara — Sites
                          built for advisors who lead with
                          clarity." See
                          src/lib/site-config.ts builder block.)
```

Single global find-replace pass against `docs/mothership/`, `docs/storefront/`, the templates, the workflows, and the dashboard. All placeholders already use `{{BRAND}}` / `{{BRAND_SLUG}}`, so the rename is mechanical. Run S1 (`16 §5`) executes this pass.

---

## §5 — Summary action list

Decisions locked on 2026-04-28:

```
[x] Brand: Lumivara Forge
[x] Internal rename: full §1 table (mothership → platform,
    agent → pipeline+run+bot, etc.)
[x] Sub-product naming: Forge Sites, Forge Voice, Forge Brand,
    Forge Pulse, Forge Atlas, Forge Studio
```

Operator-side actions still pending:

```
[ ] Buy lumivara-forge.com and lumivara-forge.ca.
[ ] CIPO + USPTO trademark availability check (Class 42 + Class 35).
[ ] Run S1 (16 §5) to do the global mechanical rename.
[ ] After S1: insert this doc's glossary into 00-INDEX.md.
[ ] Update GitHub org slug to lumivara-forge (one-time, irreversible
    without paid migration — do it after the trademark check clears).
```

The renames touch ~150 references across the repo. Doable in one Claude session (60–90 turns, Sonnet). Prompt body lives in `16 §5`.

---

## §6 — Terminology policy and forbidden strings

The brand name is **Lumivara Forge** (locked 2026-04-28 in §4 above). This section makes that decision enforceable in writing rather than leaving it to operator memory: it names the strings that must not appear in operator-scoped docs, and points at §7 below where legitimate references *are* allowed.

### Scope rules

| Scope | What lives here | Brand identity used | `Lumivara People Advisory` / `Lumivara People Solutions` allowed? |
|---|---|---|---|
| **Operator / mothership** | `docs/mothership/**`, `docs/AI_ROUTING.md`, `docs/MONITORING.md`, `docs/GEMINI_TASKS.md`, `docs/wiki/*` (operator-scoped pages), `AGENTS.md`, `CLAUDE.md` | "Lumivara Forge" only | **No** — except inside §7 of this file, or inside an explicit `> _Client example — see 15 §7._` callout that links to §7. |
| **Migration history & critique** | `docs/mothership/00-INDEX.md` (Why-this-folder-exists genesis + read-order entries about Client #1), `docs/mothership/01-business-plan.md` (brand-comparison rows), `docs/mothership/05` (P5.5 / P5.6 migration steps), `docs/mothership/07` (Dummy A — per `14 §9`), `docs/mothership/08` (historical context), `docs/mothership/10` (critique), `docs/mothership/14` (critique §2 / §9), `docs/mothership/15` itself (§2 brand-family halo, §6 policy, §7 appendix), `docs/mothership/17` (issue-seeding pack), `docs/migrations/*` (one-shot runbooks), `docs/BACKLOG.md` (migration row) | The historical client name *is* the subject | **Yes** — these docs literally describe the Client #1 spinout, the critique that motivated it, or the brand-comparison context that named the client; they are allowed to name the client. |
| **This-repo identity (transitional)** | `README.md`, `CONTRIBUTING.md` until the P5.6 spinout lands | The client's own brand | **Yes** — this repo is operationally Client #1's site today; renaming the README ahead of P5.6 would create the same operator/client contamination this policy is trying to prevent. The "Operator vs client framing" paragraph at the top of `README.md` makes the distinction explicit. After P5.6 the README is purely client-facing. |
| **Client repo** | A future per-client site repo | The client's own brand only | The operator brand appears only in a single footer credit ("Forged by Lumivara" — tagline locked 2026-04-29; see §4 for the dated note). Other client brands never appear. |

### Forbidden strings (operator-scope only)

In the operator-scope row above, these literal strings must not appear except inside §7 of this file or inside a `> _Client example — see 15 §7._` callout:

- `Lumivara People Advisory`
- `Lumivara People Solutions`
- `people advisory` (case-insensitive — covers the lowercase prose form used in older AI prompts and routing docs)

The same rule covers `lumivara.ca`, `Beas Banerjee`, and other Client #1-specific identifiers when used as default operator context (i.e., not inside a labelled example or a migration-history doc).

### Enforcement

A future CI lint script (`scripts/check-terminology.sh`, planned in a follow-up issue — `scripts/*` is human-only per `AGENTS.md` and was deliberately deferred out of the issue that introduced this policy) will grep the forbidden strings against the operator-scope path list and fail when a hit lands outside the allowed paths in §7 or the migration-history rows above. Until that script lands, the policy is reviewer-enforced. The audit-grep recipe is

```
git grep -niE 'Lumivara People (Advisory|Solutions)|people advisory' \
  -- docs/ README.md CONTRIBUTING.md AGENTS.md CLAUDE.md
```

Every remaining hit must fall under one of: §7 of this file, a `> _Client example_` callout linking back to §7, a migration-history doc listed above, or `README.md` / `CONTRIBUTING.md` under the framing paragraph.

---

## §7 — Client example appendix

This appendix collects the legitimate-but-formerly-inline references to *Lumivara People Advisory* (Client #1) so that operator-scoped docs can link here instead of stamping a real client's brand into default operator context.

Each example below is labelled with its client and its purpose. Do not copy these examples into a different client's repo — the per-client intake replaces the brand voice and the slug in every case.

### Example — Lumivara People Advisory (Client #1 site repo today)

Until the P5.6 spinout (see `docs/mothership/05-mothership-repo-buildout-plan.md §P5.6` and the runbook at `docs/migrations/lumivara-people-advisory-spinout.md`), the de-facto Client #1 site repo is `palimkarakshay/lumivara-site`. After the spinout it migrates to `palimkarakshay/lumivara-people-advisory-site`. Operator-scoped docs that need a concrete example of "the client repo" link here rather than naming Beas's site inline; their prose uses `<client-slug>` / `<client-repo>` placeholders.

**Allowed because:** this is one specific client's mapping, not the operator's default. New operator prose uses placeholders and links here.

### Example — Lumivara People Advisory (brand-voice prompt for AI authoring)

`docs/GEMINI_TASKS.md §1` shows a brand-voice paragraph that hard-codes Beas Banerjee, lumivara.ca, and the HR services list. That text is correct *only* when batching insights articles for Client #1; for any other client, the operator swaps the brand-voice prompt with that client's intake before invoking the CLI.

**Allowed because:** the text documents how the operator briefs an AI for one specific client, not how the operator briefs an AI by default.

### Example — Lumivara People Advisory (engagement dummy intake)

`docs/mothership/07-client-handover-pack.md §A` carries *Dummy A* — a fully filled intake YAML for Client #1 — used as the template for new engagements. `14-critique-operations-sequencing.md §9` separately tracks hardening that dummy data with `.test` TLDs and 555-prefix phone numbers; that hardening is out of scope for this policy doc and is tracked as its own follow-up issue.

**Allowed because:** §A explicitly self-labels as a dummy intake and the surrounding doc treats it as one example among the per-engagement template set.

### How to add a new entry to §7

When a new operator-scoped doc would otherwise hard-code a real client brand:

1. Replace the inline reference with `<client-slug>` / `<client-repo>` placeholders in the surrounding prose.
2. Add a `> _Client example — see 15 §7._` callout at the point where the reader needs the concrete mapping.
3. Append a new `### Example — <Client name> (<purpose>)` block here with a one-line **Allowed because:** justification.

This keeps the operator-scope docs neutral (they read the same regardless of which client is currently Client #1) while preserving the concrete examples a future operator needs to ground the abstract doc against the live engagement.

*Last updated: 2026-04-29.*
