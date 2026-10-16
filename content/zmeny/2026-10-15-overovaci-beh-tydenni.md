---
date: "2026-10-15"
title: "Ověřovací běh: Beeper s MCP a návrh od skici k CAD"
titleEn: "Verification run: Beeper with MCP and the sketch-to-CAD guide"
zdroj: "https://developers.beeper.com/desktop-api/mcp"
slugs:
  - "beeper-hub-zprav-s-ai"
  - "architekt-skica-do-pocitace-mcp"
akce: "overeno"
---

Týdenní ověřovací běh u dvou velkých návodů. U Beeperu sedí adresa lokálního MCP serveru (`localhost:23373/v0/mcp`), příkaz `claude mcp add`, cesta Settings → Integrations, nutnost běžící aplikace, ruční přístupový token i příkaz pro Notion MCP. U architektonického návodu sedí oficiální konektory SketchUp (Trimble, bezplatně do 30 uložených modelů) a Rhino/Grasshopper (McNeel, open source) i vektorizace v Inkscape (Cesta → Vektorizovat rastr). Beze změn jsme nechali a neověřili: přesný název seznamu „Approved connections" v Beeperu (oficiální dokumentace ho nezmiňuje), existenci oficiálního konektoru Blenderu (potvrzují jen sekundární zdroje) a nastavení exportu DXF v Inkscape.

---EN---

Weekly verification run over two large guides. In the Beeper guide, the local MCP server address (`localhost:23373/v0/mcp`), the `claude mcp add` command, the Settings → Integrations path, the requirement that the app is running, the manual access token and the Notion MCP command all hold up. In the architecture guide, the official SketchUp (Trimble, free up to 30 saved models) and Rhino/Grasshopper (McNeel, open source) connectors and Inkscape tracing (Path → Trace Bitmap) hold up. Left unchanged and unverified: the exact name of the "Approved connections" list in Beeper (not mentioned in the official docs), the existence of an official Blender connector (only secondary sources confirm it) and Inkscape's DXF export settings.
