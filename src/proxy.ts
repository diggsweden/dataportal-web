import { NextRequest } from "next/server";
import createIntlMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";
import generateCSP from "./utilities/generate-csp";
import { generateRandomKey } from "./utilities/key-generator";

const handleI18nRouting = createIntlMiddleware(routing);

/**
 * Next 16 middleware (renamed `proxy.ts` per the Next 16 file convention).
 *
 * Responsibilities:
 *   - `next-intl/middleware` for locale routing (`localePrefix: "as-needed"`).
 *   - Generate a per-request CSP nonce (`x-nonce` request + response header)
 *     so RSCs can read it via `headers()` and stamp it onto `<Script>` tags.
 *   - Emit the `Content-Security-Policy` response header containing that
 *     nonce.
 */
export function proxy(request: NextRequest) {
  const nonce = generateRandomKey(32);

  const csp = generateCSP({
    nonce,
    imageDomain: process.env.REACT_APP_IMAGE_DOMAIN ?? process.env.IMAGE_DOMAIN,
    apolloUrl: process.env.REACT_APP_APOLLO_URL ?? process.env.APOLLO_URL,
  });

  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-nonce", nonce);

  const intlRequest = new NextRequest(request.url, {
    headers: requestHeaders,
    method: request.method,
  });

  const response = handleI18nRouting(intlRequest);

  response.headers.set("x-nonce", nonce);
  response.headers.set("Content-Security-Policy", csp);

  return response;
}

export const config = {
  matcher: [
    {
      source:
        "/((?!api|_next/static|_next/image|favicon.ico|__ENV.js|manifest.json|.*\\.(?:jpg|jpeg|gif|png|svg|woff|woff2)).*)",
      missing: [
        { type: "header", key: "next-router-prefetch" },
        { type: "header", key: "purpose", value: "prefetch" },
      ],
    },
    "/",
  ],
};
