# Freelance Go-to-Market — Working Folder

A self-contained pack for turning the Lumivara repo's architecture into a
sellable service. Optimised for an operator who **vibe-coded the system**
and now wants to sell the *outcome* of that system to clients without
having to explain the tech behind it.

> **New here?** Read `00-quick-start.md` first — it's a 5-minute orientation
> with the 30-day launch checklist and a map of what's in every other file.
> The rest of this folder is reference; the quick start is action.

## What's in here

| File | Purpose | Read when |
|---|---|---|
| `00-quick-start.md` | 5-minute orientation. The pitch, the 30-day launch plan, where each topic lives, and an issue-#86 deliverables map. **Start here.** | Day 1 — before you read anything else. |
| `01-gig-profile.md` | The client-facing pitch. Profile copy, gig descriptions, tier cards, FAQ, target customer profiles, and where to list. **Outcome-led, no jargon.** | You're filling in Fiverr / Upwork / Contra forms. |
| `02-pricing-tiers.md` | Four service tiers (Starter → Business) with what's included, prices in CAD/USD, what each tier *promises*, and a "client decision tree" so you can route inquiries. | A prospect asks "what does it cost?" |
| `03-cost-analysis.md` | What it actually costs you to run (Claude / Gemini / Codex / Vercel / GitHub / your time per client per month), break-even maths, and the **quit-the-day-job ramp plan** — months 0–24. | Planning whether to scale, when to switch from Pro→Max→Team, when to leave the day job. |
| `04-slide-deck.md` | A Marp-compatible markdown slide deck. Two halves: (1) the Lumivara case study, (2) "imagine your site here" — a fill-in-the-blank framework so a prospect can visualise their own site/app on the same plumbing. Rendered HTML + PDF live alongside the source. | Sending to a prospect, posting on LinkedIn, demoing on a call. |
| `05-template-hardening-notes.md` | Running list of changes to make the rebuild template harder to repackage and resell without your operator account. Internal only — never share with clients. | Before client #5 — once retainers are real, the template becomes worth protecting. |
| `06-product-strategy-deck.md` | Operator-only **strategy** companion to `04-slide-deck.md`. Answers the nine product-strategy questions (benefits / differentiation / customer voice / competitor claims / end goal / steps / plan / risks / resources) by synthesising `docs/mothership/` + the rest of `docs/freelance/`. | Internal review, planning sessions, investor-style conversations. Never share verbatim with clients. |
| `07-marketing-strategy.md` | Locked tagline + product pitch, ICP (primary / secondary / tertiary), positioning matrix vs. Squarespace / WordPress / agency / freelance dev, ranked channel plan, and a week-by-week first-90-days launch calendar. **DRAFT — pending operator approval (issue #115).** | Planning the channel mix, briefing a hire on how we sell, or auditing whether a tagline change is on-brand. |
| `assets/landing-copy.md` | First-pass landing-page copy for whichever surface the Forge brand eventually lives on (hero, three benefits, social-proof slot, FAQ teaser, closing CTA). Doc draft — not yet wired into `src/`. | Drafting / reviewing the public marketing landing for Forge before site integration. |
| `assets/intro-email.md` | Three intro-email templates: cold-to-warm-network, LinkedIn-comment follow-up, Upwork proposal opener. ~120 words each, shared closing CTA. | Sending outbound or following up on a warm reply during the launch calendar. |

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

The `TEMPLATE_REBUILD_PROMPT.md` in `docs/` lets you spin up a new client project fast, but in its current form a technically-curious client could in theory take it and run their own setup. The file at `docs/freelance/05-template-hardening-notes.md` tracks the changes needed to make it harder to repackage. Treat the current template as **internal**: don't hand it to clients verbatim.

---

## Mothership pack — operator-only

The mothership business pack (`docs/mothership/`) is the operator-side runbook for the whole practice — separate from this folder, which is the public-facing storefront. Read order if you're new:

1. `docs/mothership/00-INDEX.md` — master index + phased plan
2. `docs/mothership/01-business-plan.md` — brand naming, mothership/client separation
3. `docs/mothership/02-architecture.md` — two-repo shape (mothership + client)
4. `docs/mothership/03-secure-architecture.md` — zone isolation, cost firewall
5. `docs/mothership/04-tier-based-agent-cadence.md` — AI cron/model policy by tier
6. `docs/mothership/05-mothership-repo-buildout-plan.md` — phased Claude plan to build the new repo
7. `docs/mothership/06-operator-rebuild-prompt-v3.md` — per-engagement playbook (replaces v2)
8. `docs/mothership/07-client-handover-pack.md` — client-facing handover + dummy intake forms
9. `docs/mothership/08-future-work.md` — legal, vault, market research stubs
10. `docs/mothership/09-github-account-topology.md` — org/bot/personal-account decision

Everything inside `docs/mothership/` is operator-only and never ships in a client repo. This `docs/freelance/` folder remains the storefront — gigs, pricing, slide deck, cost analysis.

---

*Last updated: 2026-04-29.*
