import { getAllTips } from "@/lib/tips";

/**
 * Databáze promptů = build-time extrakce z těl článků (tipů).
 * Prompty v MDX píšeme jako bloky ```text — tenhle modul je vytáhne,
 * doplní jim kontext (článek, nejbližší nadpis nad blokem, kategorie)
 * a stránka /prompty z nich udělá kopírovatelnou knihovnu.
 */

export type PromptEntry = {
  /** Stabilní id pro anchor/klíč: <slug>-<pořadí v článku>. */
  id: string;
  /** Samotný text promptu (bez fence značek). */
  text: string;
  /** Nejbližší předcházející nadpis (## nebo ###) — popisek promptu. */
  label: string;
  /** Mateřský článek. */
  slug: string;
  title: string;
  category: string;
  audience: string[];
};

export type PromptArticle = {
  slug: string;
  title: string;
  category: string;
  audience: string[];
  prompts: PromptEntry[];
};

/** Kratší bloky jsou ukázky formátů a výstupů, ne prompty k okopírování. */
const MIN_PROMPT_LENGTH = 120;

/** Blok ```text … ``` (fence na začátku řádku). */
const FENCE_RE = /^```text[^\n]*\n([\s\S]*?)^```/gm;

/** Nadpis druhé nebo třetí úrovně. */
const HEADING_RE = /^(#{2,3})[ \t]+(.+?)[ \t]*#*$/gm;

/** Odstraní inline markdown, aby se popisek dal vypsat jako čistý text. */
function plain(s: string): string {
  return s
    .replace(/\[([^\]]+)\]\([^)]*\)/g, "$1")
    .replace(/[*_`]/g, "")
    .trim();
}

function extractFromBody(body: string, fallbackLabel: string) {
  const headings: { index: number; text: string }[] = [];
  for (const m of body.matchAll(HEADING_RE)) {
    headings.push({ index: m.index ?? 0, text: plain(m[2]) });
  }

  const found: { text: string; label: string }[] = [];
  for (const m of body.matchAll(FENCE_RE)) {
    const text = m[1].replace(/\s+$/, "");
    if (text.trim().length < MIN_PROMPT_LENGTH) continue;
    const at = m.index ?? 0;
    let label = fallbackLabel;
    for (const h of headings) {
      if (h.index < at) label = h.text;
      else break;
    }
    found.push({ text, label });
  }
  return found;
}

const cache = new Map<string, PromptEntry[]>();

/** Všechny prompty ze všech tipů daného jazyka (pořadí = pořadí tipů, tj. od nejnovějších). */
export function getAllPrompts(locale: string = "cs"): PromptEntry[] {
  const cached = cache.get(locale);
  if (cached) return cached;

  const entries: PromptEntry[] = [];
  for (const tip of getAllTips(locale)) {
    extractFromBody(tip.body, tip.title).forEach((p, i) => {
      entries.push({
        id: `${tip.slug}-${i + 1}`,
        text: p.text,
        label: p.label,
        slug: tip.slug,
        title: tip.title,
        category: tip.category,
        audience: tip.audience,
      });
    });
  }

  cache.set(locale, entries);
  return entries;
}

/**
 * Články, které mají aspoň jeden prompt — pro rozcestník /prompty
 * a pro generateStaticParams detailu /prompty/[slug].
 */
export function getPromptArticles(locale: string = "cs"): PromptArticle[] {
  return groupByArticle(getAllPrompts(locale));
}

/** Prompty jednoho článku. Null = článek žádné prompty nemá (→ 404). */
export function getArticlePrompts(slug: string, locale: string = "cs"): PromptArticle | null {
  return getPromptArticles(locale).find((a) => a.slug === slug) ?? null;
}

/** Prompty seskupené po mateřských článcích (pořadí článků i promptů zachováno). */
export function groupByArticle(entries: PromptEntry[]): PromptArticle[] {
  const byslug = new Map<string, PromptArticle>();
  for (const e of entries) {
    let article = byslug.get(e.slug);
    if (!article) {
      article = {
        slug: e.slug,
        title: e.title,
        category: e.category,
        audience: e.audience,
        prompts: [],
      };
      byslug.set(e.slug, article);
    }
    article.prompts.push(e);
  }
  return [...byslug.values()];
}
