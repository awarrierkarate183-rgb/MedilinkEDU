import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/env";
import type { AppRole } from "@/lib/constants";
import type { Actor } from "@/lib/auth/roles";

export type SessionActor = {
  configured: boolean;
  user: { id: string; email?: string } | null;
  actor: Actor | null;
  supabase: Awaited<ReturnType<typeof createClient>>;
};

export async function getRequestActor(): Promise<SessionActor> {
  if (!isSupabaseConfigured()) {
    return { configured: false, user: null, actor: null, supabase: null };
  }
  const supabase = await createClient();
  if (!supabase) return { configured: false, user: null, actor: null, supabase: null };

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { configured: true, user: null, actor: null, supabase };

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, role, chapter_id, state_scope")
    .eq("id", user.id)
    .maybeSingle();

  if (!profile) return { configured: true, user, actor: null, supabase };

  return {
    configured: true,
    user: { id: user.id, email: user.email },
    actor: {
      id: user.id,
      role: profile.role as AppRole,
      chapterId: profile.chapter_id,
      stateScope: profile.state_scope,
    },
    supabase,
  };
}
