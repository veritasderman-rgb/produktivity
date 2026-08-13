"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { localePath, type Locale } from "@/lib/i18n";

/* ---------------------------------------------------------------------------
   Kvíz „Jaký systém produktivity vám sedne“
   Bez backendu: odpovědi žijí v useState, výsledek je sdílitelný přes
   ?vysledek=<slug> (např. ?vysledek=gtd).
   Skórování: každá odpověď přidá body několika systémům; vyhrává součet.
--------------------------------------------------------------------------- */

type SystemKey = "gtd" | "inbox" | "timeblock" | "kanban" | "minimal";

type Bilingual = { cs: string; en: string };

type Option = { label: Bilingual; scores: Partial<Record<SystemKey, number>> };

type Question = { id: string; label: Bilingual; options: Option[] };

const QUESTIONS: Question[] = [
  {
    id: "typ-prace",
    label: {
      cs: "Jaká práce vám zabírá většinu dne?",
      en: "What kind of work takes up most of your day?",
    },
    options: [
      {
        label: {
          cs: "Spousta malých úkolů a požadavků od ostatních",
          en: "Lots of small tasks and requests from other people",
        },
        scores: { gtd: 2, inbox: 2 },
      },
      {
        label: {
          cs: "Několik velkých projektů, na kterých jedu dlouhodobě",
          en: "A handful of big projects I work on over weeks or months",
        },
        scores: { kanban: 2, timeblock: 1 },
      },
      {
        label: {
          cs: "Střídám hlubokou práci se schůzkami",
          en: "I switch between deep work and meetings",
        },
        scores: { timeblock: 3 },
      },
      {
        label: {
          cs: "Jeden hlavní úkol denně, zbytek je šum",
          en: "One main task a day, the rest is noise",
        },
        scores: { minimal: 3 },
      },
    ],
  },
  {
    id: "vstupy",
    label: {
      cs: "Kolik nových vstupů vám denně přistane? (e-maily, zprávy, úkoly)",
      en: "How many new inputs land on you each day? (emails, messages, tasks)",
    },
    options: [
      {
        label: { cs: "Do deseti — mám klid", en: "Under ten — it is calm" },
        scores: { minimal: 2, timeblock: 1 },
      },
      {
        label: { cs: "Deset až čtyřicet", en: "Ten to forty" },
        scores: { inbox: 2, gtd: 1 },
      },
      {
        label: { cs: "Čtyřicet až sto", en: "Forty to a hundred" },
        scores: { gtd: 3, inbox: 2 },
      },
      {
        label: {
          cs: "Přes sto — nestíhám to ani číst",
          en: "Over a hundred — I cannot even read it all",
        },
        scores: { inbox: 3, gtd: 2 },
      },
    ],
  },
  {
    id: "predvidatelnost",
    label: {
      cs: "Jak předvídatelný je váš den?",
      en: "How predictable is your day?",
    },
    options: [
      {
        label: {
          cs: "Naplánuju ho skoro na minutu a tak i proběhne",
          en: "I can plan it almost to the minute and it holds",
        },
        scores: { timeblock: 3 },
      },
      {
        label: {
          cs: "Rámcově ano, ale často se to posune",
          en: "Roughly, but things shift a lot",
        },
        scores: { timeblock: 1, kanban: 1, gtd: 1 },
      },
      {
        label: {
          cs: "Chaos — plán vydrží tak hodinu",
          en: "Chaos — a plan survives about an hour",
        },
        scores: { gtd: 2, minimal: 2 },
      },
      {
        label: {
          cs: "Každý den jiný, ale řídím si ho sám",
          en: "Different every day, but I am the one steering it",
        },
        scores: { kanban: 2, timeblock: 1 },
      },
    ],
  },
  {
    id: "tym",
    label: {
      cs: "Pracujete spíš sám, nebo s ostatními?",
      en: "Do you mostly work alone, or with others?",
    },
    options: [
      {
        label: {
          cs: "Sám, nikdo na můj výstup nečeká",
          en: "Alone, nobody is waiting on my output",
        },
        scores: { minimal: 2, gtd: 1 },
      },
      {
        label: {
          cs: "Sám, ale výstupy předávám dál",
          en: "Alone, but I hand my output over to others",
        },
        scores: { kanban: 1, gtd: 1, inbox: 1 },
      },
      {
        label: {
          cs: "V týmu — hodně čekám na ostatní",
          en: "In a team — I wait on other people a lot",
        },
        scores: { kanban: 3, gtd: 1 },
      },
      {
        label: {
          cs: "Vedu tým a deleguju",
          en: "I lead a team and delegate",
        },
        scores: { kanban: 2, gtd: 2 },
      },
    ],
  },
  {
    id: "detail",
    label: {
      cs: "Jaký máte vztah k detailu v seznamech?",
      en: "How do you feel about detail in your lists?",
    },
    options: [
      {
        label: {
          cs: "Miluju systém — kontexty, štítky, projekty",
          en: "I love structure — contexts, tags, projects",
        },
        scores: { gtd: 3 },
      },
      {
        label: {
          cs: "Chci všechno vidět na jedné tabuli",
          en: "I want to see everything on one board",
        },
        scores: { kanban: 3 },
      },
      {
        label: {
          cs: "Co nejmíň políček, ať nespravuju systém místo práce",
          en: "As few fields as possible, so I do not maintain a system instead of working",
        },
        scores: { minimal: 3, inbox: 1 },
      },
      {
        label: {
          cs: "Systém si vedu, ale jen když se drží skoro sám",
          en: "I keep a system, but only if it nearly runs itself",
        },
        scores: { inbox: 2, timeblock: 1 },
      },
    ],
  },
  {
    id: "bolest",
    label: {
      cs: "Co vás na tom právě teď nejvíc bolí?",
      en: "What hurts the most right now?",
    },
    options: [
      {
        label: {
          cs: "Přeplněná schránka — nestíhám odpovídat",
          en: "An overflowing inbox — I cannot keep up with replies",
        },
        scores: { inbox: 4 },
      },
      {
        label: {
          cs: "Zapomínám na sliby, věci mi propadají",
          en: "I forget promises and things slip through",
        },
        scores: { gtd: 4 },
      },
      {
        label: {
          cs: "Den mi uteče a k důležitému se nedostanu",
          en: "The day evaporates and I never get to what matters",
        },
        scores: { timeblock: 4 },
      },
      {
        label: {
          cs: "Rozdělaného mám moc a nic nedokončím",
          en: "Too much started, nothing finished",
        },
        scores: { kanban: 3, minimal: 3 },
      },
    ],
  },
  {
    id: "udrzba",
    label: {
      cs: "Kolik času denně jste ochotni věnovat údržbě systému?",
      en: "How much time a day are you willing to spend maintaining a system?",
    },
    options: [
      {
        label: { cs: "Nula — chci to mít z hlavy", en: "Zero — I just want it off my mind" },
        scores: { minimal: 3 },
      },
      {
        label: { cs: "Pět minut ráno", en: "Five minutes in the morning" },
        scores: { minimal: 2, inbox: 1 },
      },
      {
        label: {
          cs: "Deset až patnáct minut denně a týdenní revize",
          en: "Ten to fifteen minutes a day plus a weekly review",
        },
        scores: { gtd: 3, kanban: 1 },
      },
      {
        label: {
          cs: "Klidně půl hodiny — ladění systému mě baví",
          en: "Half an hour, gladly — tuning the system is fun",
        },
        scores: { gtd: 2, kanban: 2 },
      },
    ],
  },
  {
    id: "soustredeni",
    label: {
      cs: "Jak vám funguje soustředění?",
      en: "How does your focus behave?",
    },
    options: [
      {
        label: {
          cs: "V klidu vydržím devadesát minut v kuse",
          en: "I can hold ninety minutes straight",
        },
        scores: { timeblock: 2, kanban: 1 },
      },
      {
        label: {
          cs: "Po pětadvaceti minutách potřebuju pauzu",
          en: "After twenty-five minutes I need a break",
        },
        scores: { timeblock: 3 },
      },
      {
        label: {
          cs: "Soustředění mi trhá okolí, nemám to pod kontrolou",
          en: "My surroundings shred my focus and I cannot control it",
        },
        scores: { inbox: 2, timeblock: 2 },
      },
      {
        label: {
          cs: "Soustředit se umím — problém je vybrat, co dělat",
          en: "Focus is fine — choosing what to work on is the problem",
        },
        scores: { minimal: 2, gtd: 2 },
      },
    ],
  },
  {
    id: "prehled",
    label: {
      cs: "Máte přehled o všem, co máte rozdělané?",
      en: "Do you have a full picture of everything you have in flight?",
    },
    options: [
      {
        label: {
          cs: "Kompletní seznam mám, jen se k němu nedostanu",
          en: "I have the complete list, I just never get to it",
        },
        scores: { gtd: 2, timeblock: 2 },
      },
      {
        label: {
          cs: "Něco v hlavě, něco na papíře, něco v mailu",
          en: "Some in my head, some on paper, some in email",
        },
        scores: { gtd: 3, inbox: 2 },
      },
      {
        label: {
          cs: "Vidím to na tabuli nebo v nástroji",
          en: "I can see it on a board or in a tool",
        },
        scores: { kanban: 3 },
      },
      {
        label: {
          cs: "Rozdělaného mám málo — schválně",
          en: "I keep very little in flight — on purpose",
        },
        scores: { minimal: 3 },
      },
    ],
  },
  {
    id: "vznik",
    label: {
      cs: "Kde vám úkoly nejčastěji vznikají?",
      en: "Where do your tasks usually come from?",
    },
    options: [
      {
        label: { cs: "V e-mailu a v chatu", en: "In email and chat" },
        scores: { inbox: 3, gtd: 1 },
      },
      {
        label: { cs: "Na schůzkách", en: "In meetings" },
        scores: { gtd: 2, timeblock: 1 },
      },
      {
        label: { cs: "V hlavě — vymýšlím si je sám", en: "In my head — I come up with them myself" },
        scores: { minimal: 2, kanban: 1 },
      },
      {
        label: {
          cs: "V systému nebo ticketu, přiřazuje mi je někdo jiný",
          en: "In a system or ticket, assigned to me by someone else",
        },
        scores: { kanban: 3 },
      },
    ],
  },
];

