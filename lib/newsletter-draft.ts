import { nextSendSlot, SEND_WEEKDAY, type SendSlot } from "@/lib/newsletter-schedule";
import { brevoListId, type Locale } from "@/lib/optin";
import { todayPrague } from "@/lib/publish";
import { getTip } from "@/lib/tips";
import { feedBetween, type FeedItem } from "@/lib/whats-new";

/**
 * Týdenní koncept newsletteru složený z fronty publikování.
 *
 * Jednou týdně (ve středu krátce po půlnoci, viz /api/publikace) vezme
 * články vydané za posledních sedm dní, sestaví z nich číslo, uloží ho
 * do Brevo a rovnou ho NAPLÁNUJE na pevný termín z lib/newsletter-schedule.ts
 * (čtvrtek 8:00). Do té doby má člověk den a půl na kontrolu: v Brevo jde
 * naplánované číslo upravit, nebo plánování zrušit. O hotovém čísle přijde
 * krátký e-mail na adresu odesílatele.
 *
 * NEWSLETTER_AUTOSEND=0 vrátí staré chování: jen koncept bez termínu.
 *
 * Stavba čísla odpovídá ukázce na /newsletter/ukazka: jeden tip týdne
 * do hloubky a pod ním další články „za kliknutí“.
 */

const SITE: Record<Locale, string> = {
  cs: "https://www.produktivni.cz",
  en: "https://www.productive.tips",
};

/** Den v týdnu, kdy číslo vzniká: den před rozesláním (0 = neděle … 3 = středa), v českém čase. */
export const DRAFT_WEEKDAY = (SEND_WEEKDAY + 6) % 7;
const MORE_LINKS = 4;

const T = {
  cs: {
    senderName: "Josef Pavlovic — Produktivní.cz",
    brand: "Produktivní.cz",
    campaign: (sendDate: string) => `Newsletter ${sendDate} (CS, z fronty)`,
    hello: "Dobré ráno,",
    intro: (n: number) =>
      n === 1
        ? "tento týden vyšel na webu jeden nový článek. Tady je:"
        : `tento týden vyšlo na webu ${n} nových článků. Začněte tímhle:`,
    leadLabel: "Tip týdne",
    cta: "Přečíst celý návod",
    moreLabel: "Stojí za kliknutí",
    bye: "Mějte rychlý týden,",
    name: "Josef",
    footer: "Dostáváte tento e-mail, protože jste se přihlásili k odběru na produktivni.cz.",
    unsubscribe: "Odhlásit odběr",
    notifySubject: (slot: SendSlot | null) =>
      slot ? `Newsletter odejde ${slot.label}` : `Koncept newsletteru čeká v Brevo`,
    notifyBody: (subject: string, n: number, slot: SendSlot | null) =>
      slot
        ? `V Brevo je naplánované číslo „${subject}“ složené z ${n} článků vydaných tento týden. Odejde samo: ${slot.label}. Do té doby ho můžete v Brevo zkontrolovat a upravit (Campaigns → Email → Scheduled), nebo plánování zrušit.`
        : `V Brevo je připravený koncept čísla „${subject}“ složený z ${n} článků vydaných tento týden. Nic neodešlo: otevřete Campaigns → Email → Drafts, text zkontrolujte, případně upravte a odešlete.`,
  },
  en: {
    senderName: "Josef Pavlovic — Productive",
    brand: "Productive",
    campaign: (sendDate: string) => `Newsletter ${sendDate} (EN, from the queue)`,
    hello: "Good morning,",
    intro: (n: number) =>
      n === 1
        ? "one new article went up on the site this week. Here it is:"
        : `${n} new articles went up on the site this week. Start with this one:`,
    leadLabel: "Tip of the week",
    cta: "Read the full guide",
    moreLabel: "Worth a click",
    bye: "Have a fast week,",
    name: "Josef",
    footer: "You are receiving this email because you subscribed at productive.tips.",
    unsubscribe: "Unsubscribe",
    notifySubject: (slot: SendSlot | null) =>
      slot ? `Newsletter (EN) goes out ${slot.iso}` : `Newsletter draft (EN) is waiting in Brevo`,
    notifyBody: (subject: string, n: number, slot: SendSlot | null) =>
      slot
        ? `The issue “${subject}” built from ${n} articles published this week is scheduled in Brevo and will go out on its own at ${slot.iso} (Prague time). Until then you can review and edit it (Campaigns → Email → Scheduled) or cancel the schedule.`
        : `A draft issue “${subject}” built from ${n} articles published this week is ready in Brevo. Nothing has been sent: open Campaigns → Email → Drafts, review it, edit if needed and send.`,
  },
};

