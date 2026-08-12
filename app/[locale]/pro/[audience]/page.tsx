import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AudienceLanding, audienceMetadata } from "@/components/AudienceLanding";
import { audiences, getAudience, getAudienceByAnySlug, audiencePath } from "@/lib/audiences";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

/** Landing pages profesí v češtině: /pro/<slug>. Angličtina má vlastní segment /for/<slug>. */
export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (params.locale !== "cs") return [];
  return audiences.map((a) => ({ audience: a.slug.cs }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; audience: string }>;
}): Promise<Metadata> {
  const { locale: raw, audience: slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  if (locale !== "cs") return {};
  const audience = getAudience(slug, "cs");
  return audience ? audienceMetadata(audience, "cs") : {};
}

export default async function ProAudiencePage({
  params,
}: {
  params: Promise<{ locale: string; audience: string }>;
}) {
  const { locale: raw, audience: slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";

  // /en/pro/* neexistuje — pošleme čtenáře na anglickou variantu /for/*.
  if (locale !== "cs") {
    const match = getAudienceByAnySlug(slug);
    if (!match) notFound();
    redirect(localePath("en", audiencePath(match, "en")));
  }

  const audience = getAudience(slug, "cs");
  if (!audience) notFound();
  return <AudienceLanding audience={audience} locale="cs" />;
}
