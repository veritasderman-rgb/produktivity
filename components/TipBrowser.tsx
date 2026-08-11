"use client";

import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Tip } from "@/lib/tips";
import { TipCard } from "@/components/TipCard";

export const categoryLabels: Record<string, string> = {
  zkratky: "Zkratky",
  aplikace: "Aplikace",
  ai: "AI",
  workflow: "Workflow",
  komunikace: "Komunikace",
  hardware: "Vybavení",
};

export const platformLabels: Record<string, string> = {
  windows: "Windows",
  mac: "Mac",
  prohlizec: "Prohlížeč",
  mobil: "Mobil",
  vsude: "Všude",
};

export const audienceLabels: Record<string, string> = {
  manazer: "Manažeři",
  student: "Studenti",
  vyvojar: "Vývojáři",
  freelancer: "Freelanceři",
};

function normalize(s: string) {
  return s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
}

function FilterRow({
  label,
  options,
  active,
  counts,
  onPick,
}: {
  label: string;
  options: Record<string, string>;
  active: string | null;
  counts: Record<string, number>;
  onPick: (value: string | null) => void;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="eyebrow w-[76px] flex-none text-faint">{label}</span>
      <button
        type="button"
        onClick={() => onPick(null)}
        className={`px-3 py-1.5 text-[13px] font-semibold ${
          active === null
            ? "bg-ink text-paper"
            : "border border-hairline bg-card hover:border-accent"
        }`}
      >
        Vše
      </button>
      {Object.entries(options).map(([value, text]) =>
        counts[value] ? (
          <button
            key={value}
            type="button"
            onClick={() => onPick(active === value ? null : value)}
            className={`px-3 py-1.5 text-[13px] font-semibold ${
              active === value
                ? "bg-accent text-accent-ink"
                : "border border-hairline bg-card hover:border-accent"
            }`}
          >
            {text} <span className="tabular opacity-60">{counts[value]}</span>
          </button>
        ) : null,
      )}
    </div>
  );
}

export function TipBrowser({ tips }: { tips: Tip[] }) {
  const router = useRouter();
  const params = useSearchParams();
  const [category, setCategory] = useState<string | null>(params.get("kategorie"));
  const [platform, setPlatform] = useState<string | null>(params.get("platforma"));
  const [audience, setAudience] = useState<string | null>(params.get("pro"));
  const [query, setQuery] = useState("");

  function sync(cat: string | null, plat: string | null, aud: string | null) {
    const p = new URLSearchParams();
    if (cat) p.set("kategorie", cat);
    if (plat) p.set("platforma", plat);
    if (aud) p.set("pro", aud);
    router.replace(`/tipy${p.size ? `?${p}` : ""}`, { scroll: false });
  }

  const filtered = useMemo(() => {
    const q = normalize(query.trim());
    return tips.filter((t) => {
      if (category && t.category !== category) return false;
      if (platform && t.platform !== platform && t.platform !== "vsude") return false;
      if (audience && !t.audience.includes(audience)) return false;
      if (q) {
        const hay = normalize(`${t.title} ${t.excerpt} ${t.keys.flat().join(" ")}`);
        if (!hay.includes(q)) return false;
      }
      return true;
    });
  }, [tips, category, platform, audience, query]);

  const count = (field: (t: Tip) => string | string[]) => {
    const acc: Record<string, number> = {};
    for (const t of tips) {
      const v = field(t);
      for (const item of Array.isArray(v) ? v : [v]) acc[item] = (acc[item] ?? 0) + 1;
    }
    return acc;
  };

  return (
    <div>
      <div className="grid gap-3 border-y border-hairline py-5">
        <FilterRow
          label="Kategorie"
          options={categoryLabels}
          active={category}
          counts={count((t) => t.category)}
          onPick={(v) => { setCategory(v); sync(v, platform, audience); }}
        />
        <FilterRow
          label="Platforma"
          options={platformLabels}
          active={platform}
          counts={count((t) => t.platform)}
          onPick={(v) => { setPlatform(v); sync(category, v, audience); }}
        />
        <FilterRow
          label="Pro koho"
          options={audienceLabels}
          active={audience}
          counts={count((t) => t.audience)}
          onPick={(v) => { setAudience(v); sync(category, platform, v); }}
        />
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Hledat v tipech… (např. „schránka“, „Excel“, „porady“)"
            aria-label="Hledat v tipech"
            className="min-w-0 flex-1 border-[1.5px] border-hairline-strong bg-card px-4 py-2.5 text-[14px] outline-offset-[-2px] sm:max-w-md"
          />
          <span className="eyebrow text-faint">
            {filtered.length} z {tips.length} tipů
          </span>
          {(category || platform || audience || query) && (
            <button
              type="button"
              onClick={() => { setCategory(null); setPlatform(null); setAudience(null); setQuery(""); sync(null, null, null); }}
              className="border-b-2 border-accent pb-0.5 text-[13px] font-bold hover:text-accent"
            >
              Zrušit filtry
            </button>
          )}
        </div>
      </div>

      {filtered.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((tip) => (
            <TipCard key={tip.slug} tip={tip} index={tips.length - tips.indexOf(tip)} />
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-hairline bg-card p-8 text-center">
          <p className="font-bold">Tomuhle filtru zatím žádný tip neodpovídá.</p>
          <p className="mt-2 text-[14px] text-muted">
            Zkuste zrušit část filtrů — nebo nám napište, co vám chybí, a rutina to najde.
          </p>
        </div>
      )}
    </div>
  );
}
