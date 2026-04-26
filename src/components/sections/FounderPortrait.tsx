"use client";

import { useState } from "react";
import Image from "next/image";

const PHOTO_ALT =
  "Beas Banerjee, Founder of Lumivara People Advisory, professional headshot";
const PLACEHOLDER_ALT =
  "Portrait of Beas Banerjee — CHRL-certified HR advisor, MBA, 10+ years building people systems in Canadian organizations";

export function FounderPortrait() {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-lg border border-border-subtle bg-parchment">
      <Image
        src={imgError ? "/images/founder-placeholder.svg" : "/images/beas-banerjee.jpg"}
        alt={imgError ? PLACEHOLDER_ALT : PHOTO_ALT}
        fill
        sizes="(min-width: 768px) 40vw, 100vw"
        className="object-cover"
        quality={75}
        onError={imgError ? undefined : () => setImgError(true)}
      />
    </div>
  );
}
