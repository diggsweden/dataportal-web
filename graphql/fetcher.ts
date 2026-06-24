import reactEnv from "@beam-australia/react-env";
import type {
  DocumentNode,
  FieldNode,
  OperationDefinitionNode,
  SelectionSetNode,
} from "graphql/language/ast";
import { Kind } from "graphql/language/kinds";
import { print } from "graphql/language/printer";
import { visit } from "graphql/language/visitor";

/**
 * Auto-inject `__typename` into every selection set (except the root
 * operation). This replicates Apollo Client's default `addTypename: true`
 * behaviour, which the codebase still relies on for union / interface
 * discrimination at runtime (e.g. `item.__typename === "dataportal_Digg_Tool"`
 * in `components/grid-list`). Without it, those checks fall through to the
 * default branch and unrelated components receive the wrong shape.
 *
 * Cached per-document via a WeakMap — the same query is printed many times.
 */
const TYPENAME_FIELD: FieldNode = {
  kind: Kind.FIELD,
  name: { kind: Kind.NAME, value: "__typename" },
};
const typenameCache = new WeakMap<DocumentNode, DocumentNode>();

function addTypename(doc: DocumentNode): DocumentNode {
  const cached = typenameCache.get(doc);
  if (cached) return cached;

  const transformed = visit(doc, {
    SelectionSet: {
      enter(node: SelectionSetNode, _key, parent) {
        // Skip the root selection set of an operation; querying
        // `__typename` on Query/Mutation/Subscription is valid but noisy
        // and matches Apollo's built-in behaviour.
        if (
          parent &&
          !Array.isArray(parent) &&
          (parent as OperationDefinitionNode).kind === Kind.OPERATION_DEFINITION
        ) {
          return undefined;
        }
        const hasTypename = node.selections.some(
          (s) => s.kind === Kind.FIELD && s.name.value === "__typename",
        );
        if (hasTypename) return undefined;
        return { ...node, selections: [...node.selections, TYPENAME_FIELD] };
      },
    },
  }) as DocumentNode;

  typenameCache.set(doc, transformed);
  return transformed;
}

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
    body: JSON.stringify({ query: print(addTypename(document)), variables }),
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
