<!-- OPERATOR-ONLY. Pair with 02-architecture.md and 03-secure-architecture.md. -->

# 11 — Critique: Architectural & Structural Issues

The pack's architecture is sound in shape but has one critical correctness bug and several boundary leaks. This doc lists them in priority order with concrete fixes the operator can implement.

---

## §1 — 🔴 Critical: cron schedules will not fire from `operator/main`

### What `02 §1` and `03 §2.1` claim

> "the autopilot files live on `operator/main` of each client repo, never on `main`. ... The cron schedules still fire because GitHub Actions reads workflows from any branch with `schedule:` triggers in them."

### What GitHub Actions actually does

GitHub's `schedule:` trigger **only fires from workflow files that exist on the repository's *default* branch**. A `schedule:` block in a workflow on a non-default branch is silently ignored. (Official docs: *"Scheduled workflows run on the latest commit on the default or base branch."*) See also the long-standing community thread; this has been the behaviour since cron was added to Actions in 2019.

So as written, **no cron in any client repo will ever fire**. The whole tier-cadence matrix in `04` is non-functional out of the gate.

### Three viable fixes — pick one

| Pattern | Sketch | Pros | Cons | Recommendation |
|---|---|---|---|---|
| **A. Default branch = `operator/main`; client-visible content lives on `client/main`** | Flip the convention. Workflows live on the default branch (`operator/main`), client edits on `client/main`. The admin portal and the auto-PR gate target `client/main`. Vercel deploys from `client/main`. | Cron works. Org-level secrets work. Branch protection works. | Inverts the GitHub UI default ("default branch" is what visitors land on); so set the repo's "Default branch" to something neutral or set Vercel/Pages to track `client/main`. Renaming the public-facing branch later is high-friction. | ✅ **Recommended.** Lowest behaviour-change for the autopilot. |
| **B. Single repo, single `main`; workflows are present on `main` but gated** | Workflows live on `main`. Use `if: github.actor == '<bot>'` and `concurrency:` + label gates to keep them invisible-by-effect rather than invisible-by-location. | One branch; simpler; no cron surprise. | Workflows are fully visible to client-as-Read; `.claudeignore` only protects the LLM context, not human readers. The "client cannot see the autopilot" claim becomes a marketing line, not an architectural fact. | Acceptable for T0/T1 only. |
| **C. Two repos: `<slug>-site` (client) + `<slug>-pipeline` (operator-owned)** | The client repo has only the site. A second private repo, owned by the operator's org and **not** shared with the client, holds the workflows. Workflows use `repository_dispatch` / GitHub App with `Contents: write` on `<slug>-site` to push branches and open PRs. | Cleanest separation. Client genuinely cannot see workflows. Survives turning the client repo public. | Two repos per client (operations overhead). Need a GitHub App or fine-grained PAT with cross-repo write. Auto-merge gate runs in the pipeline repo and writes to the site repo. | ✅ **Recommended for T2+** if Pattern A's "default-branch optics" bothers the operator. |

### What to update in the existing pack once you pick

- **`02 §1` diagram** — replace the dual-branch box with the chosen pattern.
- **`02 §6` "the autopilot's view of the world"** — fix the line "cron in workflows on `operator/main` operates against the repo's default branch" — it's wrong. Replace with the actual mechanism for the chosen pattern.
- **`03 §2.1`/`§2.2`** — branch-protection rules need to flip target branches.
- **`05 §P5.6` step 3** — "Move `.github/workflows/` files into a temp branch `operator/main`" must change.
- **`06 §3` Prompt B1** — substitute the chosen pattern.

A single Run A in `16 §1` does the propagation.

---

## §2 — 🟠 High: branch-listing leaks `operator/main` to the client

GitHub's Read permission on a private repo includes **all branches**. A curious client logged into github.com → their repo → branches dropdown will see `operator/main` and can clone it via `git fetch`. The defense in `03 §2.3` (`.claudeignore`) protects only the LLM context, not the human reader.

This invalidates the "the autopilot is invisible to the client" claim and weakens the "system = operator-licensed" contractual position.

**Fix options:**

1. Move to **Pattern C** in §1 — the workflows live in a separate operator-owned repo the client never sees.
2. If staying on Pattern A: **don't add the client as a Read collaborator on the site repo at all** during the engagement. Give them read access only via the deployed Vercel preview + the `/admin` portal. They become Read collaborators (or repo Owners) only at handover, after `operator/*` branches are deleted.
3. As a belt-and-braces compromise: name the operator branch with a `_internal` suffix (`internal/automation`) and add a `.github/CODEOWNERS` block + branch protection that tells anyone clicking it "this branch is operator-only; do not edit." Doesn't actually prevent reads, but makes it self-documenting.

The recommendation depends on §1's choice. If §1 picks **Pattern C**, this issue dissolves.

---

## §3 — 🟡 Medium: `client-template/` and `lumivara-site` overlap

`02 §2` declares `client-template/` (in the mothership) the canonical Next.js scaffold. But the current `lumivara-site` repo IS the source of truth today. Until P5.6 completes, both copies exist and either could drift.

