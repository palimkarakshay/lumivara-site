import type { Metadata } from "next";
import { getAllInsights } from "@/lib/mdx";
import { PageHero } from "@/components/primitives/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { InsightsFilter } from "@/components/sections/InsightsFilter";
import { NewsletterSignup } from "@/components/layout/NewsletterSignup";

export const metadata: Metadata = {
  title: "Insights",
  description:
    "Field notes on people strategy — hiring, leadership capability, talent systems, culture, and the future of work.",
};

export default async function InsightsPage() {
  const articles = await getAllInsights();
  const cards = articles.map((a) => ({
    slug: a.slug,
    title: a.title,
    excerpt: a.excerpt,
    category: a.category,
    publishedDate: a.publishedDate,
    readingTime: a.readingTime,
    coverImage: a.coverImage,
  }));

  return (
    <>
      <PageHero
        monoLabel="Insights"
        headline="Field notes on people strategy."
        subhead="Writing on the real problems leaders face — hiring, leadership capability, talent systems, culture, and the future of work."
      />

      <SectionShell variant="canvas">
        <InsightsFilter articles={cards} />
      </SectionShell>

      <SectionShell variant="parchment" width="content">
        <div className="mx-auto max-w-[560px] text-center">
          <p className="text-label text-muted-strong mb-3">Stay in the loop</p>
          <h2 className="text-display-md text-ink mb-3">Monthly. No noise.</h2>
          <p className="text-body text-ink-soft mb-8 leading-relaxed">
            One short field note a month — the same writing you'll find here, in
            your inbox before it lands publicly. Unsubscribe whenever.
          </p>
          <NewsletterSignup pitch="" placeholder="your@email.com" />
        </div>
      </SectionShell>
    </>
  );
}
