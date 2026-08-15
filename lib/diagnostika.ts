import type { AudienceId } from "@/lib/audiences";

/* ---------------------------------------------------------------------------
   Diagnostika AI zralosti — data a skórování.

   Čistý modul bez fs: importuje ho klientská komponenta AiDiagnostika
   i serverová stránka /nastroje/diagnostika (ta přes něj rozřeší slugy
   návodů a cest na skutečný obsah, takže se nikdy nevykreslí mrtvý odkaz).

   Škála úrovní 1–5 přebírá terminologii kapitoly prirucka/pet-urovni-ai:
   1 Chat · 2 Trvalý kontext · 3 Napojení na data · 4 Rutiny · 5 Agent.

   Skórování je deterministické: každá odpověď přidá body několika úrovním,
   vyhrává úroveň s nejvyšším PODÍLEM získaných bodů vůči maximu, které pro
   ni v dotazníku vůbec jde získat (prostý součet by zvýhodňoval prostřední
   úrovně — sbírají body z nejvíce otázek). Remízu rozhodne pevné pořadí:
   nižší úroveň vyhrává, protože žebřík se leze poctivě zdola.
--------------------------------------------------------------------------- */

export type Level = 1 | 2 | 3 | 4 | 5;

export const LEVELS_ORDER: Level[] = [1, 2, 3, 4, 5];

export type Bilingual = { cs: string; en: string };

export type AreaKey = "zaklady" | "zadavani" | "data" | "automatizace" | "duvera";

export type DiagOption = {
  label: Bilingual;
  /** Body pro úrovně 1–5 — váhy podle kapitoly pet-urovni-ai. */
  scores: Partial<Record<Level, number>>;
  /** Body do oblasti otázky (0–3) pro graf výsledku. */
  area: number;
};

export type DiagQuestion = {
  id: string;
  /** Oblast pro graf; otázka na profesi žádnou nemá. */
  area?: AreaKey;
  label: Bilingual;
  options: DiagOption[];
};

export const AREAS: { key: AreaKey; label: Bilingual }[] = [
  { key: "zaklady", label: { cs: "Návyk a záběr", en: "Habit and scope" } },
  { key: "zadavani", label: { cs: "Zadávání práce", en: "Giving instructions" } },
  { key: "data", label: { cs: "Kontext a data", en: "Context and data" } },
  { key: "automatizace", label: { cs: "Rutiny a agenti", en: "Routines and agents" } },
  { key: "duvera", label: { cs: "Ověřování a bezpečí", en: "Verification and safety" } },
];

/** Maximum bodů do oblasti za jednu otázku. */
export const AREA_OPTION_MAX = 3;

