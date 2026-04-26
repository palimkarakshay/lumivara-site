import Link from "next/link";

export default function AdminNoAccessPage() {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="font-display text-3xl text-ink">You&rsquo;re all set.</h1>
        <p className="text-body-sm text-ink-soft mt-2">
          If a session was waiting for you it&rsquo;s closed now. There&rsquo;s
          nothing more to do here.
        </p>
      </div>
      <Link
        href="/"
        className="inline-flex min-h-[44px] items-center justify-center rounded-md bg-ink px-5 text-base font-medium text-canvas hover:bg-accent hover:text-ink"
      >
        Back to lumivara.ca
      </Link>
    </div>
  );
}
