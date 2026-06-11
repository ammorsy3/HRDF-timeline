"use client";

import { useState, useTransition } from "react";
import { Check, Loader2, X } from "lucide-react";
import { toast } from "sonner";
import { updateDeliverableStatus, updateDeliverableDriveUrl } from "@/actions/updateDeliverable";
import { ALL_STATUSES, STATUS_LABELS } from "@/lib/status";
import type { DeliverableStatus } from "@/types";

interface Props {
  id: string;
  currentStatus: DeliverableStatus;
  currentDriveUrl: string | null;
}

export default function AdminControls({ id, currentStatus, currentDriveUrl }: Props) {
  const [isPending, startTransition] = useTransition();
  const [urlInput, setUrlInput] = useState(currentDriveUrl ?? "");
  const [showUrlInput, setShowUrlInput] = useState(false);

  function handleStatusChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const status = e.target.value as DeliverableStatus;
    startTransition(async () => {
      const res = await updateDeliverableStatus(id, status);
      if (res.ok) toast.success("تم تحديث الحالة");
      else toast.error(res.error ?? "حدث خطأ");
    });
  }

  function handleSaveUrl() {
    startTransition(async () => {
      const url = urlInput.trim() || null;
      const res = await updateDeliverableDriveUrl(id, url);
      if (res.ok) {
        toast.success(url ? "تم إضافة الرابط" : "تم حذف الرابط");
        setShowUrlInput(false);
      } else {
        toast.error(res.error ?? "حدث خطأ");
      }
    });
  }

  return (
    <div className="mt-2 flex flex-col gap-2 pt-2 border-t border-dashed border-border">
      {/* Status selector */}
      <div className="flex items-center gap-2">
        <span className="text-[11px] text-muted-foreground shrink-0">الحالة:</span>
        <select
          defaultValue={currentStatus}
          onChange={handleStatusChange}
          disabled={isPending}
          className="flex-1 text-xs rounded-lg border border-border px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#224D83] disabled:opacity-50"
        >
          {ALL_STATUSES.map((s) => (
            <option key={s} value={s}>
              {STATUS_LABELS[s]}
            </option>
          ))}
        </select>
        {isPending && <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />}
      </div>

      {/* Drive URL */}
      {showUrlInput ? (
        <div className="flex items-center gap-1.5">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://drive.google.com/..."
            className="flex-1 text-xs rounded-lg border border-border px-2 py-1.5 bg-white focus:outline-none focus:ring-1 focus:ring-[#224D83] min-w-0"
            dir="ltr"
            autoFocus
          />
          <button
            onClick={handleSaveUrl}
            disabled={isPending}
            className="shrink-0 p-1.5 rounded-lg bg-[#224D83] text-white hover:bg-[#1A3C66] disabled:opacity-50"
          >
            <Check className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => { setShowUrlInput(false); setUrlInput(currentDriveUrl ?? ""); }}
            className="shrink-0 p-1.5 rounded-lg bg-slate-100 text-muted-foreground hover:bg-slate-200"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ) : (
        <button
          onClick={() => setShowUrlInput(true)}
          className="text-[11px] text-[#224D83] hover:underline text-right"
        >
          {currentDriveUrl ? "✏️ تعديل رابط Drive" : "+ إضافة رابط Drive"}
        </button>
      )}
    </div>
  );
}
