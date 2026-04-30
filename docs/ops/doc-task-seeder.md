<!-- OPERATOR-ONLY. The capture layer for doc-driven backlog. -->

> _Lane: 🛠 Pipeline._

# Doc-task seeder

The pipeline (triage → plan → execute → review → merge) is **reactive**: nothing in it files new issues. Items only enter the system when something captures them — `gh issue create` from your desk, the `/admin` portal, or the n8n webhook from SMS / email.

This is the missing **doc-driven** capture path. Some backlog items exist only as `[ ]` rows in planning docs (POC plan §2 gap inventory, `08-future-work.md`, the templates index). Without an automatic seeder, those items rot until an operator opens the doc and remembers.

## Standards applied

This is **self-automation** — the bot files issues that the same pipeline (triage → plan → execute → review → merge) then consumes. That trust shape is exactly the failure mode named by:

* **OWASP LLM Top 10 — LLM08 (Excessive Agency).** The seeder must not acquire authority that the operator hasn't explicitly delegated. It treats every `--apply` call as a privileged action and refuses to file unless the operator has signed off on the specific source_ids in this run.
* **NIST AI RMF — Manage function.** Risk-management requires a documented human-in-the-loop control. The label-gated approval below is that control.
* **Internal: [`docs/AI_CONSISTENCY.md`](../AI_CONSISTENCY.md) hallucination guards.** Path verification, hard-exclusion list, fail-closed defaults — all carried into the seeder.

## Contract

* **Source of truth.** The fixed manifest list at the top of [`scripts/doc-task-seeder.py`](../../scripts/doc-task-seeder.py). Adding a doc requires a code change + PR; no run-time injection.
* **Detector (Tier 1, deterministic).** Regex against `<!-- bot-task: ... -->` HTML-comment markers. Markers inside fenced code blocks are excluded (Tier-1 hallucination guard against picking up examples). The script never invents a title, label, or body.
* **Cross-LLM verification (Tier 2 + 3).** Each candidate is reviewed by Gemini 2.5 Pro and (when `OPENAI_API_KEY` is set) by Codex / gpt-5.5 with a **steelman / pre-mortem prompt** that explicitly argues the case AGAINST filing before answering. A single `verify=false` from any model drops the candidate. If both verifiers abstain (no keys, network down), the candidate is also dropped — fail-closed.
* **Operator-attested approval gate (Tier 4 — the critical-mode gate).** The seeder maintains a control issue titled "Doc-task seeder — proposal log + approval gate". On every dry-run it posts a comment with the candidate set and each candidate's stable `source_id`. Before `--apply` will file anything, the operator MUST:
   1. Edit the control-issue body to include a line `approved_source_ids: <id> <id> ...` listing every source_id they're approving for THIS run.
   2. Apply the `seeder/approved` label.

  The seeder reads both. Any candidate whose source_id is missing is dropped. The label is removed automatically after a successful apply, so approval is **per-run, never standing**.
* **Idempotency.** Each filed issue carries a `<!-- doc-task-bot/v1:source_id=<sha1> -->` marker. Re-runs query open issues and skip any source_id already present. Closing an issue does not unblock re-filing — to genuinely re-file, edit the source marker (which changes the source_id).
* **Cap.** 3 new issues per run by default. The rest carry to the next run.
* **Dry-run by default.** Cron always runs dry. `--apply` requires manual `workflow_dispatch` AND the approval gate above.
* **Pattern C.** Default labels are `status/needs-triage, area/content, area/forge`. The seeder hard-refuses to apply `infra-allowed` from a marker — that flag is operator-attested and lives outside this loop.

## Marker syntax

Drop the marker inside the doc, immediately under the section it describes:

```markdown
## Subprocessor list publication

We publish a `/subprocessors` page on `{{BRAND_SLUG}}.com` listing every
data-handling vendor (Anthropic, Google, OpenAI, Vercel, Resend, Twilio,
GitHub, Railway). Required before client #3 per `08-future-work.md §1`.

<!-- bot-task: title="Publish /subprocessors page listing all data-handling vendors" labels="status/needs-triage,area/content,area/forge" body_anchor="#5-data-protection-and-privacy" -->
```

Attributes:

| Attribute | Required | Notes |
|-----------|----------|-------|
| `title` | yes | The exact issue title. The seeder does not paraphrase it. |
| `labels` | no  | Comma-separated. Defaults to `status/needs-triage,area/content,area/forge`. `infra-allowed` is silently dropped if present. |
| `body_anchor` | no | Markdown anchor (e.g. `#5-data-protection-and-privacy`) the seeder appends to the source URL in the issue body. Helps the executor jump straight to the right section. |

The seeder's filed issue body is intentionally short — it cites the source doc + line number and tells the executor to read that section. The actual scope description lives in the doc, not in the issue. This avoids the source-of-truth drift you'd get if every issue duplicated a paragraph of plan.

## Workflow

* `.github/workflows/doc-task-seeder.yml` — weekly cron (Sun 02:00 UTC) + `workflow_dispatch`.
* On cron: always dry-run. The job summary lists the candidates the seeder *would* file.
* On manual dispatch: operator picks `apply=true` to actually file. `max_new` overrides the default cap of 3.
* Artefacts (raw log + summary JSON) retained for 14 days.

