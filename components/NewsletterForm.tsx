"use client";

import { useState } from "react";

/**
 * Co formulář nabízí. Výchozí `ebook` říká odměnu rovnou na tlačítku —
 * e-book chodí hned po přihlášení, takže nemá smysl ho tajit až do
 * potvrzovací hlášky. `kurz` používá stránka /kurz, kde je nabídkou
 * sedmidenní e-mailový kurz, ne e-book.
 */
export type NewsletterOffer = "ebook" | "kurz";

/** E-book, který chodí v uvítacím e-mailu. Cesta se liší podle jazyka. */
const EBOOK_HREF: Record<"cs" | "en", string> = {
  cs: "/ebook/produktivni-top-30-tipu.pdf",
  en: "/ebook/productive-top-30-tips.pdf",
};

const T = {
  cs: {
    error: "Přihlášení se nepovedlo. Zkuste to prosím znovu.",
    done: "Hotovo! E-book máte v e-mailu — nebo rovnou tady:",
    download: "Stáhnout Top 30 tipů (PDF)",
    placeholder: "vas@email.cz",
    ariaEmail: "Váš e-mail",
    sending: "Moment…",
    offers: {
      ebook: {
        submit: "Chci e-book",
        lead: "E-book Top 30 tipů zdarma — pošlu vám ho hned.",
        note: "Pak 1 tip týdně · žádný spam · odhlášení jedním klikem",
      },
      kurz: {
        submit: "Chci kurz",
        lead: "Sedm dní, sedm e-mailů, každý den jedna dovednost.",
        note: "Zdarma · žádný spam · odhlášení jedním klikem",
      },
    },
  },
  en: {
    error: "Sign-up failed. Please try again.",
    done: "Done! The e-book is on its way to your inbox — or grab it right here:",
    download: "Download Top 30 tips (PDF)",
    placeholder: "you@email.com",
    ariaEmail: "Your email",
    sending: "One moment…",
    offers: {
      ebook: {
        submit: "Get the e-book",
        lead: "The Top 30 tips e-book, free — it lands in your inbox right away.",
        note: "Then 1 tip a week · no spam · unsubscribe in one click",
      },
      kurz: {
        submit: "Start the course",
        lead: "Seven days, seven emails, one skill a day.",
        note: "Free · no spam · unsubscribe in one click",
      },
    },
  },
};

export function NewsletterForm({
  source = "web",
  locale = "cs",
  offer = "ebook",
}: {
  source?: string;
  locale?: "cs" | "en";
  offer?: NewsletterOffer;
}) {
  const t = T[locale] ?? T.cs;
  const o = t.offers[offer] ?? t.offers.ebook;
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
        body: JSON.stringify({ email, source, locale }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
        try {
          // Přihlášeno — newsletter pop-up se už nikdy nemá ukazovat.
          window.localStorage.setItem("produktivni:subscribed", "1");
        } catch {
          /* Zakázané úložiště — přihlášení proběhlo, jen si ho nezapamatujeme. */
        }
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
          href={EBOOK_HREF[locale] ?? EBOOK_HREF.cs}
          className="mt-3 inline-block bg-ink px-4 py-2.5 text-[13px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
        >
          {t.download}
        </a>
      </div>
    );
  }

  return (
    <div>
      <p className="mb-2.5 text-[14.5px] leading-snug font-bold text-ink">{o.lead}</p>
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
          {status === "sending" ? t.sending : o.submit}
        </button>
      </form>
      {status === "error" && <p className="mt-2 text-[13px] font-semibold text-accent">{message}</p>}
      <p className="eyebrow mt-3 text-faint">{o.note}</p>
    </div>
  );
}
