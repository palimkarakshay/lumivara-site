import { siteConfig } from "@/lib/site-config";
import { getAllInsights } from "@/lib/mdx";
import { services } from "@/content/services";

export const dynamic = "force-dynamic";

export async function GET() {
  const base = siteConfig.url.replace(/\/$/, "");
  const insights = await getAllInsights();

  const insightLines = insights
    .map(
      (a) =>
        `- [${a.title}](${base}/insights/${a.slug})\n  ${a.excerpt}`
    )
    .join("\n");

  const serviceLines = services
    .map((s) => `- **${s.title}**: ${s.shortDescription}`)
    .join("\n");

  const body = `# ${siteConfig.name}

> ${siteConfig.tagline}

${siteConfig.description}

## Services

${serviceLines}

## Insights

${insightLines}

## Contact

- Email: ${siteConfig.email}
- Phone: ${siteConfig.phone}
- Location: ${siteConfig.location}
- LinkedIn: ${siteConfig.linkedin}
- Website: ${base}
`;

  return new Response(body, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  });
}
