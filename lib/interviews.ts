import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";

/**
 * Rubrika „Jak pracuje…" — písemné rozhovory se skutečnými lidmi.
 * Obsah leží v content/rozhovory/*.mdx (cs) a content/en/rozhovory/*.mdx (en).
 * Dokud tam žádný .mdx není, vrací loader prázdné pole a rubrika ukazuje prázdný stav.
 */
export type Interview = {
  slug: string;
  /** Jméno zpovídaného — reálná osoba, nikdy vymyšlená. */
  name: string;
  /** Profese / firma, např. „vývojářka, Seznam.cz". */
  role: string;
  excerpt: string;
  date: string;
  /** Cesta k fotce v /public, např. /img/rozhovory/jmeno.webp. */
  photo?: string;
  /** Volitelný titulek místo automatického „Jak pracuje {name}". */
  title?: string;
  minutes: number;
  body: string;
};

const FENCE_RE = /```[\s\S]*?```/g;

function readingMinutes(body: string): number {
  const words = body.replace(FENCE_RE, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function interviewsDir(locale: string = "cs") {
  return locale === "en"
    ? path.join(process.cwd(), "content", "en", "rozhovory")
    : path.join(process.cwd(), "content", "rozhovory");
}

export function getAllInterviews(locale: string = "cs"): Interview[] {
  const dir = interviewsDir(locale);
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const items = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      name: data.name as string,
      role: data.role as string,
      excerpt: data.excerpt as string,
      date: data.date as string,
      photo: data.photo as string | undefined,
      title: data.title as string | undefined,
      minutes: Number(data.minutes ?? readingMinutes(content)),
      body: content,
    };
  });
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

export function getInterview(slug: string, locale: string = "cs"): Interview | undefined {
  return getAllInterviews(locale).find((i) => i.slug === slug);
}

/** Titulek rozhovoru: z frontmatteru, jinak „Jak pracuje {jméno}". */
export function interviewTitle(interview: Interview, locale: string = "cs"): string {
  if (interview.title) return interview.title;
  return locale === "en" ? `How ${interview.name} works` : `Jak pracuje ${interview.name}`;
}
