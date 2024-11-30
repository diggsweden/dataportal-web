import dynamic from "next/dynamic";
import React, { useContext } from "react";

import { EnvSettings } from "@/env/env-settings";
import { ApiIndexContext } from "@/providers/api-index-context";

export interface ApiExplorerProps {
  env: EnvSettings;
  contextId: string;
  entryId: string;
}

export const ApiExplorer: React.FC<ApiExplorerProps> = (props) => {
  const SwaggerUI = dynamic(
    () =>
      import("swagger-ui-react").then(
        (c) => c.default,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
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

    if (detection && detection.apiDefinition) return detection.apiDefinition;

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
