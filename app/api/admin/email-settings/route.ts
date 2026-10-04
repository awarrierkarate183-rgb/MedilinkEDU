import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { emailSettingsSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { canManageEmailSettings } from "@/lib/auth/roles";
import { emailSettingsPublic } from "@/lib/email/config";
import { sendTransactionalEmail } from "@/lib/email";
import { createAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!canManageEmailSettings(session.actor)) return errors.forbidden();
  return apiSuccess(await emailSettingsPublic());
}

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!canManageEmailSettings(session.actor)) return errors.forbidden();

  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();

  const body = parsed(emailSettingsSchema, await readJson(request));
  if (body.error) return body.error;

  const user = body.data.user.trim().toLowerCase();
  const pass = body.data.pass.replace(/\s+/g, "");
  const host = body.data.host?.trim() || "smtp.gmail.com";
  const port = body.data.port || 465;
  const from = body.data.from?.trim() || `MediLink <${user}>`;

  const updatedAt = new Date().toISOString();
  const rows = [
    { key: "smtp_host", value: host, updated_by: session.actor.id, updated_at: updatedAt },
    { key: "smtp_port", value: String(port), updated_by: session.actor.id, updated_at: updatedAt },
    { key: "smtp_user", value: user, updated_by: session.actor.id, updated_at: updatedAt },
    { key: "smtp_pass", value: pass, updated_by: session.actor.id, updated_at: updatedAt },
    { key: "email_from", value: from, updated_by: session.actor.id, updated_at: updatedAt },
  ];

  const { error } = await admin.from("platform_settings").upsert(rows, { onConflict: "key" });
  if (error) {
    return errors.validation("Email sending could not be connected. Try again.");
  }

  const probe = await sendTransactionalEmail({
    to: user,
    subject: "MediLink email is connected",
    text: "This address will send student invite emails from MediLink.",
    template: "registration_confirmation",
  });
  if (!probe.sent) {
    await admin
      .from("platform_settings")
      .delete()
      .in("key", ["smtp_host", "smtp_port", "smtp_user", "smtp_pass", "email_from"]);
    return errors.validation(
      "Gmail rejected that login. Create a Google App password for MediLink and paste it again.",
    );
  }

  return apiSuccess({
    connected: true,
    from,
    host,
    user,
  });
}
