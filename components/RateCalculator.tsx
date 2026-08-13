"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Kalkulačka hodinové sazby pro volnou nohu.
 * Metodika = kapitola /prirucka/cas-jako-zbozi: sazba je podíl, ne pocit —
 * roční potřeba (živobytí + náklady + daně + rezerva) dělená hodinami,
 * které se opravdu dají prodat. Žádný backend, stav v URL kvůli sdílení.
 */

const cs = {
  inputsTitle: "Vaše čísla",
  inputsLead:
    "Vyplňte podle sebe. Čím poctivější vstupy, tím míň nepříjemných překvapení v březnu.",
  fields: {
    net: {
      label: "Kolik chci ročně vydělat čistého",
      unit: "Kč / rok",
      hint: "Co má reálně zbýt vám: nájem, jídlo, rodina, splátky. Vezměte to z bankovního výpisu, ne z hlavy — odhad bývá nižší než skutečnost.",
    },
    costs: {
      label: "Měsíční provozní náklady",
      unit: "Kč / měsíc",
      hint: "Technika, software, účetní, pojištění, telefon, doprava, vzdělávání, prostor.",
    },
    weeks: {
      label: "Pracovních týdnů v roce",
      unit: "týdnů",
      hint: "52 minus dovolená, státní svátky, nemoc a rezerva na věci, které se naplánovat nedají.",
    },
    hours: {
      label: "Hodin práce týdně",
      unit: "hodin",
      hint: "Kolik hodin týdně u práce reálně sedíte — včetně těch, které se nikomu neúčtují.",
    },
    billable: {
      label: "Podíl fakturovatelných hodin",
      unit: "%",
      hint: "Akvizice, administrativa, učení a prostoje se neplatí. Odhad tady nestačí — změřte si jeden poctivý měsíc.",
    },
    tax: {
      label: "Rezerva na daně a odvody",
      unit: "%",
      hint: "Podíl z každé faktury, který si hned odkládáte stranou. Konkrétní sazbu si doplňte podle svého režimu — tahle kalkulačka ji za vás neurčuje.",
    },
    margin: {
      label: "Rezerva na výpadky a investice",
      unit: "%",
      hint: "Finanční polštář, nové vybavení, kurzy, důchod. Co se nedostane do sazby, to nikdy nevznikne.",
    },
    project: {
      label: "Modelová zakázka",
      unit: "fakturovatelných hodin",
      hint: "Kolik hodin má typická zakázka. Spočítáme, kolik musí nést, aby se vyplatila.",
    },
  },
  outputsTitle: "Výsledek",
  out: {
    min: {
      label: "Minimální hodinová sazba",
      note: "Spodní hranice, pod kterou vás práce stojí víc, než vynese. Není to cílová cena — je to bod, pod který se nechodí.",
    },
    rec: {
      label: "Doporučená sazba s rezervou",
      note: "Sazba, která navíc zaplatí hluchá období, nové vybavení a čas investovaný do vlastního rozvoje.",
    },
    hours: {
      label: "Fakturovatelných hodin ročně",
      note: "Jediné hodiny, které se dají prodat — a musí z nich být zaplacený i celý zbytek roku.",
    },
    project: {
      label: "Kolik musí nést zakázka",
      note: (h: number, rec: string) =>
        `Zakázka o ${fmt(h)} fakturovatelných hodinách nesmí klesnout pod tuhle částku, jinak ji dotujete vlastním volným časem. S rezervou: ${rec} Kč.`,
    },
  },
  unitPerHour: "Kč / h",
  unitHours: "hodin",
  unitCzk: "Kč",
  stepsTitle: "Jak se to spočítalo",
  steps: {
    need: "Roční potřeba čistého",
    needF: (net: string, costs: string) => `${net} (živobytí) + ${costs} (náklady za 12 měsíců)`,
    revenue: "Obrat, který musíte vyfakturovat",
    revenueF: (need: string, tax: number) => `${need} ÷ (1 − ${tax} %) — daně a odvody jdou do ceny nahoru, ne jako překvapení v březnu`,
    hours: "Prodejné hodiny",
    hoursF: (w: number, h: number, b: number) => `${w} týdnů × ${h} hodin × ${b} % fakturovatelných`,
    rate: "Minimální sazba",
    rateF: (rev: string, hrs: string) => `${rev} ÷ ${hrs} hodin`,
    rec: "Doporučená sazba",
    recF: (min: string, m: number) => `${min} × (1 + ${m} %)`,
  },
  reset: "Vrátit výchozí hodnoty",
  errorHours: "Zadejte aspoň jednu prodejnou hodinu — jinak se sazba nedá spočítat.",
  errorTax: "Rezerva na daně musí být pod 100 %.",
};

