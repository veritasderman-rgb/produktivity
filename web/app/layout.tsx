import type { Metadata } from "next";
import Link from "next/link";
import { Archivo, JetBrains_Mono } from "next/font/google";
import { Keycap } from "@/components/Keycap";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin", "latin-ext"],
  axes: ["wdth"],
  variable: "--font-archivo",
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
    <html lang="cs" className={`${archivo.variable} ${jetbrainsMono.variable}`}>
      <body>
        <header className="border-b border-hairline">
          <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-6 py-4">
            <Link href="/" className="flex items-center gap-3 no-underline">
              <Keycap size={38} />
              <span className="leading-none">
                <span className="display block text-[19px]">Produktivní</span>
                <span className="eyebrow mt-1 block text-blue">.cz — rychleji každý den</span>
              </span>
            </Link>
            <nav className="flex items-center gap-1 max-sm:hidden" aria-label="Hlavní navigace">
              {nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="px-3 py-2 text-[14px] font-semibold hover:text-blue"
                >
                  {item.label}
                </Link>
              ))}
              <Link
                href="/newsletter"
                className="ml-2 bg-blue px-4 py-2.5 text-[13px] font-bold tracking-wide text-blue-ink uppercase hover:bg-ink hover:text-paper"
                style={{ fontStretch: "110%" }}
              >
                Odebírat
              </Link>
            </nav>
            <Link href="/newsletter" className="sm:hidden bg-blue px-3 py-2 text-[12px] font-bold uppercase text-blue-ink">
              Odebírat
            </Link>
          </div>
          <nav className="flex justify-center gap-4 border-t border-hairline px-4 py-2 sm:hidden" aria-label="Mobilní navigace">
            {nav.map((item) => (
              <Link key={item.href} href={item.href} className="py-1 text-[13px] font-semibold">
                {item.label}
              </Link>
            ))}
          </nav>
        </header>

        <main>{children}</main>

        <footer className="mt-24 border-t-2 border-hairline-strong">
          <div className="mx-auto grid max-w-5xl gap-10 px-6 py-14 sm:grid-cols-3">
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
                <li><Link href="/prirucka" className="hover:text-blue">Příručka produktivity</Link></li>
                <li><Link href="/tipy" className="hover:text-blue">Tipy &amp; triky</Link></li>
                <li><Link href="/ai" className="hover:text-blue">AI &amp; produktivita</Link></li>
                <li><Link href="/rss.xml" className="hover:text-blue">RSS</Link></li>
              </ul>
            </div>
            <div>
              <div className="eyebrow mb-4 text-faint">Spolupráce</div>
              <ul className="space-y-2 text-[14px] font-semibold">
                <li><Link href="/skoleni" className="hover:text-blue">Školení pro firmy</Link></li>
                <li><Link href="/newsletter" className="hover:text-blue">Newsletter</Link></li>
                <li><Link href="/o-projektu" className="hover:text-blue">O projektu</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-hairline">
            <div className="eyebrow mx-auto max-w-5xl px-6 py-5 text-faint">
              © {new Date().getFullYear()} Josef Pavlovic · Produktivní.cz
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
