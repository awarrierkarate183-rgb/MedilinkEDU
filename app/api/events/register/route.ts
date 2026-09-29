import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed, readJson } from "@/lib/api/parse";
import { registerEventSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured || !session.supabase) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();

  const body = parsed(registerEventSchema, await readJson(request));
  if (body.error) return body.error;

  const { data: event } = await session.supabase
    .from("events")
    .select("id, chapter_id, status, registration_required")
    .eq("id", body.data.eventId)
    .maybeSingle();
  if (!event) return errors.notFound("That event was not found.");
  if (!["PUBLISHED", "REGISTRATION_OPEN"].includes(event.status)) {
    return errors.forbidden();
  }

  const { error } = await session.supabase.from("event_registrations").insert({
    event_id: event.id,
    profile_id: session.actor.id,
    status: "REGISTERED",
  });
  if (error) return errors.conflict("You are already registered for that event.");
  return apiSuccess({ registered: true });
}
