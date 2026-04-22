"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { services } from "@/content/services";
import { cn } from "@/lib/utils";

export function ServicesIndex() {
  const [activeSlug, setActiveSlug] = useState(services[0]?.slug ?? "");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);
        if (visible[0]) {
          setActiveSlug(visible[0].target.id);
        }
      },
      { rootMargin: "-30% 0px -50% 0px", threshold: [0, 0.25, 0.5] }
    );
    services.forEach((s) => {
      const el = document.getElementById(s.slug);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  return (
    <div className="grid grid-cols-1 gap-12 md:grid-cols-12 md:gap-16">
      <aside className="md:col-span-3">
        <nav
          aria-label="Service index"
          className="md:sticky md:top-24"
        >
          <p className="text-label text-muted-strong mb-4">Practices</p>
          <ul className="flex flex-row flex-wrap gap-2 md:flex-col md:gap-1">
            {services.map((s) => (
              <li key={s.slug}>
                <a
                  href={`#${s.slug}`}
                  className={cn(
                    "text-label flex items-center gap-2 transition-colors",
                    activeSlug === s.slug
                      ? "text-accent"
                      : "text-muted-strong hover:text-ink"
                  )}
                >
                  <span className="font-display text-base font-medium">
                    {s.number}
                  </span>
                  <span>{s.shortTitle}</span>
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex flex-col gap-24 md:col-span-9">
        {services.map((s) => (
          <article key={s.slug} id={s.slug} className="scroll-mt-24">
            <span className="text-label text-accent-deep">{s.number} / Practice</span>
            <h2 className="text-display-lg text-ink mt-4 leading-tight">
              {s.title}
            </h2>
            <p className="font-display text-2xl italic text-ink mt-5 leading-snug">
              {s.tagline}
            </p>
            <p className="text-body text-ink-soft mt-6 leading-relaxed">
              {s.shortDescription}
            </p>
            {s.subServices.length > 0 && (
              <ul className="mt-8 flex flex-col gap-3">
                {s.subServices.map((sub) => (
                  <li
                    key={sub.title}
                    className="rounded-md border border-border-subtle bg-canvas-elevated px-4 py-3"
                  >
                    <p className="font-display text-lg text-ink leading-tight">
                      {sub.title}
                    </p>
                    <p className="text-body-sm text-ink-soft mt-1 leading-snug">
                      {sub.tagline}
                    </p>
                  </li>
                ))}
              </ul>
            )}
            <Link
              href={`/what-we-do/${s.slug}`}
              className="group mt-8 inline-flex items-center gap-2 text-label text-ink transition-colors hover:text-accent"
            >
              Explore {s.shortTitle}
              <ArrowRight
                size={14}
                aria-hidden
                className="transition-transform group-hover:translate-x-1"
              />
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}
