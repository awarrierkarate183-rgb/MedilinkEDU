import type { Metadata } from "next";
import { SectionHub } from "@/components/public/ArticlePage";
import { MediLinkEventsBoard } from "@/components/portal/MediLinkEventsBoard";
import { navTabByHref } from "@/lib/content/public-nav";

export const metadata: Metadata = {
  title: "MediLink Events",
  description:
    "Volunteer openings by region, MediLink-hosted events, internships, and research opportunities MediLink publishes.",
};

export default function MediLinkEventsPage() {
  const tab = navTabByHref("/medilink-events");
  if (!tab) return null;
  return (
    <>
      <SectionHub
        tab={tab}
        title="Volunteer. Events. Internships. Research."
        lead="Use the MediLink Events dropdown for each board. A listing appears only when MediLink publishes it. Nothing here is invented to look busy."
      />
      <section className="band">
        <div className="container-ml">
          <MediLinkEventsBoard showIntro={false} />
        </div>
      </section>
    </>
  );
}
