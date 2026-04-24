## Goal
Build a password-protected `/admin` page on the Lumivara site that replaces HTTP Shortcuts for mobile backlog management. Provides a clean UI to view, filter, and trigger actions on GitHub Issues and Actions — all from a phone browser.

## Why
HTTP Shortcuts requires raw JSON construction and has no visual feedback. A native `/admin` page gives a better UX with no additional app to install, works on any phone browser, and can be designed to match the Lumivara aesthetic.

## Authentication
Environment variable `ADMIN_PASSWORD` (set in Vercel). The page checks a session cookie. If the cookie is absent or wrong, render a password form. On correct password, set a `lumivara-admin` cookie (httpOnly, sameSite=strict, 7-day expiry) and redirect to the dashboard.

Implement as a Next.js middleware check on `/admin/*` routes, or as a simple server action on the page itself.

## Page layout — three tabs

### Tab 1: Queue
Lists open issues labeled `auto-routine` + `status/planned`, sorted by priority (P1 first) then date.

Each row:
- Issue number + title
- Priority badge (P1/P2/P3, color-coded)
- Complexity badge (trivial/easy/medium/complex)
- Two buttons: `Execute this` (triggers execute-single.yml via GitHub API) | `View on GitHub` (opens issue in new tab)

"Execute this" button POSTs to `/admin/api/execute` server action which calls:
```
POST https://api.github.com/repos/palimkarakshay/lumivara-site/actions/workflows/execute-single.yml/dispatches
{ "ref": "main", "inputs": { "issue": "N" } }
```
Using `GITHUB_ACTIONS_PAT` server-side env var (never exposed to client).

### Tab 2: PRs
Lists open PRs labeled `auto-routine`, sorted by priority of linked issue.

Each row:
- PR number + title
- Status: Vercel check state (pending/success/failure) — fetch from GitHub Checks API
- Button: `Merge` (triggers merge API) | `View diff`

### Tab 3: Controls
Four buttons in a 2x2 grid:
- `Run Triage` — triggers triage.yml dispatch
- `Run Execute` — triggers execute.yml dispatch
- `Run Complex` — triggers execute-complex.yml dispatch
- `View Actions` — opens GitHub Actions tab in new tab

Plus a read-only box showing: last triage run time, last execute run time, open PR count, open issue count.

## Files to create
- `src/app/admin/page.tsx` — main dashboard (server component, redirects to login if no cookie)
- `src/app/admin/login/page.tsx` — password form
- `src/app/admin/api/execute/route.ts` — server action to trigger execute-single
- `src/app/admin/api/dispatch/route.ts` — server action to trigger any workflow by name
- `src/middleware.ts` (or update existing) — protect /admin/* routes
- `src/components/admin/QueueTable.tsx`, `PRTable.tsx`, `ControlPanel.tsx` — client components

## Env vars needed
- `ADMIN_PASSWORD` — set in Vercel, never committed
- `GITHUB_ACTIONS_PAT` — server-only PAT with `Actions:Write` and `Issues:Read`

## Demo / placeholder data
If GitHub PAT is not set, show a mock queue with 3 sample issues so the UI is visible during development.

## Definition of done
- [ ] `/admin` redirects to `/admin/login` if not authenticated
- [ ] Correct password sets cookie and shows dashboard
- [ ] Queue tab shows real issues from GitHub API
- [ ] Execute button triggers the workflow and shows a success toast
- [ ] Controls tab buttons trigger the corresponding workflow
- [ ] Works on iPhone Safari (mobile-first layout)
- [ ] TypeScript clean, lint passes
- [ ] `/admin` routes are NOT indexed (add to robots.ts exclusions)
