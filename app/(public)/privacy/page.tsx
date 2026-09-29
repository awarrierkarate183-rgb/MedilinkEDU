import type { Metadata } from "next";
import { PageHero } from "@/components/public/PageHero";
import { CONTACT_EMAIL } from "@/lib/content/forms";

export const metadata: Metadata = { title: "Privacy" };

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        kicker="Legal"
        title="Privacy"
        lead="MediLink is built for high school students. We collect only what is needed to run chapters, curriculum, competitions, and the portal."
        image="/img/hero.png"
        imageAlt=""
      />
      <section className="band">
        <div className="container-ml max-w-2xl space-y-4 text-muted">
          <p>
            This page is a foundation, not a finished legal opinion. It does not
            claim compliance that has not been reviewed.
          </p>
          <p>
            Do not send home addresses, medical information, government
            identification, or financial account information through this
            website. MediLink is an educational organization, not a
            medical-record platform.
          </p>
          <p>
            To ask about access or deletion of account data, email {CONTACT_EMAIL}
            with the subject line Data request.
          </p>
        </div>
      </section>
    </>
  );
}
