import { NextRequest, NextResponse } from "next/server";

// i18n směrování:
// - /en/*  → locale en (viditelný prefix)
// - /*     → interní rewrite na /cs/* (URL bez prefixu zůstává kanonická pro češtinu)
// - /cs/*  → redirect na /* (kanonizace)
// - na "/" bez cookie: Accept-Language en → redirect /en (jednorázová auto-detekce)
// - budoucí anglická doména: host === EN_DOMAIN → vše jako en bez prefixu

const EN_DOMAIN = process.env.EN_DOMAIN; // např. "productive.tips" — nastaví se po registraci

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") ?? "";

  // Anglická doména: celá běží v en bez /en prefixu
  if (EN_DOMAIN && host === EN_DOMAIN) {
    if (pathname.startsWith("/en")) {
      const url = req.nextUrl.clone();
      url.pathname = pathname.replace(/^\/en/, "") || "/";
      return NextResponse.redirect(url);
    }
    const url = req.nextUrl.clone();
    url.pathname = `/en${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // /cs/* → kanonicky bez prefixu
  if (pathname === "/cs" || pathname.startsWith("/cs/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/cs/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  // /en/* projde přímo (matchuje [locale]=en)
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    const res = NextResponse.next();
    res.cookies.set("NEXT_LOCALE", "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
    return res;
  }

  // Auto-detekce jen na homepage, jen bez uložené volby
  if (pathname === "/") {
    const saved = req.cookies.get("NEXT_LOCALE")?.value;
    if (!saved) {
      const accept = req.headers.get("accept-language") ?? "";
      const prefersEn = /^en\b/.test(accept.split(",")[0]?.trim() ?? "");
      if (prefersEn) {
        const url = req.nextUrl.clone();
        url.pathname = "/en";
        const res = NextResponse.redirect(url);
        res.cookies.set("NEXT_LOCALE", "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
        return res;
      }
    }
  }

  // Čeština: interní rewrite na /cs/*
  const url = req.nextUrl.clone();
  url.pathname = `/cs${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.rewrite(url);
  if (!req.cookies.get("NEXT_LOCALE")) {
    res.cookies.set("NEXT_LOCALE", "cs", { path: "/", maxAge: 60 * 60 * 24 * 365 });
  } else if (req.cookies.get("NEXT_LOCALE")?.value !== "cs") {
    // uživatel přišel na českou URL explicitně → respektovat a přepsat volbu
    res.cookies.set("NEXT_LOCALE", "cs", { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return res;
}

export const config = {
  // vše kromě statických assetů, API, metadata souborů
  matcher: ["/((?!api|_next|img|ebook|favicon|icon|sitemap.xml|robots.txt|rss.xml|llms.txt|.*\\..*).*)"],
};
