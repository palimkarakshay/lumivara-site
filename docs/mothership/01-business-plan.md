<!-- OPERATOR-ONLY. Do not paste into client-shared chats. -->

# 01 — Business Plan: The Mothership

## 1. Brand naming — pick one

The user-supplied placeholder *Lumivara Tech Solutions / Lumivara Info Tech Solutions* works but reads generic and risks confusing prospects with Beas's HR brand (*Lumivara People Advisory*). Ten options, the original five plus five added during the `15-terminology-and-brand` review, ranked with the trade-off:

| # | Name | Reads as | Pros | Cons |
|---|---|---|---|---|
| 1 | **Lumivara Forge** ★ co-recommended | "the maker shop within the Lumivara family" | Keeps brand-family halo; "forge" connotes building & maintaining | Slightly crowded — many tech-tool brands use "Forge" |
| 2 | **Lumivara Cadence** ★★ co-recommended for the broader vision | "the rhythm-keeper" | The product's actual mechanic *is* a cadence (`04 §1`) — brand & engineering vocabulary reinforce each other; sub-product family reads cleanly: *Cadence Sites*, *Cadence Voice*, *Cadence Brand*, *Cadence Pulse* | Newer brand pattern; slightly less obvious "tech" connotation |
| 3 | **Lumivara Continuum** | "the unbroken thread" | Speaks directly to "doesn't decay between updates" | Slightly long; harder to logo |
| 4 | **Lumivara Pulse** | "the heartbeat" | Living-system metaphor; pairs with monitoring/dashboard | Better as a sub-product than the parent |
| 5 | **Lumivara Loom** | "the weaver" | Distinct word, premium feel, easy to logo | Less obviously tech |
| 6 | **Lumivara Atelier** | "premium studio" | Supports T2/T3 prices | Boutique-y; may scare T0/T1 |
| 7 | **Lumivara Helm** | "the captain" | Steering/guidance; works for tech + advisory under one umbrella | Less specific to building |
| 8 | **Lumivara Compass** | "the direction-giver" | Clean adjacent to Beas's HR practice | Generic |
| 9 | **Lumivara Stack** | "explicitly tech" | Instantly understood | Generic; lots of "Stack" co's |
| 10 | **Plumbline Studio** (independent of Lumivara) | "the straight-shooter" | Full separation from HR brand; cleaner if Beas's biz changes shape | Loses brand-family halo; build awareness from zero |

**Locked recommendation: Lumivara Forge.** Operator confirmed via the doc-15 review (2026-04-28). Use it as `{{BRAND}}` everywhere until Run S1 (`16 §5`) does the global rename. Slug: `lumivara-forge`. Domain candidates: `lumivara-forge.com / .ca`, or a subdomain off Beas's existing `lumivara.ca`. Trademark check (CIPO Class 42 + USPTO) and full criteria list in `15 §2`.

> **Lumivara Cadence** is preserved as the closest runner-up should the operator ever revisit the brand — its mechanic-mirrors-naming property (cadence matrix in `04`) is unique. The other 8 candidates and their trade-offs live in `15 §2`.

The rest of this document uses `{{BRAND}}` and `{{BRAND_SLUG}}` placeholders so the rename is mechanical.

---

## 2. One-paragraph positioning

> **{{BRAND}}** designs and ships modern marketing websites for small businesses, then keeps them improving on an automated subscription. The client edits their site from a phone shortcut; an AI autopilot implements the change, opens a preview, and the client taps publish. Beautiful build. No decay. Owned by the client; managed by us.

The full pitch and gig copy live in `docs/freelance/01-gig-profile.md` — keep it the storefront. This document is the **operator's** business plan, not the marketing copy.

---

## 3. The mothership vs the client businesses

This is the foundational separation. Get it right on day one or you'll regret it on day 100.

### 3.1 The mothership = `{{BRAND}}`

A single, private operator-side organisation. It owns:

