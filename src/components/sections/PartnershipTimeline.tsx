import { partnershipProcess } from "@/content/partnership-process";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";
import { Reveal } from "@/components/primitives/Reveal";

type PartnershipTimelineProps = {
  monoNumber?: string;
  monoLabel?: string;
  heading?: string;
};

export function PartnershipTimeline({
  monoNumber = "03",
  monoLabel = "Engagement Lifecycle",
  heading = "What working together actually looks like.",
}: PartnershipTimelineProps) {
  return (
    <SectionShell variant="canvas">
      <NumberedSection number={monoNumber} label={monoLabel} />
      <h2 className="text-display-lg text-ink mt-6 mb-10 max-w-[760px]">{heading}</h2>
      <ol className="grid grid-cols-1 gap-5 md:grid-cols-5">
        {partnershipProcess.map((step, i) => (
          <Reveal key={step.number} delay={i * 60}>
            <li className="relative flex h-full flex-col gap-4 rounded-lg border border-border-subtle bg-canvas-elevated p-6">
              <div className="flex items-baseline gap-3">
                <span className="font-display text-3xl text-accent leading-none">
                  {step.number}
                </span>
                <span className="text-label text-muted-strong">Step</span>
              </div>
              <h3 className="font-display text-xl leading-tight text-ink">
                {step.title}
              </h3>
              <p className="text-body-sm text-ink-soft leading-relaxed">
                {step.body}
              </p>
            </li>
          </Reveal>
        ))}
      </ol>
    </SectionShell>
  );
}