**Fix:** during P5.1, copy `lumivara-site/src/`, `package.json`, `tailwind`, `tsconfig`, etc. into `mothership/client-template/` **and** add a CI check on the mothership that fails if `client-template/` and the latest committed snapshot of any active client diverge in template-relevant files. Concretely:

```
mothership/.github/workflows/template-drift-check.yml
  - matrix over docs/clients/*/cadence.json (active engagements)
  - clones each client repo, diffs `src/lib/admin-*` and `middleware.ts`
  - posts a comment on the mothership if drift detected
```

This is a 30-line workflow but it converts "the operator hopes client-template stays in sync" into "the bot tells the operator when it doesn't."

---

## §4 — 🟡 Medium: `forge` CLI is load-bearing but late

Per `05 §P5.4`, the `forge provision` CLI is sequenced *after* the docs migration, the workflow extraction, the dashboard migration, and the smoke tests. Per `06 §4`, every Prompt B2 step ("provision Vercel project, n8n workflows, Twilio number, OAuth apps") is supposed to be CLI-automated — but the prompt is also "what the operator runs manually until P5.4 lands."

**Result:** between P5.5 and P5.4-complete, every new client is a 2–4 hour manual provisioning. The "30 minutes" claim in `02 §3` is conditional on the CLI existing.

**Fix:**
- Make P5.4a–P5.4d **blockers** before any new client engagement (i.e., do them before P5.6 if a real client is queued).
- Or: explicitly accept that Beas's engagement is the only manual provisioning and that client #2 must wait for the CLI.

Either is fine; the pack as written elides the gating. State it explicitly in `05 §P5.4`.

---

## §5 — 🟡 Medium: cross-repo dependencies are not version-pinned

The mothership repo holds `workflows-template/`, `scripts/`, `client-template/`, and per-engagement intake. Today the assumption is "newest wins" — every provision pulls the head of mothership. That's brittle:

- A breaking change to `workflows-template/triage.yml` ships, propagates to every client on next provision, breaks all of them at once.
- `routing.py` gets a regression and 25 clients lose triage simultaneously.

**Fix:** version the templates.

```
mothership/
├── workflows-template/v1/   # frozen
├── workflows-template/v2/   # current
├── client-template/v1/
├── client-template/v2/
└── scripts/v1/, v2/
```

Each per-client `cadence.json` records `template_version: v2`. Upgrading is a deliberate `npx forge upgrade-templates --client <slug> --to v3`. The bot smoke-tests v3 on a `forge-smoke-test-co` repo before any real client moves.

This is the standard pattern for fleet-managed configurations (Terraform modules, Helm charts, k8s operators). The pack omits it; it should be added to `02` or a new `02b`.

---

## §6 — 🟢 Lesser: `n8n/` directory should be split by execution model

`02 §2` lists `n8n/intake-web.json`, `intake-email.json`, `intake-sms.json` etc. as flat files. Once the operator runs >5 clients, three subtypes emerge:

- **Stateless intake** (web/email/SMS) — fully template-able per-client.
- **Stateful escalation** (the `needs-client-input` loop) — depends on the channel they originally used (stored in a comment).
- **Reactive notifiers** (deploy-confirmed, payment-failed) — fanned-out to every client.

Group them:

```
mothership/n8n/
├── intake/         # one JSON per channel; per-client suffix at provision
├── escalation/
├── notifiers/
└── README.md       # which credentials each group needs
```

This is cosmetic but it pays off when the n8n workflow count crosses 100 (~17 active clients × 6 workflows).

---

## §7 — 🟢 Lesser: dashboard's "Client switcher" is a thin slice over `localStorage`

`05 §P5.3` step 2 says "read the active client repo from a localStorage selector." Fine for one operator on one device, but:

- The dashboard is intended to be mobile-first. A device-switch loses the selection.
- Multi-tab: two tabs, two clients, easy to mis-merge a PR on the wrong client.

**Fix:** put the selected client in the URL path (`/dashboard/<client-slug>/runs`) instead of localStorage. Bookmarkable, shareable in operator notes, survives device switches.

---

## §8 — Summary action list for Run A

The single Claude Code session that closes the architectural fixes:

```
[ ] Decide §1 pattern (Recommended: A for the existing engagement; C as the
    target by client #3).
[ ] Update docs 02, 03, 05, 06 with the chosen pattern.
[ ] Add a §X to 02 explaining the cron-on-default-branch invariant in
    a yellow callout.
[ ] Add 02b "template versioning" or fold §5 above into 02.
[ ] Update 05 P5.6 step 3 to match.
[ ] Update 03 §2.1 / §2.2 branch-protection rules.
[ ] Open a tracking issue "operator/main → operator/* migration" so that
    if Pattern A is chosen now, Pattern C can be revisited at client #3.
```

Estimated turns: 60–100 in one Opus 4.7 session. Prompt body lives in `16 §1`.

*Last updated: 2026-04-28.*
