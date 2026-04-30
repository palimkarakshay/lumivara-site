#!/usr/bin/env bash
# ingest.sh — Recording ingest orchestrator (Pipeline lane).
#
# Purpose:
#   Take a recording file (audio / video / image / pdf / text) from
#   recordings/inbox/ — or as a CLI arg — transcribe it (where applicable),
#   classify it into a section (client-meetings / advisors / investors /
#   competitors / musings / research), route it into recordings/archive/
#   <section>/, write a structured analysis JSON, and append to
#   recordings/manifest.jsonl. The transcript is the immutable source of
#   truth; analysis can be regenerated.
#
# Usage:
#   scripts/record-ingest/ingest.sh path/to/file.m4a   # one file
#   scripts/record-ingest/ingest.sh                    # all files in inbox/
#   DRY_RUN=1 scripts/record-ingest/ingest.sh ...      # skip Claude / whisper
#   SEED_ISSUES=1 scripts/record-ingest/ingest.sh ...  # auto-seed Inbox issues
#                                                        when Claude flags
#                                                        operator-owned, urgent
#                                                        action items
#
# Why bash for orchestration: filesystem moves, mime detection, and exit-code
# handling read more clearly here than in Python. The Claude / Whisper calls
# are delegated to sibling helpers.
#
# Quality-first per AGENTS.md: every Claude output is JSON we parse, raw audio
# is never deleted, the transcript is never overwritten, and the conservative
# self-automation hand-off opens a `status/needs-triage` issue rather than
# editing code directly.

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
HERE="$(cd "$(dirname "$0")" && pwd)"
SECTIONS=(client-meetings advisors investors competitors musings research)

INBOX="$ROOT/recordings/inbox"
ARCHIVE="$ROOT/recordings/archive"
TRANSCRIPTS="$ROOT/recordings/transcripts"
ANALYSIS="$ROOT/recordings/analysis"
MANIFEST="$ROOT/recordings/manifest.jsonl"

mkdir -p "$INBOX" "$ARCHIVE" "$TRANSCRIPTS" "$ANALYSIS"
for s in "${SECTIONS[@]}"; do mkdir -p "$ARCHIVE/$s"; done

slug() {
  printf '%s' "$1" \
    | tr '[:upper:]' '[:lower:]' \
    | sed -e 's/[^a-z0-9]/-/g' -e 's/-\{2,\}/-/g' -e 's/^-//' -e 's/-$//'
}

