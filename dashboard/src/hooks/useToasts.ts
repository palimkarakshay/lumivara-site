import { useCallback, useState } from "react";
import type { ToastKind, ToastState } from "../components/Toast";

export function useToasts() {
  const [toasts, setToasts] = useState<ToastState[]>([]);

  const push = useCallback((kind: ToastKind, message: string) => {
    setToasts((cur) => [...cur, { id: Date.now() + Math.random(), kind, message }]);
  }, []);

  const dismiss = useCallback((id: number) => {
    setToasts((cur) => cur.filter((t) => t.id !== id));
  }, []);

  return {
    toasts,
    dismiss,
    success: (m: string) => push("success", m),
    error: (m: string) => push("error", m),
  };
}
