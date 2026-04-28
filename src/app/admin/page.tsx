import Link from "next/link";

import { auth } from "@/auth";

export default async function AdminDashboardPage() {
  const session = await auth();
  const email = session?.user?.email ?? "";

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Signed in
        </p>
        <h1 className="font-display text-3xl text-ink mt-1">
          Welcome back{email ? `, ${email.split("@")[0]}` : ""}.
        </h1>
        <p className="text-body-sm text-ink-soft mt-2">
          Your dashboard is being built. Real status cards land in Phase 3.
        </p>
      </div>

      <Link
        href="/admin/new"
        className="flex min-h-[44px] items-center justify-center rounded-md bg-ink px-4 text-base font-medium text-canvas hover:bg-accent hover:text-ink"
      >
        Submit a request
      </Link>

      <div className="rounded-lg border border-border-subtle bg-canvas-elevated p-5">
        <h2 className="font-display text-lg text-ink">Coming soon</h2>
        <ul className="mt-3 flex flex-col gap-2 text-body-sm text-ink-soft">
          <li>· Plain-English status for every request (Phase 3)</li>
          <li>· Tap to answer questions when we&rsquo;re blocked (Phase 4)</li>
          <li>· One-tap deploy approval (Phase 5)</li>
        </ul>
      </div>
    </div>
  );
}
