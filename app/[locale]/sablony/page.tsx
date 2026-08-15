import type { Metadata } from "next";
import Link from "next/link";
import { NewsletterForm } from "@/components/NewsletterForm";
import { JsonLd, breadcrumbJsonLd } from "@/components/JsonLd";
import { isLocale, localePath, type Locale } from "@/lib/i18n";
import { getTemplates } from "@/lib/templates";

const CS_URL = "https://www.produktivni.cz/sablony";
const EN_URL = "https://www.productive.tips/sablony";

const T = {
  cs: {
    metaTitle: "Šablony ke stažení",
    description:
      "Hotové šablony zdarma: osobní rozpočet, jídelníček s nákupním seznamem, kalkulace hodinové sazby, vizitky do CRM, rodinný kalendář a přehled projektů. Skutečné soubory .xlsx a .csv, ne obrázky.",
    eyebrow: "Ke stažení",
    heading: "Šablony",
    lead: "Šest hotových souborů, které si stáhnete a hned použijete. Každý vychází z konkrétního návodu na tomhle webu — šablona je ta část, kterou byste jinak skládali sami. Zdarma, bez registrace, bez e-mailu.",
    notesTitle: "Než začnete",
    notes: [
      {
        label: "Sešity .xlsx",
        text: "Otevřou se v Excelu i v Google Tabulkách (Soubor → Importovat → Nahrát). Vzorce jsou živé — nekopírujte hodnoty, přepisujte vstupy.",
      },
      {
        label: "Tabulky .csv",
        text: "Kódování UTF-8, oddělovač čárka. Dvě z nich jsou připravené na import do Notionu, jedna na import do CRM.",
      },
      {
        label: "Ukázková data",
        text: "Všechny řádky jsou vymyšlené. Slouží k tomu, abyste viděli formát a mohli zkontrolovat, že vzorce počítají — pak je smažte.",
      },
    ],
    containsLabel: "Uvnitř",
    sourcePre: "Návod, ze kterého vychází: ",
    notionBadge: "Import do Notionu",
    notionTitle: "Jak se .csv importuje do Notionu",
    notionSteps: [
      "V Notionu si otevřete stránku, kam databáze patří, a v bočním panelu zvolte Import.",
      "Vyberte CSV a nahrajte stažený soubor. Vznikne nová databáze, první sloupec se stane názvem stránky.",
      "U sloupců Termín a Poslední aktivita přepněte typ na Datum, u Stavu a Priority na Výběr — Notion je při importu založí jako text.",
      "Sloupec Projekt je zatím text. Až budete mít projekty jako samostatné řádky, přepněte ho na relaci a hodnoty se spárují podle názvu.",
    ],
    excelTitle: "Jak sešit otevřít v Google Tabulkách",
    excelSteps: [
      "V Google Tabulkách zvolte Soubor → Importovat → Nahrát a přetáhněte stažený .xlsx.",
      "Vyberte Nahradit tabulku nebo Vložit nové listy — vzorce SUMIFS, COUNTIFS i EDATE fungují v Tabulkách stejně jako v Excelu.",
      "Rozevírací seznamy a podmíněné formátování se převedou taky; kdyby se seznam někde ztratil, najdete jeho zdroj na listu s číselníkem.",
    ],
    newsletterEyebrow: "Newsletter",
    newsletterTitle: "Jeden tip týdně do e-mailu",
    newsletterDesc:
      "Šablony jsou volně ke stažení a nic za ně nechci. Jestli vám ale sedí, jak je to tady napsané, posílám jednou týdně jeden použitelný tip — přečtete ho za dvě minuty.",
  },
  en: {
    metaTitle: "Templates to download",
    description:
      "Ready-made templates, free: a personal budget, a weekly menu with a shopping list, an hourly rate calculation, a CRM import header, a family calendar and a projects overview. Real .xlsx and .csv files, not pictures.",
    eyebrow: "Downloads",
    heading: "Templates",
    lead: "Six finished files you download and use straight away. Each one comes out of a specific guide on this site — the template is the part you would otherwise assemble yourself. Free, no sign-up, no email.",
    notesTitle: "Before you start",
    notes: [
      {
        label: ".xlsx workbooks",
        text: "They open in Excel and in Google Sheets (File → Import → Upload). The formulas are live — do not paste values over them, change the inputs instead.",
      },
      {
        label: ".csv tables",
        text: "UTF-8, comma-separated. Two of them are ready to import into Notion, one is ready for a CRM import.",
      },
      {
        label: "Sample data",
        text: "Every row is made up. It is there so you can see the format and check the formulas actually calculate — then delete it.",
      },
    ],
    containsLabel: "Inside",
    sourcePre: "The guide it comes from: ",
    notionBadge: "Notion import",
    notionTitle: "How to import a .csv into Notion",
    notionSteps: [
      "Open the Notion page where the database belongs and pick Import in the sidebar.",
      "Choose CSV and upload the file. A new database appears and the first column becomes the page title.",
      "Switch the Due and Last activity columns to Date, and Status and Priority to Select — Notion creates them as plain text on import.",
      "The Project column is text for now. Once your projects exist as their own rows, switch it to a relation and the values match up by name.",
    ],
    excelTitle: "How to open a workbook in Google Sheets",
    excelSteps: [
      "In Google Sheets choose File → Import → Upload and drop in the downloaded .xlsx.",
      "Pick Replace spreadsheet or Insert new sheets — SUMIFS, COUNTIFS and EDATE all behave the same as in Excel.",
      "Drop-downs and conditional formatting come across too; if a drop-down goes missing, its source list is on the reference sheet.",
    ],
    newsletterEyebrow: "Newsletter",
    newsletterTitle: "One tip a week in your inbox",
    newsletterDesc:
      "The templates are free and I want nothing for them. But if the way things are written here suits you, I send one usable tip a week — two minutes to read.",
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
  return {
    title: t.metaTitle,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? EN_URL : CS_URL,
      languages: { cs: CS_URL, en: EN_URL, "x-default": CS_URL },
    },
    openGraph: {
      title: t.metaTitle,
      description: t.description,
      images: [`/api/og?title=${encodeURIComponent(t.metaTitle)}`],
    },
  };
}

