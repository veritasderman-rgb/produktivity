---
date: "2026-10-08"
title: "Ověřovací běh: Anki a analýza dat nad DuckDB"
titleEn: "Verification run: Anki and data analysis with DuckDB"
slugs:
  - "anki-karticky-s-ai"
  - "analyza-dat-duckdb-skill"
akce: "overeno"
---

Týdenní ověřovací běh u dvou velkých návodů. U Anki sedí hlavičky importního souboru (`#separator`, `#deck`, oddělovač středník), požadavek na UTF-8, chování při opakovaném importu i to, že zakrývání obrázků je vestavěné. U DuckDB sedí příkazy, parametry `read_csv` a umístění skillů v Claude Code. Jeden nález (rozšíření pro Excel) jsme opravili samostatným záznamem. Nechali jsme beze změny a neověřili: čtení Parquetu a JSON, dostupnost zakrývání obrázků v mobilních aplikacích Anki a parametr `filename`, který je od DuckDB 1.3 jen starší alias (stále funguje).

---EN---

Weekly verification run over two large guides. In the Anki guide, the import file headers (`#separator`, `#deck`, semicolon separator), the UTF-8 requirement, re-import behaviour and built-in image occlusion all hold up. In the DuckDB guide, the commands, `read_csv` parameters and the skill locations in Claude Code hold up. One finding (the Excel extension) is fixed in a separate entry. Left unchanged and unverified: Parquet and JSON support, image occlusion availability in the Anki mobile apps, and the `filename` parameter, which since DuckDB 1.3 is only a legacy alias (it still works).
