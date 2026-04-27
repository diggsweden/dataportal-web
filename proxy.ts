import { type NextRequest, NextResponse } from "next/server";

import { routing } from "./i18n/routing";
import generateCSP from "./utilities/generate-csp";
import { generateRandomKey } from "./utilities/key-generator";

/**
 * Route prefixes that are still served by the Pages Router (`pages/`).
 * Any request whose first path segment matches one of these is passed
 * through to Next without a locale rewrite so the Pages Router picks
 * it up at its un-prefixed URL.
 *
 * Remove entries from this set as each Entryscape family is ported to
 * `app/[locale]/` during Phase 4.
 */
const PAGES_ROUTER_PREFIXES = new Set([
  "fortroendemodellen",
]);

/**
 * Next 16 middleware (renamed `proxy.ts` per the Next 16 file convention).
 *
 * Responsibilities:
 *   - Generate a per-request CSP nonce (`x-nonce` request + response header)
 *     so RSCs can read it via `headers()` and stamp it onto `<Script>` tags.
 *   - Emit the `Content-Security-Policy` response header containing that
 *     nonce.
 *   - Rewrite bare (un-prefixed) Swedish paths to `/${defaultLocale}${path}`
 *     so the App Router serves them from `app/[locale]/...`. Paths that
 *     start with a known locale prefix pass through as-is. Paths whose
 *     first segment matches a Pages Router route (`PAGES_ROUTER_PREFIXES`)
 *     are left alone so `pages/` can still serve them.
 */
export function proxy(request: NextRequest) {
  const nonce = generateRandomKey(32);

  const csp = generateCSP({
    nonce,
    imageDomain: process.env.REACT_APP_IMAGE_DOMAIN ?? process.env.IMAGE_DOMAIN,
    apolloUrl: process.env.REACT_APP_APOLLO_URL ?? process.env.APOLLO_URL,
  });

  request.headers.set("x-nonce", nonce);

  const { pathname } = request.nextUrl;
  const firstSegment = pathname.split("/").filter(Boolean)[0] ?? "";

  // Path already starts with a locale prefix (e.g. `/en/nyheter`) — the
  // App Router resolves it directly via `app/[locale]/`.
  const hasLocalePrefix = (routing.locales as readonly string[]).includes(
    firstSegment,
  );

  // Path belongs to a route family still on the Pages Router.
  const isPagesRoute = PAGES_ROUTER_PREFIXES.has(firstSegment);

  const needsRewrite = !hasLocalePrefix && !isPagesRoute;

  const response = needsRewrite
    ? (() => {
        const url = request.nextUrl.clone();
        url.pathname = `/${routing.defaultLocale}${pathname}`;
        return NextResponse.rewrite(url, {
          request: { headers: request.headers },
        });
      })()
    : NextResponse.next({ request: { headers: request.headers } });

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
