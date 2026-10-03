import { apiSuccess } from "@/lib/api/respond";
import {
  configuredSupabaseUrl,
  hasServerSecret,
  isSupabaseConfigured,
  projectRefFromKey,
  supabaseHost,
  supabasePublishableKey,
  supabaseUrl,
} from "@/lib/env";

export async function GET() {
  let supabaseReachable = false;
  if (isSupabaseConfigured()) {
    try {
      const response = await fetch(`${supabaseUrl()}/auth/v1/health`, {
        cache: "no-store",
        headers: { apikey: supabasePublishableKey() },
      });
      supabaseReachable = response.ok || response.status === 401;
    } catch {
      supabaseReachable = false;
    }
  }

  let configuredHost = "";
  try {
    configuredHost = configuredSupabaseUrl()
      ? new URL(configuredSupabaseUrl()).hostname
      : "";
  } catch {
    configuredHost = "invalid";
  }

  return apiSuccess({
    supabaseConfigured: isSupabaseConfigured(),
    serverSecretConfigured: hasServerSecret(),
    supabaseReachable,
    supabaseHost: supabaseHost(),
    configuredHost,
    urlMatchesProject: Boolean(
      projectRefFromKey() && configuredHost === `${projectRefFromKey()}.supabase.co`,
    ),
    emailProvider: "none",
  });
}
