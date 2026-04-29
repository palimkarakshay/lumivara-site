#!/usr/bin/env bash
# pattern-c-audit.sh — Pattern C drift detector for the single-repo (pre-spinout) state.
#
# Why this exists:
#   docs/mothership/02b-pattern-c-architecture.md (canonical Pattern C, locked
#   2026-04-28) and pattern-c-enforcement-checklist.md define a two-repo trust
#   model. Before the P5.6 spinout we live in a single repo where Site (Client
#   #1) and Pipeline (operator: Lumivara Forge) artefacts coexist. Drift
#   accumulates unless we keep watching: stale brand strings, operator pitch
#   leaking into client routes, forbidden client identifiers in operator-scope
#   docs, committed secrets, etc.
#
# What this script checks (each is a discrete grep; non-zero exit per failure):
#   §1  Stale brand: "Lumivara Infotech" anywhere outside this script.
#   §2  Operator pitch on the site repo: src/app/lumivara-infotech/** or
#       src/content/lumivara-infotech.ts present (flagged, not auto-fixed —
#       relocation requires operator decision; tracked in PR #200).
#   §3  Client #1 forbidden strings in operator-scope docs (per 15 §6).
#       Allow-list: 15-terminology-and-brand.md itself, the migration-history
#       docs explicitly named in 15 §6, README.md / CONTRIBUTING.md (the
#       transitional Client #1 framing the policy permits), and any line
#       inside a `> _Client example — see 15 §7._` callout.
#   §4  High-entropy strings (likely committed secrets) in tracked files.
#   §5  Duplicate doc numbering inside docs/mothership/ index rows.
#
# Output: a section per check. Each violating line is printed with file:line
# so the operator can jump to it. Returns non-zero overall if any check fails.
#
# Run:
#   scripts/pattern-c-audit.sh                   # all checks, summary
#   scripts/pattern-c-audit.sh --fix-brand-drift # auto-rewrite Infotech→Forge
#                                                  in safe scopes (docs prose)
#
# This script is the persistent mechanism behind PR #200's "Pattern C sweep"
# request. Follow-up: wire into ai-smoke-test.yml (or its own workflow) so
# violations are flagged on schedule, not just at audit time.

set -uo pipefail

ROOT="$(git rev-parse --show-toplevel 2>/dev/null || pwd)"
cd "$ROOT" || exit 2

FAIL=0
FIX_BRAND_DRIFT=0
for arg in "$@"; do
  case "$arg" in
    --fix-brand-drift) FIX_BRAND_DRIFT=1 ;;
    -h|--help)
      sed -n '2,32p' "$0"
      exit 0
      ;;
  esac
done

print_section() {
  printf '\n=== %s ===\n' "$1"
}

print_pass() { printf '  ✓ %s\n' "$1"; }
print_fail() { printf '  ✗ %s\n' "$1"; FAIL=1; }

# ----- §1 — Stale brand "Lumivara Infotech" -----
print_section "§1 — Stale brand: 'Lumivara Infotech' should be 'Lumivara Forge'"
mapfile -t INFOTECH_HITS < <(
  git grep -nIE 'Lumivara[ -]Infotech' \
    -- ':!scripts/pattern-c-audit.sh' \
       ':!CHANGELOG.md' \
       ':!docs/storefront/04-slide-deck.pdf' \
       ':!docs/storefront/04-slide-deck.html' \
    2>/dev/null
)
if [ "${#INFOTECH_HITS[@]}" -eq 0 ]; then
  print_pass "no 'Lumivara Infotech' references outside this script."
else
  print_fail "${#INFOTECH_HITS[@]} 'Lumivara Infotech' references found:"
  printf '      %s\n' "${INFOTECH_HITS[@]}"
  if [ "$FIX_BRAND_DRIFT" -eq 1 ]; then
    printf '    > --fix-brand-drift: rewriting markdown / TypeScript prose…\n'
    # Safe scope: markdown and TypeScript files; exclude file paths and URL slugs.
    git grep -lIE 'Lumivara[ -]Infotech' \
      -- '*.md' '*.ts' '*.tsx' \
         ':!docs/storefront/04-slide-deck.pdf' \
         ':!docs/storefront/04-slide-deck.html' \
         ':!scripts/pattern-c-audit.sh' \
         ':!CHANGELOG.md' \
      | while read -r f; do
          # Replace display strings only; keep URL slugs and filenames intact.
          sed -i 's/Lumivara Infotech/Lumivara Forge/g' "$f"
        done
    printf '    > rewritten. Re-run without --fix-brand-drift to confirm.\n'
  fi
