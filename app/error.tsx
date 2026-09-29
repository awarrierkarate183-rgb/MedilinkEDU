"use client";

export default function ErrorPage({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="kicker">Error</p>
      <h1 className="display">Something went wrong while loading this page.</h1>
      <p className="mt-4 max-w-md text-muted">Please try again.</p>
      <button
        type="button"
        onClick={reset}
        className="mt-6 rounded-md bg-gold px-4 py-2 text-sm font-semibold text-navy"
      >
        Try again
      </button>
    </div>
  );
}
