"use client";

import { usePathname } from "next/navigation";
import { getDict, type Locale } from "@/lib/i18n";

/** Stránky, které existují jen česky — druhá jazyková verze vrací 404. */
const CS_ONLY = ["/skoleni/pirati"];

/** Přepínač jazyka: vede na tutéž stránku v druhém jazyce a uloží volbu do cookie. */
export function LangSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "/";
  const t = getDict(locale);
  const target = t.langSwitch.target;
  const bare = pathname.replace(/^\/(en|cs)(?=\/|$)/, "") || "/";
  // /en/* i /cs/* nechává kanonizovat middleware — na produkci vedou na
  // správnou doménu (produktivni.cz ↔ productive.tips), na preview zůstávají relativní.
  const href =
    target === "en" ? `/en${bare === "/" ? "" : bare}` || "/en" : `/cs${bare === "/" ? "" : bare}` || "/cs";

  // Stránka bez anglické verze: přepínač by vedl na 404, tak ho neukazujeme.
  if (target === "en" && CS_ONLY.some((path) => bare === path || bare.startsWith(`${path}/`))) return null;

  return (
    <a
      href={href}
      title={t.langSwitch.title}
      onClick={() => {
        document.cookie = `NEXT_LOCALE=${target};path=/;max-age=${60 * 60 * 24 * 365}`;
      }}
      className="border-[1.5px] border-hairline px-2.5 py-1.5 font-mono text-[11px] font-semibold tracking-[0.1em] uppercase transition-colors hover:border-ink"
    >
      {t.langSwitch.label}
    </a>
  );
}
