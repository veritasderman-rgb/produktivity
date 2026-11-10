import { createHmac, timingSafeEqual } from "node:crypto";
import { localePath } from "@/lib/i18n";

/**
 * Přihlášení k newsletteru s dvojitým potvrzením (double opt-in).
 *
 * 1. Formulář zavolá /api/subscribe → odejde jen potvrzovací e-mail.
 *    Do Brevo se zatím nic neukládá, takže roboti a překlepy v adrese
 *    seznam nezanášejí.
 * 2. Čtenář klikne na odkaz → /api/subscribe/confirm ověří podpis,
 *    založí kontakt, pošle uvítací e-mail s e-bookem (u kurzu i Den 1).
 *
 * Odkaz nese všechno potřebné sám (e-mail, jazyk, zdroj, platnost) a je
 * podepsaný HMAC, takže není potřeba žádná databáze čekajících přihlášek.
 * Klíč podpisu se odvozuje z BREVO_API_KEY; vlastní jde zadat v OPTIN_SECRET.
 */
export type Locale = "cs" | "en";

const TOKEN_DAYS = 7;
const DAY_MS = 24 * 60 * 60 * 1000;

type Payload = { e: string; l: Locale; s: string; x: number };

function signingKey(): string | null {
  const secret = process.env.OPTIN_SECRET ?? process.env.BREVO_API_KEY;
  return secret ? `newsletter-optin:${secret}` : null;
}

function sign(body: string, key: string): string {
  return createHmac("sha256", key).update(body).digest("base64url");
}

export function createOptinToken(email: string, locale: Locale, source: string): string | null {
  const key = signingKey();
  if (!key) return null;
  const payload: Payload = { e: email, l: locale, s: source, x: Date.now() + TOKEN_DAYS * DAY_MS };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, key)}`;
}

export type OptinResult =
  | { ok: true; email: string; locale: Locale; source: string }
  | { ok: false; reason: "invalid" | "expired"; locale: Locale };

export function verifyOptinToken(token: string | null): OptinResult {
  const key = signingKey();
  const [body, mac] = (token ?? "").split(".");
  if (!key || !body || !mac) return { ok: false, reason: "invalid", locale: "cs" };
  const expected = Buffer.from(sign(body, key));
  const given = Buffer.from(mac);
  if (expected.length !== given.length || !timingSafeEqual(expected, given)) {
    return { ok: false, reason: "invalid", locale: "cs" };
  }
  let p: Payload;
  try {
    p = JSON.parse(Buffer.from(body, "base64url").toString("utf8"));
  } catch {
    return { ok: false, reason: "invalid", locale: "cs" };
  }
  const locale: Locale = p.l === "en" ? "en" : "cs";
  if (typeof p.e !== "string" || typeof p.x !== "number") {
    return { ok: false, reason: "invalid", locale };
  }
  if (p.x < Date.now()) return { ok: false, reason: "expired", locale };
  return { ok: true, email: p.e, locale, source: typeof p.s === "string" ? p.s : "web" };
}

const SITE = { cs: "https://www.produktivni.cz", en: "https://www.productive.tips" };
const EBOOK_PATH = {
  cs: "/ebook/produktivni-top-30-tipu.pdf",
  en: "/ebook/productive-top-30-tips.pdf",
};

/** Absolutní adresa na webu v daném jazyce. SITE_URL slouží pro preview a lokální běh. */
export function siteUrl(locale: Locale, path: string): string {
  const override = process.env.SITE_URL;
  return override ? `${override}${localePath(locale, path)}` : `${SITE[locale]}${path}`;
}

/**
 * Seznam v Brevo podle jazyka. Angličtí čtenáři jdou do vlastního seznamu,
 * je-li nastavený BREVO_LIST_ID_EN — jinak do společného, kde je odliší
 * atribut LOCALE. Oddělený seznam brání tomu, aby české číslo newsletteru
 * odešlo i anglickým odběratelům.
 */
export function brevoListId(locale: Locale): number {
  const en = Number(process.env.BREVO_LIST_ID_EN);
  return locale === "en" && en ? en : Number(process.env.BREVO_LIST_ID);
}

/** Všechny seznamy newsletteru (bez duplicit) — pro úlohy, které procházejí odběratele. */
export function brevoListIds(): number[] {
  return [...new Set([brevoListId("cs"), brevoListId("en")].filter(Boolean))];
}

const sender = (name: string) => ({
  name,
  email: process.env.BREVO_SENDER_EMAIL ?? "josef@josefpavlovic.cz",
});

const brevoHeaders = (apiKey: string) => ({ "api-key": apiKey, "Content-Type": "application/json" });

const link = (href: string, label: string) =>
  `<a href="${href}" style="color:#141414;border-bottom:1px solid #D63210;text-decoration:none;">${label}</a>`;

/** Kostra e-mailu v identitě webu: papír, inkoust, akcent jen na akcenty. */
function emailHtml(
  locale: Locale,
  t: { brand: string; heading: string; lead: string; cta: string; signature: string },
  ctaUrl: string,
  after: string,
) {
  return `<!DOCTYPE html><html lang="${locale}"><body style="margin:0;padding:0;background:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="padding-bottom:10px;font-size:13px;font-weight:bold;letter-spacing:1px;color:#141414;text-transform:uppercase;">${t.brand}</td></tr>
      <tr><td style="border-top:2px solid #141414;padding-top:26px;">
        <h1 style="margin:0 0 14px;font-size:26px;line-height:1.2;color:#141414;font-weight:bold;">${t.heading}</h1>
        <p style="margin:0 0 22px;font-size:16px;line-height:1.65;color:#141414;">${t.lead}</p>
        <table role="presentation" cellpadding="0" cellspacing="0"><tr>
          <td style="background:#141414;">
            <a href="${ctaUrl}" style="display:inline-block;padding:14px 26px;font-size:14px;font-weight:bold;color:#FFFFFF;text-decoration:none;">${t.cta}</a>
          </td>
        </tr></table>
        <p style="margin:26px 0 0;font-size:15px;line-height:1.65;color:#494B4C;">${after}</p>
        <hr style="border:none;border-top:1px solid #E7E7E4;margin:28px 0 16px;">
        <p style="margin:0;font-size:12px;color:#494B4C;">${t.signature}</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;
}

