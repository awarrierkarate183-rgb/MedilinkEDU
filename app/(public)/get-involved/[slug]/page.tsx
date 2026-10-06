import type { Metadata } from "next";
import { renderSectionArticle, slugsFor } from "@/lib/content/section-route";
import { getSectionArticle } from "@/lib/content/section-articles";

export function generateStaticParams() {
  return slugsFor("/get-involved");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getSectionArticle(`/get-involved/${slug}`);
  return { title: article?.title || "Get Involved" };
}

export default async function GetInvolvedArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderSectionArticle("/get-involved", slug);
}
