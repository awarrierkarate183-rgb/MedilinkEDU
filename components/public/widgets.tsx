import Link from "next/link";
import { cn } from "@/lib/utils";

export function StatStrip({
  items,
}: {
  items: Array<{ value: string; label: string }>;
}) {
  return (
    <div className="stat-strip">
      {items.map((item) => (
        <div key={item.label} className="stat-strip__item">
          <p className="stat-strip__value">{item.value}</p>
          <p className="stat-strip__label">{item.label}</p>
        </div>
      ))}
    </div>
  );
}

const tones = {
  navy: "bg-navy text-white",
  gold: "bg-gold text-navy",
  soft: "bg-navy-soft text-white",
  cream: "bg-beige text-navy",
} as const;

export type WidgetTone = keyof typeof tones;

export function QuietLinks({
  items,
}: {
  items: Array<{ href: string; label: string; note?: string }>;
}) {
  return (
    <div className="quiet-links">
      {items.map((item) => (
        <Link key={item.href + item.label} href={item.href as never} className="quiet-link">
          <span>{item.label}</span>
          {item.note ? <em>{item.note}</em> : <em>Open</em>}
        </Link>
      ))}
    </div>
  );
}

export function PhotoTile({
  href,
  image,
  kicker,
  title,
  body,
  tone = "navy",
}: {
  href: string;
  image?: string;
  kicker: string;
  title: string;
  body?: string;
  tone?: WidgetTone;
}) {
  return (
    <Link
      href={href as never}
      className={cn("photo-tile", !image && tones[tone], image && "photo-tile--photo")}
    >
      {image ? <img src={image} alt="" className="photo-tile__image" /> : null}
      <div className="photo-tile__copy">
        <p className="kicker">{kicker}</p>
        <h3>{title}</h3>
        {body ? <p>{body}</p> : null}
      </div>
    </Link>
  );
}

export function SplitFeature({
  href,
  image,
  kicker,
  title,
  body,
  action,
  reverse,
  tone = "navy",
}: {
  href: string;
  image?: string;
  kicker: string;
  title: string;
  body: string;
  action: string;
  reverse?: boolean;
  tone?: WidgetTone;
}) {
  return (
    <Link
      href={href as never}
      className={cn(
        "split-feature",
        reverse && "split-feature--reverse",
        !image && tones[tone],
        !image && "split-feature--color",
      )}
    >
      {image ? <img src={image} alt="" className="split-feature__image" /> : null}
      <div className="split-feature__copy">
        <p className="kicker">{kicker}</p>
        <h3>{title}</h3>
        <p>{body}</p>
        <span className="split-feature__action">{action}</span>
      </div>
    </Link>
  );
}
