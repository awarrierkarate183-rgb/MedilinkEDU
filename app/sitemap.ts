import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";
import { publicNav } from "@/lib/content/public-nav";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const routes = [
    "",
    "/contact",
    "/start-a-chapter",
    "/start-a-chapter/apply",
    "/partner",
    "/sponsor",
    ...publicNav.flatMap((tab) => [tab.href, ...tab.items.map((item) => item.href)]),
  ];
  return [...new Set(routes)].map((route) => ({
    url: `${base}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
