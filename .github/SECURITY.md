# Security Policy

## Supported Versions

Lumivara is a static marketing website. There is no versioned release cycle; the live site always reflects the current `main` branch.

| Branch | Supported |
|--------|-----------|
| `main` | Yes |
| All others | No (feature branches only) |

## Reporting a Vulnerability

**Please do not open a public GitHub Issue for security vulnerabilities.**

If you discover a security vulnerability, email **hello@lumivara.ca** with:

- A description of the vulnerability and its potential impact
- Steps to reproduce or a proof-of-concept
- Affected URL(s) or component(s)
- Your suggested fix, if any

You will receive an acknowledgement within **48 hours** and a status update within **7 days**.

## Scope

### In scope

- The live site at [lumivara-site.vercel.app](https://lumivara-site.vercel.app) and any custom domain
- The contact form (`/contact`) and its API endpoint
- Any externally accessible API routes under `/api/`

### Out of scope

- GitHub Actions workflows (report via [GitHub's vulnerability disclosure process](https://github.com/security/advisories))
- Third-party services (Cal.com, Vercel infrastructure, GitHub itself)
- Denial-of-service attacks
- Social engineering

## Security Best Practices (for contributors)

- Never commit secrets, API keys, or tokens to the repository. Use Vercel environment variables for production values and `.env.local` (gitignored) for local development.
- The contact API endpoint (`src/app/api/contact/`) handles user-submitted data — changes there require human review and are excluded from automated bot execution.
- Dependencies are pinned in `package-lock.json`. Run `npm audit` before adding or upgrading packages.
- All user-facing inputs are validated with Zod at the API boundary.
