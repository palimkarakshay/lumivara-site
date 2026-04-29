# Gemini CLI — Task Assignments

Gemini 2.5 Pro (free tier via Gemini CLI) has a 1M-token context window — significantly larger than Claude's effective window. Use it for tasks where reading the entire codebase or large external content at once is cheaper than Claude's incremental approach.

## Install

```powershell
npm install -g @google/gemini-cli
```

Authenticate (opens browser → sign in with Google account):
```powershell
gemini auth login
```

Verify:
```powershell
gemini --version
gemini "hello"
```

Free tier: Gemini 2.5 Pro, 60 requests/minute, 1,500 requests/day. No credit card.

## When to use Gemini vs Claude

| Task | Use |
|------|-----|
| Classify/summarize large files (full codebase context) | Gemini |
| Generate long-form MDX articles (1000+ words) | Gemini |
| Review entire src/ tree for consistency | Gemini |
| Diff analysis across 50+ files | Gemini |
| Incremental file edits (Edit tool) | Claude |
| GitHub API calls, workflow logic | Claude |
| Any task needing tool use (Bash, gh CLI) | Claude |
| PR review with code context | Claude |

## Assigned Gemini tasks

### 1. Bulk insights article generation
When the backlog has multiple article issues, batch them into one Gemini call. The brand-voice paragraph is **per-client** — swap it with the matched client's intake before invoking the CLI.

> _Client example — verbatim usage requires the matched client. See `docs/mothership/15-terminology-and-brand.md §7`._ The block below shows the brand-voice prompt for **Client #1 (Lumivara People Advisory)**; for any other client, replace the entire `"You are writing for ..."` paragraph with that client's brand voice from their intake YAML (`docs/mothership/07-client-handover-pack.md §A` is the template).

```powershell
gemini "You are writing for Lumivara People Advisory (lumivara.ca) — a boutique HR consulting firm in Toronto run by Beas Banerjee (MBA, CHRL, PROSCI). Services: talent acquisition, succession planning, fractional HR, leadership development, compensation design, HR compliance (PIPEDA, Ontario employment standards). Voice: direct, advisory, evidence-led. No filler. No listicle format.

Write the following MDX articles. Each needs frontmatter (title, excerpt, category, date, readingTime) and 600-800 words of body. Categories: perspective | advisory | case-study.

Article 1: [paste issue body]
Article 2: [paste issue body]

Output each as a separate fenced MDX block labeled with its filename."
```

Pipe output to files:
```powershell
gemini "..." | Out-File -Encoding utf8 src/content/insights/output.mdx
```

### 2. Full codebase consistency audit

```powershell
Get-ChildItem -Recurse src/ -Include *.tsx,*.ts | Get-Content | gemini "Audit this Next.js codebase for: (1) inconsistent use of design tokens vs hardcoded colors, (2) missing aria-label on interactive elements, (3) any import that references a file that likely doesn't exist. Output a numbered list sorted by severity."
```

### 3. SEO metadata review

```powershell
Get-ChildItem src/app -Recurse -Filter "page.tsx" | Get-Content | gemini "Review these Next.js page files. For each, evaluate the metadata export: is the title and description unique, specific, and under 160 chars? Flag any missing, duplicate, or generic metadata. Output a table: file | issue | suggested fix."
```

### 4. n8n workflow JSON generation

```powershell
gemini "Generate a valid n8n workflow JSON for the following automation: [describe workflow]. Output only the raw JSON, no explanation. Use n8n node types exactly as they appear in n8n 1.x."
```

Paste the JSON into n8n's import dialog.

### 5. Triage pre-screening (cost saver)

For large batches of new issues, pre-screen with Gemini before sending to Claude triage:

```powershell
gh issue list --repo palimkarakshay/lumivara-site --state open --label status/needs-triage --json number,title,body | gemini "For each issue, output: number | priority (P1/P2/P3) | complexity (trivial/easy/medium/complex) | auto-routine (yes/no) | one-line rationale. Format as a markdown table."
```

Use the table to manually label obvious cases before the Haiku triage run, reducing triage API calls.

## Cost tracking

Gemini free tier resets daily. To see today's usage:
```powershell
gemini usage
```

If you hit the free limit on Gemini, fall back to Claude Haiku for the same task — it's the cheapest Claude tier.
