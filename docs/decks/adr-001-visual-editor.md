<!-- ADR-001 — Visual editor for /admin. Operator-scope decision record. -->

# ADR-001 — Visual editor for `/admin`

> _Lane: 🛠 Pipeline — operator-only architectural decision record. The implementation it governs lives in the 🌐 Site lane (`src/app/admin/editor/*`, `src/lib/admin/editor-*.ts`)._

- **Status:** Accepted (v1 — 2026-05-01).
- **Issue:** [#120](https://github.com/palimkarakshay/lumivara-site/issues/120) — _"Build Squarespace-like visual editing tool for Admin."_
- **Owner:** operator.
- **Decision deadline:** before any third-party editor library is added to `package.json`.

---

## Context

The operator wants a Squarespace-like surface inside `/admin` that lets them (and eventually clients) edit the live site without touching code. Issue #120 explicitly asks for four views — **Existing / Draft / Preview / Deployed** — and an explicit **build-vs-integrate** decision before MVP code lands.

The repo's content shape today:

- Page copy lives in `src/content/*.ts` modules — `home.ts`, `services.ts`, `how-we-work.ts`, etc. These are **TypeScript modules**, not markdown. Every page is rendered by typed React components that read from these modules at build time.
- Insight articles live in `src/content/insights/*.mdx` with frontmatter (`title`, `excerpt`, `category`, `publishedDate`, `readingTime`). These _are_ free-form markdown.
- Auth.js v5 protects `/admin` via the `isAdminEmail` allowlist (`src/lib/admin-allowlist.ts`).
- Production deploys are git-driven: `main` → Vercel. Every change goes through a PR, CI, and a Vercel preview before merge.

Issue #120 is `priority/P3`, `complexity/complex`, `manual-only`. There is no near-term client driver. The decision below picks the smallest defensible v1 that satisfies the issue's acceptance criteria without locking the project into a heavyweight third-party content store.

---

## Options considered

| Option | Pros | Cons |
|---|---|---|
| **A — Build a thin in-house editor.** Textarea + frontmatter form, server actions, GitHub Contents API → PR. | No new deps. Stays inside the existing PR / CI / Vercel pipeline. Trust boundary at `/admin` already covers it. Drop-in upgrade slot for Tiptap later. | We write more code. Real-time MDX preview needs an MDX runtime (deferred). |
| **B — Integrate Plate.** Slate-based rich-text editor; broad component library. | Polished UX out of the box. | ~200 KB+ of editor-only deps; couples our content schema to Plate's tree model; not a fit for editing TS modules. |
| **C — Integrate Builder.io.** Visual page builder with hosted CMS. | Mature drag-and-drop. | Forces adoption of Builder's content store. Fights our git-as-source-of-truth posture and complicates the `/admin` trust boundary (third-party iframe + CDN). Pricing kicks in past free tier. |
| **D — Integrate Puck.** Open-source visual builder. | Nicer than rolling our own; component-tree model. | Same schema-coupling concern as Plate. We'd write adapters for each `src/content/*.ts` module before the editor renders the first page. |
| **E — Defer / reuse Squarespace via embed.** | Zero net-new code. | Squarespace can't edit a Next.js site. Non-starter; only listed for completeness. |

---

## Decision

**Option A — build a thin in-house editor.** Reasons:

1. **Content is git-backed today.** Builder / Puck / Plate-as-CMS would force adopting their content store and bypass the existing PR → CI → Vercel pipeline that AGENTS.md and the Vercel-mirror discipline rely on. Keeping the source of truth in the repo preserves the audit trail and the rollback story.
2. **Trust boundary at `/admin` is already minimal.** Auth.js v5 + `isAdminEmail` is the gate. A heavyweight third-party iframe (Builder.io) or a large client-bundle dep (Plate) materially expands what the trust boundary protects against. A thin server-rendered editor doesn't.
3. **v1 audience is exactly one operator.** Optimising for "non-technical clients editing pages" before the operator can self-serve is premature. Tier the rollout: operator first, _maybe_ Scale-tier clients later (separate ADR).
4. **Tiptap is reserved as a drop-in upgrade slot** for the textarea-level editor (Phase 2) once v1 proves the publish loop. We do not pull it in v1 — adding it before we know which page surfaces matter is YAGNI.

---

## Scope (v1)

**One content surface only:** MDX insight body + frontmatter (`src/content/insights/<slug>.mdx`). Listed insights:

- `clarity-is-the-first-hiring-problem.mdx`
- `the-compensation-conversation-most-managers-avoid.mdx`
- `the-succession-gap-most-organizations-ignore.mdx`
- `what-measured-impact-looks-like.mdx`
- `when-fractional-hr-makes-more-sense-than-a-hire.mdx`
- `where-ai-belongs-in-leadership-development.mdx`

**Out of scope for v1, listed as Phase 2 below:**

- Editing TS-module copy (`src/content/home.ts`, `services.ts`, `how-we-work.ts`, etc.).
- Editing page sections (`HomeHero`, `FAQSection`, `ServicesGrid`, …).
- Image upload UI + asset pipeline.
- Multi-locale editing.
- Real-time collaboration / optimistic locking across browser tabs.

### Four views

| View | Source | What v1 renders |
|---|---|---|
| **Existing** | `getInsightBySlug(slug)` (current `main` working copy) | The MDX, server-rendered via the existing `<Post />` import path, read-only. |
| **Draft** | `editor-store.ts` in-memory map keyed by `${email}:${slug}` | Textarea (MDX body) + form fields (frontmatter). Auto-saves to the server-side buffer. |
| **Preview** | Iframe → `/insights/[slug]` | The live route, same renderer as production. v1 reflects on-disk content (≅ Existing). Banner explains: "Publish your draft to update the Preview." |
| **Deployed** | Iframe → `https://lumivara.ca/insights/[slug]` (with `X-Frame-Options` fallback to "Open in new tab") | The currently-deployed copy on the production domain. |

### Publishing flow

```
Draft (editor buffer)
  → server action `publishDraft(slug)`
  → GitHub Contents API: create branch `auto/editor-<slug>-<timestamp>` from main
  → PUT contents at `src/content/insights/<slug>.mdx`
  → open PR titled `content(editor): update <slug>`
  → operator reviews on GitHub
  → existing CI + Vercel preview gate the merge
  → operator merges on GitHub → Vercel production deploy
```

**Direct push to `main` is forbidden** by this design. Every publish opens a PR; the existing CI gate is the safety net.

---

## Risks & mitigations

| Risk | Mitigation (v1) | Phase-2 plan |
|---|---|---|
| **Publish action is a new write capability for `/admin`.** Today `src/lib/admin/github.ts` is read-only. | Writes are isolated to `src/lib/admin/editor-github.ts`; they always target `auto/editor-*` branches, never `main`; PR-open never auto-merges. Server action re-checks `isAdminEmail(session.user.email)` on every call. | Add an admin-side "publish history" view backed by the GitHub PR list. |
| **`GITHUB_TOKEN` may be read-only.** A fine-grained PAT scoped to `metadata: read` + `issues: read` cannot create branches or open PRs. | Editor-github helpers return `{ ok: false, error }` verbatim; the UI surfaces the GitHub error message. The rest of the editor (Existing / Draft / Preview) still works. | Operator upgrades the PAT to `contents: write` + `pull_requests: write` once they want to publish. |
| **Draft persistence is ephemeral.** The in-memory `Map` dies on Vercel cold starts and isn't shared across serverless functions. | Documented limitation. Single-operator audience accepts it. | Migrate to Vercel KV (Upstash; the auth adapter already uses Upstash). |
| **MDX runtime preview not wired.** Editing a paragraph and switching to Preview shows the on-disk version, not the draft. | Banner: "Publish your draft to update the Preview." | Add `next-mdx-remote/rsc` or a server-side `@mdx-js/mdx` `compile()` step (separate dependency-add ADR). |
| **Iframe-ing the production domain may hit `X-Frame-Options: DENY`.** | Detect at render time and fall back to a "Open on lumivara.ca ↗" link. | Long-term: render Deployed by fetching the file at the deployed SHA via Contents API, not by iframe. |
| **Concurrent edits in two browser tabs by the same admin overwrite each other's drafts.** | Acceptable for a single user. | Add optimistic-locking via an `updatedAt` marker on each draft. |
| **Schema drift between `src/content/*.ts` and any future visual editor.** | v1 stays inside MDX; no schema. | Define a typed component-content schema before tackling page sections in Phase 2. |
| **Pattern C / Dual-Lane Repo:** every new file under `src/app/admin/editor/`, `src/components/admin/`, `src/lib/admin/` is operator-lane and must not leak into a client repo. | The spinout runbook already excludes `/admin/*` from the Site repo. `bash scripts/dual-lane-audit.sh` runs on every PR. | n/a — handled by the lane manifest. |

---

## Phase 2 triggers

Pull Tiptap (or `next-mdx-remote/rsc`) when:

1. **Operator has used the v1 textarea ≥10 times** and reports specific friction (markdown muscle memory not shared with clients).
2. **A second client surface is in scope** (Scale-tier clients editing their own insights). Multi-tenant editing changes the trust model and the persistence model both.
3. **The Vercel KV / draft-share question lands** — until drafts persist beyond a single Vercel function instance, real-time preview is mostly moot.

Pull a heavier visual builder (Plate / Puck / Builder.io) only if **TS-module / page-section editing** becomes a real requirement. That decision goes in a separate ADR; this ADR is scoped to MDX-body editing.

---

## Definition of done (v1)

The implementation that this ADR governs ships when the issue's DoD is met:

- [ ] `/admin/editor` lists insight articles for admin emails; non-admins are bounced to `/admin/sign-in`.
- [ ] `/admin/editor/[slug]` renders the four-tab shell.
- [ ] An operator can edit one insight in the Draft tab, see the on-disk version in Existing, switch to Preview / Deployed, and click "Publish" to open a PR on GitHub. The PR opens with the draft contents at `src/content/insights/<slug>.mdx`.
- [ ] No `package.json` deps added; no `scripts/*` or `.github/workflows/*` edits; no `src/app/api/contact/*` edits.
- [ ] `bash scripts/dual-lane-audit.sh` passes.
- [ ] type-check, lint, vitest pass.

---

## References

- [`docs/00-INDEX.md`](../00-INDEX.md) — repo doc index (this ADR is linked from the deck-pack section).
- [`docs/ADMIN_PORTAL_PLAN.md`](../ADMIN_PORTAL_PLAN.md) — five-phase build of `/admin`. The editor sits inside Phase 1's authenticated surface.
- [`docs/mothership/02b-dual-lane-architecture.md`](../mothership/02b-dual-lane-architecture.md) — the Dual-Lane Repo architecture this editor must respect.
- [`docs/mothership/03-secure-architecture.md`](../mothership/03-secure-architecture.md) — trust-boundary policy for `/admin`.
- [`src/lib/admin/github.ts`](../../src/lib/admin/github.ts) — read-only GitHub helpers; `editor-github.ts` is the write-side companion.