const en: typeof cs = {
  inputsTitle: "Your numbers",
  inputsLead:
    "Fill in your own figures. The more honest the inputs, the fewer unpleasant surprises at tax time.",
  fields: {
    net: {
      label: "What I want to take home a year",
      unit: "CZK / year",
      hint: "What has to actually stay with you: rent, food, family, repayments. Take it from your bank statement, not from memory — the guess is always lower than reality.",
    },
    costs: {
      label: "Monthly running costs",
      unit: "CZK / month",
      hint: "Gear, software, accountant, insurance, phone, travel, training, workspace.",
    },
    weeks: {
      label: "Working weeks a year",
      unit: "weeks",
      hint: "52 minus holidays, public holidays, sick days and a buffer for what cannot be planned.",
    },
    hours: {
      label: "Hours worked a week",
      unit: "hours",
      hint: "How many hours you really spend on work — including the ones nobody gets billed for.",
    },
    billable: {
      label: "Share of billable hours",
      unit: "%",
      hint: "Sales, admin, learning and downtime are unpaid. A guess is not enough here — measure one honest month.",
    },
    tax: {
      label: "Reserve for tax and levies",
      unit: "%",
      hint: "The share of every invoice you set aside straight away. Put in the rate that fits your own situation — this calculator does not decide it for you.",
    },
    margin: {
      label: "Reserve for gaps and investment",
      unit: "%",
      hint: "A financial cushion, new equipment, courses, retirement. Whatever does not make it into the rate will never exist.",
    },
    project: {
      label: "Typical project",
      unit: "billable hours",
      hint: "How many hours a typical job takes. We work out what it has to bring in.",
    },
  },
  outputsTitle: "Result",
  out: {
    min: {
      label: "Minimum hourly rate",
      note: "The floor below which the work costs you more than it brings in. It is not a target price — it is the line you do not cross.",
    },
    rec: {
      label: "Recommended rate with a buffer",
      note: "A rate that also pays for the quiet months, new equipment and the time you invest in yourself.",
    },
    hours: {
      label: "Billable hours a year",
      note: "The only hours you can sell — and the whole rest of the year has to be paid out of them.",
    },
    project: {
      label: "What a project has to bring in",
      note: (h: number, rec: string) =>
        `A job of ${fmt(h)} billable hours must not drop below this, otherwise you are subsidising it with your own free time. With the buffer: CZK ${rec}.`,
    },
  },
  unitPerHour: "CZK / h",
  unitHours: "hours",
  unitCzk: "CZK",
  stepsTitle: "How it was calculated",
  steps: {
    need: "Annual net need",
    needF: (net: string, costs: string) => `${net} (living) + ${costs} (costs over 12 months)`,
    revenue: "Revenue you have to invoice",
    revenueF: (need: string, tax: number) => `${need} ÷ (1 − ${tax} %) — tax and levies belong in the price, not in a springtime surprise`,
    hours: "Sellable hours",
    hoursF: (w: number, h: number, b: number) => `${w} weeks × ${h} hours × ${b} % billable`,
    rate: "Minimum rate",
    rateF: (rev: string, hrs: string) => `${rev} ÷ ${hrs} hours`,
    rec: "Recommended rate",
    recF: (min: string, m: number) => `${min} × (1 + ${m} %)`,
  },
  reset: "Reset to defaults",
  errorHours: "Enter at least one sellable hour — otherwise the rate cannot be calculated.",
  errorTax: "The tax reserve has to stay below 100 %.",
};

const T = { cs, en };