export default async function TemplatesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);
  const templates = getTemplates(locale);
  const hasNotion = templates.some((tpl) => tpl.notion);

  return (
    <div className="mx-auto max-w-[var(--page-max)] px-[var(--page-pad)] py-14">
      <JsonLd data={breadcrumbJsonLd(locale, [{ name: t.heading, path: "/sablony" }])} />

      <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
      <h1 className="display text-[clamp(30px,5vw,48px)]">{t.heading}</h1>
      <p className="prose-a mt-4 text-[16.5px]">{t.lead}</p>

      <section aria-labelledby="pred-zacatkem" className="mt-10 border-t border-hairline pt-8">
        <h2 id="pred-zacatkem" className="eyebrow text-faint">
          {t.notesTitle}
        </h2>
        <dl className="mt-4 grid gap-x-8 gap-y-4 sm:grid-cols-3">
          {t.notes.map((n) => (
            <div key={n.label}>
              <dt className="font-mono text-[11.5px] font-semibold tracking-[0.1em] uppercase">
                {n.label}
              </dt>
              <dd className="mt-2 text-[14px] leading-relaxed text-muted">{n.text}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="mt-12 grid gap-5 sm:grid-cols-2">
        {templates.map((tpl, i) => (
          <article key={tpl.slug} className="tipcard h-full">
            <div className="flex items-baseline justify-between gap-3">
              <span className="tipcard-no">{String(i + 1).padStart(2, "0")}</span>
              <span className="font-mono text-[10.5px] font-semibold tracking-[0.12em] text-faint uppercase">
                {tpl.notion ? `${tpl.format} · ${t.notionBadge}` : tpl.format}
              </span>
            </div>

            <h2 className="mt-4 text-[19px] leading-[1.25] font-bold tracking-[-0.01em]">
              {tpl.title}
            </h2>
            <p className="mt-3 font-serif text-[14.5px] leading-[1.6] text-muted">{tpl.blurb}</p>

            <div className="mt-5">
              <p className="eyebrow text-faint">{t.containsLabel}</p>
              <ul className="mt-2 space-y-1 text-[13.5px] text-muted">
                {tpl.contains.map((item) => (
                  <li key={item} className="flex gap-2">
                    <span aria-hidden="true" className="text-accent">
                      ·
                    </span>
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-auto pt-6">
              <a
                href={tpl.href}
                download
                className="inline-block bg-ink px-4 py-3 text-[13px] font-bold text-paper transition-colors hover:bg-accent hover:text-accent-ink"
              >
                {tpl.downloadLabel}
              </a>
              <p className="mt-3 text-[13px] leading-relaxed text-faint">
                {t.sourcePre}
                <Link href={p(tpl.sourcePath)} className="draw-link font-semibold text-ink">
                  {tpl.sourceTitle}
                </Link>
              </p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-16 grid gap-10 border-t border-hairline pt-10 sm:grid-cols-2">
        <section aria-labelledby="excel">
          <h2 id="excel" className="display text-[19px]">
            {t.excelTitle}
          </h2>
          <ol className="prose-a mt-3 text-[15px]">
            {t.excelSteps.map((step) => (
              <li key={step}>{step}</li>
            ))}
          </ol>
        </section>

        {hasNotion ? (
          <section aria-labelledby="notion">
            <h2 id="notion" className="display text-[19px]">
              {t.notionTitle}
            </h2>
            <ol className="prose-a mt-3 text-[15px]">
              {t.notionSteps.map((step) => (
                <li key={step}>{step}</li>
              ))}
            </ol>
          </section>
        ) : null}
      </div>

      <div className="mt-16 max-w-xl border-t border-hairline pt-8">
        <p className="eyebrow mb-2 text-faint">{t.newsletterEyebrow}</p>
        <p className="display mb-3 text-[20px]">{t.newsletterTitle}</p>
        <p className="mb-5 text-[14.5px] leading-relaxed text-muted">{t.newsletterDesc}</p>
        <NewsletterForm source="sablony" locale={locale} />
      </div>
    </div>
  );
}
