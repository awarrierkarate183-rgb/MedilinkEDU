import type { SupabaseClient } from "@supabase/supabase-js";
import type { Actor } from "@/lib/auth/roles";
import { isAdminRole } from "@/lib/auth/roles";
import {
  handbookInstructions,
  handbookPdf,
  handbookRubric,
  getEventHandbook,
} from "@/lib/content/event-handbook";
import { normalEventHandbook } from "@/lib/content/normal-event-handbook";
import { legacyEventHandbook } from "@/lib/content/legacy-event-handbook";
import { writeAudit } from "@/lib/platform/operations";

type Admin = SupabaseClient;

function guideRows(events: Array<{ id: string; name: string }>) {
  return events.flatMap((event) => {
    const handbook = getEventHandbook(event.id);
    if (!handbook) return [];
    return [
      {
        catalog_event_id: event.id,
        kind: "INSTRUCTIONS",
        title: `${event.name} instructions`,
        body: handbookInstructions(handbook),
        file_path: handbookPdf(event.id),
        published: true,
        updated_at: new Date().toISOString(),
      },
      {
        catalog_event_id: event.id,
        kind: "RUBRIC",
        title: `${event.name} rubric`,
        body: handbookRubric(handbook),
        file_path: handbookPdf(event.id),
        published: true,
        updated_at: new Date().toISOString(),
      },
    ];
  });
}

export async function publishNormalHandbook(admin: Admin, actor: Actor) {
  return publishHandbookSet(admin, actor, "normal");
}

export async function publishLegacyHandbook(admin: Admin, actor: Actor) {
  return publishHandbookSet(admin, actor, "legacy");
}

export async function publishHandbookSet(admin: Admin, actor: Actor, source: "normal" | "legacy" | "all" = "all") {
  if (!isAdminRole(actor.role)) return { error: "Only an administrator can publish event guides." };
  const events =
    source === "normal"
      ? normalEventHandbook
      : source === "legacy"
        ? legacyEventHandbook
        : [...normalEventHandbook, ...legacyEventHandbook];
  const rows = guideRows(events);
  const { error } = await admin.from("event_guides").upsert(rows, { onConflict: "catalog_event_id,kind" });
  if (error) return { error: error.message };
  await writeAudit(admin, actor.id, "guides.handbook_published", "catalog_event", undefined, { source });
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
  const handbook = getEventHandbook(input.eventId);
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
