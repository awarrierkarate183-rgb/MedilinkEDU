import { ButtonLink } from "@/components/ui/Button";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="kicker">No access</p>
      <h1 className="display">This part of MediLink is not available to your role.</h1>
      <p className="mt-4 max-w-md text-muted">
        Students cannot open advisor tools. Advisors cannot open another
        chapter. If this looks wrong, ask your chapter advisor.
      </p>
      <div className="mt-8">
        <ButtonLink href="/portal">Return to portal</ButtonLink>
      </div>
    </div>
  );
}
