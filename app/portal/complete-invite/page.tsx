import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Finish your student account",
  robots: { index: false, follow: false },
};

export default function CompleteInvitePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-md rounded-[var(--radius)] bg-white p-8">
        <p className="kicker">Student invitation</p>
        <h1 className="text-2xl font-semibold">Finish creating your account</h1>
        <p className="mt-3 text-sm text-muted">
          Open the invitation email from MediLink and click the button. Then
          choose a password. That login only works in the student portal.
        </p>
        <div className="mt-6">
          <ButtonLink href="/portal/login?role=student" size="sm">
            Student login
          </ButtonLink>
        </div>
      </div>
    </div>
  );
}
