import type { Metadata } from "next";
import Link from "next/link";
import { getAllChanges, type ChangeAction, type ChangeItem } from "@/lib/changes";
import { getAllTips } from "@/lib/tips";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    title: "Co se změnilo",
    description:
      "AI nástroje se mění týdně. Tady je vidět, co se změnilo, kterých návodů se to týká a co jsme kvůli tomu upravili.",
    eyebrow: "Changelog dopadů",
    heading: "Co se změnilo",
    leadA: "AI nástroje se mění týdně; tady je vidět, ",
    leadStrong: "co se změnilo a co jsme kvůli tomu upravili",
    leadB: ". Každý záznam říká, čeho se změna týká, kterých návodů se dotýká a jak jsme na ni zareagovali — abyste měli jistotu, že vaše pracovní postupy někdo hlídá.",
    process: "Revize provádí Ctrl a schvaluje Josef.",
    akce: { overeno: "Ověřeno", aktualizovano: "Aktualizováno", "novy-navod": "Nový návod" } as Record<ChangeAction, string>,
    affected: "Dotčené návody:",
    source: "Zdroj",
    emptyTitle: "Zatím žádné záznamy",
    emptyDesc: "První revize se tu objeví, jakmile se ve světě AI nástrojů něco pohne.",
  },
  en: {
    title: "What changed",
    description:
      "AI tools change weekly. Here you can see what changed, which guides it affects and what we updated because of it.",
    eyebrow: "A changelog of impacts",
    heading: "What changed",
    leadA: "AI tools change weekly; here you can see ",
    leadStrong: "what changed and what we updated because of it",
    leadB: ". Every entry says what the change is about, which guides it touches and how we reacted — so you know someone is watching over your workflows.",
    process: "Reviews are performed by Ctrl and approved by Josef.",
    akce: { overeno: "Verified", aktualizovano: "Updated", "novy-navod": "New guide" } as Record<ChangeAction, string>,
    affected: "Affected guides:",
    source: "Source",
    emptyTitle: "No entries yet",
    emptyDesc: "The first reviews will show up here as soon as something moves in the world of AI tools.",
  },
};

const CS_MONTHS = [
  "leden", "únor", "březen", "duben", "květen", "červen",
  "červenec", "srpen", "září", "říjen", "listopad", "prosinec",
];

function monthLabel(iso: string, locale: Locale): string {
  const [y, m] = iso.split("-").map(Number);
  if (locale === "en") {
    return new Date(Date.UTC(y, m - 1, 1)).toLocaleDateString("en-GB", {
      month: "long",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return `${CS_MONTHS[m - 1]} ${y}`;
}

function formatDate(iso: string, locale: Locale): string {
  const [y, m, d] = iso.split("-").map(Number);
  if (locale === "en") {
    return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return `${d}. ${m}. ${y}`;
}

/** Záznamy seskupené po měsících (YYYY-MM), pořadí od nejnovějšího drží vstup. */
function groupByMonth(changes: ChangeItem[]): [string, ChangeItem[]][] {
  const groups = new Map<string, ChangeItem[]>();
  for (const c of changes) {
    const key = c.date.slice(0, 7);
    const list = groups.get(key);
    if (list) list.push(c);
    else groups.set(key, [c]);
  }
  return [...groups.entries()];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const csUrl = "https://produktivni.cz/zmeny";
  const enUrl = "https://productive.tips/zmeny";
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
      images: [`/api/og?title=${encodeURIComponent(t.title)}`],
    },
  };
}

export default async function ChangesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const changes = getAllChanges();
  const months = groupByMonth(changes);
  /* Titulky dotčených tipů pro odkazy — slug → titulek v jazyce stránky. */
  const tipTitles = new Map(getAllTips(locale).map((tip) => [tip.slug, tip.title]));

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">
        {t.leadA}
        <strong className="text-ink">{t.leadStrong}</strong>
        {t.leadB}
      </p>
      <p className="mt-3 text-[14px] text-faint">{t.process}</p>

      {changes.length > 0 ? (
        months.map(([month, items]) => (
          <section key={month} className="mt-12">
            <h2 className="eyebrow border-b-2 border-hairline-strong pb-2 text-faint">
              {monthLabel(`${month}-01`, locale)}
            </h2>
            <div className="mt-5 grid gap-5">
              {items.map((c) => (
                <article key={c.slug} className="border border-hairline-strong bg-card p-6">
                  <div className="mb-3 flex flex-wrap items-center gap-3">
                    <span className="eyebrow text-faint">
                      <time dateTime={c.date}>{formatDate(c.date, locale)}</time>
                    </span>
                    <span className="eyebrow border border-hairline-strong px-2 py-0.5 text-ink">
                      {t.akce[c.akce] ?? c.akce}
                    </span>
                  </div>
                  <h3 className="text-[19px] leading-snug font-bold">
                    {locale === "en" ? c.titleEn : c.title}
                  </h3>
                  <p className="mt-2 max-w-[70ch] text-[14.5px] leading-relaxed text-muted">
                    {locale === "en" ? c.bodyEn : c.body}
                  </p>
                  {c.slugs.length > 0 && (
                    <p className="mt-4 text-[13.5px] text-muted">
                      <span className="eyebrow mr-2 text-faint">{t.affected}</span>
                      {c.slugs.map((slug, i) => (
                        <span key={slug}>
                          {i > 0 && " · "}
                          <Link href={p(`/tipy/${slug}`)} className="draw-link font-bold text-ink">
                            {tipTitles.get(slug) ?? slug}
                          </Link>
                        </span>
                      ))}
                    </p>
                  )}
                  {c.zdroj && (
                    <p className="mt-2 text-[13.5px]">
                      <a
                        href={c.zdroj}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="draw-link font-bold"
                      >
                        {t.source} →
                      </a>
                    </p>
                  )}
                </article>
              ))}
            </div>
          </section>
        ))
      ) : (
        <div className="mt-10 max-w-xl border border-hairline-strong bg-card p-6">
          <p className="eyebrow mb-2 text-faint">{t.emptyTitle}</p>
          <p className="text-[14.5px] text-muted">{t.emptyDesc}</p>
        </div>
      )}
    </div>
  );
}
