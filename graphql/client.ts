import { ApolloClient, InMemoryCache } from "@apollo/client";
import reactEnv from "@beam-australia/react-env";

export const browserclient = new ApolloClient({
  uri: reactEnv("APOLLO_URL") || "",
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
    },
  },
});

export const client = new ApolloClient({
  uri: process.env.APOLLO_URL || "",
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "no-cache",
    },
  },
});
