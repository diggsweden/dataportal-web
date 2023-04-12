import {
  CookieBanner as DiggCookieBanner,
  CookieSetting,
  NecessaryCookies,
  styled,
} from '@digg/design-system';
import useTranslation from 'next-translate/useTranslation';
import Link from 'next/link';
import React, { useContext, useEffect } from 'react';
import { LocalStoreContext, SettingsContext } from '..';
import { TrackingContext } from '../TrackingProvider';

const StyledLink = styled(Link)`
  margin-left: 0.25rem;
  text-decoration: underline;
  cursor: pointer;

  &:hover {
    text-decoration: none;
  }
`;

export const CookieBanner: React.FC = () => {
  const { store, set } = useContext(LocalStoreContext);
  const { setActivation } = useContext(TrackingContext);
  const { t } = useTranslation('common');
  const { cookieInformation, cookieMoreInfoLink } = useContext(SettingsContext);
  useEffect(() => {
    store.cookieSettings?.analytic?.accepted && setActivation(true);
  }, [store.cookieSettings?.analytic?.accepted]);

  const initialCookieSetting: CookieSetting = {
    analytic: {
      label: t('cookie-analytic-heading'),
      description: t('cookie-analytic-description'),
      accepted: true,
    },
  };

  const necessaryCookieText: NecessaryCookies = {
    heading: t('cookie-necessary-heading'),
    description: t('cookie-necessary-description'),
  };

  return store.cookieSettings && Object.keys(store.cookieSettings).length === 0 ? (
    <DiggCookieBanner
      onCookiesAccepted={(c) => {
        set({ cookieSettings: c });
      }}
      cookieSetting={initialCookieSetting}
      necessaryCookieText={necessaryCookieText}
      cookieSettingsHeading={t('cookie-settings-heading')}
      saveBtnTextOpen={t('cookie-btn-open')}
      saveBtnTextClosed={t('cookie-btn-closed')}
      settingsBtnText={t('cookie-btn-settings')}
    >
      {t(cookieInformation)}

      {/** Todo - fix better row break */}
      <p></p>
      <StyledLink
        href={cookieMoreInfoLink || '/'}
        passHref
        className="text-md"
      >
        {t('cookie-link')}
      </StyledLink>
    </DiggCookieBanner>
  ) : (
    <></>
  );
};
export default CookieBanner;
