import { MILESTONES, APPROVAL_GATES } from "@/data/campaign";
import { getOverrides } from "@/lib/github";
import { getSession } from "@/lib/session";
import ProjectHeader from "@/components/header/ProjectHeader";
import Timeline from "@/components/timeline/Timeline";
import MilestonesSection from "@/components/milestones/MilestonesSection";
import type { DeliverableStatus } from "@/types";

export default async function HomePage() {
  const [session, overrides] = await Promise.all([
    getSession(),
    getOverrides(),
  ]);

  const isAdmin = session.role === "admin";

  // Merge static campaign data with dynamic overrides from GitHub
  const mergedMilestones = MILESTONES.map((m) => ({
    ...m,
    deliverables: m.deliverables.map((d) => {
      const ov = overrides[d.id];
      return {
        ...d,
        status: (ov?.status as DeliverableStatus | undefined) ?? d.status,
        driveUrl: ov?.driveUrl !== undefined ? ov.driveUrl : d.driveUrl,
      };
    }),
  }));

  const allDeliverables = mergedMilestones.flatMap((m) => m.deliverables);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <ProjectHeader deliverables={allDeliverables} gates={APPROVAL_GATES} />
      <Timeline milestones={mergedMilestones} />
      <MilestonesSection milestones={mergedMilestones} isAdmin={isAdmin} />
      <footer className="mt-auto py-6 bg-[#1A3C66] text-white/50 text-xs text-center">
        صندوق تنمية الموارد البشرية — هدف &nbsp;|&nbsp; وثيقة خاصة &nbsp;|&nbsp; © 2026 Seet Marketing Solutions
      </footer>
    </div>
  );
}
