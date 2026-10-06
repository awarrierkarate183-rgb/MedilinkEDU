import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { PageHero } from "@/components/public/PageHero";
import { HashAliases } from "@/components/public/HashAliases";
import { EventHandbook } from "@/components/competitions/EventHandbook";
import {
  LEGACY_POINTS,
  RANKING_WEIGHTS,
  legacyEvents,
  normalEvents,
} from "@/lib/content/competition-system";
import { HANDBOOK_PDF } from "@/lib/content/normal-event-handbook";
import { LEGACY_HANDBOOK_PDF, legacyPurpose } from "@/lib/content/legacy-event-handbook";
import { getEventHandbook } from "@/lib/content/event-handbook";
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
  return events.map((event) => {
    const handbook = getEventHandbook(event.id);
    return {
      id: event.id,
      title: `${event.number}. ${event.name}`,
      subtitle: handbook ? `${handbook.formatLabel} · ${handbook.releaseLabel}` : event.formatLabel,
      prestige,
      children: handbook ? (
        <EventHandbook event={handbook} />
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <p className="kicker">What it is</p>
            <p className="text-muted">{event.description}</p>
          </div>
          <div>
            <p className="kicker">Format</p>
            <p className="text-muted">{event.formatLabel}. High-school members. In person.</p>
          </div>
        </div>
      ),
    };
  });
}

