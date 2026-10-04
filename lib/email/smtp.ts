import nodemailer from "nodemailer";
import type { SmtpConfig } from "@/lib/email/config";

function smtpErrorMessage(error: unknown) {
  if (!(error instanceof Error)) return "Gmail did not accept the message.";
  const text = error.message.replace(/\s+/g, " ").trim();
  if (/invalid login|badcredentials|eauth|username and password/i.test(text)) {
    return "Gmail rejected the App password. Create a new App password and connect it again.";
  }
  if (/timeout|etimedout|econn|socket/i.test(text)) {
    return "Gmail could not be reached. Try sending the invite again.";
  }
  return text.slice(0, 180) || "Gmail did not accept the message.";
}

export async function sendWithSmtp(
  config: SmtpConfig,
  message: { to: string; subject: string; text: string; html?: string },
) {
  const attempts = [
    { port: config.port, secure: config.port === 465 },
    { port: 587, secure: false },
  ].filter((attempt, index, list) => list.findIndex((item) => item.port === attempt.port) === index);

  let lastError = "Gmail did not accept the message.";
  for (const attempt of attempts) {
    try {
      const transporter = nodemailer.createTransport({
        host: config.host,
        port: attempt.port,
        secure: attempt.secure,
        requireTLS: attempt.port === 587,
        auth: { user: config.user, pass: config.pass },
        connectionTimeout: 12_000,
        greetingTimeout: 12_000,
        socketTimeout: 15_000,
      });
      const result = await transporter.sendMail({
        from: config.from,
        replyTo: config.user,
        to: message.to,
        subject: message.subject,
        text: message.text,
        html: message.html || message.text.replace(/\n/g, "<br>"),
        envelope: { from: config.user, to: message.to },
      });
      if (result.rejected?.length && !result.accepted?.length) {
        return { sent: false, error: `Gmail rejected ${message.to}.` };
      }
      if (result.messageId) return { sent: true };
      lastError = "Gmail did not confirm the message.";
    } catch (error) {
      lastError = smtpErrorMessage(error);
    }
  }
  return { sent: false, error: lastError };
}
