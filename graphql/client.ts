import { ApolloClient, InMemoryCache } from "@apollo/client";
import reactEnv from "@beam-australia/react-env";
import { ApolloLink } from "@apollo/client/core";
import { createHttpLink } from "@apollo/client/link/http";
import loggerLink from "./loggerLink";

const httpLink = createHttpLink({
  uri: reactEnv("APOLLO_URL") || "",
});

const link = ApolloLink.from([loggerLink, httpLink]);

export const browserclient = new ApolloClient({
  uri: reactEnv("APOLLO_URL") || "",
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});

export const client = new ApolloClient({
  uri: process.env.APOLLO_URL || "",
  link,
  cache: new InMemoryCache(),
  defaultOptions: {
    watchQuery: {
      fetchPolicy: "cache-and-network",
    },
  },
});
