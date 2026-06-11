"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { getMilestoneRollup, ROLLUP_COLORS, ROLLUP_LABELS } from "@/lib/status";
import { formatDateAr } from "@/lib/date";
import DeliverableRow from "./DeliverableRow";
import type { Milestone } from "@/data/campaign";

// Arabic numerals badge: ١ ٢ ٣
const AR_NUMS = ["١", "٢", "٣"];

interface Props {
  milestone: Milestone;
  defaultOpen?: boolean;
  isAdmin: boolean;
}

export default function MilestoneCard({ milestone, defaultOpen = true, isAdmin }: Props) {
  const [open, setOpen] = useState(defaultOpen);
  const rollup = getMilestoneRollup(milestone.deliverables);

  // Derived date span from deliverables
  const startDate = milestone.deliverables.reduce(
    (min, d) => (d.startDate < min ? d.startDate : min),
    milestone.deliverables[0]?.startDate ?? ""
  );
  const endDate = milestone.deliverables.reduce(
    (max, d) => (d.endDate > max ? d.endDate : max),
    milestone.deliverables[0]?.endDate ?? ""
  );

  return (
    <div className="bg-white rounded-2xl border border-border overflow-hidden shadow-sm">
      {/* Color top accent bar */}
      <div className="h-1.5 w-full" style={{ backgroundColor: milestone.color }} />

      {/* Card header (always visible) */}
      <button
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-right hover:bg-[#F9FAFB] transition-colors"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
      >
        {/* Left: chevron + count */}
        <div className="flex items-center gap-2 shrink-0">
          <ChevronDown
            className="w-4 h-4 text-muted-foreground transition-transform duration-200"
            style={{ transform: open ? "rotate(180deg)" : "rotate(0deg)" }}
          />
          <span className="text-xs text-muted-foreground">
            {new Intl.NumberFormat("ar-SA").format(milestone.deliverables.length)} مخرجات
          </span>
        </div>

        {/* Right: badge + title + status */}
        <div className="flex items-center gap-3 min-w-0">
          <div className="flex flex-col items-end gap-1 min-w-0">
            <div className="flex items-center gap-2">
              {/* Rollup dot */}
              <div
                className="w-2.5 h-2.5 rounded-full"
                style={{ backgroundColor: ROLLUP_COLORS[rollup] }}
              />
              <span className="text-[11px] font-medium" style={{ color: ROLLUP_COLORS[rollup] }}>
                {ROLLUP_LABELS[rollup]}
              </span>
            </div>
            <h3 className="text-base font-bold text-foreground truncate text-right">
              {milestone.title}
            </h3>
            {startDate && endDate && (
              <p className="text-xs text-muted-foreground">
                {formatDateAr(startDate)} — {formatDateAr(endDate)}
              </p>
            )}
          </div>

          {/* Number badge */}
          <div
            className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 text-white font-bold text-lg"
            style={{ backgroundColor: milestone.color }}
          >
            {AR_NUMS[milestone.orderIndex - 1]}
          </div>
        </div>
      </button>

      {/* Deliverables list */}
      {open && (
        <div className="px-5 pb-4">
          {milestone.subtitle && (
            <p className="text-xs text-muted-foreground text-right mb-3 pb-3 border-b border-border/60">
              {milestone.subtitle}
            </p>
          )}
          {milestone.deliverables.map((d) => (
            <DeliverableRow key={d.id} deliverable={d} isAdmin={isAdmin} />
          ))}
        </div>
      )}
    </div>
  );
}
