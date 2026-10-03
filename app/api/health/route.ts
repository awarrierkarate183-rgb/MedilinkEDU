import { apiSuccess } from "@/lib/api/respond";
import { hasServerSecret, isSupabaseConfigured, supabaseUrl } from "@/lib/env";

export async function GET() {
  let supabaseReachable = false;
  if (isSupabaseConfigured()) {
    try {
      const response = await fetch(`${supabaseUrl()}/auth/v1/health`, {
        cache: "no-store",
      });
      supabaseReachable = response.ok;
    } catch {
      supabaseReachable = false;
    }
  }

  return apiSuccess({
    supabaseConfigured: isSupabaseConfigured(),
    serverSecretConfigured: hasServerSecret(),
    supabaseReachable,
    emailProvider: "none",
  });
}
