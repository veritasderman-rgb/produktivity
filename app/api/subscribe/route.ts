import { NextResponse } from "next/server";

// Přihlášení k newsletteru — kontakt jde do Brevo (list "newsletter").
// Vyžaduje env BREVO_API_KEY a BREVO_LIST_ID; bez nich vrací srozumitelnou chybu,
// aby formulář nikdy nepředstíral úspěch.
export async function POST(req: Request) {
  let email: unknown, source: unknown;
  try {
    ({ email, source } = await req.json());
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Zadejte platný e-mail." }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !listId) {
    return NextResponse.json(
      { error: "Newsletter právě spouštíme. Zkuste to prosím za pár dní." },
      { status: 503 },
    );
  }

  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      listIds: [listId],
      updateEnabled: true,
      attributes: { SOURCE: typeof source === "string" ? source : "web" },
    }),
  });

  if (!res.ok && res.status !== 204) {
    const detail = await res.text();
    console.error("Brevo subscribe failed:", res.status, detail);
    return NextResponse.json(
      { error: "Přihlášení se nepovedlo. Zkuste to prosím znovu." },
      { status: 502 },
    );
  }

  // Uvítací e-mail s e-bookem — best effort, selhání neshodí přihlášení.
  try {
    await sendWelcomeEmail(apiKey, email);
  } catch (e) {
    console.error("Welcome email failed:", e);
  }

  return NextResponse.json({ ok: true });
}

const SITE = "https://produktivni.cz";
const EBOOK_PATH = "/ebook/produktivni-top-30-tipu.pdf";

async function sendWelcomeEmail(apiKey: string, email: string) {
  const sender = {
    name: "Josef Pavlovic — Produktivní.cz",
    email: process.env.BREVO_SENDER_EMAIL ?? "josef@josefpavlovic.cz",
  };
  const base = process.env.SITE_URL ?? SITE;
  const ebookUrl = `${base}${EBOOK_PATH}`;
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender,
      to: [{ email }],
      subject: "Váš e-book: Top 30 tipů, které vám vrátí hodinu denně",
      htmlContent: `<!DOCTYPE html><html lang="cs"><body style="margin:0;padding:0;background:#F1F2EF;font-family:Arial,Helvetica,sans-serif;">
<div style="max-width:560px;margin:0 auto;padding:32px 20px;">
  <div style="background:#111417;color:#E8EAE7;padding:32px 28px;">
    <div style="font-size:12px;letter-spacing:3px;color:#3ECF8E;text-transform:uppercase;margin-bottom:14px;">Produktivní.cz</div>
    <h1 style="margin:0 0 14px;font-size:26px;line-height:1.15;text-transform:uppercase;">Díky za přihlášení!</h1>
    <p style="margin:0;color:#B7BDB8;font-size:15px;line-height:1.6;">Tady je slibovaný e-book — 30 tipů, které vám vrátí hodinu denně. Zkratky, e-mail, systémy i AI.</p>
    <p style="margin:24px 0 4px;"><a href="${ebookUrl}" style="display:inline-block;background:#3ECF8E;color:#04150C;font-weight:bold;text-decoration:none;padding:14px 24px;font-size:14px;text-transform:uppercase;letter-spacing:1px;">Stáhnout e-book (PDF)</a></p>
  </div>
  <p style="color:#3C4144;font-size:14px;line-height:1.6;padding:20px 4px 0;">Každý čtvrtek vám pošlu jeden tip — dvě minuty čtení, hodiny úspor. A celá příručka je zdarma na <a href="${base}/prirucka" style="color:#0E7C3F;">produktivni.cz/prirucka</a>.</p>
  <p style="color:#767C78;font-size:12px;padding:8px 4px;">Josef Pavlovic · Produktivní.cz</p>
</div>
</body></html>`,
    }),
  });
}
