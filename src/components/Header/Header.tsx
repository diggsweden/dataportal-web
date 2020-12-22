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
import { SettingsContext } from 'components/SettingsProvider';

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
                          <DataportalLogo />
                        </div>
                      </Box>
                    </Link>
                  )}
                </EventEffect>

                
                <nav className="header-links">
                  <Link
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
                        to={`/${i18n.languages[0]}/${i18n.t(
                          'routes|news|path'
                        )}`}
                        className={
                          'header-link ' +
                          (this.props.activeLink == 'artiklar'
                            ? 'active'
                            : '') +
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
                          if (m && m.data && m.data.connectedContent) {
                            return (
                              <Link
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
                          return;
                        })}            
                      </>         
                  )}
                </SettingsContext.Consumer>
                <a                        
                    className="header-link header-link--lang"
                    href={
                      i18n.language == "sv"
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
