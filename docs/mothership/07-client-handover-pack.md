<!-- OPERATOR-SIDE TEMPLATE — render per-client before sending. -->
<!-- After rendering, the resulting file is the ONLY mothership-derived
     artefact that ever leaves the operator's hands. -->

# 07 — Client Handover Pack (Template + Dummy Intakes)

This is the template the operator renders, per engagement, into the **client's repo** as `docs/CLIENT_HANDOVER.md`. It contains:

1. The plain-English handover guide — what the client just received, how to use it, what they own, how to reach the operator.
2. Six dummy clients with **pre-filled intake forms** so the operator (and any future Claude session) has worked examples to copy from.

> **Rendering convention:** every `{{...}}` placeholder maps to a key in `docs/clients/<slug>/intake.md`. Use a single `pnpm dlx mustache intake.json 07-client-handover-pack.md > clients/<slug>/handover.md` to render.

> **Pre-handover gate (Lumivara People Advisory).** Before rendering this pack for *Lumivara People Advisory*, the spinout runbook in [`docs/migrations/lumivara-people-advisory-spinout.md`](../migrations/lumivara-people-advisory-spinout.md) must have all phase acceptance boxes checked (§9 A1, A2, A3 — including `dual-lane-enforcement-checklist.md §5` post-migration verifications). For all *future* Tier 0/1/2 clients, fork that runbook into `docs/migrations/<client-slug>-spinout.md`, walk it end-to-end, and gate this rendering on its acceptance set. The §8 per-engagement validation checklist below is the *post-render* gate; the spinout runbook's §9 is the *pre-render* gate.

---

## §1 — Welcome (rendered per client)

> Welcome, **{{CLIENT_NAME}}** — your new website is live at **{{DOMAIN}}**.
>
> This guide is everything you need to use it. It's short on purpose. If you ever need more, my number and email are at the bottom of this page; I'll always reply within {{SLA_HOURS}} business hours.

---

## §2 — What you own (rendered per client)

You own everything. Specifically:

| Asset | Where it lives | How to get to it |
|---|---|---|
| Your domain `{{DOMAIN}}` | Registered to **{{CLIENT_LEGAL_NAME}}** at **{{REGISTRAR}}** | Sign in at {{REGISTRAR_URL}} with the email **{{CLIENT_PRIMARY_EMAIL}}**. Password-reset link will work. |
| Your website code | GitHub repo `palimkarakshay/{{CLIENT_SLUG}}-site` (will be transferred to your account at the end of our engagement) | github.com/{{CLIENT_GITHUB_USER_OR_PLACEHOLDER}} once transferred |
| Your hosting | Vercel project `{{CLIENT_SLUG}}` (will be transferred to your Vercel team at the end of our engagement) | vercel.com once transferred |
| Your content | All editable text lives in `src/content/` of the repo, plus any blog articles you submit through the phone shortcut |
| Your email inbox for the contact form | `{{CONTACT_EMAIL}}` — replies go straight to you |

If you ever decide to leave, you keep all of the above. **There is nothing for you to "take back" — it was always yours.** I am the builder; you are the owner.

---

## §3 — How to edit your site (the phone shortcut)

You have three ways to send a change request. **Use whichever is easiest for you in the moment.**

