import Image from "next/image";
import { cn } from "@/lib/utils";

export function FadeBackdrop({
  src,
  alt,
  tone = "navy",
  side = "right",
  priority = false,
}: {
  src: string;
  alt: string;
  tone?: "navy" | "paper" | "white";
  side?: "right" | "full";
  priority?: boolean;
}) {
  return (
    <div
      className={cn(
        "fade-photo pointer-events-none absolute inset-0 overflow-hidden",
        side === "right" && "fade-photo--right",
        tone === "navy" && "fade-photo--navy",
        tone === "paper" && "fade-photo--paper",
        tone === "white" && "fade-photo--white",
      )}
      aria-hidden={alt === "" ? true : undefined}
    >
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 70vw, 100vw"
        className="object-cover"
        priority={priority}
      />
    </div>
  );
}
