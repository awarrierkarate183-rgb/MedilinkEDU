import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { PageHero } from "@/components/public/PageHero";
import { competitions } from "@/lib/content/competitions";
import { publicStandings, currentCycleLabel, pointSchedule, NATIONALS_MAX, ONE_TIME_MAX } from "@/lib/content/points";
import { getStateListings } from "@/lib/content/chapters";
import { actionHref } from "@/lib/content/forms";

export const metadata: Metadata = {
  title: "Competitions",
  description:
    "MediLink competitions: three one-time annual events, Nationals on a ladder, and a biennial Apex.",
};

export default function CompetitionsPage() {
  const standings = publicStandings();
  const states = getStateListings();
  const hasRecordedPoints = standings.some((row) => row.points > 0);

  return (
    <>
      <PageHero
        kicker="Competitions"
        title="Five competitions. Two structures."
        lead="Innovation Challenge, Policy Cup, and Research Symposium each run once a year. Nationals is the only event that climbs Regional to State to National. Every other year that National round becomes the Apex. The Apex is not a sixth case."
      />

      <section className="band">
        <div className="container-ml">
          <Accordion
            items={competitions.map((event) => ({
              id: event.id,
              title: event.name,
              subtitle: event.kicker,
              prestige: event.prestige,
              children: (
                <div className="grid gap-4 md:grid-cols-2">
                  {[
                    ["What it is", event.what],
                    ["Who it is for", event.who],
                    ["Format", event.format],
                    ["How it works", event.how],
                    ["What students create", event.create],
                    ["How it connects to MediLink", event.connects],
                    ["Points", event.points],
                    ["Timeline", event.timeline],
                  ].map(([label, body]) => (
                    <div key={label}>
                      <p className="kicker">{label}</p>
                      <p className={event.prestige === 3 ? "text-white/80" : "text-muted"}>
                        {body}
                      </p>
                    </div>
                  ))}
                  <p>
                    <a className="font-semibold underline" href={event.resource}>
                      Resource link
                    </a>
                  </p>
                </div>
              ),
            }))}
          />
        </div>
      </section>

      <section className="band band--paper" id="ladder">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Nationals only</p>
            <h2>Regional. State. National.</h2>
            <p>The other three events have no sub-levels.</p>
          </div>
          <ol className="grid gap-4 md:grid-cols-3">
            {competitions
              .find((item) => item.id === "nationals")
              ?.ladder?.map((level) => (
                <li key={level.level} className="rounded-[var(--radius)] bg-white p-6">
                  <p className="kicker">{level.id === "ladder" ? "Level 1" : level.level}</p>
                  <h3 className="text-xl font-semibold">{level.level}</h3>
                  <p className="mt-2 text-sm text-muted">{level.body}</p>
                </li>
              ))}
          </ol>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy text-white" id="apex">
        <div className="container-ml py-16">
          <p className="kicker">MediLink Apex</p>
          <h2 className="display max-w-4xl">Champions of champions. Not a sixth case.</h2>
          <p className="lead mt-5 text-white/75">
            Championship round, sponsor networking fair, keynotes, and a closing
            awards gala. Current cycle: {currentCycleLabel}. A new cycle begins
            at zero after each Apex.
          </p>
        </div>
      </section>

      <section className="band" id="road-to-apex">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Road to Apex</p>
            <h2>Point schedule</h2>
            <p>
              Points come from a board-maintained ledger. These numbers are not
              live scores. Public rankings are not shown until the organization
              decides how rankings should work.
            </p>
          </div>
          <div className="grid-cards cols-2">
            <article className="rounded-[var(--radius)] border border-border p-6">
              <h3 className="font-semibold">One-time competitions</h3>
              <ul className="mt-3 space-y-1 text-sm text-muted">
                <li>Participation {pointSchedule.oneTime.participation}</li>
                <li>Top 10 {pointSchedule.oneTime.top10}</li>
                <li>Top 3 {pointSchedule.oneTime.top3}</li>
                <li>Win {pointSchedule.oneTime.win}</li>
                <li>Maximum {ONE_TIME_MAX}</li>
              </ul>
            </article>
            <article className="rounded-[var(--radius)] border border-border p-6">
              <h3 className="font-semibold">Nationals ladder</h3>
              <ul className="mt-3 space-y-1 text-sm text-muted">
                {Object.entries(pointSchedule.nationalsLadder).map(([key, value]) => (
                  <li key={key}>
                    {key}: {value}
                  </li>
                ))}
                <li>Maximum in a single year {NATIONALS_MAX}</li>
              </ul>
            </article>
          </div>
          {!hasRecordedPoints ? (
            <p className="mt-6 text-sm text-muted">
              No recorded results for cycle {currentCycleLabel} yet. State
              listings currently include {states.map((s) => s.name).join(" and ")}.
            </p>
          ) : null}
        </div>
      </section>

      <section className="band band--paper">
        <div className="container-ml">
          <h2 className="text-3xl font-semibold">You compete through a chapter</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Start one at your high school, or find a chapter that is already
            running. Flagship-Eligible is the path to Nationals.
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
