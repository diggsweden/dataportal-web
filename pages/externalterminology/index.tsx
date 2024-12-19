import { GetServerSidePropsContext } from "next/types";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Terminology() {
  return null;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  return handleEntryStoreRedirect(
    context,
    {
      pathPrefix: "/concepts",
      redirectPath: "/terminology",
      entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
    },
    context.query.resource as string,
  );
};
