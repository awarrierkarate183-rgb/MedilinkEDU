import { Accordion } from "@/components/ui/Accordion";
import { getEventHandbook, handbookPdf, handbookPdfLabel, handbookScoring } from "@/lib/content/event-handbook";
import { catalogEvents, type EventTier } from "@/lib/content/competition-system";
import { HANDBOOK_PDF, universalScoring } from "@/lib/content/normal-event-handbook";
import { LEGACY_HANDBOOK_PDF, legacyEliteNote, legacyScoring } from "@/lib/content/legacy-event-handbook";

function rubricTotal(rows: Array<{ points: number }>) {
  return rows.reduce((sum, row) => sum + row.points, 0);
}

function RubricGroup({
  tier,
  title,
  lead,
}: {
  tier: EventTier;
  title: string;
  lead: string;
}) {
  const events = catalogEvents.filter((event) => event.tier === tier);
  return (
    <section className="space-y-4">
      <div>
        <h2 className="text-xl font-semibold">{title}</h2>
        <p className="mt-1 text-sm text-muted">{lead}</p>
      </div>
      <Accordion
        items={events.map((event) => {
          const handbook = getEventHandbook(event.id);
          const rows = handbook?.rubric || [];
          const total = rubricTotal(rows);
          const scale = event.tier === "LEGACY" ? "1,000-point system" : "100-point system";
          return {
            id: `${event.id}-rubric`,
            title: `${event.number}. ${event.name}`,
            subtitle: `${event.tier === "NORMAL" ? "Normal Event" : "Legacy Event"} · ${scale} · ${total} points`,
            prestige: event.tier === "LEGACY" ? 2 : 1,
            children: handbook ? (
              <div className="space-y-4">
                <p>{handbookScoring(handbook)}</p>
                <table className="w-full text-left">
                  <thead>
                    <tr className="text-muted">
                      <th className="py-1 pr-3 font-semibold">Criterion</th>
                      <th className="py-1 font-semibold">Points</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row) => (
                      <tr key={row.criterion} className="border-t border-border">
                        <td className="py-1 pr-3">{row.criterion}</td>
                        <td className="py-1">{row.points}</td>
                      </tr>
                    ))}
                    <tr className="border-t border-border font-semibold">
                      <td className="py-1 pr-3">Total</td>
                      <td className="py-1">{total}</td>
                    </tr>
                  </tbody>
                </table>
                <p>
                  <a href={handbookPdf(event.id)} className="font-semibold underline" target="_blank" rel="noreferrer">
                    {handbookPdfLabel(event.id)}
                  </a>
                </p>
              </div>
            ) : (
              <p className="text-muted">No official rubric is attached to this event yet.</p>
            ),
          };
        })}
      />
    </section>
  );
}

export function CompetitionResources() {
  return (
    <div className="space-y-8">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h1 className="text-xl font-semibold">Competition resources</h1>
        <p className="mt-2 text-sm text-muted">
          Each event has its own rubric and point system, taken from the official Normal Events and Legacy
          Championship handbooks. Open a card for the criteria and the points they are worth.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-sm font-semibold">
          <a href={HANDBOOK_PDF} target="_blank" rel="noreferrer" className="underline">
            Normal Events handbook
          </a>
          <a href={LEGACY_HANDBOOK_PDF} target="_blank" rel="noreferrer" className="underline">
            Legacy Championship handbook
          </a>
        </div>
      </section>

      <section className="rounded-[var(--radius)] bg-white p-5">
        <h2 className="font-semibold">Normal Events. 100-point system.</h2>
        <p className="mt-2 text-sm">{universalScoring}</p>
      </section>
      <RubricGroup
        tier="NORMAL"
        title="Normal Event rubrics"
        lead="Twenty separate 100-point rubrics. Criteria and weights change with the event. The total is always 100."
      />

      <section className="rounded-[var(--radius)] bg-white p-5">
        <h2 className="font-semibold">Legacy Events. 1,000-point system.</h2>
        <p className="mt-2 text-sm">{legacyScoring}</p>
        <p className="mt-2 text-sm">{legacyEliteNote}</p>
      </section>
      <RubricGroup
        tier="LEGACY"
        title="Legacy Event rubrics"
        lead="Three separate 1,000-point rubrics. Judges use a 0 to 4 anchor on each criterion. Awarded points equal the criterion maximum times the level divided by 4."
      />
    </div>
  );
}
