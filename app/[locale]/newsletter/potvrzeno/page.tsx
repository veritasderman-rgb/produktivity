import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { TrackOnce } from "@/components/TrackOnce";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

/**
 * Kam vede odkaz z potvrzovacího e-mailu (přes /api/subscribe/confirm).
 * Stav přihlášení přichází v parametru `stav`; celý tok popisuje lib/optin.ts.
 */
const EBOOK_HREF: Record<Locale, string> = {
  cs: "/ebook/produktivni-top-30-tipu.pdf",
  en: "/ebook/productive-top-30-tips.pdf",
};

const T = {
  cs: {
    title: "Potvrzení odběru",
    eyebrow: "Newsletter",
    ok: {
      heading: "Hotovo, jste přihlášeni",
      lead: "E-book Top 30 tipů je na cestě do vaší schránky. Jeden tip týdně začne chodit od příštího čísla.",
    },
    kurz: {
      heading: "Hotovo, kurz začíná",
      lead: "První díl je na cestě do vaší schránky, další přijdou každý den. Jako bonus přikládám e-book Top 30 tipů.",
    },
    expired: {
      heading: "Odkaz už neplatí",
      lead: "Potvrzovací odkaz platí sedm dní. Zadejte e-mail znovu a pošlu vám nový.",
    },
    invalid: {
      heading: "Tenhle odkaz se nepovedlo ověřit",
      lead: "Možná se při kopírování zkrátil. Zadejte e-mail znovu a pošlu vám nový.",
    },
    error: {
      heading: "Přihlášení se teď nepovedlo dokončit",
      lead: "Chyba je na naší straně. Zkuste prosím odkaz z e-mailu otevřít znovu za pár minut.",
    },
    download: "Stáhnout e-book (PDF)",
    next: "Kam dál",
    links: [
      { href: "/prirucka", label: "Příručka produktivity" },
      { href: "/tipy", label: "Tipy & triky" },
      { href: "/newsletter/archiv", label: "Archiv newsletteru" },
    ],
  },
  en: {
    title: "Subscription confirmation",
    eyebrow: "Newsletter",
    ok: {
      heading: "Done, you are subscribed",
      lead: "The Top 30 tips e-book is on its way to your inbox. One tip a week starts with the next issue.",
    },
    kurz: {
      heading: "Done, the course is starting",
      lead: "The first part is on its way to your inbox and the rest follow daily. The Top 30 tips e-book comes as a bonus.",
    },
    expired: {
      heading: "This link has expired",
      lead: "The confirmation link is valid for seven days. Enter your email again and I will send a new one.",
    },
    invalid: {
      heading: "This link could not be verified",
      lead: "It may have been cut short when copied. Enter your email again and I will send a new one.",
    },
    error: {
      heading: "The sign-up could not be completed right now",
      lead: "The problem is on our side. Please open the link from the email again in a few minutes.",
    },
    download: "Download the e-book (PDF)",
    next: "Where to next",
    links: [
      { href: "/prirucka", label: "The productivity handbook" },
      { href: "/tipy", label: "Tips & tricks" },
      { href: "/newsletter/archiv", label: "Newsletter archive" },
    ],
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  return { title: T[locale].title, robots: { index: false, follow: false } };
}

export default async function ConfirmedPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ stav?: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale];
  const { stav } = await searchParams;
  const success = stav === "ok" || stav === "kurz";
  const retry = stav === "vyprselo" || stav === "neplatny" || !stav;
  const copy =
    stav === "ok" ? t.ok
    : stav === "kurz" ? t.kurz
    : stav === "vyprselo" ? t.expired
    : stav === "chyba" ? t.error
    : t.invalid;

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      {success && (
        <TrackOnce
          event="newsletter-confirmed"
          gaEvent="newsletter_confirmed"
          data={{ source: stav === "kurz" ? "kurz" : "newsletter", locale }}
        />
      )}
      <p className="eyebrow text-accent">{t.eyebrow}</p>
      <h1 className="display mt-3 text-[clamp(30px,5vw,44px)]">
        {copy.heading}
      </h1>
      <p className="mt-5 text-[17px] leading-relaxed text-muted">{copy.lead}</p>

      {success && (
        <a
          href={EBOOK_HREF[locale]}
          className="mt-7 inline-block bg-ink px-5 py-3 text-[13px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
        >
          {t.download}
        </a>
      )}

      {retry && (
        <div className="mt-8 max-w-md">
          <NewsletterForm source="potvrzeni-znovu" locale={locale} />
        </div>
      )}

      {success && (
        <div className="mt-12 border-t border-hairline-strong pt-6">
          <p className="eyebrow text-faint">{t.next}</p>
          <ul className="mt-3 space-y-2 text-[15.5px]">
            {t.links.map((l) => (
              <li key={l.href}>
                <Link href={localePath(locale, l.href)} className="draw-link font-semibold">
                  {l.label} →
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
