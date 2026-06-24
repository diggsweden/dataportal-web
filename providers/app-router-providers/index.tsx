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
  useLayoutState,
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
 * Injects `setBreadcrumb` (owned by `LayoutStateProvider`) into
 * `SettingsProvider.value`. Mirrors the bridge pattern in `pages/_app.tsx`
 * so ported pages can keep calling `useContext(SettingsContext).setBreadcrumb?.(...)`
 * unchanged. Required because `SettingsProvider` is a pure value wrapper —
 * it doesn't know about layout state on its own.
 */
function SettingsLayoutBridge({
  env,
  matomoSiteId,
  children,
}: {
  env: EnvSettings;
  matomoSiteId: string;
  children: ReactNode;
}) {
  const { setBreadcrumb } = useLayoutState();
  return (
    <SettingsProvider
      value={{
        ...defaultSettings,
        env,
        setBreadcrumb,
        matomoSiteId,
      }}
    >
      {children}
    </SettingsProvider>
  );
}

/**
 * App Router client boundary. Composes every provider any
 * `app/[locale]/.../page.tsx` may consume. Order matters:
 *
 *  - `NextIntlClientProvider`   translations + formatters
 *  - `ResourcesProvider`        URI-keyed SKOS labels (out-of-band from
 *                               next-intl's validator)
 *  - `LayoutStateProvider`      sidebar / settings dialog / hero / breadcrumb
 *                               state — sits *outside* `SettingsProvider`
 *                               so its setters can be bridged downward
 *  - `SettingsLayoutBridge`     injects `setBreadcrumb` from layout state
 *                               into `SettingsContext`
 *  - `LocalStoreProvider`       cookie-banner store backed by `localStorage`
 *  - `MatomoProvider`           script loading + page-view tracking
 *
 * `EnvSettings` is created client-side because it depends on `react-env`
 * which reads `window.__beam_env` populated by `/__ENV.js`. The server
 * layout injects that script with the CSP nonce *before* this provider
 * hydrates, so the env is available on the first effect tick.
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
        <LayoutStateProvider
          initialBreadcrumb={initialBreadcrumb}
          initialImageHero={initialImageHero}
        >
          <SettingsLayoutBridge
            env={resolvedEnv}
            matomoSiteId={reactenv("MATOMO_SITE_ID")}
          >
            <LocalStoreProvider>
              <MatomoProvider
                disabled={matomoDisabled}
                initialConsent={readInitialConsent()}
                nonce={nonce}
              >
                {children}
              </MatomoProvider>
            </LocalStoreProvider>
          </SettingsLayoutBridge>
        </LayoutStateProvider>
      </ResourcesProvider>
    </NextIntlClientProvider>
  );
}
