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

  return NextResponse.json({ ok: true });
}
