import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoTile, QuietLinks, SplitFeature, StatStrip } from "@/components/public/widgets";
import { loadPublicChapters } from "@/lib/data/public-chapters";
import { chapterPhotos } from "@/lib/content/news";
import { actionHref } from "@/lib/content/forms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const schools = await loadPublicChapters();
  const featured = schools[0];

  return (
    <>
      <section className="photo-hero">
        <img
          src="/news/lake-norman-welcome.png"
          alt="Ravenwood High School MediLink members"
          className="photo-hero__image"
        />
        <div className="photo-hero__shade" />
        <div className="relative mx-auto flex min-h-[86vh] w-full max-w-[1500px] flex-col justify-end px-6 pb-16 pt-[calc(var(--header-h)+3rem)] lg:px-14">
          <p className="kicker text-gold">Student-founded. High school only.</p>
          <h1 className="hero-wordmark mt-3" aria-label="MediLink">
            <span className="text-white">Medi</span>
            <span className="text-gold">Link</span>
          </h1>
          <p className="hero-line mt-8 max-w-2xl">Healthcare is bigger than one discipline.</p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <ButtonLink href="/start-a-chapter" className="px-6 py-3">
              Start a Chapter
            </ButtonLink>
            <ButtonLink
              href="/about"
              variant="outline"
              className="border-white/50 px-6 py-3 text-white hover:bg-white/10"
            >
              Explore MediLink
            </ButtonLink>
            <ButtonLink
              href="/portal"
              variant="ghost"
              className="px-1 py-2 text-white/80 hover:bg-transparent hover:text-white"
            >
              Portal Login
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container-ml">
          <StatStrip
            items={[
              { value: "20", label: "Normal Events" },
              { value: "3", label: "Legacy Events" },
              { value: "4", label: "Curriculum tracks" },
              { value: "5", label: "Officer roles" },
              { value: String(schools.length), label: "Accepted chapters" },
            ]}
          />
        </div>
      </section>

      <section className="band band--paper">
        <div className="container-ml space-y-6">
          <SplitFeature
            href="/chapters"
            image="/news/lake-norman-welcome.png"
            kicker="Chapters"
            title="A school chapter. Not a public signup."
            body="Students join through a high school chapter. The same five offices, the same syllabus, and the same calendar sit in every school MediLink accepts."
            action="Open the map"
          />
          <SplitFeature
            href="/competitions"
            kicker="Compete"
            title="Twenty Normal Events. Three Legacy Events."
            body="You compete through your chapter. Normal Events are broad-access. Legacy is one team of four in the Legacy Triad."
            action="See the events"
            tone="navy"
          />
        </div>
      </section>

      <section className="band">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">How members think</p>
            <h2>Three lenses. One problem.</h2>
          </div>
          <div className="grid gap-10 md:grid-cols-3">
            <Link href="/about/lenses" className="block">
              <p className="kicker">Clinical</p>
              <h3 className="tab-heading text-2xl">Who is affected?</h3>
              <p className="mt-3 text-muted">Name the condition, the people, and the gap in care.</p>
            </Link>
            <Link href="/about/lenses" className="block">
              <p className="kicker">Financial</p>
              <h3 className="tab-heading text-2xl">Who pays?</h3>
              <p className="mt-3 text-muted">Cost, coverage, and whether the idea lasts.</p>
            </Link>
            <Link href="/about/lenses" className="block">
              <p className="kicker">Technology</p>
              <h3 className="tab-heading text-2xl">What changes access?</h3>
              <p className="mt-3 text-muted">Records, tools, and infrastructure. Outcome over novelty.</p>
            </Link>
          </div>
        </div>
      </section>

      <section className="band band--paper">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">The work</p>
            <h2>Learn it. Build it. Compete.</h2>
          </div>
          <QuietLinks
            items={[
              { href: "/curriculum", label: "Four tracks", note: "Curriculum" },
              { href: "/curriculum", label: "Twelve modules", note: "Syllabus" },
              { href: "/competitions/normal", label: "Normal Events", note: "Compete" },
              { href: "/competitions/legacy", label: "Legacy Triad", note: "Legacy" },
              { href: "/portal", label: "Ideas Lab", note: "Portal" },
              { href: "/start-a-chapter", label: "Start a chapter", note: "Apply" },
            ]}
          />
        </div>
      </section>

      <section className="band" id="chapters">
        <div className="container-ml grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div>
            <p className="kicker">On the map</p>
            <h2>{featured ? featured.school : "Chapters appear when they are accepted."}</h2>
            <p className="mt-4 max-w-xl text-muted">
              {featured
                ? `${[featured.city, featured.state].filter(Boolean).join(", ")} is on the public map because MediLink accepted the request. This page does not invent school names.`
                : "A school appears here after Start a Chapter and an administrator accept it."}
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <ButtonLink href="/chapters">Chapter map</ButtonLink>
              <ButtonLink href="/start-a-chapter" variant="outline">
                Start a Chapter
              </ButtonLink>
            </div>
          </div>
          <img
            src="/news/lake-norman-table.png"
            alt="Ravenwood High School MediLink members at a table"
            className="h-72 w-full rounded-[var(--radius)] object-cover"
          />
        </div>
      </section>

      <section className="band band--paper" id="news">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">News</p>
            <h2>Real chapter photos.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            {chapterPhotos.map((item, index) => (
              <PhotoTile
                key={item.src}
                href="/news"
                image={item.src}
                kicker="Ravenwood High School"
                title={["Welcome", "Table work", "Review"][index] || "Chapter photo"}
              />
            ))}
          </div>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href="/news">Open News</ButtonLink>
            <ButtonLink href={actionHref("submitNews", "Submit News Chapter Photos")} variant="outline">
              Send photos
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Get involved</p>
            <h2>Four ways in.</h2>
          </div>
          <QuietLinks
            items={[
              { href: "/start-a-chapter", label: "Start a chapter", note: "Schools" },
              { href: "/start-a-chapter/reactivate", label: "Reactivate", note: "Return" },
              { href: "/partner", label: "Partner", note: "Organizations" },
              { href: "/portal", label: "Portal login", note: "Members" },
            ]}
          />
        </div>
      </section>

      <section className="bg-navy py-20 text-white">
        <div className="container-ml">
          <p className="kicker">Next</p>
          <h2 className="display max-w-3xl">Bring MediLink to your high school.</h2>
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
