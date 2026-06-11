"use client";

import { useRef, useState } from "react";
import { APPROVAL_GATES, type Milestone } from "@/data/campaign";
import { getMonthColumns, getTodayPct, getGanttPosition, formatDateAr, formatNum } from "@/lib/date";
import { STATUS_COLORS, getMilestoneRollup, ROLLUP_COLORS, ROLLUP_LABELS } from "@/lib/status";
import TimelineLegend from "./TimelineLegend";

const LANE_LABEL_W = 120; // px — sticky label column width
const TRACK_MIN_W = 3000; // px — minimum scrollable track width
const ROW_H = 44; // px per stacked row (bar 36px + 8px gap)
const LANE_PAD = 8; // px top/bottom padding inside a lane

function assignRows(deliverables: Milestone["deliverables"]): Map<string, number> {
  const rowMap = new Map<string, number>();
  const rowEnds: number[] = [];
  for (const d of deliverables) {
    const { leftPct, widthPct } = getGanttPosition(d.startDate, d.endDate);
    const end = leftPct + widthPct;
    let placed = false;
    for (let r = 0; r < rowEnds.length; r++) {
      if (leftPct >= rowEnds[r] - 0.5) {
        rowMap.set(d.id, r);
        rowEnds[r] = end;
        placed = true;
        break;
      }
    }
    if (!placed) {
      rowMap.set(d.id, rowEnds.length);
      rowEnds.push(end);
    }
  }
  return rowMap;
}

interface Props {
  milestones: Milestone[];
}

