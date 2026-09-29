export function ConnectionTrouble() {
  return (
    <div className="rounded-[var(--radius)] border border-amber-200 bg-amber-50 p-6">
      <h2 className="text-lg font-semibold">Connection trouble</h2>
      <p className="mt-2 text-sm text-muted">
        MediLink is having trouble connecting to your account data. Please try again.
      </p>
    </div>
  );
}
