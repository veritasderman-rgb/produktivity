import type { NextRequest } from "next/server";
import { getAllChapters } from "@/lib/chapters";
import { getAllTips } from "@/lib/tips";
import type { Locale } from "@/lib/i18n";

// llms-full.txt — plná verze /llms.txt pro AI crawlery: kompletní texty
// nejcennějšího obsahu (všechny kapitoly příručky + nejobsáhlejší návody)
// v markdownu, každý dokument s hlavičkou `# <title>` a kanonickou URL.
//
// Middleware se na cestách s tečkou nespouští, takže jazyk se pozná přímo
// tady z hlavičky Host — stejná logika jako v middleware.ts:
// produktivni.cz → čeština, productive.tips → angličtina.

const EN_DOMAIN = process.env.EN_DOMAIN ?? "productive.tips";

/** Kolik nejdelších návodů (podle délky těla) se do plné verze vejde. */
const FULL_TIPS = 25;

const BASES: Record<Locale, string> = {
  cs: "https://www.produktivni.cz",
  en: "https://www.productive.tips",
};

const FENCE_RE = /```[\s\S]*?```/g;

/**
 * Z MDX těla udělá čistý markdown: vynechá JSX infografiky (`<Stats … />`,
 * `<Flow … />` apod. — všechny jsou self-closing, viz components/infographics),
 * kódové bloky zachová beze změny.
 */
function stripMdx(body: string): string {
  // Kódové bloky schovat stranou, aby je úklid JSX nemohl poškodit.
  // Zástupný token ohraničuje NUL — v textovém obsahu se vyskytnout nemůže,
  // takže nehrozí kolize s obyčejným „ 5 “ v próze.
  const fences: string[] = [];
  const shielded = body.replace(FENCE_RE, (m) => {
    fences.push(m);
    return `\u0000${fences.length - 1}\u0000`;
  });

  const cleaned = shielded
    // Self-closing komponenta: od řádku začínajícího `<Velké` po první `/>` na konci řádku.
    .replace(/^[ \t]*<[A-Z][\w.]*[\s\S]*?\/>[ \t]*$/gm, "")
    // Po vyjmutí komponent nezůstávají díry z prázdných řádků.
    .replace(/\n{3,}/g, "\n\n");

  return cleaned.replace(/\u0000(\d+)\u0000/g, (_, i) => fences[Number(i)]).trim();
}

function docBlock(title: string, url: string, body: string): string[] {
  return ["---", "", `# ${title}`, "", `URL: ${url}`, "", stripMdx(body), ""];
}

function buildText(locale: Locale): string {
  const base = BASES[locale];
  const chapters = getAllChapters(locale);
  // Nejcennější návody = ty nejdelší; řadí se podle délky těla, ne podle data.
  const tips = [...getAllTips(locale)]
    .sort((a, b) => b.body.length - a.body.length)
    .slice(0, FULL_TIPS);
  const tipCount = getAllTips(locale).length;

  const intro =
    locale === "en"
      ? [
          "# Productive.tips",
          "",
          "> Productivity handbook by Josef Pavlovic: proven systems (GTD, Inbox Zero, time-blocking, Pomodoro, SCRUM/Kanban/OKR), " +
            `${tipCount} practical tips with step-by-step guides and AI news translated into practice. English edition of the Czech original: https://www.produktivni.cz`,
          "",
          `This is llms-full.txt — the full-text edition: complete texts of all ${chapters.length} handbook chapters and the ${FULL_TIPS} longest guides. The short overview with links to everything: ${base}/llms.txt`,
          "",
        ]
      : [
          "# Produktivní.cz",
          "",
          "> Česká příručka produktivity od Josefa Pavlovice: ověřené systémy (GTD, Inbox Zero, time-blocking, Pomodoro, SCRUM/Kanban/OKR), " +
            `${tipCount} praktických tipů s návody a AI novinky přeložené do praxe. Obsah je psaný česky, průběžně aktualizovaný člověkem i AI. Anglická verze: https://www.productive.tips`,
          "",
          `Toto je llms-full.txt — plná verze: kompletní texty všech ${chapters.length} kapitol příručky a ${FULL_TIPS} nejobsáhlejších návodů. Stručný přehled s odkazy na všechen obsah: ${base}/llms.txt`,
          "",
        ];

  const lines: string[] = [
    ...intro,
    locale === "en" ? "## Handbook — full chapter texts" : "## Příručka — plné texty kapitol",
    "",
    ...chapters.flatMap((c) => docBlock(c.title, `${base}/prirucka/${c.slug}`, c.body)),
    locale === "en" ? "## Longest guides — full texts" : "## Nejobsáhlejší návody — plné texty",
    "",
    ...tips.flatMap((t) => docBlock(t.title, `${base}/tipy/${t.slug}`, t.body)),
  ];

  return lines.join("\n");
}

/** Text se skládá ze ~70 souborů; jednou za hodinu stačí. Route je kvůli čtení Hostu dynamická. */
const cache = new Map<Locale, { text: string; at: number }>();
const CACHE_MS = 60 * 60 * 1000;

export function GET(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const locale: Locale = host === EN_DOMAIN || host === `www.${EN_DOMAIN}` ? "en" : "cs";

  const cached = cache.get(locale);
  const text = cached && Date.now() - cached.at < CACHE_MS ? cached.text : buildText(locale);
  if (!cached || cached.text !== text) cache.set(locale, { text, at: Date.now() });

  return new Response(text, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
