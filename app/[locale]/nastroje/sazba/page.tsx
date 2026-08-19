import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { RateCalculator } from "@/components/RateCalculator";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const T = {
  cs: {
    title: "Kalkulačka hodinové sazby",
    description:
      "Spočítejte si minimální hodinovou sazbu na volné noze: roční potřeba, provozní náklady, rezerva na daně a jen ty hodiny, které se dají opravdu prodat.",
    eyebrow: "Nástroj · volná noha",
    heading: "Kalkulačka hodinové sazby",
    lead: "Sazba není odměna za hodinu. Je to podíl: kolik peněz potřebujete za rok získat, děleno hodinami, které za rok reálně prodáte. Obě čísla se běžně počítají špatně — tenhle formulář vás provede oběma.",
    methodTitle: "Na čem to stojí",
    method: [
      "Na volné noze neprodáváte odpracovanou práci, ale kapacitu. Nevyužitá středa se nedá v listopadu prodat se slevou — prostě zmizí. Proto musí cena za prodanou hodinu zaplatit i hodiny, které se prodat nepodařilo.",
      "Fakturovatelných hodin je v týdnu zlomek. Akvizice, administrativa, učení, provoz a prostoje nezmizí tím, že je nezapíšete — zmizí jen z výpočtu sazby. Výchozích 60 % je hrubý odhad; skutečné číslo zjistíte jediným způsobem, a to poctivě odměřeným měsícem.",
      "Výsledkem je spodní hranice, ne cena. Kalkulace řekne, pod čím se práce nevyplatí. Kolik se za ni dá dostat, řekne trh — a když se ta dvě čísla nepotkají, je to informace o typu zakázek nebo segmentu klientů, ne o vaší hodnotě.",
    ],
    disclaimerLabel: "Orientační výpočet",
    disclaimer:
      "Tahle kalkulačka není daňové poradenství ani účetní software. Nepracuje s konkrétními sazbami daně, zdravotního a sociálního pojištění, paušálními režimy, DPH ani odpisy — rezervu na daně a odvody si zadáváte sami podle svojí situace. Výsledek je vodítko pro vyjednávání a plánování, ne podklad pro přiznání. Konkrétní čísla si ověřte u účetní nebo daňového poradce.",
    readTitle: "Kam dál",
    readLead: "Metodika i širší kontext peněz na volné noze jsou v příručce:",
    links: [
      {
        href: "/prirucka/cas-jako-zbozi",
        title: "Čas jako zboží: kapacita, sazba a sezónnost",
        desc: "Odkud se výpočet bere, proč je fakturovatelných hodin zlomek týdne a co dělat s poptávkou nad vlastní strop.",
      },
      {
        href: "/prirucka/financni-klid",
        title: "Finanční klid",
        desc: "Rezerva, rozpočet a rytmus plateb — aby výsledek kalkulačky měl kde přistát.",
      },
    ],
  },
  en: {
    title: "Hourly rate calculator",
    description:
      "Work out your minimum freelance hourly rate: annual needs, running costs, a reserve for tax and only the hours you can actually sell.",
    eyebrow: "Tool · freelancing",
    heading: "Hourly rate calculator",
    lead: "A rate is not a reward for an hour. It is a ratio: how much money you need over a year, divided by the hours you actually sell in that year. Both numbers are usually calculated wrong — this form walks you through both.",
    methodTitle: "What it is built on",
    method: [
      "Freelancing does not sell finished work, it sells capacity. An unsold Wednesday cannot be discounted in November — it simply disappears. That is why the price of a sold hour has to pay for the hours you failed to sell.",
      "Billable hours are a fraction of the week. Sales, admin, learning, running your own shop and downtime do not vanish because you fail to log them — they only vanish from the rate calculation. The default 60 % is a rough guess; the real number comes from one honestly measured month.",
      "The result is a floor, not a price. The calculation tells you what is not worth doing. What you can actually charge is decided by the market — and when the two numbers do not meet, that is information about your type of work or client segment, not about your worth.",
    ],
    disclaimerLabel: "Rough guidance only",
    disclaimer:
      "This calculator is not tax advice or accounting software. It does not know your income tax, health and social levies, flat-rate schemes, VAT or depreciation — you enter the reserve for tax and levies yourself, based on your own situation. Treat the result as a starting point for negotiation and planning, not as a basis for a tax return. Have the actual numbers checked by an accountant or a tax adviser.",
    readTitle: "Read next",
    readLead: "The method and the wider money context for freelancing sit in the handbook:",
    links: [
      {
        href: "/prirucka/cas-jako-zbozi",
        title: "Time as a commodity: capacity, rate and seasonality",
        desc: "Where the calculation comes from, why billable hours are a fraction of the week and what to do with demand above your ceiling.",
      },
      {
        href: "/prirucka/financni-klid",
        title: "Financial calm",
        desc: "Reserves, budget and the rhythm of payments — so the result has somewhere to land.",
      },
    ],
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
  const csUrl = "https://www.produktivni.cz/nastroje/sazba";
  const enUrl = "https://www.productive.tips/nastroje/sazba";
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

export default async function RatePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 max-w-[60ch] text-[16px] leading-relaxed text-muted">{t.lead}</p>

      {/* Kalkulačka čte stav z URL, takže se dorenderuje až v prohlížeči —
          prázdný rám drží místo, aby stránka pod ním neposkakovala. */}
      <Suspense
        fallback={<div className="mt-10 h-[760px] border-[1.5px] border-hairline" aria-hidden="true" />}
      >
        <RateCalculator locale={locale} />
      </Suspense>

      <section aria-labelledby="metodika" className="mt-14">
        <h2 id="metodika" className="display text-[20px]">
          {t.methodTitle}
        </h2>
        {t.method.map((paragraph) => (
          <p key={paragraph.slice(0, 24)} className="mt-3 max-w-[62ch] text-[15px] leading-relaxed text-muted">
            {paragraph}
          </p>
        ))}
      </section>

      <aside
        className="mt-10 border border-hairline-strong bg-surface p-5"
        aria-label={t.disclaimerLabel}
      >
        <p className="eyebrow mb-2 text-faint">{t.disclaimerLabel}</p>
        <p className="text-[13.5px] leading-relaxed text-muted">{t.disclaimer}</p>
      </aside>

      <section aria-labelledby="kamdal" className="mt-12">
        <h2 id="kamdal" className="display text-[20px]">
          {t.readTitle}
        </h2>
        <p className="mt-2 text-[14px] text-muted">{t.readLead}</p>
        <div className="mt-4 border-t-2 border-hairline-strong">
          {t.links.map((l) => (
            <Link key={l.href} href={p(l.href)} className="linkblock border-b border-hairline py-4">
              <span className="draw-link text-[16px] font-bold">{l.title}</span>
              <span className="mt-1.5 block max-w-[60ch] text-[13.5px] leading-relaxed text-muted">
                {l.desc}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
