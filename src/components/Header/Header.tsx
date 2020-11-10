import {
  Box,
  Container,
  createInterpolator,
  Heading,
  Logo,
  styled,
  MenuIcon,
} from '@digg/design-system';
import React, { useState } from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { NoScriptLogo } from '../../assets/NoScriptLogo';
import { DataportalLogo } from '../../assets/Logo';
import { EventEffect } from '../EventEffect';
import { skipToContent } from '../SkipToContent';
import i18n from 'i18n';
import 'scss/header/header.scss';
import 'scss/general/general.scss';

const hasWindow = typeof window !== 'undefined';

const frame = hasWindow
  ? window.requestAnimationFrame
  : (cb: () => void) => cb();

const InnerBox = styled(Box)`
  pointer-events: auto;
`;

interface HeaderProps {
  activeLink?: string;
}

export class Header extends React.Component<HeaderProps> {
  setFocusOnMenuButton() {
    skipToContent();
  }

  shouldComponentUpdate() {
    return false;
  }

  render() {
    console.log(this.props.activeLink)
    return (
      <>
        <header>
          <InnerBox display="flex" justifyContent="center">
            <div className="beta-banner">
              <p className="text-6">
                {i18n.t('common|beta-text1')}{' '}
                <a
                  className="text-6-link"
                  target="_blank"
                  href="https://webropol.com/s/beta-sveriges-dataportal"
                  rel="noreferrer"
                >
                  {i18n.t('common|beta-link-text')}
                </a>
                {i18n.t('common|beta-text2')}
              </p>
            </div>
          </InnerBox>

          <InnerBox paddingY={0} paddingX={2}>
            <Container>
              <Box className="header-box">
                <EventEffect outline noHover>
                  {({ className }) => (
                    <a
                      href={`/${i18n.languages[0]}`}
                      aria-label={i18n.t('common|logo-title')}
                      className={'dataportal-logo'}
                    >
                      <Box>
                        <div className="logo-box">
                          <DataportalLogo />
                        </div>
                      </Box>
                    </a>
                  )}
                </EventEffect>

                <nav className="header-links">
                  <a
                    className={
                      'header-link ' +
                      (this.props.activeLink == 'search' ||
                      this.props.activeLink == 'terms' ||
                      this.props.activeLink == 'specifications'
                        ? 'active'
                        : '')
                    }
                    href={`/${i18n.languages[0]}/${i18n.t(
                      'routes|datasets|path'
                    )}?q=&f=`}
                  >
                    {i18n.t('common|search-data')}
                  </a>

                  <a
                    href={`/${i18n.languages[0]}/${i18n.t('routes|news|path')}`}
                    className={
                      'header-link ' +
                      (this.props.activeLink == 'artiklar' ? 'active' : '') +
                      (i18n.t('common|language').includes('English')
                        ? ''
                        : ' no-en')
                    }
                  >
                    {i18n.t('pages|articles|articles')}
                  </a>

                  {/* <a
                    href={`/${i18n.languages[0]}/${i18n.t(
                      'routes|projects|path'
                    )}`}
                    className={
                      'header-link ' +
                      (this.props.activeLink == 'projects' ? 'active' : '') +
                      (i18n.t('common|language').includes('English')
                        ? ''
                        : ' no-en')
                    }
                  >
                    {i18n.t('routes|projects|title')}
                  </a> */}

                  <a
                    className="header-link header-link--lang"
                    href={
                      i18n.t('common|language').includes('English')
                        ? '/en'
                        : '/sv'
                    }
                  >
                    {i18n.t('common|language')}
                  </a>
                </nav>
                <button className="nav-btn">
                  <MenuIcon></MenuIcon>Meny
                </button>
              </Box>
            </Container>
          </InnerBox>
        </header>
      </>
    );
  }
}
