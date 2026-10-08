import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { createInvitationSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { canApproveMembers } from "@/lib/auth/roles";
import { createInvitation } from "@/lib/platform/operations";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured || !session.supabase) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!canApproveMembers(session.actor)) return errors.forbidden();

  const body = parsed(createInvitationSchema, await readJson(request));
  if (body.error) return body.error;
  if (body.data.role === "CHAPTER_ADVISOR" && session.actor.role !== "SUPER_ADMIN") {
    return errors.forbidden();
  }

  const result = await createInvitation({
    client: session.supabase,
    actor: session.actor,
    email: body.data.email,
    role: body.data.role,
  });
  if ("token" in result && result.token) {
    return apiSuccess({ token: result.token, expires: result.expires });
  }
  const message = "error" in result && result.error ? result.error : "The invitation could not be created.";
  return errors.validation(message);
}
