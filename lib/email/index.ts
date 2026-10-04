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
  provider: "none" | "configured";
};

async function sendWithResend(message: TransactionalEmail): Promise<boolean | null> {
  const key = process.env.RESEND_API_KEY?.trim();
  if (!key) return null;
  const from = process.env.EMAIL_FROM?.trim() || "MediLink <onboarding@resend.dev>";
  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [message.to],
        subject: message.subject,
        text: message.text,
        html: message.html || message.text.replace(/\n/g, "<br>"),
      }),
    });
    return response.ok;
  } catch {
    return false;
  }
}

export async function sendTransactionalEmail(message: TransactionalEmail): Promise<EmailResult> {
  if (!message.to || !message.subject) {
    return { sent: false, pending: true, provider: "none" };
  }
  const resent = await sendWithResend(message);
  if (resent === true) {
    return { sent: true, pending: false, provider: "configured" };
  }
  if (process.env.NODE_ENV !== "production") {
    console.info("[email:pending]", message.template ?? "generic", message.to, message.subject);
  }
  return { sent: false, pending: true, provider: resent === false ? "configured" : "none" };
}
