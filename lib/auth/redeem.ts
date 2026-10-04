"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { redeemInvitation } from "@/lib/platform/operations";

export async function redeemInvitationAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "The portal is not connected to a live database yet." };
  }
  const token = String(formData.get("token") || "");
  const password = String(formData.get("password") || "");
  const confirmPassword = String(formData.get("confirmPassword") || "");
  if (!token || !password) {
    return { error: "Choose a password for your student account." };
  }
  if (password.length < 8) {
    return { error: "Choose a password with at least 8 characters." };
  }
  if (password !== confirmPassword) {
    return { error: "The two passwords do not match." };
  }
  const supabase = await createClient();
  if (!supabase) return { error: "The portal is not connected yet." };
  return redeemInvitation({
    userClient: supabase,
    token,
    password,
  });
}
