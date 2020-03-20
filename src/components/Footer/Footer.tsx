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

const SocialLink = styled('a')`
  display: inline-block;
  border: none;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    background: ${colorPalette.red3};
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
  }

  &::after {
    content: '';
    position: absolute;
    background: ${colorPalette.darkred};
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    transform: scale(1, 0);
    will-change: transform;
    transition: transform 0.3s ${props => props.theme.timings.fast};
    transform-origin: 0 100%;
  }

  &:hover::after,
  &:focus::after {
    transform: scale(1, 1);
    transform-origin: 0 0;
  }

  &:focus {
    outline: solid 1px #000;
  }
`;

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
        className="footer-box"
        bgColor=""
        paddingX={2}
        paddingTop={[2, 8]}
        paddingBottom={4}
        marginTop={[8, 0]}
        lang="sv"
      >
        <Text color={colorPalette.grey1}>
          <Container>
            <SettingsContext.Consumer>
              {settings => (
                <>
                  <Box display="flex" direction="column-reverse">
                    <Box
                      className="footer-main"
                      display="flex"
                      alignItems="center"
                      justifyContent="space-between"
                    >
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
                      <Box
                        className="footer-links"
                        display="flex"
                        alignItems="center"
                        justifyContent="space-between"
                      >
                        <span className="text-6-bold">{i18n.t('common|contact')}:</span>
                        <a
                          className="footer-link text-6-link"
                          href="mailto:dataportal@digg.se"
                        >
                          dataportal@digg.se
                        </a>

                        <a
                          href={`/${i18n.languages[0]}/${i18n.t('routes|about|path')}`}
                          className="footer-link text-6-link"
                        >
                          {i18n.t('routes|about|title')}
                        </a>

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
                      </Box>
                    </Box>
                    {/* <Box
                      display="flex"
                      justifyContent="flex-end"
                      direction={['row']}
                      flexWrap
                      marginBottom={4}
                    >
                      <div className="back-to-top">
                        {' '}
                        <ScrollToTop
                          onScroll={this.props.onToTopButtonPushed}
                        />
                      </div>
                    </Box> */}
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
