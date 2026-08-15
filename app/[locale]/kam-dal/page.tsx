import type { Metadata } from "next";
import { getResourcesByCategory } from "@/lib/resources";
import { isLocale, type Locale } from "@/lib/i18n";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

const T = {
  cs: {
    title: "Kam dál — ověřené zdroje o AI a produktivitě",
    description:
      "Ručně ověřený rozcestník externích zdrojů: dokumentace AI nástrojů, newslettery, české weby o AI, klasika produktivity a bezplatné kurzy. Bez affiliate odkazů.",
    eyebrow: "Rozcestník",
    heading: "Kam dál",
    lead:
      "Nejlepší weby o AI a produktivitě nejsou naše konkurence, ale pokračování — tady posíláme dál. Každý odkaz jsme ručně prošli: web žije, publikuje a je tím, co o něm tvrdíme.",
    langBadge: "anglicky",
    csBadge: "česky",
    note:
      "Seznam spravujeme průběžně — mrtvé nebo upadlé zdroje vyřazujeme. Žádný odkaz není placený ani affiliate. Chybí tu něco kvalitního?",
    noteCta: "Napište nám tip",
    mailSubject: "Tip do rozcestníku Kam dál",
  },
  en: {
    title: "Where to next — vetted AI & productivity resources",
    description:
      "A hand-checked directory of external resources: official AI documentation, newsletters, productivity classics and free courses. No affiliate links.",
    eyebrow: "Directory",
    heading: "Where to next",
    lead:
      "The best sites on AI and productivity aren't our competition — they're the continuation. This is where we send you onward. Every link is hand-checked: the site is alive, publishing, and exactly what we say it is.",
    langBadge: "English",
    csBadge: "Czech",
    note:
      "We maintain this list continuously — dead or declining sources get removed. No link here is paid or affiliate. Know something great that's missing?",
    noteCta: "Send us a tip",
    mailSubject: "A tip for the Where to next directory",
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
  const csUrl = "https://www.produktivni.cz/kam-dal";
  const enUrl = "https://www.productive.tips/kam-dal";
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
      images: [`/api/og?title=${encodeURIComponent(t.heading)}`],
    },
  };
}

export default async function ResourcesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  // Česká verze ukazuje všechno (anglické se štítkem), anglická jen `lang: "en"`.
  const categories = getResourcesByCategory(locale === "en" ? "en" : undefined);

  return (
    <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-14">
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.heading, path: "/kam-dal" }])} />
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="prose-a mt-4 max-w-[70ch] text-[16.5px]">{t.lead}</p>

      {categories.map((cat) => (
        <section key={cat.id} className="mt-14">
          <h2 className="display text-[clamp(20px,3vw,28px)]">{cat.title[locale]}</h2>
          <p className="prose-a mt-2 mb-6 max-w-[70ch] text-[15px]">{cat.intro[locale]}</p>
          <div className="grid gap-5 md:grid-cols-2">
            {cat.items.map((r) => (
              <article key={r.url} className="tipcard">
                <h3 className="text-[17px] leading-[1.3] font-bold tracking-[-0.01em]">
                  <a
                    href={r.url}
                    target="_blank"
                    rel="noopener"
                    className="draw-link"
                  >
                    {r.name}
                  </a>
                  {locale === "cs" && (
                    <span className="eyebrow ml-2 align-middle text-faint">
                      {r.lang === "cs" ? t.csBadge : t.langBadge}
                    </span>
                  )}
                </h3>
                <p className="mt-3 font-serif text-[14.5px] leading-[1.6] text-muted">
                  {r.desc[locale]}
                </p>
              </article>
            ))}
          </div>
        </section>
      ))}

      <p className="mt-14 max-w-[70ch] border border-hairline bg-surface p-4 text-[13px] leading-relaxed text-muted">
        {t.note}{" "}
        <a
          href={`mailto:josef@josefpavlovic.cz?subject=${encodeURIComponent(t.mailSubject)}`}
          className="draw-link font-bold"
        >
          {t.noteCta}
        </a>
        .
      </p>
    </div>
  );
}
