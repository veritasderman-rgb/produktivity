import type { Locale } from "@/lib/i18n";

/** Popisek řádku „naposledy ověřeno" pod nadpisem článku. */
export const reviewedLabel: Record<Locale, string> = {
  cs: "Naposledy ověřeno",
  en: "Last reviewed",
};

/**
 * Datum revize pro čtenáře: cs `12. 8. 2026`, en `12 Aug 2026`.
 * Vrací null, když datum chybí nebo není ve tvaru YYYY-MM-DD.
 */
export function formatReviewed(iso: string | undefined, locale: Locale): string | null {
  if (!iso || !/^\d{4}-\d{2}-\d{2}/.test(iso)) return null;
  const [y, m, d] = iso.slice(0, 10).split("-").map(Number);
  if (locale === "en") {
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return `${d}. ${m}. ${y}`;
}
