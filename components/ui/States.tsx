import { ButtonLink } from "@/components/ui/Button";

export function EmptyState({
  title,
  body,
  actionHref,
  actionLabel,
}: {
  title: string;
  body: string;
  actionHref?: string;
  actionLabel?: string;
}) {
  return (
    <div className="rounded-[var(--radius)] border border-dashed border-border bg-white px-6 py-12 text-center">
      <h2 className="text-xl font-semibold text-navy">{title}</h2>
      <p className="mx-auto mt-2 max-w-md text-sm text-muted">{body}</p>
      {actionHref && actionLabel ? (
        <div className="mt-5">
          <ButtonLink href={actionHref} size="sm">
            {actionLabel}
          </ButtonLink>
        </div>
      ) : null}
    </div>
  );
}

export function Skeleton({ className = "h-24" }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-[var(--radius)] bg-surface ${className}`}
      aria-hidden
    />
  );
}

export function Alert({
  title,
  children,
  tone = "navy",
}: {
  title: string;
  children: React.ReactNode;
  tone?: "navy" | "warning" | "danger";
}) {
  const map = {
    navy: "border-navy/20 bg-navy/5",
    warning: "border-gold/40 bg-gold-soft",
    danger: "border-danger/30 bg-danger/5",
  };
  return (
    <div className={`rounded-[var(--radius)] border px-4 py-3 ${map[tone]}`}>
      <p className="font-semibold text-navy">{title}</p>
      <div className="mt-1 text-sm text-muted">{children}</div>
    </div>
  );
}
