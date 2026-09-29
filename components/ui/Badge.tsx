import { cn } from "@/lib/utils";

export function Badge({
  children,
  tone = "navy",
}: {
  children: React.ReactNode;
  tone?: "navy" | "gold" | "muted" | "success" | "warning" | "danger";
}) {
  const tones = {
    navy: "bg-navy text-white",
    gold: "bg-gold text-navy",
    muted: "bg-surface text-muted border border-border",
    success: "bg-success/10 text-success",
    warning: "bg-gold-soft text-warning",
    danger: "bg-danger/10 text-danger",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[0.7rem] font-semibold uppercase tracking-wider",
        tones[tone],
      )}
    >
      {children}
    </span>
  );
}