const esc = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");

/** YYYY-MM-DD posunuté o počet dní (počítá se v UTC, na dnech to nic nemění). */
function shiftDay(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d + days)).toISOString().slice(0, 10);
}

export function weekdayOf(iso: string): number {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).getUTCDay();
}

export type Issue = { subject: string; preheader: string; html: string; items: FeedItem[] };

/** Sestaví číslo z článků vydaných v sedmi dnech končících dnem `day`. Bez článků vrací null. */
export function buildIssue(locale: Locale, day: string = todayPrague()): Issue | null {
  const items = feedBetween(shiftDay(day, -6), day, locale);
  if (items.length === 0) return null;
  const t = T[locale];

  // Tip týdne: nejnovější tip; když týden žádný tip nepřinesl, nejnovější článek.
  const lead = items.find((i) => i.kind === "tip") ?? items[0];
  const more = items.filter((i) => i !== lead).slice(0, MORE_LINKS);
  const tldr = lead.kind === "tip" ? getTip(lead.slug, locale)?.tldr : undefined;
  const url = (item: FeedItem) =>
    `${SITE[locale]}${item.path}?utm_source=newsletter&utm_medium=email&utm_campaign=${day}`;

  const p = (html: string, style = "") =>
    `<p style="margin:0 0 16px;font-size:16px;line-height:1.65;color:#141414;${style}">${html}</p>`;
  const h2 = (text: string) =>
    `<h2 style="margin:30px 0 12px;font-size:13px;letter-spacing:1px;text-transform:uppercase;color:#D63210;font-weight:bold;">${esc(text)}</h2>`;
  const a = (href: string, label: string) =>
    `<a href="${href}" style="color:#141414;border-bottom:1px solid #D63210;text-decoration:none;font-weight:bold;">${esc(label)}</a>`;

  const moreHtml =
    more.length > 0
      ? h2(t.moreLabel) +
        more
          .map((i) => p(`${a(url(i), i.title)}<br><span style="color:#494B4C;font-size:15px;">${esc(i.excerpt)}</span>`))
          .join("")
      : "";

  const html = `<!DOCTYPE html><html lang="${locale}"><body style="margin:0;padding:0;background:#FFFFFF;font-family:Arial,Helvetica,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#FFFFFF;">
  <tr><td align="center" style="padding:32px 16px;">
    <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;">
      <tr><td style="padding-bottom:10px;font-size:13px;font-weight:bold;letter-spacing:1px;color:#141414;text-transform:uppercase;">${t.brand}</td></tr>
      <tr><td style="border-top:2px solid #141414;padding-top:26px;">
        ${p(t.hello)}
        ${p(t.intro(items.length))}
        ${h2(t.leadLabel)}
        <h1 style="margin:0 0 14px;font-size:24px;line-height:1.25;color:#141414;font-weight:bold;">${esc(lead.title)}</h1>
        ${p(esc(lead.excerpt))}
        ${tldr ? p(esc(tldr), "color:#494B4C;font-size:15px;") : ""}
        <table role="presentation" cellpadding="0" cellspacing="0" style="margin:6px 0 8px;"><tr>
          <td style="background:#141414;">
            <a href="${url(lead)}" style="display:inline-block;padding:14px 26px;font-size:14px;font-weight:bold;color:#FFFFFF;text-decoration:none;">${t.cta}</a>
          </td>
        </tr></table>
        ${moreHtml}
        ${p(`${t.bye}<br>${t.name}`, "margin-top:30px;")}
        <hr style="border:none;border-top:1px solid #E7E7E4;margin:28px 0 16px;">
        <p style="margin:0;font-size:12px;line-height:1.6;color:#494B4C;">${t.footer} <a href="{{ unsubscribe }}" style="color:#494B4C;">${t.unsubscribe}</a>.</p>
      </td></tr>
    </table>
  </td></tr>
</table>
</body></html>`;

  return { subject: lead.title, preheader: lead.excerpt, html, items };
}

