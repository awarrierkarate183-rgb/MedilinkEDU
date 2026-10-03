import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHero } from "@/components/public/PageHero";
import { sponsorTiers } from "@/lib/content/sponsors";
import { actionHref } from "@/lib/content/forms";

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
        lead="Start a chapter, partner with the network, support students, or submit news that actually happened."
      />
      <section className="band">
        <div className="container-ml grid-cards cols-2">
          <Card>
            <p className="kicker">Schools</p>
            <h2 className="text-2xl font-semibold">Start a chapter</h2>
            <p className="mt-3 text-sm text-muted">
              For schools and educators. Learn about MediLink, find an advisor,
              submit a request, receive approval and credentials, add students,
              and launch.
            </p>
            <div className="mt-5">
              <ButtonLink href="/start-a-chapter" size="sm">
                Start a Chapter
              </ButtonLink>
            </div>
          </Card>
          <Card>
            <p className="kicker">Organizations</p>
            <h2 className="text-2xl font-semibold">Partner with MediLink</h2>
            <p className="mt-3 text-sm text-muted">
              Hospitals, healthcare companies, finance companies, insurance
              companies, technology companies, research institutions,
              universities, and community organizations.
            </p>
            <div className="mt-5">
              <ButtonLink href="/partner" size="sm" variant="secondary">
                Partner
              </ButtonLink>
            </div>
          </Card>
          <Card id="sponsorship">
            <p className="kicker">Support</p>
            <h2 className="text-2xl font-semibold">Sponsor MediLink</h2>
            <p className="mt-3 text-sm text-muted">
              Corporate tiers load from approved sponsor data. This page does
              not invent extra benefits.
            </p>
            <ul className="mt-4 space-y-2 text-sm">
              {sponsorTiers.map((tier) => (
                <li key={tier.id}>
                  <strong>{tier.name}</strong> {tier.amount}
                </li>
              ))}
            </ul>
            <div className="mt-5">
              <ButtonLink href="/sponsor" size="sm" variant="outline">
                See sponsor tiers
              </ButtonLink>
            </div>
          </Card>
          <Card id="submit-news">
            <p className="kicker">News</p>
            <h2 className="text-2xl font-semibold">Submit news</h2>
            <p className="mt-3 text-sm text-muted">
              Chapter news, service projects, research updates, competition
              achievements, and other chapter highlights. Submissions go through
              review. They are not published automatically.
            </p>
            <div className="mt-5">
              <ButtonLink href={actionHref("submitNews", "Submit News Chapter Highlight")} size="sm">
                Submit news
              </ButtonLink>
            </div>
          </Card>
        </div>
      </section>
    </>
  );
}
