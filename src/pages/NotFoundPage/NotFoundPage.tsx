import {
  Box,
  Button,
  colorPalette,
  Container,
  Heading,
  Text,
} from '@digg/design-system';
import React from 'react';
import { Link, RouteComponentProps } from 'react-router-dom';
import { RouterContext } from '../../../shared/RouterContext';
import { PageMetadata } from '../PageMetadata';
import { Footer } from '../../components/Footer';
import { Header } from '../../components/Header';
import { DataportalLogo } from '../../assets/Logo';
import i18n from 'i18n';

const MainContent = Box.withComponent('main');

export const NotFoundPage: React.SFC<RouteComponentProps<
  any,
  RouterContext
>> = ({ staticContext }) => {
  if (staticContext) {
    staticContext.statusCode = 404;
  }

  return (
    <Box
      id="top"
      display="flex"
      direction="column"
      minHeight="100vh"
      bgColor="#fff"
      className="notfoundpage"
    >
      <PageMetadata
        seoTitle={i18n.t('pages|notfoundpage|heading')}
        seoDescription={i18n.t('pages|notfoundpage|heading')}
        seoImageUrl=""
        seoKeywords=""
        robotsFollow={true}
        robotsIndex={true}
        lang={i18n.languages[0]}
      />

      <Header />
      <MainContent flex="1 1 auto">
        <div className="main-container">
          <h1 className="text-1">
            {i18n.t('pages|redirect|pagenotfound_header')}
          </h1>
          <div className="content redirectpage__content">
            <span className="text-5">{i18n.t('pages|notfoundpage|body')}</span>

            <ul>
              <li>
                <a className="text-4" href={`/${i18n.languages[0]}`}>
                  {i18n.t('pages|redirect|pagenotfound-link')}
                </a>
              </li>
              <li>
                <a
                  className="text-4"
                  href={`/${i18n.languages[0]}/${i18n.t(
                    'routes|datasets|path'
                  )}?q=&f=`}
                >
                  {i18n.t('pages|redirect|pagenotfound-link2')}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </MainContent>
      <Footer onToTopButtonPushed={() => {}} />
    </Box>
  );
};
