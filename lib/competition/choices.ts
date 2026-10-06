import type { SupabaseClient } from "@supabase/supabase-js";
import type { Actor } from "@/lib/auth/roles";
import { canManageChapterCompetitions, isAdminRole } from "@/lib/auth/roles";
import { getCatalogEvent, type EventTier } from "@/lib/content/competition-system";
import { assertEventChoiceSet } from "@/lib/competition/rules";
import { assignLegacyEvent, assignStudentsByName, currentSeason } from "@/lib/competition/operations";
import { notify, writeAudit } from "@/lib/platform/operations";

type Admin = SupabaseClient;

export type ChoiceStatus = "PENDING" | "APPROVED" | "DECLINED" | "WITHDRAWN";

export type EventChoiceRow = {
  id: string;
  seasonId: string;
  chapterId: string;
  profileId: string;
  eventId: string;
  intent: string;
  status: ChoiceStatus;
  createdAt: string;
  studentName: string;
  studentEmail: string;
  eventName: string;
  eventTier: EventTier;
  formatLabel: string;
};

function displayName(row: {
  first_name?: string | null;
  last_name?: string | null;
  full_name?: string | null;
  display_name?: string | null;
}) {
  const named = [row.first_name, row.last_name].filter(Boolean).join(" ").trim();
  return named || row.full_name || row.display_name || "Student";
}

function mapChoice(
  row: {
    id: string;
    season_id: string;
    chapter_id: string;
    profile_id: string;
    catalog_event_id: string;
    intent: string;
    status: ChoiceStatus;
    created_at: string;
    profiles?: {
      first_name?: string | null;
      last_name?: string | null;
      full_name?: string | null;
      display_name?: string | null;
      email?: string | null;
    } | null;
  },
): EventChoiceRow {
  const event = getCatalogEvent(row.catalog_event_id);
  return {
    id: row.id,
    seasonId: row.season_id,
    chapterId: row.chapter_id,
    profileId: row.profile_id,
    eventId: row.catalog_event_id,
    intent: row.intent || "",
    status: row.status,
    createdAt: row.created_at,
    studentName: displayName(row.profiles || {}),
    studentEmail: row.profiles?.email || "",
    eventName: event?.name || row.catalog_event_id,
    eventTier: event?.tier || "NORMAL",
    formatLabel: event?.formatLabel || "",
  };
}

export async function loadEventChoices(
  admin: Admin,
  input: { chapterId?: string | null; profileId?: string | null },
) {
  const season = await currentSeason(admin);
  if (!season) return { season: null, choices: [] as EventChoiceRow[] };
  let query = admin
    .from("event_choices")
    .select(
      "id, season_id, chapter_id, profile_id, catalog_event_id, intent, status, created_at, profiles(first_name, last_name, full_name, display_name, email)",
    )
    .eq("season_id", season.id)
    .order("created_at", { ascending: false });
  if (input.chapterId) query = query.eq("chapter_id", input.chapterId);
  if (input.profileId) query = query.eq("profile_id", input.profileId);
  const { data, error } = await query;
  if (error) return { season, choices: [] as EventChoiceRow[], error: error.message };
  return {
    season,
    choices: (data || []).map((row) => {
      const raw = row as Parameters<typeof mapChoice>[0] & {
        profiles?: Parameters<typeof mapChoice>[0]["profiles"] | Parameters<typeof mapChoice>[0]["profiles"][];
      };
      const profiles = Array.isArray(raw.profiles) ? raw.profiles[0] : raw.profiles;
      return mapChoice({ ...raw, profiles: profiles || null });
    }),
  };
}

export async function submitEventChoices(
  admin: Admin,
  actor: Actor,
  input: { choices: Array<{ eventId: string; intent?: string }> },
) {
  if (actor.role !== "STUDENT" && actor.role !== "CHAPTER_OFFICER") {
    return { error: "Only a student can send event choices." };
  }
  if (!actor.chapterId) return { error: "Your account is not attached to a chapter yet." };
  const season = await currentSeason(admin);
  if (!season) return { error: "No competition season is open." };

  const { data: registrations } = await admin
    .from("normal_event_registrations")
    .select("catalog_event_id")
    .eq("season_id", season.id)
    .eq("profile_id", actor.id);
  const { data: existing } = await admin
    .from("event_choices")
    .select("id, catalog_event_id, status")
    .eq("season_id", season.id)
    .eq("profile_id", actor.id);

  const heldNormal = [
    ...(registrations ?? []).map((row) => row.catalog_event_id),
    ...(existing ?? [])
      .filter((row) => row.status === "APPROVED" && getCatalogEvent(row.catalog_event_id)?.tier === "NORMAL")
      .map((row) => row.catalog_event_id),
  ];
  const setError = assertEventChoiceSet(input.choices, heldNormal);
  if (setError) return { error: setError };

  const alreadyOfficial = new Set([
    ...(registrations ?? []).map((row) => row.catalog_event_id),
    ...(existing ?? []).filter((row) => row.status === "APPROVED").map((row) => row.catalog_event_id),
  ]);
  const nextIds = new Set(
    input.choices
      .map((row) => getCatalogEvent(row.eventId)?.id)
      .filter((id): id is string => Boolean(id) && !alreadyOfficial.has(id)),
  );
  const pendingToWithdraw = (existing ?? []).filter(
    (row) => row.status === "PENDING" && !nextIds.has(row.catalog_event_id),
  );
  if (pendingToWithdraw.length) {
    await admin
      .from("event_choices")
      .update({ status: "WITHDRAWN", updated_at: new Date().toISOString() })
      .in(
        "id",
        pendingToWithdraw.map((row) => row.id),
      );
  }

  const rows = input.choices.flatMap((choice) => {
    const event = getCatalogEvent(choice.eventId);
    if (!event || !nextIds.has(event.id)) return [];
    return [{
      season_id: season.id,
      chapter_id: actor.chapterId,
      profile_id: actor.id,
      catalog_event_id: event.id,
      intent: (choice.intent || "").trim(),
      status: "PENDING" as const,
      reviewed_by: null,
      reviewed_at: null,
      updated_at: new Date().toISOString(),
    }];
  });
  if (!rows.length) {
    return { error: "Those events are already entered. Choose a different event." };
  }
  const { error } = await admin.from("event_choices").upsert(rows, {
    onConflict: "season_id,profile_id,catalog_event_id",
  });
  if (error) return { error: error.message };

  const { data: profile } = await admin
    .from("profiles")
    .select("first_name, last_name, full_name, display_name")
    .eq("id", actor.id)
    .maybeSingle();
  const { data: advisors } = await admin
    .from("profiles")
    .select("id")
    .eq("chapter_id", actor.chapterId)
    .eq("role", "CHAPTER_ADVISOR")
    .neq("status", "REMOVED");
  const studentName = displayName(profile || {});
  const names = input.choices
    .map((choice) => getCatalogEvent(choice.eventId)?.name)
    .filter(Boolean)
    .join(", ");
  await Promise.all(
    (advisors ?? []).map((advisor) =>
      notify(
        admin,
        advisor.id,
        "event_choice",
        `${studentName} chose events`,
        `${studentName} asked to compete in ${names}. Open Competitions to enter them.`,
        "/portal/advisor/competitions",
      ),
    ),
  );
  await writeAudit(admin, actor.id, "competition.event_choice", "chapter", actor.chapterId, {
    events: [...nextIds],
  });
  return { ok: true, count: rows.length };
}

