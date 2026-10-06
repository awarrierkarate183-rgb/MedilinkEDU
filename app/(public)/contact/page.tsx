import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/public/PageHero";
import { CONTACT_EMAIL } from "@/lib/content/forms";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact MediLink about chapters, partnerships, or sponsorship.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        kicker="Contact"
        title="Get in touch"
        lead="Questions about a chapter, a partnership, or a sponsorship. Students, educators, organizations, and supporters use the same inbox. Based in Charlotte, North Carolina. We aim to respond within 2 to 3 business days."
      >
        <ButtonLink href={`mailto:${CONTACT_EMAIL}`}>Email MediLink</ButtonLink>
      </PageHero>
      <section className="band">
        <div className="container-ml max-w-2xl">
          <p className="text-muted">
            Name the work in the subject line: chapter, sponsor, volunteer,
            news, or portal. Form buttons on other pages open Google Forms when
            those URLs are pasted into data/forms.json. Until then, email still
            works.
          </p>
        </div>
      </section>
    </>
  );
}
