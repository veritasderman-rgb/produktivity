import { getTip, type Tip } from "@/lib/tips";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Tematické police na homepage.
 *
 * Kurátorský výběr, ne automatický filtr: každá police má explicitní seznam slugů
 * v pořadí priority. Vykreslí se první čtyři, které v daném jazyce opravdu existují
 * (anglická mutace má o pár návodů míň) — zbytek seznamu slouží jako záloha.
 * Slug, který neexistuje ani v jednom jazyce, se během buildu ohlásí přes console.warn,
 * aby se na homepage nikdy neobjevil mrtvý odkaz.
 */
export type Shelf = {
  id: string;
  /** Krátký kicker nad názvem police. */
  eyebrow: Record<Locale, string>;
  title: Record<Locale, string>;
  /** Jedna věta, co na polici je. */
  lead: Record<Locale, string>;
  /** Popisek odkazu „všechno k tématu“. */
  linkLabel: Record<Locale, string>;
  /** Cíl odkazu — cesta bez prefixu jazyka (prefix doplní localePath). */
  href: Record<Locale, string>;
  /** Slugy návodů v pořadí priority. */
  slugs: string[];
};

/** Kolik návodů police maximálně ukáže. */
export const MAX_SHELF_TIPS = 4;

export const shelves: Shelf[] = [
  {
    id: "data",
    eyebrow: { cs: "Data", en: "Data" },
    title: { cs: "Data a analýza", en: "Data and analysis" },
    lead: {
      cs: "Od bankovního výpisu po report pro vedení — jak z čísel dostat odpověď, které se dá věřit.",
      en: "From a bank statement to a report for the board — how to get an answer out of numbers you can actually trust.",
    },
    linkLabel: { cs: "Všechno k datům", en: "Everything about data" },
    href: { cs: "/hledat?q=data", en: "/hledat?q=data" },
    slugs: [
      "analyza-dat-duckdb-skill",
      "reprodukovatelna-analyza-dat",
      "ai-analyza-dat",
      "reporting-pro-vedeni-ai",
      "excel-kontingencni-tabulka",
      "deep-research-reserse-trhu",
    ],
  },
  {
    id: "firma",
    eyebrow: { cs: "Firma", en: "At work" },
    title: { cs: "AI ve firmě", en: "AI at the company" },
    lead: {
      cs: "Jak AI dostat do týmu tak, aby to nezůstalo u pilotu: konektory, automatizace a porady, které drží.",
      en: "How to get AI into a team so it does not stay a pilot forever: connectors, automation and meetings that hold.",
    },
    linkLabel: { cs: "Všechno pro manažery", en: "Everything for managers" },
    href: { cs: "/pro/manazery", en: "/for/managers" },
    slugs: [
      "ai-ve-firme-kompletni-pruvodce",
      "firma-brand-voice-brozura-web-crm",
      "vizitky-do-crm-claude-cowork",
      "mcp-konektory-nastroje",
      "mcp-reklama-analyza",
      "web-claude-code-vercel",
      "n8n-zapier-ai-automatizace",
      "porady-system-s-ai",
      "onboarding-novacka-ai-projekt",
    ],
  },
  {
    id: "skola",
    eyebrow: { cs: "Škola", en: "School" },
    title: { cs: "Škola a studium", en: "School and studying" },
    lead: {
      cs: "Bakalářka, doktorát, poznámky a opakování — s AI, která pomáhá přemýšlet, ne podvádět.",
      en: "Thesis, doctoral studies, notes and revision — with AI that helps you think instead of cheat.",
    },
    linkLabel: { cs: "Všechno pro studenty", en: "Everything for students" },
    href: { cs: "/pro/studenty", en: "/for/students" },
    slugs: [
      "bakalarka-s-ai-poctivy-workflow",
      "doktorand-s-ai-workflow",
      "poznamky-ktere-se-uci-ai",
      "anki-karticky-s-ai",
      "maturita-s-ai-rocni-plan",
    ],
  },
  {
    id: "doma",
    eyebrow: { cs: "Doma", en: "At home" },
    title: { cs: "Domácnost a peníze", en: "Household and money" },
    lead: {
      cs: "Rozpočet, jídelníček, cestování a papíry — provoz domácnosti odbytý rutinou místo víkendu.",
      en: "Budget, meal plans, travel and paperwork — running a household on a routine instead of a weekend.",
    },
    linkLabel: { cs: "Všechno pro rodiče", en: "Everything for parents" },
    href: { cs: "/pro/rodice", en: "/for/parents" },
    slugs: [
      "ai-v-rodine-vychova-hry-pohadky",
      "osobni-rozpocet-z-bankovniho-vypisu",
      "jidelnicek-a-nakupni-seznam-ai",
      "cestovni-itinerar-ai",
      "foto-do-akce-claude-mobil",
    ],
  },
  {
    id: "nastroje",
    eyebrow: { cs: "Nástroje", en: "Tools" },
    title: { cs: "Nástroje a zkratky", en: "Tools and shortcuts" },
    lead: {
      cs: "Spouštěče, schránka a zkratky, které ušetří pár vteřin. Za rok se sečtou do celých dní.",
      en: "Launchers, clipboards and shortcuts that save a few seconds each. Over a year they add up to whole days.",
    },
    linkLabel: { cs: "Všechny návody", en: "All the tips" },
    href: { cs: "/tipy", en: "/tipy" },
    slugs: [
      "raycast-spoustec",
      "powertoys-run",
      "win-v-schranka-s-historii",
      "mac-spotlight-spousteni",
      "ctrl-shift-t-obnoveni-panelu",
    ],
  },
];

export type ResolvedShelf = {
  id: string;
  eyebrow: string;
  title: string;
  lead: string;
  linkLabel: string;
  /** Hotový interní odkaz včetně prefixu jazyka. */
  href: string;
  tips: Tip[];
};

/** Aby build nehlásil tentýž chybějící slug pro každou stránku znovu. */
const warned = new Set<string>();

/**
 * Rozřeší slugy polic na skutečné tipy daného jazyka.
 * Neexistující slug police přeskočí a nahlásí ho do konzole buildu.
 */
export function getShelves(locale: Locale): ResolvedShelf[] {
  const resolved: ResolvedShelf[] = [];

  for (const shelf of shelves) {
    const tips: Tip[] = [];
    for (const slug of shelf.slugs) {
      if (tips.length >= MAX_SHELF_TIPS) break;
      const tip = getTip(slug, locale);
      if (!tip) {
        const key = `${locale}:${slug}`;
        if (!warned.has(key)) {
          warned.add(key);
          console.warn(
            `[shelves] Police „${shelf.id}“: návod „${slug}“ v jazyce ${locale} neexistuje — přeskakuji.`,
          );
        }
        continue;
      }
      tips.push(tip);
    }
    if (tips.length === 0) {
      console.warn(`[shelves] Police „${shelf.id}“ nemá v jazyce ${locale} jediný návod — nevykresluje se.`);
      continue;
    }
    resolved.push({
      id: shelf.id,
      eyebrow: shelf.eyebrow[locale],
      title: shelf.title[locale],
      lead: shelf.lead[locale],
      linkLabel: shelf.linkLabel[locale],
      href: localePath(locale, shelf.href[locale]),
      tips,
    });
  }

  return resolved;
}
