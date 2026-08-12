"use client";

import { usePathname } from "next/navigation";
import { getDict, type Locale } from "@/lib/i18n";

/** Přepínač jazyka: vede na tutéž stránku v druhém jazyce a uloží volbu do cookie. */
export function LangSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname() ?? "/";
  const t = getDict(locale);
  const target = t.langSwitch.target;
  const bare = pathname.replace(/^\/(en|cs)(?=\/|$)/, "") || "/";
  const href = target === "en" ? `/en${bare === "/" ? "" : bare}` || "/en" : bare;

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
