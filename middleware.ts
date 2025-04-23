import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import i18n from "./i18n";

function getLocale(request: NextRequest): string {
  const acceptLanguage = request.headers.get("accept-language");
  if (acceptLanguage) {
    const [browserLocale] = acceptLanguage.split(",");
    if (i18n.locales.includes(browserLocale as string)) {
      return browserLocale;
    }
  }
  return i18n.defaultLocale;
}

export function middleware(request: NextRequest) {
  // request.nextUrl.pathname strips the locale,
  // Use the request.url string to extract the
  // pathname which includes the locale prefix
  const pathname = new URL(request.url).pathname;

  // Check if the pathname already has a locale
  const pathnameHasLocale = i18n.locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`,
  );

  if (pathnameHasLocale) {
    // If it's the default locale, redirect to remove it from URL
    if (pathname.startsWith(`/${i18n.defaultLocale}/`)) {
      const newPathname = pathname.replace(`/${i18n.defaultLocale}`, "") || "/";
      const newUrl = new URL(newPathname, request.url);
      newUrl.search = request.nextUrl.search;
      return NextResponse.redirect(newUrl);
    }
    return NextResponse.next();
  }

  const locale = getLocale(request);

  // Only add locale to URL if it's not the default locale
  if (locale !== i18n.defaultLocale) {
    const newUrl = new URL(`/${locale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  // For default locale, just continue without modification
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|__ENV.js|manifest.json|.*\\.(?:jpg|jpeg|gif|png|svg|woff|woff2)).*)",
    "/",
  ],
};
