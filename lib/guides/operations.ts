import type { SupabaseClient } from "@supabase/supabase-js";
import type { Actor } from "@/lib/auth/roles";
import { isAdminRole } from "@/lib/auth/roles";
import {
  getNormalHandbook,
  handbookInstructionsBody,
  handbookRubricBody,
  normalEventHandbook,
} from "@/lib/content/normal-event-handbook";
import { writeAudit } from "@/lib/platform/operations";

type Admin = SupabaseClient;

export async function publishNormalHandbook(admin: Admin, actor: Actor) {
  if (!isAdminRole(actor.role)) return { error: "Only an administrator can publish event guides." };
  const rows = normalEventHandbook.flatMap((event) => [
    {
      catalog_event_id: event.id,
      kind: "INSTRUCTIONS",
      title: `${event.name} instructions`,
      body: handbookInstructionsBody(event),
      file_path: "/docs/normal-events-handbook.pdf",
      published: true,
      updated_at: new Date().toISOString(),
    },
    {
      catalog_event_id: event.id,
      kind: "RUBRIC",
      title: `${event.name} rubric`,
      body: handbookRubricBody(event),
      file_path: "/docs/normal-events-handbook.pdf",
      published: true,
      updated_at: new Date().toISOString(),
    },
  ]);
  const { error } = await admin.from("event_guides").upsert(rows, { onConflict: "catalog_event_id,kind" });
  if (error) return { error: error.message };
  await writeAudit(admin, actor.id, "guides.handbook_published", "catalog_event", undefined, {
    source: "normal-events-handbook",
  });
  return { ok: true, published: rows.length };
}

export async function upsertEventGuide(
  admin: Admin,
  actor: Actor,
  input: {
    eventId: string;
    kind: "INSTRUCTIONS" | "RUBRIC";
    title: string;
    body: string;
    filePath?: string | null;
    published?: boolean;
  },
) {
  if (!isAdminRole(actor.role)) return { error: "Only an administrator can edit event guides." };
  const handbook = getNormalHandbook(input.eventId);
  if (!handbook) return { error: "Choose a catalog event." };
  const { error } = await admin.from("event_guides").upsert(
    {
      catalog_event_id: input.eventId,
      kind: input.kind,
      title: input.title,
      body: input.body,
      file_path: input.filePath ?? null,
      published: input.published ?? true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "catalog_event_id,kind" },
  );
  if (error) return { error: error.message };
  await writeAudit(admin, actor.id, "guides.upserted", "catalog_event", undefined, {
    event_id: input.eventId,
    kind: input.kind,
  });
  return { ok: true };
}

export async function listEventGuides(admin: Admin) {
  const { data } = await admin
    .from("event_guides")
    .select("catalog_event_id, kind, title, published, file_path, updated_at");
  return data ?? [];
}
