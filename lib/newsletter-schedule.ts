/**
 * Pevný termín rozeslání newsletteru — jediné místo, kde je definovaný.
 *
 * Každé číslo odchází ve stejný den a čas českého času, ať ho připraví
 * cron (lib/newsletter-draft.ts) nebo ho vloží AI přes Brevo MCP
 * (postup v docs/RUTINA.md, 8e). Agent si termín nepočítá sám, ale spustí
 * `node scripts/newsletter-slot.mjs`, který čte tenhle soubor.
 *
 * Soubor schválně nemá žádné importy ani syntaxi, kterou by Node nedokázal
 * jen odstranit (enum, namespace…), aby ho šlo spustit i mimo Next.js.
 */

/** Den rozeslání: 0 = neděle … 4 = čtvrtek (web slibuje „každý čtvrtek ráno“). */
export const SEND_WEEKDAY = 4;
/** Čas rozeslání v českém čase, HH:MM. */
export const SEND_TIME = "08:00";
export const SEND_TZ = "Europe/Prague";
/** Termín bližší než tohle se přeskočí na další týden — číslo musí jít zkontrolovat. */
const MIN_LEAD_MS = 60 * 60 * 1000;

const DAY_MS = 24 * 60 * 60 * 1000;

type Parts = { y: number; m: number; d: number; hh: number; mm: number };

function pragueParts(at: Date): Parts {
  const f = new Intl.DateTimeFormat("en-GB", {
    timeZone: SEND_TZ,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
  });
  const p = Object.fromEntries(f.formatToParts(at).map((x) => [x.type, x.value]));
  return { y: +p.year, m: +p.month, d: +p.day, hh: +p.hour, mm: +p.minute };
}

/** Posun českého času proti UTC v minutách pro daný okamžik (60 v zimě, 120 v létě). */
function pragueOffsetMinutes(at: Date): number {
  const p = pragueParts(at);
  const wall = Date.UTC(p.y, p.m - 1, p.d, p.hh, p.mm);
  return Math.round((wall - Math.floor(at.getTime() / 60000) * 60000) / 60000);
}

const pad = (n: number) => String(n).padStart(2, "0");

export type SendSlot = {
  /** Den rozeslání, YYYY-MM-DD (český kalendář). */
  date: string;
  /** Okamžik rozeslání s českým posunem, např. 2026-12-03T08:00:00+01:00 — hodnota pro Brevo `scheduledAt`. */
  iso: string;
  /** Totéž v UTC (YYYY-MM-DDTHH:mm:ss.000Z). */
  utc: string;
  /** Lidsky čitelně, např. „čtvrtek 3. 12. 2026 v 8:00“. */
  label: string;
};

function slotOn(y: number, m: number, d: number): SendSlot & { ms: number } {
  const [hh, mm] = SEND_TIME.split(":").map(Number);
  // Odhad v UTC, pak oprava o skutečný posun v ten den (řeší letní čas).
  const guess = Date.UTC(y, m - 1, d, hh, mm);
  const offset = pragueOffsetMinutes(new Date(guess - 60 * 60000));
  const ms = guess - offset * 60000;
  const sign = offset >= 0 ? "+" : "-";
  const off = `${sign}${pad(Math.floor(Math.abs(offset) / 60))}:${pad(Math.abs(offset) % 60)}`;
  const date = `${y}-${pad(m)}-${pad(d)}`;
  const days = ["neděle", "pondělí", "úterý", "středa", "čtvrtek", "pátek", "sobota"];
  const weekday = new Date(Date.UTC(y, m - 1, d)).getUTCDay();
  return {
    ms,
    date,
    iso: `${date}T${pad(hh)}:${pad(mm)}:00${off}`,
    utc: new Date(ms).toISOString(),
    label: `${days[weekday]} ${d}. ${m}. ${y} v ${hh}:${pad(mm)}`,
  };
}

/** Nejbližší termín rozeslání, který je od `now` aspoň hodinu daleko. */
export function nextSendSlot(now: Date = new Date()): SendSlot {
  const p = pragueParts(now);
  const today = Date.UTC(p.y, p.m - 1, p.d);
  const weekday = new Date(today).getUTCDay();
  let ahead = (SEND_WEEKDAY - weekday + 7) % 7;
  for (;;) {
    const day = new Date(today + ahead * DAY_MS);
    const slot = slotOn(day.getUTCFullYear(), day.getUTCMonth() + 1, day.getUTCDate());
    if (slot.ms - now.getTime() >= MIN_LEAD_MS) {
      const { ms: _ms, ...rest } = slot;
      void _ms;
      return rest;
    }
    ahead += 7;
  }
}
