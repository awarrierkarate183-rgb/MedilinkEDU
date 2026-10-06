import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
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
        lead="Find a school, see how a chapter starts, and open the map. This page only shows approved public information."
      />
      <section className="band">
        <div className="container-ml">
          <Accordion
            defaultOpen="map"
            items={[
              {
                id: "map",
                subtitle: "Find a chapter",
                title: "Search the map of accepted schools",
                children: <ChapterExplorer chapters={chapters} />,
              },
              {
                id: "start",
                subtitle: "Start a chapter",
                title: "A school form becomes a map pin after accept",
                children: (
                  <div className="space-y-3">
                    <p>
                      An advisor fills Start a Chapter with the school name,
                      city, and state, then chooses a portal password. MediLink
                      reviews the request. When it is accepted, the school
                      appears on this map with a pin for that state.
                    </p>
                    <ButtonLink href="/start-a-chapter">Start a Chapter</ButtonLink>
                  </div>
                ),
              },
              {
                id: "advisor",
                subtitle: "Advisors",
                title: "Advisors run the chapter from the portal",
                children: (
                  <p>
                    After accept, the advisor signs in, adds students, assigns
                    competitions, and sends updates. Public cards never show
                    student emails, student phone numbers, private advisor
                    contact information, login codes, or internal IDs.
                  </p>
                ),
              },
              {
                id: "status",
                subtitle: "Chapter status",
                title: "Founding, Established, Flagship-Eligible",
                children: (
                  <ul className="list-disc space-y-2 pl-5">
                    <li>Founding. The chapter was accepted and is building its first roster and calendar.</li>
                    <li>Established. The chapter has earned that status through recorded work, not a purchase.</li>
                    <li>Flagship-Eligible. A later status after the chapter meets the published bar.</li>
                  </ul>
                ),
              },
              {
                id: "privacy",
                subtitle: "What stays private",
                title: "This page does not invent locations or names",
                children: (
                  <p>
                    Pins mark the state entered on the Start a Chapter form, not
                    a street address. Only accepted schools appear. Pending
                    requests stay in the admin queue until MediLink decides.
                  </p>
                ),
              },
              {
                id: "support",
                subtitle: "Already a chapter",
                title: "Reactivate or request support",
                children: (
                  <div className="space-y-4">
                    <p>
                      Reactivate keeps the name and history with new student
                      leadership. Chapter resources are for existing chapters
                      that need the kit or coaching.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <ButtonLink href="/chapter-support" variant="secondary">
                        Chapter resources
                      </ButtonLink>
                      <ButtonLink href={actionHref("chapterSupport", "Chapter Support")} variant="outline">
                        Request support
                      </ButtonLink>
                      <ButtonLink href={actionHref("reactivateChapter", "Chapter Reactivation")} variant="outline">
                        Reactivate
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