export default async function CompetitionsPage() {
  const standings = await loadPublishedCompetitionStandings();

  return (
    <>
      <HashAliases />
      <PageHero
        kicker="Competitions"
        title="Two competition tiers. Different rules."
        lead="Open a section below. Normal Events and Legacy Events do not share one format. Each dropdown holds the full rule set for that part of the season."
      />
      <section className="band">
        <div className="container-ml">
          <Accordion
            defaultOpen="normal"
            items={[
              {
                id: "tiers",
                subtitle: "How the season is built",
                title: "Two tiers. Do not mix the rules.",
                children: (
                  <div className="space-y-3">
                    <p>
                      Normal Events are broad-access and individually advancing.
                      A student may enter up to six in a season. Legacy Events
                      are a scarce eight-student chapter delegation organized as
                      two groups of up to four.
                    </p>
                    <p>
                      You compete through a chapter. Rankings and Apex
                      qualification are chapter outcomes. The invitational is
                      individual.
                    </p>
                  </div>
                ),
              },
              {
                id: "normal",
                subtitle: "Normal Events",
                title: "Twenty events. Up to six per student.",
                childIds: normalEvents.map((event) => event.id),
                children: (
                  <div className="space-y-5">
                    <p>
                      High-school only, in person. Most events allow a solo
                      competitor or a team of up to five. A few are solo-only or
                      team-only. Regional is the starting round. Everyone who
                      competes at Regional advances to State. At State, only
                      first, second, and third in each event earn a National
                      nomination. At Nationals, first place is National
                      Champion.
                    </p>
                    <p>
                      Open an event for the official role, mechanic, work
                      product, and 100-point rubric.{" "}
                      <a href={HANDBOOK_PDF} className="font-semibold underline">
                        Download the Normal Events handbook
                      </a>
                      .
                    </p>
                    <Accordion items={eventItems(normalEvents, 1)} />
                  </div>
                ),
              },
              {
                id: "legacy",
                subtitle: "Legacy Events",
                title: "Five championship events. Eight students.",
                childIds: legacyEvents.map((event) => event.id),
                children: (
                  <div className="space-y-5">
                    <p>
                      Each chapter selects a maximum of eight Legacy-eligible
                      students and organizes them as two groups of up to four.
                      For any one Legacy event, a chapter may enter only one
                      group. The roster locks when the season begins. All
                      Legacy rounds are in person and use Advanced Release.
                    </p>
                    <p>{legacyPurpose}</p>
                    <p>
                      The five events are The Atlas Docket, The Covenant Table,
                      Black Box Protocol, The Last Mile Accord, and Nightfall
                      Command.{" "}
                      <a href={LEGACY_HANDBOOK_PDF} className="font-semibold underline">
                        Download the Legacy Championship handbook
                      </a>
                      .
                    </p>
                    <Accordion items={eventItems(legacyEvents, 2)} />
                  </div>
                ),
              },
              {
                id: "ladder",
                subtitle: "Advancement",
                title: "Same conference stages. Different cutoffs.",
                children: (
                  <div className="space-y-6">
                    <div className="grid gap-4 md:grid-cols-2">
                      <article>
                        <p className="kicker">Normal Events</p>
                        <h3 className="tab-heading text-xl">Individual or team ladder</h3>
                        <ol className="mt-3 space-y-2">
                          <li>Regional. Required starting round for every competitor.</li>
                          <li>State. Every Regional competitor advances.</li>
                          <li>Nationals. Top 3 at State receive a nomination. First place at Nationals is National Champion.</li>
                        </ol>
                      </article>
                      <article>
                        <p className="kicker">Legacy Events</p>
                        <h3 className="tab-heading text-xl">Cumulative chapter ladder</h3>
                        <ol className="mt-3 space-y-2">
                          <li>Regional. Top 5 chapter entries by points advance.</li>
                          <li>State. Top 3 by Regional plus State points combined advance.</li>
                          <li>Nationals. Cumulative total decides first place only.</li>
                        </ol>
                      </article>
                    </div>
                    <div className="overflow-x-auto">
                      <p className="kicker">Legacy points</p>
                      <table className="mt-3 w-full min-w-[28rem] text-left">
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
                ),
              },
              {
                id: "rankings",
                subtitle: "Rankings and Apex",
                title: "Annual Top 10 and the 2-year Road to Apex",
                childIds: ["apex", "road-to-apex"],
                children: (
                  <div className="space-y-6">
                    <p id="apex">
                      Annual rankings reset each season. {Math.round(RANKING_WEIGHTS.legacy * 100)}{" "}
                      percent Legacy, {Math.round(RANKING_WEIGHTS.normal * 100)}{" "}
                      percent Normal Events,{" "}
                      {Math.round(RANKING_WEIGHTS.membership * 100)} percent
                      membership. The Apex is a biennial chapter summit from a
                      running 2-year total with the same weights. It is not the
                      individual invitational.
                    </p>
                    <div className="grid gap-4 md:grid-cols-2">
                      <article>
                        <h3 className="tab-heading text-xl">Top 10 nationally</h3>
                        {standings.national.length ? (
                          <ol className="mt-3 space-y-2">
                            {standings.national.map((row) => (
                              <li key={row.chapterId}>
                                {row.rank}. {row.name}
                              </li>
                            ))}
                          </ol>
                        ) : (
                          <p className="mt-3 text-muted">
                            No published annual rankings yet.
                          </p>
                        )}
                      </article>
                      <article>
                        <h3 className="tab-heading text-xl">Top 10 per state</h3>
                        {standings.byState.length ? (
                          <div className="mt-3 space-y-4">
                            {standings.byState.map((group) => (
                              <div key={group.state}>
                                <p className="kicker">{group.state}</p>
                                <ol className="mt-1 space-y-1">
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
                          <p className="mt-3 text-muted">
                            State lists appear after a season ranking is published.
                          </p>
                        )}
                      </article>
                    </div>
                    <div id="road-to-apex">
                      <h3 className="tab-heading text-xl">Road to Apex</h3>
                      {standings.apex.length ? (
                        <ol className="mt-3 grid gap-3 md:grid-cols-2">
                          {standings.apex.map((row) => (
                            <li key={row.chapterId}>
                              Rank {row.rank}. {row.name}
                            </li>
                          ))}
                        </ol>
                      ) : (
                        <p className="mt-3 text-muted">
                          No published 2-year Apex standings yet.
                        </p>
                      )}
                    </div>
                  </div>
                ),
              },
              {
                id: "invitational",
                subtitle: "Invitational and entry",
                title: "An individual honor. You enter through a chapter.",
                children: (
                  <div className="space-y-4">
                    <p>
                      Once every two full competition years, after that cycle's
                      Nationals, MediLink announces individual invitees. A
                      four-person Legacy group can produce one invitee while
                      the other three do not. Selection uses a confidential
                      metric plus up to two chapter nominations. The metric is
                      not shown on this site.
                    </p>
                    {standings.invitees.length ? (
                      <ul className="space-y-1">
                        {standings.invitees.map((row) => (
                          <li key={row.id}>{row.name}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-muted">
                        The invitee list is public only after administrators finalize it.
                      </p>
                    )}
                    <div className="flex flex-wrap gap-3">
                      <ButtonLink href={actionHref("startChapter", "Start a Chapter")}>
                        Start a Chapter
                      </ButtonLink>
                      <ButtonLink href="/chapters" variant="secondary">
                        Find a Chapter
                      </ButtonLink>
                    </div>
                  </div>
                ),
              },
            ]}
          />
        </div>
      </section>
    </>
  );
}
