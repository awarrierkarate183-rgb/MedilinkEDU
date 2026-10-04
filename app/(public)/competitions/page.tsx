import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { PageHero } from "@/components/public/PageHero";
import { HashAliases } from "@/components/public/HashAliases";
import {
  LEGACY_POINTS,
  RANKING_WEIGHTS,
  legacyEvents,
  normalEvents,
} from "@/lib/content/competition-system";
import { loadPublishedCompetitionStandings } from "@/lib/content/rankings";
import { actionHref } from "@/lib/content/forms";

export const metadata: Metadata = {
  title: "Competitions",
  description:
    "MediLink competitions: 20 Normal Events, 5 Legacy Events, annual chapter rankings, a biennial Apex, and a separate biennial individual invitational.",
};

function eventItems(
  events: typeof normalEvents,
  prestige: number,
) {
  return events.map((event) => ({
    id: event.id,
    title: `${event.number}. ${event.name}`,
    subtitle: event.formatLabel,
    prestige,
    children: (
      <div className="grid gap-4 md:grid-cols-2">
        <div>
          <p className="kicker">What it is</p>
          <p className={prestige === 2 ? "text-muted" : "text-muted"}>{event.description}</p>
        </div>
        <div>
          <p className="kicker">Format</p>
          <p className="text-muted">{event.formatLabel}. High-school members. In person.</p>
        </div>
      </div>
    ),
  }));
}

