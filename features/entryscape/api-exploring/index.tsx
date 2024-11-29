import React, { useContext } from "react";
import { EnvSettings } from "@/env/EnvSettings";
import { ApiIndexContext } from "@/providers/api-index-context";
import dynamic from "next/dynamic";

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
        (e) => e as any,
      ),
    { ssr: false },
  );

  const apiIndexContext = useContext(ApiIndexContext);

  const getAPiDetectionUrl = () => {
    var detection = apiIndexContext.findDetection(
      props.contextId,
      props.entryId,
    );

    if (detection && detection.apiDefinition) return detection.apiDefinition;

    return undefined;
  };

  return (
    <div lang="en">
      {apiIndexContext.findDetection(props.contextId, props.entryId) && (
        // @ts-ignore
        <SwaggerUI url={getAPiDetectionUrl()} />
      )}
    </div>
  );
};
