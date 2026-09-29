import { createClient } from "@supabase/supabase-js";
import { hasServerSecret, supabaseSecretKey, supabaseUrl } from "@/lib/env";

export function createAdminClient() {
  if (!hasServerSecret()) return null;
  return createClient(supabaseUrl(), supabaseSecretKey(), {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}
