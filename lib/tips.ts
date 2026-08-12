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
  body: string;
};

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
      body: content,
    };
  });
  return tips.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getTip(slug: string, locale: string = "cs"): Tip | undefined {
  return getAllTips(locale).find((t) => t.slug === slug);
}
