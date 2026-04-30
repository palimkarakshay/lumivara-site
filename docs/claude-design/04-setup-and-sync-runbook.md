# 04 — Setup and sync runbook

> _Lane: 🛠 Pipeline — operator runbook. The click-by-click steps for setting up each Claude Design project, the manual sync protocol when DESIGN.md changes, and the one-time spinout migration._

This runbook assumes:

- The operator has read [`01-decision-and-frame.md`](./01-decision-and-frame.md). It explains *why* the steps below are shaped the way they are.
- The operator runs on a Claude Max 20x subscription (already covers Pro features that Claude Design needs).
- This repo is in its pre-spinout co-housed state (Site + Pipeline lanes share a single git tree).

---

## §1 — Anthropic account prep (one-time)

1. Sign into Claude (`claude.ai`) with the operator account that holds the Max 20x subscription.
2. Navigate to `claude.ai/design`. First visit prompts a Labs-product onboarding — accept the data-handling disclosure but **note** that the Help Center explicitly states there is no audit-log support yet (per [`01 §2c`](./01-decision-and-frame.md)). Treat every project as if its content could be queried by Anthropic for product improvement, not just for your single session.
3. Confirm the account-level project list is empty (or contains only experimental projects you can clean up). The two production projects below should each have a clean origin.

If a Team / Enterprise tier ever replaces the Max 20x: the Team admin guide (Help Center) covers SSO, project-isolation policies, and audit-log toggles when those land. Until then, single-operator account is the assumption.

---

## §2 — Set up the Site-lane project (per client)

**Project name:** `<client-slug>-site` — one project per client engagement. For Client #1 this is the site this repo will spin out into; the slug follows the spinout target repo name minus the `palimkarakshay/` prefix.

### Step-by-step

1. **Substitute placeholders in DESIGN.md.** Make a working copy of [`02-site-lane-DESIGN.md`](./02-site-lane-DESIGN.md), paste it into a scratch file (do **not** modify the canonical scaffold), and replace every `<CLIENT_*>` placeholder per the table below. Keep this scratch file local — it contains forbidden Client #1 brand strings that must not land in the operator-scope repo.

   | Placeholder | Source of truth | Notes |
   |---|---|---|
   | `<CLIENT_BRAND_NAME>` | The current engagement's brand (Client #1: lookup in [`../mothership/15-terminology-and-brand.md §7`](../mothership/15-terminology-and-brand.md)) | Used in §1, §2 role rules, §9 prompt stanza. |
   | `<CLIENT_DISPLAY_FONT>` | `next/font` config in [`../../src/app/layout.tsx`](../../src/app/layout.tsx) — the `display` font variable | Default for Client #1: Fraunces. |
   | `<CLIENT_BODY_FONT>` | Same source, `body` variable | Default for Client #1: Inter. |
   | `<CLIENT_MONO_FONT>` | Same source, `mono` variable | Default for Client #1: JetBrains Mono. |

2. **Create the Claude Design project.** In `claude.ai/design`, click **New project** and name it `<client-slug>-site`.

3. **Upload the substituted DESIGN.md.** Drag-drop the scratch file from step 1 into the project's "design system" area. Wait for the ingest banner to confirm parse success. If Claude Design generates a `colors_and_type.css` preview, accept it as the project's derived token set — but do **not** download and commit that file back to the repo. The repo's source of truth is [`../../src/app/globals.css`](../../src/app/globals.css), not Claude Design's derivative.

4. **Upload the supporting context (selective — see [`01 §4`](./01-decision-and-frame.md)).**
   - [`../../src/app/globals.css`](../../src/app/globals.css) — the live runtime tokens.
   - 2–3 high-resolution screenshots of already-built marketing pages (homepage hero, services page, pricing page). Capture in light mode at desktop width.
   - A zip of [`../../src/components/sections/`](../../src/components/sections/) only — not the full `src/`. Use `git archive HEAD -o /tmp/site-sections.zip src/components/sections/` to create a clean snapshot.

5. **Do NOT upload.** Anything under [`../../docs/`](../../docs/), [`../../dashboard/`](../../dashboard/), [`../../scripts/`](../../scripts/), [`../../.github/`](../../.github/), [`../../e2e/`](../../e2e/), or [`../../src/app/admin/`](../../src/app/admin/). The selective-upload rule in [`01 §4`](./01-decision-and-frame.md) is non-negotiable.

