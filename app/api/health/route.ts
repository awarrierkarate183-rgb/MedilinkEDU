import { apiSuccess, errors } from "@/lib/api/respond";
import { isSupabaseConfigured, hasServerSecret } from "@/lib/env";

export async function GET() {
  return apiSuccess({
    supabaseConfigured: isSupabaseConfigured(),
    serverSecretConfigured: hasServerSecret(),
    emailProvider: "none",
  });
}
