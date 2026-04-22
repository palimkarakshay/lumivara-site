import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { homeContent } from "@/content/home";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";
import { ArticleCard, type ArticleCardData } from "@/components/primitives/ArticleCard";

type LatestInsightsProps = {
  articles?: ArticleCardData[];
};

export function LatestInsights({ articles = [] }: LatestInsightsProps) {
  const { insights } = homeContent;
  const [num, label] = insights.monoLabel.split(" / ");
  const slots = [0, 1, 2];
  return (
    <SectionShell variant="canvas">
      <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
        <div>
          <NumberedSection number={num} label={label} />
          <h2 className="text-display-lg text-ink mt-6 max-w-[760px]">
            {insights.heading}
          </h2>
        </div>
        <Link
          href={insights.seeAll.href}
          className="group inline-flex items-center gap-2 text-label text-ink transition-colors hover:text-accent"
        >
          {insights.seeAll.label}
          <ArrowRight
            size={14}
            aria-hidden
            className="transition-transform group-hover:translate-x-1"
          />
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
        {slots.map((i) => {
          const article = articles[i];
          if (article) return <ArticleCard key={article.slug} article={article} />;
          return (
            <div
              key={i}
              className="flex h-full min-h-[240px] flex-col justify-between rounded-lg border border-dashed border-border-subtle bg-canvas-elevated/50 p-6"
            >
              <span className="text-label text-muted-strong">Coming Soon</span>
              <p className="font-display text-xl text-ink/70 leading-snug">
                New writing on people strategy, shipping soon.
              </p>
              <span className="text-label text-muted-strong">—</span>
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
