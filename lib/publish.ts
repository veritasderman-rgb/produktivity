/**
 * Fronta publikování.
 *
 * Článek se na webu objeví až v den, který nese ve frontmatteru jako `date`.
 * Díky tomu jde napsat a schválit pět článků najednou a nechat je vyjít
 * postupně — stačí jim dát pět různých dat. Soubor s budoucím datem leží
 * v repozitáři, ale web ho do toho dne neukáže: není ve výpisech, v RSS,
 * v sitemapě ani ve vyhledávání a jeho adresa vrací 404.
 *
 * „Dnes“ se počítá v českém čase, ať článek vyjde o půlnoci v Praze,
 * a ne o hodinu či dvě později podle UTC.
 *
 * Filtr se musí vyhodnocovat při každém čtení, ne jednou při načtení
 * z disku — proto stojí až za cache v lib/content-cache.ts.
 *
 * Proměnné prostředí:
 * - `SHOW_SCHEDULED=1` ukáže i naplánované články (náhled, kontrola buildu),
 * - `PUBLISH_TODAY=YYYY-MM-DD` podvrhne dnešní datum (testy).
 */
const DATE_RE = /^\d{4}-\d{2}-\d{2}/;

const pragueDate = new Intl.DateTimeFormat("en-CA", {
  timeZone: "Europe/Prague",
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** Dnešní datum v českém čase jako YYYY-MM-DD. */
export function todayPrague(): string {
  const forced = process.env.PUBLISH_TODAY;
  if (forced && DATE_RE.test(forced)) return forced.slice(0, 10);
  return pragueDate.format(new Date());
}

/** Je položka s tímhle datem už venku? Chybějící nebo nečitelné datum nic neskrývá. */
export function isPublished(date: unknown): boolean {
  if (process.env.SHOW_SCHEDULED === "1") return true;
  if (typeof date !== "string" || !DATE_RE.test(date)) return true;
  return date.slice(0, 10) <= todayPrague();
}

/** Obalí cachovaný výpis tak, aby vracel jen už vydané položky. */
export function publishedOnly<T extends { date?: string }>(
  getAll: (locale?: string) => T[],
): (locale?: string) => T[] {
  return (locale) => getAll(locale).filter((item) => isPublished(item.date));
}
