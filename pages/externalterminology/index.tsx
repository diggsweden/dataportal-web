import { EntryStore, EntryStoreUtil } from "@entryscape/entrystore-js";
import { GetServerSideProps } from "next";

import { SettingsUtil } from "@/env";

export default function Terminology() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({
  query: { resource },
  locale,
}) => {
  const env = SettingsUtil.create();
  const resourceUri = decodeURIComponent(resource as string);

  try {
    const es = new EntryStore(
      `https://${env.ENTRYSCAPE_TERMS_PATH}/store` ||
        "https://admin.dataportal.se/store",
    );
    const esu = new EntryStoreUtil(es);

    const entry = await esu.getEntryByResourceURI(resourceUri);

    if (entry) {
      return {
        redirect: {
          destination: `/${locale}/terminology/${entry
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
