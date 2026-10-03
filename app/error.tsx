"use client";

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center px-6 text-center">
      <p className="kicker">Error</p>
      <h1 className="text-3xl font-semibold">Something went wrong while loading this page.</h1>
      <p className="mt-4 max-w-md text-muted">Please try again.</p>
      {error?.message ? (
        <p className="mt-3 max-w-lg text-sm text-muted">{error.message}</p>
      ) : null}
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
