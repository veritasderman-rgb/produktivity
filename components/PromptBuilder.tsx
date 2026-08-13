"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { localePath, type Locale } from "@/lib/i18n";

/**
 * Skládačka promptů: role + úkol + vstup + výstup + omezení → hotový text.
 * Pět voleb, protože přesně tyhle pěti se liší použitelný prompt od nepoužitelného.
 * Vzorek hotových promptů z databáze dostáváme jako prop ze serveru
 * (lib/prompts.ts sahá na node:fs, do klienta se dostat nesmí).
 */

export type PromptSample = {
  id: string;
  label: string;
  slug: string;
  title: string;
  excerpt: string;
  /** Úkoly, ke kterým se prompt hodí — id z TASKS níž. */
  tasks: string[];
};

/** Id musí sedět s klíči v app/[locale]/nastroje/promptovac/page.tsx. */
export const TASK_IDS = ["write", "summarize", "compare", "review", "plan", "explain"] as const;

type RoleDef = { chip: string; line: (x: string) => string };

type Choices = {
  role: string;
  task: string;
  input: string;
  output: string;
  length: string;
  tone: string;
  lang: string;
};

const cs = {
  groups: {
    role: "Role",
    task: "Úkol",
    input: "Vstup",
    output: "Výstup",
    limits: "Omezení",
  },
  roles: {
    none: { chip: "Bez role", line: () => "" },
    expert: { chip: "Expert na…", line: (x: string) => `Jsi zkušený expert na ${x} s dlouholetou praxí.` },
    opponent: {
      chip: "Oponent",
      line: () => "Jsi kritický oponent. Tvým úkolem není souhlasit, ale najít slabá místa dřív, než je najde někdo jiný.",
    },
    editor: {
      chip: "Editor",
      line: () => "Jsi pečlivý editor. Škrtáš všechno, co nenese význam, a nešetříš cizí text.",
    },
    analyst: {
      chip: "Analytik",
      line: () => "Jsi analytik. Pracuješ s tím, co je v datech, a neděláš závěry, které data neunesou.",
    },
    teacher: {
      chip: "Učitel",
      line: () => "Jsi trpělivý učitel. Vysvětluješ složité věci jednoduše, ale nezjednodušuješ je do nesmyslu.",
    },
    pm: {
      chip: "Projektový manažer",
      line: () => "Jsi projektový manažer. Myslíš v termínech, závislostech a rizicích, ne v přáních.",
    },
  } as Record<string, RoleDef>,
  roleTopicLabel: "Obor experta",
  roleTopicPlaceholder: "např. B2B copywriting, daně pro OSVČ, React",
  roleTopicFallback: "[doplňte obor]",
  tasks: {
    write: { chip: "Napsat", line: (s: string) => `Napiš ${s}.`, ph: "e-mail klientovi, ve kterém odkládám termín" },
    summarize: { chip: "Shrnout", line: (s: string) => `Shrň ${s}.`, ph: "zápis z porady, který vkládám níž" },
    compare: { chip: "Porovnat", line: (s: string) => `Porovnej ${s}.`, ph: "tři nabídky dodavatelů podle ceny, termínu a rizik" },
    review: {
      chip: "Zkontrolovat",
      line: (s: string) => `Zkontroluj ${s} a najdi chyby, nejasnosti a slabá místa.`,
      ph: "návrh smlouvy, který vkládám níž",
    },
    plan: { chip: "Naplánovat", line: (s: string) => `Naplánuj ${s}.`, ph: "spuštění newsletteru do konce měsíce" },
    explain: { chip: "Vysvětlit", line: (s: string) => `Vysvětli ${s}.`, ph: "jak funguje paušální daň, jako bych o tom nikdy neslyšel" },
  },
  subjectLabel: "Čeho se to týká",
  subjectFallback: "[doplňte, čeho se to týká]",
  inputs: {
    text: { chip: "Text", line: "Podklad ti vkládám níž mezi značky <<< a >>>." },
    document: { chip: "Dokument", line: "Podklad je v přiloženém dokumentu. Pracuj s celým jeho obsahem." },
    data: { chip: "Data", line: "Data ti vkládám níž mezi značky <<< a >>>. Struktura je taková, jaká je — nedomýšlej si sloupce." },
    none: { chip: "Nic", line: "Žádné podklady nedodávám. Vycházej z toho, co je v zadání." },
  },
  outputs: {
    bullets: { chip: "Odrážky", line: "Odpověz v odrážkách, jedna myšlenka na odrážku." },
    table: { chip: "Tabulka", line: "Odpověz jako tabulku. Sloupce pojmenuj tak, aby se dala rovnou použít." },
    email: { chip: "E-mail", line: "Napiš to jako hotový e-mail — předmět, oslovení, tělo, zakončení." },
    outline: { chip: "Osnova", line: "Odpověz jako osnovu: nadpisy a pod každým dvě až čtyři odrážky." },
    steps: { chip: "Krok za krokem", line: "Odpověz jako číslovaný postup. Každý krok je jedna akce, kterou jde udělat." },
  },
  lengths: {
    any: { chip: "Bez limitu", line: "" },
    short: { chip: "Do 100 slov", line: "Maximálně 100 slov." },
    medium: { chip: "Do 300 slov", line: "Maximálně 300 slov." },
    page: { chip: "Jedna strana", line: "Maximálně jedna normostrana." },
  },
  tones: {
    neutral: { chip: "Věcný", line: "Piš věcně a stručně, bez příkras." },
    friendly: { chip: "Přátelský", line: "Piš přátelsky, ale ne familiárně." },
    formal: { chip: "Formální", line: "Piš formálně, jako se píše vedení nebo úřadu." },
    direct: { chip: "Přímý", line: "Piš přímo. Nezjemňuj to, co je potřeba říct." },
  },
  langs: {
    cs: { chip: "Česky", line: "Odpovídej česky." },
    en: { chip: "Anglicky", line: "Odpovídej anglicky." },
    same: { chip: "Jazyk zadání", line: "Odpovídej ve stejném jazyce, ve kterém je zadání." },
  },
  flags: {
    onlySources: { chip: "Jen z podkladů", line: "Vycházej jen z dodaných podkladů. Nic nedoplňuj z obecných znalostí." },
    sayUnknown: { chip: "Když nevíš, řekni to", line: "Když něco nevíš nebo to v podkladech není, napiš to. Nehádej." },
    noFluff: { chip: "Bez omáčky", line: "Bez úvodů, omluv a marketingových frází. Rovnou k věci." },
    askFirst: { chip: "Zeptej se předem", line: "Než začneš, polož mi maximálně tři otázky, které potřebuješ zodpovědět." },
  },
  labels: { task: "Úkol", input: "Podklady", output: "Výstup", limits: "Omezení" },
  placeholderBlock: "[sem vložte text nebo data]",
  resultTitle: "Váš prompt",
  resultLead:
    "Text je ještě k úpravě — dopište kontext, který zná jenom vy. Každá změna volby nahoře ho přepíše.",
  copy: "Zkopírovat",
  copied: "Zkopírováno ✓",
  chars: (n: number) => `${n} znaků`,
  libTitle: "Nejbližší hotové prompty",
  libLead: "Vybrané z databáze podle úkolu, který jste zvolili. Otevřete článek a máte k nim i kontext.",
  libEmpty: "Pro tenhle úkol zatím žádný hotový prompt nemáme — mrkněte do celé databáze.",
  libAll: "Celá databáze promptů →",
  libOpen: "Otevřít návod →",
};

