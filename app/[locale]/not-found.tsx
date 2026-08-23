import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    eyebrow: "Chyba 404",
    title: "Tahle klávesa tu není.",
    lead: "Zkusili jsme Ctrl+F, Ctrl+Z i Esc. Stránka neexistuje — možná se přestěhovala, možná nikdy nebyla. Ctrl se dušuje, že ji nepsal.",
    hint: "Klávesy si klidně zmáčkněte. Pomůže to asi jako restart tiskárny, ale je to příjemné.",
    home: "Na úvodní stránku",
    search: "Hledat na webu",
    tenMin: "Nebo si dejte rychlý tip — máte-li 10 minut →",
  },
  en: {
    eyebrow: "Error 404",
    title: "This key does not exist.",
    lead: "We tried Ctrl+F, Ctrl+Z and Esc. The page is not here — maybe it moved, maybe it never was. Ctrl swears it did not write it.",
    hint: "Feel free to press the keys. It helps about as much as restarting the printer, but it feels nice.",
    home: "Back to the homepage",
    search: "Search the site",
    tenMin: "Or grab a quick tip — if you have 10 minutes →",
  },
};

/**
 * Zábavná 404 v identitě webu: tři velké klávesy, které jdou zmáčknout.
 *
 * Jazyk je natvrdo český. Dřív se poznával z hlavičky Host, jenže sáhnutí po
 * `headers()` tady přepnulo celý strom [locale] do dynamického režimu a žádná
 * z 1 400 stránek webu se nepředgenerovala — jedna stránka, kterou skoro nikdo
 * nevidí, tak brzdila všechny ostatní. Odkazy fungují na obou doménách,
 * stránka je noindex a anglická mutace na ní uvidí češtinu.
 */
export default function NotFound() {
  const locale: Locale = "cs";
  const t = T[locale];
  const p = (path: string) => localePath(locale, path);

  return (
    <div className="mx-auto flex max-w-3xl flex-col items-center px-6 py-24 text-center">
      <p className="eyebrow mb-6 text-accent">{t.eyebrow}</p>
      <div className="flex gap-3 sm:gap-4" aria-hidden="true">
        {["4", "0", "4"].map((ch, i) => (
          <button
            key={i}
            type="button"
            tabIndex={-1}
            className="key key-404 cursor-pointer select-none !text-[clamp(44px,10vw,84px)] !leading-none !px-6 !py-4 sm:!px-8 sm:!py-6"
          >
            {ch}
          </button>
        ))}
      </div>
      <h1 className="display mt-10 text-[clamp(26px,4.5vw,40px)]">{t.title}</h1>
      <p className="mt-4 max-w-[52ch] text-[16px] leading-relaxed text-muted">{t.lead}</p>
      <p className="eyebrow mt-3 text-faint">{t.hint}</p>
      <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
        <Link
          href={p("/")}
          className="bg-ink px-6 py-3 text-[14px] font-bold text-paper no-underline transition-colors hover:bg-accent hover:text-accent-ink"
        >
          {t.home}
        </Link>
        <Link href={p("/hledat")} className="draw-link text-[14px] font-bold">
          {t.search}
        </Link>
      </div>
      <Link href={p("/deset-minut")} className="draw-link mt-6 text-[14px] font-semibold text-muted">
        {t.tenMin}
      </Link>
    </div>
  );
}
