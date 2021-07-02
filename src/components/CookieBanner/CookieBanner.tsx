import { Box, Container } from '@digg/design-system';
import React, { useEffect } from 'react';
import {
  LocalStore,
  LocalStoreContext,
} from '../LocalStoreProvider';
import { NoServerRender } from '../NoServerRender';
import i18n from 'i18n';
import { Link } from 'react-router-dom';
import { useContext } from 'react';
import { TrackingContext } from 'components/TrackingProvider';

const MainContent = Box.withComponent('main');

export const CookieBanner = () => {
  const { setActivation } = useContext(TrackingContext);
  const { store, set } = useContext(LocalStoreContext);

  const acceptCookies = (set: (settings: Partial<LocalStore>) => void) =>
    set({ cookiesAccepted: true });

  useEffect(() => {
    store.cookiesAccepted && setActivation(store.cookiesAccepted);
  }, [store.cookiesAccepted]);
  return (
    <NoServerRender>
      {!store.cookiesAccepted && (
        <Box
          className="cookiebanner"
          position="fixed"
          bottom={true}
          left
          width="100%"
          zIndex={100}
        >
          <Container>
            <MainContent
              className="detailpage main-container"
              flex="1 1 auto"
            >
              <div className="cookiebanner">
                <div className="cookiebanner__text">
                  <span className="text-5">
                    {i18n.t('common|cookie-text')}
                    <Link
                      to={`/${i18n.languages[0]}/${i18n.t(
                        'routes|about|path'
                      )}#${i18n.t('common|cookies')}`}
                      className="text-5"
                    >
                      {i18n.t('common|cookie-link')}
                    </Link>
                  </span>
                </div>
                <div className="cookiebanner__button">
                  <button
                    className="primary-btn"
                    onClick={() => acceptCookies(set)}
                  >
                    {i18n.t('common|cookie-btn')}
                  </button>
                </div>
              </div>
            </MainContent>
          </Container>
        </Box>
      )}
    </NoServerRender >
  );
}
