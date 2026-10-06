import type { Metadata } from "next";
import { HashAliases } from "@/components/public/HashAliases";
import { ArticlePage } from "@/components/public/ArticlePage";
import { EventCatalog } from "@/components/competitions/EventCatalog";
import { HANDBOOK_PDF } from "@/lib/content/normal-event-handbook";
import { normalEvents } from "@/lib/content/competition-system";

export const metadata: Metadata = {
  title: "Normal Events",
  description: "Twenty MediLink Normal Events with official procedures and 100-point rubrics.",
};

export default function NormalEventsPage() {
  return (
    <>
      <HashAliases />
      <ArticlePage
        href="/competitions/normal"
        title="Twenty Normal Events. Up to six per student."
        lead="High-school only. In person. Open an event for the official role, mechanic, work product, and 100-point rubric."
        blocks={[
          {
            heading: "How Normal Events work",
            body: [
              "A student may register for up to six Normal Events in a season. Most events allow a solo competitor or a team of up to five. A few are solo-only or team-only. Regional is required. Everyone who competes at Regional advances to State. State top three earn a National nomination. Nationals first place is National Champion.",
              "Advisors enter student names in the portal. The assigned student page then opens this same packet.",
            ],
          },
        ]}
        actions={[{ href: HANDBOOK_PDF, label: "Download the Normal Events handbook", variant: "outline" }]}
      />
      <section className="band band--paper">
        <div className="container-ml">
          <p className="kicker">Event packets</p>
          <h2 className="tab-heading mb-6 text-3xl">Open an event</h2>
          <EventCatalog events={normalEvents} prestige={1} />
        </div>
      </section>
    </>
  );
}
