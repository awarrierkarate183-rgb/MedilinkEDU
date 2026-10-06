import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { PhotoTile } from "@/components/public/widgets";
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
          <p className="kicker">Student-founded. High school only.</p>
          <p className="hero-line mt-4 max-w-3xl">Healthcare is bigger than one discipline.</p>
          <p className="mt-5 max-w-xl text-lg font-medium text-white">
            A classroom chapter. Real students. Clinical, money, and tech in the same problem.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <ButtonLink href="/start-a-chapter" className="px-7 py-3 text-base">
              Start a Chapter
            </ButtonLink>
            <ButtonLink
              href="/about"
              variant="outline"
              className="border-white px-7 py-3 text-base text-white hover:bg-white/10"
            >
              See how it works
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container-ml meet-row">
          <img
            src="/news/lake-norman-table.png"
            alt="Ravenwood High School MediLink members at a table"
            className="meet-photo"
          />
          <div>
            <p className="kicker">A chapter meeting</p>
            <h2 className="story-title">This is what MediLink looks like.</h2>
            <p className="mt-5 max-w-lg text-lg leading-8 text-muted">
              Students sit down, name a healthcare problem, and work it from three sides.
              Not a public signup. A high school chapter with five offices, a syllabus, and a
              calendar. {featured ? `${featured.school} is on the map because MediLink accepted the request.` : "A school shows up on the map after Start a Chapter and an administrator accept it."}
            </p>
            <p className="mt-6 text-base font-semibold text-navy">
              20 Normal Events. 3 Legacy Events. 4 tracks. 5 officer roles.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <ButtonLink href="/chapters">Find a chapter</ButtonLink>
              <ButtonLink href="/start-a-chapter" variant="outline">
                Bring it to your school
              </ButtonLink>
            </div>
          </div>
        </div>
      </section>

      <section className="gold-sheet">
        <div className="container-ml py-20">
          <p className="kicker">How members think</p>
          <h2 className="story-title max-w-3xl">Ask the problem out loud.</h2>
          <div className="lens-grid mt-12">
            <Link href="/about/lenses" className="block">
              <p className="text-sm font-bold uppercase tracking-[0.14em]">Clinical</p>
              <h3 className="mt-3 text-2xl">Who is affected?</h3>
              <p className="mt-3 text-base leading-7 text-navy/80">
                Name the condition, the people, and the gap in care.
              </p>
            </Link>
            <Link href="/about/lenses" className="block">
              <p className="text-sm font-bold uppercase tracking-[0.14em]">Financial</p>
              <h3 className="mt-3 text-2xl">Who pays?</h3>
              <p className="mt-3 text-base leading-7 text-navy/80">
                Cost, coverage, and whether the idea lasts.
              </p>
            </Link>
            <Link href="/about/lenses" className="block">
              <p className="text-sm font-bold uppercase tracking-[0.14em]">Technology</p>
              <h3 className="mt-3 text-2xl">What changes access?</h3>
              <p className="mt-3 text-base leading-7 text-navy/80">
                Records, tools, and infrastructure. Outcome over novelty.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-navy py-20 text-white">
        <div className="container-ml grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div>
            <p className="kicker">Compete</p>
            <h2 className="story-title max-w-2xl text-white">Twenty Normal Events. Three Legacy Events.</h2>
            <p className="mt-5 max-w-xl text-lg leading-8 text-white/90">
              You compete through your chapter. Normal Events are broad-access. Legacy is one team of
              four in the Legacy Triad. Regional is required. State top three can go to Nationals.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <ButtonLink href="/competitions/normal">Normal Events</ButtonLink>
            <ButtonLink href="/competitions/legacy" variant="outline" className="border-white text-white hover:bg-white/10">
              Legacy Triad
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="band" id="news">
        <div className="container-ml">
          <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="kicker">From the chapter</p>
              <h2 className="story-title">Pictures from a real meeting.</h2>
            </div>
            <ButtonLink href={actionHref("submitNews", "Submit News Chapter Photos")} variant="outline">
              Send yours
            </ButtonLink>
          </div>
          <div className="yearbook">
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
        </div>
      </section>

      <section className="band band--paper">
        <div className="container-ml">
          <p className="kicker">Get in</p>
          <h2 className="story-title max-w-2xl">Four doors. Pick the one that is yours.</h2>
          <div className="path-grid mt-12">
            <Link href="/start-a-chapter" className="block">
              <h3 className="text-2xl">Start a chapter</h3>
              <p className="mt-2 max-w-md text-muted">
                A teacher or advisor requests the school. Tools open after an administrator accepts it.
              </p>
            </Link>
            <Link href="/start-a-chapter/reactivate" className="block">
              <h3 className="text-2xl">Reactivate</h3>
              <p className="mt-2 max-w-md text-muted">
                The school already had a chapter and it went quiet. Keep the history. Open the form.
              </p>
            </Link>
            <Link href="/partner" className="block">
              <h3 className="text-2xl">Partner</h3>
              <p className="mt-2 max-w-md text-muted">
                Hospitals, insurers, and health-tech sit in the same three-lens frame. Not a job board.
              </p>
            </Link>
            <Link href="/portal" className="block">
              <h3 className="text-2xl">Portal login</h3>
              <p className="mt-2 max-w-md text-muted">
                Advisors and students use the portal that matches their account.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-navy py-24 text-white">
        <div className="container-ml">
          <h2 className="story-title max-w-3xl text-white">Bring MediLink to your high school.</h2>
          <p className="mt-5 max-w-xl text-lg text-white/90">
            Open the request. Choose a password. Wait for an administrator to accept the chapter.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/start-a-chapter">Start a Chapter</ButtonLink>
            <ButtonLink href="/curriculum" variant="outline" className="border-white text-white hover:bg-white/10">
              Read the curriculum
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
