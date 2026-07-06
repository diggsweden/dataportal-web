"use client";

import { createContext, type ReactNode, useContext } from "react";

import type { ResourceMap } from "./load-messages";

/**
 * The `resources` namespace is URI-keyed (`http://…`), which collides with
 * `next-intl`'s reserved characters (`.`, `:`, `/`). We can't ship it
 * through `NextIntlClientProvider.messages` without triggering
 * `INVALID_KEY`, so it lives in its own tiny context and is consumed via
 * `useResourceLabel` instead of `t()`.
 *
 * Mirrors the shape of `useTranslations()` — pure client-side lookup, no
 * fetching — and wraps the tree from `app/[locale]/layout.tsx`.
 */

const ResourcesContext = createContext<ResourceMap>({});

interface ResourcesProviderProps {
  resources: ResourceMap;
  children: ReactNode;
}

export function ResourcesProvider({
  resources,
  children,
}: ResourcesProviderProps) {
  return (
    <ResourcesContext.Provider value={resources}>
      {children}
    </ResourcesContext.Provider>
  );
}

export function useResourcesMap(): ResourceMap {
  return useContext(ResourcesContext);
}
