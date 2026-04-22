"use client";

import { useState, useMemo } from "react";
import { ArticleCard, type ArticleCardData } from "@/components/primitives/ArticleCard";
import { cn } from "@/lib/utils";

type InsightsFilterProps = {
  articles: ArticleCardData[];
};

export function InsightsFilter({ articles }: InsightsFilterProps) {
  const categories = useMemo(() => {
    const set = new Set<string>();
    articles.forEach((a) => set.add(a.category));
    return ["All", ...Array.from(set).sort()];
  }, [articles]);

  const [active, setActive] = useState("All");
  const filtered =
    active === "All" ? articles : articles.filter((a) => a.category === active);

  return (
    <>
      <div
        className="mb-10 flex flex-wrap items-center gap-2"
        role="tablist"
        aria-label="Filter by category"
      >
        {categories.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setActive(c)}
            role="tab"
            aria-selected={active === c}
            className={cn(
              "text-label rounded-md border px-3 py-1.5 transition-all",
              active === c
                ? "border-accent bg-accent text-ink"
                : "border-border-subtle bg-canvas-elevated text-muted-strong hover:border-accent hover:text-ink"
            )}
          >
            {c}
          </button>
        ))}
      </div>
      {filtered.length === 0 ? (
        <p className="text-body text-muted-strong">No articles in this category yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          {filtered.map((a) => (
            <ArticleCard key={a.slug} article={a} />
          ))}
        </div>
      )}
    </>
  );
}
