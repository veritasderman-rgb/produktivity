import { isValidElement, type ReactNode } from "react";

/**
 * Obsah článku (TOC): vytažení H2 nadpisů z MDX těla a slugify, který dá
 * stejné id jako override `h2` v mdxComponents. Obojí musí zůstat v sync —
 * proto společný `slugify` a `flatText`.
 */

export type TocHeading = { id: string; text: string };

const FENCE_RE = /(```[\s\S]*?```)/g;

/** Bez diakritiky, kebab-case, jen [a-z0-9-]. */
export function slugify(text: string): string {
  const slug = text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return slug || "sekce";
}

/** Plochý text z React uzlů — children nadpisu můžou být `<strong>`, `<code>`… */
export function flatText(node: ReactNode): string {
  if (node === null || node === undefined || typeof node === "boolean") return "";
  if (typeof node === "string" || typeof node === "number") return String(node);
  if (Array.isArray(node)) return node.map(flatText).join("");
  if (isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    return flatText(props.children);
  }
  return "";
}

/** Odstranění markdown syntaxe, aby text odpovídal tomu, co vyrenderuje MDX. */
function stripMarkdown(text: string): string {
  return text
    .replace(/!\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/__([^_]+)__/g, "$1")
    .replace(/\*([^*]+)\*/g, "$1")
    .trim();
}

/**
 * Krok číslovaného postupu: H2 začínající „Fáze N" / „Krok N" / „Část N" /
 * „Step N" / „Phase N" / „Part N". Jen tyhle nadpisy se smí stát HowToStep —
 * když článek žádné nemá, HowTo JSON-LD se negeneruje (nic se nevymýšlí).
 */
const HOWTO_STEP_RE = /^(?:Fáze|Krok|Část|Step|Phase|Part)\s+\d+/i;

/** Kroky pro HowTo JSON-LD — podmnožina H2 nadpisů s číslovaným postupem. */
export function extractHowToSteps(body: string): TocHeading[] {
  return extractHeadings(body).filter((h) => HOWTO_STEP_RE.test(h.text));
}

/** H2 nadpisy mimo kódové bloky, v pořadí výskytu. */
export function extractHeadings(body: string): TocHeading[] {
  const headings: TocHeading[] = [];
  for (const part of body.split(FENCE_RE)) {
    if (part.startsWith("```")) continue;
    for (const line of part.split("\n")) {
      const match = /^##[ \t]+(.+?)[ \t]*#*[ \t]*$/.exec(line);
      if (!match) continue;
      const text = stripMarkdown(match[1]);
      if (!text) continue;
      headings.push({ id: slugify(text), text });
    }
  }
  return headings;
}