const en: typeof cs = {
  groups: {
    role: "Role",
    task: "Task",
    input: "Input",
    output: "Output",
    limits: "Constraints",
  },
  roles: {
    none: { chip: "No role", line: () => "" },
    expert: { chip: "Expert in…", line: (x: string) => `You are an experienced expert in ${x} with years of practice.` },
    opponent: {
      chip: "Opponent",
      line: () => "You are a critical opponent. Your job is not to agree, but to find the weak spots before somebody else does.",
    },
    editor: {
      chip: "Editor",
      line: () => "You are a meticulous editor. You cut everything that carries no meaning and you are not gentle with other people's text.",
    },
    analyst: {
      chip: "Analyst",
      line: () => "You are an analyst. You work with what is in the data and never draw conclusions the data cannot carry.",
    },
    teacher: {
      chip: "Teacher",
      line: () => "You are a patient teacher. You explain complicated things simply without simplifying them into nonsense.",
    },
    pm: {
      chip: "Project manager",
      line: () => "You are a project manager. You think in deadlines, dependencies and risks, not in wishes.",
    },
  } as Record<string, RoleDef>,
  roleTopicLabel: "Field of expertise",
  roleTopicPlaceholder: "e.g. B2B copywriting, freelance tax, React",
  roleTopicFallback: "[fill in the field]",
  tasks: {
    write: { chip: "Write", line: (s: string) => `Write ${s}.`, ph: "an email telling a client the deadline is slipping" },
    summarize: { chip: "Summarize", line: (s: string) => `Summarize ${s}.`, ph: "the meeting notes pasted below" },
    compare: { chip: "Compare", line: (s: string) => `Compare ${s}.`, ph: "three supplier quotes on price, deadline and risk" },
    review: {
      chip: "Review",
      line: (s: string) => `Review ${s} and find errors, ambiguities and weak spots.`,
      ph: "the draft contract pasted below",
    },
    plan: { chip: "Plan", line: (s: string) => `Plan ${s}.`, ph: "launching the newsletter before the end of the month" },
    explain: { chip: "Explain", line: (s: string) => `Explain ${s}.`, ph: "how flat-rate tax works, as if I had never heard of it" },
  },
  subjectLabel: "What it is about",
  subjectFallback: "[fill in what this is about]",
  inputs: {
    text: { chip: "Text", line: "The source text is pasted below between the <<< and >>> markers." },
    document: { chip: "Document", line: "The source is in the attached document. Work with all of its content." },
    data: { chip: "Data", line: "The data is pasted below between the <<< and >>> markers. Take the structure as it is — do not invent columns." },
    none: { chip: "Nothing", line: "I am providing no source material. Work from what is in the task itself." },
  },
  outputs: {
    bullets: { chip: "Bullets", line: "Answer in bullet points, one idea per bullet." },
    table: { chip: "Table", line: "Answer as a table. Name the columns so it can be used straight away." },
    email: { chip: "Email", line: "Write it as a finished email — subject, greeting, body, sign-off." },
    outline: { chip: "Outline", line: "Answer as an outline: headings with two to four bullets under each." },
    steps: { chip: "Step by step", line: "Answer as a numbered procedure. Each step is one action that can actually be done." },
  },
  lengths: {
    any: { chip: "No limit", line: "" },
    short: { chip: "Under 100 words", line: "Maximum 100 words." },
    medium: { chip: "Under 300 words", line: "Maximum 300 words." },
    page: { chip: "One page", line: "Maximum one page." },
  },
  tones: {
    neutral: { chip: "Matter-of-fact", line: "Write plainly and briefly, with no decoration." },
    friendly: { chip: "Friendly", line: "Write in a friendly tone, but not a chummy one." },
    formal: { chip: "Formal", line: "Write formally, the way you would write to management or an authority." },
    direct: { chip: "Direct", line: "Be direct. Do not soften what needs to be said." },
  },
  langs: {
    cs: { chip: "Czech", line: "Answer in Czech." },
    en: { chip: "English", line: "Answer in English." },
    same: { chip: "Language of the task", line: "Answer in the same language the task is written in." },
  },
  flags: {
    onlySources: { chip: "Sources only", line: "Use only the material I provided. Do not add anything from general knowledge." },
    sayUnknown: { chip: "Say when you don't know", line: "If you do not know something or it is not in the material, say so. Do not guess." },
    noFluff: { chip: "No fluff", line: "No preambles, no apologies, no marketing phrases. Straight to the point." },
    askFirst: { chip: "Ask first", line: "Before you start, ask me at most three questions you need answered." },
  },
  labels: { task: "Task", input: "Input", output: "Output", limits: "Constraints" },
  placeholderBlock: "[paste your text or data here]",
  resultTitle: "Your prompt",
  resultLead:
    "The text is still editable — add the context only you know. Changing any choice above rewrites it.",
  copy: "Copy",
  copied: "Copied ✓",
  chars: (n: number) => `${n} characters`,
  libTitle: "Closest ready-made prompts",
  libLead: "Picked from the library by the task you selected. Open the guide and you get the context too.",
  libEmpty: "No ready-made prompt for this task yet — have a look at the whole library.",
  libAll: "The whole prompt library →",
  libOpen: "Open the guide →",
};