type SystemInfo = {
  key: SystemKey;
  slug: string;
  chapter: string;
  name: Bilingual;
  chapterLabel: Bilingual;
  tagline: Bilingual;
  why: Bilingual;
  also: Bilingual;
  steps: { cs: string[]; en: string[] };
};

const SYSTEMS: SystemInfo[] = [
  {
    key: "gtd",
    slug: "gtd",
    chapter: "getting-things-done",
    name: { cs: "Getting Things Done (GTD)", en: "Getting Things Done (GTD)" },
    chapterLabel: { cs: "Getting Things Done (GTD)", en: "Getting Things Done (GTD)" },
    tagline: {
      cs: "Kompletní systém pro hodně vstupů a hodně slibů",
      en: "A complete system for many inputs and many promises",
    },
    why: {
      cs: "Odpovídáte jako člověk, kterému denně padá do života víc věcí, než se dá udržet v hlavě — a část z nich jsou závazky vůči ostatním. GTD je jediný z pěti systémů, který tohle řeší od základu: všechno se sbírá na jedno místo, zpracuje se podle jasného pravidla a rozdělí do projektů a kontextů. Údržbu si účtuje týdenní revizí, ale na oplátku vám z hlavy sundá pocit, že na něco zapomínáte.",
      en: "Your answers describe someone who gets more thrown at them each day than a head can hold — and a good chunk of it is commitments to other people. GTD is the only one of the five systems that solves this from the ground up: everything gets captured in one place, processed by a clear rule, and split into projects and contexts. It charges you a weekly review in return for taking away the nagging feeling that you are forgetting something.",
    },
    also: {
      cs: "Když chcete kompletní síť, která nic neupustí, i za cenu týdenní revize.",
      en: "When you want a complete net that drops nothing, even at the price of a weekly review.",
    },
    steps: {
      cs: [
        "Udělejte jednorázový sběr: dvacet minut vypisujte na papír všechno, co máte rozdělané nebo slíbené. Nic netřiďte.",
        "Zaveďte jednu schránku pro nové věci — jednu appku, jeden zápisník. Ne tři.",
        "Naplánujte si do kalendáře třicet minut týdně na revizi. Bez ní se GTD rozpadne do měsíce.",
      ],
      en: [
        "Do a one-off capture: spend twenty minutes writing down everything you have started or promised. No sorting.",
        "Set up a single inbox for new things — one app, one notebook. Not three.",
        "Block thirty minutes a week in your calendar for the review. Without it GTD falls apart within a month.",
      ],
    },
  },
  {
    key: "inbox",
    slug: "inbox-zero",
    chapter: "inbox-zero",
    name: {
      cs: "Inbox Zero a jednoduchý seznam",
      en: "Inbox Zero plus a simple list",
    },
    chapterLabel: { cs: "Inbox Zero: čistá e-mailová schránka", en: "Inbox Zero: a clean email inbox" },
    tagline: {
      cs: "Nejdřív zastavte zdroj chaosu, teprve pak řešte systém",
      en: "Stop the source of the chaos first, worry about a system later",
    },
    why: {
      cs: "Váš problém není chybějící metodika — je to komunikační kanál, který přetéká. Dokud e-mail a chat fungují jako neroztříděná hromada, jakýkoli složitější systém se v ní utopí. Inbox Zero plus jeden krátký seznam úkolů je nejlevnější způsob, jak si vzít zpátky kontrolu: schránka je průchoďák, ne sklad, a úkoly z ní odcházejí ven.",
      en: "Your problem is not a missing methodology — it is a communication channel that keeps overflowing. As long as email and chat work like an unsorted pile, any more elaborate system will drown in it. Inbox Zero plus one short task list is the cheapest way to take back control: the inbox is a hallway, not a warehouse, and tasks leave it.",
    },
    also: {
      cs: "Když je hlavní bolest komunikace a všechno ostatní se od ní odvíjí.",
      en: "When communication is the main pain and everything else follows from it.",
    },
    steps: {
      cs: [
        "Založte složku „Archiv“ a přesuňte do ní všechno starší než měsíc. Nic se neztratí, hledání funguje.",
        "Projděte schránku podle pravidla dvou minut: hotovo, deleguj, naplánuj, archivuj. Nic nezůstává „na potom“ ve schránce.",
        "Vypněte notifikace na nové zprávy a schránku otevírejte třikrát denně v pevný čas.",
      ],
      en: [
        "Create an “Archive” folder and move everything older than a month into it. Nothing is lost, search still works.",
        "Run the inbox by the two-minute rule: do it, delegate it, schedule it, archive it. Nothing stays “for later” in the inbox.",
        "Turn off new-message notifications and open the inbox three times a day at fixed times.",
      ],
    },
  },
  {
    key: "timeblock",
    slug: "time-blocking",
    chapter: "pomodoro-a-time-blocking",
    name: { cs: "Time-blocking a Pomodoro", en: "Time-blocking and Pomodoro" },
    chapterLabel: { cs: "Pomodoro a time-blocking", en: "Pomodoro and time-blocking" },
    tagline: {
      cs: "Seznam úkolů máte. Chybí vám čas, ve kterém je uděláte",
      en: "You have the list. What you lack is the time to do it in",
    },
    why: {
      cs: "Z odpovědí vychází, že nevíte-co-dělat není váš problém — problém je, že se k tomu nedostanete. Time-blocking je jediná technika, která s tímhle něco udělá: úkol dostane konkrétní místo v kalendáři a tím i konkurenta ve všem ostatním, co vás chce sníst. Pomodoro pak to samé řeší v malém, když je vaše soustředění křehčí než devadesátiminutový blok.",
      en: "Your answers say that not-knowing-what-to-do is not your problem — the problem is never getting to it. Time-blocking is the one technique that does something about that: a task gets a specific slot in the calendar, and therefore a real competitor to everything else trying to eat you. Pomodoro does the same thing at small scale when your focus is more fragile than a ninety-minute block.",
    },
    also: {
      cs: "Když seznam máte hotový, ale den se vám rozpustí mezi prsty.",
      en: "When the list is fine but the day dissolves between your fingers.",
    },
    steps: {
      cs: [
        "Zítřejšímu nejdůležitějšímu úkolu dejte do kalendáře devadesátiminutový blok. Chraňte ho jako schůzku s klientem.",
        "Zkuste jeden den v Pomodoro rytmu 25/5 a změřte, kolik bloků reálně zvládnete. Bude jich míň, než čekáte — to je ta informace.",
        "Zaveďte jeden „nárazník“ denně: hodinu bez plánu, do které se vejdou průšvihy. Bez něj se rozpadne celý rozvrh.",
      ],
      en: [
        "Put a ninety-minute block for tomorrow's most important task in your calendar. Defend it like a client meeting.",
        "Run one day on a 25/5 Pomodoro rhythm and count how many blocks you actually complete. It will be fewer than you expect — that is the useful part.",
        "Add one buffer a day: an unplanned hour that absorbs the emergencies. Without it the whole schedule collapses.",
      ],
    },
  },
  {
    key: "kanban",
    slug: "kanban",
    chapter: "scrum-kanban-okr",
    name: { cs: "Kanban — osobní board", en: "Kanban — a personal board" },
    chapterLabel: {
      cs: "SCRUM, Kanban a OKR pro jednotlivce",
      en: "Scrum, Kanban and OKRs for individuals",
    },
    tagline: {
      cs: "Vidět tok práce je důležitější než mít dokonalý seznam",
      en: "Seeing the flow of work matters more than a perfect list",
    },
    why: {
      cs: "Pracujete v tahu, kde se věci předávají, čeká se na ostatní a rozdělaného je vždycky víc, než by mělo být. Na to je seznam špatný nástroj — neukáže, co stojí a proč. Kanban ukáže: tři sloupce, limit rozpracovanosti a najednou je vidět, že úzké hrdlo není ve vaší píli, ale v pěti věcech, které čekají na někoho jiného.",
      en: "You work in a flow where things get handed over, people wait on each other, and there is always more in progress than there should be. A list is a poor tool for that — it does not show what is stuck and why. A board does: three columns, a work-in-progress limit, and suddenly it is obvious that the bottleneck is not your effort but five things waiting on somebody else.",
    },
    also: {
      cs: "Když potřebujete vidět, co stojí a na kom to visí.",
      en: "When you need to see what is stuck and who it is stuck on.",
    },
    steps: {
      cs: [
        "Postavte board se čtyřmi sloupci: fronta, dělám, čeká se, hotovo. Papír a lepíky stačí.",
        "Nastavte si limit: maximálně tři věci ve sloupci „dělám“. Než začnete čtvrtou, musíte jednu dodělat.",
        "Sloupec „čeká se“ projděte jednou denně a pošlete připomínku. Tam se ztrácí nejvíc času.",
      ],
      en: [
        "Build a board with four columns: queue, doing, waiting, done. Paper and sticky notes are enough.",
        "Set a limit: at most three items in “doing”. Before starting a fourth, one has to be finished.",
        "Review the “waiting” column once a day and send the nudge. That is where most of the time leaks away.",
      ],
    },
  },
  {
    key: "minimal",
    slug: "tri-ukoly",
    chapter: "zakladni-systemy",
    name: {
      cs: "Minimalistický systém tří úkolů",
      en: "The minimal three-task system",
    },
    chapterLabel: {
      cs: "Základní systémy: inbox, priority, revize",
      en: "Core systems: inbox, priorities, review",
    },
    tagline: {
      cs: "Tři úkoly denně, žádná další režie",
      en: "Three tasks a day, no further overhead",
    },
    why: {
      cs: "Vaše odpovědi říkají, že si systém neuděláte složitější než práci samotnou — a to je dobře. Objem vstupů to unese a hlavní riziko u vás není zapomínání, ale rozptýlení. Tři úkoly na den, napsané ráno, jsou dost silné omezení na to, aby vás donutily vybrat, a dost jednoduché na to, aby přežily i den, ve kterém se všechno pokazí.",
      en: "Your answers say you will not build a system more complicated than the work itself — and that is right. Your input volume can take it, and your main risk is not forgetting but scattering. Three tasks a day, written in the morning, are a constraint strong enough to force a choice and simple enough to survive a day where everything goes wrong.",
    },
    also: {
      cs: "Když je největší riziko, že se systémem strávíte víc času než prací.",
      en: "When the biggest risk is spending more time on the system than on the work.",
    },
    steps: {
      cs: [
        "Každé ráno napište tři úkoly na jeden papírek. Ne pět, ne deset. Tři.",
        "První z nich udělejte dřív, než otevřete e-mail. Jednou. Pak podruhé. Za týden je to zvyk.",
        "Večer papírek zahoďte. Co se nestihlo a pořád to platí, napíšete znovu — zbytek nebyl důležitý.",
      ],
      en: [
        "Every morning write three tasks on one slip of paper. Not five, not ten. Three.",
        "Do the first one before you open email. Once. Then again. In a week it is a habit.",
        "Throw the slip away in the evening. Whatever is unfinished and still matters gets rewritten — the rest was not important.",
      ],
    },
  },
];

