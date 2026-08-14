"use client";

import { useEffect, useId, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Audit času: kolik hodin ročně spolknou opakované činnosti a kolik z toho
 * jde reálně dostat zpátky. Vstupy jsou odhady uživatele, ne měření — proto
 * je u každé činnosti vlastní podíl úspory a strop pod 100 %.
 * Žádný backend, stav v URL kvůli sdílení (a kvůli tomu, aby šel výpočet
 * poslat šéfovi jako argument).
 */

/** Osm činností, které v knowledge work ujídají nejvíc a mají tady návod. */
const ACTIVITIES = [
  { id: "email", hours: 6, save: 40, href: "/tipy/ai-trideni-inboxu" },
  { id: "meetings", hours: 5, save: 30, href: "/tipy/porady-system-s-ai" },
  { id: "search", hours: 3, save: 35, href: "/prirucka/druhy-mozek" },
  { id: "reporting", hours: 3, save: 45, href: "/tipy/reporting-pro-vedeni-ai" },
  { id: "writing", hours: 4, save: 40, href: "/tipy/ai-prvni-navrh-mailu" },
  { id: "calendar", hours: 2, save: 25, href: "/tipy/ai-kalendar-planovac" },
  { id: "retyping", hours: 2, save: 50, href: "/tipy/analyza-dat-duckdb-skill" },
  { id: "switching", hours: 5, save: 20, href: "/prirucka/pomodoro-a-time-blocking" },
] as const;

type Id = (typeof ACTIVITIES)[number]["id"];

type Copy = {
  name: string;
  /** Jedna věta o tom, co s tou činností jde dělat. */
  fix: string;
  /** Text odkazu na návod. */
  link: string;
};

const cs = {
  inputsTitle: "Kde vám mizí týden",
  inputsLead:
    "U každé činnosti odhadněte, kolik hodin týdně vám sebere, a kolik z toho by podle vás šlo dostat zpátky. Čísla si klidně přepište — výchozí hodnoty jsou jen odpich, ne norma.",
  activities: {
    email: {
      name: "E-maily a jejich třídění",
      fix: "Třídění, štítkování a rozhodování „co s tím“ jde z velké části předat pravidlům a AI.",
      link: "Návod: AI třídění inboxu",
    },
    meetings: {
      name: "Porady a zápisy z nich",
      fix: "Zápis, úkoly a follow-up ze schůzky umí vzniknout samy — vy jen zkontrolujete.",
      link: "Návod: systém na porady s AI",
    },
    search: {
      name: "Hledání souborů a informací",
      fix: "Když má znalost jedno místo a dá se jí ptát, hledání se zkrátí na sekundy.",
      link: "Kapitola: druhý mozek",
    },
    reporting: {
      name: "Reporting a přehledy pro ostatní",
      fix: "Pravidelný report je šablona plus data — obojí se dá připravit dopředu.",
      link: "Návod: reporting pro vedení",
    },
    writing: {
      name: "Psaní opakovaných textů",
      fix: "Nabídky, odpovědi a e-maily, které píšete podesáté, potřebují první návrh, ne prázdnou stránku.",
      link: "Návod: první návrh mailu",
    },
    calendar: {
      name: "Plánování a přehazování kalendáře",
      fix: "Bloky, pravidla a jeden plánovací rituál týdně uberou většinu přehazování.",
      link: "Návod: kalendář a plánovač",
    },
    retyping: {
      name: "Ruční přepisování dat mezi systémy",
      fix: "Co se dá popsat jako postup, se dá spustit — kopírování mezi tabulkami obzvlášť.",
      link: "Návod: analýza dat bez ručního přepisování",
    },
    switching: {
      name: "Přepínání mezi úkoly a ztráta soustředění",
      fix: "Nejde odstranit úplně, ale dá se stlačit — dávkováním, bloky a méně přerušeními.",
      link: "Kapitola: Pomodoro a time blocking",
    },
  } satisfies Record<Id, Copy>,
  hoursUnit: "h / týden",
  saveLabel: "Kolik z toho jde ušetřit",
  globalTitle: "Váš rok",
  weeks: {
    label: "Pracovních týdnů v roce",
    unit: "týdnů",
    hint: "52 minus dovolená, svátky, nemoc a rezerva. Výchozích 44 je střízlivý průměr.",
  },
  rate: {
    label: "Hodnota vaší hodiny (nepovinné)",
    unit: "Kč / h",
    hint: "Hodinová sazba, mzdové náklady nebo jen to, čeho si vaší hodiny ceníte. Když pole necháte prázdné, ukážeme jen hodiny.",
  },
  resultsTitle: "Co z toho vychází",
  estimateBadge: "Orientační odhad",
  estimateAbove:
    "Následující čísla nejsou měření. Jsou to vaše vlastní odhady vynásobené počtem týdnů — nic víc, nic míň.",
  headline: "Ušetřených hodin ročně",
  headlineUnit: "hodin",
  days: (d: string) => `To je zhruba ${d} pracovních dní po osmi hodinách`,
  weeksOut: (w: string) => `nebo ${w} pracovních týdnů po čtyřiceti hodinách.`,
  money: "V penězích",
  moneyUnit: "Kč",
  moneyNote:
    "Hodnota ušetřeného času při vámi zadané hodinové hodnotě. Ušetřená hodina se sama na peníze nepřevede — buď ji prodáte, nebo ji věnujete něčemu jinému.",
  biggest: (name: string) => `Největší díra je u položky ${name} — začněte tam.`,
  biggestNone: "Zadejte aspoň u jedné činnosti nenulový počet hodin, jinak není co počítat.",
  tableTitle: "Rozpad po činnostech",
  th: {
    activity: "Činnost",
    yearly: "Hodin ročně",
    share: "Podíl úspory",
    saved: "Ušetřeno hodin",
    money: "Ušetřeno Kč",
    guide: "Návod",
  },
  totals: "Celkem",
  stepsTitle: "Jak se to spočítalo",
  steps: {
    weekly: "Hodin týdně dohromady",
    weeklyF: (h: string) => `Součet všech osmi řádků: ${h} hodin každý týden.`,
    yearly: "Hodin ročně dohromady",
    yearlyF: (h: string, w: number, y: string) => `${h} hodin × ${w} týdnů = ${y} hodin ročně.`,
    saved: "Ušetřené hodiny",
    savedF: "U každé činnosti zvlášť: hodiny ročně × váš podíl úspory. Součet těch osmi čísel je výsledek nahoře.",
    days: "Přepočet na dny a týdny",
    daysF: (d: string, w: string) => `Ušetřené hodiny ÷ 8 = ${d} pracovních dní; ÷ 40 = ${w} pracovních týdnů.`,
    money: "Peníze",
    moneyF: (h: string, r: string, m: string) => `${h} hodin × ${r} Kč = ${m} Kč.`,
  },
  estimateBelow:
    "Výsledek stojí a padá s vašimi odhady. Skutečné číslo zjistíte jediným způsobem: týden si poctivě zapisujte, kam čas šel. Žádný návod neušetří sto procent a některé hodiny se ušetřit nedají ani teoreticky — proto posuvník nejde nad 80 %.",
  reset: "Vrátit výchozí hodnoty",
};

const en: typeof cs = {
  inputsTitle: "Where your week goes",
  inputsLead:
    "For each activity, estimate how many hours a week it takes and how much of that you think you could get back. Overwrite the numbers freely — the defaults are a starting point, not a standard.",
  activities: {
    email: {
      name: "Email and sorting the inbox",
      fix: "Sorting, labelling and deciding what to do with a message can largely be handed to rules and AI.",
      link: "Guide: AI inbox sorting",
    },
    meetings: {
      name: "Meetings and writing them up",
      fix: "Notes, actions and follow-ups can write themselves — you only check them.",
      link: "Guide: a meeting system with AI",
    },
    search: {
      name: "Hunting for files and information",
      fix: "When knowledge has one home and you can ask it questions, searching drops to seconds.",
      link: "Chapter: a second brain",
    },
    reporting: {
      name: "Reporting and status updates for others",
      fix: "A recurring report is a template plus data — both can be prepared in advance.",
      link: "Guide: reporting for management",
    },
    writing: {
      name: "Writing the same texts over and over",
      fix: "Quotes, replies and emails you are writing for the tenth time need a first draft, not a blank page.",
      link: "Guide: a first draft of an email",
    },
    calendar: {
      name: "Planning and reshuffling the calendar",
      fix: "Blocks, rules and one weekly planning ritual take out most of the reshuffling.",
      link: "Guide: calendar and planner",
    },
    retyping: {
      name: "Retyping data between systems by hand",
      fix: "Anything you can describe as a procedure can be run — copying between spreadsheets most of all.",
      link: "Guide: data analysis without retyping",
    },
    switching: {
      name: "Switching between tasks and losing focus",
      fix: "It cannot be removed entirely, but it can be squeezed — by batching, blocking and fewer interruptions.",
      link: "Chapter: Pomodoro and time blocking",
    },
  },
  hoursUnit: "h / week",
  saveLabel: "How much of it can be saved",
  globalTitle: "Your year",
  weeks: {
    label: "Working weeks a year",
    unit: "weeks",
    hint: "52 minus holidays, public holidays, sick days and a buffer. The default 44 is a sober average.",
  },
  rate: {
    label: "What your hour is worth (optional)",
    unit: "CZK / h",
    hint: "An hourly rate, the cost of your time to the company, or simply what you value your hour at. Leave it empty and you will only see hours.",
  },
  resultsTitle: "What comes out of it",
  estimateBadge: "Rough estimate",
  estimateAbove:
    "The numbers below are not a measurement. They are your own estimates multiplied by the number of weeks — nothing more, nothing less.",
  headline: "Hours saved a year",
  headlineUnit: "hours",
  days: (d: string) => `That is roughly ${d} eight-hour working days`,
  weeksOut: (w: string) => `or ${w} forty-hour working weeks.`,
  money: "In money",
  moneyUnit: "CZK",
  moneyNote:
    "The value of the saved time at the hourly figure you entered. A saved hour does not turn into money by itself — you either sell it or spend it on something else.",
  biggest: (name: string) => `The biggest hole is ${name} — start there.`,
  biggestNone: "Put a non-zero number of hours on at least one activity, otherwise there is nothing to calculate.",
  tableTitle: "Breakdown by activity",
  th: {
    activity: "Activity",
    yearly: "Hours a year",
    share: "Share saved",
    saved: "Hours saved",
    money: "CZK saved",
    guide: "Guide",
  },
  totals: "Total",
  stepsTitle: "How it was calculated",
  steps: {
    weekly: "Hours a week in total",
    weeklyF: (h: string) => `The sum of all eight rows: ${h} hours every week.`,
    yearly: "Hours a year in total",
    yearlyF: (h: string, w: number, y: string) => `${h} hours × ${w} weeks = ${y} hours a year.`,
    saved: "Hours saved",
    savedF: "For each activity separately: hours a year × your share saved. The sum of those eight numbers is the result above.",
    days: "Converted to days and weeks",
    daysF: (d: string, w: string) => `Hours saved ÷ 8 = ${d} working days; ÷ 40 = ${w} working weeks.`,
    money: "Money",
    moneyF: (h: string, r: string, m: string) => `${h} hours × ${r} CZK = ${m} CZK.`,
  },
  estimateBelow:
    "The result lives and dies with your estimates. There is only one way to get the real number: spend a week honestly writing down where the time went. No guide saves a hundred percent, and some hours cannot be saved even in theory — which is why the slider stops at 80 %.",
  reset: "Reset to defaults",
};

const T = { cs, en };

/** Číslo s pevnou mezerou po tisících. Schválně bez Intl — server i klient
 *  musí vyrobit tentýž řetězec, jinak React hlásí hydration mismatch. */
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

function clamp(n: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, n));
}

