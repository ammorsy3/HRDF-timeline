import { ExternalLink } from "lucide-react";
import { formatDateAr } from "@/lib/date";
import { STATUS_LABELS, STATUS_COLORS } from "@/lib/status";
import StatusDot from "./StatusDot";
import AdminControls from "@/components/admin/AdminControls";
import type { Deliverable } from "@/data/campaign";

interface Props {
  deliverable: Deliverable;
  isAdmin: boolean;
}

export default function DeliverableRow({ deliverable: d, isAdmin }: Props) {
  return (
    <div className="py-3.5 border-b border-border/60 last:border-0">
      <div className="flex items-start justify-between gap-3">
        {/* Right: status + title + dates */}
        <div className="flex flex-col gap-1 min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <StatusDot status={d.status} size="sm" />
            <span
              className="text-xs font-medium"
              style={{ color: STATUS_COLORS[d.status] }}
            >
              {STATUS_LABELS[d.status]}
            </span>
          </div>
          <p className="text-sm font-semibold text-foreground leading-snug">
            {d.title}
          </p>
          <p className="text-xs text-muted-foreground">
            {formatDateAr(d.startDate)} — {formatDateAr(d.endDate)}
          </p>
        </div>

        {/* Left: Drive link */}
        {d.driveUrl && (
          <a
            href={d.driveUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 flex items-center gap-1.5 text-xs font-semibold text-[#224D83] bg-[#E8EFF8] hover:bg-[#224D83] hover:text-white px-3 py-2 rounded-xl transition-all"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span>عرض الملف</span>
          </a>
        )}
      </div>

      {/* Admin-only edit controls */}
      {isAdmin && (
        <AdminControls
          id={d.id}
          currentStatus={d.status}
          currentDriveUrl={d.driveUrl}
        />
      )}
    </div>
  );
}
