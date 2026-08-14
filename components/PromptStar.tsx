"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import type { Locale } from "@/lib/i18n";
import {
  STARRED_KEY,
  parseStarred,
  readRaw,
  subscribeKey,
  toggleStarred,
  type StarredPrompt,
} from "@/lib/saved";

/* ---------------------------------------------------------------------------
   Hvězdička u promptu (vedle tlačítka „zkopírovat"): přidá prompt mezi
   „Moje prompty" v localStorage (produktivni:starred). Druhý klik odebere.
--------------------------------------------------------------------------- */

const T = {
  cs: { add: "Přidat do mých promptů", remove: "Odebrat z mých promptů" },
  en: { add: "Add to my prompts", remove: "Remove from my prompts" },
};

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="13" height="13" viewBox="0 0 16 16" aria-hidden="true" className="flex-none">
      <path
        d="M8 1.9l1.85 3.83 4.2.58-3.07 2.93.76 4.16L8 11.4l-3.74 2 .76-4.16-3.07-2.93 4.2-.58L8 1.9z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="miter"
      />
    </svg>
  );
}

export function PromptStar({ prompt, locale }: { prompt: StarredPrompt; locale: Locale }) {
  const t = T[locale] ?? T.cs;

  const subscribe = useCallback((cb: () => void) => subscribeKey(STARRED_KEY, cb), []);
  const getSnapshot = useCallback(() => readRaw(STARRED_KEY), []);
  const getServerSnapshot = useCallback(() => "", []);
  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const starred = useMemo(() => parseStarred(raw).some((s) => s.id === prompt.id), [raw, prompt.id]);
  const label = starred ? t.remove : t.add;

  return (
    <button
      type="button"
      onClick={() => toggleStarred(prompt)}
      aria-pressed={starred}
      aria-label={label}
      title={label}
      className={`inline-flex items-center border px-2 py-1 transition-colors ${
        starred
          ? "border-accent bg-paper text-accent"
          : "border-hairline bg-paper text-muted hover:border-ink hover:text-ink"
      }`}
    >
      <StarIcon filled={starred} />
    </button>
  );
}
