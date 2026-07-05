import type { HTMLAttributes, ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

type DisplayCardProps = HTMLAttributes<HTMLElement> & {
  title: string;
  subtitle?: string;
  body?: string;
  footer?: ReactNode;
  selected?: boolean;
  disabled?: boolean;
  legalMove?: boolean;
  illegalMove?: boolean;
};

export function DisplayCard({
  title,
  subtitle,
  body,
  footer,
  selected = false,
  disabled = false,
  legalMove = false,
  illegalMove = false,
  className = "",
  ...props
}: DisplayCardProps) {
  const stateClass = [
    selected ? "is-selected" : "",
    disabled ? "is-disabled" : "",
    legalMove ? "is-legal" : "",
    illegalMove ? "is-illegal" : ""
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <article
      className={`ds-display-card ${stateClass} ${className}`.trim()}
      data-disabled={disabled ? "true" : undefined}
      {...props}
    >
      <div>
        {subtitle ? <Badge tone={legalMove ? "success" : illegalMove ? "error" : "neutral"}>{subtitle}</Badge> : null}
        <h3>{title}</h3>
      </div>
      {body ? <p>{body}</p> : null}
      {footer ? <div className="ds-card-footer">{footer}</div> : null}
    </article>
  );
}
