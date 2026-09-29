import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type Size = "md" | "sm";

const variants: Record<Variant, string> = {
  primary:
    "bg-gold text-navy hover:bg-gold-hover disabled:opacity-50",
  secondary:
    "bg-navy text-white hover:bg-navy-soft disabled:opacity-50",
  outline:
    "border border-navy text-navy bg-transparent hover:bg-surface",
  ghost: "text-navy hover:bg-surface",
  danger: "bg-danger text-white hover:opacity-90",
};

const sizes: Record<Size, string> = {
  md: "px-5 py-2.5 text-sm font-semibold",
  sm: "px-3.5 py-2 text-xs font-semibold",
};

type Common = {
  variant?: Variant;
  size?: Size;
  className?: string;
  loading?: boolean;
};

export function Button({
  variant = "primary",
  size = "md",
  className,
  loading,
  children,
  disabled,
  ...props
}: Common & ButtonHTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md transition-colors disabled:cursor-not-allowed",
        variants[variant],
        sizes[size],
        className,
      )}
      disabled={disabled || loading}
      {...props}
    >
      {loading ? "Working..." : children}
    </button>
  );
}

export function ButtonLink({
  href,
  variant = "primary",
  size = "md",
  className,
  children,
}: Common & { href: string; children: ReactNode }) {
  return (
    <Link
      href={href as never}
      className={cn(
        "inline-flex items-center justify-center gap-2 rounded-md transition-colors",
        variants[variant],
        sizes[size],
        className,
      )}
    >
      {children}
    </Link>
  );
}
