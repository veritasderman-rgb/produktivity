import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { AudienceIndex, audienceIndexMetadata } from "@/components/AudienceIndex";
import { audienceBase } from "@/lib/audiences";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

/** Rozcestník profesí — anglická varianta. Česky žije na /pro. */
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  if (locale !== "en") return {};
  return audienceIndexMetadata("en");
}

export default async function ForPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale: raw } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  // Česká mutace má vlastní segment — /for v češtině nikdy nevzniká.
  if (locale !== "en") redirect(localePath("cs", audienceBase("cs")));
  return <AudienceIndex locale="en" />;
}
