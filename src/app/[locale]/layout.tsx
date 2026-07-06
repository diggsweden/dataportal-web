import { headers } from "next/headers";
import { notFound } from "next/navigation";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";
import { getNavigationData } from "@/app/[locale]/data";
import { AppRouterChrome } from "@/components/layout/app-router-chrome";
import { buildInlineEnvScriptBody } from "@/env/browser-env";
import type { NavigationDataFragment } from "@/graphql/gql/graphql";
import { loadResourceLabels } from "@/i18n/load-messages";
import { isAppLocale, routing } from "@/i18n/routing";
import { AppRouterProviders } from "@/providers/app-router-providers";
import { generateRandomKey } from "@/utilities/key-generator";

/**
 * Pre-render every locale at build time. Without this, every page under
 * `app/[locale]/...` would be dynamic.
 */
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

/**
 * Server-rendered locale shell. Owns:
 *  - `<html lang>` / `<body>`.
 *  - Inline `window.__ENV` bootstrap so client components reading
 *    `react-env` get runtime config before they hydrate. Inlined in
 *    `<head>` to avoid a critical-path fetch to `/__ENV.js`.
 *  - The `<head>` preconnect tags.
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
    // `"all"` fetches every locale's navigation under a single cache key
    // shared across locales; we filter to the current locale below.
    getNavigationData("all"),
  ]);

  const navigationData: NavigationDataFragment | null =
    navResp.items?.find((n: NavigationDataFragment) => n.locale === locale) ??
    null;

  // `proxy.ts` sets `x-nonce` per request. Fall back to a freshly minted
  // nonce so a request that bypassed middleware (e.g. a static prerender
  // pass) still has a stable value to pass through.
  const nonce = requestHeaders.get("x-nonce") ?? generateRandomKey(32);

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
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
        <script
          nonce={nonce}
          suppressHydrationWarning
          dangerouslySetInnerHTML={{ __html: buildInlineEnvScriptBody() }}
        />
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
