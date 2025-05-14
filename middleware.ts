import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import i18n from "./i18n";

/**
 * Determines the locale for the current request
 * Since localeDetection is false in i18n.js, we only use the locale from the URL
 * or fall back to the default locale (sv)
 */
function getLocale(request: NextRequest): string {
  // First check if the URL already has a locale
  const pathname = request.nextUrl.pathname;
  const pathnameLocale = i18n.locales.find(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );
  if (pathnameLocale) {
    return pathnameLocale;
  }

  // Since localeDetection is false, we always return defaultLocale
  return i18n.defaultLocale;
}

/**
 * Middleware for handling locale-based routing
 *
 * Rules:
 * 1. If URL contains default locale (sv), remove it
 * 2. If URL has no locale and it's not default locale, add it
 * 3. If URL already has a non-default locale, leave it as is
 */
export function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Special handling for root path
  if (pathname === "/") {
    const locale = getLocale(request);
    if (locale !== i18n.defaultLocale) {
      return NextResponse.redirect(new URL(`/${locale}`, request.url));
    }
    return NextResponse.next();
  }

  // Check if the pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    const currentLocale = i18n.locales.find(
      (locale) =>
        pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
    );

    // If the URL contains the default locale (sv), remove it
    if (currentLocale === i18n.defaultLocale) {
      const newPathname = pathname.replace(`/${i18n.defaultLocale}`, "") || "/";
      const newUrl = new URL(newPathname, request.url);
      newUrl.search = request.nextUrl.search;
      return NextResponse.redirect(newUrl);
    }
    // If the URL has a non-default locale, leave it as is
    return NextResponse.next();
  }

  // Since localeDetection is false, we don't redirect based on browser locale
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|__ENV.js|manifest.json|.*\\.(?:jpg|jpeg|gif|png|svg|woff|woff2)).*)",
    "/",
  ],
};
