"use server";

import { revalidatePath } from "next/cache";

import { auth } from "@/auth";
import { isAdminEmail } from "@/lib/admin-allowlist";
import {
  setRepoVariable,
  deleteRepoVariable,
} from "@/lib/dashboard/github-actions";
import {
  DEFAULT_EXECUTE_MODEL_VAR,
  NEXT_RUN_OVERRIDE_VAR,
  isValidModelId,
} from "@/lib/dashboard/models";

export type UpdateModelResult = { ok: true } | { ok: false; error: string };

async function gate(): Promise<{ ok: true } | UpdateModelResult> {
  const session = await auth();
  if (!isAdminEmail(session?.user?.email)) {
    return { ok: false, error: "Not authorized." };
  }
  return { ok: true };
}

export async function updateDefaultExecuteModel(
  formData: FormData,
): Promise<UpdateModelResult> {
  const auth = await gate();
  if (!auth.ok) return auth;
  const model = String(formData.get("model") ?? "");
  if (!isValidModelId(model)) {
    return { ok: false, error: `Unknown model: ${model || "(empty)"}` };
  }
  const result = await setRepoVariable(DEFAULT_EXECUTE_MODEL_VAR, model);
  if (!result.ok) return result;
  revalidatePath("/admin/runs");
  revalidatePath("/admin/brain");
  return { ok: true };
}

export async function setNextRunOverrideAction(
  formData: FormData,
): Promise<UpdateModelResult> {
  const auth = await gate();
  if (!auth.ok) return auth;
  const model = String(formData.get("model") ?? "");
  if (!model) {
    return { ok: false, error: "Pick a model or use Clear instead." };
  }
  if (!isValidModelId(model)) {
    return { ok: false, error: `Unknown model: ${model}` };
  }
  const result = await setRepoVariable(NEXT_RUN_OVERRIDE_VAR, model);
  if (!result.ok) return result;
  revalidatePath("/admin/brain");
  return { ok: true };
}

export async function clearNextRunOverrideAction(): Promise<UpdateModelResult> {
  const auth = await gate();
  if (!auth.ok) return auth;
  const result = await deleteRepoVariable(NEXT_RUN_OVERRIDE_VAR);
  if (!result.ok) return result;
  revalidatePath("/admin/brain");
  return { ok: true };
}
