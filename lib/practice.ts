import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Rubrika „Z praxe" — workflow od čtenářů: jak reálně používají AI ve své práci.
 * Obsah leží v content/z-praxe/*.mdx (cs) a content/en/z-praxe/*.mdx (en).
 * Příspěvky posílají čtenáři formulářem, Ctrl je přepíše do standardního
 * formátu (viz content/z-praxe/SABLONA.md), Josef schválí a autor autorizuje.
 * Dokud tam žádný .mdx není, vrací loader prázdné pole a rubrika ukazuje
 * prázdný stav — nic se nevymýšlí.
 */
export type PracticePost = {
  slug: string;
  title: string;
  /** Jméno nebo přezdívka autora — skutečný čtenář, nikdy vymyšlený. */
  author: string;
  /** Profese / obor, např. „účetní ve výrobní firmě". */
  role: string;
  date: string;
  excerpt: string;
  /** Názvy nástrojů, které v postupu hrají roli, např. ["ChatGPT", "Excel"]. */
  tools: string[];
  minutes: number;
  body: string;
};

const FENCE_RE = /```[\s\S]*?```/g;

function readingMinutes(body: string): number {
  const words = body.replace(FENCE_RE, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function practiceDir(locale: string = "cs") {
  return locale === "en"
    ? path.join(process.cwd(), "content", "en", "z-praxe")
    : path.join(process.cwd(), "content", "z-praxe");
}

export function getAllPracticePosts(locale: string = "cs"): PracticePost[] {
  const dir = practiceDir(locale);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const items = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title as string,
      author: data.author as string,
      role: data.role as string,
      date: data.date as string,
      excerpt: data.excerpt as string,
      tools: Array.isArray(data.tools) ? (data.tools as string[]) : [],
      minutes: Number(data.minutes ?? readingMinutes(content)),
      body: content,
    };
  });
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getPracticePost(slug: string, locale: string = "cs"): PracticePost | undefined {
  return getAllPracticePosts(locale).find((p) => p.slug === slug);
}
