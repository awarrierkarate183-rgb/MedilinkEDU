import type { Metadata } from "next";
import { EmptyState } from "@/components/ui/States";
import { PageHero } from "@/components/public/PageHero";
import { actionHref } from "@/lib/content/forms";

export const metadata: Metadata = {
  title: "News",
  description: "News from MediLink chapters, competitions, and partnerships.",
  robots: { index: true, follow: true },
};

export default function NewsPage() {
  return (
    <>
      <PageHero
        kicker="News"
        title="News from MediLink is coming soon."
        lead="Chapter highlights appear here after review. This site does not invent school names or fake news."
        image="/img/city.png"
        imageAlt="City skyline at night"
      />
      <section className="band">
        <div className="container-ml">
          <EmptyState
            title="No published news yet"
            body="Send a chapter win, service project, or research highlight that actually happened. Leadership decides whether it runs here, on MediLink social, or at a gathering."
            actionHref={actionHref("submitNews", "Submit News Chapter Highlight")}
            actionLabel="Submit news"
          />
        </div>
      </section>
    </>
  );
}
