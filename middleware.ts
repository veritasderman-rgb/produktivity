import { NextRequest, NextResponse } from "next/server";

// i18n směrování přes dvě domény:
// - produktivni.cz        → čeština bez prefixu (interní rewrite na /cs/*)
// - productive.tips       → angličtina bez prefixu (interní rewrite na /en/*)
// - /cs/* na EN doméně    → redirect na produktivni.cz/*
// - /en/* na CS doméně    → redirect na productive.tips/*
// - jiné hosty (preview, localhost): /en/* s prefixem, čeština bez prefixu
// - na "/" bez cookie: Accept-Language en → redirect na EN mutaci (jednorázově)

const EN_DOMAIN = process.env.EN_DOMAIN ?? "productive.tips";
const CS_DOMAIN = process.env.CS_DOMAIN ?? "www.produktivni.cz";

const isEnHost = (host: string) => host === EN_DOMAIN || host === `www.${EN_DOMAIN}`;
const isCsHost = (host: string) => host === CS_DOMAIN || `www.${host}` === CS_DOMAIN;

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const host = req.headers.get("host") ?? "";

  // Anglická doména: celá běží v en bez /en prefixu
  if (isEnHost(host)) {
    if (pathname === "/cs" || pathname.startsWith("/cs/")) {
      const bare = pathname.replace(/^\/cs/, "") || "/";
      return NextResponse.redirect(`https://${CS_DOMAIN}${bare === "/" ? "" : bare}` || `https://${CS_DOMAIN}`, 308);
    }
    if (pathname === "/en" || pathname.startsWith("/en/")) {
      const url = req.nextUrl.clone();
      url.pathname = pathname.replace(/^\/en/, "") || "/";
      return NextResponse.redirect(url, 308);
    }
    const url = req.nextUrl.clone();
    url.pathname = `/en${pathname === "/" ? "" : pathname}`;
    return NextResponse.rewrite(url);
  }

  // /cs/* → kanonicky bez prefixu (čeština je default)
  if (pathname === "/cs" || pathname.startsWith("/cs/")) {
    const url = req.nextUrl.clone();
    url.pathname = pathname.replace(/^\/cs/, "") || "/";
    return NextResponse.redirect(url, 308);
  }

  // /en/* na produkční české doméně → kanonicky na anglickou doménu
  if (pathname === "/en" || pathname.startsWith("/en/")) {
    if (isCsHost(host)) {
      const bare = pathname.replace(/^\/en/, "") || "/";
      return NextResponse.redirect(`https://${EN_DOMAIN}${bare === "/" ? "" : bare}`, 308);
    }
    // preview/localhost: /en/* projde přímo (matchuje [locale]=en)
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
        const res = isCsHost(host)
          ? NextResponse.redirect(`https://${EN_DOMAIN}`)
          : (() => { const url = req.nextUrl.clone(); url.pathname = "/en"; return NextResponse.redirect(url); })();
        res.cookies.set("NEXT_LOCALE", "en", { path: "/", maxAge: 60 * 60 * 24 * 365 });
        return res;
      }
    }
  }

  // Čeština: interní rewrite na /cs/*
  const url = req.nextUrl.clone();
  url.pathname = `/cs${pathname === "/" ? "" : pathname}`;
  const res = NextResponse.rewrite(url);
  if (req.cookies.get("NEXT_LOCALE")?.value !== "cs") {
    res.cookies.set("NEXT_LOCALE", "cs", { path: "/", maxAge: 60 * 60 * 24 * 365 });
  }
  return res;
}

export const config = {
  // vše kromě statických assetů, API, metadata souborů
  matcher: ["/((?!api|_next|img|ebook|favicon|icon|sitemap.xml|robots.txt|rss.xml|llms.txt|.*\\..*).*)"],
};
