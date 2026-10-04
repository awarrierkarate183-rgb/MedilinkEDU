import { sendTransactionalEmail } from "@/lib/email";
import { httpMailerFromEnv, loadSmtpConfig } from "@/lib/email/config";
import { sendInviteWithSupabaseMail } from "@/lib/email/supabase-mail";
import { studentInviteMessage } from "@/lib/email/student-invite";
import { createAdminClient } from "@/lib/supabase/admin";

const BLOCK_KEY = "supabase_mail_blocked_until";

async function supabaseMailAllowed() {
  const admin = createAdminClient();
  if (!admin) return false;
  const { data } = await admin.from("platform_settings").select("value").eq("key", BLOCK_KEY).maybeSingle();
  if (!data?.value) return true;
  const until = Date.parse(data.value);
  return !Number.isFinite(until) || until <= Date.now();
}

async function blockSupabaseMailForHour() {
  const admin = createAdminClient();
  if (!admin) return;
  await admin.from("platform_settings").upsert(
    {
      key: BLOCK_KEY,
      value: new Date(Date.now() + 60 * 60 * 1000).toISOString(),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
}

async function recordLastEmailError(message?: string) {
  const admin = createAdminClient();
  if (!admin || !message) return;
  await admin.from("platform_settings").upsert(
    {
      key: "last_email_error",
      value: message.slice(0, 240),
      updated_at: new Date().toISOString(),
    },
    { onConflict: "key" },
  );
}

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
  if (mail.sent) return { sent: true, error: undefined as string | undefined, userId: undefined as string | undefined };

  const hasOwnMailer = Boolean(httpMailerFromEnv() || (await loadSmtpConfig()));
  if (hasOwnMailer) {
    await recordLastEmailError(mail.error);
    return {
      sent: false,
      error: mail.error || "Gmail could not send that invite.",
      userId: undefined,
    };
  }

  if (!(await supabaseMailAllowed())) {
    return { sent: false, error: "Invite email is waiting to send.", userId: undefined };
  }

  const viaAuth = await sendInviteWithSupabaseMail({
    email: opts.email,
    firstName: opts.firstName,
    lastName: opts.lastName,
    inviteUrl: opts.inviteUrl,
  });
  if (viaAuth.status === 429) {
    await blockSupabaseMailForHour();
    await recordLastEmailError("Supabase invite mailer hit its hourly limit.");
  }
  return {
    sent: viaAuth.sent,
    error: viaAuth.sent ? undefined : "The invite email could not be sent to that student.",
    userId: viaAuth.userId,
  };
}

export async function cancelPendingInviteMail(email: string) {
  const admin = createAdminClient();
  if (!admin) return;
  await admin
    .from("email_outbox")
    .update({ status: "CANCELLED", last_error: "replaced by a new invite" })
    .eq("to_email", email)
    .eq("status", "PENDING");
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
    return { sent: true, queued: false, error: undefined as string | undefined, userId: result.userId };
  }

  const admin = createAdminClient();
  if (!admin) return { sent: false, queued: false, error: result.error, userId: result.userId };
  await admin.from("email_outbox").insert({
    to_email: opts.email,
    first_name: opts.firstName,
    last_name: opts.lastName,
    invite_url: opts.inviteUrl,
    expires_at: opts.expiresAt,
    status: "PENDING",
    last_error: result.error || "waiting to send",
  });
  return { sent: false, queued: true, error: result.error, userId: result.userId };
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
          last_error: result.error || "waiting to send",
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
