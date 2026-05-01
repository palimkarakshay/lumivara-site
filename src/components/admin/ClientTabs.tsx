"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import type { NavItem } from "./AdminNav";

type Props = {
  items: readonly NavItem[];
};

/**
 * The Requests tab is the index route ({base}). Every other tab lives at
 * a named sub-segment, so we treat sibling-segment matching as the rule
 * and the index as the exception.
 */
const SIBLING_SUFFIXES = ["/existing", "/draft", "/preview", "/deployed", "/new"] as const;

function isActive(pathname: string, href: string): boolean {
  if (pathname === href) return true;
  for (const suffix of SIBLING_SUFFIXES) {
    if (href.endsWith(suffix)) {
      return pathname.startsWith(`${href}/`) || pathname === href;
    }
  }
  return false;
}

export function ClientTabs({ items }: Props) {
  const pathname = usePathname() ?? "";
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((item) => {
        const active =
          pathname === item.href ||
          (item.href !== "/" && isActive(pathname, item.href));
        return (
          <li
            key={item.href}
            className={cn(item.desktopOnly && "hidden md:list-item")}
          >
            <Link
              href={item.href}
              aria-current={active ? "page" : undefined}
              className={cn(
                "inline-flex items-center gap-2 rounded-md border px-3 py-2 text-body-sm font-medium",
                active
                  ? "border-accent bg-canvas text-ink ring-1 ring-accent"
                  : "border-border-subtle bg-canvas text-ink-soft hover:bg-parchment hover:text-ink",
              )}
            >
              <span aria-hidden>{item.glyph}</span>
              {item.label}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
