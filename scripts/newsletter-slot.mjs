#!/usr/bin/env node
/**
 * Vypíše nejbližší pevný termín rozeslání newsletteru (lib/newsletter-schedule.ts).
 *
 *   node scripts/newsletter-slot.mjs          → 2026-12-03T08:00:00+01:00
 *   node scripts/newsletter-slot.mjs --json   → {"date":…,"iso":…,"utc":…,"label":…}
 *   node scripts/newsletter-slot.mjs --from 2026-12-03T09:00:00+01:00
 *
 * Hodnotu `iso` vložte beze změny do Brevo `scheduledAt` (postup v docs/RUTINA.md, 8e).
 * Potřebuje Node 22.18+ (spouští .ts soubor bez překladu).
 */
// Node u .ts souboru bez "type" v package.json hlásí varování; výstup je čistý i tak.
process.removeAllListeners("warning");
const { nextSendSlot } = await import("../lib/newsletter-schedule.ts");

const args = process.argv.slice(2);
const fromIdx = args.indexOf("--from");
const now = fromIdx >= 0 ? new Date(args[fromIdx + 1]) : new Date();
if (Number.isNaN(now.getTime())) {
  console.error("Neplatné datum u --from");
  process.exit(1);
}
const slot = nextSendSlot(now);
console.log(args.includes("--json") ? JSON.stringify(slot) : slot.iso);
