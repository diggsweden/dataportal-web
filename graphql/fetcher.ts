import reactEnv from "@beam-australia/react-env";
import type { DocumentNode } from "graphql/language/ast";
import { print } from "graphql/language/printer";

export interface GqlFetchOptions {
  /**
   * Maps to `fetch(..., { next: { revalidate } })`. Pass `false` to opt out of
   * caching entirely (equivalent to `cache: "no-store"`). Omit to fall back to
   * the current default of "no-store" so behaviour matches Apollo's
   * `fetchPolicy: "no-cache"` until Phase 4 tags individual calls.
   */
  revalidate?: number | false;
  /** Maps to `fetch(..., { next: { tags } })`. Enables `revalidateTag()`. */
  tags?: string[];
  /** Override of `fetch(..., { cache })`. */
  cache?: RequestCache;
  signal?: AbortSignal;
  headers?: HeadersInit;
}

export class GqlError extends Error {
  readonly graphQLErrors?: unknown[];
  readonly status?: number;

  constructor(
    message: string,
    opts?: { graphQLErrors?: unknown[]; status?: number },
  ) {
    super(message);
    this.name = "GqlError";
    this.graphQLErrors = opts?.graphQLErrors;
    this.status = opts?.status;
  }
}

const getEndpoint = (): string => {
  const url =
    typeof window === "undefined"
      ? process.env.APOLLO_URL
      : reactEnv("APOLLO_URL");

  if (!url) {
    throw new GqlError("APOLLO_URL is not configured");
  }

  return url;
};

export const gqlFetch = async <TData, TVariables = Record<string, unknown>>(
  document: DocumentNode,
  variables?: TVariables,
  options: GqlFetchOptions = {},
): Promise<TData> => {
  const { revalidate, tags, cache, signal, headers } = options;

  const hasNextHint = revalidate !== undefined || (tags && tags.length > 0);

  const res = await fetch(getEndpoint(), {
    method: "POST",
    headers: {
      "content-type": "application/json",
      accept: "application/json",
      ...headers,
    },
    body: JSON.stringify({ query: print(document), variables }),
    signal,
    ...(hasNextHint
      ? {
          next: {
            ...(revalidate !== undefined ? { revalidate } : {}),
            ...(tags && tags.length > 0 ? { tags } : {}),
          },
        }
      : { cache: cache ?? "no-store" }),
    ...(cache && hasNextHint ? { cache } : {}),
  });

  if (!res.ok) {
    throw new GqlError(`GraphQL request failed with HTTP ${res.status}`, {
      status: res.status,
    });
  }

  const json = (await res.json()) as { data?: TData; errors?: unknown[] };

  if (json.errors && json.errors.length > 0) {
    throw new GqlError("GraphQL response contained errors", {
      graphQLErrors: json.errors,
    });
  }

  if (!json.data) {
    throw new GqlError("GraphQL response contained no data");
  }

  return json.data;
};

export const logGqlError = (error: unknown): void => {
  if (error instanceof GqlError) {
    if (error.graphQLErrors && error.graphQLErrors.length > 0) {
      console.error("graphqlError", error.graphQLErrors);
    }
    if (error.status !== undefined) {
      console.error("networkError", `HTTP ${error.status}`);
    }
    if (
      (!error.graphQLErrors || error.graphQLErrors.length === 0) &&
      error.status === undefined
    ) {
      console.error(error);
    }
    return;
  }
  console.error(error);
};
