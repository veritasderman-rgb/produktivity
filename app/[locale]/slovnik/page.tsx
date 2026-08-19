import type { Metadata } from "next";
import { glossary } from "@/lib/glossary";
import { isLocale, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const T = {
  cs: {
    title: "Slovník pojmů",
    description:
      "Pojmy z produktivity a AI vysvětlené lidsky: prompt, kontextové okno, MCP, rutiny, cash flow a další. Stejná vysvětlení, která na webu vidíte v tooltipech.",
    eyebrow: "Vysvětleno lidsky",
    heading: "Slovník pojmů",
    lead: "Pojmy, které v článcích podtrháváme tečkovanou linkou. Najetím na podtržené slovo se vysvětlení ukáže přímo v textu — tady jsou všechna pohromadě.",
  },
  en: {
    title: "Glossary",
    description:
      "Productivity and AI terms explained in plain language: prompt, context window, MCP, routines, cash flow and more. The same explanations you see in tooltips across the site.",
    eyebrow: "Explained in plain language",
    heading: "Glossary",
    lead: "The terms we underline with a dotted line in articles. Hover over an underlined word and the explanation appears right in the text — here they all are in one place.",
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
  const csUrl = "https://www.produktivni.cz/slovnik";
  const enUrl = "https://www.productive.tips/slovnik";
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

export default async function GlossaryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const entries = [...glossary].sort((a, b) =>
    a.term[locale].localeCompare(b.term[locale], locale),
  );

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">{t.lead}</p>

      <dl className="mt-10 divide-y divide-hairline border-y border-hairline">
        {entries.map((e) => (
          <div key={e.id} id={e.id} className="py-5 scroll-mt-24">
            <dt className="text-[17px] font-bold">{e.term[locale]}</dt>
            <dd className="mt-1.5 max-w-[70ch] text-[14.5px] leading-relaxed text-muted">
              {e.def[locale]}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
