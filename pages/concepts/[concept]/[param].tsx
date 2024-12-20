import { GetStaticPaths, GetStaticPropsContext } from "next";
import { useContext } from "react";

import { ConceptPage } from "@/features/entryscape/concept-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

interface ConceptProps {
  resourceUri?: string;
}

export default function Concept({ resourceUri }: ConceptProps) {
  const { env } = useContext(SettingsContext);

  if (!resourceUri) return null;

  return (
    <EntrystoreProvider
      env={env}
      rUri={resourceUri}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      pageType="concept"
    >
      <ConceptPage />
    </EntrystoreProvider>
  );
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return handleEntryStoreRedirect(context, {
    pathPrefix: "/concepts",
    redirectPath: "/concepts",
    entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
    paramName: "concept",
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