export const DIAG_QUESTIONS: DiagQuestion[] = [
  {
    id: "frekvence",
    area: "zaklady",
    label: {
      cs: "Jak často AI reálně používáte?",
      en: "How often do you actually use AI?",
    },
    options: [
      {
        label: {
          cs: "Výjimečně — párkrát jsem to zkusil(a)",
          en: "Rarely — I have tried it a few times",
        },
        scores: { 1: 3 },
        area: 0,
      },
      {
        label: { cs: "Párkrát týdně", en: "A few times a week" },
        scores: { 1: 2, 2: 1 },
        area: 1,
      },
      {
        label: {
          cs: "Denně, na dílčí úkoly",
          en: "Daily, for individual tasks",
        },
        scores: { 2: 2, 3: 1 },
        area: 2,
      },
      {
        label: {
          cs: "Denně — bez AI by můj pracovní den vypadal jinak",
          en: "Daily — my workday would look different without it",
        },
        scores: { 3: 2 },
        area: 3,
      },
    ],
  },
  {
    id: "ukoly",
    area: "zaklady",
    label: {
      cs: "Jaké úkoly AI nejčastěji dáváte?",
      en: "What kind of tasks do you give AI most often?",
    },
    options: [
      {
        label: {
          cs: "Zatím nic pravidelného — jednorázové dotazy",
          en: "Nothing regular yet — one-off questions",
        },
        scores: { 1: 3 },
        area: 0,
      },
      {
        label: {
          cs: "Přepsání textu, překlad, vysvětlení",
          en: "Rewriting text, translation, explanations",
        },
        scores: { 1: 1, 2: 2 },
        area: 1,
      },
      {
        label: {
          cs: "První návrhy mailů a dokumentů nad mými podklady",
          en: "First drafts of emails and documents from my own material",
        },
        scores: { 2: 1, 3: 2 },
        area: 2,
      },
      {
        label: {
          cs: "Vícekrokové úkoly: rešerše, srovnání, přípravu podkladů",
          en: "Multi-step tasks: research, comparisons, preparing briefs",
        },
        scores: { 5: 2 },
        area: 3,
      },
    ],
  },
  {
    id: "prompty",
    area: "zadavani",
    label: {
      cs: "Jak vznikají vaše zadání (prompty)?",
      en: "Where do your prompts come from?",
    },
    options: [
      {
        label: {
          cs: "Kopíruju hotové prompty z internetu, nebo píšu jednu větu",
          en: "I copy ready-made prompts from the internet, or type one sentence",
        },
        scores: { 1: 3 },
        area: 0,
      },
      {
        label: {
          cs: "Píšu vlastní, ale pokaždé trochu jinak",
          en: "I write my own, but differently every time",
        },
        scores: { 1: 1, 2: 1 },
        area: 1,
      },
      {
        label: {
          cs: "Vlastní zadání s rolí, kontextem a formátem — a doptávám se",
          en: "My own prompts with role, context and format — and I follow up",
        },
        scores: { 2: 2, 3: 1 },
        area: 2,
      },
      {
        label: {
          cs: "Mám knihovnu ověřených zadání, která recykluju",
          en: "I keep a library of proven prompts that I reuse",
        },
        scores: { 2: 1, 4: 1 },
        area: 3,
      },
    ],
  },
  {
    id: "kontext",
    area: "zadavani",
    label: {
      cs: "Kolikrát AI vysvětlujete, kdo jste a jak chcete výstupy?",
      en: "How often do you explain to AI who you are and how you want your outputs?",
    },
    options: [
      {
        label: {
          cs: "Pokaždé znovu — nebo vůbec",
          en: "Every single time — or not at all",
        },
        scores: { 1: 3 },
        area: 0,
      },
      {
        label: {
          cs: "Opakuju to ručně a štve mě to",
          en: "I repeat it by hand and it annoys me",
        },
        scores: { 1: 2, 2: 1 },
        area: 1,
      },
      {
        label: {
          cs: "Mám vlastní instrukce — nástroj to o mně ví",
          en: "I have custom instructions — the tool already knows",
        },
        scores: { 2: 3, 3: 1 },
        area: 2,
      },
      {
        label: {
          cs: "Instrukce i trvalé podklady; nový chat začíná rovnou prací",
          en: "Instructions plus standing reference material; a new chat starts with the work itself",
        },
        scores: { 2: 1, 3: 2 },
        area: 3,
      },
    ],
  },
  {
    id: "projekty",
    area: "data",
    label: {
      cs: "Používáte projekty či prostory s vlastními podklady?",
      en: "Do you use projects or spaces with your own reference material?",
    },
    options: [
      {
        label: { cs: "Nevím, co to je", en: "I do not know what that is" },
        scores: { 1: 2 },
        area: 0,
      },
      {
        label: {
          cs: "Vím o nich, zatím nepoužívám",
          en: "I know about them, not using them yet",
        },
        scores: { 1: 1, 2: 1 },
        area: 1,
      },
      {
        label: {
          cs: "Mám jeden dva projekty s podklady",
          en: "I have one or two projects with material in them",
        },
        scores: { 2: 2, 3: 1 },
        area: 2,
      },
      {
        label: {
          cs: "Každá větší práce má vlastní projekt s podklady",
          en: "Every bigger piece of work has its own project with material",
        },
        scores: { 2: 1, 3: 2 },
        area: 3,
      },
    ],
  },
  {
    id: "konektory",
    area: "data",
    label: {
      cs: "Má AI přímý přístup k vašim datům — poště, kalendáři, dokumentům?",
      en: "Does AI have direct access to your data — email, calendar, documents?",
    },
    options: [
      {
        label: {
          cs: "Nemá, všechno kopíruju ručně",
          en: "No, I copy everything in by hand",
        },
        scores: { 1: 1, 2: 1 },
        area: 0,
      },
      {
        label: {
          cs: "O konektorech (MCP) vím, nezkusil(a) jsem je",
          en: "I know about connectors (MCP), have not tried them",
        },
        scores: { 2: 2 },
        area: 1,
      },
      {
        label: {
          cs: "Mám připojený jeden zdroj",
          en: "I have one source connected",
        },
        scores: { 3: 3 },
        area: 2,
      },
      {
        label: {
          cs: "AI čte poštu, kalendář i dokumenty; oprávnění si hlídám",
          en: "AI reads my email, calendar and documents; I keep an eye on permissions",
        },
        scores: { 3: 3, 4: 1 },
        area: 3,
      },
    ],
  },
  {
    id: "rutiny",
    area: "automatizace",
    label: {
      cs: "Běží vám nějaká práce s AI sama — v čase, nebo na událost?",
      en: "Does any of your AI work run on its own — on a schedule, or on an event?",
    },
    options: [
      {
        label: {
          cs: "Ne, všechno spouštím ručně",
          en: "No, I start everything by hand",
        },
        scores: { 1: 1, 2: 1 },
        area: 0,
      },
      {
        label: {
          cs: "Opakovaně spouštím tu samou konverzaci — ručně",
          en: "I keep starting the same conversation over and over — by hand",
        },
        scores: { 3: 2 },
        area: 1,
      },
      {
        label: {
          cs: "Jedna rutina běží (třeba ranní pošta)",
          en: "One routine is running (say, the morning email pass)",
        },
        scores: { 4: 3 },
        area: 2,
      },
      {
        label: {
          cs: "Několik rutin; přicházím k hotovým návrhům a schvaluju",
          en: "Several routines; I arrive to finished drafts and approve them",
        },
        scores: { 4: 2, 5: 2 },
        area: 3,
      },
    ],
  },
  {
    id: "agent",
    area: "automatizace",
    label: {
      cs: "Když jde o větší úkol — rešerši, srovnání, projití složky…",
      en: "When a bigger task comes up — research, a comparison, going through a folder…",
    },
    options: [
      {
        label: {
          cs: "To AI nedávám, dělám to sám/sama",
          en: "I do not give that to AI, I do it myself",
        },
        scores: { 1: 2 },
        area: 0,
      },
      {
        label: {
          cs: "Rozdělím ho na kroky a vedu AI krok za krokem",
          en: "I break it into steps and walk AI through them one by one",
        },
        scores: { 2: 1, 3: 2 },
        area: 1,
      },
      {
        label: {
          cs: "Občas zadám cíl a nechám agenta pracovat",
          en: "Sometimes I set the goal and let an agent work",
        },
        scores: { 4: 1, 5: 2 },
        area: 2,
      },
      {
        label: {
          cs: "Agent je můj běžný nástroj: zadám cíl, zkontroluju výsledek",
          en: "An agent is an everyday tool: I set the goal and review the result",
        },
        scores: { 5: 4 },
        area: 3,
      },
    ],
  },
  {
    id: "overovani",
    area: "duvera",
    label: {
      cs: "Jak ověřujete výstupy AI?",
      en: "How do you verify AI outputs?",
    },
    options: [
      {
        label: {
          cs: "Většinou věřím tomu, co vypadne",
          en: "I mostly trust whatever comes out",
        },
        scores: { 1: 2 },
        area: 0,
      },
      {
        label: {
          cs: "Kontroluju čtením, podle citu",
          en: "I check by reading it through, by feel",
        },
        scores: { 1: 1, 2: 1 },
        area: 1,
      },
      {
        label: {
          cs: "U faktů chci zdroje a namátkou je kontroluju",
          en: "For facts I ask for sources and spot-check them",
        },
        scores: { 2: 1, 3: 1 },
        area: 2,
      },
      {
        label: {
          cs: "Chci u tvrzení odkaz, odkud jsou — mail, schůzka, verze dokumentu",
          en: "I want each claim to say where it came from — the email, the meeting, the document version",
        },
        scores: { 3: 2, 4: 1 },
        area: 3,
      },
    ],
  },
  {
    id: "citliva-data",
    area: "duvera",
    label: {
      cs: "Jak řešíte citlivá data?",
      en: "How do you handle sensitive data?",
    },
    options: [
      {
        label: {
          cs: "Neřeším — vkládám, co je zrovna po ruce",
          en: "I do not — I paste in whatever is at hand",
        },
        scores: { 1: 2 },
        area: 0,
      },
      {
        label: {
          cs: "Citlivé věci do AI nedávám vůbec",
          en: "Sensitive things never go into AI at all",
        },
        scores: { 2: 2 },
        area: 2,
      },
      {
        label: {
          cs: "Anonymizuju, nebo mám účet se smluvní ochranou dat",
          en: "I anonymise, or use an account with contractual data protection",
        },
        scores: { 3: 2 },
        area: 3,
      },
      {
        label: {
          cs: "Mám pravidla: co kam smí, a nejmenší možná oprávnění",
          en: "I have rules: what may go where, and least-possible permissions",
        },
        scores: { 3: 1, 4: 1 },
        area: 3,
      },
    ],
  },
  {
    id: "tym",
    label: {
      cs: "Používáte AI jen vy, nebo i váš tým?",
      en: "Is it just you using AI, or your team as well?",
    },
    options: [
      {
        label: { cs: "Jen já, spíš na zkoušku", en: "Just me, mostly experimenting" },
        scores: { 1: 1 },
        area: 0,
      },
      {
        label: {
          cs: "Já pravidelně, kolegové sem tam",
          en: "Me regularly, colleagues here and there",
        },
        scores: { 2: 1 },
        area: 1,
      },
      {
        label: {
          cs: "Tým sdílí zadání a postupy",
          en: "The team shares prompts and workflows",
        },
        scores: { 3: 1, 4: 1 },
        area: 2,
      },
      {
        label: {
          cs: "Máme společné rutiny, pravidla a sdílené projekty",
          en: "We run shared routines, rules and projects",
        },
        scores: { 4: 1, 5: 1 },
        area: 3,
      },
    ],
  },
];

