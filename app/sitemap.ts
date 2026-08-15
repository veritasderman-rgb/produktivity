import type { MetadataRoute } from "next";
import { audienceBase, audiencePath, audiences } from "@/lib/audiences";
import { getAllTips } from "@/lib/tips";
import { getAllChapters } from "@/lib/chapters";
import { getAllNews } from "@/lib/news";
import { getPromptArticles } from "@/lib/prompts";
import { getAllInterviews } from "@/lib/interviews";
import { getAllPracticePosts } from "@/lib/practice";
import { getPaths } from "@/lib/paths";

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
    "", "/prirucka", "/tipy", "/deset-minut", "/cesty", "/ai", "/prompty", "/sablony", "/kurz", "/gadgety", "/slovnik", "/newsletter", "/newsletter/ukazka", "/start",
    "/nastroje", "/nastroje/kviz", "/nastroje/pomodoro", "/nastroje/sazba", "/nastroje/promptovac",
    "/nastroje/audit-casu",
    "/rozhovory", "/z-praxe", "/zmeny",
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

  // Profesní landing pages: segment i slug jsou lokalizované (cs /pro/*, en /for/*).
  const proHub: MetadataRoute.Sitemap = [
    {
      url: `${BASE}${audienceBase("cs")}`,
      changeFrequency: "weekly" as const,
      priority: 0.8,
      alternates: {
        languages: { cs: `${BASE}${audienceBase("cs")}`, en: `${EN_BASE}${audienceBase("en")}` },
      },
    },
    {
      url: `${EN_BASE}${audienceBase("en")}`,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    },
  ];

  const proPages = audiences.flatMap((a) => {
    const csUrl = `${BASE}${audiencePath(a, "cs")}`;
    const enUrl = `${EN_BASE}${audiencePath(a, "en")}`;
    return [
      {
        url: csUrl,
        changeFrequency: "weekly" as const,
        priority: 0.8,
        alternates: { languages: { cs: csUrl, en: enUrl } },
      },
      {
        url: enUrl,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
    ];
  });

  const tips = getAllTips().flatMap((t) => {
    const csPath = `/tipy/${t.slug}`;
    // Datum poslední revize obsahu; fallback na datum vydání.
    const lastModified = t.updated ?? t.date;
    const entries: MetadataRoute.Sitemap = [{
      url: `${BASE}${csPath}`,
      lastModified,
      changeFrequency: "monthly" as const,
      priority: 0.6,
      ...withAlternates(csPath, enTips.has(t.slug)),
    }];
    if (enTips.has(t.slug)) {
      entries.push({ url: `${EN_BASE}${csPath}`, lastModified, changeFrequency: "monthly", priority: 0.5 });
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

  // Podstránky databáze promptů — prompty jednoho článku na jedné adrese.
  const enPromptArticles = new Set(getPromptArticles("en").map((a) => a.slug));
  const promptArticles = getPromptArticles("cs").flatMap((a) => {
    const csPath = `/prompty/${a.slug}`;
    const entries: MetadataRoute.Sitemap = [{
      url: `${BASE}${csPath}`,
      changeFrequency: "monthly" as const,
      priority: 0.5,
      ...withAlternates(csPath, enPromptArticles.has(a.slug)),
    }];
    if (enPromptArticles.has(a.slug)) {
      entries.push({ url: `${EN_BASE}${csPath}`, changeFrequency: "monthly", priority: 0.4 });
    }
    return entries;
  });

  // Rubrika rozhovorů. Dokud nejsou publikované, blok je prázdný.
  const enInterviews = new Set(getAllInterviews("en").map((i) => i.slug));
  const interviews = getAllInterviews().flatMap((i) => {
    const csPath = `/rozhovory/${i.slug}`;
    const entries: MetadataRoute.Sitemap = [{
      url: `${BASE}${csPath}`,
      lastModified: i.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      ...withAlternates(csPath, enInterviews.has(i.slug)),
    }];
    if (enInterviews.has(i.slug)) {
      entries.push({ url: `${EN_BASE}${csPath}`, lastModified: i.date, changeFrequency: "yearly", priority: 0.5 });
    }
    return entries;
  });

  // Rubrika „Z praxe" — příspěvky čtenářů. Dokud nejsou publikované, blok je prázdný.
  const enPractice = new Set(getAllPracticePosts("en").map((post) => post.slug));
  const practice = getAllPracticePosts().flatMap((post) => {
    const csPath = `/z-praxe/${post.slug}`;
    const entries: MetadataRoute.Sitemap = [{
      url: `${BASE}${csPath}`,
      lastModified: post.date,
      changeFrequency: "yearly" as const,
      priority: 0.6,
      ...withAlternates(csPath, enPractice.has(post.slug)),
    }];
    if (enPractice.has(post.slug)) {
      entries.push({ url: `${EN_BASE}${csPath}`, lastModified: post.date, changeFrequency: "yearly", priority: 0.5 });
    }
    return entries;
  });

  // Detaily cest — URL segment /cesty je stejný v obou jazycích, liší se jen obsah.
  const enPaths = new Set(getPaths("en").map((p) => p.id));
  const learningPaths = getPaths("cs").flatMap((path) => {
    const csPath = `/cesty/${path.id}`;
    const entries: MetadataRoute.Sitemap = [{
      url: `${BASE}${csPath}`,
      changeFrequency: "monthly" as const,
      priority: 0.7,
      ...withAlternates(csPath, enPaths.has(path.id)),
    }];
    if (enPaths.has(path.id)) {
      entries.push({ url: `${EN_BASE}${csPath}`, changeFrequency: "monthly", priority: 0.6 });
    }
    return entries;
  });

  return [
    ...staticRoutes, ...proHub, ...proPages, ...chapters, ...tips, ...news,
    ...promptArticles, ...interviews, ...practice, ...learningPaths,
  ];
}
