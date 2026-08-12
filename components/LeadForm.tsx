"use client";

import { useState } from "react";

const T = {
  cs: {
    error: "Odeslání se nepovedlo. Zkuste to prosím znovu.",
    done: "Díky za poptávku! Ozvu se vám do dvou pracovních dnů s návrhem termínu a programu.",
    name: "Jméno a příjmení",
    email: "Pracovní e-mail",
    company: "Firma",
    teamSize: "Velikost týmu",
    teamSizes: ["do 15 lidí", "15–50 lidí", "50–200 lidí", "200+ lidí"],
    note: "Co vás pálí nejvíc?",
    notePlaceholder:
      "Např. tým tone v e-mailech, chceme zavést AI nástroje, porady nikam nevedou…",
    sending: "Odesílám…",
    submit: "Poptat školení",
  },
  en: {
    error: "The message could not be sent. Please try again.",
    done: "Thanks for reaching out! I will get back to you within two business days with a proposed date and agenda.",
    name: "Full name",
    email: "Work email",
    company: "Company",
    teamSize: "Team size",
    teamSizes: ["up to 15 people", "15–50 people", "50–200 people", "200+ people"],
    note: "What slows your team down the most?",
    notePlaceholder:
      "E.g. the team is drowning in email, we want to roll out AI tools, our meetings go nowhere…",
    sending: "Sending…",
    submit: "Request training",
  },
};

export function LeadForm({ locale = "cs" }: { locale?: "cs" | "en" }) {
  const t = T[locale] ?? T.cs;
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    setStatus("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
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
      <p className="border border-hairline-strong bg-card p-5 text-[15px] font-semibold">
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
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className="eyebrow text-faint">{t.email}</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className="eyebrow text-faint">{t.company}</span>
          <input name="company" required autoComplete="organization" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className="eyebrow text-faint">{t.teamSize}</span>
          <select name="teamSize" className={field} defaultValue={t.teamSizes[0]}>
            {t.teamSizes.map((size) => (
              <option key={size}>{size}</option>
            ))}
          </select>
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="eyebrow text-faint">{t.note}</span>
        <textarea
          name="note"
          rows={4}
          placeholder={t.notePlaceholder}
          className={field}
        />
      </label>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-accent px-7 py-3.5 text-[14px] font-bold text-accent-ink transition-colors hover:bg-accent-hover disabled:opacity-60"
        >
          {status === "sending" ? t.sending : t.submit}
        </button>
        {status === "error" && <p className="text-[13px] font-semibold text-accent">{message}</p>}
      </div>
    </form>
  );
}
