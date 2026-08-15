import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { SystemQuiz } from "@/components/SystemQuiz";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

const CS_URL = "https://www.produktivni.cz/nastroje/kviz";
const EN_URL = "https://www.productive.tips/nastroje/kviz";

const T = {
  cs: {
    metaTitle: "Kvíz: jaký systém produktivity vám sedne",
    description:
      "Deset otázek o vašem dni, vstupech a tom, co vás nejvíc bolí. Výsledek: GTD, Inbox Zero, time-blocking, Kanban nebo systém tří úkolů — a co s ním udělat zítra ráno.",
    eyebrow: "Nástroj · kvíz",
    heading: "Jaký systém produktivity vám sedne",
    lead: "Neexistuje jeden nejlepší systém — existuje ten, který vydrží ve vašem konkrétním dni. Deset otázek, dvě minuty, žádné registrace. Odpovědi zůstávají ve vašem prohlížeči.",
    backToTools: "← Všechny nástroje",
    loading: "Načítám kvíz…",
    disclaimer:
      "Kvíz je vodítko, ne diagnóza. Když vám výsledek nesedí, přečtěte si kapitolu o druhém systému — často je ta správná odpověď někde mezi.",
  },
  en: {
    metaTitle: "Quiz: which productivity system fits you",
    description:
      "Ten questions about your day, your inputs and what hurts the most. The result: GTD, Inbox Zero, time-blocking, Kanban or the three-task system — and what to do with it tomorrow morning.",
    eyebrow: "Tool · quiz",
    heading: "Which productivity system fits you",
    lead: "There is no single best system — only the one that survives your particular day. Ten questions, two minutes, no sign-up. Your answers stay in your browser.",
    backToTools: "← All tools",
    loading: "Loading the quiz…",
    disclaimer:
      "The quiz is a pointer, not a diagnosis. If the result does not feel right, read the chapter for the runner-up — the correct answer is often somewhere in between.",
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
  return {
    title: t.metaTitle,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? EN_URL : CS_URL,
      languages: { cs: CS_URL, en: EN_URL, "x-default": CS_URL },
    },
    openGraph: {
      title: t.metaTitle,
      description: t.description,
      images: [`/api/og?title=${encodeURIComponent(t.metaTitle)}`],
    },
  };
}

export default async function QuizPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  return (
    <div className="mx-auto max-w-[760px] px-[var(--page-pad)] py-14">
      <JsonLd
        data={breadcrumbJsonLd(locale, [
          { name: locale === "en" ? "Tools" : "Nástroje", path: "/nastroje" },
          { name: t.heading, path: "/nastroje/kviz" },
        ])}
      />
      <Link href={p("/nastroje")} className="draw-link text-[13px] font-bold">
        {t.backToTools}
      </Link>
      <p className="eyebrow mt-6 mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(28px,4.8vw,44px)]">{t.heading}</h1>
      <p className="prose-a mt-4 text-[16.5px]">{t.lead}</p>

      <div className="mt-12 border-t-2 border-hairline-strong pt-10">
        <Suspense
          fallback={<p className="font-mono text-[13px] text-faint">{t.loading}</p>}
        >
          <SystemQuiz locale={locale} />
        </Suspense>
      </div>

      <p className="mt-14 border-t border-hairline pt-6 text-[13px] leading-relaxed text-faint">
        {t.disclaimer}
      </p>
    </div>
  );
}
