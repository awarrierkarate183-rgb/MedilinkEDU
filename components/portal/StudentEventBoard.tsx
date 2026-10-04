import type { StudentAssignment } from "@/lib/data/admin-proceedings";

function GuideSlot({
  title,
  waiting,
  guide,
}: {
  title: string;
  waiting: string;
  guide: { title: string; body: string; filePath: string | null } | null;
}) {
  if (!guide) {
    return (
      <div className="rounded-md border border-border px-3 py-3">
        <h4 className="text-sm font-semibold">{title}</h4>
        <p className="mt-1 text-sm text-muted">{waiting}</p>
      </div>
    );
  }
  return (
    <div className="rounded-md border border-border px-3 py-3">
      <h4 className="text-sm font-semibold">{guide.title || title}</h4>
      <p className="mt-1 whitespace-pre-wrap text-sm">{guide.body}</p>
      {guide.filePath ? (
        <p className="mt-2 text-sm text-muted">Attached file: {guide.filePath}</p>
      ) : null}
    </div>
  );
}

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
          enters you in a competition, it shows here with the format and, when
          MediLink publishes them, the instructions and rubric.
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
            <p className="mt-3 text-sm">{item.description}</p>
            <div className="mt-4 grid gap-3 md:grid-cols-2">
              <GuideSlot
                title="Instructions"
                waiting="Instructions for this event are not published yet. When MediLink adds them, they will appear here automatically."
                guide={item.instructions}
              />
              <GuideSlot
                title="Rubric"
                waiting="The rubric for this event is not published yet. When MediLink adds it, it will appear here automatically."
                guide={item.rubric}
              />
            </div>
          </article>
        ))
      ) : (
        <div className="rounded-[var(--radius)] bg-white p-5 text-sm text-muted">
          You are not entered in an event yet. Your advisor or a MediLink
          administrator types your name, chooses the competition, and submits.
          That assignment will appear on this page.
        </div>
      )}
    </section>
  );
}