export async function reviewEventChoice(
  admin: Admin,
  actor: Actor,
  input: {
    choiceId: string;
    decision: "approve" | "decline";
    teammates?: Array<{ firstName: string; lastName: string }>;
  },
) {
  if (!canManageChapterCompetitions(actor) && !isAdminRole(actor.role)) {
    return { error: "Only an advisor or administrator can enter a student from a choice." };
  }
  const { data: choice } = await admin
    .from("event_choices")
    .select("id, season_id, chapter_id, profile_id, catalog_event_id, status, intent")
    .eq("id", input.choiceId)
    .maybeSingle();
  if (!choice) return { error: "That event choice was not found." };
  if (choice.status !== "PENDING") return { error: "That choice was already reviewed." };
  if (!isAdminRole(actor.role) && actor.chapterId !== choice.chapter_id) {
    return { error: "You can only review choices from your own chapter." };
  }

  if (input.decision === "decline") {
    const { error } = await admin
      .from("event_choices")
      .update({
        status: "DECLINED",
        reviewed_by: actor.id,
        reviewed_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", choice.id);
    if (error) return { error: error.message };
    await notify(
      admin,
      choice.profile_id,
      "event_choice",
      "An event choice was not entered",
      "Your advisor reviewed a choice and did not enter you in that event. Open Choose Event to send another request.",
      "/portal/student/choose-event",
    );
    return { ok: true, status: "DECLINED" as const };
  }

  const event = getCatalogEvent(choice.catalog_event_id);
  if (!event) return { error: "That event is not on the MediLink catalog." };
  const { data: student } = await admin
    .from("profiles")
    .select("first_name, last_name, full_name, display_name")
    .eq("id", choice.profile_id)
    .maybeSingle();
  const firstName = student?.first_name || (student?.full_name || "").split(" ")[0] || "";
  const lastName =
    student?.last_name ||
    (student?.full_name || "").split(" ").slice(1).join(" ") ||
    "";
  if (!firstName || !lastName) {
    return { error: "That student needs a first and last name on the roster before they can be entered." };
  }

  if (event.tier === "NORMAL") {
    const assigned = await assignStudentsByName(admin, actor, {
      chapterId: choice.chapter_id,
      eventId: event.id,
      students: [{ firstName, lastName }, ...(input.teammates || [])],
    });
    if ("error" in assigned && assigned.error) return assigned;
  } else {
    const season = await currentSeason(admin);
    const { data: members } = season
      ? await admin
          .from("legacy_delegation_members")
          .select("profile_id, legacy_delegations!inner(season_id, chapter_id)")
          .eq("legacy_delegations.season_id", season.id)
          .eq("legacy_delegations.chapter_id", choice.chapter_id)
      : { data: [] };
    const onRoster = (members ?? []).some((row) => row.profile_id === choice.profile_id);
    if ((members ?? []).length === 4 && onRoster) {
      const entered = await assignLegacyEvent(admin, actor, {
        eventId: event.id,
        groupLabel: "A",
        chapterId: choice.chapter_id,
      });
      if ("error" in entered && entered.error && !/already entered/.test(entered.error)) {
        return entered;
      }
    }
  }

  const { error } = await admin
    .from("event_choices")
    .update({
      status: "APPROVED",
      reviewed_by: actor.id,
      reviewed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq("id", choice.id);
  if (error) return { error: error.message };
  await notify(
    admin,
    choice.profile_id,
    "event_choice",
    `You were entered in ${event.name}`,
    event.tier === "LEGACY"
      ? "Your advisor saved this Legacy choice. If the four-person roster is set, the event is now official on Competitions."
      : "Your advisor entered you. Open Competitions for the format, teammates, and rubric.",
    "/portal/student/competitions",
  );
  await writeAudit(admin, actor.id, "competition.event_choice_approved", "catalog_event", event.id, {
    profile_id: choice.profile_id,
  });
  return {
    ok: true,
    status: "APPROVED" as const,
    eventName: event.name,
    legacyNeedsRoster: event.tier === "LEGACY",
  };
}
