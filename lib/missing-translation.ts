import { notFound, redirect } from "next/navigation";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Co dělat, když detail článku v aktuálním jazyce neexistuje.
 *
 * Přepínač jazyka v hlavičce drží cestu (viz components/LangSwitch.tsx),
 * takže na článku, který v druhém jazyce zatím nevyšel, poslal čtenáře na
 * 404. Obsah přitom mezi jazyky běžně nabíhá různě rychle — celá sekce
 * /agenti je zatím jen česky, u návodů chybí pár překladů.
 *
 * Když slug v druhém jazyce existuje, jde tedy prokazatelně jen o chybějící
 * překlad a čtenáře pošleme na rozcestník sekce v jazyce, na který přepnul.
 * Neexistující slug (překlep, mrtvý odkaz) 404 zůstává — z chyby se nesmí
 * stát tichý redirect.
 *
 * Volá se místo `notFound()`; obě větve vyhazují, takže TypeScript za
 * voláním správně zúží typ na „článek existuje“.
 */
export function missingTranslation(
  locale: Locale,
  existsInOtherLocale: boolean,
  sectionPath: string,
): never {
  if (existsInOtherLocale) redirect(localePath(locale, sectionPath));
  notFound();
}
