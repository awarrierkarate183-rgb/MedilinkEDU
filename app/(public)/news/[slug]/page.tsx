import type { Metadata } from "next";
import { renderSectionArticle, slugsFor } from "@/lib/content/section-route";
import { getSectionArticle } from "@/lib/content/section-articles";

export function generateStaticParams() {
  return slugsFor("/news");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getSectionArticle(`/news/${slug}`);
  return { title: article?.title || "News" };
}

export default async function NewsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderSectionArticle("/news", slug);
}
