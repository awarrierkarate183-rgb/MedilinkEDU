import { sendTransactionalEmail } from "@/lib/email";
import { httpMailerFromEnv, loadSmtpConfig } from "@/lib/email/config";
import { sendInviteWithSupabaseMail } from "@/lib/email/supabase-mail";
import { studentInviteMessage } from "@/lib/email/student-invite";
import { createAdminClient } from "@/lib/supabase/admin";

async function trySendInviteEmail(opts: {
  email: string;
  firstName: string;
  lastName: string;
  inviteUrl: string;
  expiresAt: string;
}) {
  const message = studentInviteMessage({
    firstName: opts.firstName,
    inviteUrl: opts.inviteUrl,
    expiresAt: opts.expiresAt,
  });
  const mail = await sendTransactionalEmail({
    to: opts.email,
    subject: message.subject,
    text: message.text,
    html: message.html,
    template: "student_invitation",
  });
  if (mail.sent) return { sent: true, userId: undefined as string | undefined };

  const viaAuth = await sendInviteWithSupabaseMail({
    email: opts.email,
    firstName: opts.firstName,
    lastName: opts.lastName,
    inviteUrl: opts.inviteUrl,
  });
  return { sent: viaAuth.sent, userId: viaAuth.userId };
}

export async function deliverInviteEmail(opts: {
  email: string;
  firstName: string;
  lastName: string;
  inviteUrl: string;
  expiresAt: string;
}) {
  const result = await trySendInviteEmail(opts);
  if (result.sent) {
    await flushInviteOutbox();
    return { sent: true, queued: false, userId: result.userId };
  }

  const admin = createAdminClient();
  if (!admin) return { sent: false, queued: false, userId: result.userId };
  const { error } = await admin.from("email_outbox").insert({
    to_email: opts.email,
    first_name: opts.firstName,
    last_name: opts.lastName,
    invite_url: opts.inviteUrl,
    expires_at: opts.expiresAt,
    status: "PENDING",
  });
  return { sent: !error, queued: !error, userId: result.userId };
}

export async function flushInviteOutbox() {
  const admin = createAdminClient();
  if (!admin) return { sent: 0, remaining: 0 };
  const canBurst = Boolean(httpMailerFromEnv() || (await loadSmtpConfig()));
  const { data: rows } = await admin
    .from("email_outbox")
    .select("id, to_email, first_name, last_name, invite_url, expires_at, attempts")
    .eq("status", "PENDING")
    .lt("attempts", 12)
    .order("created_at", { ascending: true })
    .limit(canBurst ? 20 : 2);
  let sent = 0;
  for (const row of rows ?? []) {
    const result = await trySendInviteEmail({
      email: row.to_email,
      firstName: row.first_name || "",
      lastName: row.last_name || "",
      inviteUrl: row.invite_url,
      expiresAt: row.expires_at || new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
    });
    if (result.sent) {
      await admin
        .from("email_outbox")
        .update({ status: "SENT", sent_at: new Date().toISOString(), last_error: null })
        .eq("id", row.id);
      sent += 1;
    } else {
      await admin
        .from("email_outbox")
        .update({
          attempts: (row.attempts || 0) + 1,
          last_error: "waiting to send",
        })
        .eq("id", row.id);
    }
  }
  const { count } = await admin
    .from("email_outbox")
    .select("id", { count: "exact", head: true })
    .eq("status", "PENDING");
  return { sent, remaining: count ?? 0 };
}
