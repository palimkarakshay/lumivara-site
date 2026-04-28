import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin-allowlist";

import { SubmitIdeaForm } from "./submit-idea-form";

export const dynamic = "force-dynamic";

export default async function NewIdeaPage() {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    redirect("/admin/sign-in?from=/admin/new");
  }

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-caption text-muted-strong uppercase tracking-wider">
          Submit
        </p>
        <h1 className="font-display text-3xl text-ink mt-1">
          Tell us what you need.
        </h1>
        <p className="text-body-sm text-ink-soft mt-2">
          Plain English is fine — we&rsquo;ll structure the rest. You&rsquo;ll
          get an email reply with a link back here.
        </p>
      </div>

      <SubmitIdeaForm />

      <p className="text-caption text-muted-strong">
        Prefer email or SMS? Send to{" "}
        <span className="font-medium text-ink">requests@lumivara.ca</span> or
        text our intake number — both land in the same place.
      </p>

      <Link
        href="/admin"
        className="text-caption text-muted-strong underline self-start"
      >
        ← Back to dashboard
      </Link>
    </div>
  );
}
