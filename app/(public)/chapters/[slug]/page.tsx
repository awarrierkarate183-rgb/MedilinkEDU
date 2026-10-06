import type { Metadata } from "next";
import { renderSectionArticle, slugsFor } from "@/lib/content/section-route";
import { getSectionArticle } from "@/lib/content/section-articles";

export function generateStaticParams() {
  return slugsFor("/chapters");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getSectionArticle(`/chapters/${slug}`);
  return { title: article?.title || "Chapters" };
}

export default async function ChaptersArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderSectionArticle("/chapters", slug);
}
