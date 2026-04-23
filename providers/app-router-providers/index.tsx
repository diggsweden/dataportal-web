"use client";

import reactenv from "@beam-australia/react-env";
import type { AbstractIntlMessages, Locale } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import { type ReactNode, useEffect, useState } from "react";

import { type EnvSettings, SettingsUtil } from "@/env";
import { Settings_Sandbox } from "@/env/settings.sandbox";
import type { ResourceMap } from "@/i18n/load-messages";
import { ResourcesProvider } from "@/i18n/resources-provider";
import { MatomoProvider } from "@/lib/matomo";
import {
  type LayoutState,
  LayoutStateProvider,
} from "@/providers/layout-state-provider";
import { LocalStoreProvider } from "@/providers/local-store-provider";
import {
  defaultSettings,
  SettingsProvider,
} from "@/providers/settings-provider";

interface AppRouterProvidersProps {
  children: ReactNode;
  locale: Locale;
  messages: AbstractIntlMessages;
  /** URI → label map handed to `ResourcesProvider`. */
  resources: ResourceMap;
  /** CSP nonce stamped on the request by `proxy.ts`. */
  nonce: string;
  /** Optional initial breadcrumb / hero forwarded to `LayoutStateProvider`. */
  initialBreadcrumb?: LayoutState["breadcrumbState"];
  initialImageHero?: LayoutState["imageHero"];
}

/**
 * Reads the persisted cookie-banner choice once, before mount. SSR-safe:
 * returns `false` on the server (matches the Pages Router fallback in
 * `pages/_app.tsx`).
 */
function readInitialConsent(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("digg-store");
    if (!raw) return false;
    const parsed = JSON.parse(raw) as {
      cookieSettings?: { analytic?: { accepted?: boolean } };
    };
    return parsed.cookieSettings?.analytic?.accepted === true;
  } catch {
    return false;
  }
}

/**
 * App Router client boundary. Wraps the four state providers any
 * `app/[locale]/.../page.tsx` may consume:
 *
 *  - `NextIntlClientProvider`  — translations + formatters
 *  - `SettingsProvider`        — `EnvSettings`, breadcrumb setter, Matomo site id
 *  - `LocalStoreProvider`      — cookie-banner store backed by `localStorage`
 *  - `MatomoProvider`          — script loading + page-view tracking
 *  - `LayoutStateProvider`     — sidebar/settings dialog/hero/breadcrumb state
 *
 * `EnvSettings` is created client-side because it depends on
 * `react-env` which reads `window.__beam_env` populated by `/__ENV.js`. The
 * server layout injects that script with the CSP nonce *before* this
 * provider hydrates, so the env is available on the first effect tick.
 */
export function AppRouterProviders({
  children,
  locale,
  messages,
  resources,
  nonce,
  initialBreadcrumb,
  initialImageHero,
}: AppRouterProvidersProps) {
  const [env, setEnv] = useState<EnvSettings | null>(null);

  useEffect(() => {
    const isSandbox =
      typeof window !== "undefined" && window.location.host.includes("sandbox");
    setEnv(isSandbox ? new Settings_Sandbox() : SettingsUtil.create());
  }, []);

  // Until env hydrates, render with default (dev) settings so SSR markup
  // matches and downstream code never sees `env === null`.
  const resolvedEnv = env ?? SettingsUtil.getDefault();

  const matomoDisabled =
    process.env.NEXT_PUBLIC_DISABLE_MATOMO === "1" ||
    resolvedEnv instanceof Settings_Sandbox;

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={messages}
      timeZone="Europe/Stockholm"
    >
      <ResourcesProvider resources={resources}>
        <SettingsProvider
          value={{
            ...defaultSettings,
            env: resolvedEnv,
            matomoSiteId: reactenv("MATOMO_SITE_ID"),
          }}
        >
          <LocalStoreProvider>
            <LayoutStateProvider
              initialBreadcrumb={initialBreadcrumb}
              initialImageHero={initialImageHero}
            >
              <MatomoProvider
                disabled={matomoDisabled}
                initialConsent={readInitialConsent()}
                nonce={nonce}
              >
                {children}
              </MatomoProvider>
            </LayoutStateProvider>
          </LocalStoreProvider>
        </SettingsProvider>
      </ResourcesProvider>
    </NextIntlClientProvider>
  );
}
