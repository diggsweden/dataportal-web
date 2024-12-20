import { NextRouter } from "next/router";

import { RedirectConfig } from "@/types/global";

interface EntryStoreResponse {
  resourceUri: string | null;
}
export async function getEntryStoreProps({
  config,
  locale,
  isSandbox = false,
  router,
  resourceUri,
  includeBasePath = true,
}: {
  config: RedirectConfig;
  locale: string;
  isSandbox: boolean;
  router: NextRouter;
  resourceUri?: string;
  includeBasePath?: boolean;
}): Promise<EntryStoreResponse | void> {
  try {
    const response = await fetch(
      `${includeBasePath ? process.env.HOST : ""}/api/entrystore-redirect`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          config,
          locale,
          resourceUri,
          isSandbox,
        }),
      },
    );

    const data = await response.json();

    if (data.redirect) {
      router.replace(data.redirect, undefined, {
        shallow: true,
      });
      return;
    }

    if (data.notFound) {
      router.replace("/404", undefined, {
        shallow: true,
      });
      return;
    }

    return {
      resourceUri: data.props.resourceUri || null,
    };
  } catch (error) {
    console.error("Error during static prop generation:", error);
    router.replace("/404", undefined, {
      shallow: true,
    });
    return;
  }
}
