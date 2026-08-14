import fs from "node:fs";
import path from "node:path";
import type { Metadata } from "next";
import Link from "next/link";
import matter from "gray-matter";
import { MDXRemote } from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import { NewsletterForm } from "@/components/NewsletterForm";
import { CopyPre } from "@/components/CopyPre";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

const T = {
  cs: {
    title: "Ukázka newsletteru",
    description:
      "Takhle vypadá každé číslo: jeden tip týdne do hloubky, tři odkazy za kliknutí a prompt k okopírování. Prohlédněte si ho dřív, než zadáte e-mail.",
    eyebrow: "Takhle vypadá každé číslo",
    heading: "Ukázkové číslo newsletteru",
    lead: "Jedno skutečné číslo od začátku do konce — předmět, tip týdne, odkazy i patička s odhlášením. Chodí každý čtvrtek ráno a přečtete ho za dvě minuty.",
    back: "← Zpět na newsletter",
    fromLabel: "Od",
    fromValue: "Josef Pavlovic · Produktivní.cz",
    subjectLabel: "Předmět",
    previewLabel: "Náhled",
    ctaEyebrow: "Chcete takové číslo každý čtvrtek?",
    ctaDesc: "Přihlaste se a jako bonus vám hned přijde e-book Top 30 tipů, které vám vrátí hodinu denně.",
    copy: { copy: "Zkopírovat", copied: "Zkopírováno ✓" },
  },
  en: {
    title: "Newsletter sample",
    description:
      "This is what every issue looks like: one tip of the week in depth, three links worth a click and a prompt to copy. See it before you hand over your email.",
    eyebrow: "This is what every issue looks like",
    heading: "A sample issue",
    lead: "One real issue from top to bottom — subject line, tip of the week, links and the unsubscribe footer. It lands every Thursday morning and takes two minutes to read.",
    back: "← Back to the newsletter",
    fromLabel: "From",
    fromValue: "Josef Pavlovic · Productive",
    subjectLabel: "Subject",
    previewLabel: "Preview",
    ctaEyebrow: "Want an issue like this every Thursday?",
    ctaDesc: "Sign up and you'll instantly get the bonus e-book Top 30 tips that give you back an hour a day.",
    copy: { copy: "Copy", copied: "Copied ✓" },
  },
};

function readSample(locale: Locale) {
  const file =
    locale === "en"
      ? path.join(process.cwd(), "content", "en", "newsletter-ukazka.md")
      : path.join(process.cwd(), "content", "newsletter-ukazka.md");
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return {
    subject: (data.subject ?? "") as string,
    preheader: (data.preheader ?? "") as string,
    body: content,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const csUrl = "https://produktivni.cz/newsletter/ukazka";
  const enUrl = "https://productive.tips/newsletter/ukazka";
  return {
    title: t.title,
    description: t.description,
    alternates: {
      canonical: locale === "en" ? enUrl : csUrl,
      languages: { cs: csUrl, en: enUrl, "x-default": csUrl },
    },
  };
}

/** Komponenty pro MDX ukázky — prompt v kódovém bloku dostane tlačítko „zkopírovat". */
function makeMdxComponents(locale: Locale) {
  const copy = (T[locale] ?? T.cs).copy;
  return {
    pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
      <CopyPre label={copy}>
        <pre {...props} />
      </CopyPre>
    ),
  };
}

export default async function NewsletterSamplePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  const t = T[locale] ?? T.cs;
  const p = (path: string) => localePath(locale, path);
  const sample = readSample(locale);

  return (
    <div className="mx-auto max-w-5xl px-6 py-14">
      <div className="mx-auto max-w-[600px]">
        <p className="eyebrow mb-2 text-faint">{t.eyebrow}</p>
        <h1 className="display text-[clamp(28px,4.5vw,42px)]">{t.heading}</h1>
        <p className="mt-4 text-[16.5px] leading-relaxed text-muted">{t.lead}</p>
        <p className="mt-4 text-[14px] font-semibold">
          <Link href={p("/newsletter")} className="draw-link">
            {t.back}
          </Link>
        </p>
      </div>

      {/* E-mail na papíře: úzký sloupec ~600 px s hlavičkou Od/Předmět */}
      <div className="mx-auto mt-10 max-w-[600px] border border-hairline-strong bg-card">
        <div className="border-b border-hairline px-5 py-4 sm:px-7">
          <p className="flex gap-3 text-[13.5px]">
            <span className="eyebrow shrink-0 pt-0.5 text-faint">{t.fromLabel}</span>
            <span className="font-semibold text-ink">{t.fromValue}</span>
          </p>
          <p className="mt-2 flex gap-3 text-[13.5px]">
            <span className="eyebrow shrink-0 pt-0.5 text-faint">{t.subjectLabel}</span>
            <span className="font-bold text-ink">{sample.subject}</span>
          </p>
          <p className="mt-2 flex gap-3 text-[13.5px]">
            <span className="eyebrow shrink-0 pt-0.5 text-faint">{t.previewLabel}</span>
            <span className="text-faint">{sample.preheader}</span>
          </p>
        </div>
        <div className="px-5 py-7 sm:px-7">
          <div className="prose-a">
            <MDXRemote
              source={sample.body}
              components={makeMdxComponents(locale)}
              options={{ mdxOptions: { remarkPlugins: [remarkGfm] } }}
            />
          </div>
        </div>
      </div>

      <div className="mx-auto mt-12 max-w-[600px] border-t-2 border-hairline-strong pt-8">
        <p className="eyebrow mb-2 text-faint">{t.ctaEyebrow}</p>
        <p className="mb-5 max-w-[48ch] text-[15px] text-muted">{t.ctaDesc}</p>
        <div className="max-w-md">
          <NewsletterForm source="ukazka" locale={locale} />
        </div>
      </div>
    </div>
  );
}
