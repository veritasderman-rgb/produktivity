import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    coursePre: "Radši systém než jednotlivé tipy? ",
    courseLink: "E-mailový kurz zdarma",
    coursePost: " — sedm dní, sedm e-mailů, každý den jedna dovednost.",
  },
  en: {
    coursePre: "Prefer a system to single tips? ",
    courseLink: "The free email course",
    coursePost: " — seven days, seven emails, one skill a day.",
  },
};

/**
 * Patička článku s přihlášením k newsletteru.
 *
 * Sjednocuje blok, který měl každý typ článku vlastní (tipy, kapitoly,
 * AI novinky, agenti, cesty, rozhovory): titulek a popisek zůstávají
 * per stránku, formulář a odkaz na e-mailový kurz jsou společné.
 * Kurz je silnější magnet než „newsletter" — slibuje program s koncem —
 * a do téhle chvíle vedl odkaz na něj jen z patičky webu a z homepage.
 */
export function NewsletterCta({
  eyebrow,
  desc,
  source,
  locale = "cs",
}: {
  eyebrow: string;
  desc: string;
  source: string;
  locale?: Locale;
}) {
  const t = T[locale] ?? T.cs;
  return (
    <div className="print-hide mt-14 border-t-2 border-hairline-strong pt-8">
      <p className="eyebrow mb-2 text-faint">{eyebrow}</p>
      <p className="mb-5 max-w-[48ch] text-[15px] text-muted">{desc}</p>
      <div className="max-w-md">
        <NewsletterForm source={source} locale={locale} />
      </div>
      <p className="mt-5 max-w-[52ch] text-[14px] leading-relaxed text-muted">
        {t.coursePre}
        <Link href={localePath(locale, "/kurz")} className="draw-link font-bold text-ink">
          {t.courseLink}
        </Link>
        {t.coursePost}
      </p>
    </div>
  );
}
