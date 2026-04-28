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
import { JsonLd } from "@/components/primitives/JsonLd";
import { homeContent } from "@/content/home";
import { getAllInsights } from "@/lib/mdx";
import { siteConfig } from "@/lib/site-config";
import type { Organization, WithContext } from "schema-dts";

export default async function Home() {
  const insights = await getAllInsights();
  const topThree = insights.slice(0, 3);

  const orgSchema: WithContext<Organization> = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    email: siteConfig.email,
    telephone: siteConfig.phone,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    sameAs: [siteConfig.linkedin],
    founder: {
      "@type": "Person",
      name: "Beas Banerjee",
      sameAs: siteConfig.founderLinkedin,
    },
  };

  return (
    <>
      <JsonLd data={orgSchema} />
      <HomeHero />
      <CredentialsStrip />
      <ComingSoonProof />
      <SectionShell variant="canvas" width="content" className="py-8 sm:py-10">
        <div className="mx-auto max-w-[640px]">
          <PulseQuestion
            question={homeContent.pulse.question}
            options={homeContent.pulse.options}
          />
        </div>
      </SectionShell>
      <ThreePrinciples />
      <ServicesGrid />
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
