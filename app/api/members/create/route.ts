import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { addStudentSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { canApproveMembers } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { inviteStudent } from "@/lib/platform/provision";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!canApproveMembers(session.actor)) return errors.forbidden();

  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();

  const body = parsed(addStudentSchema, await readJson(request));
  if (body.error) return body.error;

  const result = await inviteStudent(admin, session.actor, body.data);
  if ("error" in result && result.error) {
    return errors.validation(result.error);
  }
  if (!("email" in result)) return errors.internal();
  return apiSuccess(result, 201);
}
