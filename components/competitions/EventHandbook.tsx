import {
  getEventHandbook,
  handbookPdf,
  handbookPdfLabel,
  handbookRubric,
  handbookRules,
  handbookScoring,
  type AnyHandbook,
} from "@/lib/content/event-handbook";

export function EventHandbook({
  event,
  instructionsOverride,
  rubricOverride,
  filePath,
  compact = false,
}: {
  event: AnyHandbook;
  instructionsOverride?: { title: string; body: string; filePath: string | null } | null;
  rubricOverride?: { title: string; body: string; filePath: string | null } | null;
  filePath?: string | null;
  compact?: boolean;
}) {
  const attached = filePath || instructionsOverride?.filePath || rubricOverride?.filePath || handbookPdf(event.id);
  const legacy = "whyLegacy" in event;
  const officialRubric = handbookRubric(event);
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
        <p className="mt-1 whitespace-pre-wrap">{event.overview}</p>
      </div>
      {legacy && !compact ? (
        <>
          <div>
            <p className="kicker">Why this event is Legacy-level</p>
            <p className="mt-1">{event.whyLegacy}</p>
          </div>
          <div>
            <p className="kicker">Four-person operating model</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {("roles" in event && event.roles ? event.roles : event.decisionLayers).map((layer) => (
                <li key={layer}>{layer}</li>
              ))}
            </ul>
          </div>
          {"acts" in event && event.acts?.length ? (
            <div>
              <p className="kicker">Five-act storyline</p>
              <div className="mt-2 space-y-3">
                {event.acts.map((act) => (
                  <div key={act.title}>
                    <p className="font-semibold">{act.title}</p>
                    <p className="mt-1">{act.body}</p>
                    <p className="mt-1 text-muted">Required output. {act.output}</p>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div>
              <p className="kicker">Core decision layers</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                {event.decisionLayers.map((layer) => (
                  <li key={layer}>{layer}</li>
                ))}
              </ul>
            </div>
          )}
        </>
      ) : null}
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
        <p className="kicker">{rubricOverride?.title || (legacy ? "Championship rubric. 1,000 points." : "Event rubric. 100 points.")}</p>
        <p className="mt-1 text-muted">{handbookScoring(event)}</p>
        {rubricOverride?.body && rubricOverride.body !== officialRubric ? (
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
      {legacy && !compact ? (
        <>
          <div>
            <p className="kicker">Annual expansion</p>
            <p className="mt-1">{event.annualExpansion}</p>
          </div>
          <div>
            <p className="kicker">Round difficulty</p>
            <ul className="mt-2 list-disc space-y-1 pl-5">
              {event.escalation.map((row) => (
                <li key={row.round}>
                  <strong>{row.round}.</strong> {row.design}
                </li>
              ))}
            </ul>
          </div>
        </>
      ) : null}
      {!compact ? (
        <div>
          <p className="kicker">Rules and boundaries</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">
            {handbookRules(event).map((rule) => (
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
            {handbookPdfLabel(event.id)}
          </a>
        </p>
      ) : null}
    </div>
  );
}

export function handbookForId(id: string) {
  return getEventHandbook(id);
}
