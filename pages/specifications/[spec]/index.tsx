import { useRouter } from "next/router";
import { GetServerSidePropsContext } from "next/types";
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
  const { query } = useRouter() || {};
  const { spec } = query || {};

  if (resourceUri) {
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

  const ids = (typeof spec === "string" && spec.split("_")) || [];
  const eid = ids.pop() || "";
  const cid = ids.join("_");

  if (eid && cid) {
    return (
      <EntrystoreProvider
        env={env}
        cid={cid}
        eid={eid}
        entrystoreUrl={env.ENTRYSCAPE_SPECS_PATH}
        pageType="specification"
      >
        <SpecificationPage />
      </EntrystoreProvider>
    );
  }
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  return handleEntryStoreRedirect(context, {
    pathPrefix: "/specifications",
    redirectPath: "/specifications",
    entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
    paramName: "spec",
  });
};
