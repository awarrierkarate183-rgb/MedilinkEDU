import type { Metadata } from "next";
import { PageHero } from "@/components/public/PageHero";

export const metadata: Metadata = { title: "Terms" };

export default function TermsPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Terms of use"
        lead="The MediLink website and portal are for chapter operations, curriculum, competitions, and public information about the organization."
        image="/img/hero.png"
        imageAlt=""
      />
      <section className="band">
        <div className="container-ml max-w-2xl space-y-4 text-muted">
          <p>
            This page is a placeholder for counsel-reviewed terms. It does not
            grant licenses, placements, or clinical privileges.
          </p>
          <p>
            Portal access is scoped to a real chapter roster. Do not share
            invitation codes. Students may not change their own role.
          </p>
        </div>
      </section>
    </>
  );
}
