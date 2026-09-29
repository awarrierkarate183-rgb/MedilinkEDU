"use server";

import { randomBytes, createHash } from "crypto";
import { createClient } from "@/lib/supabase/server";
import { requireRole } from "@/lib/auth/session";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function createInvitationAction(formData: FormData) {
  const { user, profile } = await requireRole(["CHAPTER_ADVISOR", "SUPER_ADMIN", "STATE_ADMIN"]);
  const supabase = await createClient();
  if (!supabase || !profile?.chapter_id) {
    return { error: "Your advisor account is not attached to a chapter yet." };
  }
  const email = String(formData.get("email") || "").trim() || null;
  const token = randomBytes(24).toString("base64url");
  const expires = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString();
  const { error } = await supabase.from("invitations").insert({
    chapter_id: profile.chapter_id,
    created_by: user!.id,
    intended_role: "STUDENT",
    email,
    token_hash: hashToken(token),
    expires_at: expires,
    max_uses: 1,
  });
  if (error) return { error: "The invitation could not be created." };
  await supabase.from("audit_logs").insert({
    actor_id: user!.id,
    action: "invitation.created",
    target: profile.chapter_id,
  });
  return { token, expires };
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
  await supabase.from("audit_logs").insert({
    actor_id: user!.id,
    action: "invitation.revoked",
    target: id,
  });
  return { ok: true };
}
