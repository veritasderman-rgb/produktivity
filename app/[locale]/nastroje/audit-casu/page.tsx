import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { TimeAudit } from "@/components/TimeAudit";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    title: "Audit času: co mě stojí čas",
    description:
      "Spočítejte si, kolik hodin ročně spolknou e-maily, porady, hledání a reporting — a kolik z toho jde reálně dostat zpátky. Ke každé položce návod, který ji řeší.",
    eyebrow: "Nástroj · čas",
    heading: "Co mě stojí čas",
    lead: "Hodina týdně vypadá nevinně. Čtyřicet čtyři týdnů později je to celý pracovní týden. Tenhle formulář vezme vaše odhady, převede je na roční čísla a u každé položky ukáže, kde se s tím dá něco dělat.",
    methodTitle: "Jak to číst",
    method: [
      "Nejde o měření, ale o rámec. Nástroj nic nesleduje a nikam nekouká — pracuje výhradně s čísly, která zadáte. Když do něj napíšete nesmysl, dostanete přesně spočítaný nesmysl. Hodnota je v tom, že vás donutí ta čísla vůbec vyslovit.",
      "Roční pohled je jediný poctivý. Dvě hodiny týdně nad přepisováním dat nikdo neřeší, protože dvě hodiny nejsou vidět. Osmdesát osm hodin ročně už vidět je — a to je přesně totéž číslo, jen v jiném měřítku.",
      "Úspora není nula práce. Podíl u každé činnosti je odhad, kolik z ní odpadne, když ji předáte pravidlům, šabloně nebo AI. Zbytek zůstává: kontrola, výjimky, rozhodování. Proto posuvník končí na 80 % — činnost, která by zmizela úplně, není úspora, ale změna popisu práce.",
      "Nejdřív jedna položka, ne osm. Pořadí v tabulce je pořadí, ve kterém to má smysl řešit. Vezměte nejvyšší řádek, otevřete návod u něj a další měsíc se nedívejte nikam jinam.",
    ],
    disclaimerLabel: "Orientační odhad",
    disclaimer:
      "Výsledek je aritmetika nad vašimi vlastními odhady, ne měření a ne slib. Nikdo vám nezaručí, že ušetřené hodiny opravdu vzniknou — ani že se z nich stanou peníze. Pokud chcete číslo, o které se dá opřít rozhodnutí, odměřte si jeden poctivý týden a teprve pak sem vstupy přepište.",
    readTitle: "Kam dál",
    readLead: "Kontext k tomu, proč se čas ztrácí a co s tím systémově:",
    links: [
      {
        href: "/prirucka/cas-jako-zbozi",
        title: "Čas jako zboží: kapacita, sazba a sezónnost",
        desc: "Proč se nevyužitá hodina nedá prodat později a jak z toho vychází hodnota vaší hodiny.",
      },
      {
        href: "/prirucka/procesy-a-automatizace",
        title: "Procesy a automatizace",
        desc: "Jak z opakované činnosti udělat postup a z postupu něco, co běží samo.",
      },
      {
        href: "/nastroje/sazba",
        title: "Kalkulačka hodinové sazby",
        desc: "Když nevíte, jakou hodnotu své hodině zadat — tady si ji spočítáte odspodu.",
      },
    ],
  },
  en: {
    title: "Time audit: what your time costs you",
    description:
      "Work out how many hours a year go into email, meetings, searching and reporting — and how much of that you could realistically get back. Each item links to a guide that fixes it.",
    eyebrow: "Tool · time",
    heading: "What your time costs you",
    lead: "An hour a week looks harmless. Forty-four weeks later it is a whole working week. This form takes your estimates, turns them into annual numbers and shows, item by item, where something can be done about it.",
    methodTitle: "How to read it",
    method: [
      "This is a frame, not a measurement. The tool tracks nothing and looks nowhere — it works purely with the numbers you type in. Put nonsense in and you get precisely calculated nonsense out. The value is that it forces you to say those numbers out loud at all.",
      "The annual view is the only honest one. Nobody deals with two hours a week spent retyping data, because two hours are invisible. Eighty-eight hours a year are visible — and it is exactly the same number, just at a different scale.",
      "Saving is not zero work. The share on each activity is your estimate of how much of it falls away once you hand it to rules, a template or AI. The rest stays: checking, exceptions, deciding. That is why the slider stops at 80 % — an activity that disappeared entirely would not be a saving, it would be a different job.",
      "One item first, not eight. The order in the table is the order worth tackling. Take the top row, open the guide next to it and look nowhere else for a month.",
    ],
    disclaimerLabel: "Rough estimate",
    disclaimer:
      "The result is arithmetic over your own guesses — not a measurement and not a promise. Nobody can guarantee those hours will actually appear, or that they will turn into money. If you want a number solid enough to base a decision on, measure one honest week first and only then rewrite the inputs here.",
    readTitle: "Read next",
    readLead: "The context for why time leaks and what to do about it systematically:",
    links: [
      {
        href: "/prirucka/cas-jako-zbozi",
        title: "Time as a commodity: capacity, rate and seasonality",
        desc: "Why an unsold hour cannot be sold later, and where the value of your hour comes from.",
      },
      {
        href: "/prirucka/procesy-a-automatizace",
        title: "Processes and automation",
        desc: "How to turn a repeated activity into a procedure, and a procedure into something that runs itself.",
      },
      {
        href: "/nastroje/sazba",
        title: "Hourly rate calculator",
        desc: "If you do not know what to put in as the value of your hour — work it out from the ground up.",
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
  const csUrl = "https://produktivni.cz/nastroje/audit-casu";
  const enUrl = "https://productive.tips/nastroje/audit-casu";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function TimeAuditPage({
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

      {/* Nástroj čte stav z URL, takže se dorenderuje až v prohlížeči —
          prázdný rám drží místo, aby stránka pod ním neposkakovala. */}
      <Suspense
        fallback={<div className="mt-10 h-[1200px] border-[1.5px] border-hairline" aria-hidden="true" />}
      >
        <TimeAudit locale={locale} />
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

      <aside className="mt-10 border border-hairline-strong bg-surface p-5" aria-label={t.disclaimerLabel}>
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
