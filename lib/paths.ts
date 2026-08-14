import { getChapter } from "@/lib/chapters";
import { getTip } from "@/lib/tips";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Cesty — pojmenované sekvence kroků napříč knihovnou.
 *
 * Web má stovky návodů a desítky kapitol, ale nikde neříká, v jakém pořadí je číst.
 * Cesta je kurátorský seznam: každý krok odkazuje na existující tip nebo kapitolu,
 * přidává jednu větu „co z toho budete mít“ a odhad minut.
 *
 * Slugy se NEPÍŠOU natvrdo do stránek — kroky rozřeší `getPaths` přes `getTip`
 * a `getChapter`. Slug, který v daném jazyce neexistuje, se přeskočí a ohlásí
 * do konzole buildu (`console.warn`), takže se nikdy nevykreslí mrtvý odkaz.
 */

export type PathStepKind = "tip" | "chapter";

export type PathStep = {
  kind: PathStepKind;
  /** Slug souboru v content/tipy/ nebo content/prirucka/ (stejný pro cs i en). */
  slug: string;
  /** Jedna věta „co z toho budete mít“. */
  outcome: Record<Locale, string>;
  /** Odhad na krok v minutách — čtení i provedení, ne jen čtení. */
  minutes: number;
};

export type LearningPath = {
  /** Zároveň URL segment: /cesty/{id}. */
  id: string;
  title: Record<Locale, string>;
  /** Perex — dvě věty, co cesta je. */
  lead: Record<Locale, string>;
  /** Pro koho to je. */
  forWhom: Record<Locale, string>;
  /** Id navazující cesty, na kterou se odkáže na konci. */
  next?: string;
  steps: PathStep[];
};

