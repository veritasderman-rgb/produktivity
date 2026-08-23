import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { cachedList } from "@/lib/content-cache";

/**
 * Rubrika „Co se změnilo" — changelog dopadů, ne novinek. Každý záznam říká:
 * co se změnilo ve světě AI nástrojů → kterých návodů se to týká → co jsme
 * s tím udělali. Formát souborů popisuje content/zmeny/README.md.
 */

export type ChangeAction = "overeno" | "aktualizovano" | "novy-navod";

export type ChangeItem = {
  /** Slug záznamu = název souboru bez přípony (např. `2026-08-15-udio-uzavrena-platforma`). */
  slug: string;
  /** Datum záznamu (YYYY-MM-DD). */
  date: string;
  /** Titulek česky. */
  title: string;
  /** Titulek anglicky. */
  titleEn: string;
  /** URL oficiálního zdroje (dokumentace, ceník, repozitář). Nepovinné. */
  zdroj?: string;
  /** Slugy dotčených tipů z content/tipy/. */
  slugs: string[];
  /** Co jsme se změnou udělali. */
  akce: ChangeAction;
  /** Tělo česky (2–5 vět, část před oddělovačem ---EN---). */
  body: string;
  /** Tělo anglicky (část za oddělovačem ---EN---). */
  bodyEn: string;
};

const ACTIONS: ChangeAction[] = ["overeno", "aktualizovano", "novy-navod"];

/** Oddělovač české a anglické verze těla záznamu. */
const EN_SEPARATOR = /^---EN---$/m;

function changesDir() {
  return path.join(process.cwd(), "content", "zmeny");
}

function tipExists(slug: string): boolean {
  return fs.existsSync(path.join(process.cwd(), "content", "tipy", `${slug}.mdx`));
}

function loadAllChanges(): ChangeItem[] {
  const dir = changesDir();
  if (!fs.existsSync(dir)) return [];
  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".md") && f.toLowerCase() !== "readme.md");
  const items = files.map((file) => {
    const slug = file.replace(/\.md$/, "");
    const raw = fs.readFileSync(path.join(dir, file), "utf8");
    const { data, content } = matter(raw);

    const slugs = ((data.slugs ?? []) as string[]).filter((s) => {
      if (tipExists(s)) return true;
      console.warn(`[changes] ${file}: slug "${s}" neexistuje v content/tipy/ — odkaz se vynechá.`);
      return false;
    });

    const akce = data.akce as ChangeAction;
    if (!ACTIONS.includes(akce)) {
      console.warn(`[changes] ${file}: neznámá akce "${data.akce}" — očekávám ${ACTIONS.join(" | ")}.`);
    }

    const [cs = "", en = ""] = content.split(EN_SEPARATOR);
    return {
      slug,
      date: String(data.date),
      title: data.title as string,
      titleEn: (data.titleEn ?? data.title) as string,
      zdroj: typeof data.zdroj === "string" ? data.zdroj : undefined,
      slugs,
      akce,
      body: cs.trim(),
      bodyEn: en.trim(),
    };
  });
  return items.sort((a, b) => (a.date < b.date ? 1 : -1));
}

/** Čtení z disku je cachované — viz lib/content-cache.ts. */
export const getAllChanges: () => ChangeItem[] = cachedList(loadAllChanges);

/** Záznamy changelogu, které se týkají daného tipu — pro odkaz „Historie změn" na detailu tipu. */
export function changesForSlug(slug: string): ChangeItem[] {
  return getAllChanges().filter((c) => c.slugs.includes(slug));
}