/** Pořadí pro rozstřel remízy — stabilní a záměrné (od nejobecnějšího). */
const TIE_ORDER: SystemKey[] = ["gtd", "timeblock", "inbox", "kanban", "minimal"];

const T = {
  cs: {
    progress: "Otázka",
    of: "z",
    back: "← Zpět",
    restart: "Spustit kvíz znovu",
    startOwn: "Chci svůj výsledek",
    resultEyebrow: "Váš systém",
    sharedEyebrow: "Sdílený výsledek",
    sharedNote:
      "Tohle je výsledek, který vám někdo poslal. Kvíz trvá dvě minuty — zjistěte, co vyjde vám.",
    whyLabel: "Proč právě tenhle",
    stepsLabel: "První tři kroky",
    chapterLabel: "Přečtěte si celou kapitolu",
    alsoEyebrow: "Taky zvažte",
    scoresLabel: "Jak dopadly ostatní",
    shareLabel: "Sdílet výsledek",
    copy: "Kopírovat odkaz",
    copied: "Zkopírováno",
    chooseHelp: "Pomoc s výběrem",
    chooseChapter: "Jak vybrat svůj systém",
    answered: "Odpovězeno",
  },
  en: {
    progress: "Question",
    of: "of",
    back: "← Back",
    restart: "Take the quiz again",
    startOwn: "I want my own result",
    resultEyebrow: "Your system",
    sharedEyebrow: "Shared result",
    sharedNote:
      "This is a result someone sent you. The quiz takes two minutes — find out what you get.",
    whyLabel: "Why this one",
    stepsLabel: "The first three steps",
    chapterLabel: "Read the full chapter",
    alsoEyebrow: "Also consider",
    scoresLabel: "How the others scored",
    shareLabel: "Share the result",
    copy: "Copy link",
    copied: "Copied",
    chooseHelp: "Help with choosing",
    chooseChapter: "How to choose your system",
    answered: "Answered",
  },
};

