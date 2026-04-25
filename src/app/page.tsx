import { HomeHero } from "@/components/sections/HomeHero";
import { CredentialsStrip } from "@/components/sections/CredentialsStrip";
import { ComingSoonProof } from "@/components/sections/ComingSoonProof";
import { ThreePrinciples } from "@/components/sections/ThreePrinciples";
import { ServicesGrid } from "@/components/sections/ServicesGrid";
import { FractionalCTA } from "@/components/sections/FractionalCTA";
import { FounderModule } from "@/components/sections/FounderModule";
import { TestimonialsStrip } from "@/components/sections/TestimonialsStrip";
import { LatestInsights } from "@/components/sections/LatestInsights";
import { CTABlock } from "@/components/primitives/CTABlock";
import { SectionShell } from "@/components/primitives/SectionShell";
import { PulseQuestion } from "@/components/primitives/PulseQuestion";
import { homeContent } from "@/content/home";
import { getAllInsights } from "@/lib/mdx";

export default async function Home() {
  const insights = await getAllInsights();
  const topThree = insights.slice(0, 3);
  return (
    <>
      <HomeHero />
      <CredentialsStrip />
      <ComingSoonProof />
      <ThreePrinciples />
      <ServicesGrid />
      <SectionShell variant="canvas" width="content" className="py-10 sm:py-14">
        <div className="mx-auto max-w-[640px]">
          <PulseQuestion
            question={homeContent.pulse.question}
            options={homeContent.pulse.options}
          />
        </div>
      </SectionShell>
      <FractionalCTA />
      <FounderModule />
      <TestimonialsStrip />
      <LatestInsights articles={topThree} />
      <CTABlock
        headline={homeContent.finalCta.headline}
        subhead={homeContent.finalCta.subhead}
        ctaLabel={homeContent.finalCta.cta.label}
        ctaHref={homeContent.finalCta.cta.href}
        variant="ink"
      />
    </>
  );
}
