import type { Locale } from "@/lib/i18n";

/**
 * Rozcestník MCP konektorů. Každá položka prošla ruční rešerší (srpen 2026):
 * server existuje, odkaz vede na dokumentaci nebo repozitář výrobce a stav
 * (oficiální / komunitní / beta) odpovídá tomu, co o sobě tvrdí zdroj.
 *
 * Klíčové je rozlišení `status`. „Oficiální“ znamená, že server vydává výrobce
 * nástroje nebo Anthropic. „Komunitní“ je projekt třetí strany — instalujete si
 * cizí software, který uvidí do vašich dat, a děláte to na vlastní odpovědnost.
 * Co se nepodařilo ověřit, v seznamu není.
 *
 * Ceny sem schválně nepatří: tarify se mění rychleji než tenhle soubor.
 * Omezení, na která čtenář reálně narazí, popisuje kvalitativně pole `limit`.
 * U všeho platí „v době psaní“ — před nasazením ověřte u zdroje.
 */

export type ConnectorCategory =
  | "kancelar"
  | "data"
  | "grafika"
  | "cad"
  | "marketing"
  | "vyvoj"
  | "registry"
  | "komunikace";

export type ConnectorStatus = "oficialni" | "komunitni" | "beta";

/** Text ve všech jazycích webu. */
export type ConnectorText = Record<Locale, string>;

export type Connector = {
  name: string;
  /** Kdo ho vydává (výrobce nástroje, Anthropic, jméno projektu u komunitních). */
  vendor: string;
  /** Odkaz na dokumentaci nebo repozitář. */
  url: string;
  status: ConnectorStatus;
  category: ConnectorCategory;
  /** Jedna věta: co s ním reálně jde. Obojí jazykově. */
  desc: ConnectorText;
  /** Volitelně: limit, na který čtenář narazí (beta, jen pro čtení, jen placený tarif…). */
  limit?: ConnectorText;
};

export const connectorCategories: {
  id: ConnectorCategory;
  title: ConnectorText;
  intro: ConnectorText;
}[] = [
  {
    id: "kancelar",
    title: { cs: "Kancelář a poznámky", en: "Office & notes" },
    intro: {
      cs: "Úkoly, dokumenty a firemní wiki. Tady konektor nejrychleji ušetří čas — a nejrychleji se dostane k tomu, co byste ven pouštět nechtěli.",
      en: "Tasks, documents and company wikis. This is where a connector saves time fastest — and where it fastest reaches things you would rather keep in-house.",
    },
  },
  {
    id: "data",
    title: { cs: "Data a databáze", en: "Data & databases" },
    intro: {
      cs: "Dotazy nad ostrou databází bez psaní SQL. U produkčních dat hledejte režim jen pro čtení a raději si ho zapněte.",
      en: "Querying a live database without writing SQL. On production data, look for a read-only mode — and switch it on.",
    },
  },
  {
    id: "grafika",
    title: { cs: "Grafika a kreativní nástroje", en: "Graphics & creative tools" },
    intro: {
      cs: "Návrhy, plátna, obrazy a zvuk. Většina těchto konektorů vznikla v roce 2026, takže se rozsah funkcí mění po měsících.",
      en: "Designs, canvases, images and audio. Most of these connectors appeared during 2026, so their feature sets still shift month to month.",
    },
  },
  {
    id: "cad",
    title: { cs: "CAD a 3D", en: "CAD & 3D" },
    intro: {
      cs: "Modelování popisem místo klikání. Většina serverů běží lokálně proti spuštěné aplikaci — bez otevřeného programu nefungují.",
      en: "Modelling by description instead of clicking. Most of these run locally against a live application — with the app closed, nothing works.",
    },
  },
  {
    id: "marketing",
    title: { cs: "Marketing a sítě", en: "Marketing & social" },
    intro: {
      cs: "Publikování, e-mailing, e-shopy a reklama. Konektor tu typicky umí i odeslat — což je přesně to, co chcete mít pod kontrolou.",
      en: "Publishing, email, storefronts and ads. These connectors typically can also send — which is exactly what you want to keep on a short leash.",
    },
  },
  {
    id: "vyvoj",
    title: { cs: "Vývoj a hosting", en: "Development & hosting" },
    intro: {
      cs: "Nejstarší a nejvyzrálejší část ekosystému: repozitáře, nasazení, chyby, platby. Skoro všechno tu vydávají přímo výrobci.",
      en: "The oldest and most mature part of the ecosystem: repositories, deployments, errors, payments. Almost everything here comes from the vendors themselves.",
    },
  },
  {
    id: "registry",
    title: { cs: "Veřejné registry a věda", en: "Public registries & science" },
    intro: {
      cs: "Otevřená data, odborná literatura a výpočty. Skoro vždy jen pro čtení, takže riziko je tu ze všech kategorií nejnižší.",
      en: "Open data, scholarly literature and computation. Almost always read-only, which makes this the lowest-risk category of all.",
    },
  },
  {
    id: "komunikace",
    title: { cs: "Komunikace", en: "Communication" },
    intro: {
      cs: "Pošta, kalendář, chat a hovory. Nejcitlivější kategorie: konektor tu vidí do konverzací, které jste psali jiným lidem.",
      en: "Mail, calendar, chat and calls. The most sensitive category: here a connector sees conversations you had with other people.",
    },
  },
];

