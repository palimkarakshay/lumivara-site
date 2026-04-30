# `llm-monitor` — bot self-awareness pipeline

> _Lane: 🛠 Pipeline — operator framework. Never edited as part of a Site
> issue. See [`AGENTS.md` Pattern C lane awareness](../../AGENTS.md)._

## What this is

A scheduled collector + analyzer that reads the wider conversation about
the LLMs and SDKs **this operator pipeline depends on** (Claude, the
Anthropic SDK, Codex, Gemini, MCP, Claude Code itself) and feeds the
findings back into the codebase so the bots are **self-aware** of:

* current bugs / regressions / outages other people have hit,
* new best practices and prompt patterns,
* deprecated APIs or model IDs,
* features and tools we should adopt.

The output is a digest **plus** an auto-maintained
[`docs/mothership/llm-monitor/KNOWN_ISSUES.md`](../../docs/mothership/llm-monitor/KNOWN_ISSUES.md)
that triage / plan / execute prompts ingest as context. That is the
"self-awareness" layer — every executor run starts from the last
14 days of field reports instead of frozen training data.

## Cadence (tiered, since 2026-04-30)

Two cron tiers, picked by `--mode`:

| Tier | Cron | Collectors | Outputs | Purpose |
|---|---|---|---|---|
| **watch** | every 15 min (`4,19,34,49 * * * *`) | `statuspages` | `KNOWN_ISSUES.md`, auto-issues | Outage detection on Anthropic / OpenAI / Vercel / GitHub / Cloudflare / Hugging Face |
| **sweep** | every 2 h (`13 */2 * * *`) | all 5 collectors | digests + newsletters + KNOWN_ISSUES + RECOMMENDATIONS + auto-issues | Full content sweep |

Watch and sweep share the same dedupe set (`state/seen.json` via
actions/cache), so an outage caught at 11:04 by the watch tier won't
re-emit when the 13:13 sweep runs. They also share the
`llm-monitor` concurrency group so writes to `KNOWN_ISSUES.md` are
serialised.

Workflows: [`llm-monitor-watch.yml`](../../.github/workflows/llm-monitor-watch.yml) +
[`llm-monitor.yml`](../../.github/workflows/llm-monitor.yml).

## Architecture (three layers, kept separate)

```
collectors/        →  store.py            →  analyzer.py        →  digest.py + feedback.py
(per-source         (normalize + dedupe    (Claude Opus           (writes digest +
 fetchers)           in JSON state)         classifier)            updates KNOWN_ISSUES,
                                                                   auto-files issues)
```

1. **Collectors** (`collectors/*.py`) — one per source. Each takes no
   arguments, reads its config from `sources.json`, and prints one
   normalized JSON record per line to stdout (JSONL). They do not write
   to the store directly; the orchestrator does.
2. **Store** (`store.py`) — append-only JSONL files under
   `state/raw/<source>-<YYYY-MM>.jsonl` plus a `state/seen.json`
   url-hash dedupe set. No DB dependency — `gh` CI runners only get
   stdlib + `gh`.
3. **Analyzer** (`analyzer.py`) — batches new records into a single
   Claude Opus call that classifies each `{bug, feature, best-practice,
   comparison, news, noise}`, extracts the model/SDK mentioned, scores
   novelty, and writes a structured JSON output.
4. **Digest** (`digest.py`) — renders the analyzer output into a daily
   Markdown digest committed to
   `docs/mothership/llm-monitor/digests/YYYY-MM-DD.md`.
5. **Feedback** (`feedback.py`) — turns high-signal records into:
   * upserts into `KNOWN_ISSUES.md` (so prompts pick them up),
   * GitHub issues labelled `auto-discovered` for actionable items.

## Running locally

```bash
# Full sweep (default — every 2h tier). Runs all 5 collectors,
# rewrites digest + newsletters, refreshes KNOWN_ISSUES + RECOMMENDATIONS.
ANTHROPIC_API_KEY=... \
REDDIT_CLIENT_ID=... REDDIT_CLIENT_SECRET=... \
GH_TOKEN=$(gh auth token) \
python3 scripts/llm-monitor/run.py --mode=sweep

# Watch tier — every 15 min. Statuspages only; skips digest /
# newsletter rewrite. Used for outage detection between sweeps.
python3 scripts/llm-monitor/run.py --mode=watch

# Single-collector debugging
python3 scripts/llm-monitor/collectors/hackernews.py
python3 scripts/llm-monitor/collectors/statuspages.py
```

