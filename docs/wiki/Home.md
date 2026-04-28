# Lumivara Site Wiki

Welcome to the Lumivara Site wiki. This is the central reference for the **lumivara-site** repository — the Next.js website for Lumivara People Advisory.

> ⚠️ **Deprecated-doc policy.** Mobile capture via the operator's phone-PAT
> + HTTP Shortcuts / Apple Shortcuts is **deprecated**. The canonical
> capture path is the `/admin` portal plus n8n-routed email + SMS
> fallbacks. Do not follow the setup steps formerly in `PHONE_SETUP.md` —
> that file is retained as a deprecation notice only. Canonical reading:
> [`docs/N8N_SETUP.md`](https://github.com/palimkarakshay/lumivara-site/blob/main/docs/N8N_SETUP.md),
> [`docs/ADMIN_PORTAL_PLAN.md`](https://github.com/palimkarakshay/lumivara-site/blob/main/docs/ADMIN_PORTAL_PLAN.md),
> and the v1→v2 migration matrix in
> [`docs/TEMPLATE_REBUILD_PROMPT.md`](https://github.com/palimkarakshay/lumivara-site/blob/main/docs/TEMPLATE_REBUILD_PROMPT.md) §1.4.

## Quick links

| Topic | Page |
|---|---|
| How to request a site change | [[Making-Changes]] |
| Development setup | [[Development-Setup]] |
| Security policy | [[Security]] |
| Best practices & conventions | [[Best-Practices]] |
| Backlog & bot workflow | [[Bot-Workflow]] |

## At a glance

- **Live site:** [lumivara-site.vercel.app](https://lumivara-site.vercel.app)
- **Tech:** Next.js 16 + Tailwind v4 + TypeScript + MDX
- **Hosting:** Vercel (auto-deploys from `main`)
- **Bot:** Claude (via GitHub Actions) triages issues daily and ships code every 8 h
- **Operator:** Beas Banerjee — reviews and merges PRs via GitHub Mobile
