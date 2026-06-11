"use server";

import { revalidatePath } from "next/cache";
import { getSession } from "@/lib/session";
import { getOverrides, saveOverrides } from "@/lib/github";
import type { DeliverableStatus } from "@/types";

function guardAdmin() {
  // Session checked server-side — returns a promise, called in each action
}

export async function updateDeliverableStatus(
  id: string,
  status: DeliverableStatus
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session.isLoggedIn || session.role !== "admin") {
    return { ok: false, error: "غير مصرح" };
  }

  try {
    const overrides = await getOverrides();
    overrides[id] = { ...(overrides[id] ?? {}), status };
    await saveOverrides(overrides);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}

export async function updateDeliverableDriveUrl(
  id: string,
  driveUrl: string | null
): Promise<{ ok: boolean; error?: string }> {
  const session = await getSession();
  if (!session.isLoggedIn || session.role !== "admin") {
    return { ok: false, error: "غير مصرح" };
  }

  // Validate URL
  if (driveUrl && !driveUrl.startsWith("https://")) {
    return { ok: false, error: "الرابط يجب أن يبدأ بـ https://" };
  }

  try {
    const overrides = await getOverrides();
    overrides[id] = { ...(overrides[id] ?? {}), driveUrl: driveUrl ?? null };
    await saveOverrides(overrides);
    revalidatePath("/");
    return { ok: true };
  } catch (e) {
    return { ok: false, error: String(e) };
  }
}
