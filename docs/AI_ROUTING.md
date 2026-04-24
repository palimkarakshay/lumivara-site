# AI model routing — policy

Single source of truth for which AI does what in this repo. Updated as free/cheap models improve.

## Policy

| Task | Primary | Fallback | Why |
|------|---------|----------|-----|
| **Triage / classification** | Claude Haiku | Gemini 2.5 Flash | Cheap, fast. Gemini free tier (500 req/day) picks up when Claude quota exhausted. |
| **Implementation (code edits)** | Claude Sonnet | — (defer to next run) | Tool use + file edits need mature tool-calling. No safe fallback for writing code. |
| **Planning (architecture, strategy, overview)** | Claude Opus | Wait for availability | Strategic reasoning; worth waiting. |
| **Trivial edits (typos, single-line)** | Claude Haiku | Gemini 2.5 Flash-Lite / OpenAI gpt-4o-mini | Minimum effort. |
| **Large-context reads (full codebase audit, bulk MDX generation)** | Gemini 2.5 Pro (1M ctx) | Claude Sonnet chunked | Gemini's context is ~5x larger. |
| **Content generation (articles, copy drafts)** | Gemini 2.5 Pro | Claude Sonnet | Free tier, good writing, large context for style consistency. |
| **Image / video / music** | Gemini (native multimodal) | — | Claude doesn't generate media. |
| **Deep research (multi-source synthesis)** | Gemini (with Google Search grounding) | OpenAI with web | Google Search integration is the differentiator. |
| **Code review on PR diff** | OpenAI gpt-4o-mini | Gemini 2.5 Flash | Cheapest second opinion. |

## "Claude unavailable" fallback logic

Every workflow that uses Claude should have `continue-on-error: true` on the Claude step, followed by a Gemini/OpenAI fallback step that detects unfinished work and completes it.

Live examples:
- **triage.yml** — Claude Haiku primary, Gemini Flash fallback via `scripts/gemini-triage.py`
- **execute.yml** — Claude Sonnet only (no fallback; code edits require tool use). If Claude fails, the issue stays `status/planned` and next cron picks it up.

## Secrets required (repo → Settings → Secrets → Actions)

| Secret | Used by | How to get |
|--------|---------|------------|
| `CLAUDE_CODE_OAUTH_TOKEN` | Claude CI | `claude setup-token` locally, paste output |
| `GEMINI_API_KEY` | Gemini REST calls | https://aistudio.google.com/apikey — free tier |
| `OPENAI_API_KEY` | OpenAI/Codex calls | https://platform.openai.com/api-keys — pay-as-you-go (no free tier) |

## Smoke test

`.github/workflows/ai-smoke-test.yml` — runs weekly (Mondays 12:00 UTC) and pings each provider with "reply pong". Any failure fails the job and surfaces in GitHub's notification.

Manually run:
```
gh workflow run ai-smoke-test.yml --repo palimkarakshay/lumivara-site
```

## Model IDs (as of 2026-04)

```
claude-opus-4-7              # strategic work
claude-sonnet-4-6            # code implementation
claude-haiku-4-5-20251001    # triage, trivial edits
gemini-2.5-pro               # 1M ctx, deep reasoning (free tier: 100 RPD)
gemini-2.5-flash             # fast, good enough for classification (free tier: 500 RPD)
gemini-2.5-flash-lite        # cheapest (free tier: 1000 RPD)
gpt-4o-mini                  # cheap OpenAI fallback, code review
gpt-4o                       # strong OpenAI when Codex is needed
```

## Review cadence

Check this table every ~2 months. New free/cheap models emerge regularly. Questions to ask:
- Is there a new Gemini/OpenAI tier with better free limits?
- Has a local/open model (Llama, Qwen) become good enough for triage?
- Is there a new code-review-specific model that's cheaper than gpt-4o-mini?

Suggest candidates in a GitHub issue tagged `type/claude-config`.
