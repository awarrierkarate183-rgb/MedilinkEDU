import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { eventChoiceSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { submitEventChoices } from "@/lib/competition/choices";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();
  const body = parsed(eventChoiceSchema, await readJson(request));
  if (body.error) return body.error;
  const result = await submitEventChoices(admin, session.actor, body.data);
  if ("error" in result && result.error) return errors.validation(result.error);
  return apiSuccess(result, 201);
}
