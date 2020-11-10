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
import './i18n';
import { ApolloProvider } from '@apollo/react-hooks'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { SettingsUtil } from "../config/env/SettingsUtil";
import 'isomorphic-unfetch'

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


import 'scss/redirectpage/redirectpage.scss';

const emotionIds = (window as any).__EMOTION_IDS__ || null;

if (emotionIds) {
  hydrate(emotionIds);
}

const serverState = (window as any).__DATA__ || null;
const cache = createCache();
const renderMethod = serverState != null ? ReactDOM.hydrate : ReactDOM.render;

const env = SettingsUtil.create(typeof window !== 'undefined'? window.location.href : '');

const link = createHttpLink({  
  fetch: fetch as any,
  uri:env.CONTENTBACKEND_GRAPHAPI,
  credentials: 'same-origin'
});

const client = new ApolloClient({
  link,
  cache: new InMemoryCache()
});

function render() {
  return renderMethod(   
    <ApolloProvider client={client}>
      <CacheProvider value={cache}>
        <GlobalStyles theme={themes.default} />
        <ThemeProvider theme={themes.opendata}>
          <HelmetProvider>       
            <LocalStoreProvider>        
              <SettingsProvider applicationUrl={typeof window !== 'undefined'? window.location.href : ''}>
                <BrowserRouter>
                  <Routes />
                </BrowserRouter>
              </SettingsProvider>                            
            </LocalStoreProvider>      
          </HelmetProvider>
        </ThemeProvider>
      </CacheProvider>
    </ApolloProvider> ,  
    document.querySelector('#root')
  );
}

render();
