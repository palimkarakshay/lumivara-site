import { SectionShell } from "@/components/primitives/SectionShell";
import { dummyTestimonials } from "@/content/testimonials";

type TestimonialsStripProps = {
  embedId?: string;
};

export function TestimonialsStrip({ embedId }: TestimonialsStripProps) {
  if (embedId) {
    return (
      <SectionShell variant="parchment">
        <iframe
          src={`https://testimonial.to/embed/${embedId}`}
          frameBorder="0"
          scrolling="no"
          width="100%"
          className="min-h-[400px]"
          title="Client testimonials"
        />
      </SectionShell>
    );
  }

  return (
    <SectionShell variant="parchment">
      <p className="text-label text-muted-strong mb-10">What clients say</p>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
        {dummyTestimonials.map((t) => (
          <div
            key={t.initials}
            className="flex flex-col gap-5 rounded-lg border border-border-subtle bg-canvas p-8"
          >
            <span
              aria-hidden
              className="font-display text-5xl leading-none text-accent select-none"
            >
              &ldquo;
            </span>
            <p className="text-body text-ink-soft leading-relaxed flex-1">{t.quote}</p>
            <div className="flex items-center gap-4 pt-2">
              <div
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-ink text-canvas text-label"
                aria-hidden
              >
                {t.initials}
              </div>
              <div>
                <p className="text-label text-ink">{t.name}</p>
                <p className="text-label text-muted-strong">
                  {t.role} · {t.company}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </SectionShell>
  );
}
