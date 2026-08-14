"use client";

import { useCallback, useMemo, useSyncExternalStore } from "react";
import Link from "next/link";
import type { Locale } from "@/lib/i18n";

/* ---------------------------------------------------------------------------
   Odškrtávání kroků cesty.

   Stav žije v localStorage, tedy mimo React i mimo server. Čteme ho přes
   useSyncExternalStore: server vykreslí prázdný stav, klient se po připojení
   sám srovná. Žádný setState v efektu — repo má react-hooks/set-state-in-effect
   na úrovni error a hydratace by stejně blikala.
--------------------------------------------------------------------------- */

export type ProgressStep = {
  /** Stabilní id kroku, pod kterým se ukládá odškrtnutí. */
  id: string;
  title: string;
  href: string;
  outcome: string;
  minutes: number;
  /** „Návod“ / „Kapitola“ — hotový popisek, komponenta obsah nezná. */
  kindLabel: string;
};

const T = {
  cs: {
    progress: "Postup",
    done: (done: number, total: number) => `Hotovo ${done} z ${total}`,
    remaining: (minutes: string) => `Zbývá zhruba ${minutes}`,
    allDone: "Cesta je hotová. Můžete si ji odškrtnout i z hlavy.",
    reset: "Začít znovu",
    check: "Hotovo",
    stepsAria: "Kroky cesty",
    minutes: "min",
  },
  en: {
    progress: "Progress",
    done: (done: number, total: number) => `${done} of ${total} done`,
    remaining: (minutes: string) => `About ${minutes} left`,
    allDone: "The path is finished. You can tick it off in your head too.",
    reset: "Start over",
    check: "Done",
    stepsAria: "Steps of the path",
    minutes: "min",
  },
};

/* ------------------------------ vnější store ------------------------------ */

const subscribers = new Map<string, Set<() => void>>();

function notify(key: string) {
  const set = subscribers.get(key);
  if (set) for (const cb of set) cb();
}

/** Snapshot je surový řetězec z localStorage — porovnává se hodnotou, takže
    useSyncExternalStore nezacyklí (na rozdíl od nově vyrobeného pole). */
function readRaw(key: string): string {
  try {
    return window.localStorage.getItem(key) ?? "";
  } catch {
    /* Privátní režim nebo zakázané úložiště — chováme se jako prázdný stav. */
    return "";
  }
}

function writeIds(key: string, ids: string[]) {
  try {
    if (ids.length === 0) window.localStorage.removeItem(key);
    else window.localStorage.setItem(key, JSON.stringify(ids));
  } catch {
    /* Když se uložit nedá, aspoň překreslíme — stav vydrží do zavření stránky. */
  }
  notify(key);
}

function parseIds(raw: string): Set<string> {
  if (!raw) return new Set();
  try {
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return new Set();
    return new Set(parsed.filter((x): x is string => typeof x === "string"));
  } catch {
    return new Set();
  }
}

