// Souhlas s cookies (GDPR / Google Consent Mode v2)
//
// Klíč v localStorage čte jak inline skript v layoutu (nastaví výchozí stav
// souhlasu ještě před načtením GA), tak lišta CookieConsent. Ta se na stav ptá
// přes useSyncExternalStore, aby se překreslila jak po volbě, tak když souhlas
// někdo znovu otevře z patičky — proto tu vedle čtení a zápisu žije i drobná
// registrace posluchačů.
export const CONSENT_KEY = "produktivni.cookieConsent.v1";

export type ConsentChoice = "granted" | "denied";

let listeners: (() => void)[] = [];

/** Lišta otevřená z patičky, i když volba už padla (odvolání souhlasu). */
let reopened = false;

function notify(): void {
  for (const l of listeners) l();
}

export function subscribeConsent(onChange: () => void): () => void {
  listeners = [...listeners, onChange];
  return () => {
    listeners = listeners.filter((l) => l !== onChange);
  };
}

/** Volba pro případ, že localStorage zápis odmítne (privátní režim,
 *  sandbox). Bez ní by se lišta po kliknutí nezavřela — přečetla by si
 *  prázdné úložiště a otevřela se znovu. */
let fallbackChoice: ConsentChoice | null = null;

/** Uložená volba, nebo null když se návštěvník ještě nerozhodl. */
function readStored(): ConsentChoice | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    if (stored === "granted" || stored === "denied") return stored;
  } catch {
    // Privátní režim — spolehneme se na volbu drženou v paměti.
  }
  return fallbackChoice;
}

/** Má se lišta vykreslit? */
export function isConsentOpen(): boolean {
  return reopened || readStored() === null;
}

/** Na serveru se lišta nikdy nevykresluje, jinak by blikla při hydrataci. */
export function isConsentOpenOnServer(): boolean {
  return false;
}

/** Odkaz „Nastavení cookies" v patičce — souhlas musí jít odvolat stejně
 *  snadno, jako se dával. */
export function reopenConsent(): void {
  reopened = true;
  notify();
}

export function writeConsent(choice: ConsentChoice): void {
  // Nejdřív do paměti: platí i tehdy, když zápis do localStorage selže.
  fallbackChoice = choice;
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* privátní režim — volba platí jen pro tuto návštěvu */
  }
  reopened = false;
  updateGtagConsent(choice);
  notify();
}

/**
 * Promítne volbu do Google Consent Mode v2. Když GA neběží, tiše se nic nestane.
 *
 * Přepíná se jen `analytics_storage`. Reklamní souhlas zůstává denied — lišta
 * slibuje měření návštěvnosti a nic víc, na reklamní účely souhlas nemáme.
 */
function updateGtagConsent(choice: ConsentChoice): void {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("consent", "update", { analytics_storage: choice });
}
