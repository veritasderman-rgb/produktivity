/**
 * Vstupní dotazník ke školení AI pro poslanecký klub Pirátů (/skoleni/pirati).
 * Možnosti otázek sdílí formulář i API, aby server přijal jen to, co formulář
 * nabízí. Odpovědi jdou do Neonu (tabulka pirati_dotaznik), vyplňující dostane
 * přes Resend e-mail s doporučeným čtením z webu — výběr skládá doporuc().
 */

export const UROVNE = [
  "Nepoužívám",
  "Jen občas se na něco zeptám",
  "Pravidelně, ale jen chat",
  "Mám projekty s instrukcemi a soubory",
  "Připojuji AI k dalším nástrojům (Drive, e-mail, konektory)",
  "Mám automatizace, které běží samy",
] as const;

export const NASTROJE = [
  "ChatGPT",
  "Claude",
  "Gemini",
  "Microsoft Copilot",
  "Perplexity",
  "NotebookLM",
  "Jiný",
] as const;

export const GRAFIKA_NIC = "Grafiku ani video s AI nedělám";

export const GRAFIKA = [
  GRAFIKA_NIC,
  "Jen v chatu, nechám si vygenerovat obrázek (JPG/PNG)",
  "AI funkce přímo v aplikacích (Canva, Photoshop, CapCut apod.)",
  "AI ovládá aplikace na počítači (střih videa, tvorba grafiky)",
] as const;

export const PLACENY_UCET = [
  "Ano, platím si sám/sama",
  "Ano, hradí klub nebo kancelář",
  "Ne",
] as const;

export const KB_MCP = [
  "Neslyšel(a) jsem o nich",
  "Slyšel(a), nezkoušel(a)",
  "Mám připojené",
] as const;

/** Otázka 13: znalost pojmů — každý pojem má jednu odpověď ze ZNALOST. */
export const POJMY = ["GitHub", "Vercel", "MCP server", "Kontext", "Token"] as const;

export const ZNALOST = ["Neslyšel(a)", "Slyšel(a), ale nevím přesně", "Vím, co to je"] as const;

/** Minimální délka odpovědí na otevřené otázky — hlídá klient i server. */
export const MIN_OPEN = 20;

export type Odpovedi = {
  uroven: string;
  nastroje: string[];
  grafika: string[];
  placenyUcet: string;
  kbMcp: string;
  /** Pojem → odpověď ze ZNALOST. */
  pojmy: Record<string, string>;
  zroutCasu: string;
  ocekavani: string;
};

export type Doporuceni = {
  /** Cesta na produktivni.cz bez domény, např. „/tipy/ai-prvni-krok“. */
  href: string;
  title: string;
  /** Jedna věta, proč to čtenáři posíláme — míří na jeho odpověď. */
  why: string;
};