export const paths: LearningPath[] = [
  {
    id: "od-chaosu-k-systemu",
    title: {
      cs: "Za měsíc od chaosu k systému",
      en: "From chaos to a system in a month",
    },
    lead: {
      cs: "Čtyři týdny, devět kroků. Na konci máte jedno místo na úkoly, kalendář, který drží, a půlhodinu v pátek, po které víte, co bude příští týden.",
      en: "Four weeks, nine steps. At the end you have one place for tasks, a calendar that holds, and half an hour on Friday that tells you what next week looks like.",
    },
    forWhom: {
      cs: "Pro každého, kdo zkoušel pět aplikací a u žádné nevydržel déle než týden.",
      en: "For anyone who has tried five apps and stuck with none of them longer than a week.",
    },
    next: "prvnich-14-dni-s-ai",
    steps: [
      {
        kind: "chapter",
        slug: "co-znamena-byt-produktivni",
        minutes: 12,
        outcome: {
          cs: "Přestanete měřit produktivitu počtem odškrtaných úkolů a pojmenujete, co vlastně chcete zlepšit.",
          en: "You stop measuring productivity by ticked-off tasks and name what you actually want to improve.",
        },
      },
      {
        kind: "chapter",
        slug: "jak-vybrat-system",
        minutes: 14,
        outcome: {
          cs: "Vyberete si jeden systém a umíte říct, proč zrovna ten.",
          en: "You pick one system and can say why that one.",
        },
      },
      {
        kind: "chapter",
        slug: "zachyceni-informaci",
        minutes: 12,
        outcome: {
          cs: "Dostanete z hlavy všechno, co v ní zatím držíte silou.",
          en: "You get everything out of your head that you have been holding there by force.",
        },
      },
      {
        kind: "tip",
        slug: "hlasovy-capture",
        minutes: 8,
        outcome: {
          cs: "Nápad z chůze skončí v seznamu, ne v zapomnění.",
          en: "An idea you have while walking lands in your list instead of being forgotten.",
        },
      },
      {
        kind: "tip",
        slug: "todoist-gtd-inbox",
        minutes: 15,
        outcome: {
          cs: "Máte jednu schránku úkolů, kterou večer vyprázdníte za tři minuty.",
          en: "You have one task inbox you can empty in three minutes each evening.",
        },
      },
      {
        kind: "tip",
        slug: "tri-hlavni-ukoly",
        minutes: 10,
        outcome: {
          cs: "Ráno víte, které tři věci dnešek rozhodnou.",
          en: "In the morning you know which three things decide the day.",
        },
      },
      {
        kind: "tip",
        slug: "kalendar-bloky-prace",
        minutes: 15,
        outcome: {
          cs: "Práce má v kalendáři svoje místo, takže ji nesežerou porady.",
          en: "Your work has its own place in the calendar, so meetings cannot eat it.",
        },
      },
      {
        kind: "tip",
        slug: "tydenni-prehled",
        minutes: 25,
        outcome: {
          cs: "Půlhodina v pátek, po které jdete do víkendu s prázdnou hlavou.",
          en: "Half an hour on Friday that lets you walk into the weekend with an empty head.",
        },
      },
      {
        kind: "tip",
        slug: "shutdown-ritual",
        minutes: 10,
        outcome: {
          cs: "Konec pracovního dne je konec, ne přesun práce do večera.",
          en: "The end of the workday is an end, not a move of the work into the evening.",
        },
      },
    ],
  },
  {
    id: "prvnich-14-dni-s-ai",
    title: {
      cs: "Prvních 14 dní s AI",
      en: "Your first 14 days with AI",
    },
    lead: {
      cs: "Od „co to vlastně je“ k vlastní rutině. Deset kroků, každý zhruba na jeden večer — po dvou týdnech děláte s AI věci, které jste dřív odklikávali ručně.",
      en: "From “what even is this” to a routine of your own. Ten steps, roughly one evening each — after two weeks you use AI for things you used to click through by hand.",
    },
    forWhom: {
      cs: "Pro úplného začátečníka. Nepotřebujete nic nainstalovaného ani zaplaceného předem.",
      en: "For a complete beginner. Nothing installed and nothing paid for up front.",
    },
    next: "ai-ve-firme-od-pilotu-k-provozu",
    steps: [
      {
        kind: "tip",
        slug: "ai-zacatecnik-instalace-a-rozdily",
        minutes: 20,
        outcome: {
          cs: "Máte vybraný a nainstalovaný jeden nástroj a víte, čím se liší od ostatních.",
          en: "You have one tool picked and installed, and you know how it differs from the rest.",
        },
      },
      {
        kind: "tip",
        slug: "ai-prvni-krok",
        minutes: 10,
        outcome: {
          cs: "Napíšete první prompt, který vám něco reálně ušetří.",
          en: "You write your first prompt that actually saves you something.",
        },
      },
      {
        kind: "tip",
        slug: "ai-role-a-kontext",
        minutes: 12,
        outcome: {
          cs: "Odpovědi přestanou být obecné, protože model konečně ví, komu a proč píše.",
          en: "Answers stop being generic, because the model finally knows who it is writing for and why.",
        },
      },
      {
        kind: "tip",
        slug: "ai-iterace",
        minutes: 10,
        outcome: {
          cs: "Naučíte se výsledek opravovat doptáváním místo psaní promptu odznova.",
          en: "You learn to fix a result by following up instead of rewriting the prompt from scratch.",
        },
      },
      {
        kind: "tip",
        slug: "ai-overovani-faktu",
        minutes: 12,
        outcome: {
          cs: "Poznáte, kdy si model vymýšlí, a víte, jak si to ověřit.",
          en: "You spot when the model is making things up, and you know how to check.",
        },
      },
      {
        kind: "tip",
        slug: "ai-shrnuti-dokumentu",
        minutes: 10,
        outcome: {
          cs: "Dlouhé PDF projdete za pět minut a víte, co v něm bylo podstatné.",
          en: "You get through a long PDF in five minutes and know what mattered in it.",
        },
      },
      {
        kind: "tip",
        slug: "ai-prvni-navrh-mailu",
        minutes: 10,
        outcome: {
          cs: "Nepříjemný e-mail už nezačínáte od prázdné stránky.",
          en: "You no longer start an awkward email from a blank page.",
        },
      },
      {
        kind: "tip",
        slug: "ai-vlastni-instrukce",
        minutes: 12,
        outcome: {
          cs: "Nemusíte pokaždé opakovat, kdo jste a jak chcete psát.",
          en: "You stop repeating who you are and how you want things written.",
        },
      },
      {
        kind: "tip",
        slug: "ai-projekty-kontext",
        minutes: 15,
        outcome: {
          cs: "Každá práce má vlastní prostor s vlastními podklady.",
          en: "Each piece of work gets its own space with its own source material.",
        },
      },
      {
        kind: "tip",
        slug: "ai-knihovna-promptu",
        minutes: 15,
        outcome: {
          cs: "Máte pár promptů, které používáte pořád dokola — a víte, kde jsou.",
          en: "You have a handful of prompts you use over and over — and you know where they live.",
        },
      },
    ],
  },
  {
    id: "ai-ve-firme-od-pilotu-k-provozu",
    title: {
      cs: "AI ve firmě: od pilotu k provozu",
      en: "AI at the company: from pilot to production",
    },
    lead: {
      cs: "Deset kroků od „zkusili jsme to a vyšumělo to“ k tomu, že na AI stojí konkrétní procesy a je jasné, kdo za ně odpovídá.",
      en: "Ten steps from “we tried it and it fizzled out” to specific processes running on AI, with an owner for each of them.",
    },
    forWhom: {
      cs: "Pro manažery a vedoucí týmů, kteří AI nezavádějí kvůli AI.",
      en: "For managers and team leads who are not rolling out AI for the sake of AI.",
    },
    next: "data-bez-tabulkoveho-pekla",
    steps: [
      {
        kind: "tip",
        slug: "ai-ve-firme-kompletni-pruvodce",
        minutes: 35,
        outcome: {
          cs: "Máte mapu celého zavádění a víte, ve které fázi právě jste.",
          en: "You have a map of the whole rollout and know which phase you are in.",
        },
      },
      {
        kind: "chapter",
        slug: "pet-urovni-ai",
        minutes: 12,
        outcome: {
          cs: "Pojmenujete, kam až chcete dojít — a kam ne.",
          en: "You name how far you want to go — and how far you do not.",
        },
      },
      {
        kind: "tip",
        slug: "mcp-konektory-usb-c-pro-ai",
        minutes: 15,
        outcome: {
          cs: "Rozumíte, jak se AI připojuje k firemním datům, aniž byste je někam kopírovali.",
          en: "You understand how AI connects to company data without copying it anywhere.",
        },
      },
      {
        kind: "tip",
        slug: "mcp-konektory-nastroje",
        minutes: 20,
        outcome: {
          cs: "Máte připojený první systém, ze kterého tým opravdu čte.",
          en: "You have the first system connected that the team genuinely reads from.",
        },
      },
      {
        kind: "tip",
        slug: "porady-system-s-ai",
        minutes: 20,
        outcome: {
          cs: "Porady mají agendu, zápis a úkoly, které někdo dostane.",
          en: "Meetings have an agenda, notes and tasks that someone actually receives.",
        },
      },
      {
        kind: "tip",
        slug: "ai-zapisy-schuzek-automaticky",
        minutes: 15,
        outcome: {
          cs: "Zápis vzniká sám a nikdo ho už nepíše ručně.",
          en: "Notes write themselves and nobody types them up any more.",
        },
      },
      {
        kind: "tip",
        slug: "manazer-delegovani-kontext",
        minutes: 12,
        outcome: {
          cs: "Zadání obsahuje kontext, takže se práce nevrací.",
          en: "An assignment carries its context, so the work does not bounce back.",
        },
      },
      {
        kind: "tip",
        slug: "n8n-zapier-ai-automatizace",
        minutes: 25,
        outcome: {
          cs: "První proces běží bez vás, i když jste na dovolené.",
          en: "The first process runs without you, holidays included.",
        },
      },
      {
        kind: "chapter",
        slug: "procesy-a-automatizace",
        minutes: 14,
        outcome: {
          cs: "Víte, co má smysl automatizovat a co je jen zabalený nepořádek.",
          en: "You know what is worth automating and what is just mess in a nicer wrapper.",
        },
      },
      {
        kind: "chapter",
        slug: "zavadeni-zmeny",
        minutes: 14,
        outcome: {
          cs: "Změna přežije první měsíc, protože má vlastníka a měřítko.",
          en: "The change survives its first month, because it has an owner and a measure.",
        },
      },
    ],
  },
  {
    id: "data-bez-tabulkoveho-pekla",
    title: {
      cs: "Data bez tabulkového pekla",
      en: "Data without spreadsheet hell",
    },
    lead: {
      cs: "Osm kroků od ručně slepované tabulky k analýze, kterou příští měsíc zopakujete jedním příkazem — a bude vidět jak.",
      en: "Eight steps from a hand-glued spreadsheet to an analysis you can repeat next month with one command — and show your work.",
    },
    forWhom: {
      cs: "Pro každého, kdo má data v Excelu a report v pátek.",
      en: "For anyone with the data in Excel and the report due Friday.",
    },
    next: "od-chaosu-k-systemu",
    steps: [
      {
        kind: "tip",
        slug: "excel-ctrl-t-tabulka",
        minutes: 8,
        outcome: {
          cs: "Data mají tvar, se kterým umí pracovat vzorce i filtry.",
          en: "Your data takes a shape that formulas and filters can work with.",
        },
      },
      {
        kind: "tip",
        slug: "excel-odebrat-duplicity",
        minutes: 6,
        outcome: {
          cs: "Ze seznamu zmizí řádky, které tam byly dvakrát.",
          en: "The rows that were in there twice are gone.",
        },
      },
      {
        kind: "tip",
        slug: "excel-kontingencni-tabulka",
        minutes: 15,
        outcome: {
          cs: "Z tisíce řádků máte souhrn za dvě minuty.",
          en: "A thousand rows turn into a summary in two minutes.",
        },
      },
      {
        kind: "tip",
        slug: "ai-excel-vzorce",
        minutes: 10,
        outcome: {
          cs: "Vzorec, který si nepamatujete, vám napíše AI — a vysvětlí ho.",
          en: "The formula you cannot remember gets written for you — and explained.",
        },
      },
      {
        kind: "tip",
        slug: "ai-analyza-dat",
        minutes: 20,
        outcome: {
          cs: "Nahrajete soubor a dostanete odpovědi místo grafů, o které nikdo nestál.",
          en: "You upload a file and get answers instead of charts nobody asked for.",
        },
      },
      {
        kind: "tip",
        slug: "analyza-dat-duckdb-skill",
        minutes: 25,
        outcome: {
          cs: "Zvládnete i soubory, které Excel vůbec neotevře.",
          en: "You can handle files Excel refuses to open at all.",
        },
      },
      {
        kind: "tip",
        slug: "reprodukovatelna-analyza-dat",
        minutes: 25,
        outcome: {
          cs: "Stejná analýza proběhne příště stejně — a je vidět jak.",
          en: "The same analysis runs the same way next time — and the steps are visible.",
        },
      },
      {
        kind: "tip",
        slug: "reporting-pro-vedeni-ai",
        minutes: 20,
        outcome: {
          cs: "Report má závěr na prvním řádku a vejde se na jednu stránku.",
          en: "The report puts the conclusion on line one and fits on a single page.",
        },
      },
    ],
  },
  {
    id: "klidnejsi-domacnost",
    title: {
      cs: "Klidnější domácnost",
      en: "A calmer household",
    },
    lead: {
      cs: "Osm kroků k tomu, aby provoz domácnosti běžel na rutinách místo na víkendových sprintech a připomínání.",
      en: "Eight steps to running the household on routines instead of weekend sprints and reminders.",
    },
    forWhom: {
      cs: "Pro rodiny, kde papíry, nákupy a kalendář řeší „ten, kdo si zrovna vzpomene“.",
      en: "For families where paperwork, groceries and the calendar are handled by “whoever remembers first”.",
    },
    next: "od-chaosu-k-systemu",
    steps: [
      {
        kind: "chapter",
        slug: "domacnost-jako-provoz",
        minutes: 12,
        outcome: {
          cs: "Uvidíte domácnost jako provoz s několika opakovanými procesy, ne jako nekonečný seznam.",
          en: "You start seeing the household as an operation with a few repeating processes, not an endless list.",
        },
      },
      {
        kind: "tip",
        slug: "osobni-rozpocet-z-bankovniho-vypisu",
        minutes: 25,
        outcome: {
          cs: "Z výpisu máte rozpočet a víte, kam peníze doopravdy tečou.",
          en: "Your bank statement turns into a budget and you see where the money actually goes.",
        },
      },
      {
        kind: "tip",
        slug: "jidelnicek-a-nakupni-seznam-ai",
        minutes: 20,
        outcome: {
          cs: "Týdenní jídelníček i nákupní seznam vzniknou za deset minut.",
          en: "A week of meals and the shopping list take ten minutes to produce.",
        },
      },
      {
        kind: "tip",
        slug: "skenujte-telefonem",
        minutes: 8,
        outcome: {
          cs: "Papír ze schránky skončí ve složce, ne na kuchyňské lince.",
          en: "The paper from the mailbox ends up in a folder, not on the kitchen counter.",
        },
      },
      {
        kind: "tip",
        slug: "kalendar-google-ukoly",
        minutes: 12,
        outcome: {
          cs: "Rodinný kalendář, do kterého vidí všichni, koho se to týká.",
          en: "A family calendar everyone involved can actually see.",
        },
      },
      {
        kind: "tip",
        slug: "ai-v-rodine-vychova-hry-pohadky",
        minutes: 20,
        outcome: {
          cs: "Máte po ruce hry, pohádky i odpovědi na „proč“ bez dlouhého hledání.",
          en: "Games, bedtime stories and answers to “why” are at hand without a long search.",
        },
      },
      {
        kind: "tip",
        slug: "cestovni-itinerar-ai",
        minutes: 15,
        outcome: {
          cs: "Dovolená má plán, který nikdo nepsal tři večery.",
          en: "The holiday has a plan nobody spent three evenings writing.",
        },
      },
      {
        kind: "chapter",
        slug: "digitalni-hygiena-rodiny",
        minutes: 14,
        outcome: {
          cs: "Obrazovky mají doma pravidla, na kterých jste se dohodli předem.",
          en: "Screens at home run on rules you agreed on in advance.",
        },
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*  Rozřešení kroků na skutečný obsah                                          */
/* -------------------------------------------------------------------------- */

export type ResolvedStep = {
  /** Stabilní identifikátor kroku pro localStorage: „tip:slug“. */
  id: string;
  kind: PathStepKind;
  slug: string;
  /** Název cíle z frontmatteru tipu/kapitoly. */
  title: string;
  /** Hotový interní odkaz včetně prefixu jazyka. */
  href: string;
  outcome: string;
  minutes: number;
  /** Hrubý odhad provedení v hodinách — jen u kroků na velké průvodce (tipy přes 18 000 znaků). */
  doingHours?: number;
};

export type ResolvedPath = {
  id: string;
  title: string;
  lead: string;
  forWhom: string;
  /** Hotový odkaz na detail cesty včetně prefixu jazyka. */
  href: string;
  /** Klíč do localStorage — odvozený od slugu cesty. */
  storageKey: string;
  steps: ResolvedStep[];
  stepCount: number;
  totalMinutes: number;
  /** Navazující cesta, pokud v daném jazyce existuje. */
  next?: { id: string; title: string; href: string };
};

/** Aby build nehlásil tentýž chybějící slug pro každou stránku znovu. */
const warned = new Set<string>();

/** Cesty se rozřeší jednou za jazyk a pak se čtou z paměti (build volá stránky opakovaně). */
const cache = new Map<Locale, ResolvedPath[]>();

/** Klíč do localStorage odvozený od slugu cesty. */
export function pathStorageKey(id: string): string {
  return `produktivni:cesta:${id}`;
}

function resolveStep(pathId: string, step: PathStep, locale: Locale): ResolvedStep | null {
  const tip = step.kind === "tip" ? getTip(step.slug, locale) : undefined;
  const entry = step.kind === "tip" ? tip : getChapter(step.slug, locale);

  if (!entry) {
    const key = `${locale}:${step.kind}:${step.slug}`;
    if (!warned.has(key)) {
      warned.add(key);
      console.warn(
        `[paths] Cesta „${pathId}“: ${step.kind === "tip" ? "návod" : "kapitola"} „${step.slug}“ v jazyce ${locale} neexistuje — krok přeskakuji.`,
      );
    }
    return null;
  }

  const base = step.kind === "tip" ? "/tipy" : "/prirucka";
  return {
    id: `${step.kind}:${step.slug}`,
    kind: step.kind,
    slug: step.slug,
    title: entry.title,
    href: localePath(locale, `${base}/${step.slug}`),
    outcome: step.outcome[locale],
    minutes: step.minutes,
    doingHours: tip?.doingHours,
  };
}

/**
 * Rozřeší všechny cesty pro daný jazyk. Kroky s neexistujícím slugem vypadnou
 * a ohlásí se do konzole buildu. Cesta, ze které nezbude jediný krok, se
 * nevykresluje vůbec.
 */
export function getPaths(locale: Locale): ResolvedPath[] {
  const cached = cache.get(locale);
  if (cached) return cached;

  const resolved: ResolvedPath[] = [];

  for (const path of paths) {
    const steps: ResolvedStep[] = [];
    for (const step of path.steps) {
      const s = resolveStep(path.id, step, locale);
      if (s) steps.push(s);
    }
    if (steps.length === 0) {
      console.warn(
        `[paths] Cesta „${path.id}“ nemá v jazyce ${locale} jediný platný krok — nevykresluje se.`,
      );
      continue;
    }
    resolved.push({
      id: path.id,
      title: path.title[locale],
      lead: path.lead[locale],
      forWhom: path.forWhom[locale],
      href: localePath(locale, `/cesty/${path.id}`),
      storageKey: pathStorageKey(path.id),
      steps,
      stepCount: steps.length,
      totalMinutes: steps.reduce((sum, s) => sum + s.minutes, 0),
    });
  }

  // Navazující cestu doplňujeme až nad hotovým seznamem — odkaz nesmí vést na
  // cestu, která v daném jazyce vypadla.
  const byId = new Map(resolved.map((r) => [r.id, r]));
  for (const path of paths) {
    if (!path.next) continue;
    const self = byId.get(path.id);
    const next = byId.get(path.next);
    if (!self) continue;
    if (!next) {
      console.warn(
        `[paths] Cesta „${path.id}“ odkazuje na navazující cestu „${path.next}“, která v jazyce ${locale} není — odkaz vynechávám.`,
      );
      continue;
    }
    self.next = { id: next.id, title: next.title, href: next.href };
  }

  cache.set(locale, resolved);
  return resolved;
}

export function getPath(id: string, locale: Locale): ResolvedPath | undefined {
  return getPaths(locale).find((p) => p.id === id);
}

/** „9 kroků“ / „9 steps“ — čeština má tři tvary podle počtu. */
export function formatStepCount(n: number, locale: Locale): string {
  if (locale === "en") return `${n} ${n === 1 ? "step" : "steps"}`;
  if (n === 1) return "1 krok";
  if (n >= 2 && n <= 4) return `${n} kroky`;
  return `${n} kroků`;
}

/**
 * „2 h 5 min“ pro delší celky, jinak „45 min“.
 * Klientská PathProgress má vlastní kopii — tenhle modul čte přes fs a do
 * prohlížeče se dostat nesmí.
 */
export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes} min`;
  const h = Math.floor(minutes / 60);
  const rest = minutes % 60;
  return rest === 0 ? `${h} h` : `${h} h ${rest} min`;
}
