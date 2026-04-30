> _Lane: 🛠 Pipeline._

# `analysis/`

One `.json` per recording — Claude's structured output: section, summary, people, companies, topics, verbatim quotes (with `[ts]` anchors), action items, and a `self_automation_trigger` boolean. Files are gitignored. To re-analyse a transcript without altering the source of truth, delete the matching `.json` and re-run `ingest.sh` — the transcript is never re-generated.
