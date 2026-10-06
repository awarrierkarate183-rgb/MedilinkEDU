import Link from "next/link";
import { ButtonLink } from "@/components/ui/Button";
import { chapterPhotos } from "@/lib/content/news";
import { photoEmailHref } from "@/lib/content/forms";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const welcome = chapterPhotos[0];
  const table = chapterPhotos[1];
  const review = chapterPhotos[2];

  return (
    <>
      <section className="home-hero">
        <div className="container-ml home-split">
          <div>
            <p className="kicker">High school chapters</p>
            <h1 className="hero-wordmark mt-3" aria-label="MediLink">
              <span className="text-navy">Medi</span>
              <span className="text-gold">Link</span>
            </h1>
            <p className="hero-line mt-7 max-w-xl">Healthcare is bigger than one discipline.</p>
            <p className="mt-5 max-w-md text-lg leading-8 text-muted">
              Students sit down with a healthcare problem and look at it three ways: the patient, the
              money, and the tools. That is a MediLink chapter. Not a lecture club. A room of high
              school students doing the work.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <ButtonLink href="/start-a-chapter" className="px-7 py-3 text-base">
                Start a Chapter
              </ButtonLink>
              <ButtonLink href="/about" variant="outline" className="px-7 py-3 text-base">
                See how it works
              </ButtonLink>
            </div>
          </div>
          <figure>
            <img src={welcome.src} alt={welcome.alt} className="home-photo home-photo--hero" />
            <figcaption className="home-caption">{welcome.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="band band--paper">
        <div className="container-ml home-split">
          <div>
            <p className="kicker">In the room</p>
            <h2 className="story-title">This is a chapter meeting.</h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-muted">
              They read a case. They argue about who gets hurt, who pays, and whether the idea
              actually works. Then they write it down. That is a normal week.
            </p>
            <p className="mt-5 max-w-md text-lg leading-8 text-muted">
              A school shows up on the map after Start a Chapter and an administrator accepts the
              request.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/chapters">Find a chapter</ButtonLink>
              <ButtonLink href="/start-a-chapter" variant="outline">
                Bring it to your school
              </ButtonLink>
            </div>
          </div>
          <figure>
            <img src={table.src} alt={table.alt} className="home-photo home-photo--meet" />
            <figcaption className="home-caption">{table.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="gold-sheet">
        <div className="container-ml py-20">
          <p className="kicker">How members think</p>
          <h2 className="story-title max-w-2xl">Ask the problem out loud.</h2>
          <div className="lens-grid mt-12">
            <Link href="/about/lenses" className="block">
              <p className="text-sm font-bold uppercase tracking-[0.14em]">Clinical</p>
              <h3 className="mt-3 text-2xl">Who is affected?</h3>
              <p className="mt-3 max-w-xs text-base leading-7 text-navy/80">
                Name the condition, the people, and the gap in care.
              </p>
            </Link>
            <Link href="/about/lenses" className="block">
              <p className="text-sm font-bold uppercase tracking-[0.14em]">Financial</p>
              <h3 className="mt-3 text-2xl">Who pays?</h3>
              <p className="mt-3 max-w-xs text-base leading-7 text-navy/80">
                Cost, coverage, and whether the idea lasts.
              </p>
            </Link>
            <Link href="/about/lenses" className="block">
              <p className="text-sm font-bold uppercase tracking-[0.14em]">Technology</p>
              <h3 className="mt-3 text-2xl">What changes access?</h3>
              <p className="mt-3 max-w-xs text-base leading-7 text-navy/80">
                Records, tools, and infrastructure. Outcome over novelty.
              </p>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-navy py-20 text-white">
        <div className="container-ml max-w-3xl">
          <p className="kicker">Compete</p>
          <h2 className="story-title max-w-xl text-white">You compete through your chapter.</h2>
          <p className="mt-5 max-w-xl text-lg leading-8 text-white/90">
            Twenty Normal Events, six-event cap. Three Legacy Events, one team of four. Regional is
            required. State top three can go to Nationals.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <ButtonLink href="/competitions/normal">Normal Events</ButtonLink>
            <ButtonLink href="/competitions/legacy" variant="outline" className="border-white text-white hover:bg-white/10">
              Legacy Triad
            </ButtonLink>
          </div>
        </div>
      </section>

      <section className="band" id="news">
        <div className="container-ml home-split">
          <div>
            <p className="kicker">From the chapter</p>
            <h2 className="story-title">These pictures already happened.</h2>
            <p className="mt-5 max-w-md text-lg leading-8 text-muted">
              If your chapter met, competed, or served, send the photos. Use the school name. Write one
              sentence about the frame. Ask the people in the picture first.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href={photoEmailHref()}>Email pictures</ButtonLink>
              <ButtonLink href="/news" variant="outline">
                Open News
              </ButtonLink>
            </div>
          </div>
          <figure>
            <img src={review.src} alt={review.alt} className="home-photo home-photo--meet" />
            <figcaption className="home-caption">{review.caption}</figcaption>
          </figure>
        </div>
      </section>

      <section className="band band--paper">
        <div className="container-ml">
          <p className="kicker">Get in</p>
          <h2 className="story-title max-w-2xl">Pick the door that is yours.</h2>
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
