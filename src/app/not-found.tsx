import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionShell } from "@/components/primitives/SectionShell";
import { NumberedSection } from "@/components/primitives/NumberedSection";

export default function NotFound() {
  return (
    <SectionShell variant="canvas" width="content" className="py-32">
      <NumberedSection number="404" label="Page Not Found" />
      <h1 className="text-display-lg text-ink mt-6 mb-6">
        This page doesn&apos;t exist.
      </h1>
      <p className="text-body-lg text-ink-soft mb-10 max-w-[560px]">
        Let&apos;s get you back on track.
      </p>
      <ul className="flex flex-col gap-2 max-w-[400px]">
        {[
          { href: "/", label: "Home" },
          { href: "/what-we-do", label: "What We Do" },
          { href: "/how-we-work", label: "How We Work" },
          { href: "/insights", label: "Insights" },
          { href: "/contact", label: "Contact" },
        ].map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="group flex items-center justify-between rounded-md border border-border-subtle bg-canvas-elevated px-5 py-3 text-body-sm text-ink-soft transition-all hover:border-accent hover:text-ink"
            >
              <span>{item.label}</span>
              <ArrowRight
                size={14}
                aria-hidden
                className="text-muted-strong transition-all group-hover:translate-x-0.5 group-hover:text-accent"
              />
            </Link>
          </li>
        ))}
      </ul>
    </SectionShell>
  );
}
