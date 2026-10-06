import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Accordion } from "@/components/ui/Accordion";
import { PageHero } from "@/components/public/PageHero";
import { PhotoCallout } from "@/components/public/PhotoCallout";
import { sponsorTiers } from "@/lib/content/sponsors";
import { actionHref, CONTACT_EMAIL } from "@/lib/content/forms";

export const metadata: Metadata = {
  title: "Get Involved",
  description: "Start a chapter, partner with MediLink, sponsor students, or submit news.",
};

export default function GetInvolvedPage() {
  return (
    <>
      <PageHero
        kicker="Get involved"
        title="Work with MediLink"
        lead="Open a path below. Each one is a full route, not a one-line card."
      />
      <PhotoCallout />
      <section className="band">
        <div className="container-ml">
          <Accordion
            defaultOpen="start"
            items={[
              {
                id: "start",
                subtitle: "Schools",
                title: "Start a chapter",
                children: (
                  <div className="space-y-3">
                    <p>
                      For schools and educators. Learn about MediLink, find an
                      advisor, submit a request, receive approval and
                      credentials, add students, and launch. After accept, the
                      school appears on the chapter map.
                    </p>
                    <ButtonLink href="/start-a-chapter">Start a Chapter</ButtonLink>
                  </div>
                ),
              },
              {
                id: "partner",
                subtitle: "Organizations",
                title: "Partner with MediLink",
                children: (
                  <div className="space-y-3">
                    <p>
                      Hospitals, healthcare companies, finance companies,
                      insurance companies, technology companies, research
                      institutions, universities, and community organizations.
                    </p>
                    <ButtonLink href="/partner" variant="secondary">
                      Partner
                    </ButtonLink>
                  </div>
                ),
              },
              {
                id: "sponsorship",
                subtitle: "Support",
                title: "Sponsor MediLink",
                children: (
                  <div className="space-y-3">
                    <p>
                      Corporate tiers load from approved sponsor data. This page
                      does not invent extra benefits.
                    </p>
                    <ul className="space-y-2">
                      {sponsorTiers.map((tier) => (
                        <li key={tier.id}>
                          <strong>{tier.name}</strong> {tier.amount}
                        </li>
                      ))}
                    </ul>
                    <ButtonLink href="/sponsor" variant="outline">
                      See sponsor tiers
                    </ButtonLink>
                  </div>
                ),
              },
              {
                id: "volunteer",
                subtitle: "People",
                title: "Volunteer as a mentor or judge",
                children: (
                  <div className="space-y-3">
                    <p>
                      Mentors and judges sit with chapters after leadership
                      sets the relationship. Use the volunteer form or write
                      MediLink if you can give time, not a school name we do
                      not have.
                    </p>
                    <ButtonLink href={actionHref("volunteer", "Volunteer with MediLink")} variant="outline">
                      Volunteer
                    </ButtonLink>
                  </div>
                ),
              },
              {
                id: "submit-news",
                subtitle: "News",
                title: "Submit news and chapter photos",
                children: (
                  <div className="space-y-3">
                    <p>
                      Chapter news, service projects, research updates,
                      competition days, and photographs. Submissions go through
                      review. They are not published automatically.
                    </p>
                    <div className="flex flex-wrap gap-3">
                      <ButtonLink href="/news">Open the News page</ButtonLink>
                      <ButtonLink href={actionHref("submitNews", "Submit News Chapter Highlight")} variant="outline">
                        Submit news
                      </ButtonLink>
                    </div>
                  </div>
                ),
              },
              {
                id: "contact",
                subtitle: "Questions",
                title: "Write MediLink directly",
                children: (
                  <div className="space-y-3">
                    <p>
                      Use the contact page or {CONTACT_EMAIL} for a chapter
                      question, a partnership, or a sponsorship. Based in
                      Charlotte, North Carolina.
                    </p>
                    <ButtonLink href="/contact" variant="outline">
                      Contact page
                    </ButtonLink>
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
