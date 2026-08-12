import type { MetadataRoute } from "next";
import { getAllTips } from "@/lib/tips";
import { getAllChapters } from "@/lib/chapters";
import { getAllNews } from "@/lib/news";

const BASE = "https://produktivni.cz";
const EN_BASE = "https://productive.tips";

function withAlternates(csPath: string, hasEn: boolean) {
  return hasEn
    ? { alternates: { languages: { cs: `${BASE}${csPath}`, en: `${EN_BASE}${csPath}` } } }
    : {};
}

export default function sitemap(): MetadataRoute.Sitemap {
  const enTips = new Set(getAllTips("en").map((t) => t.slug));
  const enChapters = new Set(getAllChapters("en").map((c) => c.slug));
  const enNews = new Set(getAllNews("en").map((n) => n.slug));

  const staticPaths = [
    "", "/prirucka", "/tipy", "/ai", "/gadgety", "/newsletter", "/start",
    "/o-projektu", "/hledat", "/ochrana-osobnich-udaju",
  ];

  const staticRoutes = staticPaths.flatMap((p) => [
    {
      url: `${BASE}${p}`,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 1 : 0.8,
      ...withAlternates(p || "/", true),
    },
    {
      url: `${EN_BASE}${p}`,
      changeFrequency: "weekly" as const,
      priority: p === "" ? 0.9 : 0.7,
    },
  ]);

  const tips = getAllTips().flatMap((t) => {
    const csPath = `/tipy/${t.slug}`;
    const entries: MetadataRoute.Sitemap = [{
      url: `${BASE}${csPath}`,
      lastModified: t.date,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      ...withAlternates(csPath, enTips.has(t.slug)),
    }];
    if (enTips.has(t.slug)) {
      entries.push({ url: `${EN_BASE}${csPath}`, lastModified: t.date, changeFrequency: "monthly", priority: 0.5 });
    }
    return entries;
  });

  const chapters = getAllChapters().flatMap((c) => {
    const csPath = `/prirucka/${c.slug}`;
    const entries: MetadataRoute.Sitemap = [{
      url: `${BASE}${csPath}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...withAlternates(csPath, enChapters.has(c.slug)),
    }];
    if (enChapters.has(c.slug)) {
      entries.push({ url: `${EN_BASE}${csPath}`, changeFrequency: "monthly", priority: 0.6 });
    }
    return entries;
  });

  const news = getAllNews().flatMap((n) => {
    const csPath = `/ai/${n.slug}`;
    const entries: MetadataRoute.Sitemap = [{
      url: `${BASE}${csPath}`,
      lastModified: n.date,
      changeFrequency: "yearly" as const,
      priority: 0.5,
      ...withAlternates(csPath, enNews.has(n.slug)),
    }];
    if (enNews.has(n.slug)) {
      entries.push({ url: `${EN_BASE}${csPath}`, lastModified: n.date, changeFrequency: "yearly", priority: 0.4 });
    }
    return entries;
  });

  return [...staticRoutes, ...chapters, ...tips, ...news];
}
