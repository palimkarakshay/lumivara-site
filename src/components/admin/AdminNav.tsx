"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

export type NavItem = {
  href: string;
  label: string;
  /** Single-character or short glyph for the mobile bottom bar. */
  glyph: string;
  /** Show only on desktop; mobile bar collapses to the most-used 4. */
  desktopOnly?: boolean;
};

type Props = {
  items: readonly NavItem[];
  variant: "mobile" | "desktop";
};

function isActive(pathname: string, href: string): boolean {
  if (href === "/admin") return pathname === "/admin";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AdminNav({ items, variant }: Props) {
  const pathname = usePathname() ?? "/admin";

  if (variant === "mobile") {
    const visible = items.filter((it) => !it.desktopOnly).slice(0, 4);
    return (
      <ul className="mx-auto flex max-w-screen-sm items-stretch justify-between gap-1 px-2 py-2">
        {visible.map((item) => {
          const active = isActive(pathname, item.href);
          return (
            <li key={item.href} className="flex flex-1">
              <Link
                href={item.href}
                aria-current={active ? "page" : undefined}
                className={cn(
                  "flex min-h-[44px] flex-1 flex-col items-center justify-center rounded-md px-2 text-caption font-medium",
                  active
                    ? "bg-parchment text-ink"
                    : "text-ink-soft hover:bg-parchment",
                )}
              >
                <span aria-hidden className="text-base leading-none">
                  {item.glyph}
                </span>
                <span className="mt-0.5">{item.label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <ul className="flex flex-col gap-1">
      {items.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <li key={item.href}>
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "flex items-center gap-3 rounded-md px-3 py-2 text-body-sm font-medium",
                active
                  ? "bg-parchment text-ink"
                  : "text-ink-soft hover:bg-parchment hover:text-ink",
              )}
            >
              <span aria-hidden className="text-base">
                {item.glyph}
              </span>
              <span>{item.label}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
