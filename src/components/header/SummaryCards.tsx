import { CalendarDays, CalendarCheck, Clock3, Milestone } from "lucide-react";
import { getDaysLeft, getNextKeyDate, formatDateAr, formatNum } from "@/lib/date";
import { PROJECT } from "@/data/campaign";
import type { Deliverable, ApprovalGate } from "@/data/campaign";

interface Props {
  deliverables: Deliverable[];
  gates: ApprovalGate[];
}

function Card({
  icon: Icon,
  label,
  value,
  sub,
  accent,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  sub?: string;
  accent?: string;
}) {
  return (
    <div className="bg-white rounded-2xl p-4 sm:p-5 flex flex-col gap-2 shadow-sm border border-white/10 min-w-0">
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs text-muted-foreground font-medium">{label}</span>
        <div
          className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
          style={{ backgroundColor: accent ?? "#E8EFF8" }}
        >
          <Icon className="w-4 h-4" style={{ color: "#224D83" }} />
        </div>
      </div>
      <p className="text-xl sm:text-2xl font-bold text-foreground leading-tight">
        {value}
      </p>
      {sub && <p className="text-xs text-muted-foreground truncate">{sub}</p>}
    </div>
  );
}

export default function SummaryCards({ deliverables, gates }: Props) {
  const today = new Date();
  const daysLeft = getDaysLeft(today);
  const next = getNextKeyDate(deliverables, gates, today);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      <Card
        icon={CalendarDays}
        label="تاريخ البدء"
        value={formatDateAr(PROJECT.startDate)}
        accent="#E8EFF8"
      />
      <Card
        icon={CalendarCheck}
        label="تاريخ الانتهاء"
        value={formatDateAr(PROJECT.endDate)}
        accent="#E8EFF8"
      />
      <Card
        icon={Clock3}
        label="الأيام المتبقية"
        value={`${formatNum(daysLeft)} يوم`}
        accent="#FFF3E0"
      />
      <Card
        icon={Milestone}
        label="القادم"
        value={next ? formatDateAr(next.date) : "—"}
        sub={next?.label}
        accent="#E8F5E9"
      />
    </div>
  );
}
