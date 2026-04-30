#!/usr/bin/env bash
# render-decks.sh — Marp deck auto-renderer for the deck pipeline.
#
# Why this exists:
#   docs/AI_CLAUDE_DESIGN_PLAYBOOK.md (Layer 1) defines a deterministic
#   MD-source -> HTML-deck pipeline. This is the script that does the work,
#   shared by the local operator (`bash scripts/render-decks.sh <mode>`) and
#   the CI workflow (.github/workflows/render-decks.yml).
#
# What this script does:
#   §1 Discover Marp deck sources under docs/** by parsing YAML frontmatter
#      (file starts with `---`, contains `marp: true` before the closing `---`).
#      Any other .md file (READMEs, indexes, playbooks, sales templates with
#      no frontmatter) is skipped automatically.
#   §2 Filter that discovery set against the requested mode:
#        incremental  -> only Marp MDs changed in HEAD~1..HEAD
#        retroactive  -> only Marp MDs whose paired .html is missing or older
#        force        -> all Marp MDs
#   §3 Render each target via `npx -y @marp-team/marp-cli --html <md> -o <html>`.
#      Output lands next to the source: `<dir>/<name>.md` -> `<dir>/<name>.html`.
#   §4 Verify the render touched only the expected HTML files (render-surface
#      fence per AI_CLAUDE_DESIGN_PLAYBOOK §3 quality gate 3).
#
# Run:
#   bash scripts/render-decks.sh                              # incremental (default)
#   bash scripts/render-decks.sh incremental
#   bash scripts/render-decks.sh retroactive
#   bash scripts/render-decks.sh force
#   bash scripts/render-decks.sh --deck docs/decks/01-investor-deck.md
#                                                             # render one specific deck (bypasses mode)
#   bash scripts/render-decks.sh --list                       # print discovered Marp MDs and exit
#
# Exit codes:
#   0 = success (one or more decks rendered, or no targets matched the mode)
#   1 = render failure (marp-cli non-zero on at least one target)
#   2 = surface-fence violation (render touched something it shouldn't)
#   3 = bad arg / environment

set -uo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT" || { echo "render-decks: cannot cd to repo root" >&2; exit 3; }

MODE="incremental"
LIST_ONLY=0
SINGLE_DECK=""

case "${1:-incremental}" in
  --list) LIST_ONLY=1; MODE="force" ;;
  --deck)
    if [ -z "${2:-}" ]; then
      echo "render-decks: --deck requires a path argument" >&2
      exit 3
    fi
    SINGLE_DECK="${2//\\//}"
    MODE="single"
    ;;
  incremental|retroactive|force) MODE="$1" ;;
  -h|--help)
    sed -n '2,35p' "$0"
    exit 0
    ;;
  *)
    echo "render-decks: unknown mode '$1' (expected: incremental | retroactive | force | --deck <path> | --list)" >&2
    exit 3
    ;;
esac

# ----------------------------------------------------------------------------
# §1 Discover Marp deck sources under docs/**
# ----------------------------------------------------------------------------
# A deck source must:
#   (a) live under docs/**
#   (b) be a .md file
#   (c) start with `---` on line 1 (YAML frontmatter open marker)
#   (d) contain a line `marp: true` (any whitespace) before the closing `---`
#
# We use awk so a `marp: true` example sitting inside a fenced code block in
# regular prose (e.g. AI_CLAUDE_DESIGN_PLAYBOOK.md) cannot trigger a false
# positive — only frontmatter is inspected.
is_marp_deck() {
  local f="$1"
  [ -f "$f" ] || return 1
  awk '
    NR == 1 {
      if ($0 != "---") { exit 1 }
      in_fm = 1
      next
    }
    in_fm == 1 && $0 == "---" { exit 1 }
    in_fm == 1 && /^marp:[[:space:]]*true[[:space:]]*$/ { exit 0 }
    NR > 50 { exit 1 }
  ' "$f"
}

ALL_MARP_MDS=()
while IFS= read -r f; do
  # Normalize Windows-style paths from `git ls-files` on Git Bash.
  f="${f//\\//}"
  if is_marp_deck "$f"; then
    ALL_MARP_MDS+=("$f")
  fi
done < <(git ls-files 'docs/*.md' 'docs/**/*.md' 2>/dev/null)

if [ "$LIST_ONLY" = "1" ]; then
  printf '%s\n' "${ALL_MARP_MDS[@]}"
  exit 0
fi

if [ "${#ALL_MARP_MDS[@]}" = "0" ]; then
  echo "render-decks: no Marp deck sources found under docs/**" >&2
  exit 0
