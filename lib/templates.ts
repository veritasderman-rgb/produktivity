import fs from "node:fs";
import path from "node:path";
import type { Locale } from "./i18n";

/**
 * Šablony ke stažení pro /sablony.
 *
 * Soubory samotné vyrábí `scripts/build-templates.py` do `public/sablony/`;
 * tenhle modul je jen popisuje. Velikosti se čtou z disku za běhu buildu —
 * po přegenerování šablon se čísla na stránce spraví samy.
 *
 * Anglická mutace má vlastní soubory (`…-en.xlsx` / `…-en.csv`) s anglickými
 * názvy listů a sloupců, odkazuje se na ně jen z anglické verze stránky.
 */

export type TemplateFormat = "xlsx" | "csv";

type L = { cs: string; en: string };
type LS = { cs: string[]; en: string[] };

type TemplateDef = {
  slug: string;
  format: TemplateFormat;
  file: L;
  title: L;
  /** K čemu šablona je. */
  blurb: L;
  /** Text odkazu ke stažení — bez formátu a velikosti, ty se doplní. */
  download: L;
  /** Co je uvnitř: listy sešitu, u CSV sloupce. */
  contains: LS;
  /** Návod na webu, ze kterého šablona vychází. */
  source: { path: string; title: L };
  /** CSV připravené k importu do Notionu. */
  notion?: boolean;
};

const DEFS: TemplateDef[] = [
  {
    slug: "osobni-rozpocet",
    format: "xlsx",
    file: { cs: "osobni-rozpocet.xlsx", en: "osobni-rozpocet-en.xlsx" },
    title: { cs: "Osobní rozpočet", en: "Personal budget" },
    blurb: {
      cs: "Vložíte anonymizovaný výpis z banky, přiřadíte kategorie z rozevíracího seznamu — a měsíční přehled i cash flow se dopočítají samy přes SUMIFS. Ukázková data za tři měsíce jsou uvnitř, klidně je přepište.",
      en: "Paste in an anonymised bank export, pick categories from the drop-down — and the monthly overview and cash flow calculate themselves through SUMIFS. Three months of sample data are inside; overwrite them.",
    },
    download: { cs: "Stáhnout rozpočet", en: "Download the budget" },
    contains: {
      cs: ["Transakce", "Kategorie", "Přehled po měsících", "Cash flow"],
      en: ["Transactions", "Categories", "Monthly overview", "Cash flow"],
    },
    source: {
      path: "/tipy/osobni-rozpocet-z-bankovniho-vypisu",
      title: {
        cs: "Osobní rozpočet za večer: výpis z banky + AI",
        en: "A personal budget in one evening: bank statement + AI",
      },
    },
  },
  {
    slug: "jidelnicek",
    format: "xlsx",
    file: { cs: "jidelnicek-nakupni-seznam.xlsx", en: "jidelnicek-nakupni-seznam-en.xlsx" },
    title: { cs: "Jídelníček a nákupní seznam", en: "Weekly menu and shopping list" },
    blurb: {
      cs: "Týden jídel po dnech, k nim suroviny — a nákupní seznam, který se z nich složí sám: stejné položky se sečtou, duplicity se označí a co máte doma vypadne.",
      en: "A week of meals day by day, the ingredients behind them — and a shopping list that assembles itself: identical items are added up, repeats are flagged and whatever you already have drops out.",
    },
    download: { cs: "Stáhnout jídelníček", en: "Download the menu planner" },
    contains: {
      cs: ["Týden", "Suroviny", "Nákupní seznam"],
      en: ["Week", "Ingredients", "Shopping list"],
    },
    source: {
      path: "/tipy/jidelnicek-a-nakupni-seznam-ai",
      title: {
        cs: "Týdenní jídelníček s AI: od nedělní rutiny po naklikaný košík",
        en: "A weekly menu with AI: from your Sunday routine to a filled cart",
      },
    },
  },
  {
    slug: "hodinova-sazba",
    format: "xlsx",
    file: { cs: "kalkulace-hodinove-sazby.xlsx", en: "kalkulace-hodinove-sazby-en.xlsx" },
    title: { cs: "Kalkulace hodinové sazby", en: "Hourly rate calculation" },
    blurb: {
      cs: "Osm vstupů nahoře, výpočet a výsledek dole, u každého řádku komentář, proč tam je. Stejná metodika jako kalkulačka na webu — jen si ji můžete uložit a poslat účetní.",
      en: "Eight inputs at the top, the calculation and the result below, every row with a comment explaining why it is there. The same method as the calculator on the site — only this one you can save and send to your accountant.",
    },
    download: { cs: "Stáhnout kalkulaci sazby", en: "Download the rate calculation" },
    contains: {
      cs: ["Vstupy", "Výpočet", "Výsledek včetně modelové zakázky"],
      en: ["Inputs", "Calculation", "Result including a model project"],
    },
    source: {
      path: "/prirucka/cas-jako-zbozi",
      title: {
        cs: "Čas jako zboží: kapacita, sazba a sezónnost",
        en: "Time as a product: capacity, rate and seasonality",
      },
    },
  },
  {
    slug: "vizitky-crm",
    format: "csv",
    file: { cs: "vizitky-do-crm.csv", en: "vizitky-do-crm-en.csv" },
    title: { cs: "Vizitky do CRM", en: "Business cards into a CRM" },
    blurb: {
      cs: "Hlavička sloupců, na kterou se dá namapovat vytažený obsah vizitek, plus jeden ukázkový řádek s vymyšlenou firmou, ať je vidět formát — včetně toho, jak do poznámky zapsat zdroj kontaktu.",
      en: "The column header you can map extracted business-card data onto, plus one sample row with a made-up company so the format is visible — including how to write the lead source into the note.",
    },
    download: { cs: "Stáhnout hlavičku pro CRM", en: "Download the CRM header" },
    contains: {
      cs: ["17 sloupců od jména po vlastníka kontaktu", "1 ukázkový řádek", "UTF-8, oddělovač čárka"],
      en: ["17 columns from first name to record owner", "1 sample row", "UTF-8, comma-separated"],
    },
    source: {
      path: "/tipy/vizitky-do-crm-claude-cowork",
      title: {
        cs: "Z krabice vizitek tabulka pro CRM za jeden večer",
        en: "From a box of business cards to a CRM table in one evening",
      },
    },
  },
  {
    slug: "rodinny-kalendar",
    format: "csv",
    notion: true,
    file: { cs: "rodinny-kalendar.csv", en: "rodinny-kalendar-en.csv" },
    title: { cs: "Rodinný kalendář a provoz domácnosti", en: "Family calendar and household operations" },
    blurb: {
      cs: "Kroužky, škola, zdraví i domácí agendy v jedné databázi — každý řádek má rytmus, odpovědnou osobu a co si vzít s sebou. Bez jmen dětí, přesně jak návod doporučuje.",
      en: "Clubs, school, health and household agendas in one database — every row has a rhythm, a person responsible and what to bring along. No children's names, exactly as the guide recommends.",
    },
    download: { cs: "Stáhnout rodinný kalendář", en: "Download the family calendar" },
    contains: {
      cs: ["11 sloupců včetně rytmu a doprovodu", "12 vymyšlených řádků", "Připraveno na import do Notionu"],
      en: ["11 columns including rhythm and who takes them", "12 made-up rows", "Ready to import into Notion"],
    },
    source: {
      path: "/tipy/ai-v-rodine-vychova-hry-pohadky",
      title: {
        cs: "AI v rodině: kalendář, výchova, bojovky a pohádky",
        en: "AI for families: calendar, parenting, scavenger hunts and stories",
      },
    },
  },
  {
    slug: "projekty-ukoly",
    format: "csv",
    notion: true,
    file: { cs: "projekty-a-ukoly.csv", en: "projekty-a-ukoly-en.csv" },
    title: { cs: "Přehled projektů a úkolů", en: "Projects and tasks overview" },
    blurb: {
      cs: "Projekty i úkoly v jedné tabulce, rozlišené sloupcem typu. Je tam stav, termín, vlastník, oblast a hlavně poslední aktivita — sloupec, na kterém stojí hlídání projektů, které ztichly.",
      en: "Projects and tasks in one table, told apart by a record-type column. Status, due date, owner, area — and above all last activity, the column that lets you catch the projects that have gone quiet.",
    },
    download: { cs: "Stáhnout projekty a úkoly", en: "Download projects and tasks" },
    contains: {
      cs: ["11 sloupců pro projekty i úkoly", "12 vymyšlených řádků jedné firmy", "Připraveno na import do Notionu"],
      en: ["11 columns covering projects and tasks", "12 made-up rows from one company", "Ready to import into Notion"],
    },
    source: {
      path: "/tipy/ai-ve-firme-kompletni-pruvodce",
      title: {
        cs: "AI ve firmě: kompletní průvodce zavedením",
        en: "AI in the company: the complete rollout guide",
      },
    },
  },
];

