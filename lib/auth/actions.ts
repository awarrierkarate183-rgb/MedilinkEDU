"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured, siteUrl } from "@/lib/env";
import { homeForRole } from "@/lib/auth/roles";

export async function signInAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "The portal is not connected to a live database yet." };
  }
  const email = String(formData.get("email") || "").trim();
  const password = String(formData.get("password") || "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  if (!supabase) return { error: "The portal is not connected yet." };

  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Those credentials did not work. Check your email and password." };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user?.id)
    .maybeSingle();
  redirect(homeForRole(profile?.role));
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase?.auth.signOut();
  redirect("/portal/login");
}

export async function requestResetAction(formData: FormData) {
  if (!isSupabaseConfigured()) {
    return { error: "The portal is not connected to a live database yet." };
  }
  const email = String(formData.get("email") || "").trim();
  if (!email) return { error: "Enter the email on your MediLink account." };
  const supabase = await createClient();
  if (!supabase) return { error: "The portal is not connected yet." };
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${siteUrl()}/portal/login`,
  });
  if (error) return { error: "We could not start a password reset. Try again." };
  return { ok: true };
}
