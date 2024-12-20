import { GetStaticPaths, GetStaticPropsContext } from "next/types";
import { useContext } from "react";

import { ConceptPage } from "@/features/entryscape/concept-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

interface TerminologyProps {
  resourceUri?: string;
}

export default function Terminology({ resourceUri }: TerminologyProps) {
  const { env } = useContext(SettingsContext);

  if (!resourceUri) return null;

  return (
    <EntrystoreProvider
      env={env}
      rUri={resourceUri}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      pageType="terminology"
    >
      <ConceptPage />
    </EntrystoreProvider>
  );
}

export const getStaticProps = async (context: GetStaticPropsContext) => {
  return handleEntryStoreRedirect(context, {
    pathPrefix: "/concepts",
    redirectPath: "/terminology",
    entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
    paramName: "term",
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
