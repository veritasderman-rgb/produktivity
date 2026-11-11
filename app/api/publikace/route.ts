import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { createDraft, DRAFT_WEEKDAY, weekdayOf } from "@/lib/newsletter-draft";
import { todayPrague } from "@/lib/publish";

/**
 * Denní obnova webu kvůli frontě publikování (lib/publish.ts).
 *
 * Článek s dnešním datem má vyjít dnes. Hlavní stránky se obnovují samy
 * každou hodinu, ale zbytek webu (profesní stránky, cesty, vyhledávací
 * index v layoutu) je vygenerovaný při nasazení a nového článku by si
 * všiml až s dalším deployem. Tenhle endpoint proto jednou denně krátce
 * po půlnoci označí celý web k obnově; každá stránka se pak přegeneruje
 * při první návštěvě. Volá ho Vercel Cron (vercel.json).
 *
 * Ve čtvrtek navíc připraví koncept týdenního newsletteru z článků vydaných
 * za posledních sedm dní (lib/newsletter-draft.ts). Koncept se jen uloží
 * do Brevo — odeslání zůstává na člověku. Ručně: `?newsletter=1`.
 */
export async function GET(req: Request) {
  // Stejná autorizace jako u /api/kurz-drip.
  const secret = process.env.CRON_SECRET;
  const auth = req.headers.get("authorization");
  const isVercelCron = req.headers.get("x-vercel-cron") !== null;
  if (secret ? auth !== `Bearer ${secret}` : !isVercelCron) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  revalidatePath("/", "layout");

  const today = todayPrague();
  const forced = new URL(req.url).searchParams.get("newsletter") === "1";
  const newsletter =
    forced || weekdayOf(today) === DRAFT_WEEKDAY
      ? [await createDraft("cs", today), await createDraft("en", today)]
      : undefined;

  return NextResponse.json({ ok: true, today, newsletter });
}
