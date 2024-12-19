import { GetServerSidePropsContext } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";

import { ConceptPage } from "@/features/entryscape/concept-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";
import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Terminology() {
  const { env } = useContext(SettingsContext);
  const { query } = useRouter() || {};
  const { term } = query || {};
  const ids = (typeof term === "string" && term.split("_")) || [];
  const eid = ids.pop() || "";
  const cid = ids.join("_");

  return (
    <EntrystoreProvider
      env={env}
      cid={cid}
      eid={eid}
      entrystoreUrl={env.ENTRYSCAPE_TERMS_PATH}
      pageType="terminology"
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
    redirectPath: "/terminology",
    entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
    paramName: "term",
  });
};
