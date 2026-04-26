# Freelance Go-to-Market — Working Folder

A self-contained pack for turning the Lumivara repo's architecture into a
sellable service. Optimised for an operator who **vibe-coded the system**
and now wants to sell the *outcome* of that system to clients without
having to explain the tech behind it.

## What's in here

| File | Purpose | Read when |
|---|---|---|
| `01-gig-profile.md` | The client-facing pitch. Profile copy, gig descriptions, tier cards, FAQ, target customer profiles, and where to list. **Outcome-led, no jargon.** | You're filling in Fiverr / Upwork / Contra forms. |
| `02-pricing-tiers.md` | Four service tiers (Starter → Business) with what's included, prices in CAD/USD, what each tier *promises*, and a "client decision tree" so you can route inquiries. | A prospect asks "what does it cost?" |
| `03-cost-analysis.md` | What it actually costs you to run (Claude / Gemini / Codex / Vercel / GitHub / your time per client per month), break-even maths, and the **quit-the-day-job ramp plan** — months 0–24. | Planning whether to scale, when to switch from Pro→Max→Team, when to leave the day job. |
| `04-slide-deck.md` | A Marp-compatible markdown slide deck. Two halves: (1) the Lumivara case study, (2) "imagine your site here" — a fill-in-the-blank framework so a prospect can visualise their own site/app on the same plumbing. | Sending to a prospect, posting on LinkedIn, demoing on a call. |

## How to use this pack

**You're not selling Next.js. You're selling three outcomes:**

1. **A real website for a small business** — fast, beautiful, owned by the client (not held hostage by an agency).
2. **A way to edit it from a phone** — no developer call, no waiting weeks, no surprise invoices.
3. **A monthly subscription that keeps it improving** — the site doesn't decay; small changes ship within hours, automatically.

That third bullet is the moat. Most freelance web devs charge for a build and disappear. You charge a setup fee **and** a monthly retainer because the system you've built actually keeps working between projects. Lead with that everywhere.

## What you control vs. what you don't

You control: the build, the design, the automation, the "operator" duties (token rotation, monitoring quota, reviewing PRs the bot opens before they merge).

You don't control: how often the client wants changes, whether they pay on time, whether they understand the value. The tier system in `02-pricing-tiers.md` is designed to filter for clients who *do* understand it — by pricing the cheap tier high enough to scare off tire-kickers but low enough to stay accessible to a solo consultant.

## Honest caveat

The `TEMPLATE_REBUILD_PROMPT.md` in `docs/` lets you spin up a new client project fast, but in its current form a technically-curious client could in theory take it and run their own setup. The file at `docs/freelance/05-template-hardening-notes.md` (to be written) tracks the changes needed to make it harder to repackage — license headers, removing the auto-generated bootstrap script from the public template, gating the multi-AI fallback behind your operator account, etc. Treat the current template as **internal**: don't hand it to clients verbatim.

---

*Last updated: 2026-04-26.*
