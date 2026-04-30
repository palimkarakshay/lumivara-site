#!/usr/bin/env bash
# test-smoke.sh — end-to-end smoke test for the record-ingest pipeline.
#
# Runs the orchestrator under DRY_RUN=1 against an isolated temp recordings
# root, drops one synthetic file per supported mime branch (audio / image /
# text / unknown), and asserts:
#
#   * inbox is drained (every input file moved out)
#   * each archived file lands in archive/<section>/ (DRY_RUN stub routes
#     everything to musings/, which is the documented stub behaviour)
#   * transcripts and analysis JSONs were written and parse cleanly
#   * manifest.jsonl has the expected number of well-formed lines
#   * seed-inbox-issue.py refuses on a `trigger=false` analysis
#
# Used by .github/workflows/record-ingest-smoke.yml on every PR that touches
# the pipeline. Operator can also run it locally:
#
#     scripts/record-ingest/test-smoke.sh
#
# It uses `mktemp -d` for the test recordings root so it never touches the
# operator's real archive.

set -euo pipefail

ROOT="$(git rev-parse --show-toplevel)"
HERE="$(cd "$(dirname "$0")" && pwd)"

PASS=0
FAIL=0
pass() { printf '  ✓ %s\n' "$1"; PASS=$((PASS + 1)); }
fail() { printf '  ✗ %s\n' "$1"; FAIL=$((FAIL + 1)); }

TEST_ROOT="$(mktemp -d -t record-ingest-smoke.XXXXXX)"
trap 'rm -rf "$TEST_ROOT"' EXIT
echo "test recordings root: $TEST_ROOT"
mkdir -p "$TEST_ROOT/inbox"

# --- §1: synthetic fixtures, one per mime branch the orchestrator handles ---
echo
echo "=== §1: stage synthetic fixtures ==="
# audio: 44-byte zero-sample WAV (file(1) reports audio/x-wav)
printf 'RIFF$\x00\x00\x00WAVEfmt \x10\x00\x00\x00\x01\x00\x01\x00\x44\xac\x00\x00\x88X\x01\x00\x02\x00\x10\x00data\x00\x00\x00\x00' > "$TEST_ROOT/inbox/smoke-audio.wav"
# image: 1x1 PNG
printf '\x89PNG\r\n\x1a\n\x00\x00\x00\rIHDR\x00\x00\x00\x01\x00\x00\x00\x01\x08\x06\x00\x00\x00\x1f\x15\xc4\x89\x00\x00\x00\rIDATx\x9cc\xf8\x0f\x00\x00\x01\x01\x00\x05\x9eM\xa1\xb6\x00\x00\x00\x00IEND\xaeB`\x82' > "$TEST_ROOT/inbox/smoke-image.png"
# text
printf 'Quick scratch note: investor follow-up Tuesday\n' > "$TEST_ROOT/inbox/smoke-text.txt"
# unknown: zero-byte
: > "$TEST_ROOT/inbox/smoke-unknown.bin"

ls -1 "$TEST_ROOT/inbox/"

# --- §2: run ingest under DRY_RUN ---
echo
echo "=== §2: run DRY_RUN=1 ingest.sh against the temp root ==="
RECORDINGS_ROOT="$TEST_ROOT" DRY_RUN=1 "$HERE/ingest.sh" 2>&1 | sed 's/^/    /'

# --- §3: post-run filesystem assertions ---
echo
echo "=== §3: filesystem assertions ==="
inbox_left=$(find "$TEST_ROOT/inbox" -maxdepth 1 -type f ! -name 'README.md' | wc -l | tr -d ' ')
[ "$inbox_left" = "0" ] && pass "inbox drained (0 files left)" || fail "inbox not drained ($inbox_left file(s) left)"

archived=$(find "$TEST_ROOT/archive" -type f ! -name 'README.md' | wc -l | tr -d ' ')
[ "$archived" = "4" ] && pass "4 sources moved into archive/" || fail "expected 4 archived sources, got $archived"

transcripts=$(find "$TEST_ROOT/transcripts" -maxdepth 1 -type f -name '*.md' ! -name 'README.md' | wc -l | tr -d ' ')
[ "$transcripts" = "4" ] && pass "4 transcripts written" || fail "expected 4 transcripts, got $transcripts"

analyses=$(find "$TEST_ROOT/analysis" -maxdepth 1 -type f -name '*.json' | wc -l | tr -d ' ')
[ "$analyses" = "4" ] && pass "4 analysis JSONs written" || fail "expected 4 analysis files, got $analyses"

manifest_lines=$(wc -l < "$TEST_ROOT/manifest.jsonl" | tr -d ' ')
[ "$manifest_lines" = "4" ] && pass "manifest has 4 lines" || fail "expected 4 manifest lines, got $manifest_lines"

