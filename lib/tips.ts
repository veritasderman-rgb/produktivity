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

const TIPS_DIR = path.join(process.cwd(), "content", "tipy");

export function getAllTips(): Tip[] {
  const files = fs.readdirSync(TIPS_DIR).filter((f) => f.endsWith(".mdx"));
  const tips = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(TIPS_DIR, file), "utf8");
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

export function getTip(slug: string): Tip | undefined {
  return getAllTips().find((t) => t.slug === slug);
}
