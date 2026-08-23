import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cachedByLocale } from "@/lib/content-cache";

export type NewsItem = {
  slug: string;
  title: string;
  excerpt: string;
  date: string;
  source?: string;
  sourceName?: string;
  minutes: number;
  body: string;
};

function newsDir(locale: string = "cs") {
  return locale === "en"
    ? path.join(process.cwd(), "content", "en", "ai")
    : path.join(process.cwd(), "content", "ai");
}

function loadAllNews(locale: string = "cs"): NewsItem[] {
  const DIR = newsDir(locale);
  if (!fs.existsSync(DIR)) return [];
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx"));
  const items = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(DIR, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title as string,
      excerpt: data.excerpt as string,
      date: data.date as string,
      source: data.source as string | undefined,
      sourceName: data.sourceName as string | undefined,
      minutes: Number(data.minutes ?? Math.max(2, Math.round(content.split(/\s+/).length / 200))),
      body: content,
    };
  });
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Čtení z disku je cachované — viz lib/content-cache.ts. */
export const getAllNews: (locale?: string) => NewsItem[] = cachedByLocale(loadAllNews);

export function getNewsItem(slug: string, locale: string = "cs"): NewsItem | undefined {
  return getAllNews(locale).find((n) => n.slug === slug);
}
