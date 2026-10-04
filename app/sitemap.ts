import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/utils";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = siteUrl();
  const routes = [
    "",
    "/about",
    "/chapters",
    "/curriculum",
    "/competitions",
    "/get-involved",
    "/news",
    "/contact",
    "/start-a-chapter",
    "/start-a-chapter/apply",
    "/partner",
    "/sponsor",
  ];
  return routes.map((route) => ({
    url: `${base}${route}`,
    changeFrequency: "weekly",
    priority: route === "" ? 1 : 0.7,
  }));
}
