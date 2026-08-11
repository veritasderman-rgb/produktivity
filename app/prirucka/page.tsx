import type { Metadata } from "next";
import Link from "next/link";
import { getAllChapters, sectionLabels, type Chapter } from "@/lib/chapters";

export const metadata: Metadata = {
  title: "Příručka produktivity",
  description:
    "Kompletní know-how produktivity v přehledných kapitolách: základy, metody (GTD, Pomodoro, Kanban, OKR), nástroje a konkrétní situace.",
};

const sectionOrder: Chapter["section"][] = ["zaklady", "metody", "nastroje", "situace"];

const sectionDesc: Record<Chapter["section"], string> = {
  zaklady: "Co produktivita skutečně je (a co ne), jak funguje vaše hlava a tělo — motivace, prokrastinace, flow, spánek, energie.",
  metody: "Osvědčené systémy od zachycení úkolů po řízení celých projektů — a hlavně jak vybrat ten, který vydržíte používat.",
  nastroje: "Druhý mozek, výběr aplikací podle kategorií, pokročilé triky — a digitální minimalismus, aby vás nástroje nezavalily.",
  situace: "Produktivita v konkrétním kontextu: doma, v týmu, v e-mailu i ve škole.",
};

export default function HandbookPage() {
  const chapters = getAllChapters();
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-accent">Evergreen know-how</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">Příručka produktivity</h1>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">
        Léta praxe srovnaná do kapitol, které na sebe navazují — ale fungují i na
        přeskáčku. Začněte základy, nebo skočte rovnou na to, co vás pálí.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {sectionOrder.map((sec, si) => {
          const items = chapters.filter((c) => c.section === sec);
          return (
            <section key={sec} className="border border-hairline-strong bg-card p-6">
              <div className="mb-3 flex items-baseline justify-between">
                <h2 className="display text-[22px]">{sectionLabels[sec]}</h2>
                <span className="tabular text-[28px] font-extrabold text-hairline" style={{ fontStretch: "120%" }}>
                  {String(si + 1).padStart(2, "0")}
                </span>
              </div>
              <p className="text-[14px] leading-relaxed text-muted">{sectionDesc[sec]}</p>
              <ul className="mt-4 space-y-2 border-t border-hairline pt-4 text-[14px] font-semibold">
                {items.map((ch) => (
                  <li key={ch.slug} className="flex gap-2">
                    <span className="text-accent" aria-hidden="true">→</span>
                    <Link href={`/prirucka/${ch.slug}`} className="hover:text-accent">
                      {ch.title}
                      <span className="eyebrow ml-2 text-faint">{ch.minutes} min</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          );
        })}
      </div>
      <p className="mt-10 max-w-[58ch] text-[15px] text-muted">
        Nechcete číst? To podstatné z příručky učím osobně —{" "}
        <Link href="/skoleni" className="border-b-2 border-accent pb-0.5 font-bold text-ink hover:text-accent">
          školení pro firmy
        </Link>
        .
      </p>
    </div>
  );
}
