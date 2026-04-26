import Link from "next/link";
import { siteConfig } from "@/lib/site-config";
import { Logo } from "./Logo";
import { NewsletterSignup } from "./NewsletterSignup";
import { TorontoTime } from "./TorontoTime";

function LinkedInIcon({ size = 14 }: { size?: number }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden
    >
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14ZM8.34 17.34V10.4H6.03v6.94h2.31Zm-1.16-7.9a1.34 1.34 0 1 0 0-2.69 1.34 1.34 0 0 0 0 2.69Zm10.83 7.9v-3.8c0-2.06-1.1-3.02-2.57-3.02-1.18 0-1.71.65-2.01 1.11V10.4h-2.3l.03 6.94h2.3v-3.88c0-.21.02-.42.08-.57.16-.42.55-.86 1.18-.86.83 0 1.16.63 1.16 1.56v3.75h2.13Z" />
    </svg>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-border-subtle bg-canvas-elevated">
      <div className="mx-auto max-w-[1280px] px-6 py-16 sm:px-8 sm:py-20">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <Link href="/" className="inline-block" aria-label="Lumivara — home">
              <Logo />
            </Link>
            <p className="text-body-sm text-ink-soft mt-5 max-w-[360px] leading-relaxed">
              Strategy, capability, and measurable impact — for organizations
              building stronger people systems.
            </p>
            <div className="mt-8 max-w-[380px]">
              <NewsletterSignup />
            </div>
          </div>

          <nav
            aria-label="Footer"
            className="grid grid-cols-2 gap-6 md:col-span-4 md:col-start-7 md:grid-cols-2"
          >
            <div>
              <h2 className="text-label text-muted-strong mb-4">Explore</h2>
              <ul className="flex flex-col gap-3">
                {siteConfig.nav.map((item) => (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className="text-body-sm text-ink-soft transition-colors hover:text-ink"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href="/contact"
                    className="text-body-sm text-ink-soft transition-colors hover:text-ink"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="text-label text-muted-strong mb-4">Get in touch</h2>
              <ul className="flex flex-col gap-3 text-body-sm text-ink-soft">
                <li>
                  <a
                    href={`mailto:${siteConfig.email}`}
                    className="transition-colors hover:text-ink"
                  >
                    {siteConfig.email}
                  </a>
                </li>
                <li>
                  <a
                    href={`tel:${siteConfig.phone.replace(/\D/g, "")}`}
                    className="transition-colors hover:text-ink"
                  >
                    {siteConfig.phone}
                  </a>
                </li>
                <li><TorontoTime /></li>
                <li>
                  <a
                    href={siteConfig.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 transition-colors hover:text-ink"
                  >
                    <LinkedInIcon />
                    LinkedIn
                  </a>
                </li>
              </ul>
            </div>
          </nav>
        </div>

        <div className="mt-14 flex flex-col items-center justify-center gap-3 border-t border-border-subtle pt-8">
          <div className="text-label text-muted-strong flex flex-wrap items-center justify-center gap-x-3 gap-y-1">
            {siteConfig.credentials.map((c, i) => (
              <span key={c} className="flex items-center gap-3">
                <span>{c}</span>
                {i < siteConfig.credentials.length - 1 && (
                  <span aria-hidden className="text-accent">·</span>
                )}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-8 flex flex-col items-center justify-between gap-3 text-caption text-muted-strong sm:flex-row">
          <p>
            © {new Date().getFullYear()} Lumivara People Advisory. Toronto,
            Canada.
          </p>
          <div className="flex items-center gap-4">
            <Link
              href="/privacy"
              className="transition-colors hover:text-ink"
            >
              Privacy
            </Link>
            <Link
              href="/contact"
              className="transition-colors hover:text-ink"
            >
              Contact
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
