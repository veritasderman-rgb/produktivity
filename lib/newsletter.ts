import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cachedByLocale } from "@/lib/content-cache";

/**
 * Archiv odeslaných čísel newsletteru (/newsletter/archiv).
 *
 * Formát souboru je schválně stejný jako u ukázkového čísla
 * (`content/newsletter-ukazka.md`): předmět, preheader a tělo v markdownu.
 * Po rozeslání čísla se tedy jen uloží kopie do `content/newsletter/`
 * a archiv ji vypíše sám.
 *
 * Obsah leží v content/newsletter/*.mdx (cs) a content/en/newsletter/*.mdx (en).
 * Dokud tam žádné číslo není, vrací loader prázdné pole a stránka ukazuje
 * prázdný stav s odkazem na ukázku — stejně jako /rozhovory a /z-praxe.
 * Do archivu patří jen čísla, která opravdu odešla.
 */
export type NewsletterIssue = {
  slug: string;
  /** Pořadové číslo vydání. Zobrazuje se jako „Číslo 12“. */
  number: number;
  /** Předmět e-mailu — slouží zároveň jako titulek stránky. */
  subject: string;
  /** Náhledový text (preheader) — v archivu funguje jako perex. */
  preheader: string;
  /** Datum rozeslání (ISO). */
  date: string;
  minutes: number;
  body: string;
};

/** Číslo bez těla — pro výpisy. */
export type NewsletterIssueMeta = Omit<NewsletterIssue, "body">;

const FENCE_RE = /```[\s\S]*?```/g;

function readingMinutes(body: string): number {
  const words = body.replace(FENCE_RE, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

function issuesDir(locale: string = "cs") {
  return locale === "en"
    ? path.join(process.cwd(), "content", "en", "newsletter")
    : path.join(process.cwd(), "content", "newsletter");
}

function loadAllIssues(locale: string = "cs"): NewsletterIssue[] {
  const dir = issuesDir(locale);
  if (!fs.existsSync(dir)) return [];
  // Jen .mdx — SABLONA.md v téhle složce je pracovní podklad, ne odeslané číslo.
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  const issues = files.map((file) => {
    const slug = file.replace(/\.mdx$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);
    return {
      slug,
      number: Number(data.number ?? 0),
      subject: (data.subject ?? "") as string,
      preheader: (data.preheader ?? "") as string,
      date: (data.date ?? "") as string,
      minutes: Number(data.minutes ?? readingMinutes(content)),
      body: content,
    };
  });
  // Nejnovější číslo nahoře.
  return issues.sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : b.number - a.number));
}

/** Čtení z disku je cachované — viz lib/content-cache.ts. */
export const getAllIssues: (locale?: string) => NewsletterIssue[] = cachedByLocale(loadAllIssues);

function loadAllIssueMetas(locale: string = "cs"): NewsletterIssueMeta[] {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- rest destrukturing odděluje data pro server
  return getAllIssues(locale).map(({ body: _body, ...meta }) => meta);
}

/** Čtení z disku je cachované — viz lib/content-cache.ts. */
export const getAllIssueMetas: (locale?: string) => NewsletterIssueMeta[] =
  cachedByLocale(loadAllIssueMetas);

export function getIssue(slug: string, locale: string = "cs"): NewsletterIssue | undefined {
  return getAllIssues(locale).find((i) => i.slug === slug);
}
