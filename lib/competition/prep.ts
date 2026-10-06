import type { SupabaseClient } from "@supabase/supabase-js";
import { eventPrepBlueprint } from "@/lib/content/event-prep";

export async function provisionEventPrep(
  admin: SupabaseClient,
  input: {
    seasonId: string;
    chapterId: string;
    eventId: string;
    profileIds: string[];
  },
) {
  const blueprint = eventPrepBlueprint(input.eventId);
  if (!blueprint.length || !input.profileIds.length) return;
  const rows = input.profileIds.flatMap((profileId) =>
    blueprint.map((item) => ({
      season_id: input.seasonId,
      chapter_id: input.chapterId,
      profile_id: profileId,
      catalog_event_id: input.eventId,
      kind: item.kind,
      title: item.title,
      body: item.body,
      status: "NOT_STARTED",
    })),
  );
  const { error } = await admin.from("event_prep_items").upsert(rows, {
    onConflict: "season_id,profile_id,catalog_event_id,kind,title",
    ignoreDuplicates: true,
  });
  if (error && /event_prep_items|schema cache/i.test(error.message)) return;
}

export async function loadStudentPrep(
  admin: SupabaseClient,
  input: { profileId: string; seasonId?: string | null },
) {
  if (!input.seasonId) return [];
  const { data, error } = await admin
    .from("event_prep_items")
    .select("id, catalog_event_id, kind, title, body, status, notes, file_path, submitted_at, updated_at")
    .eq("profile_id", input.profileId)
    .eq("season_id", input.seasonId)
    .order("kind", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function ensureAssignedPrep(
  admin: SupabaseClient,
  input: {
    seasonId: string;
    chapterId: string;
    profileId: string;
    eventIds: string[];
  },
) {
  for (const eventId of input.eventIds) {
    await provisionEventPrep(admin, {
      seasonId: input.seasonId,
      chapterId: input.chapterId,
      eventId,
      profileIds: [input.profileId],
    });
  }
}

export async function loadChapterPrep(
  admin: SupabaseClient,
  input: { chapterId: string; seasonId?: string | null },
) {
  if (!input.seasonId) return [];
  const { data, error } = await admin
    .from("event_prep_items")
    .select("id, catalog_event_id, kind, title, body, status, notes, file_path, submitted_at, profile_id")
    .eq("chapter_id", input.chapterId)
    .eq("season_id", input.seasonId)
    .in("status", ["SUBMITTED", "DONE"])
    .order("submitted_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}
