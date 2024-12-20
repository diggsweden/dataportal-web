import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
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
  const { query } = useRouter() || {};
  const { concept } = query || {};

  if (resourceUri) {
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

  const ids = (typeof concept === "string" && concept.split("_")) || [];
  const eid = ids.pop() || "";
  const cid = ids.join("_");

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      pageType="concept"
    >
      <ConceptPage />
    </EntrystoreProvider>
  );
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  return handleEntryStoreRedirect(context, {
    pathPrefix: "/concepts",
    redirectPath: "/concepts",
    entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
    paramName: "concept",
  });
};
