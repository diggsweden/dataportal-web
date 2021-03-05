import React from 'react';
import { Box } from '@digg/design-system';
import { Header } from '../../components/Header';
import { Footer } from '../../components/Footer';
import { Loader } from '../../components/Loader';
import { QueryParamProvider } from 'components/QueryParamProvider';
import { PageMetadata } from 'pages/PageMetadata';
import i18n from 'i18n';
import { SettingsContext } from 'components/SettingsProvider';
import { NoJavaScriptWarning } from 'components/NoJavaScriptWarning';

const MainContent = Box.withComponent('main');

export const LoadingPage: React.SFC = () => (
  <>
  <PageMetadata        
    seoTitle="Laddar.."
    seoDescription=""
    seoImageUrl=""
    seoKeywords=""
    robotsFollow={true}
    robotsIndex={true}
    lang={i18n.languages[0]}
  />
  <SettingsContext.Consumer>
    {settings => (       
    <Box
      id="top"
      display="flex"
      direction="column"
      minHeight="100vh"
      bgColor="#fff"
    >
      <NoJavaScriptWarning text="" />

      <Header/>
  
      <MainContent flex="1 1 auto">
        <div className="main-container">
          <Box display="flex" justifyContent="center">
          </Box>
        </div>
      </MainContent>
      <Footer onToTopButtonPushed={() => {}} />
    </Box>
    )}
  </SettingsContext.Consumer>
  
  </>

);
