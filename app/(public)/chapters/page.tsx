import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/public/PageHero";
import { ChapterExplorer } from "@/components/public/ChapterExplorer";
import { loadPublicChapters } from "@/lib/data/public-chapters";
import { actionHref } from "@/lib/content/forms";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chapters",
  description:
    "Find a MediLink high school chapter. School listings appear when the board records them.",
};

export default async function ChaptersPage() {
  const chapters = await loadPublicChapters();
  return (
    <>
      <PageHero
        kicker="Chapters"
        title="Chapter network"
        lead="Find a chapter, see recorded status, or start one at your high school. This page only shows approved public information."
      />
      <section className="band">
        <div className="container-ml">
          <ChapterExplorer chapters={chapters} />
        </div>
      </section>
      <section className="band band--paper">
        <div className="container-ml grid gap-8 md:grid-cols-2">
          <div>
            <p className="kicker">Advisor information</p>
            <h2 className="text-3xl font-semibold">Advisors run chapters from the portal.</h2>
            <p className="mt-4 text-muted">
              Public cards never show student emails, student phone numbers,
              private advisor contact information, login codes, or internal IDs.
            </p>
          </div>
          <div className="space-y-3 text-sm text-muted">
            <p>Start a chapter: new schools.</p>
            <p>Reactivate a chapter: keep the name and history with new student leadership.</p>
            <p>Chapter resources: existing chapters that need the kit or coaching.</p>
          </div>
        </div>
        <div className="container-ml mt-8 flex flex-wrap gap-3">
          <ButtonLink href="/start-a-chapter">Start a Chapter</ButtonLink>
          <ButtonLink href="/chapter-support" variant="secondary">
            Chapter resources
          </ButtonLink>
          <ButtonLink href={actionHref("chapterSupport", "Chapter Support")} variant="outline">
            Request support
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