const MAX_SAVE = 80;
const DEFAULT_WEEKS = "44";
const DEFAULT_RATE = "";

const DEFAULT_HOURS = ACTIVITIES.map((a) => String(a.hours));
const DEFAULT_SAVE = ACTIVITIES.map((a) => String(a.save));

/** Klíče v URL — stejné pro obě jazykové mutace, ať se odkaz dá sdílet napříč.
 *  Hodiny a podíly jdou jako pomlčkou spojené řady, aby adresa zůstala krátká. */
const P_HOURS = "hodiny";
const P_SAVE = "uspora";
const P_WEEKS = "tydny";
const P_RATE = "sazba";

function parseSeries(raw: string | null, fallback: string[]): string[] {
  if (!raw) return [...fallback];
  const parts = raw.split("-");
  if (parts.length !== fallback.length) return [...fallback];
  return parts.map((p, i) => (p !== "" && Number.isFinite(Number(p)) ? p : fallback[i]));
}

function ActivityRow({
  copy,
  href,
  hours,
  save,
  onHours,
  onSave,
  hoursUnit,
  saveLabel,
}: {
  copy: Copy;
  href: string;
  hours: string;
  save: string;
  onHours: (v: string) => void;
  onSave: (v: string) => void;
  hoursUnit: string;
  saveLabel: string;
}) {
  const hoursId = useId();
  const saveId = useId();
  return (
    <div className="border-b border-hairline py-5 last:border-b-0">
      <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
        <label htmlFor={hoursId} className="text-[15px] font-bold leading-snug">
          {copy.name}
        </label>
        <div className="flex items-baseline gap-2">
          <input
            id={hoursId}
            type="number"
            inputMode="numeric"
            value={hours}
            min={0}
            max={40}
            step={1}
            onChange={(e) => onHours(e.target.value)}
            className="tabular w-[92px] border-[1.5px] border-hairline-strong bg-paper px-3 py-2 text-right font-mono text-[15px] font-semibold text-ink outline-none focus:border-accent"
          />
          <span className="font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
            {hoursUnit}
          </span>
        </div>
      </div>

      <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-faint">
        {copy.fix}{" "}
        <Link href={href} className="draw-link font-semibold text-muted">
          {copy.link}
        </Link>
      </p>

      <div className="mt-3">
        <label
          htmlFor={saveId}
          className="flex flex-wrap items-baseline justify-between gap-x-3 font-mono text-[11px] tracking-[0.08em] text-faint uppercase"
        >
          <span>{saveLabel}</span>
          <span className="tabular text-[12px] font-semibold text-ink">{clamp(toNum(save), 0, MAX_SAVE)} %</span>
        </label>
        <input
          id={saveId}
          type="range"
          value={clamp(toNum(save), 0, MAX_SAVE)}
          min={0}
          max={MAX_SAVE}
          step={5}
          onChange={(e) => onSave(e.target.value)}
          className="mt-1.5 block w-full cursor-pointer"
          style={{ accentColor: "var(--accent)" }}
        />
      </div>
    </div>
  );
}