export default function Timeline({ milestones }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeMonth, setActiveMonth] = useState(0);
  const months = getMonthColumns();
  const todayPct = getTodayPct();

  function jumpToMonth(idx: number) {
    setActiveMonth(idx);
    if (!scrollRef.current) return;
    const monthOffset = months
      .slice(0, idx)
      .reduce((acc, m) => acc + (m.days / 214) * TRACK_MIN_W, 0);
    scrollRef.current.scrollTo({ left: monthOffset, behavior: "smooth" });
  }

  return (
    <section className="bg-white py-8 sm:py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        {/* Section heading */}
        <h2 className="text-xl sm:text-2xl font-bold text-foreground mb-6 text-right">
          الخط الزمني الكامل
        </h2>

        {/* Month-tab quick-jump (mobile-first) */}
        <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-hide">
          {months.map((m, i) => (
            <button
              key={m.label}
              onClick={() => jumpToMonth(i)}
              className={`shrink-0 text-xs font-medium px-3 py-1.5 rounded-full transition
                ${activeMonth === i
                  ? "bg-[#224D83] text-white"
                  : "bg-[#E8EFF8] text-[#224D83] hover:bg-[#224D83]/10"
                }`}
            >
              {m.label}
            </button>
          ))}
        </div>

        {/* Scrollable Gantt — LTR island */}
        <div
          ref={scrollRef}
          className="overflow-x-auto timeline-scroll rounded-2xl border border-border"
          style={{ direction: "ltr" }}
        >
          <div style={{ minWidth: TRACK_MIN_W + LANE_LABEL_W }}>
            {/* Month axis header */}
            <div
              className="flex border-b border-border bg-[#F4F6FA]"
              style={{ paddingInlineStart: LANE_LABEL_W }}
            >
              {months.map((m) => {
                const widthPct = (m.days / 214) * 100;
                return (
                  <div
                    key={m.label}
                    className="shrink-0 border-r border-border/50 py-2 px-2 text-center"
                    style={{ width: `${widthPct}%`, minWidth: TRACK_MIN_W * (m.days / 214) }}
                  >
                    <span
                      className="text-xs font-semibold text-muted-foreground"
                      style={{ direction: "rtl" }}
                    >
                      {m.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Approval gates row */}
            <div
              className="relative h-10 border-b border-border bg-[#F9FAFB]"
              style={{ marginInlineStart: LANE_LABEL_W }}
            >
              {APPROVAL_GATES.map((gate) => {
                const { leftPct } = getGanttPosition(gate.date, gate.date);
                return (
                  <div
                    key={gate.id}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center"
                    style={{ left: `${leftPct}%` }}
                  >
                    {/* Diamond */}
                    <div
                      className="w-4 h-4 rotate-45 border-2 border-[#224D83] bg-white"
                      title={`${gate.label} — ${formatDateAr(gate.date)}`}
                    />
                  </div>
                );
              })}
              {/* Label for gates */}
              <span
                className="absolute right-2 top-1/2 -translate-y-1/2 text-[10px] text-muted-foreground font-medium"
                style={{ direction: "rtl" }}
              >
                اعتماد الصندوق
              </span>
            </div>

            {/* Milestone lanes */}
            {milestones.map((milestone, mi) => {
              const rowMap = assignRows(milestone.deliverables);
              const numRows = Math.max(1, ...Array.from(rowMap.values()).map((r) => r + 1));
              const laneH = numRows * ROW_H + LANE_PAD * 2;
              return (
                <div
                  key={milestone.id}
                  className={`relative flex border-b border-border last:border-0 ${mi % 2 === 0 ? "bg-white" : "bg-[#F9FAFB]"}`}
                >
                  {/* Sticky lane label */}
                  <div
                    className="sticky left-0 z-10 shrink-0 flex items-center px-3 border-r border-border"
                    style={{
                      width: LANE_LABEL_W,
                      height: laneH,
                      backgroundColor: mi % 2 === 0 ? "#ffffff" : "#F9FAFB",
                    }}
                  >
                    <div className="flex flex-col gap-1" style={{ direction: "rtl" }}>
                      <span className="text-[11px] font-bold leading-tight" style={{ color: milestone.color }}>
                        {formatNum(milestone.orderIndex)}. {milestone.title}
                      </span>
                      <div className="flex items-center gap-1">
                        <div
                          className="w-2 h-2 rounded-full shrink-0"
                          style={{ backgroundColor: ROLLUP_COLORS[getMilestoneRollup(milestone.deliverables)] }}
                        />
                        <span className="text-[9px] text-muted-foreground leading-none">
                          {ROLLUP_LABELS[getMilestoneRollup(milestone.deliverables)]}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Track */}
                  <div className="relative flex-1" style={{ minWidth: TRACK_MIN_W, height: laneH }}>
                    {/* Today line */}
                    {todayPct >= 0 && todayPct <= 100 && (
                      <div
                        className="absolute top-0 bottom-0 w-px bg-red-400/60 z-10 pointer-events-none"
                        style={{ left: `${todayPct}%` }}
                      />
                    )}

                    {/* Deliverable bars */}
                    {milestone.deliverables.map((d) => {
                      const { leftPct, widthPct } = getGanttPosition(d.startDate, d.endDate);
                      const row = rowMap.get(d.id) ?? 0;
                      const topPx = LANE_PAD + row * ROW_H;
                      const color = milestone.color;
                      const isDone = d.status === "done";
                      // For bars near/at the track end: anchor with both left+right so the bar
                      // fills its full date span AND the label doesn't overflow the boundary.
                      const rightPct = Math.max(0, 100 - leftPct - widthPct);
                      const nearEnd = rightPct < 10;
                      return (
                        <div
                          key={d.id}
                          className="group absolute h-9 rounded-lg flex items-center px-2"
                          style={{
                            ...(nearEnd
                              ? { left: `${leftPct}%`, right: `${rightPct}%` }
                              : { left: `${leftPct}%`, width: `${widthPct}%` }),
                            minWidth: "max-content",
                            top: topPx,
                            backgroundColor: isDone ? color : `${color}33`,
                            border: `1.5px solid ${color}`,
                          }}
                          title={d.title}
                        >
                          {/* Date tooltip */}
                          <div
                            className="absolute bottom-full mb-1.5 px-2 py-1 bg-gray-900/90 text-white text-[10px] rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-30 pointer-events-none"
                            style={{ direction: "rtl", [nearEnd ? "right" : "left"]: 0 }}
                          >
                            {formatDateAr(d.startDate)} — {formatDateAr(d.endDate)}
                          </div>
                          <span
                            className="text-[10px] font-semibold whitespace-nowrap leading-none"
                            style={{
                              color: isDone ? "#fff" : color,
                              direction: "rtl",
                            }}
                          >
                            {isDone && "✓ "}{d.title}
                          </span>

                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}

            {/* Today marker label at bottom */}
            <div
              className="relative h-6 bg-[#F4F6FA]"
              style={{ marginInlineStart: LANE_LABEL_W }}
            >
              {todayPct >= 0 && todayPct <= 100 && (
                <div
                  className="absolute -translate-x-1/2 flex items-center gap-0.5"
                  style={{ left: `${todayPct}%`, top: 4 }}
                >
                  <div className="w-px h-2 bg-red-400" />
                  <span
                    className="text-[9px] text-red-500 font-semibold whitespace-nowrap"
                    style={{ direction: "rtl" }}
                  >
                    اليوم
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Hint for mobile */}
        <p className="text-xs text-muted-foreground text-center mt-3 sm:hidden">
          اسحب يميناً أو يساراً لعرض الجدول الزمني
        </p>

        <TimelineLegend />
      </div>
    </section>
  );
}