fi

# ----- §2 — Operator pitch on the site repo -----
print_section "§2 — Operator pitch routes on the site repo (Pattern C contamination)"
if [ -d src/app/lumivara-infotech ] || [ -e src/content/lumivara-infotech.ts ]; then
  print_fail "operator pitch present on the site repo:"
  [ -d src/app/lumivara-infotech ]   && printf '      src/app/lumivara-infotech/ (page route)\n'
  [ -e src/content/lumivara-infotech.ts ] && printf '      src/content/lumivara-infotech.ts (content)\n'
  printf '    > Per 02b §6 / C-MUST-1: operator brand should not occupy a\n'
  printf '      site-repo URL tree. Relocate to lumivara-forge.com (15 §5)\n'
  printf '      or to a separate operator demo URL. Tracked in PR #200.\n'
else
  print_pass "no operator pitch routes on the site repo."
fi

# ----- §3 — Client #1 forbidden strings in operator-scope docs (15 §6) -----
print_section "§3 — Forbidden Client #1 strings in operator-scope docs (15 §6)"
# Allow-list, mirroring 15 §6 § "Scope rules":
#   - The policy file itself (`15-terminology-and-brand.md`) and its index
#     entries / cross-references inside `00-INDEX.md`.
#   - Migration-history docs explicitly named in 15 §6 row "Migration history
#     & critique" (01, 05, 07, 08, 10, 14, 15, 17 in mothership/, plus
#     migrations/ and BACKLOG.md).
#   - The new master `docs/00-INDEX.md` quotes the policy itself and references
#     the spinout runbook — same migration-history exemption.
#   - The freelance pack's positioning + product-strategy decks reference
#     the Client #1 spinout because that's the single concrete migration
#     example. They count as migration-history per 15 §6.
#   - Per-line `> _Client example — see 15 §7._` callouts (and their
#     immediately-following content lines).
RAW_CLIENT_HITS="$(
  git grep -niE 'Lumivara People (Advisory|Solutions)|\bpeople advisory\b' \
    -- 'docs/' 'AGENTS.md' 'CLAUDE.md' \
       ':!docs/00-INDEX.md' \
       ':!docs/mothership/15-terminology-and-brand.md' \
       ':!docs/mothership/15b-naming-conventions.md' \
       ':!docs/mothership/00-INDEX.md' \
       ':!docs/mothership/01-business-plan.md' \
       ':!docs/mothership/05-mothership-repo-buildout-plan.md' \
       ':!docs/mothership/07-client-handover-pack.md' \
       ':!docs/mothership/08-future-work.md' \
       ':!docs/mothership/10-critique-executive-summary.md' \
       ':!docs/mothership/14-critique-operations-sequencing.md' \
       ':!docs/mothership/17-claude-issue-seeding-pack.md' \
       ':!docs/freelance/06-positioning-slide-deck.md' \
       ':!docs/freelance/06-product-strategy-deck.md' \
       ':!docs/freelance/07-client-migration-strategy.md' \
       ':!docs/freelance/08-client-migration-summary.md' \
       ':!docs/migrations/' \
       ':!docs/decks/' \
       ':!docs/research/' \
       ':!docs/BACKLOG.md' \
    2>/dev/null \
  || true
)"
# Drop any line whose preceding 6 lines contain `> _Client example_` callout.
CLIENT_HITS=()
while IFS= read -r line; do
  [ -z "$line" ] && continue
  file="${line%%:*}"
  rest="${line#*:}"
  ln="${rest%%:*}"
  start=$((ln > 6 ? ln - 6 : 1))
  if [ -f "$file" ] && sed -n "${start},${ln}p" "$file" 2>/dev/null \
      | grep -qE 'Client example'; then
    continue
  fi
  # Per-line skip marker for prose that discusses the §6 policy itself.
  if [ -f "$file" ] && sed -n "${ln}p" "$file" 2>/dev/null \
      | grep -qE 'pattern-c-audit:allow'; then
    continue
  fi
  CLIENT_HITS+=("$line")
done <<< "$RAW_CLIENT_HITS"
if [ "${#CLIENT_HITS[@]}" -eq 0 ]; then
  print_pass "no forbidden Client #1 strings outside the allow-list."
