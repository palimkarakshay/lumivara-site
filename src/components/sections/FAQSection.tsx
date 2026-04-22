import Link from "next/link";
import { ArrowRight } from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { faqs as allFaqs, type FAQ } from "@/content/faqs";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";

type FAQSectionProps = {
  monoNumber?: string;
  monoLabel?: string;
  heading?: string;
  subhead?: string;
  items?: FAQ[];
};

export function FAQSection({
  monoNumber = "06",
  monoLabel = "Questions",
  heading = "Answers to what leaders usually ask first.",
  subhead,
  items = allFaqs,
}: FAQSectionProps) {
  return (
    <SectionShell variant="canvas" width="content" id="faq">
      <NumberedSection number={monoNumber} label={monoLabel} />
      <h2 className="text-display-md text-ink mt-6 mb-5 max-w-[760px]">{heading}</h2>
      {subhead && (
        <p className="text-body-lg text-ink-soft mb-8 max-w-[680px]">{subhead}</p>
      )}
      <Accordion className="w-full">
        {items.map((faq) => (
          <AccordionItem
            key={faq.id}
            value={faq.id}
            className="border-b border-border-subtle last:border-b-0"
          >
            <AccordionTrigger className="py-5 text-left font-display text-xl leading-snug text-ink hover:text-accent [&[data-state=open]]:text-accent">
              {faq.question}
            </AccordionTrigger>
            <AccordionContent className="pb-6 text-body text-ink-soft leading-relaxed">
              <p>{faq.answer}</p>
              {faq.relatedHref && faq.relatedLabel && (
                <Link
                  href={faq.relatedHref}
                  className="mt-4 inline-flex items-center gap-2 text-label text-accent-deep transition-colors hover:text-accent"
                >
                  {faq.relatedLabel}
                  <ArrowRight size={12} aria-hidden />
                </Link>
              )}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>
    </SectionShell>
  );
}
