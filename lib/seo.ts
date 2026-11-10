import type { Metadata } from "next";
import type { Locale } from "@/lib/i18n";

/**
 * Pomocníci pro metadata detailů článků. Perexy na webu jsou psané pro čtenáře
 * a bývají delší, než vyhledávač zobrazí; do `<meta name="description">` proto
 * jde jejich zkrácená podoba, na stránce zůstává plné znění.
 */

/** Kolik znaků popisku vyhledávače spolehlivě zobrazí. */
const DESCRIPTION_MAX = 158;
/** Přípona „ · Produktivní.cz“ z šablony titulku má 17 znaků; s ní se má titulek vejít do výsledku hledání. */
const TITLE_WITH_SUFFIX_MAX = 62;
const SUFFIX_LENGTH = 17;

/** Zkrátí text na hranici slova a doplní výpustku. Kratší text vrací beze změny. */
export function metaDescription(text: string, max: number = DESCRIPTION_MAX): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const cut = clean.slice(0, max - 1);
  const lastSpace = cut.lastIndexOf(" ");
  const base = (lastSpace > max * 0.6 ? cut.slice(0, lastSpace) : cut).replace(/[\s,;:—–-]+$/, "");
  return `${base}…`;
}

/**
 * Titulek pro `<title>`. Dlouhý titulek by se s příponou značky ve výsledcích
 * uřízl uprostřed, proto u něj příponu vynecháváme — název článku má přednost.
 */
export function metaTitle(title: string): Metadata["title"] {
  return title.length + SUFFIX_LENGTH > TITLE_WITH_SUFFIX_MAX ? { absolute: title } : title;
}

/** Open Graph pro článek: typ, jazyk a data vydání a revize. */
export function articleOpenGraph(opts: {
  title: string;
  description: string;
  locale: Locale;
  image: string;
  published?: string;
  modified?: string;
}): NonNullable<Metadata["openGraph"]> {
  return {
    type: "article",
    locale: opts.locale === "en" ? "en_US" : "cs_CZ",
    title: opts.title,
    description: metaDescription(opts.description, 200),
    images: [opts.image],
    ...(opts.published ? { publishedTime: opts.published } : {}),
    ...(opts.modified ? { modifiedTime: opts.modified } : {}),
    authors: ["Josef Pavlovic"],
  };
}
