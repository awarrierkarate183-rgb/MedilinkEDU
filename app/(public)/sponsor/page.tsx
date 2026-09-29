import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/public/PageHero";
import { sponsorTiers } from "@/lib/content/sponsors";
import { actionHref } from "@/lib/content/forms";

export const metadata: Metadata = {
  title: "Sponsors",
  description: "Corporate sponsorship tiers for MediLink.",
};

export default function SponsorPage() {
  return (
    <>
      <PageHero
        kicker="Sponsors"
        title="Support students"
        lead="Named company levels and official benefits load from the board list. Amounts and extras can be customized with leadership. A gift does not buy a student placement."
        image="/img/finance.png"
        imageAlt="Sponsorship files under a gold lamp"
      />
      <section className="band">
        <div className="container-ml grid gap-4 md:grid-cols-2">
          {sponsorTiers.map((tier) => (
            <article
              key={tier.id}
              className={`rounded-[var(--radius)] border p-6 ${
                tier.highlight ? "border-gold bg-navy text-white" : "border-border bg-white"
              }`}
            >
              <p className={`kicker ${tier.highlight ? "text-gold" : ""}`}>{tier.amount}</p>
              <h2 className="text-2xl font-semibold">{tier.name}</h2>
              <p className={`mt-3 text-sm ${tier.highlight ? "text-white/75" : "text-muted"}`}>
                {tier.description}
              </p>
              <ul className="mt-4 space-y-2 text-sm">
                {tier.benefits.map((benefit) => (
                  <li key={benefit}>{benefit}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
      <section className="band band--paper" id="individual">
        <div className="container-ml">
          <h2 className="text-3xl font-semibold">Individual gifts</h2>
          <p className="mt-3 max-w-2xl text-muted">
            This site does not list individual donor dollar amounts. Families,
            alumni, and students can still give. Individual gifts do not unlock
            the corporate attend perk.
          </p>
          <div className="mt-6">
            <ButtonLink href={actionHref("partner", "Individual sponsorship")}>
              Talk to MediLink about giving
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="band" id="attend">
        <div className="container-ml">
          <h2 className="text-3xl font-semibold">Attend State and National</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Impact Partner and Visionary Sponsor can attend and be recognized in
            person at State and National events. In an Apex year that includes
            the biennial sponsor networking fair.
          </p>
        </div>
      </section>
    </>
  );
}
