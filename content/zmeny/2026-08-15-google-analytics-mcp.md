---
date: "2026-08-15"
title: "Google Analytics má oficiální MCP server — experimentální, lokální, jen pro čtení"
titleEn: "Google Analytics has an official MCP server — experimental, local, read-only"
zdroj: "https://github.com/googleanalytics/google-analytics-mcp"
slugs:
  - "mcp-reklama-analyza"
akce: "overeno"
---

Oficiální MCP server pro Google Analytics existuje a vydává ho přímo tým Google Analytics: repozitář googleanalytics/google-analytics-mcp, open source pod licencí Apache 2.0. Tři vlastnosti je potřeba znát: je označený jako experimentální (nemá na něm viset nic, co musí fungovat), běží lokálně u vás a data GA4 jen čte přes Admin a Data API — nic nepřenastaví ani nesmaže. Návod na reklamu a analýzu přes MCP popisuje všechny tři jako omezení i přednost zároveň; ověřeno proti repozitáři a dokumentaci.

---EN---

An official MCP server for Google Analytics exists and is published by the Google Analytics team itself: the googleanalytics/google-analytics-mcp repository, open source under the Apache 2.0 license. Three properties matter: it is labeled experimental (nothing mission-critical should depend on it), it runs locally on your machine, and it only reads GA4 data through the Admin and Data APIs — it cannot reconfigure or delete anything. The ads-and-analytics-over-MCP guide describes all three as both a limitation and a strength; verified against the repository and documentation.
