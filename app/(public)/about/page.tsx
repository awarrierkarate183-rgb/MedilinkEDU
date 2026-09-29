import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
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
        lead="A student-founded nonprofit network of high school chapters. Members learn how real health systems work: a clinical problem, a money problem, and a technology problem at once."
        image="/img/city.png"
        imageAlt="Night skyline along a river, standing in for MediLink's Charlotte home"
      />

      <section className="band" id="identity">
        <div className="container-ml grid gap-10 lg:grid-cols-2">
          <div>
            <p className="kicker">Mission</p>
            <h2 className="text-3xl font-semibold">{MISSION}</h2>
          </div>
          <div>
            <p className="kicker" id="vision">
              Vision
            </p>
            <p className="text-lg leading-8 text-muted">{VISION}</p>
          </div>
        </div>
      </section>

      <section className="band band--paper">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Why MediLink exists</p>
            <h2>The problem</h2>
          </div>
          <div className="max-w-3xl space-y-4 text-muted">
            <p>
              Health systems do not separate clinic, money, and technology into
              three clubs. A student who only studies one of those rooms will
              miss why a good idea never ships, or why a tool nobody asked for
              gets built.
            </p>
            <p>
              MediLink exists so high school students can name the patient, the
              payer, and the system, and write that down in a case. Fluency here
              does not mean a license to practice, a job offer, or a product
              already in market.
            </p>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">The MediLink approach</p>
            <h2>Open each lens.</h2>
            <p>
              This is the only page that explains the three lenses at length.
              Packets still use the internal name Care, Cost, Code.
            </p>
          </div>
          <div className="grid gap-5">
            {lenses.map((lens) => (
              <article id={lens.id} key={lens.id} className="rounded-[var(--radius)] border border-border bg-white p-6">
                <p className="kicker">{lens.name}</p>
                <h3 className="text-2xl font-semibold">{lens.question}</h3>
                <p className="mt-3 text-muted">{lens.body}</p>
                <p className="mt-3 text-sm text-muted">{lens.note}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="band band--paper">
        <div className="container-ml grid gap-10 md:grid-cols-2">
          <div>
            <p className="kicker">How chapters work</p>
            <h2 className="text-3xl font-semibold">The same five offices in every chapter.</h2>
            <ul className="mt-6 space-y-2 text-muted">
              {OFFICER_ROLES.map((role) => (
                <li key={role}>{role}</li>
              ))}
            </ul>
            <p className="mt-4 text-sm text-muted">
              Founding, Established, and Flagship-Eligible track work already
              done. They are not marketing badges.
            </p>
          </div>
          <div className="space-y-4">
            <Card>
              <h3 className="font-semibold">Curriculum</h3>
              <p className="mt-2 text-sm text-muted">
                Four tracks, twelve modules. Public titles. Full lessons behind
                roster approval.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold">Competitions</h3>
              <p className="mt-2 text-sm text-muted">
                Four annual events plus a biennial Apex. Nationals is the yearly
                flagship and the only ladder.
              </p>
            </Card>
            <Card>
              <h3 className="font-semibold">National growth</h3>
              <p className="mt-2 text-sm text-muted">
                Listings currently cover North Carolina and Georgia. School names
                appear when the board records them.
              </p>
            </Card>
          </div>
        </div>
      </section>

      <section className="band">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Leadership</p>
            <h2>Leadership bios will live here.</h2>
            <p>
              Names, roles, and photos are data-driven. They appear when
              leadership publishes them. This page does not invent a founder
              story.
            </p>
          </div>
          <div id="founder" className="rounded-[var(--radius)] border border-dashed border-border p-8">
            <p className="font-semibold">Founder story</p>
            <p className="mt-2 max-w-2xl text-sm text-muted">
              A structured placeholder. Replace this block when an approved
              founder narrative is ready. Until then, MediLink is described by
              the mission, the chapter structure, and the public syllabus.
            </p>
          </div>
        </div>
      </section>

      <section className="band band--paper" id="aims">
        <div className="container-ml">
          <p className="kicker">Aims</p>
          <h2 className="mb-6 text-3xl font-semibold">What we aim to achieve</h2>
          <ul className="max-w-3xl space-y-3 text-muted">
            {aims.map((aim) => (
              <li key={aim}>{aim}</li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-muted">
            These six aims describe the work, not results already in hand.
          </p>
        </div>
      </section>

      <section className="band" id="contact">
        <div className="container-ml">
          <p className="kicker">Contact</p>
          <h2 className="text-3xl font-semibold">Get in touch</h2>
          <p className="mt-3 max-w-xl text-muted">
            Questions about a chapter, a partnership, or a sponsorship. Based in
            Charlotte, North Carolina.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <ButtonLink href={`mailto:${CONTACT_EMAIL}`}>Email MediLink</ButtonLink>
            <ButtonLink href="/contact" variant="outline">
              Contact page
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
