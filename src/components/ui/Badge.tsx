import type { HTMLAttributes, ReactNode } from "react";

type BadgeTone = "neutral" | "success" | "warning" | "error";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  tone?: BadgeTone;
};

export function Badge({ children, className = "", tone = "neutral", ...props }: BadgeProps) {
  return (
    <span className={`ds-badge ds-badge-${tone} ${className}`.trim()} {...props}>
      {children}
    </span>
  );
}