const CONFIRM = {
  cs: {
    senderName: "Josef Pavlovic — Produktivní.cz",
    brand: "Produktivní.cz",
    signature: "Josef Pavlovic · Produktivní.cz",
    cta: "Potvrdit e-mail",
    after: "Odkaz platí sedm dní. Pokud jste se nepřihlašovali vy, e-mail prostě smažte — bez potvrzení vám nic dalšího nepřijde.",
    ebook: {
      subject: "Potvrďte e-mail a pošlu vám e-book",
      heading: "Ještě jedno kliknutí",
      lead: "Potvrďte prosím, že je tahle adresa vaše. Hned potom vám pošlu e-book Top 30 tipů a jednou týdně jeden tip.",
    },
    kurz: {
      subject: "Potvrďte e-mail a kurz může začít",
      heading: "Ještě jedno kliknutí",
      lead: "Potvrďte prosím, že je tahle adresa vaše. Hned potom vám přijde první díl sedmidenního kurzu.",
    },
  },
  en: {
    senderName: "Josef Pavlovic — Productive",
    brand: "Productive",
    signature: "Josef Pavlovic · Productive",
    cta: "Confirm my email",
    after: "The link is valid for seven days. If you did not sign up, just delete this email — nothing else will arrive without confirmation.",
    ebook: {
      subject: "Confirm your email and I will send the e-book",
      heading: "One more click",
      lead: "Please confirm that this address is yours. Right after that I will send you the Top 30 tips e-book, and then one tip a week.",
    },
    kurz: {
      subject: "Confirm your email and the course can start",
      heading: "One more click",
      lead: "Please confirm that this address is yours. The first part of the seven-day course arrives right after that.",
    },
  },
};

