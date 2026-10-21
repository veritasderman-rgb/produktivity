import { NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import {
  GRAFIKA,
  GRAFIKA_NIC,
  KB_MCP,
  MIN_OPEN,
  NASTROJE,
  PLACENY_UCET,
  UROVNE,
  doporuc,
  type Doporuceni,
} from "@/lib/pirati-dotaznik";

const SITE = "https://www.produktivni.cz";
const REPLY_TO = "josef@josefpavlovic.cz";

const ERR = {
  badRequest: "Neplatný požadavek.",
  missing: "Vyplňte prosím všechna povinná pole.",
  badEmail: "Zadejte platný e-mail — pošleme na něj doporučené materiály.",
  badAge: "Věk zadejte číslem.",
  tooShort: `Otevřené otázky potřebují aspoň ${MIN_OPEN} znaků — pár vět stačí.`,
  badChoice: "Některá z vybraných možností není platná. Obnovte stránku a zkuste to znovu.",
  noConsent: "Bez souhlasu se zpracováním odpovědi uložit nemůžeme.",
  notReady: "Dotazník právě spouštíme. Zkuste to prosím za chvíli, nebo napište na josef@josefpavlovic.cz.",
  failed: "Uložení se nepovedlo. Zkuste to prosím znovu.",
};

/** Obsah e-mailu skládáme z textů od vyplňujícího — před vložením do HTML se escapuje. */
function esc(s: string): string {
  return s
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;");
}

function str(v: unknown, max = 5000): string {
  return typeof v === "string" ? v.trim().slice(0, max) : "";
}

function list(v: unknown, allowed: readonly string[]): string[] | null {
  if (!Array.isArray(v)) return [];
  const items = v.filter((x): x is string => typeof x === "string");
  if (items.some((x) => !allowed.includes(x))) return null;
  return [...new Set(items)];
}

function emailHtml(jmeno: string, recs: Doporuceni[]): string {
  const items = recs
    .map(
      (r) => `<tr><td style="padding:0 0 22px;">
  <a href="${SITE}${r.href}" style="font-size:16px;line-height:1.4;font-weight:bold;color:#141414;text-decoration:underline;">${esc(r.title)}</a>
  <p style="margin:6px 0 0;font-size:14.5px;line-height:1.6;color:#494B4C;">${esc(r.why)}</p>
</td></tr>`,
    )
    .join("\n");

  return `<!DOCTYPE html><html lang="cs"><body style="margin:0;padding:0;background:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="padding-bottom:10px;font-size:13px;font-weight:bold;letter-spacing:1px;color:#141414;text-transform:uppercase;">Produktivní.cz · Školení AI</td></tr>
      <tr><td style="border-top:2px solid #141414;padding-top:26px;">
        <h1 style="margin:0 0 14px;font-size:22px;line-height:1.25;color:#141414;font-weight:bold;">Díky za vyplnění, ${esc(jmeno)}!</h1>
        <p style="margin:0 0 26px;font-size:15px;line-height:1.65;color:#141414;">Podle vašich odpovědí jsem vybral pár materiálů z webu Produktivní.cz, které se vám můžou hodit ještě před školením. Nemusíte přečíst všechno — začněte tím prvním.</p>
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
${items}
        </table>
        <hr style="border:none;border-top:1px solid #E7E7E4;margin:8px 0 18px;">
        <p style="margin:0 0 8px;font-size:14px;line-height:1.6;color:#141414;">Na školení se těším. Kdybyste chtěli něco doplnit, stačí odpovědět na tenhle e-mail.</p>
        <p style="margin:0;font-size:14px;line-height:1.6;color:#141414;">Josef Pavlovic</p>
        <p style="margin:22px 0 0;font-size:12px;line-height:1.5;color:#494B4C;">E-mail jste dostali, protože jste vyplnili vstupní dotazník ke školení AI pro poslanecký klub Pirátů na ${SITE}/skoleni/pirati. Další e-maily z dotazníku nechodí.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

function emailText(jmeno: string, recs: Doporuceni[]): string {
  const items = recs.map((r) => `• ${r.title}\n  ${SITE}${r.href}\n  ${r.why}`).join("\n\n");
  return `Díky za vyplnění, ${jmeno}!

Podle vašich odpovědí jsem vybral pár materiálů z webu Produktivní.cz, které se vám můžou hodit ještě před školením. Nemusíte přečíst všechno — začněte tím prvním.

${items}

Na školení se těším. Kdybyste chtěli něco doplnit, stačí odpovědět na tenhle e-mail.

Josef Pavlovic`;
}

// Vstupní dotazník ke školení AI pro poslanecký klub Pirátů.
// Odpovědi se ukládají do Neonu (env DATABASE_URL, tabulka pirati_dotaznik),
// vyplňující pak dostane přes Resend (env RESEND_API_KEY) doporučené čtení.
// Když selže jen e-mail, odpověď zůstává uložená a formulář hlásí úspěch.
// Anti-spam: honeypot pole `web` + povinné délky otevřených odpovědí.
export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: ERR.badRequest }, { status: 400 });
  }

  // Honeypot: lidé pole nevidí, roboti ho vyplní. Botovi předstíráme úspěch.
  if (str(data.web) !== "") {
    return NextResponse.json({ ok: true, emailSent: true });
  }

  const jmeno = str(data.jmeno, 100);
  const prijmeni = str(data.prijmeni, 100);
  const email = str(data.email, 254);
  const proKoho = str(data.proKoho, 200);
  const pouziti = str(data.pouziti);
  const zroutCasu = str(data.zroutCasu);
  const chybaAi = str(data.chybaAi);
  const ocekavani = str(data.ocekavani);
  const uroven = str(data.uroven);
  const placenyUcet = str(data.placenyUcet);
  const kbMcp = str(data.kbMcp);
  const nastrojeJiny = str(data.nastrojeJiny, 200);
  const vek = Number(str(data.vek, 3));

  if (!jmeno || !prijmeni || !proKoho || !uroven || !placenyUcet || !kbMcp) {
    return NextResponse.json({ error: ERR.missing }, { status: 400 });
  }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: ERR.badEmail }, { status: 400 });
  }
  if (!Number.isInteger(vek) || vek < 15 || vek > 99) {
    return NextResponse.json({ error: ERR.badAge }, { status: 400 });
  }
  if ([pouziti, zroutCasu, chybaAi, ocekavani].some((t) => t.length < MIN_OPEN)) {
    return NextResponse.json({ error: ERR.tooShort }, { status: 400 });
  }

  const nastroje = list(data.nastroje, NASTROJE);
  let grafika = list(data.grafika, GRAFIKA);
  if (
    !nastroje ||
    !grafika ||
    !(UROVNE as readonly string[]).includes(uroven) ||
    !(PLACENY_UCET as readonly string[]).includes(placenyUcet) ||
    !(KB_MCP as readonly string[]).includes(kbMcp)
  ) {
    return NextResponse.json({ error: ERR.badChoice }, { status: 400 });
  }
  // „Nedělám“ a konkrétní způsob se vylučují — konkrétní odpověď vyhrává.
  if (grafika.length > 1) grafika = grafika.filter((g) => g !== GRAFIKA_NIC);
  if (data.consent !== true) {
    return NextResponse.json({ error: ERR.noConsent }, { status: 400 });
  }

  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) {
    return NextResponse.json({ error: ERR.notReady }, { status: 503 });
  }

  const recs = doporuc({ uroven, nastroje, grafika, placenyUcet, kbMcp, zroutCasu, ocekavani });
  const sql = neon(dbUrl);

  let id: number;
  try {
    const rows = await sql`
      INSERT INTO pirati_dotaznik (
        jmeno, prijmeni, email, vek, pro_koho, pouziti, zrout_casu, chyba_ai,
        uroven, nastroje, nastroje_jiny, grafika, placeny_ucet, kb_mcp, ocekavani, doporuceni
      ) VALUES (
        ${jmeno}, ${prijmeni}, ${email}, ${vek}, ${proKoho}, ${pouziti}, ${zroutCasu}, ${chybaAi},
        ${uroven}, ${nastroje}, ${nastroje.includes("Jiný") ? nastrojeJiny || null : null}, ${grafika},
        ${placenyUcet}, ${kbMcp}, ${ocekavani}, ${recs.map((r) => r.href)}
      )
      RETURNING id`;
    id = Number(rows[0].id);
  } catch (e) {
    console.error("Neon insert pirati_dotaznik failed:", e);
    return NextResponse.json({ error: ERR.failed }, { status: 502 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    console.error("RESEND_API_KEY missing — pirati_dotaznik", id, "saved without email");
    return NextResponse.json({ ok: true, emailSent: false });
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
        "Idempotency-Key": `pirati-dotaznik-${id}`,
      },
      body: JSON.stringify({
        from: process.env.PIRATI_DOTAZNIK_FROM ?? "Josef Pavlovic <skoleni@produktivni.cz>",
        to: [email],
        reply_to: REPLY_TO,
        subject: "Školení AI: doporučené čtení podle vašich odpovědí",
        html: emailHtml(jmeno, recs),
        text: emailText(jmeno, recs),
      }),
    });
    if (!res.ok) {
      console.error("Resend pirati_dotaznik failed:", res.status, await res.text());
      return NextResponse.json({ ok: true, emailSent: false });
    }
    const body = (await res.json()) as { id?: string };
    // E-mail už odešel — selhání zápisu příznaku jen zalogujeme.
    await sql`UPDATE pirati_dotaznik SET email_odeslan = true, email_id = ${body.id ?? null} WHERE id = ${id}`.catch(
      (e) => console.error("Neon update pirati_dotaznik failed:", id, e),
    );
  } catch (e) {
    console.error("Resend pirati_dotaznik error:", e);
    return NextResponse.json({ ok: true, emailSent: false });
  }

  return NextResponse.json({ ok: true, emailSent: true });
}
