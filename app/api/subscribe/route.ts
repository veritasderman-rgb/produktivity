import { NextResponse } from "next/server";

type Locale = "cs" | "en";

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

// Přihlášení k newsletteru — kontakt jde do Brevo (list "newsletter").
// Vyžaduje env BREVO_API_KEY a BREVO_LIST_ID; bez nich vrací srozumitelnou chybu,
// aby formulář nikdy nepředstíral úspěch.
export async function POST(req: Request) {
  let email: unknown, source: unknown, rawLocale: unknown;
  try {
    ({ email, source, locale: rawLocale } = await req.json());
  } catch {
    return NextResponse.json({ error: ERR.cs.badRequest }, { status: 400 });
  }

  const locale: Locale = rawLocale === "en" ? "en" : "cs";
  const err = ERR[locale];

  if (typeof email !== "string" || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: err.badEmail }, { status: 400 });
  }

  const apiKey = process.env.BREVO_API_KEY;
  const listId = Number(process.env.BREVO_LIST_ID);
  if (!apiKey || !listId) {
    return NextResponse.json({ error: err.notReady }, { status: 503 });
  }

  const sourceValue = typeof source === "string" ? source : "web";
  const createContact = (attributes: Record<string, string>) =>
    fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers: { "api-key": apiKey, "Content-Type": "application/json" },
      body: JSON.stringify({ email, listIds: [listId], updateEnabled: true, attributes }),
    });

  // LOCALE rozlišuje českou a anglickou větev automatizace — SOURCE sám o sobě
  // nestačí, formulář kurzu posílá „kurz" z obou jazykových mutací.
  let res = await createContact({ SOURCE: sourceValue, LOCALE: locale });

  // Brevo odmítne kontakt s atributem, který v účtu není definovaný. Přihlášení
  // je důležitější než rozlišení jazyka, takže to zkusíme ještě jednou bez něj.
  if (!res.ok && res.status !== 204) {
    const detail = await res.text();
    if (/attribute/i.test(detail)) {
      console.warn(
        "Brevo: atribut LOCALE není v účtu definovaný, kontakt ukládám bez něj. " +
          "Založte ho v Contacts → Settings → Contact attributes (typ Text), " +
          "jinak nepůjde odlišit českou a anglickou větev kurzu.",
      );
      res = await createContact({ SOURCE: sourceValue });
    } else {
      console.error("Brevo subscribe failed:", res.status, detail);
      return NextResponse.json({ error: err.failed }, { status: 502 });
    }
  }

  if (!res.ok && res.status !== 204) {
    const detail = await res.text();
    console.error("Brevo subscribe failed (bez LOCALE):", res.status, detail);
    return NextResponse.json({ error: err.failed }, { status: 502 });
  }

  // Uvítací e-mail s e-bookem — best effort, selhání neshodí přihlášení.
  try {
    await sendWelcomeEmail(apiKey, email, locale);
  } catch (e) {
    console.error("Welcome email failed:", e);
  }

  return NextResponse.json({ ok: true });
}

const SITE = { cs: "https://produktivni.cz", en: "https://productive.tips" };
const EBOOK_PATH = {
  cs: "/ebook/produktivni-top-30-tipu.pdf",
  en: "/ebook/productive-top-30-tips.pdf",
};

const WELCOME = {
  cs: {
    senderName: "Josef Pavlovic — Produktivní.cz",
    subject: "Váš e-book: Top 30 tipů, které vám vrátí hodinu denně",
    brand: "Produktivní.cz",
    heading: "Díky za přihlášení",
    lead: "Tady je slibovaný e-book — 30 tipů, které vám vrátí hodinu denně. Zkratky, e-mail, systémy i AI.",
    cta: "Stáhnout e-book (PDF)",
    afterA: "Každý týden vám pošlu jeden tip — dvě minuty čtení, hodiny úspor. Celá příručka je zdarma na ",
    handbookLabel: "produktivni.cz/prirucka",
    afterB: ". A jestli nevíte, kde začít, kvíz vám za dvě minuty poradí systém, který vám sedne: ",
    quizLabel: "produktivni.cz/nastroje/kviz",
    signature: "Josef Pavlovic · Produktivní.cz",
  },
  en: {
    senderName: "Josef Pavlovic — Productive",
    subject: "Your e-book: 30 tips that give you an hour back every day",
    brand: "Productive",
    heading: "Thanks for signing up",
    lead: "Here is the e-book I promised — 30 tips that give you an hour back every day. Shortcuts, email, systems and AI.",
    cta: "Download the e-book (PDF)",
    afterA: "Every week I send one tip — two minutes to read, hours saved. The whole handbook is free at ",
    handbookLabel: "productive.tips/prirucka",
    afterB: ". And if you are not sure where to start, the quiz picks a system that fits you in two minutes: ",
    quizLabel: "productive.tips/nastroje/kviz",
    signature: "Josef Pavlovic · Productive",
  },
};

/** Uvítací e-mail v identitě webu: papír, inkoust, akcent jen na akcenty. */
async function sendWelcomeEmail(apiKey: string, email: string, locale: Locale) {
  const t = WELCOME[locale];
  const base = process.env.SITE_URL ?? SITE[locale];
  const ebookUrl = `${base}${EBOOK_PATH[locale]}`;
  const sender = {
    name: t.senderName,
    email: process.env.BREVO_SENDER_EMAIL ?? "josef@josefpavlovic.cz",
  };
  const link = (href: string, label: string) =>
    `<a href="${href}" style="color:#141414;border-bottom:1px solid #D63210;text-decoration:none;">${label}</a>`;

  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: { "api-key": apiKey, "Content-Type": "application/json" },
    body: JSON.stringify({
      sender,
      to: [{ email }],
      subject: t.subject,
      htmlContent: `<!DOCTYPE html><html lang="${locale}"><body style="margin:0;padding:0;background:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="padding-bottom:10px;font-size:13px;font-weight:bold;letter-spacing:1px;color:#141414;text-transform:uppercase;">${t.brand}</td></tr>
      <tr><td style="border-top:2px solid #141414;padding-top:26px;">
        <h1 style="margin:0 0 14px;font-size:26px;line-height:1.2;color:#141414;font-weight:bold;">${t.heading}</h1>
        <p style="margin:0 0 22px;font-size:16px;line-height:1.65;color:#141414;">${t.lead}</p>
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="background:#141414;">
            <a href="${ebookUrl}" style="display:inline-block;padding:14px 26px;font-size:14px;font-weight:bold;color:#FFFFFF;text-decoration:none;">${t.cta}</a>
          </td>
        </tr></table>
        <p style="margin:26px 0 0;font-size:15px;line-height:1.65;color:#494B4C;">${t.afterA}${link(`${base}/prirucka`, t.handbookLabel)}${t.afterB}${link(`${base}/nastroje/kviz`, t.quizLabel)}.</p>
        <hr style="border:none;border-top:1px solid #E7E7E4;margin:28px 0 16px;">
        <p style="margin:0;font-size:12px;color:#494B4C;">${t.signature}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`,
    }),
  });
}
