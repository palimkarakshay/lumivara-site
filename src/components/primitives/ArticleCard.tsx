import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

export type ArticleCardData = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  publishedDate: string;
  readingTime: string;
  coverImage?: string;
};

type ArticleCardProps = {
  article: ArticleCardData;
  className?: string;
};

export function ArticleCard({ article, className }: ArticleCardProps) {
  return (
    <Link
      href={`/insights/${article.slug}`}
      className={cn(
        "group flex h-full flex-col gap-5 rounded-lg border border-border-subtle bg-canvas-elevated p-6 transition-all duration-300 hover:-translate-y-0.5 hover:border-accent/50 hover:shadow-sm sm:p-7",
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-label text-accent-deep">{article.category}</span>
        <ArrowUpRight
          size={18}
          aria-hidden
          className="text-muted-strong transition-all group-hover:text-accent group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
        />
      </div>
      <h3 className="font-display text-2xl leading-tight tracking-tight text-ink sm:text-[26px]">
        {article.title}
      </h3>
      <p className="text-body-sm text-ink-soft flex-1 leading-relaxed">
        {article.excerpt}
      </p>
      <div className="text-label text-muted-strong flex items-center gap-3 pt-3 border-t border-border-subtle">
        <time dateTime={article.publishedDate}>
          {new Date(article.publishedDate).toLocaleDateString("en-CA", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })}
        </time>
        <span aria-hidden>·</span>
        <span>{article.readingTime}</span>
      </div>
    </Link>
  );
}
