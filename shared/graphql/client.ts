import {
    InMemoryCache, IntrospectionFragmentMatcher,    
  } from 'apollo-cache-inmemory';
  import { ApolloClient, WatchQueryFetchPolicy } from '@apollo/client';
  import { BatchHttpLink } from 'apollo-link-batch-http';
  
  export const createApolloClient = (
    options: {
      backendUrl?: string;
      ssrMode?: boolean;
      serverState?: any;
      cookies?: any;
      fetch?: any;
      ssrForceFetchDelay?: number;
      fetchPolicy? : WatchQueryFetchPolicy;
    } = {
        backendUrl: '/',
      ssrMode: false,
      serverState: null,
      cookies: null,
      fetch: null,
      ssrForceFetchDelay: 0,
      fetchPolicy : 'cache-and-network'
    }
  ) => {
    const { backendUrl, ssrMode, serverState, cookies,ssrForceFetchDelay, fetchPolicy } = options;

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
      fetch: typeof fetch !== 'undefined' ? fetch : options.fetch      
    });
  
    const client = new ApolloClient({
      ssrForceFetchDelay: ssrForceFetchDelay,      
      ssrMode,
      link: link,
      cache: serverState != null ? cache.restore(serverState) : cache,
      defaultOptions: {
        watchQuery: {
          fetchPolicy: fetchPolicy || 'cache-and-network',
        },
      },
    });
  
    return client;
  };
  