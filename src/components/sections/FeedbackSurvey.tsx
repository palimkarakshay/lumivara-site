"use client";

import { ExternalLink, MessageSquare } from "lucide-react";
import { siteConfig } from "@/lib/site-config";

type FeedbackSurveyProps = {
  campaignId?: string;
};

export function FeedbackSurvey({ campaignId }: FeedbackSurveyProps) {
  const { surveyUrl, embedEnabled } = siteConfig.feedbackSurvey;

  const fullUrl =
    surveyUrl && campaignId
      ? `${surveyUrl}${surveyUrl.includes("?") ? "&" : "?"}campaign=${encodeURIComponent(campaignId)}`
      : surveyUrl;

  if (!surveyUrl) {
    return (
      <div className="flex flex-col items-center gap-6 rounded-lg border border-dashed border-border-subtle bg-canvas-elevated p-10 text-center">
        <MessageSquare size={32} className="text-accent" aria-hidden />
        <div>
          <p className="font-display text-xl text-ink">Survey coming soon</p>
          <p className="text-body-sm text-ink-soft mt-2 max-w-sm">
            We&apos;re setting up our client feedback survey. Check back shortly, or{" "}
            <a
              href={`mailto:${siteConfig.email}`}
              className="text-accent-deep underline underline-offset-2 hover:text-accent"
            >
              email us directly
            </a>
            .
          </p>
        </div>
      </div>
    );
  }

  if (embedEnabled) {
    return (
      <div className="overflow-hidden rounded-lg border border-border-subtle bg-canvas-elevated">
        <iframe
          src={fullUrl}
          className="h-[720px] w-full"
          title="Client feedback survey"
          allow="camera; microphone"
          loading="lazy"
          referrerPolicy="strict-origin-when-cross-origin"
        />
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center gap-8 rounded-lg border border-border-subtle bg-canvas-elevated px-8 py-14 text-center">
      <MessageSquare size={36} className="text-accent" aria-hidden />
      <div className="max-w-md">
        <p className="font-display text-2xl text-ink leading-tight">
          Share your experience with us
        </p>
        <p className="text-body text-ink-soft mt-4 leading-relaxed">
          The survey takes about 5 minutes and helps us improve how we serve you.
          Your responses are confidential.
        </p>
      </div>
      <a
        href={fullUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-2 rounded-md bg-ink px-7 py-3.5 font-medium text-canvas transition-colors hover:bg-accent hover:text-ink"
      >
        Open survey
        <ExternalLink size={15} aria-hidden />
        <span className="sr-only">(opens in new tab)</span>
      </a>
      <p className="text-caption text-muted-strong">
        Prefer to write? Email us at{" "}
        <a
          href={`mailto:${siteConfig.email}`}
          className="text-accent-deep underline underline-offset-2 hover:text-accent"
        >
          {siteConfig.email}
        </a>
        .
      </p>
    </div>
  );
}
