import type { Metadata } from "next";
import { SavedLists } from "@/components/SavedLists";
import { isLocale, type Locale } from "@/lib/i18n";

/* Stránka je statická: server kreslí jen kostru a texty, seznamy dokreslí
   klient z localStorage (SavedLists). */

const T = {
  cs: {
    title: "Uložené články",
    description:
      "Články uložené na později a nedávno čtené. Vše se ukládá jen ve vašem prohlížeči — bez účtu.",
    eyebrow: "Vaše čtení",
    heading: "Uložené články",
    lead: "Články uložené na později a to, co jste nedávno četli. Vše se ukládá jen v tomhle prohlížeči — bez účtu, nic se nikam neposílá. Po smazání dat prohlížeče seznam zmizí.",
  },
  en: {
    title: "Saved articles",
    description:
      "Articles saved for later and recently read ones. Everything is stored only in your browser — no account needed.",
    eyebrow: "Your reading",
    heading: "Saved articles",
    lead: "Articles you saved for later and what you read recently. Everything is stored only in this browser — no account, nothing gets sent anywhere. Clearing your browser data clears the list.",
  },
};

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const csUrl = "https://produktivni.cz/ulozene";
  const enUrl = "https://productive.tips/ulozene";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

export default async function SavedPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;

  return (
    <div className="mx-auto max-w-3xl px-6 py-14">
      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="mt-4 max-w-[62ch] text-[15.5px] leading-relaxed text-muted">{t.lead}</p>
      <SavedLists locale={locale} />
    </div>
  );
}
