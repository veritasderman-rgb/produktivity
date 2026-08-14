import type { Metadata } from "next";
import Link from "next/link";
import Script from "next/script";
import { notFound } from "next/navigation";
import { Schibsted_Grotesk, Lora, JetBrains_Mono } from "next/font/google";
import { Analytics } from "@vercel/analytics/react";
import { Keycap } from "@/components/Keycap";
import { LangSwitch } from "@/components/LangSwitch";
import { NavAi, NavAiChips } from "@/components/NavAi";
import { audienceBase, audienceHref, audiences } from "@/lib/audiences";
import { getDict, isLocale, localePath, type Locale } from "@/lib/i18n";
import { JsonLd, websiteJsonLd } from "@/components/JsonLd";
import "../globals.css";

const schibsted = Schibsted_Grotesk({
  subsets: ["latin", "latin-ext"],
  variable: "--font-schibsted",
});

const lora = Lora({
  subsets: ["latin", "latin-ext"],
  style: ["normal", "italic"],
  variable: "--font-lora",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin", "latin-ext"],
  variable: "--font-jbmono",
});

/** Měřicí kód Google Analytics. Přebitelný proměnnou prostředí, ať jde vypnout bez zásahu do kódu. */
const GA_ID = process.env.NEXT_PUBLIC_GA_ID ?? "G-6GPVS7CRY6";

export function generateStaticParams() {
  return [{ locale: "cs" }, { locale: "en" }];
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = getDict(isLocale(locale) ? locale : "cs");
  return {
    metadataBase: new URL(locale === "en" ? "https://productive.tips" : "https://produktivni.cz"),
    title: { default: t.siteTitle, template: `%s · ${t.siteBrand}` },
    description: t.siteDescription,
  };
}

export default async function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: rawLocale } = await params;
  if (!isLocale(rawLocale)) notFound();
  const locale: Locale = rawLocale;
  const t = getDict(locale);
  const p = (path: string) => localePath(locale, path);

  const nav = [
    { href: p("/prirucka"), label: t.nav.handbook },
    { href: p("/tipy"), label: t.nav.tips },
    { href: p("/cesty"), label: t.nav.paths },
    { href: p("/ai"), label: t.nav.ai, dropdown: true },
    { href: p("/prompty"), label: t.nav.prompts },
    { href: p("/nastroje"), label: t.nav.tools },
    { href: p("/gadgety"), label: t.nav.gadgets },
    { href: p("/hledat"), label: t.nav.search },
  ];

  // Podmenu profesí: v desktopové navigaci pod položkou „AI“, na mobilu pruh chipů.
  const proMenu = audiences.map((a) => ({
    href: audienceHref(a, locale),
    label: `${t.pro.forPrefix} ${a.forWhom[locale]}`,
  }));
  const proChips = audiences.map((a) => ({
    href: audienceHref(a, locale),
    label: a.name[locale],
  }));

  return (
    <html lang={locale} className={`${schibsted.variable} ${lora.variable} ${jetbrainsMono.variable}`}>
      <body>
        <JsonLd data={websiteJsonLd(locale)} />
        <header className="sticky top-0 z-10 border-b border-hairline bg-paper">
          <div className="mx-auto flex max-w-[var(--page-max)] items-center justify-between gap-4 px-[var(--page-pad)] py-3.5">
            <Link href={p("/")} className="flex items-center gap-3 no-underline">
              <Keycap size={38} />
              <span className="leading-none">
                <span className="display block text-[19px]">{t.siteName}</span>
                <span className="eyebrow mt-1 block text-accent">{t.siteTld}</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 max-sm:hidden" aria-label="Main navigation">
              {nav.map((item) =>
                item.dropdown ? (
                  <NavAi
                    key={item.href}
                    label={item.label}
                    menuLabel={t.nav.aiMenu}
                    overview={{ href: item.href, label: t.nav.aiOverview }}
                    groupLabel={t.nav.forProfession}
                    items={proMenu}
                    footer={{ href: p(audienceBase(locale)), label: t.pro.allProfessions }}
                  />
                ) : (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="draw-link px-2.5 py-2 text-[14px] font-semibold"
                  >
                    {item.label}
                  </Link>
                ),
              )}
              <LangSwitch locale={locale} />
              <Link
                href={p("/newsletter")}
                className="ml-1 bg-ink px-4 py-2.5 text-[13px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
              >
                {t.nav.subscribe}
              </Link>
            </nav>
            <div className="flex items-center gap-2 sm:hidden">
              <LangSwitch locale={locale} />
              <Link href={p("/newsletter")} className="bg-ink px-3 py-2 text-[12px] font-bold text-paper">
                {t.nav.subscribe}
              </Link>
            </div>
          </div>
          <nav className="flex justify-center gap-4 border-t border-hairline px-4 py-2 sm:hidden" aria-label="Mobile navigation">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="draw-link py-1 text-[13px] font-semibold">
                {item.label}
              </Link>
            ))}
          </nav>
          <NavAiChips label={t.nav.forProfession} items={proChips} />
        </header>

        <main>{children}</main>
        <Analytics />
        {GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga4" strategy="afterInteractive">
              {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', '${GA_ID}');`}
            </Script>
          </>
        )}

        <footer className="mt-24 border-t-2 border-hairline-strong">
          <div className="mx-auto grid max-w-[var(--page-max)] gap-10 px-[var(--page-pad)] py-14 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <Keycap size={32} />
                <span className="display text-[16px]">{t.siteBrand}</span>
              </div>
              <p className="mt-4 max-w-[38ch] text-[13.5px] leading-relaxed text-muted">
                {t.footer.about}
              </p>
            </div>
            <div>
              <div className="eyebrow mb-4 text-faint">{t.footer.contentLabel}</div>
              <ul className="space-y-2 text-[14px] font-semibold">
                <li><Link href={p("/prirucka")} className="draw-link">{t.footer.handbook}</Link></li>
                <li><Link href={p("/tipy")} className="draw-link">{t.footer.tips}</Link></li>
                <li><Link href={p("/ai")} className="draw-link">{t.footer.aiSection}</Link></li>
                <li><Link href={p("/prompty")} className="draw-link">{t.footer.prompts}</Link></li>
                <li><Link href={p("/sablony")} className="draw-link">{t.footer.templates}</Link></li>
                <li><Link href={p("/gadgety")} className="draw-link">{t.footer.gadgets}</Link></li>
                <li><Link href={p("/rozhovory")} className="draw-link">{t.footer.interviews}</Link></li>
                <li><Link href={p("/slovnik")} className="draw-link">{t.footer.glossary}</Link></li>
                <li><Link href="/rss.xml" className="draw-link">{t.footer.rss}</Link></li>
              </ul>
            </div>
            <div>
              <div className="eyebrow mb-4 text-faint">{t.footer.coopLabel}</div>
              <ul className="space-y-2 text-[14px] font-semibold">
                <li><Link href={p("/kurz")} className="draw-link">{t.footer.course}</Link></li>
                <li><Link href={p("/newsletter")} className="draw-link">{t.footer.newsletter}</Link></li>
                <li><Link href={p("/o-projektu")} className="draw-link">{t.footer.aboutProject}</Link></li>
                <li><a href="https://josefpavlovic.cz" target="_blank" rel="noopener noreferrer" className="draw-link">josefpavlovic.cz</a></li>
                <li><Link href={p("/ochrana-osobnich-udaju")} className="draw-link">{t.footer.privacy}</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-hairline">
            <div className="eyebrow mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-5 text-faint">
              © {new Date().getFullYear()} {t.footer.copyright}
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
