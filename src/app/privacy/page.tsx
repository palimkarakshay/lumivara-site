import type { Metadata } from "next";
import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { PageHero } from "@/components/primitives/PageHero";
import { SectionShell } from "@/components/primitives/SectionShell";

export const metadata: Metadata = {
  title: "Privacy",
  description:
    "How Lumivara People Advisory collects, uses, and protects your personal information — in line with PIPEDA.",
  robots: { index: true, follow: true },
};

const lastUpdated = "April 23, 2026";

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        monoLabel="Privacy"
        headline="How we handle your information."
        subhead={`Plain-language privacy notice for Lumivara People Advisory. We comply with PIPEDA (Personal Information Protection and Electronic Documents Act) and applicable Canadian privacy law. Last updated ${lastUpdated}.`}
      />

      <SectionShell variant="canvas" width="prose">
        <div className="flex flex-col gap-10 text-body text-ink-soft leading-relaxed">
          <section>
            <h2 className="font-display text-2xl text-ink mb-3">
              What we collect
            </h2>
            <p>
              We only collect information you give us directly through this
              site:
            </p>
            <ul className="mt-3 list-disc pl-6">
              <li>
                <strong>Inquiry form:</strong> name, work email, organization
                (optional), organization size, area of interest, timeline, and
                message.
              </li>
              <li>
                <strong>Newsletter signup:</strong> email address.
              </li>
              <li>
                <strong>Booking tool (Cal.com):</strong> name, email, and any
                information you share when scheduling. This is handled by
                Cal.com under their own privacy policy.
              </li>
            </ul>
            <p className="mt-3">
              We do <em>not</em> track visitors with third-party advertising
              cookies, sell your data, or share it with vendors beyond what is
              needed to respond to you.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-3">
              Why we collect it
            </h2>
            <ul className="list-disc pl-6">
              <li>To respond to your inquiry and schedule a discovery call.</li>
              <li>
                To send newsletter updates you&apos;ve subscribed to (with a
                one-click unsubscribe in every email).
              </li>
              <li>
                To maintain a record of the conversations we&apos;ve had with
                prospects and clients.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-3">
              How long we keep it
            </h2>
            <ul className="list-disc pl-6">
              <li>
                <strong>Inquiries that don&apos;t lead to engagement:</strong>{" "}
                kept for up to 24 months, then deleted.
              </li>
              <li>
                <strong>Client engagement records:</strong> kept for seven years
                to meet professional record-keeping obligations, then deleted.
              </li>
              <li>
                <strong>Newsletter subscriptions:</strong> kept until you
                unsubscribe.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-3">
              Who we share it with
            </h2>
            <p>
              We use a small set of service providers to operate this site and
              respond to you:
            </p>
            <ul className="mt-3 list-disc pl-6">
              <li>
                <strong>Cal.com</strong> for discovery-call scheduling.
              </li>
              <li>
                <strong>An email service provider</strong> (Resend, when
                enabled) to deliver newsletter and inquiry responses.
              </li>
              <li>
                <strong>Vercel / our hosting provider</strong> for site delivery
                and standard server logs.
              </li>
            </ul>
            <p className="mt-3">
              Each provider processes only the information needed to do their
              job. We do not sell your information, and we do not share it with
              third-party advertising networks.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-3">
              Your rights under PIPEDA
            </h2>
            <p>You have the right to:</p>
            <ul className="mt-3 list-disc pl-6">
              <li>Know what personal information we hold about you.</li>
              <li>Access that information and receive a copy.</li>
              <li>Correct any information that is inaccurate.</li>
              <li>
                Withdraw your consent and request deletion, subject to our legal
                record-keeping obligations.
              </li>
              <li>
                Make a complaint to the{" "}
                <a
                  href="https://www.priv.gc.ca/en/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-accent-deep underline underline-offset-2 hover:text-accent"
                >
                  Office of the Privacy Commissioner of Canada
                </a>
                .
              </li>
            </ul>
            <p className="mt-3">
              To exercise any of these rights, email{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-accent-deep underline underline-offset-2 hover:text-accent"
              >
                {siteConfig.email}
              </a>
              . We&apos;ll respond within 30 days.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-3">
              Cookies and analytics
            </h2>
            <p>
              This site uses only essential cookies (e.g., to remember your
              light/dark theme preference). We don&apos;t use advertising or
              tracking cookies. If we add privacy-respecting analytics (for
              example Plausible), we&apos;ll update this page before enabling
              it.
            </p>
          </section>

          <section>
            <h2 className="font-display text-2xl text-ink mb-3">
              Contact us
            </h2>
            <p>
              Lumivara People Advisory — {siteConfig.location}. Email{" "}
              <a
                href={`mailto:${siteConfig.email}`}
                className="text-accent-deep underline underline-offset-2 hover:text-accent"
              >
                {siteConfig.email}
              </a>{" "}
              or call{" "}
              <a
                href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                className="text-accent-deep underline underline-offset-2 hover:text-accent"
              >
                {siteConfig.phone}
              </a>
              .
            </p>
          </section>

          <section>
            <p className="text-caption text-muted-strong border-t border-border-subtle pt-6">
              This notice is reviewed periodically. If we make material changes
              we&apos;ll update the &quot;last updated&quot; date above and, for
              significant changes, notify subscribers by email.{" "}
              <Link href="/contact" className="underline underline-offset-2">
                Questions?
              </Link>
            </p>
          </section>
        </div>
      </SectionShell>
    </>
  );
}
