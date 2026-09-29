export type TransactionalEmail = {
  to: string;
  subject: string;
  text: string;
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

export async function sendTransactionalEmail(message: TransactionalEmail): Promise<EmailResult> {
  if (!message.to || !message.subject) {
    return { sent: false, pending: true, provider: "none" };
  }
  // Provider is not selected yet. Password reset currently uses Supabase Auth email.
  // Keep this abstraction so invitations and deadlines can plug in later.
  if (process.env.NODE_ENV !== "production") {
    console.info("[email:pending]", message.template ?? "generic", message.to, message.subject);
  }
  return { sent: false, pending: true, provider: "none" };
}
