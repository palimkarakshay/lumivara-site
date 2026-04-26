import type { Metadata } from "next";
import Link from "next/link";

import { auth, signOut } from "@/auth";
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
    <div className="flex min-h-[100dvh] flex-col bg-canvas text-ink">
      <header className="sticky top-0 z-30 border-b border-border-subtle bg-canvas/90 backdrop-blur">
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
        <div className="mx-auto w-full max-w-screen-sm px-4 pb-24 pt-6">
          {children}
        </div>
      </main>

      {signedIn ? (
        <nav
          aria-label="Admin"
          className="fixed inset-x-0 bottom-0 z-30 border-t border-border-subtle bg-canvas-elevated/95 backdrop-blur"
          style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
        >
          <div className="mx-auto flex max-w-screen-sm items-stretch justify-between gap-2 px-4 py-2">
            <Link
              href="/admin"
              className="flex min-h-[44px] flex-1 items-center justify-center rounded-md px-4 text-sm font-medium text-ink hover:bg-parchment"
            >
              Dashboard
            </Link>
            <form
              action={async () => {
                "use server";
                await signOut({ redirectTo: "/admin/sign-in" });
              }}
              className="flex flex-1"
            >
              <button
                type="submit"
                className="min-h-[44px] flex-1 rounded-md px-4 text-sm font-medium text-ink-soft hover:bg-parchment"
              >
                Sign out
              </button>
            </form>
          </div>
        </nav>
      ) : null}
    </div>
  );
}
