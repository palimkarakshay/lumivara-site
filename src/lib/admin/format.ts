// Tiny formatting helpers shared across admin views. Kept stateless so
// they're safe in both Server and Client Components.

const RT = new Intl.RelativeTimeFormat("en", { numeric: "auto" });

export function relativeTime(iso: string, now: Date = new Date()): string {
  const diffSec = (Date.parse(iso) - now.getTime()) / 1000;
  const abs = Math.abs(diffSec);
  if (abs < 60) return RT.format(Math.round(diffSec), "second");
  if (abs < 3600) return RT.format(Math.round(diffSec / 60), "minute");
  if (abs < 86_400) return RT.format(Math.round(diffSec / 3600), "hour");
  return RT.format(Math.round(diffSec / 86_400), "day");
}

export function formatUtc(iso: string | Date): string {
  const date = typeof iso === "string" ? new Date(iso) : iso;
  return new Intl.DateTimeFormat("en-CA", {
    dateStyle: "medium",
    timeStyle: "short",
    timeZone: "UTC",
  }).format(date);
}

/** Human run conclusion: combines `status` + `conclusion` into a single word. */
export function runStateLabel(
  status: string | null,
  conclusion: string | null,
): {
  label: string;
  tone: "success" | "failure" | "progress" | "neutral";
} {
  if (status && status !== "completed") {
    return { label: status.replace(/_/g, " "), tone: "progress" };
  }
  if (conclusion === "success") return { label: "passed", tone: "success" };
  if (conclusion === "failure" || conclusion === "timed_out") {
    return { label: conclusion.replace(/_/g, " "), tone: "failure" };
  }
  if (conclusion === "cancelled" || conclusion === "skipped") {
    return { label: conclusion, tone: "neutral" };
  }
  return { label: conclusion ?? "unknown", tone: "neutral" };
}
