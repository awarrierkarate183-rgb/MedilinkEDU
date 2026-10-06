import type { Metadata } from "next";
import { HashAliases } from "@/components/public/HashAliases";
import { ArticlePage } from "@/components/public/ArticlePage";
import { EventCatalog } from "@/components/competitions/EventCatalog";
import { LEGACY_HANDBOOK_PDF, legacyPurpose } from "@/lib/content/legacy-event-handbook";
import { legacyEvents } from "@/lib/content/competition-system";

export const metadata: Metadata = {
  title: "Legacy Triad",
  description: "Three MediLink Legacy championship events with official procedures and 1,000-point rubrics.",
};

export default function LegacyEventsPage() {
  return (
    <>
      <HashAliases />
      <ArticlePage
        href="/competitions/legacy"
        title="One school. Four delegates. Three arenas."
        lead="The Legacy Triad replaces the old five-event catalogue and two-group model. Open an event for the official packet."
        blocks={[
          {
            heading: "How the Triad works",
            body: [
              "Each chapter registers exactly one team of four. Those four are the whole Legacy delegation. They may enter one, two, or all three events. Qualification is separate for each event. The roster locks before Regionals.",
              "Regionals fit five acts into one day. The complete fictional case releases at monitored check-in. State standing uses 35 percent Regional raw score and 65 percent State raw score. The highest cumulative standing in each event advances to Nationals.",
              legacyPurpose,
            ],
          },
        ]}
        actions={[{ href: LEGACY_HANDBOOK_PDF, label: "Download the Legacy Triad handbook", variant: "outline" }]}
      />
      <section className="band band--paper">
        <div className="container-ml">
          <p className="kicker">Championship packets</p>
          <h2 className="tab-heading mb-6 text-3xl">Open an event</h2>
          <EventCatalog events={legacyEvents} prestige={2} />
        </div>
      </section>
    </>
  );
}
