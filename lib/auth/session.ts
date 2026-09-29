import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/utils";
import type { AppRole } from "@/lib/constants";

export async function getSessionProfile() {
  if (!isSupabaseConfigured()) return { configured: false, user: null, profile: null };
  const supabase = await createClient();
  if (!supabase) return { configured: false, user: null, profile: null };
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { configured: true, user: null, profile: null };
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, full_name, role, chapter_id, status, grade")
    .eq("id", user.id)
    .maybeSingle();
  return { configured: true, user, profile };
}

export async function requireRole(allowed: AppRole[]) {
  const session = await getSessionProfile();
  if (!session.configured) redirect("/portal/login?setup=1");
  if (!session.user) redirect("/portal/login");
  const role = session.profile?.role as AppRole | undefined;
  if (!role || !allowed.includes(role)) redirect("/forbidden");
  return { ...session, role };
}
