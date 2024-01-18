import useTranslation from "next-translate/useTranslation";
import React, { FC, useContext, useEffect, useState } from "react";
import { TrackingContext } from "@/providers/TrackingProvider";
import { SettingsContext } from "@/providers/SettingsProvider";
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
  const { t } = useTranslation("common");
  const { cookieInformation, cookieMoreInfoLink } = useContext(SettingsContext);
  const [settingsOpen, setSettingsOpen] = useState(false);

  const initialCookieSetting: CookieSetting = {
    analytic: {
      label: t("cookie-analytic-heading"),
      description: t("cookie-analytic-description"),
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
    heading: t("cookie-necessary-heading"),
    description: t("cookie-necessary-description"),
  };

  return store.cookieSettings &&
    Object.keys(store.cookieSettings).length === 0 ? (
    <div className="fixed bottom-none z-50 w-full bg-brown-100 py-xl">
      <Container>
        <div className="mb-lg">{t(cookieInformation)}</div>

        <Link
          href={cookieMoreInfoLink || "/"}
          passHref
          className="text-green-600"
        >
          {t("cookie-link")}
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
              cookieSettingsHeading={t("cookie-settings-heading")}
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
                ? "Spara och godkänn"
                : "Spara och godkänn alla kakor"}
            </Button>
            {!settingsOpen && (
              <Button
                variant="secondary"
                type="button"
                onClick={() => {
                  setSettingsOpen(!settingsOpen);
                }}
              >
                {"Inställningar för kakor"}
              </Button>
            )}
          </div>
        </form>
      </Container>
    </div>
  ) : (
    <></>
  );
};
