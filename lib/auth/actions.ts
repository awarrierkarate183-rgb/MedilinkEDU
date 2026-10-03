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

  try {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      if (/invalid login credentials|invalid_credentials/i.test(error.message)) {
        return { error: "That email or password did not match a MediLink account." };
      }
      if (/email not confirmed/i.test(error.message)) {
        return { error: "Confirm this email in Supabase Auth before signing in." };
      }
      return { error: error.message };
    }
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : "";
    if (/fetch|network|enotfound|getaddrinfo/i.test(message)) {
      return {
        error:
          "The site could not reach the MediLink database. Check NEXT_PUBLIC_SUPABASE_URL and redeploy.",
      };
    }
    return {
      error: message || "Vercel could not reach Supabase. Check NEXT_PUBLIC_SUPABASE_URL.",
    };
  }

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
