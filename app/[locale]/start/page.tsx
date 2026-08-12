import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    title: "Začněte tady: minimalistický průvodce produktivitou",
    description:
      "Jeden notes, tři značky, čtyři minuty denně. Nejjednodušší funkční systém produktivity — a checklisty pro první měsíc.",
    eyebrow: "Začněte tady",
    headingA: "Jeden notes.",
    headingB: "Tři značky. Čtyři minuty denně.",
    introA1: "Problém většiny lidí není, že by měli málo nástrojů — mají jich ",
    introAStrong: "příliš mnoho",
    introA2:
      ". Poznámky v telefonu, úkoly v aplikaci, termíny v kalendáři, nápady na lístečcích. A v té složitosti se ztrácí to nejdůležitější: schopnost zachytit a zpracovat, co den přináší.",
    introB1: "Tenhle průvodce je opak. Jeden notes (nebo jedna aplikace, kterou už v telefonu máte) a princip, který se naučíte za minutu: ",
    introB2: "cokoli přijde do hlavy, okamžitě zapište.",
    introB3: " Mozek není stavěný na skladování úkolů — je stavěný na jejich vytváření a řešení.",
    marksTitle: "Značky",
    marks: [
      { mark: "•", label: "úkol" },
      { mark: "×", label: "hotovo" },
      { mark: ">", label: "přesunuto" },
      { mark: "–", label: "poznámka" },
      { mark: "!", label: "důležité" },
      { mark: "?", label: "otázka" },
    ],
    rhythmTitle: "Denní rytmus",
    rhythm: [
      {
        strong: "Ráno (2 minuty):",
        rest: " nová stránka, datum, přepsat nedodělky ze včerejška, přidat dnešní úkoly.",
      },
      {
        strong: "Během dne:",
        rest: " zapisovat vše IHNED. Žádné lístečky, žádné „pak si to zapíšu“. I drobnosti, i nápady, které se zdají hloupé, i věci, které si „určitě zapamatujete“.",
      },
      {
        strong: "Večer (2 minuty):",
        rest: " označit hotové (×), přesunout nedokončené na zítřek (>), zkontrolovat, že nic nechybí.",
      },
    ],
    rhythmNoteA: "A když se systém zhroutí (stane se): zastavte se, vypište ",
    rhythmNoteEm: "všechno",
    rhythmNoteB:
      " z hlavy, označte tři nejdůležitější věci — a začněte znovu. Bez výčitek.",
    checklistTitle: "Checklisty pro první měsíc",
    checklists: [
      {
        title: "První týden: základ",
        items: [
          "Vypsat všechny současné úkoly a projekty na jedno místo",
          "Vybrat JEDEN nástroj (notes / Apple Notes / Google Keep / Notion)",
          "Vyčistit pracovní stůl a vypnout zbytečné notifikace",
          "Každé ráno 2 minuty: nová stránka, datum, úkoly dne",
          "Každý večer 2 minuty: označit hotové, přesunout zbytek",
        ],
      },
      {
        title: "Týdny 2–4: systém",
        items: [
          "Vytvořit inbox a základní kategorie projektů (GTD)",
          "Najít své produktivní hodiny a zablokovat 1 deep work blok denně",
          "Definovat kontexty (@doma, @práce, @počítač)",
          "Naplánovat týdenní revizi (30 minut, pevný čas)",
          "Připravit prostředí pro soustředění: rituál, playlist, čistý stůl",
        ],
      },
      {
        title: "Každý měsíc: údržba",
        items: [
          "Audit systému: co funguje, co drhne, co zjednodušit",
          "Revize projektů a dlouhodobých cílů, přehodnocení priorit",
          "Automatizovat jednu rutinní věc (filtry, šablony, zkratky)",
        ],
      },
    ],
    rulesStrong: "Tři pravidla na závěr:",
    rulesRest:
      " jednoduchý systém, který používáte, porazí dokonalý systém, který je složitý. Jeden notes všude porazí deset aplikací. Psát hned porazí pamatovat si na později.",
    nextA: "Až vám tenhle základ přiroste k ruce, pokračujte ",
    nextLink: "příručkou",
    nextB: " — kapitoly na sebe navazují přesně v tomhle pořadí.",
    ctaEyebrow: "Jeden tip týdně",
    ctaDesc:
      "Newsletter vás provede příručkou v rozumném tempu — a hned dostanete e-book Top 30 tipů.",
  },
  en: {
    title: "Start here: the minimalist guide to productivity",
    description:
      "One notebook, three marks, four minutes a day. The simplest productivity system that actually works — plus checklists for your first month.",
    eyebrow: "Start here",
    headingA: "One notebook.",
    headingB: "Three marks. Four minutes a day.",
    introA1: "Most people’s problem is not that they have too few tools — they have ",
    introAStrong: "far too many",
    introA2:
      ". Notes on the phone, tasks in an app, deadlines in a calendar, ideas on sticky notes. And in all that complexity the thing that matters most gets lost: the ability to capture and process whatever the day throws at you.",
    introB1: "This guide is the opposite. One notebook (or one app you already have on your phone) and a principle you can learn in a minute: ",
    introB2: "whatever enters your head, write it down immediately.",
    introB3: " Your brain was not built to store tasks — it was built to create and solve them.",
    marksTitle: "The marks",
    marks: [
      { mark: "•", label: "task" },
      { mark: "×", label: "done" },
      { mark: ">", label: "moved" },
      { mark: "–", label: "note" },
      { mark: "!", label: "important" },
      { mark: "?", label: "question" },
    ],
    rhythmTitle: "The daily rhythm",
    rhythm: [
      {
        strong: "Morning (2 minutes):",
        rest: " new page, date, carry over yesterday’s leftovers, add today’s tasks.",
      },
      {
        strong: "During the day:",
        rest: " write everything down IMMEDIATELY. No sticky notes, no “I will note that later”. Small things too, ideas that sound silly too, and the things you are “definitely going to remember”.",
      },
      {
        strong: "Evening (2 minutes):",
        rest: " mark what is done (×), move what is not to tomorrow (>), check that nothing is missing.",
      },
    ],
    rhythmNoteA: "And when the system collapses (it will): stop, dump ",
    rhythmNoteEm: "everything",
    rhythmNoteB:
      " out of your head, mark the three most important things — and start again. No guilt.",
    checklistTitle: "Checklists for the first month",
    checklists: [
      {
        title: "Week one: the basics",
        items: [
          "Write every current task and project into one place",
          "Pick ONE tool (a notebook / Apple Notes / Google Keep / Notion)",
          "Clear your desk and turn off the notifications you do not need",
          "Two minutes every morning: new page, date, today’s tasks",
          "Two minutes every evening: mark what is done, move the rest",
        ],
      },
      {
        title: "Weeks 2–4: the system",
        items: [
          "Set up an inbox and the basic project categories (GTD)",
          "Find your productive hours and block one deep work session a day",
          "Define your contexts (@home, @work, @computer)",
          "Schedule a weekly review (30 minutes, a fixed slot)",
          "Prepare your environment for focus: a ritual, a playlist, a clear desk",
        ],
      },
      {
        title: "Every month: maintenance",
        items: [
          "Audit the system: what works, what grinds, what to simplify",
          "Review projects and long-term goals, reassess priorities",
          "Automate one routine thing (filters, templates, shortcuts)",
        ],
      },
    ],
    rulesStrong: "Three closing rules:",
    rulesRest:
      " a simple system you use beats a perfect system that is complicated. One notebook everywhere beats ten apps. Writing it down now beats remembering it later.",
    nextA: "Once this foundation feels like second nature, carry on with the ",
    nextLink: "handbook",
    nextB: " — the chapters follow exactly this order.",
    ctaEyebrow: "One tip a week",
    ctaDesc:
      "The newsletter walks you through the handbook at a sane pace — and you get the Top 30 tips e-book right away.",
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
  const csUrl = "https://produktivni.cz/start";
  const enUrl = "https://productive.tips/start";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function StartPage({
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
      <h1 className="display text-[clamp(30px,5vw,48px)]">
        {t.headingA}
        <br />
        {t.headingB}
      </h1>
      <div className="prose-a mt-6">
        <p>
          {t.introA1}
          <strong>{t.introAStrong}</strong>
          {t.introA2}
        </p>
        <p>
          {t.introB1}
          <strong>{t.introB2}</strong>
          {t.introB3}
        </p>
      </div>

      <h2 className="display mt-12 mb-4 text-[clamp(20px,3vw,28px)]">{t.marksTitle}</h2>
      <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
        {t.marks.map((m) => (
          <div key={m.mark} className="border border-hairline-strong bg-card p-3 text-center">
            <span className="block font-mono text-[22px] font-bold text-ink">{m.mark}</span>
            <span className="eyebrow text-faint">{m.label}</span>
          </div>
        ))}
      </div>

      <h2 className="display mt-12 mb-4 text-[clamp(20px,3vw,28px)]">{t.rhythmTitle}</h2>
      <div className="prose-a">
        <ul>
          {t.rhythm.map((r) => (
            <li key={r.strong}>
              <strong>{r.strong}</strong>
              {r.rest}
            </li>
          ))}
        </ul>
        <p>
          {t.rhythmNoteA}
          <em>{t.rhythmNoteEm}</em>
          {t.rhythmNoteB}
        </p>
      </div>

      <h2 className="display mt-12 mb-4 text-[clamp(20px,3vw,28px)]">{t.checklistTitle}</h2>
      <div className="grid gap-4">
        {t.checklists.map((c) => (
          <section key={c.title} className="border border-hairline-strong bg-card p-5">
            <h3 className="mb-3 text-[16px] font-bold">{c.title}</h3>
            <ul className="space-y-2">
              {c.items.map((item) => (
                <li key={item} className="flex gap-3 text-[14.5px] text-muted">
                  <span className="mt-0.5 inline-block h-[16px] w-[16px] flex-none border-[1.5px] border-hairline-strong bg-paper" aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>

      <div className="prose-a mt-10">
        <p>
          <strong>{t.rulesStrong}</strong>
          {t.rulesRest}
        </p>
        <p>
          {t.nextA}
          <Link href={p("/prirucka")}>{t.nextLink}</Link>
          {t.nextB}
        </p>
      </div>

      <div className="mt-12 border-t-2 border-hairline-strong pt-8">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">{t.ctaDesc}</p>
        <div className="max-w-md">
          <NewsletterForm source="start" locale={locale} />
        </div>
      </div>
    </div>
  );
}
