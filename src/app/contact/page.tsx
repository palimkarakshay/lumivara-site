import type { Metadata } from "next";
import { Phone, Mail, MapPin } from "lucide-react";
import { contactContent } from "@/content/contact";
import { siteConfig } from "@/lib/site-config";
import { PageHero } from "@/components/primitives/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";
import { CalEmbed } from "@/components/sections/CalEmbed";
import { ContactForm } from "@/components/sections/ContactForm";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Book a complimentary 30-minute discovery call with Lumivara, or send a detailed inquiry. Every message is read and responded to personally within 48 hours.",
};

export default function ContactPage() {
  const { hero, directContact } = contactContent;
  return (
    <>
      <PageHero
        monoLabel={hero.monoLabel}
        headline={hero.headline}
        subhead={hero.subhead}
      />

      <SectionShell variant="canvas">
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <CalEmbed />
          <ContactForm />
        </div>
      </SectionShell>

      <SectionShell variant="parchment" width="content">
        <p className="text-label text-muted-strong mb-6">{directContact.label}</p>
        <ul className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          <li>
            <a
              href={`mailto:${siteConfig.email}`}
              className="group flex h-full items-start gap-3 rounded-md border border-border-subtle bg-canvas-elevated px-4 py-4 text-ink-soft transition-colors hover:border-accent"
            >
              <Mail size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              <div>
                <p className="text-label text-muted-strong">Email</p>
                <p className="text-body-sm text-ink mt-1">{siteConfig.email}</p>
              </div>
            </a>
          </li>
          <li>
            <a
              href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
              className="group flex h-full items-start gap-3 rounded-md border border-border-subtle bg-canvas-elevated px-4 py-4 text-ink-soft transition-colors hover:border-accent"
            >
              <Phone size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              <div>
                <p className="text-label text-muted-strong">Phone</p>
                <p className="text-body-sm text-ink mt-1">{siteConfig.phone}</p>
              </div>
            </a>
          </li>
          <li>
            <div className="flex h-full items-start gap-3 rounded-md border border-border-subtle bg-canvas-elevated px-4 py-4">
              <MapPin size={18} className="mt-0.5 shrink-0 text-accent" aria-hidden />
              <div>
                <p className="text-label text-muted-strong">Based in</p>
                <p className="text-body-sm text-ink mt-1">{siteConfig.location}</p>
              </div>
            </div>
          </li>
        </ul>
        <p className="text-caption text-muted-strong mt-10 text-center italic">
          {directContact.reassurance}
        </p>
      </SectionShell>
    </>
  );
}
