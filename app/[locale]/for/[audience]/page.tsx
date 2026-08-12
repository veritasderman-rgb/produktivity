import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { AudienceLanding, audienceMetadata } from "@/components/AudienceLanding";
import { audiences, getAudience, getAudienceByAnySlug, audiencePath } from "@/lib/audiences";
import { isLocale, localePath, type Locale } from "@/lib/i18n";

/** Landing pages profesí v angličtině: /for/<slug>. Čeština má vlastní segment /pro/<slug>. */
export function generateStaticParams({ params }: { params: { locale: string } }) {
  if (params.locale !== "en") return [];
  return audiences.map((a) => ({ audience: a.slug.en }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; audience: string }>;
}): Promise<Metadata> {
  const { locale: raw, audience: slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";
  if (locale !== "en") return {};
  const audience = getAudience(slug, "en");
  return audience ? audienceMetadata(audience, "en") : {};
}

export default async function ForAudiencePage({
  params,
}: {
  params: Promise<{ locale: string; audience: string }>;
}) {
  const { locale: raw, audience: slug } = await params;
  const locale: Locale = isLocale(raw) ? raw : "cs";

  // /cs/for/* neexistuje — pošleme čtenáře na českou variantu /pro/*.
  if (locale !== "en") {
    const match = getAudienceByAnySlug(slug);
    if (!match) notFound();
    redirect(localePath("cs", audiencePath(match, "cs")));
  }

  const audience = getAudience(slug, "en");
  if (!audience) notFound();
  return <AudienceLanding audience={audience} locale="en" />;
}
