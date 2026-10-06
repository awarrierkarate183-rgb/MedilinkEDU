import type { Metadata } from "next";
import { SectionHub } from "@/components/public/ArticlePage";
import { ChapterExplorer } from "@/components/public/ChapterExplorer";
import { loadPublicChapters } from "@/lib/data/public-chapters";
import { publicNav } from "@/lib/content/public-nav";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Chapters",
  description:
    "Find a MediLink high school chapter. School listings appear when the board records them.",
};

export default async function ChaptersPage() {
  const chapters = await loadPublicChapters();
  return (
    <SectionHub
      tab={publicNav[1]}
      title="Chapter network"
      lead="Use the Chapters dropdown for start, advisors, status, and support. The map below shows accepted schools only."
    >
      <section className="band band--paper">
        <div className="mx-auto w-full max-w-[1500px] px-6 lg:px-10">
          <ChapterExplorer chapters={chapters} />
        </div>
      </section>
    </SectionHub>
  );
}
