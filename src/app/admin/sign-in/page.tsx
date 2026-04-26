import { redirect } from "next/navigation";

import { auth, signIn } from "@/auth";

export default async function AdminSignInPage({
  searchParams,
}: {
  searchParams: Promise<{ "check-email"?: string; from?: string }>;
}) {
  const session = await auth();
  if (session?.user?.email) {
    redirect("/admin");
  }

  const params = await searchParams;
  const checkEmail = params["check-email"] === "1";

  return (
    <div className="flex flex-col gap-8">
      <div>
        <h1 className="font-display text-3xl text-ink">Sign in</h1>
        <p className="text-body-sm text-ink-soft mt-2">
          Use the email or account we&rsquo;ve set you up with. If you reach
          this page by mistake, no further action is needed.
        </p>
      </div>

      {checkEmail ? (
        <div
          role="status"
          className="rounded-lg border border-border-subtle bg-canvas-elevated p-4 text-body-sm text-ink"
        >
          <p className="font-medium">Check your email.</p>
          <p className="text-ink-soft mt-1">
            We just sent you a sign-in link. It&rsquo;s good for ten minutes.
          </p>
        </div>
      ) : null}

      <form
        action={async (formData) => {
          "use server";
          await signIn("resend", {
            email: String(formData.get("email") ?? ""),
            redirectTo: "/admin",
          });
        }}
        className="flex flex-col gap-3"
      >
        <label htmlFor="email" className="text-label text-muted-strong">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          required
          autoComplete="email"
          inputMode="email"
          placeholder="you@company.com"
          className="min-h-[44px] w-full rounded-md border border-border-subtle bg-canvas px-4 text-base text-ink placeholder:text-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        />
        <button
          type="submit"
          className="min-h-[44px] w-full rounded-md bg-ink px-4 text-base font-medium text-canvas hover:bg-accent hover:text-ink"
        >
          Email me a sign-in link
        </button>
      </form>

      <div className="flex items-center gap-3" aria-hidden>
        <span className="h-px flex-1 bg-border-subtle" />
        <span className="text-caption text-muted-strong">or</span>
        <span className="h-px flex-1 bg-border-subtle" />
      </div>

      <div className="flex flex-col gap-3">
        <form
          action={async () => {
            "use server";
            await signIn("google", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="min-h-[44px] w-full rounded-md border border-border-subtle bg-canvas-elevated px-4 text-base font-medium text-ink hover:bg-parchment"
          >
            Continue with Google
          </button>
        </form>
        <form
          action={async () => {
            "use server";
            await signIn("microsoft-entra-id", { redirectTo: "/admin" });
          }}
        >
          <button
            type="submit"
            className="min-h-[44px] w-full rounded-md border border-border-subtle bg-canvas-elevated px-4 text-base font-medium text-ink hover:bg-parchment"
          >
            Continue with Microsoft
          </button>
        </form>
      </div>
    </div>
  );
}