/** Otázka na profesi je poslední a neskóruje — mapuje na lib/audiences. */
export const PROFESSION_QUESTION_LABEL: Bilingual = {
  cs: "A čím se živíte? (Podle toho vybereme návody.)",
  en: "And what do you do for a living? (We pick the guides accordingly.)",
};

export const PROFESSION_NONE_LABEL: Bilingual = {
  cs: "Něco jiného / nechci uvádět",
  en: "Something else / prefer not to say",
};

/* -------------------------------------------------------------------------- */
/*  Úrovně — názvy a texty drží terminologii kapitoly pet-urovni-ai            */
/* -------------------------------------------------------------------------- */

export type LevelInfo = {
  level: Level;
  name: Bilingual;
  /** Dvě věty: co ta úroveň znamená. */
  meaning: Bilingual;
  /** Co se konkrétně změní na další úrovni (u pětky: kam dál). */
  nextTitle: Bilingual;
  nextDesc: Bilingual;
};

export const LEVEL_INFO: Record<Level, LevelInfo> = {
  1: {
    level: 1,
    name: { cs: "Chat", en: "Chat" },
    meaning: {
      cs: "AI o vás nic neví a kontext jí nosíte v ruce — každou konverzaci začínáte vysvětlováním, kdo jste a co chcete. I tak vám přepíše kostrbatý mail nebo vysvětlí smlouvu, jen se každé ráno začíná od nuly.",
      en: "AI knows nothing about you and you carry the context in by hand — every conversation starts with explaining who you are and what you want. It will still rewrite a clunky email or explain a contract, but every morning starts from zero.",
    },
    nextTitle: { cs: "Vaše další úroveň: Trvalý kontext", en: "Your next level: Persistent context" },
    nextDesc: {
      cs: "Co byste jinak psali na začátku každé konverzace, napíšete jednou — kdo jste, pro koho píšete, jak má vypadat výstup. Kvalita prvního návrhu skočí nahoru a hlavně se stane předvídatelnou; stojí to deset až třicet minut jednou za život.",
      en: "What you would otherwise type at the start of every conversation, you write once — who you are, who you write for, what the output should look like. First drafts jump in quality and, more importantly, become predictable; it costs ten to thirty minutes, once.",
    },
  },
  2: {
    level: 2,
    name: { cs: "Trvalý kontext", en: "Persistent context" },
    meaning: {
      cs: "AI ví, kdo jste, na čem děláte a jak chcete výstupy — nemusíte to opakovat a první návrhy jsou předvídatelné. Podklady jí ale pořád nosíte ručně: kopírujete maily, dohledáváte termíny, hledáte poslední verze dokumentů.",
      en: "AI knows who you are, what you work on and how you want your outputs — no repeating yourself, and first drafts are predictable. But you still carry the material in by hand: copying emails, chasing dates, hunting for the latest version of a document.",
    },
    nextTitle: { cs: "Vaše další úroveň: Napojení na data", en: "Your next level: Connected to your data" },
    nextDesc: {
      cs: "AI dostane přes konektory (MCP) přímý přístup ke schránce, kalendáři a dokumentům — a vy přestanete dělat poslíčka. Místo „tady máš text mailu, napiš odpověď“ se ptáte „co ode mě dneska kdo potřebuje a co s tím“.",
      en: "Through connectors (MCP), AI gets direct access to your inbox, calendar and documents — and you stop being the courier. Instead of “here is the email, write a reply” you ask “who needs what from me today, and what shall we do about it”.",
    },
  },
  3: {
    level: 3,
    name: { cs: "Napojení na data", en: "Connected to your data" },
    meaning: {
      cs: "AI si sama přečte poštu, kalendář i dokumenty a odpovědi vznikají nad skutečnými daty — vidí souvislosti, které v jednom zkopírovaném mailu nejsou. Pořád se ale nic nestane, dokud si nevzpomenete a nespustíte to sami.",
      en: "AI reads your email, calendar and documents itself, and answers are built on real data — it sees connections that a single pasted email cannot hold. But nothing happens until you remember to start it yourself.",
    },
    nextTitle: { cs: "Vaše další úroveň: Rutiny", en: "Your next level: Routines" },
    nextDesc: {
      cs: "Jednou popsaná práce se spouští sama — ráno v sedm projde poštu a připraví koncepty, v pátek sestaví přehled týdne. Z iniciátora se stáváte schvalovatelem: přicházíte k hotovým návrhům a rozhodujete, co s nimi.",
      en: "Work described once starts running on its own — at seven it goes through the mail and drafts replies, on Friday it builds the week's summary. You change from initiator to approver: you arrive to finished drafts and decide what happens to them.",
    },
  },
  4: {
    level: 4,
    name: { cs: "Rutiny", en: "Routines" },
    meaning: {
      cs: "Část práce běží bez vás, v určený čas, a vy schvalujete hotové návrhy — kontrola trvá vteřiny, psaní od nuly minuty. Přesně tenhle obchod jste udělali a vyplácí se každý den.",
      en: "Part of the work runs without you, at set times, and you approve finished drafts — review takes seconds where writing from scratch took minutes. That is exactly the trade you made, and it pays out daily.",
    },
    nextTitle: { cs: "Vaše další úroveň: Agent", en: "Your next level: Agent" },
    nextDesc: {
      cs: "Nezadáváte krok, ale cíl: agent si vícekrokový úkol rozloží, použije nástroje a vrátí hotový výsledek — rešerši, srovnání, podklad na jednání. Dvojnásob tu platí, že AI smí připravovat, ne uzavírat: nevratné akce vyžadují váš podpis.",
      en: "You stop assigning steps and assign the goal: an agent breaks a multi-step task down, uses its tools and returns a finished result — research, a comparison, a meeting brief. Here it goes double that AI may prepare but not conclude: irreversible actions need your signature.",
    },
  },
  5: {
    level: 5,
    name: { cs: "Agent", en: "Agent" },
    meaning: {
      cs: "Zadáváte cíl, agent si práci rozloží a odpracuje ji sám — rešerše, srovnání, přípravu podkladů. Čím dál větší část vaší práce je posuzování cizích výstupů, a tím cennější je odbornost, kterou posuzujete.",
      en: "You set the goal and the agent breaks the work down and does it — research, comparisons, preparing briefs. An ever larger share of your work is judging someone else's output, which makes your own expertise more valuable, not less.",
    },
    nextTitle: { cs: "Kam dál z nejvyšší příčky", en: "Where to go from the top rung" },
    nextDesc: {
      cs: "Výš už žebřík nevede — teď se počítá spolehlivost a šířka: víc dobře popsaných rutin, subagenti na dílčí role a přenesení žebříku z jednoho člověka na celý tým či firmu. A kontrolní bod zůstává: AI navrhuje, vy schvalujete.",
      en: "The ladder has no higher rung — what counts now is reliability and reach: more well-described routines, subagents for partial roles, and moving the ladder from one person to the whole team or company. The checkpoint stays: AI drafts, you approve.",
    },
  },
};

