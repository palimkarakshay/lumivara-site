<!-- OPERATOR-ONLY. Operator contract for the doc-task seeder. -->

> _Lane: 🛠 Pipeline._

# Doc-task seeder

The pipeline (triage → plan → execute → review → merge) is **reactive**: nothing in it files new issues. Items only enter the system when something captures them — `gh issue create` from the desk, the `/admin` portal, or the n8n webhook from SMS / email.

This is the missing **doc-driven** capture path. Some backlog items exist only as `[ ]` rows in planning docs (POC plan §2 gap inventory, `08-future-work.md`, the templates index). Without an automatic seeder, those items rot until an operator opens the doc and remembers.

## Standards applied

This is **self-automation** — the bot files issues that the same pipeline then consumes. That trust shape is the failure mode named by:

* **OWASP LLM Top 10 — LLM08 (Excessive Agency).** The seeder must not acquire authority that the operator hasn't explicitly delegated. Every `--apply` is treated as a privileged action and refused unless the operator has signed off on the specific source_ids in this run.
* **NIST AI RMF — Manage function.** Risk-management requires a documented human-in-the-loop control. The label-gated approval below is that control.
* **Internal: [`docs/AI_CONSISTENCY.md`](../AI_CONSISTENCY.md) hallucination guards.** Path verification, hard-exclusion list, fail-closed defaults — all carried into the seeder.

## Trust tiers (defence in depth, fail-closed at every layer)

| Tier | Mechanism | Fails to | Drop trigger |
|---|---|---|---|
| 1 — Detector | Regex against a fixed `MANIFEST` of planning docs. Markers inside fenced code blocks are excluded. | Pass | No marker on disk; marker inside ``` fence; missing `title=`. |
| 2 — Gemini | Gemini 2.5 Pro reads ~10 lines of context and runs a steelman / pre-mortem prompt. | Abstain (no key, network) | `verify=false` from Gemini OR all-abstain in consensus mode. |
| 3 — Codex | gpt-5.5 runs the same prompt independently. | Abstain (no key, network) | `verify=false` from Codex OR all-abstain. |
| 4 — Operator gate | Operator edits the control issue's body to add a `approved_source_ids:` line, applies the `seeder/approved` label. | Refuse to file | Source_id missing from approved list; label missing. |

A single "no" / "false" / "missing" at any tier drops the candidate. The four tiers are independent.

## Marker syntax

Drop the marker inside the doc, immediately under the section it describes:

```markdown
## Subprocessor list publication

We publish a `/subprocessors` page on `{{BRAND_SLUG}}.com` listing every
data-handling vendor (Anthropic, Google, OpenAI, Vercel, Resend, Twilio,
GitHub, Railway). Required before client #3 per `08-future-work.md §1`.

<!-- bot-task: title="Publish /subprocessors page listing all data-handling vendors" labels="status/needs-triage,area/content,area/forge" body_anchor="#5-data-protection-and-privacy" -->
```

| Attribute | Required | Notes |
|-----------|----------|-------|
| `title` | yes | Exact issue title; the seeder does not paraphrase. |
| `labels` | no  | Comma-separated. Defaults to `status/needs-triage,area/content,area/forge`. `infra-allowed` is silently dropped if present. |
| `body_anchor` | no | Markdown anchor (e.g. `#5-data-protection-and-privacy`) the seeder appends to the source URL in the issue body. |

The seeder's filed issue body is intentionally short — it cites the source doc + line number and tells the executor to read that section. The actual scope description lives in the doc, not in the issue. This avoids source-of-truth drift.

## Operator workflow

1. **Place a marker.** Read a planning doc; spot a row that's bot-runnable but has no issue. Add a `<!-- bot-task: ... -->` marker under that row in the same PR you're already making.
2. **Wait for the cron.** Daily 02:00 UTC, the workflow fires a dry-run. It posts a comment to the control issue listing each new candidate, the cross-LLM verdicts (Gemini + Codex), and each candidate's `source_id`.
3. **Review the dry-run.** Read the verdicts. The pre-mortem step in each verifier explicitly argues against filing — wrong-grain candidates get called out there.
4. **Approve.** For each candidate you're authorising, copy the `source_id` into the control issue's body on the `approved_source_ids:` line. Apply the `seeder/approved` label.
5. **Apply.** Open Actions → Doc-task seeder → Run workflow → `apply=true`. The seeder verifies the gate, files only the approved candidates, removes the label.
6. **Triage takes over.** The filed issues land in Inbox with `status/needs-triage`; the existing pipeline classifies and executes them.

The marker stays in the doc forever. Closing the issue does not unblock re-filing — to genuinely re-file, edit the marker title or `body_anchor` (which changes the `source_id`).

## Failure modes the gate is built to catch

| Failure mode | Without the gate | With the gate |
|---|---|---|
| Marker drift (operator edits the source row but forgets to update marker) | Bot files an obsolete-titled issue. | Operator sees it in the dry-run before approving the source_id. |
| Marker placed inside a code example | Bot files a phantom issue. | Tier-1 fenced-block exclusion drops it; Tier-2/3 verifiers also drop. |
| Prompt-injection text inside marker context | Bot's title/body inherits the injection. | Gemini + Codex steelman pass flags it; operator sees the pre-mortem reasoning. |
| Operator-only task slipped through (DNS, vendor signup) | Bot opens a PR that can't possibly land. | Steelman prompt explicitly checks "is this something only an operator can do." |
| Runaway loop (someone adds 50 markers in one PR) | 50 issues file overnight. | Per-run cap of 3 + per-run approval requirement throttles to operator's attention budget. |

## Configuration matrix

| Knob | Default | How to change | Why default |
|------|---------|---------------|-------------|
| Cron cadence | daily 02:00 UTC | Edit `doc-task-seeder.yml` | Aggressive deploy-push phase. Roll back to weekly post-cost-optimisation. |
| Cap per run | 3 | `workflow_dispatch.inputs.max_new` | Inbox-flood prevention. |
| Apply | false | `workflow_dispatch.inputs.apply` | Dry-run-first is industry standard for any automated issue creator. |
| Manifest | 6 docs | Edit `MANIFEST` in `scripts/doc-task-seeder.py` | New doc = code change = review = audit trail. |
| Default labels | `status/needs-triage,area/content,area/forge` | `labels=` in the marker | Pipeline-lane is the safe default. |
| Cross-LLM verify | `consensus` | `--verify {gemini,codex,none}` via dispatch | Both verifiers must agree (when keys present); fail-closed if all abstain. |
| Operator approval | required for every `--apply` | `seeder/approved` label + `approved_source_ids:` line on control issue | OWASP LLM08 — bound the agent's authority to "propose only". |

*Last updated: 2026-04-30. Cadence reflects the aggressive deploy-push phase; rollback target named per row.*
