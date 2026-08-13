import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

export type Tip = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  platform: string;
  audience: string[];
  keys: string[][];
  saves: string;
  date: string;
  /** Datum poslední revize obsahu (ISO). Když ve frontmatteru chybí, použije se `date`. */
  updated?: string;
  body: string;
  /** Odhad čtení: 200 slov za minutu, kódové bloky se nepočítají. */
  minutes: number;
  /** Velký návod (přes 15 000 znaků) — na kartě dostane odznak. */
  isMega: boolean;
};

const FENCE_RE = /```[\s\S]*?```/g;
const MEGA_CHARS = 15000;

function readingMinutes(body: string): number {
  const words = body.replace(FENCE_RE, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function tipsDir(locale: string = "cs") {
  return locale === "en"
    ? path.join(process.cwd(), "content", "en", "tipy")
    : path.join(process.cwd(), "content", "tipy");
}

export function getAllTips(locale: string = "cs"): Tip[] {
  const dir = tipsDir(locale);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const tips = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      title: data.title as string,
      excerpt: data.excerpt as string,
      category: data.category as string,
      platform: data.platform as string,
      audience: (data.audience ?? []) as string[],
      keys: (data.keys ?? []) as string[][],
      saves: data.saves as string,
      date: data.date as string,
      updated: (data.updated ?? data.date) as string | undefined,
      body: content,
      minutes: readingMinutes(content),
      isMega: content.length >= MEGA_CHARS,
    };
  });
  return tips.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getTip(slug: string, locale: string = "cs"): Tip | undefined {
  return getAllTips(locale).find((t) => t.slug === slug);
}
