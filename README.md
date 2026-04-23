# Lumivara Site — Local Working Demo - git update check

A rebuilt Lumivara People Advisory site, running locally. Next.js 16 + TypeScript + Tailwind v4 + shadcn/ui + MDX.

> **Status:** In active build. Local-only; not yet deployed.

---

## Run it

Requires Node.js 20 or later.

```bash
git clone https://github.com/<owner>/lumivara-site.git
cd lumivara-site
npm install
npm run dev
```

Open http://localhost:3000.

No environment variables are required to run locally — the `.env.local` committed to your working tree has safe defaults. See [.env.local.example](./.env.local.example) for what each variable does.

## Scripts

| Command | What it does |
|---|---|
| `npm run dev` | Start the dev server with hot reload |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npx tsc --noEmit` | TypeScript check (no output) |

---

## Where to edit things

### Text / copy
All page-level copy lives in [`src/content/`](./src/content/). Each page has one file. Open, edit the strings, save, see it reflected. See [`src/content/README.md`](./src/content/README.md) for the index.

### Services
The six core services and their sub-services are defined in [`src/content/services.ts`](./src/content/services.ts). Service body copy is preserved verbatim from the current Squarespace site — edit with care.

### Insights articles
Articles are MDX files in [`src/content/insights/`](./src/content/insights/). Each has YAML frontmatter (title, excerpt, category, date, reading time). Add a new file to publish a new article — no further wiring needed.

### Site-wide settings
Tagline, contact email, phone, navigation labels, Cal.com link: [`src/lib/site-config.ts`](./src/lib/site-config.ts).

### Logo and images
- Typographic SVG wordmark (current logo): `public/logo-wordmark.svg`
- Previous logo (lighthouse JPEG): `public/logo-original.jpg` — kept for reference
- Favicon: `public/favicon.svg`

To swap the wordmark, replace `public/logo-wordmark.svg`. To swap the favicon, replace `public/favicon.svg` and/or add `.ico` / PNG variants.

### Before / after comparison
Copy changes vs. lumivara.ca are tracked in [`src/content/_comparison/`](./src/content/_comparison/).

---

## Tech stack

- **Framework:** [Next.js 16](https://nextjs.org) (App Router, RSC)
- **Language:** TypeScript (strict)
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com)
- **UI primitives:** [shadcn/ui](https://ui.shadcn.com) on Base UI React
- **Content:** MDX via `@next/mdx` with `remark-gfm`, `rehype-slug`, `rehype-autolink-headings`
- **Forms:** React Hook Form + Zod
- **Fonts:** Fraunces (display), Inter (body), JetBrains Mono (labels) — self-hosted via `next/font/google`
- **Icons:** `lucide-react`

---

## Design system

| Token | Light | Dark |
|---|---|---|
| Canvas | `#F7F4ED` | `#0E1116` |
| Ink | `#0E1116` | `#F7F4ED` |
| Parchment | `#EFEAE0` | `#1F2430` |
| Accent (amber) | `#C8912E` | `#E0B160` |

Tailwind utilities follow these tokens: `bg-canvas`, `bg-ink`, `bg-parchment`, `text-ink`, `text-ink-soft`, `text-accent`, `text-accent-deep`, `border-border-subtle`.

Type utilities: `text-display-xl` → `text-caption`, plus `text-label` for mono uppercase micro-labels.

See `src/app/globals.css` for the full token set.

---

## Accessibility & performance commitments

- All interactive elements keyboard-accessible with visible focus rings
- Respects `prefers-reduced-motion`
- Fluid type via `clamp()` — scales across 375px → 1920px without layout shift
- Lighthouse target: ≥90 on Performance / Accessibility / Best Practices / SEO

---

## Deployment

Not yet deployed. When ready, the project is Vercel-ready — zero config change required.

---

## Project status

Built in phases. See git history for per-phase commits.
