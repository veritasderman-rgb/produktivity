---
date: "2026-11-26"
title: "Týdenní destilace konverzací: hledání v minulých chatech má Claude jen na placených plánech"
titleEn: "Weekly conversation distillation: Claude searches past chats on paid plans only"
zdroj: "https://support.claude.com/en/articles/11817273-use-claude-s-chat-search-and-memory-to-build-on-previous-context"
slugs:
  - "druhy-mozek-ktery-odpovida"
akce: "aktualizovano"
---

Prompt na týdenní destilaci v návodu na druhý mozek chce po modelu, aby prošel konverzace z uplynulého týdne, a návod neříkal, co k tomu potřebuje. Podle nápovědy Anthropicu je vyhledávání v minulých chatech v Claude jen na placených plánech a konverzace uložené v projektu se prohledávají jen zevnitř toho projektu. V CS i EN verzi jsme to doplnili jedním odstavcem pod prompt: destilaci pouštějte tam, kde konverzace vznikly, a bez téhle funkce vložte podstatné konverzace do zadání ručně.

---EN---

The weekly distillation prompt in the second brain guide asks the model to go through the past week's conversations, and the guide did not say what that takes. According to Anthropic's help centre, searching past chats in Claude is available on paid plans only, and conversations kept in a project are searched only from inside that project. We added one paragraph under the prompt in both CS and EN: run the distillation where the conversations happened, and without that feature paste the conversations that matter into the prompt by hand.
