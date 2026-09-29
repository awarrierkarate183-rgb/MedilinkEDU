"use server";

import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import { redeemInvitation } from "@/lib/platform/operations";

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
  if (!supabase) return { error: "The portal is not connected yet." };
  const [firstName, ...rest] = name.split(" ");
  return redeemInvitation({
    userClient: supabase,
    token,
    email,
    password,
    firstName,
    lastName: rest.join(" "),
  });
}
