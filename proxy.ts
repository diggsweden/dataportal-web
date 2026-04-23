import { type NextRequest, NextResponse } from "next/server";

import { generateRandomKey } from "./utilities/key-generator";

/**
 * Next 16 middleware (renamed `proxy.ts` per the Next 16 file convention).
 *
 * Locale routing is handled by the native Pages Router `i18n` config in
 * `next.config.mjs`, so this file's sole job is to stamp a per-request
 * CSP nonce onto both the incoming request and the outgoing response.
 *
 * When the App Router port lands we'll layer `next-intl`'s middleware back
 * in for the routed segments; the nonce logic stays identical either way.
 */
export function proxy(request: NextRequest) {
  const nonce = generateRandomKey(32);

  // Mutating the incoming request headers makes them visible to downstream
  // RSCs via `headers()` once any segment is rendered from `app/`.
  request.headers.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  response.headers.set("x-nonce", nonce);
  return response;
}

export const config = {
  // Skip Next internals, static assets, and route handlers (`/api`).
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|__ENV.js|manifest.json|.*\\.(?:jpg|jpeg|gif|png|svg|woff|woff2)).*)",
    "/",
  ],
};
