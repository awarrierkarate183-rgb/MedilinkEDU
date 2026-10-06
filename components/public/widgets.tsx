import Link from "next/link";
import { NavIcon } from "@/components/public/NavIcon";
import type { NavIcon as NavIconName } from "@/lib/content/public-nav";
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

export function ColorWidgets({
  items,
}: {
  items: Array<{ href: string; label: string; icon: NavIconName; tone: keyof typeof tones }>;
}) {
  return (
    <div className="color-widgets">
      {items.map((item) => (
        <Link
          key={item.href + item.label}
          href={item.href as never}
          className={cn("color-widget", tones[item.tone])}
        >
          <NavIcon name={item.icon} className="h-7 w-7 shrink-0" />
          <span>{item.label}</span>
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
}: {
  href: string;
  image: string;
  kicker: string;
  title: string;
  body?: string;
}) {
  return (
    <Link href={href as never} className="photo-tile">
      <img src={image} alt="" className="photo-tile__image" />
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
}: {
  href: string;
  image: string;
  kicker: string;
  title: string;
  body: string;
  action: string;
  reverse?: boolean;
}) {
  return (
    <Link href={href as never} className={cn("split-feature", reverse && "split-feature--reverse")}>
      <img src={image} alt="" className="split-feature__image" />
      <div className="split-feature__copy">
        <p className="kicker">{kicker}</p>
        <h3>{title}</h3>
        <p>{body}</p>
        <span className="split-feature__action">{action}</span>
      </div>
    </Link>
  );
}
