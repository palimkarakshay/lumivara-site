import { cn } from "@/lib/utils";

type EditorialQuoteProps = {
  quote: string;
  attribution?: string;
  className?: string;
};

export function EditorialQuote({
  quote,
  attribution,
  className,
}: EditorialQuoteProps) {
  return (
    <figure className={cn("border-l-2 border-accent pl-6 sm:pl-8", className)}>
      <blockquote className="font-display italic text-ink text-2xl leading-snug sm:text-3xl">
        {quote}
      </blockquote>
      {attribution && (
        <figcaption className="text-label text-muted-strong mt-4">
          — {attribution}
        </figcaption>
      )}
    </figure>
  );
}
