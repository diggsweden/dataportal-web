import { EntryStore, EntryStoreUtil } from "@entryscape/entrystore-js";
import { GetServerSideProps } from "next/types";

import { SettingsUtil } from "@/env";

export default function Concept() {
  return null;
}

export const getServerSideProps: GetServerSideProps = async ({
  params,
  locale,
}) => {
  const env = SettingsUtil.create();
  const concept = (params?.concept as string[]) || [];
  const scheme = concept[0];

  if (scheme != "http" && scheme != "https") {
    return {
      notFound: true,
    };
  }

  // Reconstruct the original URI and redirect to the new format
  const curi = concept.slice(1).join("/");
  const uri = `${scheme}://${curi}`;

  try {
    const es = new EntryStore(
      `https://${env.ENTRYSCAPE_TERMS_PATH}/store` ||
        "https://admin.dataportal.se/store",
    );
    const esu = new EntryStoreUtil(es);

    const entry = await esu.getEntryByResourceURI(uri);

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
