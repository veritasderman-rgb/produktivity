import type { Metadata } from "next";
import { Suspense } from "react";
import { getAllTips } from "@/lib/tips";
import { TipBrowser } from "@/components/TipBrowser";
import { isLocale, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    title: "Tipy & triky",
    heading: "Tipy & triky",
    description:
      "Krátké, okamžitě použitelné tipy: klávesové zkratky, aplikace, workflow a AI triky. Filtrujte podle platformy, kategorie i toho, kdo jste.",
    eyebrow: (n: number) => `${n} tipů · průběžně přibývají`,
    lead: "Každý tip = jedna konkrétní věc, kterou uděláte líp nebo rychleji. Filtrujte podle toho, co používáte a kdo jste — nebo prostě hledejte.",
  },
  en: {
    title: "Tips & tricks",
    heading: "Tips & tricks",
    description:
      "Short, immediately useful tips: keyboard shortcuts, apps, workflows and AI tricks. Filter by platform, category and who you are.",
    eyebrow: (n: number) => `${n} tips · new ones added continuously`,
    lead: "Every tip is one concrete thing you will do better or faster. Filter by what you use and who you are — or just search.",
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
  const csUrl = "https://produktivni.cz/tipy";
  const enUrl = "https://productive.tips/tipy";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function TipsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const tips = getAllTips(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow(tips.length)}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 mb-8 max-w-[56ch] text-[16px] leading-relaxed text-muted">{t.lead}</p>
      <Suspense>
        <TipBrowser tips={tips} locale={locale} />
      </Suspense>
    </div>
  );
}
