"use client";

import { useState } from "react";

/** Minimální délky textů — stejné hodnoty hlídá server v /api/practice. */
const MIN_SOLVED = 200;
const MIN_HOW = 400;

const T = {
  cs: {
    name: "Jméno nebo přezdívka",
    nameHint: "Pod tímhle jménem příspěvek vyjde.",
    email: "E-mail",
    emailHint: "Jen pro domluvu a náhled před vydáním — nikde se nezveřejní.",
    role: "Profese / obor",
    rolePlaceholder: "Např. účetní ve výrobní firmě",
    solved: "Co jste vyřešili",
    solvedPlaceholder:
      "Jaký problém vám ujídal čas a co se změnilo, když jste do toho zapojili AI?",
    solvedHint: (n: number) => `Aspoň ${n} znaků — ať je jasné, o co šlo.`,
    how: "Jak to děláte",
    howPlaceholder:
      "Postup krok za krokem: co do čeho zadáváte, jak vypadá prompt, co kontrolujete ručně…",
    howHint: (n: number) => `Aspoň ${n} znaků — konkrétní kroky, ať to jde zopakovat.`,
    tools: "Nástroje",
    toolsPlaceholder: "Např. ChatGPT, Excel, Zapier",
    consent:
      "Souhlasím se zveřejněním příspěvku po redakční úpravě. Náhled uvidím a schválím před vydáním.",
    counter: (len: number, min: number) =>
      len < min ? `${len} / ${min} znaků` : `${len} znaků ✓`,
    sending: "Odesílám…",
    submit: "Poslat příspěvek",
    error: "Odeslání se nepovedlo. Zkuste to prosím znovu.",
    tooShortSolved: (n: number) => `Popis „Co jste vyřešili“ potřebuje aspoň ${n} znaků.`,
    tooShortHow: (n: number) => `Popis „Jak to děláte“ potřebuje aspoň ${n} znaků.`,
    done: "Díky! Příspěvek dorazil. Ozvu se vám e-mailem — před vydáním dostanete náhled ke schválení.",
  },
  en: {
    name: "Name or nickname",
    nameHint: "The post will be published under this name.",
    email: "Email",
    emailHint: "Only for follow-up and the pre-publication preview — never published.",
    role: "Profession / field",
    rolePlaceholder: "E.g. accountant at a manufacturing company",
    solved: "What you solved",
    solvedPlaceholder:
      "What problem was eating your time and what changed once you brought AI into it?",
    solvedHint: (n: number) => `At least ${n} characters — make it clear what was at stake.`,
    how: "How you do it",
    howPlaceholder:
      "Step by step: what goes where, what the prompt looks like, what you still check by hand…",
    howHint: (n: number) => `At least ${n} characters — concrete steps someone could repeat.`,
    tools: "Tools",
    toolsPlaceholder: "E.g. ChatGPT, Excel, Zapier",
    consent:
      "I agree to the post being published after editing. I will see and approve a preview before it goes out.",
    counter: (len: number, min: number) =>
      len < min ? `${len} / ${min} characters` : `${len} characters ✓`,
    sending: "Sending…",
    submit: "Send your workflow",
    error: "The submission could not be sent. Please try again.",
    tooShortSolved: (n: number) => `"What you solved" needs at least ${n} characters.`,
    tooShortHow: (n: number) => `"How you do it" needs at least ${n} characters.`,
    done: "Thanks! Your submission arrived. I will follow up by email — you get a preview to approve before anything is published.",
  },
};

export function PracticeForm({ locale = "cs" }: { locale?: "cs" | "en" }) {
  const t = T[locale] ?? T.cs;
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");
  const [solvedLen, setSolvedLen] = useState(0);
  const [howLen, setHowLen] = useState(0);

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());

    // Délky hlídáme i tady, ať má člověk chybu hned a srozumitelně (server je hlídá taky).
    if (String(data.solved ?? "").trim().length < MIN_SOLVED) {
      setStatus("error");
      setMessage(t.tooShortSolved(MIN_SOLVED));
      return;
    }
    if (String(data.how ?? "").trim().length < MIN_HOW) {
      setStatus("error");
      setMessage(t.tooShortHow(MIN_HOW));
      return;
    }

    setStatus("sending");
    try {
      const res = await fetch("/api/practice", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, consent: data.consent === "on", locale }),
      });
      const body = await res.json();
      if (res.ok) {
        setStatus("ok");
      } else {
        setStatus("error");
        setMessage(body.error ?? t.error);
      }
    } catch {
      setStatus("error");
      setMessage(t.error);
    }
  }

  if (status === "ok") {
    return (
      <p
        role="status"
        className="border border-hairline-strong bg-card p-5 text-[15px] font-semibold"
      >
        {t.done}
      </p>
    );
  }

  const field =
    "w-full border-[1.5px] border-hairline-strong bg-card px-4 py-3 text-[15px] outline-offset-[-2px]";

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="eyebrow text-faint">{t.name}</span>
          <input name="name" required maxLength={100} autoComplete="nickname" className={field} />
          <span className="text-[12.5px] text-faint">{t.nameHint}</span>
        </label>
        <label className="grid gap-1.5">
          <span className="eyebrow text-faint">{t.email}</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
          <span className="text-[12.5px] text-faint">{t.emailHint}</span>
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="eyebrow text-faint">{t.role}</span>
        <input
          name="role"
          required
          maxLength={120}
          placeholder={t.rolePlaceholder}
          autoComplete="organization-title"
          className={field}
        />
      </label>
      <label className="grid gap-1.5">
        <span className="eyebrow text-faint">{t.solved}</span>
        <textarea
          name="solved"
          rows={5}
          required
          minLength={MIN_SOLVED}
          placeholder={t.solvedPlaceholder}
          onChange={(e) => setSolvedLen(e.currentTarget.value.trim().length)}
          className={field}
        />
        <span className="text-[12.5px] text-faint">
          {t.solvedHint(MIN_SOLVED)} {solvedLen > 0 && t.counter(solvedLen, MIN_SOLVED)}
        </span>
      </label>
      <label className="grid gap-1.5">
        <span className="eyebrow text-faint">{t.how}</span>
        <textarea
          name="how"
          rows={8}
          required
          minLength={MIN_HOW}
          placeholder={t.howPlaceholder}
          onChange={(e) => setHowLen(e.currentTarget.value.trim().length)}
          className={field}
        />
        <span className="text-[12.5px] text-faint">
          {t.howHint(MIN_HOW)} {howLen > 0 && t.counter(howLen, MIN_HOW)}
        </span>
      </label>
      <label className="grid gap-1.5">
        <span className="eyebrow text-faint">{t.tools}</span>
        <input name="tools" maxLength={200} placeholder={t.toolsPlaceholder} className={field} />
      </label>

      {/* Honeypot proti spamu — lidé pole nevidí, roboti ho vyplní. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Website
          <input name="web" type="text" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label className="flex items-start gap-3 text-[14px] leading-relaxed text-muted">
        <input
          name="consent"
          type="checkbox"
          required
          className="mt-1 h-4 w-4 shrink-0 accent-accent"
        />
        <span>{t.consent}</span>
      </label>

      <div className="flex flex-wrap items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-accent px-7 py-3.5 text-[14px] font-bold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {status === "sending" ? t.sending : t.submit}
        </button>
        <p aria-live="polite" className="text-[13px] font-semibold text-accent">
          {status === "error" ? message : ""}
        </p>
      </div>
    </form>
  );
}
