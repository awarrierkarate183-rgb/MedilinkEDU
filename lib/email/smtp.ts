import nodemailer from "nodemailer";
import type { SmtpConfig } from "@/lib/email/config";

export async function sendWithSmtp(
  config: SmtpConfig,
  message: { to: string; subject: string; text: string; html?: string },
) {
  const transporter = nodemailer.createTransport({
    host: config.host,
    port: config.port,
    secure: config.port === 465,
    auth: { user: config.user, pass: config.pass },
    connectionTimeout: 12_000,
    greetingTimeout: 12_000,
    socketTimeout: 15_000,
  });
  const result = await transporter.sendMail({
    from: config.from,
    to: message.to,
    subject: message.subject,
    text: message.text,
    html: message.html || message.text.replace(/\n/g, "<br>"),
  });
  return Boolean(result.messageId);
}