/* -------------------------------------------------------------------------- */
/*  Mapování úroveň + profese → návody a cesta                                 */
/* -------------------------------------------------------------------------- */

/**
 * Základní trojice návodů podle úrovně — v doporučeném pořadí.
 * Slugy musí existovat v content/tipy/; stránka je při buildu rozřeší
 * přes getTip a chybějící vynechá (s console.warn jako lib/paths).
 */
export const LEVEL_TIPS: Record<Level, string[]> = {
  1: ["ai-zacatecnik-instalace-a-rozdily", "ai-prvni-krok", "ai-role-a-kontext"],
  2: ["ai-vlastni-instrukce", "ai-projekty-kontext", "ai-knihovna-promptu"],
  3: ["mcp-konektory-usb-c-pro-ai", "mcp-konektory-nastroje", "claude-rutiny-posta-kalendar"],
  4: ["claude-rutiny-posta-kalendar", "rutina-ai-drafty-mailu", "n8n-zapier-ai-automatizace"],
  5: ["claude-code-osobni-automatizace", "claude-subagenti-nechte-ai-ridit-ai", "ai-ve-firme-kompletni-pruvodce"],
};

/**
 * Profesní vsuvka: na druhé místo trojice se vloží návod pro danou profesi.
 * `low` platí pro úrovně 1–2, `high` pro 3–5. Duplicitní slug se vynechá
 * a doplní se třetí návod úrovně, takže výsledek jsou vždy až tři položky.
 */
