"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import {
  DEFAULT_EXECUTE_MODEL_VAR,
  isValidModelId,
} from "@/lib/dashboard/models";
import { setRepoVariable } from "@/lib/dashboard/github-actions";
import { isAdminEmail } from "@/lib/admin-allowlist";

export type UpdateModelResult = { ok: true } | { ok: false; error: string };

export async function updateDefaultExecuteModel(
  formData: FormData,
): Promise<UpdateModelResult> {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    return { ok: false, error: "Not authorized." };
  }
  const model = String(formData.get("model") ?? "");
  if (!isValidModelId(model)) {
    return { ok: false, error: `Unknown model: ${model || "(empty)"}` };
  }
  const result = await setRepoVariable(DEFAULT_EXECUTE_MODEL_VAR, model);
  if (!result.ok) return result;
  revalidatePath("/admin/runs");
  return { ok: true };
}
