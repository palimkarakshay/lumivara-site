#!/usr/bin/env bash
# transcribe.sh — Whisper wrapper. Free, local, deterministic ASR.
#
# Tries (in order of preference):
#   1. whisper.cpp     — fastest on CPU, smallest deps
#   2. faster-whisper  — best speed/quality on CTranslate2
#   3. openai-whisper  — reference Python implementation
#
# Output: markdown transcript with [hh:mm:ss] timestamps, written to <out>.
# Honours DRY_RUN=1 (skip ASR, write a stub) so the orchestrator can be wired
# up before any whisper backend is installed.
#
# Env:
#   WHISPER_MODEL       default: large-v3
#   WHISPER_MODEL_PATH  path to a whisper.cpp .bin model file (whisper.cpp only)

set -euo pipefail

src="$1"
out="$2"
model="${WHISPER_MODEL:-large-v3}"

if [[ "${DRY_RUN:-0}" == "1" ]]; then
  cat > "$out" <<EOF
# $(basename "$src")

[00:00:00] (dry-run stub — no ASR was run; install a whisper backend and re-run without DRY_RUN=1)
EOF
  exit 0
fi

if command -v whisper-cpp >/dev/null 2>&1 && [[ -n "${WHISPER_MODEL_PATH:-}" ]]; then
  tmp="$(mktemp -d)"
  whisper-cpp -m "$WHISPER_MODEL_PATH" -f "$src" -ovtt -of "$tmp/out" >/dev/null
  python3 - "$tmp/out.vtt" > "$out" <<'PY'
import sys, re, pathlib
lines = pathlib.Path(sys.argv[1]).read_text().splitlines()
print(f"# transcript")
print()
for i, ln in enumerate(lines):
    m = re.match(r'^(\d{2}:\d{2}:\d{2})\.\d+ --> ', ln)
    if m and i + 1 < len(lines):
        text = lines[i+1].strip()
        if text:
            print(f"[{m.group(1)}] {text}")
PY
  rm -rf "$tmp"
  exit 0
fi

if python3 -c 'import faster_whisper' 2>/dev/null; then
  python3 - "$src" "$model" > "$out" <<'PY'
import sys
from faster_whisper import WhisperModel
src, model = sys.argv[1], sys.argv[2]
m = WhisperModel(model, device="auto", compute_type="auto")
segments, _ = m.transcribe(src, vad_filter=True)
print("# transcript")
print()
for s in segments:
    h = int(s.start // 3600)
    mn = int((s.start % 3600) // 60)
    sc = int(s.start % 60)
    print(f"[{h:02d}:{mn:02d}:{sc:02d}] {s.text.strip()}")
PY
  exit 0
fi

if command -v whisper >/dev/null 2>&1; then
  tmp="$(mktemp -d)"
  whisper "$src" --model "$model" --output_format vtt --output_dir "$tmp" --verbose False >/dev/null
  vtt="$tmp/$(basename "${src%.*}").vtt"
  python3 - "$vtt" > "$out" <<'PY'
import sys, re, pathlib
print("# transcript")
print()
lines = pathlib.Path(sys.argv[1]).read_text().splitlines()
for i, ln in enumerate(lines):
    m = re.match(r'^(\d{2}:\d{2}:\d{2})\.\d+ --> ', ln)
    if m and i + 1 < len(lines):
        text = lines[i+1].strip()
        if text:
            print(f"[{m.group(1)}] {text}")
PY
  rm -rf "$tmp"
  exit 0
fi

cat >&2 <<'EOF'
!! No Whisper backend found. Install one of (free, all run locally):

   pip install -U faster-whisper          # recommended (best speed/quality)
   pip install -U openai-whisper          # reference implementation
   brew install whisper-cpp               # fastest on CPU; needs model file

Then re-run scripts/record-ingest/ingest.sh.

For dry runs without ASR: DRY_RUN=1 scripts/record-ingest/ingest.sh ...
EOF
exit 3
