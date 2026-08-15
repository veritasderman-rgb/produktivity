import type { Locale } from "@/lib/i18n";

/**
 * Rozcestník externích zdrojů „Kam dál“. Každý odkaz prošel ruční rešerší
 * (srpen 2026): web žije, publikuje a je tím, co popisek tvrdí.
 * Žádné affiliate odkazy — jen doporučení.
 */

export type ResourceCategory =
  | "vibecoding"
  | "docs"
  | "newsletters"
  | "czech"
  | "productivity"
  | "directories"
  | "learning";

export type Resource = {
  name: string;
  url: string;
  /** Jazyk obsahu na cílovém webu. */
  lang: Locale;
  /** Vlastní popis v obou jazycích webu. */
  desc: { cs: string; en: string };
  category: ResourceCategory;
};

export const resourceCategories: {
  id: ResourceCategory;
  title: { cs: string; en: string };
  intro: { cs: string; en: string };
}[] = [
  {
    id: "vibecoding",
    title: { cs: "Vibecoding a programování s AI", en: "Vibecoding & AI-assisted programming" },
    intro: {
      cs: "Nástroje, u kterých dnes programování s AI začíná — a místa, kde se o něm nejvíc naučíte.",
      en: "The tools where AI-assisted programming starts today — and the places where you learn it best.",
    },
  },
  {
    id: "docs",
    title: { cs: "Oficiální dokumentace AI nástrojů", en: "Official AI documentation" },
    intro: {
      cs: "Primární zdroje od výrobců. Než uvěříte návodu z videa, ověřte si ho tady.",
      en: "Primary sources straight from the vendors. Before trusting a video tutorial, check here.",
    },
  },
  {
    id: "newsletters",
    title: { cs: "Newslettery a blogy o AI", en: "AI newsletters & blogs" },
    intro: {
      cs: "Anglické zdroje, které sledujeme sami: věcné, pravidelné a bez hype.",
      en: "The sources we follow ourselves: substantive, regular and hype-free.",
    },
  },
  {
    id: "czech",
    title: { cs: "České zdroje o AI", en: "Czech AI sources" },
    intro: {
      cs: "Česká AI scéna je malá, ale živá. Tohle jsou weby a podcasty, které stojí za sledování.",
      en: "The Czech AI scene is small but lively. These are the sites and podcasts worth following — all in Czech.",
    },
  },
  {
    id: "productivity",
    title: { cs: "Produktivita klasicky", en: "Classic productivity" },
    intro: {
      cs: "Metodiky a autoři, ze kterých vychází i naše příručka. Originály v angličtině, jedna česká výjimka.",
      en: "The methodologies and authors our own handbook builds on.",
    },
  },
  {
    id: "directories",
    title: { cs: "Nástroje a adresáře", en: "Tools & directories" },
    intro: {
      cs: "Kurátorované katalogy — když hledáte nástroj nebo MCP server a nechcete se probírat marketingem.",
      en: "Curated catalogs — for when you need a tool or an MCP server without wading through marketing.",
    },
  },
  {
    id: "learning",
    title: { cs: "Vzdělávání zdarma", en: "Free learning" },
    intro: {
      cs: "Bezplatné kurzy od univerzit a výrobců. Žádní influenceři, žádné „zbohatněte s AI“.",
      en: "Free courses from universities and vendors. No influencers, no get-rich-with-AI schemes.",
    },
  },
];

