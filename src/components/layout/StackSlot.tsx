type StackSlotProps = {
  label: string;
  count?: number;
  empty?: boolean;
};

export function StackSlot({ label, count, empty = false }: StackSlotProps) {
  return (
    <div className={`ds-stack-slot ${empty ? "is-empty" : ""}`.trim()} role="group" aria-label={label}>
      <span>{label}</span>
      {typeof count === "number" ? <strong>{count}</strong> : null}
    </div>
  );
}
