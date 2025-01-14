import { useRouter } from "next/router";
import { useEffect } from "react";

import { handleEntryStoreRedirect } from "@/utilities/entrystore/entrystore-redirect";

export default function Specification() {
  const router = useRouter();
  const { specification } = router.query;

  useEffect(() => {
    const fetchEntryStoreProps = async () => {
      if (!specification) return;
      const isSandbox = window.location.host.includes("sandbox");

      await handleEntryStoreRedirect(
        {
          pathPrefix: "/concepts",
          redirectPath: "/concepts",
          entrystorePathKey: "ENTRYSCAPE_SPECS_PATH",
          param: specification,
        },
        router,
        router.locale || "sv",
        isSandbox,
      );
    };

    fetchEntryStoreProps();
  }, [specification]);
  return null;
}
