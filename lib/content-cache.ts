/**
 * Cache načteného obsahu.
 *
 * Články, kapitoly i novinky se čtou z disku a mezi nasazeními se nemění,
 * takže stačí načíst je jednou za život procesu. Bez toho každé volání znovu
 * přečte a naparsuje stovky MDX souborů — a protože se police na homepage
 * ptají na jednotlivé návody v cyklu, sáhne jeden požadavek na disk desetkrát
 * i vícekrát a render trvá vteřiny místo milisekund.
 *
 * Volajícímu vracíme kopii pole: uložená data tak nikdo nerozhodí tím, že si
 * výsledek seřadí nebo otočí na místě.
 *
 * Ve vývoji se necachuje, ať se úpravy v content/ projeví bez restartu serveru.
 */
const enabled = process.env.NODE_ENV === "production";

/** Obalí načítací funkci, která bere jazyk a vrací pole položek. */
export function cachedByLocale<T>(load: (locale: string) => T[]): (locale?: string) => T[] {
  const cache = new Map<string, T[]>();
  return (locale = "cs") => {
    if (!enabled) return load(locale);
    let items = cache.get(locale);
    if (!items) {
      items = load(locale);
      cache.set(locale, items);
    }
    return [...items];
  };
}

/** Totéž pro načítání bez jazyka. */
export function cachedList<T>(load: () => T[]): () => T[] {
  let items: T[] | undefined;
  return () => {
    if (!enabled) return load();
    if (!items) items = load();
    return [...items];
  };
}
