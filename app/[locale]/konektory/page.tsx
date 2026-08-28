import type { Metadata } from "next";
import Link from "next/link";
import { getConnectorsByCategory, type ConnectorStatus } from "@/lib/konektory";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

const T = {
  cs: {
    title: "Katalog MCP konektorů pro Claude",
    description:
      "Přehled konektorů, které Claude umí připojit: kancelář, data, grafika, CAD, marketing, vývoj i veřejné registry. U každého je vidět, jestli ho vydává výrobce, nebo komunita.",
    eyebrow: "Katalog",
    heading: "MCP konektory",
    lead: "Konektor je zásuvka, kterou Claude vidí do vašeho nástroje — a přesně proto je u každého potřeba vědět, kdo za něj ručí. Oficiální vydává výrobce nebo Anthropic, komunitní je software třetí strany, který si pouštíte k vlastním datům.",
    statusLabel: { oficialni: "oficiální", komunitni: "komunitní", beta: "beta" } as Record<ConnectorStatus, string>,
    limitLabel: "Kde je hranice:",
    guideLead: "Jak konektory vybírat, zabezpečit a ladit, rozebírá",
    guideLink: "velký průvodce konektory",
    note: "Seznam procházíme ručně a průběžně doplňujeme; u konektorů se podmínky mění rychle, takže si stav vždy ověřte u zdroje. Žádný odkaz není placený ani affiliate. Chybí tu konektor, který používáte?",
    noteCta: "Napište nám ho",
    mailSubject: "Tip do katalogu MCP konektorů",
    countLabel: (n: number) => `${n} konektorů v katalogu`,
  },
  en: {
    title: "A catalogue of MCP connectors for Claude",
    description:
      "An overview of the connectors Claude can plug into: office, data, graphics, CAD, marketing, development and public registries. Each one shows whether the vendor or the community ships it.",
    eyebrow: "Catalogue",
    heading: "MCP connectors",
    lead: "A connector is the socket through which Claude sees into your tool — which is exactly why you need to know who stands behind each one. Official ones come from the vendor or Anthropic; community ones are third-party software you point at your own data.",
    statusLabel: { oficialni: "official", komunitni: "community", beta: "beta" } as Record<ConnectorStatus, string>,
    limitLabel: "Where the limit is:",
    guideLead: "How to choose, secure and debug connectors is covered in",
    guideLink: "the full connector guide",
    note: "We check this list by hand and keep adding to it; connector terms change fast, so always verify the current state at the source. No link here is paid or affiliate. Missing a connector you use?",
    noteCta: "Tell us about it",
    mailSubject: "A tip for the MCP connector catalogue",
    countLabel: (n: number) => `${n} connectors in the catalogue`,
  },
};

/** Barevné odlišení: komunitní konektor je cizí software, ať je to vidět na první pohled. */
const statusClass: Record<ConnectorStatus, string> = {
  oficialni: "border-hairline text-faint",
  komunitni: "border-accent text-accent",
  beta: "border-hairline-strong text-ink",
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const csUrl = "https://www.produktivni.cz/konektory";
  const enUrl = "https://www.productive.tips/konektory";
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
      images: [ogImage(t.heading, locale)],
    },
  };
}

export default async function ConnectorsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const categories = getConnectorsByCategory();
  const total = categories.reduce((n, c) => n + c.items.length, 0);

  return (
    <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-14">
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.heading, path: "/konektory" }])} />
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="prose-a mt-4 max-w-[70ch] text-[16.5px]">{t.lead}</p>
      <p className="mt-4 text-[14px] text-muted">
        {t.countLabel(total)} · {t.guideLead}{" "}
        <Link href={localePath(locale, "/tipy/mcp-konektory-nastroje")} className="draw-link font-bold">
          {t.guideLink}
        </Link>
        .
      </p>

      {categories.map((cat) => (
        <section key={cat.id} className="mt-14">
          <h2 className="display text-[clamp(20px,3vw,28px)]">{cat.title[locale]}</h2>
          <p className="prose-a mt-2 mb-6 max-w-[70ch] text-[15px]">{cat.intro[locale]}</p>
          <div className="grid gap-5 md:grid-cols-2">
            {cat.items.map((c) => (
              <article key={c.url} className="tipcard">
                <h3 className="text-[17px] leading-[1.3] font-bold tracking-[-0.01em]">
                  <a href={c.url} target="_blank" rel="noopener" className="draw-link">
                    {c.name}
                  </a>
                  <span
                    className={`eyebrow ml-2 border px-1.5 py-0.5 align-middle ${statusClass[c.status]}`}
                  >
                    {t.statusLabel[c.status]}
                  </span>
                </h3>
                <p className="eyebrow mt-2 text-faint">{c.vendor}</p>
                <p className="mt-3 font-serif text-[14.5px] leading-[1.6] text-muted">
                  {c.desc[locale]}
                </p>
                {c.limit && (
                  <p className="mt-3 border-t border-hairline pt-3 text-[13px] leading-[1.55] text-muted">
                    <span className="font-bold text-ink">{t.limitLabel}</span> {c.limit[locale]}
                  </p>
                )}
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
