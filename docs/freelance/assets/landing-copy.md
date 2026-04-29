# Landing-page copy — Lumivara Forge

> **DRAFT — pending operator approval (issue #115).** This is the first-pass
> landing copy for whichever surface the Forge brand eventually lives on
> (a `/forge` route on lumivara.com, a separate microsite, or a Fiverr / Upwork
> profile spelled out long-form). It is **not yet wired into `src/`** — site
> integration is a downstream issue.
>
> Tone reference: this site's existing People Advisory copy
> (`src/content/home.ts` — "Bring clarity to complex people problems.") and
> `01-gig-profile.md` Part 4 ("About me"). Calm, plain-English, outcome-led,
> no jargon. **Never** name the stack.

---

## Hero

**Mono label (above headline):** `Lumivara Forge`

**Headline:**

> A website that maintains itself.

**Subhead:**

> I build clean, fast small-business websites that you edit from your phone —
> and a small monthly fee keeps yours improving in the background. No
> developer phone calls. No surprise invoices. You own everything.

**Primary CTA:** `Book a 15-min walkthrough` → `/contact?source=forge-hero`
**Secondary CTA:** `See the live demo` → `https://lumivara.com`

**Proof line (under CTAs):**

> *Built and run on the exact system this site uses. Live at lumivara.com.*

---

## Three "what you get" benefits

Render as a three-up grid. Title, one-paragraph body, no icons (icons read as
templated; we lead with words).

### 1 · Edit it from your phone

Tap a shortcut. Type the change you want. A few hours later, a notification
arrives — *preview ready*. You tap it, see the change applied, tap publish.
Your laptop was off the entire time. Source: `01-gig-profile.md` Part 2,
Service B.

### 2 · A flat fee that bakes in improvements

Every month, small wins ship without you asking — loading speed, accessibility
fixes, SEO polish, anything you flagged. One predictable subscription replaces
the $200-per-edit invoices most agencies bill. Source: `01-gig-profile.md`
Part 2, Service C; comparison numbers from `06-positioning-slide-deck.md`
§ "The 24-month cost story".

### 3 · You own it outright

Your code, your domain, your hosting account — all in your name from day one.
If you ever want to leave, you take everything. The autopilot is the only
thing that stops; the site stays yours. Source: `01-gig-profile.md` Part 6 FAQ
("Who owns the site after we're done?").

---

## Social proof slot

> Reserve a single quote slot here. **Do not ship placeholder testimonials.**
> Until the first paying client gives written permission, fill this slot with
> the operator's own line about lumivara.com:
>
> > *"This site you're reading is built and run on the same system. The proof
> > is the website itself — every change you'll see ship here, ships through
> > the autopilot."*
> >
> > — Akshay, operator, Lumivara Forge
>
> Replace with a real client quote in W5–W8 once the first delivery is live
> and a testimonial has been requested per the calendar in
> `07-marketing-strategy.md`.

---

## FAQ teaser (3 questions max above the fold; full FAQ below or on its own page)

Pull verbatim from `01-gig-profile.md` Part 6. Suggested three for the teaser:

1. **What if I'm not technical at all?** You don't need to be. The phone-edit shortcut is one tap, one short sentence, one notification, one publish tap. We send a personalised walkthrough video on hand-over.
2. **Who owns the site if we ever stop working together?** You do — completely. Code, domain, hosting account all in your name on day one. The autopilot stops; the site stays.
3. **What does the monthly subscription actually cover?** Phone-edit pipeline kept running, monthly improvement run (3–5 small upgrades I've spotted on your site), priority response on questions, quarterly check-in on where the site goes next. No surprise add-ons.

**Link to full FAQ:** `01-gig-profile.md` Part 6 — port to a proper `/forge/faq`
page when the route ships.

---

## Closing CTA section

**Section heading:** `Ready to stop calling a developer for typos?`

**Body (one short paragraph):**

> Most small-business websites die a slow death because every tiny edit needs
> a developer. Yours won't. Book a 15-minute walkthrough and I'll show you the
> phone-edit shortcut on a real site — this one — and we'll talk about whether
> it's a fit for yours.

**Primary CTA:** `Book a 15-min walkthrough` → `/contact?source=forge-final`
**Secondary text link:** `Or email akshay@{{OPERATOR_EMAIL_DOMAIN}}` *(operator
fills in the working address before this ships)*

---

## Tone + style notes for whoever wires this into the site

- **Headline font** matches the existing `Fraunces` serif used on lumivara.com
  (see `src/content/home.ts` and `06-positioning-slide-deck.md` style block).
- **No emoji.** No icons in the benefits grid (icons read as templated).
- **No price on the landing page.** Pricing lives behind the discovery call;
  the page invites the call. Rationale: `02-pricing-tiers.md` § "How to handle
  the price objection" — price is a reframing conversation, not a sticker.
- **Single CTA pair, repeated.** Hero + closing both point at "book a
  15-minute walkthrough." Don't proliferate CTAs; the page exists to drive one
  action.
- **Lighthouse target:** 90+ on every metric (mobile + desktop). Already the
  baseline per `01-gig-profile.md` Part 4.
- **Accessibility:** WCAG AA on contrast and tap targets. Real text, no text-in-images.

---

*Last updated: 2026-04-29. Status: DRAFT — wiring into `src/` is a separate issue.*