fi

# ----------------------------------------------------------------------------
# §2 Filter to mode-specific target set
# ----------------------------------------------------------------------------
TARGETS=()

case "$MODE" in
  incremental)
    # Files changed in the latest push (HEAD~1..HEAD). On the first commit of a
    # branch HEAD~1 may not exist; fall back to HEAD against the empty tree.
    if git rev-parse HEAD~1 >/dev/null 2>&1; then
      CHANGED=$(git diff --name-only HEAD~1 HEAD -- 'docs/**.md' 2>/dev/null | tr -d '\r')
    else
      CHANGED=$(git diff --name-only "$(git hash-object -t tree /dev/null)" HEAD -- 'docs/**.md' 2>/dev/null | tr -d '\r')
    fi
    while IFS= read -r f; do
      [ -z "$f" ] && continue
      f="${f//\\//}"
      if is_marp_deck "$f"; then
        TARGETS+=("$f")
      fi
    done <<< "$CHANGED"
    ;;

  retroactive)
    for md in "${ALL_MARP_MDS[@]}"; do
      html="${md%.md}.html"
      if [ ! -f "$html" ]; then
        TARGETS+=("$md")
      elif [ "$md" -nt "$html" ]; then
        TARGETS+=("$md")
      fi
    done
    ;;

  force)
    TARGETS=("${ALL_MARP_MDS[@]}")
    ;;

  single)
    if [ ! -f "$SINGLE_DECK" ]; then
      echo "render-decks: --deck path '$SINGLE_DECK' does not exist" >&2
      exit 3
    fi
    if ! is_marp_deck "$SINGLE_DECK"; then
      echo "render-decks: '$SINGLE_DECK' is not a Marp deck (missing 'marp: true' in frontmatter)" >&2
      echo "render-decks: known Marp decks:" >&2
      printf '  - %s\n' "${ALL_MARP_MDS[@]}" >&2
      exit 3
    fi
    TARGETS=("$SINGLE_DECK")
    ;;
esac

if [ "${#TARGETS[@]}" = "0" ]; then
  echo "render-decks: mode='$MODE' matched no targets — nothing to do."
  exit 0
fi

echo "render-decks: mode='$MODE' targeting ${#TARGETS[@]} deck source(s):"
printf '  - %s\n' "${TARGETS[@]}"

# ----------------------------------------------------------------------------
# §3 Render via marp-cli, snapshotting the expected output paths first so the
#     surface fence in §4 has a known good set to compare against.
# ----------------------------------------------------------------------------
EXPECTED_HTML=()
RENDER_FAILED=0

for md in "${TARGETS[@]}"; do
  html="${md%.md}.html"
  EXPECTED_HTML+=("$html")
  echo "render-decks: rendering $md -> $html"
  if ! npx -y @marp-team/marp-cli --html "$md" -o "$html" >/tmp/marp-render.log 2>&1; then
    echo "render-decks: ✗ marp-cli failed for $md" >&2
    sed 's/^/    /' /tmp/marp-render.log >&2
    RENDER_FAILED=1
  fi
done

if [ "$RENDER_FAILED" = "1" ]; then
  echo "render-decks: one or more renders failed; aborting." >&2
  exit 1
fi

# ----------------------------------------------------------------------------
# §4 Render-surface fence — verify nothing outside the expected HTML set was
#     touched. This catches a bug in marp, a stray script side-effect, or a
#     concurrent edit landing in the same workflow run.
# ----------------------------------------------------------------------------
DIRTY=$(git status --porcelain | awk '{print $2}' | tr -d '\r')

if [ -z "$DIRTY" ]; then
  echo "render-decks: no HTML changed (sources rendered to identical output)."
  exit 0
fi

# Build a lookup of acceptable paths.
declare -A OK
for h in "${EXPECTED_HTML[@]}"; do
  OK["$h"]=1
done

VIOLATIONS=()
while IFS= read -r line; do
  [ -z "$line" ] && continue
  line="${line//\\//}"
  if [ -z "${OK[$line]:-}" ]; then
    VIOLATIONS+=("$line")
  fi
done <<< "$DIRTY"

if [ "${#VIOLATIONS[@]}" -gt 0 ]; then
  echo "render-decks: ✗ surface-fence violation — render touched files outside the expected HTML set:" >&2
  printf '    %s\n' "${VIOLATIONS[@]}" >&2
  echo "render-decks: refusing to commit. Investigate before re-running." >&2
  exit 2
fi

echo "render-decks: ✓ rendered ${#EXPECTED_HTML[@]} deck(s); surface fence clean."
