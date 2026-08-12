"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

export type SearchDoc = {
  type: "tip" | "kapitola" | "ai";
  slug: string;
  title: string;
  excerpt: string;
};

const typeLabel: Record<SearchDoc["type"], string> = {
  tip: "Tip",
  kapitola: "Příručka",
  ai: "AI novinka",
};

const typeHref: Record<SearchDoc["type"], string> = {
  tip: "/tipy",
  kapitola: "/prirucka",
  ai: "/ai",
};

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

export function SearchAll({ docs }: { docs: SearchDoc[] }) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = normalize(query.trim());
    if (q.length < 2) return [];
    return docs
      .map((d) => {
        const title = normalize(d.title);
        const excerpt = normalize(d.excerpt);
        let score = 0;
        if (title.includes(q)) score += title.startsWith(q) ? 6 : 4;
        if (excerpt.includes(q)) score += 2;
        return { d, score };
      })
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 30)
      .map((x) => x.d);
  }, [docs, query]);

  return (
    <div>
      <input
        type="search"
        autoFocus
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Hledat napříč webem… (např. „pomodoro“, „Excel“, „delegování“)"
        aria-label="Hledat napříč webem"
        className="w-full border-[1.5px] border-hairline-strong bg-card px-5 py-4 text-[16px] outline-offset-[-2px]"
      />
      {query.trim().length >= 2 && (
        <p className="eyebrow mt-4 text-faint">
          {results.length === 30 ? "30+" : results.length} výsledků
        </p>
      )}
      <ul className="mt-4 grid gap-3">
        {results.map((d) => (
          <li key={d.type + d.slug} className="border border-hairline bg-card p-4 transition-colors hover:border-hairline-strong">
            <p className="eyebrow mb-1 text-faint">{typeLabel[d.type]}</p>
            <Link href={`${typeHref[d.type]}/${d.slug}`} className="draw-link text-[16px] font-bold">
              {d.title}
            </Link>
            <p className="mt-1 font-serif text-[13.5px] leading-relaxed text-muted">{d.excerpt}</p>
          </li>
        ))}
      </ul>
      {query.trim().length >= 2 && results.length === 0 && (
        <p className="mt-6 border border-hairline bg-card p-6 text-[14.5px] text-muted">
          Nic nenalezeno. Zkuste jiné slovo — nebo napište, co vám chybí, a rutina to doplní.
        </p>
      )}
    </div>
  );
}
