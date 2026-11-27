@AGENTS.md

## Newsletter: vždy pevný termín

Každé číslo newsletteru Produktivní.cz odchází **ve čtvrtek v 8:00 českého
času** (`lib/newsletter-schedule.ts`). Když zakládáš kampaň přes Brevo MCP,
zjisti termín příkazem `node scripts/newsletter-slot.mjs`, kampaň založ jako
koncept a hned ji naplánuj `update_email_campaign` se `scheduledAt` na přesně
tuhle hodnotu. Nikdy neodesílej hned a nepoužívej `sendAtBestTime`. Celý
postup je v `docs/RUTINA.md`, oddíl 8e.
