"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import {
  RECENT_KEY,
  SAVED_KEY,
  parseRecent,
  parseSaved,
  readRaw,
  removeRecent,
  removeSaved,
  subscribeKey,
  type SavedType,
} from "@/lib/saved";

/* ---------------------------------------------------------------------------
   Obsah stránky /ulozene: sekce „Uložené" a „Nedávno čtené" z localStorage.
   Server vykreslí prázdný stav (useSyncExternalStore se serverovým snapshotem
   ""), obsah dokreslí až klient — stránka tak zůstává plně statická.
--------------------------------------------------------------------------- */

const T = {
  cs: {
    saved: "Uložené",
    recent: "Nedávno čtené",
    savedEmpty:
      "Zatím nic. Klikněte na detailu článku na „Uložit na později“ a najdete ho tady.",
    recentEmpty: "Zatím nic. Jakmile si něco přečtete, objeví se to tady.",
    remove: "Odebrat",
    removeTitle: (title: string) => `Odebrat: ${title}`,
    typeLabel: { tip: "Tip", kapitola: "Příručka" } as Record<SavedType, string>,
  },
  en: {
    saved: "Saved",
    recent: "Recently read",
    savedEmpty: "Nothing yet. Hit “Save for later” on any article and it will show up here.",
    recentEmpty: "Nothing yet. Once you read something, it will show up here.",
    remove: "Remove",
    removeTitle: (title: string) => `Remove: ${title}`,
    typeLabel: { tip: "Tip", kapitola: "Handbook" } as Record<SavedType, string>,
  },
};

const typeHref: Record<SavedType, string> = { tip: "/tipy", kapitola: "/prirucka" };

type Row = { type: SavedType; slug: string; title: string };

function List({
  rows,
  emptyText,
  locale,
  t,
  onRemove,
}: {
  rows: Row[];
  emptyText: string;
  locale: Locale;
  t: (typeof T)["cs"];
  onRemove: (row: Row) => void;
}) {
  if (rows.length === 0) {
    return <p className="mt-3 text-[14px] text-muted">{emptyText}</p>;
  }
  return (
    <ul className="mt-2">
      {rows.map((row) => (
        <li
          key={`${row.type}-${row.slug}`}
          className="flex items-baseline gap-3 border-b border-hairline py-3.5"
        >
          <span className="eyebrow w-[72px] flex-none text-faint">{t.typeLabel[row.type]}</span>
          <Link
            href={localePath(locale, `${typeHref[row.type]}/${row.slug}`)}
            className="draw-link min-w-0 flex-1 text-[15px] leading-snug font-bold"
          >
            {row.title}
          </Link>
          <button
            type="button"
            onClick={() => onRemove(row)}
            title={t.removeTitle(row.title)}
            className="flex-none font-mono text-[11px] font-semibold tracking-[0.08em] text-faint uppercase transition-colors hover:text-accent"
          >
            {t.remove}
          </button>
        </li>
      ))}
    </ul>
  );
}

export function SavedLists({ locale }: { locale: Locale }) {
  const t = T[locale] ?? T.cs;

  const subscribeSaved = useCallback((cb: () => void) => subscribeKey(SAVED_KEY, cb), []);
  const subscribeRecent = useCallback((cb: () => void) => subscribeKey(RECENT_KEY, cb), []);
  const getSaved = useCallback(() => readRaw(SAVED_KEY), []);
  const getRecent = useCallback(() => readRaw(RECENT_KEY), []);
  const getServerSnapshot = useCallback(() => "", []);

  const rawSaved = useSyncExternalStore(subscribeSaved, getSaved, getServerSnapshot);
  const rawRecent = useSyncExternalStore(subscribeRecent, getRecent, getServerSnapshot);

  const saved = useMemo(
    () => [...parseSaved(rawSaved)].sort((a, b) => b.savedAt - a.savedAt),
    [rawSaved],
  );
  const recent = useMemo(
    () => [...parseRecent(rawRecent)].sort((a, b) => b.visitedAt - a.visitedAt),
    [rawRecent],
  );

  return (
    <>
      <section className="mt-10" aria-label={t.saved}>
        <div className="flex items-baseline justify-between gap-4 border-b-2 border-hairline-strong pb-2">
          <h2 className="display text-[22px]">{t.saved}</h2>
          {saved.length > 0 && <span className="eyebrow tabular text-faint">{saved.length}</span>}
        </div>
        <List
          rows={saved}
          emptyText={t.savedEmpty}
          locale={locale}
          t={t}
          onRemove={(row) => removeSaved(row.type, row.slug)}
        />
      </section>

      <section className="mt-14" aria-label={t.recent}>
        <div className="flex items-baseline justify-between gap-4 border-b-2 border-hairline-strong pb-2">
          <h2 className="display text-[22px]">{t.recent}</h2>
          {recent.length > 0 && <span className="eyebrow tabular text-faint">{recent.length}</span>}
        </div>
        <List
          rows={recent}
          emptyText={t.recentEmpty}
          locale={locale}
          t={t}
          onRemove={(row) => removeRecent(row.type, row.slug)}
        />
      </section>
    </>
  );
}