/** Krok 1: potvrzovací e-mail. Vrací false, když ho Brevo nepřijalo. */
export async function sendConfirmationEmail(
  apiKey: string,
  email: string,
  locale: Locale,
  source: string,
): Promise<boolean> {
  const token = createOptinToken(email, locale, source);
  if (!token) return false;
  const t = CONFIRM[locale];
  const v = source === "kurz" ? t.kurz : t.ebook;
  // API cesta nemá jazykový prefix — stačí správná doména.
  const url = `${process.env.SITE_URL ?? SITE[locale]}/api/subscribe/confirm?t=${encodeURIComponent(token)}`;
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: brevoHeaders(apiKey),
    body: JSON.stringify({
      sender: sender(t.senderName),
      to: [{ email }],
      subject: v.subject,
      htmlContent: emailHtml(locale, { ...t, heading: v.heading, lead: v.lead }, url, t.after),
    }),
  });
  if (!res.ok) console.error("Confirmation email failed:", res.status, await res.text());
  return res.ok;
}

/**
 * Krok 2: po potvrzení založí kontakt a pošle uvítání. Opakované kliknutí
 * na tentýž odkaz už nic neposílá. Vrací false, když se kontakt nepovedlo uložit.
 */
export async function completeSubscription(
  apiKey: string,
  email: string,
  locale: Locale,
  source: string,
): Promise<boolean> {
  const listId = brevoListId(locale);
  const headers = brevoHeaders(apiKey);

  const existing = await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
    headers,
  });
  if (existing.ok) {
    const contact = (await existing.json()) as { listIds?: number[] };
    if (contact.listIds?.includes(listId)) return true;
  }

  const createContact = (attributes: Record<string, string>) =>
    fetch("https://api.brevo.com/v3/contacts", {
      method: "POST",
      headers,
      body: JSON.stringify({ email, listIds: [listId], updateEnabled: true, attributes }),
    });

  // LOCALE rozlišuje českou a anglickou větev kurzu — SOURCE sám o sobě
  // nestačí, formulář kurzu posílá „kurz" z obou jazykových mutací.
  let res = await createContact({ SOURCE: source, LOCALE: locale });

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
      res = await createContact({ SOURCE: source });
    } else {
      console.error("Brevo subscribe failed:", res.status, detail);
      return false;
    }
  }
  if (!res.ok && res.status !== 204) {
    console.error("Brevo subscribe failed (bez LOCALE):", res.status, await res.text());
    return false;
  }

  // Uvítací e-mail s e-bookem — best effort, selhání neshodí přihlášení.
  try {
    await sendWelcomeEmail(apiKey, email, locale);
  } catch (e) {
    console.error("Welcome email failed:", e);
  }

  // Kurz: Den 1 odchází hned po potvrzení, další díly posílá denní cron
  // /api/kurz-drip podle atributu KURZ_DEN (Brevo Automations nejdou přes API).
  if (source === "kurz") {
    try {
      const day1 = locale === "en" ? 20 : 13;
      await fetch("https://api.brevo.com/v3/smtp/email", {
        method: "POST",
        headers,
        body: JSON.stringify({ templateId: day1, to: [{ email }] }),
      });
      await fetch(`https://api.brevo.com/v3/contacts/${encodeURIComponent(email)}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ attributes: { KURZ_DEN: 1 } }),
      });
    } catch (e) {
      console.error("Kurz day 1 failed:", e);
    }
  }
  return true;
}

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

async function sendWelcomeEmail(apiKey: string, email: string, locale: Locale) {
  const t = WELCOME[locale];
  const after = `${t.afterA}${link(siteUrl(locale, "/prirucka"), t.handbookLabel)}${t.afterB}${link(siteUrl(locale, "/nastroje/kviz"), t.quizLabel)}.`;
  await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: brevoHeaders(apiKey),
    body: JSON.stringify({
      sender: sender(t.senderName),
      to: [{ email }],
      subject: t.subject,
      htmlContent: emailHtml(locale, t, `${process.env.SITE_URL ?? SITE[locale]}${EBOOK_PATH[locale]}`, after),
    }),
  });
}