process_file() {
  local src="$1"
  local base; base="$(basename "$src")"
  local stem="${base%.*}"
  local mime; mime="$(file -b --mime-type "$src" 2>/dev/null || echo unknown)"
  local id; id="$(date -u +%Y%m%dT%H%M%SZ)-$(slug "$stem")"
  local transcript_path="$TRANSCRIPTS/$id.md"

  printf '\n>> ingest: %s (%s) -> id=%s\n' "$base" "$mime" "$id"

  case "$mime" in
    audio/*)
      "$HERE/transcribe.sh" "$src" "$transcript_path"
      ;;
    video/*)
      local audio_tmp; audio_tmp="$(mktemp -t recording-audio.XXXXXX).m4a"
      if ! command -v ffmpeg >/dev/null 2>&1; then
        echo "!! ffmpeg not installed; cannot extract audio from video. Install: brew install ffmpeg" >&2
        return 2
      fi
      ffmpeg -hide_banner -loglevel error -y -i "$src" -vn -c:a aac "$audio_tmp"
      "$HERE/transcribe.sh" "$audio_tmp" "$transcript_path"
      rm -f "$audio_tmp"
      ;;
    text/*)
      # Inline the file's contents so the analyser sees the real note /
      # document and can extract anchored quotes + action items. We use a
      # synthetic [00:00:00] anchor as the line stamp for the whole asset
      # so the drift-guard (which insists every claim cite a [hh:mm:ss]
      # anchor present in the transcript) accepts citations from text.
      {
        printf '# %s\n\n' "$id"
        printf '_Source: %s_  \n' "$base"
        printf '_MIME: %s_  \n\n' "$mime"
        printf '[00:00:00] (text asset — full contents below)\n\n'
        printf '```\n'
        cat "$src"
        printf '\n```\n'
      } > "$transcript_path"
      ;;
    image/*|application/pdf)
      {
        printf '# %s\n\n' "$id"
        printf '_Source: %s_  \n' "$base"
        printf '_MIME: %s_  \n' "$mime"
        printf '_(no audio transcript — non-audio asset; analysis covers contents)_\n'
      } > "$transcript_path"
      ;;
    *)
      echo "!! unknown mime $mime — filing without transcript" >&2
      {
        printf '# %s\n\n' "$id"
        printf '_Source: %s_  \n' "$base"
        printf '_MIME: %s_  \n' "$mime"
      } > "$transcript_path"
      ;;
  esac

  local analysis_json="$ANALYSIS/$id.json"
  python3 "$HERE/analyze.py" \
    --transcript "$transcript_path" \
    --source "$src" \
    --mime "$mime" \
    --output "$analysis_json"

  local section
  section="$(python3 -c 'import json,sys; print(json.load(open(sys.argv[1])).get("section","musings"))' "$analysis_json")"
  local match=0
  for s in "${SECTIONS[@]}"; do [[ "$s" == "$section" ]] && match=1; done
  if [[ "$match" -eq 0 ]]; then
    echo "!! analyzer returned unknown section '$section' — defaulting to musings" >&2
    section=musings
    python3 -c '
import json, sys
p = sys.argv[1]
d = json.load(open(p))
d["section"] = "musings"
d.setdefault("warnings", []).append("section-fallback: analyzer returned unknown section")
json.dump(d, open(p, "w"), indent=2)
' "$analysis_json"
  fi

  local dest="$ARCHIVE/$section/$base"
  if [[ -e "$dest" ]]; then
    dest="$ARCHIVE/$section/$id-$base"
  fi
  mv "$src" "$dest"

  python3 - "$transcript_path" "$analysis_json" "$dest" "$section" >> "$MANIFEST" <<'PY'
import json, sys, time, hashlib, pathlib
transcript, analysis_path, dest, section = sys.argv[1:5]
analysis = json.loads(pathlib.Path(analysis_path).read_text())
sha = hashlib.sha256(pathlib.Path(dest).read_bytes()).hexdigest()
print(json.dumps({
    "id":         analysis.get("id"),
    "ts":         time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    "section":    section,
    "source":     dest,
    "sha256":     sha,
    "transcript": transcript,
    "analysis":   analysis_path,
    "summary":    analysis.get("summary"),
    "action_items_count": len(analysis.get("action_items", [])),
    "self_automation_trigger": bool(analysis.get("self_automation_trigger")),
}))
PY

  printf '<< archived: %s\n   transcript: %s\n   analysis:   %s\n' \
    "$dest" "$transcript_path" "$analysis_json"

  if [[ "${SEED_ISSUES:-0}" == "1" ]]; then
    python3 "$HERE/seed-inbox-issue.py" \
      --analysis "$analysis_json" \
      --section "$section" || true
  fi
}

if [[ $# -eq 0 ]]; then
  shopt -s nullglob
  files=("$INBOX"/*)
  shopt -u nullglob
  files=("${files[@]/$INBOX\/README.md}")
  files=("${files[@]/}")  # drop empty
  if [[ ${#files[@]} -eq 0 ]]; then
    echo "inbox empty: $INBOX"
    exit 0
  fi
  for f in "${files[@]}"; do
    [[ -f "$f" && "$(basename "$f")" != "README.md" ]] && process_file "$f"
  done
else
  for f in "$@"; do
    if [[ ! -f "$f" ]]; then
      echo "!! not a file: $f" >&2
      continue
    fi
    process_file "$f"
  done
fi
