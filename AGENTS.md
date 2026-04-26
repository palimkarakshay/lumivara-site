<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

<!-- BEGIN:session-budget-charter -->
# Session-budget charter (highest priority)

Day-to-day work on this repo is automated via Claude in GitHub Actions, billed against a single Pro subscription's shared 5-hour rolling quota. Budget overflow squeezes the operator's interactive Claude work. **Every agent — CI or interactive — observes the rules below.** They take precedence over any prompt asking you to "do more in one shot."

## Self-pacing within a single CI run

Use `--max-turns` as your budget proxy. Estimate `used_pct = turns_taken / max_turns`.

- **At ~50% used**: finish the current concrete unit (one issue for `execute`, one issue's classification for `triage`). Commit, push, comment as the playbook requires. Then **stop** — do NOT pick up another unit. Print `BUDGET: 50%, exiting cleanly after current unit`.
- **At ~80% used**: stop **immediately**. Commit any in-progress code to a branch (push if safe), label the affected issue `status/needs-continuation` with a comment listing (a) what's done, (b) what remains, (c) the branch name if any. Print `BUDGET: 80%, hard exit; resume next run`. Do not attempt cleanup that costs more turns.
- A run that exits at 50% or 80% is a **success**, not a failure. The next scheduled run resumes.

## Across runs

- **Triage**: cap of 5–10 issues per run (also enforced in `scripts/triage-prompt.md`). Use Haiku — assigned via the workflow's `--model` arg.
- **Execute**: ONE issue per run. If implementation exceeds 60% of max-turns, leave a draft PR with what works and a comment listing the rest. Operator triages whether to retry or split.

## For interactive Claude sessions on the laptop

- If the user signals "approaching usage limits" or "stop / wrap up": phase remaining work into Inbox issues (`status/needs-triage`), commit current state to a branch (or main if appropriate and stable), stop. Do NOT push through.
- Default to **incremental commits** (one logical change per commit). This makes partial work recoverable on any wakeup.
- Prefer letting the bot do work over doing it yourself. The operator's interactive budget is for direction, debugging, and configuration — not bulk implementation.

## Tracking

After each run, the action emits `total_cost_usd` and `num_turns` in its JSON output. Surface these in the run summary so the operator can spot quota drift.
<!-- END:session-budget-charter -->

<!-- BEGIN:vercel-parity -->
# Vercel production parity

Any change in this repo that influences production behaviour — environment variables, build commands, Next.js rewrites/redirects, or output configuration — must also be applied manually in the Vercel dashboard by the operator. GitHub Actions can update code and open PRs, but it cannot write Vercel project settings. When an agent implements such a change, it must: (1) append a `**Vercel mirror required:**` section to the PR description listing the exact steps the operator must take in the Vercel dashboard, and (2) add the `needs-vercel-mirror` label to the issue. The operator confirms the mirror is done by removing that label. Track all pending mirrors via the `needs-vercel-mirror` label view on the Issues tab.
<!-- END:vercel-parity -->
