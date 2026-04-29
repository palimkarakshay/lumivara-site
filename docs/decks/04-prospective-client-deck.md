---
marp: true
theme: default
paginate: true
size: 16:9
backgroundColor: '#fafaf7'
color: '#1f1f1f'
style: |
  section { font-family: 'Inter', system-ui, sans-serif; padding: 60px 80px; }
  h1 { color: #1f1f1f; font-family: 'Fraunces', Georgia, serif; font-size: 2.4em; }
  h2 { color: #1f1f1f; font-family: 'Fraunces', Georgia, serif; }
  h3 { color: #b48a3c; }
  strong { color: #b48a3c; }
  blockquote { border-left: 4px solid #b48a3c; color: #555; font-style: italic; }
  table { font-size: 0.85em; }
  code { background: #f0ece2; padding: 2px 6px; border-radius: 3px; }
  .small { font-size: 0.78em; color: #666; }
  .footnote { font-size: 0.72em; color: #888; }
---

<!-- _class: lead -->

# A website that<br/>**maintains itself.**

For solo professionals, health practices, and boutique firms who don't want to call a developer for a typo.

<br/>

*Persona-tailored — see persona block below before sending.*

<span class="small">Headline stats are independently verified at primary sources. Source detail in `docs/research/03-source-bibliography.md`.</span>

---

<!--
PERSONA BLOCK — fill in before sending. Three persona variants from
docs/research/04-client-personas.md:

  P1 — Premium solo professional (lawyer / coach / HR consultant) -> T2
  P2 — Local health practice (dental / physio / clinic)            -> T2/T3
  P3 — Boutique services firm (5-25 staff)                          -> T3

For each variant, swap:
- the title-slide subtitle to match the persona
- the ROI-math slide to match the persona's budget band
- the "why switch" slide to lead with the 2-3 reasons that match
  (selection guide in docs/research/05-reasons-to-switch §end)

Default below: P1 / P2 hybrid. For E1 (indie SaaS founder) use the
existing docs/freelance/04-slide-deck.md instead.
-->

## Why this is happening *now* (3 numbers)

| What | Number | Source |
|---|---|---|
| Consumers who've abandoned a purchase / inquiry due to an outdated website | **75%** | HostingAdvice 2024 / PRNewswire |
| Federal-court ADA-website lawsuits filed in 2025 (+27% YoY) | **3,117** | Seyfarth Shaw / ADA Title III |
| Top-1M home pages with detected accessibility failures (2024) | **95.9%** (avg 56.8 errors / page) | WebAIM Million 2024 |

Every one of these lands on the small business — not on the developer who built the site. The "I'll fix it later" path is statistically the path everyone is on. We do "fix it now."

---

## What you actually get

Three things, bundled:

- **A real Next.js website** in your branding, hosted on Vercel, in your name. Mobile-first, fast, accessible by default.
- **A phone-edit pipeline.** You text or tap a change → an AI assistant prepares it on a preview link → you tap publish. The laptop stays closed.
- **A monthly improvement run.** We ship 3 – 5 small wins each month — loading speed, accessibility fixes, SEO polish, content freshness. You don't have to ask for them.

You own the code. You own the domain. You own the hosting account. From day one.

---

## How it works (in 30 seconds)

1. **You think of a change.** Anywhere, any time. *"Update the price on the consulting page to $300."*
2. **You tap a shortcut on your phone** and type the change.
3. **A few hours later, you get a notification** — *"Preview ready."* You tap the link, see the change applied to a copy of your site.
4. **You tap publish.** The change is live.

Your laptop was off the entire time. We built it. You own it.

---

## What you won't have to do

- **You won't manage hosting.** Vercel does. It's automatic.
- **You won't manage uptime.** Vercel handles 99.99%+ availability.
- **You won't manage backups.** Every change is in version history; rolling back is one click.
- **You won't manage security patches.** They flow through automatically as part of the monthly improvement run.
- **You won't manage SEO upkeep.** It's part of the system, not an upsell.
- **You won't manage your developer's calendar.** The system replaces 80% of what an in-house developer would do for a small business.

---

## What it costs vs. the alternatives

|   | DIY builder | Boutique agency | DesignJoy-class subscription | WP Buffs maintenance | **Lumivara Forge T2** |
|---|---|---|---|---|---|
| Initial build | included | $6,000 – $12,000 | included | not included | CAD $4,500 |
| Each edit after launch | owner's time | $75 – $150 / hr | unlimited (in queue) | basic edits only | included |
| Time per edit | minutes (owner) | 1 – 3 weeks | 48 h | 1 – 5 days | 1 – 4 hours |
| Monthly fee | $17 – $139 | $50 – $250 | $4,995 – $7,995 | $79 – $447 | CAD $249 |
| **24-month all-in (active SMB)** | $400 – $3,300 + your time | **$15,000 – $30,000+** | **$120,000+** | $1,900 – $10,700 | **CAD $7,488** |

All competitor pricing re-verified at the vendor pages on 2026-04-29. Source rows: `docs/research/03 §B-Wix-Squarespace`, `§B-Boutique-Agency`, `§B-DesignJoy`, `§B-WP-Buffs`.

---

## Why switch to Lumivara Forge

(Persona-tailored. The default below is the **professional-services persona**. For health-practice variants, swap reasons 1 / 2 to lead with compliance and mobile-first.)

1. **Stop the silent decay.** 75% of consumers have abandoned a site that looked outdated. Your phone-edit pipeline turns the "next quarter" task into a 30-second tap.
2. **Stop paying $200 per typo.** Boutique agencies bill $75 – $150 per hour for edits. Over 24 months on an active site, that's $15,000 – $30,000+. Our flat fee is $7,488 over 24 months. Same caliber of build; cheaper, predictable, monthly improvements baked in.
3. **Cap the legal-liability surface.** ADA-website lawsuits are up 27% year over year. Our CI gates run accessibility checks on every change before publish — the most common WCAG failures simply cannot be shipped.

Full why-switch pack with persona-specific selections in `docs/research/05-reasons-to-switch-to-lumivara-forge.md`.

---

## ROI math — the legal / consulting persona

If you're a **boutique law firm or solo consultant**:

- You likely spend **$120,000 – $150,000 per year on SEO marketing alone** (industry benchmark: First Page Sage 2024, `[V] §B-Law-Firm-Spend`).
- **96%** of legal-services clients begin their search at a search engine. An outdated, slow, or non-compliant site disqualifies you before the call.
- A single new client is worth tens of thousands in fees. Lumivara Forge T2 is **CAD $7,488 over 24 months** — recovered if our work brings in a single additional retained client over that period.

The arithmetic is trivial. The objection isn't price; it's switching cost — and switching is something we own end-to-end.

---

## ROI math — the health-practice persona

If you run a **dental, optometry, physio, or specialist practice**:

- You typically allocate **5 – 10% of gross revenue** to marketing.
- Of that marketing budget, **30 – 40% goes to website + SEO** — for a $1M-revenue practice, that's $15k – $40k/yr.
- Lumivara Forge T2 is CAD $4,500 setup + CAD $249/mo. That's well below your existing line item — and for the first time, accessibility compliance is a property of the system, not a "we'll get to it" item your compliance officer keeps flagging.

(Source: industry aggregations on dental-practice marketing budgets — quoted as a range, not a precise figure. Source row: `[S] §B-Dental-Spend`.)

---

## The honest objections, with honest answers

> **"Can't I just use Squarespace?"**
> Yes — and a quarter of small businesses do. The difference is real ownership of the code + free unlimited edits + monthly improvements baked in. 71% of consumers spot a DIY site at first click; for a regulated practice, that first click is often the only one.

> **"What if you go out of business?"**
> Your site keeps running on Vercel under your account. The phone-edit pipeline stops accepting new requests; everything that's published stays published. You can hire any modern web developer to pick up where we left off.

> **"What if the AI makes a mistake?"**
> Every change waits for your tap on a preview before publishing. The build also fails automatically if accessibility, performance, or type-checks regress — the broken change never reaches the live site.

> **"What if I want to leave?"**
> You take everything: code, domain, hosting account. Cancel any time with 30 days' notice.

---

## What's included on every tier

✓ **Custom design**, not a template — your colours, your fonts, your voice.
✓ **Mobile + desktop**, fast loading on every device. Lighthouse 90+ on every page, every change.
✓ **Search-engine-ready** out of the box (sitemap, social previews, structured data).
✓ **Accessibility** baked in — screen-reader friendly, keyboard navigable, axe-core CI gate.
✓ **Full ownership** — you keep the code, the domain, the hosting account.
✓ **30-min handover walkthrough** + a recorded video for future reference.
✓ **Zero vendor lock-in** — leave any time, take everything.

---

## How we'll work together

### Week 1 — Intake
You fill in a 5-minute form. We do a 30-min discovery call. We send a moodboard for sign-off.

### Week 2 — Build
We build the site. You see daily previews. You leave comments where you'd like changes.

### Week 3 — Launch
We go live on your domain. We record your personalised walkthrough video. We set up the phone-edit shortcut on your phone, together, in real time.

### Ongoing — Subscription
You edit from your phone. We ship improvements monthly. We meet quarterly to talk about what's next.

---

## The four service tiers

|   | **Tier 0**<br/>Launch | **Tier 1**<br/>Autopilot Lite | **Tier 2**<br/>Autopilot Pro | **Tier 3**<br/>Business |
|---|---|---|---|---|
| **Setup (one-time)** | CAD $1,200 | CAD $2,400 | CAD $4,500 | CAD $7,500 |
| **Monthly** | none | CAD $99 | CAD $249 | CAD $599 |
| Pages | 3 | 5 | 7 | 7 + multi-site |
| Phone edits | manual | 5 / mo | unlimited | unlimited |
| Improvement runs | none | quarterly | monthly | monthly |
| Best for | "just get me online" | solo practitioner | most clients land here | small firm / multi-site |

<span class="small">Pricing details + a la carte add-ons in our pricing PDF (`docs/freelance/02-pricing-tiers.md`). All prices in CAD; USD ≈ 0.72×.</span>

---

## Next step

### 1. **Book a 30-min discovery call.** No prep, no commitment.

### 2. We talk through your business and whether this is a fit.

### 3. If it is, we send a written proposal in 48 hours.

### 4. If it isn't, we'll point you to whoever we think *would* be a fit.

<br/>

> Discovery calls land here: **[your Cal.com / Calendly link]**
> Or just reply to whatever channel you got this deck on.

---

<!-- _class: lead -->

# Thank you.

<br/>

*Live reference site:* **lumivara.com**

*Contact:* **[your email]**

<span class="small">© 2026 — system proprietary, licensed per engagement. Independent verification of every headline statistic in `docs/research/03-source-bibliography.md`.</span>
