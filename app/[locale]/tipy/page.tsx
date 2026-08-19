import type { Metadata } from "next";
import Link from "next/link";
import { getAllTipMetas, type TipMeta } from "@/lib/tips";
import { countTipValues, filterTips, TIPS_PER_PAGE } from "@/lib/tip-filters";
import { TipCard } from "@/components/TipCard";
import { TipSearch } from "@/components/TipSearch";
import { getDict, isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const T = {
  cs: {
    title: "Tipy & triky",
    heading: "Tipy & triky",
    description:
      "Krátké, okamžitě použitelné tipy: klávesové zkratky, aplikace, workflow a AI triky. Filtrujte podle platformy, kategorie i toho, kdo jste.",
    eyebrow: (n: number) => `${n} tipů · průběžně přibývají`,
    lead: "Každý tip = jedna konkrétní věc, kterou uděláte líp nebo rychleji. Filtrujte podle toho, co používáte a kdo jste — nebo prostě hledejte.",
    all: "Vše",
    category: "Kategorie",
    platform: "Platforma",
    who: "Pro koho",
    of: "z",
    tips: "tipů",
    clear: "Zrušit filtry",
    tenMinutes: "Mám 10 minut",
    searchLabel: (q: string) => `Hledáte: „${q}“`,
    emptyTitle: "Tomuhle filtru zatím žádný tip neodpovídá.",
    emptyDesc: "Zkuste zrušit část filtrů — nebo nám napište, co vám chybí, a rutina to najde.",
    pagination: "Stránkování",
    prev: "← Novější",
    next: "Starší →",
    pageOf: (a: number, b: number) => `Strana ${a} z ${b}`,
  },
  en: {
    title: "Tips & tricks",
    heading: "Tips & tricks",
    description:
      "Short, immediately useful tips: keyboard shortcuts, apps, workflows and AI tricks. Filter by platform, category and who you are.",
    eyebrow: (n: number) => `${n} tips · new ones added continuously`,
    lead: "Every tip is one concrete thing you will do better or faster. Filter by what you use and who you are — or just search.",
    all: "All",
    category: "Category",
    platform: "Platform",
    who: "For whom",
    of: "of",
    tips: "tips",
    clear: "Clear filters",
    tenMinutes: "I have 10 minutes",
    searchLabel: (q: string) => `Searching for: “${q}”`,
    emptyTitle: "No tip matches this filter yet.",
    emptyDesc: "Try removing some filters — or tell us what you are missing and the daily routine will find it.",
    pagination: "Pagination",
    prev: "← Newer",
    next: "Older →",
    pageOf: (a: number, b: number) => `Page ${a} of ${b}`,
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const csUrl = "https://www.produktivni.cz/tipy";
  const enUrl = "https://www.productive.tips/tipy";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
    openGraph: {
      title: t.title,
      description: t.description,
      images: [ogImage(t.title, locale)],
    },
  };
}

/** Aktivní filtry v URL — česká jména parametrů jsou veřejné API (sdílené adresy). */
type FilterState = {
  kategorie: string | null;
  platforma: string | null;
  pro: string | null;
  q: string | null;
};

/** Sestaví odkaz na /tipy se zadanou kombinací filtrů; strana 1 = bez ?strana. */
function filterHref(
  locale: Locale,
  state: FilterState,
  strana: number = 1,
): string {
  const p = new URLSearchParams();
  if (state.kategorie) p.set("kategorie", state.kategorie);
  if (state.platforma) p.set("platforma", state.platforma);
  if (state.pro) p.set("pro", state.pro);
  if (state.q) p.set("q", state.q);
  if (strana > 1) p.set("strana", String(strana));
  return `${localePath(locale, "/tipy")}${p.size ? `?${p}` : ""}`;
}

const chip = (active: boolean) =>
  `font-mono text-[12px] font-semibold tracking-[0.08em] uppercase px-3.5 py-2 border-[1.5px] transition-colors no-underline ${
    active ? "border-ink bg-ink text-paper" : "border-hairline bg-paper hover:border-ink"
  }`;

/** Řádek filtru jako odkazy — klik = nová (sdílitelná) adresa, filtruje server. */
function FilterRow({
  label,
  allLabel,
  options,
  counts,
  active,
  hrefFor,
}: {
  label: string;
  allLabel: string;
  options: Record<string, string>;
  counts: Record<string, number>;
  active: string | null;
  hrefFor: (value: string | null) => string;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-2">
      <span className="eyebrow w-[76px] flex-none text-faint">{label}</span>
      <Link href={hrefFor(null)} className={chip(active === null)}>
        {allLabel}
      </Link>
      {Object.entries(options).map(([value, text]) =>
        counts[value] ? (
          <Link
            key={value}
            // Klik na aktivní filtr ho vypne — stejné chování jako dřívější přepínače.
            href={hrefFor(active === value ? null : value)}
            className={chip(active === value)}
            aria-current={active === value ? "true" : undefined}
          >
            {text} <span className="tabular opacity-60">{counts[value]}</span>
          </Link>
        ) : null,
      )}
    </div>
  );
}

const first = (v: string | string[] | undefined): string | null =>
  (Array.isArray(v) ? v[0] : v) || null;

export default async function TipsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { locale: raw } = await params;
  const sp = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const dict = getDict(locale).tipCard;

  const tips = getAllTipMetas(locale);

  // Neznámé hodnoty parametrů se tiše zahodí (chovají se jako „Vše“).
  const valid = (v: string | null, options: Record<string, string>) =>
    v && options[v] ? v : null;
  const state: FilterState = {
    kategorie: valid(first(sp.kategorie), dict.categories),
    platforma: valid(first(sp.platforma), dict.platforms),
    pro: valid(first(sp.pro), dict.audiences),
    q: (first(sp.q) ?? "").trim() || null,
  };
  const typ = first(sp.typ) === "pruvodce" ? "pruvodce" : null;

  const filtered = filterTips(tips, {
    category: state.kategorie,
    platform: state.platforma,
    audience: state.pro,
    q: state.q,
    typ,
  });

  // Stránkování: server-side slice po 30 kartách, ?strana=N.
  const totalPages = Math.max(1, Math.ceil(filtered.length / TIPS_PER_PAGE));
  const requested = Math.max(1, Math.floor(Number(first(sp.strana)) || 1));
  const page = Math.min(requested, totalPages);
  const visible = filtered.slice((page - 1) * TIPS_PER_PAGE, page * TIPS_PER_PAGE);

  // Pořadové číslo karty je globální (podle plného seznamu), aby se stránkováním neměnilo.
  const numberBySlug = new Map(tips.map((tip, i) => [tip.slug, tips.length - i]));

  // Počty u přepínačů se počítají z plného seznamu — stejně jako dřív.
  const counts = {
    category: countTipValues(tips, (tip: TipMeta) => tip.category),
    platform: countTipValues(tips, (tip: TipMeta) => tip.platform),
    audience: countTipValues(tips, (tip: TipMeta) => tip.audience),
  };

  const hasFilters = Boolean(state.kategorie || state.platforma || state.pro || state.q);

  // Skryté inputy hledacího formuláře drží aktivní filtry.
  const hidden: Record<string, string> = {};
  if (state.kategorie) hidden.kategorie = state.kategorie;
  if (state.platforma) hidden.platforma = state.platforma;
  if (state.pro) hidden.pro = state.pro;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow(tips.length)}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 mb-8 max-w-[56ch] text-[16px] leading-relaxed text-muted">{t.lead}</p>

      <div className="grid gap-3 border-y border-hairline py-5">
        <FilterRow
          label={t.category}
          allLabel={t.all}
          options={dict.categories}
          counts={counts.category}
          active={state.kategorie}
          hrefFor={(v) => filterHref(locale, { ...state, kategorie: v })}
        />
        <FilterRow
          label={t.platform}
          allLabel={t.all}
          options={dict.platforms}
          counts={counts.platform}
          active={state.platforma}
          hrefFor={(v) => filterHref(locale, { ...state, platforma: v })}
        />
        <FilterRow
          label={t.who}
          allLabel={t.all}
          options={dict.audiences}
          counts={counts.audience}
          active={state.pro}
          hrefFor={(v) => filterHref(locale, { ...state, pro: v })}
        />
        <div className="flex flex-wrap items-center gap-3">
          <TipSearch
            index={tips.map(({ slug, title }) => ({ slug, title }))}
            locale={locale}
            hidden={hidden}
            initialQuery={state.q ?? ""}
          />
          <span className="eyebrow text-faint">
            {filtered.length} {t.of} {tips.length} {t.tips}
          </span>
          {state.q && <span className="eyebrow text-faint">{t.searchLabel(state.q)}</span>}
          {/* Vstup podle času — vede na /deset-minut, kde se filtruje délkou čtení. */}
          <Link
            href={localePath(locale, "/deset-minut")}
            className="draw-link text-[13px] font-bold"
          >
            {t.tenMinutes} →
          </Link>
          {hasFilters && (
            <Link href={localePath(locale, "/tipy")} className="draw-link text-[13px] font-bold">
              {t.clear}
            </Link>
          )}
        </div>
      </div>

      {visible.length > 0 ? (
        <div className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visible.map((tip) => (
            <TipCard
              key={tip.slug}
              tip={tip}
              index={numberBySlug.get(tip.slug) ?? 0}
              locale={locale}
            />
          ))}
        </div>
      ) : (
        <div className="mt-8 border border-hairline bg-card p-8 text-center">
          <p className="font-bold">{t.emptyTitle}</p>
          <p className="mt-2 text-[14px] text-muted">{t.emptyDesc}</p>
        </div>
      )}

      {totalPages > 1 && (
        <nav
          aria-label={t.pagination}
          className="mt-10 flex items-center justify-between gap-4 border-t border-hairline pt-6"
        >
          {page > 1 ? (
            <Link
              rel="prev"
              href={filterHref(locale, state, page - 1)}
              className="draw-link text-[13.5px] font-bold"
            >
              {t.prev}
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
          <span className="eyebrow text-faint">{t.pageOf(page, totalPages)}</span>
          {page < totalPages ? (
            <Link
              rel="next"
              href={filterHref(locale, state, page + 1)}
              className="draw-link text-[13.5px] font-bold"
            >
              {t.next}
            </Link>
          ) : (
            <span aria-hidden="true" />
          )}
        </nav>
      )}
    </div>
  );
}