/** Kč s mezerou po tisících (pevná mezera, ať se číslo nikdy nezalomí). */
function fmt(n: number): string {
  if (!Number.isFinite(n)) return "—";
  return Math.round(n)
    .toString()
    .replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function toNum(s: string): number {
  const n = Number(s.replace(/[\s ]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

const DEFAULTS = {
  net: "600000",
  costs: "8000",
  weeks: "44",
  hours: "40",
  billable: "60",
  tax: "30",
  margin: "15",
  project: "10",
};

type Key = keyof typeof DEFAULTS;

/** Klíče v URL — stejné pro obě jazykové mutace, ať se odkaz dá sdílet napříč. */
const PARAM: Record<Key, string> = {
  net: "cil",
  costs: "naklady",
  weeks: "tydny",
  hours: "hodiny",
  billable: "fakturovatelne",
  tax: "dane",
  margin: "rezerva",
  project: "zakazka",
};

function NumberField({
  label,
  unit,
  hint,
  value,
  onChange,
  min,
  max,
  step = 1,
  slider = false,
}: {
  label: string;
  unit: string;
  hint: string;
  value: string;
  onChange: (v: string) => void;
  min: number;
  max: number;
  step?: number;
  slider?: boolean;
}) {
  const id = useId();
  return (
    <div className="border-b border-hairline py-5 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <label htmlFor={id} className="text-[15px] font-bold leading-snug">
          {label}
        </label>
        <div className="flex items-baseline gap-2">
          <input
            id={id}
            type="number"
            inputMode="numeric"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(e.target.value)}
            className="tabular w-[132px] border-[1.5px] border-hairline-strong bg-paper px-3 py-2 text-right font-mono text-[15px] font-semibold text-ink outline-none focus:border-accent"
          />
          <span className="font-mono text-[11px] tracking-[0.08em] text-faint uppercase">{unit}</span>
        </div>
      </div>
      {slider ? (
        <input
          type="range"
          value={toNum(value)}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="mt-3 block w-full cursor-pointer"
          style={{ accentColor: "var(--accent)" }}
        />
      ) : null}
      <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-faint">{hint}</p>
    </div>
  );
}

function Output({
  label,
  value,
  unit,
  note,
  lead = false,
}: {
  label: string;
  value: string;
  unit: string;
  note: string;
  lead?: boolean;
}) {
  return (
    <div className={`border-t border-hairline py-5 ${lead ? "border-t-2 border-t-hairline-strong" : ""}`}>
      <p className="eyebrow text-faint">{label}</p>
      <p className="mt-1.5 flex items-baseline gap-2">
        <span
          className={`tabular display ${lead ? "text-[clamp(32px,7vw,46px)] text-accent" : "text-[clamp(22px,4vw,28px)]"}`}
        >
          {value}
        </span>
        <span className="font-mono text-[12px] tracking-[0.08em] text-faint uppercase">{unit}</span>
      </p>
      <p className="mt-2 max-w-[58ch] text-[13.5px] leading-relaxed text-muted">{note}</p>
    </div>
  );
}

export function RateCalculator({ locale = "cs" }: { locale?: Locale }) {
  const t = T[locale] ?? T.cs;
  const router = useRouter();
  const params = useSearchParams();

  const [v, setV] = useState<Record<Key, string>>(() => {
    const start = { ...DEFAULTS };
    (Object.keys(DEFAULTS) as Key[]).forEach((k) => {
      const raw = params.get(PARAM[k]);
      if (raw !== null && raw !== "" && Number.isFinite(Number(raw))) start[k] = raw;
    });
    return start;
  });

  const set = (k: Key) => (value: string) => setV((prev) => ({ ...prev, [k]: value }));

  // Stav se propisuje do URL, aby šel výpočet poslat dál (např. účetní).
  useEffect(() => {
    const id = setTimeout(() => {
      const q = new URLSearchParams();
      (Object.keys(DEFAULTS) as Key[]).forEach((k) => {
        if (v[k] !== DEFAULTS[k]) q.set(PARAM[k], v[k]);
      });
      const next = `${localePath(locale, "/nastroje/sazba")}${q.size ? `?${q}` : ""}`;
      if (next !== window.location.pathname + window.location.search) {
        router.replace(next, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(id);
  }, [v, locale, router]);

  const calc = useMemo(() => {
    const net = Math.max(0, toNum(v.net));
    const costs = Math.max(0, toNum(v.costs));
    const weeks = Math.max(0, toNum(v.weeks));
    const hours = Math.max(0, toNum(v.hours));
    const billable = Math.min(100, Math.max(0, toNum(v.billable)));
    const tax = Math.min(99, Math.max(0, toNum(v.tax)));
    const margin = Math.max(0, toNum(v.margin));
    const project = Math.max(0, toNum(v.project));

    const annualCosts = costs * 12;
    const need = net + annualCosts;
    const revenue = need / (1 - tax / 100);
    const billableHours = weeks * hours * (billable / 100);
    const minRate = billableHours > 0 ? revenue / billableHours : NaN;
    const recRate = minRate * (1 + margin / 100);

    return {
      net,
      annualCosts,
      need,
      revenue,
      billableHours,
      minRate,
      recRate,
      project,
      projectMin: minRate * project,
      projectRec: recRate * project,
      weeks,
      hours,
      billable,
      tax,
      margin,
      ok: billableHours > 0,
    };
  }, [v]);

  const f = t.fields;

  return (
    <div className="mt-10">
      <section aria-labelledby="vstupy">
        <h2 id="vstupy" className="display text-[20px]">
          {t.inputsTitle}
        </h2>
        <p className="mt-2 max-w-[58ch] text-[14px] leading-relaxed text-muted">{t.inputsLead}</p>

        <div className="mt-4 border-[1.5px] border-hairline-strong px-5 sm:px-6">
          <NumberField {...f.net} value={v.net} onChange={set("net")} min={0} max={100000000} step={10000} />
          <NumberField {...f.costs} value={v.costs} onChange={set("costs")} min={0} max={10000000} step={500} />
          <NumberField {...f.weeks} value={v.weeks} onChange={set("weeks")} min={1} max={52} slider />
          <NumberField {...f.hours} value={v.hours} onChange={set("hours")} min={1} max={80} slider />
          <NumberField {...f.billable} value={v.billable} onChange={set("billable")} min={5} max={100} slider />
          <NumberField {...f.tax} value={v.tax} onChange={set("tax")} min={0} max={99} slider />
          <NumberField {...f.margin} value={v.margin} onChange={set("margin")} min={0} max={100} slider />
          <NumberField {...f.project} value={v.project} onChange={set("project")} min={1} max={2000} />
        </div>

        <div className="mt-3 text-right">
          <button
            type="button"
            onClick={() => setV({ ...DEFAULTS })}
            className="draw-link text-[13px] font-semibold text-muted"
          >
            {t.reset}
          </button>
        </div>
      </section>

      <section aria-labelledby="vysledek" className="mt-12">
        <h2 id="vysledek" className="display text-[20px]">
          {t.outputsTitle}
        </h2>

        {calc.ok ? (
          <div className="mt-4">
            <Output
              lead
              label={t.out.min.label}
              value={fmt(calc.minRate)}
              unit={t.unitPerHour}
              note={t.out.min.note}
            />
            <Output
              label={t.out.rec.label}
              value={fmt(calc.recRate)}
              unit={t.unitPerHour}
              note={t.out.rec.note}
            />
            <Output
              label={t.out.hours.label}
              value={fmt(calc.billableHours)}
              unit={t.unitHours}
              note={t.out.hours.note}
            />
            <Output
              label={t.out.project.label}
              value={fmt(calc.projectMin)}
              unit={t.unitCzk}
              note={t.out.project.note(calc.project, fmt(calc.projectRec))}
            />
          </div>
        ) : (
          <p className="mt-4 border-l-2 border-accent pl-4 text-[14px] text-muted">{t.errorHours}</p>
        )}

        {calc.ok ? (
          <div className="mt-8 border border-hairline bg-surface p-5">
            <p className="eyebrow mb-3 text-faint">{t.stepsTitle}</p>
            <dl className="grid gap-3 text-[13.5px] leading-relaxed">
              <div>
                <dt className="font-bold">
                  {t.steps.need}: <span className="tabular">{fmt(calc.need)}</span> {t.unitCzk}
                </dt>
                <dd className="text-muted">{t.steps.needF(fmt(calc.net), fmt(calc.annualCosts))}</dd>
              </div>
              <div>
                <dt className="font-bold">
                  {t.steps.revenue}: <span className="tabular">{fmt(calc.revenue)}</span> {t.unitCzk}
                </dt>
                <dd className="text-muted">{t.steps.revenueF(fmt(calc.need), calc.tax)}</dd>
              </div>
              <div>
                <dt className="font-bold">
                  {t.steps.hours}: <span className="tabular">{fmt(calc.billableHours)}</span> {t.unitHours}
                </dt>
                <dd className="text-muted">{t.steps.hoursF(calc.weeks, calc.hours, calc.billable)}</dd>
              </div>
              <div>
                <dt className="font-bold">
                  {t.steps.rate}: <span className="tabular">{fmt(calc.minRate)}</span> {t.unitPerHour}
                </dt>
                <dd className="text-muted">{t.steps.rateF(fmt(calc.revenue), fmt(calc.billableHours))}</dd>
              </div>
              <div>
                <dt className="font-bold">
                  {t.steps.rec}: <span className="tabular">{fmt(calc.recRate)}</span> {t.unitPerHour}
                </dt>
                <dd className="text-muted">{t.steps.recF(fmt(calc.minRate), calc.margin)}</dd>
              </div>
            </dl>
          </div>
        ) : null}
      </section>
    </div>
  );
}
