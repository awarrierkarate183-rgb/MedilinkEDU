import { EventHandbook } from "@/components/competitions/EventHandbook";
import type { StudentAssignment } from "@/lib/data/admin-proceedings";

export function StudentEventBoard({
  assignments,
  seasonLabel,
}: {
  assignments: StudentAssignment[];
  seasonLabel?: string | null;
}) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Your assigned events</h2>
        <p className="mt-1 text-sm text-muted">
          Season {seasonLabel || "not opened"}. When an administrator or advisor
          enters you in a competition, this page opens the official instructions,
          rubric, work product, and rules for that event.
        </p>
      </div>
      {assignments.length ? (
        assignments.map((item) => (
          <article key={`${item.tier}-${item.eventId}`} className="rounded-[var(--radius)] bg-white p-5">
            <p className="kicker">
              {item.tier === "NORMAL" ? "Normal Event" : "Legacy Event"} {item.number}
            </p>
            <h3 className="mt-1 font-semibold">{item.name}</h3>
            <p className="mt-1 text-sm text-muted">{item.formatLabel}</p>
            {item.groupLabel ? <p className="mt-1 text-sm">Your Legacy group: {item.groupLabel}</p> : null}
            {item.teammates.length ? (
              <p className="mt-1 text-sm">Teammates: {item.teammates.join(", ")}</p>
            ) : (
              <p className="mt-1 text-sm text-muted">No teammates listed for this event.</p>
            )}
            {item.handbook ? (
              <div className="mt-4">
                <EventHandbook
                  event={item.handbook}
                  instructionsOverride={item.instructions}
                  rubricOverride={item.rubric}
                  filePath={item.instructions?.filePath || item.rubric?.filePath}
                />
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-sm">{item.description}</p>
                {item.instructions ? (
                  <div>
                    <h4 className="text-sm font-semibold">{item.instructions.title}</h4>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{item.instructions.body}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted">
                    Instructions for this event are not published yet.
                  </p>
                )}
                {item.rubric ? (
                  <div>
                    <h4 className="text-sm font-semibold">{item.rubric.title}</h4>
                    <p className="mt-1 whitespace-pre-wrap text-sm">{item.rubric.body}</p>
                  </div>
                ) : (
                  <p className="text-sm text-muted">
                    The rubric for this event is not published yet.
                  </p>
                )}
              </div>
            )}
          </article>
        ))
      ) : (
        <div className="rounded-[var(--radius)] bg-white p-5 text-sm text-muted">
          You are not entered in an event yet. Your advisor or a MediLink
          administrator types your name, chooses the competition, and submits.
          That assignment will appear on this page with the official rubric.
        </div>
      )}
    </section>
  );
}
