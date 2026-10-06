import { cn } from "@/lib/utils";

export function Card({
  className,
  id,
  children,
}: {
  className?: string;
  id?: string;
  children: React.ReactNode;
}) {
  return (
    <article
      id={id}
      className={cn(
        "rounded-[var(--radius)] border border-border bg-[var(--card-bg,#ffffff)] p-6 shadow-[var(--shadow)]",
        className,
      )}
    >
      {children}
    </article>
  );
}

export function MetricCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string | number;
  hint?: string;
}) {
  return (
    <Card>
      <p className="kicker">{label}</p>
      <p className="text-3xl font-bold tracking-tight text-navy">{value}</p>
      {hint ? <p className="mt-2 text-sm text-muted">{hint}</p> : null}
    </Card>
  );
}