export const resources: Resource[] = [
  // ── Vibecoding a programování s AI ──────────────────────────────────────
  {
    name: "Claude Code — dokumentace",
    url: "https://code.claude.com/docs",
    lang: "en",
    category: "vibecoding",
    desc: {
      cs: "Oficiální dokumentace agentního programovacího nástroje od Anthropicu: od instalace přes CLAUDE.md a skills až po subagenty a automatizaci v CI. Základ pro každého, kdo chce nechat AI pracovat v terminálu.",
      en: "Official documentation for Anthropic's agentic coding tool: from install through CLAUDE.md and skills to subagents and CI automation. The foundation for anyone letting AI work in their terminal.",
    },
  },
  {
    name: "Cursor — dokumentace",
    url: "https://cursor.com/docs",
    lang: "en",
    category: "vibecoding",
    desc: {
      cs: "Oficiální dokumentace AI editoru Cursor: agentní režimy, pravidla, MCP, cloudoví agenti. Užitečná i pro pochopení, jak se dnes AI editory obecně ovládají.",
      en: "Official docs for the Cursor AI editor: agent modes, rules, MCP, cloud agents. Useful even as a general primer on how today's AI editors are driven.",
    },
  },
  {
    name: "GitHub Copilot — dokumentace",
    url: "https://docs.github.com/en/copilot",
    lang: "en",
    category: "vibecoding",
    desc: {
      cs: "Kompletní dokumentace Copilotu od našeptávání po autonomní coding agenty a code review. Relevantní hlavně pro ty, kdo žijí v ekosystému GitHubu.",
      en: "Complete Copilot documentation, from completions to autonomous coding agents and code review. Most relevant if you live in the GitHub ecosystem.",
    },
  },
  {
    name: "Aider",
    url: "https://aider.chat/",
    lang: "en",
    category: "vibecoding",
    desc: {
      cs: "Open-source párové programování s LLM v terminálu — funguje s Claude, GPT i lokálními modely. Dokumentace je zároveň dobrá učebnice toho, jak AI asistované programování funguje pod kapotou.",
      en: "Open-source pair programming with LLMs in your terminal — works with Claude, GPT and local models. The docs double as a good textbook on how AI-assisted coding works under the hood.",
    },
  },
  {
    name: "Cline — dokumentace",
    url: "https://docs.cline.bot/",
    lang: "en",
    category: "vibecoding",
    desc: {
      cs: "Oficiální dokumentace open-source coding agenta pro VS Code, JetBrains i CLI. Důraz na human-in-the-loop: agent se na každou akci ptá, což je dobrý model pro začátek.",
      en: "Official docs for the open-source coding agent for VS Code, JetBrains and the CLI. Human-in-the-loop by design: the agent asks before every action — a good model to start with.",
    },
  },
  {
    name: "Anthropic Engineering Blog",
    url: "https://www.anthropic.com/engineering",
    lang: "en",
    category: "vibecoding",
    desc: {
      cs: "Technický blog týmu, který staví Claude a Claude Code: best practices pro agentní programování, multi-agentní systémy, evaluace. Nejlepší materiál o tom, jak s coding agenty pracují sami jejich autoři.",
      en: "The technical blog of the team building Claude and Claude Code: agentic coding best practices, multi-agent systems, evals. The best material on how the authors of coding agents use them themselves.",
    },
  },
  {
    name: "Cursor Community Forum",
    url: "https://forum.cursor.com/",
    lang: "en",
    category: "vibecoding",
    desc: {
      cs: "Živé komunitní fórum uživatelů Cursoru: workflow, návody, řešení problémů. Dobré místo, kde okoukat, jak s AI editory pracují pokročilí uživatelé v praxi.",
      en: "A lively community forum for Cursor users: workflows, guides, troubleshooting. A good place to see how advanced users actually work with AI editors day to day.",
    },
  },
  // ── Oficiální dokumentace ───────────────────────────────────────────────
  {
    name: "Claude Developer Platform",
    url: "https://platform.claude.com/docs/en/overview",
    lang: "en",
    category: "docs",
    desc: {
      cs: "Oficiální vývojářská dokumentace Anthropicu: Messages API, výběr modelů, prompt engineering, tool use. Kapitoly o promptování jsou užitečné i pro neprogramátory.",
      en: "Anthropic's official developer documentation: Messages API, model choice, prompt engineering, tool use. The prompting chapters are useful even if you never write code.",
    },
  },
  {
    name: "Claude Cookbooks",
    url: "https://github.com/anthropics/claude-cookbooks",
    lang: "en",
    category: "docs",
    desc: {
      cs: "Oficiální sbírka spustitelných notebooků od Anthropicu: RAG, klasifikace, sub-agenti, prompt caching. Nejrychlejší cesta od „četl jsem o tom“ k „vyzkoušel jsem to“.",
      en: "Anthropic's official collection of runnable notebooks: RAG, classification, sub-agents, prompt caching. The fastest route from “I read about it” to “I tried it”.",
    },
  },
  {
    name: "OpenAI Cookbook",
    url: "https://developers.openai.com/cookbook",
    lang: "en",
    category: "docs",
    desc: {
      cs: "Oficiální receptář OpenAI s praktickými příklady pro GPT modely: agenti, RAG, hlasové aplikace, fine-tuning. Průběžně aktualizovaný podle nejnovějších modelů.",
      en: "OpenAI's official recipe collection with practical examples for GPT models: agents, RAG, voice apps, fine-tuning. Continuously updated for the newest models.",
    },
  },
  {
    name: "Google AI for Developers",
    url: "https://ai.google.dev/",
    lang: "en",
    category: "docs",
    desc: {
      cs: "Oficiální rozcestník Googlu pro vývoj s Gemini, Gemmou a AI Studio. Sem patří i dokumentace ke Gemini API a návody na nasazení AI na webu i v mobilu.",
      en: "Google's official hub for building with Gemini, Gemma and AI Studio, including the Gemini API docs and guides for shipping AI on web and mobile.",
    },
  },
  {
    name: "Prompt Engineering Guide",
    url: "https://www.promptingguide.ai/",
    lang: "en",
    category: "docs",
    desc: {
      cs: "Rozsáhlý bezplatný průvodce promptováním od DAIR.AI: techniky, agenti, RAG, odkazy na výzkum. Nejucelenější nezávislý zdroj o prompt engineeringu, jaký známe.",
      en: "DAIR.AI's extensive free guide to prompting: techniques, agents, RAG, research references. The most complete independent prompt-engineering resource we know of.",
    },
  },
  {
    name: "Model Context Protocol",
    url: "https://modelcontextprotocol.io/",
    lang: "en",
    category: "docs",
    desc: {
      cs: "Oficiální dokumentace otevřeného standardu MCP — „USB-C pro AI aplikace“. Nutné čtení, pokud chcete AI nástroje propojit s vlastními daty a systémy.",
      en: "Official documentation for the open MCP standard — “USB-C for AI apps”. Required reading if you want to connect AI tools to your own data and systems.",
    },
  },
  // ── Newslettery a blogy ─────────────────────────────────────────────────
  {
    name: "Simon Willison's Weblog",
    url: "https://simonwillison.net/",
    lang: "en",
    category: "newsletters",
    desc: {
      cs: "Nejpečlivější kronikář praktického používání LLM: denní poznámky, testy modelů, bezpečnost promptů. Pokud čtete jen jeden blog o AI, čtěte tenhle.",
      en: "The most meticulous chronicler of practical LLM use: daily notes, model tests, prompt-injection security. If you read just one AI blog, make it this one.",
    },
  },
  {
    name: "One Useful Thing",
    url: "https://www.oneusefulthing.org/",
    lang: "en",
    category: "newsletters",
    desc: {
      cs: "Newsletter profesora Ethana Mollicka o dopadech AI na práci a vzdělávání. Akademicky poctivé, přesto čtivé — ideální pro manažery a nadšence bez technického zázemí.",
      en: "Professor Ethan Mollick's newsletter on what AI means for work and education. Academically honest yet readable — ideal for managers and enthusiasts without a technical background.",
    },
  },
  {
    name: "Latent Space",
    url: "https://www.latent.space/",
    lang: "en",
    category: "newsletters",
    desc: {
      cs: "Newsletter a podcast pro „AI inženýry“: rozhovory s lidmi, kteří staví agenty a infrastrukturu ve špičkových AI firmách. Technické, ale srozumitelné.",
      en: "The newsletter and podcast for “AI engineers”: interviews with the people building agents and infrastructure at leading AI companies. Technical but approachable.",
    },
  },
  {
    name: "Interconnects",
    url: "https://www.interconnects.ai/",
    lang: "en",
    category: "newsletters",
    desc: {
      cs: "Nathan Lambert trénuje modely v Ai2 a píše o tom, co se ve frontier labech skutečně děje — hlavně kolem open-source modelů a RLHF. Část obsahu je za předplatným.",
      en: "Nathan Lambert trains models at Ai2 and writes about what actually happens inside frontier labs — especially open models and RLHF. Some posts are paywalled.",
    },
  },
  {
    name: "Import AI",
    url: "https://importai.substack.com/",
    lang: "en",
    category: "newsletters",
    desc: {
      cs: "Týdenní přehled AI výzkumu od Jacka Clarka, spoluzakladatele Anthropicu. Hutné shrnutí důležitých paperů s komentářem, co znamenají pro svět — zdarma.",
      en: "A weekly research digest by Jack Clark, Anthropic co-founder. Dense summaries of the papers that matter, with commentary on why they matter — free.",
    },
  },
  {
    name: "TLDR AI",
    url: "https://tldr.tech/ai",
    lang: "en",
    category: "newsletters",
    desc: {
      cs: "Denní pětiminutový souhrn AI novinek pro technické publikum: modely, výzkum, nástroje. Bez senzací, zdarma — dobrý způsob, jak zůstat v obraze bez skrolování.",
      en: "A daily five-minute digest of AI news for a technical audience: models, research, tools. No sensationalism, free — a good way to stay current without doomscrolling.",
    },
  },
  {
    name: "Ben's Bites",
    url: "https://www.bensbites.com/",
    lang: "en",
    category: "newsletters",
    desc: {
      cs: "Newsletter o tom, jak se s AI reálně staví: praktické návody, agenti, tipy na nástroje. Míň novinek, víc „takhle to použijete v pondělí ráno“.",
      en: "A newsletter about actually building with AI: hands-on guides, agents, tool picks. Less news, more “here's what to do with it on Monday morning”.",
    },
  },
  {
    name: "Ahead of AI",
    url: "https://magazine.sebastianraschka.com/",
    lang: "en",
    category: "newsletters",
    desc: {
      cs: "Sebastian Raschka srozumitelně vysvětluje, jak LLM fungují uvnitř: architektury, trénink, reasoning. Pro čtenáře, kteří chtějí jít o vrstvu hlouběji než news.",
      en: "Sebastian Raschka explains how LLMs work on the inside: architectures, training, reasoning. For readers who want to go one layer deeper than the news cycle.",
    },
  },
  // ── České zdroje ────────────────────────────────────────────────────────
  {
    name: "AI Crunch",
    url: "https://aicrunch.cz/",
    lang: "cs",
    category: "czech",
    desc: {
      cs: "Nezávislý český magazín o AI, technologiích a jejich dopadu na byznys: zprávy, rozhovory s českými founder(k)ami, vysvětlující texty. Jedno z mála míst, kde se o AI píše česky a do hloubky.",
      en: "An independent Czech online magazine on AI, tech and their business impact: news, founder interviews, explainers. One of the few places covering AI in depth — in Czech.",
    },
  },
  {
    name: "Uměligence.cz",
    url: "https://www.umeligence.cz/",
    lang: "cs",
    category: "czech",
    desc: {
      cs: "Vzdělávací web Davida Grudla (autora Nette) o praktickém používání AI: chatboty, agenti, AI programování. Psané vývojářem, který věci nejdřív sám zkouší; k tomu newsletter a podcast.",
      en: "An educational site in Czech by David Grudl (author of the Nette framework) on practical AI use: chatbots, agents, AI coding. Written by a developer who tries everything first; includes a newsletter and podcast.",
    },
  },
  {
    name: "Lupa.cz — rubrika AI",
    url: "https://www.lupa.cz/n/umela-inteligence/",
    lang: "cs",
    category: "czech",
    desc: {
      cs: "AI rubrika zavedeného českého webu o internetu a technologiích: novinky, regulace (AI Act), reportáže z českých firem. Klasická tech publicistika, ne tiskové zprávy.",
      en: "The AI section of an established Czech tech-news site: news, EU AI Act coverage, reporting from Czech companies. Proper tech journalism in Czech, not press releases.",
    },
  },
  {
    name: "Kapler.cz",
    url: "https://www.kapler.cz/",
    lang: "cs",
    category: "czech",
    desc: {
      cs: "Blog Tomáše Kaplera o praktickém nasazení AI ve firmách a školách: návody, novinky, zkušenosti z praxe. Píše konzultant, který AI reálně zavádí, ne jen komentuje.",
      en: "Tomáš Kapler's blog in Czech on deploying AI in companies and schools: guides, news, field experience. Written by a consultant who actually implements AI, not just comments on it.",
    },
  },
  {
    name: "Deeplink Show",
    url: "https://deeplink.show/",
    lang: "cs",
    category: "czech",
    desc: {
      cs: "Týdenní český podcast o AI, technologiích a byznysu. Vývojář a produktový manažer rozebírají trendy a nástroje z praxe — věcně a bez futurologických spekulací.",
      en: "A weekly Czech podcast on AI, tech and business. A developer and a product manager break down trends and tools from practice — matter-of-fact, no futurology.",
    },
  },
  {
    name: "Naučíme AI Podcast",
    url: "https://podcasts.apple.com/cz/podcast/nau%C4%8D%C3%ADme-ai-podcast/id1880688616",
    lang: "cs",
    category: "czech",
    desc: {
      cs: "Český podcast o praktickém nasazení AI: vibecoding, agenti, workflow z konkrétních firem. Krátké epizody (cca 30 minut) každé pondělí.",
      en: "A Czech podcast on practical AI adoption: vibecoding, agents, workflows from real companies. Short (~30 min) episodes every Monday.",
    },
  },
  {
    name: "prg.ai",
    url: "https://prg.ai/",
    lang: "cs",
    category: "czech",
    desc: {
      cs: "Nezisková iniciativa budující z Prahy AI centrum: mapa české AI scény, akce, newsletter a festival Dny AI. Dobrý vstupní bod, pokud chcete českou AI komunitu poznat osobně.",
      en: "A Czech nonprofit building Prague into an AI hub: a map of the Czech AI scene, events, a newsletter and the “AI Days” festival. In Czech; a good entry point into the local AI community.",
    },
  },
  // ── Produktivita klasicky ───────────────────────────────────────────────
  {
    name: "Getting Things Done",
    url: "https://gettingthingsdone.com/",
    lang: "en",
    category: "productivity",
    desc: {
      cs: "Oficiální web metodiky GTD Davida Allena: blog, podcast a materiály přímo od zdroje. Placené kurzy nechte být — zdarma dostupné články a podcast stačí na solidní základ.",
      en: "The official home of David Allen's GTD: blog, podcast and materials straight from the source. Skip the paid courses — the free articles and podcast are enough for a solid foundation.",
    },
  },
  {
    name: "Cal Newport",
    url: "https://calnewport.com/",
    lang: "en",
    category: "productivity",
    desc: {
      cs: "Autor Deep Work a Slow Productivity: eseje a podcast o soustředěné práci v době digitálního rozptylování. Protiváha kultu výkonu — produktivita jako méně věcí, pořádně.",
      en: "The author of Deep Work and Slow Productivity: essays and a podcast on focused work in a distracted age. A counterweight to hustle culture — fewer things, done properly.",
    },
  },
  {
    name: "Ness Labs",
    url: "https://nesslabs.com/",
    lang: "en",
    category: "productivity",
    desc: {
      cs: "Neurovědkyně Anne-Laure Le Cunff píše o „mindful productivity“: produktivitě, která nestojí na sebemrskačství. Stovky článků o myšlení, učení a duševním zdraví zdarma.",
      en: "Neuroscientist Anne-Laure Le Cunff on “mindful productivity”: getting things done without burning out. Hundreds of free articles on thinking, learning and mental health.",
    },
  },
  {
    name: "Zen Habits",
    url: "https://zenhabits.net/",
    lang: "en",
    category: "productivity",
    desc: {
      cs: "Leo Babauta píše přes patnáct let o návycích, jednoduchosti a všímavosti. Minimalistická protilátka na dobu, kdy produktivita znamená „víc appek“.",
      en: "Leo Babauta has written about habits, simplicity and mindfulness for over fifteen years. A minimalist antidote to the idea that productivity means “more apps”.",
    },
  },
  {
    name: "Todoist Inspiration Hub",
    url: "https://www.todoist.com/inspiration",
    lang: "en",
    category: "productivity",
    desc: {
      cs: "Redakční blog tvůrců Todoistu: poctivé, dlouhé návody na metody (GTD, time blocking) i obecnou práci s časem. Kvalitou textů překvapivě přesahuje „firemní blog“.",
      en: "The editorial blog by the makers of Todoist: honest long-form guides to methods (GTD, time blocking) and time management in general. Far better than a typical company blog.",
    },
  },
  {
    name: "Farnam Street",
    url: "https://fs.blog/",
    lang: "en",
    category: "productivity",
    desc: {
      cs: "Shane Parrish o mentálních modelech a lepším rozhodování — meta-dovednosti, na kterých každý produktivní systém stojí. Články a podcast The Knowledge Project zdarma.",
      en: "Shane Parrish on mental models and better decision-making — the meta-skills every productivity system rests on. Articles and The Knowledge Project podcast are free.",
    },
  },
  {
    name: "The Imperfectionist",
    url: "https://www.oliverburkeman.com/the-imperfectionist",
    lang: "en",
    category: "productivity",
    desc: {
      cs: "Oliver Burkeman (Čtyři tisíce týdnů) posílá dvakrát měsíčně esej o produktivitě a smrtelnosti: co dělat s tím, že se všechno stihnout nedá. Zdarma.",
      en: "Oliver Burkeman (Four Thousand Weeks) sends a twice-monthly essay on productivity and mortality: what to do about the fact you can't get everything done. Free.",
    },
  },
  {
    name: "James Clear",
    url: "https://jamesclear.com/",
    lang: "en",
    category: "productivity",
    desc: {
      cs: "Autor Atomových návyků: obsáhlý archiv článků o budování návyků a týdenní newsletter 3-2-1. Základ tématu návyků, ze kterého čerpá půlka internetu.",
      en: "The author of Atomic Habits: a deep archive on habit building plus the weekly 3-2-1 newsletter. The habits canon half the internet borrows from.",
    },
  },
  {
    name: "GTD Česko a Slovensko",
    url: "https://gtdcz.cz/",
    lang: "cs",
    category: "productivity",
    desc: {
      cs: "Certifikovaní GTD lektoři pro ČR a SR: blog o metodě Getting Things Done v češtině a školení pro firmy. Užitečné, když chcete GTD terminologii a praxi v našem kontextu.",
      en: "Certified GTD trainers for the Czech Republic and Slovakia: a blog on Getting Things Done in Czech, plus corporate training. Useful for GTD practice in a local context.",
    },
  },
  // ── Nástroje a adresáře ─────────────────────────────────────────────────
  {
    name: "PulseMCP",
    url: "https://www.pulsemcp.com/",
    lang: "en",
    category: "directories",
    desc: {
      cs: "Komunitní adresář MCP serverů a klientů s příklady použití a newsletterem. Spravují ho lidé přímo z MCP komunity, takže katalog drží krok s protokolem.",
      en: "A community directory of MCP servers and clients with use cases and a newsletter. Maintained by people from the MCP community itself, so it keeps pace with the protocol.",
    },
  },
  {
    name: "Awesome MCP Servers",
    url: "https://github.com/punkpeye/awesome-mcp-servers",
    lang: "en",
    category: "directories",
    desc: {
      cs: "Největší kurátorovaný seznam MCP serverů na GitHubu, tříděný podle kategorií a průběžně udržovaný komunitou. Suchý seznam odkazů — ale právě proto se v něm rychle hledá.",
      en: "The biggest curated list of MCP servers on GitHub, sorted by category and actively maintained by the community. A dry list of links — which is exactly why it's fast to search.",
    },
  },
  {
    name: "Smithery",
    url: "https://smithery.ai/",
    lang: "en",
    category: "directories",
    desc: {
      cs: "Registr tisíců MCP serverů s instalací přes CLI a vyřešeným přihlašováním. Praktičtější než prosté seznamy, když chcete server rovnou zapojit do Claude nebo jiného agenta.",
      en: "A registry of thousands of MCP servers with CLI install and managed auth. More practical than plain lists when you want to plug a server straight into Claude or another agent.",
    },
  },
  {
    name: "FutureTools",
    url: "https://www.futuretools.io/",
    lang: "en",
    category: "directories",
    desc: {
      cs: "Katalog tisíců AI nástrojů tříděný podle kategorií, denně doplňovaný. Kurátorem je youtuber Matt Wolfe — berte jako široký rozcestník pro první orientaci, ne jako redakční výběr.",
      en: "A catalog of thousands of AI tools sorted by category, updated daily. Curated by YouTuber Matt Wolfe — treat it as a broad first-orientation index rather than an editorial shortlist.",
    },
  },
  // ── Vzdělávání zdarma ───────────────────────────────────────────────────
  {
    name: "DeepLearning.AI Short Courses",
    url: "https://www.deeplearning.ai/short-courses/",
    lang: "en",
    category: "learning",
    desc: {
      cs: "Krátké kurzy (1–2 hodiny) od týmu Andrewa Ng, často přímo s inženýry z Anthropicu, OpenAI či Googlu: promptování, agenti, RAG. Bezplatné a prakticky orientované.",
      en: "Short (1–2 hour) courses from Andrew Ng's team, often taught with engineers from Anthropic, OpenAI or Google: prompting, agents, RAG. Free and hands-on.",
    },
  },
  {
    name: "Hugging Face Learn",
    url: "https://huggingface.co/learn",
    lang: "en",
    category: "learning",
    desc: {
      cs: "Bezplatné kurzy od Hugging Face: LLM, agenti, počítačové vidění, audio. Pro technicky zdatné čtenáře, kteří chtějí s otevřenými modely pracovat vlastníma rukama.",
      en: "Free courses from Hugging Face: LLMs, agents, computer vision, audio. For technical readers who want hands-on work with open models.",
    },
  },
  {
    name: "Elements of AI",
    url: "https://www.elementsofai.cz/",
    lang: "cs",
    category: "learning",
    desc: {
      cs: "Bezplatný úvodní kurz o AI od Helsinské univerzity a MinnaLearn, přeložený do češtiny za podpory prg.ai a českých univerzit. Ideální první kurz pro netechnické publikum.",
      en: "The free introductory AI course by the University of Helsinki and MinnaLearn — this is the Czech translation, backed by prg.ai and Czech universities. An ideal first course for non-technical audiences.",
    },
  },
  {
    name: "Generative AI for Beginners",
    url: "https://github.com/microsoft/generative-ai-for-beginners",
    lang: "en",
    category: "learning",
    desc: {
      cs: "21 lekcí od Microsoftu, jak stavět aplikace nad generativní AI: od základů přes RAG po agenty. Zdarma, s kódem v Pythonu i TypeScriptu a videem ke každé lekci.",
      en: "Microsoft's 21-lesson course on building generative-AI applications: from fundamentals through RAG to agents. Free, with Python and TypeScript code and a video per lesson.",
    },
  },
  {
    name: "Anthropic Academy",
    url: "https://www.anthropic.com/learn",
    lang: "en",
    category: "learning",
    desc: {
      cs: "Oficiální kurzy Anthropicu: AI Fluency pro běžné uživatele, Claude Code a MCP pro vývojáře. Zdarma, s certifikátem po dokončení.",
      en: "Anthropic's official courses: AI Fluency for everyday users, Claude Code and MCP for developers. Free, with a certificate on completion.",
    },
  },
  {
    name: "OpenAI Academy",
    url: "https://academy.openai.com/",
    lang: "en",
    category: "learning",
    desc: {
      cs: "Bezplatná vzdělávací platforma OpenAI: základy AI, práce s ChatGPT, agenti a workflow. Rozumný start pro kancelářské profese, které chtějí AI do denní rutiny.",
      en: "OpenAI's free learning platform: AI foundations, working with ChatGPT, agents and workflows. A sensible start for office professionals bringing AI into their routine.",
    },
  },
  {
    name: "Neural Networks: Zero to Hero",
    url: "https://github.com/karpathy/nn-zero-to-hero",
    lang: "en",
    category: "learning",
    desc: {
      cs: "Andrej Karpathy staví neuronovou síť a poté GPT od nuly, řádek po řádku — série videí s notebooky. Nejlepší způsob, jak skutečně pochopit, co se v LLM děje uvnitř.",
      en: "Andrej Karpathy builds a neural net and then a GPT from scratch, line by line — a video series with notebooks. The best way to truly understand what happens inside an LLM.",
    },
  },
  {
    name: "Kaggle Learn",
    url: "https://www.kaggle.com/learn",
    lang: "en",
    category: "learning",
    desc: {
      cs: "Mikrokurzy zdarma od Kaggle: Python, pandas, strojové učení, vizualizace dat. Krátké interaktivní lekce v prohlížeči — dobrý most mezi „umím Excel“ a „umím data“.",
      en: "Free micro-courses from Kaggle: Python, pandas, machine learning, data visualization. Short interactive lessons in the browser — a good bridge from spreadsheets to data work.",
    },
  },
  {
    name: "fast.ai",
    url: "https://www.fast.ai/",
    lang: "en",
    category: "learning",
    desc: {
      cs: "Practical Deep Learning for Coders a další bezplatné kurzy Jeremyho Howarda: deep learning prakticky, „shora dolů“ — nejdřív výsledky, teorie potom. Léty prověřená klasika.",
      en: "Practical Deep Learning for Coders and other free courses by Jeremy Howard: deep learning taught top-down — results first, theory after. A time-tested classic.",
    },
  },
];

export function getResourcesByCategory(lang?: Locale) {
  return resourceCategories
    .map((cat) => ({
      ...cat,
      items: resources.filter(
        (r) => r.category === cat.id && (lang ? r.lang === lang : true),
      ),
    }))
    .filter((cat) => cat.items.length > 0);
}
