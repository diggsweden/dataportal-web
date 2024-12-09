import { GetServerSidePropsContext } from "next/types";

import { handleEntryStoreRedirect } from "@/utilities/entryscape/entrystore-redirect";

export default function Concept() {
  return null;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  return handleEntryStoreRedirect(context, {
    pathPrefix: "/concepts",
    redirectPath: "/concepts",
    entrystorePathKey: "ENTRYSCAPE_TERMS_PATH",
    paramName: "concept",
    secondParamName: "param",
  });
};
