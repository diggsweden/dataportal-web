import { type NextRequest, NextResponse } from "next/server";

import { generateRandomKey } from "./utilities/key-generator";

/**
 * Next 16 middleware (renamed `proxy.ts` per the Next 16 file convention).
 *
 * This file's only job right now is to stamp a per-request CSP nonce onto
 * both the incoming request (so downstream RSCs can read it via `headers()`)
 * and the outgoing response. Locale routing is intentionally absent:
 *   - The native Pages Router `i18n` block was removed from
 *     `next.config.mjs` as part of Option B of the migration
 *     (see `docs/next15-app-router-migration.md`), so Pages Router serves
 *     only Swedish until each route family moves under `app/[locale]/`.
 *   - `next-intl`'s middleware (`createMiddleware(routing)`) gets layered
 *     back in here during Phase 4 as soon as the first App Router route
 *     lands. Its output composes with the nonce logic without changes.
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
