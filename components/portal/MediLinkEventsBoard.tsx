import {
  opportunitiesByKind,
  opportunitiesByRegion,
  opportunityKinds,
  opportunityRegions,
  regionName,
} from "@/lib/content/medilink-events";

export function MediLinkEventsBoard({ showIntro = true }: { showIntro?: boolean }) {
  const volunteer = opportunitiesByKind("volunteer");
  return (
    <div className="space-y-8">
      {showIntro ? (
        <section className="rounded-[var(--radius)] bg-white p-5">
          <h1 className="text-xl font-semibold">MediLink Events</h1>
          <p className="mt-2 text-sm text-muted">
            Volunteer openings by region, MediLink-hosted events, internships, and research seats MediLink
            gives out. A listing appears only when MediLink publishes it.
          </p>
        </section>
      ) : null}

      <section className="rounded-[var(--radius)] bg-white p-5">
        <p className="kicker">Volunteer</p>
        <h2 className="text-lg font-semibold">Volunteer by region</h2>
        <p className="mt-2 text-sm text-muted">{opportunityKinds[0].lead}</p>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {opportunityRegions.map((region) => {
            const rows = opportunitiesByRegion(region.id);
            return (
              <article key={region.id} className="border-t border-border pt-4 first:border-t-0 first:pt-0 md:border-t-0 md:pt-0">
                <h3 className="font-semibold">{region.name}</h3>
                {rows.length ? (
                  <ul className="mt-2 space-y-2 text-sm">
                    {rows.map((item) => (
                      <li key={item.id}>
                        <strong>{item.title}</strong>
                        <p className="text-muted">{item.summary}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-muted">No volunteer listing is open in {region.name} yet.</p>
                )}
              </article>
            );
          })}
        </div>
        {!volunteer.length ? null : (
          <p className="mt-4 text-sm text-muted">{volunteer.length} volunteer listing{volunteer.length === 1 ? "" : "s"} published.</p>
        )}
      </section>

      {opportunityKinds
        .filter((kind) => kind.id !== "volunteer")
        .map((kind) => {
          const rows = opportunitiesByKind(kind.id);
          return (
            <section key={kind.id} className="rounded-[var(--radius)] bg-white p-5">
              <p className="kicker">{kind.title}</p>
              <h2 className="text-lg font-semibold">{kind.title}</h2>
              <p className="mt-2 text-sm text-muted">{kind.lead}</p>
              {rows.length ? (
                <ul className="mt-4 space-y-3">
                  {rows.map((item) => (
                    <li key={item.id}>
                      <strong>{item.title}</strong>
                      <p className="text-sm text-muted">
                        {regionName(item.region)}. {item.summary}
                      </p>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm text-muted">{kind.empty}</p>
              )}
            </section>
          );
        })}
    </div>
  );
}
