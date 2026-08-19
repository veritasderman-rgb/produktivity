import type { Metadata } from "next";
import Link from "next/link";
import { BookArt, QuizArt } from "@/components/HandbookArt";
import { getAllChapters, getSectionLabels, type Chapter } from "@/lib/chapters";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";

const sectionOrder: Chapter["section"][] = ["zaklady", "metody", "nastroje", "situace", "skola", "firma", "freelancing", "uceni", "doma"];

const T = {
  cs: {
    title: "Příručka produktivity",
    description:
      "Kompletní know-how produktivity v přehledných kapitolách: základy, metody (GTD, Pomodoro, Kanban, OKR), nástroje a konkrétní situace.",
    eyebrow: "Evergreen know-how",
    heading: "Příručka produktivity",
    lead: "Léta praxe srovnaná do kapitol, které na sebe navazují — ale fungují i na přeskáčku. Začněte základy, nebo skočte rovnou na to, co vás pálí.",
    startLink: "Jste tu poprvé? Začněte minimalistickým průvodcem →",
    minutes: "min",
    sectionDesc: {
      skola: "Seriál pro učitele: proč učitelství vyčerpává jinak, příprava výuky jako systém, hodnocení bez vyhoření, pozornost ve třídě a škola jako organizace.",
      firma: "Seriál o produktivitě organizace: tým není součet jednotlivců, asynchronní komunikace, znalosti, procesy, vedení lidí a zavádění změny.",
      freelancing: "Seriál pro práci na sebe: kalkulace času, získávání zakázek, klientský provoz a finanční klid.",
      uceni: "Seriál o učení: věda o zapamatování, poznámky, zkoušky a učení vedle práce.",
      doma: "Seriál pro domácnost a rodinu: provoz domácnosti, čas rodičů a digitální hygiena.",
      zaklady:
        "Co produktivita skutečně je (a co ne), jak funguje vaše hlava a tělo — motivace, prokrastinace, flow, spánek, energie.",
      metody:
        "Osvědčené systémy od zachycení úkolů po řízení celých projektů — a hlavně jak vybrat ten, který vydržíte používat.",
      nastroje:
        "Druhý mozek, výběr aplikací podle kategorií, pokročilé triky — a digitální minimalismus, aby vás nástroje nezavalily.",
      situace: "Produktivita v konkrétním kontextu: doma, v týmu, v e-mailu i ve škole.",
    } as Record<Chapter["section"], string>,
    quizEyebrow: "Nevíte, kde začít?",
    quizTitle: "Zjistěte za dvě minuty, který systém vám sedne",
    quizDesc: "Deset otázek na to, jak vypadá váš den. Výsledek vás pošle rovnou na kapitolu, která má pro vás největší smysl.",
    quizCta: "Spustit kvíz →",
    trainingPre: "Nechcete číst? To podstatné z příručky učím osobně —",
    trainingLink: "školení pro firmy",
    empty:
      "Kapitoly se právě chystají. Než přibudou, mrkněte na tipy — těch je tu už celá řada.",
  },
  en: {
    title: "Productivity handbook",
    description:
      "The complete productivity know-how in clear chapters: foundations, methods (GTD, Pomodoro, Kanban, OKR), tools and specific situations.",
    eyebrow: "Evergreen know-how",
    heading: "Productivity handbook",
    lead: "Years of practice sorted into chapters that build on each other — and still work if you skip around. Start with the foundations, or jump straight to whatever is hurting right now.",
    startLink: "First time here? Start with the minimalist guide →",
    minutes: "min",
    sectionDesc: {
      skola: "A series for teachers: why teaching drains differently, lesson prep as a system, grading without burnout, attention in the classroom and school as an organisation.",
      firma: "A series on organisational productivity: a team is not the sum of individuals, async communication, knowledge, processes, leading people and driving change.",
      freelancing: "A series for working for yourself: pricing your time, winning work, client operations and financial calm.",
      uceni: "A series on learning: the science of remembering, notes, exams and learning alongside a job.",
      doma: "A series for home and family: running a household, parents and time, and digital hygiene.",

      zaklady:
        "What productivity actually is (and what it is not), and how your head and body really work — motivation, procrastination, flow, sleep, energy.",
      metody:
        "Proven systems, from capturing a single task to running whole projects — and, above all, how to pick the one you will actually stick with.",
      nastroje:
        "A second brain, choosing apps by category, advanced tricks — plus the digital minimalism that keeps the tools from burying you.",
      situace: "Productivity in context: at home, on a team, in your inbox and at school.",
    } as Record<Chapter["section"], string>,
    quizEyebrow: "Not sure where to start?",
    quizTitle: "Find out in two minutes which system fits you",
    quizDesc: "Ten questions about what your day looks like. The result sends you straight to the chapter that will do you the most good.",
    quizCta: "Take the quiz →",
    trainingPre: "Would rather not read? I teach the essentials in person —",
    trainingLink: "corporate training",
    empty:
      "The chapters are being translated. In the meantime, take a look at the tips — there are plenty already.",
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
  const csUrl = "https://www.produktivni.cz/prirucka";
  const enUrl = "https://www.productive.tips/prirucka";
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

export default async function HandbookPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const chapters = getAllChapters(locale);
  const sectionLabels = getSectionLabels(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="flex items-start justify-between gap-10">
        <div>
          <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
          <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
          <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">{t.lead}</p>
          <p className="mt-4 text-[15px]">
            <Link href={p("/start")} className="draw-link font-bold">
              {t.startLink}
            </Link>
          </p>
        </div>
        <BookArt className="mt-2 shrink-0 max-md:hidden" />
      </div>
      <Link
        href={p("/nastroje/kviz")}
        className="mt-8 flex items-center justify-between gap-8 border border-hairline-strong bg-surface p-6 no-underline transition-colors hover:border-accent"
      >
        <div>
          <p className="eyebrow mb-2 text-accent">{t.quizEyebrow}</p>
          <p className="display text-[clamp(19px,2.6vw,24px)]">{t.quizTitle}</p>
          <p className="mt-2 max-w-[56ch] text-[15px] leading-relaxed text-muted">{t.quizDesc}</p>
          <p className="mt-4 text-[14px] font-bold">{t.quizCta}</p>
        </div>
        <QuizArt className="shrink-0 max-sm:hidden" />
      </Link>
      {chapters.length > 0 ? (
        <div className="mt-10 grid gap-5 md:grid-cols-2">
          {sectionOrder.map((sec, si) => {
            const items = chapters.filter((c) => c.section === sec);
            return (
              <section key={sec} className="border border-hairline-strong bg-card p-6">
                <div className="mb-3 flex items-baseline justify-between">
                  <h2 className="display text-[22px]">{sectionLabels[sec]}</h2>
                  <span className="tabular text-[28px] font-extrabold text-hairline">
                    {String(si + 1).padStart(2, "0")}
                  </span>
                </div>
                <p className="text-[14px] leading-relaxed text-muted">{t.sectionDesc[sec]}</p>
                <ul className="mt-4 space-y-2 border-t border-hairline pt-4 text-[14px] font-semibold">
                  {items.map((ch) => (
                    <li key={ch.slug} className="flex gap-2">
                      <span className="text-faint" aria-hidden="true">→</span>
                      <Link href={p(`/prirucka/${ch.slug}`)} className="hover:text-accent">
                        {ch.title}
                        <span className="eyebrow ml-2 text-faint">
                          {ch.minutes} {t.minutes}
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            );
          })}
        </div>
      ) : (
        <div className="mt-10 max-w-xl border border-hairline-strong bg-card p-6">
          <p className="text-[14.5px] text-muted">{t.empty}</p>
        </div>
      )}
      <p className="mt-10 max-w-[58ch] text-[15px] text-muted">
        {t.trainingPre}{" "}
        <Link href={p("/skoleni")} className="draw-link font-bold text-ink">
          {t.trainingLink}
        </Link>
        .
      </p>
    </div>
  );
}
