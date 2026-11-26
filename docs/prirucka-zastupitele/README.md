# Příručka pirátského zastupitele

Zdroj pro `public/zastupitele/` (pc.html, mobil.html, prirucka-zastupitele.pdf). Stránky jsou noindex (meta tag i hlavička X-Robots-Tag v `next.config.ts`) a nejsou v menu ani sitemapě.

- `src/*.md` — kapitoly psané přímo pro příručku,
- články z `content/` se načítají podle seznamu `PARTS` v `build.py`,
- `python3 build.py` vytvoří `out/pc.html`, `out/mobil.html` a `out/print.html`, `node pdf.js` z tiskové verze PDF.

Cesty v `build.py` a `pdf.js` jsou absolutní z prostředí, kde příručka vznikla; před dalším během je upravte.
