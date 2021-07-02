import { themes } from '@digg/design-system';
import { hydrate } from 'emotion';
import { ThemeProvider } from 'emotion-theming';
import React from 'react';
import ReactDOM from 'react-dom';
import { HelmetProvider } from 'react-helmet-async';
import { BrowserRouter } from 'react-router-dom';
import { LocalStoreProvider } from './components/LocalStoreProvider';
import { Routes } from './routes';
import createCache from '@emotion/cache';
import { CacheProvider } from '@emotion/core';
import { GlobalStyles } from './GlobalStyles';
import { SettingsProvider } from './components/SettingsProvider';
import { ApolloProvider } from '@apollo/client'
import { SettingsUtil } from "../config/env/SettingsUtil";
import 'isomorphic-unfetch'
import { createApolloClient } from '../shared/graphql/client';
import { TrackingProvider } from './components/TrackingProvider';

import 'scss/general/general.scss';
import 'scss/general/typography.scss';
import 'scss/general/buttons.scss';
import 'scss/general/variables.scss';
import 'scss/content/content.scss';
import 'scss/search/search_bar.scss';
import 'scss/search/search_filter.scss';
import 'scss/search/search_result.scss';
import 'scss/startpage/startpage_categories.scss';
import 'scss/startpage/startpage_search.scss';
import 'scss/startpage/startpage_general.scss';
import 'scss/blockspage/blockspage.scss';
import 'scss/search/search_head.scss';
import 'scss/highlight/highlight.scss';
import 'scss/news/news.scss';
import 'scss/project/projectlist.scss';
import 'scss/project/project.scss';
import 'scss/breadcrumb/breadcrumb.scss';
import 'scss/cookiebanner/cookiebanner.scss';


import 'scss/redirectpage/redirectpage.scss';
import fetch from 'node-fetch';
import { I18nextProvider } from 'react-i18next';
import i18n from './i18n';

const emotionIds = (window as any).__EMOTION_IDS__ || null;

if (emotionIds) {
  hydrate(emotionIds);
}

const serverState = (window as any).__APOLLO_STATE__ || null;
const cache = createCache();
const env = SettingsUtil.create(typeof window !== 'undefined' ? window.location.href : '');

const client = createApolloClient({
  serverState: serverState,
  fetch: fetch,
  //ssrForceFetchDelay: 100,
  backendUrl: env.CONTENTBACKEND_GRAPHAPI,
  fetchPolicy: 'cache-and-network'
});

const GetCookiesAccepted = () => {
  try {
    const store = JSON.parse(localStorage.getItem("digg-store")!)
    return store ? store.cookiesAccepted == true : false;
  } catch { console.error("Could not parse digg-store"); return false }
};

ReactDOM.hydrate(
  <I18nextProvider i18n={i18n}>
    <ApolloProvider client={client}>
      <CacheProvider value={cache}>
        <SettingsProvider applicationUrl={typeof window !== 'undefined' ? window.location.href : ''}>
          <TrackingProvider initalActivation={GetCookiesAccepted()}>
            <GlobalStyles theme={themes.default} />
            <ThemeProvider theme={themes.opendata}>
              <HelmetProvider>
                <LocalStoreProvider>
                  <BrowserRouter>
                    <Routes />
                  </BrowserRouter>
                </LocalStoreProvider>
              </HelmetProvider>
            </ThemeProvider>
          </TrackingProvider>
        </SettingsProvider>
      </CacheProvider>
    </ApolloProvider>
  </I18nextProvider>,
  document.getElementById('root')
);
