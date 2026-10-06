import type { Metadata } from "next";
import { SectionHub } from "@/components/public/ArticlePage";
import { publicNav } from "@/lib/content/public-nav";

export const metadata: Metadata = {
  title: "Curriculum",
  description:
    "MediLink public syllabus. Four tracks and twelve modules covering health economics, health tech, financial modeling, and competition prep.",
};

export default function CurriculumPage() {
  return (
    <SectionHub
      tab={publicNav[2]}
      title="Four tracks. Twelve modules."
      lead="Titles and short descriptions are public. Open a track from the Curriculum dropdown for the full module pages. Lesson files wait until a chapter approves you."
    />
  );
}
