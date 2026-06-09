import type { ReactNode } from "react";

type ItemRailProps = {
  children: ReactNode;
  label?: string;
};

export function ItemRail({ children, label = "Item rail" }: ItemRailProps) {
  return (
    <section className="ds-item-rail" aria-label={label}>
      {children}
    </section>
  );
}
