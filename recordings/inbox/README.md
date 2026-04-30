> _Lane: 🛠 Pipeline._

# `inbox/` — drop zone

Drop newly-captured recordings here. `scripts/record-ingest/ingest.sh` (with no args) processes every file in this folder, then moves the source into the right `archive/<section>/`. Files are gitignored.

Supported formats out of the box (mime-type sniffed):

- **Audio** — `.m4a`, `.mp3`, `.wav`, `.ogg`, `.flac` → Whisper transcription
- **Video** — `.mp4`, `.mov`, `.mkv`, `.webm` → ffmpeg audio extract → Whisper
- **Image** — `.jpg`, `.jpeg`, `.png`, `.heic` → Claude vision pass, no transcript
- **Document** — `.pdf`, `.txt`, `.md` → routed with summary, no transcript
