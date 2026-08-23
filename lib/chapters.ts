import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cachedByLocale } from "@/lib/content-cache";

export type Chapter = {
  slug: string;
  title: string;
  excerpt: string;
  section: "zaklady" | "metody" | "nastroje" | "situace" | "skola" | "firma" | "freelancing" | "uceni" | "doma";
  order: number;
  minutes: number;
  /** Datum poslední revize obsahu (ISO). Kapitoly nemají `date`, takže bez frontmatteru zůstává prázdné. */
  updated?: string;
  body: string;
};

export const sectionLabels: Record<Chapter["section"], string> = {
  zaklady: "Základy",
  metody: "Metody",
  nastroje: "Nástroje",
  situace: "Situace",
  skola: "Ve škole",
  firma: "Ve firmě",
  freelancing: "Na volné noze",
  uceni: "Učení",
  doma: "Doma",
};

export const sectionLabelsEn: Record<Chapter["section"], string> = {
  zaklady: "Foundations",
  metody: "Methods",
  nastroje: "Tools",
  situace: "Situations",
  skola: "At school",
  firma: "At the company",
  freelancing: "Freelancing",
  uceni: "Learning",
  doma: "At home",
};

export function getSectionLabels(locale: string = "cs") {
  return locale === "en" ? sectionLabelsEn : sectionLabels;
}

function chaptersDir(locale: string = "cs") {
  return locale === "en"
    ? path.join(process.cwd(), "content", "en", "prirucka")
    : path.join(process.cwd(), "content", "prirucka");
}

function loadAllChapters(locale: string = "cs"): Chapter[] {
  const DIR = chaptersDir(locale);
  if (!fs.existsSync(DIR)) return [];
  const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".mdx"));
  const chapters = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(DIR, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title as string,
      excerpt: data.excerpt as string,
      section: data.section as Chapter["section"],
      order: Number(data.order),
      minutes: Number(data.minutes ?? Math.max(3, Math.round(content.split(/\s+/).length / 200))),
      updated: data.updated as string | undefined,
      body: content,
    };
  });
  return chapters.sort((a, b) => a.order - b.order);
}

/** Čtení z disku je cachované — viz lib/content-cache.ts. */
export const getAllChapters: (locale?: string) => Chapter[] = cachedByLocale(loadAllChapters);

export function getChapter(slug: string, locale: string = "cs"): Chapter | undefined {
  return getAllChapters(locale).find((c) => c.slug === slug);
}
