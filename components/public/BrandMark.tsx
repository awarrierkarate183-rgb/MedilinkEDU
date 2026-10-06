import Link from "next/link";
import { cn } from "@/lib/utils";

export function BrandMark({
  href = "/",
  light = false,
  size = "md",
}: {
  href?: string | null;
  light?: boolean;
  size?: "sm" | "md";
}) {
  const mark = (
    <>
      <img
        src="/brand/medilink-logo.png"
        alt=""
        className={cn(
          "shrink-0 rounded-full bg-black object-cover",
          size === "sm" ? "h-9 w-9" : "h-12 w-12",
        )}
      />
      <span
        className={cn(
          "brand-wordmark",
          size === "sm" ? "text-[1.35rem]" : "text-[1.75rem] md:text-[1.9rem]",
          light ? "text-white" : "text-navy",
        )}
      >
        Medi<span className="text-gold">Link</span>
      </span>
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