export const PROFESSION_TIPS: Record<AudienceId, { low: string; high: string }> = {
  ucitel: { low: "ucitel-priprava-hodin-ai", high: "ucitel-administrativa-ai" },
  student: { low: "ai-vysvetleni-latky", high: "bakalarka-s-ai-poctivy-workflow" },
  manazer: { low: "ai-zapis-z-porady", high: "porady-system-s-ai" },
  marketer: { low: "znacka-ton-hlasu-ai", high: "obsahova-tovarna-ai" },
  vyvojar: { low: "github-copilot", high: "claude-code-osobni-automatizace" },
  freelancer: { low: "smlouva-pred-podpisem-ai", high: "sablony-z-odeslane-posty-ai" },
  rodic: { low: "ai-v-rodine-vychova-hry-pohadky", high: "jidelnicek-a-nakupni-seznam-ai" },
};

/** Doporučené návody pro úroveň a (volitelnou) profesi — v pořadí, max 3. */
export function recommendedTipSlugs(level: Level, professionId: AudienceId | null): string[] {
  const base = LEVEL_TIPS[level];
  if (!professionId) return base.slice(0, 3);
  const prof = PROFESSION_TIPS[professionId][level <= 2 ? "low" : "high"];
  const ordered = [base[0], prof, ...base.slice(1)];
  const seen = new Set<string>();
  const out: string[] = [];
  for (const slug of ordered) {
    if (seen.has(slug)) continue;
    seen.add(slug);
    out.push(slug);
    if (out.length === 3) break;
  }
  return out;
}

