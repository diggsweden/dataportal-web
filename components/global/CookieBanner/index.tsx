import useTranslation from "next-translate/useTranslation";
import React, { FC, useContext, useEffect, useState } from "react";
import { TrackingContext } from "@/providers/TrackingProvider";
import { LocalStoreContext } from "@/providers/LocalStoreProvider";
import Link from "next/link";
import { Button } from "@/components/global/Button";
import { Container } from "@/components/layout/Container";
import { CookieOptions } from "@/components/global/CookieBanner/CookieOptions";

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

export const CookieBanner: FC<{
  settingsOpen: boolean;
  setSettingsOpen: Function;
}> = ({ settingsOpen, setSettingsOpen }) => {
  const { store, set } = useContext(LocalStoreContext);
  const { setActivation } = useContext(TrackingContext);
  const { t, lang } = useTranslation();

  const initialCookieSetting: CookieSetting = {
    analytic: {
      label: t("routes|cookies$analytic-heading"),
      description: t("routes|cookies$analytic-description"),
      accepted: true,
    },
  };

  const [cookieSettings, setCookieSettings] =
    useState<CookieSetting>(initialCookieSetting);

  useEffect(() => {
    setCookieSettings(cookieSettings);
  }, [cookieSettings]);

  useEffect(() => {
    setCookieSettings(initialCookieSetting);
  }, [lang]);

  useEffect(() => {
    store.cookieSettings?.analytic?.accepted && setActivation(true);
  }, [store.cookieSettings?.analytic?.accepted]);

  const necessaryCookieText: NecessaryCookies = {
    heading: t("routes|cookies$necessary-heading"),
    description: t("routes|cookies$necessary-description"),
  };

  return store.cookieSettings &&
    Object.keys(store.cookieSettings).length === 0 ? (
    <section
      className="fixed bottom-none z-50 w-full bg-brown-100 py-xl"
      aria-label="Cookie Banner"
    >
      <Container>
        <div className="mb-lg">{t("routes|cookies$cookie-text")}</div>

        <Link
          href={`/${t("routes|cookies$path")}` || "/"}
          passHref
          className="text-green-600"
        >
          {t("routes|cookies$link-title")}
        </Link>

        <form
          className="mt-lg"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {settingsOpen && (
            <CookieOptions
              cookieSettingsHeading={t(
                "routes|cookies$customize-cookies-heading",
              )}
              cookieSettings={cookieSettings}
              setCookieSettings={setCookieSettings}
              necessaryCookieText={necessaryCookieText}
            />
          )}
          <div className="flex space-x-lg">
            <Button
              type="submit"
              onClick={() => {
                set({ cookieSettings: cookieSettings });
              }}
            >
              {settingsOpen
                ? t("routes|cookies$cookie-setting-open")
                : t("routes|cookies$cookie-setting")}
            </Button>
            {!settingsOpen && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setSettingsOpen(!settingsOpen);
                }}
              >
                {t("routes|cookies$settings-heading")}
              </Button>
            )}
          </div>
        </form>
      </Container>
    </section>
  ) : (
    <></>
  );
};
