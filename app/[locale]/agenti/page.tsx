import type { Metadata } from "next";
import Link from "next/link";
import {
  AGENT_TAGS,
  AGENT_TRACKS,
  agentLabels,
  countAgentTags,
  getAllAgentMetas,
  type AgentArticleMeta,
  type AgentTag,
} from "@/lib/agents";
import { NewsletterForm } from "@/components/NewsletterForm";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const T = {
  cs: {
    title: "Agenti a vlastní AI",
    description:
      "Jeden velín pro celý váš AI svět: lokální model na Mac mini nebo Windows s Nvidií, brána pro cloudové modely, ovládání z Telegramu, vlastní soubory v chatu a pravidla, kdo co smí spustit.",
    eyebrow: "Kde co běží a kdo to smí spustit",
    heading: "Agenti a vlastní AI",
    leadA: "Otázka už není „ChatGPT ano, nebo ne“. Otázka je ",
    leadStrong: "kde co běží a kdo to smí spustit",
    leadB: ". Lokální a firemní AI roste vedle cloudu: Mac mini zvládne inference, open weights dotahují uzavřené modely a agenti jsou produkt roku i riziko roku. Tenhle seriál vás provede od prvního lokálního modelu po velín, ze kterého celý ten svět řídíte jedním chatem — a po pravidla, bez kterých se to celé rozsype.",
    countEyebrow: (n: number) => `${n} dílů · šest linek · průběžně přibývá`,
    startTitle: "Kde začít",
    startLead:
      "Seriál se dá číst popořadě jako kurz, nebo skákat po štítcích. Když nevíte, začněte prvním dílem každé linky — jsou psané pro člověka, který zatím nic nenainstaloval.",
    tagsLabel: "Štítky",
    all: "Vše",
    clear: "Zrušit filtr",
    filtered: (n: number, tag: string) => `${n} dílů se štítkem „${tag}“`,
    partLabel: "Díl",
    readTime: "min",
    levels: { zacatecnik: "Pro začátečníky", pokrocily: "Pokročilé" } as Record<string, string>,
    emptyTitle: "Seriál se právě píše",
    emptyDesc: "První díly se tu objeví během pár dní.",
    ctaEyebrow: "Nový díl vám dojde",
    ctaDesc: "Nové díly a to podstatné ze světa agentů posílám v týdenním newsletteru.",
  },
  en: {
    title: "Agents and your own AI",
    description:
      "One control room for your whole AI world: a local model on a Mac mini or a Windows box with an Nvidia card, a gateway for cloud models, control from Telegram, your own files in the chat, and rules for who may run what.",
    eyebrow: "What runs where, and who may start it",
    heading: "Agents and your own AI",
    leadA: "The question is no longer “ChatGPT, yes or no”. The question is ",
    leadStrong: "what runs where and who may start it",
    leadB: ". Local and in-house AI is growing alongside the cloud: a Mac mini handles inference, open weights keep closing the gap, and agents are the product of the year and the risk of the year. This series takes you from your first local model to a control room you run the whole thing from — and to the rules without which it all falls apart.",
    countEyebrow: (n: number) => `${n} parts · six tracks · more coming`,
    startTitle: "Where to start",
    startLead:
      "Read it front to back like a course, or jump around by tag. If in doubt, start with the first part of each track — they assume you have installed nothing yet.",
    tagsLabel: "Tags",
    all: "All",
    clear: "Clear filter",
    filtered: (n: number, tag: string) => `${n} parts tagged “${tag}”`,
    partLabel: "Part",
    readTime: "min",
    levels: { zacatecnik: "Beginner", pokrocily: "Advanced" } as Record<string, string>,
    emptyTitle: "The series is being written",
    emptyDesc: "The first parts will show up here within days.",
    ctaEyebrow: "Get the next part",
    ctaDesc: "New parts and what matters in the world of agents go out in the weekly newsletter.",
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
  const csUrl = "https://www.produktivni.cz/agenti";
  const enUrl = "https://www.productive.tips/agenti";
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

const chip = (active: boolean) =>
  `font-mono text-[12px] font-semibold tracking-[0.08em] uppercase px-3.5 py-2 border-[1.5px] transition-colors no-underline ${
    active ? "border-ink bg-ink text-paper" : "border-hairline bg-paper hover:border-ink"
  }`;

function ArticleRow({
  article,
  locale,
  t,
}: {
  article: AgentArticleMeta;
  locale: Locale;
  t: (typeof T)["cs"];
}) {
  const labels = agentLabels[locale] ?? agentLabels.cs;
  return (
    <article className="border-t border-hairline py-5 first:border-t-0">
      <div className="mb-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        <span className="eyebrow text-faint">
          {t.partLabel} {String(article.order).padStart(2, "0")}
        </span>
        <span className="eyebrow text-faint">
          {t.levels[article.level]} · {article.minutes} {t.readTime}
        </span>
      </div>
      <h3 className="text-[18px] leading-snug font-bold tracking-[-0.01em]">
        <Link href={localePath(locale, `/agenti/${article.slug}`)} className="draw-link">
          {article.title}
        </Link>
      </h3>
      <p className="mt-2 max-w-[68ch] font-serif text-[14.5px] leading-[1.65] text-muted">
        {article.excerpt}
      </p>
      {article.tags.length > 0 && (
        <p className="mt-3 flex flex-wrap gap-x-2 gap-y-1">
          {article.tags.map((tag) => (
            <Link
              key={tag}
              href={`${localePath(locale, "/agenti")}?stitek=${tag}`}
              className="eyebrow text-faint no-underline hover:text-accent"
            >
              #{labels.tags[tag]}
            </Link>
          ))}
        </p>
      )}
    </article>
  );
}

export default async function AgentsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ stitek?: string }>;
}) {
  const { locale: raw } = await params;
  const { stitek } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const labels = agentLabels[locale] ?? agentLabels.cs;
  const p = (path: string) => localePath(locale, path);

  const all = getAllAgentMetas(locale);
  const activeTag: AgentTag | null =
    stitek && (AGENT_TAGS as readonly string[]).includes(stitek) ? (stitek as AgentTag) : null;
  const counts = countAgentTags(all);
  const shown = activeTag ? all.filter((a) => a.tags.includes(activeTag)) : all;

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-muted">
        {t.leadA}
        <strong className="text-ink">{t.leadStrong}</strong>
        {t.leadB}
      </p>

      {all.length === 0 ? (
        <div className="mt-10 max-w-xl border border-hairline-strong bg-card p-6">
          <p className="eyebrow mb-2 text-faint">{t.emptyTitle}</p>
          <p className="text-[14.5px] text-muted">{t.emptyDesc}</p>
        </div>
      ) : (
        <>
          <p className="eyebrow mt-6 text-faint">{t.countEyebrow(all.length)}</p>

          <section className="mt-10 border-t-2 border-hairline-strong pt-8">
            <h2 className="display text-[clamp(20px,3vw,26px)]">{t.startTitle}</h2>
            <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">{t.startLead}</p>
            <ol className="mt-6 grid gap-4 sm:grid-cols-2">
              {AGENT_TRACKS.map((track, i) => {
                const first = all.find((a) => a.track === track);
                const size = all.filter((a) => a.track === track).length;
                if (!first) return null;
                return (
                  <li key={track} className="border border-hairline bg-card p-5">
                    <p className="eyebrow mb-1.5 text-faint">
                      {String(i + 1).padStart(2, "0")} · {size}×
                    </p>
                    <p className="text-[16px] font-bold">
                      <Link href={`${p("/agenti")}#${track}`} className="draw-link">
                        {labels.tracks[track].name}
                      </Link>
                    </p>
                    <p className="mt-2 font-serif text-[14px] leading-[1.6] text-muted">
                      {labels.tracks[track].lead}
                    </p>
                  </li>
                );
              })}
            </ol>
          </section>

          <section className="mt-12">
            <p className="eyebrow mb-3 text-faint">{t.tagsLabel}</p>
            <div className="flex flex-wrap gap-2">
              <Link href={p("/agenti")} className={chip(activeTag === null)}>
                {t.all}
              </Link>
              {AGENT_TAGS.filter((tag) => counts[tag]).map((tag) => (
                <Link
                  key={tag}
                  href={`${p("/agenti")}?stitek=${tag}`}
                  className={chip(activeTag === tag)}
                >
                  {labels.tags[tag]} <span className="tabular opacity-60">{counts[tag]}</span>
                </Link>
              ))}
            </div>
          </section>

          {activeTag ? (
            <section className="mt-10 border-t-2 border-hairline-strong pt-8">
              <p className="eyebrow mb-4 text-faint">
                {t.filtered(shown.length, labels.tags[activeTag])} ·{" "}
                <Link href={p("/agenti")} className="draw-link">
                  {t.clear}
                </Link>
              </p>
              <div>
                {shown.map((article) => (
                  <ArticleRow key={article.slug} article={article} locale={locale} t={t} />
                ))}
              </div>
            </section>
          ) : (
            AGENT_TRACKS.map((track) => {
              const items = all.filter((a) => a.track === track);
              if (items.length === 0) return null;
              return (
                <section
                  key={track}
                  id={track}
                  className="mt-14 scroll-mt-24 border-t-2 border-hairline-strong pt-8"
                >
                  <h2 className="display text-[clamp(22px,3.5vw,30px)]">
                    {labels.tracks[track].name}
                  </h2>
                  <p className="mt-3 max-w-[58ch] text-[15px] leading-relaxed text-muted">
                    {labels.tracks[track].lead}
                  </p>
                  <div className="mt-6">
                    {items.map((article) => (
                      <ArticleRow key={article.slug} article={article} locale={locale} t={t} />
                    ))}
                  </div>
                </section>
              );
            })
          )}
        </>
      )}

      <div className="mt-16 max-w-xl">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 text-[14.5px] text-muted">{t.ctaDesc}</p>
        <NewsletterForm source="agenti-sekce" locale={locale} />
      </div>
    </div>
  );
}
