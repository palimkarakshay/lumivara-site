# Feedback Log

Source of truth for all change requests. Add items from anywhere (phone, desktop, pairing session); the automation triages them into phases.

## How to write an entry

Each row is a pipe table. Columns: `Date | Source | Item | Tags | Status`.

**Tags** — square-bracket tokens, combine freely:
- Priority: `[P1]` (urgent), `[P2]` (soon), `[P3]` (whenever)
- Complexity: `[trivial]`, `[easy]`, `[medium]`, `[complex]`
- Area (optional): `[site]`, `[content]`, `[infra]`, `[copy]`, `[design]`, `[seo]`, `[a11y]`, `[perf]`

**Status** — one of:
- `New` — just landed, not yet reviewed
- `Planned` — accepted, sitting in a Phase bucket, not started
- `In Progress` — Claude or a human is actively on it
- `Blocked` — waiting on something (note why in the Item)
- `Done` — finished; will be archived on next triage
- `Dropped` — declined; kept for audit

## How triage works

Run the **Triage Feedback** workflow (Actions tab → workflow_dispatch) any time — typically once a day. It:
1. Reads every row in *Inbox*.
2. Moves rows tagged `[P1]` → *Phase 1*, `[P2]` → *Phase 2*, `[P3]` → *Phase 3*. Untagged rows stay in Inbox.
3. Moves any row with Status `Done` or `Dropped` into the *Archive* section at the bottom (collapsed).
4. Commits the reshuffled file.

## How phone capture works

HTTP Shortcuts on Android posts to GitHub's `repository_dispatch` endpoint. The **Append Feedback** workflow catches the event and appends the text to *Inbox* with today's date and `Status: New`. See [PHONE_SETUP.md](PHONE_SETUP.md).

## How to revert a change

Every feedback item is worked as its own commit (message format: `feedback(<id>): <item>`). To undo:

```
git revert <commit-sha>
git push
```

The item will re-appear in the Inbox via a manual re-add if you still want it reconsidered.

---

## Inbox

| Date | Source | Item | Tags | Status |
|------|--------|------|------|--------|
| 2026-04-23 | Akshay | Continue site polish — check prior transcript at `C:\Users\palimkara\.claude\projects\c--Lumivara\9120ffab-c839-4eef-833c-c5b63f92cc74.jsonl` for specific pending items (insights MDX seeding, perf pass, a11y audit, deploy target). | [P1][medium][site] | Planned |
| 2026-04-23 | Akshay | Monitor Claude session usage manually; when a working session approaches 80%, ask Claude to checkpoint and phase remaining work into Inbox items rather than push on. (Claude cannot introspect its own token usage.) | [P2][trivial][infra] | Planned |
| 2026-04-23 | Akshay | Consider LLM-based triage upgrade — Action calls Claude API to auto-rank new Inbox rows by priority/complexity when manual tagging is skipped. Defer until tag-based triage feels insufficient. | [P3][medium][infra] | Planned |
| 2026-04-23 | Phone | test from phone | test | New |
| 2026-04-23 | Phone | test akshay |  | New |

## Phase 1 — Urgent

| Date | Source | Item | Tags | Status |
|------|--------|------|------|--------|

## Phase 2 — Soon

| Date | Source | Item | Tags | Status |
|------|--------|------|------|--------|

## Phase 3 — Whenever

| Date | Source | Item | Tags | Status |
|------|--------|------|------|--------|

---

<details>
<summary>Archive (Done / Dropped)</summary>

| Date | Source | Item | Tags | Status |
|------|--------|------|------|--------|
| 2026-04-23 | Akshay | Rebuild Feedback.md with UTF-8 encoding and structured schema (Inbox + Phase buckets + Archive). | [P1][easy][infra] | Done |
| 2026-04-23 | Akshay | Rewrite `append_feedback.yml` to avoid shell injection, pull-rebase before push, route payloads into Inbox with escaped table cells. | [P1][medium][infra] | Done |
| 2026-04-23 | Akshay | Add `triage_feedback.yml` — tag-based phasing workflow (workflow_dispatch). | [P1][medium][infra] | Done |
| 2026-04-23 | Akshay | Add `PHONE_SETUP.md` — Android HTTP Shortcuts walkthrough for posting feedback from phone. | [P1][easy][infra] | Done |
| 2026-04-23 | Akshay | Update README with Revision Log section and revert recipe. | [P2][easy][infra] | Done |

</details>
