"use server";

import { createHash } from "crypto";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

export async function redeemInvitationAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "The portal is not connected to a live database yet." };
  }
  const token = String(formData.get("token") || "");
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  const name = String(formData.get("name") || "").trim();
  if (!token || !email || !password || !name) {
    return { error: "Fill in your name, email, and password." };
  }
  const supabase = await createClient();
  const admin = createAdminClient();
  const lookup = admin ?? supabase;
  if (!lookup) return { error: "The portal is not connected yet." };

  const { data: invite, error: inviteError } = await lookup
    .from("invitations")
    .select("id, chapter_id, intended_role, expires_at, revoked_at, used_at, max_uses, use_count")
    .eq("token_hash", hashToken(token))
    .maybeSingle();

  if (inviteError || !invite) return { error: "That invitation is not valid." };
  if (invite.revoked_at) return { error: "That invitation was revoked." };
  if (invite.used_at || invite.use_count >= invite.max_uses) {
    return { error: "That invitation has already been used." };
  }
  if (new Date(invite.expires_at).getTime() < Date.now()) {
    return { error: "That invitation has expired." };
  }

  if (!supabase) return { error: "The portal is not connected yet." };
  const { data: signed, error: signError } = await supabase.auth.signUp({ email, password });
  if (signError || !signed.user) {
    return { error: "The account could not be created. That email may already be in use." };
  }

  const writer = admin ?? supabase;
  const { error: profileError } = await writer.from("profiles").upsert({
    id: signed.user.id,
    full_name: name,
    role: invite.intended_role,
    chapter_id: invite.chapter_id,
    status: "PENDING",
  });
  if (profileError) return { error: "Your account was created but the chapter profile could not be attached." };

  await writer.from("chapter_members").insert({
    chapter_id: invite.chapter_id,
    profile_id: signed.user.id,
    status: "PENDING",
  });
  await writer
    .from("invitations")
    .update({
      used_at: new Date().toISOString(),
      use_count: invite.use_count + 1,
    })
    .eq("id", invite.id);

  return { ok: true };
}
