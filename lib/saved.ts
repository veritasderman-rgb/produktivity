/* ---------------------------------------------------------------------------
   Uložené články, rozečtené a oblíbené prompty — vše jen v localStorage
   tohoto prohlížeče, bez účtů a bez serveru.

   Vzor stejný jako v PathProgress: stav žije mimo React, komponenty ho čtou
   přes useSyncExternalStore (snapshot = surový řetězec z localStorage,
   porovnává se hodnotou). Server vždy vykreslí prázdný stav, klient se po
   připojení sám srovná — žádný setState v efektu.
--------------------------------------------------------------------------- */

export type SavedType = "tip" | "kapitola";

export type SavedItem = { type: SavedType; slug: string; title: string; savedAt: number };
export type RecentItem = { type: SavedType; slug: string; title: string; visitedAt: number };
export type StarredPrompt = { id: string; label: string; slug: string; title: string };

export const SAVED_KEY = "produktivni:saved";
export const RECENT_KEY = "produktivni:recent";
export const STARRED_KEY = "produktivni:starred";

/** Rozečtených držíme jen posledních deset. */
const RECENT_MAX = 10;

/* ------------------------------ vnější store ------------------------------ */

const subscribers = new Map<string, Set<() => void>>();

function notify(key: string) {
  const set = subscribers.get(key);
  if (set) for (const cb of set) cb();
}

/** Přihlášení k odběru změn jednoho klíče (včetně změn z jiné záložky). */
export function subscribeKey(key: string, cb: () => void): () => void {
  const set = subscribers.get(key) ?? new Set<() => void>();
  subscribers.set(key, set);
  set.add(cb);
  const onStorage = (e: StorageEvent) => {
    if (e.key === key) cb();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    set.delete(cb);
    window.removeEventListener("storage", onStorage);
  };
}

export function readRaw(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    /* Privátní režim nebo zakázané úložiště — chováme se jako prázdný stav. */
    return "";
  }
}

function write(key: string, items: unknown[]) {
  try {
    if (items.length === 0) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(items));
  } catch {
    /* Když se uložit nedá, aspoň překreslíme — stav vydrží do zavření stránky. */
  }
  notify(key);
}

/* ------------------------------- parsování -------------------------------- */

function parseArray(raw: string): unknown[] {
  if (!raw) return [];
  try {
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isRecord(x: unknown): x is Record<string, unknown> {
  return typeof x === "object" && x !== null;
}

function isSavedType(x: unknown): x is SavedType {
  return x === "tip" || x === "kapitola";
}

export function parseSaved(raw: string): SavedItem[] {
  return parseArray(raw).filter(
    (x): x is SavedItem =>
      isRecord(x) &&
      isSavedType(x.type) &&
      typeof x.slug === "string" &&
      typeof x.title === "string" &&
      typeof x.savedAt === "number",
  );
}

export function parseRecent(raw: string): RecentItem[] {
  return parseArray(raw).filter(
    (x): x is RecentItem =>
      isRecord(x) &&
      isSavedType(x.type) &&
      typeof x.slug === "string" &&
      typeof x.title === "string" &&
      typeof x.visitedAt === "number",
  );
}

export function parseStarred(raw: string): StarredPrompt[] {
  return parseArray(raw).filter(
    (x): x is StarredPrompt =>
      isRecord(x) &&
      typeof x.id === "string" &&
      typeof x.label === "string" &&
      typeof x.slug === "string" &&
      typeof x.title === "string",
  );
}

/* -------------------------------- operace --------------------------------- */

export function toggleSaved(item: { type: SavedType; slug: string; title: string }) {
  const list = parseSaved(readRaw(SAVED_KEY));
  const without = list.filter((s) => !(s.type === item.type && s.slug === item.slug));
  if (without.length === list.length) {
    write(SAVED_KEY, [...list, { ...item, savedAt: Date.now() }]);
  } else {
    write(SAVED_KEY, without);
  }
}

export function removeSaved(type: SavedType, slug: string) {
  write(
    SAVED_KEY,
    parseSaved(readRaw(SAVED_KEY)).filter((s) => !(s.type === type && s.slug === slug)),
  );
}

/** Zapíše návštěvu článku mezi rozečtené (poslední návštěva vyhrává). */
export function recordRecent(item: { type: SavedType; slug: string; title: string }) {
  const list = parseRecent(readRaw(RECENT_KEY)).filter(
    (r) => !(r.type === item.type && r.slug === item.slug),
  );
  list.unshift({ ...item, visitedAt: Date.now() });
  write(RECENT_KEY, list.slice(0, RECENT_MAX));
}

export function removeRecent(type: SavedType, slug: string) {
  write(
    RECENT_KEY,
    parseRecent(readRaw(RECENT_KEY)).filter((r) => !(r.type === type && r.slug === slug)),
  );
}

export function toggleStarred(prompt: StarredPrompt) {
  const list = parseStarred(readRaw(STARRED_KEY));
  const without = list.filter((s) => s.id !== prompt.id);
  if (without.length === list.length) {
    write(STARRED_KEY, [...list, prompt]);
  } else {
    write(STARRED_KEY, without);
  }
}

export function removeStarred(id: string) {
  write(
    STARRED_KEY,
    parseStarred(readRaw(STARRED_KEY)).filter((s) => s.id !== id),
  );
}
