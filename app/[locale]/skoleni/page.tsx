import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";
import { isLocale, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const T = {
  cs: {
    title: "Školení produktivity pro firmy",
    description:
      "Praktická firemní školení produktivity a AI nástrojů. Půldenní a celodenní workshopy pro skupiny do 15 lidí, cena na vyžádání.",
    eyebrow: "Pro firmy a týmy",
    headingA: "Váš tým nemá čas číst o produktivitě.",
    headingB: " Naučím ho to osobně.",
    leadA: "Praktické workshopy bez teoretických přednášek: každý blok končí tím, že lidé mají věc ",
    leadStrong: "nastavenou a vyzkoušenou",
    leadB: " na vlastním počítači. Vedu je já, Josef Pavlovic — autor zdejší příručky.",
    formatsTitle: "Formáty",
    featuredLabel: "Nejčastější volba",
    priceNote: "skupina do 15 lidí · cena na vyžádání",
    formats: [
      {
        name: "Půldenní workshop",
        time: "4 hodiny · u vás nebo online",
        desc: "Rychlá intenzivní dávka: e-maily pod kontrolou, priority, klávesové zkratky a 3 AI nástroje, které tým začne používat ještě ten den.",
        featured: false,
      },
      {
        name: "Celodenní workshop",
        time: "8 hodin · u vás",
        desc: "Kompletní systém: od zachycení úkolů přes porady a sdílenou práci až po AI workflow šité na vaše konkrétní procesy. S praktickým nácvikem.",
        featured: true,
      },
      {
        name: "Online konzultace",
        time: "2 hodiny · online",
        desc: "Navazující podpora po školení, nebo bodové téma — třeba nasazení jednoho AI nástroje do konkrétního procesu.",
        featured: false,
      },
    ],
    quoteNote:
      "Cenu a program připravím na míru podle velikosti týmu a rozsahu — napište do formuláře a do dvou pracovních dnů máte konkrétní nabídku.",
    modulesTitle: "Z čeho skládáme program",
    modules: [
      "E-mail a Inbox Zero — konec věčně plné schránky",
      "Priority a plánování — Eisenhower, time-blocking, deep work",
      "Porady, které někam vedou",
      "Klávesové zkratky a triky, které šetří hodiny",
      "AI v denní praxi — psaní, rešerše, automatizace",
      "Digitální minimalismus — méně nástrojů, více práce",
    ],
    caseEyebrow: "Příklad z praxe",
    caseTitle: "Co dnes zvládne malý tým s AI",
    caseA: "Dobrá ukázka toho, kam až sahá páka AI nástrojů v praxi: datový portál ",
    caseB:
      " — interaktivní hodnocení výkonnosti českého zdravotnictví s ~190 indikátory, simulátorem reforem a regionálním srovnáním. Projekt v rozsahu, na který dřív bylo potřeba celé vývojové studio, dnes vzniká v malém týmu s výraznou pomocí AI. Přesně tenhle způsob práce na školení učím.",
    inquiryTitle: "Nezávazná poptávka",
    inquiryDesc:
      "Napište mi, co váš tým nejvíc brzdí — do dvou pracovních dnů se ozvu s návrhem programu a termínu.",
  },
  en: {
    title: "Productivity training for companies",
    description:
      "Hands-on corporate training in productivity and AI tools. Half-day and full-day workshops for groups of up to 15 people, pricing on request.",
    eyebrow: "For companies and teams",
    headingA: "Your team has no time to read about productivity.",
    headingB: " So I teach them in person.",
    leadA: "Hands-on workshops, no lectures: every block ends with people having the thing ",
    leadStrong: "set up and tested",
    leadB: " on their own machine. I run them myself — Josef Pavlovic, the author of the handbook on this site.",
    formatsTitle: "Formats",
    featuredLabel: "Most popular choice",
    priceNote: "groups of up to 15 people · pricing on request",
    formats: [
      {
        name: "Half-day workshop",
        time: "4 hours · on site or online",
        desc: "A short, intense dose: email under control, priorities, keyboard shortcuts and 3 AI tools the team starts using the same day.",
        featured: false,
      },
      {
        name: "Full-day workshop",
        time: "8 hours · on site",
        desc: "The complete system: from capturing tasks through meetings and shared work all the way to AI workflows tailored to your actual processes. With hands-on practice.",
        featured: true,
      },
      {
        name: "Online consultation",
        time: "2 hours · online",
        desc: "Follow-up support after a workshop, or a single focused topic — rolling one AI tool into one specific process, for instance.",
        featured: false,
      },
    ],
    quoteNote:
      "I put the price and the agenda together for your team size and scope — send the form and you will have a concrete proposal within two business days.",
    modulesTitle: "What the program is built from",
    modules: [
      "Email and Inbox Zero — the end of a permanently full inbox",
      "Priorities and planning — Eisenhower, time blocking, deep work",
      "Meetings that actually go somewhere",
      "Keyboard shortcuts and tricks that save hours",
      "AI in daily practice — writing, research, automation",
      "Digital minimalism — fewer tools, more work done",
    ],
    caseEyebrow: "A case from practice",
    caseTitle: "What a small team can do with AI today",
    caseA: "A good illustration of how far AI tools reach in practice: the data portal ",
    caseB:
      " — an interactive assessment of the Czech healthcare system with around 190 indicators, a reform simulator and regional comparisons. A project of a scope that used to require an entire development studio is now built by a small team with heavy AI support. This is exactly the way of working I teach in the workshops.",
    inquiryTitle: "No-obligation inquiry",
    inquiryDesc:
      "Tell me what slows your team down the most — I will get back to you within two business days with a proposed agenda and date.",
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
  const csUrl = "https://www.produktivni.cz/skoleni";
  const enUrl = "https://www.productive.tips/skoleni";
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

export default async function TrainingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">
        {t.headingA}
        <br className="max-sm:hidden" />
        {t.headingB}
      </h1>
      <p className="mt-5 max-w-[58ch] text-[16.5px] leading-relaxed text-muted">
        {t.leadA}
        <strong className="text-ink">{t.leadStrong}</strong>
        {t.leadB}
      </p>

      <h2 className="display mt-14 mb-6 text-[clamp(20px,3vw,28px)]">{t.formatsTitle}</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {t.formats.map((f) => (
          <div
            key={f.name}
            className={`flex flex-col border bg-card p-6 ${f.featured ? "border-2 border-accent" : "border-hairline-strong"}`}
          >
            {f.featured && <p className="eyebrow mb-3 text-accent">{t.featuredLabel}</p>}
            <h3 className="text-[18px] font-bold">{f.name}</h3>
            <p className="eyebrow mt-1 text-faint">{f.time}</p>
            <p className="mt-4 grow text-[14px] leading-relaxed text-muted">{f.desc}</p>
            <p className="eyebrow mt-5 text-faint">{t.priceNote}</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[14px] text-muted">{t.quoteNote}</p>

      <h2 className="display mt-14 mb-6 text-[clamp(20px,3vw,28px)]">{t.modulesTitle}</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {t.modules.map((m) => (
          <li key={m} className="flex gap-3 border border-hairline bg-card p-4 text-[14.5px] font-semibold">
            <span className="text-faint" aria-hidden="true">→</span>
            {m}
          </li>
        ))}
      </ul>

      <div className="mt-14 border border-hairline-strong bg-surface p-7">
        <p className="eyebrow mb-2 text-faint">{t.caseEyebrow}</p>
        <h2 className="display mb-3 text-[clamp(18px,2.5vw,24px)]">{t.caseTitle}</h2>
        <p className="max-w-[62ch] text-[15px] leading-relaxed text-muted">
          {t.caseA}
          <a href="https://skorezdravotnictvi.cz" target="_blank" rel="noopener noreferrer" className="draw-link font-bold text-ink">
            skorezdravotnictvi.cz
          </a>
          {t.caseB}
        </p>
      </div>

      <div className="mt-16 border-t-2 border-hairline-strong pt-10">
        <h2 className="display mb-2 text-[clamp(20px,3vw,28px)]">{t.inquiryTitle}</h2>
        <p className="mb-8 max-w-[52ch] text-[15px] text-muted">{t.inquiryDesc}</p>
        <div className="max-w-2xl">
          <LeadForm locale={locale} />
        </div>
      </div>
    </div>
  );
}
