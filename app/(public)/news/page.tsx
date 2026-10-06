import type { Metadata } from "next";
import { SectionHub } from "@/components/public/ArticlePage";
import { NewsGallery } from "@/components/public/NewsGallery";
import { PhotoCallout } from "@/components/public/PhotoCallout";
import { publicNav } from "@/lib/content/public-nav";

export const metadata: Metadata = {
  title: "News",
  description: "Photos and chapter news from MediLink. Send pictures of work that actually happened.",
  robots: { index: true, follow: true },
};

export default function NewsPage() {
  return (
    <>
      <SectionHub
        tab={publicNav[5]}
        title="Chapter photos. Real meetings. Send yours."
        lead="Use the News dropdown for send rules, review, and what we will not invent. The album below is from accepted chapters."
      >
        <PhotoCallout />
        <section className="band">
          <div className="container-ml">
            <NewsGallery />
          </div>
        </section>
      </SectionHub>
    </>
  );
}
