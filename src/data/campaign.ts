// ─────────────────────────────────────────────────────────────────────────────
// HRDF Campaign Data — single source of truth
// To update: edit this file on GitHub → Netlify auto-deploys in ~60 seconds.
// ─────────────────────────────────────────────────────────────────────────────

import type { DeliverableStatus } from "@/types";

export interface Deliverable {
  id: string;
  title: string;
  startDate: string; // YYYY-MM-DD
  endDate: string;   // YYYY-MM-DD
  status: DeliverableStatus;
  driveUrl: string | null; // paste a public Google Drive link here, or null
}

export interface Milestone {
  id: string;
  orderIndex: number;
  title: string;
  subtitle: string;
  color: string;         // Gantt lane color
  deliverables: Deliverable[];
}

export interface ApprovalGate {
  id: string;
  label: string;
  date: string; // YYYY-MM-DD
}

// ── PROJECT ──────────────────────────────────────────────────────────────────

export const PROJECT = {
  title: "الخط الزمني لتنفيذ الحملة الإبداعية لتدشين منصة الإرشاد المهني",
  client: "صندوق تنمية الموارد البشرية - هدف",
  agency: "Seet Marketing Solutions",
  startDate: "2026-06-01",
  endDate: "2026-12-31",
} as const;

// ── APPROVAL GATES (timeline diamonds) ───────────────────────────────────────

export const APPROVAL_GATES: ApprovalGate[] = [
  { id: "gate-1", label: "اعتماد الصندوق", date: "2026-06-30" },
  { id: "gate-2", label: "اعتماد الصندوق", date: "2026-08-06" },
  { id: "gate-3", label: "اعتماد الصندوق", date: "2026-08-20" },
];

// ── MILESTONES & DELIVERABLES ─────────────────────────────────────────────────
// Status options: "not_started" | "in_progress" | "awaiting_approval" | "done"
// driveUrl: paste the public Google Drive share link, or set to null

export const MILESTONES: Milestone[] = [
  {
    id: "milestone-1",
    orderIndex: 1,
    title: "الإنتاج الإبداعي لمواد الحملة",
    subtitle: "بناء الهوية والمحتوى الإبداعي للحملة",
    color: "#224D83",
    deliverables: [
      {
        id: "d-1-1",
        title: "ملف التوجهات الإبداعية",
        startDate: "2026-06-01",
        endDate: "2026-06-23",
        status: "not_started",
        driveUrl: null,
      },
      {
        id: "d-1-2",
        title: "إنتاج الفيديو الرئيسي للحملة",
        startDate: "2026-07-01",
        endDate: "2026-07-30",
        status: "not_started",
        driveUrl: null,
      },
      {
        id: "d-1-3",
        title: "إنتاج المواد الداعمة للحملة",
        startDate: "2026-07-01",
        endDate: "2026-07-30",
        status: "not_started",
        driveUrl: null,
      },
    ],
  },
  {
    id: "milestone-2",
    orderIndex: 2,
    title: "المؤثرون",
    subtitle: "اختيار المؤثرين والنشر والتقارير",
    color: "#6D5BD0",
    deliverables: [
      {
        id: "d-2-1",
        title: "ملف قائمة المؤثرين المقترحين",
        startDate: "2026-06-01",
        endDate: "2026-06-23",
        status: "not_started",
        driveUrl: null,
      },
      {
        id: "d-2-2",
        title: "الملف المعتمد للأسماء ومواعيد النشر",
        startDate: "2026-07-01",
        endDate: "2026-07-30",
        status: "not_started",
        driveUrl: null,
      },
      {
        id: "d-2-3",
        title: "التقرير النهائي لأداء إعلانات المؤثرين",
        startDate: "2026-12-21",
        endDate: "2026-12-31",
        status: "not_started",
        driveUrl: null,
      },
    ],
  },
  {
    id: "milestone-3",
    orderIndex: 3,
    title: "الترويج عبر الحملات الممولة",
    subtitle: "خطة الترويج والتقرير الختامي للحملة",
    color: "#4FA45C",
    deliverables: [
      {
        id: "d-3-1",
        title: "ملف خطة الترويج وآلية الاعتمادات",
        startDate: "2026-08-02",
        endDate: "2026-08-13",
        status: "not_started",
        driveUrl: null,
      },
      {
        id: "d-3-2",
        title: "التقرير النهائي للحملة",
        startDate: "2026-12-21",
        endDate: "2026-12-31",
        status: "not_started",
        driveUrl: null,
      },
    ],
  },
];