## Operator workflow

1. **Place a marker.** Read a planning doc; spot a row that's bot-runnable but has no issue. Add a `<!-- bot-task: ... -->` marker under that row in the same PR you're already making.
2. **Wait for the cron.** Sunday 02:00 UTC the workflow fires a dry-run. It posts a comment to the control issue listing each new candidate, the cross-LLM verdicts (Gemini + Codex), and each candidate's `source_id`.
3. **Review the dry-run.** Read the verdicts. The pre-mortem step in each verifier explicitly argues against filing — if a candidate is genuinely wrong-grain, that's where you'll see it called out.
4. **Approve.** For each candidate you're authorising, copy the `source_id` into the control issue's body on the `approved_source_ids:` line. Apply the `seeder/approved` label.
5. **Apply.** Open Actions → Doc-task seeder → Run workflow → `apply=true`. The seeder verifies the gate, files only the approved candidates, removes the label.
6. **Triage takes over.** The filed issues land in Inbox with `status/needs-triage`; the existing pipeline classifies and executes them on its own.
7. The marker stays in the doc forever. Closing the issue does not unblock re-filing — to genuinely re-file, edit the marker title or `body_anchor` (which changes the `source_id`).

If you ever want to **veto** a candidate after the dry-run, you have three independent ways:
* Don't add its `source_id` to the approval list — simplest.
* Delete the marker from the doc — permanent.
* File a counter-issue describing why the marker is wrong; the seeder will keep proposing until the marker changes, but the operator's veto note in the control issue is enough audit trail.

## Why HTML-comment markers and not `[ ]` checkbox scanning

Checkbox scanning is appealing — it's automatic — but most `[ ]` rows in this repo's docs are wrong-grain for a bot:

* Some are operator-only (Vercel mirror, trademark filing).
* Some describe an audit step, not a deliverable.
* Some describe a sub-step that's already covered by a parent issue.

Markers force a human (or an agent like Claude in an interactive session) to flag *intent* — "yes, this row should become its own issue, the bot can land it" — before the seeder acts. That keeps the signal-to-noise ratio high and makes the source_id stable.

## Future work

* **`MODE=llm` (deferred).** A second path that uses Claude Opus to read the same manifest of docs, propose new candidates the deterministic path missed, and present them in the dry-run summary. The operator approves before any are filed. This is scaffolded in the script but not yet wired; see the `MODE` paragraph of the docstring. Trigger to enable: 4+ weeks of clean deterministic runs.
* **GitHub-issue closure detection.** Today, closing a filed issue does not re-open the candidate. A future revision could add a `reopen-stale=true` knob for cases where the operator wants the seeder to re-file after a manual close.
* **Codeowners alerting.** Add a `CODEOWNERS` rule so the operator gets notified on every seeder PR — not strictly necessary today since the seeder files issues, not PRs, and the operator triages issues from the dashboard already.

## Configuration matrix (industry-standard recap)

| Knob | Default | How to change | Why default |
|------|---------|---------------|-------------|
| Cron cadence | weekly Sun 02:00 UTC | Edit `doc-task-seeder.yml` | Docs change slowly; daily would be noise. |
| Cap per run | 3 | `workflow_dispatch.inputs.max_new` | Inbox-flood prevention. |
| Apply | false | `workflow_dispatch.inputs.apply` | Dry-run-first is the standard for any automated issue creator. |
| Manifest | 6 docs | Edit `MANIFEST` in the script | New doc = code change = review = audit trail. |
| Default labels | `status/needs-triage,area/content,area/forge` | `labels=` in the marker | Pipeline-lane is the safe default. |
| Cross-LLM verify | `consensus` (Gemini + Codex when keys present) | `--verify {gemini,codex,none}` | Multiple independent verifiers + steelman/pre-mortem prompt — fail-closed if all abstain. |
| Operator approval | required for every `--apply` | Apply `seeder/approved` label + `approved_source_ids:` line on the control issue | OWASP LLM08 — bound the agent's authority to "propose only". |

## Failure modes the gate is built to catch

| Failure mode | Without the gate | With the gate |
|---|---|---|
| Marker drift (operator edits the source row but forgets to update marker) | Bot files an obsolete-titled issue. | Operator sees it in the dry-run before approving the source_id. |
| Marker placed inside a code example | Bot files a phantom issue. | Tier-1 fenced-block exclusion drops it; Tier-2 verifiers also drop. |
| Prompt-injection text inside marker context | Bot's title/body inherits the injection. | Gemini + Codex steelman pass flags it; operator sees the pre-mortem reasoning. |
| Operator-only task slipped through (DNS, vendor signup) | Bot opens a PR that can't possibly land. | Steelman prompt explicitly checks "is this something only an operator can do." |
| Runaway loop (someone adds 50 markers in one PR) | 50 issues file overnight. | Per-run cap of 3 + per-run approval requirement throttles to operator's attention budget. |

*Last updated: 2026-04-30.*
