"use client";

import { useState } from "react";
import { track } from "@vercel/analytics";

/**
 * Co formulář nabízí. Výchozí `ebook` říká odměnu rovnou na tlačítku.
 * Přihlášení je dvoukrokové: po odeslání přijde e-mail s potvrzovacím
 * odkazem a e-book (nebo první díl kurzu) až po kliknutí na něj. `kurz` používá stránka /kurz, kde je nabídkou
 * sedmidenní e-mailový kurz, ne e-book.
 */
export type NewsletterOffer = "ebook" | "kurz";

/** Jméno skrytého pole-pasti. Schválně nic, co by vyplnil prohlížeč nebo správce hesel. */
const HONEYPOT = "b_hp";

const T = {
  cs: {
    error: "Přihlášení se nepovedlo. Zkuste to prosím znovu.",
    doneTitle: "Ještě jeden krok: potvrďte e-mail",
    doneSpam: "Nic nepřišlo? Zkuste složku Hromadné nebo Spam.",
    placeholder: "vas@email.cz",
    ariaEmail: "Váš e-mail",
    sending: "Moment…",
    offers: {
      ebook: {
        submit: "Chci e-book",
        lead: "E-book Top 30 tipů zdarma — pošlu vám ho hned.",
        done: "Právě jsem vám poslal zprávu s odkazem. Klikněte na něj a e-book dorazí hned potom.",
        note: "Pak 1 tip týdně · žádný spam · odhlášení jedním klikem",
      },
      kurz: {
        submit: "Chci kurz",
        lead: "Sedm dní, sedm e-mailů, každý den jedna dovednost.",
        done: "Právě jsem vám poslal zprávu s odkazem. Klikněte na něj a první díl kurzu dorazí hned potom.",
        note: "Zdarma · žádný spam · odhlášení jedním klikem",
      },
    },
  },
  en: {
    error: "Sign-up failed. Please try again.",
    doneTitle: "One more step: confirm your email",
    doneSpam: "Nothing there? Check your Promotions or Spam folder.",
    placeholder: "you@email.com",
    ariaEmail: "Your email",
    sending: "One moment…",
    offers: {
      ebook: {
        submit: "Get the e-book",
        lead: "The Top 30 tips e-book, free — it lands in your inbox right away.",
        done: "I have just sent you a message with a link. Click it and the e-book arrives right after.",
        note: "Then 1 tip a week · no spam · unsubscribe in one click",
      },
      kurz: {
        submit: "Start the course",
        lead: "Seven days, seven emails, one skill a day.",
        done: "I have just sent you a message with a link. Click it and the first part of the course arrives right after.",
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
    const form = new FormData(e.currentTarget);
    const email = form.get("email");
    setStatus("sending");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          source,
          locale,
          // Ochrana proti botům: past (skryté pole) a doba od načtení stránky.
          // Měří se od načtení, ne od zobrazení formuláře — pop-up formulář
          // vzniká až po 40 s čtení a rychlé automatické vyplnění v něm
          // nesmí člověka odmítnout.
          hp: form.get(HONEYPOT) ?? "",
          elapsed: Math.round(performance.now()),
        }),
      });
      const data = await res.json();
      if (res.ok) {
        setStatus("ok");
        // Odeslaný formulář do Vercel Analytics i GA4 (GA jen se souhlasem) — podle
        // source je vidět, který formulář přihlášky přináší. Skutečné přihlášení
        // nastává až potvrzením e-mailu; to měří stránka /newsletter/potvrzeno.
        track("newsletter-signup", { source, locale });
        const w = window as typeof window & { gtag?: (...args: unknown[]) => void };
        w.gtag?.("event", "sign_up", { method: "newsletter", source });
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
      <div data-newsletter role="status" className="border border-hairline-strong bg-card p-4">
        <p className="text-[14.5px] font-bold">{t.doneTitle}</p>
        <p className="mt-1.5 text-[14px] leading-relaxed">{o.done}</p>
        <p className="mt-2 text-[12.5px] text-muted">{t.doneSpam}</p>
      </div>
    );
  }

  return (
    <div data-newsletter>
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
        {/* Past na boty: člověk pole nevidí ani na něj netabne, robot ho vyplní. */}
        <input
          type="text"
          name={HONEYPOT}
          tabIndex={-1}
          autoComplete="off"
          aria-hidden="true"
          className="absolute -left-[9999px] h-px w-px opacity-0"
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
