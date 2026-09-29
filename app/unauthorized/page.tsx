import { ButtonLink } from "@/components/ui/Button";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="kicker">Sign in required</p>
      <h1 className="display">You need a MediLink account for this page.</h1>
      <div className="mt-8">
        <ButtonLink href="/portal/login">Portal login</ButtonLink>
      </div>
    </div>
  );
}
