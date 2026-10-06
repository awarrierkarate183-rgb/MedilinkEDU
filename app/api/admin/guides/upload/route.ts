import { apiSuccess, errors } from "@/lib/api/respond";
import { getRequestActor } from "@/lib/api/session";
import { isAdminRole } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";
import { upsertEventGuide } from "@/lib/guides/operations";
import { getEventHandbook, handbookInstructions, handbookRubric } from "@/lib/content/event-handbook";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!isAdminRole(session.actor.role)) return errors.forbidden();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();

  const form = await request.formData();
  const eventId = String(form.get("eventId") || "");
  const kind = form.get("kind") === "RUBRIC" ? "RUBRIC" : "INSTRUCTIONS";
  const file = form.get("file");
  if (!(file instanceof File) || !file.size) return errors.validation("Choose a document to upload.");
  const handbook = getEventHandbook(eventId);
  if (!handbook) return errors.validation("Choose a catalog event.");

  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
  const path = `event-guides/${eventId}-${kind}-${Date.now()}-${safeName}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  const { error } = await admin.storage.from("chapter-assets").upload(path, buffer, {
    contentType: file.type || "application/pdf",
    upsert: true,
  });
  if (error) return errors.validation("That file could not be stored. Try a PDF under 10 MB.");

  const { data } = admin.storage.from("chapter-assets").getPublicUrl(path);
  const filePath = data.publicUrl;
  const result = await upsertEventGuide(admin, session.actor, {
    eventId,
    kind,
    title: `${handbook.name} ${kind === "RUBRIC" ? "rubric" : "instructions"}`,
    body: kind === "RUBRIC" ? handbookRubric(handbook) : handbookInstructions(handbook),
    filePath,
    published: true,
  });
  if ("error" in result && result.error) return errors.validation(result.error);
  return apiSuccess({ filePath, eventId, kind });
}
