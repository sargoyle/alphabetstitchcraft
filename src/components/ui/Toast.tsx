import type { ReactNode } from "react";

type ToastTone = "success" | "warning" | "error";

type ToastProps = {
  children: ReactNode;
  tone?: ToastTone;
};

export function Toast({ children, tone = "success" }: ToastProps) {
  return (
    <div className={`ds-toast ds-toast-${tone}`} role="status" aria-live="polite">
      {children}
    </div>
  );
}
