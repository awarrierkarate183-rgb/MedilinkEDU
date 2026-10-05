import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { aiSettingsSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { isAdminRole } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!isAdminRole(session.actor.role)) return errors.forbidden();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();
  const body = parsed(aiSettingsSchema, await readJson(request));
  if (body.error) return body.error;
  if (!body.data.groqKey) return errors.validation("Enter a Groq API key.");
  const { error } = await admin.from("platform_settings").upsert({
    key: "ai.groq_key",
    value: body.data.groqKey.trim(),
    updated_by: session.actor.id,
    updated_at: new Date().toISOString(),
  }, { onConflict: "key" });
  if (error) return errors.validation("That key could not be saved.");
  return apiSuccess({ connected: true });
}
