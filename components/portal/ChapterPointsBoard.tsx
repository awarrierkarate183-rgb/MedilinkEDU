import { PortalEmpty } from "@/components/portal/PortalEmpty";
import type { ChapterStanding } from "@/lib/data/chapter-standings";

function placeLabel(place: number) {
  if (place === 1) return "1st";
  if (place === 2) return "2nd";
  if (place === 3) return "3rd";
  return `${place}th`;
}

export function ChapterPointsBoard({
  standing,
  audience,
}: {
  standing: ChapterStanding;
  audience: "advisor" | "student";
}) {
  return (
    <div className="space-y-6">
      <section className="rounded-[var(--radius)] bg-white p-5">
        <h1 className="text-xl font-semibold">Chapter points</h1>
        <p className="mt-2 text-sm text-muted">
          Season {standing.seasonLabel || "not opened"}. Administrators enter the top 3 for each event. The scoring
          rules then compute this chapter total. {audience === "advisor" ? "Advisors cannot type points here." : "Students cannot type points here."}
        </p>
        <p className="mt-4 text-3xl font-semibold">{standing.weighted.toFixed(1)}</p>
        <p className="mt-1 text-sm text-muted">
          65 percent Legacy, 25 percent Normal, 10 percent membership
          {standing.published && standing.nationalRank
            ? ` · National rank ${standing.nationalRank}`
            : ""}
          {standing.published && standing.stateRank ? ` · State rank ${standing.stateRank}` : ""}
        </p>
        <dl className="mt-4 grid gap-3 sm:grid-cols-3 text-sm">
          <div>
            <dt className="text-muted">Legacy</dt>
            <dd className="font-semibold">{standing.legacy.toFixed(1)}</dd>
          </div>
          <div>
            <dt className="text-muted">Normal Events</dt>
            <dd className="font-semibold">{standing.normal.toFixed(1)}</dd>
          </div>
          <div>
            <dt className="text-muted">Membership</dt>
            <dd className="font-semibold">{standing.membership.toFixed(1)}</dd>
          </div>
        </dl>
      </section>

      <section className="rounded-[var(--radius)] bg-white p-5">
        <h2 className="font-semibold">Events won</h2>
        {standing.wins.length ? (
          <ul className="mt-3 space-y-2 text-sm">
            {standing.wins.map((row) => (
              <li key={`${row.eventId}-${row.round}`}>
                <strong>{row.eventName}</strong>
                <span className="ml-2 text-muted">
                  {row.tier === "LEGACY" ? "Legacy" : "Normal"} · {row.round.toLowerCase()} · 1st
                </span>
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-muted">
            No first-place results are recorded for this chapter yet.
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-3 text-lg font-semibold">Top 3 and other recorded places</h2>
        {standing.placements.length ? (
          <ul className="divide-y divide-border rounded-[var(--radius)] bg-white">
            {standing.placements.map((row) => (
              <li key={`${row.eventId}-${row.round}-${row.placement}`} className="flex justify-between gap-4 px-4 py-3 text-sm">
                <span>
                  <strong>{row.eventName}</strong>
                  <span className="ml-2 text-muted">
                    {row.tier === "LEGACY" ? "Legacy" : "Normal"} · {row.round.toLowerCase()}
                    {row.placement <= 3 ? " · top 3" : ""}
                  </span>
                </span>
                <span className="shrink-0 font-semibold">{placeLabel(row.placement)}</span>
              </li>
            ))}
          </ul>
        ) : (
          <PortalEmpty
            title="No event results yet"
            body="When an administrator records the top 3 for an event, the placement and the computed chapter points appear here."
          />
        )}
      </section>
    </div>
  );
}
