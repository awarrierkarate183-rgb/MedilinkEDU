import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { PageHero } from "@/components/public/PageHero";
import { tracks } from "@/lib/content/curriculum";

export const metadata: Metadata = {
  title: "Curriculum",
  description:
    "MediLink public syllabus. Four tracks and twelve modules covering health economics, health tech, financial modeling, and competition prep.",
};

export default function CurriculumPage() {
  return (
    <>
      <PageHero
        kicker="Curriculum"
        title="Four tracks. Twelve modules."
        lead="Titles and short descriptions are public. Open a track for every module and the lab preview. Full lessons wait until a chapter approves you."
      />
      <section className="band">
        <div className="container-ml">
          <Accordion
            defaultOpen="how-it-works"
            items={[
              {
                id: "how-it-works",
                subtitle: "How the syllabus works",
                title: "Public titles. Full files behind roster approval.",
                children: (
                  <div className="space-y-3">
                    <p>
                      Every chapter uses the same four tracks. Visitors see
                      names, one-line descriptions, and the lab preview. Lesson
                      slides, worksheets, and packets stay in the member portal.
                    </p>
                    <p>
                      Track 1 teaches who pays. Track 2 teaches records and
                      tools. Track 3 asks whether an idea lasts. Track 4 ties
                      the three lenses to Normal and Legacy events.
                    </p>
                  </div>
                ),
              },
              ...tracks.map((track) => ({
                id: track.id,
                subtitle: `Track ${track.number}`,
                title: track.name,
                children: (
                  <div className="space-y-4">
                    <p>{track.intro}</p>
                    <ol className="grid gap-4 md:grid-cols-3">
                      {track.modules.map((mod) => (
                        <li key={mod.code} className="rounded-lg bg-surface p-4">
                          <p className="kicker">{mod.code}</p>
                          <h3 className="tab-heading text-lg">{mod.name}</h3>
                          <p className="mt-2 text-sm text-muted">{mod.description}</p>
                        </li>
                      ))}
                    </ol>
                    <p>
                      <strong>Lab preview.</strong> {track.lab} Full files wait
                      behind roster approval.
                    </p>
                  </div>
                ),
              })),
              {
                id: "member-access",
                subtitle: "Member access",
                title: "Registered members open the full curriculum",
                children: (
                  <div className="space-y-4">
                    <p>
                      New schools start a chapter instead of emailing for a dump
                      of lessons. After MediLink accepts the chapter, the
                      advisor adds students. Those students sign in and open
                      Track files from the portal.
                    </p>
                    <ButtonLink href="/portal">Access Member Portal</ButtonLink>
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
