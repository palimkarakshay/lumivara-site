# Intro-email templates — Lumivara Forge

> **DRAFT — pending operator approval (issue #115).** Three labelled templates
> to cover the three real outbound contexts in the first 90 days:
>
> 1. Cold-to-warm-network (someone the operator already knows; weak tie)
> 2. LinkedIn comment / DM follow-up (warm — someone engaged with a post)
> 3. Upwork proposal opener (cold but in-platform; bid context)
>
> Replace `{{OPERATOR_EMAIL}}`, `{{OPERATOR_NAME}}`, and `{{PROSPECT_*}}`
> placeholders before sending. SMTP / domain alignment is tracked in the
> operator's secrets vault, not in this repo.

Tone reference: `01-gig-profile.md` Part 4 ("About me") — calm, plain English,
outcome-led. **Never** name the stack in cold outbound. **Never** include a
price in any of these templates; price is a discovery-call topic
(`02-pricing-tiers.md` § "How to handle the price objection").

Each template targets ~120 words in the body. Same closing CTA across all
three so the operator can A/B subject lines without drift in the body.

---

## Template 1 · Cold to a warm-network contact

**Use when:** the operator has a real but weak tie to the recipient (former
colleague, mutual friend, an ex-client of the day-job practice). The hook is
the relationship, not the offer.

**Subject line options (pick one, don't A/B in a single sequence):**

- `quick question — your site / new thing I'm building`
- `{{PROSPECT_FIRST_NAME}} — saw the relaunch, idea for the site`
- `the website-as-a-service thing — wanted to run it past you first`

**Body:**

> Hi {{PROSPECT_FIRST_NAME}},
>
> Hope {{LIGHT_CONTEXT — e.g. "the relaunch is going well" / "Q2 isn't on fire
> yet"}}.
>
> I've spent the last few months building a service for small practices like
> yours: a clean, custom website you can edit by sending a text from your
> phone, and a small monthly fee that keeps shipping small improvements
> (loading speed, accessibility, SEO) without you needing to ask. No
> developer phone calls, no $200-per-typo invoices.
>
> The whole thing runs on my own site (lumivara.com) — that's the proof. I'm
> looking for a few first clients in the network before I open it up wider,
> because the feedback loop with people I trust is more useful than a stranger
> on Fiverr.
>
> Would it be worth 15 minutes to show you the phone-edit shortcut on a
> screen-share? If it's not a fit I'd rather know early.
>
> {{OPERATOR_NAME}}
> {{OPERATOR_EMAIL}}

---

## Template 2 · Reply to a LinkedIn comment / inbound DM

**Use when:** someone reacted to one of the LinkedIn case-study posts (W1,
W3, W4 in the calendar) and either commented or DM'd. The hook is **their
expressed interest** — name it back to them.

**Subject line options (only used if it spills out of LinkedIn into email):**

- `re: your comment on the [topic] post — happy to walk you through it`
- `{{PROSPECT_FIRST_NAME}} — the phone-edit demo, as promised`

**Body:**

> Hi {{PROSPECT_FIRST_NAME}},
>
> Thanks for {{COMMENT / DM REFERENCE — e.g. "the question about how the
> publish step works" / "saying you're looking at relaunching this quarter"}}.
> Quick context so the next step is concrete:
>
> The system I posted about does three things: builds a custom small-business
> site, lets you edit it from a phone shortcut (preview link → tap publish),
> and ships small improvements every month for a flat fee. I run my own site
> on it — lumivara.com — so the demo is a real, live one rather than a
> screenshot.
>
> If the timing makes sense, the easiest next step is a 15-minute walkthrough
> on a screen-share. I'll show you the shortcut on lumivara.com, you tell me
> what your current site situation looks like, and we'll know quickly whether
> it's a fit.
>
> {{LINK_TO_BOOKING_PAGE — e.g. cal.com/akshay/forge-walkthrough}}
>
> {{OPERATOR_NAME}}
> {{OPERATOR_EMAIL}}

---

## Template 3 · Upwork proposal opener

**Use when:** bidding on an Upwork job that mentions Next.js / modern stack /
small-business marketing site. The hook is **their job post** — quote one
specific thing back to them in the first sentence so it doesn't read as
copy-paste.

**Subject line:** Upwork sets it (the job title); the first sentence of the
proposal is what gets read.

**Body:**

> Hi {{PROSPECT_FIRST_NAME or "there"}},
>
> {{ONE-SENTENCE CALLBACK to a specific line in their job post — e.g. "you
> mentioned the current site is hard to update without going back to the dev
> who built it; that's the exact problem I built my service around"}}.
>
> Short version of what I do: I build small-business marketing sites on a
> modern stack you can keep, then I wire up a system that lets you submit
> edits by phone — type the change, get a preview link, tap to publish. After
> launch, a flat monthly fee covers small improvements, fixes, and the
> phone-edit pipeline staying running. No per-edit invoices.
>
> The clearest demo is my own site — lumivara.com — built and run on this
> exact system. Every change you'd see ship there, ships through the same
> pipeline I'd put on yours.
>
> Happy to do a 15-min screen-share so you can see the phone-edit shortcut
> live before you commit. If the scope or timeline doesn't match, I'll say
> so on the call.
>
> {{OPERATOR_NAME}}
> {{OPERATOR_EMAIL}}

---

## Operator notes on use

- **Volume cap.** Per the channel-plan rules in `07-marketing-strategy.md` § 4,
  Template 1 (cold-to-warm) is capped at **30 sends per week** until we adopt
  a deliverability tool. Templates 2 and 3 are reactive — no cap.
- **No price in any template.** Confirmed against `02-pricing-tiers.md` § "How
  to handle the price objection". Price arrives on the call, after we've
  reframed.
- **Don't name the stack** ("Next.js", "Vercel", "Claude") in any cold
  outbound. The Upwork template is the only context where naming "modern
  stack" is appropriate, because the job post requires it.
- **Always link lumivara.com** — it is the strongest single piece of proof
  available before client #1.
- **Track replies.** Spreadsheet or Notion table; we want reply-rate per
  template by W6 to inform whether to refresh the language.
- **Hand off to the discovery-call script after a reply.** That script doesn't
  exist yet (`00-quick-start.md` "what's still missing"); build after 5 calls.

---

*Last updated: 2026-04-29. Status: DRAFT — sign-off in PR for issue #115.*
