import { NextResponse } from "next/server";

/**
 * Denní rozesílka sedmidenního kurzu — náhrada za Brevo Automations,
 * které nejdou založit přes API. Volá ji Vercel Cron (vercel.json).
 *
 * Logika: kontakty v listu BREVO_LIST_ID se SOURCE=kurz dostávají jeden díl
 * denně. Stav drží atribut KURZ_DEN (poslední odeslaný den, 0–7); den 1 se
 * posílá hned při přihlášení (viz /api/subscribe). Cron pošle další díl,
 * jen když od přihlášení uplynul odpovídající počet dní — max jeden díl
 * na kontakt a běh, takže rytmus je vždy nejvýš jeden e-mail denně.
 */

// Brevo šablony kurzu: index 0 = Den 1. Založeno 2026-08-14, viz BREVO-SETUP.md.
const TEMPLATES: Record<"cs" | "en", number[]> = {
  cs: [13, 14, 15, 16, 17, 18, 19],
  en: [20, 21, 22, 23, 24, 25, 26],
};
const COURSE_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

type BrevoContact = {
  email: string;
  emailBlacklisted: boolean;
  createdAt: string;
  attributes: Record<string, unknown>;
};

export async function GET(req: Request) {
  // Autorizace: Vercel Cron posílá Bearer CRON_SECRET (pokud je nastavený),
  // jinak aspoň hlavičku x-vercel-cron. Ručně jde spustit jen se secretem.
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const isVercelCron = req.headers.get("x-vercel-cron") !== null;
  if (secret ? auth !== `Bearer ${secret}` : !isVercelCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !listId) {
    return NextResponse.json({ error: "BREVO_API_KEY / BREVO_LIST_ID chybí" }, { status: 503 });
  }
  const brevo = (path: string, init?: RequestInit) =>
    fetch(`https://api.brevo.com/v3${path}`, {
      ...init,
      headers: { "api-key": apiKey, "Content-Type": "application/json", ...init?.headers },
    });

  // Atribut KURZ_DEN musí v účtu existovat; založení je idempotentní (chybu ignorujeme).
  await brevo("/contacts/attributes/normal/KURZ_DEN", {
    method: "POST",
    body: JSON.stringify({ type: "float" }),
  }).catch(() => {});

  // Projdi kontakty listu (stránkovaně).
  const now = Date.now();
  let sent = 0, skipped = 0, done = 0, errors = 0;
  for (let offset = 0; ; offset += 500) {
    const res = await brevo(`/contacts/lists/${listId}/contacts?limit=500&offset=${offset}`);
    if (!res.ok) {
      console.error("kurz-drip: výpis kontaktů selhal", res.status, await res.text());
      return NextResponse.json({ error: "Brevo list failed" }, { status: 502 });
    }
    const data = (await res.json()) as { contacts: BrevoContact[]; count: number };
    for (const c of data.contacts) {
      const attrs = c.attributes ?? {};
      if (attrs.SOURCE !== "kurz" || c.emailBlacklisted) { skipped++; continue; }

      const sentDays = Math.max(0, Math.min(COURSE_DAYS, Number(attrs.KURZ_DEN) || 0));
      if (sentDays >= COURSE_DAYS) { done++; continue; }

      // Kolikátý den by měl mít: den 1 při přihlášení, +1 za každý celý den od něj.
      const elapsed = Math.floor((now - Date.parse(c.createdAt)) / DAY_MS);
      const expected = Math.min(COURSE_DAYS, elapsed + 1);
      if (expected <= sentDays) { skipped++; continue; }

      const locale = attrs.LOCALE === "en" ? "en" : "cs";
      const nextDay = sentDays + 1;
      const send = await brevo("/smtp/email", {
        method: "POST",
        body: JSON.stringify({ templateId: TEMPLATES[locale][nextDay - 1], to: [{ email: c.email }] }),
      });
      if (!send.ok) {
        errors++;
        console.error("kurz-drip: odeslání selhalo", c.email, send.status, await send.text());
        continue;
      }
      await brevo(`/contacts/${encodeURIComponent(c.email)}`, {
        method: "PUT",
        body: JSON.stringify({ attributes: { KURZ_DEN: nextDay } }),
      });
      sent++;
    }
    if (offset + 500 >= data.count) break;
  }

  return NextResponse.json({ ok: true, sent, done, skipped, errors });
}
