import type { Metadata } from "next";
import Link from "next/link";
import { Schibsted_Grotesk, Lora, JetBrains_Mono } from "next/font/google";
import { Keycap } from "@/components/Keycap";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL("https://produktivni.cz"),
  title: {
    default: "Produktivní.cz — rychleji každý den",
    template: "%s · Produktivní.cz",
  },
  description:
    "Ověřené systémy produktivity, denní tipy a triky, zkratky a AI novinky. Česky, bez balastu, k okamžitému použití.",
};

const nav = [
  { href: "/prirucka", label: "Příručka" },
  { href: "/tipy", label: "Tipy & triky" },
  { href: "/ai", label: "AI" },
  { href: "/skoleni", label: "Školení" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="cs" className={`${schibsted.variable} ${lora.variable} ${jetbrainsMono.variable}`}>
      <body>
        <header className="sticky top-0 z-10 border-b border-hairline bg-paper">
          <div className="mx-auto flex max-w-[var(--page-max)] items-center justify-between gap-4 px-[var(--page-pad)] py-3.5">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <Keycap size={38} />
              <span className="leading-none">
                <span className="display block text-[19px]">Produktivní</span>
                <span className="eyebrow mt-1 block text-accent">.cz — rychleji každý den</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 max-sm:hidden" aria-label="Hlavní navigace">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="draw-link px-2.5 py-2 text-[14px] font-semibold"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/newsletter"
                className="ml-2 bg-ink px-4 py-2.5 text-[13px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
              >
                Odebírat
              </Link>
            </nav>
            <Link href="/newsletter" className="sm:hidden bg-ink px-3 py-2 text-[12px] font-bold text-paper">
              Odebírat
            </Link>
          </div>
          <nav className="flex justify-center gap-4 border-t border-hairline px-4 py-2 sm:hidden" aria-label="Mobilní navigace">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="draw-link py-1 text-[13px] font-semibold">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main>{children}</main>

        <footer className="mt-24 border-t-2 border-hairline-strong">
          <div className="mx-auto grid max-w-[var(--page-max)] gap-10 px-[var(--page-pad)] py-14 sm:grid-cols-3">
            <div>
              <div className="flex items-center gap-3">
                <Keycap size={32} />
                <span className="display text-[16px]">Produktivní.cz</span>
              </div>
              <p className="mt-4 max-w-[38ch] text-[13.5px] leading-relaxed text-muted">
                Osobní projekt Josefa Pavlovice. Know-how o produktivitě, které se
                každý den aktualizuje — člověkem i AI.
              </p>
            </div>
            <div>
              <div className="eyebrow mb-4 text-faint">Obsah</div>
              <ul className="space-y-2 text-[14px] font-semibold">
                <li><Link href="/prirucka" className="draw-link">Příručka produktivity</Link></li>
                <li><Link href="/tipy" className="draw-link">Tipy &amp; triky</Link></li>
                <li><Link href="/ai" className="draw-link">AI &amp; produktivita</Link></li>
                <li><Link href="/rss.xml" className="draw-link">RSS</Link></li>
              </ul>
            </div>
            <div>
              <div className="eyebrow mb-4 text-faint">Spolupráce</div>
              <ul className="space-y-2 text-[14px] font-semibold">
                <li><Link href="/skoleni" className="draw-link">Školení pro firmy</Link></li>
                <li><Link href="/newsletter" className="draw-link">Newsletter</Link></li>
                <li><Link href="/o-projektu" className="draw-link">O projektu</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-hairline">
            <div className="eyebrow mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-5 text-faint">
              © {new Date().getFullYear()} Josef Pavlovic · Produktivní.cz
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