const R = {
  cesta14: {
    href: "/cesty/prvnich-14-dni-s-ai",
    title: "Prvních 14 dní s AI",
    why: "Deset krátkých kroků od první konverzace k vlastní rutině — nejlepší start, pokud AI zatím nepoužíváte pravidelně.",
  },
  zacatecnik: {
    href: "/tipy/ai-zacatecnik-instalace-a-rozdily",
    title: "AI pro úplné začátečníky: co si nainstalovat a v čem se liší chat, Cowork a Claude Code",
    why: "Co si dát do počítače a mobilu, abyste na školení nezačínali instalací.",
  },
  anatomie: {
    href: "/tipy/ai-role-a-kontext",
    title: "Role, kontext, úkol, formát: anatomie promptu, který vrátí práci",
    why: "Jak zadat práci tak, aby výsledek šel rovnou dál a nemuseli jste ho třikrát přepisovat.",
  },
  projekty: {
    href: "/tipy/ai-projekty-kontext",
    title: "Projekty v AI: kontext nahrajete jednou, ne pokaždé",
    why: "Další krok po chatu: projekt s instrukcemi a podklady k jednomu výboru nebo tématu poslance.",
  },
  instrukce: {
    href: "/tipy/ai-vlastni-instrukce",
    title: "Vlastní instrukce: nastavte AI jednou, platí pořád",
    why: "Styl, tón a pravidla kanceláře zadáte jednou a AI je drží v každé odpovědi.",
  },
  knihovna: {
    href: "/tipy/ai-knihovna-promptu",
    title: "Knihovna promptů: neopisujte, co už funguje",
    why: "Zadání, která se osvědčila, si uložte — hodí se i pro sdílení mezi asistenty v klubu.",
  },
  mcp: {
    href: "/tipy/mcp-konektory-usb-c-pro-ai",
    title: "MCP konektory: USB-C pro AI",
    why: "Co jsou konektory a proč s nimi AI pracuje s Pirátskou znalostní bází, Drivem nebo poštou napřímo.",
  },
  konektory: {
    href: "/konektory",
    title: "Katalog MCP konektorů",
    why: "Přehled konektorů, které dnes fungují, a k čemu se který hodí.",
  },
  rutiny: {
    href: "/tipy/claude-rutiny-posta-kalendar",
    title: "Rutiny v Claude: pošta se roztřídí a koncepty napíšou, než přijdete",
    why: "Když už máte AI napojenou na nástroje, další úroveň je práce, která se dělá sama.",
  },
  rutinyKapitola: {
    href: "/prirucka/rutiny-a-agenti",
    title: "Rutiny a agenti: od „ptám se“ k „běží to samo“",
    why: "Jak navrhnout automatizaci, kolik kontroly potřebuje a kdy ji zrušit.",
  },
  trojice: {
    href: "/agenti/smrtici-trojice-agentu",
    title: "Smrtící trojice: proč jsou agenti strukturálně zranitelní",
    why: "Automatizace s přístupem k poště a dokumentům je i bezpečnostní riziko — tady je proč a jak ho zmenšit.",
  },
  cloud: {
    href: "/agenti/co-nikdy-neposilat-do-cloudu",
    title: "Co nikdy neposílat do cloudu (a jak to ohlídat)",
    why: "Neveřejné podklady, osobní údaje občanů a interní věci klubu do běžného chatu nepatří.",
  },
  srovnani: {
    href: "/tipy/claude-chatgpt-gemini-srovnani",
    title: "Claude, ChatGPT a Gemini: velké srovnání",
    why: "Než si začnete platit (nebo o to požádáte klub), ať víte, který nástroj se hodí na vaši práci.",
  },
  notebooklm: {
    href: "/tipy/notebooklm-vlastni-zdroje",
    title: "NotebookLM: odpovědi jen z vašich zdrojů",
    why: "Nahrajete tisk, důvodovou zprávu a stenozáznam a ptáte se jen nad nimi — s odkazem na místo v textu.",
  },
  vytah: {
    href: "/tipy/ai-shrnuti-dokumentu",
    title: "Dlouhý dokument? Nechte AI udělat výtah s čísly stránek",
    why: "Podklady k tiskům rychleji a s možností každé tvrzení dohledat v originále.",
  },
  citace: {
    href: "/tipy/ai-vyhledavani-citace",
    title: "AI vyhledávače s citacemi: rešerše s ověřitelnými zdroji",
    why: "Rešerše k pozměňovacím návrhům, kde u každé věty vidíte, odkud pochází.",
  },
  vlakno: {
    href: "/tipy/ai-shrnuti-vlakna",
    title: "Přizvali vás do vlákna o třiceti mailech? AI řekne, co se od vás čeká",
    why: "Rychlá orientace v dlouhé korespondenci s úřady, občany nebo kolegy.",
  },
  sablonyPosty: {
    href: "/tipy/sablony-z-odeslane-posty-ai",
    title: "Šablony odpovědí z vlastní odeslané pošty",
    why: "Odpovědi občanům na opakované dotazy z toho, co jste už jednou dobře napsali.",
  },
  site: {
    href: "/tipy/socialni-site-s-ai",
    title: "Sociální sítě na autopilota (s lidským palcem)",
    why: "Texty a vizuály na sítě rychleji — a s kontrolou člověka před zveřejněním.",
  },
  kampan: {
    href: "/tipy/marketingova-kampan-jeden-zdroj-mcp",
    title: "Kampaň z jednoho zdroje pravdy: Canva, Buffer a další přes MCP",
    why: "Když už grafiku děláte s AI, takhle ji propojíte s plánováním příspěvků.",
  },
  brief: {
    href: "/tipy/claude-ranni-brief-navod",
    title: "Ranní brief: co dnes čeká na rozhodnutí",
    why: "Termíny výborů, pošta a kalendář v jednom ranním přehledu, který si AI připraví sama.",
  },
  overovani: {
    href: "/tipy/ai-overovani-faktu",
    title: "AI si vymýšlí s jistotou v hlase. Ověřujte",
    why: "Jak chytit vymyšlenou odpověď dřív, než ji dostane poslanec na stůl.",
  },
  slovnik: {
    href: "/slovnik",
    title: "Slovník pojmů z AI",
    why: "MCP, token, kontextové okno a další slova, která na školení padnou — každé vysvětlené pár větami.",
  },
  urovne: {
    href: "/prirucka/pet-urovni-ai",
    title: "Pět úrovní práce s AI: od chatu k agentovi",
    why: "Mapa, podle které je postavené školení — uvidíte, kde jste teď a kam se dá dojít.",
  },
  eticky: {
    href: "/prirucka/ai-eticky-a-bezpecne",
    title: "AI eticky a bezpečně: data, odpovědnost, hranice",
    why: "Kdo odpovídá za výstup, co smí kam za data a co přiznat — ve veřejné funkci dvojnásob.",
  },
} satisfies Record<string, Doporuceni>;

