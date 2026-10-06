import { getCatalogEvent } from "@/lib/content/competition-system";

export type AdvisorPrepRow = {
  id: string;
  catalog_event_id: string;
  kind: string;
  title: string;
  notes: string | null;
  file_path: string | null;
  status: string;
  submitted_at: string | null;
  studentName: string;
};

export function AdvisorPrepInbox({ items }: { items: AdvisorPrepRow[] }) {
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">Prerequisite submissions</h2>
        <p className="mt-1 text-sm text-muted">
          When a student is entered in an event, Projects fills with the work they must develop and submit before the
          competition date. Files they send land here.
        </p>
      </div>
      {items.length ? (
        <ul className="space-y-3">
          {items.map((item) => {
            const event = getCatalogEvent(item.catalog_event_id);
            return (
              <li key={item.id} className="rounded-[var(--radius)] bg-white p-5">
                <p className="kicker">{item.kind === "SUBMIT" ? "File to submit" : "Developed work"}</p>
                <h3 className="mt-1 font-semibold">{item.title}</h3>
                <p className="mt-1 text-sm text-muted">
                  {item.studentName} · {event?.name || item.catalog_event_id} · {item.status.replaceAll("_", " ").toLowerCase()}
                  {item.submitted_at ? ` · ${new Date(item.submitted_at).toLocaleDateString()}` : ""}
                </p>
                {item.notes ? <p className="mt-2 whitespace-pre-wrap text-sm">{item.notes}</p> : null}
                {item.file_path ? <p className="mt-2 text-sm">File stored: {item.file_path.split("/").pop()}</p> : null}
              </li>
            );
          })}
        </ul>
      ) : (
        <div className="rounded-[var(--radius)] bg-white p-5 text-sm text-muted">
          No prerequisite files have been sent yet. Assigned events fill each student Projects tab automatically.
        </div>
      )}
    </section>
  );
}
