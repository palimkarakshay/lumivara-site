import { useEffect } from "react";
import { CheckCircle2, XCircle } from "lucide-react";
import clsx from "clsx";

export type ToastKind = "success" | "error";

export type ToastState = {
  id: number;
  kind: ToastKind;
  message: string;
};

export function Toast({
  toast,
  onDismiss,
}: {
  toast: ToastState;
  onDismiss: (id: number) => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => onDismiss(toast.id), 3500);
    return () => clearTimeout(t);
  }, [toast.id, onDismiss]);

  const Icon = toast.kind === "success" ? CheckCircle2 : XCircle;
  return (
    <div
      role="status"
      className={clsx(
        "pointer-events-auto flex items-start gap-2 rounded-lg border px-3 py-2 text-sm shadow-lg backdrop-blur",
        toast.kind === "success"
          ? "border-emerald-700/60 bg-emerald-950/80 text-emerald-100"
          : "border-rose-700/60 bg-rose-950/80 text-rose-100",
      )}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
      <span className="break-words">{toast.message}</span>
    </div>
  );
}

export function ToastStack({
  toasts,
  onDismiss,
}: {
  toasts: ToastState[];
  onDismiss: (id: number) => void;
}) {
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50 flex flex-col items-center gap-2 px-3 pb-[max(1rem,env(safe-area-inset-bottom))]">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onDismiss={onDismiss} />
      ))}
    </div>
  );
}
