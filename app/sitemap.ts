import type { MetadataRoute } from "next";
import { getAllTips } from "@/lib/tips";
import { getAllChapters } from "@/lib/chapters";
import { getAllNews } from "@/lib/news";

const BASE = "https://produktivni.cz";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = [
    "", "/prirucka", "/tipy", "/ai", "/skoleni", "/newsletter", "/start",
    "/o-projektu", "/hledat", "/ochrana-osobnich-udaju",
  ].map((p) => ({
    url: `${BASE}${p}`,
    changeFrequency: "weekly" as const,
    priority: p === "" ? 1 : 0.8,
  }));

  const tips = getAllTips().map((t) => ({
    url: `${BASE}/tipy/${t.slug}`,
    lastModified: t.date,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const chapters = getAllChapters().map((c) => ({
    url: `${BASE}/prirucka/${c.slug}`,
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  const news = getAllNews().map((n) => ({
    url: `${BASE}/ai/${n.slug}`,
    lastModified: n.date,
    changeFrequency: "yearly" as const,
    priority: 0.5,
  }));

  return [...staticRoutes, ...chapters, ...tips, ...news];
}
