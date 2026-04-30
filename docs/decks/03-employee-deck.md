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
  table { font-size: 0.82em; }
  code { background: #f0ece2; padding: 2px 6px; border-radius: 3px; }
  .small { font-size: 0.78em; color: #666; }
  .footnote { font-size: 0.72em; color: #888; }
---

<!-- _class: lead -->

# Lumivara Forge
### Talent briefing — engineer / VA

For a first hire considering joining a small, AI-leveraged, profitable services practice.

<br/>

*Confidential. Single-recipient deck.*

<span class="small">Honest about the work, the culture, and the boundaries. Numbers cite verified rows in `docs/research/03-source-bibliography.md`.</span>

---

## What this place is

A 30-client retainer practice that builds and maintains marketing websites for high-LTV professional-services SMBs (lawyers, dentists, boutique consultants, small firms). The headline mechanic is that **clients edit their site from a phone shortcut** and an **AI autopilot ships small improvements every month**. Every change waits for a tap on the client's phone.

The whole operation runs out of one (and now possibly two) operator's hands. We have a hard 30-client cap until the second-engineer hire (Cliff 5 at client #26, `docs/mothership/18 §6`).

You'd be either that second engineer, or the VA who triages client communication. Both roles exist in the planning doc; this deck handles either.

---

## Why this is hiring at all

We will reach 25 active clients in roughly months 8 – 9 of the year-1 plan (`docs/storefront/03-cost-analysis.md` Part C, milestone 2). At that volume the operator's monthly hours hit ~115 – 175 (`docs/mothership/18 §4`). That is the cap.

Two things break above the cap:

1. **Client comms triage.** New inquiries, scheduling, intake-form follow-ups. A part-time VA at ~5 hours/week, ~CAD $300/mo (`docs/storefront/03-cost-analysis.md` Part E).
2. **Monthly improvement runs at saturation.** The bot does the boring 60% of the implementation work; an engineer reviews PRs, runs the monthly per-client improvement audit, and handles the parts the bot can't (design, complex integrations). Triggered at ~35 clients (Cliff 5 unlocks the 2nd Anthropic seat).

Both roles exist *because* we hit the limit, not because we want to grow headcount.

---

## Why this market — three numbers

(Same three you'll see across decks. Independently verified.)

| Stat | Source | What it means for your work |
|---|---|---|
| 75% of consumers abandon outdated/unprofessional websites | HostingAdvice 2024 / PRNewswire (`[V] §B-Outdated-75`) | Every client we onboard has a real revenue tax on their existing site; the wins are visible |
| 3,117 federal-court ADA lawsuits in 2025 (+27% YoY) | Seyfarth Shaw / ADA Title III (`[V] §B-ADA-Lawsuits`) | We treat accessibility as a CI-gate concern, not a stylesheet concern |
| 95.9% of WebAIM Million pages fail WCAG; 56.8 errors/page average | WebAIM 2024 (`[V] §B-WebAIM`) | Our axe-core gate puts us in the top-decile baseline by default |

The work has measurable consequence. That's not always true in services.

---

## What you'd actually work on (engineer track)

- **PR review.** The bot ships preview PRs into client repos via Dual-Lane Repo (`docs/mothership/02b-dual-lane-architecture.md`). You review the preview, leave inline comments, merge greens, kick reds back to the issue.
- **Monthly improvement runs (T2 / T3).** Per-client 60 – 90 minute audit: Lighthouse trend, accessibility regressions, content-freshness, link-rot, image weight. You ship 3 – 5 issues per client.
- **AI-routing reliability.** When Claude / Gemini / OpenAI return weird outputs, you tighten prompts in `docs/AI_ROUTING.md` and the relevant `scripts/*-prompt.md`. Multi-vendor fallback is real.
- **Dual-Lane Repo audits.** Quarterly, walk `docs/mothership/dual-lane-enforcement-checklist.md` against every active client repo. Verify operator IP hasn't leaked.
- **Vertical content prompt packs.** Right now restaurant is the only fully-fleshed pack; plumber, realtor, recruiter are stubs (`docs/mothership/templates/`). Each one you complete is a sellable acceleration on a new client onboarding.

You'd not be writing site CSS from scratch. The bot does that. You're the reviewer, the prompt-engineer, and the monthly-audit hand.

---

## What you'd actually work on (VA track)

- **Inbound triage.** Discovery-form submissions, Fiverr / Upwork inquiries, LinkedIn DMs. Categorise → route to operator, pre-qualified, with a one-line summary. The "say-no-to" filter from `docs/storefront/01-gig-profile.md` Part 8 is your reference.
- **Calendar wrangling.** Book discovery calls into a 3-slots-per-week window. Confirmation emails go via Resend.
- **Per-client check-in cadence.** Monthly health-check email (T1 +). The bot drafts; you proofread and send.
- **Inbox sweep on the operator dashboard.** Mon AM and Wed PM, surface anything aging out.

Importantly: you do *not* answer technical questions, do not access client GitHub repos, do not touch n8n credentials, and do not see the operator vault. Dual-Lane Repo is enforced for the VA role exactly the same as for the operator.

---

## How the work is structured

The week (`docs/mothership/01-business-plan §7`):

| Day | Engineer | VA |
|---|---|---|
| Mon AM | Inbox sweep on dashboard | Inbound triage from weekend |
| Mon PM | Weekly AI smoke-test review | — |
| Daily | PR review on mobile | Calendar + DM responses |
| Wed | One T2/T3 monthly improvement run | Mid-week inbox sweep |
| Fri | Cost check (ccusage, action minutes) | Weekly health summary |
| Last Fri / month | Per-client "what's next" issues | — |

There are no standups. No Slack-as-process. No Jira. Communication is GitHub Issues + the operator dashboard + email for things that aren't issues.

---

## Compensation framing

We do not yet have an HR practice; this is a small services shop. Honest framing:

- **VA role.** Part-time contract, 5 – 10 hrs/week, CAD ~$300 – $600/mo at start. Scales with roster.
- **Engineer role.** Initially 4 – 8 hrs/week of structured work + a flat per-monthly-improvement-run rate. Scales toward part-time-substantial as the roster grows past 35.

Equity-shaped instruments are not on offer at this stage; the practice is a sole proprietorship until incorporation triggers (`docs/mothership/08-future-work §6`). When / if we incorporate, that conversation reopens.

We will write this down in a contractor agreement, not a handshake. The MSA / SOW templates from a Canadian small-business lawyer (`docs/mothership/08-future-work §6`) are scheduled before client #2 — your contract is on the same legal footing.

---

## Culture — honestly

The startup-burnout numbers are real. 73% of tech founders / startup execs hide burnout; ~65% of startup failures are attributed to founder burnout (`[S] §B-Founder-Burnout`). We have *named this* and built around it:

- 30-client cap until a hire is made. Not a goal; a wall.
- Session-budget charter (`AGENTS.md`) that **ends Claude runs gracefully at 80% / 95% turn-budget**, even if the work isn't done. Partial work is a successful run, not a failure.
- Mandatory 2-week break on the operator's calendar before crossing client #25.
- Weekly cadence, not hourly. No "always-on" expectation.

What we *do* expect: the work shipped is the operator's reputation. PR reviews are honest, evidence logs are accurate, the say-no-to filter is enforced.

What we don't have: kombucha, foosball, or "unlimited PTO." We do have predictable hours and a real product.

---

## Tools you'd live in

| Tool | Used for | Account |
|---|---|---|
| GitHub | Issues, Actions, PRs, Project board | Per-engagement; operator-org slug |
| n8n on Railway | Workflow automation, AI routing | Operator account; you'd have read-only credentials initially |
| Vercel | Hosting + preview builds | Per-client; engineer reads logs |
| Operator dashboard | Mobile-first SPA on GitHub Pages | Operator account |
| 1Password | Secrets vault | Operator account; engineer gets specific items, not the whole vault |
| Twilio | Per-client SMS numbers | Operator account |

Everything you need is documented in `docs/mothership/` and the wiki. Onboarding is a 90-minute read of `00-INDEX.md` + `06-operator-rebuild-prompt-v3.md` + `dual-lane-enforcement-checklist.md`.

---

## What you'd be choosing into

A small, profitable, deliberately-bounded practice. Predictable hours. Real product. A documented pipeline with multi-AI fallback. A 30-client cap that exists *to protect* the people running it.

You would *not* be choosing into:

- A "we're going to be the next Vercel" hockey-stick story. We're not.
- A 10-person team with a head of people. There are at most 2 – 3 of us.
- Equity in a venture-backed company. Sole proprietorship; future incorporation possible but not promised.
- Every client. Roster discipline (`docs/storefront/01-gig-profile.md` Part 8) is non-negotiable.

---

## Risks you'd inherit

Full pack: `docs/research/06-drawbacks-and-honest-risks.md`. The four that matter to a hire:

| Risk | What it would mean for you |
|---|---|
| **D1 — AI hallucination** | Your job *is* the second pair of eyes. PR review is the load-bearing gate. |
| **D3 — Operator burnout** | Capped + cadenced + 2-week-break-scheduled. But: notice when it's coming, and say so. |
| **D6 — Dual-Lane Repo operator error** | Your quarterly audit catches this. Don't skip the checklist. |
| **D7 — Single bad client** | Escalate to operator immediately. The cap is the protection. |

If any of these breaks the deal for you, say it now — not at month 6.

---

## What I'm asking for

In order:

1. **A 60-minute discovery conversation.** I show you the dashboard, walk one PR end-to-end, and answer anything in this deck.
2. **A 2-week paid trial** — you take 5 PR reviews + 1 monthly improvement run, on the lowest-stakes client we have. We both decide at day 14.
3. **A written contractor agreement** before any access to client repos.

---

<!-- _class: lead -->

# Thank you.

<br/>

*Source files for this deck: `docs/research/06-drawbacks-and-honest-risks.md` · `docs/storefront/03-cost-analysis.md` Part E · `docs/mothership/01-business-plan.md`, `04-tier-based-agent-cadence.md`, `18-capacity-and-unit-economics.md`, `dual-lane-enforcement-checklist.md` · `AGENTS.md`*

<span class="small">© 2026 — confidential. Operator IP is licensed per-engagement.</span>
