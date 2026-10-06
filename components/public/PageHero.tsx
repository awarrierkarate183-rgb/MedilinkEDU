import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PageHero({
  kicker,
  title,
  lead,
  children,
  image,
}: {
  kicker?: string;
  title: ReactNode;
  lead?: string;
  children?: ReactNode;
  image?: string;
}) {
  return (
    <section className={cn("photo-hero photo-hero--page", !image && "bg-navy")}>
      {image ? <img src={image} alt="" className="photo-hero__image" /> : null}
      <div className="photo-hero__shade" />
      <div className="container-ml relative pb-16 pt-[calc(var(--header-h)+4.25rem)]">
        {kicker ? <p className="kicker">{kicker}</p> : null}
        <h1 className="display max-w-4xl">{title}</h1>
        {lead ? <p className="hero-lead mt-5 max-w-2xl">{lead}</p> : null}
        {children ? <div className="mt-8 flex flex-wrap gap-3">{children}</div> : null}
      </div>
    </section>
  );
}
