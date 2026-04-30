> _Lane: 🛠 Pipeline._

# `scripts/record-ingest/` — recording → archive → optional issue

Operator-private ingest pipeline that takes a single recording (audio / video / image / pdf / text) from `recordings/inbox/`, transcribes it (where applicable), classifies it into a section, routes it to `recordings/archive/<section>/`, writes a structured analysis JSON, and — only when the analysis flags operator-owned urgent action items — opens a `status/needs-triage` issue so the existing Forge triage → plan → execute pipeline can pick it up.

Architecture, free toolchain, drift mitigations, and consent stance live in [`docs/mothership/23-operator-recording-pipeline.md`](../../docs/mothership/23-operator-recording-pipeline.md).

## Files

| File | What it does |
|---|---|
| `ingest.sh` | Orchestrator. Mime-sniffs, calls `transcribe.sh`, then `analyze.py`, then routes the source into `archive/<section>/`, then appends a manifest line. With `SEED_ISSUES=1`, calls `seed-inbox-issue.py`. |
| `transcribe.sh` | Whisper wrapper. Tries `whisper.cpp` → `faster-whisper` → `openai-whisper`. Output is markdown with `[hh:mm:ss]` timestamps. Honours `DRY_RUN=1`. |
| `analyze.py` | Single Claude call (Opus by default per AGENTS.md model-default table). Returns strict JSON with section, summary, people, companies, topics, verbatim quotes, action items, and `self_automation_trigger`. Includes a drift-guard that drops un-anchored items + non-verbatim quotes before writing to disk. |
| `seed-inbox-issue.py` | Conservative gate. Opens a `status/needs-triage` issue ONLY when the analysis flagged operator-owned urgent items AND the section is not intel-only (`competitors` / `research`). |
| `test-smoke.sh` | End-to-end DRY_RUN smoke harness. Stages four synthetic inputs (audio / image / text / unknown mime) into a temp `RECORDINGS_ROOT` (so it never touches the operator's real archive), runs `ingest.sh`, then asserts inbox drain, archive routing, transcript + analysis + manifest shape, text-content inlining, DRY_RUN propagation, and the conservative-gate behaviour. Also calls `test-validator.py`. Run locally with `scripts/record-ingest/test-smoke.sh`. |
| `test-validator.py` | Drift-guard unit tests over `analyze._validate()`. Four fixtures (all-clean / mixed / all-bad / unknown-section) pin the contract: un-anchored items dropped, non-verbatim quotes dropped, `self_automation_trigger` re-derived from survivors so a hallucinated trigger cannot survive. |

## Usage

```bash
# Ingest one file
scripts/record-ingest/ingest.sh ~/Desktop/2026-04-30-investor-call.m4a

# Drain the inbox
scripts/record-ingest/ingest.sh

# Dry-run (no Whisper, no Claude — just exercise the wiring)
DRY_RUN=1 scripts/record-ingest/ingest.sh recordings/inbox/sample.m4a

# Auto-seed Inbox issues when warranted
SEED_ISSUES=1 scripts/record-ingest/ingest.sh

# Smoke test the whole pipeline (CI runs this on every relevant PR)
scripts/record-ingest/test-smoke.sh
```

CI lives in [`.github/workflows/record-ingest-smoke.yml`](../../.github/workflows/record-ingest-smoke.yml) and triggers on PRs that touch `scripts/record-ingest/**`, `recordings/**/README.md`, or the workflow itself. It runs the same `test-smoke.sh` + `test-validator.py` you'd run locally — same assertions, isolated temp recordings root, no AI provider calls.

## Drift discipline

Three layers, each immutable in its own way:

1. **Raw audio** — never deleted, archived under `recordings/archive/<section>/`.
2. **Transcript** — `[hh:mm:ss]` timestamps, written once, never overwritten by a later run. Re-running ingest on the same file would skip the transcribe step (delete the transcript first if you genuinely want to re-ASR).
3. **Analysis** — re-runnable. The analyser sees ONLY the transcript, never a prior summary, so there is no compounding-summary failure mode. The validator strips quotes that aren't verbatim and action items that aren't anchored to a timestamp.

The `self_automation_trigger` flag is recomputed by the validator from the surviving anchored action items, so it cannot be inflated by the model.

## Consent

Every recording must carry verbal consent from any other parties **captured in the audio itself**. See [`docs/mothership/23-operator-recording-pipeline.md §1`](../../docs/mothership/23-operator-recording-pipeline.md). The pipeline does not enforce this — the operator does, at capture time.
