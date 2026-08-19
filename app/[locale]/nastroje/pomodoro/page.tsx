import type { Metadata } from "next";
import Link from "next/link";
import { PomodoroTimer } from "@/components/PomodoroTimer";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { ogImage } from "@/lib/og";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

const CS_URL = "https://www.produktivni.cz/nastroje/pomodoro";
const EN_URL = "https://www.productive.tips/nastroje/pomodoro";

const T = {
  cs: {
    metaTitle: "Pomodoro časovač online",
    description:
      "Pomodoro časovač 25/5/15 s nastavitelnou délkou, počítadlem bloků, zvukovým signálem a odpočtem v titulku záložky. Bez registrace, běží v prohlížeči.",
    eyebrow: "Nástroj · časovač",
    heading: "Pomodoro časovač",
    lead: "Klasické Pomodoro: pětadvacet minut práce, pět minut pauza, po čtyřech blocích delší volno. Délky si můžete přenastavit, zvuk vypnout a časovač nechat běžet na pozadí — zbývající čas uvidíte v titulku záložky.",
    backToTools: "← Všechny nástroje",
  },
  en: {
    metaTitle: "Online Pomodoro timer",
    description:
      "A 25/5/15 Pomodoro timer with adjustable lengths, a block counter, a sound alert and the countdown in the tab title. No sign-up, runs in your browser.",
    eyebrow: "Tool · timer",
    heading: "Pomodoro timer",
    lead: "Classic Pomodoro: twenty-five minutes of focus, five minutes of break, a longer rest after four blocks. Change the lengths, turn the sound off, and leave the timer running in the background — the remaining time shows in the tab title.",
    backToTools: "← All tools",
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
      images: [ogImage(t.metaTitle, locale)],
    },
  };
}

export default async function PomodoroPage({
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
          { name: t.heading, path: "/nastroje/pomodoro" },
        ])}
      />
      <Link href={p("/nastroje")} className="draw-link text-[13px] font-bold">
        {t.backToTools}
      </Link>
      <p className="eyebrow mt-6 mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(28px,4.8vw,44px)]">{t.heading}</h1>
      <p className="prose-a mt-4 text-[16.5px]">{t.lead}</p>

      <div className="mt-10">
        <PomodoroTimer locale={locale} />
      </div>
    </div>
  );
}
