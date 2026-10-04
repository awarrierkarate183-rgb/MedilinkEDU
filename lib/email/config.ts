import { CONTACT_EMAIL } from "@/lib/constants";
import { createAdminClient } from "@/lib/supabase/admin";

export type SmtpConfig = {
  host: string;
  port: number;
  user: string;
  pass: string;
  from: string;
};

const SETTING_KEYS = ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "email_from"] as const;

function cleanSecret(value?: string | null) {
  return (value || "").replace(/\s+/g, "").trim();
}

function firstText(...values: Array<string | undefined | null>) {
  return values.find((value) => Boolean(value && value.trim()))?.trim() || "";
}

export function defaultFromAddress(user?: string) {
  const configured = process.env.EMAIL_FROM?.trim();
  if (configured) return configured;
  const address = user || CONTACT_EMAIL;
  return `MediLink <${address}>`;
}

export function httpMailerFromEnv() {
  const resend = process.env.RESEND_API_KEY?.trim();
  if (resend) return { provider: "resend" as const, key: resend };
  const sendgrid = process.env.SENDGRID_API_KEY?.trim();
  if (sendgrid) return { provider: "sendgrid" as const, key: sendgrid };
  const brevo = firstText(process.env.BREVO_API_KEY, process.env.SENDINBLUE_API_KEY);
  if (brevo) return { provider: "brevo" as const, key: brevo };
  return null;
}

export function smtpFromEnv(): SmtpConfig | null {
  const user = firstText(process.env.SMTP_USER, process.env.GMAIL_USER);
  const pass = cleanSecret(process.env.SMTP_PASS || process.env.GMAIL_APP_PASSWORD);
  if (!user || !pass) return null;
  const host = firstText(process.env.SMTP_HOST) || (user.toLowerCase().includes("gmail.com") ? "smtp.gmail.com" : "");
  if (!host) return null;
  const port = Number(process.env.SMTP_PORT || (host === "smtp.gmail.com" ? 465 : 587));
  return {
    host,
    port: Number.isFinite(port) ? port : 465,
    user,
    pass,
    from: defaultFromAddress(user),
  };
}

export async function smtpFromSettings(): Promise<SmtpConfig | null> {
  const admin = createAdminClient();
  if (!admin) return null;
  const { data, error } = await admin.from("platform_settings").select("key, value").in("key", SETTING_KEYS);
  if (error || !data?.length) return null;
  const map = new Map(data.map((row) => [row.key, row.value]));
  const user = firstText(map.get("smtp_user"));
  const pass = cleanSecret(map.get("smtp_pass"));
  const host = firstText(map.get("smtp_host")) || (user.toLowerCase().includes("gmail.com") ? "smtp.gmail.com" : "");
  if (!user || !pass || !host) return null;
  const port = Number(map.get("smtp_port") || (host === "smtp.gmail.com" ? 465 : 587));
  return {
    host,
    port: Number.isFinite(port) ? port : 465,
    user,
    pass,
    from: firstText(map.get("email_from")) || defaultFromAddress(user),
  };
}

export async function loadSmtpConfig() {
  return smtpFromEnv() || smtpFromSettings();
}

export async function isEmailConfigured() {
  if (httpMailerFromEnv()) return true;
  return Boolean(await loadSmtpConfig());
}

export async function emailSettingsPublic() {
  const smtp = await loadSmtpConfig();
  const http = httpMailerFromEnv();
  return {
    connected: Boolean(http || smtp),
    from: smtp?.from || (http ? defaultFromAddress() : ""),
    host: smtp?.host || "",
    user: smtp?.user || "",
  };
}
