function firstDefined(...values: Array<string | undefined>) {
  return values.find((value) => Boolean(value && value.trim()))?.trim() || "";
}

function preferJwt(...values: Array<string | undefined>) {
  const cleaned = values.map((value) => value?.trim()).filter(Boolean) as string[];
  return cleaned.find((value) => value.startsWith("eyJ")) || cleaned[0] || "";
}

function decodeJwtPayload(token: string): { ref?: string } | null {
  if (!token.startsWith("eyJ")) return null;
  try {
    const payload = token.split(".")[1];
    if (!payload) return null;
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    const json =
      typeof atob === "function"
        ? atob(padded)
        : Buffer.from(padded, "base64").toString("utf8");
    return JSON.parse(json) as { ref?: string };
  } catch {
    return null;
  }
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

export function projectRefFromKey() {
  return decodeJwtPayload(supabasePublishableKey())?.ref?.trim() || "";
}

export function configuredSupabaseUrl() {
  return firstDefined(process.env.NEXT_PUBLIC_SUPABASE_URL).replace(/\/$/, "");
}

export function supabaseUrl() {
  const configured = configuredSupabaseUrl();
  const ref = projectRefFromKey();
  if (ref) {
    const expected = `https://${ref}.supabase.co`;
    if (!configured) return expected;
    try {
      const host = new URL(configured).hostname.toLowerCase();
      if (host !== `${ref}.supabase.co`) return expected;
    } catch {
      return expected;
    }
    return configured;
  }
  return configured;
}

export function supabaseHost() {
  try {
    return supabaseUrl() ? new URL(supabaseUrl()).hostname : "";
  } catch {
    return "";
  }
}

export function isSupabaseConfigured() {
  return Boolean(supabaseUrl() && supabasePublishableKey());
}

export function hasServerSecret() {
  return Boolean(supabaseUrl() && supabaseSecretKey());
}

export function siteUrl() {
  const configured = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "";
  const onVercel = Boolean(process.env.VERCEL);
  if (configured && !(onVercel && /localhost|127\.0\.0\.1/i.test(configured))) {
    return configured;
  }
  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL.replace(/\/$/, "")}`;
  }
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }
  return configured || "http://localhost:3000";
}
