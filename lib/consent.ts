// Souhlas s cookies (GDPR / Google Consent Mode v2)
//
// Klíč v localStorage čte jak inline skript v layoutu (nastaví výchozí stav
// souhlasu ještě před načtením GA), tak lišta CookieConsent. Ta k localStorage
// přistupuje přes useSyncExternalStore, aby se po volbě překreslila — proto tu
// vedle čtení a zápisu žije i drobná registrace posluchačů.
export const CONSENT_KEY = "produktivni.cookieConsent.v1";

export type ConsentChoice = "granted" | "denied";

let listeners: (() => void)[] = [];

export function subscribeConsent(onChange: () => void): () => void {
  listeners = [...listeners, onChange];
  return () => {
    listeners = listeners.filter((l) => l !== onChange);
  };
}

/** Uložená volba, nebo null když se návštěvník ještě nerozhodl. */
export function readConsent(): ConsentChoice | null {
  try {
    const stored = window.localStorage.getItem(CONSENT_KEY);
    return stored === "granted" || stored === "denied" ? stored : null;
  } catch {
    // Privátní režim — chováme se, jako by volba nepadla; lišta se ukáže znovu.
    return null;
  }
}

/** Na serveru se lišta nikdy nevykresluje, jinak by blikla při hydrataci. */
export function readConsentOnServer(): ConsentChoice {
  return "denied";
}

export function writeConsent(choice: ConsentChoice): void {
  try {
    window.localStorage.setItem(CONSENT_KEY, choice);
  } catch {
    /* privátní režim — volba platí jen pro tuto návštěvu */
  }
  updateGtagConsent(choice);
  for (const l of listeners) l();
}

/** Promítne volbu do Google Consent Mode v2. Když GA neběží, tiše se nic nestane. */
function updateGtagConsent(choice: ConsentChoice): void {
  const gtag = (window as unknown as { gtag?: (...args: unknown[]) => void }).gtag;
  if (typeof gtag !== "function") return;
  gtag("consent", "update", {
    ad_storage: choice,
    ad_user_data: choice,
    ad_personalization: choice,
    analytics_storage: choice,
  });
}
