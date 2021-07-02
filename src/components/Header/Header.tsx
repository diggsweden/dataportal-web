import {
  Box,
  Container,
  createInterpolator,
  Heading,
  Logo,
  styled,
  MenuIcon,
  CloseIcon,
} from '@digg/design-system';
import React, { useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { NoScriptLogo } from '../../assets/NoScriptLogo';
import { DataportalLogo } from '../../assets/Logo';
import { SandboxLogo } from '../../assets/LogoSandbox';
import { EventEffect } from '../EventEffect';
import { skipToContent } from '../SkipToContent';
import i18n from 'i18n';
import 'scss/header/header.scss';
import 'scss/general/general.scss';
import { SettingsContext } from 'components/SettingsProvider';
import { bool, string } from 'prop-types';
import { boolean } from 'yup';
import FocusTrap from 'focus-trap-react';
import { EnvSettings } from '../../../config/env/EnvSettings';

// const hasWindow = typeof window !== 'undefined';

// const frame = hasWindow
//   ? window.requestAnimationFrame
//   : (cb: () => void) => cb();

const InnerBox = styled(Box)`
  pointer-events: auto;
`;

interface HeaderProps {
  activeLink?: string;
  env: EnvSettings;
}

export class Header extends React.Component<HeaderProps, any> {
  setFocusOnMenuButton() {
    skipToContent();
  }

  constructor(props: HeaderProps) {
    super(props);

    this.state = {
      showMenu: false,
      focusTrap: false,
    };
  }

  toggleShowOrHideMenu = () => {
    this.setState({ showMenu: !this.state.showMenu });
    this.setState({ focusTrap: !this.state.focusTrap });
  };

  openMenu = () => {
    this.setState({ showMenu: true });
    this.setState({ focusTrap : false});
    // this.toggleShowOrHideMenu();
    document.body.setAttribute('style', `position:fixed;`);
  };

  closeMenu = () => {
    // this.toggleShowOrHideMenu();
    this.setState({ showMenu: false });
    this.setState({ focusTrap : true});
    document.body.setAttribute('style', ``);
  };

  render() {
    return (
      <>
        <header>
          <InnerBox paddingY={0} paddingX={2}>
            <Container>
              <Box className="header-box">
                <EventEffect outline noHover>
                  {({ className }) => (
                    <Link
                      to={`/${i18n.languages[0]}`}
                      aria-label={i18n.t('common|logo-title')}
                      className={'dataportal-logo'}
                    >
                      <Box>
                        <div className="logo-box">
                          {this.props.env.envName == 'sandbox' ? (
                            <SandboxLogo />
                          ) : this.props.env.envName == 'test' ? (
                            <SandboxLogo />
                          ) : (
                            <DataportalLogo />
                          )}
                        </div>
                      </Box>
                    </Link>
                  )}
                </EventEffect>

                <button
                  aria-label={i18n.t('common|menu')}
                  className={
                    'nav-btn' + (this.state.showMenu ? ' nav-btn--open' : '')
                  }
                  onClick={this.openMenu}
                >
                  <MenuIcon className="menu-icon"></MenuIcon>
                  <span className="nav-btn--text text-6">
                    {i18n.t('common|menu')}
                  </span>
                </button>
                <div
                  className={
                    'menu-bg' + (this.state.showMenu ? ' menu-bg--active' : '')
                  }
                ></div>
                <FocusTrap active={this.state.focusTrap}>
                  <nav
                    className={
                      'header-links' +
                      (this.state.showMenu ? '--active text-5' : '')
                    }
                  >
                    <div
                      onClick={this.closeMenu}
                      className={
                        'close-menu-btn-wrapper ' +
                        (this.state.showMenu
                          ? ' close-menu-btn-wrapper--active '
                          : '')
                      }
                    >
                      <button
                        aria-label={i18n.t('common|close')}
                        className="nav-btn"
                        onClick={this.closeMenu}
                      >
                        <CloseIcon className="close-icon"></CloseIcon>{' '}
                        <span className="nav-btn--text text-6">
                          {' '}
                          {i18n.t('common|close')}
                        </span>
                      </button>
                    </div>

                    <Link
                      onClick={this.closeMenu}
                      className={
                        'header-link ' +
                        (this.props.activeLink == 'search' ||
                        this.props.activeLink == 'terms' ||
                        this.props.activeLink == 'specifications'
                          ? 'active'
                          : '')
                      }
                      to={`/${i18n.languages[0]}/${i18n.t(
                        'routes|datasets|path'
                      )}?q=&f=`}
                    >
                      {i18n.t('common|search-data')}
                    </Link>

                    <Link
                      onClick={this.closeMenu}
                      to={`/${i18n.languages[0]}/${i18n.t('routes|news|path')}`}
                      className={
                        'header-link ' +
                        (this.props.activeLink == 'artiklar' ? 'active' : '') +
                        (i18n.t('common|language').includes('English')
                          ? ''
                          : ' no-en')
                      }
                    >
                      {i18n.t('pages|articles|articles')}
                    </Link>
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
                                      onClick={this.closeMenu}
                                      key={i}
                                      className={
                                        'header-link ' +
                                        (this.props.activeLink == 'Om oss' ||
                                        this.props.activeLink == 'About us'
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
                    <div
                      className="click-outside"
                      onClick={this.closeMenu}
                    ></div>
                  </nav>
                </FocusTrap>
              </Box>
            </Container>
          </InnerBox>
        </header>
      </>
    );
  }
}
