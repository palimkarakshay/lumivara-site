"use client";

import { useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { contactContent } from "@/content/contact";

export function CalEmbed() {
  const [loaded, setLoaded] = useState(false);
  const { booking } = contactContent;

  return (
    <div className="flex h-full flex-col gap-4 rounded-lg border border-border-subtle bg-canvas-elevated p-6 sm:p-8">
      <p className="text-label text-muted-strong">{booking.label}</p>
      <h2 className="font-display text-2xl text-ink leading-tight sm:text-3xl">
        Pick a time.
      </h2>
      <p className="text-body-sm text-ink-soft leading-relaxed">
        {booking.body}
      </p>
      <div className="relative mt-2 flex-1 overflow-hidden rounded-md border border-border-subtle bg-parchment">
        {!loaded && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 p-6 text-center">
            <p className="text-label text-muted-strong">
              Loading booking calendar…
            </p>
            <p className="text-caption text-muted-strong max-w-[320px]">
              If it doesn&apos;t appear,{" "}
              <a
                href={siteConfig.calLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-accent-deep underline underline-offset-2 hover:text-accent"
              >
                open in a new tab
              </a>
              .
            </p>
          </div>
        )}
        <iframe
          src={siteConfig.calLink}
          title="Book a discovery call with Lumivara"
          className="h-[560px] w-full"
          onLoad={() => setLoaded(true)}
          loading="lazy"
          referrerPolicy="origin"
        />
      </div>
    </div>
  );
}
