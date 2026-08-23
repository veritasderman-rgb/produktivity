import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cachedByLocale } from "@/lib/content-cache";

export type FaqItem = { q: string; a: string };

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
  /**
   * Datum ověření faktů proti živým nástrojům (ISO) — silnější událost než
   * `updated` (redakční úprava). Zapisuje se JEN po skutečném ověřovacím běhu
   * (viz docs/OVEROVANI.md), nikdy plošně skriptem. Bez pole se nic nezobrazí.
   */
  tested?: string;
  body: string;
  /** Odhad čtení: 200 slov za minutu, kódové bloky se nepočítají. */
  minutes: number;
  /** Velký návod (přes 15 000 znaků) — na kartě dostane odznak. */
  isMega: boolean;
  /** Velký průvodce (přes 18 000 znaků) — počítá se do živých čísel na homepage. */
  isGuide: boolean;
  /** Hrubý odhad času na PROVEDENÍ velkého průvodce v hodinách. Jen pro `isGuide`. */
  doingHours?: number;
  /** TL;DR (2–3 věty) — zvýrazněný blok pod hero a `abstract` v article JSON-LD. */
  tldr?: string;
  /** Časté otázky — blok `<details>` před sekcí „Pomohlo?" a FAQPage JSON-LD. */
  faq?: FaqItem[];
};

/**
 * Lehká varianta tipu bez těla — jediné, co se smí posílat klientským
 * komponentám a výpisům. Tělo (MDX) má u velkých návodů desítky kB;
 * 307 těl v props klientské komponenty nafouklo /tipy na 3,6 MB HTML.
 */
export type TipMeta = Omit<Tip, "body">;

export function tipMeta(tip: Tip): TipMeta {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars -- rest destrukturing odděluje tělo
  const { body: _body, ...meta } = tip;
  return meta;
}

function loadAllTipMetas(locale: string = "cs"): TipMeta[] {
  return getAllTips(locale).map(tipMeta);
}

/** Čtení z disku je cachované — viz lib/content-cache.ts. */
export const getAllTipMetas: (locale?: string) => TipMeta[] = cachedByLocale(loadAllTipMetas);

const FENCE_RE = /```[\s\S]*?```/g;
const MEGA_CHARS = 15000;
const GUIDE_CHARS = 18000;

function readingMinutes(body: string): number {
  const words = body.replace(FENCE_RE, " ").split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}

/** Hrubý odhad provedení velkého průvodce podle délky těla: 18–30k znaků ≈ 1 h, 30–45k ≈ 2 h, 45k+ ≈ 3 h. */
function guideDoingHours(chars: number): number {
  if (chars >= 45000) return 3;
  if (chars >= 30000) return 2;
  return 1;
}

function tipsDir(locale: string = "cs") {
  return locale === "en"
    ? path.join(process.cwd(), "content", "en", "tipy")
    : path.join(process.cwd(), "content", "tipy");
}

function loadAllTips(locale: string = "cs"): Tip[] {
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
      tested: typeof data.tested === "string" ? data.tested : undefined,
      body: content,
      minutes: readingMinutes(content),
      isMega: content.length >= MEGA_CHARS,
      isGuide: content.length >= GUIDE_CHARS,
      doingHours: content.length >= GUIDE_CHARS ? guideDoingHours(content.length) : undefined,
      tldr: typeof data.tldr === "string" ? data.tldr.trim() : undefined,
      faq:
        Array.isArray(data.faq) && data.faq.length > 0
          ? (data.faq as FaqItem[])
              .filter((f) => typeof f?.q === "string" && typeof f?.a === "string")
              .map((f) => ({ q: f.q.trim(), a: f.a.trim() }))
          : undefined,
    };
  });
  return tips.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Čtení z disku je cachované — viz lib/content-cache.ts. */
export const getAllTips: (locale?: string) => Tip[] = cachedByLocale(loadAllTips);

export function getTip(slug: string, locale: string = "cs"): Tip | undefined {
  return getAllTips(locale).find((t) => t.slug === slug);
}

/** Kolik z návodů je velkých průvodců (tělo přes 18 000 znaků). Počítá se za běhu buildu. */
export function countGuides(locale: string = "cs"): number {
  return getAllTips(locale).filter((tip) => tip.isGuide).length;
}
