import type { Metadata } from "next";
import { SectionHub } from "@/components/public/ArticlePage";
import { MediLinkEventsBoard } from "@/components/portal/MediLinkEventsBoard";
import { navTabByHref } from "@/lib/content/public-nav";
import { loadMediLinkListings } from "@/lib/data/medilink-listings";

export const metadata: Metadata = {
  title: "MediLink Events",
  description:
    "Volunteer openings by region, MediLink-hosted events, internships, and research opportunities MediLink publishes for every chapter.",
};

export default async function MediLinkEventsPage() {
  const tab = navTabByHref("/medilink-events");
  if (!tab) return null;
  const result = await loadMediLinkListings({ viewer: "public" });
  return (
    <>
      <SectionHub
        tab={tab}
        title="Volunteer. Events. Internships. Research."
        lead="MediLink-wide listings appear here when an administrator publishes them. Chapter-only listings stay in that chapter's portal."
      />
      <section className="band">
        <div className="container-ml">
          <MediLinkEventsBoard listings={result.listings} viewer="public" showIntro={false} />
        </div>
      </section>
    </>
  );
}
