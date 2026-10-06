import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/public/PageHero";
import { actionHref } from "@/lib/content/forms";

export const metadata: Metadata = {
  title: "Partner",
  description:
    "Partner with MediLink. Clinical, finance, and health-tech partners, plus schools and community groups.",
};

export default function PartnerPage() {
  return (
    <>
      <PageHero
        kicker="Partners"
        title="Partner with MediLink"
        lead="Hospitals, insurers, and health-tech firms sit in the same three-lens framework students use. Leadership sets up each relationship before students are placed. This is not a public job board."
      />
      <section className="band">
        <div className="container-ml grid gap-4 md:grid-cols-2">
          {[
            ["Sponsorship", "Fund kits, events, and outreach at an approved corporate tier."],
            ["Shadowing", "Arranged through partners and chapter advisors after leadership sets the relationship."],
            ["Internships", "Offered through clinical, finance, and tech partners. Not listed as a public job board."],
            ["Research partnerships", "Work that a high school chapter can actually join, not a promise of publication."],
            ["Speakers", "Guest sessions mapped to a syllabus module or a case lens."],
            ["Workshops", "A two-hour workshop mapped to a module is more useful than a generic talk."],
            ["Mentorship", "Sit with an officer office. Volunteers back student offices. They do not replace them."],
            ["Competition judging", "Care-lens, Cost-lens, and Code-lens judges for Regional and State rounds."],
            ["Event partnerships", "Host a local case challenge or a Regional conference."],
          ].map(([title, body]) => (
            <article key={title} className="rounded-[var(--radius)] border border-border p-5">
              <h2 className="font-semibold">{title}</h2>
              <p className="mt-2 text-sm text-muted">{body}</p>
            </article>
          ))}
        </div>
        <div className="container-ml mt-8">
          <ButtonLink href={actionHref("partner", "Partner with MediLink")}>
            Partner with MediLink
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
