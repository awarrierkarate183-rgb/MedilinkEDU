import type { ReactNode } from "react";
import Link from "next/link";
import { PageHero } from "@/components/public/PageHero";
import { ButtonLink } from "@/components/ui/Button";
import { navTabByHref, type NavTab } from "@/lib/content/public-nav";

export type ArticleBlock = {
  heading: string;
  body: string[];
};

export function ArticlePage({
  href,
  title,
  lead,
  blocks,
  actions,
}: {
  href: string;
  title: string;
  lead: string;
  blocks: ArticleBlock[];
  actions?: Array<{ href: string; label: string; variant?: "primary" | "secondary" | "outline" }>;
}) {
  const tab = navTabByHref(href);
  return (
    <>
      <PageHero kicker={tab?.label} title={title} lead={lead} />
      <section className="band">
        <div className="container-ml grid gap-10 lg:grid-cols-[0.72fr_0.28fr]">
          <article className="space-y-10">
            {blocks.map((block) => (
              <section key={block.heading}>
                <h2 className="tab-heading text-3xl md:text-4xl">{block.heading}</h2>
                <div className="mt-4 max-w-3xl space-y-4 text-lg leading-8 text-muted">
                  {block.body.map((paragraph) => (
                    <p key={paragraph.slice(0, 48)}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
            {actions?.length ? (
              <div className="flex flex-wrap gap-3">
                {actions.map((action) => (
                  <ButtonLink key={action.href} href={action.href as never} variant={action.variant || "primary"}>
                    {action.label}
                  </ButtonLink>
                ))}
              </div>
            ) : null}
          </article>
          {tab ? <SectionRail tab={tab} current={href} /> : null}
        </div>
      </section>
    </>
  );
}

export function SectionHub({
  tab,
  title,
  lead,
  children,
}: {
  tab: NavTab;
  title: string;
  lead: string;
  children?: ReactNode;
}) {
  return (
    <>
      <PageHero kicker={tab.label} title={title} lead={lead} />
      {children}
      <section className="band">
        <div className="container-ml">
          <p className="kicker">In this section</p>
          <h2 className="tab-heading mb-8 text-3xl md:text-4xl">Open a subsection</h2>
          <div className="grid gap-4 md:grid-cols-2">
            {tab.items.map((item, index) => (
              <Link
                key={item.href}
                href={item.href as never}
                className="rounded-[var(--radius)] border border-border bg-white p-6 transition hover:-translate-y-0.5 hover:shadow-[var(--shadow)]"
              >
                <p className="kicker">0{index + 1}</p>
                <h3 className="tab-heading text-2xl">{item.label}</h3>
                <p className="mt-2 text-muted">{item.blurb}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function SectionRail({ tab, current }: { tab: NavTab; current: string }) {
  return (
    <aside className="h-fit rounded-[var(--radius)] bg-navy p-6 text-white lg:sticky lg:top-[calc(var(--header-h)+1.25rem)]">
      <p className="kicker">{tab.kicker}</p>
      <p className="tab-heading text-2xl">{tab.label}</p>
      <p className="mt-3 text-sm text-white/70">{tab.blurb}</p>
      <ul className="mt-6 space-y-3 text-sm">
        <li>
          <Link href={tab.href as never} className={current === tab.href ? "text-gold" : "text-white/80 hover:text-white"}>
            Overview
          </Link>
        </li>
        {tab.items.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href as never}
              className={current === item.href ? "text-gold" : "text-white/80 hover:text-white"}
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </aside>
  );
}
