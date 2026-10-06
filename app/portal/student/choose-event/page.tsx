import { requireRole } from "@/lib/auth/session";
import { createAdminClient } from "@/lib/supabase/admin";
import { ConnectionTrouble } from "@/components/portal/ConnectionTrouble";
import { ChooseEventForm } from "@/components/portal/ChooseEventForm";
import { loadEventChoices } from "@/lib/competition/choices";

export default async function ChooseEventPage() {
  const { profile } = await requireRole(["STUDENT", "CHAPTER_OFFICER"]);
  const admin = createAdminClient();
  if (!admin || !profile) return <ConnectionTrouble />;
  const { choices, season } = await loadEventChoices(admin, { profileId: profile.id });

  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h1 className="text-xl font-semibold">Choose Event</h1>
        <p className="mt-2 text-sm text-muted">
          Season {season?.label || "not opened"}. Pick the events you want and write what you want to do. Your chapter
          advisor gets the request immediately. Nothing is official until they enter you.
        </p>
        {!profile.chapter_id ? (
          <p className="mt-3 text-sm text-muted">
            Your account is not attached to a chapter yet, so a choice cannot reach an advisor.
          </p>
        ) : null}
      </section>
      {choices.length ? (
        <section className="rounded-[var(--radius)] bg-white p-5">
          <h2 className="font-semibold">Your current choices</h2>
          <ul className="mt-3 space-y-2 text-sm">
            {choices.map((choice) => (
              <li key={choice.id}>
                <strong>{choice.eventName}</strong>
                <span className="ml-2 text-muted">{choice.status.replaceAll("_", " ").toLowerCase()}</span>
                {choice.intent ? <span className="ml-2 text-muted">· {choice.intent}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
      {profile.chapter_id ? <ChooseEventForm existing={choices} /> : null}
    </div>
  );
}
