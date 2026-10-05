import {
  HANDBOOK_PDF,
  handbookRubricBody,
  integrityRules,
  universalScoring,
  type NormalHandbookEntry,
} from "@/lib/content/normal-event-handbook";

export function EventHandbook({
  event,
  instructionsOverride,
  rubricOverride,
  filePath,
  compact = false,
}: {
  event: NormalHandbookEntry;
  instructionsOverride?: { title: string; body: string; filePath: string | null } | null;
  rubricOverride?: { title: string; body: string; filePath: string | null } | null;
  filePath?: string | null;
  compact?: boolean;
}) {
  const attached = filePath || instructionsOverride?.filePath || rubricOverride?.filePath || HANDBOOK_PDF;
  return (
    <div className="space-y-5 text-sm">
      <div className="grid gap-3 md:grid-cols-2">
        <p><strong>Role.</strong> {event.role}</p>
        <p><strong>Action.</strong> {event.action}</p>
        <p><strong>Signature mechanic.</strong> {event.mechanic}</p>
        <p><strong>Class.</strong> {event.releaseLabel} · {event.formatLabel}</p>
      </div>
      <div>
        <p className="kicker">What you do</p>
        <p className="mt-1 whitespace-pre-wrap">{instructionsOverride?.body || event.overview}</p>
      </div>
      {!compact ? (
        <>
          <div>
            <p className="kicker">Preparation before competition</p>
            <p className="mt-1">{event.preparation}</p>
          </div>
          <div>
            <p className="kicker">At competition</p>
            <p className="mt-1">{event.experience}</p>
          </div>
          <div>
            <p className="kicker">Required work product</p>
            <p className="mt-1">{event.workProduct}</p>
          </div>
        </>
      ) : null}
      <div>
        <p className="kicker">{rubricOverride?.title || "Event rubric. 100 points."}</p>
        <p className="mt-1 text-muted">{universalScoring}</p>
        {rubricOverride?.body && rubricOverride.body !== handbookRubricBody(event) ? (
          <p className="mt-2 whitespace-pre-wrap">{rubricOverride.body}</p>
        ) : (
          <table className="mt-3 w-full text-left">
            <thead>
              <tr className="text-muted">
                <th className="py-1 pr-3 font-semibold">Criterion</th>
                <th className="py-1 font-semibold">Points</th>
              </tr>
            </thead>
            <tbody>
              {event.rubric.map((row) => (
                <tr key={row.criterion} className="border-t border-border">
                  <td className="py-1 pr-3">{row.criterion}</td>
                  <td className="py-1">{row.points}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
      <div>
        <p className="kicker">Student success standard</p>
        <p className="mt-1">{event.success}</p>
      </div>
      {!compact ? (
        <div>
          <p className="kicker">Rules and boundaries</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {integrityRules.map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
            {(event.extraRules || []).map((rule) => (
              <li key={rule}>{rule}</li>
            ))}
          </ul>
        </div>
      ) : null}
      {attached ? (
        <p>
          <a href={attached} className="font-semibold underline" target="_blank" rel="noreferrer">
            Open the Normal Events handbook
          </a>
        </p>
      ) : null}
    </div>
  );
}
