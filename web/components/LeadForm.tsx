"use client";

import { useState } from "react";

export function LeadForm() {
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
        setMessage(body.error ?? "Odeslání se nepovedlo. Zkuste to prosím znovu.");
      }
    } catch {
      setStatus("error");
      setMessage("Odeslání se nepovedlo. Zkuste to prosím znovu.");
    }
  }

  if (status === "ok") {
    return (
      <p className="border border-hairline-strong bg-card p-5 text-[15px] font-semibold">
        Díky za poptávku! Ozvu se vám do dvou pracovních dnů s návrhem termínu a programu.
      </p>
    );
  }

  const field =
    "w-full border-[1.5px] border-hairline-strong bg-card px-4 py-3 text-[15px] outline-offset-[-2px]";

  return (
    <form onSubmit={submit} className="grid gap-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="grid gap-1.5">
          <span className="eyebrow text-faint">Jméno a příjmení</span>
          <input name="name" required autoComplete="name" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className="eyebrow text-faint">Pracovní e-mail</span>
          <input name="email" type="email" required autoComplete="email" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className="eyebrow text-faint">Firma</span>
          <input name="company" required autoComplete="organization" className={field} />
        </label>
        <label className="grid gap-1.5">
          <span className="eyebrow text-faint">Velikost týmu</span>
          <select name="teamSize" className={field} defaultValue="do 15 lidí">
            <option>do 15 lidí</option>
            <option>15–50 lidí</option>
            <option>50–200 lidí</option>
            <option>200+ lidí</option>
          </select>
        </label>
      </div>
      <label className="grid gap-1.5">
        <span className="eyebrow text-faint">Co vás pálí nejvíc?</span>
        <textarea
          name="note"
          rows={4}
          placeholder="Např. tým tone v e-mailech, chceme zavést AI nástroje, porady nikam nevedou…"
          className={field}
        />
      </label>
      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-blue px-6 py-3.5 text-[13.5px] font-bold tracking-wide text-blue-ink uppercase hover:bg-ink hover:text-paper disabled:opacity-60"
          style={{ fontStretch: "110%" }}
        >
          {status === "sending" ? "Odesílám…" : "Poptat školení"}
        </button>
        {status === "error" && <p className="text-[13px] font-semibold text-blue">{message}</p>}
      </div>
    </form>
  );
}
