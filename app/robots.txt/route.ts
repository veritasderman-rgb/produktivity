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
 * Cesty, které nechceme dát AI crawlerům. U ostatního obsahu je vítáme,
 * e-book je ale odměna za přihlášení k newsletteru — ne materiál k učení.
 *
 * Pro vyhledávače tady schválně nic není: `Disallow` zakazuje stahování,
 * ne indexaci, takže adresa se ve výsledcích objevit může, když na ni
 * někdo odkáže — a zakázanou adresu robot nestáhne, takže by neviděl ani
 * `noindex`. Vyhledávače proto e-book stahovat smí a z indexu ho drží
 * hlavička `X-Robots-Tag: noindex` z next.config.ts.
 *
 * Ani jedno neřeší přístup: kdo adresu zná, PDF si stáhne dál. To je
 * v pořádku — přeposlat e-book známému je funkce, ne chyba.
 */
const AI_BOTS_DISALLOW = ["/ebook/"];

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
    "",
    ...AI_BOTS.flatMap((bot) => [
      `User-Agent: ${bot}`,
      "Allow: /",
      ...AI_BOTS_DISALLOW.map((path) => `Disallow: ${path}`),
      "",
    ]),
    `Sitemap: ${base}/sitemap.xml`,
    "",
  ];

  return new Response(lines.join("\n"), {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