6. **Verify ingest.** Ask the project a probe question: *"Generate a 3-step 'How we work' section as a single React component using the brand tokens you've ingested."* Inspect the output:
   - Is the canvas the warm cream (`#f7f4ed`), not pure white?
   - Is the accent the amber-gold (`#c8912e`), used at most once?
   - Is the heading in a serif font?
   If any answer is no, the ingest is incomplete — re-upload DESIGN.md and check for parse warnings.

7. **Record the project URL.** Save the Claude Design project URL in your operator-private notes (not in this repo). Do not paste the URL into any committed file — Claude Design URLs may include opaque tokens.

---

## §3 — Set up the Pipeline-decks project

**Project name:** `lumivara-forge-decks` — single project, decks-only scope. This is the operator's brand, not a client's.

### Step-by-step

1. **No placeholder substitution needed.** The Pipeline-lane DESIGN.md ([`03-pipeline-lane-DESIGN.md`](./03-pipeline-lane-DESIGN.md)) uses the operator's own brand `Lumivara Forge` directly.

2. **Create the Claude Design project.** Name: `lumivara-forge-decks`.

3. **Upload the DESIGN.md.** Drag-drop `03-pipeline-lane-DESIGN.md` directly — no substitution needed.

4. **Upload the brand-reference artefact.** Upload the rendered [`../decks/06-master-deck.html`](../decks/06-master-deck.html) — the master deck is the visual reference for every other deck in the pack and is the single richest example of the "Editorial Restraint" system applied across 50+ slides.

5. **Do NOT upload.**
   - Any other deck source MD (those carry unverified claims, internal phase IDs, recipient names — operator IP).
   - [`../decks/00-INDEX.md`](../decks/00-INDEX.md) (operator-internal narrative).
   - Anything under [`../mothership/`](../mothership/), [`../research/`](../research/), [`../storefront/`](../storefront/), or [`../mothership/sales-verticals/`](../mothership/sales-verticals/) — all operator IP.
   - Any deck that is single-recipient and has been sent (`02-partner-deck.html`, `03-employee-deck.html`, `05-advisor-deck.html`) — those carry recipient-context that should not extend beyond the original send.

6. **Verify ingest.** Probe question: *"Generate a single 'Why now (3 numbers)' claim slide for an investor deck, using a 3-column Stat | Source | Implication table."* Inspect:
   - Slide background `#fafaf7`?
   - Headings in serif (Fraunces or fallback)?
   - h3 / `<strong>` / blockquote-border in `#b48a3c`?
   - Table at smaller body type, hairline borders, no shadow?
   If yes, ingest is good. If the output drops in icons or a coloured title-bar, the system prompt needs adjustment.

7. **Record the project URL** in operator-private notes. Same rule as Site lane.

---

## §4 — Sync protocol when DESIGN.md changes

The repo is the source of truth. Claude Design is downstream. Sync direction is always **repo → Claude Design**, never the reverse.

### Triggers that require a re-upload

| Repo change | Re-upload to | Frequency |
|---|---|---|
| [`../../src/app/globals.css`](../../src/app/globals.css) tokens change | Site project (every active client) | Per change |
| [`02-site-lane-DESIGN.md`](./02-site-lane-DESIGN.md) prose / role rules change | Site project (every active client) | Per change |
| Marp `style:` block in any deck under [`../decks/`](../decks/) changes | Decks project | Per change |
| [`03-pipeline-lane-DESIGN.md`](./03-pipeline-lane-DESIGN.md) prose changes | Decks project | Per change |
| D2 brand-name resolves (Lumivara Forge → new name) | Decks project + every Site project | Once, when D2 lands |
| New deck added to [`../decks/`](../decks/) | Decks project (upload new rendered HTML as additional reference) | Per addition |
| Site-lane component library shape changes meaningfully | Site project (re-zip [`../../src/components/sections/`](../../src/components/sections/)) | When [`../../src/components/sections/`](../../src/components/sections/) gains/loses 3+ components |

### The actual sync steps

