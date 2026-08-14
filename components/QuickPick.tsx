"use client";

import { useState } from "react";
import Link from "next/link";
import type { TipMeta } from "@/lib/tips";
import { getDict, localePath, type Locale } from "@/lib/i18n";

/* ---------------------------------------------------------------------------
   „Mám 10 minut" — jedna velká karta s náhodným rychlým tipem.

   Hydratace: první render MUSÍ být deterministický (server je statický,
   žádný Math.random v RSC). Proto startujeme na tips[0] přes lazy useState
   initializer a náhoda se zapojí až uživatelskou akcí — klikem na
   „Ukázat jiný". Žádný setState v efektu (react-hooks/set-state-in-effect
   je v repu na error) a žádný rozdíl mezi serverovým a klientským HTML.

   „Bez opakování": v `seen` si držíme indexy už ukázaných tipů; losuje se
   jen ze zbytku. Když se zásoba vyčerpá, kolo začne znovu (aktuální tip se
   do nového kola nepočítá, aby po resetu nepadl tentýž).
--------------------------------------------------------------------------- */

const T = {
  cs: {
    randomEyebrow: "Náhodný rychlý tip",
    read: "Číst",
    another: "Ukázat jiný",
    moreHeading: "Dalších 8 rychlých",
    minShort: "min",
  },
  en: {
    randomEyebrow: "A random quick tip",
    read: "Read",
    another: "Show me another",
    moreHeading: "8 more quick ones",
    minShort: "min",
  },
};

const MORE_COUNT = 8;

export function QuickPick({ tips, locale }: { tips: TipMeta[]; locale: Locale }) {
  const t = T[locale] ?? T.cs;
  const dict = getDict(locale).tipCard;

  // Deterministický start: server i první klientský render ukazují tips[0].
  const [state, setState] = useState<{ current: number; seen: number[] }>(() => ({
    current: 0,
    seen: [0],
  }));

  if (tips.length === 0) return null;

  const tip = tips[state.current] ?? tips[0];
  const href = localePath(locale, `/tipy/${tip.slug}`);

  const pickAnother = () => {
    const { current, seen } = state;
    const all = tips.map((_, i) => i);
    const remaining = all.filter((i) => !seen.includes(i));
    // Vyčerpáno → nové kolo; aktuální tip vynecháme, ať se hned neopakuje.
    const pool = remaining.length > 0 ? remaining : all.filter((i) => i !== current);
    if (pool.length === 0) return;
    const next = pool[Math.floor(Math.random() * pool.length)];
    setState({ current: next, seen: remaining.length > 0 ? [...seen, next] : [next] });
  };

  // Menší seznam pod kartou: dalších 8 rychlých v pořadí serveru, bez aktuálního.
  const more = tips
    .map((item, i) => ({ item, i }))
    .filter(({ i }) => i !== state.current)
    .slice(0, MORE_COUNT);

  return (
    <div>
      <article aria-live="polite" className="border-[1.5px] border-hairline-strong bg-card p-7 sm:p-10">
        <p className="eyebrow text-faint">
          {t.randomEyebrow} · {dict.categories[tip.category] ?? tip.category} ·{" "}
          {dict.platforms[tip.platform] ?? tip.platform} ·{" "}
          <span className="tabular">
            {tip.minutes} {t.minShort}
          </span>
        </p>
        <h2 className="display mt-3 text-[clamp(22px,3.6vw,32px)]">
          <Link href={href} className="draw-link">
            {tip.title}
          </Link>
        </h2>
        {tip.keys.length > 0 && (
          <p className="mt-4">
            {tip.keys[0].map((k, i) => (
              <span key={k + i}>
                {i > 0 && <span className="mx-1 text-faint">+</span>}
                <kbd className="key">{k}</kbd>
              </span>
            ))}
          </p>
        )}
        <p className="mt-4 max-w-[58ch] font-serif text-[16px] leading-[1.65] text-muted">
          {tip.excerpt}
        </p>
        <div className="mt-7 flex flex-wrap items-center gap-3">
          <Link
            href={href}
            className="border-[1.5px] border-ink bg-ink px-6 py-3 text-[14.5px] font-bold text-paper no-underline transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
          >
            {t.read}
          </Link>
          <button
            type="button"
            onClick={pickAnother}
            className="cursor-pointer border-[1.5px] border-hairline-strong bg-paper px-6 py-3 text-[14.5px] font-bold transition-colors hover:border-accent hover:text-accent"
          >
            {t.another}
          </button>
        </div>
      </article>

      {more.length > 0 && (
        <section className="mt-10">
          <h2 className="eyebrow text-faint">{t.moreHeading}</h2>
          <ul className="mt-3 border-t border-hairline">
            {more.map(({ item }) => (
              <li
                key={item.slug}
                className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1 border-b border-hairline py-3"
              >
                <Link
                  href={localePath(locale, `/tipy/${item.slug}`)}
                  className="draw-link min-w-0 text-[15px] font-bold"
                >
                  {item.title}
                </Link>
                <span className="eyebrow tabular flex-none text-faint">
                  {item.minutes} {t.minShort}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}
