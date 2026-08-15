import { notFound } from "next/navigation";

/* Catch-all: adresy, které nesedí žádné routě, by jinak padaly do výchozí
   404 Nextu MIMO layout webu. Tahle routa je pošle do [locale]/not-found.tsx
   — zábavné 404 s hlavičkou, patičkou a klávesami. */
export default function CatchAll(): never {
  notFound();
}
