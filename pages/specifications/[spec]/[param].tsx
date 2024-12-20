import { GetStaticPaths, GetStaticPropsContext } from "next/types";
import { useContext } from "react";

import { SpecificationPage } from "@/features/entryscape/specification-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

interface SpecificationProps {
  resourceUri?: string;
}

export default function Specification({ resourceUri }: SpecificationProps) {
  const { env } = useContext(SettingsContext);

  if (!resourceUri) return null;

  return (
    <EntrystoreProvider
      env={env}
      rUri={resourceUri}
      entrystoreUrl={env.ENTRYSCAPE_SPECS_PATH}
      pageType="specification"
    >
      <SpecificationPage />
    </EntrystoreProvider>
  );
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return handleEntryStoreRedirect(context, {
    pathPrefix: "/specifications",
    redirectPath: "/specifications",
    entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
    paramName: "spec",
    secondParamName: "param",
  });
};

export const getStaticPaths: GetStaticPaths = async () => {
  const paths: string[] = [];

  return {
    paths,
    fallback: "blocking",
  };
};
