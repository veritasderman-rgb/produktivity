"use client";

import { useState } from "react";

const T = {
  cs: {
    error: "Přihlášení se nepovedlo. Zkuste to prosím znovu.",
    done: "Hotovo! E-book máte v e-mailu — nebo rovnou tady:",
    download: "Stáhnout Top 30 tipů (PDF)",
    placeholder: "vas@email.cz",
    ariaEmail: "Váš e-mail",
    sending: "Moment…",
    submit: "Odebírat",
    note: "1 tip týdně · žádný spam · odhlášení jedním klikem",
  },
  en: {
    error: "Sign-up failed. Please try again.",
    done: "Done! The e-book is on its way to your inbox — or grab it right here:",
    download: "Download Top 30 tips (PDF)",
    placeholder: "you@email.com",
    ariaEmail: "Your email",
    sending: "One moment…",
    submit: "Subscribe",
    note: "1 tip a week · no spam · unsubscribe in one click",
  },
};

export function NewsletterForm({
  source = "web",
  locale = "cs",
}: {
  source?: string;
  locale?: "cs" | "en";
}) {
  const t = T[locale] ?? T.cs;
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
        setMessage(data.error ?? t.error);
      }
    } catch {
      setStatus("error");
      setMessage(t.error);
    }
  }

  if (status === "ok") {
    return (
      <div className="border border-hairline-strong bg-card p-4">
        <p className="text-[14.5px] font-semibold">{t.done}</p>
        <a
          href="/ebook/produktivni-top-30-tipu.pdf"
          className="mt-3 inline-block bg-ink px-4 py-2.5 text-[13px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
        >
          {t.download}
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
          placeholder={t.placeholder}
          aria-label={t.ariaEmail}
          className="min-w-0 flex-1 bg-transparent px-4 py-3 text-[15px] outline-offset-[-2px]"
        />
        <button
          type="submit"
          disabled={status === "sending"}
          className="bg-ink px-5 text-[12.5px] font-bold tracking-wide text-paper uppercase hover:bg-accent hover:text-accent-ink disabled:opacity-60"
        >
          {status === "sending" ? t.sending : t.submit}
        </button>
      </form>
      {status === "error" && <p className="mt-2 text-[13px] font-semibold text-accent">{message}</p>}
      <p className="eyebrow mt-3 text-faint">{t.note}</p>
    </div>
  );
}