else
  # Advisory-only per 15 §6 ("reviewer-enforced until a CI lint lands"):
  # each remaining hit needs deliberate rephrasing or a per-line
  # `<!-- pattern-c-audit:allow -->` marker. Does not fail the audit.
  printf '  ! %s occurrence(s) found outside the 15 §6 allow-list — advisory:\n' \
    "${#CLIENT_HITS[@]}"
  printf '      %s\n' "${CLIENT_HITS[@]}"
  printf '    > Each line either documents the brand-family overlap (legitimate)\n'
  printf '      or is a drift bug. Rephrase, mark with `pattern-c-audit:allow`,\n'
  printf '      or wrap the surrounding context in a `> _Client example_` callout.\n'
fi

# ----- §4 — Likely committed secrets (high-entropy strings) -----
print_section "§4 — Likely committed secrets (≥40-char base64-shaped strings)"
mapfile -t SECRET_HITS < <(
  git grep -nIE '[A-Za-z0-9+/=]{40,}' \
    -- '*.ts' '*.tsx' '*.js' '*.json' '*.yml' '*.yaml' '*.env*' \
       ':!package-lock.json' \
       ':!tsconfig.tsbuildinfo' \
       ':!*.svg' ':!*.png' ':!*.jpg' ':!*.webp' \
    2>/dev/null \
  | grep -vE '^\S+:[0-9]+:\s*//' \
  | grep -vE 'node_modules|\.next/' \
  || true
)
if [ "${#SECRET_HITS[@]}" -eq 0 ]; then
  print_pass "no high-entropy strings in tracked source / config."
else
  printf '  ! %s candidate match(es) — review manually:\n' "${#SECRET_HITS[@]}"
  printf '      %s\n' "${SECRET_HITS[@]}"
  printf '    > base64-shaped does not always mean a secret; many CSS hashes,\n'
  printf '      nonces, and SHAs trip this. Verify by hand before treating as fail.\n'
fi

# ----- §5 — Duplicate doc numbering inside docs/mothership/ -----
print_section "§5 — Duplicate doc numbers in docs/mothership/00-INDEX.md"
mapfile -t DUP_NUMBERS < <(
  awk -F'|' '/^\| [0-9][0-9a-z]* \|/{print $2}' docs/mothership/00-INDEX.md \
    | tr -d ' ' \
    | sort \
    | uniq -d
)
if [ "${#DUP_NUMBERS[@]}" -eq 0 ]; then
  print_pass "no duplicate row-numbers in the index."
else
  # Advisory: known existing collisions (18-capacity vs 18-provisioning;
  # 21-ip-protection vs 21-vault-strategy) need a rename PR with cross-link
  # sweep — see 15b §3 letter-suffix convention. Will keep nudging until done.
  printf '  ! duplicate index row-numbers (advisory): %s\n' "${DUP_NUMBERS[*]}"
  printf '    > Rename one of each sibling pair per `15b §3` (e.g. `18b-`, `21b-`)\n'
  printf '      and update cross-links. The `09b-lumivara-forge-setup-plan.md` rename\n'
  printf '      shipped on 2026-04-29 is the worked example.\n'
fi

# ----- §6 — Manifest coverage: every tracked file lane-classified -----
print_section "§6 — Manifest coverage (every tracked file classified by .pattern-c.yml)"
DRY_RUN="${ROOT}/scripts/forge-spinout-dry-run.sh"
if [ ! -x "$DRY_RUN" ]; then
  print_fail "scripts/forge-spinout-dry-run.sh missing or not executable."
else
  mapfile -t UNCOVERED < <(bash "$DRY_RUN" --uncovered 2>/dev/null | grep -v '^$')
  if [ "${#UNCOVERED[@]}" -eq 0 ]; then
    print_pass "all tracked files have a lane assignment in .pattern-c.yml."
  else
    print_fail "${#UNCOVERED[@]} tracked file(s) lack a lane assignment in .pattern-c.yml:"
    printf '      %s\n' "${UNCOVERED[@]}"
    printf '    > Add each to .pattern-c.yml `lanes:` (or `drop:`) so the spinout\n'
    printf '      knows which side of the Pattern C split they go on.\n'
  fi
fi

printf '\n'
if [ "$FAIL" -ne 0 ]; then
  printf 'pattern-c-audit: ✗ violations found above. Fix or carve an exception in this script.\n'
  exit 1
fi
printf 'pattern-c-audit: ✓ all checks green.\n'
