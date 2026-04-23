import { type NextRequest, NextResponse } from "next/server";

import generateCSP from "./utilities/generate-csp";
import { generateRandomKey } from "./utilities/key-generator";

/**
 * Next 16 middleware (renamed `proxy.ts` per the Next 16 file convention).
 *
 * Responsibilities:
 *   - Generate a per-request CSP nonce (`x-nonce` request + response header)
 *     so RSCs can read it via `headers()` and stamp it onto `<Script>` tags.
 *   - Emit the `Content-Security-Policy` response header containing that
 *     nonce. With the header in place, Next.js auto-applies the nonce to
 *     framework scripts, route bundles, and `<Script nonce={nonce}>`
 *     components — avoiding the hydration mismatch a raw `<script nonce>`
 *     hits once the browser strips the attribute per CSP3 spec
 *     (https://www.w3.org/TR/CSP3/#is-element-nonceable).
 *
 * Locale routing is intentionally absent:
 *   - The Pages Router `i18n` block was removed from `next.config.mjs` as
 *     part of Option B of the migration (see
 *     `docs/next15-app-router-migration.md`), so Pages Router serves only
 *     Swedish until each route family moves under `app/[locale]/`.
 *   - `next-intl`'s middleware (`createMiddleware(routing)`) gets layered
 *     back in here during Phase 4 as soon as the first App Router route
 *     lands. Its output composes with the CSP logic without changes.
 */
export function proxy(request: NextRequest) {
  const nonce = generateRandomKey(32);

  // `@beam-australia/react-env` pulls runtime config out of `window.__beam_env`
  // in the browser and out of `process.env.REACT_APP_*` on the server. We're
  // on the server here, so `process.env` reads are safe and edge-compatible.
  // Read explicitly (rather than via `reactEnv()`) to keep the middleware
  // bundle free of the `react-env` runtime.
  const csp = generateCSP({
    nonce,
    imageDomain: process.env.REACT_APP_IMAGE_DOMAIN ?? process.env.IMAGE_DOMAIN,
    apolloUrl: process.env.REACT_APP_APOLLO_URL ?? process.env.APOLLO_URL,
  });

  // Mutating the incoming request headers makes them visible to downstream
  // RSCs via `headers()` once any segment is rendered from `app/`.
  request.headers.set("x-nonce", nonce);

  const response = NextResponse.next({
    request: { headers: request.headers },
  });
  response.headers.set("x-nonce", nonce);
  response.headers.set("Content-Security-Policy", csp);
  return response;
}

export const config = {
  // Skip Next internals, static assets, and route handlers (`/api`). Also
  // ignore `next/link` prefetches and RSC prefetch fetches — those responses
  // don't render a fresh HTML document and don't need their own CSP. The
  // matcher uses Next's `missing` filter (same pattern as the official
  // CSP guide) to drop those.
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
