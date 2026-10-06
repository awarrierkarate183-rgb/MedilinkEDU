import type { Metadata } from "next";
import { SectionHub } from "@/components/public/ArticlePage";
import { PhotoCallout } from "@/components/public/PhotoCallout";
import { publicNav } from "@/lib/content/public-nav";

export const metadata: Metadata = {
  title: "Get Involved",
  description: "Start a chapter, partner with MediLink, sponsor students, or submit news.",
};

export default function GetInvolvedPage() {
  return (
    <>
      <SectionHub
        tab={publicNav[4]}
        title="Work with MediLink"
        lead="Use the Get Involved dropdown for a full path: start a chapter, partner, sponsor, volunteer, send news, or write us."
      />
      <PhotoCallout />
    </>
  );
}
