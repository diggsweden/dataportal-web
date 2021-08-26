import {
  Box,
  Container,
  styled,
  MenuIcon,
  CloseIcon,
} from '@digg/design-system';
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { DataportalLogo } from '../../assets/Logo';
import { SandboxLogo } from '../../assets/LogoSandbox';
import { EventEffect } from '../EventEffect';
import { skipToContent } from '../SkipToContent';
import i18n from 'i18n';
import 'scss/header/header.scss';
import 'scss/general/general.scss';
import { SettingsContext } from 'components/SettingsProvider';
import FocusTrap from 'focus-trap-react';
import { EnvSettings } from '../../../config/env/EnvSettings';

const InnerBox = styled(Box)`
  pointer-events: auto;
`;

interface HeaderProps {
  activeLink?: string;
  env: EnvSettings;
}

export const Header: React.FC<HeaderProps> = ({ env, activeLink }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [focusTrap, setFocusTrap] = useState(false);
  const setFocusOnMenuButton = () => {
    skipToContent();
  };

  const openMenu = () => {
    setShowMenu(true);
    setFocusTrap(true);
    document.body.setAttribute('style', `position:fixed;`);
  };

  const closeMenu = () => {
    setShowMenu(false);
    setFocusTrap(false);
    document.body.setAttribute('style', ``);
  };

  return (
    <>
      <header>
        <InnerBox paddingY={0} paddingX={2}>
          <Container>
            <FocusTrap active={focusTrap}>
              <Box className="header-box">
                <EventEffect outline noHover>
                  {({ className }) => (
                    <Link
                      onClick={closeMenu}
                      to={`/${i18n.languages[0]}`}
                      aria-label={i18n.t('common|logo-title')}
                      className={'dataportal-logo'}
                    >
                      <Box>
                        <div className="logo-box">
                          {env.envName == 'sandbox' ? (
                            <SandboxLogo />
                          ) : env.envName == 'test' ? (
                            <SandboxLogo />
                          ) : (
                            <DataportalLogo />
                          )}
                        </div>
                      </Box>
                    </Link>
                  )}
                </EventEffect>

                {showMenu ? (
                  <button
                    onClick={closeMenu}
                    aria-label={i18n.t('common|close')}
                    className="nav-btn close-menu-btn"
                  >
                    <CloseIcon className="close-icon"></CloseIcon>
                    <span className="nav-btn--text text-6">
                      {i18n.t('common|close')}
                    </span>
                  </button>
                ) : (
                  <button
                    onClick={openMenu}
                    aria-label={i18n.t('common|menu')}
                    className={'nav-btn' + (showMenu ? ' nav-btn--open' : '')}
                  >
                    <MenuIcon className="menu-icon"></MenuIcon>
                    <span className="nav-btn--text text-6">
                      {i18n.t('common|menu')}
                    </span>
                  </button>
                )}

                <div
                  className={'menu-bg' + (showMenu ? ' menu-bg--active' : '')}
                ></div>

                <nav
                  className={
                    'header-links' + (showMenu ? '--active text-5' : '')
                  }
                >
                  <Link
                    onClick={closeMenu}
                    className={
                      'header-link ' +
                      (activeLink == 'search' ||
                      activeLink == 'terms' ||
                      activeLink == 'specifications'
                        ? 'active'
                        : '')
                    }
                    to={`/${i18n.languages[0]}/${i18n.t(
                      'routes|datasets|path'
                    )}?q=&f=`}
                  >
                    {i18n.t('common|search-data')}
                  </Link>

                  {i18n.language === 'sv' ? (
                    <Link
                      onClick={closeMenu}
                      to={`/${i18n.languages[0]}/${i18n.t('routes|news|path')}`}
                      className={
                        'header-link ' +
                        (activeLink == 'artiklar' ? 'active' : '')
                      }
                    >
                      {i18n.t('pages|articles|articles')}
                    </Link>
                  ) : (
                    ''
                  )}

                  <SettingsContext.Consumer>
                    {(settings) => (
                      <>
                        {settings.mainmenu &&
                          settings.mainmenu[0] &&
                          settings.mainmenu[0].children &&
                          settings.mainmenu[0].children
                            ?.sort(
                              (a, b) =>
                                parseInt(a.data.indexOrder + '0') -
                                parseInt(b.data.indexOrder + '0')
                            )
                            .map((m, i) => {
                              //connectedContent set
                              if (m && m.data && m.data.connectedContent) {
                                return (
                                  <Link
                                    onClick={closeMenu}
                                    key={i}
                                    className={
                                      'header-link ' +
                                      (activeLink == 'Om oss' ||
                                      activeLink == 'About us'
                                        ? 'active'
                                        : '')
                                    }
                                    to={`/${i18n.languages[0]}${m.data.urlsegment}`}
                                  >
                                    {m.data.title}
                                  </Link>
                                );
                              }
                              //externalurl set
                              else if (m && m.data && m.data.externalUrl) {
                                return (
                                  <a
                                    key={i}
                                    className={'header-link external-link'}
                                    href={m.data.externalUrl}
                                  >
                                    {m.data.title}
                                  </a>
                                );
                              }
                              //default empty
                              return;
                            })}
                      </>
                    )}
                  </SettingsContext.Consumer>
                  <a
                    className="header-link header-link--lang"
                    lang={i18n.t('common|lang')}
                    href={i18n.language == 'sv' ? '/en' : '/sv'}
                  >
                    {i18n.t('common|language')}
                  </a>
                  <div className="click-outside" onClick={closeMenu}></div>
                </nav>
              </Box>
            </FocusTrap>
          </Container>
        </InnerBox>
      </header>
    </>
  );
};
