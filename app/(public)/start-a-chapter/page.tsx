import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { PageHero } from "@/components/public/PageHero";
import { OFFICER_ROLES } from "@/lib/constants";
import { actionHref } from "@/lib/content/forms";

export const metadata: Metadata = {
  title: "Start a Chapter",
  description:
    "Start or reactivate a MediLink high school chapter. Officers, starter kit, and growth phases.",
};

export default function StartChapterPage() {
  return (
    <>
      <PageHero
        kicker="Chapters"
        title="Start a chapter"
        lead="Bring MediLink to your high school. New chapters get five offices, a starter kit, and a path from Founding to Flagship-Eligible."
      />
      <section className="band" id="apply">
        <div className="container-ml">
          <ol className="grid gap-4 md:grid-cols-7">
            {[
              "Learn about MediLink",
              "Find an advisor",
              "Submit chapter request",
              "Receive approval",
              "Receive chapter credentials",
              "Add students",
              "Launch chapter",
            ].map((step, index) => (
              <li key={step} className="rounded-[var(--radius)] border border-border p-4">
                <p className="kicker">0{index + 1}</p>
                <p className="font-semibold">{step}</p>
              </li>
            ))}
          </ol>
          <p className="mt-6 max-w-2xl text-sm text-muted">
            Exact charter requirements are set by leadership as they are
            finalized. This page does not invent extra rules.
          </p>
          <div className="mt-6">
            <ButtonLink href={actionHref("startChapter", "Start a Chapter")}>
              Submit a chapter request
            </ButtonLink>
          </div>
        </div>
      </section>
      <section className="band band--paper" id="officers">
        <div className="container-ml">
          <h2 className="text-3xl font-semibold">The same five offices in every chapter</h2>
          <ul className="mt-6 grid gap-3 md:grid-cols-2">
            {OFFICER_ROLES.map((role) => (
              <li key={role} className="rounded-lg bg-white p-4 font-semibold">
                {role}
              </li>
            ))}
          </ul>
        </div>
      </section>
      <section className="band" id="levels">
        <div className="container-ml grid gap-4 md:grid-cols-3">
          <article className="rounded-[var(--radius)] border border-border p-5">
            <p className="kicker">Founding</p>
            <p>Officers are established. Chapter is chartered. Receives a unique QR after founding.</p>
          </article>
          <article className="rounded-[var(--radius)] border border-border p-5">
            <p className="kicker">Established</p>
            <p>Chapter has run at least one internal event and has at least ten active members.</p>
          </article>
          <article className="rounded-[var(--radius)] border border-border p-5">
            <p className="kicker">Flagship-Eligible</p>
            <p>Chapter has participated in a regional-level competition and can send teams to the national level.</p>
          </article>
        </div>
      </section>
      <section className="band band--paper" id="qr">
        <div className="container-ml">
          <h2 className="text-3xl font-semibold">How members join</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Each chapter receives a unique chapter identifier. The QR code
            points to a chapter-specific join page. It never contains private
            credentials. Advisors then invite students and approve the roster.
          </p>
        </div>
      </section>
      <section className="band" id="reactivate">
        <div className="container-ml">
          <h2 className="text-3xl font-semibold">Reactivate a chapter</h2>
          <p className="mt-3 max-w-2xl text-muted">
            Chapters that have gone inactive can be reactivated rather than
            started from scratch. Reactivation keeps the chapter history and
            name. Status is earned again from the work in front of you.
          </p>
          <div className="mt-6">
            <ButtonLink href={actionHref("reactivateChapter", "Chapter Reactivation")}>
              Reactivate this chapter
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
