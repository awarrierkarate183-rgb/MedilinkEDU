import type { Metadata } from "next";
import { renderSectionArticle, slugsFor } from "@/lib/content/section-route";
import { getSectionArticle } from "@/lib/content/section-articles";

export function generateStaticParams() {
  return slugsFor("/competitions").filter((item) => item.slug !== "normal" && item.slug !== "legacy");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getSectionArticle(`/competitions/${slug}`);
  return { title: article?.title || "Competitions" };
}

export default async function CompetitionsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderSectionArticle("/competitions", slug);
}
