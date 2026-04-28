#!/usr/bin/env bash
set -euo pipefail

: "${GITHUB_REPOSITORY:=palimkarakshay/lumivara-site}"
: "${GITHUB_TOKEN:=${GH_TOKEN:-}}"

if [[ -z "$GITHUB_TOKEN" ]]; then
  echo "ERROR: set GITHUB_TOKEN (or GH_TOKEN) with repo scope to create issues." >&2
  exit 1
fi

file="docs/mothership/17-claude-issue-seeding-pack.md"
if [[ ! -f "$file" ]]; then
  echo "ERROR: $file not found" >&2
  exit 1
fi

python3 - <<'PY'
import os,re,subprocess,json
from pathlib import Path
text=Path("docs/mothership/17-claude-issue-seeding-pack.md").read_text()
blocks=re.findall(r"## Issue \d+ — .*?\n\n\*\*Title:\*\* `([^`]+)`\n\n\*\*Body:\*\*\n```md\n(.*?)\n```",text,flags=re.S)
repo=os.environ.get("GITHUB_REPOSITORY")
tok=os.environ.get("GITHUB_TOKEN")
for i,(title,body) in enumerate(blocks,1):
    payload=json.dumps({"title":title,"body":body})
    cmd=["curl","-sS","-X","POST",f"https://api.github.com/repos/{repo}/issues",
         "-H",f"Authorization: Bearer {tok}","-H","Accept: application/vnd.github+json",
         "-d",payload]
    out=subprocess.check_output(cmd,text=True)
    print(f"Issue {i}: {title}")
    print(out)
PY
