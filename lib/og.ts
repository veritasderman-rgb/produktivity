import type { Locale } from "@/lib/i18n";

/** Doména podle jazyka — štítek na náhledovém obrázku i v jeho URL. */
const DOMAIN: Record<Locale, string> = {
  cs: "produktivni.cz",
  en: "productive.tips",
};

/**
 * URL náhledového obrázku (og:image) generovaného v /api/og.
 *
 * Štítek se odvozuje od jazyka, aby anglická mutace neukazovala českou doménu;
 * volitelná rubrika se připojí za tečku, stejně jako u detailů návodů
 * („productive.tips · tip“).
 */
export function ogImage(title: string, locale: Locale, section?: string): string {
  const label = section ? `${DOMAIN[locale]} · ${section}` : DOMAIN[locale];
  return `/api/og?title=${encodeURIComponent(title)}&label=${encodeURIComponent(label)}`;
}