const MAX = 8;

/**
 * Sestaví doporučené čtení podle odpovědí. Pořadí = priorita: nejdřív to, co
 * odpovídá úrovni a neznámým pojmům, pak témata z otevřených odpovědí, nakonec ověřování
 * a bezpečnost, které dostane každý.
 */
export function doporuc(o: Odpovedi): Doporuceni[] {
  const out: Doporuceni[] = [];
  const add = (...items: Doporuceni[]) => {
    for (const it of items) if (!out.some((x) => x.href === it.href)) out.push(it);
  };

  const level = Math.max(0, UROVNE.indexOf(o.uroven as (typeof UROVNE)[number]));
  if (level <= 1) add(R.cesta14, R.zacatecnik, R.anatomie);
  else if (level === 2) add(R.projekty, R.instrukce, R.knihovna);
  else if (level === 3) add(R.mcp, R.konektory);
  else if (level === 4) add(R.rutiny, R.rutinyKapitola);
  else add(R.trojice, R.rutinyKapitola);

  // Neznámé pojmy z otázky 13: slovník má přednost před tématy z otevřených odpovědí.
  const neznam = POJMY.filter((p) => o.pojmy[p] !== ZNALOST[2]);
  if (neznam.includes("MCP server")) add(R.mcp);
  if (neznam.length > 0) add(R.slovnik);

  const text = `${o.zroutCasu} ${o.ocekavani}`.toLowerCase();
  if (/steno|tisk|podklad|důvodov|zákon|rešerš|reserš|pozměň|pozmen|legislat/.test(text)) {
    add(o.nastroje.includes("NotebookLM") ? R.vytah : R.notebooklm, R.citace);
  }
  if (/občan|obcan|e-mail|email|mail|pošt|post[aěy]|korespond|odpověd|odpoved|dopis/.test(text)) {
    add(R.sablonyPosty, R.vlakno);
  }
  if (/sít|sit[ěie]|post|facebook|instagram|twitter|bluesky|tiktok|video|grafik|příspěv|prispev/.test(text)) {
    add(R.site);
  }
  if (/termín|termin|výbor|vybor|kalend|schůz|schuz|hlídá|hlida/.test(text)) {
    add(R.brief);
  }

  if (o.kbMcp !== "Mám připojené" && level < 3) add(R.mcp);
  if (o.grafika.some((g) => g !== GRAFIKA_NIC && g !== GRAFIKA[1])) add(R.kampan);
  else if (o.grafika.includes(GRAFIKA[1])) add(R.site);
  if (o.placenyUcet === "Ne" && level >= 1) add(R.srovnani);

  // Ověřování a bezpečnost patří do výběru vždycky — i když je seznam už plný.
  const always = [R.overovani, R.eticky, level >= 3 ? R.cloud : R.urovne];
  const head = out.filter((d) => !always.some((a) => a.href === d.href)).slice(0, MAX - always.length);
  return [...head, ...always];
}
