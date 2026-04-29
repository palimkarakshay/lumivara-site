<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:session-budget-charter -->
# Session charter — quality first (highest priority)

This project is in a **critical planning stage**. The operator runs on a **Claude Max 20x subscription** (shared 5-hour rolling quota, ~20× the Pro tier). Day-to-day automation is billed against that quota, **but cost optimisation is explicitly NOT a priority right now** — best-possible outcome is. Pick the strongest available model for every step, take the turns you need, and prefer Opus + extended thinking over cutting corners.

A future "client onboarding" milestone will revisit cost/throughput trade-offs. Until then, treat every workflow as if quality is the only metric.

## Self-pacing within a single CI run

Use `--max-turns` as a soft watermark, not a budget cap. Estimate `used_pct = turns_taken / max_turns`.

- **At ~80% used**: finish the current concrete unit (one issue for `execute`, one issue's classification for `triage`). Commit, push, comment as the playbook requires. Then stop — don't start a new unit. Print `BUDGET: 80%, exiting cleanly after current unit`.
- **At ~95% used**: stop immediately. Commit any in-progress code to a branch (push if safe), label the affected issue `status/needs-continuation` with a comment listing (a) what's done, (b) what remains, (c) the branch name if any. Print `BUDGET: 95%, hard exit; resume next run`.
- A run that exits at 80% or 95% is a **success**, not a failure. The next scheduled run resumes.

## Across runs

- **Triage**: cap of ~25 issues per run (also enforced in `scripts/triage-prompt.md`). Default model is **Claude Opus** — best classification quality. Haiku/Sonnet remain available but are not the default in this phase.
- **Execute**: up to **3 issues per cron run**, processed sequentially. Stop after the first if it consumed >70% of max-turns. If a single issue exceeds 85% of max-turns, leave a draft PR with what works and a comment listing the rest.
- **Plan**: Opus on the planning pass, Opus on the implementation pass. The plan/implement split is for clarity, not for tier downgrade.

## Model selection defaults (this phase)

| Stage                | Default                           | Notes |
|----------------------|-----------------------------------|-------|
| Triage classification| `claude-opus-4-7`                 | Strongest label decisions; queue is small. |
| Plan generation      | `claude-opus-4-7`                 | Plans are read by every executor downstream — quality compounds. |
| Code implementation  | `claude-opus-4-7`                 | Trivial through complex all use Opus until cost optimisation phase. |
| Subagent calls       | `claude-opus-4-7`                 | Set in `.claude/settings.json`. |
| OpenAI / Codex       | `gpt-5.5`                         | ChatGPT Plus tier — second-opinion review, plan fallback, triage fallback. |
| Gemini deep research | `gemini-2.5-pro`                  | 1M-token context; free tier covers our volume. |
| Gemini triage backup | `gemini-2.5-flash`                | Free tier 500 req/day — keeps the fallback loop unconstrained. |

When cost optimisation later returns to the agenda, this table is the single place to bias the routing back down.

## For interactive Claude sessions on the laptop

- If the user signals "approaching usage limits" or "stop / wrap up": phase remaining work into Inbox issues (`status/needs-triage`), commit current state to a branch (or main if appropriate and stable), stop. Do NOT push through.
- Default to **incremental commits** (one logical change per commit). This makes partial work recoverable on any wakeup.
- With Max 20x quota, interactive sessions can be longer and more exploratory. The bot is still the right place for bulk implementation; interactive time is for direction, architecture, and review.

## Tracking

After each run, the action emits `total_cost_usd` and `num_turns` in its JSON output. Surface these in the run summary so the operator can spot quota drift — useful for the future cost-optimisation pass even though it is not gating now.
<!-- END:session-budget-charter -->

<!-- BEGIN:vercel-parity -->
# Vercel production parity

Any change in this repo that influences production behaviour — environment variables, build commands, Next.js rewrites/redirects, or output configuration — must also be applied manually in the Vercel dashboard by the operator. GitHub Actions can update code and open PRs, but it cannot write Vercel project settings. When an agent implements such a change, it must: (1) append a `**Vercel mirror required:**` section to the PR description listing the exact steps the operator must take in the Vercel dashboard, and (2) add the `needs-vercel-mirror` label to the issue. The operator confirms the mirror is done by removing that label. Track all pending mirrors via the `needs-vercel-mirror` label view on the Issues tab.
<!-- END:vercel-parity -->