### Web (recommended for desktop-first edits)
1. Go to **{{DOMAIN}}/admin** on any browser.
2. Sign in with **{{CLIENT_PRIMARY_EMAIL}}** (we'll email you a one-time link — no password to remember).
3. Tap **New idea**, type your change, tap Submit.

### Email (recommended for "while I'm reading email anyway")
1. Send an email to **requests@{{DOMAIN}}** from **{{CLIENT_PRIMARY_EMAIL}}**.
2. Subject = a short title; body = the details.
3. You'll get an auto-reply with a magic link to track progress.

### SMS (recommended for "I'm walking and just remembered")
1. Text **{{TWILIO_INBOUND_NUMBER}}** from **{{CLIENT_PRIMARY_PHONE}}**.
2. Just type the change in plain English.
3. You'll get a reply with a magic link.

In all three lanes, within a few hours you'll get a notification that says **"Preview ready — tap to view"**. Tap it, look at the change on a copy of your site, then tap **Confirm Deploy**. The change goes live. **Nothing publishes without your tap.**

---

## §4 — What the bot will and won't do

**Will:** typo fixes, copy edits, new pages, new sections, new blog posts, image swaps, link updates, button colour changes, layout tweaks, simple form changes, simple SEO tweaks, accessibility fixes.

**Won't (without explicit operator review):** changes to your domain, your hosting, your contact email, your privacy policy, anything that touches money (prices on a checkout page, Stripe links), or anything that looks like a security setting. If you submit one of those, you'll see a status of *"Need a quick chat"* and I'll get a notification.

---

## §5 — Your monthly subscription (Tier {{TIER}})

You are on **Tier {{TIER}} — {{TIER_NAME}}**, which means:

- **{{INCLUDED_EDITS}}** phone edits per month.
- **{{IMPROVEMENT_RUN_CADENCE}}** improvement run.
- **{{SLA_HOURS}}-hour** response on questions.
- Cancel any time with 30 days' notice. You keep the site, the domain, the hosting; the phone-edit pipeline stops accepting requests after the cancellation date.

---

## §6 — Reach me

- Email: **{{OPERATOR_EMAIL}}** — I read this on weekdays only; replies within {{SLA_HOURS}} business hours.
- For urgent issues only (your site is down): **{{OPERATOR_URGENT_PHONE}}** — text only, please.
- I'm based in **Toronto, ET**. Office hours 9–6 weekdays.

---

## §7 — Glossary (because you'll see these words eventually)

| Word | What it means for you |
|---|---|
| Issue | A change request you've submitted |
| PR / Pull Request | A drafted version of your change, waiting for your tap to publish |
| Preview | A copy of your site with the change applied — visible before the public sees it |
| Deploy | The act of publishing a preview to the live site |
| Cron | A schedule that says "check for new requests every X minutes" |

You don't need to know any of this to use the site. It's only here so you don't get confused if the auto-reply emails use these words.

---

# Operator-side dummy intake forms

Below are six fully filled-in intake forms — one per dummy client in the operator's roster. Treat these as *worked examples*. When a real client returns the intake form, copy the closest match below into `docs/clients/<slug>/intake.md` and edit.

> The intake form structure is a stable schema; the rendering of `§1`–`§6` above keys off these field names.

---

## Dummy A — Lumivara People Advisory (Beas Banerjee) — Tier 2

```yaml
client_slug: lumivara-people-advisory
client_name: Lumivara People Advisory
client_legal_name: 1234567 Ontario Inc. (operating as Lumivara People Advisory)
client_descriptor: HR & people-strategy consulting practice
client_location: Toronto, Ontario
client_primary_email: hello@lumivara.ca
client_primary_phone: "+1 416 555 0142"
domain: lumivara.ca
tier: 2
tier_name: Autopilot Pro
included_edits: Unlimited (fair-use cap 30/month)
improvement_run_cadence: Monthly
sla_hours: 4
page_list:
  - home
  - how-we-work
  - what-we-do (services hub + 6 service pages)
  - fractional-hr
  - career-coaching
  - insights (MDX)
  - about
  - contact
  - privacy
voice_adjectives: warm, candid, expert
mood_adjectives: parchment, amber, serif-led
primary_cta: Book a discovery call
cal_link: https://cal.com/lumivara/discovery
contact_email: hello@lumivara.ca
twilio_inbound_number: "+1 437 555 0102"
operator_email: hello@{{BRAND_SLUG}}.com
operator_urgent_phone: "+1 647 555 0199"
registrar: Cloudflare
registrar_url: https://dash.cloudflare.com
notes:
  - Beas does most submissions by SMS while commuting.
  - Beas wants quarterly content sprints (3-5 MDX articles per quarter).
  - Privacy clause must reference PIPEDA explicitly.
```

---

## Dummy B — John's Plumbing — Tier 1

```yaml
client_slug: johns-plumbing
client_name: John's Plumbing
client_legal_name: John Patel Plumbing Inc.
client_descriptor: residential & light-commercial plumbing contractor
client_location: Mississauga, Ontario
client_primary_email: john@johnsplumbing.ca
client_primary_phone: "+1 905 555 0188"
domain: johnsplumbing.ca
tier: 1
tier_name: Autopilot Lite
included_edits: 5 per month (rolls over once; max 10 banked)
improvement_run_cadence: Quarterly
sla_hours: 8
page_list:
  - home
  - services
  - service-areas
  - emergency-callout
  - testimonials
  - contact
  - privacy
voice_adjectives: friendly, no-nonsense, local
mood_adjectives: navy, white, photo-led
primary_cta: Book an emergency callout
cal_link: ""
contact_email: john@johnsplumbing.ca
twilio_inbound_number: "+1 905 555 0203"
operator_email: hello@{{BRAND_SLUG}}.com
operator_urgent_phone: "+1 647 555 0199"
registrar: GoDaddy
registrar_url: https://godaddy.com
integrations:
  - Calendly (replace Cal.com)
  - Google Reviews widget on homepage
notes:
  - John submits via web (he's not a texter).
  - Cash flow is seasonal — autopay subscription must allow Jan/Feb pause.
  - Phone number is the primary CTA; Cal.com isn't a fit.
```

---

## Dummy C — Viktor — Lawyer — Tier 2

```yaml
client_slug: viktor-law
client_name: Viktor Mihailovic Law
client_legal_name: V. Mihailovic Professional Corporation
client_descriptor: solo immigration & corporate law practice
client_location: Toronto, Ontario
client_primary_email: viktor@viktorlaw.ca
client_primary_phone: "+1 416 555 0177"
domain: viktorlaw.ca
tier: 2
tier_name: Autopilot Pro
included_edits: Unlimited (fair-use cap 30/month)
improvement_run_cadence: Monthly
sla_hours: 4
page_list:
  - home
  - practice-areas
  - immigration (subpage)
  - corporate (subpage)
  - about
  - insights (MDX)
  - book-consultation
  - contact
  - privacy
  - disclaimers
voice_adjectives: precise, calm, authoritative
mood_adjectives: ink, ivory, serif-only
primary_cta: Book a consultation
cal_link: https://cal.com/viktor-law/consult
contact_email: viktor@viktorlaw.ca
twilio_inbound_number: "+1 416 555 0211"
operator_email: hello@{{BRAND_SLUG}}.com
operator_urgent_phone: "+1 647 555 0199"
registrar: Hover
registrar_url: https://hover.com
notes:
  - Compliance: Law Society of Ontario requires explicit "Not legal advice" footer on every public page.
  - Privacy: PIPEDA + Solicitor-Client privilege language reviewed by Viktor before publish.
  - Bilingual EN/FR site requested in month 3 (book the deep-research workflow for translation).
```

---

## Dummy D — Head-Hunter Talent — Tier 2

```yaml
client_slug: head-hunter-talent
client_name: Head-Hunter Talent
client_legal_name: Head-Hunter Talent Partners Ltd.
client_descriptor: tech-recruiting boutique (3 partners + 4 staff)
client_location: Toronto, Ontario
client_primary_email: hello@headhuntertalent.com
client_primary_phone: "+1 416 555 0166"
domain: headhuntertalent.com
tier: 2
tier_name: Autopilot Pro
included_edits: Unlimited
improvement_run_cadence: Monthly
sla_hours: 4
page_list:
  - home
  - for-companies
  - for-candidates
  - open-roles (dynamic; pulls from Greenhouse via API)
  - case-studies
  - team
  - insights (MDX)
  - contact
  - privacy
voice_adjectives: confident, candid, conversational
mood_adjectives: charcoal, electric-orange, photo-led
primary_cta: Book a hiring strategy call
cal_link: https://cal.com/headhunter/strategy
contact_email: hello@headhuntertalent.com
twilio_inbound_number: "+1 416 555 0234"
operator_email: hello@{{BRAND_SLUG}}.com
operator_urgent_phone: "+1 647 555 0199"
registrar: Cloudflare
registrar_url: https://dash.cloudflare.com
integrations:
  - Greenhouse Job Board API (open-roles page)
  - LinkedIn Insights tag
  - Slack notifications when a contact form submits
notes:
  - Three partners share /admin access — add all three to admin-allowlist.
  - Open-roles page must invalidate cache on Greenhouse webhook.
```

---

## Dummy E — Rose Restaurant — Tier 1

```yaml
client_slug: rose-restaurant
client_name: Rose Restaurant
client_legal_name: Rose Hospitality Group Inc.
client_descriptor: neighbourhood Italian restaurant, 60 seats
client_location: Toronto, Ontario (Leslieville)
client_primary_email: hello@roseto.ca
client_primary_phone: "+1 416 555 0155"
domain: roseto.ca
tier: 1
tier_name: Autopilot Lite
included_edits: 5 per month
improvement_run_cadence: Quarterly
sla_hours: 8
page_list:
  - home
  - menu (PDF + structured)
  - reservations (OpenTable embed)
  - private-events
  - press
  - contact
  - privacy
voice_adjectives: warm, lively, neighbourhood
mood_adjectives: oxblood, cream, food-photography-led
primary_cta: Book a table
cal_link: ""  # OpenTable embed instead
contact_email: hello@roseto.ca
twilio_inbound_number: "+1 416 555 0245"
operator_email: hello@{{BRAND_SLUG}}.com
operator_urgent_phone: "+1 647 555 0199"
registrar: Namecheap
registrar_url: https://namecheap.com
integrations:
  - OpenTable widget on /reservations
  - Instagram feed embed on home
notes:
  - Manager submits via web during inventory hours; chef submits via SMS at midnight.
  - Menu PDF is updated weekly — autopilot should accept "replace menu PDF" requests.
```

---

## Dummy F — Jimmy Barber — Tier 0

```yaml
client_slug: jimmy-barber
client_name: Jimmy's Barber Shop
client_legal_name: James Singh (sole proprietor)
client_descriptor: 2-chair barbershop with online booking
client_location: Brampton, Ontario
client_primary_email: jimmy@jimmybarber.ca
client_primary_phone: "+1 416 555 0144"
domain: jimmybarber.ca
tier: 0
tier_name: Launch
included_edits: 0 (no autopilot — billed per change)
improvement_run_cadence: None
sla_hours: 24
page_list:
  - home
  - services
  - book-online (Square Appointments embed)
  - contact
  - privacy
voice_adjectives: chill, classic, neighbourhood
mood_adjectives: black-and-gold, photo-led
primary_cta: Book a chair
cal_link: ""  # Square Appointments instead
contact_email: jimmy@jimmybarber.ca
twilio_inbound_number: ""  # T0 — no Twilio number
operator_email: hello@{{BRAND_SLUG}}.com
operator_urgent_phone: ""  # T0 — no urgent line
registrar: Google Domains (migrating to Squarespace Domains)
registrar_url: https://domains.google.com
notes:
  - T0 — no admin portal; Jimmy emails the operator with a change request,
    operator does it manually, charges $90 per change.
  - Footer credit "Forged by Lumivara" is mandatory.
  - Upsell to T1 in month 6 if Jimmy submits ≥ 3 changes in any quarter.
```

---

# §8 — Per-engagement validation checklist

Before sending the rendered handover pack, the operator confirms:

- [ ] Every `{{...}}` placeholder is filled in (run `grep '{{' clients/<slug>/handover.md` — should return nothing).
- [ ] The intake YAML has a real registrar + URL (not a placeholder).
- [ ] T1+ has a working Twilio number; T2+ has Resend sub-domain or shared `mail.{{BRAND_SLUG}}.com`.
- [ ] T3 sites do **not** include the footer credit; T0/1/2 do.
- [ ] The handover guide does **not** mention GitHub, Vercel, n8n, Twilio, or any operator-side tool by name.
- [ ] The walkthrough video URL is filled in.
- [ ] The handover file is committed only to the client's site-repo `main` (never to the pipeline repo, never to mothership). Under Dual-Lane Repo the site repo is the only repo the client ever sees — see `02b`.

The render → validate → commit → email cycle takes ~10 minutes per client when the intake YAML is complete. If any field is missing, the operator follows up with the client before rendering.

*Last updated: 2026-04-28.*
