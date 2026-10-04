import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { invitationalScoreSchema, publishInviteesSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { publishInvitees, setConfidentialScore } from "@/lib/competition/operations";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();
  const json = await readJson(request);
  if (Array.isArray((json as { profileIds?: string[] }).profileIds)) {
    const body = parsed(publishInviteesSchema, json);
    if (body.error) return body.error;
    const result = await publishInvitees(admin, session.actor, body.data.profileIds);
    if ("error" in result && result.error) return errors.validation(result.error);
    return apiSuccess({ published: true });
  }
  const body = parsed(invitationalScoreSchema, json);
  if (body.error) return body.error;
  const result = await setConfidentialScore(admin, session.actor, body.data);
  if ("error" in result && result.error) return errors.validation(result.error);
  return apiSuccess({ saved: true });
}
