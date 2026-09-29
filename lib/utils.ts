export function cn(...parts: Array<string | false | null | undefined>) {
  return parts.filter(Boolean).join(" ");
}

export { siteUrl, isSupabaseConfigured } from "@/lib/env";

export function formOrMailto(
  formUrl: string | undefined,
  subject: string,
  email: string,
) {
  if (formUrl && formUrl.startsWith("http")) return formUrl;
  return `mailto:${email}?subject=${encodeURIComponent(subject)}`;
}
