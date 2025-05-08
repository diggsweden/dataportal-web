import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import i18n from "./i18n";

// function getLocale(request: NextRequest): string {
//   const acceptLanguage = request.headers.get("accept-language");
//   if (acceptLanguage) {
//     const [browserLocale] = acceptLanguage.split(",");
//     if (i18n.locales.includes(browserLocale as string)) {
//       return browserLocale;
//     }
//   }
//   return i18n.defaultLocale;
// }

export function middleware(request: NextRequest) {
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

  // Get the current locale from the referer header if available
  const referer = request.headers.get("referer");
  let currentLocale = i18n.defaultLocale;

  if (referer) {
    const refererUrl = new URL(referer);
    const refererPath = refererUrl.pathname;
    const localeFromReferer = i18n.locales.find(
      (locale) =>
        refererPath.startsWith(`/${locale}/`) || refererPath === `/${locale}`,
    );
    if (localeFromReferer) {
      currentLocale = localeFromReferer;
    }
  }

  // Only add locale to URL if it's not the default locale
  if (currentLocale !== i18n.defaultLocale) {
    const newUrl = new URL(`/${currentLocale}${pathname}`, request.url);
    newUrl.search = request.nextUrl.search;
    return NextResponse.redirect(newUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|__ENV.js|manifest.json|.*\\.(?:jpg|jpeg|gif|png|svg|woff|woff2)).*)",
    "/",
  ],
};
