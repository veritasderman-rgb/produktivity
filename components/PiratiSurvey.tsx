"use client";

import Link from "next/link";
import { useState } from "react";
import {
  GRAFIKA,
  GRAFIKA_NIC,
  KB_MCP,
  MIN_OPEN,
  NASTROJE,
  PLACENY_UCET,
  UROVNE,
} from "@/lib/pirati-dotaznik";

const ERROR = "Odeslání se nepovedlo. Zkuste to prosím znovu.";

const OPEN = [
  {
    name: "pouziti",
    n: 5,
    label: "Na co jste AI za poslední měsíc reálně použili?",
    hint: "Popište jednu až dvě konkrétní situace: co jste potřebovali, jaký nástroj jste použili, co jste mu zadali a jak to dopadlo. Pokud AI nepoužíváte, napište proč.",
  },
  {
    name: "zroutCasu",
    n: 6,
    label: "Která část vaší práce vám bere nejvíc času a nejméně vás baví?",
    hint: "Například podklady k tiskům, dohledávání ve stenozáznamech, rešerše k pozměňovacím návrhům, odpovědi občanům, texty na sítě, hlídání termínů výborů.",
  },
  {
    name: "chybaAi",
    n: 7,
    label: "Kdy vám AI naposledy dala špatnou nebo vymyšlenou odpověď a jak jste to poznali?",
    hint: "Pokud se to nestalo: jak výstupy z AI ověřujete, než je pošlete dál poslanci?",
  },
] as const;

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <fieldset className="grid gap-5 border-t-2 border-ink pt-6">
      <legend className="display float-left mb-1 w-full text-[clamp(20px,3vw,26px)]">{title}</legend>
      {children}
    </fieldset>
  );
}

function Question({ n, label, hint, children }: { n: number; label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-2">
      <p className="text-[15.5px] font-bold leading-snug">
        <span className="text-faint">{n}. </span>
        {label}
      </p>
      {hint && <p className="-mt-1 max-w-[70ch] text-[13.5px] leading-relaxed text-muted">{hint}</p>}
      {children}
    </div>
  );
}

function Choice({
  type,
  name,
  value,
  required,
  checked,
  onChange,
}: {
  type: "radio" | "checkbox";
  name: string;
  value: string;
  required?: boolean;
  checked?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <label className="flex cursor-pointer items-start gap-3 border border-hairline bg-card px-4 py-3 text-[14.5px] leading-snug has-[:checked]:border-accent has-[:checked]:font-semibold">
      <input
        type={type}
        name={name}
        value={value}
        required={required}
        checked={checked}
        onChange={onChange}
        className="mt-0.5 h-4 w-4 shrink-0 accent-accent"
      />
      <span>{value}</span>
    </label>
  );
}

