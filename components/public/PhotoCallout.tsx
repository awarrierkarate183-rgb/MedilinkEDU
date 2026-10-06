import { ButtonLink } from "@/components/ui/Button";
import { CONTACT_EMAIL, photoEmailHref } from "@/lib/content/forms";

export function PhotoCallout() {
  return (
    <section className="relative overflow-hidden bg-gold text-navy">
      <div className="photo-callout-glow" aria-hidden="true" />
      <div className="container-ml relative py-14 md:py-20">
        <p className="kicker !text-navy">Send photos</p>
        <h2 className="tab-heading max-w-4xl text-4xl md:text-6xl">
          Send your chapter photos.
        </h2>
        <p className="mt-4 max-w-2xl text-lg font-semibold leading-8">
          If your chapter met, competed, served, or launched something that
          actually happened, send the pictures. MediLink reviews every
          submission. Nothing fake gets posted.
        </p>
        <ul className="mt-6 max-w-2xl space-y-2 text-sm font-semibold">
          <li>Use real school names and a short caption of what the photo shows.</li>
          <li>Ask everyone in the photo before you send it.</li>
          <li>Do not send student emails, grades, or private portal screens.</li>
        </ul>
        <div className="mt-8 flex flex-wrap gap-3">
          <ButtonLink href={photoEmailHref()} className="click-here">
            Email {CONTACT_EMAIL}
          </ButtonLink>
          <ButtonLink href="/news/send-photos" variant="secondary">
            Photo rules
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
