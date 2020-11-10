import {
  Box,
  colorPalette,
  Container,
  Divider,
  FacebookIcon,
  Heading,
  LinkedinIcon,
  Logo,
  styled,
  Text,
  themes,
  TwitterIcon,
  YoutubeIcon,
} from '@digg/design-system';
import { ThemeProvider } from 'emotion-theming';
import React from 'react';
import { Link, RouteComponentProps, withRouter } from 'react-router-dom';
import { EventEffect } from '../EventEffect';
import { ScrollToTop } from '../ScrollToTop';
import { SettingsContext } from '../SettingsProvider';
import { FooterLink } from './FooterLink';
import i18n from 'i18n';

import 'scss/footer/footer.scss';

export interface FooterProps {
  onToTopButtonPushed: () => void;
}

const FooterBox = Box.withComponent('footer');

const SocialIcons: { [key: string]: typeof TwitterIcon } = {
  twitter: TwitterIcon,
  facebook: FacebookIcon,
  youtube: YoutubeIcon,
  linkedIn: LinkedinIcon,
};

export class Footer extends React.Component<FooterProps> {
  shouldComponentUpdate() {
    return false;
  }
  render() {
    return (
      <FooterBox
        className="footer"
        bgColor=""
        paddingX={2}
        // paddingTop={4}
        lang="sv"
      >
        <Text>
          <Container>
            <SettingsContext.Consumer>
              {(settings) => (
                <>
                  <Box>
                    <Box className="footer-main">
                      <Box className="footer__links">
                        <div className="footer__links-nav">
                          <a
                            href={`/${i18n.languages[0]}/${i18n.t(
                              'routes|register-data|path'
                            )}`}
                            className="footer-link text-6-link"
                          >
                            {i18n.t('routes|register-data|title')}
                          </a>

                          <a
                            href={`/${i18n.languages[0]}/${i18n.t(
                              'routes|about|path'
                            )}`}
                            className="footer-link text-6-link"
                          >
                            {i18n.t('routes|about|title')}
                          </a>

                          <a
                            className="footer-link text-6-link"
                            href={`/${i18n.languages[0]}/${i18n.t(
                              'routes|accessibility|path'
                            )}`}
                          >
                            {i18n.t('common|accessibility-report')}
                          </a>

                          <div>
                            <span className="text-6-bold">
                              {i18n.t('common|contact')}:
                            </span>
                            <a
                              className="footer-link text-6-link"
                              href="mailto:dataportal@digg.se"
                            >
                              dataportal@digg.se
                            </a>
                          </div>
                        </div>

                        <div className="footer__links-contact">
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://www.facebook.com/oppnadata.psi/"
                            className="footer-link text-6-link"
                          >
                            Facebook
                          </a>
                          <a
                            target="_blank"
                            rel="noreferrer"
                            href="https://twitter.com/oppnadata_psi"
                            className="footer-link text-6-link"
                          >
                            Twitter
                          </a>
                        </div>
                      </Box>
                      <Box className="digg__">
                        <Box width="15rem" marginRight={2}>
                          {process.env.CLIENT && (
                            <Logo
                              aria-label="Diggs logotyp"
                              id="footer"
                              mode="wide"
                              width={30 * 16}
                            />
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </>
              )}
            </SettingsContext.Consumer>
          </Container>
        </Text>
      </FooterBox>
    );
  }
}
