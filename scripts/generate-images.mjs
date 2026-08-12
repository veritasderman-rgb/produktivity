#!/usr/bin/env node
/**
 * Vygeneruje ilustrační obrázky kapitol příručky nebo tipů přes Gemini API.
 *
 * Použití:  GEMINI_API_KEY=... node scripts/generate-images.mjs [slug…]
 *           GEMINI_API_KEY=... IMG_TARGET=tipy node scripts/generate-images.mjs [slug…]
 * Bez argumentu projde všechny soubory v content/<target> a vygeneruje
 * obrázek pro každý, kterému chybí public/img/<target>/<slug>.png i .webp.
 * S argumenty generuje jen zadané slugy (i když už existují).
 *
 * Klíč se čte VÝHRADNĚ z env — nikdy ho nedávejte do repozitáře.
 */
import fs from "node:fs";
import path from "node:path";

const KEY = process.env.GEMINI_API_KEY;
if (!KEY) {
  console.error("Chybí GEMINI_API_KEY v prostředí.");
  process.exit(1);
}

const MODEL = process.env.GEMINI_IMAGE_MODEL ?? "gemini-3.1-flash-image";
const TARGET = process.env.IMG_TARGET === "tipy" ? "tipy" : "prirucka";
const CONTENT_DIR = path.join(process.cwd(), "content", TARGET);
const OUT_DIR = path.join(process.cwd(), "public", "img", TARGET);

const STYLE = `Hand-drawn line-art editorial illustration for a minimalist Czech productivity website.
Pure white background (#FFFFFF). Black ink pen strokes only (~2px weight, #141414),
slightly imperfect human-drawn lines, NO fills, NO shading, NO gradients, lots of empty space.
Exactly ONE small element accented in signal red (#E03616) — a single stroke or shape, nothing more.
Occasional keyboard keycap motif. No text, no letters, no people's faces. 16:9.`;

function frontmatter(raw) {
  const m = raw.match(/^---\n([\s\S]*?)\n---/);
  const out = {};
  if (m) for (const line of m[1].split("\n")) {
    const kv = line.match(/^(\w+):\s*"?(.*?)"?\s*$/);
    if (kv) out[kv[1]] = kv[2];
  }
  return out;
}

async function generate(slug, subject) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": KEY },
      body: JSON.stringify({
        contents: [{ parts: [{ text: `${STYLE}\n\nSubject of this illustration: ${subject}` }] }],
        generationConfig: { responseModalities: ["IMAGE"], imageConfig: { aspectRatio: "16:9" } },
      }),
    },
  );
  if (!res.ok) throw new Error(`${res.status}: ${(await res.text()).slice(0, 300)}`);
  const data = await res.json();
  const part = data.candidates?.[0]?.content?.parts?.find((p) => p.inlineData);
  if (!part) throw new Error("Odpověď neobsahuje obrázek.");
  fs.mkdirSync(OUT_DIR, { recursive: true });
  fs.writeFileSync(path.join(OUT_DIR, `${slug}.png`), Buffer.from(part.inlineData.data, "base64"));
}

const only = process.argv.slice(2);
const files = fs.readdirSync(CONTENT_DIR).filter((f) => f.endsWith(".mdx"));
let ok = 0, skip = 0, fail = 0;
for (const file of files) {
  const slug = file.replace(/\.mdx$/, "");
  if (only.length > 0 && !only.includes(slug)) continue;
  if (
    only.length === 0 &&
    (fs.existsSync(path.join(OUT_DIR, `${slug}.png`)) || fs.existsSync(path.join(OUT_DIR, `${slug}.webp`)))
  ) { skip++; continue; }
  const fm = frontmatter(fs.readFileSync(path.join(CONTENT_DIR, file), "utf8"));
  const subject = `${fm.title ?? slug}. ${fm.excerpt ?? ""}`;
  process.stdout.write(`Generuji ${slug} … `);
  try {
    await generate(slug, subject);
    console.log("OK");
    ok++;
  } catch (e) {
    console.log(`CHYBA — ${e.message}`);
    fail++;
  }
}
console.log(`\nHotovo: ${ok} vygenerováno, ${skip} přeskočeno (existují), ${fail} selhalo.`);
