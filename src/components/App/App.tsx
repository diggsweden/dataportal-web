import React, { useContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { ScrollManager } from '../ScrollManager';
import { SkipToContent } from '../SkipToContent';
import { CookieBanner } from '../CookieBanner';
import { KeyFocus } from '../KeyFocus';
import { useLocation } from 'react-router-dom';
import { QueryParamProvider } from 'components/QueryParamProvider';
import { Box } from '@digg/design-system';
import { ErrorBoundary } from 'components/ErrorBoundary';
import { Header } from 'components/Header';
import { NoJavaScriptWarning } from 'components/NoJavaScriptWarning';
import { SettingsContext } from 'components/SettingsProvider';
import { Footer } from 'components/Footer';

const MainContent = Box.withComponent('main');

export const App: React.FunctionComponent = ({ children }) => {
  const location = useLocation();
  const uri = new URLSearchParams(location.search);
  const { env } = useContext(SettingsContext);
  const headerRef = React.createRef() as any;

  const setFocus = () => {
    if (headerRef.current) {
      headerRef.current.setFocusOnMenuButton();
    }
  };
  return (
    <>
      <Helmet titleTemplate="%s" htmlAttributes={{ lang: 'sv' }} />
      <CookieBanner />
      <ScrollManager />
      <SkipToContent />
      <KeyFocus />

      <QueryParamProvider params={uri}>
        <Box
          id="top"
          display="flex"
          direction="column"
          minHeight="100vh"
          bgColor="#fff"
        >
          <NoJavaScriptWarning text="" />

          <Header env={env} />

          <ErrorBoundary>
            <MainContent id="main" flex="1 1 auto">
              {children}
            </MainContent>
          </ErrorBoundary>
          <Footer onToTopButtonPushed={setFocus} />
        </Box>
      </QueryParamProvider>
    </>
  );
};
