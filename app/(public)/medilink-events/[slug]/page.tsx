import type { Metadata } from "next";
import { renderSectionArticle, slugsFor } from "@/lib/content/section-route";
import { getSectionArticle } from "@/lib/content/section-articles";

export function generateStaticParams() {
  return slugsFor("/medilink-events");
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = getSectionArticle(`/medilink-events/${slug}`);
  return { title: article?.title || "MediLink Events" };
}

export default async function MediLinkEventsArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return renderSectionArticle("/medilink-events", slug);
}
