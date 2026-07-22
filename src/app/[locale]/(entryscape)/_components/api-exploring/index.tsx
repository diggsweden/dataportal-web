"use client";

import "@/styles/entryscape-swagger.css";
import dynamic from "next/dynamic";
import { type ComponentProps, type ComponentType, useContext } from "react";

import type { EnvSettings } from "@/env/env-settings";
import { ApiIndexContext } from "@/providers/api-index-context";

type SwaggerUIProps = ComponentProps<typeof import("swagger-ui-react").default>;

export interface ApiExplorerProps {
  env: EnvSettings;
  contextId: string;
  entryId: string;
}

const SwaggerUI = dynamic(
  () =>
    import("swagger-ui-react").then(
      (mod) => mod.default as ComponentType<SwaggerUIProps>,
    ),
  { ssr: false },
);

export function ApiExplorer(props: ApiExplorerProps) {
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
}
