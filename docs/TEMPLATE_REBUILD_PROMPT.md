# Template-Rebuild Prompt — spin up a new auto-piloted small-business site

This document is a **paste-once prompt** for Claude Opus (`claude-opus-4-7`) that
turns this repo's architecture and automation into a new project for a
*different* small business. It captures the "shape" of the system —
GitHub-Issues-as-backlog, Claude-in-Actions execution, Vercel preview-merge
loop, phone capture, multi-AI routing, budget charter — without dragging the
Lumivara HR-consulting copy along with it.

> **Scope of this issue:** add this doc only. No changes to Lumivara code,
> content, infra, or behaviour. This is a README-class development aid.

---

## How to use this document

There are two parts:

1. **[Section A — The prompt](#section-a--the-prompt-paste-into-claude-opus)**:
   one self-contained block you paste verbatim into a fresh Claude Code
   conversation (or the web app at claude.ai/code) that is opened *inside*
   the empty target repo. Fill in the bracketed placeholders before you paste.
2. **[Section B — Operator setup checklist](#section-b--operator-setup-checklist-the-parts-claude-cant-do)**:
   the steps Claude can't perform from inside a repo (creating the GitHub
   repo, minting tokens, wiring Vercel, configuring the phone shortcut,
   adding repo secrets). Do these around the prompt run.

You will need:
- A GitHub account in the same identity as `palimkarakshay` (or whichever
  GitHub user owns the bot OAuth token), so the existing
  `CLAUDE_CODE_OAUTH_TOKEN` is reusable across projects on the same Pro
  quota.
- A Vercel account linked to that GitHub identity.
- Claude Code CLI installed locally (or use claude.ai/code in the browser).
- ~30 min for the first setup, ~15 min for each subsequent project once you
  have the muscle memory.

---

## Section A — The prompt (paste into Claude Opus)

> **Before you paste:** open the target repo locally (`git init` an empty
> directory or `gh repo clone <new-repo>`), launch Claude Code (`claude`)
> from inside it on the `claude-opus-4-7` model, then paste everything
> between the fence markers below. Replace every `{{PLACEHOLDER}}` first.

```text
========================== BEGIN PROMPT ==========================

You are bootstrapping a brand-new small-business website + autonomous-backlog
system from scratch in this empty repository. Treat this as a multi-hour,
multi-commit job. You have full write access to the working tree. Do NOT
push to the remote until I tell you to — commit locally as you go in small,
themed commits so I can review per-step.

------------------------------------------------------------------
PROJECT BRIEF (fill these placeholders before pasting)
------------------------------------------------------------------

Business name:                {{BUSINESS_NAME}}
One-line description:         {{ONE_LINE_DESCRIPTION}}
Industry / domain:            {{INDUSTRY}}
Target audience:              {{TARGET_AUDIENCE}}
Geography (if relevant):      {{GEOGRAPHY}}
Primary call-to-action:       {{PRIMARY_CTA}}            # e.g. "Book a call", "Request a quote"
Booking / scheduling tool:    {{SCHEDULER}}              # e.g. Cal.com link, Calendly link, "none"
Contact email destination:    {{CONTACT_EMAIL}}
Brand voice (3 adjectives):   {{BRAND_VOICE}}            # e.g. "warm, plainspoken, confident"
Visual mood (3 adjectives):   {{VISUAL_MOOD}}            # e.g. "editorial, calm, sand-toned"
Initial pages required:       {{PAGE_LIST}}              # e.g. "home, about, services, insights, contact"
Compliance constraints:       {{COMPLIANCE}}             # e.g. "PIPEDA cookie banner", "GDPR", "none"
Production domain (if known): {{DOMAIN_OR_TBD}}
GitHub owner / repo slug:     {{GH_OWNER}}/{{GH_REPO}}   # e.g. "palimkarakshay/acme-site"
Operator GitHub handle:       {{OPERATOR_HANDLE}}        # e.g. "palimkarakshay" — used as default assignee
Vercel project name:          {{VERCEL_PROJECT}}

If you need anything else from me to make a meaningful design or copy
decision, STOP and ask before proceeding rather than guessing.

------------------------------------------------------------------
WHAT TO BUILD — high-level
------------------------------------------------------------------

A production-grade marketing site for the business above, plus a complete
autonomous backlog system that lets the operator capture change requests
from their phone and have a Claude-powered GitHub Action implement them
inside a few hours, opening a Vercel-previewed PR for one-tap merge.

The system has three layers — **build all three**:

  1. The website itself (Next.js 16 app, deployed on Vercel).
  2. The backlog automation (GitHub Issues + Project v2 + GitHub Actions
     running Claude Code via the operator's Pro/Max OAuth token).
  3. The operator-facing docs (README + per-topic guides under docs/) so
     a non-developer operator can run the whole loop from a phone.

This is patterned on a real working repo (Lumivara). Use that pattern but
strip every Lumivara/HR-consulting reference. The *shape* of the system
transfers; the *content* must come from the brief above.

------------------------------------------------------------------
TECH STACK — use these exact versions
------------------------------------------------------------------

  Framework:    Next.js 16 (App Router, RSC, Turbopack)
  Language:     TypeScript (strict)
  Styling:      Tailwind CSS v4 (PostCSS plugin model — no tailwind.config.*)
  UI:           shadcn/ui on Base UI React (`@base-ui/react`)
  Content:      MDX via @next/mdx with remark-gfm, rehype-slug,
                rehype-autolink-headings
  Forms:        React Hook Form + Zod
  Fonts:        self-hosted via next/font/google — pick a 3-font stack
                (display serif, body sans, mono for labels) that matches
                {{VISUAL_MOOD}}
  Icons:        lucide-react
  Schema:       schema-dts for JSON-LD structured data
  Tests:        vitest (unit) + @playwright/test + @axe-core/playwright (e2e + a11y)
  Linter:       eslint with eslint-config-next
  Formatter:    prettier + prettier-plugin-tailwindcss
  Node:         require Node 20+ in README

CRITICAL: Next.js 16 is NOT the Next.js in your training data. It has
breaking changes vs. 14/15 — APIs, file conventions, params shapes,
caching defaults all differ. Before writing any route handler, layout,
generateMetadata, or data-fetching code, READ the relevant guide under
`node_modules/next/dist/docs/`. Heed every deprecation notice. If you
need a feature you remember from older Next, verify it still exists at
the documented import path before using it.

Tailwind v4 also removed `tailwind.config.{js,ts}` — design tokens live
inside `src/app/globals.css` via `@theme` blocks. Do NOT create a
tailwind config file. Do NOT install `tailwindcss-animate`; use
`tw-animate-css` instead (it ships v4-compatible utilities).

------------------------------------------------------------------
DIRECTORY LAYOUT — create exactly this skeleton
------------------------------------------------------------------

  /
  ├── .claude/                       # local Claude Code settings (created by Claude itself)
  ├── .claudeignore                  # excludes node_modules, .next, public, lockfiles, scripts/issues
  ├── .env.local.example             # documented; .env.local gitignored
  ├── .github/
  │   └── workflows/
  │       ├── triage.yml             # see WORKFLOW SPEC below
  │       ├── execute.yml            # see WORKFLOW SPEC below
  │       ├── execute-complex.yml    # manual Opus-planning + Sonnet-impl run
  │       ├── execute-single.yml     # manual single-issue dispatch
  │       ├── auto-merge.yml         # optional: auto-merge after green checks
  │       ├── project-sync.yml       # mirror issue status → Project v2 columns
  │       └── ai-smoke-test.yml      # weekly ping of each AI provider
  ├── .gitignore
  ├── .prettierrc
  ├── AGENTS.md                      # see CHARTER section — paste verbatim
  ├── CLAUDE.md                      # one-liner: `@AGENTS.md`
  ├── README.md                      # see README SPEC
  ├── PHONE_SETUP.md                 # see PHONE SETUP SPEC
  ├── components.json                # shadcn config — base-nova style, neutral
  ├── docs/
  │   ├── BACKLOG.md                 # the source-of-truth backlog map
  │   ├── AI_ROUTING.md              # which AI does what + fallback policy
  │   ├── MONITORING.md              # ccusage + GH Actions cost tracking
  │   └── (others as the project grows)
  ├── e2e/                           # playwright tests (smoke, a11y)
  ├── eslint.config.mjs              # flat config extending next/core-web-vitals
  ├── mdx-components.tsx             # global MDX component overrides
  ├── next.config.ts                 # withMDX(...) wrapper, AVIF+WebP image formats
  ├── package.json                   # see DEPENDENCIES below
  ├── playwright.config.ts
  ├── postcss.config.mjs             # `@tailwindcss/postcss` only
  ├── public/                        # logo, favicon, OG fallback
  ├── scripts/
  │   ├── bootstrap-kanban.sh        # idempotent label + project init
  │   ├── triage-prompt.md           # the triage agent's playbook
  │   ├── execute-prompt.md          # the execute agent's playbook
  │   └── gemini-triage.py           # Gemini fallback when Claude quota dry
  ├── src/
  │   ├── __tests__/                 # vitest unit tests
  │   ├── app/
  │   │   ├── globals.css            # Tailwind v4 @theme tokens
  │   │   ├── layout.tsx             # root layout, font setup
  │   │   ├── page.tsx               # home
  │   │   ├── opengraph-image.tsx    # programmatic OG
  │   │   ├── robots.ts
  │   │   ├── sitemap.ts
  │   │   ├── llms.txt               # llmstxt.org-style discovery file
  │   │   ├── not-found.tsx
  │   │   └── (one folder per page in {{PAGE_LIST}})
  │   ├── components/
  │   │   ├── layout/                # nav, footer, page shells
  │   │   ├── primitives/            # styled wrappers around Base UI
  │   │   ├── sections/              # hero, feature grid, CTA bands
  │   │   └── ui/                    # shadcn-generated atoms
  │   ├── content/                   # ALL site copy as TS modules + MDX
  │   │   ├── README.md              # index of content files
  │   │   └── (one .ts per page; insights/ for MDX articles)
  │   ├── hooks/
  │   └── lib/
  │       ├── site-config.ts         # business name, contact, scheduler, nav
  │       ├── themes.ts              # palette presets if multi-theme
  │       ├── mdx.ts                 # MDX frontmatter loader
  │       └── utils.ts               # cn() + small helpers
  ├── tsconfig.json                  # strict, paths: { "@/*": ["./src/*"] }
  ├── vercel.json                    # ignoreCommand for non-source-only changes
  └── vitest.config.ts

------------------------------------------------------------------
DEPENDENCIES — package.json
------------------------------------------------------------------

Match these versions (current as of late-2026 stack). Use `npm install`
not yarn/pnpm. Do not add anything not listed here without asking.

  dependencies:
    @base-ui/react           ^1.4.x
    @hookform/resolvers      ^5.2.x
    @mdx-js/loader           ^3.1.x
    @mdx-js/react            ^3.1.x
    @next/mdx                ^16.2.x
    @types/mdx               ^2.0.x
    class-variance-authority ^0.7.x
    clsx                     ^2.1.x
    gray-matter              ^4.0.x
    lucide-react             ^1.8.x
    next                     16.2.x
    react                    19.2.x
    react-dom                19.2.x
    react-hook-form          ^7.73.x
    rehype-autolink-headings ^7.1.x
    rehype-slug              ^6.0.x
    remark-gfm               ^4.0.x
    schema-dts               ^2.0.x
    shadcn                   ^4.4.x
    tailwind-merge           ^3.5.x
    tw-animate-css           ^1.4.x
    zod                      ^4.3.x

  devDependencies:
    @axe-core/playwright     ^4.11.x
    @playwright/test         ^1.59.x
    @tailwindcss/postcss     ^4
    @types/node              ^20
    @types/react             ^19
    @types/react-dom         ^19
    @vitest/coverage-v8      ^4.1.x
    eslint                   ^9.39.x
    eslint-config-next       ^16.2.x
    prettier                 ^3.8.x
    prettier-plugin-tailwindcss ^0.7.x
    tailwindcss              ^4
    typescript               ^5
    vitest                   ^4.1.x

  scripts:
    dev:        "next dev"
    build:      "next build"
    start:      "next start"
    lint:       "eslint ."
    type-check: "tsc --noEmit"
    format:     "prettier --write \"src/**/*.{ts,tsx,md,mdx,css}\""
    test:unit:  "vitest run"
    test:e2e:   "playwright test"
    test:       "vitest run"

------------------------------------------------------------------
DESIGN SYSTEM — invent, don't copy
------------------------------------------------------------------

Pick a 4-token palette appropriate for {{VISUAL_MOOD}} and {{INDUSTRY}}.
Define both light and dark values. Render in `src/app/globals.css` via
Tailwind v4 `@theme` syntax. Required token names:

  --color-canvas        # page background
  --color-ink           # primary text
  --color-parchment     # secondary surface (cards, callouts)
  --color-accent        # link / CTA
  --color-accent-deep   # hover / pressed
  --color-border-subtle

Map them to Tailwind utilities (`bg-canvas`, `text-ink`, `border-border-subtle`,
etc.) via `@theme inline` so the same names appear in JSX.

Type: fluid via `clamp()` so type scales 375→1920 without breaking. Provide
named utilities `text-display-xl`, `text-display-lg`, `text-h1`…`text-caption`,
plus `text-label` (mono uppercase micro-label). Self-host the three fonts
via `next/font/google`.

Accessibility commitments to wire in from day one:
  - All interactive elements keyboard-accessible with visible focus rings.
  - `prefers-reduced-motion` respected on every animation.
  - Lighthouse target ≥ 90 across Performance / Accessibility / Best Practices / SEO.
  - Add an axe-playwright smoke test that fails CI on serious or critical violations.

------------------------------------------------------------------
CONTENT MODEL
------------------------------------------------------------------

All copy lives in `src/content/`. Two flavours:

  1. **Page copy** — one TypeScript file per page, exporting a typed object
     so the JSX consumes static strings, not magic literals. Example:
     `src/content/home.ts` exports `{ hero: {...}, sections: [...] }`.
  2. **Long-form articles** — MDX in `src/content/insights/` (or whatever
     plural noun fits the industry — "case-studies", "field-notes", etc.).
     Frontmatter must include: title, excerpt, category, date (YYYY-MM-DD),
     readingTime (minutes, integer). Adding a new file should publish
     a new article without further wiring — the index page reads the
     directory at build time.

Keep `src/content/README.md` as a hand-maintained index pointing to each file
so a non-developer operator can find what to edit.

`src/lib/site-config.ts` holds: business name, tagline, primary CTA URL,
contact email, social handles, navigation labels. Importing this is the
ONLY way components should reference these values.

------------------------------------------------------------------
WORKFLOW SPEC — .github/workflows/
------------------------------------------------------------------

All workflows must include `permissions:` with the minimum scopes needed.
Default-deny; never use `permissions: write-all`. All Claude steps must
use the operator's `CLAUDE_CODE_OAUTH_TOKEN` secret, NOT an `ANTHROPIC_API_KEY`
(the OAuth token bills against the Pro/Max subscription instead of API
credits). Pin `anthropics/claude-code-action@v1`.

triage.yml
  trigger:    schedule: cron '0 * * * *'   # hourly; Gemini fallback keeps it cheap
              workflow_dispatch
              issues: types: [opened, reopened]
  permissions: contents: read | issues: write | pull-requests: write | id-token: write
  concurrency: group: triage-runtime, cancel-in-progress: false
  steps:
    1. checkout
    2. anthropics/claude-code-action@v1 with model claude-haiku-4-5-20251001,
       max-turns 40, continue-on-error: true, settings restricting permissions
       to {Bash, Read, Grep, Glob}. Prompt = "Read scripts/triage-prompt.md
       and follow it exactly."
    3. python3 scripts/gemini-triage.py — always runs; it exits early if the
       triage queue is empty. Provides Gemini Flash fallback when Claude is
       quota-throttled or errored. Requires GEMINI_API_KEY secret.

execute.yml
  trigger:    schedule: cron '0 */4 * * *'   # 6 runs/day
              workflow_dispatch
  permissions: contents: write | issues: write | pull-requests: write | id-token: write
  concurrency: group: claude-runtime, cancel-in-progress: false
  steps:
    1. checkout (fetch-depth: 0)
    2. setup-node@v4 with node 20, npm cache
    3. npm ci
    4. configure git identity ("claude-auto" / "claude-auto@users.noreply.github.com")
    5. inline python3 picker that:
       - calls `gh issue list --label auto-routine --state open ...`
       - excludes labels: human-only, manual-only, status/blocked,
         status/in-progress, status/needs-clarification,
         status/awaiting-review, status/on-hold
       - sorts by priority/* (P1<P2<P3) then complexity/* then createdAt
       - emits the chosen issue # and the implementation model (always
         Sonnet — model/* labels record complexity, but execute.yml always
         implements with claude-sonnet-4-6; Opus is reserved for the
         planning pass in execute-complex.yml).
       - emits issue=0 if nothing eligible — subsequent step short-circuits.
    6. anthropics/claude-code-action@v1 with the chosen model, max-turns 80,
       prompt = "Issue #N has been pre-selected for you. ISSUE_NUMBER is in
       env. Read scripts/execute-prompt.md and implement that specific
       issue." Settings allow {Bash, Read, Write, Edit, Glob, Grep}.

execute-complex.yml
  trigger:    workflow_dispatch with inputs:
                issue (string, optional — auto-picks top P1 manual-only if blank)
                model_override (choice; default empty = use the issue's model/* label)
  Same plumbing as execute.yml, plus a preceding "Opus planning" step that
  drafts a plan as a comment on the issue, then the Sonnet implementation
  step picks up using that plan.

execute-single.yml
  trigger:    workflow_dispatch with required input issue_number
  Bypasses the cron eligibility filter — operator's manual override.

auto-merge.yml (OPTIONAL, off by default)
  trigger:    pull_request: types: [labeled]
  When a PR has both `auto-routine` AND green required checks, enable
  auto-merge with squash. Default this file to disabled by leaving the
  trigger commented out — the operator opts in by uncommenting.

project-sync.yml
  trigger:    issues: types: [labeled, unlabeled, closed, reopened]
              pull_request: types: [opened, closed]
  Mirrors issue status labels into Project v2 columns via gh-cli graphql.

ai-smoke-test.yml
  trigger:    schedule: cron '0 12 * * 1'   # weekly Monday noon UTC
              workflow_dispatch
  Pings each provider with "reply pong"; fails if any responds incorrectly.
  Uses CLAUDE_CODE_OAUTH_TOKEN, GEMINI_API_KEY, OPENAI_API_KEY.

------------------------------------------------------------------
SCRIPTS — verbatim port + adapt
------------------------------------------------------------------

scripts/triage-prompt.md
  The triage agent's full playbook. Includes:
  - P1 fast-path mode (handles the issues.labeled trigger for priority/P1).
  - Eligibility rules.
  - Priority rubric (P1/P2/P3 with concrete criteria).
  - Complexity rubric (trivial/easy/medium/complex) → mapped model labels.
  - Area + work-type taxonomies (rename `area/business-lumivara` etc. to
    fit the new business — do not keep "lumivara" / "HR" labels).
  - Auto-routine vs human-only gating.
  - "Cap yourself at 10 issues per run."
  - Title/body reformatting standards.
  - Session-budget pacing reminder (50% / 80% checkpoints).

scripts/execute-prompt.md
  The execute agent's full playbook. Includes:
  - Read $ISSUE_NUMBER from env; exit cleanly if 0.
  - Mark in-progress, create branch `auto/issue-<n>`.
  - Hard exclusions: NEVER touch .github/workflows/*, .env*, scripts/*,
    package.json dependency upgrades, contact API endpoint, or delete
    pages/components without human sign-off.
  - Commit format: `feedback(#N): <summary>`
  - PR opened with `Fixes #N`, label `auto-routine`. NEVER auto-merge.
  - Update issue: remove status/in-progress, add status/awaiting-review,
    comment "PR: #M. Review and merge to close."
  - Failure handling: needs-clarification path; lint/typecheck baseline-vs-main
    procedure for distinguishing pre-existing tech debt from regressions.
  - Vercel parity: any change touching env vars, build commands, rewrites,
    redirects, output config must add `**Vercel mirror required:**` section
    to PR body and add `needs-vercel-mirror` label to the issue.

scripts/gemini-triage.py
  Gemini-2.5-Flash REST-API fallback for triage. Reads GEMINI_API_KEY,
  uses GH_TOKEN to query/update issues. Idempotent: exits early if no
  status/needs-triage items remain.

scripts/bootstrap-kanban.sh
  Idempotent bash script that:
  - Verifies `gh auth status`.
  - Creates the full label set (priority/, complexity/, model/, area/, type/,
    status/, gating). Use the same color hex per family for navigability:
      priority/P1   B60205   priority/P2   D93F0B   priority/P3   FBCA04
      complexity/*  C5DEF5
      model/*       D4C5F9
      area/*        BFD4F2
      type/*        0366D6
      status/*      EDEDED   (planned/in-progress/awaiting-review/blocked/
                              needs-clarification/needs-triage/on-hold/
                              needs-continuation)
      auto-routine  0E8A16   human-only       D93F0B
      manual-only   FFA500   needs-vercel-mirror C5DEF5
  - Prints next-step checklist (Project v2 board creation, secrets, etc.).

------------------------------------------------------------------
CHARTER — paste verbatim into AGENTS.md
------------------------------------------------------------------

Three sections, each between BEGIN/END HTML comment markers so future
edits can target one without disturbing the others:

  <!-- BEGIN:nextjs-agent-rules -->
  # This is NOT the Next.js you know
  This version has breaking changes — APIs, conventions, and file structure
  may all differ from your training data. Read the relevant guide in
  `node_modules/next/dist/docs/` before writing any code. Heed deprecation
  notices.
  <!-- END:nextjs-agent-rules -->

  <!-- BEGIN:session-budget-charter -->
  # Session-budget charter (highest priority)
  [Full text — adapt the project name. Self-pacing rules: 50% used → finish
  current unit + commit + stop; 80% used → hard exit + status/needs-continuation
  label. Across runs: triage cap 5–10 issues/run; execute ONE issue/run with
  draft-PR fallback at 60%. Interactive sessions: phase remaining work into
  Inbox issues if user says "wrap up". Tracking: surface total_cost_usd and
  num_turns from the action JSON output.]
  <!-- END:session-budget-charter -->

  <!-- BEGIN:vercel-parity -->
  # Vercel production parity
  Any change in this repo that influences production behaviour — env vars,
  build commands, Next.js rewrites/redirects, or output configuration —
  must also be applied manually in the Vercel dashboard by the operator.
  PRs that need this must include a `**Vercel mirror required:**` section
  and add the `needs-vercel-mirror` label to the issue.
  <!-- END:vercel-parity -->

CLAUDE.md is a single line: `@AGENTS.md` (loads the charter into every
Claude Code session in this repo).

------------------------------------------------------------------
README SPEC
------------------------------------------------------------------

Two-audience README:

  Section 1 — "In plain English"
    For the operator (non-developer). Explain the loop in 5 numbered steps:
    capture from phone → daily triage → 6×daily execute → review on phone →
    tap merge. End with "Your laptop can be off the entire time."

  Section 2 — "For developers"
    Tech stack, run instructions (Node 20+, `npm install`, `npm run dev`),
    where to edit things (link to `src/content/`, `src/lib/site-config.ts`,
    public/ for logo/favicon), design system token table, accessibility &
    performance commitments, deployment (Vercel auto from main; previews
    per PR), revision log table.

Use the live URL placeholder `https://{{VERCEL_PROJECT}}.vercel.app` until
the production domain is wired.

------------------------------------------------------------------
PHONE SETUP SPEC — PHONE_SETUP.md
------------------------------------------------------------------

Two sections — Android (HTTP Shortcuts) and iOS (Apple Shortcuts) — both
covering the same flow:

  1. Mint a fine-grained PAT scoped to ONLY this repo, with minimum
     permissions: Issues: Read+Write, Metadata: Read, Actions: Read+Write
     (only if the operator wants the optional manual-trigger shortcut).
     Expiration: 90 days; calendar a rotation.
     Recommend the two-token split (Issues-only PAT + Actions-only PAT)
     for smaller blast radius if the phone is lost.
  2. Build the shortcut: POST to
     `https://api.github.com/repos/{{GH_OWNER}}/{{GH_REPO}}/issues`
     with a JSON body
       { "title": "{priority} — {title}", "body": "...\n\n_Captured from phone._",
         "labels": ["status/needs-triage"] }
     Headers: Authorization: Bearer <PAT>, Accept: application/vnd.github+json,
     X-GitHub-Api-Version: 2022-11-28.
  3. Optional second shortcut: POST to
     `/repos/.../actions/workflows/triage.yml/dispatches` with body
     `{"ref":"main"}` to force-run triage right after capturing.
  4. Smoke test recipe (P3 dummy, expect HTTP 201, expect new issue in UI).
  5. Troubleshooting: 401/403 → PAT scope wrong; 404 → repo slug; 422 →
     malformed JSON.

Also document the Apple Shortcuts equivalent — same JSON shape, different
UI primitives (Get Contents of URL, Dictionary).

------------------------------------------------------------------
MULTI-AI ROUTING — docs/AI_ROUTING.md
------------------------------------------------------------------

Make it explicit which AI is used where, with a fallback policy. Use this
table verbatim, then explain the secrets needed:

  Triage / classification:           Claude Haiku  → Gemini 2.5 Flash
  Implementation (code edits):       Claude Sonnet → defer to next run
  Planning (architecture, strategy): Claude Opus   → wait for availability
  Trivial edits (typos, single-line): Claude Haiku → Gemini 2.5 Flash-Lite
  Large-context reads (audit, bulk):  Gemini 2.5 Pro (1M ctx) → Sonnet chunked
  Content generation (drafts):        Gemini 2.5 Pro → Claude Sonnet
  Code review on PR diff:             OpenAI gpt-4o-mini → Gemini 2.5 Flash

Secrets required (Settings → Secrets → Actions):
  CLAUDE_CODE_OAUTH_TOKEN  — get via `claude setup-token` locally
  GEMINI_API_KEY           — https://aistudio.google.com/apikey (free tier)
  OPENAI_API_KEY           — https://platform.openai.com/api-keys (paid)

Every workflow that calls Claude must set `continue-on-error: true` on the
Claude step and have a Gemini/OpenAI fallback step that detects unfinished
work. (Implementation is the exception — code edits stay Claude-only and
just defer to the next cron if Claude fails.)

Model IDs to bake in (current as of late-2026):
  claude-opus-4-7            claude-sonnet-4-6           claude-haiku-4-5-20251001
  gemini-2.5-pro             gemini-2.5-flash            gemini-2.5-flash-lite
  gpt-4o-mini                gpt-4o

Add a "Review cadence" note: revisit this table every ~2 months.

------------------------------------------------------------------
docs/BACKLOG.md SPEC
------------------------------------------------------------------

Single source of truth for the backlog system. Includes:
  - Capture / triage / execute / ship summary.
  - Full label table (priority, complexity, model, area, type, status, gating,
    cron-eligibility) with meanings.
  - Project v2 column layout (Inbox / Triaged / In Progress / Review / Done)
    and the "Auto-add to project" workflow toggle to enable.
  - "Writing a good issue" examples: one self-contained good example, one bad
    example. P1/P2/P3 prefix in title is a hint to triage.
  - Reverting recipe: `git log --grep '^feedback(#'` then `git revert <sha>`.
  - Manual triggers table.
  - "When to bypass the bot" rules.
  - Cost / usage tuning levers.

------------------------------------------------------------------
docs/MONITORING.md SPEC
------------------------------------------------------------------

How the operator watches Claude quota and CI cost:
  - `npx ccusage@latest` for local + CI rollup.
  - `gh run list` recipe for action history.
  - The total_cost_usd / num_turns surfaced in each Claude action's JSON
    output, and where to find it in the GitHub UI.
  - When to throttle: cron cadence, raising the auto-routine bar, full
    pause via `cron: '0 0 1 1 *'`.

------------------------------------------------------------------
WHAT NOT TO DO
------------------------------------------------------------------

  - DO NOT carry over any Lumivara / HR-consulting copy. The structure
    transfers; the words don't.
  - DO NOT keep `area/business-lumivara` or `type/business-hr` labels.
    Replace with `area/business-{{BUSINESS_SLUG}}` and an industry-relevant
    type if needed.
  - DO NOT write a `tailwind.config.{js,ts}` — Tailwind v4 doesn't use one.
  - DO NOT install `tailwindcss-animate` — use `tw-animate-css`.
  - DO NOT pin to Next.js 14/15 syntax. Verify against the docs in
    `node_modules/next/dist/docs/` before every API call you're not 100%
    sure about.
  - DO NOT push to the remote until I confirm the directory tree looks right.
  - DO NOT enable `auto-merge.yml` by default — the operator should opt in.
  - DO NOT scaffold a contact API endpoint yet (mark it as a follow-up issue
    after launch — high-stakes, deserves human review).

------------------------------------------------------------------
WORKING APPROACH
------------------------------------------------------------------

Phase the work in this order, committing each phase locally:

  Phase 0 — `npm init` skeleton, install deps, scaffold tsconfig + next.config
            + globals.css + minimal layout + page. Verify `npm run dev` boots.
            Commit: "phase-0: scaffold next 16 + tailwind v4 + base config"
  Phase 1 — Design system: tokens in globals.css, font setup in layout, type
            scale, primitive shadcn components. Commit: "phase-1: design system + primitives"
  Phase 2 — Pages from {{PAGE_LIST}}, copy stubbed in src/content/, sections
            assembled in src/components/sections/. One commit per page.
  Phase 3 — Insights/articles MDX pipeline (content collection + index page).
            Commit: "phase-3: insights pipeline"
  Phase 4 — SEO surfaces: sitemap, robots, opengraph-image, llms.txt, JSON-LD.
            Commit: "phase-4: seo surfaces"
  Phase 5 — Tests: vitest unit smoke tests for utils/site-config; playwright
            e2e + axe-playwright a11y smoke. Commit: "phase-5: tests"
  Phase 6 — `.github/workflows/*` files + `scripts/*` files + the prompts.
            One commit per workflow. The triage and execute prompts are the
            critical ones — get those right.
  Phase 7 — `AGENTS.md`, `CLAUDE.md`, `README.md`, `PHONE_SETUP.md`,
            `docs/*` written for the new business. Commit: "phase-7: docs"
  Phase 8 — Run `npm run lint && npx tsc --noEmit && npm run build` clean.
            Fix anything that breaks. Commit any fixes individually.

After phase 8, STOP and print a checklist of operator-side setup steps that
remain: GitHub repo creation, secret upload, Vercel project link, phone
shortcut wiring, label bootstrap script run, Project v2 board creation.
DO NOT push.

Throughout: when you hit a Next.js 16 API question, READ the docs file in
`node_modules/next/dist/docs/` rather than guessing. When you hit a Tailwind
v4 question, the answer is almost always "via @theme in globals.css, not
in a config file".

If you hit ~50% of your max-turns budget, finish the current phase, commit,
and stop. The operator will continue with a fresh session.

=========================== END PROMPT ===========================
```

---

## Section B — Operator setup checklist (the parts Claude can't do)

These steps require a human at a browser/terminal. Do them in roughly this
order; the prompt-run in Section A can happen in parallel with the GitHub
and Vercel work in steps 1–4.

### 1. Create the GitHub repo

```bash
gh repo create {{GH_OWNER}}/{{GH_REPO}} --private --description "{{ONE_LINE_DESCRIPTION}}"
git clone https://github.com/{{GH_OWNER}}/{{GH_REPO}}.git
cd {{GH_REPO}}
```

You'll point Claude at this empty directory in step 5.

### 2. Add the four repo secrets

Settings → Secrets and variables → Actions → New repository secret.

| Secret | Where it comes from |
|---|---|
| `CLAUDE_CODE_OAUTH_TOKEN` | Run `claude setup-token` in your terminal — paste the output. Same token across all your Pro-quota projects. |
| `GEMINI_API_KEY` | https://aistudio.google.com/apikey (free tier). Used by `gemini-triage.py` fallback and the smoke test. |
| `OPENAI_API_KEY` | https://platform.openai.com/api-keys (paid; only needed if you use the OpenAI code-review fallback). |
| `GITHUB_TOKEN` | Auto-provided by Actions — no setup needed. |

### 3. Wire Vercel

1. https://vercel.com/new → Import the GitHub repo you just created.
2. Framework preset: **Next.js**. No env vars required at first.
3. Production branch: `main`. Preview branches: all PRs.
4. Settings → Git → enable "Comment on Pull Requests" so the preview URL
   shows up on every auto-PR (this is how you review from your phone).
5. Once live, copy the production URL into `src/lib/site-config.ts`
   (`siteUrl`) and into `NEXT_PUBLIC_SITE_URL` in Vercel's env-var UI for
   Production + Preview environments.

### 4. Mint the phone PAT

Follow the recipe inside the generated `PHONE_SETUP.md`. The PAT is fine-grained,
scoped to the new repo only, with `Issues: Read+Write` (and optionally `Actions: Read+Write`
for the manual-trigger shortcut). Set 90-day expiration and calendar a rotation.

Store it inside HTTP Shortcuts (Android) or Apple Shortcuts (iOS) as a
protected variable. Test by capturing a P3 dummy issue from your phone —
you should see HTTP 201 and a new issue in the GitHub UI.

### 5. Run the prompt

Open the empty repo in Claude Code (`claude` from inside the directory),
switch to the Opus model (`/model opus` or set `--model claude-opus-4-7`),
paste the entire Section A prompt with placeholders filled in, and let it
work through phases 0–8. Expect 1–3 hours of agent time depending on how
many pages are in `{{PAGE_LIST}}`.

When it stops at "STOP and print a checklist", review the local commits
(`git log --oneline`), spot-check `npm run dev` boots, then push:

```bash
git push -u origin main
```

### 6. Bootstrap the labels and Project board

```bash
bash scripts/bootstrap-kanban.sh
```

Then in the GitHub UI: Projects → New project → Board layout. Name it
`{{BUSINESS_NAME}} Backlog`. Add the columns Inbox / Triaged / In Progress / Review / Done.
In Project Settings → Workflows, enable **Auto-add to project** for the new repo.

### 7. Smoke-test the bot loop

1. Capture a trivial issue from your phone ("Add a Toronto timezone to the
   footer", or whatever fits the new business).
2. Manually trigger triage if you don't want to wait for the cron:
   `gh workflow run triage.yml`
3. Wait for triage to label it. Then trigger execute:
   `gh workflow run execute.yml`
4. Within ~10 minutes you should see a PR open with `Fixes #N`. Vercel
   should comment a preview URL on it within ~60 seconds of the push.
5. Open the PR on the GitHub mobile app, verify the preview, tap merge.
   Production should redeploy within ~90 seconds.

If any step fails, the Action's run log is the first place to look.

### 8. (Optional) Enable auto-merge for green PRs

Edit `.github/workflows/auto-merge.yml`, uncomment the trigger block, push.
From then on, any auto-routine PR with green required checks will
auto-squash-merge — useful once you trust the bot.

---

## Identity / authentication notes

The intent is that **all these projects share one operator identity** so the
single Claude Pro/Max OAuth token works across them. Concretely:

- The same GitHub user (`{{OPERATOR_HANDLE}}`) owns every repo and is the
  default assignee on `human-only` issues.
- The same `CLAUDE_CODE_OAUTH_TOKEN` secret is uploaded to every repo. They
  all bill against the same 5-hour rolling Pro/Max quota — so spinning up
  a second active project effectively halves the headroom for both. See
  the Session-budget charter in `AGENTS.md` for how each agent self-paces
  to stay under quota.
- Vercel projects can also live under the same Vercel personal account.
  Each gets its own preview URL space and production domain.
- Phone PATs are per-repo (don't reuse one PAT across repos — narrower
  blast radius if the phone is lost).

If you want to host a project for a *third party* (e.g., a paying client)
under their own GitHub org / Vercel account / Pro quota, the same prompt
works — just substitute their owner handle and they upload their own
`CLAUDE_CODE_OAUTH_TOKEN`. The only thing they need from you is the prompt
itself.

---

## Maintenance — keeping this prompt current

This document is a snapshot. Things that drift, in rough order of how often:

1. **Model IDs** — Anthropic / Google / OpenAI rev these every few months.
   When you bump, update both the prompt body (Section A → "Model IDs to
   bake in") and `docs/AI_ROUTING.md` in the source repo.
2. **Next.js / Tailwind versions** — major Next releases routinely break
   conventions; bump the version pins in the DEPENDENCIES block when you
   move this repo to a new major.
3. **GitHub Actions** — `anthropics/claude-code-action` bumps occasionally;
   pin to a major (`@v1`) and update when you've tested locally.
4. **Free-tier limits** — Gemini's request-per-day caps shift. Re-verify
   before quoting them in `AI_ROUTING.md`.

A good cadence is to re-run this prompt against an empty repo every ~6 months
and diff the output against the live source repo — you'll spot stale
recommendations quickly that way.
