import type { Metadata } from "next";
import { PageHero } from "@/components/primitives/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { FeedbackSurvey } from "@/components/sections/FeedbackSurvey";

export const metadata: Metadata = {
  title: "Client Feedback",
  description:
    "Share your experience working with Lumivara. Your feedback helps us improve how we serve you.",
  robots: { index: false, follow: false },
};

type Props = {
  searchParams: Promise<{ campaign?: string }>;
};

export default async function FeedbackPage({ searchParams }: Props) {
  const { campaign } = await searchParams;

  return (
    <>
      <PageHero
        monoLabel="Client Feedback"
        headline="How are we doing?"
        subhead="Your candid input helps us keep our work sharp and your outcomes strong. The survey takes about 5 minutes."
      />
      <SectionShell variant="canvas" width="content">
        <FeedbackSurvey campaignId={campaign} />
      </SectionShell>
    </>
  );
}
