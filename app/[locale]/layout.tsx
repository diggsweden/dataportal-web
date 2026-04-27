import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { AppRouterChrome } from "@/components/layout/app-router-chrome";
import type { NavigationDataFragment } from "@/graphql/__generated__/operations";
import { loadResourceLabels } from "@/i18n/load-messages";
import { isAppLocale, routing } from "@/i18n/routing";
import { AppRouterProviders } from "@/providers/app-router-providers";
import { generateRandomKey } from "@/utilities/key-generator";
import { getNavigationData } from "@/utilities/query-helpers";

/**
 * Pre-render every locale at build time. Without this, every page under
 * `app/[locale]/...` would be dynamic.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Server-rendered locale shell. Owns:
 *  - `<html lang>` / `<body>` (pulled out of `pages/_document.tsx` once
 *    every route lives under `app/`).
 *  - `/__ENV.js` injection so client components reading `react-env` get
 *    runtime config before they hydrate. Rendered as a raw `<script>`
 *    rather than `next/script` — see the inline comment on the tag and
 *    https://github.com/vercel/next.js/pull/86330 for the reason.
 *  - The `<head>` link/preconnect tags previously in `pages/_document.tsx`.
 *  - CSP nonce bridge from `proxy.ts` (`x-nonce` header) to client scripts.
 *    `proxy.ts` also emits the `Content-Security-Policy` response header,
 *    which activates Next's auto-nonce pipeline for framework scripts and
 *    page bundles (those render outside React hydration and therefore
 *    dodge the CSP-spec DOM-strip mismatch that plagues React-rendered
 *    `<script nonce>` elements).
 *
 * Each `app/[locale]/.../page.tsx` rendered through this layout is
 * pre-rendered per locale via `generateStaticParams`.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isAppLocale(locale)) {
    notFound();
  }

  setRequestLocale(locale);

  const [messages, resources, requestHeaders, navResp] = await Promise.all([
    getMessages(),
    loadResourceLabels(locale),
    headers(),
    // `"all"` mirrors the Pages Router chrome — one cache key shared across
    // locales. We filter to the current locale client-side-of-Graphql below.
    getNavigationData("all"),
  ]);

  const navigationData: NavigationDataFragment | null =
    navResp.items?.find(
      (n: NavigationDataFragment) => n.locale === locale,
    ) ?? null;

  // `proxy.ts` sets `x-nonce` per request. Fall back to a freshly minted
  // nonce so a request that bypassed middleware (e.g. a static prerender
  // pass) still has a stable value to pass through.
  const nonce = requestHeaders.get("x-nonce") ?? generateRandomKey(32);

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        {/* Raw <script> instead of `next/script`, per
            https://github.com/vercel/next.js/pull/86330 (fix for
            https://github.com/vercel/next.js/issues/77952):
            `<Script nonce={…}>` in App Router currently renders an
            internal RSC-state sidecar (`self.__next_f.push(...)`) whose
            nonce attribute hydrates empty on the client because Next's
            `HeadManagerContext` carries the nonce only during SSR.
            `<script src>` avoids generating that sidecar entirely.

            `suppressHydrationWarning`: browsers wipe `nonce` from the DOM
            after the script is processed (CSP3 spec,
            https://www.w3.org/TR/CSP3/#is-element-nonceable), so React's
            reconciler always sees `nonce=""` on the client for this one
            element. This is the React-docs-sanctioned escape hatch for
            deliberate server/client attribute differences on a specific
            node. Framework/page bundles don't need this — Next applies
            their nonces via its CSP pipeline, outside React hydration. */}
        <script
          suppressHydrationWarning
          nonce={nonce}
          type="text/javascript"
          src="/__ENV.js"
        />
        <link
          rel="stylesheet"
          href="https://cdn.screen9.com/players/amber-player.css"
        />
        <link
          rel="preconnect"
          href="https://editera.dataportal.se"
          crossOrigin="anonymous"
        />
        <link
          rel="preconnect"
          href="https://admin.dataportal.se"
          crossOrigin="anonymous"
        />
        <meta name="theme-color" content="#FBF2F0" />
      </head>
      <body className="font-ubuntu text-md text-textPrimary">
        <AppRouterProviders
          locale={locale}
          messages={messages}
          resources={resources}
          nonce={nonce}
        >
          <AppRouterChrome navigationData={navigationData}>
            {children}
          </AppRouterChrome>
        </AppRouterProviders>
      </body>
    </html>
  );
}
