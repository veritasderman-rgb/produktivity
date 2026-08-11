import type { Metadata } from "next";
import Link from "next/link";
import { getAllNews } from "@/lib/news";
import { NewsletterForm } from "@/components/NewsletterForm";

export const metadata: Metadata = {
  title: "AI & produktivita",
  description:
    "Novinky ze světa AI nástrojů přeložené do praxe: co umí, co to znamená pro vaši práci a jak to nasadit ještě dnes.",
};

function formatDate(iso: string) {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d}. ${m}. ${y}`;
}

export default function AiPage() {
  const news = getAllNews();
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">Novinky přeložené do praxe</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">AI &amp; produktivita</h1>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">
        AI mění pravidla produktivity rychleji, než stíháme číst. Tady najdete
        novinky <strong className="text-ink">přeložené do praxe</strong>: co nový nástroj či
        funkce umí, co to znamená pro vaši práci a jak to zapojit ještě dnes.
        Novinky sbírá automatizovaná rutina — a každou schvaluje lidská redakce.
      </p>

      {news.length > 0 ? (
        <div className="mt-10 grid gap-5">
          {news.map((n) => (
            <article key={n.slug} className="border border-hairline-strong bg-card p-6">
              <div className="mb-2 flex flex-wrap items-baseline justify-between gap-2">
                <span className="eyebrow text-faint">AI novinka · {formatDate(n.date)}</span>
                <span className="eyebrow text-faint">{n.minutes} min čtení</span>
              </div>
              <h2 className="text-[19px] leading-snug font-bold">
                <Link href={`/ai/${n.slug}`} className="hover:text-accent">
                  {n.title}
                </Link>
              </h2>
              <p className="mt-2 max-w-[70ch] text-[14.5px] leading-relaxed text-muted">{n.excerpt}</p>
              <Link
                href={`/ai/${n.slug}`}
                className="mt-4 inline-block draw-link text-[13px] font-bold"
              >
                Číst celou novinku
              </Link>
            </article>
          ))}
        </div>
      ) : (
        <div className="mt-10 max-w-xl border border-hairline-strong bg-card p-6">
          <p className="eyebrow mb-2 text-faint">První novinky jsou na cestě</p>
          <p className="text-[14.5px] text-muted">
            Rutina právě začala sbírat. První AI přehledy se tu objeví během pár dní.
          </p>
        </div>
      )}

      <div className="mt-12 max-w-xl">
        <p className="eyebrow mb-2 text-faint">Nezmeškejte nic</p>
        <p className="mb-5 text-[14.5px] text-muted">
          Nejdůležitější AI novinky posíláme i v týdenním newsletteru.
        </p>
        <NewsletterForm source="ai-sekce" />
      </div>
    </div>
  );
}
