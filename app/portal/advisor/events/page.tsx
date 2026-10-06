import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { EventChoiceInbox } from "@/components/portal/EventChoiceInbox";
import { PortalEventList } from "@/components/portal/PortalEventList";
import { loadEventChoices } from "@/lib/competition/choices";

export default async function AdvisorEventsPage() {
  const { profile } = await requireRole(["CHAPTER_ADVISOR", "STATE_ADMIN", "SUPER_ADMIN"]);
  const admin = createAdminClient();
  if (!admin || !profile) return <ConnectionTrouble />;
  const { choices } = profile.chapter_id
    ? await loadEventChoices(admin, { chapterId: profile.chapter_id })
    : { choices: [] };

  return (
    <div className="space-y-8">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h1 className="text-xl font-semibold">Events</h1>
        <p className="mt-2 text-sm text-muted">
          This is the official MediLink event list. Students see the same catalog. When a student sends a choice, it
          appears at the top of this page. Enter them to save the regular assignment.
        </p>
      </section>
      <EventChoiceInbox choices={choices} />
      <PortalEventList audience="advisor" />
    </div>
  );
}
