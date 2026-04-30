## Linked issue

Fixes #

<!-- One of Fixes / Closes / Resolves followed by the issue number. auto-merge.yml's regex looks for this; without it, auto-merge stays disabled. -->

## Summary

<!-- 1-3 bullets on what changed and why. The "why" is the part the reviewer cares about. -->

-

## Definition of done

- [ ] `npx tsc --noEmit` passes
- [ ] `npm run lint` passes
- [ ] Issue-specific DoD checks satisfied (copy from the linked issue's "Definition of done" section)
- [ ] Visually checked on Vercel preview URL (Vercel posts the URL as a PR comment)
- [ ] No secrets or `.env` values committed
- [ ] Dual-Lane Repo compliance verified — for infra / workflow / scripts / dashboard / n8n changes, walk the relevant MUST / MUST-NOT rows in [`docs/mothership/dual-lane-enforcement-checklist.md`](../docs/mothership/dual-lane-enforcement-checklist.md). N/A is fine; tick once confirmed.

## Vercel mirror required?

<!-- Per AGENTS.md "Vercel production parity": if this PR changes env vars, build commands, Next.js rewrites/redirects, or output configuration, list the operator-side dashboard steps below and add the `needs-vercel-mirror` label. Otherwise delete this section. -->

- [ ] No Vercel-side mirror required, OR
- [ ] Vercel mirror steps:
  -
  -

## Codex review status

<!-- Filled in by codex-review.yml when it posts its review. Leave this section as-is on PR open; Codex appends to it. -->

_Pending Codex review (codex-review.yml runs on every PR open / synchronize)._

## Notes for reviewer

<!-- Anything the reviewer should know — design decisions, caveats, what's not in scope. -->
