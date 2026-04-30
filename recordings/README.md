> _Lane: 🛠 Pipeline — operator-private recording archive. Docs travel to the Forge pipeline repo at P5.6 spinout; raw media never lives in git._

# `recordings/` — operator recording archive

Drop point for voice memos, meeting recordings, screen captures, photos, and notes that the Lumivara Forge ingest pipeline (`scripts/record-ingest/`) classifies, transcribes, and files. Architecture, free toolchain, drift mitigations, and consent stance live in [`docs/mothership/23-operator-recording-pipeline.md`](../docs/mothership/23-operator-recording-pipeline.md) — read that first.

## Layout

```
recordings/
├── inbox/                       # drop new files here; ingest.sh empties this
├── archive/                     # post-classification destination
│   ├── client-meetings/
│   ├── advisors/
│   ├── investors/
│   ├── competitors/
│   ├── musings/                 # solo voice memos
│   └── research/                # third-party content (talks, podcasts) studied
├── transcripts/                 # one .md per recording, [hh:mm:ss] timestamps
├── analysis/                    # one .json per recording, Claude output
└── manifest.jsonl               # append-only log
```

## What gets committed vs. ignored

`.gitignore` keeps the **structure** (this README + each section's `README.md`) tracked, while the **content** (audio, video, images, transcripts, analyses, manifest) stays operator-private and never enters git history. The exact ignore rules are in `.gitignore`; do not commit recording files even with `git add -f`.

## Quick start

```bash
# 1. Drop a file
cp ~/Desktop/2026-04-30-investor-call.m4a recordings/inbox/

# 2. Ingest (transcribe + classify + route + analyse)
scripts/record-ingest/ingest.sh

# 3. Optional: seed an Inbox issue if Claude flagged operator-owned action items
SEED_ISSUES=1 scripts/record-ingest/ingest.sh
```

Dry run (no whisper, no Claude — useful when an Anthropic key isn't set or you're testing the wiring):

```bash
DRY_RUN=1 scripts/record-ingest/ingest.sh recordings/inbox/sample.m4a
```

## Consent

Every recording in this archive must carry verbal consent from any other parties **captured in the audio itself** — operator policy, not negotiable. See [`docs/mothership/23-operator-recording-pipeline.md §1`](../docs/mothership/23-operator-recording-pipeline.md).
