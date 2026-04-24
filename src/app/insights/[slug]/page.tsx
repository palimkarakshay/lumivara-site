import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { siteConfig } from "@/lib/site-config";
import { getAllInsights } from "@/lib/mdx";
import { SectionShell } from "@/components/primitives/SectionShell";
import { ArticleCard } from "@/components/primitives/ArticleCard";
import { CTABlock } from "@/components/primitives/CTABlock";
import { NewsletterSignup } from "@/components/layout/NewsletterSignup";

type RouteParams = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const articles = await getAllInsights();
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: RouteParams): Promise<Metadata> {
  const { slug } = await params;
  const articles = await getAllInsights();
  const article = articles.find((a) => a.slug === slug);
  if (!article) return { title: "Article not found" };
  return {
    title: article.title,
    description: article.excerpt,
    openGraph: {
      type: "article",
      title: article.title,
      description: article.excerpt,
      publishedTime: article.publishedDate,
      authors: [article.author ?? "Beas Banerjee"],
    },
  };
}

export default async function InsightPage({ params }: RouteParams) {
  const { slug } = await params;
  const articles = await getAllInsights();
  const article = articles.find((a) => a.slug === slug);
  if (!article) notFound();

  let Post: React.ComponentType;
  try {
    Post = (await import(`@/content/insights/${slug}.mdx`)).default;
  } catch {
    notFound();
  }

  const related = articles
    .filter((a) => a.slug !== slug)
    .slice(0, 2)
    .map((a) => ({
      slug: a.slug,
      title: a.title,
      excerpt: a.excerpt,
      category: a.category,
      publishedDate: a.publishedDate,
      readingTime: a.readingTime,
    }));

  return (
    <>
      {/* Hero */}
      <section className="w-full bg-canvas px-6 pt-28 pb-12 sm:px-8 sm:pt-36 sm:pb-16">
        <div className="mx-auto max-w-[760px]">
          <Link
            href="/insights"
            className="text-label text-muted-strong inline-flex items-center gap-2 transition-colors hover:text-ink"
          >
            <ArrowLeft size={12} aria-hidden /> All insights
          </Link>
          <span className="text-label text-accent-deep mt-8 inline-block">
            {article.category}
          </span>
          <h1 className="text-display-lg text-ink mt-4 leading-tight">
            {article.title}
          </h1>
          <p className="text-body-lg text-ink-soft mt-6 leading-relaxed">
            {article.excerpt}
          </p>
          <div className="text-label text-muted-strong mt-8 flex flex-wrap items-center gap-x-4 gap-y-2">
            <time dateTime={article.publishedDate}>
              {new Date(article.publishedDate).toLocaleDateString("en-CA", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </time>
            <span aria-hidden className="text-accent">·</span>
            <span>{article.readingTime}</span>
            <span aria-hidden className="text-accent">·</span>
            <span>{article.author ?? "Beas Banerjee"}</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <article className="w-full bg-canvas px-6 pb-20 sm:px-8">
        <div className="mx-auto max-w-[720px]">
          <Post />
        </div>
      </article>

      {/* Author + Newsletter */}
      <SectionShell variant="parchment" width="content">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12 md:items-start">
          <div className="md:col-span-7">
            <p className="text-label text-muted-strong mb-3">Written by</p>
            <h2 className="font-display text-2xl text-ink leading-tight">
              {article.author ?? "Beas Banerjee"}
            </h2>
            <p className="text-body-sm text-ink-soft mt-2">
              Founder & Principal Consultant, Lumivara People Advisory
            </p>
            <p className="text-body text-ink-soft mt-4 leading-relaxed">
              MBA, CHRL, PROSCI-certified. 10+ years translating business
              strategy into practical people systems.
            </p>
            <a
              href={siteConfig.founderLinkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 text-label text-ink transition-colors hover:text-accent"
            >
              Connect on LinkedIn <ArrowRight size={12} aria-hidden />
            </a>
          </div>
          <div className="md:col-span-5">
            <p className="text-label text-muted-strong mb-3">Subscribe</p>
            <NewsletterSignup pitch="One short field note a month. No noise." />
          </div>
        </div>
      </SectionShell>

      {/* Related */}
      {related.length > 0 && (
        <SectionShell variant="canvas">
          <p className="text-label text-muted-strong mb-6">Keep reading</p>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            {related.map((r) => (
              <ArticleCard key={r.slug} article={r} />
            ))}
          </div>
        </SectionShell>
      )}

      <CTABlock
        headline="Have a similar challenge?"
        subhead="Every engagement starts with a 30-minute discovery conversation — complimentary and focused on you."
        ctaLabel="Book a Discovery Call"
        ctaHref="/contact"
      />
    </>
  );
}
