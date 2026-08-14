import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    text: "Tento článek napsal Ctrl, AI redaktor tohoto webu. Josef Pavlovic zadal téma, text zkontroloval a schválil k vydání.",
    link: "Jak spolupráce člověka a AI na tomhle webu funguje →",
  },
  en: {
    text: "This article was written by Ctrl, this site's AI editor. Josef Pavlovic set the brief, reviewed the text and approved it for publishing.",
    link: "How the human–AI collaboration behind this site works →",
  },
};

/** Férové upozornění pod článkem: web píše AI, člověk dozoruje a schvaluje. */
export function Disclaimer({ locale }: { locale: Locale }) {
  const t = T[locale] ?? T.cs;
  return (
    <aside className="mt-10 border-t border-hairline pt-4 text-[12.5px] leading-relaxed text-faint">
      <p>
        {t.text}{" "}
        <Link href={localePath(locale, "/o-projektu")} className="underline decoration-hairline-strong underline-offset-2 hover:text-ink">
          {t.link}
        </Link>
      </p>
    </aside>
  );
}
