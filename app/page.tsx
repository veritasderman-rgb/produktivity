import Link from "next/link";
import { getAllTips } from "@/lib/tips";
import { TipCard } from "@/components/TipCard";
import { NewsletterForm } from "@/components/NewsletterForm";
import { Reveal } from "@/components/Reveal";

export default function HomePage() {
  const tips = getAllTips();
  const latest = tips.slice(0, 3);

  return (
    <>
      {/* Hero */}
      <section className="border-b border-hairline">
        <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-20 sm:py-24">
          <p className="eyebrow mb-6 text-faint">Ověřené systémy · denní tipy · AI novinky</p>
          <h1 className="display display-hero text-[clamp(38px,7vw,72px)]">
            Každý den o&nbsp;kousek <span className="text-accent">rychlejší</span>.
          </h1>
          <p className="prose-a mt-7 text-[18px]">
            Produktivita není dřina navíc — je to pár správných návyků, zkratek a nástrojů.
            Najdete je tady: česky, bez balastu a průběžně aktualizované, protože doba
            (a hlavně AI) kráčí rychle.
          </p>
          <div className="mt-9 flex flex-wrap items-center gap-3.5">
            <Link
              href="/tipy"
              className="border-[1.5px] border-ink bg-ink px-7 py-4 text-[15.5px] font-bold text-paper transition-colors hover:border-accent hover:bg-accent hover:text-accent-ink"
            >
              Začít zrychlovat
            </Link>
            <Link
              href="/prirucka"
              className="border-[1.5px] border-hairline-strong px-7 py-4 text-[15.5px] font-bold transition-colors hover:border-accent hover:text-accent"
            >
              Číst příručku
            </Link>
          </div>
          <p className="mt-6 text-[14px] text-muted">
            Nevíte kudy?{" "}
            <Link href="/start" className="draw-link font-bold text-ink">
              Začněte tady
            </Link>{" "}
            — jeden notes, tři značky, čtyři minuty denně.
          </p>
        </div>
      </section>

      {/* Nejnovější tipy */}
      <section className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-24">
        <Reveal>
          <div className="mb-9 flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="eyebrow mb-2 text-faint">Čerstvé</p>
              <h2 className="display text-[clamp(24px,4vw,34px)]">Nejnovější tipy</h2>
            </div>
            <Link href="/tipy" className="draw-link text-[14px] font-bold">
              Všech {tips.length} tipů
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-5 md:grid-cols-3">
          {latest.map((tip, i) => (
            <Reveal key={tip.slug} delay={i * 0.08}>
              <TipCard tip={tip} index={tips.length - i} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Příručka + školení */}
      <section className="border-y border-hairline">
        <div className="mx-auto grid max-w-[var(--page-max)] px-[var(--page-pad)] md:grid-cols-2">
          <Reveal className="py-18 md:border-r md:border-hairline md:pr-12">
            <p className="eyebrow mb-2 text-faint">Základ</p>
            <h2 className="display text-[clamp(22px,3vw,28px)]">Příručka produktivity</h2>
            <p className="prose-a mt-4 text-[15.5px]">
              Kompletní know-how na jednom místě: GTD, Inbox Zero, Pomodoro, práce
              s energií i pozorností, výběr nástrojů. Léta praxe srovnaná do kapitol,
              které dávají smysl po sobě i na přeskáčku.
            </p>
            <Link href="/prirucka" className="draw-link mt-6 inline-block text-[14px] font-bold">
              Otevřít příručku
            </Link>
          </Reveal>
          <Reveal delay={0.12} className="py-18 md:pl-12">
            <p className="eyebrow mb-2 text-faint">Pro firmy</p>
            <h2 className="display text-[clamp(22px,3vw,28px)]">Školení na míru</h2>
            <p className="prose-a mt-4 text-[15.5px]">
              Nemáte čas to celé číst? Přijedu a naučím váš tým to podstatné za půl
              dne — od e-mailů a porad až po AI nástroje, které reálně šetří hodiny.
            </p>
            <Link href="/skoleni" className="draw-link mt-6 inline-block text-[14px] font-bold">
              Nabídka školení
            </Link>
          </Reveal>
        </div>
      </section>

      {/* Newsletter */}
      <section className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-24">
        <Reveal>
          <div className="max-w-xl">
            <p className="eyebrow mb-2 text-faint">Newsletter</p>
            <h2 className="display text-[clamp(22px,3vw,28px)]">Jeden tip týdně do e-mailu</h2>
            <p className="prose-a mt-4 mb-6 text-[15.5px]">
              To nejlepší z týdne v jednom krátkém e-mailu. Přečtete za dvě minuty,
              ušetří vám hodiny. Jako bonus hned získáte e-book{" "}
              <strong>Top 30 tipů</strong>.
            </p>
            <NewsletterForm source="homepage" />
          </div>
        </Reveal>
      </section>
    </>
  );
}
