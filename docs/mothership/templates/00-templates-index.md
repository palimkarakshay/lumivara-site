<!--
================================================================================
  CONFIDENTIAL — OPERATOR-ONLY SOURCE OF TRUTH

  Everything under `docs/mothership/templates/` is **vertical-specific
  content scaffolding** that the operator pastes into Claude Opus while
  building a new client site.

  Hard rules:
    1. Nothing in this folder ever ships in a client's repo.
    2. Nothing in this folder is pasted verbatim into a client-shared
       chat, email, gist, or proposal — including the intake forms.
       The intake forms in this folder are the operator's *internal*
       cribsheet; the client-facing version is rendered from
       `../07-client-handover-pack.md §3`.
    3. Generated prompt outputs (hero copy, MDX, JSON-LD) ship into
       the per-client repo, not back into this folder.

  See `../00-INDEX.md` for the surrounding doc set and the Dual-Lane Repo
  architecture that defines client repos vs. mothership repo.
================================================================================
-->

# Vertical content templates — master index

This folder holds **per-vertical content prompts and operator intake forms**. It sits on top of two existing scaffolds:

- `../06-operator-rebuild-prompt-v3.md` — the per-engagement playbook (what to run, in what order, to spin up a new client site).
- `../../TEMPLATE_REBUILD_PROMPT.md` — the structural Next.js scaffold (components, design tokens, page wiring).

The files here fill the gap between *"the site shell exists"* and *"the site reads like it was written for this specific client"*. Each vertical (restaurant, plumber, realtor, …) gets:

- An **intake form** the operator fills in from client answers.
- A set of **content prompts** that turn those answers into hero copy, About narrative, menu MDX, JSON-LD, etc., one section at a time.

---

## Status

| # | Vertical | Intake form | Content prompts | Status |
|---|---|---|---|---|
| 1 | Restaurant | `restaurant-intake-form.md` | `restaurant-prompts.md` | ✅ Full (12 prompts; 10 required + 2 bonus) |
| 2 | Plumbing / trades | `plumber-intake-form.md` | `plumber-prompts.md` | ✅ Full (12 prompts; 10 required + 2 conditional) |
| 3 | Real-estate (single agent) | `realtor-intake-form.md` | `realtor-prompts.md` | ✅ Full (12 prompts; 10 required + 2 conditional) |
| 4 | Recruitment / staffing | `recruiter-intake-form.md` | `recruiter-prompts.md` | ✅ Full (12 prompts; 10 required + 2 conditional) |
| 5 | Law (solo practice) | — | — | ⏳ Planned |
| 6 | Barber / salon | — | — | ⏳ Planned |
| 7 | Accounting / bookkeeping | — | — | ⏳ Planned |
| 8 | Physiotherapy / wellness | — | — | ⏳ Planned |
| 9 | Electrical | — | — | ⏳ Planned |
| 10 | Dental | — | — | ⏳ Planned |

**Legend:** ✅ Full = intake form + ≥10 prompts merged. 🔲 Stub = file exists with headings only; full content deferred. ⏳ Planned = not yet stubbed; file an issue to prioritise.

---

## How to use these templates

Run this on a per-client basis, after the structural scaffold from `../06-operator-rebuild-prompt-v3.md` has been copied into the new client repo.

1. **Pick the vertical.** If the client's business doesn't match any row above, fall back to manual copy in the rebuild prompt and file an issue to add the vertical here.

2. **Fill in the intake form.**
   - Open the matching `*-intake-form.md` file.
   - Copy it into the operator's clients folder at `docs/clients/<slug>/intake.md` in the **mothership repo** (never the client repo).
   - Walk the client through the questions in a single intake call (~45 min). Replace each `[CLIENT ANSWER]` placeholder with their answer in your copy.
   - **Do not send the filled form to the client.** The client-facing version is the trimmed dummy intake in `../07-client-handover-pack.md §3` — that is what they fill in.

3. **Run the prompts in order.**
   - Open the matching `*-prompts.md` file.
   - For each fenced prompt block: do a find-replace on the `[BRACKET_FIELDS]` using your filled intake form, paste the result into a fresh Claude Opus chat, review the output, and drop it into the client repo at the path the prompt names.
   - Run prompts sequentially — later prompts assume earlier sections exist (e.g., the JSON-LD prompt reads back the hours table you generated in the Hours/Location prompt).
   - Each prompt is small enough to fit one Claude turn comfortably; if Claude truncates, split the input not the prompt.

4. **Sanity-check before commit.**
   - Run `npx tsc --noEmit` in the client repo after pasting MDX/JSX outputs.
   - Run `npm run lint` to catch unused imports.
   - Open the section in `npm run dev` and verify it renders as expected.

5. **Log what you generated.**
   - In `docs/clients/<slug>/intake.md`, append a "Prompts run" checklist after the intake answers so the next operator knows which sections are AI-generated and which are manual.

---

## Why this folder is operator-only

The intake forms ask questions a competitor could not easily answer (signature dish margins, OpenTable IDs, parking notes, founder backstory). The prompts encode the operator's house style — the warm-but-restrained voice, the JSON-LD discipline, the way `GlassCard` and `SectionShell` are composed. Both leak the operator's edge if shared.

Per Dual-Lane Repo (`../02b-dual-lane-architecture.md`), this folder lives only in the mothership repo. The per-client repos see the *outputs* (hero copy, MDX) but never the *prompts*.

---

## Adding a new vertical

When promoting an `⏳ Planned` row to `🔲 Stub`:

1. Copy `restaurant-prompts.md` to `<vertical>-prompts.md` and replace bodies with `[CONTENT PENDING]` placeholders matching the same prompt headings.
2. Update the table above (status column → 🔲).
3. Open an issue tagged `area/content` to fill out the prompts; reference this index.

When promoting a `🔲 Stub` to `✅ Full`:

1. Author the matching `<vertical>-intake-form.md`.
2. Replace each `[CONTENT PENDING]` body with a real prompt.
3. Update the table (status column → ✅, intake form filename, prompt count).

*Last updated: 2026-04-30.*
