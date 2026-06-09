import type { ReactNode } from "react";

type EmptyStateProps = {
  title: string;
  message: string;
  action?: ReactNode;
};

export function EmptyState({ title, message, action }: EmptyStateProps) {
  return (
    <section className="empty-preview ds-empty-state" aria-live="polite">
      <h2>{title}</h2>
      <p>{message}</p>
      {action ? <div className="button-row">{action}</div> : null}
    </section>
  );
}
