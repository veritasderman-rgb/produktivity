"use client";

import { useState } from "react";

export function NewsletterForm({ source = "web" }: { source?: string }) {
  const [status, setStatus] = useState<"idle" | "sending" | "ok" | "error">("idle");
  const [message, setMessage] = useState("");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const email = new FormData(e.currentTarget).get("email");
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, source }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Přihlášení se nepovedlo. Zkuste to prosím znovu.");
      }
    } catch {
      setStatus("error");
      setMessage("Přihlášení se nepovedlo. Zkuste to prosím znovu.");
    }
  }

  if (status === "ok") {
    return (
      <div className="border border-hairline-strong bg-card p-4">
        <p className="text-[14.5px] font-semibold">Hotovo! E-book máte v e-mailu — nebo rovnou tady:</p>
        <a
          href="/ebook/produktivni-top-30-tipu.pdf"
          className="mt-3 inline-block bg-accent px-4 py-2.5 text-[12.5px] font-bold tracking-wide text-accent-ink uppercase hover:bg-ink hover:text-paper"
        >
          Stáhnout Top 30 tipů (PDF)
        </a>
      </div>
    );
  }

  return (
    <div>
      <form onSubmit={submit} className="flex border-[1.5px] border-hairline-strong bg-card">
        <input
          type="email"
          name="email"
          required
          placeholder="vas@email.cz"
          aria-label="Váš e-mail"
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[15px] outline-offset-[-2px]"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-ink px-5 text-[12.5px] font-bold tracking-wide text-paper uppercase hover:bg-accent hover:text-accent-ink disabled:opacity-60"
        >
          {status === "sending" ? "Moment…" : "Odebírat"}
        </button>
      </form>
      {status === "error" && <p className="mt-2 text-[13px] font-semibold text-accent">{message}</p>}
      <p className="eyebrow mt-3 text-faint">1 tip týdně · žádný spam · odhlášení jedním klikem</p>
    </div>
  );
}