/** Id cest z lib/paths, na které diagnostika odkazuje. */
export const DIAG_PATH_IDS = [
  "prvnich-14-dni-s-ai",
  "ai-ve-firme-od-pilotu-k-provozu",
  "data-bez-tabulkoveho-pekla",
  "klidnejsi-domacnost",
] as const;

/**
 * Jedna doporučená cesta: úrovně 1–2 vedou na začátečnickou čtrnáctidenku,
 * od trojky výš rozhoduje profese — manažer staví firmu, rodič domácnost,
 * ostatní si vezmou data (nejuniverzálnější pokročilá cesta).
 */
export function recommendedPathId(level: Level, professionId: AudienceId | null): string {
  if (level <= 2) return "prvnich-14-dni-s-ai";
  if (professionId === "manazer") return "ai-ve-firme-od-pilotu-k-provozu";
  if (professionId === "rodic") return "klidnejsi-domacnost";
  return "data-bez-tabulkoveho-pekla";
}

/** Všechny slugy návodů, na které diagnostika může odkázat — pro rozřešení na serveru. */
export function collectDiagTipSlugs(): string[] {
  const slugs = new Set<string>();
  for (const level of LEVELS_ORDER) for (const s of LEVEL_TIPS[level]) slugs.add(s);
  for (const p of Object.values(PROFESSION_TIPS)) {
    slugs.add(p.low);
    slugs.add(p.high);
  }
  return [...slugs];
}

