import { EntryStore, EntryStoreUtil } from "@entryscape/entrystore-js";
import { GetServerSideProps } from "next";

import { SettingsUtil } from "@/env";

export default function Concept() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const env = SettingsUtil.create();
  const { concept, param } = params || {};
  const curi = `${concept}/${param}`;

  try {
    const es = new EntryStore(
      `https://${env.ENTRYSCAPE_TERMS_PATH}/store` ||
        "https://admin.dataportal.se/store",
    );
    const esu = new EntryStoreUtil(es);
    const entryUri = env.ENTRYSCAPE_TERMS_PATH.includes("sandbox")
      ? `https://www-sandbox.dataportal.se/concepts/${curi}`
      : `https://dataportal.se/concepts/${curi}`;

    const entry = await esu.getEntryByResourceURI(entryUri);

    if (entry) {
      return {
        redirect: {
          destination: `/${locale}/concepts/${entry
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
