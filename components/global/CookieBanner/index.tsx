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

export const CookieBanner: FC = () => {
  const { store, set } = useContext(LocalStoreContext);
  const { setActivation } = useContext(TrackingContext);
  const { t } = useTranslation("routes");
  const [settingsOpen, setSettingsOpen] = useState(false);

  const initialCookieSetting: CookieSetting = {
    analytic: {
      label: t("cookies$analytic-heading"),
      description: t("cookies$analytic-description"),
      accepted: true,
    },
  };

  const [cookieSettings, setCookieSettings] =
    useState<CookieSetting>(initialCookieSetting);

  useEffect(() => {
    setCookieSettings(cookieSettings);
  }, [cookieSettings]);

  useEffect(() => {
    store.cookieSettings?.analytic?.accepted && setActivation(true);
  }, [store.cookieSettings?.analytic?.accepted]);

  const necessaryCookieText: NecessaryCookies = {
    heading: t("cookies$necessary-heading"),
    description: t("cookies$necessary-description"),
  };

  return store.cookieSettings &&
    Object.keys(store.cookieSettings).length === 0 ? (
    <section
      className="fixed bottom-none z-50 w-full bg-brown-100 py-xl"
      aria-label="Cookie Banner"
    >
      <Container>
        <div className="mb-lg">{t("cookies$cookie-text")}</div>

        <Link
          href={`/${t("cookies$path")}` || "/"}
          passHref
          className="text-green-600"
        >
          {t("cookies$link-title")}
        </Link>

        <form
          id="cookie-form"
          className="mt-lg"
          onSubmit={(e) => {
            e.preventDefault();
          }}
        >
          {settingsOpen && (
            <CookieOptions
              cookieSettingsHeading={t("cookies$customize-cookies-heading")}
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
                ? t("cookies$cookie-setting-open")
                : t("cookies$cookie-setting")}
            </Button>
            {!settingsOpen && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setSettingsOpen(!settingsOpen);
                }}
              >
                {t("cookies$settings-heading")}
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
