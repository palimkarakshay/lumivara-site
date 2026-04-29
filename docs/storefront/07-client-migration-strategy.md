# 07 — Client Migration Strategy

A working playbook for prospects who **already have a website**. Covers two paths and the hybrids in between, with explicit decision rules so the operator can route any inquiry without re-thinking the offering each time.

> **Status:** operational SOP, not a contract. Anything that reads like a binding commitment (DNS handover timelines, content ownership, termination triggers) belongs in the engagement-risk pack tracked in [issue #121](https://github.com/palimkarakshay/lumivara-site/issues/121). Do not lift sentences from this doc into a Statement of Work without first checking that the contract-binding language exists and matches.
>
> **Audience:** primarily operator. §6 (sales-conversation script) and §7 (decision matrix) are also safe to share with a co-pilot or a future practice operator. The sales-shareable distillation lives in [`08-client-migration-summary.md`](./08-client-migration-summary.md).
>
> **Brand context:** the practice operates under **Lumivara Forge** (locked 2026-04-28; see `docs/mothership/15-terminology-and-brand.md §4`). Tier names and prices reference [`02-pricing-tiers.md`](./02-pricing-tiers.md) — when those move, this doc inherits the change without edit.

---

## §1 — Source platform catalog

The platforms a small-business prospect is most likely arriving from. For each, the table records what the operator can actually pull out, how media is handled, who owns the domain by default, and whether the platform supports script injection (the gating signal for Path A — keep & integrate).

| Platform | Content extraction | Media | Domain ownership | Script-injection allowed? | Default redirect needs |
|---|---|---|---|---|---|
| **Squarespace** | Built-in XML export (Settings → Advanced → Import/Export). Pages, posts, products, basic forms. **Does not export** custom CSS, blocks-as-rendered, or member areas. | Images export inline; large galleries need manual download. | Client usually owns the domain via Squarespace Domains or a third-party registrar. Verify on first call. | Limited. Code Block + Code Injection (header/footer) on Business plan and above; Personal plan blocks injection. | High — vanity URLs are slug-stable but `/s/...` URLs change on export. |
| **Wix** | CMS JSON via Wix CLI/Velo for structured data; pages need **manual scrape** for layout. Wix's "Site Export" only covers blog posts as RSS. | Media Manager bulk download via Velo or manual. | Client owns the domain when bought elsewhere; Wix-bought domains are portable but with a 60-day transfer lock. | Yes via Velo (custom JS) on Premium plans; free plan blocks third-party scripts. | High — Wix URLs include hash fragments and `/blog/post/...` patterns that don't survive cleanly. |
| **Webflow** | CSV export per CMS Collection; full site export (HTML/CSS/JS) on paid Site plans. Forms are not exported (they live in Webflow's submissions DB). | Asset zip via Site export. | Client typically owns the domain. | Yes — Custom Code on paid plans, both site-wide and per-page. | Medium — slugs are usually stable; subdirectories are not. |
| **WordPress (self-hosted)** | WXR export (Tools → Export). Full content, comments, taxonomies. Plugins/themes do **not** export — only what's in the database. | Uploads directory copy via SFTP or the All-in-One WP Migration plugin. | Client owns hosting and domain. | Yes — full code access. | Low if permalinks are clean; high if `?p=123` query-string permalinks are still in use. |
| **WordPress.com** | Same WXR export from the dashboard. Free/Personal plans gate plugin-installed exports. | Media zip via dashboard. | Domain owned via WordPress.com or third-party. | Limited — only Business plan and above allow custom code. | Low — same WP permalink structure. |
| **Shopify** | CSV per resource (products, customers, orders). **Storefront pages and blog posts** export via the Transporter app or a manual copy. | Files section bulk download; product images embedded in CSV. | Client owns the domain; Shopify-managed domains transfer on a 60-day lock. | Yes — Script Tags API + theme customisation. | High — `/products/...` and `/collections/...` URLs are SEO-critical and must redirect 1:1. |
| **GoDaddy / Hostinger / Bluehost page builders** | No structured export. **Manual scrape only** — sitemap.xml + readability extraction. | Manual download. | Client owns the domain (often through the same vendor — flag the consolidation risk). | Usually no. The page builder's editor allows headers/footers HTML on paid tiers; verify per provider. | Medium — URLs are usually clean but vary by template. |
| **Static custom build (HTML / CSS / JS)** | Direct repo or zip. The cleanest source. | Already files. | Variable — check on first call. | Yes — full control. | Low if existing URLs are clean; otherwise the redesign drives the redirect map. |
| **"I have nothing"** (no live site, just a domain) | n/a | n/a | Client owns the domain (verify via WHOIS). | n/a | n/a — green-field build, route to a new-site engagement instead of this doc. |

> **Domain ownership default:** most clients in the small-business segment **do** own their domain — but the registrar account is often (a) at a previous agency, (b) at a relative's email, or (c) at a since-cancelled freelancer's account. The first 15 minutes of the discovery call ask for the registrar login; if the answer is "I'll have to find it," treat that as the first risk, not the second.

---

## §2 — Path A: Keep & integrate

The prospect is **happy with the current site** and only wants new capabilities — a chatbot, a contact form, a scheduling widget, an AI-assisted page, a careers/booking subsite. They are not asking for a redesign and the legacy bill is not a friction point.

### When to recommend it

- Client expresses pride or comfort in the current site ("it took us a year to get the colours right").
- The new capability is an **additive layer** (booking, AI chat, mobile-edit shortcut) that doesn't require touching the existing site's pages.
- The legacy host's bill is acceptable and the client values continuity over consolidation.

### Implementation patterns

Three patterns, ranked by how often they work cleanly. Pick the most invasive that the legacy platform actually permits.

1. **Subdomain integration (preferred).** The legacy site stays at the apex (`www.<client>.com`). Lumivara Forge ships a fresh app on a subdomain — `hello.<client>.com`, `book.<client>.com`, `chat.<client>.com` — that holds the new capability. The new repo follows the canonical two-repo shape (operator-controlled pipeline; client-readable site repo); see `docs/mothership/02b-pattern-c-architecture.md` for the architecture and `docs/mothership/06-operator-rebuild-prompt-v3.md` for the per-engagement playbook. The legacy site is unchanged.
2. **Script injection into the legacy platform.** When the platform allows it (see §1's "Script-injection allowed?" column), inject a small loader script into the legacy site's header or footer. The loader pulls a Lumivara-controlled bundle (chat widget, booking modal, A/B test) without touching the legacy CMS. This gives the legacy site new behaviour without spinning up a subdomain.
3. **Embedded iframe.** As a last resort, embed a Lumivara page inside an iframe on a legacy page (Squarespace Code Block, Wix HTML iframe, WordPress shortcode). Avoid except when (1) and (2) are both blocked.

### What we cannot inject (per platform)

- **Squarespace Personal plan** — no Code Injection, no Code Block. Falls back to subdomain only.
- **Wix free plan** — no Velo, no third-party scripts. Subdomain only.
- **WordPress.com Free/Personal** — no plugins, no custom code. Subdomain only.
- **GoDaddy / Hostinger / Bluehost page builders** — script support varies per plan; assume no until confirmed in the dashboard.
- **Shopify** — script tags are allowed but the Online Store 2.0 theme contract changes per template; never inject without first taking a theme snapshot.

### DNS for Path A

The apex stays where it is. The client adds a single subdomain pointing at Vercel.

| Record | Host | Type | Target |
|---|---|---|---|
| Lumivara subdomain | `hello` (or `book`, `chat`, etc.) | `CNAME` | `cname.vercel-dns.com` |
| Apex | `@` | unchanged | (legacy host's existing record) |
| `www` | `www` | unchanged | (legacy host's existing record) |

The operator never touches the apex on Path A. If a record on the legacy host needs changing, the client makes the change in their registrar with the operator on a screen-share — no shared registrar credentials.

### Cost stack & client-facing pricing

Same per-tier pricing as a green-field engagement (see [`02-pricing-tiers.md`](./02-pricing-tiers.md)) — Path A doesn't get a discount because the build effort is mostly the same; the legacy site just happens to stay live alongside it. The legacy host's monthly bill remains the **client's** obligation; surface this clearly in the proposal so the client can compare "$X/month with us + their current $Y/month with the legacy host" against "$X+something/month if we ever migrate later." See §3 for the migration math.

---

## §3 — Path B: Full migration

The prospect wants a redesign, the legacy platform is **blocking** AI/automation work (Path A's script-injection table forbids it), or the legacy bill is significant enough that consolidating to Lumivara saves real money.

### When to recommend it

- Client is frustrated with the current site (tone matters more than language — "it's fine" with a sigh is a yes).
- The legacy platform forbids the script injection that Path A would need.
- The combined legacy host + agency-edit-fees bill exceeds the equivalent Lumivara Forge tier on a 12-month view (refer the client to `docs/storefront/02-pricing-tiers.md` for the comparison; do not duplicate dollar numbers here).
- The brand has changed (rename, repositioning, new product line) and "lift and shift" wouldn't deliver enough.

### Steps

#### 3.1 — Content extraction

Per-platform tools, in operator-confirmed-it-exists order:

| Platform | Tool / procedure |
|---|---|
| Squarespace | Settings → Advanced → Import/Export → Site export (XML). |
| WordPress (self-hosted or .com) | Tools → Export → All content → WXR file. |
| Wix | Built-in CMS JSON export (Velo-managed); manual scrape for layout/styles. |
| Webflow | CMS Collection CSV export per collection; full site export on paid plans for HTML/CSS/JS. |
| Shopify | Admin → Products / Customers / Orders → Export (CSV per resource); blog posts via the Transporter app. |
| GoDaddy / Hostinger / Bluehost / others | **Manual scrape via `sitemap.xml`** + a readability-style extraction pass. Capture text, headings, images, alt text. |

#### 3.2 — Media archive procedure

- Download every image, PDF, video to a `<slug>-migration-archive/` folder. Keep filenames as-is.
- Capture **alt text** at extraction time — it's the single most-frequently-lost SEO signal.
- Re-export at 2× display size where the legacy site stored low-res; the new build uses Next.js Image and benefits from larger sources.
- Hash the archive (`sha256sum`) and record the digest in the engagement evidence log (`docs/clients/<slug>/evidence-log.md` per `docs/mothership/19-engagement-evidence-log-template.md`). The hash is the auditable proof that the archive predates cutover.

#### 3.3 — IA mapping

Old URL → new URL table. One row per legacy page with measurable traffic in the last 12 months. Record in `docs/clients/<slug>/migration.md` with columns:

```
| old_url | old_status | new_url | priority | notes |
```

Priority: P0 = top-50 pages by traffic, P1 = next 100, P2 = the long tail. Do every P0 manually; bulk-redirect the P2 tail to the new site's category index.

#### 3.4 — Redirect strategy

Every legacy URL with traffic returns a **301** to its mapped destination. Implementation lives in the site repo's `next.config.ts` `redirects()` function (Next.js 16 — see `node_modules/next/dist/docs/` for the current API contract). The shape:

```ts
async redirects() {
  return [
    { source: '/old-services/coaching', destination: '/services/coaching', permanent: true },
    { source: '/blog/:slug', destination: '/insights/:slug', permanent: true },
    // ...one row per migration.md P0/P1 line.
  ];
}
```

Do **not** write the `next.config.ts` code as part of this doc's PR — that lives in the per-client engagement and is its own follow-up issue. This section is the spec.

#### 3.5 — DNS handover

Five-step cutover sequence. Each step has a clean rollback if it fails.

1. **Stage on Vercel preview.** New site lives at `<client>-site.vercel.app` and a `staging.<client>.com` subdomain. Client reviews end-to-end on a real device.
2. **Freeze legacy edits.** Email + recorded call: "no edits to the legacy site for 48 hours starting `<date>`." Capture the freeze acknowledgement in writing.
3. **Flip A / AAAA / CNAME.** Client logs into their registrar (operator on screen-share, no shared credentials), changes the apex `A` record (or `ALIAS`/`ANAME` if supported) to Vercel's recommended IP, and the `www` `CNAME` to `cname.vercel-dns.com`. TTL was lowered to 300 s 24 hours earlier so propagation is fast.
4. **Monitor 24 h.** Watch the Vercel deployment health, the contact-form Resend log, and a manual click-through of the top-10 URLs from the IA mapping. Capture any 404 in the evidence log; patch the redirect rule and ship.
5. **Decommission legacy host.** Only after the **first invoice has cleared** under the new engagement (per the non-payment safeguards tracked in [issue #121](https://github.com/palimkarakshay/lumivara-site/issues/121)). Until that moment the legacy host stays paid and reachable — it's the rollback surface.

#### 3.6 — SEO continuity

- **Pre-cutover:** capture the top-50 ranking pages and their queries from Search Console (or a third-party rank tracker). Save the snapshot in `docs/clients/<slug>/migration.md`.
- **Post-cutover (24 h):** verify the redirects with a crawl (any HTTP-aware tool that follows 301s). Every legacy URL with traffic must end at a 200, not a 404 or a redirect loop.
- **Post-cutover (14 d):** re-pull the rank report. Any page that dropped more than 3 positions gets manually reviewed.
- **Surface to client:** ship the rank delta as a one-page summary in the evidence log. SEO recovery is a function of redirect quality + content parity; if both are clean, ranks return inside 4–6 weeks.

---

## §4 — Hybrid path

The prospect wants to **keep specific pieces** of the legacy stack — a paid Squarespace booking page they've spent two years tuning, a third-party chatbot they pay for separately, a custom calculator that their developer ex-employee built. The rest moves.

### The boundary, declared explicitly

Hybrid only works if the boundary is named on day one. Three columns, written into the proposal:

| Concern | Path A scope | Path B scope |
|---|---|---|
| **Subdomain ownership** | Which subdomain serves which capability? `book.<client>.com` stays Squarespace; `www.<client>.com` migrates to Lumivara. | Apex moves to Lumivara; `legacy.<client>.com` remains on the legacy host for the kept piece. |
| **CMS ownership** | Whose CMS owns each piece of content? The kept piece stays under the legacy CMS. | Migrated content moves to the Lumivara repo. |
| **Admin-portal surfacing** | The phone-edit admin portal (see [`02-pricing-tiers.md`](./02-pricing-tiers.md) Tier 1+) shows the *whole* engagement — Lumivara-managed pages directly, kept-on-legacy pages as a link out with a one-line "this page lives on Squarespace, edit there" tooltip. | Same. |

If the client cannot answer "which subdomain does what?" within 24 hours of being asked, they don't yet want hybrid — they want Path B and haven't admitted it. Re-route the conversation.

### Hybrid pricing

Same tier as Path A (no migration discount). Do **not** quote hybrid as cheaper than Path B because the integration testing cost is the same.

---

## §5 — Edge cases & escalation

The cases that derail an otherwise-clean migration. Each has a **defined response**, not a "we'll figure it out."

### 5.1 — Client refuses to share platform credentials

Path B needs at least read-access to the legacy CMS for content extraction. Three escalations, in order:

1. **Client-driven export with our SOP.** Send them §3.1's per-platform extraction recipe. They run the export, share the file via a one-time-link upload (not email).
2. **Pair on a screen-share.** The operator walks the export with the client live; the client clicks; the export lands in our shared drive. Credentials never leave the client's screen.
3. **Escrow via the contract-bound vault.** Tracked in [issue #121](https://github.com/palimkarakshay/lumivara-site/issues/121). Until that vault exists, escalation 3 is "decline the engagement" rather than "share credentials over Slack."

### 5.2 — Client doesn't own the domain

The previous agency or a since-departed contractor holds the registrar account. Three steps:

1. **Domain-recovery checklist.** ICANN's "lost domain" recovery template via the registrar's support; client must initiate.
2. **WHOIS evidence.** If the client's name + business address are still on the public WHOIS record, escalate to the registrar's business-recovery process.
3. **New domain + 301.** If recovery fails inside 30 days, recommend a new domain (e.g. `<client>app.com`, `get<client>.com`). The redirect plan in §3.4 still applies — every legacy URL with traffic 301s to the new host. The cost: a 4–6 week SEO dip while Google reindexes the new authority.

### 5.3 — Legacy site has paid third-party widgets we cannot replicate

A booking system the client likes, an embeddable calculator only the legacy vendor provides, a niche industry directory plugin. Three options:

- **Keep on legacy (Path A).** Default for sentimental attachment.
- **Buy our own subscription, bill it back.** Rare and only when the widget's API exposes everything we need; we re-ship it inside the new site and pass the cost through with a 10–15% admin margin.
- **Quote replacement scope.** A custom booking flow / calculator / directory built into the new site. Scope it as a Tier-2/Tier-3 add-on, see [`02-pricing-tiers.md`](./02-pricing-tiers.md) "Add-ons."

### 5.4 — Mid-migration client refusal

The client signed Path B, the staging site is up, but a stakeholder kills the migration before DNS cutover. Defined rollback:

1. **Revert DNS preparation.** TTL back to its prior value; remove staging subdomain.
2. **Retain the content export.** The client owns it; we keep a copy in the engagement archive for 90 days in case they reverse the decision.
3. **End the engagement** per the termination clause tracked in [issue #121](https://github.com/palimkarakshay/lumivara-site/issues/121). The setup fee is non-refundable past the staging milestone.

### 5.5 — Partial migration that becomes hybrid by accident

The most common drift. Client agreed Path B, but after staging they say "actually, can we keep the team page on Squarespace, it has that nice gallery widget?" Decision rule: **no quiet hybrids**. Either:

- The team page migrates as planned and we replicate the gallery (Tier-2 add-on, scope it). **Or:**
- The contract amends to Hybrid (per §4); the operator and client re-sign with the boundary table filled in. The amendment is non-trivial paperwork — that's the friction by design, so the path is chosen, not slid into.

---

## §6 — Sales-conversation script

Three short prompts the operator uses in the **first 15 minutes** of a discovery call to triage a prospect into Path A / Path B / Hybrid.

### Prompt 1 — "Tell me about your current site"

Listen for:

- **Pride / comfort** ("we love it, it took us forever") → Path A.
- **Frustration** ("I can't update it without calling the agency", "the editor is awful") → Path B.
- **Indifference** ("it's fine, I guess") → Path B (indifference is decay; they'll thank you later).

### Prompt 2 — "What's the one thing you can't do today that you wish you could?"

Listen for:

- **A new capability** (chatbot, booking, AI page, mobile edits) → Path A is on the table.
- **"Make it not look like 2018"** → Path B.
- **"Stop paying $300 per typo fix"** → Path B (the bill is the friction, not the design).

### Prompt 3 — "Walk me through your domain"

Listen for:

- "I bought it on GoDaddy in 2014 and I have the login" → easy. Either path works.
- "My nephew set it up" → §5.2 territory; surface the risk now.
- "I'm not sure where it is" → schedule a 15-minute follow-up just to find the registrar before quoting anything.

After these three prompts, route to one of:

- **Path A** if comfort + new capability + clean domain.
- **Path B** if frustration + bill-driven friction + clean domain.
- **Hybrid** if comfort on one piece + frustration on another + clean domain.
- **No quote yet** if the domain story is unclear — finish §5.2 before discussing tiers.

Tier mapping references [`01-gig-profile.md`](./01-gig-profile.md) and [`02-pricing-tiers.md`](./02-pricing-tiers.md). Path doesn't change the tier; the tier is set by what the client wants the live site to *do*, not by where they came from.

---

## §7 — Decision matrix

A single table mapping {client signal} → {recommended path}. Use this as the cheat-sheet at the bottom of a discovery call.

| Client signal | Recommended path |
|---|---|
| "Happy with the site, just want a chatbot / booking / phone-edits" | **Path A** |
| "Happy with the site, but the platform forbids the script we need" | **Path A on a subdomain only** (no injection) |
| "Frustrated with the platform, every change is a fight" | **Path B** |
| "Bill is too high for what we get" | **Path B** if the math beats `02-pricing-tiers.md`; otherwise Path A |
| "Brand is changing, need a new look" | **Path B** |
| "Domain ownership unclear" | **No quote** — close §5.2 first |
| "We have a paid widget we can't lose" | **Hybrid** (or Path A if the widget is the whole site) |
| "We need to keep one section on the old platform for political reasons" | **Hybrid** with a §4 boundary table in the proposal |
| "We're not sure" | **Path B** by default — indifference is decay; the retainer pays back faster on a fresh build |
| "We don't have a site yet" | **Not a migration** — route to a new-build engagement |

---

## §8 — Open questions

Items the operator owes a future answer but does not block the doc from being useful.

- **Insurance for content loss during migration.** Whose policy covers a botched DNS cutover that loses two weeks of bookings? Today: ours, informally. Future: rider on the practice's E&O insurance, scoped to the migration window. Tracked under the legal/insurance work in `docs/mothership/08-future-work.md`.
- **Multi-locale clients.** Path B's IA mapping is monolingual. If the client has `/en/` and `/fr/` (or hreflang variants), the redirect map doubles and the SEO snapshot needs per-locale rank reports. Spec a hreflang appendix when the first multi-locale client lands.
- **Ecommerce migrations specifically.** PCI scope changes when payment processing moves between hosts (Shopify → Stripe Checkout, WooCommerce → custom Stripe). The redirect plan extends to product URLs but the *checkout* migration is not covered here. Decide before quoting an ecommerce migration whether it's in scope or referred out.
- **Time-to-quote.** The discovery → proposal cycle for Path B is currently bespoke. A templated proposal that the operator fills in §1's catalog row + §3's per-step estimate would compress the quote time. Tracked in the wiki backlog rather than this doc.

---

*Last updated: 2026-04-29.*
