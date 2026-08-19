import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopyPre } from "@/components/CopyPre";
import { PromptStar } from "@/components/PromptStar";
import { getArticlePrompts, getPromptArticles } from "@/lib/prompts";
import { getDict, isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const T = {
  cs: {
    breadcrumb: "Databáze promptů",
    eyebrow: "Prompty z návodu",
    metaTitle: (title: string) => `Prompty: ${title}`,
    description: (n: number, title: string) =>
      `${n === 1 ? "Jeden prompt" : n < 5 ? `${n} prompty` : `${n} promptů`} z návodu „${title}" — hotové k okopírování jedním kliknutím.`,
    lead: (n: number) =>
      `${n === 1 ? "Jeden prompt" : n < 5 ? `${n} prompty` : `${n} promptů`} z tohoto návodu. Doplňte to, co je v [hranatých závorkách] — vlastní kontext, text dokumentu nebo jméno nástroje. Právě ten kontext dělá rozdíl mezi obecnou a použitelnou odpovědí.`,
    promptsCount: (n: number) => (n === 1 ? "1 prompt" : n < 5 ? `${n} prompty` : `${n} promptů`),
    full: "Číst celý návod →",
    back: "Všechny prompty",
    copy: { copy: "Zkopírovat", copied: "Zkopírováno ✓" },
  },
  en: {
    breadcrumb: "Prompt library",
    eyebrow: "Prompts from the guide",
    metaTitle: (title: string) => `Prompts: ${title}`,
    description: (n: number, title: string) =>
      `${n === 1 ? "One prompt" : `${n} prompts`} from the guide “${title}” — ready to copy with a single click.`,
    lead: (n: number) =>
      `${n === 1 ? "One prompt" : `${n} prompts`} from this guide. Fill in whatever sits in [square brackets] — your own context, the document text or the name of your tool. That context is exactly what separates a generic answer from a usable one.`,
    promptsCount: (n: number) => (n === 1 ? "1 prompt" : `${n} prompts`),
    full: "Read the full guide →",
    back: "All prompts",
    copy: { copy: "Copy", copied: "Copied ✓" },
  },
};

export function generateStaticParams({ params }: { params: { locale: string } }) {
  return getPromptArticles(params.locale).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}): Promise<Metadata> {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const article = getArticlePrompts(slug, locale);
  if (!article) return {};
  const csUrl = `https://www.produktivni.cz/prompty/${slug}`;
  const enUrl = `https://www.productive.tips/prompty/${slug}`;
  return {
    title: t.metaTitle(article.title),
    description: t.description(article.prompts.length, article.title),
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
    openGraph: {
      title: t.metaTitle(article.title),
      description: t.description(article.prompts.length, article.title),
      images: [ogImage(t.metaTitle(article.title), locale)],
    },
  };
}

export default async function PromptArticlePage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale: raw, slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const dict = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  const article = getArticlePrompts(slug, locale);
  if (!article) notFound();

  const category = dict.tipCard.categories[article.category] ?? article.category;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-4 text-faint">
        <Link href={p("/prompty")} className="hover:underline">
          {t.breadcrumb}
        </Link>
        {" · "}
        {category} · {t.promptsCount(article.prompts.length)}
      </p>

      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(26px,4.5vw,40px)]" style={{ textTransform: "none" }}>
        {article.title}
      </h1>
      <p className="mt-4 max-w-[62ch] text-[15.5px] leading-relaxed text-muted">
        {t.lead(article.prompts.length)}
      </p>
      <p className="mt-4 border-b border-hairline pb-6">
        <Link href={p(`/tipy/${article.slug}`)} className="draw-link text-[14px] font-semibold">
          {t.full}
        </Link>
      </p>

      {article.prompts.map((prompt) => (
        <section key={prompt.id} id={prompt.id} className="mt-10 scroll-mt-24">
          <h2 className="text-[15px] font-bold leading-snug">{prompt.label}</h2>
          <CopyPre
            label={t.copy}
            actions={
              <PromptStar
                prompt={{ id: prompt.id, label: prompt.label, slug: article.slug, title: article.title }}
                locale={locale}
              />
            }
          >
            <pre className="mt-2 overflow-x-auto border border-hairline bg-surface p-4 pr-36 font-mono text-[12.5px] leading-relaxed whitespace-pre-wrap text-ink">
              {prompt.text}
            </pre>
          </CopyPre>
        </section>
      ))}

      <p className="mt-14 border-t border-hairline pt-6">
        <Link href={p("/prompty")} className="draw-link text-[14px] font-semibold">
          ← {t.back}
        </Link>
      </p>
    </div>
  );
}
