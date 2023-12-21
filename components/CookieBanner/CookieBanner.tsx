import useTranslation from "next-translate/useTranslation";
import React, { useContext, useEffect } from "react";
import { TrackingContext } from "@/components/TrackingProvider";
import { SettingsContext } from "@/components/SettingsProvider";
import { LocalStoreContext } from "@/components/LocalStoreProvider";

export const CookieBanner: React.FC = () => {
  const { store, set } = useContext(LocalStoreContext);
  const { setActivation } = useContext(TrackingContext);
  const { t } = useTranslation("common");
  const { cookieInformation, cookieMoreInfoLink } = useContext(SettingsContext);
  useEffect(() => {
    store.cookieSettings?.analytic?.accepted && setActivation(true);
  }, [store.cookieSettings?.analytic?.accepted]);

  const initialCookieSetting: CookieSetting = {
    analytic: {
      label: t("cookie-analytic-heading"),
      description: t("cookie-analytic-description"),
      accepted: true,
    },
  };

  const necessaryCookieText: NecessaryCookies = {
    heading: t("cookie-necessary-heading"),
    description: t("cookie-necessary-description"),
  };

  return store.cookieSettings &&
    Object.keys(store.cookieSettings).length === 0 ? (
    <div></div>
  ) : (
    <></>
  );
};
export default CookieBanner;
