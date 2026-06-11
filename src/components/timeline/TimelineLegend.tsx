import { STATUS_COLORS, STATUS_LABELS } from "@/lib/status";
import type { DeliverableStatus } from "@/types";

const LEGEND_STATUSES: DeliverableStatus[] = [
  "not_started",
  "in_progress",
  "awaiting_approval",
  "done",
];

export default function TimelineLegend() {
  return (
    <div className="mt-6 p-4 bg-[#F4F6FA] rounded-2xl border border-border">
      <p className="text-xs font-semibold text-muted-foreground mb-3 text-right">
        دليل الرموز
      </p>
      <div className="flex flex-wrap gap-x-6 gap-y-2 justify-end">
        {LEGEND_STATUSES.map((s) => (
          <div key={s} className="flex items-center gap-1.5">
            <span className="text-xs text-foreground">{STATUS_LABELS[s]}</span>
            <div
              className="w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: STATUS_COLORS[s] }}
            />
          </div>
        ))}
        {/* Today marker */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-foreground">اليوم</span>
          <div className="w-px h-4 bg-red-400 shrink-0" />
        </div>
        {/* Approval gate */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs text-foreground">اعتماد الصندوق</span>
          <div className="w-3 h-3 rotate-45 border-2 border-[#224D83] bg-white shrink-0" />
        </div>
      </div>
    </div>
  );
}
