import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { PhotoTile } from "@/components/public/widgets";
import { OFFICER_ROLES } from "@/lib/constants";

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
        lead="Bring MediLink to your high school. Open the request form, choose a portal password, then wait for an administrator to accept the chapter."
      />

      <section className="band">
        <div className="container-ml grid gap-6 lg:grid-cols-2">
          <div className="relative min-h-[22rem] overflow-hidden rounded-[var(--radius)] bg-navy text-white">
            <div className="relative flex h-full min-h-[22rem] flex-col items-center justify-center px-6 py-12 text-center">
              <p className="kicker">New school</p>
              <h2 className="mt-3 max-w-sm text-3xl font-semibold">Start a chapter</h2>
              <Link
                href="/start-a-chapter/apply"
                className="click-here mt-8 inline-flex rounded-md bg-gold px-8 py-4 text-lg font-semibold text-navy"
              >
                Click here
              </Link>
              <p className="mt-5 max-w-sm text-sm text-white/80">
                Open the full request form. School, advisor, and the password you will use to sign in.
              </p>
            </div>
          </div>
          <div className="relative min-h-[22rem] overflow-hidden rounded-[var(--radius)] bg-gold text-navy">
            <div className="relative flex h-full min-h-[22rem] flex-col items-center justify-center px-6 py-12 text-center">
              <p className="kicker text-navy">Existing school</p>
              <h2 className="mt-3 max-w-sm text-3xl font-semibold">Reactivate a chapter</h2>
              <Link
                href="/start-a-chapter/reactivate"
                className="mt-8 inline-flex rounded-md bg-navy px-8 py-4 text-lg font-semibold text-white"
              >
                Open reactivation form
              </Link>
              <p className="mt-5 max-w-sm text-sm text-navy/70">
                Use this if the school already had a MediLink chapter and it went quiet.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="band band--paper" id="officers">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Officers</p>
            <h2>The same five offices in every chapter</h2>
          </div>
          <div className="grid gap-3 md:grid-cols-5">
            {OFFICER_ROLES.map((role) => (
              <div key={role} className="rounded-[var(--radius)] bg-navy px-4 py-6 text-center text-white">
                <p className="font-semibold">{role}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="band" id="levels">
        <div className="container-ml">
          <div className="section-head">
            <p className="kicker">Growth</p>
            <h2>Status is earned.</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-3">
            <PhotoTile
              href="/chapters/status"
              tone="navy"
              kicker="Founding"
              title="Chartered"
              body="Officers are in place. The chapter receives a unique QR after founding."
            />
            <PhotoTile
              href="/chapters/status"
              tone="gold"
              kicker="Established"
              title="Running"
              body="At least one internal event and at least ten active members."
            />
            <PhotoTile
              href="/chapters/status"
              tone="soft"
              kicker="Flagship-Eligible"
              title="Competing"
              body="The chapter has entered a regional competition and can send teams onward."
            />
          </div>
        </div>
      </section>

      <section className="band band--paper" id="qr">
        <div className="container-ml grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-center">
          <img
            src="/news/lake-norman-review.png"
            alt="Ravenwood High School MediLink members reviewing printed materials"
            className="h-72 w-full rounded-[var(--radius)] object-cover"
          />
          <div>
            <p className="kicker">How members join</p>
            <h2>A chapter QR. Then an advisor invite.</h2>
            <p className="mt-4 max-w-2xl text-muted">
              Each chapter receives a unique chapter identifier. The QR code
              points to a chapter-specific join page. It never contains private
              credentials. Advisors then invite students and approve the roster.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
