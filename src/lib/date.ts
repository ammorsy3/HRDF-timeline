import { differenceInCalendarDays, parseISO } from "date-fns";
import type { Deliverable, ApprovalGate } from "@/data/campaign";

export const PROJECT_START = new Date("2026-06-01");
export const PROJECT_END = new Date("2026-12-31");
export const TOTAL_DAYS =
  differenceInCalendarDays(PROJECT_END, PROJECT_START) + 1; // 214

export function getDaysLeft(today: Date = new Date()): number {
  return Math.max(0, differenceInCalendarDays(PROJECT_END, today) + 1);
}

/** Returns the left-offset % and width % for a Gantt bar */
export function getGanttPosition(
  startDate: string,
  endDate: string
): { leftPct: number; widthPct: number } {
  const start = parseISO(startDate);
  const end = parseISO(endDate);
  const leftPct =
    (differenceInCalendarDays(start, PROJECT_START) / TOTAL_DAYS) * 100;
  const widthPct =
    ((differenceInCalendarDays(end, start) + 1) / TOTAL_DAYS) * 100;
  return { leftPct, widthPct };
}

/** Today marker left % */
export function getTodayPct(today: Date = new Date()): number {
  const offset = differenceInCalendarDays(today, PROJECT_START);
  if (offset < 0) return 0;
  if (offset >= TOTAL_DAYS) return 100;
  return (offset / TOTAL_DAYS) * 100;
}

/** Arabic-Indic formatted number */
export function formatNum(n: number): string {
  return new Intl.NumberFormat("ar-SA").format(n);
}

/** Arabic Gregorian date with Arabic-Indic digits: ١ يونيو ٢٠٢٦ */
export function formatDateAr(dateStr: string): string {
  const d = parseISO(dateStr);
  return new Intl.DateTimeFormat("ar-u-nu-arab", {
    day: "numeric",
    month: "long",
    year: "numeric",
    calendar: "gregory",
  }).format(d);
}

/** Short Arabic month name: يونيو */
export function formatMonthAr(date: Date): string {
  return new Intl.DateTimeFormat("ar-u-nu-arab", {
    month: "long",
    calendar: "gregory",
  }).format(date);
}

/** Returns the next upcoming key event (deliverable end or approval gate) from today */
export function getNextKeyDate(
  deliverables: Deliverable[],
  gates: ApprovalGate[],
  today: Date = new Date()
): { label: string; date: string } | null {
  const todayStr = today.toISOString().split("T")[0];

  const events: { label: string; date: string }[] = [
    ...deliverables.map((d) => ({ label: d.title, date: d.endDate })),
    ...gates.map((g) => ({ label: g.label, date: g.date })),
  ].filter((e) => e.date >= todayStr);

  events.sort((a, b) => a.date.localeCompare(b.date));
  return events[0] ?? null;
}

/** Month columns for the timeline axis */
export function getMonthColumns(): { label: string; startDate: Date; days: number }[] {
  const months = [];
  for (let m = 5; m <= 11; m++) {
    // June (5) to December (11)
    const startDate = new Date(2026, m, 1);
    const endDate = new Date(2026, m + 1, 0); // last day of month
    const days = endDate.getDate();
    months.push({
      label: formatMonthAr(startDate),
      startDate,
      days,
    });
  }
  return months;
}
