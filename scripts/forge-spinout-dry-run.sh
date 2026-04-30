#!/usr/bin/env bash
# forge-spinout-dry-run.sh — simulate the Dual-Lane Repo spinout, print the per-lane
# file plan, and FAIL if any tracked file is uncovered by the manifest.
#
# This is the script the operator runs at the start of Phase 4 (Client #1
# spinout per docs/migrations/00-automation-readiness-plan.md §1) to confirm
# the actual spinout will be mechanical. Every commit on this repo should be
# able to run this and get a green dry-run.
#
# What it does:
#   1. Loads .dual-lane.yml (the manifest).
#   2. Walks `git ls-files`.
#   3. For each tracked file, finds the most-specific lane assignment in the
#      manifest (longest matching prefix wins).
#   4. Prints a summary: site=N, pipeline=M, both=K, drop=J, uncovered=X,
#      contamination=Y.
#   5. Exits non-zero if uncovered > 0 (validation gate) or if any
#      contamination row matches a real path (informational, prints them).
#
# Flags:
#   --verbose         Print every file:lane assignment (default: summary only).
#   --site            Print only files going to the site repo at spinout.
#   --pipeline        Print only files going to the pipeline repo at spinout.
#   --both            Print only files in the `both` lane.
#   --uncovered       Print only files not covered by any lane (validation
#                     gate fails if this list is non-empty).
#   --json            Emit machine-readable JSON instead of human prose.
#
# Usage:
#   scripts/forge-spinout-dry-run.sh                   # summary
#   scripts/forge-spinout-dry-run.sh --verbose          # per-file plan
#   scripts/forge-spinout-dry-run.sh --uncovered        # gate check
#   scripts/forge-spinout-dry-run.sh --site             # site-bound files

set -uo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT" || exit 2

MANIFEST="${ROOT}/.dual-lane.yml"
[ -f "$MANIFEST" ] || { echo "ERROR: $MANIFEST not found" >&2; exit 2; }

VERBOSE=0
FILTER=""
JSON=0
for arg in "$@"; do
  case "$arg" in
    --verbose|-v)   VERBOSE=1 ;;
    --site)         FILTER="site" ;;
    --pipeline)     FILTER="pipeline" ;;
    --both)         FILTER="both" ;;
    --drop)         FILTER="drop" ;;
    --uncovered)    FILTER="uncovered" ;;
    --json)         JSON=1 ;;
    -h|--help)      sed -n '2,30p' "$0"; exit 0 ;;
  esac
done

# ----- Parse the manifest with a small Python helper -----
# YAML parsing in pure bash is fragile; we use the python that's on every
# CI runner (and the operator's laptop) instead. The parser writes a flat
# tab-separated <lane>\t<path> table to stdout, which bash then loads.

# Find a real Python interpreter. Order: python3 → py (Windows launcher) → python.
# On Windows, `python3` and `python` may resolve to the Microsoft Store shortcut
# stub; we filter those out by requiring `--version` to succeed.
PYTHON=""
for candidate in python3 py python; do
  if command -v "$candidate" >/dev/null 2>&1; then
    if "$candidate" --version >/dev/null 2>&1; then
      PYTHON="$candidate"
      break
    fi
  fi
done
[ -n "$PYTHON" ] || { echo "ERROR: a real python3 / py / python is required (the Windows Store stub does not count)" >&2; exit 2; }

TABLE="$(
"$PYTHON" - "$MANIFEST" <<'PYEOF' | tr -d '\r'
import sys, re

# Tiny YAML subset parser: enough to read .dual-lane.yml's lanes / contamination
# blocks. Avoids requiring PyYAML on a fresh laptop.

manifest = sys.argv[1]
with open(manifest, encoding="utf-8") as f:
    lines = f.read().splitlines()

lanes = {"site": [], "pipeline": [], "both": [], "drop": []}
contamination = []
current_lane = None
in_lanes_block = False
in_contamination_block = False

# Walk top-level keys.
for raw in lines:
    line = raw.rstrip()
    if not line.strip() or line.lstrip().startswith("#"):
        continue
    indent = len(line) - len(line.lstrip())

    if indent == 0:
        in_lanes_block = line.strip().startswith("lanes:")
        in_contamination_block = line.strip().startswith("contamination:")
        current_lane = None
        continue

    if in_lanes_block:
        if indent == 2 and line.endswith(":"):
            current_lane = line.strip().rstrip(":")
            if current_lane not in lanes:
                lanes[current_lane] = []
            continue
        if current_lane and line.lstrip().startswith("- "):
            stripped = line.lstrip()[2:].strip()
            # Two shapes: bare path, or `path: foo` mapping
            if stripped.startswith("path:"):
                p = stripped.split("path:", 1)[1].strip()
                lanes[current_lane].append(p)
            elif stripped and not stripped.startswith(("kind:", "transform:", "note:")):
                lanes[current_lane].append(stripped)
            continue

    if in_contamination_block:
        if line.lstrip().startswith("- path:"):
            p = line.split("path:", 1)[1].strip()
            contamination.append(p)
            continue

# Emit lane→path TSV; contamination rows prefixed with `_contamination`.
for lane, paths in lanes.items():
    for p in paths:
        # Strip surrounding quotes if any.
        p = p.strip().strip('"').strip("'")
        if p:
            print(f"{lane}\t{p}")
for p in contamination:
    p = p.strip().strip('"').strip("'")
    if p:
        print(f"_contamination\t{p}")
