"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { siteConfig } from "@/lib/site-config";
import { Logo } from "./Logo";
import { PaletteSwitcher } from "./PaletteSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { cn } from "@/lib/utils";

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
      <header
        className={cn(
          "sticky top-0 z-40 w-full transition-all duration-300",
          scrolled
            ? "border-b border-border-subtle bg-canvas/85 backdrop-blur-md"
            : "border-b border-transparent bg-canvas/0"
        )}
      >
        <div
          className={cn(
            "mx-auto flex max-w-[1280px] items-center justify-between px-6 transition-all sm:px-8",
            scrolled ? "h-14" : "h-16"
          )}
        >
          <Link
            href="/"
            className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent rounded"
            aria-label="Lumivara — home"
          >
            <Logo />
          </Link>

          <nav
            aria-label="Primary"
            className="hidden items-center gap-7 md:flex"
          >
            {siteConfig.nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "text-body-sm font-medium transition-colors",
                    active
                      ? "text-ink"
                      : "text-ink-soft hover:text-ink"
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Link
              href="/contact"
              className="hidden items-center gap-2 rounded-md bg-ink px-4 py-2 text-sm font-medium text-canvas transition-colors hover:bg-accent hover:text-ink md:inline-flex"
            >
              <span>Book a call</span>
              <ArrowRight size={14} aria-hidden />
            </Link>
            <PaletteSwitcher className="hidden md:inline-flex" />
            <ThemeToggle className="hidden md:inline-flex" />
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-label={open ? "Close menu" : "Open menu"}
              aria-expanded={open}
              aria-controls="mobile-nav"
              className="inline-flex h-9 w-9 items-center justify-center rounded-md border border-border-subtle text-ink md:hidden"
            >
              {open ? <X size={18} aria-hidden /> : <Menu size={18} aria-hidden />}
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div
          id="mobile-nav"
          className="fixed inset-0 top-14 z-30 flex flex-col gap-1 overflow-y-auto border-t border-border-subtle bg-canvas p-6 md:hidden"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
        >
          <nav className="flex flex-col gap-1">
            {siteConfig.nav.map((item) => {
              const active =
                pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "flex items-center justify-between border-b border-border-subtle py-4 font-display text-2xl",
                    active ? "text-accent" : "text-ink"
                  )}
                >
                  <span>{item.label}</span>
                  <ArrowRight size={18} aria-hidden />
                </Link>
              );
            })}
          </nav>
          <div className="mt-8 flex flex-col gap-4">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center gap-2 rounded-md bg-ink px-5 py-4 text-base font-medium text-canvas"
            >
              <span>Book a Discovery Call</span>
              <ArrowRight size={16} aria-hidden />
            </Link>
            <div className="flex items-center justify-between pt-4">
              <div className="text-label text-muted-strong">Theme</div>
              <ThemeToggle />
            </div>
            <div className="flex items-center justify-between">
              <div className="text-label text-muted-strong">Palette</div>
              <PaletteSwitcher />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
