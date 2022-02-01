import {
  Box,
  Container,
  Logo,
  Text,
} from '@digg/design-system';
import React from 'react';
import { Link } from 'react-router-dom';
import { SettingsContext } from '../SettingsProvider';
import i18n from 'i18n';
import 'scss/footer/footer.scss';

interface FooterProps {
  onToTopButtonPushed: () => void;
}

const FooterBox = Box.withComponent('footer');

export const Footer: React.FC<FooterProps> = () => {
  return (
    <FooterBox className="footer" paddingX={2}>
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
                              (a: any, b: any) =>
                                parseInt(a.data.indexOrder + '0') -
                                parseInt(b.data.indexOrder + '0')
                            )
                            .map((m: any, i: any) => {
                              var output = [];

                              if (m && m.data && m.data.externalUrl) {
                                output.push(
                                  <a
                                    key={`output-externalUrl-${i}`}
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
                                    key={`output-connectedContent-${i}`}
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
                                      (a: any, b: any) =>
                                        parseInt(a.data.indexOrder + '0') -
                                        parseInt(b.data.indexOrder + '0')
                                    )
                                    .map((c: any, i: any) => {
                                      if (c && c.data && c.data.externalUrl)
                                        parent.push(
                                          <a
                                            key={`parent-externalUrl-${i}`}
                                            className={
                                              'footer-link text-6-link external-link'
                                            }
                                            href={c.data.externalUrl}
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
                                            key={`parent-connectedContent-${i}`}
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
                                  <ul key={`ul-${i}`}>
                                    <li className="text-5-bold footer__links-nav--heading">
                                      {m.data.title}
                                    </li>
                                    {parent.map((p: any, i: any) => {
                                      return <li key={`parent-${i}`}>{p}</li>;
                                    })}
                                  </ul>
                                );
                              }

                              return output;
                            })}
                      </div>
                    </Box>
                    <Box className="digg__">
                      <Box width="15rem">
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
