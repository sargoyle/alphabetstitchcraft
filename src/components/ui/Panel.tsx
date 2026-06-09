import type { HTMLAttributes, ReactNode } from "react";

type PanelProps = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  title?: string;
  eyebrow?: string;
};

export function Panel({ children, className = "", title, eyebrow, ...props }: PanelProps) {
  return (
    <section className={`tool-card ds-panel ${className}`.trim()} {...props}>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      {title ? <h2>{title}</h2> : null}
      {children}
    </section>
  );
}
