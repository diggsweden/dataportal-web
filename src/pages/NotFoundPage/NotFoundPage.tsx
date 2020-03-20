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
import i18n from 'i18n'

export const NotFoundPage: React.SFC<RouteComponentProps<
  any,
  RouterContext
>> = ({ staticContext }) => {
  if (staticContext) {
    staticContext.statusCode = 404;
  }

  return (
    <Box>
      <Container>
        <Box bgColor="background" padding={2}>
          <Box maxWidth="37.5rem">
            <PageMetadata
              seoTitle={i18n.t('pages|notfoundpage|heading')}
              seoDescription={i18n.t('pages|notfoundpage|heading')}
              seoImageUrl=""
              seoKeywords=""
              robotsFollow={true}
              robotsIndex={true}
              lang={i18n.languages[0]}
            />

            <a className="404logo" href="/" aria-label="Sveriges dataportal">
              <DataportalLogo />
            </a>
              <h1 className="text-1">{i18n.t('pages|notfoundpage|heading')}</h1>
            <Text marginBottom={3}>
            <p className="text-5">{i18n.t('pages|notfoundpage|body')}</p>            
            </Text>

            <a href="/" className="text-5-link">
              {i18n.t('pages|notfoundpage|tostart')}
            </a>
          </Box>
        </Box>
      </Container>
      <Footer onToTopButtonPushed={() => {}} />
    </Box>
  );
};
