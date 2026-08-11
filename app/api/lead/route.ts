import { NextResponse } from "next/server";

// Poptávka školení — kontakt jde do Brevo s tagem "skoleni-lead".
// Vyžaduje env BREVO_API_KEY (a volitelně BREVO_SKOLENI_LIST_ID).
export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Neplatný požadavek." }, { status: 400 });
  }

  const email = data.email;
  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Zadejte platný e-mail." }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      {
        error:
          "Formulář právě spouštíme. Napište mi prosím zatím napřímo — odkaz najdete na stránce O projektu.",
      },
      { status: 503 },
    );
  }

  const listId = Number(process.env.BREVO_SKOLENI_LIST_ID);
  const res = await fetch("https://api.brevo.com/v3/contacts", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      email,
      updateEnabled: true,
      ...(listId ? { listIds: [listId] } : {}),
      attributes: {
        JMENO: String(data.name ?? ""),
        FIRMA: String(data.company ?? ""),
        TYM: String(data.teamSize ?? ""),
        POZNAMKA: String(data.note ?? "").slice(0, 1000),
        SOURCE: "skoleni-lead",
      },
    }),
  });

  if (!res.ok && res.status !== 204) {
    const detail = await res.text();
    console.error("Brevo lead failed:", res.status, detail);
    return NextResponse.json(
      { error: "Odeslání se nepovedlo. Zkuste to prosím znovu." },
      { status: 502 },
    );
  }

  return NextResponse.json({ ok: true });
}
