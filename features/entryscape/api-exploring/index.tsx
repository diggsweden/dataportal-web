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

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false });

export const ApiExplorer: FC<ApiExplorerProps> = (props) => {
  const apiIndexContext = useContext(ApiIndexContext);

  const detection = apiIndexContext.findDetection(
    props.contextId,
    props.entryId,
  );

  if (!detection?.apiDefinition) return null;

  return (
    <div lang="en">
      <SwaggerUI url={detection.apiDefinition} />
    </div>
  );
};
