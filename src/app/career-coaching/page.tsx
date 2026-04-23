import type { Metadata } from "next";
import { NewsletterSignup } from "@/components/layout/NewsletterSignup";
import { PageHero } from "@/components/primitives/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";

export const metadata: Metadata = {
  title: "Career Coaching — Coming 2026",
  description:
    "A new Lumivara offering for individuals navigating career transitions — managers, new immigrants to Canada, and women re-entering leadership. Launching 2026.",
};

export default function CareerCoachingPage() {
  return (
    <>
      <PageHero
        monoLabel="For Individuals · Launching 2026"
        headline="Career coaching, the Lumivara way."
        subhead="The same diagnostic-led, systems-minded work we do with organizations — applied to individual careers. For managers in transition, new immigrants navigating the Canadian market, and women re-entering or stepping into leadership."
      />

      <SectionShell variant="parchment" width="content">
        <NumberedSection number="—" label="What it will be" />
        <h2 className="text-display-md text-ink mt-6 mb-5">
          A practical, structured, diagnostic-first coaching practice.
        </h2>
        <div className="text-body text-ink-soft flex flex-col gap-5 leading-relaxed">
          <p>
            Coaching that starts where our consulting starts: with clarity. What
            are you actually trying to achieve in the next 12 months? What
            capabilities or narrative gaps are in the way? What does evidence of
            progress look like — monthly, not yearly?
          </p>
          <p>
            We&apos;re designing three starting offers:
          </p>
          <ul className="list-disc pl-6">
            <li>
              <strong>Career clarity sprint</strong> — four sessions to define
              direction, evidence, and next moves.
            </li>
            <li>
              <strong>Newcomer to Canada track</strong> — for experienced
              professionals translating international careers into the Canadian
              market.
            </li>
            <li>
              <strong>Women in leadership arc</strong> — longer-form coaching
              for re-entry or first-time leadership roles.
            </li>
          </ul>
          <p>
            We&apos;ll announce a waitlist and pricing well before launch. No
            mailing-list flood.
          </p>
        </div>
      </SectionShell>

      <SectionShell variant="canvas" width="content">
        <div className="mx-auto max-w-[560px] text-center">
          <p className="text-label text-muted-strong mb-3">
            Hear about it first
          </p>
          <h2 className="text-display-md text-ink mb-3">
            Be the first to know when we launch.
          </h2>
          <p className="text-body text-ink-soft mb-8 leading-relaxed">
            Join the field-notes newsletter. When career coaching opens for
            early clients, subscribers get priority.
          </p>
          <NewsletterSignup pitch="" placeholder="your@email.com" />
        </div>
      </SectionShell>
    </>
  );
}
