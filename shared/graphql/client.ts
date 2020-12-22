import {
    InMemoryCache, IntrospectionFragmentMatcher,    
  } from 'apollo-cache-inmemory';
  import { ApolloClient } from '@apollo/client';
  import { createHttpLink } from 'apollo-link-http'
  import { BatchHttpLink } from 'apollo-link-batch-http';
  
  let globalWindow = typeof window !== 'undefined' ? window : null;
  
  export const createApolloClient = (
    options: {
      backendUrl?: string;
      ssrMode?: boolean;
      serverState?: any;
      cookies?: any;
      fetch?: any;
      ssrForceFetchDelay?: number;
    } = {
        backendUrl: '/',
      ssrMode: false,
      serverState: null,
      cookies: null,
      fetch: null,
      ssrForceFetchDelay: 0
    }
  ) => {
    const { backendUrl, ssrMode, serverState, cookies,ssrForceFetchDelay } = options;

  
    // ! Setting type as any to supress ts error.
    // ! Might cause problems but seems to work for now
    const cache: any = new InMemoryCache({
      fragmentMatcher: new IntrospectionFragmentMatcher({
        introspectionQueryResultData: {
          __schema: {
            types: [],
          },
        },
      }),
    });

    // const link: any = createHttpLink({
    //   uri: backendUrl,
    //   credentials: 'same-origin',    
    //   fetch: typeof fetch !== 'undefined' ? fetch : options.fetch,
    // });    

    const link: any = new BatchHttpLink({
      uri: backendUrl,
      credentials: 'same-origin',
      headers: {
        cookie: cookies,
      },
      fetch: typeof fetch !== 'undefined' ? fetch : options.fetch,
    });
  
    const client = new ApolloClient({
      ssrForceFetchDelay: ssrForceFetchDelay,      
      ssrMode,
      link: link,
      cache: serverState != null ? cache.restore(serverState) : cache,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: 'cache-and-network',
        },
      },
    });
  
    return client;
  };
  