const T = {
  cs: {
    aria: "Upozornění na bezpečnost dat",
    label: "Bezpečnost dat",
    body: "Do AI nástrojů nevkládejte osobní údaje, klientská data, hesla ani interní dokumenty, pokud to pravidla vaší firmy výslovně nedovolují. Citlivé údaje před vložením anonymizujte, používejte pracovní účty s ochranou dat (ne osobní) a řiďte se interními směrnicemi a GDPR. Co jednou odešlete, už nemáte pod kontrolou.",
  },
  en: {
    aria: "Data safety notice",
    label: "Data safety",
    body: "Never paste personal data, client records, passwords or internal documents into an AI tool unless your company policy explicitly allows it. Anonymize anything sensitive first, use work accounts with data protection in place — not your personal ones — and follow your internal rules and GDPR. Once something leaves your machine, it is out of your hands.",
  },
};

export function DataDisclaimer({ locale = "cs" }: { locale?: "cs" | "en" }) {
  const t = T[locale] ?? T.cs;
  return (
    <aside className="mt-10 border border-hairline-strong bg-surface p-5" aria-label={t.aria}>
      <p className="eyebrow mb-2 text-faint">{t.label}</p>
      <p className="text-[13.5px] leading-relaxed text-muted">{t.body}</p>
    </aside>
  );
}
