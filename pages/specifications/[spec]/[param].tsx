import { GetServerSidePropsContext } from "next/types";

import { handleEntryStoreRedirect } from "@/utilities/entryscape/entrystore-redirect";

export default function Specification() {
  return null;
}

export const getServerSideProps = async (
  context: GetServerSidePropsContext,
) => {
  return handleEntryStoreRedirect(context, {
    pathPrefix: "/specifications",
    redirectPath: "/specifications",
    entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
    paramName: "spec",
    secondParamName: "param",
  });
};
