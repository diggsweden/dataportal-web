import { Box, Container, Text } from '@digg/design-system';
import React from 'react';
import {
  LocalStoreContext,
  LocalStoreContextData,
} from '../LocalStoreProvider';
import { NoServerRender } from '../NoServerRender';
import i18n from 'i18n';
import { Link } from 'react-router-dom';

const MainContent = Box.withComponent('main');

export class CookieBanner extends React.Component {
  acceptCookies = (localStore: LocalStoreContextData) =>
    localStore.set({ cookiesAccepted: true });

  render() {
    return (
      <NoServerRender>
        <LocalStoreContext.Consumer>
          {(localStore) => {            
            return (
              !localStore.store.cookiesAccepted && (
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
                              )}#cookies_section`}
                              className="text-5"
                            >
                              {i18n.t('common|cookie-link')}
                            </Link>
                          </span>
                        </div>
                        <div className="cookiebanner__button">
                          <button
                            className="primary-btn"
                            onClick={() => this.acceptCookies(localStore)}
                          >
                            {i18n.t('common|cookie-btn')}
                          </button>
                        </div>
                      </div>
                    </MainContent>
                  </Container>
                </Box>
              )
            );
          }}
        </LocalStoreContext.Consumer>
      </NoServerRender>
    );
  }
}
