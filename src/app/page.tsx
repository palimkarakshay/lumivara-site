import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";

export default function Home() {
  return (
    <SectionShell variant="canvas" width="content" className="py-32">
      <NumberedSection number="00" label="Build Status" />
      <h1 className="text-display-lg text-ink mt-6 mb-6">
        Bring clarity to complex people problems.
      </h1>
      <p className="text-body-lg text-ink-soft max-w-[640px]">
        Phase 2 complete — layout, theming, and design primitives shipped. Full
        home page ships in Phase 3.
      </p>
    </SectionShell>
  );
}
