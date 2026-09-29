import { ButtonLink } from "@/components/ui/Button";

export default function NotFound() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center px-6 text-center">
      <p className="kicker">404</p>
      <h1 className="display">This MediLink page is not here.</h1>
      <p className="mt-4 max-w-md text-muted">
        The link may be old, or the page may still be private.
      </p>
      <div className="mt-8">
        <ButtonLink href="/">Back to MediLink</ButtonLink>
      </div>
    </div>
  );
}
