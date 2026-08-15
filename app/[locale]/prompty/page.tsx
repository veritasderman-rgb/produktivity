import type { Metadata } from "next";
import Link from "next/link";
import { MyPrompts } from "@/components/MyPrompts";
import { getPromptArticles, type PromptArticle } from "@/lib/prompts";
import { getDict, isLocale, localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    title: "Databáze promptů",
    description:
      "Všechny prompty z návodů na jednom místě — k okopírování jedním kliknutím. Oponentura, shrnutí dokumentů, analýza dat, e-maily, přepisy i plánování.",
    eyebrow: "Zkopírujte a použijte",
    heading: "Databáze promptů",
    lead: (prompts: number, articles: number) =>
      `${prompts} promptů vytažených z ${articles} podrobných návodů. Každý je hotový k okopírování — jen doplňte to, co je v [hranatých závorkách]: vlastní kontext, text dokumentu nebo jméno nástroje. Bez doplnění závorek prompt fungovat nebude, protože právě ten kontext dělá rozdíl mezi obecnou a použitelnou odpovědí.`,
    navLabel: "Kategorie",
    promptsCount: (n: number) => (n === 1 ? "1 prompt" : n < 5 ? `${n} prompty` : `${n} promptů`),
    articlesCount: (n: number) =>
      n === 1 ? "1 návod" : n < 5 ? `${n} návody` : `${n} návodů`,
    open: "Vyberte návod a otevřete si jeho prompty.",
  },
  en: {
    title: "Prompt library",
    description:
      "Every prompt from our guides in one place — copy any of them with a single click. Red-teaming, document summaries, data analysis, e-mails, transcripts and planning.",
    eyebrow: "Copy and use",
    heading: "Prompt library",
    lead: (prompts: number, articles: number) =>
      `${prompts} prompts extracted from ${articles} in-depth guides. Each one is ready to copy — just fill in whatever sits in [square brackets]: your own context, the document text or the name of your tool. A prompt will not work without that, because the context is exactly what separates a generic answer from a usable one.`,
    navLabel: "Categories",
    promptsCount: (n: number) => (n === 1 ? "1 prompt" : `${n} prompts`),
    articlesCount: (n: number) => (n === 1 ? "1 guide" : `${n} guides`),
    open: "Pick a guide to open its prompts.",
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
  const csUrl = "https://www.produktivni.cz/prompty";
  const enUrl = "https://www.productive.tips/prompty";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function PromptsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const dict = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  const articles = getPromptArticles(locale);
  const promptCount = articles.reduce((n, a) => n + a.prompts.length, 0);

  const groups: { category: string; label: string; articles: PromptArticle[] }[] = [];
  for (const article of articles) {
    let group = groups.find((g) => g.category === article.category);
    if (!group) {
      group = {
        category: article.category,
        label: dict.tipCard.categories[article.category] ?? article.category,
        articles: [],
      };
      groups.push(group);
    }
    group.articles.push(article);
  }

  return (
    <div className="mx-auto max-w-4xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 max-w-[62ch] text-[16px] leading-relaxed text-muted">
        {t.lead(promptCount, articles.length)}
      </p>

      <MyPrompts locale={locale} />

      <nav aria-label={t.navLabel} className="mt-8 flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1 text-faint">{t.navLabel}</span>
        {groups.map((g) => (
          <a
            key={g.category}
            href={`#kat-${g.category}`}
            className="border border-hairline px-3 py-1.5 text-[13px] font-semibold text-muted no-underline transition-colors hover:border-ink hover:text-ink"
          >
            {g.label}{" "}
            <span className="tabular text-faint">
              {g.articles.reduce((n, a) => n + a.prompts.length, 0)}
            </span>
          </a>
        ))}
      </nav>

      {groups.map((g) => (
        <section key={g.category} id={`kat-${g.category}`} className="mt-14 scroll-mt-24">
          <div className="flex items-baseline justify-between gap-4 border-b-2 border-hairline-strong pb-2">
            <h2 className="display text-[22px]">{g.label}</h2>
            <span className="eyebrow text-faint">{t.articlesCount(g.articles.length)}</span>
          </div>
          <p className="mt-3 text-[13.5px] text-faint">{t.open}</p>

          <ul className="mt-2">
            {g.articles.map((article) => (
              <li key={article.slug} className="border-b border-hairline">
                <Link
                  href={p(`/prompty/${article.slug}`)}
                  className="linkblock flex items-baseline gap-3 py-4"
                >
                  <span aria-hidden="true" className="font-mono text-[15px] leading-none text-accent">
                    →
                  </span>
                  <span className="draw-link flex-1 text-[16px] font-bold leading-snug">
                    {article.title}
                  </span>
                  <span className="eyebrow shrink-0 text-faint">
                    {t.promptsCount(article.prompts.length)}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
