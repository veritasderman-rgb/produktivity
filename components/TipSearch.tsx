"use client";

import { useId, useState } from "react";
import Link from "next/link";
import { normalizeSearch } from "@/lib/tip-filters";
import { localePath, type Locale } from "@/lib/i18n";

/** Lehký záznam pro okamžité našeptávání — jen titulek a slug, žádné excerpty. */
export type TipSearchEntry = { slug: string; title: string };

const ui = {
  cs: {
    placeholder: "Hledat v tipech… (např. „schránka“, „Excel“, „porady“)",
    ariaSearch: "Hledat v tipech",
    submit: "Hledat",
    suggestions: "Rychlé výsledky",
    noMatch: "Nic nenašeptáváme — zkuste hledání potvrdit Enterem.",
  },
  en: {
    placeholder: "Search tips… (e.g. “clipboard”, “Excel”, “meetings”)",
    ariaSearch: "Search tips",
    submit: "Search",
    suggestions: "Quick results",
    noMatch: "No instant match — press Enter to run the full search.",
  },
};

/**
 * Hledání na /tipy: našeptávání běží okamžitě nad lehkým indexem (title+slug),
 * potvrzení (Enter / tlačítko) odešle GET formulář — plné hledání včetně
 * excerptů a zkratek pak proběhne na serveru přes ?q=… a vrátí jen
 * odpovídající karty. Skryté inputy drží aktivní filtry, aby je odeslání
 * formuláře nezahodilo.
 */
export function TipSearch({
  index,
  locale = "cs",
  basePath = "/tipy",
  hidden = {},
  initialQuery = "",
}: {
  index: TipSearchEntry[];
  locale?: Locale;
  basePath?: string;
  hidden?: Record<string, string>;
  initialQuery?: string;
}) {
  const L = ui[locale];
  const [query, setQuery] = useState(initialQuery);
  const listId = useId();

  const q = normalizeSearch(query.trim());
  const showSuggestions = q.length >= 2 && query.trim() !== initialQuery.trim();
  const matches = showSuggestions
    ? index.filter((e) => normalizeSearch(e.title).includes(q)).slice(0, 6)
    : [];

  return (
    <div className="min-w-0 flex-1 sm:max-w-md">
      <form action={localePath(locale, basePath)} method="get" className="flex gap-2">
        {Object.entries(hidden).map(([name, value]) => (
          <input key={name} type="hidden" name={name} value={value} />
        ))}
        <input
          type="search"
          name="q"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={L.placeholder}
          aria-label={L.ariaSearch}
          aria-describedby={showSuggestions ? listId : undefined}
          className="min-w-0 flex-1 border-[1.5px] border-hairline-strong bg-card px-4 py-2.5 text-[14px] outline-offset-[-2px]"
        />
        <button
          type="submit"
          className="flex-none border-[1.5px] border-hairline bg-paper px-3.5 py-2 font-mono text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors hover:border-ink"
        >
          {L.submit}
        </button>
      </form>

      {showSuggestions && (
        <div id={listId} className="mt-2 border border-hairline bg-card">
          <p className="eyebrow border-b border-hairline px-4 py-2 text-faint">{L.suggestions}</p>
          {matches.length > 0 ? (
            <ul>
              {matches.map((m) => (
                <li key={m.slug} className="border-b border-hairline last:border-b-0">
                  <Link
                    href={localePath(locale, `/tipy/${m.slug}`)}
                    className="draw-link block px-4 py-2.5 text-[14px] font-bold leading-snug"
                  >
                    {m.title}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="px-4 py-2.5 text-[13px] text-muted">{L.noMatch}</p>
          )}
        </div>
      )}
    </div>
  );
}
