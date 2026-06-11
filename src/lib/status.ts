import type { DeliverableStatus } from "@/types";
import type { Deliverable } from "@/data/campaign";

export const STATUS_LABELS: Record<DeliverableStatus, string> = {
  not_started: "لم تبدأ",
  in_progress: "قيد التنفيذ",
  awaiting_approval: "بانتظار اعتماد الصندوق",
  done: "مكتملة",
};

export const STATUS_COLORS: Record<DeliverableStatus, string> = {
  not_started: "#94A3B8",
  in_progress: "#224D83",
  awaiting_approval: "#E08A2C",
  done: "#4FA45C",
};

export const STATUS_BG: Record<DeliverableStatus, string> = {
  not_started: "bg-slate-100 text-slate-500",
  in_progress: "bg-blue-100 text-blue-700",
  awaiting_approval: "bg-orange-100 text-orange-700",
  done: "bg-green-100 text-green-700",
};

export type RollupStatus = "not_started" | "in_progress" | "done";

export function getMilestoneRollup(deliverables: Deliverable[]): RollupStatus {
  if (!deliverables.length) return "not_started";
  if (deliverables.every((d) => d.status === "done")) return "done";
  if (deliverables.some((d) => d.status !== "not_started")) return "in_progress";
  return "not_started";
}

export const ROLLUP_COLORS: Record<RollupStatus, string> = {
  not_started: "#94A3B8",
  in_progress: "#224D83",
  done: "#4FA45C",
};

export const ROLLUP_LABELS: Record<RollupStatus, string> = {
  not_started: "لم تبدأ",
  in_progress: "جارٍ التنفيذ",
  done: "مكتملة",
};

export const ALL_STATUSES: DeliverableStatus[] = [
  "not_started",
  "in_progress",
  "awaiting_approval",
  "done",
];
