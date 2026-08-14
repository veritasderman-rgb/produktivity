"use client";

import { useCallback, useEffect, useMemo, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n";
import {
  SAVED_KEY,
  parseSaved,
  readRaw,
  recordRecent,
  subscribeKey,
  toggleSaved,
  type SavedType,
} from "@/lib/saved";

/* ---------------------------------------------------------------------------
   „Uložit na později" na detailu tipu a kapitoly. Druhý klik odebere.
   Vedle toho si komponenta po 5 s na stránce zapíše návštěvu mezi rozečtené
   (produktivni:recent) — krátké prokliky se tak nepočítají.
--------------------------------------------------------------------------- */

const T = {
  cs: { save: "Uložit na později", saved: "Uloženo ✓" },
  en: { save: "Save for later", saved: "Saved ✓" },
};

/** Až po téhle době na stránce se návštěva počítá jako čtení. */
const RECENT_DELAY_MS = 5000;

function BookmarkIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" className="flex-none">
      <path
        d="M3.75 2.25h8.5v11.9L8 10.85l-4.25 3.3V2.25z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function SaveButton({
  type,
  slug,
  title,
  locale,
}: {
  type: SavedType;
  slug: string;
  title: string;
  locale: Locale;
}) {
  const t = T[locale] ?? T.cs;

  const subscribe = useCallback((cb: () => void) => subscribeKey(SAVED_KEY, cb), []);
  const getSnapshot = useCallback(() => readRaw(SAVED_KEY), []);
  const getServerSnapshot = useCallback(() => "", []);
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const isSaved = useMemo(
    () => parseSaved(raw).some((s) => s.type === type && s.slug === slug),
    [raw, type, slug],
  );

  /* Rozečtené: zápis až po 5 s na stránce, ať tam nepadá každý proklik. */
  useEffect(() => {
    const timer = window.setTimeout(() => recordRecent({ type, slug, title }), RECENT_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, [type, slug, title]);

  return (
    <button
      type="button"
      onClick={() => toggleSaved({ type, slug, title })}
      aria-pressed={isSaved}
      className={`print-hide inline-flex items-center gap-1.5 border px-2.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.08em] uppercase transition-colors ${
        isSaved
          ? "border-ink bg-ink text-paper"
          : "border-hairline bg-paper text-muted hover:border-ink hover:text-ink"
      }`}
    >
      <BookmarkIcon filled={isSaved} />
      {isSaved ? t.saved : t.save}
    </button>
  );
}