export type DraftResult =
  | { locale: Locale; status: "scheduled"; subject: string; articles: number; scheduledAt: string }
  | { locale: Locale; status: "created"; subject: string; articles: number }
  | { locale: Locale; status: "skipped"; reason: string }
  | { locale: Locale; status: "failed"; reason: string };

/**
 * Uloží číslo do Brevo, naplánuje ho na pevný termín (nextSendSlot) a dá o tom
 * vědět. Hned nic neodesílá; odběratelům číslo odejde až v naplánovaný čas.
 */
export async function createDraft(locale: Locale, day: string = todayPrague()): Promise<DraftResult> {
  const apiKey = process.env.BREVO_API_KEY;
  const listId = brevoListId(locale);
  if (!apiKey || !listId) return { locale, status: "skipped", reason: "chybí BREVO_API_KEY nebo seznam" };
  // Bez vlastního anglického seznamu by anglické číslo mířilo na český seznam.
  if (locale === "en" && listId === brevoListId("cs")) {
    return { locale, status: "skipped", reason: "není nastavený BREVO_LIST_ID_EN" };
  }

  const issue = buildIssue(locale, day);
  if (!issue) return { locale, status: "skipped", reason: "tento týden nic nevyšlo" };

  const t = T[locale];
  const target = nextSendSlot();
  const slot = process.env.NEWSLETTER_AUTOSEND === "0" ? null : target;
  const name = t.campaign(target.date);
  const headers = { "api-key": apiKey, "Content-Type": "application/json" };
  const senderEmail = process.env.BREVO_SENDER_EMAIL ?? "josef@josefpavlovic.cz";

  // Na jeden termín a jeden seznam smí existovat jen jedno číslo — ať ho založil
  // cron, nebo AI přes MCP s jiným názvem (docs/RUTINA.md, 8e). Shoda tedy
  // nestojí na celém názvu, ale na seznamu a dni rozeslání: ten je buď v termínu
  // kampaně, nebo (u konceptu bez termínu) na začátku názvu „Newsletter <den> …“.
  type Campaign = { name: string; scheduledAt?: string; recipients?: { lists?: number[] } };
  const sameIssue = (c: Campaign) =>
    (c.recipients?.lists ?? []).includes(listId) &&
    ((c.scheduledAt ?? "").startsWith(target.date) || c.name.startsWith(`Newsletter ${target.date} `));
  for (const status of ["draft", "queued"]) {
    const existing = await fetch(
      `https://api.brevo.com/v3/emailCampaigns?status=${status}&limit=50&excludeHtmlContent=true`,
      { headers },
    );
    if (!existing.ok) continue;
    const data = (await existing.json()) as { campaigns?: Campaign[] };
    if (data.campaigns?.some(sameIssue)) {
      return { locale, status: "skipped", reason: "číslo na tento termín už existuje" };
    }
  }

  const res = await fetch("https://api.brevo.com/v3/emailCampaigns", {
    method: "POST",
    headers,
    body: JSON.stringify({
      name,
      subject: issue.subject,
      previewText: issue.preheader,
      sender: { name: t.senderName, email: senderEmail },
      htmlContent: issue.html,
      recipients: { listIds: [listId] },
      ...(slot ? { scheduledAt: slot.iso } : {}),
    }),
  });
  if (!res.ok) {
    const detail = await res.text();
    console.error("Newsletter draft failed:", res.status, detail);
    return { locale, status: "failed", reason: `Brevo ${res.status}` };
  }

  // Upozornění na hotový koncept — best effort.
  try {
    await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers,
      body: JSON.stringify({
        sender: { name: t.senderName, email: senderEmail },
        to: [{ email: senderEmail }],
        subject: t.notifySubject(slot),
        textContent: t.notifyBody(issue.subject, issue.items.length, slot),
      }),
    });
  } catch (e) {
    console.error("Newsletter draft notification failed:", e);
  }

  return slot
    ? { locale, status: "scheduled", subject: issue.subject, articles: issue.items.length, scheduledAt: slot.iso }
    : { locale, status: "created", subject: issue.subject, articles: issue.items.length };
}
