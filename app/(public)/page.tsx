import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { competitions } from "@/lib/content/competitions";
import { tracks } from "@/lib/content/curriculum";
import { getStateListings } from "@/lib/content/chapters";
import { loadPublicChapters } from "@/lib/data/public-chapters";
import { experienceSteps, lenses, MISSION } from "@/lib/content/organization";
import { actionHref } from "@/lib/content/forms";

export const dynamic = "force-dynamic";

const lensColors = {
  clinical: "bg-navy",
  financial: "bg-gold",
  technology: "bg-navy-soft",
} as const;

export default async function HomePage() {
  const schools = await loadPublicChapters();
  const schoolCount = schools.length;
  const states = getStateListings();

  return (
    <>
      <section className="relative min-h-[88vh] overflow-hidden bg-navy text-white">
        <div className="container-ml relative grid min-h-[88vh] items-center py-[calc(var(--header-h)+3.5rem)] lg:grid-cols-2">
          <div className="reveal max-w-3xl">
            <h1 className="hero-wordmark" aria-label="MediLink">
              <span className="text-white">Medi</span>
              <span className="text-gold">Link</span>
            </h1>
            <p className="mt-6 text-3xl font-semibold tracking-tight md:text-4xl">
              Healthcare is bigger than one discipline.
            </p>
            <p className="mt-5 max-w-lg text-base leading-7 text-white/75">
              MediLink gives high school students the opportunity to explore
              healthcare through clinical thinking, financial reasoning, and
              technology.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/about">Explore MediLink</ButtonLink>
              <ButtonLink href="/start-a-chapter" variant="secondary">
                Start a Chapter
              </ButtonLink>
            </div>
            <p className="mt-5">
              <ButtonLink href="/portal" variant="outline" className="border-white text-white hover:bg-white/10">
                Access Portal
              </ButtonLink>
            </p>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">What is MediLink?</p>
            <h2>A student-founded network of high school chapters.</h2>
          </div>
          <div className="max-w-3xl space-y-4 text-muted">
            <p>
              MediLink is a nonprofit for high school students. Members learn how
              real health systems work: a clinical problem, a money problem, and
              a technology problem at once.
            </p>
            <p>{MISSION}</p>
            <p>
              Every chapter uses the same five officer roles, the same public
              syllabus, and the same competition calendar. Titles and one-line
              module descriptions stay on this site. Full lessons wait behind
              roster approval.
            </p>
            <p>
              This is high school only. There is no middle-school or college
              division. Students join through a chapter, not as visitors on a
              public form.
            </p>
          </div>
          <div className="grid-cards cols-3 mt-10">
            {lenses.map((lens) => {
              const color = lensColors[lens.id as keyof typeof lensColors];
              return (
                <Card key={lens.id} className="overflow-hidden">
                  <div className={`-mx-6 -mt-6 mb-5 h-2 ${color}`} />
                  <p className="kicker">{lens.name}</p>
                  <h3 className="text-xl font-semibold">{lens.question}</h3>
                  <p className="mt-3 text-sm text-muted">{lens.summary}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      <section className="band band--paper">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">The work</p>
            <h2>Built for real-world problem solving</h2>
            <p>
              MediLink is not a lecture club. Students learn a shared syllabus,
              compete through their chapter, and turn problems into projects.
            </p>
          </div>
          <div className="grid-cards cols-4">
            {[
              {
                title: "Curriculum",
                body: "Four tracks. Twelve modules. Public titles. Full lessons for registered members.",
                href: "/curriculum",
              },
              {
                title: "Competitions",
                body: "Twenty Normal Events and three Legacy Triad events. Different rules. You compete through your chapter.",
                href: "/competitions",
              },
              {
                title: "Chapters",
                body: "School-based. Same five offices everywhere. Status is earned, not sold.",
                href: "/chapters",
              },
              {
                title: "Projects",
                body: "Ideas Lab and chapter projects live in the member portal once a roster is approved.",
                href: "/portal",
              },
            ].map((item) => (
              <Card key={item.title} className="transition-transform hover:-translate-y-0.5">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-muted">{item.body}</p>
                <p className="mt-4 text-sm font-semibold">
                  <a href={item.href}>Open</a>
                </p>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">The MediLink experience</p>
            <h2>From joining a chapter to leading one.</h2>
          </div>
          <ol className="grid gap-4 md:grid-cols-6">
            {experienceSteps.map((step, index) => (
              <li key={step.title} className="rounded-[var(--radius)] border border-border bg-cream-card/90 p-4">
                <p className="kicker">0{index + 1}</p>
                <h3 className="font-semibold">{step.title}</h3>
                <p className="mt-2 text-sm text-muted">{step.body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section className="band band--paper" id="compete">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Competitions</p>
            <h2>Two tiers. Different rules.</h2>
            <p>
              Normal Events are broad-access. Legacy Events are one team of
              four in the Legacy Triad. The Apex is a biennial chapter
              summit. The invitational is a separate individual honor.
            </p>
          </div>
          <div className="grid-cards cols-2">
            {competitions.map((event) => (
              <a
                key={event.id}
                href={`/competitions#${event.id}`}
                className={`rounded-[var(--radius)] border p-6 transition-transform hover:-translate-y-0.5 ${
                  event.prestige === 3
                    ? "border-gold/40 bg-navy text-white"
                    : event.prestige === 2
                      ? "border-navy/20 bg-cream-card/90"
                      : "border-border bg-cream-card/90"
                }`}
              >
                <p className={`kicker ${event.prestige === 3 ? "text-gold" : ""}`}>
                  {event.kicker}
                </p>
                <h3 className="text-xl font-semibold">{event.name}</h3>
                <p className={`mt-2 text-sm ${event.prestige === 3 ? "text-white/75" : "text-muted"}`}>
                  {event.summary}
                </p>
              </a>
            ))}
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Curriculum</p>
            <h2>Four tracks. Twelve modules.</h2>
            <p>Public visitors see syllabus-level information only.</p>
          </div>
          <div className="grid-cards cols-2">
            {tracks.map((track) => (
              <Card key={track.id} className="bg-cream-card/90">
                <p className="kicker">Track {track.number}</p>
                <h3 className="text-xl font-semibold">{track.name}</h3>
                <p className="mt-2 text-sm text-muted">{track.summary}</p>
                <ol className="mt-4 space-y-1 text-sm">
                  {track.modules.map((mod) => (
                    <li key={mod.code}>
                      <strong>{mod.code}</strong> {mod.name}
                    </li>
                  ))}
                </ol>
              </Card>
            ))}
          </div>
          <p className="mt-6">
            <ButtonLink href="/curriculum" variant="outline">
              Full public syllabus
            </ButtonLink>
          </p>
        </div>
      </section>

      <section className="band band--paper" id="chapters">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Chapters</p>
            <h2>Built chapter by chapter.</h2>
            <p>
              School chapters appear here when Start a Chapter is accepted.
              This page does not invent school names.
            </p>
          </div>
          {schoolCount === 0 ? (
            <div className="rounded-[var(--radius)] border border-dashed border-border bg-cream-card/90 p-8">
              <p className="font-semibold">Confirmed school chapters will appear here.</p>
              <p className="mt-2 max-w-2xl text-sm text-muted">
                MediLink currently lists {states.length} state networks:{" "}
                {states.map((state) => state.name).join(" and ")}. Those are
                state listings, not confirmed school chapters.
              </p>
              <div className="mt-5">
                <ButtonLink href="/start-a-chapter">Start a Chapter</ButtonLink>
              </div>
            </div>
          ) : (
            <div>
              <ul className="space-y-2">
                {schools.map((school) => (
                  <li key={school.id} className="font-semibold">
                    {school.school}
                    <span className="ml-2 font-normal text-muted">
                      {[school.city, school.state].filter(Boolean).join(", ")}
                    </span>
                  </li>
                ))}
              </ul>
              <div className="mt-5">
                <ButtonLink href="/chapters">See the chapter map</ButtonLink>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="band">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Partners</p>
            <h2>Work with organizations that sit in the same three rooms students study.</h2>
            <p>
              Healthcare, finance, insurance, technology, research, and
              education. Partner logos appear only after a relationship is
              public.
            </p>
          </div>
          <ButtonLink href="/partner" variant="outline">
            Partner with MediLink
          </ButtonLink>
        </div>
      </section>

      <section className="band band--paper">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Get involved</p>
            <h2>Three ways in.</h2>
          </div>
          <div className="grid-cards cols-3">
            <Card className="bg-cream-card/90">
              <h3 className="text-lg font-semibold">Start a chapter</h3>
              <p className="mt-2 text-sm text-muted">
                For schools and educators ready to charter a high school chapter.
              </p>
              <p className="mt-4">
                <ButtonLink href="/start-a-chapter" size="sm">
                  Start a Chapter
                </ButtonLink>
              </p>
            </Card>
            <Card className="bg-cream-card/90">
              <h3 className="text-lg font-semibold">Partner with MediLink</h3>
              <p className="mt-2 text-sm text-muted">
                Hospitals, insurers, health-tech firms, universities, and community groups.
              </p>
              <p className="mt-4">
                <ButtonLink href="/partner" size="sm" variant="secondary">
                  Partner
                </ButtonLink>
              </p>
            </Card>
            <Card className="bg-cream-card/90">
              <h3 className="text-lg font-semibold">Support students</h3>
              <p className="mt-2 text-sm text-muted">
                Sponsor chapters and events, or volunteer as a mentor or judge.
              </p>
              <p className="mt-4">
                <ButtonLink href="/get-involved" size="sm" variant="outline">
                  Support
                </ButtonLink>
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="band" id="news">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">News</p>
            <h2>Send your chapter photos.</h2>
            <p>
              Lake Norman Charter High School is on the News page. This
              homepage does not invent chapter wins. Send pictures of work
              that happened. Leadership decides whether they run.
            </p>
          </div>
          <div className="mb-6 grid gap-3 md:grid-cols-3">
            {["/news/lake-norman-welcome.png", "/news/lake-norman-table.png", "/news/lake-norman-review.png"].map((src) => (
              <img
                key={src}
                src={src}
                alt=""
                className="h-40 w-full rounded-[var(--radius)] object-cover"
              />
            ))}
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/news">Open News</ButtonLink>
            <ButtonLink href={actionHref("submitNews", "Submit News Chapter Photos")} variant="outline">
              Send photos
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-navy py-20 text-white">
        <div className="container-ml">
          <p className="kicker">Next</p>
          <h2 className="display max-w-3xl">Build the future of healthcare with us.</h2>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/start-a-chapter">Start a Chapter</ButtonLink>
            <ButtonLink href="/portal" variant="outline" className="border-white text-white hover:bg-white/10">
              Enter the Portal
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