function formatMinutes(minutes: number, unit: string): string {
  if (minutes < 60) return `${minutes} ${unit}`;
  const h = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${h} h` : `${h} h ${rest} ${unit}`;
}

/* -------------------------------- komponenta ------------------------------- */

export function PathProgress({
  storageKey,
  steps,
  locale,
}: {
  storageKey: string;
  steps: ProgressStep[];
  locale: Locale;
}) {
  const t = T[locale] ?? T.cs;

  const subscribe = useCallback(
    (cb: () => void) => {
      const set = subscribers.get(storageKey) ?? new Set<() => void>();
      subscribers.set(storageKey, set);
      set.add(cb);
      // Jiná záložka téhož prohlížeče: storage událost překreslí i tuhle.
      const onStorage = (e: StorageEvent) => {
        if (e.key === storageKey) cb();
      };
      window.addEventListener("storage", onStorage);
      return () => {
        set.delete(cb);
        window.removeEventListener("storage", onStorage);
      };
    },
    [storageKey],
  );

  const getSnapshot = useCallback(() => readRaw(storageKey), [storageKey]);
  const getServerSnapshot = useCallback(() => "", []);

  const raw = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  const done = useMemo(() => parseIds(raw), [raw]);

  const total = steps.length;
  const doneCount = steps.filter((s) => done.has(s.id)).length;
  const remainingMinutes = steps
    .filter((s) => !done.has(s.id))
    .reduce((sum, s) => sum + s.minutes, 0);
  const percent = total > 0 ? Math.round((doneCount / total) * 100) : 0;
  const complete = total > 0 && doneCount === total;

  function toggle(id: string, checked: boolean) {
    const next = new Set(done);
    if (checked) next.add(id);
    else next.delete(id);
    // Ukládáme jen kroky, které cesta opravdu má — starý stav se tím pročistí.
    writeIds(
      storageKey,
      steps.filter((s) => next.has(s.id)).map((s) => s.id),
    );
  }

  function reset() {
    writeIds(storageKey, []);
  }

  return (
    <div>
      {/* --------------------------- ukazatel postupu --------------------------- */}
      <section
        className="border-2 border-hairline-strong bg-card p-5 shadow-[0_4px_0_#141414] sm:p-6"
        aria-label={t.progress}
      >
        <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-2">
          <p className="eyebrow text-faint">{t.progress}</p>
          <button
            type="button"
            onClick={reset}
            disabled={doneCount === 0}
            className="font-mono text-[12px] font-semibold tracking-[0.08em] text-muted uppercase transition-colors hover:text-accent disabled:cursor-not-allowed disabled:text-faint disabled:hover:text-faint"
          >
            {t.reset}
          </button>
        </div>

        <p className="display tabular mt-2 text-[clamp(20px,3.2vw,26px)]" aria-live="polite">
          {t.done(doneCount, total)}
        </p>

        <div className="mt-4 h-2.5 w-full border border-hairline bg-surface">
          <div
            className="h-full transition-[width] duration-200 ease-out motion-reduce:transition-none"
            style={{
              width: `${percent}%`,
              background: complete ? "var(--accent)" : "var(--ink)",
            }}
            aria-hidden="true"
          />
        </div>

        <p className="mt-3 text-[13.5px] text-muted">
          {complete ? t.allDone : t.remaining(formatMinutes(remainingMinutes, t.minutes))}
        </p>
      </section>

      {/* ------------------------------- kroky -------------------------------- */}
      <ol className="mt-10 border-t border-hairline" aria-label={t.stepsAria}>
        {steps.map((step, i) => {
          const isDone = done.has(step.id);
          const inputId = `${storageKey}-${step.id}`;
          return (
            <li
              key={step.id}
              className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-2 border-b border-hairline py-6"
            >
              <span
                className={`flex h-9 w-9 flex-none items-center justify-center border-[1.5px] font-mono text-[13px] font-bold tabular-nums ${
                  isDone
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-hairline-strong bg-paper text-ink"
                }`}
                aria-hidden="true"
              >
                {String(i + 1).padStart(2, "0")}
              </span>

              <div className="min-w-0">
                <p className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <Link href={step.href} className="draw-link text-[17px] leading-tight font-bold">
                    {step.title}
                  </Link>
                  <span className="eyebrow flex-none text-faint">
                    {step.kindLabel} · {step.minutes} {t.minutes}
                  </span>
                </p>
                <p
                  className={`mt-2 max-w-[62ch] font-serif text-[15px] leading-[1.6] ${
                    isDone ? "text-faint" : "text-muted"
                  }`}
                >
                  {step.outcome}
                </p>
                <div className="mt-3">
                  <input
                    type="checkbox"
                    id={inputId}
                    checked={isDone}
                    onChange={(e) => toggle(step.id, e.target.checked)}
                    className="peer h-4 w-4 align-middle accent-[var(--accent)]"
                  />
                  <label
                    htmlFor={inputId}
                    className="ml-2.5 cursor-pointer align-middle font-mono text-[12px] font-semibold tracking-[0.08em] text-faint uppercase transition-colors hover:text-ink peer-checked:text-accent"
                  >
                    {t.check}
                  </label>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
