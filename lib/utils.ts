export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export function siteUrl() {
  return process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://localhost:3000";
}

export function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}

export function formOrMailto(
  formUrl: string | undefined,
  subject: string,
  email: string,
) {
  if (formUrl && formUrl.startsWith("http")) return formUrl;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