const T = { cs, en };

function Chips({
  label,
  options,
  active,
  onPick,
}: {
  label: string;
  options: { id: string; chip: string }[];
  active: string;
  onPick: (id: string) => void;
}) {
  return (
    <div className="flex flex-wrap items-baseline gap-2 border-b border-hairline py-4 last:border-b-0">
      <span className="eyebrow w-[92px] flex-none text-faint">{label}</span>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          aria-pressed={active === o.id}
          onClick={() => onPick(o.id)}
          className={`border-[1.5px] px-3.5 py-2 font-mono text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors ${
            active === o.id ? "border-ink bg-ink text-paper" : "border-hairline bg-paper hover:border-ink"
          }`}
        >
          {o.chip}
        </button>
      ))}
    </div>
  );
}

function opts<K extends string>(src: Record<K, { chip: string }>): { id: string; chip: string }[] {
  return (Object.keys(src) as K[]).map((id) => ({ id, chip: src[id].chip }));
}

export function PromptBuilder({
  samples,
  locale = "cs",
}: {
  samples: PromptSample[];
  locale?: Locale;
}) {
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);

  const [c, setC] = useState<Choices>({
    role: "expert",
    task: "summarize",
    input: "text",
    output: "bullets",
    length: "medium",
    tone: "neutral",
    lang: locale === "en" ? "en" : "cs",
  });
  const [roleTopic, setRoleTopic] = useState("");
  const [subject, setSubject] = useState("");
  const [flags, setFlags] = useState<Record<string, boolean>>({
    onlySources: true,
    sayUnknown: true,
    noFluff: false,
    askFirst: false,
  });
  const [copied, setCopied] = useState(false);

  const pick = (k: keyof Choices) => (id: string) => setC((prev) => ({ ...prev, [k]: id }));

  const composed = useMemo(() => {
    const role = t.roles[c.role as keyof typeof t.roles];
    const task = t.tasks[c.task as keyof typeof t.tasks];
    const input = t.inputs[c.input as keyof typeof t.inputs];
    const output = t.outputs[c.output as keyof typeof t.outputs];

    const roleLine = role.line(c.role === "expert" ? roleTopic.trim() || t.roleTopicFallback : "");

    const limits = [
      t.lengths[c.length as keyof typeof t.lengths].line,
      t.tones[c.tone as keyof typeof t.tones].line,
      t.langs[c.lang as keyof typeof t.langs].line,
      ...(Object.keys(t.flags) as (keyof typeof t.flags)[])
        .filter((k) => flags[k])
        .map((k) => t.flags[k].line),
    ].filter(Boolean);

    const blocks: string[] = [];
    if (roleLine) blocks.push(roleLine);
    blocks.push(`${t.labels.task}: ${task.line(subject.trim() || t.subjectFallback)}`);
    blocks.push(`${t.labels.input}: ${input.line}`);
    blocks.push(`${t.labels.output}: ${output.line}`);
    if (limits.length) blocks.push(`${t.labels.limits}:\n${limits.map((l) => `- ${l}`).join("\n")}`);
    if (c.input === "text" || c.input === "data") {
      blocks.push(`<<<\n${t.placeholderBlock}\n>>>`);
    }
    return blocks.join("\n\n");
  }, [c, roleTopic, subject, flags, t]);

  // Změna kterékoli volby přepíše rozepsaný text — doporučený způsob, jak
  // odvodit stav ze stavu jiného (https://react.dev/learn/you-might-not-need-an-effect).
  const [draft, setDraft] = useState(composed);
  const [lastComposed, setLastComposed] = useState(composed);
  if (composed !== lastComposed) {
    setLastComposed(composed);
    setDraft(composed);
  }

  const matches = useMemo(() => {
    const hits = samples.filter((s) => s.tasks.includes(c.task));
    const out: PromptSample[] = [];
    const seen = new Set<string>();
    for (const s of hits) {
      if (seen.has(s.slug)) continue;
      seen.add(s.slug);
      out.push(s);
      if (out.length === 3) break;
    }
    return out.length ? out : hits.slice(0, 3);
  }, [samples, c.task]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(draft);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // starší prohlížeče: tlačítko prostě nic neudělá, text zůstává k označení
    }
  };

  return (
    <div className="mt-10">
      <div className="border-[1.5px] border-hairline-strong px-5 sm:px-6">
        <Chips label={t.groups.role} options={opts(t.roles)} active={c.role} onPick={pick("role")} />
        {c.role === "expert" ? (
          <div className="border-b border-hairline py-4">
            <label className="eyebrow block text-faint" htmlFor="pb-role-topic">
              {t.roleTopicLabel}
            </label>
            <input
              id="pb-role-topic"
              type="text"
              value={roleTopic}
              onChange={(e) => setRoleTopic(e.target.value)}
              placeholder={t.roleTopicPlaceholder}
              className="mt-2 w-full border-[1.5px] border-hairline bg-paper px-3 py-2.5 text-[15px] outline-none focus:border-accent"
            />
          </div>
        ) : null}

        <Chips label={t.groups.task} options={opts(t.tasks)} active={c.task} onPick={pick("task")} />
        <div className="border-b border-hairline py-4">
          <label className="eyebrow block text-faint" htmlFor="pb-subject">
            {t.subjectLabel}
          </label>
          <input
            id="pb-subject"
            type="text"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder={t.tasks[c.task as keyof typeof t.tasks].ph}
            className="mt-2 w-full border-[1.5px] border-hairline bg-paper px-3 py-2.5 text-[15px] outline-none focus:border-accent"
          />
        </div>

        <Chips label={t.groups.input} options={opts(t.inputs)} active={c.input} onPick={pick("input")} />
        <Chips label={t.groups.output} options={opts(t.outputs)} active={c.output} onPick={pick("output")} />
        <Chips label={t.groups.limits} options={opts(t.lengths)} active={c.length} onPick={pick("length")} />
        <Chips label="" options={opts(t.tones)} active={c.tone} onPick={pick("tone")} />
        <Chips label="" options={opts(t.langs)} active={c.lang} onPick={pick("lang")} />

        <div className="flex flex-wrap items-baseline gap-2 py-4">
          <span className="eyebrow w-[92px] flex-none text-faint" aria-hidden="true" />
          {(Object.keys(t.flags) as (keyof typeof t.flags)[]).map((k) => (
            <button
              key={k}
              type="button"
              aria-pressed={!!flags[k]}
              onClick={() => setFlags((prev) => ({ ...prev, [k]: !prev[k] }))}
              className={`border-[1.5px] px-3.5 py-2 font-mono text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors ${
                flags[k] ? "border-ink bg-ink text-paper" : "border-hairline bg-paper hover:border-ink"
              }`}
            >
              {flags[k] ? "✓ " : ""}
              {t.flags[k].chip}
            </button>
          ))}
        </div>
      </div>

      <section aria-labelledby="pb-result" className="mt-10">
        <div className="flex flex-wrap items-baseline justify-between gap-3">
          <h2 id="pb-result" className="display text-[20px]">
            {t.resultTitle}
          </h2>
          <button
            type="button"
            onClick={copy}
            aria-live="polite"
            className={`border-[1.5px] px-3.5 py-2 font-mono text-[12px] font-semibold tracking-[0.08em] uppercase transition-colors ${
              copied ? "border-ink bg-ink text-paper" : "border-hairline-strong bg-paper hover:text-accent"
            }`}
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>
        <p className="mt-2 max-w-[58ch] text-[14px] leading-relaxed text-muted">{t.resultLead}</p>

        <textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          rows={16}
          spellCheck={false}
          aria-label={t.resultTitle}
          className="mt-4 block w-full resize-y border border-hairline bg-surface p-4 font-mono text-[12.5px] leading-relaxed text-ink outline-none focus:border-ink"
        />
        <p className="tabular mt-1.5 text-right font-mono text-[11px] text-faint">{t.chars(draft.length)}</p>
      </section>

      <section aria-labelledby="pb-lib" className="mt-12">
        <div className="flex flex-wrap items-baseline justify-between gap-3 border-b-2 border-hairline-strong pb-2">
          <h2 id="pb-lib" className="display text-[20px]">
            {t.libTitle}
          </h2>
          <Link href={p("/prompty")} className="draw-link text-[13px] font-semibold text-muted">
            {t.libAll}
          </Link>
        </div>
        <p className="mt-3 max-w-[58ch] text-[14px] leading-relaxed text-muted">{t.libLead}</p>

        {matches.length ? (
          <div className="mt-4">
            {matches.map((s) => (
              <article key={s.id} className="border-b border-hairline py-5">
                <h3 className="text-[15px] font-bold leading-snug">{s.label}</h3>
                <p className="mt-2 border-l-2 border-hairline pl-3 font-mono text-[12px] leading-relaxed whitespace-pre-wrap text-muted">
                  {s.excerpt}
                </p>
                <Link
                  href={`${p(`/tipy/${s.slug}`)}#${s.id}`}
                  className="draw-link mt-2 inline-block text-[12.5px] font-semibold text-muted"
                >
                  {s.title} · {t.libOpen}
                </Link>
              </article>
            ))}
          </div>
        ) : (
          <p className="mt-4 border-l-2 border-accent pl-4 text-[14px] text-muted">{t.libEmpty}</p>
        )}
      </section>
    </div>
  );
}
