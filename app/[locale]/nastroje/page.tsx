import type { Metadata } from "next";
import Link from "next/link";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";

const CS_URL = "https://produktivni.cz/nastroje";
const EN_URL = "https://productive.tips/nastroje";

const T = {
  cs: {
    title: "Nástroje",
    metaTitle: "Interaktivní nástroje pro produktivitu",
    description:
      "Kvíz na výběr systému produktivity, diagnostika AI zralosti, Pomodoro časovač, kalkulačka hodinové sazby, skládačka promptů a audit času. Zdarma, v prohlížeči, bez registrace.",
    eyebrow: "Rozcestník",
    heading: "Nástroje",
    lead: "Šest věcí, které si tady rovnou vyzkoušíte. Nic se nikam neposílá — všechno běží ve vašem prohlížeči a po zavření záložky zmizí.",
    open: "Otevřít nástroj",
    soon: "Chystá se",
    minute: "min",
    tools: [
      {
        href: "/nastroje/kviz",
        title: "Jaký systém produktivity vám sedne",
        blurb:
          "Deset otázek o vašem dni a vstupech. Na konci jeden systém, důvod, proč zrovna ten, a tři konkrétní kroky na zítřek.",
        meta: "2 min · kvíz",
      },
      {
        href: "/nastroje/diagnostika",
        title: "Na které úrovni AI jste",
        blurb:
          "Dvanáct otázek o tom, jak doopravdy používáte AI. Výsledek: úroveň 1–5 podle žebříku chat → agent a osobní plán — tři návody a jedna cesta.",
        meta: "3 min · diagnostika",
      },
      {
        href: "/nastroje/pomodoro",
        title: "Pomodoro časovač",
        blurb:
          "25/5/15 s nastavitelnou délkou, počítadlem bloků, zvukovým signálem a odpočtem v titulku záložky.",
        meta: "Časovač",
      },
      {
        href: "/nastroje/sazba",
        title: "Kalkulačka hodinové sazby",
        blurb:
          "Kolik si musíte účtovat, aby vám na konci roku zbylo to, co jste si mysleli. Pro freelancery a lidi na volné noze.",
        meta: "Kalkulačka",
      },
      {
        href: "/nastroje/promptovac",
        title: "Skládačka promptů",
        blurb:
          "Poskládá vám prompt z rolí, kontextu, formátu a omezení — místo hádání, co do chatu napsat.",
        meta: "Generátor",
      },
      {
        href: "/nastroje/audit-casu",
        title: "Co mě stojí čas",
        blurb:
          "Zadáte hodiny týdně u osmi opakovaných činností a uvidíte roční ztrátu, rozpad podle položek a návod ke každé z nich.",
        meta: "Kalkulačka",
      },
    ],
  },
  en: {
    title: "Tools",
    metaTitle: "Interactive productivity tools",
    description:
      "A quiz that picks your productivity system, an AI maturity diagnostic, a Pomodoro timer, an hourly rate calculator, a prompt builder and a time audit. Free, in the browser, no sign-up.",
    eyebrow: "Where to start",
    heading: "Tools",
    lead: "Six things you can try right here. Nothing gets sent anywhere — it all runs in your browser and disappears when you close the tab.",
    open: "Open the tool",
    soon: "Coming up",
    minute: "min",
    tools: [
      {
        href: "/nastroje/kviz",
        title: "Which productivity system fits you",
        blurb:
          "Ten questions about your day and your inputs. At the end: one system, the reason it is that one, and three concrete steps for tomorrow.",
        meta: "2 min · quiz",
      },
      {
        href: "/nastroje/diagnostika",
        title: "Which AI level you are on",
        blurb:
          "Twelve questions about how you really use AI. The result: your level 1–5 on the chat → agent ladder and a personal plan — three guides and one path.",
        meta: "3 min · diagnostic",
      },
      {
        href: "/nastroje/pomodoro",
        title: "Pomodoro timer",
        blurb:
          "25/5/15 with adjustable lengths, a block counter, a sound alert and the countdown right in the tab title.",
        meta: "Timer",
      },
      {
        href: "/nastroje/sazba",
        title: "Hourly rate calculator",
        blurb:
          "How much you have to charge so that what is left at the end of the year is what you thought it would be. For freelancers.",
        meta: "Calculator",
      },
      {
        href: "/nastroje/promptovac",
        title: "Prompt builder",
        blurb:
          "Assembles a prompt out of role, context, format and constraints — instead of guessing what to type into the chat.",
        meta: "Generator",
      },
      {
        href: "/nastroje/audit-casu",
        title: "What your time costs you",
        blurb:
          "Enter your hours a week across eight repeated activities and see the annual loss, the breakdown by item and a guide for each one.",
        meta: "Calculator",
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

export default async function ToolsPage({
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
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.heading, path: "/nastroje" }])} />
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="prose-a mt-4 text-[16.5px]">{t.lead}</p>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {t.tools.map((tool, i) => (
          <Link key={tool.href} href={p(tool.href)} className="linkblock">
            <article className="tipcard h-full">
              <div className="flex items-baseline justify-between gap-3">
                <span className="tipcard-no">{String(i + 1).padStart(2, "0")}</span>
                <span className="font-mono text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
                  {tool.meta}
                </span>
              </div>
              <h2 className="draw-link mt-4 self-start text-[19px] leading-[1.25] font-bold tracking-[-0.01em]">
                {tool.title}
              </h2>
              <p className="mt-3 grow font-serif text-[14.5px] leading-[1.6] text-muted">
                {tool.blurb}
              </p>
              <span className="mt-5 font-mono text-[11.5px] font-semibold tracking-[0.1em] uppercase">
                {t.open} →
              </span>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
