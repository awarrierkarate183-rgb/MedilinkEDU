import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/public/PageHero";
import { actionHref } from "@/lib/content/forms";

export const metadata: Metadata = {
  title: "Chapter Support",
  description: "Resources and direct help for existing MediLink high school chapters.",
};

export default function ChapterSupportPage() {
  return (
    <>
      <PageHero
        kicker="Advisor resources"
        title="Chapter support"
        lead="Resources and direct help for chapters that already exist. New schools should start on Start a Chapter. Inactive chapters that need new student leadership should use reactivation."
        image="/media/curriculum.jpg"
      />
      <section className="band">
        <div className="container-ml grid gap-4 md:grid-cols-2">
          {[
            ["Chapter Management", "Charter template, officer structure, and status path."],
            ["Recruitment", "How members join through a chapter QR and advisor invitation."],
            ["Curriculum", "Four-track syllabus. Full files wait behind roster approval."],
            ["Competitions", "Prep help for Normal Events and Legacy Events. Dates come from state boards."],
            ["Events", "Meetings, local case challenges, and internal events."],
            ["Leadership", "Coaching that backs the five student offices."],
            ["Community Service", "Owned by the Outreach and Service Lead."],
            ["Partnerships", "Leadership sets up each relationship before students are placed."],
            ["Fundraising", "Individual and company gifts fund kits and events."],
            ["Promotion", "Submit news after real work. Leadership reviews it."],
            ["Templates", "First 3 meeting agendas and decks, plus a sample local case challenge."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-[var(--radius)] border border-border p-5">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </article>
          ))}
        </div>
        <div className="container-ml mt-8">
          <ButtonLink href={actionHref("chapterSupport", "Chapter Support")}>
            Request support
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
