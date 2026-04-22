"use client";

import { ApolloProvider as BaseApolloProvider } from "@apollo/client";
import { browserclient } from "@/graphql/client";

export function ApolloProvider({ children }: { children: React.ReactNode }) {
  return (
    <BaseApolloProvider client={browserclient}>
      {children}
    </BaseApolloProvider>
  );
}