export function TimeAudit({ locale = "cs" }: { locale?: Locale }) {
  const t = T[locale] ?? T.cs;
  const router = useRouter();
  const params = useSearchParams();
  const p = (path: string) => localePath(locale, path);

  const [hours, setHours] = useState<string[]>(() => parseSeries(params.get(P_HOURS), DEFAULT_HOURS));
  const [save, setSave] = useState<string[]>(() => parseSeries(params.get(P_SAVE), DEFAULT_SAVE));
  const [weeks, setWeeks] = useState<string>(() => {
    const raw = params.get(P_WEEKS);
    return raw && Number.isFinite(Number(raw)) ? raw : DEFAULT_WEEKS;
  });
  const [rate, setRate] = useState<string>(() => {
    const raw = params.get(P_RATE);
    return raw && Number.isFinite(Number(raw)) ? raw : DEFAULT_RATE;
  });

  const weeksId = useId();
  const rateId = useId();

  const setAt = (arr: string[], i: number, v: string) => arr.map((x, j) => (j === i ? v : x));

  // Stav se propisuje do URL, aby šel výpočet poslat dál (třeba jako argument).
  useEffect(() => {
    const id = setTimeout(() => {
      const q = new URLSearchParams();
      if (hours.join("-") !== DEFAULT_HOURS.join("-")) q.set(P_HOURS, hours.join("-"));
      if (save.join("-") !== DEFAULT_SAVE.join("-")) q.set(P_SAVE, save.join("-"));
      if (weeks !== DEFAULT_WEEKS) q.set(P_WEEKS, weeks);
      if (rate !== DEFAULT_RATE) q.set(P_RATE, rate);
      const next = `${p("/nastroje/audit-casu")}${q.size ? `?${q}` : ""}`;
      if (next !== window.location.pathname + window.location.search) {
        router.replace(next, { scroll: false });
      }
    }, 500);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hours, save, weeks, rate, locale, router]);

  const calc = useMemo(() => {
    const w = clamp(toNum(weeks), 1, 52);
    const hourValue = Math.max(0, toNum(rate));
    const hasMoney = rate.trim() !== "" && hourValue > 0;

    const rows = ACTIVITIES.map((a, i) => {
      const h = clamp(toNum(hours[i]), 0, 40);
      const s = clamp(toNum(save[i]), 0, MAX_SAVE);
      const yearly = h * w;
      const saved = (yearly * s) / 100;
      return { id: a.id as Id, href: a.href, weekly: h, share: s, yearly, saved, money: saved * hourValue };
    });

    const weekly = rows.reduce((acc, r) => acc + r.weekly, 0);
    const yearly = rows.reduce((acc, r) => acc + r.yearly, 0);
    const saved = rows.reduce((acc, r) => acc + r.saved, 0);
    const sorted = [...rows].sort((a, b) => b.saved - a.saved);

    return {
      weeks: w,
      hourValue,
      hasMoney,
      rows,
      sorted,
      weekly,
      yearly,
      saved,
      money: saved * hourValue,
      days: saved / 8,
      workWeeks: saved / 40,
      top: sorted[0] && sorted[0].saved > 0 ? sorted[0] : null,
      ok: saved > 0,
    };
  }, [hours, save, weeks, rate]);

  const reset = () => {
    setHours([...DEFAULT_HOURS]);
    setSave([...DEFAULT_SAVE]);
    setWeeks(DEFAULT_WEEKS);
    setRate(DEFAULT_RATE);
  };

  return (
    <div className="mt-10">
      <section aria-labelledby="vstupy">
        <h2 id="vstupy" className="display text-[20px]">
          {t.inputsTitle}
        </h2>
        <p className="mt-2 max-w-[58ch] text-[14px] leading-relaxed text-muted">{t.inputsLead}</p>

        <div className="mt-4 border-[1.5px] border-hairline-strong px-5 sm:px-6">
          {ACTIVITIES.map((a, i) => (
            <ActivityRow
              key={a.id}
              copy={t.activities[a.id as Id]}
              href={p(a.href)}
              hours={hours[i]}
              save={save[i]}
              onHours={(v) => setHours((prev) => setAt(prev, i, v))}
              onSave={(v) => setSave((prev) => setAt(prev, i, v))}
              hoursUnit={t.hoursUnit}
              saveLabel={t.saveLabel}
            />
          ))}
        </div>
      </section>

      <section aria-labelledby="rok" className="mt-10">
        <h2 id="rok" className="display text-[20px]">
          {t.globalTitle}
        </h2>

        <div className="mt-4 border-[1.5px] border-hairline-strong px-5 sm:px-6">
          <div className="border-b border-hairline py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <label htmlFor={weeksId} className="text-[15px] font-bold leading-snug">
                {t.weeks.label}
              </label>
              <div className="flex items-baseline gap-2">
                <input
                  id={weeksId}
                  type="number"
                  inputMode="numeric"
                  value={weeks}
                  min={1}
                  max={52}
                  step={1}
                  onChange={(e) => setWeeks(e.target.value)}
                  className="tabular w-[92px] border-[1.5px] border-hairline-strong bg-paper px-3 py-2 text-right font-mono text-[15px] font-semibold text-ink outline-none focus:border-accent"
                />
                <span className="font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
                  {t.weeks.unit}
                </span>
              </div>
            </div>
            <input
              type="range"
              value={clamp(toNum(weeks), 1, 52)}
              min={1}
              max={52}
              step={1}
              onChange={(e) => setWeeks(e.target.value)}
              aria-label={t.weeks.label}
              className="mt-3 block w-full cursor-pointer"
              style={{ accentColor: "var(--accent)" }}
            />
            <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-faint">{t.weeks.hint}</p>
          </div>

          <div className="py-5">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-2">
              <label htmlFor={rateId} className="text-[15px] font-bold leading-snug">
                {t.rate.label}
              </label>
              <div className="flex items-baseline gap-2">
                <input
                  id={rateId}
                  type="number"
                  inputMode="numeric"
                  value={rate}
                  min={0}
                  max={100000}
                  step={50}
                  placeholder="—"
                  onChange={(e) => setRate(e.target.value)}
                  className="tabular w-[132px] border-[1.5px] border-hairline-strong bg-paper px-3 py-2 text-right font-mono text-[15px] font-semibold text-ink outline-none focus:border-accent"
                />
                <span className="font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
                  {t.rate.unit}
                </span>
              </div>
            </div>
            <p className="mt-2 max-w-[62ch] text-[13px] leading-relaxed text-faint">{t.rate.hint}</p>
          </div>
        </div>

        <div className="mt-3 text-right">
          <button type="button" onClick={reset} className="draw-link text-[13px] font-semibold text-muted">
            {t.reset}
          </button>
        </div>
      </section>

      <section aria-labelledby="vysledek" className="mt-12">
        <h2 id="vysledek" className="display text-[20px]">
          {t.resultsTitle}
        </h2>

        <p className="mt-2 max-w-[62ch] border-l-2 border-accent pl-4 text-[13.5px] leading-relaxed text-muted">
          <span className="eyebrow mr-2 text-faint">{t.estimateBadge}</span>
          {t.estimateAbove}
        </p>

        <div aria-live="polite" className="mt-6">
          {calc.ok ? (
            <>
              <div className="border-t-2 border-hairline-strong py-5">
                <p className="eyebrow text-faint">{t.headline}</p>
                <p className="mt-1.5 flex items-baseline gap-2">
                  <span className="tabular display text-[clamp(36px,9vw,60px)] text-accent">
                    {fmt(calc.saved)}
                  </span>
                  <span className="font-mono text-[12px] tracking-[0.08em] text-faint uppercase">
                    {t.headlineUnit}
                  </span>
                </p>
                <p className="mt-2 max-w-[58ch] text-[14px] leading-relaxed text-muted">
                  {t.days(fmt(calc.days))} {t.weeksOut(fmt(calc.workWeeks))}
                </p>
              </div>

              {calc.hasMoney ? (
                <div className="border-t border-hairline py-5">
                  <p className="eyebrow text-faint">{t.money}</p>
                  <p className="mt-1.5 flex items-baseline gap-2">
                    <span className="tabular display text-[clamp(22px,4vw,28px)]">{fmt(calc.money)}</span>
                    <span className="font-mono text-[12px] tracking-[0.08em] text-faint uppercase">
                      {t.moneyUnit}
                    </span>
                  </p>
                  <p className="mt-2 max-w-[58ch] text-[13.5px] leading-relaxed text-muted">{t.moneyNote}</p>
                </div>
              ) : null}

              {calc.top ? (
                <p className="mt-6 max-w-[62ch] text-[15px] leading-relaxed font-bold">
                  {t.biggest(t.activities[calc.top.id].name)}
                </p>
              ) : null}

              <h3 className="eyebrow mt-8 text-faint">{t.tableTitle}</h3>
              <div className="mt-3 overflow-x-auto">
                <table className="tabular w-full min-w-[560px] border-collapse text-[13.5px]">
                  <thead>
                    <tr className="border-b-2 border-hairline-strong bg-surface">
                      <th scope="col" className="px-3 py-2.5 text-left font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
                        {t.th.activity}
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
                        {t.th.yearly}
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
                        {t.th.share}
                      </th>
                      <th scope="col" className="px-3 py-2.5 text-right font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
                        {t.th.saved}
                      </th>
                      {calc.hasMoney ? (
                        <th scope="col" className="px-3 py-2.5 text-right font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
                          {t.th.money}
                        </th>
                      ) : null}
                      <th scope="col" className="px-3 py-2.5 text-left font-mono text-[11px] tracking-[0.08em] text-faint uppercase">
                        {t.th.guide}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {calc.sorted.map((r) => (
                      <tr key={r.id} className="border-b border-hairline">
                        <th scope="row" className="px-3 py-2.5 text-left text-[13.5px] font-bold">
                          {t.activities[r.id].name}
                        </th>
                        <td className="px-3 py-2.5 text-right text-muted">{fmt(r.yearly)}</td>
                        <td className="px-3 py-2.5 text-right text-muted">{r.share} %</td>
                        <td className="px-3 py-2.5 text-right font-semibold">{fmt(r.saved)}</td>
                        {calc.hasMoney ? (
                          <td className="px-3 py-2.5 text-right text-muted">{fmt(r.money)}</td>
                        ) : null}
                        <td className="px-3 py-2.5 text-left">
                          <Link href={p(r.href)} className="draw-link text-[13px] font-semibold">
                            {t.activities[r.id].link}
                          </Link>
                        </td>
                      </tr>
                    ))}
                    <tr className="border-b-2 border-hairline-strong">
                      <th scope="row" className="px-3 py-2.5 text-left text-[13.5px] font-bold">
                        {t.totals}
                      </th>
                      <td className="px-3 py-2.5 text-right font-semibold">{fmt(calc.yearly)}</td>
                      <td className="px-3 py-2.5 text-right text-faint">—</td>
                      <td className="px-3 py-2.5 text-right font-bold text-accent">{fmt(calc.saved)}</td>
                      {calc.hasMoney ? (
                        <td className="px-3 py-2.5 text-right font-semibold">{fmt(calc.money)}</td>
                      ) : null}
                      <td className="px-3 py-2.5" />
                    </tr>
                  </tbody>
                </table>
              </div>

              <div className="mt-8 border border-hairline bg-surface p-5">
                <p className="eyebrow mb-3 text-faint">{t.stepsTitle}</p>
                <dl className="grid gap-3 text-[13.5px] leading-relaxed">
                  <div>
                    <dt className="font-bold">
                      {t.steps.weekly}: <span className="tabular">{fmt(calc.weekly)}</span>
                    </dt>
                    <dd className="text-muted">{t.steps.weeklyF(fmt(calc.weekly))}</dd>
                  </div>
                  <div>
                    <dt className="font-bold">
                      {t.steps.yearly}: <span className="tabular">{fmt(calc.yearly)}</span>
                    </dt>
                    <dd className="text-muted">
                      {t.steps.yearlyF(fmt(calc.weekly), calc.weeks, fmt(calc.yearly))}
                    </dd>
                  </div>
                  <div>
                    <dt className="font-bold">
                      {t.steps.saved}: <span className="tabular">{fmt(calc.saved)}</span>
                    </dt>
                    <dd className="text-muted">{t.steps.savedF}</dd>
                  </div>
                  <div>
                    <dt className="font-bold">
                      {t.steps.days}: <span className="tabular">{fmt(calc.days)}</span> /{" "}
                      <span className="tabular">{fmt(calc.workWeeks)}</span>
                    </dt>
                    <dd className="text-muted">{t.steps.daysF(fmt(calc.days), fmt(calc.workWeeks))}</dd>
                  </div>
                  {calc.hasMoney ? (
                    <div>
                      <dt className="font-bold">
                        {t.steps.money}: <span className="tabular">{fmt(calc.money)}</span>
                      </dt>
                      <dd className="text-muted">
                        {t.steps.moneyF(fmt(calc.saved), fmt(calc.hourValue), fmt(calc.money))}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>
            </>
          ) : (
            <p className="border-l-2 border-accent pl-4 text-[14px] text-muted">{t.biggestNone}</p>
          )}
        </div>

        <p className="mt-6 max-w-[62ch] text-[13.5px] leading-relaxed text-faint">{t.estimateBelow}</p>
      </section>
    </div>
  );
}
