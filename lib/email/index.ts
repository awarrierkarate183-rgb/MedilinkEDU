import { defaultFromAddress, httpMailerFromEnv, loadSmtpConfig } from "@/lib/email/config";
import { sendWithSmtp } from "@/lib/email/smtp";

export type TransactionalEmail = {
  to: string;
  subject: string;
  text: string;
  html?: string;
  template?:
    | "advisor_invitation"
    | "student_invitation"
    | "password_reset"
    | "registration_confirmation"
    | "competition_deadline"
    | "submission_confirmation";
};

export type EmailResult = {
  sent: boolean;
  pending: boolean;
  provider: "none" | "resend" | "sendgrid" | "brevo" | "smtp" | "configured";
  error?: string;
};

async function postJson(url: string, headers: Record<string, string>, body: unknown) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...headers },
    body: JSON.stringify(body),
  });
  if (!response.ok) {
    const detail = await response.text().catch(() => "");
    console.error("[email]", url, response.status, detail.slice(0, 300));
  }
  return response.ok;
}

async function sendWithResend(key: string, message: TransactionalEmail) {
  const from = process.env.EMAIL_FROM?.trim() || "MediLink <onboarding@resend.dev>";
  return postJson(
    "https://api.resend.com/emails",
    { Authorization: `Bearer ${key}` },
    {
      from,
      to: [message.to],
      subject: message.subject,
      text: message.text,
      html: message.html || message.text.replace(/\n/g, "<br>"),
    },
  );
}

async function sendWithSendgrid(key: string, message: TransactionalEmail) {
  const from = defaultFromAddress();
  const match = from.match(/^(.*)<([^>]+)>$/);
  return postJson(
    "https://api.sendgrid.com/v3/mail/send",
    { Authorization: `Bearer ${key}` },
    {
      personalizations: [{ to: [{ email: message.to }] }],
      from: match ? { name: match[1].trim(), email: match[2].trim() } : { email: from },
      subject: message.subject,
      content: [
        { type: "text/plain", value: message.text },
        { type: "text/html", value: message.html || message.text.replace(/\n/g, "<br>") },
      ],
    },
  );
}

async function sendWithBrevo(key: string, message: TransactionalEmail) {
  const from = defaultFromAddress();
  const match = from.match(/^(.*)<([^>]+)>$/);
  return postJson(
    "https://api.brevo.com/v3/smtp/email",
    { "api-key": key },
    {
      sender: match ? { name: match[1].trim(), email: match[2].trim() } : { email: from },
      to: [{ email: message.to }],
      subject: message.subject,
      textContent: message.text,
      htmlContent: message.html || message.text.replace(/\n/g, "<br>"),
    },
  );
}

export async function sendTransactionalEmail(message: TransactionalEmail): Promise<EmailResult> {
  if (!message.to || !message.subject) {
    return { sent: false, pending: true, provider: "none" };
  }

  const http = httpMailerFromEnv();
  if (http?.provider === "resend") {
    if (await sendWithResend(http.key, message)) {
      return { sent: true, pending: false, provider: "resend" };
    }
  }
  if (http?.provider === "sendgrid") {
    if (await sendWithSendgrid(http.key, message)) {
      return { sent: true, pending: false, provider: "sendgrid" };
    }
  }
  if (http?.provider === "brevo") {
    if (await sendWithBrevo(http.key, message)) {
      return { sent: true, pending: false, provider: "brevo" };
    }
  }

  const smtp = await loadSmtpConfig();
  if (smtp) {
    const result = await sendWithSmtp(smtp, message);
    if (result.sent) return { sent: true, pending: false, provider: "smtp" };
    console.error("[email:smtp]", result.error);
    return { sent: false, pending: true, provider: "smtp", error: result.error };
  }

  if (process.env.NODE_ENV !== "production") {
    console.info("[email:pending]", message.template ?? "generic", message.to, message.subject);
  }
  return { sent: false, pending: true, provider: http ? "configured" : "none" };
}
