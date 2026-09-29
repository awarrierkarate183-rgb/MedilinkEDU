import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export const metadata: Metadata = {
  title: "Portal",
  robots: { index: false, follow: false },
};

export default function PortalEntryPage() {
  return (
    <div className="min-h-screen bg-navy text-white">
      <div className="container-ml py-24">
        <p className="kicker">Welcome to the MediLink Portal</p>
        <h1 className="display max-w-3xl">Where chapters actually run.</h1>
        <p className="lead mt-5 text-white/75">
          Students, advisors, and administrators use the same MediLink identity.
          Access is scoped to a real chapter roster.
        </p>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          <Card className="bg-white text-navy">
            <p className="kicker">Student</p>
            <h2 className="text-2xl font-semibold">Student login</h2>
            <p className="mt-3 text-sm text-muted">
              Access your events, curriculum, competitions, projects, and resources.
            </p>
            <div className="mt-5">
              <ButtonLink href="/portal/login?role=student">Student login</ButtonLink>
            </div>
          </Card>
          <Card className="bg-white text-navy">
            <p className="kicker">Advisor</p>
            <h2 className="text-2xl font-semibold">Advisor login</h2>
            <p className="mt-3 text-sm text-muted">
              Manage your chapter, members, events, competitions, and resources.
            </p>
            <div className="mt-5">
              <ButtonLink href="/portal/login?role=advisor" variant="secondary">
                Advisor login
              </ButtonLink>
            </div>
          </Card>
        </div>
        <p className="mt-8 text-sm text-white/60">
          <a href="/">Back to website</a>
        </p>
      </div>
    </div>
  );
}