- One private GitHub repo: `palimkarakshay/{{BRAND_SLUG}}-mothership` (built per `05-mothership-repo-buildout-plan.md`).
- One GitHub org for client-repo membership + secret scoping: `{{BRAND_SLUG}}` (org-level secrets only — never per-client).
- One vendor bot account: `{{BRAND_SLUG}}-bot` (used by n8n + GitHub Actions to write to client repos).
- One n8n instance on Railway (one instance, many workflows — workflows suffixed per client).
- One Resend sending domain: `mail.{{BRAND_SLUG}}.com` (every client's magic-link emails come from here).
- One Twilio sub-account with per-client numbers.
- One Anthropic Pro/Max subscription bound via `claude setup-token` (the `CLAUDE_CODE_OAUTH_TOKEN`).
- One Gemini API key (free tier), one OpenAI key (pay-go; optional).
- The operator dashboard: GitHub Pages SPA on the mothership repo, mobile-first.
- The freelance go-to-market collateral: `docs/freelance/` (lives in this repo today; migrates to mothership in P5).

### 3.2 The client businesses

Each client gets their own private repo and Vercel project. Today's clients in the user's roster (real and dummy):

| Client | Type | Tier (suggested) | Repo (after migration) |
|---|---|---|---|
| **Lumivara People Advisory** (Beas) | HR consulting | Tier 2 | `palimkarakshay/lumivara-people-advisory-site` |
| **John's Plumbing** (dummy) | Local trades | Tier 1 | `palimkarakshay/johns-plumbing-site` |
| **Viktor — Lawyer** (dummy) | Solo legal practice | Tier 2 | `palimkarakshay/viktor-law-site` |
| **Head-Hunter Talent** (dummy) | Recruiting boutique | Tier 2 | `palimkarakshay/head-hunter-talent-site` |
| **Rose Restaurant** (dummy) | Local hospitality | Tier 1 | `palimkarakshay/rose-restaurant-site` |
| **Jimmy Barber** (dummy) | Local trades | Tier 0 | `palimkarakshay/jimmy-barber-site` |

Pre-filled intake forms for each are in `07-client-handover-pack.md §6`.

### 3.3 The line that must never blur

| Concern | Mothership | Client repo |
|---|---|---|
| Marketing site, MDX content, design tokens | — | ✅ |
| `/admin` portal UI + Server Actions + middleware | — | ✅ |
| GitHub Actions workflows (`triage.yml`, `execute*.yml`, `plan-issues.yml`, `deep-research.yml`, `codex-review.yml`, `auto-merge.yml`, `project-sync.yml`, `setup-cli.yml`, `ai-smoke-test.yml`, `deploy-dashboard.yml`) | ✅ canonical templates in `workflows-template/` | Pattern C: live in the per-engagement `<slug>-pipeline` repo only (never on the site repo). See `02b §1` and `02 §1`. |
| `scripts/triage-prompt.md`, `scripts/execute-prompt.md`, `scripts/gemini-triage.py`, `scripts/codex-triage.py`, `scripts/plan-issue.py`, `scripts/lib/routing.py`, `scripts/bootstrap-kanban.sh` | ✅ canonical | Pattern C: ride along with workflows in the `<slug>-pipeline` repo. |
| n8n workflow JSON exports | ✅ canonical (`mothership/n8n/`) | ❌ never |
| Operator runbooks, freelance pack, this folder | ✅ | ❌ never |
| OAuth tokens, AI keys, vendor PAT | ✅ org secrets | ❌ never visible to client |
| HMAC secret for n8n↔Next handshake | half — generated by operator, set in Vercel env *and* n8n credentials | half — Vercel env only |
| Domain, hosting bill, Vercel team | ✅ until end of engagement, then transferred to client | becomes ✅ on transfer |
| Site code, content, design | ❌ always client-owned | ✅ |

The two-repo separation (Pattern C) is detailed in `02b-pattern-c-architecture.md` and `02-architecture.md §1/§4`. The earlier "operator/main branch overlay" technique was deprecated on 2026-04-28 — see `11 §1` for the decision history.

---

## 4. Service catalog (recap, with the latest features)

Tiers and prices live in `docs/freelance/02-pricing-tiers.md` (do not duplicate here). What's new — **features built since the freelance pack was last updated** that should be marketed at each tier:

| Feature | Built | Tier where it appears |
|---|---|---|
| Multi-AI routing (Claude + Gemini + OpenAI Codex) with deterministic ladder | `docs/AI_ROUTING.md` | T2+ ("priority response, never blocked by a single provider") |
| Plan-then-execute pipeline (`plan-issues.yml`) — every routine issue gets a structured plan before code is written | Built | T2+ ("explainable changes; you see what the bot is going to do before it does it") |
| Auto-merge gate after Vercel preview check | `auto-merge.yml` | T1+ (trivial/easy non-design PRs) |
| Mobile admin portal (Auth.js v5 + Resend magic link + Google + Entra) | `docs/ADMIN_PORTAL_PLAN.md` (5 phases) | T1+ (web channel), T2+ (email + SMS channels) |
| Operator AI Ops dashboard (mobile SPA on GitHub Pages) | `dashboard/` | Operator-side only, never sold; mention as "active monitoring" |
| Triage every 30 min + execute every 2 h | post-multi-model commit | T2+ ("changes ship same business day"); T1 keeps the 4 h cadence |
| Deep-research workflow (Gemini Pro 1M ctx) for full-codebase audits, bulk MDX generation | `deep-research.yml` | T2+ (quarterly content sprint), T3 (monthly) |
| Codex-review workflow (OpenAI gpt-4o-mini second-opinion) on PRs | `codex-review.yml` | T3 (mandatory), T2 (optional) |
| Fallback executor (Codex CLI + Gemini CLI) when Claude is down | `execute-fallback.yml` | T2+ ("we don't pause when one provider hiccups") |
| Session-budget charter (50%/80% gates) | `AGENTS.md` | All tiers — internal only; sold as "predictable monthly cost" |
| `needs-vercel-mirror` label convention | `AGENTS.md` | Internal — protects against silent prod drift |

These features become talking points in the slide deck (`docs/freelance/04-slide-deck.md`) and FAQ (`docs/freelance/01-gig-profile.md §6`). Update both with this list when the brand is locked.

---

## 5. Revenue model (recap)

Full ramp plan in `docs/freelance/03-cost-analysis.md`. The relevant invariants for the mothership:

- One Claude Pro/Max subscription bills against a 5-hour rolling quota that **all** clients share. The session-budget charter (`AGENTS.md`) is what keeps any single client from starving the others.
- Each client's Vercel + GitHub + domain are billed to the **client** (or, until contract transfer, to the operator and rebilled with proof).
- Twilio per-client number ≈ $1.15/mo USD; Resend free tier covers all clients to ~3,000 emails/mo.
- The operator's gross margin per active retainer client is ~$240 CAD/mo (T2). At 25 active T2 clients, MRR ≈ $6,000–$6,800 CAD before time costs.

---

## 6. What the mothership is NOT

- It is **not a SaaS**. There's no self-serve onboarding, no shared multi-tenant database, no public sign-up. Stage-3 SaaS is in `docs/freelance/05-template-hardening-notes.md` — explicitly deferred.
- It is **not an agency** in the project-shop sense. There are no employees, no PMs, no design team. The operator runs everything until cross-30-clients triggers `Part E` of the cost analysis.
- It is **not a white-label reseller** to other agencies. Tier 4 exists for that case but is not promoted (`docs/freelance/02-pricing-tiers.md §"Tier 4"`).
- It is **not a hosting company**. The client's hosting account is the client's, billed to the client, on the client's payment method by month 1 (or month 0 for T0).

---

## 7. Operating cadence (the operator's week)

| Day | Time | Activity |
|---|---|---|
| Mon 08:30 | 30 min | Inbox sweep on the dashboard; re-rank Inbox issues across all clients |
| Mon 12:00 | 30 min | Weekly AI smoke test (`ai-smoke-test.yml`) results review |
| Daily | 30–60 min | PR review on the mobile dashboard — merge greens, kick reds back to issues |
| Wed | 60 min | Monthly improvement run for one T2/T3 client (rotate through the roster) |
| Fri | 30 min | Cost check: ccusage, Action minutes, Twilio balance, Resend deliverability, n8n health |
| Last Fri / month | 60 min | Per-client "where is this site going next?" thinking; draft 1–2 issues each |

The dashboard's "Recent runs" panel is the operator's inbox; the GitHub Project board is the planning surface. Email is **not** the operations surface — clients reach the operator via the admin portal, never via direct email.

---

## 8. Risk register summary

(Full register: `docs/freelance/03-cost-analysis.md §F` and the future `docs/operator/RISK_REGISTER.md` — to be drafted in mothership P5.)

| Risk | Likelihood | Impact | Mitigation already built |
|---|---|---|---|
| Anthropic outage/throttle | Med | High | Multi-AI fallback ladder (`AI_ROUTING.md`) |
| Single client floods the queue | Low | Med | Per-client rate limit in `triage-prompt.md`; tier cadence (`04-tier-based-agent-cadence.md`) |
| Operator burnout | Med | High | 30-client cap until hire; budget charter; weekly cadence |
| Client demands the autopilot to take with them | Low | Med | Contract: "system" licensed, "site" owned (see 08-future-work) |
| Secret leak (token in client repo) | Low | Critical | Org-level secrets, vendor PAT, `.claudeignore`, audit checklist (03 §3) |
| Bot ships breaking change to prod | Low | High | Auto-merge gate is opt-in per label; design/critical paths excluded; Vercel preview required |
| Client refuses to pay invoice | Med | Med | Stripe / Lemon Squeezy auto-charge; pause autopilot at +14 days; final lockout at +30 days (08-future-work §3) |

---

## 9. The one-line decision rule for the next 12 months

> If a feature, doc, or tool helps the operator serve **paid retainer clients** better — build it. If it helps the operator serve **prospects, hypothetical SaaS users, or other agencies** better — defer it.

This rule is the antidote to the temptation to over-engineer. The mothership exists to keep paying clients happy and to keep the operator's monthly hours under 60. Everything else can wait.

*Last updated: 2026-04-28.*
