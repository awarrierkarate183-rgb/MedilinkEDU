import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  href = "/",
  light = false,
  size = "md",
  wordmark = true,
}: {
  href?: string | null;
  light?: boolean;
  size?: "sm" | "md";
  wordmark?: boolean;
}) {
  const mark = (
    <>
      <span
        className={cn(
          "inline-flex shrink-0 overflow-hidden rounded-full",
          size === "sm" ? "h-9 w-9" : "h-12 w-12",
        )}
      >
        <img
          src="/brand/medilink-logo.png"
          alt=""
          className="h-full w-full object-cover"
        />
      </span>
      {wordmark ? (
        <span
          className={cn(
            "brand-wordmark",
            size === "sm" ? "text-[1.35rem]" : "text-[1.75rem] md:text-[1.9rem]",
            light ? "text-white" : "text-navy",
          )}
        >
          Medi<span className="text-gold">Link</span>
        </span>
      ) : null}
    </>
  );

  if (!href) {
    return <span className="inline-flex items-center gap-2.5">{mark}</span>;
  }

  return (
    <Link href={href as never} className="inline-flex items-center gap-2.5" aria-label="MediLink home">
      {mark}
    </Link>
  );
}