# --- §4: manifest line shape ---
echo
echo "=== §4: manifest schema assertions ==="
python3 - "$TEST_ROOT/manifest.jsonl" <<'PY' && pass "every manifest line has required keys" || fail "manifest schema mismatch"
import json, sys
required = {"id", "ts", "section", "source", "sha256", "transcript", "analysis", "summary", "action_items_count", "self_automation_trigger"}
ok = True
for ln in open(sys.argv[1]):
    d = json.loads(ln)
    missing = required - set(d.keys())
    if missing:
        print(f"  missing keys {missing} in {d.get('id')}", file=sys.stderr)
        ok = False
sys.exit(0 if ok else 1)
PY

# --- §5: text content was inlined into the text/* transcript ---
echo
echo "=== §5: text content inlined into transcript ==="
text_transcript=$(grep -l 'investor follow-up Tuesday' "$TEST_ROOT/transcripts/"*.md || true)
[ -n "$text_transcript" ] && pass "text/* transcript contains source content" || fail "text/* transcript missing source content (Codex P2 regression)"

# --- §6: analyzer didn't hit the API (DRY_RUN env honoured) ---
echo
echo "=== §6: DRY_RUN propagation (Codex P1) ==="
stub_count=$(grep -l '"drift_check": "stub-mode"' "$TEST_ROOT/analysis/"*.json | wc -l | tr -d ' ')
[ "$stub_count" = "4" ] && pass "all analyses are stub-mode (no API calls)" || fail "expected 4 stub analyses, got $stub_count"

# --- §7: seed-inbox-issue.py refuses on a trigger=false analysis ---
echo
echo "=== §7: conservative gate refuses trigger=false ==="
sample_analysis=$(ls "$TEST_ROOT/analysis/"*.json | head -1)
DRY_RUN=1 python3 "$HERE/seed-inbox-issue.py" \
  --analysis "$sample_analysis" \
  --section musings \
  > "$TEST_ROOT/seed.out" 2>&1
grep -q 'trigger=false; skipping' "$TEST_ROOT/seed.out" && pass "seed-inbox-issue.py skipped on stub trigger=false" || fail "seed-inbox-issue.py did not skip as expected"

# --- §8: seeded issue body uses caller-provided paths (Codex P2 regression) ---
echo
echo "=== §8: seeded issue body honours --transcript / --source ==="
# Synthetic analysis with a real trigger; pretend the artefacts live under
# the temp RECORDINGS_ROOT so the issue body MUST cite that path, not the
# hard-coded recordings/... default.
fake_analysis="$TEST_ROOT/analysis/fake-trigger.json"
cat > "$fake_analysis" <<EOF
{
  "id": "fake-trigger",
  "section": "musings",
  "self_automation_trigger": true,
  "summary": "Operator follow-up needed by Tuesday",
  "action_items": [
    {"text": "Email investor", "owner": "operator", "ts": "00:00:12",
     "requires_action": true, "urgency": "high"}
  ]
}
EOF
DRY_RUN=1 python3 "$HERE/seed-inbox-issue.py" \
  --analysis "$fake_analysis" \
  --section musings \
  --transcript "$TEST_ROOT/transcripts/fake-trigger.md" \
  --source "$TEST_ROOT/archive/musings/fake-source.m4a" \
  > "$TEST_ROOT/seed-trigger.out" 2>&1
grep -q "transcript: \`$TEST_ROOT/transcripts/fake-trigger.md\`" "$TEST_ROOT/seed-trigger.out" \
  && pass "issue body cites caller-provided transcript path" \
  || fail "issue body did not cite the caller-provided transcript path (Codex P2 regression)"
grep -q "source:     \`$TEST_ROOT/archive/musings/fake-source.m4a\`" "$TEST_ROOT/seed-trigger.out" \
  && pass "issue body cites caller-provided source path" \
  || fail "issue body did not cite the caller-provided source path"
grep -q '`recordings/transcripts/fake-trigger.md`' "$TEST_ROOT/seed-trigger.out" \
  && fail "issue body still contains hard-coded recordings/ path (Codex P2 regression)" \
  || pass "no hard-coded recordings/ path leaked into issue body"

# --- §9: validator unit tests ---
echo
echo "=== §9: drift-guard validator unit tests ==="
python3 "$HERE/test-validator.py" && pass "validator unit tests passed" || fail "validator unit tests failed"

# --- summary ---
echo
echo "=== summary ==="
echo "  PASS: $PASS"
echo "  FAIL: $FAIL"
[ "$FAIL" = "0" ] || exit 1
