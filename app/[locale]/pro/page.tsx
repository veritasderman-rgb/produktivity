import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AudienceIndex, audienceIndexMetadata } from "@/components/AudienceIndex";
import { audienceBase } from "@/lib/audiences";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

/** Rozcestník profesí — česká varianta. Anglicky žije na /for. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  if (locale === "en") return {};
  return audienceIndexMetadata("cs");
}

export default async function ProPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  // Anglická mutace má vlastní segment — /pro v angličtině nikdy nevzniká.
  if (locale === "en") redirect(localePath("en", audienceBase("en")));
  return <AudienceIndex locale="cs" />;
}
