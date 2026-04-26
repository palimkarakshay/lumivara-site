# Security

> The canonical security policy is in [`.github/SECURITY.md`](https://github.com/palimkarakshay/lumivara-site/blob/main/.github/SECURITY.md). This page provides supplementary context.

## Reporting a vulnerability

**Do not open a public Issue for security bugs.** Email **hello@lumivara.ca** instead.

Include:
- Description and potential impact
- Steps to reproduce / PoC
- Affected URL(s) or component(s)

Response SLA: acknowledgement within 48 h, status update within 7 days.

## Key security considerations

### Contact form (`/api/contact`)
The contact form endpoint is the highest-risk surface. It:
- Receives user-submitted data
- Is excluded from automated bot execution (human review only)
- Uses Zod for input validation at the API boundary

### Environment variables and secrets
- Production secrets live in **Vercel → Settings → Environment Variables** only
- Local dev uses `.env.local` which is gitignored
- Never commit API keys, tokens, or credentials to the repo

### Dependencies
- Packages are pinned in `package-lock.json`
- Run `npm audit` before adding or upgrading dependencies
- Dependency upgrades are human-only (excluded from the bot)

### Bot security
The execute bot (`auto/issue-*` branches):
- Cannot push to `main` directly
- Always opens a PR for human review before any change goes live
- Cannot touch workflows, env files, or the contact API endpoint

## GitHub-specific settings

- **Branch protection on `main`**: enforced via GitHub repository settings
- **Workflow permissions**: read-only by default; write access only where explicitly granted
- **Secrets**: `CLAUDE_CODE_OAUTH_TOKEN` is the only repository secret; it is scoped to the Pro subscription OAuth token and never logs to workflow output
