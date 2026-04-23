import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";

import { routing } from "./i18n/routing";
import { generateRandomKey } from "./utilities/key-generator";

const handleI18n = createMiddleware(routing);

/**
 * Next 16 middleware (renamed `proxy.ts` per the Next 16 file convention).
 *
 * Two responsibilities:
 *  1. `next-intl` locale handling with `localePrefix: "as-needed"`: Swedish
 *     stays unprefixed (`/datasets`), English under `/en/...`. Replaces the
 *     hand-rolled redirect logic that used to live here.
 *  2. Per-request CSP nonce: stamps `x-nonce` on both the **request** (so
 *     server components in `app/[locale]/layout.tsx` can read it via
 *     `headers()`) and the **response** (for any downstream consumer). The
 *     `app/[locale]/layout.tsx` falls back to generating its own nonce if
 *     this header is missing, so a cold-cache request never ships without
 *     CSP coverage.
 */
export function proxy(request: NextRequest) {
  const nonce = generateRandomKey(32);

  // Mutating the incoming request headers makes them visible to downstream
  // RSCs via `headers()` whenever the eventual NextResponse is a rewrite or
  // pass-through (which is what `next-intl` returns for valid locales).
  request.headers.set("x-nonce", nonce);

  const response = handleI18n(request);
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
