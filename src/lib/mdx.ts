import { promises as fs } from "fs";
import path from "path";
import matter from "gray-matter";

export type InsightFrontmatter = {
  title: string;
  excerpt: string;
  category: string;
  publishedDate: string;
  readingTime: string;
  author?: string;
  coverImage?: string;
};

export type InsightSummary = InsightFrontmatter & { slug: string };

const INSIGHTS_DIR = path.join(process.cwd(), "src", "content", "insights");

export async function getAllInsights(): Promise<InsightSummary[]> {
  let files: string[] = [];
  try {
    files = await fs.readdir(INSIGHTS_DIR);
  } catch {
    return [];
  }
  const mdx = files.filter((f) => f.endsWith(".mdx"));
  const posts = await Promise.all(
    mdx.map(async (filename) => {
      const full = path.join(INSIGHTS_DIR, filename);
      const raw = await fs.readFile(full, "utf8");
      const { data } = matter(raw);
      const fm = data as InsightFrontmatter;
      return { ...fm, slug: filename.replace(/\.mdx$/, "") };
    })
  );
  return posts.sort(
    (a, b) =>
      new Date(b.publishedDate).getTime() - new Date(a.publishedDate).getTime()
  );
}

export async function getInsightBySlug(
  slug: string
): Promise<{ frontmatter: InsightFrontmatter; content: string } | null> {
  const full = path.join(INSIGHTS_DIR, `${slug}.mdx`);
  try {
    const raw = await fs.readFile(full, "utf8");
    const { data, content } = matter(raw);
    return { frontmatter: data as InsightFrontmatter, content };
  } catch {
    return null;
  }
}
