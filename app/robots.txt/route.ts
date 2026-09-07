import type { NextRequest } from "next/server";

// AI crawleři jsou výslovně vítáni — cíl je být citovaný zdroj v AI odpovědích.
// Přehled obsahu pro LLM: /llms.txt (plné texty: /llms-full.txt)
//
// Route handler místo app/robots.ts: web běží na dvou doménách (produktivni.cz
// a productive.tips) a řádek Sitemap musí ukazovat na doménu, ze které se
// robots.txt zrovna čte. Statické `app/robots.ts` umí jen jednu URL.
// Middleware se na /robots.txt nespouští (matcher ho vynechává), takže Host
// čteme přímo tady — stejná logika jako v middleware.ts.

const EN_DOMAIN = process.env.EN_DOMAIN ?? "productive.tips";

/** Boti, kterým allow říkáme explicitně (nad rámec obecného `*`). */
const AI_BOTS = ["GPTBot", "ClaudeBot", "Claude-Web", "PerplexityBot", "Google-Extended", "CCBot"];

/**
 * E-book je odměna za přihlášení k newsletteru, ne článek k nalezení ve
 * vyhledávání. Odkaz na PDF chodí v uvítacím e-mailu a zobrazí se po
 * odeslání formuláře; indexovat ho nechceme, jinak by se dal najít rovnou
 * a magnet by ztratil smysl. Platí to i pro AI crawlery — u ostatního
 * obsahu je vítáme, tady by výsledek byl stejný jako v našeptávači.
 *
 * Pozor: robots.txt řeší indexaci, ne přístup. Kdo adresu zná, PDF si
 * stáhne dál — a to je v pořádku, přeposlání e-booku známému je funkce,
 * ne chyba.
 */
const DISALLOW_ALL_BOTS = ["/ebook/"];

export function GET(req: NextRequest) {
  const host = (req.headers.get("host") ?? "").toLowerCase();
  const isEn = host === EN_DOMAIN || host === `www.${EN_DOMAIN}`;
  const base = isEn ? "https://www.productive.tips" : "https://www.produktivni.cz";

  const lines = [
    "User-Agent: *",
    "Allow: /",
    // Náhledové obrázky (og:image) se generují v /api/og — musí zůstat
    // dostupné, jinak je Search Console hlásí jako blokované robots.txt.
    // Delší pravidlo vyhrává nad obecným Disallow níž.
    "Allow: /api/og",
    "Disallow: /api/",
    ...DISALLOW_ALL_BOTS.map((path) => `Disallow: ${path}`),
    "",
    ...AI_BOTS.flatMap((bot) => [
      `User-Agent: ${bot}`,
      "Allow: /",
      ...DISALLOW_ALL_BOTS.map((path) => `Disallow: ${path}`),
      "",
    ]),
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
