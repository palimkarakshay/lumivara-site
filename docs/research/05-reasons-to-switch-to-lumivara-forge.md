<!-- The "why switch" pack used in client-facing decks. -->

# 05 — Reasons to Switch to Lumivara Forge

The seven empirically grounded reasons a prospect should switch from their current alternative. Each reason names the alternative, the pain it produces, the dollar/time arbitrage, and the source row in `03-source-bibliography.md`.

> **Use of this doc.** This is the cheat-sheet behind every "why now" slide in the client-facing decks. Pick the 2–3 reasons that match the persona — never use all seven in one deck.

---

## R1 — Stop the silent decay

**You are switching from.** A site built 2–6 years ago by an agency or a freelance friend who is no longer responsive.

**The pain.** 75% of consumers have abandoned a purchase or inquiry because of an outdated/unprofessional website (`[V] §B-Outdated-75`). 71% of consumers can spot a DIY site at first click (same source). 60% of SMB sites are classified as outdated (`[S] §B-SMB-Web-State`). Your site quietly costs you customers every week.

**The arbitrage.** Phone-edit pipeline turns a $200 invoice + 2-week wait into a 30-second tap-to-publish loop. A typo gets fixed in the time it takes to text a colleague.

**Best for personas.** P1, P2, P3.

---

## R2 — Stop paying $200 per typo

**You are switching from.** A traditional boutique agency on a per-edit billing model.

**The pain.** Boutique agencies typically bill $75–$150/hr for edits with a $6k–$12k upfront build (`[S] §B-Boutique-Agency`). After launch, every "update the price on this page" is a custom invoice. Over 24 months on an active small business, total spend is $15,000–$30,000+ (`docs/freelance/04-slide-deck.md` cost table).

**The arbitrage.** Tier 2 is CAD $4,500 setup + $249/mo = CAD $7,488 over 24 months. Cheaper *and* the site improves monthly instead of decaying. Lumivara Forge's published flat-fee subscription replaces the volatile invoice stream entirely.

**Best for personas.** P1, P2, P3.

---

## R3 — Stop being your own webmaster

**You are switching from.** A DIY builder (Squarespace / Wix / Hostinger).

**The pain.** Squarespace/Wix runs $17–$139/mo (`[V] §B-Wix-Squarespace`) — cheap on paper, but the labour burden is on the owner, and 71% of consumers still spot the result as a DIY site at first click (`[V] §B-Outdated-75`). Owner time is the hidden line item.

**The arbitrage.** Lumivara Forge buys back ~2.5 hours/month of operator time for the client (`docs/mothership/18 §4`) — those are the hours they were spending fighting the WYSIWYG editor and breaking responsive layouts. Plus the result *doesn't* read as a DIY.

**Best for personas.** P1, E1.

---

## R4 — Cap the legal-liability surface

**You are switching from.** Any non-compliant site, especially anything WordPress-based without active maintenance.

**The pain.** 3,117 federal-court website-accessibility lawsuits in 2025, +27% YoY (`[V] §B-ADA-Lawsuits`). 95.9% of WebAIM Million home pages had detected WCAG failures in 2024, average 56.8 errors/page (`[V] §B-WebAIM`). For a regulated practice (medical, dental, legal) this is a real liability surface, not theoretical.

**The arbitrage.** Lumivara Forge runs Lighthouse + axe-core in CI on every change; if accessibility regresses, the build fails before publish. Compliance becomes a property of the system, not a discretionary item.

**Best for personas.** P2 (medical/dental clinics in jurisdictions with provincial accessibility laws), P1 (law firms).

---

## R5 — Own everything you paid for

**You are switching from.** Anything that holds your content hostage — DIY builders (export pain), Webflow (proprietary), agency-hosted accounts.

**The pain.** Vendor lock-in is the historic agency-client grievance. Migration off a Squarespace account is painful; off a custom CMS hosted in the agency's account is worse.

**The arbitrage.** Pattern C (`docs/mothership/02b-pattern-c-architecture.md`) puts the domain, the code, and the hosting account in the client's name from day one. If they cancel, they keep the running site. The autopilot stops; nothing else changes.

**Best for personas.** P1, P2, P3, E1.

---

## R6 — Get DesignJoy-class agility at maintenance-tier prices

**You are switching from.** Either WP Buffs–style monthly maintenance ($79–$447/mo, `[V] §B-WP-Buffs`) — which keeps WordPress on life support — or DesignJoy–style design subscriptions ($4,995/mo Standard or $7,995/mo Pro + $999/mo Webflow add-on, `[V] §B-DesignJoy`) — which are out of reach.

**The pain.** WP Buffs gives you peace of mind on a decaying architecture. DesignJoy gives you agility on someone else's stack at a startup-marketing-team price point.

**The arbitrage.** Lumivara Forge T2 at CAD $249/mo delivers agency-tier custom build + unlimited phone-edit cadence for less than WP Buffs' Perform plan ($219 USD/mo) and ~5% of DesignJoy's headline rate.

**Best for personas.** P3, sometimes P1.

---

## R7 — Get a real codebase, not a templated rental

**You are switching from.** A drag-and-drop builder (Squarespace, Wix, Webflow) — even at the high-end Webflow tier where you "feel" you have ownership.

**The pain.** Drag-and-drop builders constrain layout, performance, and integration choices. A Webflow site cannot be hosted independently of Webflow without a re-platform. Headless / static architectures deliver 50%–70% faster load times (`[S] §B-Headless-Perf`); only 36% of WordPress sites pass mobile Core Web Vitals (`[S] §B-WP-CWV`).

**The arbitrage.** Lumivara Forge delivers a real Next.js codebase in the client's GitHub account, hosted on Vercel in the client's name. Performance and ownership are properties of the architecture, not of the vendor.

**Best for personas.** E1, P3, sometimes P1 (where engineering credibility matters in pitches).

---

## Selection guide for client-deck authors

| If the persona is… | Lead with reasons | Then footnote |
|---|---|---|
| P1 — solo lawyer / consultant | R1, R2, R4 | R5 |
| P2 — health practice | R1, R4, R3 | R5 |
| P3 — boutique services firm | R6, R7, R2 | R1 |
| E1 — indie SaaS founder | R7, R5 | R3 |

Never use all seven. The deck collapses if it tries to.

---

*Last updated: 2026-04-29.*
