import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { nominateSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { nominateForInvitational } from "@/lib/competition/operations";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();
  const body = parsed(nominateSchema, await readJson(request));
  if (body.error) return body.error;
  const result = await nominateForInvitational(admin, session.actor, body.data);
  if ("error" in result && result.error) return errors.validation(result.error);
  return apiSuccess({ nominated: true });
}
