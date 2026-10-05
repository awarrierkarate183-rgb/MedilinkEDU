import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { adminDeskSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { isAdminRole } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { runAdminDesk } from "@/lib/ai/admin-desk";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!isAdminRole(session.actor.role)) return errors.forbidden();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();
  const body = parsed(adminDeskSchema, await readJson(request));
  if (body.error) return body.error;
  const result = await runAdminDesk(admin, session.actor, body.data.message);
  return apiSuccess(result);
}
