import type { MetadataRoute } from "next";
import { siteConfig } from "@/lib/site-config";
import { services } from "@/content/services";
import { getAllInsights } from "@/lib/mdx";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteConfig.url.replace(/\/$/, "");
  const now = new Date().toISOString();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, lastModified: now, priority: 1 },
    { url: `${base}/how-we-work`, lastModified: now, priority: 0.9 },
    { url: `${base}/what-we-do`, lastModified: now, priority: 0.9 },
    { url: `${base}/fractional-hr`, lastModified: now, priority: 0.8 },
    { url: `${base}/about`, lastModified: now, priority: 0.8 },
    { url: `${base}/insights`, lastModified: now, priority: 0.8 },
    { url: `${base}/contact`, lastModified: now, priority: 0.9 },
    { url: `${base}/privacy`, lastModified: now, priority: 0.3 },
    { url: `${base}/career-coaching`, lastModified: now, priority: 0.6 },
    { url: `${base}/feedback`, lastModified: now, priority: 0.4 },
  ];

  const serviceRoutes: MetadataRoute.Sitemap = services.map((s) => ({
    url: `${base}/what-we-do/${s.slug}`,
    lastModified: now,
    priority: 0.8,
  }));

  const insights = await getAllInsights();
  const insightRoutes: MetadataRoute.Sitemap = insights.map((a) => ({
    url: `${base}/insights/${a.slug}`,
    lastModified: a.publishedDate,
    priority: 0.6,
  }));

  return [...staticRoutes, ...serviceRoutes, ...insightRoutes];
}
