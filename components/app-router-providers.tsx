"use client";

import reactenv from "@beam-australia/react-env";
import type { AbstractIntlMessages } from "next-intl";
import { NextIntlClientProvider } from "next-intl";
import type { FC, ReactNode } from "react";

import { Settings_Sandbox } from "@/env/settings.sandbox";
import { useClientEnvSettings } from "@/hooks/use-client-env-settings";
import { MatomoProvider } from "@/lib/matomo";
import { LayoutStateProvider } from "@/providers/layout-state-provider";
import { LocalStoreProvider } from "@/providers/local-store-provider";
import {
  defaultSettings,
  SettingsProvider,
} from "@/providers/settings-provider";
import { initBreadcrumb } from "@/utilities/layout-breadcrumb";
import { readDiggStoreAnalyticConsentAccepted } from "@/utilities/read-digg-store-analytic-consent";

/** App Router: same core providers as `pages/_app` + `next-intl`. */
export const AppRouterProviders: FC<{
  children: ReactNode;
  locale: string;
  messages: AbstractIntlMessages;
  cspNonce?: string | null;
}> = ({ children, locale, messages, cspNonce }) => {
  const env = useClientEnvSettings(cspNonce);

  if (!env) {
    return null;
  }

  const matomoDisabled =
    process.env.NEXT_PUBLIC_DISABLE_MATOMO === "1" ||
    env instanceof Settings_Sandbox;

  return (
    <LayoutStateProvider initialBreadcrumb={initBreadcrumb}>
      <SettingsProvider
        value={{
          ...defaultSettings,
          env,
          matomoSiteId: reactenv("MATOMO_SITE_ID"),
        }}
      >
        <LocalStoreProvider>
          <MatomoProvider
            disabled={matomoDisabled}
            initialConsent={readDiggStoreAnalyticConsentAccepted()}
            nonce={env.nonce}
          >
            <NextIntlClientProvider locale={locale} messages={messages}>
              {children}
            </NextIntlClientProvider>
          </MatomoProvider>
        </LocalStoreProvider>
      </SettingsProvider>
    </LayoutStateProvider>
  );
};
