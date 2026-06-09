type MetricBadgeProps = {
  label: string;
  value: number | string;
};

export function MetricBadge({ label, value }: MetricBadgeProps) {
  return (
    <span className="ds-metric-badge">
      <span>{label}</span>
      <strong>{value}</strong>
    </span>
  );
}
