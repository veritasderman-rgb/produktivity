import { NextResponse } from "next/server";

type Locale = "cs" | "en";

/** Minimální délky textů — stejné hodnoty hlídá klient v PracticeForm. */
const MIN_SOLVED = 200;
const MIN_HOW = 400;

const RECIPIENT = "josef@josefpavlovic.cz";

const ERR = {
  cs: {
    badRequest: "Neplatný požadavek.",
    badName: "Vyplňte jméno nebo přezdívku.",
    badEmail: "Zadejte platný e-mail.",
    badRole: "Vyplňte profesi nebo obor.",
    tooShortSolved: `Popis „Co jste vyřešili“ potřebuje aspoň ${MIN_SOLVED} znaků.`,
    tooShortHow: `Popis „Jak to děláte“ potřebuje aspoň ${MIN_HOW} znaků.`,
    noConsent: "Bez souhlasu se zveřejněním nemůžeme příspěvek přijmout.",
    notReady: "Formulář právě spouštíme. Napište mi prosím zatím napřímo na josef@josefpavlovic.cz.",
    failed: "Odeslání se nepovedlo. Zkuste to prosím znovu.",
  },
  en: {
    badRequest: "Invalid request.",
    badName: "Fill in your name or nickname.",
    badEmail: "Enter a valid email address.",
    badRole: "Fill in your profession or field.",
    tooShortSolved: `"What you solved" needs at least ${MIN_SOLVED} characters.`,
    tooShortHow: `"How you do it" needs at least ${MIN_HOW} characters.`,
    noConsent: "We cannot accept the submission without publication consent.",
    notReady: "The form is just launching. Please email me directly at josef@josefpavlovic.cz for now.",
    failed: "The submission could not be sent. Please try again.",
  },
};

/** Obsah e-mailu skládáme z textů od čtenáře — před vložením do HTML se escapuje. */
function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function str(v: unknown): string {
  return typeof v === "string" ? v.trim() : "";
}

// Příjem příspěvků do rubriky „Z praxe“ — nikam se neukládá, jde e-mailem
// Josefovi přes Brevo transactional API. Vyžaduje env BREVO_API_KEY; bez něj
// vrací srozumitelnou 503, aby formulář nikdy nepředstíral úspěch.
// Anti-spam: honeypot pole `web` + minimální délky textů. Víc netřeba.
export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: ERR.cs.badRequest }, { status: 400 });
  }

  const locale: Locale = data.locale === "en" ? "en" : "cs";
  const err = ERR[locale];

  // Honeypot: lidé pole nevidí, roboti ho vyplní. Botovi předstíráme úspěch,
  // ať nezkouší varianty, a nic neodesíláme.
  if (str(data.web) !== "") {
    return NextResponse.json({ ok: true });
  }

  const name = str(data.name);
  const email = str(data.email);
  const role = str(data.role);
  const solved = str(data.solved);
  const how = str(data.how);
  const tools = str(data.tools);

  if (name.length < 2 || name.length > 100) {
    return NextResponse.json({ error: err.badName }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: err.badEmail }, { status: 400 });
  }
  if (role.length < 2 || role.length > 120) {
    return NextResponse.json({ error: err.badRole }, { status: 400 });
  }
  if (solved.length < MIN_SOLVED) {
    return NextResponse.json({ error: err.tooShortSolved }, { status: 400 });
  }
  if (how.length < MIN_HOW) {
    return NextResponse.json({ error: err.tooShortHow }, { status: 400 });
  }
  if (data.consent !== true) {
    return NextResponse.json({ error: err.noConsent }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: err.notReady }, { status: 503 });
  }

  const block = (label: string, value: string) =>
    `<p style="margin:18px 0 4px;font-size:12px;font-weight:bold;letter-spacing:1px;color:#494B4C;text-transform:uppercase;">${label}</p>
<p style="margin:0;font-size:15px;line-height:1.65;color:#141414;white-space:pre-wrap;">${esc(value) || "—"}</p>`;

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender: {
        name: "Produktivní.cz — Z praxe",
        email: process.env.BREVO_SENDER_EMAIL ?? RECIPIENT,
      },
      to: [{ email: RECIPIENT }],
      replyTo: { email, name },
      subject: `Z praxe: nový příspěvek od ${name}`,
      htmlContent: `<!DOCTYPE html><html lang="cs"><body style="margin:0;padding:0;background:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="padding-bottom:10px;font-size:13px;font-weight:bold;letter-spacing:1px;color:#141414;text-transform:uppercase;">Produktivní.cz · Z praxe</td></tr>
      <tr><td style="border-top:2px solid #141414;padding-top:26px;">
        <h1 style="margin:0 0 6px;font-size:22px;line-height:1.25;color:#141414;font-weight:bold;">Nový příspěvek do rubriky Z praxe</h1>
        ${block("Jméno / přezdívka", name)}
        ${block("E-mail", email)}
        ${block("Profese / obor", role)}
        ${block("Co vyřešili", solved)}
        ${block("Jak to dělají", how)}
        ${block("Nástroje", tools)}
        ${block("Jazyk formuláře", locale)}
        <hr style="border:none;border-top:1px solid #E7E7E4;margin:28px 0 16px;">
        <p style="margin:0;font-size:12px;color:#494B4C;">Odesláno formulářem na /z-praxe. Další krok: Ctrl přepíše podle content/z-praxe/SABLONA.md, autor dostane náhled ke schválení.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
    }),
  });

  if (!res.ok) {
    const detail = await res.text();
    console.error("Brevo practice submission failed:", res.status, detail);
    return NextResponse.json({ error: err.failed }, { status: 502 });
  }

  return NextResponse.json({ ok: true });
}
