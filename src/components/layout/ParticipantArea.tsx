import type { ReactNode } from "react";
import { Badge } from "@/components/ui/Badge";

type ParticipantAreaProps = {
  name: string;
  status?: string;
  score?: number;
  active?: boolean;
  children?: ReactNode;
};

export function ParticipantArea({ name, status = "Waiting", score, active = false, children }: ParticipantAreaProps) {
  return (
    <section className={`ds-participant-area ${active ? "is-active" : ""}`.trim()}>
      <div className="panel-heading">
        <div>
          <p className="eyebrow">{active ? "Active area" : status}</p>
          <h2>{name}</h2>
        </div>
        {typeof score === "number" ? <Badge tone="success">{score} pts</Badge> : null}
      </div>
      {children}
    </section>
  );
}
