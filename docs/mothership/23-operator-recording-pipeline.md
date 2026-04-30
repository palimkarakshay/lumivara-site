> _Lane: 🛠 Pipeline._

# 23 — Operator recording pipeline

The Forge ingest path for client meetings, advisor / investor calls, openly-attended competitor events, solo musings, and third-party research recordings. Every stage uses **free** tools (Whisper local, ffmpeg, Claude via the operator's existing Max subscription); the only paid input is the operator's time. Architecture is designed around one principle: **the transcript is the immutable source of truth, and AI output never overwrites it**.

This doc is the operator-private spec for the implementation under [`scripts/record-ingest/`](../../scripts/record-ingest/) and the archive scaffolding under [`recordings/`](../../recordings/).

---

## §1 — Consent (operator policy, not negotiable)

Every recording in the archive must carry verbal consent **captured in the audio itself** — first 10 seconds, on tape, from every other party. The pipeline does not enforce this; the operator does, at capture time. Reasons:

1. **Legal.** US all-party-consent states (CA, FL, IL, MD, MA, MT, NH, PA, WA) and EU/UK GDPR + ePrivacy treat covert capture of an identifiable person as unlawful. A single covertly recorded conversation is enough to trigger statutory damages and, in some states, criminal exposure.
2. **Reputational.** Lumivara Forge sells trust to operators and clients. A leaked covert recording would end that posture immediately.
3. **Operational.** Consent on tape is also the operator's own evidence trail — it ages well, survives ambiguity, and is replayable.

The `competitors/` section is the obvious tension point. Resolution: only record competitor interactions where the operator is **identified** (sales demos where the operator says who they are, public conference talks, podcasts where consent is implicit by the format). Never record a competitor under pretext.

---

## §2 — Free toolchain

| Stage | Tool | Notes |
|---|---|---|
| Voice memos | iPhone Voice Memos / macOS Voice Memos | built-in, free |
| Meeting capture | OBS Studio + BlackHole (mac) | free; system audio + mic + screen on one timeline |
| In-person backup | Sony ICD-PX470 (≈ $50, one-time) | hardware safety net for video calls |
| Image / screenshot | macOS Screenshot (`Cmd-Shift-5`), iPhone camera | built-in |
| Audio extract from video | ffmpeg | free, CLI |
| Transcription | `faster-whisper` (CTranslate2 build) — fallback `openai-whisper` or `whisper.cpp` | free, runs locally; no audio leaves the laptop |
| Analysis | Claude Opus via the operator's Max subscription | already paid for; `analyze.py` calls the API path with `ANTHROPIC_API_KEY`, which the operator can swap to the local Claude CLI later |
| Storage | local disk + the operator's regular backup (Time Machine / Backblaze) | free at the margin |

**No new SaaS subscriptions are required.** Every paid tool was already on the operator's bill before this pipeline existed.

---

## §3 — Architecture (append-only, three layers)

```
1. Raw media          (recordings/archive/<section>/, immutable, never deleted)
        ↓ deterministic ASR (Whisper local)
2. Transcript         (recordings/transcripts/<id>.md, [hh:mm:ss] anchors)
        ↓ single Claude call, transcript-only input
3. Analysis           (recordings/analysis/<id>.json, drift-validated)
        ↓ conservative gate
4. (optional)         status/needs-triage GitHub issue
```

Three drift-mitigation rules, mechanical:

1. **The transcript is the source of truth.** It is written once. The orchestrator does not re-ASR a file with an existing transcript — to re-transcribe, the operator deletes the transcript first, intentionally.
2. **The analyser sees only the transcript.** Never a prior summary. There is no compounding-summary failure mode, because there is no chain.
3. **The validator drops un-anchored claims.** `analyze.py` checks every quote for verbatim presence in the transcript and every action item for a `[hh:mm:ss]` anchor that exists in the transcript. Anything that fails either check is removed before write. The `self_automation_trigger` flag is then **re-derived** from the surviving anchored items, so a hallucinated trigger cannot survive the validator.

This is what "max AI without AI drift in the recorded messages" means in practice: the AI's contribution is downstream of the source, never upstream, and every claim it makes is checkable against the source by string match.

---

## §4 — Folder layout

```
recordings/                       # gitignored except for READMEs (see .gitignore)
├── inbox/                        # drop new files here
├── archive/                      # post-classification destination
│   ├── client-meetings/
│   ├── advisors/
│   ├── investors/
│   ├── competitors/              # public events only — see §1
│   ├── musings/                  # solo operator memos
│   └── research/                 # third-party content being studied
├── transcripts/                  # one .md per recording
├── analysis/                     # one .json per recording
└── manifest.jsonl                # append-only log (id, sha256, section, ts, ...)
```

The structure is tracked in git (each section's `README.md`); the contents are not. The dual-lane manifest puts `recordings/` in the `pipeline` lane so the READMEs travel to the operator-private repo at P5.6 spinout.

---

## §5 — Sections and self-automation

| Section | Self-automation? | Why |
|---|---|---|
| `musings` | ✅ Eligible | Operator is the only speaker → operator owns every action item by definition. Highest-signal source for issues. |
| `client-meetings` | ✅ Eligible | Action items follow the engagement; operator-owned subset is real work. |
| `advisors` | ✅ Eligible | Operator-owned recommendations get acted on. |
| `investors` | ✅ Eligible | Diligence requests, follow-ups, intro asks — all operator-owned. |
| `competitors` | ❌ Disabled | Intel, not work. Operator decides if any action follows. |
| `research` | ❌ Disabled | Same — third-party content informs strategy, doesn't generate it. |

The conservative gate in `seed-inbox-issue.py` enforces the table above. It opens an issue only when **all four** conditions hold:

1. Section is in the eligible set.
2. `self_automation_trigger` is true (which the validator re-derives from anchored items only).
3. The analysis carries no `error` field.
4. At least one action item has `owner=operator`, `requires_action=true`, `urgency in {medium, high}`.

The issue lands as `status/needs-triage` so the existing Forge triage → plan → execute pipeline picks it up. **The recording pipeline never edits code, sends external messages, or writes to anything outside `recordings/`.** Hand-off via Inbox issue is the only side-channel.

---

## §6 — When to expand this

Pre-spinout, no expansion. Post-spinout, two natural extensions live in [`docs/mothership/08-future-work.md`](./08-future-work.md):

- **Speaker diarisation** (who said what) — `pyannote-audio` is free + local, but adds setup friction; defer until the archive has ≥ 20 multi-speaker recordings.
- **Vector retrieval** over transcripts — SQLite + `sqlite-vec` is sufficient at this volume; defer until the operator finds themselves grepping the archive often.

Neither is on the path today. The pipeline as built is the **smallest thing that solves the question** ("free options, create space, transfer + acknowledge, conservative self-automation"). Resist the urge to retrieve, summarise across files, or build a UI until the manual workflow proves the demand.

---

## §7 — Operating cadence

- **Daily:** drop files in `recordings/inbox/`, run `scripts/record-ingest/ingest.sh`, glance at the new analysis JSON.
- **Weekly:** `SEED_ISSUES=1 scripts/record-ingest/ingest.sh` to convert the week's flagged operator-owned action items into Inbox issues. The triage workflow then picks them up on its normal schedule.
- **Monthly:** review `recordings/manifest.jsonl` for sections that are filling unevenly (e.g., zero `advisors/` for a month → the operator isn't getting enough input there).

_Last updated: 2026-04-30._
