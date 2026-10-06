import { notFound } from "next/navigation";
import { ArticlePage } from "@/components/public/ArticlePage";
import { publicNav } from "@/lib/content/public-nav";
import { getSectionArticle } from "@/lib/content/section-articles";

export function slugsFor(tabHref: string) {
  const tab = publicNav.find((item) => item.href === tabHref);
  if (!tab) return [];
  return tab.items.map((item) => ({ slug: item.href.slice(tabHref.length + 1) }));
}

export function renderSectionArticle(tabHref: string, slug: string) {
  const href = `${tabHref}/${slug}`;
  const article = getSectionArticle(href);
  if (!article) notFound();
  return (
    <ArticlePage
      href={article.href}
      title={article.title}
      lead={article.lead}
      blocks={article.blocks}
      actions={article.actions}
    />
  );
}
