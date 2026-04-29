import { cn } from "@/lib/utils";
import { runStateLabel } from "@/lib/admin/format";

type Props = {
  status: string | null;
  conclusion: string | null;
  className?: string;
};

const TONE_CLASSES = {
  success: "bg-[color:var(--success)]/15 text-[color:var(--success)]",
  failure: "bg-[color:var(--error)]/15 text-[color:var(--error)]",
  progress: "bg-accent-soft/30 text-accent-deep",
  neutral: "bg-parchment text-muted-strong",
} as const;

export function RunStateBadge({ status, conclusion, className }: Props) {
  const { label, tone } = runStateLabel(status, conclusion);
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2 py-0.5 text-caption font-medium font-mono",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {label}
    </span>
  );
}
