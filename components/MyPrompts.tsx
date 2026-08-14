"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";
import { STARRED_KEY, parseStarred, readRaw, removeStarred, subscribeKey } from "@/lib/saved";

/* ---------------------------------------------------------------------------
   „Moje prompty" nahoře na hubu /prompty: prompty ohvězdičkované na
   podstránkách (produktivni:starred). Když je prázdno, sekce se vůbec
   nevykreslí — server ji nekreslí nikdy (serverový snapshot je "").
--------------------------------------------------------------------------- */

const T = {
  cs: {
    title: "Moje prompty",
    note: "Uložené hvězdičkou — jen v tomhle prohlížeči.",
    remove: "Odebrat",
    removeTitle: (label: string) => `Odebrat: ${label}`,
  },
  en: {
    title: "My prompts",
    note: "Starred prompts — stored only in this browser.",
    remove: "Remove",
    removeTitle: (label: string) => `Remove: ${label}`,
  },
};

export function MyPrompts({ locale }: { locale: Locale }) {
  const t = T[locale] ?? T.cs;

  const subscribe = useCallback((cb: () => void) => subscribeKey(STARRED_KEY, cb), []);
  const getSnapshot = useCallback(() => readRaw(STARRED_KEY), []);
  const getServerSnapshot = useCallback(() => "", []);
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const starred = useMemo(() => parseStarred(raw), [raw]);
  if (starred.length === 0) return null;

  return (
    <section
      className="mt-10 border-2 border-hairline-strong bg-card p-5 shadow-[0_4px_0_#141414] sm:p-6"
      aria-label={t.title}
    >
      <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <h2 className="display text-[22px]">{t.title}</h2>
        <span className="eyebrow text-faint">{t.note}</span>
      </div>
      <ul className="mt-3">
        {starred.map((s) => (
          <li key={s.id} className="flex items-baseline gap-3 border-b border-hairline py-3 last:border-b-0">
            <span aria-hidden="true" className="font-mono text-[13px] leading-none text-accent">
              ★
            </span>
            <Link
              href={localePath(locale, `/prompty/${s.slug}#${s.id}`)}
              className="draw-link min-w-0 flex-1 text-[15px] leading-snug font-bold"
            >
              {s.label}
            </Link>
            <span className="hidden max-w-[26ch] truncate text-[12.5px] text-faint sm:inline">
              {s.title}
            </span>
            <button
              type="button"
              onClick={() => removeStarred(s.id)}
              title={t.removeTitle(s.label)}
              className="flex-none font-mono text-[11px] font-semibold tracking-[0.08em] text-faint uppercase transition-colors hover:text-accent"
            >
              {t.remove}
            </button>
          </li>
        ))}
      </ul>
    </section>
  );
}
