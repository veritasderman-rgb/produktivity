// Slovník pojmů: tooltipy v článcích + stránka /slovnik.
// match = regulární výraz (bez lomítek, case-insensitive) pokrývající i české pády/tvary.
// Pozor: JS \w nezahrnuje česká písmena s diakritikou, proto koncovky, které mohou
// obsahovat í/ý/é/ů/ě apod., používají třídu [\wáčďéěíňóřšťúůýž].
// def: 1–2 věty, srozumitelné laikovi. ZÁKAZ znaků " < > { } v definicích (rozbily by MDX/JSX atribut).

export type GlossaryEntry = {
  id: string;
  term: { cs: string; en: string };
  match: { cs: string; en: string };
  def: { cs: string; en: string };
};

export const glossary: GlossaryEntry[] = [
  {
    id: "agent",
    term: { cs: "agent", en: "agent" },
    match: {
      cs: "\\bagent(?!u[rř])[\\wáčďéěíňóřšťúůýž]*",
      en: "\\b(?:AI )?agents?\\b",
    },
    def: {
      cs: "Program s AI, který dostane cíl a sám volí kroky k jeho splnění — čte data, volá nástroje a pracuje i několik minut bez dalšího zadání.",
      en: "A program powered by AI that is given a goal and picks its own steps to reach it — reading data, calling tools and working for minutes without further input.",
    },
  },
  {
    id: "anonymizace",
    term: { cs: "anonymizace", en: "anonymisation" },
    match: {
      cs: "\\banonymiz[\\wáčďéěíňóřšťúůýž]*",
      en: "\\banonymi[sz]\\w*",
    },
    def: {
      cs: "Odstranění nebo nahrazení údajů, podle kterých by šlo poznat konkrétní osobu. Používá se dřív, než data pošlete do AI nebo jiné externí služby.",
      en: "Removing or replacing details that could identify a specific person. Done before sending data to an AI or any other outside service.",
    },
  },
  {
    id: "api",
    term: { cs: "API", en: "API" },
    match: {
      cs: "\\bAPI\\b(?!\\s*kl[ií])",
      en: "\\bAPIs?\\b(?!\\s*key)",
    },
    def: {
      cs: "Rozhraní, přes které spolu programy mluví bez člověka. Díky němu si vaše aplikace může sama vyžádat data nebo funkci jiné služby.",
      en: "An interface that lets programs talk to each other without a human. Through it your app can request data or a function from another service.",
    },
  },
  {
    id: "api-klic",
    term: { cs: "API klíč", en: "API key" },
    match: {
      cs: "\\bAPI[\\s-]?kl[ií]č[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bAPI keys?\\b",
    },
    def: {
      cs: "Tajný řetězec znaků, kterým se vaše aplikace přihlašuje k API jiné služby. Kdo klíč získá, může službu používat na váš účet, proto se nesdílí.",
      en: "A secret string your app uses to sign in to another service API. Anyone who gets the key can use the service on your account, so it is never shared.",
    },
  },
  {
    id: "artefakt",
    term: { cs: "artefakt", en: "artifact" },
    match: {
      cs: "\\bartefakt[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bartifacts?\\b",
    },
    def: {
      cs: "Hotový výstup, který AI vytvoří jako samostatný dokument nebo aplikaci — třeba tabulku, web nebo kalkulačku, kterou lze rovnou otevřít a sdílet.",
      en: "A finished output the AI produces as a standalone document or app — a table, a web page or a calculator you can open and share right away.",
    },
  },
  {
    id: "ats",
    term: { cs: "ATS", en: "ATS" },
    match: { cs: "\\bATS\\b", en: "\\bATS\\b" },
    def: {
      cs: "Software, přes který firmy přijímají a třídí životopisy. Než se na vás podívá člověk, projde váš životopis nejdřív tímto systémem.",
      en: "Software companies use to receive and sort job applications. Your CV usually passes through it before any human reads it.",
    },
  },
  {
    id: "batna",
    term: { cs: "BATNA", en: "BATNA" },
    match: { cs: "\\bBATNA\\b", en: "\\bBATNA\\b" },
    def: {
      cs: "Nejlepší varianta, kterou máte, když se nedohodnete. Čím lepší je vaše BATNA, tím klidněji můžete vyjednávat.",
      en: "The best option you have if the negotiation fails. The stronger your BATNA, the calmer you can negotiate.",
    },
  },
  {
    id: "cash-flow",
    term: { cs: "cash flow", en: "cash flow" },
    match: { cs: "\\bcash[\\s-]?flow\\b", en: "\\bcash[\\s-]?flow\\b" },
    def: {
      cs: "Skutečný pohyb peněz na účtu — kolik jich přiteče a kolik odteče. Firma může být zisková a přesto skončit, když jí dojde hotovost.",
      en: "The real movement of money in and out of your account. A business can be profitable and still fail when it runs out of cash.",
    },
  },
  {
    id: "cloud",
    term: { cs: "cloud", en: "cloud" },
    match: {
      cs: "\\bcloud[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bcloud\\b",
    },
    def: {
      cs: "Cizí servery, na kterých běží služba a leží vaše data. Přistupujete k nim přes internet a o techniku se stará poskytovatel.",
      en: "Someone else's servers where a service runs and your data lives. You reach them over the internet and the provider handles the hardware.",
    },
  },
  {
    id: "crm",
    term: { cs: "CRM", en: "CRM" },
    match: { cs: "\\bCRM\\b", en: "\\bCRM\\b" },
    def: {
      cs: "Systém, kde firma vede přehled o zákaznících a obchodech — kontakty, historii komunikace a stav jednotlivých příležitostí.",
      en: "A system where a company tracks customers and deals — contacts, past conversations and the status of each opportunity.",
    },
  },
  {
    id: "csv",
    term: { cs: "CSV", en: "CSV" },
    match: { cs: "\\bCSV\\b", en: "\\bCSV\\b" },
    def: {
      cs: "Jednoduchý textový formát tabulky, kde jsou hodnoty oddělené čárkou nebo středníkem. Otevře ho Excel i Tabulky Google a přečte ho skoro každý program.",
      en: "A plain text table format where values are separated by commas or semicolons. Excel and Google Sheets open it, and nearly every program reads it.",
    },
  },
  {
    id: "decision-fatigue",
    term: { cs: "decision fatigue", en: "decision fatigue" },
    match: {
      cs: "\\bdecision fatigue\\b|\\brozhodovac[\\wáčďéěíňóřšťúůýž]+\\s+únav[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bdecision fatigue\\b",
    },
    def: {
      cs: "Rozhodovací únava — po mnoha volbách během dne klesá kvalita dalších rozhodnutí. Proto se důležité věci řeší ráno a rutiny se automatizují.",
      en: "The drop in decision quality after making many choices in a day. It is why important calls belong in the morning and routine ones get automated.",
    },
  },
  {
    id: "dpa",
    term: { cs: "DPA (zpracovatelská smlouva)", en: "DPA (data processing agreement)" },
    match: {
      cs: "\\bDPA\\b|\\bzpracovatelsk[\\wáčďéěíňóřšťúůýž]+\\s+sml(?:ou|u)v[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bDPAs?\\b|\\bdata processing agreements?\\b",
    },
    def: {
      cs: "Smlouva o zpracování osobních údajů mezi vámi a dodavatelem, který s daty pracuje. Podle GDPR ji potřebujete dřív, než firemní data nasypete do cizího nástroje.",
      en: "A data processing agreement between you and a vendor that handles personal data. GDPR requires one before you put company data into an outside tool.",
    },
  },
  {
    id: "druhy-mozek",
    term: { cs: "druhý mozek", en: "second brain" },
    match: {
      cs: "\\bdruh[\\wáčďéěíňóřšťúůýž]+\\s+moz[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bsecond brains?\\b",
    },
    def: {
      cs: "Externí systém poznámek, kam ukládáte nápady, úkoly a odkazy, abyste si je nemuseli pamatovat. Hlava pak slouží k přemýšlení, ne k archivaci.",
      en: "An outside notes system where you store ideas, tasks and links so you do not have to remember them. Your head is then free to think, not to archive.",
    },
  },
  {
    id: "endpoint",
    term: { cs: "endpoint", en: "endpoint" },
    match: {
      cs: "\\bendpoint[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bendpoints?\\b",
    },
    def: {
      cs: "Konkrétní adresa API, na kterou se posílá požadavek. Každý endpoint umí jednu věc, třeba vrátit seznam faktur nebo založit nový kontakt.",
      en: "A specific API address you send a request to. Each endpoint does one thing, such as returning a list of invoices or creating a contact.",
    },
  },
  {
    id: "erp",
    term: { cs: "ERP", en: "ERP" },
    match: { cs: "\\bERP\\b", en: "\\bERP\\b" },
    def: {
      cs: "Páteřní firemní systém, který na jednom místě drží sklad, účetnictví, objednávky a mzdy. Data zadaná v jedné části se propíší do ostatních.",
      en: "The backbone company system holding inventory, accounting, orders and payroll in one place. Data entered in one part flows into the rest.",
    },
  },
  {
    id: "eu-ai-act",
    term: { cs: "EU AI Act", en: "EU AI Act" },
    match: {
      cs: "\\b(?:EU )?AI Act[\\wáčďéěíňóřšťúůýž]*",
      en: "\\b(?:EU )?AI Act\\b",
    },
    def: {
      cs: "Evropské nařízení, které dělí systémy s AI podle míry rizika a podle toho jim ukládá povinnosti. Nejpřísnější pravidla platí pro vysoce rizikové oblasti, jako je nábor nebo úvěry.",
      en: "The European regulation that sorts AI systems by risk level and sets duties accordingly. The strictest rules apply to high risk uses such as hiring or lending.",
    },
  },
  {
    id: "few-shot",
    term: { cs: "few-shot (ukázky v promptu)", en: "few-shot (examples in the prompt)" },
    match: {
      cs: "\\bfew[\\s-]?shot[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bfew[\\s-]?shot\\b",
    },
    def: {
      cs: "Technika promptu, kdy do zadání přidáte pár hotových ukázek požadovaného výstupu. AI z nich odkouká formát i styl lépe než z pouhého popisu.",
      en: "A prompting technique where you add a few finished examples of the output you want. The AI picks up format and tone from them better than from a description.",
    },
  },
  {
    id: "gdpr",
    term: { cs: "GDPR", en: "GDPR" },
    match: { cs: "\\bGDPR\\b", en: "\\bGDPR\\b" },
    def: {
      cs: "Evropské nařízení o ochraně osobních údajů. Určuje, kdy smíte data o lidech sbírat, jak dlouho je držet a co musíte lidem umožnit.",
      en: "The European data protection regulation. It sets when you may collect data about people, how long you may keep it and what rights you must honour.",
    },
  },
  {
    id: "gtd",
    term: { cs: "GTD", en: "GTD" },
    match: {
      cs: "\\bGTD\\b|\\bGetting Things Done\\b",
      en: "\\bGTD\\b|\\bGetting Things Done\\b",
    },
    def: {
      cs: "Metoda Getting Things Done: všechny úkoly dostat z hlavy do jednoho seznamu, rozdělit je podle kontextu a systém pravidelně procházet.",
      en: "The Getting Things Done method: move every task out of your head into one list, sort tasks by context and review the system regularly.",
    },
  },
  {
    id: "halucinace",
    term: { cs: "halucinace", en: "hallucination" },
    match: {
      cs: "\\bhalucin[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bhallucinat\\w*|\\bhallucinations?\\b",
    },
    def: {
      cs: "Situace, kdy si AI odpověď vymyslí a podá ji sebejistě jako fakt. Stává se to hlavně u čísel, citací a odkazů, proto je potřeba je ověřovat.",
      en: "When an AI makes an answer up and states it confidently as fact. It happens most with numbers, quotes and links, so those need checking.",
    },
  },
  {
    id: "hloubkova-reserse",
    term: { cs: "hloubková rešerše", en: "deep research" },
    match: {
      cs: "\\bhloubkov[\\wáčďéěíňóřšťúůýž]+\\s+rešerš[\\wáčďéěíňóřšťúůýž]*|\\bdeep research\\b",
      en: "\\bdeep research\\b",
    },
    def: {
      cs: "Režim, ve kterém AI několik minut sama prochází desítky zdrojů a pak vrátí souhrn s odkazy. Hodí se na průzkum trhu nebo srovnání dodavatelů.",
      en: "A mode where the AI spends minutes browsing dozens of sources on its own and returns a summary with links. Good for market research or vendor comparisons.",
    },
  },
  {
    id: "human-in-the-loop",
    term: { cs: "human-in-the-loop", en: "human-in-the-loop" },
    match: {
      cs: "\\bhuman[\\s-]?in[\\s-]?the[\\s-]?loop\\b",
      en: "\\bhuman[\\s-]?in[\\s-]?the[\\s-]?loop\\b",
    },
    def: {
      cs: "Zapojení člověka do rozhodujícího kroku automatizace — AI výstup připraví, ale odeslat nebo schválit ho musí člověk.",
      en: "Keeping a person in the deciding step of an automation — the AI prepares the output, but a human approves or sends it.",
    },
  },
  {
    id: "inbox-zero",
    term: { cs: "Inbox Zero", en: "Inbox Zero" },
    match: { cs: "\\binbox zero\\b", en: "\\binbox zero\\b" },
    def: {
      cs: "Návyk, kdy schránku pravidelně vyprázdníte na nulu — každý e-mail buď smažete, vyřídíte, delegujete, nebo z něj uděláte úkol.",
      en: "The habit of emptying your inbox to zero — each email is deleted, answered, delegated or turned into a task.",
    },
  },
  {
    id: "jazykovy-model",
    term: { cs: "jazykový model (LLM)", en: "language model (LLM)" },
    match: {
      cs: "\\bLLM[\\wáčďéěíňóřšťúůýž]*|\\bjazykov[\\wáčďéěíňóřšťúůýž]+\\s+model[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bLLMs?\\b|\\b(?:large )?language models?\\b",
    },
    def: {
      cs: "Program natrénovaný na obrovském množství textu, který předpovídá další slova. Na tomto principu stojí ChatGPT, Claude i Gemini.",
      en: "A program trained on huge amounts of text that predicts what words come next. ChatGPT, Claude and Gemini are all built on this.",
    },
  },
  {
    id: "konektor",
    term: { cs: "konektor", en: "connector" },
    match: {
      cs: "\\bkonektor[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bconnectors?\\b",
    },
    def: {
      cs: "Propojení AI s konkrétní službou, třeba s Gmailem, Kalendářem nebo Diskem. Po připojení může AI číst a zapisovat přímo tam, bez kopírování.",
      en: "A link between the AI and a specific service such as Gmail, Calendar or Drive. Once connected, the AI reads and writes there directly, with no copy and paste.",
    },
  },
  {
    id: "kontextove-okno",
    term: { cs: "kontextové okno", en: "context window" },
    match: {
      cs: "\\bkontextov[\\wáčďéěíňóřšťúůýž]+\\s+ok[ne][\\wáčďéěíňóřšťúůýž]*",
      en: "\\bcontext windows?\\b",
    },
    def: {
      cs: "Kolik textu si model dokáže naráz držet v paměti — zadání i vlastní odpověď dohromady. Když se limit překročí, začátek konverzace vypadne.",
      en: "How much text the model can hold in mind at once, the prompt and its own answer together. Go past the limit and the start of the conversation drops out.",
    },
  },
  {
    id: "kontingencni-tabulka",
    term: { cs: "kontingenční tabulka", en: "pivot table" },
    match: {
      cs: "\\bkontingenčn[\\wáčďéěíňóřšťúůýž]+\\s+tabul[\\wáčďéěíňóřšťúůýž]*|\\bpivot[\\s-]?tabul[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bpivot tables?\\b",
    },
    def: {
      cs: "Nástroj v Excelu a Tabulkách Google, který ze seznamu řádků udělá souhrn — třeba tržby po měsících a po produktech, bez psaní vzorců.",
      en: "A tool in Excel and Google Sheets that turns a list of rows into a summary — sales by month and product, for instance, with no formulas.",
    },
  },
  {
    id: "markdown",
    term: { cs: "markdown", en: "markdown" },
    match: {
      cs: "\\bmarkdown[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bmarkdown\\b",
    },
    def: {
      cs: "Způsob formátování textu pomocí obyčejných znaků — hvězdičky dělají tučné písmo, mřížky nadpisy. Zůstává čitelný pro člověka i pro stroj.",
      en: "A way of formatting text with plain characters — asterisks make bold, hashes make headings. It stays readable for both people and machines.",
    },
  },
  {
    id: "mcp",
    term: { cs: "MCP", en: "MCP" },
    match: { cs: "\\bMCP\\b", en: "\\bMCP\\b" },
    def: {
      cs: "Otevřený standard, kterým se AI připojuje k nástrojům a datům. Díky němu stačí jedno propojení, které funguje napříč různými aplikacemi.",
      en: "An open standard for connecting AI to tools and data. One integration is enough, and it works across different applications.",
    },
  },
  {
    id: "ocr",
    term: { cs: "OCR", en: "OCR" },
    match: { cs: "\\bOCR\\b", en: "\\bOCR\\b" },
    def: {
      cs: "Převod obrázku nebo skenu na text, ve kterém lze hledat a kopírovat. Používá se u vyfocených účtenek, smluv a starých dokumentů.",
      en: "Turning an image or a scan into text you can search and copy. Used for photographed receipts, contracts and old documents.",
    },
  },
  {
    id: "open-source",
    term: { cs: "open source", en: "open source" },
    match: {
      cs: "\\bopen[\\s-]?source\\w*",
      en: "\\bopen[\\s-]?source\\b",
    },
    def: {
      cs: "Software se zveřejněným zdrojovým kódem, který si kdokoli může prohlédnout, upravit a provozovat u sebe. Bývá zdarma, ale péči o něj platíte časem.",
      en: "Software whose source code is public, so anyone can inspect it, change it and run it themselves. Usually free of charge, but maintenance costs you time.",
    },
  },
  {
    id: "orchestrace",
    term: { cs: "orchestrace", en: "orchestration" },
    match: {
      cs: "\\borchestr[\\wáčďéěíňóřšťúůýž]*",
      en: "\\borchestrat\\w*",
    },
    def: {
      cs: "Řízení více kroků nebo více AI agentů tak, aby na sebe navazovaly. Někdo musí určit pořadí, předat výsledky dál a ohlídat chyby.",
      en: "Coordinating several steps or several AI agents so they follow on from each other. Something has to set the order, pass results along and catch errors.",
    },
  },
  {
    id: "planovana-uloha",
    term: { cs: "plánovaná úloha", en: "scheduled task" },
    match: {
      cs: "\\bplánovan[\\wáčďéěíňóřšťúůýž]+\\s+úlo[hz][\\wáčďéěíňóřšťúůýž]*",
      en: "\\bscheduled tasks?\\b",
    },
    def: {
      cs: "Zadání, které se spustí samo v určený čas nebo interval — třeba každé pondělí ráno připravit souhrn týdne a poslat ho e-mailem.",
      en: "An instruction that runs by itself at a set time or interval — preparing a weekly summary every Monday morning and emailing it, for example.",
    },
  },
  {
    id: "pomodoro",
    term: { cs: "Pomodoro", en: "Pomodoro" },
    match: {
      cs: "\\bpomodor[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bpomodoros?\\b",
    },
    def: {
      cs: "Práce v blocích zhruba 25 minut, mezi nimi krátká pauza. Po čtyřech blocích přijde delší přestávka.",
      en: "Working in blocks of about 25 minutes with a short break between them. After four blocks you take a longer break.",
    },
  },
  {
    id: "prompt",
    term: { cs: "prompt", en: "prompt" },
    match: { cs: "\\bprompt\\w*", en: "\\bprompts?\\b" },
    def: {
      cs: "Zadání pro AI — text, kterým jí říkáte, co má udělat. Čím konkrétnější prompt, tím lepší výsledek.",
      en: "The instruction you give an AI — the text that tells it what to do. The more specific the prompt, the better the result.",
    },
  },
  {
    id: "rss",
    term: { cs: "RSS", en: "RSS" },
    match: { cs: "\\bRSS\\b", en: "\\bRSS\\b" },
    def: {
      cs: "Formát, kterým weby zveřejňují seznam novinek. Ve čtečce tak sledujete desítky zdrojů na jednom místě a bez algoritmu.",
      en: "A format websites use to publish their list of new posts. In a reader you follow dozens of sources in one place, with no algorithm in between.",
    },
  },
  {
    id: "shadow-ai",
    term: { cs: "shadow AI", en: "shadow AI" },
    match: {
      cs: "\\bshadow AI\\b|\\bstínov[\\wáčďéěíňóřšťúůýž]+\\s+AI\\b",
      en: "\\bshadow AI\\b",
    },
    def: {
      cs: "Používání AI nástrojů zaměstnanci mimo vědomí firmy. Riziko je hlavně v tom, že firemní data končí ve službách, které nikdo neprověřil.",
      en: "Employees using AI tools without the company knowing. The main risk is company data ending up in services nobody has vetted.",
    },
  },
  {
    id: "sso",
    term: { cs: "SSO", en: "SSO" },
    match: { cs: "\\bSSO\\b", en: "\\bSSO\\b|\\bsingle sign[\\s-]?on\\b" },
    def: {
      cs: "Jedno přihlášení do všech firemních aplikací. Zaměstnanci si nepamatují další hesla a při odchodu stačí zrušit jediný účet.",
      en: "One login for all company applications. Staff remember no extra passwords, and when someone leaves you disable a single account.",
    },
  },
  {
    id: "subagent",
    term: { cs: "subagent", en: "subagent" },
    match: {
      cs: "\\bsubagent(?!u[rř])[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bsub[\\s-]?agents?\\b",
    },
    def: {
      cs: "Pomocný agent, kterému hlavní agent předá dílčí úkol. Pracuje ve vlastním kontextu a vrací jen výsledek, takže hlavní vlákno zůstane přehledné.",
      en: "A helper agent the main agent hands a subtask to. It works in its own context and returns only the result, keeping the main thread clean.",
    },
  },
  {
    id: "systemovy-prompt",
    term: { cs: "systémový prompt", en: "system prompt" },
    match: {
      cs: "\\bsystémov[\\wáčďéěíňóřšťúůýž]+\\s+prompt[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bsystem prompts?\\b",
    },
    def: {
      cs: "Trvalé zadání, které AI dostane před každou konverzací a určuje její roli, tón a hranice. Uživatel ho běžně nevidí.",
      en: "A standing instruction the AI receives before every conversation, setting its role, tone and limits. Users normally never see it.",
    },
  },
  {
    id: "text-expander",
    term: { cs: "text expander", en: "text expander" },
    match: {
      cs: "\\btext[\\s-]?expander[\\wáčďéěíňóřšťúůýž]*|\\btextov[\\wáčďéěíňóřšťúůýž]+\\s+zkrat[kc][\\wáčďéěíňóřšťúůýž]*",
      en: "\\btext expanders?\\b",
    },
    def: {
      cs: "Nástroj, který krátkou zkratku promění v delší text. Napíšete třeba dvě písmena a vloží se celá odpověď nebo fakturační údaje.",
      en: "A tool that turns a short abbreviation into a longer block of text. Type two letters and a full reply or your billing details appear.",
    },
  },
  {
    id: "time-blocking",
    term: { cs: "time-blocking", en: "time-blocking" },
    match: {
      cs: "\\btime[\\s-]?block\\w*|\\bblokov[\\wáčďéěíňóřšťúůýž]+\\s+čas[\\wáčďéěíňóřšťúůýž]*",
      en: "\\btime[\\s-]?block\\w*",
    },
    def: {
      cs: "Plánování práce přímo do kalendáře — každý úkol dostane konkrétní čas. Ze seznamu přání se tak stane rozvrh s jasnými limity.",
      en: "Planning work straight into the calendar — every task gets a specific slot. A wish list turns into a schedule with visible limits.",
    },
  },
  {
    id: "token",
    term: { cs: "token", en: "token" },
    match: {
      cs: "\\btoken[\\wáčďéěíňóřšťúůýž]*",
      en: "\\btokens?\\b",
    },
    def: {
      cs: "Kousek textu, na který si model jazyk dělí — zhruba slovo nebo jeho část. V tokenech se měří délka vstupu i cena za použití.",
      en: "The chunk of text a model breaks language into — roughly a word or part of one. Input length and pricing are both measured in tokens.",
    },
  },
  {
    id: "tts",
    term: { cs: "TTS (převod textu na řeč)", en: "TTS (text-to-speech)" },
    match: {
      cs: "\\bTTS\\b|\\btext[\\s-]?to[\\s-]?speech\\b",
      en: "\\bTTS\\b|\\btext[\\s-]?to[\\s-]?speech\\b",
    },
    def: {
      cs: "Převod psaného textu na mluvené slovo. Hodí se, když si chcete dlouhý dokument cestou poslechnout místo čtení.",
      en: "Turning written text into spoken audio. Useful when you would rather listen to a long document on the move than read it.",
    },
  },
  {
    id: "webhook",
    term: { cs: "webhook", en: "webhook" },
    match: {
      cs: "\\bwebhook[\\wáčďéěíňóřšťúůýž]*",
      en: "\\bwebhooks?\\b",
    },
    def: {
      cs: "Automatická zpráva, kterou jedna služba pošle druhé ve chvíli, kdy se něco stane. Místo pravidelného dotazování se ozve sama.",
      en: "An automatic message one service sends another the moment something happens. Instead of you polling it, the service calls you.",
    },
  },
];
