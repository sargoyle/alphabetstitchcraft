import type { ReactNode } from "react";

type LayoutBoardProps = {
  children: ReactNode;
  label?: string;
};

export function LayoutBoard({ children, label = "Layout board" }: LayoutBoardProps) {
  return (
    <section className="ds-layout-board" aria-label={label}>
      {children}
    </section>
  );
}
