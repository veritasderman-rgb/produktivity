import type { Metadata } from "next";
import Link from "next/link";
import { gadgetCategories } from "@/lib/gadgets";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

const T = {
  cs: {
    title: "Gadgety pro produktivitu",
    description:
      "Kurátorovaný výběr vybavení, které skutečně šetří čas a pozornost: časovače, sluchátka, ergonomie, věci na cesty.",
    eyebrow: "Vybavení, které se vyplatí",
    heading: "Gadgety",
    lead: "Žádný katalog všeho — jen věci, které v produktivním systému skutečně nesou váhu. Každá položka odkazuje na související tip s postupem.",
    tipLink: "Jak ho používat →",
    whyLabel: "Proč to funguje",
    disclosure:
      "Transparentně: odkazy na obchody mohou být provizní — nákup přes ně podpoří provoz webu, vy zaplatíte stejně. Vybíráme podle užitečnosti, ne podle provize.",
    buyAt: "Koupíte v",
  },
  en: {
    title: "Productivity gadgets",
    description:
      "A curated list of gear that actually saves time and attention: timers, headphones, ergonomics, travel kit.",
    eyebrow: "Gear that earns its keep",
    heading: "Gadgets",
    lead: "Not a catalog of everything — only the gear that genuinely pulls weight in a productivity system. Each item links to a related how-to tip.",
    tipLink: "How to use it →",
    whyLabel: "Why it works",
    disclosure:
      "Full transparency: shop links may be affiliate links — buying through them supports the site at no extra cost to you. We pick by usefulness, not by commission.",
    buyAt: "Available at",
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
  const csUrl = "https://www.produktivni.cz/gadgety";
  const enUrl = "https://www.productive.tips/gadgety";
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

export default async function GadgetsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  return (
    <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-14">
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.heading, path: "/gadgety" }])} />
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="prose-a mt-4 text-[16.5px]">{t.lead}</p>
      <p className="mt-6 max-w-[70ch] border border-hairline bg-surface p-4 text-[13px] leading-relaxed text-muted">
        {t.disclosure}
      </p>

      {gadgetCategories.map((cat) => (
        <section key={cat.slug} className="mt-14">
          <h2 className="display text-[clamp(20px,3vw,28px)]">{cat.title[locale]}</h2>
          <p className="prose-a mt-2 mb-6 text-[15px]">{cat.intro[locale]}</p>
          <div className="grid gap-5 md:grid-cols-3">
            {cat.items.map((g) => {
              const name = locale === "en" ? (g.nameEn ?? g.name) : g.name;
              const links = g.links[locale] ?? g.links.cs;
              return (
                <article key={g.slug} className="tipcard">
                  <h3 className="text-[17px] leading-[1.3] font-bold tracking-[-0.01em]">{name}</h3>
                  <p className="mt-3 font-serif text-[14.5px] leading-[1.6] text-muted">
                    {g.blurb[locale]}
                  </p>
                  <p className="mt-3 grow text-[13px] leading-relaxed text-muted">
                    <span className="eyebrow mr-1.5 text-faint">{t.whyLabel}:</span>
                    {g.why[locale]}
                  </p>
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                    <span className="text-[13px]">
                      <span className="eyebrow mr-2 text-faint">{t.buyAt}</span>
                      {links.map((l, i) => (
                        <a
                          key={l.shop}
                          href={l.affiliateUrl ?? l.url}
                          target="_blank"
                          rel="noopener noreferrer sponsored"
                          className="draw-link mr-3 font-bold"
                        >
                          {l.shop}
                        </a>
                      ))}
                    </span>
                    {g.tipSlug && (
                      <Link href={p(`/tipy/${g.tipSlug}`)} className="draw-link text-[13px] font-bold">
                        {t.tipLink}
                      </Link>
                    )}
                  </div>
                </article>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