1. Land the change as a normal repo PR. Run [`../../scripts/dual-lane-audit.sh`](../../scripts/dual-lane-audit.sh) — green is required.
2. After merge, check out `main` locally.
3. For each affected Claude Design project:
   - Open the project in `claude.ai/design`.
   - In the project's design-system area, click **Replace** on the existing DESIGN.md upload (don't add a second copy — the model averages multiple uploads).
   - Upload the freshly-substituted (Site) or directly-edited (Pipeline) DESIGN.md.
   - Re-run a probe question (see [`§2.6`](./04-setup-and-sync-runbook.md), [`§3.6`](./04-setup-and-sync-runbook.md)) to confirm the new tokens applied.
4. Note the sync date in operator-private notes (not in this repo).

### Detecting drift

If you've forgotten whether a Claude Design project is in sync, the symptom is: outputs use stale token values (e.g., the old accent hex), or reference fonts/components no longer present in the repo. The fix is always *re-upload from current main*. Don't try to fix drift inside Claude Design's UI.

---

## §5 — Privacy hygiene

These rules are absolute. Violations are how operator IP ends up in someone else's tooling chain.

- **Never upload operator IP.** Per [`§2.5`](./04-setup-and-sync-runbook.md) and [`§3.5`](./04-setup-and-sync-runbook.md): no [`../mothership/`](../mothership/), no [`../research/`](../research/), no [`../mothership/sales-verticals/`](../mothership/sales-verticals/), no [`../../dashboard/`](../../dashboard/).
- **Never paste forbidden Client #1 brand strings into operator-scope files.** The substituted Site DESIGN.md from [`§2.1`](./04-setup-and-sync-runbook.md) is a *scratch file*, kept local, never committed.
- **Never paste a Claude Design project URL into the repo.** Project URLs may include opaque session tokens that should not be public.
- **One project per client.** Don't reuse a Site project across clients — palette and brand strings will cross-contaminate.
- **Audit reminder.** Anthropic's Help Center explicitly states Claude Design lacks audit logs and data residency. Treat content as non-confidential by default; if an artefact is sensitive, do not put it in Claude Design at all.

---

## §6 — Spinout (P5.6) migration

When the repo splits per [`../migrations/lumivara-people-advisory-spinout.md`](../migrations/lumivara-people-advisory-spinout.md):

### Site-lane project

1. The Site-lane content moves to the spinout repo (`palimkarakshay/lumivara-people-advisory-site` or successor).
2. In Claude Design, open the existing Site project.
3. **Re-link**: point the project at the new repo URL. The previously-uploaded DESIGN.md and screenshots remain valid — Claude Design's link is metadata, not a re-ingest trigger.
4. Update the project name from `<client-slug>-site` to whatever post-spinout convention applies.
5. Confirm a probe question still produces consistent output. If the new repo has had token changes since spinout, re-upload DESIGN.md per [`§4`](./04-setup-and-sync-runbook.md).

### Pipeline-decks project

1. The Pipeline-lane content moves to `palimkarakshay/lumivara-forge-pipeline` (operator-private).
2. The decks travel with this lane — [`../decks/`](../decks/) goes to the new repo intact.
3. In Claude Design, re-link the existing `lumivara-forge-decks` project to the new repo URL.
4. Re-upload the rendered HTML reference (the new repo will have rebuilt the master deck HTML on first push via [`render-decks.yml`](../../.github/workflows/render-decks.yml) — wait for that to complete before re-uploading).

### This `docs/claude-design/` folder

Travels with the **Pipeline lane** to the operator-private repo. The Site spinout repo does not get this folder — the operator runs Claude Design centrally, not per-client. The substituted Site DESIGN.md (the scratch artefact from [`§2.1`](./04-setup-and-sync-runbook.md)) **is not committed anywhere**; it lives only in the operator's local working directory and the Claude Design project itself.

---

## §7 — Maintenance cadence

| Cadence | Action |
|---|---|
| Per repo PR touching tokens, components, or deck CSS | Re-upload to affected projects per [`§4`](./04-setup-and-sync-runbook.md) |
| Quarterly | Probe each project with a fresh question; verify outputs still match brand. If drift is visible, re-upload from current main. |
| Per new client engagement | Spin up a fresh `<client-slug>-site` project per [`§2`](./04-setup-and-sync-runbook.md). Never reuse a client's project for a different client. |
| At spinout (one-time) | Run [`§6`](./04-setup-and-sync-runbook.md) for both projects. |

---

*Last updated: 2026-04-30 — initial runbook.*
