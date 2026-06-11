import Image from "next/image";
import { PROJECT } from "@/data/campaign";
import SummaryCards from "./SummaryCards";
import type { Deliverable, ApprovalGate } from "@/data/campaign";

interface Props {
  deliverables: Deliverable[];
  gates: ApprovalGate[];
}

export default function ProjectHeader({ deliverables, gates }: Props) {
  return (
    <header className="bg-[#1A3C66] text-white">
      {/* Top bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <Image
          src="/images/hrdf-logo.png"
          alt="صندوق تنمية الموارد البشرية"
          width={140}
          height={56}
          className="object-contain"
          priority
        />
        <span className="text-xs text-white/60 font-medium tracking-wide">
          خطة التنفيذ — 2026
        </span>
      </div>

      {/* Title block */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8 pt-2 flex flex-col items-start gap-2">
        <p className="text-sm text-white/60 w-full text-right">{PROJECT.client}</p>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-right leading-snug w-full">
          {PROJECT.title}
        </h1>
      </div>

      {/* Summary cards — extends below the blue band */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pb-8">
        <SummaryCards deliverables={deliverables} gates={gates} />
      </div>
    </header>
  );
}
