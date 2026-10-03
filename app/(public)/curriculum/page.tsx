import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
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
        lead="Titles and short descriptions are public. Full lessons, labs, and packets wait until a chapter approves you."
      />
      <section className="band">
        <div className="container-ml space-y-8">
          {tracks.map((track) => (
            <article
              key={track.id}
              id={track.id}
              className="rounded-[var(--radius)] border border-border bg-white p-7"
            >
              <p className="kicker">Track {track.number}</p>
              <h2 className="text-3xl font-semibold">{track.name}</h2>
              <p className="mt-3 max-w-3xl text-muted">{track.intro}</p>
              <ol className="mt-6 grid gap-4 md:grid-cols-3">
                {track.modules.map((mod) => (
                  <li key={mod.code} className="rounded-lg bg-surface p-4">
                    <p className="kicker">{mod.code}</p>
                    <h3 className="font-semibold">{mod.name}</h3>
                    <p className="mt-2 text-sm text-muted">{mod.description}</p>
                    <p className="mt-3 text-xs font-semibold uppercase tracking-wider text-muted">
                      Track {track.number}
                    </p>
                  </li>
                ))}
              </ol>
              <p className="mt-5 text-sm text-muted">
                <strong>Lab preview.</strong> {track.lab} Full files wait behind
                roster approval.
              </p>
            </article>
          ))}
        </div>
      </section>
      <section className="band band--paper">
        <div className="container-ml">
          <h2 className="text-3xl font-semibold">
            Full curriculum access is available to registered MediLink members.
          </h2>
          <div className="mt-6">
            <ButtonLink href="/portal">Access Member Portal</ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
