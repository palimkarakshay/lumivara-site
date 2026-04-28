import { cn } from "@/lib/utils";
import {
  TONE_CLASSES,
  type StatusDescriptor,
  type StatusTone,
} from "@/lib/admin/status-map";

type Props = {
  status: StatusDescriptor | null;
  /** Override tone if rendering a non-status concept (e.g. CI passed/failed). */
  toneOverride?: StatusTone;
  className?: string;
};

export function StatusPill({ status, toneOverride, className }: Props) {
  if (!status) {
    return (
      <span
        className={cn(
          "inline-flex items-center rounded-full px-2.5 py-1 text-caption font-medium",
          TONE_CLASSES.neutral,
          className,
        )}
      >
        Unsorted
      </span>
    );
  }
  const tone = toneOverride ?? status.tone;
  return (
    <span
      title={status.copy}
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-caption font-medium whitespace-nowrap",
        TONE_CLASSES[tone],
        className,
      )}
    >
      {status.label}
    </span>
  );
}