## Source list

Configured in [`sources.json`](sources.json). v1 covers:

* **HackerNews** — Algolia API, no auth. Story + comment search.
  Sweep-only.
* **RSS** — Anthropic news, OpenAI blog, Google DeepMind, Simon
  Willison, Latent Space, Hugging Face, Vercel, Next.js, GitHub
  changelog. Sweep-only.
* **Reddit** — r/LocalLLaMA, r/ClaudeAI, r/OpenAI, r/singularity,
  r/MachineLearning. Public JSON or OAuth (rate limit difference).
  Sweep-only.
* **GitHub** — releases + recent issues for the SDKs / CLIs we
  depend on (`anthropics/anthropic-sdk-{python,typescript}`,
  `anthropics/claude-code`, `openai/openai-python`,
  `googleapis/python-genai`, `vercel/next.js`, `vercel/vercel`).
  Sweep-only.
* **Statuspages** — `/api/v2/status.json` + `/api/v2/incidents/unresolved.json`
  for Anthropic / OpenAI / Vercel / GitHub / Cloudflare / Hugging
  Face. **Used by both watch and sweep tiers.**

v2 (deferred — flag in [§ "More bot setup needed"](#more-bot-setup-needed) below):

* **X / Twitter** — via xAI Grok API (paid) or X API Basic ($200/mo).
* **Discord** — per-server bots; ToS-bound.
* **YouTube** — transcript pulls of curated channel list.

## More bot setup needed

The v1 pipeline runs out of the box on **only** the secrets you already
have (`ANTHROPIC_API_KEY`, `GH_TOKEN`). To enable the other collectors:

| Collector | Secrets to add | Where to get | Cost |
|---|---|---|---|
| Reddit (authed)¹ | `REDDIT_CLIENT_ID`, `REDDIT_CLIENT_SECRET` | https://www.reddit.com/prefs/apps → "create app" → "script" | Free |
| X via Grok | `XAI_API_KEY` | https://console.x.ai | Pay-as-you-go |
| X via X API | `X_BEARER_TOKEN` | https://developer.x.com → Basic tier | $200/mo |
| Discord | `DISCORD_BOT_TOKEN` + invite to each server | https://discord.com/developers/applications | Free, but needs server-owner consent |
| YouTube | none — `youtube-transcript-api` is open | n/a | Free, but adds a non-stdlib dep so deferred |

¹ Reddit also works **without** auth via the public JSON endpoints, at
~60 req/min. The collector falls back to that path automatically if the
secrets are absent. For continuous CI use, authed mode is recommended.

When ready to enable, add the secret in **Settings → Secrets and
variables → Actions** and the workflow will pick it up on the next run
— no code changes needed.

## Self-awareness feedback loop

This is the load-bearing piece. Without it, the digest is just a
newsletter. The loop:

1. Analyzer marks a record `severity: high` and `kind: bug` if it's a
   confirmed regression in a model/SDK we use.
2. `feedback.py` upserts a one-line entry into
   [`KNOWN_ISSUES.md`](../../docs/mothership/llm-monitor/KNOWN_ISSUES.md)
   under the matching section (Claude / SDK / MCP / etc.).
3. The triage / plan / execute prompts (`scripts/triage-prompt.md`,
   `scripts/execute-prompt.md`, etc.) include `KNOWN_ISSUES.md` as
   pinned context, so every bot run starts the day having "read the
   morning paper".
4. For items with severity `high` AND a clear action ("upgrade SDK",
   "switch model ID"), feedback also opens a GitHub issue labelled
   `auto-discovered` + `infra-allowed` so the existing triage / plan /
   execute pipeline can pick it up like any other backlog item.

The result: **the bots learn from the field every day**, without the
operator hand-curating a changelog.

## Cross-refs

* [`docs/mothership/llm-monitor/runbook.md`](../../docs/mothership/llm-monitor/runbook.md)
  — operator runbook (secret rotation, manual triggers, off-switches).
* [`.github/workflows/llm-monitor.yml`](../../.github/workflows/llm-monitor.yml)
  — CI schedule.
* [`AGENTS.md` § Session charter](../../AGENTS.md) — model defaults
  this pipeline honours (Opus everywhere; cost optimisation deferred).
