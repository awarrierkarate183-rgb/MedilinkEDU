import type { Metadata } from "next";
import { PageHero } from "@/components/public/PageHero";

export const metadata: Metadata = { title: "Accessibility" };

export default function AccessibilityPage() {
  return (
    <>
      <PageHero
        kicker="Access"
        title="Accessibility"
        lead="MediLink aims for semantic pages, keyboard navigation, visible focus, and readable contrast."
      />
      <section className="band">
        <div className="container-ml max-w-2xl text-muted">
          <p>
            If a page is hard to use with a keyboard, a screen reader, or reduced
            motion, email medi.link.edu@gmail.com with the page URL and what
            blocked you.
          </p>
        </div>
      </section>
    </>
  );
}
