import { NextResponse } from "next/server";
import { brevoListId, sendConfirmationEmail, type Locale } from "@/lib/optin";

const ERR = {
  cs: {
    badRequest: "Neplatný požadavek.",
    badEmail: "Zadejte platný e-mail.",
    notReady: "Newsletter právě spouštíme. Zkuste to prosím za pár dní.",
    failed: "Přihlášení se nepovedlo. Zkuste to prosím znovu.",
  },
  en: {
    badRequest: "Invalid request.",
    badEmail: "Enter a valid email address.",
    notReady: "The newsletter is just launching. Please try again in a few days.",
    failed: "Signing up did not work. Please try again.",
  },
};

// Přihlášení k newsletteru, krok 1 — odešle potvrzovací e-mail (double opt-in).
// Vyžaduje env BREVO_API_KEY a BREVO_LIST_ID; bez nich vrací srozumitelnou chybu,
// aby formulář nikdy nepředstíral úspěch.
/** Rychleji formulář vyplní a odešle jen robot (měřeno od načtení stránky). */
const MIN_FILL_MS = 3000;

export async function POST(req: Request) {
  let email: unknown, source: unknown, rawLocale: unknown, hp: unknown, elapsed: unknown;
  try {
    ({ email, source, locale: rawLocale, hp, elapsed } = await req.json());
  } catch {
    return NextResponse.json({ error: ERR.cs.badRequest }, { status: 400 });
  }

  const locale: Locale = rawLocale === "en" ? "en" : "cs";
  const err = ERR[locale];

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: err.badEmail }, { status: 400 });
  }

  // Ochrana proti botům. Robot dostane stejnou odpověď jako člověk (ať se
  // nepřizpůsobí), jen se kontakt do Brevo neuloží. Chybějící pole znamenají
  // přímé volání API mimo formulář.
  const isBot =
    typeof hp !== "string" ||
    hp !== "" ||
    typeof elapsed !== "number" ||
    elapsed < MIN_FILL_MS;
  if (isBot) {
    console.warn("Subscribe: odmítnuto jako bot", {
      source: typeof source === "string" ? source : null,
      hp: typeof hp === "string" ? hp.length > 0 : "chybí",
      elapsed: typeof elapsed === "number" ? elapsed : "chybí",
    });
    return NextResponse.json({ ok: true });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || !brevoListId(locale)) {
    return NextResponse.json({ error: err.notReady }, { status: 503 });
  }

  // Dvojité potvrzení: teď odchází jen e-mail s odkazem. Kontakt se v Brevo
  // založí až po kliknutí (/api/subscribe/confirm) — viz lib/optin.ts.
  const sourceValue = typeof source === "string" ? source.slice(0, 40) : "web";
  const sent = await sendConfirmationEmail(apiKey, email, locale, sourceValue);
  if (!sent) {
    return NextResponse.json({ error: err.failed }, { status: 502 });
  }

  return NextResponse.json({ ok: true, confirm: true });
}
