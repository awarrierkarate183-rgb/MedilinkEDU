function firstDefined(...values: Array<string | undefined>) {
  return values.find((value) => Boolean(value && value.trim()))?.trim() || "";
}

function preferJwt(...values: Array<string | undefined>) {
  const cleaned = values.map((value) => value?.trim()).filter(Boolean) as string[];
  return cleaned.find((value) => value.startsWith("eyJ")) || cleaned[0] || "";
}

export function supabaseUrl() {
  return firstDefined(process.env.NEXT_PUBLIC_SUPABASE_URL);
}

export function supabasePublishableKey() {
  return preferJwt(
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
  );
}

export function supabaseSecretKey() {
  return preferJwt(
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    process.env.SUPABASE_SECRET_KEY,
  );
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl() && supabasePublishableKey());
}

export function hasServerSecret() {
  return Boolean(supabaseUrl() && supabaseSecretKey());
}

export function siteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    "http://localhost:3000"
  );
}
