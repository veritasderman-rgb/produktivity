#!/usr/bin/env node
/**
 * Kontrola interních odkazů v obsahu.
 *
 * Projde všechny články v content/ a ověří, že každý interní odkaz
 * (`](/tipy/neco)`, `href="/prirucka/neco"`) vede na stránku, která existuje.
 * Běží před každým buildem (`prebuild` v package.json): rozbitý odkaz build
 * zastaví, takže se na web nedostane. Ručně: `npm run check:links`.
 *
 * Odkaz na článek, který ještě čeká ve frontě publikování (budoucí `date`),
 * se počítá jako platný — soubor existuje, jen ještě nevyšel.
 */
import fs from "node:fs";
import path from "node:path";

const ROOT = path.resolve(path.dirname(new URL(import.meta.url).pathname), "..");
const CONTENT = path.join(ROOT, "content");
const APP = path.join(ROOT, "app", "[locale]");

/** Sekce, jejichž detail odpovídá souboru content/<sekce>/<slug>.mdx. */
const CONTENT_SECTIONS = ["tipy", "prirucka", "agenti", "ai", "rozhovory", "z-praxe"];

const slugs = (dir) =>
  fs.existsSync(dir)
    ? new Set(fs.readdirSync(dir).filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, "")))
    : new Set();

const known = { cs: {}, en: {} };
for (const s of CONTENT_SECTIONS) {
  known.cs[s] = slugs(path.join(CONTENT, s));
  known.en[s] = slugs(path.join(CONTENT, "en", s));
}

/** Existuje v app/[locale] stránka pro tuhle cestu? Dynamické segmenty berou cokoli. */
function routeExists(segments, dir = APP) {
  if (segments.length === 0) return fs.existsSync(path.join(dir, "page.tsx"));
  const [head, ...rest] = segments;
  const entries = fs.readdirSync(dir, { withFileTypes: true }).filter((e) => e.isDirectory());
  if (entries.some((e) => e.name === head) && routeExists(rest, path.join(dir, head))) return true;
  return entries.some(
    (e) => /^\[[^.\]]+\]$/.test(e.name) && routeExists(rest, path.join(dir, e.name)),
  );
}

function check(href, fileLocale) {
  let p = href.split(/[?#]/)[0].replace(/\/+$/, "");
  let locale = fileLocale;
  if (p === "/en" || p.startsWith("/en/")) {
    locale = "en";
    p = p.slice(3);
  }
  if (p === "") return null;
  if (/\.[a-z0-9]{2,5}$/i.test(p)) {
    return fs.existsSync(path.join(ROOT, "public", p)) ? null : "soubor v public/ neexistuje";
  }
  const segments = p.split("/").filter(Boolean);
  const [section, slug] = segments;
  if (segments.length === 2 && CONTENT_SECTIONS.includes(section)) {
    if (known[locale][section].has(slug)) return null;
    // Anglický web smí odkázat jen na to, co je přeložené.
    return locale === "en" && known.cs[section].has(slug)
      ? "článek nemá anglickou verzi"
      : "článek neexistuje";
  }
  return routeExists(segments) ? null : "stránka neexistuje";
}

function* walk(dir) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) yield* walk(full);
    else if (/\.mdx?$/.test(e.name)) yield full;
  }
}

const LINK_RE = /\]\((\/[^)\s]*)\)|href=["'](\/[^"']*)["']/g;
const problems = [];
let files = 0;
let links = 0;

for (const file of walk(CONTENT)) {
  files++;
  const rel = path.relative(ROOT, file);
  const fileLocale = rel.startsWith(path.join("content", "en") + path.sep) ? "en" : "cs";
  const lines = fs.readFileSync(file, "utf8").split("\n");
  let fenced = false;
  lines.forEach((line, i) => {
    // Ukázky kódu obsahují příklady adres, ne odkazy.
    if (/^\s*```/.test(line)) fenced = !fenced;
    if (fenced) return;
    for (const m of line.matchAll(LINK_RE)) {
      const href = m[1] ?? m[2];
      if (href.startsWith("//")) continue;
      links++;
      const reason = check(href, fileLocale);
      if (reason) problems.push(`${rel}:${i + 1}  ${href}  — ${reason}`);
    }
  });
}

if (problems.length > 0) {
  console.error(`Rozbité interní odkazy (${problems.length}):\n`);
  for (const p of problems) console.error("  " + p);
  console.error(`\nZkontrolováno ${links} odkazů v ${files} souborech.`);
  process.exit(1);
}
console.log(`Interní odkazy v pořádku: ${links} odkazů v ${files} souborech.`);