export default async function CompetitionsPage() {
  const standings = await loadPublishedCompetitionStandings();

  return (
    <>
      <HashAliases />
      <PageHero
        kicker="Competitions"
        title="Two competition tiers. Different rules."
        lead="Normal Events are broad-access and individually advancing. Legacy Events are a scarce eight-student chapter delegation. Do not treat them as one shared format."
      />

      <section className="band" id="normal">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Normal Events</p>
            <h2>Twenty events. Up to six per student.</h2>
            <p>
              High-school only, in person. A student may register for up to six
              Normal Events in a season. Most events allow a solo competitor or
              a team of up to five. A few are solo-only or team-only. Regional
              is the starting round. Everyone who competes at Regional advances
              to State. At State, only first, second, and third in each event
              earn a National nomination. At Nationals, first place is National
              Champion. Second and third receive prizes and finalist
              recognition.
            </p>
          </div>
          <Accordion items={eventItems(normalEvents, 1)} />
        </div>
      </section>

      <section className="band band--paper" id="legacy">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Legacy Events</p>
            <h2>Five events. Eight students. Two groups.</h2>
            <p>
              Each chapter selects exactly eight students for the season and
              splits them into two groups of four. A chapter may enter only one
              of those groups into any single Legacy event, never both. The
              chapter decides how to divide the five events between the two
              groups. The eight-person roster locks when the season begins. It
              can change only for withdrawal from school, serious medical
              unavailability, or another nationally approved reason. A new
              season starts with a new roster.
            </p>
          </div>
          <Accordion items={eventItems(legacyEvents, 2)} />
        </div>
      </section>

      <section className="band" id="ladder">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Advancement</p>
            <h2>Same conference stages. Different cutoffs.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[var(--radius)] bg-white p-6">
              <p className="kicker">Normal Events</p>
              <h3 className="text-xl font-semibold">Individual or team ladder</h3>
              <ol className="mt-3 space-y-2 text-sm text-muted">
                <li>Regional. Required starting round for every competitor.</li>
                <li>State. Every Regional competitor advances.</li>
                <li>Nationals. Top 3 at State receive a nomination. First place at Nationals is National Champion.</li>
              </ol>
            </article>
            <article className="rounded-[var(--radius)] bg-white p-6">
              <p className="kicker">Legacy Events</p>
              <h3 className="text-xl font-semibold">Cumulative chapter ladder</h3>
              <ol className="mt-3 space-y-2 text-sm text-muted">
                <li>Regional. Top 5 chapter entries by points advance.</li>
                <li>State. Top 3 by Regional plus State points combined advance.</li>
                <li>Nationals. Cumulative total decides first place only. Second and third are finalists, with no consolation prizes.</li>
              </ol>
            </article>
          </div>
          <div className="mt-8 overflow-x-auto rounded-[var(--radius)] bg-white p-6">
            <p className="kicker">Legacy points</p>
            <h3 className="text-xl font-semibold">Placement table</h3>
            <table className="mt-4 w-full min-w-[28rem] text-left text-sm">
              <thead>
                <tr className="text-muted">
                  <th className="py-2 pr-4 font-semibold">Placement</th>
                  <th className="py-2 pr-4 font-semibold">Regional</th>
                  <th className="py-2 pr-4 font-semibold">State</th>
                  <th className="py-2 font-semibold">National</th>
                </tr>
              </thead>
              <tbody>
                {[1, 2, 3, 4, 5].map((place) => (
                  <tr key={place} className="border-t border-border">
                    <td className="py-2 pr-4">{place === 1 ? "1st" : place === 2 ? "2nd" : place === 3 ? "3rd" : `${place}th`}</td>
                    <td className="py-2 pr-4">{LEGACY_POINTS.REGIONAL[place as 1 | 2 | 3 | 4 | 5]}</td>
                    <td className="py-2 pr-4">{LEGACY_POINTS.STATE[place as 1 | 2 | 3 | 4 | 5]}</td>
                    <td className="py-2">
                      {place <= 3 ? LEGACY_POINTS.NATIONAL[place as 1 | 2 | 3] : "n/a"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section className="band band--paper" id="rankings">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Annual chapter rankings</p>
            <h2>Top 10 nationally. Top 10 per state.</h2>
            <p>
              Recalculated each season. {Math.round(RANKING_WEIGHTS.legacy * 100)}{" "}
              percent Legacy performance, {Math.round(RANKING_WEIGHTS.normal * 100)}{" "}
              percent Normal Event performance,{" "}
              {Math.round(RANKING_WEIGHTS.membership * 100)} percent membership
              and participation. This list resets every season. It is not the
              Road to Apex 2-year cumulative standing.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[var(--radius)] bg-white p-6">
              <h3 className="font-semibold">Top 10 chapters nationally</h3>
              {standings.national.length ? (
                <ol className="mt-3 space-y-2 text-sm">
                  {standings.national.map((row) => (
                    <li key={row.chapterId}>
                      {row.rank}. {row.name}
                    </li>
                  ))}
                </ol>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  No published annual rankings yet. Rankings appear after
                  administrators enter results and publish the season list.
                </p>
              )}
            </article>
            <article className="rounded-[var(--radius)] bg-white p-6">
              <h3 className="font-semibold">Top 10 chapters per state</h3>
              {standings.byState.length ? (
                <div className="mt-3 space-y-4">
                  {standings.byState.map((group) => (
                    <div key={group.state}>
                      <p className="kicker">{group.state}</p>
                      <ol className="mt-1 space-y-1 text-sm">
                        {group.rows.map((row) => (
                          <li key={row.chapterId}>
                            {row.rank}. {row.name}
                          </li>
                        ))}
                      </ol>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="mt-3 text-sm text-muted">
                  State lists use the same season scores. Nothing is shown until
                  a season ranking is published.
                </p>
              )}
            </article>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy text-white" id="apex">
        <div className="container-ml py-16">
          <p className="kicker">MediLink Apex</p>
          <h2 className="display max-w-4xl">A chapter summit. Not an individual honor.</h2>
          <p className="lead mt-5 max-w-3xl text-white/75">
            Every two years, top-ranked chapters by a running 2-year cumulative
            total qualify. The weights match the annual ranking: 65 percent
            Legacy, 25 percent Normal Events, 10 percent membership. The total
            does not reset each season. Active regions keep a minimum number of
            spots. The Apex includes sponsor networking and a gala. It is not
            the biennial individual invitational.
          </p>
        </div>
      </section>

      <section className="band" id="road-to-apex">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Road to Apex</p>
            <h2>2-year cumulative standings</h2>
            <p>
              This ledger is a running two-year chapter total. It is not the
              annual Top 10. Qualification uses Legacy and Normal Event
              performance plus membership, not the retired one-time events.
            </p>
          </div>
          {standings.apex.length ? (
            <ol className="grid gap-3 md:grid-cols-2">
              {standings.apex.map((row) => (
                <li key={row.chapterId} className="rounded-[var(--radius)] border border-border p-5">
                  <p className="kicker">Rank {row.rank}</p>
                  <p className="font-semibold">{row.name}</p>
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-sm text-muted">
              No published 2-year Apex standings yet. Public numbers appear
              after administrators publish the current cycle ledger.
            </p>
          )}
        </div>
      </section>

      <section className="band band--paper" id="invitational">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Biennial individual invitational</p>
            <h2>An individual honor. Separate from the Apex.</h2>
            <p>
              Once every two full competition years, after that cycle's
              Nationals, MediLink announces a list of individual invitees. This
              is not a chapter or team outcome. A four-person Legacy group can
              produce one invitee while the other three do not.
            </p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <article className="rounded-[var(--radius)] bg-white p-6">
              <h3 className="font-semibold">How someone is considered</h3>
              <p className="mt-2 text-sm text-muted">
                Selection uses a confidential individual performance metric plus
                up to two chapter nominations per chapter. A nomination is a
                path to consideration, not an automatic invite. The metric
                itself is not shown on this site or in the student portal.
              </p>
            </article>
            <article className="rounded-[var(--radius)] bg-white p-6">
              <h3 className="font-semibold">Announced invitees</h3>
              {standings.invitees.length ? (
                <ul className="mt-2 space-y-1 text-sm">
                  {standings.invitees.map((row) => (
                    <li key={row.id}>{row.name}</li>
                  ))}
                </ul>
              ) : (
                <p className="mt-2 text-sm text-muted">
                  The invitee list is public only after administrators finalize
                  it. Until then, no names appear here.
                </p>
              )}
            </article>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container-ml">
          <h2 className="text-3xl font-semibold">You compete through a chapter</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Register for Normal Events, and pursue a Legacy spot, through your
            school chapter. Rankings and Apex qualification are chapter
            outcomes. The invitational is individual.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={actionHref("startChapter", "Start a Chapter")}>
              Start a Chapter
            </ButtonLink>
            <ButtonLink href="/chapters" variant="secondary">
              Find a Chapter
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
