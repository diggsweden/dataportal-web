"use client";

import { useCallback } from "react";

import { useResourcesMap } from "./resources-provider";
import type { ResourceLabel } from "./types";

/**
 * URI → human label lookup for the `resources` namespace.
 *
 * Reads from `ResourcesProvider` (see `resources-provider.tsx` for why
 * `resources` is delivered outside `NextIntlClientProvider.messages`) and
 * falls back to the URI itself when a label is missing, matching the
 * legacy `next-translate` behaviour where unknown keys rendered as-is.
 */
export function useResourceLabel(): ResourceLabel {
  const resources = useResourcesMap();
  return useCallback<ResourceLabel>(
    (uri) => resources[uri] ?? uri,
    [resources],
  );
}
