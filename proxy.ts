import { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";
import { generateRandomKey } from "./utilities/key-generator";

const handleI18n = createMiddleware(routing);

/**
 * Next 16 entry: locale + CSP nonce for downstream server code (`headers()`).
 * `next-intl` handles `localePrefix: "as-needed"` (unprefixed `sv`, `/en/...`).
 */
export function proxy(request: NextRequest) {
  const nonce = generateRandomKey(256);
  const headers = new Headers(request.headers);
  headers.set("x-nonce", nonce);

  const requestWithNonce = new NextRequest(request.url, {
    headers,
  });

  return handleI18n(requestWithNonce);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|__ENV.js|manifest.json|.*\\.(?:jpg|jpeg|gif|png|svg|woff|woff2)).*)",
    "/",
  ],
};
