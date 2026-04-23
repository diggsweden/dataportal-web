import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Script from "next/script";
import { getMessages, setRequestLocale } from "next-intl/server";
import type { ReactNode } from "react";

import { AppRouterProviders } from "@/components/providers";
import { isAppLocale, routing } from "@/i18n/routing";
import { generateRandomKey } from "@/utilities/key-generator";

import "@/styles/main.css";

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
 *    runtime config before they hydrate.
 *  - CSP nonce bridge from `proxy.ts` (`x-nonce` header) to client scripts.
 *  - The `<head>` link/preconnect tags previously in `pages/_document.tsx`.
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

  const [messages, requestHeaders] = await Promise.all([
    getMessages(),
    headers(),
  ]);

  // `proxy.ts` sets `x-nonce` per request. Fall back to a freshly minted
  // nonce so a request that bypassed middleware (e.g. a static prerender
  // pass) still ships with CSP coverage.
  const nonce = requestHeaders.get("x-nonce") ?? generateRandomKey(32);

  return (
    <html lang={locale} data-scroll-behavior="smooth">
      <head>
        <Script src="/__ENV.js" strategy="beforeInteractive" nonce={nonce} />
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
        <AppRouterProviders locale={locale} messages={messages} nonce={nonce}>
          {children}
        </AppRouterProviders>
      </body>
    </html>
  );
}
