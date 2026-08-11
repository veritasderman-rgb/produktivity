import Link from "next/link";
import { getAllTips } from "@/lib/tips";
import { TipCard } from "@/components/TipCard";
import { NewsletterForm } from "@/components/NewsletterForm";

export default function HomePage() {
  const tips = getAllTips();
  const latest = tips.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
          <p className="eyebrow mb-6 text-accent">Ověřené systémy · denní tipy · AI novinky</p>
          <h1 className="display text-[clamp(38px,7vw,76px)]">
            Každý den <span className="text-accent">o&nbsp;kousek</span> rychlejší.
          </h1>
          <p className="mt-6 max-w-[52ch] text-[17px] leading-relaxed text-muted">
            Produktivita není dřina navíc — je to pár správných návyků, zkratek a nástrojů.
            Najdete je tady: česky, bez balastu a průběžně aktualizované, protože doba
            (a hlavně AI) kráčí rychle.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-4">
            <Link
              href="/tipy"
              className="bg-accent px-6 py-4 text-[14px] font-bold tracking-wide text-accent-ink uppercase hover:bg-ink hover:text-paper"
              style={{ fontStretch: "110%" }}
            >
              Začít zrychlovat
            </Link>
            <Link
              href="/prirucka"
              className="border-[1.5px] border-hairline-strong px-6 py-4 text-[14px] font-bold tracking-wide uppercase hover:border-accent hover:text-accent"
              style={{ fontStretch: "110%" }}
            >
              Číst příručku
            </Link>
          </div>
          <p className="mt-6 text-[14px] text-muted">
            Nevíte kudy?{" "}
            <Link href="/start" className="border-b-2 border-accent pb-0.5 font-bold text-ink hover:text-accent">
              Začněte tady
            </Link>{" "}
            — jeden notes, tři značky, čtyři minuty denně.
          </p>
        </div>
      </section>

      {/* Nejnovější tipy */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div>
            <p className="eyebrow mb-2 text-accent">Čerstvé</p>
            <h2 className="display text-[clamp(24px,4vw,36px)]">Nejnovější tipy</h2>
          </div>
          <Link href="/tipy" className="border-b-2 border-accent pb-0.5 text-[14px] font-bold hover:text-accent">
            Všech {tips.length} tipů
          </Link>
        </div>
        <div className="grid gap-5 md:grid-cols-3">
          {latest.map((tip, i) => (
            <TipCard key={tip.slug} tip={tip} index={tips.length - i} />
          ))}
        </div>
      </section>

      {/* Příručka + školení */}
      <section className="border-y border-hairline">
        <div className="mx-auto grid max-w-5xl gap-px bg-hairline px-0 md:grid-cols-2">
          <div className="bg-paper px-6 py-14 md:pr-12">
            <p className="eyebrow mb-2 text-accent">Základ</p>
            <h2 className="display text-[clamp(22px,3vw,30px)]">Příručka produktivity</h2>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
              Kompletní know-how na jednom místě: GTD, Inbox Zero, Pomodoro, práce
              s energií i pozorností, výběr nástrojů. Léta praxe srovnaná do kapitol,
              které dávají smysl po sobě i na přeskáčku.
            </p>
            <Link href="/prirucka" className="mt-6 inline-block border-b-2 border-accent pb-0.5 text-[14px] font-bold hover:text-accent">
              Otevřít příručku
            </Link>
          </div>
          <div className="bg-paper px-6 py-14 md:pl-12">
            <p className="eyebrow mb-2 text-accent">Pro firmy</p>
            <h2 className="display text-[clamp(22px,3vw,30px)]">Školení na míru</h2>
            <p className="mt-4 max-w-[46ch] text-[15px] leading-relaxed text-muted">
              Nemáte čas to celé číst? Přijedu a naučím váš tým to podstatné za půl
              dne — od e-mailů a porad až po AI nástroje, které reálně šetří hodiny.
            </p>
            <Link href="/skoleni" className="mt-6 inline-block border-b-2 border-accent pb-0.5 text-[14px] font-bold hover:text-accent">
              Nabídka školení
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-5xl px-6 py-16">
        <div className="max-w-xl">
          <p className="eyebrow mb-2 text-accent">Newsletter</p>
          <h2 className="display text-[clamp(22px,3vw,30px)]">Jeden tip týdně do e-mailu</h2>
          <p className="mt-4 mb-6 text-[15px] leading-relaxed text-muted">
            To nejlepší z týdne v jednom krátkém e-mailu. Přečtete za dvě minuty,
            ušetří vám hodiny. Jako bonus hned získáte e-book{" "}
            <strong className="text-ink">Top 30 tipů</strong>.
          </p>
          <NewsletterForm source="homepage" />
        </div>
      </section>
    </>
  );
}
