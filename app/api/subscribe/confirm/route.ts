import { NextResponse } from "next/server";
import { brevoListId, completeSubscription, siteUrl, verifyOptinToken } from "@/lib/optin";

/**
 * Přihlášení k newsletteru, krok 2 — čtenář klikl na odkaz v potvrzovacím
 * e-mailu. Ověří podpis, založí kontakt v Brevo a přesměruje na stránku
 * s výsledkem. Celý tok popisuje lib/optin.ts.
 */
export async function GET(req: Request) {
  const result = verifyOptinToken(new URL(req.url).searchParams.get("t"));
  const done = (state: string) =>
    NextResponse.redirect(siteUrl(result.locale, `/newsletter/potvrzeno?stav=${state}`), 303);

  if (!result.ok) {
    if (result.reason !== "expired") return done("neplatny");
    return done(result.source === "kurz" ? "vyprselo&nabidka=kurz" : "vyprselo");
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey || !brevoListId(result.locale)) return done("chyba");

  const saved = await completeSubscription(apiKey, result.email, result.locale, result.source);
  return done(saved ? (result.source === "kurz" ? "kurz" : "ok") : "chyba");
}
