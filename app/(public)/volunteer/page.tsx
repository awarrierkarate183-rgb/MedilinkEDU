import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/public/PageHero";
import { actionHref } from "@/lib/content/forms";

export const metadata: Metadata = {
  title: "Volunteer",
  description: "Volunteer with MediLink as a mentor, judge, or chapter adult.",
};

export default function VolunteerPage() {
  return (
    <>
      <PageHero
        kicker="Volunteer"
        title="Mentor, judge, or help a chapter run"
        lead="Tell us your field so we can match you to a chapter, a panel, or a workshop. Volunteers back the five student offices. They do not replace them."
        image="/img/chapter.png"
        imageAlt="Students working together under a gold desk lamp"
      >
        <ButtonLink href={actionHref("volunteer", "Volunteer with MediLink")}>
          Apply to volunteer
        </ButtonLink>
      </PageHero>
    </>
  );
}