export function PiratiSurvey() {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [emailSent, setEmailSent] = useState(true);
  const [jiny, setJiny] = useState(false);
  const [grafika, setGrafika] = useState<string[]>([]);

  function toggleGrafika(e: React.ChangeEvent<HTMLInputElement>) {
    const { value, checked } = e.currentTarget;
    setGrafika((prev) => {
      if (!checked) return prev.filter((g) => g !== value);
      // „Nedělám“ a konkrétní způsob se vylučují.
      if (value === GRAFIKA_NIC) return [GRAFIKA_NIC];
      return [...prev.filter((g) => g !== GRAFIKA_NIC), value];
    });
  }

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const data = {
      ...Object.fromEntries(fd.entries()),
      nastroje: fd.getAll("nastroje"),
      grafika: fd.getAll("grafika"),
      consent: fd.get("consent") === "on",
    };

    if (OPEN.some((q) => String(fd.get(q.name) ?? "").trim().length < MIN_OPEN) ||
        String(fd.get("ocekavani") ?? "").trim().length < MIN_OPEN) {
      setStatus("error");
      setMessage(`Otevřené otázky potřebují aspoň ${MIN_OPEN} znaků — pár vět stačí.`);
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/pirati-dotaznik", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const body = await res.json();
      if (res.ok) {
        setEmailSent(body.emailSent !== false);
        setStatus("ok");
        window.scrollTo({ top: 0, behavior: "smooth" });
      } else {
        setStatus("error");
        setMessage(body.error ?? ERROR);
      }
    } catch {
      setStatus("error");
      setMessage(ERROR);
    }
  }

  if (status === "ok") {
    return (
      <div role="status" className="border-2 border-accent bg-card p-6">
        <p className="text-[18px] font-bold">Díky, odpovědi máme uložené.</p>
        <p className="mt-2 text-[15px] leading-relaxed text-muted">
          {emailSent
            ? "Do e-mailu vám právě odešel výběr materiálů z Produktivní.cz podle vašich odpovědí. Kdyby nedorazil, mrkněte do spamu."
            : "Doporučené materiály vám pošleme e-mailem dodatečně — automatické odeslání se teď nepovedlo."}
        </p>
      </div>
    );
  }

  const field =
    "w-full border-[1.5px] border-hairline-strong bg-card px-4 py-3 text-[15px] outline-offset-[-2px]";

  return (
    <form onSubmit={submit} className="grid gap-12">
      <Section title="Úvod">
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-1.5">
            <span className="eyebrow text-faint">1. Jméno</span>
            <input name="jmeno" required maxLength={100} autoComplete="given-name" className={field} />
          </label>
          <label className="grid gap-1.5">
            <span className="eyebrow text-faint">2. Příjmení</span>
            <input name="prijmeni" required maxLength={100} autoComplete="family-name" className={field} />
          </label>
          <label className="grid gap-1.5">
            <span className="eyebrow text-faint">3. Věk</span>
            <input name="vek" type="number" required min={15} max={99} inputMode="numeric" className={field} />
          </label>
          <label className="grid gap-1.5">
            <span className="eyebrow text-faint">E-mail</span>
            <input name="email" type="email" required maxLength={254} autoComplete="email" className={field} />
            <span className="text-[12.5px] text-faint">Pošleme na něj doporučené materiály ke školení.</span>
          </label>
        </div>
        <label className="grid gap-1.5">
          <span className="eyebrow text-faint">4. Pro koho pracujete?</span>
          <input
            name="proKoho"
            required
            maxLength={200}
            placeholder="Jméno poslance nebo poslankyně, případně klub"
            className={field}
          />
        </label>
      </Section>

      <Section title="Otevřené otázky">
        {OPEN.map((q) => (
          <Question key={q.name} n={q.n} label={q.label} hint={q.hint}>
            <textarea name={q.name} rows={5} required minLength={MIN_OPEN} maxLength={5000} className={field} />
          </Question>
        ))}
      </Section>

      <Section title="Výběr">
        <Question n={8} label="Jak AI používáte?" hint="Vyberte jednu možnost.">
          <div className="grid gap-2">
            {UROVNE.map((v) => (
              <Choice key={v} type="radio" name="uroven" value={v} required />
            ))}
          </div>
        </Question>

        <Question n={9} label="Které nástroje používáte?" hint="Můžete vybrat víc možností.">
          <div className="grid gap-2 sm:grid-cols-2">
            {NASTROJE.map((v) => (
              <Choice
                key={v}
                type="checkbox"
                name="nastroje"
                value={v}
                onChange={v === "Jiný" ? (e) => setJiny(e.currentTarget.checked) : undefined}
              />
            ))}
          </div>
          {jiny && (
            <input name="nastrojeJiny" maxLength={200} placeholder="Jaký?" aria-label="Jiný nástroj" className={field} />
          )}
        </Question>

        <Question n={10} label="AI u grafiky a videa" hint="Můžete vybrat víc možností.">
          <div className="grid gap-2">
            {GRAFIKA.map((v) => (
              <Choice
                key={v}
                type="checkbox"
                name="grafika"
                value={v}
                checked={grafika.includes(v)}
                onChange={toggleGrafika}
              />
            ))}
          </div>
        </Question>

        <Question n={11} label="Máte placený účet?">
          <div className="grid gap-2">
            {PLACENY_UCET.map((v) => (
              <Choice key={v} type="radio" name="placenyUcet" value={v} required />
            ))}
          </div>
        </Question>

        <Question n={12} label="Piráti KB a MCP konektory">
          <div className="grid gap-2">
            {KB_MCP.map((v) => (
              <Choice key={v} type="radio" name="kbMcp" value={v} required />
            ))}
          </div>
        </Question>
      </Section>

      <Section title="Závěr">
        <Question n={13} label="Co si chcete ze školení odnést?">
          <textarea name="ocekavani" rows={4} required minLength={MIN_OPEN} maxLength={5000} className={field} />
        </Question>

        {/* Honeypot proti spamu — lidé pole nevidí, roboti ho vyplní. */}
        <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <label>
            Website
            <input name="web" type="text" tabIndex={-1} autoComplete="off" />
          </label>
        </div>

        <label className="flex items-start gap-3 text-[14px] leading-relaxed text-muted">
          <input name="consent" type="checkbox" required className="mt-1 h-4 w-4 shrink-0 accent-accent" />
          <span>
            Souhlasím, aby Josef Pavlovic (Produktivní.cz) zpracoval mé odpovědi a e-mail pro přípravu školení
            a poslal mi jeden e-mail s doporučenými materiály. Odpovědi slouží jen k přípravě školení.{" "}
            <Link href="/ochrana-osobnich-udaju" className="draw-link font-semibold text-ink">
              Ochrana osobních údajů
            </Link>
          </span>
        </label>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="submit"
            disabled={status === "sending"}
            className="bg-accent px-7 py-3.5 text-[14px] font-bold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
          >
            {status === "sending" ? "Odesílám…" : "Odeslat dotazník"}
          </button>
          <p aria-live="polite" className="text-[13px] font-semibold text-accent">
            {status === "error" ? message : ""}
          </p>
        </div>
      </Section>
    </form>
  );
}
