import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Příručka produktivity",
  description:
    "Kompletní know-how produktivity v přehledných kapitolách: základy, metody (GTD, Pomodoro, Kanban, OKR), nástroje a konkrétní situace.",
};

const sections = [
  {
    no: "01",
    title: "Základy",
    desc: "Co produktivita skutečně je (a co ne), jak funguje vaše hlava a tělo — motivace, prokrastinace, flow, spánek, energie.",
    chapters: [
      "Co znamená být produktivní v digitální době",
      "Základní systémy: inbox, priority, revize",
      "Psychologie produktivity",
      "Práce v souladu s vlastním tělem",
    ],
  },
  {
    no: "02",
    title: "Metody",
    desc: "Osvědčené systémy od zachycení úkolů po řízení celých projektů — a hlavně jak vybrat ten, který vydržíte používat.",
    chapters: [
      "Getting Things Done (GTD)",
      "Inbox Zero: čistá e-mailová schránka",
      "Pomodoro a time-blocking",
      "SCRUM, Kanban a OKR pro jednotlivce",
    ],
  },
  {
    no: "03",
    title: "Nástroje",
    desc: "Druhý mozek, výběr aplikací podle kategorií, pokročilé triky — a digitální minimalismus, aby vás nástroje nezavalily.",
    chapters: [
      "Váš druhý mozek v digitálním světě",
      "Výběr a nastavení nástrojů",
      "Klíčové kategorie aplikací",
      "Digitální minimalismus",
    ],
  },
  {
    no: "04",
    title: "Situace",
    desc: "Produktivita v konkrétním kontextu: doma, v týmu, v e-mailu i ve škole.",
    chapters: [
      "Efektivní home office",
      "Týmová produktivita",
      "Profesionální e-mailová komunikace",
      "Produktivita při studiu",
    ],
  },
];

export default function HandbookPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-accent">Evergreen know-how</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">Příručka produktivity</h1>
      <p className="mt-4 max-w-[58ch] text-[16px] leading-relaxed text-muted">
        Léta praxe srovnaná do kapitol, které na sebe navazují — ale fungují i na
        přeskáčku. Kapitoly postupně převádíme do webové podoby; první várka dorazí
        v řádu dnů.
      </p>
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {sections.map((s) => (
          <section key={s.no} className="border border-hairline-strong bg-card p-6">
            <div className="mb-3 flex items-baseline justify-between">
              <h2 className="display text-[22px]">{s.title}</h2>
              <span className="tabular text-[28px] font-extrabold text-hairline" style={{ fontStretch: "120%" }}>
                {s.no}
              </span>
            </div>
            <p className="text-[14px] leading-relaxed text-muted">{s.desc}</p>
            <ul className="mt-4 space-y-2 border-t border-hairline pt-4 text-[14px] font-semibold">
              {s.chapters.map((ch) => (
                <li key={ch} className="flex gap-2">
                  <span className="text-accent" aria-hidden="true">→</span>
                  <span>
                    {ch} <span className="eyebrow ml-1 text-faint">připravujeme</span>
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ))}
      </div>
      <p className="mt-10 max-w-[58ch] text-[15px] text-muted">
        Nechcete čekat? To podstatné z příručky učím osobně —{" "}
        <Link href="/skoleni" className="border-b-2 border-accent pb-0.5 font-bold text-ink hover:text-accent">
          školení pro firmy
        </Link>
        .
      </p>
    </div>
  );
}
