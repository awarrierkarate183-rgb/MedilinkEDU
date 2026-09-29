"use server";

import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";
import { createInvitation, writeAudit } from "@/lib/platform/operations";

export async function createInvitationAction(formData: FormData) {
  const { user, profile } = await requireRole(["CHAPTER_ADVISOR", "SUPER_ADMIN", "STATE_ADMIN"]);
  const supabase = await createClient();
  if (!supabase || !profile) return { error: "Your advisor account is not attached to a chapter yet." };
  const email = String(formData.get("email") || "").trim() || undefined;
  return createInvitation({
    client: supabase,
    actor: {
      id: user!.id,
      role: profile.role as "CHAPTER_ADVISOR" | "STATE_ADMIN" | "SUPER_ADMIN" | "STUDENT" | "CHAPTER_OFFICER",
      chapterId: profile.chapter_id,
      stateScope: profile.state_scope,
    },
    email,
    role: "STUDENT",
  });
}

export async function revokeInvitationAction(formData: FormData) {
  const { user, profile } = await requireRole(["CHAPTER_ADVISOR", "SUPER_ADMIN", "STATE_ADMIN"]);
  const supabase = await createClient();
  const id = String(formData.get("id") || "");
  if (!supabase || !id) return { error: "Missing invitation." };
  const { error } = await supabase
    .from("invitations")
    .update({ revoked_at: new Date().toISOString() })
    .eq("id", id)
    .eq("chapter_id", profile!.chapter_id);
  if (error) return { error: "That invitation could not be revoked." };
  await writeAudit(supabase, user!.id, "invitation.revoked", "invitation", id);
  return { ok: true };
}
