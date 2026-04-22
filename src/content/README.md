# Content directory

All editable copy lives here. Edit these files to change what the site says — no code needed beyond following the existing shape.

## Files

| File | What it controls |
|---|---|
| `site.ts` | Tagline, contact info, nav labels (also see `src/lib/site-config.ts`) |
| `home.ts` | Home page sections (hero, principles, services grid, founder module, CTAs) |
| `services.ts` | The six services + sub-services. **Body copy is verbatim from lumivara.ca — do not paraphrase.** |
| `how-we-work.ts` | Principles, engagement models, KPIs by service |
| `fractional-hr.ts` | Fractional HR funnel copy |
| `about.ts` | About page copy + founder bio |
| `contact.ts` | Contact page copy + form field labels |
| `partnership-process.ts` | The 5-step engagement process |
| `faqs.ts` | All FAQ entries |
| `insights/*.mdx` | Insights articles (frontmatter + markdown body) |
| `_comparison/*.md` | Notes on what changed between lumivara.ca and this rebuild |

## Conventions

- Keep copy as plain strings. JSX / markdown is rendered by the page component.
- Use ES module `export const` pattern — autocomplete works in VS Code.
- When in doubt, read the existing shape of a neighbouring file and mirror it.
