import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { PageHero } from "@/components/public/PageHero";
import { aims, lenses, MISSION, VISION } from "@/lib/content/organization";
import { OFFICER_ROLES } from "@/lib/constants";
import { CONTACT_EMAIL } from "@/lib/content/forms";

export const metadata: Metadata = {
  title: "About",
  description:
    "About MediLink, a student-founded high school network started in Charlotte, North Carolina.",
};

export default function AboutPage() {
  return (
    <>
      <PageHero
        kicker="About"
        title="What is MediLink?"
        lead="A student-founded nonprofit network of high school chapters. Open a section below. Each one is a full answer, not a one-line summary."
      />
      <section className="band">
        <div className="container-ml">
          <Accordion
            defaultOpen="identity"
            items={[
              {
                id: "identity",
                subtitle: "Mission and vision",
                title: "Why this network exists",
                children: (
                  <div className="grid gap-6 md:grid-cols-2">
                    <div>
                      <p className="kicker">Mission</p>
                      <p className="text-base">{MISSION}</p>
                    </div>
                    <div>
                      <p className="kicker">Vision</p>
                      <p className="text-base">{VISION}</p>
                    </div>
                  </div>
                ),
              },
              {
                id: "problem",
                subtitle: "The problem",
                title: "Clinic, money, and technology already sit in one room",
                children: (
                  <div className="space-y-3">
                    <p>
                      Health systems do not separate clinic, money, and
                      technology into three clubs. A student who only studies
                      one of those rooms will miss why a good idea never ships,
                      or why a tool nobody asked for gets built.
                    </p>
                    <p>
                      MediLink exists so high school students can name the
                      patient, the payer, and the system, and write that down
                      in a case. Fluency here does not mean a license to
                      practice, a job offer, or a product already in market.
                    </p>
                  </div>
                ),
              },
              {
                id: "lenses",
                subtitle: "The MediLink approach",
                title: "Open each of the three lenses",
                childIds: lenses.map((lens) => lens.id),
                children: (
                  <div className="space-y-5">
                    <p>
                      This is the only page that explains the three lenses at
                      length. Packets still use the internal name Care, Cost,
                      Code.
                    </p>
                    {lenses.map((lens) => (
                      <article key={lens.id} id={lens.id}>
                        <p className="kicker">{lens.name}</p>
                        <h3 className="tab-heading text-xl">{lens.question}</h3>
                        <p className="mt-2">{lens.body}</p>
                        <p className="mt-2 text-muted">{lens.note}</p>
                      </article>
                    ))}
                  </div>
                ),
              },
              {
                id: "chapters",
                subtitle: "How chapters work",
                title: "The same five offices in every school",
                children: (
                  <div className="space-y-4">
                    <ul className="list-disc space-y-1 pl-5">
                      {OFFICER_ROLES.map((role) => (
                        <li key={role}>{role}</li>
                      ))}
                    </ul>
                    <p>
                      Founding, Established, and Flagship-Eligible track work
                      already done. They are not marketing badges.
                    </p>
                    <p>
                      Curriculum is four tracks and twelve modules. Competitions
                      are twenty Normal Events, five Legacy Events, annual
                      chapter rankings, a biennial Apex, and a separate
                      individual invitational. School names appear on the
                      chapter map after Start a Chapter is accepted.
                    </p>
                  </div>
                ),
              },
              {
                id: "founder",
                subtitle: "Leadership",
                title: "Leadership bios will live here",
                children: (
                  <p>
                    Names, roles, and photos are data-driven. They appear when
                    leadership publishes them. This page does not invent a
                    founder story. Until then, MediLink is described by the
                    mission, the chapter structure, and the public syllabus.
                  </p>
                ),
              },
              {
                id: "aims",
                subtitle: "Aims and contact",
                title: "What we aim to achieve",
                children: (
                  <div className="space-y-4">
                    <ul className="list-disc space-y-2 pl-5">
                      {aims.map((aim) => (
                        <li key={aim}>{aim}</li>
                      ))}
                    </ul>
                    <p className="text-muted">
                      These six aims describe the work, not results already in
                      hand. Questions about a chapter, a partnership, or a
                      sponsorship can go to {CONTACT_EMAIL}. Based in Charlotte,
                      North Carolina.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <ButtonLink href={`mailto:${CONTACT_EMAIL}`}>Email MediLink</ButtonLink>
                      <ButtonLink href="/contact" variant="outline">
                        Contact page
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
