# Multi-client architecture (sketch)

The AI Ops dashboard ships in two builds from one source tree:

| Build       | Audience                       | Mount               | Scope                         |
| ----------- | ------------------------------ | ------------------- | ----------------------------- |
| `operator`  | Lumivara internal              | `palimkarakshay.github.io/lumivara-site/` | All clients in `CLIENTS` array |
| `client`    | Per-client admin page on their own site | iframe / sub-route inside the client's site | Just that one client          |

Both consume `dashboard/src/lib/clients.ts` as the single source of
truth — adding a client = appending one entry to `CLIENTS` and pushing.

## Data flow

```
PAT (localStorage)
   │
   ▼
Octokit({ auth: PAT })
   │
   ├── ?client=<id>  ──────────►  resolveActiveClient()
   │                                │
   │                                ▼
   │                          { owner, repo, tier }
   │
   ▼
GitHub API calls scoped to the resolved client's repo
   │
   ▼
React Query cache, keyed by [client.id, ...queryKey]
```

The cache key prefix is critical — it isolates one client's data from
another's so client switching doesn't briefly show stale rows from the
previous client. (Implemented in a follow-up; today there's only one
client and no cross-contamination risk.)

## Tiers and feature gates

`ClientTier` ∈ `free | pro | enterprise | internal`. Every UI mutation
checks `tierAllows(tier, feature)` before rendering its button. Feature
strings are namespaced (`read.*`, `mutate.*`, `admin.*`) so adding a
feature means picking a namespace, not inventing a flag system.

| Feature                       | free | pro | enterprise | internal |
| ----------------------------- | :--: | :-: | :--------: | :------: |
| `read.runs`                   |  ✓   |  ✓  |     ✓      |    ✓     |
| `read.workflows`              |  ✓   |  ✓  |     ✓      |    ✓     |
| `read.thinking`               |      |  ✓  |     ✓      |    ✓     |
| `mutate.brain.default`        |      |     |     ✓      |    ✓     |
| `mutate.brain.override`       |      |     |     ✓      |    ✓     |
| `mutate.workflow.toggle`      |      |  ✓  |     ✓      |    ✓     |
| `mutate.workflow.pause-window`|      |     |     ✓      |    ✓     |
| `mutate.run.dispatch`         |      |  ✓  |     ✓      |    ✓     |
| `mutate.pr.merge`             |      |     |     ✓      |    ✓     |
| `admin.cost`                  |      |     |     ✓      |    ✓     |
| `admin.audit`                 |      |     |            |    ✓     |
| `admin.error-log`             |      |     |            |    ✓     |

Free-tier clients see read-only telemetry. Pro adds toggles + manual
dispatch. Enterprise adds the brain controls + merge button + cost
panel. Internal is everything (this is the operator build).

## Client-side admin page integration

The lite client build ships as a single bundle that:

1. Embeds the client's `id` at build time (no client picker visible).
2. Reads the PAT from a fixed key in `localStorage` so the host site
   can write the token after the client signs in via OAuth on their
   own auth flow.
3. Hides every button that isn't allowed by the client's tier.
4. Disables all `mutate.*` and `admin.*` features in the URL — even
   if the user enables them via DevTools, the API call fails because
   their PAT is scoped read-only by the host site's OAuth grant.

Two enforcement layers (UI gate + token scope) are deliberate: UI
gates are user-visible and friendly; token scopes are the security
boundary.

## Why not a separate codebase per client?

- One bug fix should ship to everyone — separate trees diverge fast.
- The dashboard is small (under 1000 LOC of components). Forking it
  would 10× the maintenance for no gain.
- Tier flags + the active-client resolver give us all the divergence
  we need without forking.

## Open questions / next steps

- **PAT bootstrap on the lite client build**: the host site must
  obtain a fine-grained PAT for the client's repo. We need an OAuth
  flow on the host site that provisions one. Out of scope for this
  branch; tracked in `docs/dashboard/session-state.md`.
- **Client picker UI**: when CLIENTS grows beyond one, add a small
  picker to the header. The picker reloads the page with the new
  `?client=` param so React Query starts cold.
- **Per-client overrides** of `RELEVANT_WORKFLOW_PATHS`: clients have
  their own workflow names. Move the allowlist into `ClientDescriptor`
  with a sensible default that matches Lumivara's pattern.
