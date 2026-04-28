import type { Metadata } from "next";
import Link from "next/link";

import { auth, signOut } from "@/auth";
import { AdminNav } from "@/components/admin/AdminNav";
import { MOTHERSHIP_NAV } from "@/components/admin/nav-config";
import { isAdminEmail } from "@/lib/admin-allowlist";

export const metadata: Metadata = {
  title: "Admin",
  robots: { index: false, follow: false },
};

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const email = session?.user?.email ?? null;
  const signedIn = isAdminEmail(email);

  return (
    <div className="flex min-h-[100dvh] flex-col bg-canvas text-ink lg:flex-row">
      {signedIn ? (
        <aside
          aria-label="Admin sections"
          className="hidden lg:flex lg:w-60 lg:shrink-0 lg:flex-col lg:gap-6 lg:border-r lg:border-border-subtle lg:bg-canvas-elevated lg:px-4 lg:py-6"
        >
          <Link
            href="/admin"
            className="font-display text-lg tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Lumivara Admin
          </Link>
          <AdminNav items={MOTHERSHIP_NAV} variant="desktop" />
          <div className="mt-auto flex flex-col gap-2 border-t border-border-subtle pt-4">
            {email ? (
              <p
                className="text-caption text-muted-strong truncate"
                title={email}
              >
                {email}
              </p>
            ) : null}
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/sign-in" });
              }}
            >
              <button
                type="submit"
                className="min-h-[40px] w-full rounded-md border border-border-subtle bg-canvas px-3 text-body-sm font-medium text-ink-soft hover:bg-parchment"
              >
                Sign out
              </button>
            </form>
          </div>
        </aside>
      ) : null}

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-30 border-b border-border-subtle bg-canvas/90 backdrop-blur lg:hidden">
          <div className="mx-auto flex h-14 max-w-screen-sm items-center justify-between px-4">
            <Link
              href="/admin"
              className="font-display text-lg tracking-tight text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
              Lumivara Admin
            </Link>
            {signedIn && email ? (
              <span
                className="text-caption text-muted-strong truncate max-w-[180px]"
                title={email}
              >
                {email}
              </span>
            ) : null}
          </div>
        </header>

        <main className="flex-1">
          <div className="mx-auto w-full max-w-screen-sm px-4 pb-24 pt-6 lg:max-w-6xl lg:px-8 lg:pb-12">
            {children}
          </div>
        </main>

        {signedIn ? (
          <nav
            aria-label="Admin"
            className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-canvas-elevated/95 backdrop-blur lg:hidden"
            style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
          >
            <AdminNav items={MOTHERSHIP_NAV} variant="mobile" />
          </nav>
        ) : null}
      </div>
    </div>
  );
}