export const connectors: Connector[] = [
  // ── Kancelář a poznámky ─────────────────────────────────────────────────
  {
    name: "Notion",
    vendor: "Notion",
    url: "https://developers.notion.com/docs/mcp",
    status: "oficialni",
    category: "kancelar",
    desc: {
      cs: "Čte a zakládá stránky a databáze, hledá napříč workspace a doplňuje vlastnosti záznamů.",
      en: "Reads and creates pages and databases, searches across the workspace and fills in record properties.",
    },
  },
  {
    name: "Linear",
    vendor: "Linear",
    url: "https://linear.app/docs/mcp",
    status: "oficialni",
    category: "kancelar",
    desc: {
      cs: "Hledá, zakládá a upravuje issues, projekty a komentáře; umí je i přiřazovat a měnit stavy.",
      en: "Finds, creates and updates issues, projects and comments, including assignments and status changes.",
    },
    limit: {
      cs: "Vedle plného endpointu nabízí i variantu jen pro čtení — pro první seznámení sáhněte po ní.",
      en: "Besides the full endpoint there is a read-only variant — start with that one.",
    },
  },
  {
    name: "Atlassian (Jira, Confluence, Bitbucket)",
    vendor: "Atlassian",
    url: "https://support.atlassian.com/rovo/docs/getting-started-with-the-atlassian-remote-mcp-server/",
    status: "oficialni",
    category: "kancelar",
    desc: {
      cs: "Prohledává Jiru, Confluence i Bitbucket, zakládá a aktualizuje pracovní položky a stránky.",
      en: "Searches Jira, Confluence and Bitbucket, and creates or updates work items and pages.",
    },
    limit: {
      cs: "Přístup se řídí vaším existujícím oprávněním v Atlassianu — konektor nevidí víc než vy.",
      en: "Access follows your existing Atlassian permissions — the connector sees no more than you do.",
    },
  },
  {
    name: "Asana",
    vendor: "Asana",
    url: "https://developers.asana.com/docs/using-asanas-mcp-server",
    status: "oficialni",
    category: "kancelar",
    desc: {
      cs: "Zakládá a mění úkoly a projekty, čte Work Graph a skládá z něj přehledy o stavu práce.",
      en: "Creates and edits tasks and projects, reads the Work Graph and assembles status reports from it.",
    },
  },
  {
    name: "monday.com",
    vendor: "monday.com",
    url: "https://developer.monday.com/apps/docs/mondaycom-mcp-integration",
    status: "oficialni",
    category: "kancelar",
    desc: {
      cs: "Zakládá položky a celé nástěnky, plní sloupce a zapisuje aktivity do CRM.",
      en: "Creates items and whole boards, fills columns and logs activities into the CRM.",
    },
    limit: {
      cs: "Běží lokálně jako balíček z npm proti vašemu API tokenu, ne jako hostovaná služba.",
      en: "Runs locally as an npm package against your own API token, not as a hosted service.",
    },
  },
  {
    name: "Box",
    vendor: "Box",
    url: "https://developer.box.com/guides/box-mcp/remote/",
    status: "oficialni",
    category: "kancelar",
    desc: {
      cs: "Prochází a zakládá soubory a složky v Boxu a volá nad nimi Box AI, včetně generování dokumentů.",
      en: "Browses and creates files and folders in Box and runs Box AI over them, document generation included.",
    },
    limit: {
      cs: "Nasazení vyžaduje aplikaci schválenou správcem v Box Admin Console.",
      en: "Setup requires an app approved by an administrator in the Box Admin Console.",
    },
  },
  {
    name: "Airtable",
    vendor: "Airtable",
    url: "https://support.airtable.com/docs/using-the-airtable-mcp-server",
    status: "oficialni",
    category: "kancelar",
    desc: {
      cs: "Čte a zapisuje záznamy v basech, prochází schéma tabulek a zakládá nová pole.",
      en: "Reads and writes records in bases, walks the table schema and creates new fields.",
    },
  },
  {
    name: "Todoist",
    vendor: "Doist",
    url: "https://github.com/Doist/todoist-mcp",
    status: "oficialni",
    category: "kancelar",
    desc: {
      cs: "Čte, zakládá a dokončuje úkoly a projekty, včetně termínů, štítků a poznámek.",
      en: "Reads, creates and completes tasks and projects, with due dates, labels and notes.",
    },
    limit: {
      cs: "Hostovaná varianta se přihlašuje výhradně přes OAuth; API klíč funguje jen při vlastním provozu serveru.",
      en: "The hosted variant authenticates only via OAuth; API keys work only if you run the server yourself.",
    },
  },
  {
    name: "Google Drive",
    vendor: "Anthropic",
    url: "https://support.claude.com/en/articles/10166901-use-google-workspace-connectors",
    status: "oficialni",
    category: "kancelar",
    desc: {
      cs: "Hledá a čte soubory na Disku a ukládá zpět dokumenty, které během konverzace vzniknou.",
      en: "Searches and reads Drive files and saves documents created during the conversation back to Drive.",
    },
    limit: {
      cs: "Vytahuje jen textový obsah souborů. V týmových tarifech ho musí nejdřív povolit správce.",
      en: "Extracts text content only. On team plans an administrator must enable it first.",
    },
  },
  {
    name: "Obsidian",
    vendor: "Komunitní projekt MarkusPfundstein/mcp-obsidian",
    url: "https://github.com/MarkusPfundstein/mcp-obsidian",
    status: "komunitni",
    category: "kancelar",
    desc: {
      cs: "Vypisuje soubory v trezoru, hledá v poznámkách, čte je a připisuje do nich nový obsah.",
      en: "Lists vault files, searches notes, reads them and appends new content to them.",
    },
    limit: {
      cs: "Vyžaduje komunitní plugin Local REST API přímo v Obsidianu; server je software třetí strany a vidí celý trezor.",
      en: "Requires the Local REST API community plugin inside Obsidian; the server is third-party software and sees the whole vault.",
    },
  },

  // ── Data a databáze ─────────────────────────────────────────────────────
  {
    name: "Supabase",
    vendor: "Supabase",
    url: "https://supabase.com/docs/guides/getting-started/mcp",
    status: "oficialni",
    category: "data",
    desc: {
      cs: "Vypisuje tabulky, spouští SQL, zakládá migrace a větve a nasazuje edge funkce.",
      en: "Lists tables, runs SQL, creates migrations and branches and deploys edge functions.",
    },
    limit: {
      cs: "Umí zapisovat do produkce — pro běžnou práci zapněte režim jen pro čtení a omezte ho na jeden projekt.",
      en: "It can write to production — for everyday work enable read-only mode and scope it to a single project.",
    },
  },
  {
    name: "MongoDB",
    vendor: "MongoDB",
    url: "https://www.mongodb.com/docs/mcp-server/",
    status: "oficialni",
    category: "data",
    desc: {
      cs: "Spouští dotazy i agregace nad kolekcemi, zakládá indexy a spravuje clustery v Atlasu.",
      en: "Runs queries and aggregations over collections, creates indexes and manages Atlas clusters.",
    },
    limit: {
      cs: "Existuje ve variantě lokální i spravované Atlasem; každá má jiný rozsah oprávnění.",
      en: "Comes in a local and an Atlas-managed variant, each with a different permission scope.",
    },
  },
  {
    name: "Neon",
    vendor: "Neon",
    url: "https://neon.com/docs/ai/neon-mcp-server",
    status: "oficialni",
    category: "data",
    desc: {
      cs: "Zakládá projekty a databázové větve, spouští dotazy a ukazuje schéma i diagnostiku.",
      en: "Creates projects and database branches, runs queries and surfaces schema and diagnostics.",
    },
    limit: {
      cs: "Rozsah lze zúžit parametrem v URL na jeden projekt nebo na režim jen pro čtení.",
      en: "Scope can be narrowed via a URL parameter to a single project or to read-only mode.",
    },
  },
  {
    name: "ClickHouse",
    vendor: "ClickHouse",
    url: "https://github.com/ClickHouse/mcp-clickhouse",
    status: "oficialni",
    category: "data",
    desc: {
      cs: "Vypisuje databáze a tabulky a spouští analytické SQL dotazy nad ClickHouse.",
      en: "Lists databases and tables and runs analytical SQL queries against ClickHouse.",
    },
    limit: {
      cs: "Ve výchozím stavu jen pro čtení; zápis se zapíná proměnnou prostředí a mazání ještě zvlášť.",
      en: "Read-only by default; writes are enabled by an environment variable and deletes by another one.",
    },
  },
  {
    name: "Redis",
    vendor: "Redis",
    url: "https://github.com/redis/mcp-redis",
    status: "oficialni",
    category: "data",
    desc: {
      cs: "Ukládá a čte klíče, hashe, seznamy, streamy i JSON dokumenty a hledá v nich.",
      en: "Stores and reads keys, hashes, lists, streams and JSON documents, and searches them.",
    },
  },
  {
    name: "Google Analytics",
    vendor: "Google",
    url: "https://github.com/googleanalytics/google-analytics-mcp",
    status: "beta",
    category: "data",
    desc: {
      cs: "Ptá se na návštěvnost a chování uživatelů v GA4 přes Data API a vypisuje konfiguraci účtů.",
      en: "Asks about GA4 traffic and user behaviour through the Data API and lists account configuration.",
    },
    limit: {
      cs: "Sám Google ho označuje za experimentální. Běží jen lokálně, je pouze pro čtení a chce vlastní projekt v Google Cloudu.",
      en: "Google itself labels it experimental. It runs locally only, is read-only and needs your own Google Cloud project.",
    },
  },

  // ── Grafika a kreativní nástroje ────────────────────────────────────────
  {
    name: "Canva",
    vendor: "Canva",
    url: "https://www.canva.dev/docs/apps/mcp-server/",
    status: "oficialni",
    category: "grafika",
    desc: {
      cs: "Zakládá návrhy ze šablon i brand kitů, mění velikost, exportuje a komentuje.",
      en: "Creates designs from templates and brand kits, resizes, exports and comments.",
    },
  },
  {
    name: "Figma",
    vendor: "Figma",
    url: "https://help.figma.com/hc/en-us/articles/32132100833559-Guide-to-the-Figma-MCP-server",
    status: "oficialni",
    category: "grafika",
    desc: {
      cs: "Vytahuje z návrhu kontext pro generování kódu a umí i zakládat a měnit obsah přímo na plátně.",
      en: "Pulls design context for code generation and can also create and edit content directly on the canvas.",
    },
    limit: {
      cs: "Zápis na plátno je zatím v betě. Desktopová varianta chce placený tarif a Dev nebo Full seat; vzdálená funguje širší.",
      en: "Canvas writing is still in beta. The desktop variant needs a paid plan and a Dev or Full seat; the remote one is broader.",
    },
  },
  {
    name: "Adobe for Creativity",
    vendor: "Adobe",
    url: "https://developer.adobe.com/adobe-for-creativity/",
    status: "oficialni",
    category: "grafika",
    desc: {
      cs: "Vzdálený server nad Photoshopem, Lightroomem, Illustratorem, InDesignem, Expressem, Premiere, Firefly a Stockem.",
      en: "A remote server spanning Photoshop, Lightroom, Illustrator, InDesign, Express, Premiere, Firefly and Stock.",
    },
  },
  {
    name: "Affinity by Canva",
    vendor: "Canva (v rámci Claude for Creative Work)",
    url: "https://www.anthropic.com/news/claude-for-creative-work",
    status: "oficialni",
    category: "grafika",
    desc: {
      cs: "Dávkově upravuje otevřené dokumenty — úpravy obrázků, přejmenování vrstev, export — a ukládá skripty do panelu.",
      en: "Batch-edits open documents — image adjustments, layer renaming, export — and saves scripts into the Scripts panel.",
    },
    limit: {
      cs: "Musíte ho ručně zapnout v nastavení Affinity, v záložce Model Context Protocol.",
      en: "You must switch it on manually in Affinity settings, under the Model Context Protocol tab.",
    },
  },
  {
    name: "Miro",
    vendor: "Miro",
    url: "https://developers.miro.com/docs/miro-mcp",
    status: "beta",
    category: "grafika",
    desc: {
      cs: "Zakládá a prohledává nástěnky, generuje diagramy a tabulky a čte i odpovídá na komentáře.",
      en: "Creates and searches boards, generates diagrams and tables, and reads and replies to comments.",
    },
    limit: {
      cs: "V době psaní ve veřejné betě; při připojení vybíráte konkrétní tým, jehož nástěnky konektor uvidí.",
      en: "In public beta at the time of writing; on connecting you pick the one team whose boards it will see.",
    },
  },
  {
    name: "Lucid",
    vendor: "Lucid Software",
    url: "https://lucid.co/blog/lucid-mcp-server",
    status: "oficialni",
    category: "grafika",
    desc: {
      cs: "Čte obsah dokumentů Lucidu a zakládá diagramy, ERD, myšlenkové mapy i organizační schémata.",
      en: "Reads Lucid document content and creates diagrams, ERDs, mind maps and org charts.",
    },
  },
  {
    name: "Ableton",
    vendor: "Ableton",
    url: "https://www.anthropic.com/news/claude-for-creative-work",
    status: "oficialni",
    category: "grafika",
    desc: {
      cs: "Prohledává manuály k Live, Pushi, Move a Max for Live včetně znalostní báze a přepisů videí.",
      en: "Searches the Live, Push, Move and Max for Live manuals, plus the knowledge base and video transcripts.",
    },
    limit: {
      cs: "Je to nápovědový konektor: odpovídá z dokumentace, samotný Live neovládá.",
      en: "It is a documentation connector: it answers from the manuals and does not drive Live itself.",
    },
  },
  {
    name: "Splice",
    vendor: "Splice",
    url: "https://splice.com/tools/mcp-server",
    status: "beta",
    category: "grafika",
    desc: {
      cs: "Hledá v katalogu samplů Splice, skládá z nich stacky a stahuje vybrané zvuky.",
      en: "Searches the Splice sample catalog, assembles stacks from it and downloads selected sounds.",
    },
    limit: {
      cs: "Sám Splice ho označuje za betu; stahování se řídí vaším tarifem a zbývajícími kredity.",
      en: "Splice labels it beta itself; downloads depend on your plan and remaining credits.",
    },
  },
  {
    name: "Resolume Arena",
    vendor: "Resolume",
    url: "https://resolume.com/support/en/mcp-servers",
    status: "oficialni",
    category: "grafika",
    desc: {
      cs: "Skládá a spravuje kompozice: načítá klipy a zdroje, přidává vrstvy, sloupce, skupiny a efekty.",
      en: "Builds and manages compositions: loads clips and sources, adds layers, columns, groups and effects.",
    },
    limit: {
      cs: "Běží lokálně jako balíček dodávaný s aplikací; bez spuštěné Areny nefunguje.",
      en: "Runs locally as a bundle shipped with the app; without Arena running it does nothing.",
    },
  },
  {
    name: "Resolume Wire",
    vendor: "Resolume",
    url: "https://resolume.com/support/en/mcp-servers",
    status: "oficialni",
    category: "grafika",
    desc: {
      cs: "Staví patche podle popisu: založí uzly, propojí je a nastaví hodnoty vstupů.",
      en: "Builds patches from a description: creates nodes, wires them up and sets inlet values.",
    },
    limit: {
      cs: "Neumí zakládat a aplikovat presety Dashboardu ani patche renderovat či kompilovat.",
      en: "It cannot create or apply Dashboard presets, nor render or compile patches.",
    },
  },

  // ── CAD a 3D ────────────────────────────────────────────────────────────
  {
    name: "SketchUp",
    vendor: "Trimble",
    url: "https://help.sketchup.com/en/sketchup-claude-connector",
    status: "oficialni",
    category: "cad",
    desc: {
      cs: "Z popisu místnosti, nábytku nebo koncepce pozemku vygeneruje model a nabídne ho ke stažení jako .skp.",
      en: "Turns a description of a room, a piece of furniture or a site concept into a model offered as a .skp download.",
    },
    limit: {
      cs: "Ve free tarifu má omezený počet vygenerovaných modelů, dál chce předplatné. Modely se mezi sezeními neuchovávají — .skp si vždy stáhněte.",
      en: "The free tier caps how many models you can generate; beyond that it needs a subscription. Models are not kept between sessions — always download the .skp.",
    },
  },
  {
    name: "Autodesk Fusion",
    vendor: "Autodesk",
    url: "https://www.autodesk.com/products/fusion-360/blog/build-your-own-fusion-add-ins-with-the-fusion-mcp/",
    status: "oficialni",
    category: "cad",
    desc: {
      cs: "Čte aktivní dokument, spouští skripty přes Fusion API a zapisuje parametrickou historii přímo do souboru.",
      en: "Reads the active document, runs scripts through the Fusion API and writes parametric history straight into the file.",
    },
    limit: {
      cs: "Server je nutné zapnout v předvolbách Fusionu (General > API) a pracuje proti živé relaci aplikace.",
      en: "The server must be enabled in Fusion preferences (General > API) and works against a live session of the app.",
    },
  },
  {
    name: "Blender",
    vendor: "Blender (konektor v adresáři Anthropicu)",
    url: "https://academy.claude.com/tutorials/using-the-blender-connector-in-claude",
    status: "oficialni",
    category: "cad",
    desc: {
      cs: "Zpřístupňuje Python API Blenderu i jeho dokumentaci: analyzuje scénu, ladí nastavení a dávkově mění objekty.",
      en: "Exposes Blender's Python API and its documentation: analyses the scene, debugs setups and batch-edits objects.",
    },
    limit: {
      cs: "Vyžaduje Blender 3.0 a novější a zapnutý MCP na straně Blenderu.",
      en: "Requires Blender 3.0 or newer and MCP switched on inside Blender.",
    },
  },
  {
    name: "Rhino a Grasshopper",
    vendor: "McNeel",
    url: "https://mcneel.github.io/RhinoMCP/docs/",
    status: "oficialni",
    category: "cad",
    desc: {
      cs: "Modeluje a upravuje geometrii v Rhinu, přestavuje parametrické definice a dávkově zpracovává soubory .3dm.",
      en: "Models and edits geometry in Rhino, rebuilds parametric definitions and batch-processes .3dm files.",
    },
    limit: {
      cs: "Instaluje se jako plugin (Yak) do Rhina; server běží uvnitř aplikace, ne v cloudu.",
      en: "Installs as a Yak plugin into Rhino; the server runs inside the app, not in the cloud.",
    },
  },
  {
    name: "Revit",
    vendor: "Autodesk",
    url: "https://www.autodesk.com/blogs/aec/2026/06/17/revit-public-mcp-server/",
    status: "beta",
    category: "cad",
    desc: {
      cs: "Dotazuje se na strukturu modelu: prvky, parametry a vazby, aby šlo z modelu tahat informace řečí.",
      en: "Queries the model structure — elements, parameters and relationships — so you can interrogate a model in plain language.",
    },
    limit: {
      cs: "Technická předběžná verze pro Revit 2027 a v této fázi jen pro čtení; model nemění.",
      en: "A technical preview for Revit 2027, read-only at this stage; it does not modify the model.",
    },
  },
  {
    name: "Onshape FeatureScript",
    vendor: "PTC",
    url: "https://www.ptc.com/en/news/2026/onshape-launches-featurescript-mcp-server",
    status: "beta",
    category: "cad",
    desc: {
      cs: "Píše, testuje a ladí vlastní CAD prvky ve FeatureScriptu podle popisu požadované funkce.",
      en: "Writes, tests and debugs custom CAD features in FeatureScript from a description of what the feature should do.",
    },
    limit: {
      cs: "Vydáno pod hlavičkou Onshape Labs a zaměřené na FeatureScript, ne na obecné modelování.",
      en: "Released under the Onshape Labs banner and focused on FeatureScript, not general modelling.",
    },
  },
  {
    name: "FreeCAD",
    vendor: "Komunitní projekt neka-nat/freecad-mcp",
    url: "https://github.com/neka-nat/freecad-mcp",
    status: "komunitni",
    category: "cad",
    desc: {
      cs: "Zakládá a upravuje objekty a náčrty ve FreeCADu a spouští v něm vlastní Python kód.",
      en: "Creates and edits objects and sketches in FreeCAD and runs custom Python code inside it.",
    },
    limit: {
      cs: "FreeCAD oficiální konektor nemá. Tenhle je od třetí strany a spouští ve vaší instalaci cizí kód.",
      en: "FreeCAD has no official connector. This one is third-party and runs foreign code in your installation.",
    },
  },
  {
    name: "BlenderMCP",
    vendor: "Komunitní projekt ahujasid/blender-mcp",
    url: "https://github.com/ahujasid/blender-mcp",
    status: "komunitni",
    category: "cad",
    desc: {
      cs: "Starší komunitní most do Blenderu: ovládá scénu, materiály a objekty přes doplněk a socket.",
      en: "The older community bridge into Blender: drives the scene, materials and objects through an add-on and a socket.",
    },
    limit: {
      cs: "Existuje vedle oficiálního konektoru. Pokud nepotřebujete konkrétní jeho funkci, sáhněte po oficiálním.",
      en: "It exists alongside the official connector. Unless you need something specific from it, take the official one.",
    },
  },

  // ── Marketing a sítě ────────────────────────────────────────────────────
  {
    name: "Buffer",
    vendor: "Buffer",
    url: "https://developers.buffer.com/guides/integrations/mcp.html",
    status: "oficialni",
    category: "marketing",
    desc: {
      cs: "Zakládá a plánuje příspěvky, spravuje frontu, ukládá nápady a vypisuje připojené kanály i metriky.",
      en: "Creates and schedules posts, manages the queue, saves ideas and lists connected channels and metrics.",
    },
    limit: {
      cs: "Dostupné i v bezplatném tarifu; rozsah kanálů se řídí tím, co máte v Bufferu připojené.",
      en: "Available even on the free plan; the reach depends on which channels you have connected in Buffer.",
    },
  },
  {
    name: "Brevo",
    vendor: "Brevo",
    url: "https://developers.brevo.com/docs/mcp-protocol",
    status: "oficialni",
    category: "marketing",
    desc: {
      cs: "Spravuje kontakty a seznamy, zakládá e-mailové i SMS kampaně a pracuje se šablonami.",
      en: "Manages contacts and lists, creates email and SMS campaigns and works with templates.",
    },
    limit: {
      cs: "Autorizuje se API klíčem, který si vygenerujete v nastavení účtu — klíč platí na celý účet.",
      en: "Authenticates with an API key generated in account settings — that key covers the whole account.",
    },
  },
  {
    name: "MailerLite",
    vendor: "MailerLite",
    url: "https://developers.mailerlite.com/mcp",
    status: "oficialni",
    category: "marketing",
    desc: {
      cs: "Přidává a segmentuje odběratele, zakládá a plánuje kampaně, staví formuláře a automatizace.",
      en: "Adds and segments subscribers, creates and schedules campaigns, builds forms and automations.",
    },
  },
  {
    name: "Meta Ads (Marketing API)",
    vendor: "Meta",
    url: "https://developers.facebook.com/blog/post/2026/01/22/introducing-the-meta-marketing-api-mcp-server/",
    status: "beta",
    category: "marketing",
    desc: {
      cs: "Zakládá kampaně, sady reklam a kreativy, spravuje katalogy a publika a čte výkonnostní data.",
      en: "Creates campaigns, ad sets and creatives, manages catalogs and audiences and reads performance data.",
    },
    limit: {
      cs: "V době psaní v betě. Umí i utrácet rozpočet, takže zápisové akce si nechte potvrzovat.",
      en: "In beta at the time of writing. It can also spend budget, so keep write actions behind confirmation.",
    },
  },
  {
    name: "HubSpot",
    vendor: "HubSpot",
    url: "https://developers.hubspot.com/mcp",
    status: "oficialni",
    category: "marketing",
    desc: {
      cs: "Čte a zapisuje kontakty, firmy, obchody, tikety, nabídky a faktury a prochází marketingové kampaně.",
      en: "Reads and writes contacts, companies, deals, tickets, quotes and invoices, and browses marketing campaigns.",
    },
    limit: {
      cs: "Nedostane se k vlastnostem označeným jako citlivé ani ke zdravotním údajům; rozsah určují oprávnění nastavená správcem.",
      en: "It cannot reach properties marked sensitive or health data; scope is set by administrator-configured permissions.",
    },
  },
  {
    name: "Shopify",
    vendor: "Shopify",
    url: "https://shopify.dev/docs/apps/build/storefront-mcp",
    status: "oficialni",
    category: "marketing",
    desc: {
      cs: "Prochází katalog, košík a obchodní podmínky obchodu; druhý server řeší objednávky, vratky a účty zákazníků.",
      en: "Browses a store's catalog, cart and policies; a second server covers orders, returns and customer accounts.",
    },
    limit: {
      cs: "Jde o dva samostatné servery — Storefront a Customer Accounts — s odlišným rozsahem i přihlášením.",
      en: "These are two separate servers — Storefront and Customer Accounts — with different scopes and sign-in.",
    },
  },
  {
    name: "Intercom",
    vendor: "Intercom",
    url: "https://developers.intercom.com/docs/guides/mcp",
    status: "oficialni",
    category: "marketing",
    desc: {
      cs: "Hledá v konverzacích a kontaktech podpory a čte i zakládá články nápovědy.",
      en: "Searches support conversations and contacts and reads and creates help-centre articles.",
    },
    limit: {
      cs: "V době psaní jen pro workspace hostované v USA a EU; australský region podporovaný není.",
      en: "At the time of writing only for US- and EU-hosted workspaces; the Australian region is unsupported.",
    },
  },
  {
    name: "Webflow",
    vendor: "Webflow",
    url: "https://developers.webflow.com/data/docs/ai-tools",
    status: "oficialni",
    category: "marketing",
    desc: {
      cs: "Spravuje položky CMS a assety a přes Designer API zakládá a styluje prvky přímo na plátně.",
      en: "Manages CMS items and assets and, via the Designer API, creates and styles elements directly on the canvas.",
    },
  },

  // ── Vývoj a hosting ─────────────────────────────────────────────────────
  {
    name: "GitHub",
    vendor: "GitHub",
    url: "https://github.com/github/github-mcp-server",
    status: "oficialni",
    category: "vyvoj",
    desc: {
      cs: "Čte kód, issues a pull requesty, zakládá větve a commity, spouští a čte běhy GitHub Actions.",
      en: "Reads code, issues and pull requests, creates branches and commits, and runs and reads GitHub Actions.",
    },
    limit: {
      cs: "Rozsah se řídí tokenem nebo instalací aplikace — dejte mu jen ta repozitáře, která opravdu potřebuje.",
      en: "Scope follows the token or app installation — grant it only the repositories it genuinely needs.",
    },
  },
  {
    name: "Vercel",
    vendor: "Vercel",
    url: "https://vercel.com/docs/mcp/vercel-mcp",
    status: "oficialni",
    category: "vyvoj",
    desc: {
      cs: "Vypisuje projekty a nasazení, čte build logy a běhové chyby a nasazuje nové verze.",
      en: "Lists projects and deployments, reads build logs and runtime errors, and ships new deployments.",
    },
  },
  {
    name: "Netlify",
    vendor: "Netlify",
    url: "https://docs.netlify.com/build/build-with-ai/netlify-mcp-server/",
    status: "oficialni",
    category: "vyvoj",
    desc: {
      cs: "Zakládá a nasazuje weby, konfiguruje funkce, Blobs, databázi, formuláře a přesměrování.",
      en: "Creates and deploys sites and configures functions, Blobs, the database, forms and redirects.",
    },
  },
  {
    name: "Cloudflare",
    vendor: "Cloudflare",
    url: "https://developers.cloudflare.com/agents/model-context-protocol/mcp-servers-for-cloudflare/",
    status: "oficialni",
    category: "vyvoj",
    desc: {
      cs: "Sada serverů pro DNS, Workers, R2, logy, Radar i audit — každá oblast má vlastní endpoint.",
      en: "A family of servers for DNS, Workers, R2, logs, Radar and audit — each area has its own endpoint.",
    },
    limit: {
      cs: "Není to jeden konektor, ale desítka samostatných; připojujete jen ty, které potřebujete.",
      en: "It is not one connector but a dozen separate ones; connect only those you actually need.",
    },
  },
  {
    name: "Sentry",
    vendor: "Sentry",
    url: "https://mcp.sentry.dev/",
    status: "oficialni",
    category: "vyvoj",
    desc: {
      cs: "Hledá v chybách a výkonnostních datech, třídí issues a čte k nim dokumentaci a kontext.",
      en: "Searches errors and performance data, triages issues and pulls documentation and context for them.",
    },
    limit: {
      cs: "Přístup lze zúžit na jednu organizaci nebo projekt přímo v adrese serveru.",
      en: "Access can be narrowed to one organization or project directly in the server URL.",
    },
  },
  {
    name: "Stripe",
    vendor: "Stripe",
    url: "https://docs.stripe.com/mcp",
    status: "oficialni",
    category: "vyvoj",
    desc: {
      cs: "Pracuje se zákazníky, fakturami, platebními odkazy, předplatnými i vratkami a hledá v dokumentaci.",
      en: "Works with customers, invoices, payment links, subscriptions and refunds, and searches the docs.",
    },
    limit: {
      cs: "Umí volat i zápisové metody API včetně vratek. Autorizaci i jednotlivé relace odeberete v dashboardu.",
      en: "It can call write API methods, refunds included. Authorizations and individual sessions are revocable in the dashboard.",
    },
  },
  {
    name: "PayPal",
    vendor: "PayPal",
    url: "https://developer.paypal.com/tools/mcp-server/",
    status: "oficialni",
    category: "vyvoj",
    desc: {
      cs: "Zakládá a odesílá faktury, čte transakce a spravuje produkty a předplatná obchodníka.",
      en: "Creates and sends invoices, reads transactions and manages a merchant's products and subscriptions.",
    },
    limit: {
      cs: "Má oddělený sandbox a produkční endpoint — testujte na sandboxu, ne na ostrém účtu.",
      en: "It has separate sandbox and production endpoints — test on the sandbox, not on a live account.",
    },
  },
  {
    name: "Playwright",
    vendor: "Microsoft",
    url: "https://github.com/microsoft/playwright-mcp",
    status: "oficialni",
    category: "vyvoj",
    desc: {
      cs: "Ovládá prohlížeč: proklikává stránky, vyplňuje formuláře a čte je přes strom přístupnosti místo screenshotů.",
      en: "Drives a browser: clicks through pages, fills forms and reads them via the accessibility tree instead of screenshots.",
    },
    limit: {
      cs: "Běží lokálně a otevírá skutečný prohlížeč — počítejte s tím, že navštíví jakoukoli adresu, kterou dostane.",
      en: "Runs locally and opens a real browser — expect it to visit whatever address it is given.",
    },
  },
  {
    name: "Context7",
    vendor: "Upstash",
    url: "https://github.com/upstash/context7",
    status: "oficialni",
    category: "vyvoj",
    desc: {
      cs: "Dotahuje aktuální dokumentaci a ukázky kódu ke konkrétní verzi knihovny přímo do promptu.",
      en: "Pulls up-to-date documentation and code samples for a specific library version straight into the prompt.",
    },
  },
  {
    name: "Grafana",
    vendor: "Grafana Labs",
    url: "https://github.com/grafana/mcp-grafana",
    status: "oficialni",
    category: "vyvoj",
    desc: {
      cs: "Hledá dashboardy, dotazuje se datových zdrojů a čte i spravuje pravidla upozornění.",
      en: "Searches dashboards, queries data sources and reads and manages alert rules.",
    },
    limit: {
      cs: "Funguje proti vlastní instalaci i Grafana Cloudu; rozsah určuje service account token.",
      en: "Works against a self-hosted instance or Grafana Cloud; scope is set by the service-account token.",
    },
  },

  // ── Veřejné registry a věda ─────────────────────────────────────────────
  {
    name: "PubMed",
    vendor: "Anthropic (data z NCBI)",
    url: "https://academy.claude.com/tutorials/using-the-pubmed-connector-in-claude",
    status: "oficialni",
    category: "registry",
    desc: {
      cs: "Hledá v citacích PubMedu a stahuje plné texty článků, které jsou v PubMed Central.",
      en: "Searches PubMed citations and retrieves full texts of articles held in PubMed Central.",
    },
    limit: {
      cs: "Plný text je jen u článků v PMC. U ostatních dostanete metadata, abstrakt a odkaz. Používání je zdarma.",
      en: "Full text exists only for PMC articles. For the rest you get metadata, an abstract and a link. Free to use.",
    },
  },
  {
    name: "Hlídač státu",
    vendor: "Hlídač státu",
    url: "https://www.hlidacstatu.cz/napoveda/mcp",
    status: "oficialni",
    category: "registry",
    desc: {
      cs: "Prohledává registr smluv, veřejné zakázky, dotace, insolvence, sponzoring stran, platy politiků, rozhodnutí ÚOHS i stenozáznamy PSP.",
      en: "Searches the Czech contracts register, public tenders, subsidies, insolvencies, party donations, politicians' salaries, antitrust rulings and parliamentary transcripts.",
    },
    limit: {
      cs: "Vyžaduje účet na hlidacstatu.cz. Žebříčky navýšení smluv jsou jen pro vybrané role včetně novinářské a detailní rozpad K-indexu chce komerční licenci.",
      en: "Requires an account on hlidacstatu.cz. Contract-increase rankings are limited to selected roles including journalists, and the detailed K-index breakdown needs a commercial licence.",
    },
  },
  {
    name: "Wolfram",
    vendor: "Wolfram Research",
    url: "https://claude.com/connectors/wolfram",
    status: "oficialni",
    category: "registry",
    desc: {
      cs: "Počítá ve Wolfram Language, kreslí grafy a tahá kurátorovaná data místo odhadů z modelu.",
      en: "Computes in Wolfram Language, plots charts and pulls curated data instead of model guesswork.",
    },
    limit: {
      cs: "Výpočty běží v cloudu Wolframu, takže tam odchází i zadání úlohy.",
      en: "Computation runs in Wolfram's cloud, so the problem statement leaves your machine with it.",
    },
  },
  {
    name: "Hugging Face",
    vendor: "Hugging Face",
    url: "https://huggingface.co/docs/hub/en/agents-mcp",
    status: "oficialni",
    category: "registry",
    desc: {
      cs: "Hledá modely, datasety a papery na Hubu a připojuje nástroje běžící ve Spaces.",
      en: "Searches models, datasets and papers on the Hub and attaches tools running in Spaces.",
    },
    limit: {
      cs: "Bez přihlášení uvidí jen veřejný obsah; s tokenem i vaše privátní repozitáře.",
      en: "Without sign-in it sees public content only; with a token it also reaches your private repositories.",
    },
  },
  {
    name: "NASA Earthdata",
    vendor: "NASA",
    url: "https://github.com/nasa/earthdata-mcp",
    status: "oficialni",
    category: "registry",
    desc: {
      cs: "Hledá v metadatovém katalogu NASA (CMR) datové sady o Zemi, ověřuje granule a dohledává citace.",
      en: "Searches NASA's metadata catalog (CMR) for Earth-science datasets, verifies granules and looks up citations.",
    },
    limit: {
      cs: "Vrací metadata a odkazy na datové sady, ne samotná měření.",
      en: "It returns metadata and dataset links, not the measurements themselves.",
    },
  },
  {
    name: "arXiv",
    vendor: "Komunitní projekt blazickjp/arxiv-mcp-server",
    url: "https://github.com/blazickjp/arxiv-mcp-server",
    status: "komunitni",
    category: "registry",
    desc: {
      cs: "Hledá preprinty na arXivu, čte jednotlivé sekce jejich LaTeXu a exportuje citace.",
      en: "Searches arXiv preprints, reads individual LaTeX sections of them and exports citations.",
    },
    limit: {
      cs: "arXiv vlastní konektor nevydává. Tenhle je od třetí strany, běží lokálně nad veřejným API.",
      en: "arXiv publishes no connector of its own. This one is third-party and runs locally against the public API.",
    },
  },

  // ── Komunikace ──────────────────────────────────────────────────────────
  {
    name: "Slack",
    vendor: "Slack",
    url: "https://docs.slack.dev/ai/slack-mcp-server/",
    status: "oficialni",
    category: "komunikace",
    desc: {
      cs: "Hledá ve zprávách, souborech a kanálech, čte a odesílá zprávy a pracuje s canvasy.",
      en: "Searches messages, files and channels, reads and sends messages and works with canvases.",
    },
    limit: {
      cs: "Připojení schvaluje správce workspace; konektor vidí to, k čemu má přístup váš účet.",
      en: "A workspace admin approves the connection; the connector sees whatever your account can access.",
    },
  },
  {
    name: "Gmail",
    vendor: "Anthropic",
    url: "https://support.claude.com/en/articles/10166901-use-google-workspace-connectors",
    status: "oficialni",
    category: "komunikace",
    desc: {
      cs: "Prohledává schránku, čte a shrnuje vlákna a připravuje odpovědi i nové koncepty.",
      en: "Searches the mailbox, reads and summarizes threads and drafts replies and new messages.",
    },
    limit: {
      cs: "K obsahu příloh se nedostane, vidí jen jejich metadata. Část pokročilých filtrů nepodporuje.",
      en: "It cannot read attachment contents, only their metadata, and some advanced filters are unsupported.",
    },
  },
  {
    name: "Google Kalendář",
    vendor: "Anthropic",
    url: "https://support.claude.com/en/articles/10166901-use-google-workspace-connectors",
    status: "oficialni",
    category: "komunikace",
    desc: {
      cs: "Zakládá, mění a maže události, hledá společné volno účastníků a přidává odkazy na Meet.",
      en: "Creates, edits and deletes events, finds mutual availability across attendees and adds Meet links.",
    },
    limit: {
      cs: "V týmových a firemních tarifech musí konektor nejdřív povolit vlastník účtu.",
      en: "On team and enterprise plans an account owner must enable the connector first.",
    },
  },
  {
    name: "Zoom",
    vendor: "Zoom",
    url: "https://developers.zoom.us/docs/mcp/plug-ins-and-connectors/claude-connector/",
    status: "oficialni",
    category: "komunikace",
    desc: {
      cs: "Hledá v přepisech a shrnutích schůzek, vypisuje cloudové nahrávky a zakládá navazující Zoom Docs.",
      en: "Searches meeting transcripts and summaries, lists cloud recordings and creates follow-up Zoom Docs.",
    },
    limit: {
      cs: "Stojí na funkcích AI Companion — bez zapnutého chytrého nahrávání a shrnutí schůzek toho moc nezvládne.",
      en: "It rests on AI Companion features — without smart recording and meeting summary enabled it can do little.",
    },
  },
  {
    name: "Twilio",
    vendor: "Twilio Labs",
    url: "https://github.com/twilio-labs/mcp",
    status: "oficialni",
    category: "komunikace",
    desc: {
      cs: "Odesílá SMS a spouští hovory, spravuje čísla a čte protokoly zpráv přes veřejné API Twilia.",
      en: "Sends SMS and starts calls, manages numbers and reads message logs through Twilio's public API.",
    },
    limit: {
      cs: "Odesílání zpráv je zpoplatněná akce s reálným dopadem — nechte si ji potvrzovat.",
      en: "Sending messages is a billable action with real-world effects — keep it behind a confirmation step.",
    },
  },
  {
    name: "Discord",
    vendor: "Komunitní projekt barryyip0625/mcp-discord",
    url: "https://github.com/barryyip0625/mcp-discord",
    status: "komunitni",
    category: "komunikace",
    desc: {
      cs: "Čte a posílá zprávy na Discordu, zakládá kanály a fórové příspěvky a spravuje role.",
      en: "Reads and sends Discord messages, creates channels and forum posts and manages roles.",
    },
    limit: {
      cs: "Discord oficiální konektor nevydává. Server je od třetí strany a běží pod tokenem vašeho bota.",
      en: "Discord publishes no official connector. This server is third-party and runs under your bot's token.",
    },
  },
];

export function getConnectorsByCategory(): {
  id: ConnectorCategory;
  title: ConnectorText;
  intro: ConnectorText;
  items: Connector[];
}[] {
  return connectorCategories
    .map((cat) => ({
      ...cat,
      items: connectors.filter((c) => c.category === cat.id),
    }))
    .filter((cat) => cat.items.length > 0);
}
