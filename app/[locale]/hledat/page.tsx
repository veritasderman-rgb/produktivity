import type { Metadata } from "next";
import { getAllTips } from "@/lib/tips";
import { getAllChapters } from "@/lib/chapters";
import { getAllNews } from "@/lib/news";
import { getAllInterviews, interviewTitle } from "@/lib/interviews";
import { SearchAll, type SearchDoc } from "@/components/SearchAll";
import { isLocale, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    title: "Hledat",
    description: "Fulltextové hledání napříč příručkou, tipy a AI novinkami.",
    heading: "Hledat",
    count: (n: number) => `${n} položek obsahu`,
  },
  en: {
    title: "Search",
    description: "Full-text search across the handbook, the tips and the AI updates.",
    heading: "Search",
    count: (n: number) => `${n} pieces of content`,
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
  const csUrl = "https://www.produktivni.cz/hledat";
  const enUrl = "https://www.productive.tips/hledat";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function SearchPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ q?: string }>;
}) {
  const { locale: raw } = await params;
  const { q } = await searchParams;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;

  const docs: SearchDoc[] = [
    ...getAllChapters(locale).map((c) => ({
      type: "kapitola" as const,
      slug: c.slug,
      title: c.title,
      excerpt: c.excerpt,
    })),
    ...getAllTips(locale).map((tip) => ({
      type: "tip" as const,
      slug: tip.slug,
      title: tip.title,
      excerpt: tip.excerpt,
    })),
    ...getAllNews(locale).map((n) => ({
      type: "ai" as const,
      slug: n.slug,
      title: n.title,
      excerpt: n.excerpt,
    })),
    ...getAllInterviews(locale).map((i) => ({
      type: "rozhovor" as const,
      slug: i.slug,
      title: interviewTitle(i, locale),
      excerpt: i.excerpt,
    })),
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.count(docs.length)}</p>
      <h1 className="display mb-8 text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <SearchAll docs={docs} locale={locale} initialQuery={q ?? ""} />
    </div>
  );
}
