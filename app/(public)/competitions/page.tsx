import type { Metadata } from "next";
import { HashAliases } from "@/components/public/HashAliases";
import { SectionHub } from "@/components/public/ArticlePage";
import { publicNav } from "@/lib/content/public-nav";

export const metadata: Metadata = {
  title: "Competitions",
  description:
    "MediLink competitions: 20 Normal Events, 5 Legacy Events, annual chapter rankings, a biennial Apex, and a separate biennial individual invitational.",
};

export default function CompetitionsPage() {
  return (
    <>
      <HashAliases />
      <SectionHub
        tab={publicNav[3]}
        title="Two competition tiers. Different rules."
        lead="Use the Competitions dropdown for Normal Events, Legacy Events, advancement, rankings, and the invitational. Each subsection is its own long page."
      />
    </>
  );
}
