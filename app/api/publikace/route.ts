import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
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
  return NextResponse.json({ ok: true, today: todayPrague() });
}
