type StatusBadgeProps = {
  status: "draft" | "ready";
};

export function StatusBadge({ status }: StatusBadgeProps) {
  const label = status === "ready" ? "Ready" : "Draft";

  return (
    <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium uppercase tracking-[0.2em] text-white/75">
      {label}
    </span>
  );
}