import { STATUS_COLORS, STATUS_LABELS } from "@/lib/status";
import type { DeliverableStatus } from "@/types";

interface Props {
  status: DeliverableStatus;
  size?: "sm" | "md";
  showLabel?: boolean;
}

export default function StatusDot({ status, size = "sm", showLabel = false }: Props) {
  const dim = size === "md" ? "w-3.5 h-3.5" : "w-2.5 h-2.5";

  return (
    <span className="inline-flex items-center gap-1.5 shrink-0">
      <span
        className={`${dim} rounded-full shrink-0 inline-block`}
        style={{ backgroundColor: STATUS_COLORS[status] }}
      />
      {showLabel && (
        <span className="text-xs font-medium" style={{ color: STATUS_COLORS[status] }}>
          {STATUS_LABELS[status]}
        </span>
      )}
    </span>
  );
}
