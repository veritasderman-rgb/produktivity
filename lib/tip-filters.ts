import type { TipMeta } from "@/lib/tips";

/**
 * Sdílená filtrovací logika pro výpisy tipů.
 *
 * Používá ji server komponenta /tipy (filtry z URL, ?kategorie=…&platforma=…)
 * i klientský TipBrowser na profesních stránkách /pro/*. Soubor nesmí
 * importovat nic ze serveru (fs) — jen typy, aby šel použít v "use client".
 */

/** Počet karet na stránku výpisu /tipy (?strana=N). */
export const TIPS_PER_PAGE = 30;

export type TipFilterQuery = {
  category?: string | null;
  platform?: string | null;
  audience?: string | null;
  q?: string | null;
  /** "pruvodce" = jen velké návody (isGuide). */
  typ?: string | null;
};

/** Bez diakritiky a velkých písmen — „Schránka“ najde i „schranka“. */
export function normalizeSearch(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase();
}

/** Jediný zdroj pravdy pro filtrování: kategorie, platforma („vsude“ projde vždy), publikum, fulltext. */
export function filterTips<T extends TipMeta>(tips: T[], filter: TipFilterQuery): T[] {
  const q = normalizeSearch((filter.q ?? "").trim());
  return tips.filter((t) => {
    if (filter.typ === "pruvodce" && !t.isGuide) return false;
    if (filter.category && t.category !== filter.category) return false;
    if (filter.platform && t.platform !== filter.platform && t.platform !== "vsude") return false;
    if (filter.audience && !t.audience.includes(filter.audience)) return false;
    if (q) {
      const hay = normalizeSearch(`${t.title} ${t.excerpt} ${t.keys.flat().join(" ")}`);
      if (!hay.includes(q)) return false;
    }
    return true;
  });
}

/** Počty tipů podle hodnoty pole (kategorie/platforma/publikum) — pro čísla u filtrů. */
export function countTipValues(
  tips: TipMeta[],
  field: (t: TipMeta) => string | string[],
): Record<string, number> {
  const acc: Record<string, number> = {};
  for (const t of tips) {
    const v = field(t);
    for (const item of Array.isArray(v) ? v : [v]) acc[item] = (acc[item] ?? 0) + 1;
  }
  return acc;
}
