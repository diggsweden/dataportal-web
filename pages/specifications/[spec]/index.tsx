import { EntryStore, EntryStoreUtil } from "@entryscape/entrystore-js";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { useContext } from "react";

import { SettingsUtil } from "@/env";
import { SpecificationPage } from "@/features/entryscape/specification-page";
import { EntrystoreProvider } from "@/providers/entrystore-provider";
import { SettingsContext } from "@/providers/settings-provider";

export default function Specification() {
  const { env } = useContext(SettingsContext);
  const { query } = useRouter() || {};
  const { spec } = query || {};
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

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const env = SettingsUtil.create();
  const { spec } = params || {};

  if (typeof spec === "string" && /\d/.test(spec) && spec.includes("_")) {
    return { props: {} };
  }

  try {
    const es = new EntryStore(
      `https://${env.ENTRYSCAPE_SPECS_PATH}/store` ||
        "https://admin.dataportal.se/store",
    );
    const esu = new EntryStoreUtil(es);
    const entryUri = env.ENTRYSCAPE_SPECS_PATH.includes("sandbox")
      ? `https://www-sandbox.dataportal.se/specifications/${spec}`
      : `https://dataportal.se/specifications/${spec}`;

    const entry = await esu.getEntryByResourceURI(entryUri);

    if (entry) {
      return {
        redirect: {
          destination: `/${locale}/specifications/${entry
            .getContext()
            .getId()}_${entry.getId()}`,
          permanent: true, // This creates a 301 redirect
        },
      };
    }
  } catch (error) {
    console.error("Error fetching entry:", error);
  }

  return {
    notFound: true,
  };
};
