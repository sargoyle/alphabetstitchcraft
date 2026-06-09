import type { ReactNode } from "react";
import { Button } from "./Button";

type ModalProps = {
  title: string;
  children: ReactNode;
  open?: boolean;
  onClose?: () => void;
};

export function Modal({ title, children, open = true, onClose }: ModalProps) {
  if (!open) return null;

  return (
    <div className="ds-modal-shell" role="presentation">
      <section className="ds-modal" role="dialog" aria-modal="true" aria-labelledby="design-system-modal-title">
        <div className="panel-heading">
          <h2 id="design-system-modal-title">{title}</h2>
          {onClose ? (
            <Button variant="ghost" onClick={onClose}>
              Close
            </Button>
          ) : null}
        </div>
        {children}
      </section>
    </div>
  );
}
