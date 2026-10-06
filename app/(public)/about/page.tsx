import type { Metadata } from "next";
import { SectionHub } from "@/components/public/ArticlePage";
import { publicNav } from "@/lib/content/public-nav";

export const metadata: Metadata = {
  title: "About",
  description:
    "About MediLink, a student-founded high school network started in Charlotte, North Carolina.",
};

export default function AboutPage() {
  return (
    <SectionHub
      tab={publicNav[0]}
      title="What is MediLink?"
      lead="A student-founded nonprofit network of high school chapters. Use the tab dropdown above, or open a subsection here. Each page is a full answer."
    />
  );
}