export type Template = {
  slug: string;
  format: TemplateFormat;
  /** Adresa souboru v public/ — používá se jako href odkazu ke stažení. */
  href: string;
  fileName: string;
  title: string;
  blurb: string;
  contains: string[];
  /** Přístupný text odkazu, např. „Stáhnout rozpočet (.xlsx, 21 kB)“. */
  downloadLabel: string;
  sourcePath: string;
  sourceTitle: string;
  bytes: number;
  size: string;
  notion: boolean;
};

const DIR = path.join(process.cwd(), "public", "sablony");

/** Velikost na disku. Chybějící soubor nemá shodit build, jen se neukáže velikost. */
function fileSize(name: string): number {
  try {
    return fs.statSync(path.join(DIR, name)).size;
  } catch {
    return 0;
  }
}

function formatSize(bytes: number): string {
  if (bytes <= 0) return "";
  if (bytes < 1024) return `${bytes} B`;
  return `${Math.round(bytes / 1024)} kB`;
}

export function getTemplates(locale: Locale = "cs"): Template[] {
  return DEFS.map((d) => {
    const fileName = d.file[locale] ?? d.file.cs;
    const bytes = fileSize(fileName);
    const size = formatSize(bytes);
    const meta = size ? `.${d.format}, ${size}` : `.${d.format}`;
    return {
      slug: d.slug,
      format: d.format,
      href: `/sablony/${fileName}`,
      fileName,
      title: d.title[locale] ?? d.title.cs,
      blurb: d.blurb[locale] ?? d.blurb.cs,
      contains: d.contains[locale] ?? d.contains.cs,
      downloadLabel: `${d.download[locale] ?? d.download.cs} (${meta})`,
      sourcePath: d.source.path,
      sourceTitle: d.source.title[locale] ?? d.source.title.cs,
      bytes,
      size,
      notion: d.notion === true,
    };
  });
}