PYEOF
)"

if [ -z "$TABLE" ]; then
  echo "ERROR: parser returned no rows from $MANIFEST" >&2
  exit 2
fi

# Build path→lane map (longest prefix wins). Bash associative array indexed
# by path-or-prefix string.
declare -A LANE_OF
declare -a PREFIXES
while IFS=$'\t' read -r lane path; do
  [ -z "$lane" ] && continue
  LANE_OF["$path"]="$lane"
  PREFIXES+=("$path")
done <<< "$TABLE"

# Sort prefixes by descending length so longest match wins.
mapfile -t PREFIXES_SORTED < <(
  printf '%s\n' "${PREFIXES[@]}" \
    | awk '{ print length, $0 }' \
    | sort -rn \
    | cut -d' ' -f2-
)

# ----- Walk every tracked file -----
declare -A COUNT
declare -a UNCOVERED_FILES
declare -a SITE_FILES PIPELINE_FILES BOTH_FILES DROP_FILES CONTAM_FILES

while IFS= read -r f; do
  matched=""
  for prefix in "${PREFIXES_SORTED[@]}"; do
    if [[ "$prefix" == */ ]]; then
      if [[ "$f" == "$prefix"* ]]; then
        matched="$prefix"
        break
      fi
    else
      if [[ "$f" == "$prefix" ]]; then
        matched="$prefix"
        break
      fi
    fi
  done
  if [ -n "$matched" ]; then
    lane="${LANE_OF[$matched]:-}"
    case "$lane" in
      site)           SITE_FILES+=("$f"); COUNT[site]=$((${COUNT[site]:-0}+1)) ;;
      pipeline)       PIPELINE_FILES+=("$f"); COUNT[pipeline]=$((${COUNT[pipeline]:-0}+1)) ;;
      both)           BOTH_FILES+=("$f"); COUNT[both]=$((${COUNT[both]:-0}+1)) ;;
      drop)           DROP_FILES+=("$f"); COUNT[drop]=$((${COUNT[drop]:-0}+1)) ;;
      _contamination) CONTAM_FILES+=("$f"); COUNT[contamination]=$((${COUNT[contamination]:-0}+1)) ;;
    esac
  else
    UNCOVERED_FILES+=("$f")
    COUNT[uncovered]=$((${COUNT[uncovered]:-0}+1))
  fi
done < <(git ls-files)

# ----- Output -----
TOTAL=$(git ls-files | wc -l)

if [ "$JSON" -eq 1 ]; then
  printf '{"total":%d,"site":%d,"pipeline":%d,"both":%d,"drop":%d,"contamination":%d,"uncovered":%d}\n' \
    "$TOTAL" \
    "${COUNT[site]:-0}" \
    "${COUNT[pipeline]:-0}" \
    "${COUNT[both]:-0}" \
    "${COUNT[drop]:-0}" \
    "${COUNT[contamination]:-0}" \
    "${COUNT[uncovered]:-0}"
else
  case "$FILTER" in
    site)       printf '%s\n' "${SITE_FILES[@]}" ;;
    pipeline)   printf '%s\n' "${PIPELINE_FILES[@]}" ;;
    both)       printf '%s\n' "${BOTH_FILES[@]}" ;;
    drop)       printf '%s\n' "${DROP_FILES[@]}" ;;
    uncovered)  printf '%s\n' "${UNCOVERED_FILES[@]}" ;;
    *)
      printf 'Dual-Lane Repo spinout dry-run\n'
      printf '  Manifest: %s\n' "${MANIFEST#$ROOT/}"
      printf '  Tracked:  %s files\n' "$TOTAL"
      printf '\n'
      printf '  site            %5s\n' "${COUNT[site]:-0}"
      printf '  pipeline        %5s\n' "${COUNT[pipeline]:-0}"
      printf '  both            %5s\n' "${COUNT[both]:-0}"
      printf '  drop            %5s\n' "${COUNT[drop]:-0}"
      printf '  contamination   %5s  (informational; needs operator decision)\n' "${COUNT[contamination]:-0}"
      printf '  uncovered       %5s  (validation gate)\n' "${COUNT[uncovered]:-0}"
      printf '\n'
      if [ "$VERBOSE" -eq 1 ]; then
        printf '== site ==\n';     printf '  %s\n' "${SITE_FILES[@]}"
        printf '== pipeline ==\n'; printf '  %s\n' "${PIPELINE_FILES[@]}"
        printf '== both ==\n';     printf '  %s\n' "${BOTH_FILES[@]}"
        printf '== contamination ==\n'; printf '  %s\n' "${CONTAM_FILES[@]}"
      fi
      if [ "${COUNT[uncovered]:-0}" -gt 0 ]; then
        printf '== uncovered (FAIL) ==\n'
        printf '  %s\n' "${UNCOVERED_FILES[@]}"
        printf '\nforge-spinout-dry-run: ✗ %s tracked file(s) lack a lane assignment.\n' \
          "${COUNT[uncovered]:-0}"
        printf 'Add them to .dual-lane.yml `lanes:` (or `drop:`) and re-run.\n'
      else
        printf 'forge-spinout-dry-run: ✓ every tracked file is classified.\n'
      fi
      ;;
  esac
fi

# Exit code: non-zero iff uncovered > 0.
if [ "${COUNT[uncovered]:-0}" -gt 0 ]; then
  exit 1
fi
exit 0
