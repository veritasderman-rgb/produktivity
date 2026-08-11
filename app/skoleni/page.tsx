import type { Metadata } from "next";
import { LeadForm } from "@/components/LeadForm";

export const metadata: Metadata = {
  title: "Školení produktivity pro firmy",
  description:
    "Praktická firemní školení produktivity a AI nástrojů. Půldenní a celodenní workshopy pro skupiny do 15 lidí, cena na vyžádání.",
};

const formats = [
  {
    name: "Půldenní workshop",
    time: "4 hodiny · u vás nebo online",
    desc: "Rychlá intenzivní dávka: e-maily pod kontrolou, priority, klávesové zkratky a 3 AI nástroje, které tým začne používat ještě ten den.",
  },
  {
    name: "Celodenní workshop",
    time: "8 hodin · u vás",
    desc: "Kompletní systém: od zachycení úkolů přes porady a sdílenou práci až po AI workflow šité na vaše konkrétní procesy. S praktickým nácvikem.",
    featured: true,
  },
  {
    name: "Online konzultace",
    time: "2 hodiny · online",
    desc: "Navazující podpora po školení, nebo bodové téma — třeba nasazení jednoho AI nástroje do konkrétního procesu.",
  },
];

const modules = [
  "E-mail a Inbox Zero — konec věčně plné schránky",
  "Priority a plánování — Eisenhower, time-blocking, deep work",
  "Porady, které někam vedou",
  "Klávesové zkratky a triky, které šetří hodiny",
  "AI v denní praxi — psaní, rešerše, automatizace",
  "Digitální minimalismus — méně nástrojů, více práce",
];

export default function TrainingPage() {
  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">Pro firmy a týmy</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">
        Váš tým nemá čas číst o&nbsp;produktivitě.<br className="max-sm:hidden" /> Naučím ho to osobně.
      </h1>
      <p className="mt-5 max-w-[58ch] text-[16.5px] leading-relaxed text-muted">
        Praktické workshopy bez teoretických přednášek: každý blok končí tím, že
        lidé mají věc <strong className="text-ink">nastavenou a vyzkoušenou</strong> na
        vlastním počítači. Vedu je já, Josef Pavlovic — autor zdejší příručky.
      </p>

      <h2 className="display mt-14 mb-6 text-[clamp(20px,3vw,28px)]">Formáty</h2>
      <div className="grid gap-5 md:grid-cols-3">
        {formats.map((f) => (
          <div
            key={f.name}
            className={`flex flex-col border bg-card p-6 ${f.featured ? "border-2 border-accent" : "border-hairline-strong"}`}
          >
            {f.featured && <p className="eyebrow mb-3 text-accent">Nejčastější volba</p>}
            <h3 className="text-[18px] font-bold">{f.name}</h3>
            <p className="eyebrow mt-1 text-faint">{f.time}</p>
            <p className="mt-4 grow text-[14px] leading-relaxed text-muted">{f.desc}</p>
            <p className="eyebrow mt-5 text-faint">skupina do 15 lidí · cena na vyžádání</p>
          </div>
        ))}
      </div>
      <p className="mt-4 text-[14px] text-muted">
        Cenu a program připravím na míru podle velikosti týmu a rozsahu — napište do formuláře
        a do dvou pracovních dnů máte konkrétní nabídku.
      </p>

      <h2 className="display mt-14 mb-6 text-[clamp(20px,3vw,28px)]">Z čeho skládáme program</h2>
      <ul className="grid gap-3 sm:grid-cols-2">
        {modules.map((m) => (
          <li key={m} className="flex gap-3 border border-hairline bg-card p-4 text-[14.5px] font-semibold">
            <span className="text-faint" aria-hidden="true">→</span>
            {m}
          </li>
        ))}
      </ul>

      <div className="mt-14 border border-hairline-strong bg-surface p-7">
        <p className="eyebrow mb-2 text-faint">Příklad z praxe</p>
        <h2 className="display mb-3 text-[clamp(18px,2.5vw,24px)]">Co dnes zvládne malý tým s AI</h2>
        <p className="max-w-[62ch] text-[15px] leading-relaxed text-muted">
          Dobrá ukázka toho, kam až sahá páka AI nástrojů v praxi: datový portál{" "}
          <a href="https://skorezdravotnictvi.cz" target="_blank" rel="noopener noreferrer" className="draw-link font-bold text-ink">
            skorezdravotnictvi.cz
          </a>{" "}
          — interaktivní hodnocení výkonnosti českého zdravotnictví s ~190 indikátory,
          simulátorem reforem a regionálním srovnáním. Projekt v rozsahu, na který dřív
          bylo potřeba celé vývojové studio, dnes vzniká v malém týmu s výraznou pomocí
          AI. Přesně tenhle způsob práce na školení učím.
        </p>
      </div>

      <div className="mt-16 border-t-2 border-hairline-strong pt-10">
        <h2 className="display mb-2 text-[clamp(20px,3vw,28px)]">Nezávazná poptávka</h2>
        <p className="mb-8 max-w-[52ch] text-[15px] text-muted">
          Napište mi, co váš tým nejvíc brzdí — do dvou pracovních dnů se ozvu
          s návrhem programu a termínu.
        </p>
        <div className="max-w-2xl">
          <LeadForm />
        </div>
      </div>
    </div>
  );
}
