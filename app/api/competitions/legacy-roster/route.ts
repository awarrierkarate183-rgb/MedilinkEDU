import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { legacyRosterSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { saveLegacyDelegation } from "@/lib/competition/operations";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();
  const body = parsed(legacyRosterSchema, await readJson(request));
  if (body.error) return body.error;
  const result = await saveLegacyDelegation(admin, session.actor, body.data);
  if ("error" in result && result.error) return errors.validation(result.error);
  return apiSuccess({ saved: true });
}