/* -------------------------------------------------------------------------- */
/*  Skórování                                                                  */
/* -------------------------------------------------------------------------- */

export type DiagResult = {
  level: Level;
  /** Hrubé body na úroveň. */
  totals: Record<Level, number>;
  /** Podíl získaných bodů vůči maximu úrovně (0–1) — o vítězi rozhoduje tenhle. */
  ratios: Record<Level, number>;
  /** Skóre oblastí v procentech (0–100) pro graf. */
  areas: { key: AreaKey; pct: number }[];
};

/** Maximum bodů, které úroveň může v celém dotazníku získat. */
function maxPerLevel(): Record<Level, number> {
  const max: Record<Level, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const q of DIAG_QUESTIONS) {
    for (const level of LEVELS_ORDER) {
      let best = 0;
      for (const opt of q.options) best = Math.max(best, opt.scores[level] ?? 0);
      max[level] += best;
    }
  }
  return max;
}

const LEVEL_MAX = maxPerLevel();

/**
 * Deterministické vyhodnocení: žádná náhoda, remízu rozhodne nižší úroveň
 * (pevné pořadí LEVELS_ORDER — žebřík se leze zdola).
 */
export function scoreDiag(answers: (number | null)[]): DiagResult {
  const totals: Record<Level, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const areaGot = new Map<AreaKey, number>();
  const areaMax = new Map<AreaKey, number>();

  DIAG_QUESTIONS.forEach((q, qi) => {
    if (q.area) {
      areaMax.set(q.area, (areaMax.get(q.area) ?? 0) + AREA_OPTION_MAX);
    }
    const pick = answers[qi];
    if (pick === null || pick === undefined) return;
    const opt = q.options[pick];
    if (!opt) return;
    for (const level of LEVELS_ORDER) {
      totals[level] += opt.scores[level] ?? 0;
    }
    if (q.area) {
      areaGot.set(q.area, (areaGot.get(q.area) ?? 0) + opt.area);
    }
  });

  const ratios: Record<Level, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  for (const level of LEVELS_ORDER) {
    ratios[level] = LEVEL_MAX[level] > 0 ? totals[level] / LEVEL_MAX[level] : 0;
  }

  let level: Level = 1;
  for (const candidate of LEVELS_ORDER) {
    // Ostrá nerovnost = při shodě podílů zůstává nižší úroveň.
    if (ratios[candidate] > ratios[level]) level = candidate;
  }

  const areas = AREAS.map((a) => {
    const max = areaMax.get(a.key) ?? 0;
    const got = areaGot.get(a.key) ?? 0;
    return { key: a.key, pct: max > 0 ? Math.round((got / max) * 100) : 0 };
  });

  return { level, totals, ratios, areas };
}

export function isLevel(x: number): x is Level {
  return Number.isInteger(x) && x >= 1 && x <= 5;
}
