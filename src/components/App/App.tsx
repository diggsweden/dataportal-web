import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ScrollManager } from '../ScrollManager';
import { SkipToContent } from '../SkipToContent';
// import { CookieBanner } from '../CookieBanner';
import {KeyFocus } from '../KeyFocus';

export const App: React.SFC = ({ children }) => (
  <>
    <Helmet
      titleTemplate="%s"
      htmlAttributes={{ lang: 'sv' }}
    />
     <ScrollManager />
    <SkipToContent />
    {/* <CookieBanner /> */}
    <KeyFocus />

    {children}
  </>
);
