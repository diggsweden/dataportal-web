"use client";

import dynamic from "next/dynamic";
import { type FC, useContext } from "react";

import type { EnvSettings } from "@/env/env-settings";
import { ApiIndexContext } from "@/providers/api-index-context";

export interface ApiExplorerProps {
  env: EnvSettings;
  contextId: string;
  entryId: string;
}

export const ApiExplorer: FC<ApiExplorerProps> = (props) => {
  const SwaggerUI = dynamic(
    () =>
      import("swagger-ui-react").then(
        (c) => c.default,
        // biome-ignore lint/suspicious/noExplicitAny: <unknown type>
        (e) => e as any,
      ),
    { ssr: false },
  );

  const apiIndexContext = useContext(ApiIndexContext);

  const getAPiDetectionUrl = () => {
    const detection = apiIndexContext.findDetection(
      props.contextId,
      props.entryId,
    );

    if (detection?.apiDefinition) return detection.apiDefinition;

    return undefined;
  };

  return (
    <div lang="en">
      {apiIndexContext.findDetection(props.contextId, props.entryId) && (
        // @ts-expect-error not typable.
        <SwaggerUI url={getAPiDetectionUrl()} />
      )}
    </div>
  );
};
