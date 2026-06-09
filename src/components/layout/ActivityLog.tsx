type ActivityLogEntry = {
  id: string;
  text: string;
  tone?: "neutral" | "success" | "warning" | "error";
};

type ActivityLogProps = {
  entries: ActivityLogEntry[];
};

export function ActivityLog({ entries }: ActivityLogProps) {
  return (
    <section className="ds-activity-log" aria-label="Activity log" aria-live="polite">
      <h2>Activity log</h2>
      <ol>
        {entries.map((entry) => (
          <li key={entry.id} className={`ds-log-${entry.tone ?? "neutral"}`}>
            {entry.text}
          </li>
        ))}
      </ol>
    </section>
  );
}