function scoreAnswers(answers: (number | null)[]) {
  const totals: Record<SystemKey, number> = {
    gtd: 0,
    inbox: 0,
    timeblock: 0,
    kanban: 0,
    minimal: 0,
  };
  answers.forEach((pick, qi) => {
    if (pick === null) return;
    const opt = QUESTIONS[qi]?.options[pick];
    if (!opt) return;
    for (const [key, value] of Object.entries(opt.scores)) {
      totals[key as SystemKey] += value ?? 0;
    }
  });
  const ranked = (Object.keys(totals) as SystemKey[]).sort((a, b) => {
    const diff = totals[b] - totals[a];
    if (diff !== 0) return diff;
    return TIE_ORDER.indexOf(a) - TIE_ORDER.indexOf(b);
  });
  return { totals, ranked };
}

function systemBySlug(slug: string | null): SystemInfo | null {
  if (!slug) return null;
  return SYSTEMS.find((s) => s.slug === slug) ?? null;
}

export function SystemQuiz({ locale }: { locale: Locale }) {
  const t = T[locale] ?? T.cs;
  const searchParams = useSearchParams();
  const sharedFromUrl = useMemo(
    () => systemBySlug(searchParams.get("vysledek")),
    [searchParams],
  );

  const [shared, setShared] = useState<SystemInfo | null>(sharedFromUrl);
  const [answers, setAnswers] = useState<(number | null)[]>(
    () => Array(QUESTIONS.length).fill(null),
  );
  const [step, setStep] = useState(0);
  const [copied, setCopied] = useState(false);

  const p = (path: string) => localePath(locale, path);
  const answeredAll = answers.every((a) => a !== null);
  const showResult = shared !== null || answeredAll;

  const { totals, ranked } = useMemo(() => scoreAnswers(answers), [answers]);

  const primary = shared ?? SYSTEMS.find((s) => s.key === ranked[0])!;
  const secondary = shared
    ? null
    : (SYSTEMS.find((s) => s.key === ranked[1]) ?? null);
  const maxScore = Math.max(1, ...Object.values(totals));

  function pick(optionIndex: number) {
    const next = [...answers];
    next[step] = optionIndex;
    setAnswers(next);
    if (step < QUESTIONS.length - 1) setStep(step + 1);
  }

  function restart() {
    setShared(null);
    setAnswers(Array(QUESTIONS.length).fill(null));
    setStep(0);
    setCopied(false);
    if (typeof window !== "undefined") {
      window.history.replaceState(null, "", window.location.pathname);
    }
  }

  async function copyLink() {
    if (typeof window === "undefined") return;
    const url = `${window.location.origin}${window.location.pathname}?vysledek=${primary.slug}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2200);
    } catch {
      setCopied(false);
    }
  }

  /* ------------------------------ Výsledek ------------------------------ */
  if (showResult) {
    const shareUrl =
      typeof window !== "undefined"
        ? `${window.location.origin}${window.location.pathname}?vysledek=${primary.slug}`
        : `?vysledek=${primary.slug}`;

    return (
      <div>
        {shared && (
          <div className="mb-8 border border-hairline bg-surface p-5">
            <p className="eyebrow mb-2 text-faint">{t.sharedEyebrow}</p>
            <p className="text-[14.5px] leading-relaxed text-muted">{t.sharedNote}</p>
            <button
              type="button"
              onClick={restart}
              className="mt-4 bg-ink px-4 py-2.5 text-[13px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
            >
              {t.startOwn}
            </button>
          </div>
        )}

        <p className="eyebrow mb-2 text-accent">{t.resultEyebrow}</p>
        <h2 className="display text-[clamp(26px,4.4vw,40px)]">{primary.name[locale]}</h2>
        <p className="mt-3 font-serif text-[17px] leading-[1.6] text-muted">
          {primary.tagline[locale]}
        </p>

        <section className="mt-9 border-l-2 border-ink pl-5">
          <p className="eyebrow mb-2 text-faint">{t.whyLabel}</p>
          <p className="prose-a text-[16.5px]">{primary.why[locale]}</p>
        </section>

        <section className="mt-9">
          <p className="eyebrow mb-3 text-faint">{t.stepsLabel}</p>
          <ol className="ig-flow">
            {primary.steps[locale].map((s, i) => (
              <li key={i} className="ig-flow-step">
                <span className="ig-flow-no">{i + 1}</span>
                <span className="ig-flow-desc">{s}</span>
              </li>
            ))}
          </ol>
        </section>

        <div className="mt-9 flex flex-wrap items-center gap-4">
          <Link
            href={p(`/prirucka/${primary.chapter}`)}
            className="bg-ink px-5 py-3 text-[13.5px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
          >
            {t.chapterLabel}: {primary.chapterLabel[locale]} →
          </Link>
          <Link href={p("/prirucka/jak-vybrat-system")} className="draw-link text-[13.5px] font-bold">
            {t.chooseChapter} →
          </Link>
        </div>

        {secondary && (
          <section className="mt-12 border border-hairline-strong bg-card p-6">
            <p className="eyebrow mb-2 text-faint">{t.alsoEyebrow}</p>
            <h3 className="text-[19px] font-bold tracking-[-0.01em]">{secondary.name[locale]}</h3>
            <p className="mt-2 font-serif text-[14.5px] leading-[1.6] text-muted">
              {secondary.also[locale]}
            </p>
            <Link
              href={p(`/prirucka/${secondary.chapter}`)}
              className="draw-link mt-4 inline-block text-[13.5px] font-bold"
            >
              {secondary.chapterLabel[locale]} →
            </Link>
          </section>
        )}

        {!shared && (
          <section className="ig mt-12">
            <p className="ig-title">{t.scoresLabel}</p>
            <div className="ig-bars">
              {ranked.map((key) => {
                const sys = SYSTEMS.find((s) => s.key === key)!;
                const pct = Math.round((totals[key] / maxScore) * 100);
                return (
                  <div key={key} className="ig-bar-row">
                    <span className="ig-bar-label">{sys.name[locale]}</span>
                    <span className="ig-bar-track">
                      <span className="ig-bar-fill" style={{ width: `${pct}%` }} />
                    </span>
                    <span className="ig-bar-value">{totals[key]}</span>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        <section className="mt-12 border-t border-hairline pt-6">
          <p className="eyebrow mb-3 text-faint">{t.shareLabel}</p>
          <div className="flex flex-wrap items-center gap-3">
            <code className="max-w-full overflow-x-auto border border-hairline bg-surface px-3 py-2 font-mono text-[12.5px] whitespace-nowrap text-muted">
              {shareUrl}
            </code>
            <button
              type="button"
              onClick={copyLink}
              className="border-[1.5px] border-ink bg-paper px-4 py-2 font-mono text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors hover:bg-ink hover:text-paper"
            >
              {copied ? t.copied : t.copy}
            </button>
            <button
              type="button"
              onClick={restart}
              className="draw-link text-[13.5px] font-bold"
            >
              {t.restart}
            </button>
          </div>
        </section>
      </div>
    );
  }

  /* ------------------------------ Otázky ------------------------------ */
  const q = QUESTIONS[step];
  const answeredCount = answers.filter((a) => a !== null).length;
  const progressPct = Math.round((answeredCount / QUESTIONS.length) * 100);

  return (
    <div>
      <div className="flex items-baseline justify-between gap-4">
        <p className="eyebrow text-faint">
          {t.progress} {step + 1} {t.of} {QUESTIONS.length}
        </p>
        <p className="font-mono text-[12px] font-semibold text-faint tabular">{progressPct} %</p>
      </div>
      <div
        className="mt-2 h-2 w-full border border-hairline bg-surface"
        role="progressbar"
        aria-valuenow={answeredCount}
        aria-valuemin={0}
        aria-valuemax={QUESTIONS.length}
        aria-label={t.answered}
      >
        <div className="h-full bg-ink transition-[width] duration-300" style={{ width: `${progressPct}%` }} />
      </div>

      <h2 className="display mt-9 text-[clamp(22px,3.6vw,32px)]">{q.label[locale]}</h2>

      <div className="mt-7 flex flex-col gap-3">
        {q.options.map((opt, i) => {
          const active = answers[step] === i;
          return (
            <button
              key={i}
              type="button"
              onClick={() => pick(i)}
              className={`group flex items-start gap-4 border-[1.5px] bg-card p-4 text-left transition-[transform,box-shadow,border-color] hover:-translate-y-[2px] hover:shadow-[0_4px_0_#141414] ${
                active ? "border-ink shadow-[0_4px_0_#141414]" : "border-hairline hover:border-ink"
              }`}
            >
              <span
                className={`mt-[2px] grid h-6 w-6 flex-none place-items-center border-[1.5px] font-mono text-[11px] font-bold transition-colors ${
                  active
                    ? "border-accent bg-accent text-accent-ink"
                    : "border-hairline-strong bg-paper group-hover:border-accent group-hover:bg-accent group-hover:text-accent-ink"
                }`}
              >
                {String.fromCharCode(65 + i)}
              </span>
              <span className="text-[15.5px] leading-[1.45] font-semibold">{opt.label[locale]}</span>
            </button>
          );
        })}
      </div>

      {step > 0 && (
        <button
          type="button"
          onClick={() => setStep(step - 1)}
          className="draw-link mt-7 text-[13.5px] font-bold"
        >
          {t.back}
        </button>
      )}
    </div>
  );
}
