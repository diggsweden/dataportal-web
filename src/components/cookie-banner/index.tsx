"use client";

import { useLocale, useTranslations } from "next-intl";
import { type FC, useContext, useEffect, useState } from "react";
import { Button } from "@/components/button";
import { CookieOptions } from "@/components/cookie-banner/cookie-options";
import { Container } from "@/components/layout/container";
import { AppLink } from "@/components/link";
import { useMatomo } from "@/lib/matomo";
import { LocalStoreContext } from "@/providers/local-store-provider";

export type CookieSetting = {
  [key: string]: CookieProperties;
};

export type NecessaryCookies = {
  heading: string;
  description: string;
};

export type CookieProperties = {
  label: string;
  description: string;
  accepted: boolean;
};

function withAllAccepted(
  settings: CookieSetting,
  accepted: boolean,
): CookieSetting {
  return Object.fromEntries(
    Object.entries(settings).map(([key, value]) => [
      key,
      { ...value, accepted },
    ]),
  );
}

export const CookieBanner: FC<{
  settingsOpen: boolean;
  // eslint-disable-next-line no-unused-vars
  setSettingsOpen: (value: boolean) => void;
}> = ({ settingsOpen, setSettingsOpen }) => {
  const { store, set } = useContext(LocalStoreContext);
  const { setConsent } = useMatomo();
  const t = useTranslations();
  const lang = useLocale();

  const initialCookieSetting: CookieSetting = {
    analytic: {
      label: t("routes.cookies.analytic-heading"),
      description: t("routes.cookies.analytic-description"),
      accepted: false,
    },
  };

  const [cookieSettings, setCookieSettings] =
    useState<CookieSetting>(initialCookieSetting);

  useEffect(() => {
    setCookieSettings(initialCookieSetting);
  }, [lang]);

  useEffect(() => {
    setConsent(store.cookieSettings?.analytic?.accepted === true);
  }, [store.cookieSettings?.analytic?.accepted, setConsent]);

  const persist = (settings: CookieSetting) => {
    setCookieSettings(settings);
    set({ cookieSettings: settings });
    setSettingsOpen(false);
  };

  const necessaryCookieText: NecessaryCookies = {
    heading: t("routes.cookies.necessary-heading"),
    description: t("routes.cookies.necessary-description"),
  };

  return store.cookieSettings &&
    Object.keys(store.cookieSettings).length === 0 ? (
    <section
      className="fixed bottom-none z-50 w-full bg-brown-100 py-xl"
      aria-label="Cookie Banner"
    >
      <Container>
        <div className="mb-lg">{t("routes.cookies.cookie-text")}</div>

        <AppLink
          href={`/${t("routes.cookies.path")}` || "/"}
          passHref
          className="text-green-600"
        >
          {t("routes.cookies.link-title")}
        </AppLink>

        <form
          className="mt-lg"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {settingsOpen && (
            <CookieOptions
              cookieSettingsHeading={t(
                "routes.cookies.customize-cookies-heading",
              )}
              cookieSettings={cookieSettings}
              setCookieSettings={setCookieSettings}
              necessaryCookieText={necessaryCookieText}
            />
          )}
          <div className="flex flex-wrap gap-md md:gap-lg">
            <Button
              data-test-id="cookie-setting-button"
              type="submit"
              onClick={() => {
                persist(
                  settingsOpen
                    ? cookieSettings
                    : withAllAccepted(cookieSettings, true),
                );
              }}
            >
              {settingsOpen
                ? t("routes.cookies.cookie-setting-open")
                : t("routes.cookies.cookie-setting")}
            </Button>
            <Button
              data-test-id="cookie-reject-button"
              variant="secondary"
              type="button"
              onClick={() => {
                persist(withAllAccepted(cookieSettings, false));
              }}
            >
              {t("routes.cookies.cookie-reject")}
            </Button>
          </div>
        </form>
      </Container>
    </section>
  ) : null;
};
