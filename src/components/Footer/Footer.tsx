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
import i18n from 'i18n';

import 'scss/footer/footer.scss';

export interface FooterProps {
  onToTopButtonPushed: () => void;
}

const FooterBox = Box.withComponent('footer');

export class Footer extends React.Component<FooterProps> {
  shouldComponentUpdate() {
    return false;
  }

  render() {
    return (
      <FooterBox className="footer" bgColor="" paddingX={2} lang="sv">
        <Text>
          <Container>
            <SettingsContext.Consumer>
              {(settings) => (
                <>
                  <Box>
                    <Box className="footer-main">
                      <Box className="footer__links">
                        <div className="footer__links-nav">
                          {settings.footermenu &&
                            settings.footermenu[0] &&
                            settings.footermenu[0].children &&
                            settings.footermenu[0].children
                              ?.sort(
                                (a:any, b:any) =>
                                  parseInt(a.data.indexOrder + '0') -
                                  parseInt(b.data.indexOrder + '0')
                              )
                              .map((m:any, i:any) => {
                                var output = [];

                                if (m && m.data && m.data.externalUrl) {
                                  output.push(
                                    <a
                                      key={i}
                                      className={'footer-link text-6-link'}
                                      href={m.data.externalUrl}
                                      target="_blank"
                                    >
                                      {m.data.title}
                                    </a>
                                  );
                                } else if (
                                  m &&
                                  m.data &&
                                  m.data.connectedContent
                                )
                                  output.push(
                                    <Link
                                      key={i}
                                      className={'footer-link text-6-link'}
                                      to={`/${i18n.languages[0]}${m.data.urlsegment}`}
                                    >
                                      {m.data.title}
                                    </Link>
                                  );
                                else if (m && m.data && m.data.title) {
                                  var parent: any = [];

                                  if (m && m.children && m.children.length > 0)
                                    m.children
                                      .sort(
                                        (a:any, b:any) =>
                                          parseInt(a.data.indexOrder + '0') -
                                          parseInt(b.data.indexOrder + '0')
                                      )
                                      .map((c:any,i:any) => {
                                        if (c && c.data && c.data.externalUrl)
                                          parent.push(
                                            <a
                                              key={i}
                                              className={
                                                'footer-link text-6-link external-link'
                                              }
                                              href={c.data.externalUrl}
                                              // target="_blank"
                                            >
                                              {c.data.title}
                                            </a>
                                          );

                                        if (
                                          c &&
                                          c.data &&
                                          c.data.connectedContent
                                        )
                                          parent.push(
                                            <Link
                                              key={i}
                                              className={
                                                'footer-link text-6-link'
                                              }
                                              to={`/${i18n.languages[0]}${c.data.urlsegment}`}
                                            >
                                              {c.data.title}
                                            </Link>
                                          );
                                      });

                                  output.push(
                                    <ul>
                                      <li className="text-5-bold footer__links-nav--heading">
                                        {m.data.title}
                                      </li>
                                      {parent.map((p: any, i: any) => {
                                        return <li key={i}>{p}</li>;
                                      })}
                                    </ul>
                                  );
                                }

                                return output;
                              })}
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
