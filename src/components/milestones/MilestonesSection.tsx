import { type Milestone } from "@/data/campaign";
import MilestoneCard from "./MilestoneCard";

interface Props {
  milestones: Milestone[];
  isAdmin: boolean;
}

export default function MilestonesSection({ milestones, isAdmin }: Props) {
  return (
    <section className="bg-[#F4F6FA] py-8 sm:py-12 border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            المراحل والمخرجات
          </h2>
          {isAdmin && (
            <span className="text-xs font-semibold text-[#224D83] bg-[#E8EFF8] px-3 py-1.5 rounded-full">
              وضع التعديل — المدير
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5">
          {milestones.map((m) => (
            <MilestoneCard key={m.id} milestone={m} defaultOpen={true} isAdmin={isAdmin} />
          ))}
        </div>
      </div>
    </section>
  );
}
