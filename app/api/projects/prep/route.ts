import { apiSuccess, errors } from "@/lib/api/respond";
import { parsed } from "@/lib/api/parse";
import { updatePrepItemSchema } from "@/lib/api/schemas";
import { getRequestActor } from "@/lib/api/session";
import { canAccessStudentPortal } from "@/lib/auth/roles";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: Request) {
  const session = await getRequestActor();
  if (!session.configured) return errors.notConfigured();
  if (!session.actor) return errors.unauthenticated();
  if (!canAccessStudentPortal(session.actor.role)) return errors.forbidden();
  const admin = createAdminClient();
  if (!admin) return errors.notConfigured();

  const form = await request.formData();
  const body = parsed(updatePrepItemSchema, {
    itemId: String(form.get("itemId") || ""),
    notes: String(form.get("notes") || ""),
    status: String(form.get("status") || "") || undefined,
  });
  if (body.error) return body.error;

  const { data: item } = await admin
    .from("event_prep_items")
    .select("id, profile_id, kind, status")
    .eq("id", body.data.itemId)
    .maybeSingle();
  if (!item || item.profile_id !== session.actor.id) return errors.notFound();

  let filePath = undefined as string | undefined;
  const file = form.get("file");
  const hasFile = file instanceof File && file.size > 0;
  if (hasFile) {
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-").slice(0, 80);
    const path = `event-prep/${session.actor.id}/${item.id}-${Date.now()}-${safeName}`;
    const buffer = Buffer.from(await file.arrayBuffer());
    const uploaded = await admin.storage.from("student-submissions").upload(path, buffer, {
      contentType: file.type || "application/pdf",
      upsert: true,
    });
    if (uploaded.error) return errors.validation("That file could not be stored. Try a PDF under 10 MB.");
    filePath = path;
  }

  const nextStatus =
    body.data.status ||
    (hasFile || item.kind === "SUBMIT"
      ? item.kind === "SUBMIT"
        ? "SUBMITTED"
        : "DONE"
      : "IN_PROGRESS");
  const { error } = await admin
    .from("event_prep_items")
    .update({
      notes: body.data.notes || null,
      status: nextStatus,
      file_path: filePath,
      submitted_at: nextStatus === "SUBMITTED" || nextStatus === "DONE" ? new Date().toISOString() : null,
      updated_at: new Date().toISOString(),
    })
    .eq("id", item.id);
  if (error) return errors.internal();
  return apiSuccess({ updated: true, status: nextStatus });
}
